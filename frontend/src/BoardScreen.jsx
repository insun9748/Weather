import { useEffect, useState } from 'react'
import hintbookIcon from './assets/2020/common/hintbook.png'
import boardVoice from './assets/sounds/수사보드.mp3'
import BoardHintBookScreen from './BoardHintBookScreen'
import { checkBoard } from './api'
import './Stage.css'
import './BoardScreen.css'

// evi1/2/3.png(칩 이미지) 원본 픽셀 크기를 cqi로 환산할 때 기준이 되는 스테이지 너비.
// (board1~6.png 자체의 좌표는 이제 case 콘텐츠에서 이미 cqi 문자열로 넘어온다.)
const STAGE_W = 1920
const toCqi = (px) => `${((px / STAGE_W) * 100).toFixed(2)}cqi`

// 터치 기기(모바일)에서는 HTML5 드래그 앤 드롭 자체가 브라우저에서 지원되지 않아서
// 드래그가 안 먹힘 — "탭으로 선택 → 탭으로 놓기" 방식을 별도로 추가한다. PC(마우스)는
// 이 값이 false라서 기존 드래그 동작 그대로 유지된다.
const isTouchDevice =
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

// fit an image (w x h) inside a maxW x maxH box (in the 1920-wide reference
// scale), preserving aspect ratio, and return the result as cqi style values.
function fitSizeCqi(w, h, maxW, maxH) {
  const ratio = w / h
  let width = maxW
  let height = width / ratio
  if (height > maxH) {
    height = maxH
    width = height * ratio
  }
  return { width: toCqi(width), height: toCqi(height) }
}

function BoardScreen({ caseId, userId, nickname, assets, onSolved, onExit, onCompareClimate }) {
  const EVIDENCE = assets.evidence
  const EVIDENCE_WRONG_SRC = Object.fromEntries(EVIDENCE.map((e) => [e.id, e.wrongSrc]))
  const BOXES = assets.boxes

  const [placement, setPlacement] = useState({ box1: null, box2: null, box3: null })
  const [phase, setPhase] = useState('placing') // placing | reaction | summary | finalChoice | finalCorrect | finalWrong
  const [feedback, setFeedback] = useState('')
  const [wrongBoxes, setWrongBoxes] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [showHintbook, setShowHintbook] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState(null)

  // 수사보드 화면에 들어오면 한 번 재생.
  useEffect(() => {
    const audio = new Audio(boardVoice)
    audio.play().catch(() => {})
    return () => audio.pause()
  }, [])

  const placedIds = Object.values(placement).filter(Boolean)
  const trayEvidence = EVIDENCE.filter((e) => !placedIds.includes(e.id))

  const clearFromBoxes = (evId, current) => {
    const next = { ...current }
    for (const key of Object.keys(next)) {
      if (next[key] === evId) next[key] = null
    }
    return next
  }

  const handleDropOnBox = (boxId) => (e) => {
    e.preventDefault()
    const evId = e.dataTransfer.getData('text/plain')
    if (!evId) return
    setFeedback('')
    setWrongBoxes((prev) => prev.filter((id) => id !== boxId))
    setPlacement((prev) => {
      const cleared = clearFromBoxes(evId, prev)
      return { ...cleared, [boxId]: evId }
    })
  }

  const handleDropOnTray = (e) => {
    e.preventDefault()
    const evId = e.dataTransfer.getData('text/plain')
    if (!evId) return
    setFeedback('')
    setPlacement((prev) => clearFromBoxes(evId, prev))
  }

  // 모바일 탭 방식: 칩을 탭해서 선택하고, 칸(또는 트레이)을 탭해서 놓는다.
  const handleChipTap = (e, evId) => {
    if (!isTouchDevice) return
    e.stopPropagation()
    setSelectedEvidence((prev) => (prev === evId ? null : evId))
  }

  const handleBoxTap = (boxId) => {
    if (!isTouchDevice || !selectedEvidence) return
    setFeedback('')
    setWrongBoxes((prev) => prev.filter((id) => id !== boxId))
    setPlacement((prev) => {
      const cleared = clearFromBoxes(selectedEvidence, prev)
      return { ...cleared, [boxId]: selectedEvidence }
    })
    setSelectedEvidence(null)
  }

  const handleTrayTap = () => {
    if (!isTouchDevice || !selectedEvidence) return
    setFeedback('')
    setPlacement((prev) => clearFromBoxes(selectedEvidence, prev))
    setSelectedEvidence(null)
  }

  const handleSubmit = async () => {
    if (!placement.box1 || !placement.box2 || !placement.box3) {
      setFeedback('세 칸을 모두 채워야 확인할 수 있어요.')
      return
    }
    setSubmitting(true)
    setFeedback('')
    setWrongBoxes([])
    try {
      const result = await checkBoard(caseId, userId, placement)
      if (result.is_correct) {
        setPhase('reaction')
        onSolved?.()
      } else {
        setFeedback(result.ai_explanation || result.message)
        setWrongBoxes(result.wrong_boxes || [])
      }
    } catch {
      setFeedback('채점 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (showHintbook) {
    return (
      <BoardHintBookScreen
        pages={assets.hintBookPages}
        tabs={assets.hintBookTabs}
        onReturn={() => setShowHintbook(false)}
      />
    )
  }

  const hintbookButton = (
    <button
      type="button"
      className="board-hintbook-button"
      aria-label="힌트 수첩 보기"
      onClick={() => setShowHintbook(true)}
    >
      <img src={hintbookIcon} alt="" />
    </button>
  )

  if (phase === 'reaction') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board2})` }}>
          {hintbookButton}
          <p className="board-reaction-text" style={assets.reactionBox}>
            {nickname}: {assets.reactionText}
          </p>
          <button
            type="button"
            className="board-hotspot"
            aria-label="다음으로"
            style={assets.confirmBtn}
            onClick={() => setPhase('summary')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'summary') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board3})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="다음으로"
            style={assets.nextLink}
            onClick={() => setPhase('finalChoice')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalChoice') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board4})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label={assets.finalChoice.correct.label}
            style={assets.finalChoice.correct.box}
            onClick={() => setPhase('finalCorrect')}
          />
          <button
            type="button"
            className="board-hotspot"
            aria-label={assets.finalChoice.wrong.label}
            style={assets.finalChoice.wrong.box}
            onClick={() => setPhase('finalWrong')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalCorrect') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board5})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="오늘 기후랑 대비해 보기"
            style={assets.climateCompareBtn}
            onClick={onCompareClimate}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalWrong') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board6})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="정답 다시 고르기"
            style={assets.retryBtn}
            onClick={() => setPhase('finalChoice')}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="stage-wrap">
      <div className="stage board-stage" style={{ backgroundImage: `url(${assets.board1})` }}>
        {hintbookButton}
        {BOXES.map((box) => {
          const evId = placement[box.id]
          const evidence = EVIDENCE.find((e) => e.id === evId)
          const isWrong = wrongBoxes.includes(box.id)
          const chipSrc = evidence && (isWrong ? EVIDENCE_WRONG_SRC[evidence.id] : evidence.src)
          return (
            <div
              key={box.id}
              className="board-dropzone"
              style={box.style}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnBox(box.id)}
              onClick={() => handleBoxTap(box.id)}
            >
              {evidence && (
                <img
                  className={`board-chip${selectedEvidence === evidence.id ? ' board-chip--selected' : ''}`}
                  src={chipSrc}
                  alt=""
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', evidence.id)}
                  onClick={(e) => handleChipTap(e, evidence.id)}
                  style={fitSizeCqi(evidence.w, evidence.h, box.widthPx * 0.82, box.heightPx * 0.82)}
                />
              )}
            </div>
          )
        })}

        {feedback && (
          <div className="board-wrong-bar">
            <img className="board-wrong-character" src={assets.gisang} alt="" />
            <div className="board-wrong-content">
              <span className="board-wrong-speaker">기상이</span>
              <p className="board-wrong-text">{feedback}</p>
            </div>
            <button
              type="button"
              className="board-wrong-retry"
              onClick={() => {
                setFeedback('')
                setWrongBoxes([])
                setPlacement({ box1: null, box2: null, box3: null })
              }}
            >
              다시 풀기
            </button>
          </div>
        )}

        <div
          className="board-tray"
          style={{
            left: toCqi(140),
            top: toCqi(896),
            width: toCqi(1460),
            height: toCqi(153),
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnTray}
          onClick={handleTrayTap}
        >
          {trayEvidence.map((evidence) => (
            <img
              key={evidence.id}
              className={`board-chip board-chip-tray${selectedEvidence === evidence.id ? ' board-chip--selected' : ''}`}
              src={evidence.src}
              alt=""
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', evidence.id)}
              onClick={(e) => handleChipTap(e, evidence.id)}
              style={fitSizeCqi(evidence.w, evidence.h, 300, 90)}
            />
          ))}
        </div>

        <button
          type="button"
          className="board-hotspot"
          aria-label="확인하기"
          disabled={submitting}
          style={assets.confirmBtn}
          onClick={handleSubmit}
        />
      </div>
    </main>
  )
}

export default BoardScreen
