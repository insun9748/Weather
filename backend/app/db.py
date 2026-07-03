import sqlite3
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime, timezone

DB_PATH = Path(__file__).parent / "data" / "app.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """서버 시작 시 한 번 호출. 테이블이 없으면 생성한다."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            nickname TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            action TEXT NOT NULL,
            evidence_id TEXT NOT NULL,
            timestamp TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            case_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            is_solved INTEGER NOT NULL DEFAULT 0,
            grade TEXT,
            solved_at TEXT,
            PRIMARY KEY (case_id, user_id)
        )
    """)

    conn.commit()
    conn.close()


def create_or_get_user(nickname: str) -> str:
    """닉네임을 user_id로 그대로 사용한다.
    이미 같은 닉네임이 있으면 그대로 재사용하고(중복 체크 없음 — 초등 대상 MVP 수준에서는 충분),
    없으면 새로 만든다.
    """
    user_id = nickname.strip()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR IGNORE INTO users (user_id, nickname, created_at) VALUES (?, ?, ?)",
        (user_id, nickname, datetime.now(timezone.utc).isoformat()),
    )
    conn.commit()
    conn.close()
    return user_id


def save_logs(case_id: str, user_id: str, logs: List[Dict]) -> int:
    """로그 여러 개를 한 번에 저장하고, 저장 후 해당 사건-유저의 총 로그 개수를 반환한다."""
    conn = get_connection()
    cur = conn.cursor()
    for log in logs:
        cur.execute(
            "INSERT INTO logs (case_id, user_id, action, evidence_id, timestamp) VALUES (?, ?, ?, ?, ?)",
            (case_id, user_id, log["action"], log["evidence_id"], log.get("timestamp")),
        )
    conn.commit()

    cur.execute(
        "SELECT COUNT(*) as cnt FROM logs WHERE case_id = ? AND user_id = ?",
        (case_id, user_id),
    )
    total = cur.fetchone()["cnt"]
    conn.close()
    return total


def get_logs(case_id: str, user_id: str) -> List[Dict]:
    """저장된 순서 그대로 로그를 반환한다 (AI 리포트 프롬프트에 그대로 넣을 용도)."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT action, evidence_id, timestamp FROM logs WHERE case_id = ? AND user_id = ? ORDER BY id ASC",
        (case_id, user_id),
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def save_progress(case_id: str, user_id: str, is_solved: bool, grade: Optional[str] = None):
    """사건 해결 여부(및 등급, 나중에 AI 리포트에서 채워질 값)를 저장한다.
    같은 case_id+user_id면 덮어쓴다 (재도전 시 최신 결과로 갱신).
    """
    conn = get_connection()
    cur = conn.cursor()
    solved_at = datetime.now(timezone.utc).isoformat() if is_solved else None
    cur.execute(
        """
        INSERT INTO progress (case_id, user_id, is_solved, grade, solved_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(case_id, user_id) DO UPDATE SET
            is_solved = excluded.is_solved,
            grade = excluded.grade,
            solved_at = excluded.solved_at
        """,
        (case_id, user_id, int(is_solved), grade, solved_at),
    )
    conn.commit()
    conn.close()


def get_progress(user_id: str) -> List[Dict]:
    """해당 유저의 사건별 진행 상태 전체를 반환한다."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT case_id, is_solved, grade, solved_at FROM progress WHERE user_id = ?",
        (user_id,),
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows
