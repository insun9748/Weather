from pydantic import BaseModel
from typing import List, Optional, Any


class EvidenceOut(BaseModel):
    evidence_id: str
    type: str
    location: Optional[str] = None
    value: Any = None
    unit: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    note: Optional[str] = None


class CaseSummary(BaseModel):
    case_id: str
    title: str
    period: str
    region: Optional[str] = None


class CaseDetail(CaseSummary):
    description: Optional[str] = None
    evidence: List[EvidenceOut] = []


class NicknameIn(BaseModel):
    nickname: str


class UserOut(BaseModel):
    user_id: str
    nickname: str


class ProgressOut(BaseModel):
    case_id: str
    is_solved: bool
    grade: Optional[str] = None
    solved_at: Optional[str] = None


class LogEntry(BaseModel):
    """사용자의 클릭/연결 행동 하나를 기록하는 단위.
    action: "click_evidence" | "connect" 등
    evidence_id: 클릭하거나 연결에 사용한 증거 ID
    timestamp: 프론트에서 보내는 ISO 8601 문자열 (선택)
    """
    action: str
    evidence_id: str
    timestamp: Optional[str] = None


class LogSubmission(BaseModel):
    user_id: str  # 익명 세션 ID 등, 인증 붙이기 전까지는 프론트에서 생성한 임의 ID 사용 가능
    logs: List[LogEntry]


class CheckSubmission(BaseModel):
    user_id: str
    # 사용자가 실제로 연결한 증거 ID들을, 연결한 "순서" 그대로 담은 리스트
    ordered_evidence_ids: List[str]


class BoardCheckIn(BaseModel):
    """수사보드(board1.png)에서 학생이 각 번호 칸에 무엇을 끌어다 놓았는지.
    빈 칸은 None."""
    user_id: str
    box1: Optional[str] = None
    box2: Optional[str] = None
    box3: Optional[str] = None


class CheckResult(BaseModel):
    is_correct: bool
    failed_stage: Optional[int] = None
    failed_stage_label: Optional[str] = None
    message: str
    ai_explanation: Optional[str] = None  # 오답일 때만 AI가 생성한 설명이 채워짐
    wrong_boxes: List[str] = []  # 수사보드에서 잘못 놓인 칸 id들 (정답 자체는 알려주지 않음)


class RemainingCaseOut(BaseModel):
    case_id: str
    year: int
    title: str


class ConceptOut(BaseModel):
    concept_title: str
    concept_body: str


class CaseReportOut(BaseModel):
    case_id: str
    year: int
    is_perfect: bool
    concepts: List[ConceptOut] = []


class DetectiveReportOut(BaseModel):
    all_solved: bool
    remaining_cases: List[RemainingCaseOut] = []
    retry_count_total: Optional[int] = None
    cases: List[CaseReportOut] = []
    overall_summary: Optional[str] = None


class ClimateCompareIn(BaseModel):
    """프론트는 브라우저 위치(navigator.geolocation)로 얻은 위경도만 보낸다.
    관측소 찾기 + 기상청 API 호출은 서버에서 처리 (인증키를 프론트에 노출하지 않기 위함)."""
    latitude: float
    longitude: float


class ClimateCompareOut(BaseModel):
    location_name: str  # 가장 가까운 기상 관측소 이름 (예: "서울")
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    precipitation: Optional[float] = None
    wind_direction: Optional[str] = None  # 예: "남서" — 몬순(남서풍) 여부 비교에 사용
    comparison_text: str
    metric1_label: str  # 사건별 첫번째 비교 기준 (2020: 습도 "높음"/"낮음", 2018: 기온 "높음"/"낮음")
    metric2_label: str  # 사건별 두번째 비교 기준 (2020: 풍향 "남서풍 (강함)", 2018: 일조량 "높음"/"낮음")
    is_similar: bool  # 오늘이 사건 당시 기후 패턴과 비슷한지
