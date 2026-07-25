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
}) {
  const stageClass = compactBox ? 'stage photo-stage' : 'stage'
  return (
    <main className="stage-wrap">
      <div className={stageClass} style={{ backgroundImage: `url(${background})` }}>
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
