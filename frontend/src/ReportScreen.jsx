import { useEffect, useRef, useState } from 'react'
import report1 from './assets/report1.png'
import report2 from './assets/report2.png'
import report3 from './assets/report3.png'
import report4 from './assets/report4.png'
import reportPerfect1 from './assets/report_perfect1.png'
import reportPerfect2 from './assets/report_perfect2.png'
import reportPerfect3 from './assets/report_perfect3.png'
import defaultProfile from './assets/repoprt_profile.png'
import './Stage.css'
import './ReportScreen.css'

const STAGE_W = 1920
const toCqi = (px) => `${((px / STAGE_W) * 100).toFixed(2)}cqi`

const PAGES = [
  {
    caseId: '2020_jangma',
    background: report1,
    perfectBackground: reportPerfect1,
    accentColor: '#46E0FF',
  },
  {
    caseId: '2018_heatwave',
    background: report2,
    perfectBackground: reportPerfect2,
    accentColor: '#3ED9A0',
  },
  {
    caseId: '2022_flood',
    background: report3,
    perfectBackground: reportPerfect3,
    accentColor: '#B36BFF',
  },
  {
    caseId: null,
    background: report4,
    perfectBackground: null,
    accentColor: '#CB912E',
  },
]

// report1~4.png 원본(피그마 export) 픽셀 좌표를 그대로 옮긴 값들. 1920 기준 cqi로 환산.
const RETRY_COUNT_BOX = { left: toCqi(1042), top: toCqi(186), width: toCqi(140), height: toCqi(37) }
// 개념 타이틀/본문을 각각 절대좌표로 따로 박아두면 제목이 길어져 줄바꿈될 때 본문과 겹치므로,
// 하나의 컨테이너 안에서 자연스러운 문서 흐름(margin)으로 쌓는다.
const CONCEPT_LIST_BOX = { left: toCqi(961), top: toCqi(427), width: toCqi(780), maxHeight: toCqi(560) }
const OVERALL_BODY_BOX = { left: toCqi(895), top: toCqi(460), width: toCqi(935) }
const PREV_ARROW_BOX = { left: toCqi(795), top: toCqi(619), width: toCqi(82), height: toCqi(99) }
const NEXT_ARROW_BOX = { left: toCqi(1782), top: toCqi(619), width: toCqi(82), height: toCqi(99) }
const PHOTO_BOX = { left: toCqi(214), top: toCqi(152), width: toCqi(421), height: toCqi(445) }
const NAME_PATCH_BOX = { left: toCqi(230), top: toCqi(566), width: toCqi(384), height: toCqi(72) }
const UPLOAD_BUTTON_BOX = { left: toCqi(336), top: toCqi(664), width: toCqi(175), height: toCqi(56) }

// localStorage에만 저장(서버 미전송) — 큰 원본을 그대로 넣으면 용량 초과가 나서
// 캔버스로 축소한 뒤 저장한다.
function resizeImageToDataUrl(file, maxSize = 320) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(objectUrl)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('이미지를 불러오지 못했습니다'))
    }
    img.src = objectUrl
  })
}

function ReportScreen({ data, userId, nickname, onExit }) {
  const [page, setPage] = useState(0)
  const [photo, setPhoto] = useState(null)
  const fileInputRef = useRef(null)

  const photoKey = `detectivePhoto_${userId}`

  useEffect(() => {
    if (!userId) return
    setPhoto(localStorage.getItem(photoKey))
  }, [userId, photoKey])

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      localStorage.setItem(photoKey, dataUrl)
      setPhoto(dataUrl)
    } catch {
      // 이미지 처리 실패 시 조용히 무시 (사진은 부가 기능이라 실패해도 리포트 열람에는 지장 없음)
    }
  }

  const current = PAGES[page]
  const caseReport = current.caseId ? data.cases.find((c) => c.case_id === current.caseId) : null
  const isPerfect = caseReport?.is_perfect
  const background = caseReport && isPerfect ? current.perfectBackground : current.background

  return (
    <main className="stage-wrap">
      <div className="stage report-stage" style={{ backgroundImage: `url(${background})` }}>
        <div className="report-photo-slot" style={PHOTO_BOX}>
          <img
            className="report-photo-img"
            src={photo || defaultProfile}
            alt=""
            style={{ objectFit: photo ? 'cover' : 'contain' }}
          />
        </div>

        <div className="report-nameplate-patch" style={NAME_PATCH_BOX}>
          <span>탐정 {nickname}</span>
        </div>

        <button
          type="button"
          className="report-upload-button"
          aria-label="사진 올리기"
          style={UPLOAD_BUTTON_BOX}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePhotoChange}
        />

        {data.retry_count_total != null && (
          <div className="report-retry-count" style={RETRY_COUNT_BOX}>
            {data.retry_count_total}회
          </div>
        )}

        {caseReport && !isPerfect && (
          <div className="report-concept-list" style={CONCEPT_LIST_BOX}>
            {caseReport.concepts.map((concept, i) => (
              <div className="report-concept-block" key={i}>
                <div className="report-concept-title" style={{ color: current.accentColor }}>
                  헷갈린 개념 : {concept.concept_title}
                </div>
                <p className="report-concept-body">{concept.concept_body}</p>
              </div>
            ))}
          </div>
        )}

        {!current.caseId && (
          <p className="report-overall-body" style={OVERALL_BODY_BOX}>
            {data.overall_summary}
          </p>
        )}

        {page > 0 && (
          <button
            type="button"
            className="report-nav-arrow"
            aria-label="이전 페이지"
            style={PREV_ARROW_BOX}
            onClick={() => setPage((p) => p - 1)}
          />
        )}
        {page < PAGES.length - 1 && (
          <button
            type="button"
            className="report-nav-arrow"
            aria-label="다음 페이지"
            style={NEXT_ARROW_BOX}
            onClick={() => setPage((p) => p + 1)}
          />
        )}

        <button type="button" className="report-exit-button" aria-label="닫기" onClick={onExit}>
          ✕
        </button>
      </div>
    </main>
  )
}

export default ReportScreen
