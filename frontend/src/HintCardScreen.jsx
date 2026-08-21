import { useState } from 'react'
import cardFlipSfx from './assets/sounds/카드 넘기는 소리.wav'
import './Stage.css'
import './HintCardScreen.css'

function HintCardScreen({ background, frontImage, backImage, hotspot }) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    const sfx = new Audio(cardFlipSfx)
    sfx.volume = 0.7
    sfx.play().catch(() => {})
    setFlipped((current) => !current)
  }

  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <div className="hint-card-slot">
          <div
            className={`hint-card${flipped ? ' hint-card--flipped' : ''}`}
            onClick={handleFlip}
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
