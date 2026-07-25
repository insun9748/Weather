import { useState } from 'react'
import { API_BASE } from './api'
import doorBoard from './assets/home.png'
import mascot from './assets/gisang_home.png'
import stamp from './assets/support.png'
import './Stage.css'
import './HomeScreen.css'

const MAX_LENGTH = 10

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
        <img className="mascot" src={mascot} alt="탐정 마스코트" />
        <img className="stamp" src={stamp} alt="조수 구함" />

        <h1 className="title">기후 탐정</h1>
        <p className="subtitle">★ 기후 미제 사건 해결 ★</p>
        <div className="rule" />
        <p className="tagline">당신만의 탐정 이름으로 사건을 해결해보세요.</p>

        <form onSubmit={handleSubmit}>
          <label className="nickname-label" htmlFor="nickname">
            탐정 이름
          </label>
          <div className="nickname-input-wrap">
            <input
              id="nickname"
              className="nickname-input"
              type="text"
              value={nickname}
              maxLength={MAX_LENGTH}
              placeholder="탐정 이름 입력"
              onChange={(event) => setNickname(event.target.value)}
              autoComplete="off"
            />
            <span className="nickname-count">
              {nickname.length}/{MAX_LENGTH}
            </span>
          </div>

          {status === 'error' && <p className="error-text">{error}</p>}

          <button className="start-button" type="submit" disabled={!canSubmit}>
            {status === 'loading' ? '문을 여는 중...' : '수사 시작하기'}
          </button>
        </form>

        <p className="footer-tagline">☁ Climate Detective Office ☁</p>
      </div>
    </main>
  )
}

export default HomeScreen
