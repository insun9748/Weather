import json
from pathlib import Path
from typing import Dict, List

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    CaseSummary,
    CaseDetail,
    EvidenceOut,
    LogSubmission,
    CheckSubmission,
    CheckResult,
    BoardCheckIn,
    ClimateCompareIn,
    ClimateCompareOut,
    NicknameIn,
    UserOut,
    ProgressOut,
)
from app import db, ai, weather

app = FastAPI(title="기후 탐정: 장마 사건 파일 API")

# 프론트엔드 개발 중에는 모든 origin 허용. 배포 전에는 실제 프론트 주소로 좁힐 것.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"

# 사건 데이터는 자주 안 바뀌므로 서버 시작 시 메모리에 로드해서 계속 재사용.
_cases: Dict[str, dict] = {}
# 로그/진행상태는 app/db.py의 SQLite로 영속 저장 (재시작해도 안 날아감).


def _load_cases():
    for file in DATA_DIR.glob("case_*.json"):
        with open(file, encoding="utf-8") as f:
            case = json.load(f)
            _cases[case["case_id"]] = case


@app.on_event("startup")
def startup_event():
    _load_cases()
    db.init_db()


@app.post("/users", response_model=UserOut)
def register_nickname(payload: NicknameIn):
    """닉네임만으로 유저 식별. 별도 비밀번호/로그인 없음 (초등 대상 MVP).
    프론트는 여기서 받은 user_id를 로컬에 저장해두고, 이후 모든 요청에 같이 실어보내면 됨.
    """
    nickname = payload.nickname.strip()
    if not nickname:
        raise HTTPException(status_code=400, detail="닉네임을 입력해주세요")
    user_id = db.create_or_get_user(nickname)
    return UserOut(user_id=user_id, nickname=nickname)


@app.get("/users/{user_id}/progress", response_model=List[ProgressOut])
def get_user_progress(user_id: str):
    """해당 유저가 어떤 사건을 풀었는지 전체 조회 (마이페이지/사건 목록에 표시용)"""
    rows = db.get_progress(user_id)
    return [
        ProgressOut(
            case_id=r["case_id"],
            is_solved=bool(r["is_solved"]),
            grade=r["grade"],
            solved_at=r["solved_at"],
        )
        for r in rows
    ]


@app.get("/cases", response_model=List[CaseSummary])
def list_cases():
    """사건 목록 조회"""
    return [
        CaseSummary(
            case_id=c["case_id"],
            title=c["title"],
            period=c["period"],
            region=c.get("region"),
        )
        for c in _cases.values()
    ]


@app.get("/cases/{case_id}", response_model=CaseDetail)
def get_case(case_id: str):
    """사건 상세 + 증거 목록 조회"""
    case = _cases.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="사건을 찾을 수 없습니다")

    evidence = [EvidenceOut(**e) for e in case.get("evidence", [])]
    return CaseDetail(
        case_id=case["case_id"],
        title=case["title"],
        period=case["period"],
        region=case.get("region"),
        description=case.get("description"),
        evidence=evidence,
    )


@app.post("/cases/{case_id}/logs")
def save_logs(case_id: str, submission: LogSubmission):
    """사용자의 클릭/연결 행동 로그 저장 (탐정 등급 리포트용 원본 데이터). SQLite에 영속 저장됨."""
    if case_id not in _cases:
        raise HTTPException(status_code=404, detail="사건을 찾을 수 없습니다")

    total = db.save_logs(
        case_id=case_id,
        user_id=submission.user_id,
        logs=[log.model_dump() for log in submission.logs],
    )
    return {"saved": True, "total_logs": total}


@app.get("/cases/{case_id}/logs/{user_id}")
def get_logs(case_id: str, user_id: str):
    """저장된 로그 조회 (AI 리포트 생성 시 이 데이터를 프롬프트에 넣어 사용)"""
    return {"logs": db.get_logs(case_id, user_id)}


@app.post("/cases/{case_id}/check", response_model=CheckResult)
def check_causal_chain(case_id: str, submission: CheckSubmission):
    """
    사용자가 연결한 인과관계 순서가 정답인지 확인.

    causal_stages는 순서가 있는 단계 리스트이고, 각 단계 안의 required_evidence는
    "이 단계에서 반드시 다 모여야 하는 증거들" (AND 조건, 단계 내 순서는 무관).
    2022년 사건처럼 "수증기유입 + 정체전선형성"이 동시에 필요한 경우를 표현하기 위함.
    """
    case = _cases.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="사건을 찾을 수 없습니다")

    stages = case.get("causal_stages", [])
    user_order = submission.ordered_evidence_ids

    idx = 0
    for stage in stages:
        needed = set(stage["required_evidence"])
        collected = set()

        while needed - collected:
            if idx >= len(user_order):
                message = f"{stage.get('label', stage['stage'])} 단계에 필요한 증거가 부족합니다."
                return CheckResult(
                    is_correct=False,
                    failed_stage=stage["stage"],
                    failed_stage_label=stage.get("label"),
                    message=message,
                    ai_explanation=ai.generate_wrong_answer_explanation(
                        case, user_order, stage, message
                    ),
                )
            picked = user_order[idx]
            idx += 1
            if picked not in needed:
                # 이 단계에서 필요 없는 증거를 연결함 = 오답
                message = f"'{picked}' 증거는 이 단계와 관련이 없습니다."
                return CheckResult(
                    is_correct=False,
                    failed_stage=stage["stage"],
                    failed_stage_label=stage.get("label"),
                    message=message,
                    ai_explanation=ai.generate_wrong_answer_explanation(
                        case, user_order, stage, message
                    ),
                )
            collected.add(picked)

    # 모든 단계를 통과 = 정답. 진행 상태를 DB에 저장 (등급은 아직 없음 — AI 리포트 기능에서 채워질 값)
    db.save_progress(case_id=case_id, user_id=submission.user_id, is_solved=True)

    return CheckResult(
        is_correct=True,
        message="모든 인과관계를 올바르게 연결했습니다. 사건 해결!",
    )


# 사건별 수사보드 정답. 프론트는 이 매핑을 모르는 상태로 제출만 함.
# 2018/2022 사건의 수사보드를 추가할 때는 여기에 한 줄씩 추가하면 된다.
BOARD_ANSWERS = {
    "2020_jangma": {"box1": "evi2", "box2": "evi3", "box3": "evi1"},
    "2018_heatwave": {"box1": "evi2", "box2": "evi1", "box3": "evi3"},
    "2022_flood": {"box1": "evi1", "box2": "evi2", "box3": "evi3"},
}


@app.post("/cases/{case_id}/board-check", response_model=CheckResult)
def check_board(case_id: str, submission: BoardCheckIn):
    """수사보드에서 학생이 각 칸(box1~3)에 어떤 증거 칩(evi1~3)을 놓았는지 확인."""
    case = _cases.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="사건을 찾을 수 없습니다")

    BOARD_ANSWER = BOARD_ANSWERS.get(case_id)
    if not BOARD_ANSWER:
        raise HTTPException(status_code=404, detail="이 사건의 수사보드는 아직 준비되지 않았습니다")

    placement = {
        "box1": submission.box1,
        "box2": submission.box2,
        "box3": submission.box3,
    }

    if placement == BOARD_ANSWER:
        db.save_progress(case_id=case_id, user_id=submission.user_id, is_solved=True)
        return CheckResult(
            is_correct=True,
            message="모든 인과관계를 올바르게 연결했습니다. 사건 해결!",
        )

    wrong_boxes = [
        box_id for box_id, correct_evi in BOARD_ANSWER.items()
        if placement.get(box_id) != correct_evi
    ]

    # 오답 시도를 전부 로그로 남겨서, 나중에 탐정 등급 리포트 만들 때 활용
    db.save_logs(
        case_id=case_id,
        user_id=submission.user_id,
        logs=[{
            "action": "board_wrong_attempt",
            "evidence_id": json.dumps({"placement": placement, "wrong_boxes": wrong_boxes}, ensure_ascii=False),
            "timestamp": None,
        }],
    )

    return CheckResult(
        is_correct=False,
        message="수사보드의 연결이 아직 정확하지 않습니다.",
        ai_explanation=ai.generate_board_explanation(case, placement, BOARD_ANSWER),
        wrong_boxes=wrong_boxes,
    )


@app.post("/cases/{case_id}/climate-compare", response_model=ClimateCompareOut)
def compare_climate(case_id: str, payload: ClimateCompareIn):
    """
    프론트가 브라우저 위치(위경도)만 보내면, 서버가 가장 가까운 기상청 관측소를 찾아
    '오늘' 실측 날씨를 가져오고, 사건 당시의 기후 패턴과 비교하는 설명을 AI로 생성해서 돌려준다.
    """
    case = _cases.get(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="사건을 찾을 수 없습니다")

    station = weather.find_nearest_station(payload.latitude, payload.longitude)
    weather_data = weather.fetch_kma_weather(station["id"])
    if weather_data is None:
        raise HTTPException(status_code=502, detail="오늘 날씨 정보를 가져오지 못했습니다")

    comparison_text = ai.generate_climate_comparison(
        case=case,
        location_name=station["name"],
        weather=weather_data,
    )
    if case_id == "2018_heatwave":
        similarity = weather.classify_heatwave_similarity(
            temperature=weather_data["temperature"],
            precipitation=weather_data["precipitation"],
        )
    elif case_id == "2022_flood":
        similarity = weather.classify_flood_similarity(temperature=weather_data["temperature"])
    else:
        similarity = weather.classify_monsoon_similarity(
            humidity=weather_data["humidity"],
            wind_direction=weather_data["wind_direction"],
            wind_speed=weather_data["wind_speed"],
        )
    return ClimateCompareOut(
        location_name=station["name"],
        temperature=weather_data["temperature"],
        humidity=weather_data["humidity"],
        precipitation=weather_data["precipitation"],
        wind_direction=weather_data["wind_direction"],
        comparison_text=comparison_text,
        **similarity,
    )


@app.get("/health")
def health():
    return {"status": "ok", "cases_loaded": len(_cases)}
