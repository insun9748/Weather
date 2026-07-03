import { useState } from 'react'
import doorBoard from './assets/home.png'
import mascot from './assets/gisang_home.png'
import './Stage.css'
import './HomeScreen.css'

const API_BASE = 'http://localhost:8000'

function HomeScreen({ onRegistered }) {
  const [nickname, setNickname] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  const canSubmit = nickname.trim().length > 0 && status !== 'loading'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return

    setStatus('loading')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || '등록에 실패했습니다')
      }
      const user = await res.json()
      localStorage.setItem('userId', user.user_id)
      localStorage.setItem('nickname', user.nickname)
      setStatus('idle')
      onRegistered(user)
    } catch (err) {
      setStatus('error')
      setError(err.message || '사무소 문을 여는 데 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${doorBoard})` }}>
        <div className="rule rule-top" />
        <div className="rule rule-bottom" />
        <div className="rule rule-small" />

        <span className="stamp">조수 구함</span>
        <img className="mascot" src={mascot} alt="탐정 마스코트" />

        <h1 className="title">기후 탐정: 기후미제 사건 해결</h1>

        <form onSubmit={handleSubmit}>
          <label className="nickname-label" htmlFor="nickname">
            닉네임을 입력해 주세요
          </label>
          <input
            id="nickname"
            className="nickname-input"
            type="text"
            value={nickname}
            maxLength={12}
            onChange={(event) => setNickname(event.target.value)}
            autoComplete="off"
          />

          {status === 'error' && <p className="error-text">{error}</p>}

          <button className="start-button" type="submit" disabled={!canSubmit}>
            {status === 'loading' ? '문을 여는 중...' : '수사하러 가기'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default HomeScreen
