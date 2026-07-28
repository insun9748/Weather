import { useState } from 'react'
import board1Bg from './assets/2020/common/board1.png'
import board2Bg from './assets/2020/common/board2.png'
import board3Bg from './assets/2020/common/board3.png'
import board4Bg from './assets/2020/common/board4.png'
import board5Bg from './assets/2020/common/board5.png'
import board6Bg from './assets/2020/common/board6.png'
import evi1Img from './assets/2020/common/evi1.png'
import evi2Img from './assets/2020/common/evi2.png'
import evi3Img from './assets/2020/common/evi3.png'
import evi1WrongImg from './assets/2020/common/evi1_x.png'
import evi2WrongImg from './assets/2020/common/evi2_x.png'
import evi3WrongImg from './assets/2020/common/evi3x.png'
import hintbookIcon from './assets/2020/common/hintbook.png'
import gisangImg from './assets/2020/common/gisang.png'
import BoardHintBookScreen from './BoardHintBookScreen'
import { checkBoard } from './api'
import './Stage.css'
import './BoardScreen.css'

// board1.png(1920x1080) 기준 픽셀 좌표를 실측해서 cqi(스테이지 너비 기준 %)로 환산한 값.
const STAGE_W = 1920

const toCqi = (px) => `${((px / STAGE_W) * 100).toFixed(2)}cqi`

const BOXES = [
  { id: 'box1', left: 319, top: 331, width: 293, height: 134 },
  { id: 'box2', left: 747, top: 703, width: 292, height: 130 },
  { id: 'box3', left: 1439, top: 235, width: 296, height: 145 },
]

const CONFIRM_BTN = { left: 1648, top: 961, width: 227, height: 72 }
const NEXT_LINK = { left: 1640, top: 955, width: 180, height: 70 }
const REACTION_BOX = { left: 541, top: 859, width: 848, height: 148 }

// board4~6.png는 3840x2160(2배 해상도) 기준이라 별도 스케일로 환산.
const STAGE_W_2X = 3840
const toCqi2x = (px) => `${((px / STAGE_W_2X) * 100).toFixed(2)}cqi`

const FINAL_CHOICE = {
  monsoon: { left: 635, top: 790, width: 1245, height: 1190 },
  typhoon: { left: 1945, top: 790, width: 1255, height: 1190 },
}
const RETRY_ANSWER_BTN = { left: 1605, top: 1715, width: 620, height: 180 }
const CLIMATE_COMPARE_BTN = { left: 2950, top: 1920, width: 705, height: 125 }

const EVIDENCE = [
  { id: 'evi1', src: evi1Img, w: 533, h: 158 },
  { id: 'evi2', src: evi2Img, w: 374, h: 152 },
  { id: 'evi3', src: evi3Img, w: 486, h: 229 },
]

const EVIDENCE_WRONG_SRC = {
  evi1: evi1WrongImg,
  evi2: evi2WrongImg,
  evi3: evi3WrongImg,
}

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

function BoardScreen({ caseId, userId, nickname, onSolved, onExit, onCompareClimate }) {
  const [placement, setPlacement] = useState({ box1: null, box2: null, box3: null })
  const [phase, setPhase] = useState('placing') // placing | reaction | summary | finalChoice | finalCorrect | finalWrong
  const [feedback, setFeedback] = useState('')
  const [wrongBoxes, setWrongBoxes] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [showHintbook, setShowHintbook] = useState(false)

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
    return <BoardHintBookScreen onReturn={() => setShowHintbook(false)} />
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
        <div className="stage board-stage" style={{ backgroundImage: `url(${board2Bg})` }}>
          {hintbookButton}
          <p
            className="board-reaction-text"
            style={{
              left: toCqi(REACTION_BOX.left),
              top: toCqi(REACTION_BOX.top),
              width: toCqi(REACTION_BOX.width),
              height: toCqi(REACTION_BOX.height),
            }}
          >
            {nickname}: 아하... 그래서 그랬던 거군
          </p>
          <button
            type="button"
            className="board-hotspot"
            aria-label="다음으로"
            style={{
              left: toCqi(CONFIRM_BTN.left),
              top: toCqi(CONFIRM_BTN.top),
              width: toCqi(CONFIRM_BTN.width),
              height: toCqi(CONFIRM_BTN.height),
            }}
            onClick={() => setPhase('summary')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'summary') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${board3Bg})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="다음으로"
            style={{
              left: toCqi(NEXT_LINK.left),
              top: toCqi(NEXT_LINK.top),
              width: toCqi(NEXT_LINK.width),
              height: toCqi(NEXT_LINK.height),
            }}
            onClick={() => setPhase('finalChoice')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalChoice') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${board4Bg})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="아시아 여름 몬순"
            style={{
              left: toCqi2x(FINAL_CHOICE.monsoon.left),
              top: toCqi2x(FINAL_CHOICE.monsoon.top),
              width: toCqi2x(FINAL_CHOICE.monsoon.width),
              height: toCqi2x(FINAL_CHOICE.monsoon.height),
            }}
            onClick={() => setPhase('finalCorrect')}
          />
          <button
            type="button"
            className="board-hotspot"
            aria-label="태풍"
            style={{
              left: toCqi2x(FINAL_CHOICE.typhoon.left),
              top: toCqi2x(FINAL_CHOICE.typhoon.top),
              width: toCqi2x(FINAL_CHOICE.typhoon.width),
              height: toCqi2x(FINAL_CHOICE.typhoon.height),
            }}
            onClick={() => setPhase('finalWrong')}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalCorrect') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${board5Bg})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="오늘 기후랑 대비해 보기"
            style={{
              left: toCqi2x(CLIMATE_COMPARE_BTN.left),
              top: toCqi2x(CLIMATE_COMPARE_BTN.top),
              width: toCqi2x(CLIMATE_COMPARE_BTN.width),
              height: toCqi2x(CLIMATE_COMPARE_BTN.height),
            }}
            onClick={onCompareClimate}
          />
        </div>
      </main>
    )
  }

  if (phase === 'finalWrong') {
    return (
      <main className="stage-wrap">
        <div className="stage board-stage" style={{ backgroundImage: `url(${board6Bg})` }}>
          {hintbookButton}
          <button
            type="button"
            className="board-hotspot"
            aria-label="정답 다시 고르기"
            style={{
              left: toCqi2x(RETRY_ANSWER_BTN.left),
              top: toCqi2x(RETRY_ANSWER_BTN.top),
              width: toCqi2x(RETRY_ANSWER_BTN.width),
              height: toCqi2x(RETRY_ANSWER_BTN.height),
            }}
            onClick={() => setPhase('finalChoice')}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="stage-wrap">
      <div className="stage board-stage" style={{ backgroundImage: `url(${board1Bg})` }}>
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
              style={{
                left: toCqi(box.left),
                top: toCqi(box.top),
                width: toCqi(box.width),
                height: toCqi(box.height),
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnBox(box.id)}
            >
              {evidence && (
                <img
                  className="board-chip"
                  src={chipSrc}
                  alt=""
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', evidence.id)}
                  style={fitSizeCqi(evidence.w, evidence.h, box.width * 0.82, box.height * 0.82)}
                />
              )}
            </div>
          )
        })}

        {feedback && (
          <div className="board-wrong-bar">
            <img className="board-wrong-character" src={gisangImg} alt="" />
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
        >
          {trayEvidence.map((evidence) => (
            <img
              key={evidence.id}
              className="board-chip board-chip-tray"
              src={evidence.src}
              alt=""
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', evidence.id)}
              style={fitSizeCqi(evidence.w, evidence.h, 300, 90)}
            />
          ))}
        </div>

        <button
          type="button"
          className="board-hotspot"
          aria-label="확인하기"
          disabled={submitting}
          style={{
            left: toCqi(CONFIRM_BTN.left),
            top: toCqi(CONFIRM_BTN.top),
            width: toCqi(CONFIRM_BTN.width),
            height: toCqi(CONFIRM_BTN.height),
          }}
          onClick={handleSubmit}
        />
      </div>
    </main>
  )
}

export default BoardScreen
