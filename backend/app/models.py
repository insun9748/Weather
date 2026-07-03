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


class CheckResult(BaseModel):
    is_correct: bool
    failed_stage: Optional[int] = None
    failed_stage_label: Optional[str] = None
    message: str
