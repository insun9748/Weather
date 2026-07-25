import { useState } from 'react'
import './Stage.css'
import './HintCardScreen.css'

function HintCardScreen({ background, frontImage, backImage, hotspot }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <div className="hint-card-slot">
          <div
            className={`hint-card${flipped ? ' hint-card--flipped' : ''}`}
            onClick={() => setFlipped((current) => !current)}
          >
            <div
              className="hint-card-face hint-card-face--front"
              style={{ backgroundImage: `url(${frontImage})` }}
            />
            <div
              className="hint-card-face hint-card-face--back"
              style={{ backgroundImage: `url(${backImage})` }}
            >
              {flipped && hotspot && (
                <button
                  type="button"
                  className="hint-card-hotspot"
                  aria-label={hotspot.label}
                  style={{
                    left: hotspot.left,
                    top: hotspot.top,
                    width: hotspot.width,
                    height: hotspot.height,
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    hotspot.onClick()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default HintCardScreen
