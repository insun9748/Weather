import './Stage.css'
import './DialogueScreen.css'
import './PhotoScreen.css'

function PhotoScreen({ background, buttonLabel, onButtonClick }) {
  return (
    <main className="stage-wrap">
      <div className="stage photo-stage" style={{ backgroundImage: `url(${background})` }}>
        <button className="next-hint" type="button" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </main>
  )
}

export default PhotoScreen
