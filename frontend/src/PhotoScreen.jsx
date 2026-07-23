import './Stage.css'
import './DialogueScreen.css'
import './PhotoScreen.css'

function PhotoScreen({ background, buttonLabel, onButtonClick, compactBox = false }) {
  const stageClass = compactBox ? 'stage photo-stage' : 'stage'
  return (
    <main className="stage-wrap">
      <div className={stageClass} style={{ backgroundImage: `url(${background})` }}>
        <button className="next-hint" type="button" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </main>
  )
}

export default PhotoScreen
