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


def _parse_concepts(text: str, fallback_title: str, fallback_body: str) -> List[Dict[str, str]]:
    concepts = []
    for block in text.split("==="):
        try:
            _, rest = block.split("제목:", 1)
            title_part, body_part = rest.split("설명:", 1)
            title = title_part.strip()
            body = body_part.strip()
            if title and body:
                concepts.append({"concept_title": title, "concept_body": body})
        except ValueError:
            continue
    return concepts or [{"concept_title": fallback_title, "concept_body": fallback_body}]


def generate_case_wrong_concepts(case: dict, wrong_texts: List[str]) -> List[Dict[str, str]]:
    """탐정 리포트: 학생이 이 사건에서 고른 오답 선택지들을 보고, 헷갈려한 개념을 짚어주는 설명 생성.
    오답이 서로 다른 개념을 다루면 여러 개로 나눠서 반환한다."""
    fallback_title = "틀린 개념 정리"
    fallback_body = "이번 사건에서 헷갈렸던 부분을 다시 한 번 짚어보면 좋아요!"

    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 AI 도우미다. "
        "학생이 이 사건을 풀면서 골랐던 오답 선택지들을 보고, 학생이 헷갈려한 기상·기후 개념이 "
        "무엇인지 짚어주는 리포트를 작성해라. 정답을 알려주는 게 아니라 이미 다 풀고 난 뒤의 "
        "복습이므로 올바른 개념을 직접 설명해도 된다. "
        "오답들이 서로 다른 개념에 관한 것이면 개념별로 나눠서 각각 작성하고, "
        "같은 개념이면 하나로 합쳐라. "
        "각 개념은 반드시 아래 두 줄 형식으로 작성하고, 개념이 여러 개면 그 사이를 '===' 한 줄로 구분해라 "
        "(그 외 다른 문장은 앞뒤에 붙이지 마라):\n"
        "제목: (헷갈린 개념을 8~15자 내외로 요약, 예: 남서풍과 수증기의 관계)\n"
        "설명: (왜 헷갈리기 쉬운지와 올바른 개념을 3~4문장으로 다정하고 쉽게 설명하고, "
        "마지막에 '개념A → 개념B → 개념C' 처럼 인과관계를 화살표로 요약한 문장을 덧붙여라.)"
    )
    user_prompt = f"""사건: {case.get('title')} ({case.get('period')})
사건 설명: {case.get('description')}

학생이 골랐던 오답 선택지들:
{chr(10).join(f'- {t}' for t in wrong_texts)}
"""
    fallback = f"제목: {fallback_title}\n설명: {fallback_body}"
    text = _chat(system_prompt, user_prompt, fallback, max_tokens=600)
    return _parse_concepts(text, fallback_title, fallback_body)


def generate_overall_report(case_summaries: List[Dict], retry_count_total: int) -> str:
    """탐정 리포트 마지막 페이지: 3개 사건을 종합한 맞춤형 총평 생성."""
    fallback = (
        "탐정님은 모든 사건을 잘 해결했어요! 앞으로도 꾸준히 관찰하고 추리하는 습관을 길러보세요."
    )
    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 AI 도우미다. 학생이 3개의 사건을 모두 "
        "해결하는 과정에서 어떤 문제를 자주 틀렸는지 종합해서, 학생에게 맞춤형 총평을 4~6문장으로 "
        "다정하게 한국어로 작성해라. 어떤 개념을 유독 헷갈려했는지, 앞으로 어떤 부분을 더 살펴보면 "
        "좋을지 구체적으로 짚어주고, 잘한 점에 대한 칭찬도 함께 담아라."
    )
    lines = []
    for c in case_summaries:
        if c["is_perfect"]:
            lines.append(f"- {c['title']}: 오답 없이 한 번에 해결")
        else:
            lines.append(f"- {c['title']}: 골랐던 오답 - {', '.join(c['wrong_texts'])}")
    user_prompt = f"""다시 추리한 총 횟수: {retry_count_total}회

사건별 결과:
{chr(10).join(lines)}
"""
    return _chat(system_prompt, user_prompt, fallback, max_tokens=500)


# 사건별 "핵심 원인" 설명 — AI가 오늘 날씨와 비교할 때 기준으로 삼는 문구.
_CLIMATE_CAUSE_BY_CASE = {
    "2020_jangma": "아시아 여름 몬순 (지속적인 남서풍 + 높은 습도로 수증기가 계속 공급된 것)",
    "2018_heatwave": "북태평양 고기압 강화 (평년보다 강하게 발달한 고기압으로 맑은 날이 이어지고 일조시간이 늘어 열이 축적된 것)",
    "2022_flood": "태풍 힌남노 (따뜻한 해역에서 지속적으로 열과 수증기를 공급받아 강한 세력을 유지한 것)",
}


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
    cause = _CLIMATE_CAUSE_BY_CASE.get(case.get("case_id"), "이 사건의 핵심 기후 패턴")

    system_prompt = (
        "너는 초등학생을 대상으로 한 기후 탐정 게임의 친절한 기상 캐스터다. "
        f"이 사건의 핵심 원인은 {cause}이다. 오늘 관측된 기온/습도/풍향/강수량 데이터 중 "
        "이 원인과 관련 있는 값들을 근거로, 오늘 날씨가 사건 당시 패턴과 얼마나 비슷한지 "
        "판단해서 설명해라. 관련 없는 값은 참고만 하고 주된 판단 기준으로 삼지 마라. "
        "5~6문장으로 좀 더 자세하게, 쉽고 재미있게 설명해라. "
        "반드시 100% 한국어로만 작성하고, 영어 단어나 문장은 절대 섞지 마라. 이모지는 어울리게 적절히 써도 좋다."
    )
    user_prompt = f"""사건: {case.get('title')} ({case.get('period')})
사건 당시 기후 패턴(단계): {stage_labels}
사건 설명: {case.get('description')}
사건의 핵심 원인: {cause}

사용자 위치: {location_name}
오늘 관측된 날씨 데이터: {weather}

사건 당시 기후와 오늘 {location_name}의 날씨를 비교해서 설명해줘.
"""
    return _chat(system_prompt, user_prompt, fallback, max_tokens=600)
