import './Stage.css'
import './DialogueScreen.css'

function DialogueScreen({ background, speaker, lines, buttonLabel, onButtonClick }) {
  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
        <div className="dialogue-bar">
          <div className="dialogue-row">
            <span className="speaker-name">{speaker}</span>
            <p className="dialogue-text">
              {lines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
          <button className="next-hint" type="button" onClick={onButtonClick}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </main>
  )
}

export default DialogueScreen
