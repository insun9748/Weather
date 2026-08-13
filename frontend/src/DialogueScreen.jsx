import { useEffect, useState } from 'react'
import './Stage.css'
import './DialogueScreen.css'

const TYPE_SPEED_MS = 35

function DialogueScreen({ background, speaker, lines, buttonLabel, onButtonClick, panel, bare, barBox, buttonBox, voiceSrc }) {
  const fullText = lines.join('\n')
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
  }, [fullText])

  useEffect(() => {
    if (!voiceSrc) return
    const audio = new Audio(voiceSrc)
    audio.play().catch(() => {})
    return () => audio.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceSrc])

  useEffect(() => {
    if (visibleCount >= fullText.length) return
    const timer = setTimeout(() => setVisibleCount((count) => count + 1), TYPE_SPEED_MS)
    return () => clearTimeout(timer)
  }, [visibleCount, fullText])

  const isTyping = visibleCount < fullText.length
  const shownLines = fullText.slice(0, visibleCount).split('\n')

  const handleSkip = () => {
    if (isTyping) setVisibleCount(fullText.length)
  }

  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <div
          className={`dialogue-bar${panel ? ' dialogue-bar--panel' : ''}${bare ? ' dialogue-bar--bare' : ''}`}
          style={barBox}
          onClick={handleSkip}
        >
          <div className="dialogue-row">
            {!bare && <span className="speaker-name">{speaker}</span>}
            <p className="dialogue-text">
              {shownLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < shownLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          <button
            className="next-hint"
            type="button"
            style={buttonBox}
            onClick={(event) => {
              event.stopPropagation()
              onButtonClick?.()
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </main>
  )
}

export default DialogueScreen