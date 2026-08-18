import { useState } from 'react'
import './Stage.css'
import './DialogueScreen.css'
import './PhotoScreen.css'

function PhotoScreen({
  background,
  buttonLabel,
  onButtonClick,
  compactBox = false,
  hotspot,
  buttonStyle,
  solidButton = false,
  tipImage,
}) {
  const [showTip, setShowTip] = useState(false)
  const stageClass = compactBox ? 'stage photo-stage' : 'stage'
  return (
    <main className="stage-wrap">
      <div className={stageClass} style={{ backgroundImage: `url(${background})` }}>
        {tipImage && (
          <button type="button" className="quiz-tip-button" onClick={() => setShowTip(true)}>
            탐정 TIP
          </button>
        )}
        {showTip && (
          <div className="quiz-tip-backdrop" onClick={() => setShowTip(false)}>
            <img className="quiz-tip-image" src={tipImage} alt="탐정 TIP" />
          </div>
        )}
        {buttonLabel && (
          <button
            className={solidButton ? 'photo-button-solid' : 'next-hint'}
            type="button"
            style={buttonStyle}
            onClick={onButtonClick}
          >
            {buttonLabel}
          </button>
        )}
        {hotspot && (
          <button
            className="photo-hotspot"
            type="button"
            aria-label={hotspot.label}
            style={{
              left: hotspot.left,
              top: hotspot.top,
              width: hotspot.width,
              height: hotspot.height,
            }}
            onClick={hotspot.onClick}
          />
        )}
      </div>
    </main>
  )
}

export default PhotoScreen
