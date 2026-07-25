import { useEffect, useState } from 'react'
import './Stage.css'
import './DialogueScreen.css'

const TYPE_SPEED_MS = 35

function DialogueScreen({ background, speaker, lines, buttonLabel, onButtonClick, panel, voiceName }) {
  const fullText = lines.join('\n')
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
  }, [fullText])

  useEffect(() => {
    if (!voiceName || !('speechSynthesis' in window)) return

    let cancelled = false
    let spoken = false
    const speak = () => {
      if (cancelled || spoken) return
      spoken = true
      if (speechSynthesis.onvoiceschanged === speak) speechSynthesis.onvoiceschanged = null
      const voice = speechSynthesis.getVoices().find((v) => v.name.includes(voiceName))
      const utter = new SpeechSynthesisUtterance(lines.join(' '))
      utter.lang = 'ko-KR'
      utter.rate = 1.3
      if (voice) utter.voice = voice
      speechSynthesis.speak(utter)
    }

    // deferred so React 18 StrictMode's dev-only mount->cleanup->mount cycle
    // doesn't fire this twice — the first (throwaway) mount's cleanup cancels
    // the timer before it ever calls speak()
    const timer = setTimeout(() => {
      if (speechSynthesis.getVoices().length === 0) {
        // 'voiceschanged' can fire more than once as voices load in — the
        // spoken guard above keeps this from replaying on later firings
        speechSynthesis.onvoiceschanged = speak
      } else {
        speak()
      }
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
      if (speechSynthesis.onvoiceschanged === speak) speechSynthesis.onvoiceschanged = null
      speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          className={`dialogue-bar${panel ? ' dialogue-bar--panel' : ''}`}
          onClick={handleSkip}
        >
          <div className="dialogue-row">
            <span className="speaker-name">{speaker}</span>
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