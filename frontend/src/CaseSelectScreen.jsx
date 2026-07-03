import file2020 from './assets/2020_file.png'
import file2018 from './assets/2018_file.png'
import file2022 from './assets/2022_file.png'
import background from './assets/page3.png'
import './Stage.css'
import './CaseSelectScreen.css'

const CASES = [
  { id: '2020', image: file2020, alt: '2020 역대 최장 장마 사건' },
  { id: '2018', image: file2018, alt: '2018 기록적 폭염 사건' },
  { id: '2022', image: file2022, alt: '2022 수도권 집중호우 사건' },
]

function CaseSelectScreen({ onSelectCase }) {
  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <div className="case-files">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="case-file"
              onClick={() => onSelectCase(c.id)}
            >
              <img src={c.image} alt={c.alt} />
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default CaseSelectScreen
