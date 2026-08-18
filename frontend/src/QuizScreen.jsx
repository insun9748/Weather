import { useState } from 'react'
import './Stage.css'
import './QuizScreen.css'

function QuizScreen({ background, options, videos = [], tipImage }) {
  const [showTip, setShowTip] = useState(false)
  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
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
        {videos.map((video) => (
          <video
            key={video.src}
            className="quiz-video"
            style={{
              left: video.left,
              top: video.top,
              width: video.width,
              height: video.height,
            }}
            src={video.src}
            autoPlay
            loop
            muted
            playsInline
          />
        ))}
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            className="quiz-option"
            style={{
              left: option.left,
              top: option.top,
              width: option.width,
              height: option.height,
            }}
            aria-label={option.label}
            onClick={option.onClick}
          />
        ))}
      </div>
    </main>
  )
}

export default QuizScreen
