import { useState } from 'react'
import today1Bg from './assets/2020/common/today1.png'
import today2Bg from './assets/2020/common/today2.png'
import today3Bg from './assets/2020/common/today3.png'
import today3Title1 from './assets/2020/common/today3_title1.png' // "다른 조건이야!" (다름)
import today3Title2 from './assets/2020/common/today3_title2.png' // "비슷한 조건이야" (비슷함)
import today3High from './assets/2020/common/today3_high.png'
import today3Low from './assets/2020/common/today3_low.png'
import { compareClimate } from './api'
import './Stage.css'
import './ClimateCompareScreen.css'

const STAGE_W = 1920
const toCqi = (px) => `${((px / STAGE_W) * 100).toFixed(2)}cqi`

const EXIT_BTN = { left: 1648, top: 44, width: 227, height: 73 }
const RUN_BTN = { left: 673, top: 661, width: 596, height: 82 }
const STATUS_AREA = { left: 480, top: 400, width: 960, height: 300 }

const CONCLUSION_BTN = { left: 765, top: 845, width: 395, height: 105 }
const RESULT_AREA = { left: 480, top: 260, width: 960, height: 560 }

const TITLE_AREA = { top: 180, height: 45 }
const RIBBON_AREA = { left: 375, top: 836, width: 1065, height: 185.41 }
const HUMIDITY_VALUE_AREA = { left: 457, top: 545, width: 510, height: 90 }
const WIND_VALUE_AREA = { left: 967, top: 545, width: 493, height: 90 }

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
    })
  })
}

function ClimateCompareScreen({ caseId, onExit }) {
  const [status, setStatus] = useState('idle') // idle | locating | comparing | done | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [showConclusion, setShowConclusion] = useState(false)

  const run = async () => {
    setStatus('locating')
    setErrorMsg('')
    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords

      setStatus('comparing')
      const data = await compareClimate(caseId, { latitude, longitude })
      setResult(data)
      setStatus('done')
    } catch (err) {
      setErrorMsg(
        err?.code === 1
          ? '위치 정보 사용을 허용해주셔야 오늘 날씨를 비교할 수 있어요.'
          : err?.message || '오늘 날씨를 불러오는 중 문제가 발생했습니다.',
      )
      setStatus('error')
    }
  }

  if (showConclusion && result) {
    const titleImg = result.is_similar ? today3Title2 : today3Title1
    const ribbonImg = result.is_similar ? today3High : today3Low

    return (
      <main className="stage-wrap">
        <div className="stage climate-stage" style={{ backgroundImage: `url(${today3Bg})` }}>
          <button
            type="button"
            className="climate-hotspot"
            aria-label="수사 끝내기"
            style={{
              left: toCqi(EXIT_BTN.left),
              top: toCqi(EXIT_BTN.top),
              width: toCqi(EXIT_BTN.width),
              height: toCqi(EXIT_BTN.height),
            }}
            onClick={onExit}
          />

          <img
            className="climate-title-img"
            src={titleImg}
            alt=""
            style={{ top: toCqi(TITLE_AREA.top), height: toCqi(TITLE_AREA.height) }}
          />

          <div
            className="climate-value-box"
            style={{
              left: toCqi(HUMIDITY_VALUE_AREA.left),
              top: toCqi(HUMIDITY_VALUE_AREA.top),
              width: toCqi(HUMIDITY_VALUE_AREA.width),
              height: toCqi(HUMIDITY_VALUE_AREA.height),
            }}
          >
            {result.humidity_label}
          </div>
          <div
            className="climate-value-box"
            style={{
              left: toCqi(WIND_VALUE_AREA.left),
              top: toCqi(WIND_VALUE_AREA.top),
              width: toCqi(WIND_VALUE_AREA.width),
              height: toCqi(WIND_VALUE_AREA.height),
            }}
          >
            {result.wind_label}
          </div>

          <img
            className="climate-ribbon-img"
            src={ribbonImg}
            alt=""
            style={{
              left: toCqi(RIBBON_AREA.left),
              top: toCqi(RIBBON_AREA.top),
              width: toCqi(RIBBON_AREA.width),
              height: toCqi(RIBBON_AREA.height),
            }}
          />
        </div>
      </main>
    )
  }

  if (status === 'done' && result) {
    return (
      <main className="stage-wrap">
        <div className="stage climate-stage" style={{ backgroundImage: `url(${today2Bg})` }}>
          <div
            className="climate-result-area"
            style={{
              left: toCqi(RESULT_AREA.left),
              top: toCqi(RESULT_AREA.top),
              width: toCqi(RESULT_AREA.width),
              height: toCqi(RESULT_AREA.height),
            }}
          >
            <div className="climate-result">
              <p className="climate-location">
                📍 {result.location_name} · 기온 {result.temperature ?? '-'}°C · 습도{' '}
                {result.humidity ?? '-'}% · 풍향 {result.wind_direction ?? '-'} · 강수량{' '}
                {result.precipitation ?? 0}mm
              </p>
              <p className="climate-comparison-text">{result.comparison_text}</p>
            </div>
          </div>

          <button
            type="button"
            className="climate-hotspot"
            aria-label="결론 보러가기"
            style={{
              left: toCqi(CONCLUSION_BTN.left),
              top: toCqi(CONCLUSION_BTN.top),
              width: toCqi(CONCLUSION_BTN.width),
              height: toCqi(CONCLUSION_BTN.height),
            }}
            onClick={() => setShowConclusion(true)}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="stage-wrap">
      <div className="stage climate-stage" style={{ backgroundImage: `url(${today1Bg})` }}>
        <button
          type="button"
          className="climate-hotspot"
          aria-label="수사 끝내기"
          style={{
            left: toCqi(EXIT_BTN.left),
            top: toCqi(EXIT_BTN.top),
            width: toCqi(EXIT_BTN.width),
            height: toCqi(EXIT_BTN.height),
          }}
          onClick={onExit}
        />

        <div
          className="climate-result-area"
          style={{
            left: toCqi(STATUS_AREA.left),
            top: toCqi(STATUS_AREA.top),
            width: toCqi(STATUS_AREA.width),
            height: toCqi(STATUS_AREA.height),
          }}
        >
          {(status === 'locating' || status === 'comparing') && (
            <p className="climate-loading">
              {status === 'locating' ? '위치를 확인하는 중...' : 'AI가 비교 중...'}
            </p>
          )}
          {status === 'error' && <p className="climate-error">{errorMsg}</p>}
        </div>

        <button
          type="button"
          className="climate-hotspot"
          aria-label="내 위치로 오늘날씨와 비교하기"
          style={{
            left: toCqi(RUN_BTN.left),
            top: toCqi(RUN_BTN.top),
            width: toCqi(RUN_BTN.width),
            height: toCqi(RUN_BTN.height),
          }}
          disabled={status === 'locating' || status === 'comparing'}
          onClick={run}
        />
      </div>
    </main>
  )
}

export default ClimateCompareScreen
