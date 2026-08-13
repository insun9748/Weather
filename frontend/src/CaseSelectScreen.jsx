import { useState } from 'react'
import file2020 from './assets/2020_file.png'
import file2018 from './assets/2018_file.png'
import file2022 from './assets/2022_file.png'
import background from './assets/file_bg.png'
import star2 from './assets/star2.png'
import star3 from './assets/star3.png'
import star4 from './assets/star4.png'
import { fetchDetectiveReport } from './api'
import './Stage.css'
import './CaseSelectScreen.css'

const CASES = [
  { id: '2020', image: file2020, alt: '2020 역대 최장 장마 사건', starImage: star3 },
  { id: '2018', image: file2018, alt: '2018 기록적 폭염 사건', starImage: star2 },
  { id: '2022', image: file2022, alt: '2022 수도권 집중호우 사건', starImage: star4 },
]

function CaseSelectScreen({ onSelectCase, userId, onOpenReport }) {
  const [loading, setLoading] = useState(false)
  const [remainingCases, setRemainingCases] = useState(null)

  const handleMagnifierClick = async () => {
    if (!userId || loading) return
    setLoading(true)
    try {
      const report = await fetchDetectiveReport(userId)
      if (report.all_solved) {
        onOpenReport(report)
      } else {
        setRemainingCases(report.remaining_cases)
      }
    } catch {
      // 조회 실패 시 조용히 무시 (돋보기는 부가 기능)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <button
          type="button"
          className="report-hotspot"
          aria-label="나만의 탐정 리포트 보기"
          onClick={handleMagnifierClick}
        />

        {loading && (
          <div className="report-loading-badge">탐정 리포트를 불러오는 중...</div>
        )}

        <div className="case-files">
          {CASES.map((c) => (
            <div key={c.id} className={`case-card case-card-${c.id}`}>
              <button
                type="button"
                className="case-file"
                onClick={() => onSelectCase(c.id)}
              >
                <img src={c.image} alt={c.alt} />
              </button>
              <div className="level-row">
                <span className="level-label">level</span>
                <img className="level-stars" src={c.starImage} alt="" />
              </div>
            </div>
          ))}
        </div>

        {remainingCases && (
          <div className="report-popup-backdrop" onClick={() => setRemainingCases(null)}>
            <div className="report-popup" onClick={(e) => e.stopPropagation()}>
              <p className="report-popup-title">아직 모든 사건을 해결하지 못했습니다!</p>
              <ul className="report-popup-list">
                {remainingCases.map((c) => (
                  <li key={c.case_id}>
                    {c.year}년 - {c.title}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="report-popup-close"
                onClick={() => setRemainingCases(null)}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default CaseSelectScreen
