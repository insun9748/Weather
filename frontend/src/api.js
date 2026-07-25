const API_BASE = 'http://localhost:8000'

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
