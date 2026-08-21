export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export function registerUser(nickname) {
  return fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  })
}

export function sendLog(caseId, userId, action, evidenceId) {
  if (!userId) return
  fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      logs: [{ action, evidence_id: evidenceId, timestamp: new Date().toISOString() }],
    }),
  }).catch(() => {})
}

export async function fetchCompletedSites(caseId, userId) {
  if (!userId) return []
  try {
    const res = await fetch(
      `${API_BASE}/cases/${encodeURIComponent(caseId)}/logs/${encodeURIComponent(userId)}`,
    )
    if (!res.ok) return []
    const { logs } = await res.json()
    return logs.filter((log) => log.action === 'site_complete').map((log) => log.evidence_id)
  } catch {
    return []
  }
}

export async function fetchUserProgress(userId) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`)
  if (!res.ok) throw new Error('진행상황을 불러오지 못했습니다')
  return res.json()
}

export async function fetchDetectiveReport(userId) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/detective-report`)
  if (!res.ok) throw new Error('탐정 리포트를 불러오지 못했습니다')
  return res.json()
}

export async function fetchCase(caseId) {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}`)
  if (!res.ok) throw new Error('사건 정보를 불러오지 못했습니다')
  return res.json()
}

export async function checkCausalChain(caseId, userId, orderedEvidenceIds) {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ordered_evidence_ids: orderedEvidenceIds }),
  })
  if (!res.ok) throw new Error('채점 요청에 실패했습니다')
  return res.json()
}

export async function checkBoard(caseId, userId, placement) {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/board-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ...placement }),
  })
  if (!res.ok) throw new Error('채점 요청에 실패했습니다')
  return res.json()
}

export function solveCase(caseId, userId) {
  if (!userId) return
  fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  }).catch(() => {})
}

export async function compareClimate(caseId, payload) {
  const res = await fetch(`${API_BASE}/cases/${encodeURIComponent(caseId)}/climate-compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('기후 비교 요청에 실패했습니다')
  return res.json()
}
