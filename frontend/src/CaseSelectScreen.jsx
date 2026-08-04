import file2020 from './assets/2020_file.png'
import file2018 from './assets/2018_file.png'
import file2022 from './assets/2022_file.png'
import background from './assets/file_bg.png'
import star2 from './assets/star2.png'
import star3 from './assets/star3.png'
import star4 from './assets/star4.png'
import './Stage.css'
import './CaseSelectScreen.css'

const CASES = [
  { id: '2020', image: file2020, alt: '2020 역대 최장 장마 사건', starImage: star3 },
  { id: '2018', image: file2018, alt: '2018 기록적 폭염 사건', starImage: star2 },
  { id: '2022', image: file2022, alt: '2022 수도권 집중호우 사건', starImage: star4 },
]

function CaseSelectScreen({ onSelectCase }) {
  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
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
      </div>
    </main>
  )
}

export default CaseSelectScreen
