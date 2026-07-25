import './Stage.css'
import './QuizScreen.css'

function QuizScreen({ background, options }) {
  return (
    <main className="stage-wrap">
      <div className="stage" style={{ backgroundImage: `url(${background})` }}>
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
