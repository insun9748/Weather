"""OpenAI 호출 모듈.

- 오답 시 "왜 틀렸는지" 설명 생성
- 오늘 날씨와 사건 당시 기후 패턴을 비교하는 설명 생성

API 키가 없거나 호출이 실패해도 서버가 죽지 않도록 항상 예외를 잡아서
대체 문구를 돌려준다 (개발 중 키를 아직 안 넣었을 때도 앱이 정상 동작해야 함).
"""

import os
from typing import Dict, List, Optional

from openai import OpenAI

MODEL = "gpt-4o-mini"

_client: Optional[OpenAI] = None


def _get_client() -> Optional[OpenAI]:
    global _client
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key or "여기에" in api_key:
        return None
    if _client is None:
        _client = OpenAI(api_key=api_key)
    return _client


def _chat(system_prompt: str, user_prompt: str, fallback: str, max_tokens: int = 400) -> str:
    try:
        client = _get_client()
        if client is None:
            return fallback
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        text = response.choices[0].message.content
        return text.strip() if text else fallback
    except Exception:
        # 키가 잘못됐거나, 크레딧이 없거나, 네트워크 문제 등 — 어떤 이유든 규칙 기반 문구로 대체
        return fallback


def generate_wrong_answer_explanation(
    case: dict,
    user_order: List[str],
    failed_stage: Optional[Dict],
    fallback_message: str,
) -> str:
    """수사보드에서 인과관계 순서를 틀렸을 때, 왜 틀렸는지 초등학생도 이해할 수 있게 설명."""
    stage_labels = [s.get("label") for s in case.get("causal_stages", [])]
    evidence_by_id = {e["evidence_id"]: e for e in case.get("evidence", [])}
    user_order_labels = [
        evidence_by_id.get(eid, {}).get("type", eid) for eid in user_order
    ]

    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 친절한 도우미다. "
        "학생이 사건의 인과관계를 잘못된 순서로 연결했을 때, "
        "왜 그 순서가 틀렸는지 2~3문장으로 쉽고 다정하게 한국어로 설명해라. "
        "정답을 그대로 알려주지 말고, 어떤 부분을 다시 생각해보면 좋을지 힌트를 주는 방식으로 설명해라."
    )
    user_prompt = f"""사건: {case.get('title')}
사건 설명: {case.get('description')}

실제 정답 순서(단계별): {stage_labels}
학생이 제출한 순서(증거 종류): {user_order_labels}
학생이 걸린 단계: {failed_stage.get('label') if failed_stage else '없음'}
규칙 기반 채점 메시지: {fallback_message}

위 정보를 참고해서 학생에게 오답 이유를 설명해줘.
"""
    return _chat(system_prompt, user_prompt, fallback_message)


BOARD_CHIP_TEXT = {
    "evi1": "비구름대 반복 형성",
    "evi2": "수증기 증가",
    "evi3": "한반도로의 수증기 유입 증가",
}
BOARD_CARD_TEXT = {
    "box1": "해수면 온도 상승",
    "box2": "지속적인 남서풍",
    "box3": "장기간 장마",
}


def generate_board_explanation(
    case: dict,
    placement: Dict[str, Optional[str]],
    answer: Dict[str, str],
) -> str:
    """수사보드에서 학생이 잘못 배치했을 때, 왜 이 배치가 어색한지 설명."""
    fallback = "지금 배치는 인과관계 순서가 맞지 않아요. 각 카드가 어떤 결과로 이어지는지 다시 생각해보세요."

    def describe(mapping: Dict[str, Optional[str]]) -> str:
        lines = []
        for box_id, card_label in BOARD_CARD_TEXT.items():
            ev_id = mapping.get(box_id)
            chip_label = BOARD_CHIP_TEXT.get(ev_id, "(빈칸)") if ev_id else "(빈칸)"
            lines.append(f"{card_label} → {chip_label}")
        return "\n".join(lines)

    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 캐릭터 '기상이'다. "
        "셜록 홈즈 같은 탐정이 추리하듯, 문장을 '~하군', '~인 것 같네', '~해보지 않겠나?', "
        "'~하지 않았을까?' 같은 말투로 끝내라 (예: '흐음, 이 부분이 어색하군.', "
        "'다시 한 번 짚어보지 않겠나?'). 반말이나 '~해요', '~예요' 말투는 쓰지 마라. "
        "학생이 수사보드에서 원인-결과 카드에 알맞은 설명 칩을 잘못 배치했다. "
        "정답을 그대로 말하지 말고, 왜 지금 배치가 어색한지 2~3문장으로 다정하게 한국어로 설명해라."
    )
    user_prompt = f"""사건: {case.get('title')}

학생이 배치한 상태:
{describe(placement)}

올바른 배치(참고용, 그대로 알려주지 말 것):
{describe(answer)}

학생에게 지금 배치가 왜 어색한지 힌트만 줘.
"""
    return _chat(system_prompt, user_prompt, fallback)


def generate_climate_comparison(
    case: dict,
    location_name: str,
    weather: Dict,
) -> str:
    """사용자의 현재 위치 오늘 날씨와, 사건 당시의 기후 패턴을 비교하는 설명 생성."""
    stage_labels = [s.get("label") for s in case.get("causal_stages", [])]
    fallback = (
        f"{location_name}의 오늘 날씨 정보를 가져왔지만, AI 비교 설명은 지금 준비 중입니다. "
        "(OpenAI API 키를 설정하면 이 부분에 AI가 생성한 비교 설명이 표시됩니다)"
    )

    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 친절한 기상 캐스터다. "
        "2020년 사건의 핵심 원인은 아시아 여름 몬순(장기간 남서풍 + 높은 습도로 수증기가 "
        "계속 공급된 것)이다. 오늘 날씨가 이 몬순 패턴과 '습도'와 '풍향' 두 가지 기준으로 "
        "얼마나 비슷한지를 중심으로 판단해라: 풍향이 남서~서남서 계열이고 습도가 높을수록 "
        "몬순과 비슷하고, 그렇지 않으면(예: 풍향이 다르거나 습도가 낮으면) 다르다고 설명해라. "
        "기온이나 강수량은 참고만 하고 주된 판단 기준으로 삼지 마라. "
        "5~6문장으로 좀 더 자세하게, 쉽고 재미있게 설명해라. "
        "반드시 100% 한국어로만 작성하고, 영어 단어나 문장은 절대 섞지 마라. 이모지는 어울리게 적절히 써도 좋다."
    )
    user_prompt = f"""사건: {case.get('title')} ({case.get('period')})
사건 당시 기후 패턴(단계): {stage_labels}
사건 설명: {case.get('description')}
사건의 핵심 원인: 아시아 여름 몬순 (지속적인 남서풍 + 높은 습도)

사용자 위치: {location_name}
오늘 관측된 날씨 데이터(습도 humidity %, 풍향 wind_direction 확인): {weather}

사건 당시 기후와 오늘 {location_name}의 날씨를 비교해서 설명해줘.
"""
    return _chat(system_prompt, user_prompt, fallback, max_tokens=600)
