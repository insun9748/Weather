import { useState } from 'react'
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
const SOLUTION_BTN = { left: 1470, top: 945, width: 360, height: 55 }

const TITLE_AREA = { top: 180, height: 45 }
const RIBBON_AREA = { left: 375, top: 836, width: 1065, height: 185.41 }
const METRIC1_VALUE_AREA = { left: 457, top: 545, width: 510, height: 90 }
const METRIC2_VALUE_AREA = { left: 967, top: 545, width: 493, height: 90 }

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

function ClimateCompareScreen({ caseId, assets, onExit }) {
  // 카드 안 "높음"/"발생하지 않음" 같은 값 텍스트의 세로 위치를 사건별로 살짝 보정할 때 사용.
  const metricValueTop = METRIC1_VALUE_AREA.top - (assets.metricValueOffsetY ?? 0)

  // 테스트용: ?mockClimate=1 이면 위치확인/백엔드 호출 없이 바로 결과 화면부터 시작.
  const isMock = new URLSearchParams(window.location.search).get('mockClimate') === '1'
  const [status, setStatus] = useState(isMock ? 'done' : 'idle') // idle | locating | comparing | done | error
  const [result, setResult] = useState(
    isMock
      ? {
          location_name: '테스트 위치',
          temperature: 30,
          humidity: 80,
          wind_direction: '남서',
          precipitation: 0,
          comparison_text: '(테스트용 더미 비교 텍스트입니다)',
          metric1_label: '높음',
          metric2_label: '발생함',
          is_similar: true,
        }
      : null,
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [showConclusion, setShowConclusion] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

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

  if (showSolution && assets.solution) {
    return (
      <main className="stage-wrap">
        <div className="stage climate-stage" style={{ backgroundImage: `url(${assets.solution})` }}>
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
        </div>
      </main>
    )
  }

  if (showConclusion && result && assets.today3) {
    const titleImg = result.is_similar ? assets.today3Title2 : assets.today3Title1
    const ribbonImg = result.is_similar ? assets.today3High : assets.today3Low

    return (
      <main className="stage-wrap">
        <div className="stage climate-stage" style={{ backgroundImage: `url(${assets.today3})` }}>
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
              left: toCqi(METRIC1_VALUE_AREA.left),
              top: toCqi(metricValueTop),
              width: toCqi(METRIC1_VALUE_AREA.width),
              height: toCqi(METRIC1_VALUE_AREA.height),
            }}
          >
            {result.metric1_label}
          </div>
          <div
            className="climate-value-box"
            style={{
              left: toCqi(METRIC2_VALUE_AREA.left),
              top: toCqi(metricValueTop),
              width: toCqi(METRIC2_VALUE_AREA.width),
              height: toCqi(METRIC2_VALUE_AREA.height),
            }}
          >
            {result.metric2_label}
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

          {assets.solution && (
            <button
              type="button"
              className="climate-solution-btn"
              style={{
                left: toCqi(SOLUTION_BTN.left),
                top: toCqi(SOLUTION_BTN.top),
                width: toCqi(SOLUTION_BTN.width),
                height: toCqi(SOLUTION_BTN.height),
              }}
              onClick={() => setShowSolution(true)}
            >
              대처방법 알아보기
            </button>
          )}
        </div>
      </main>
    )
  }

  if (status === 'done' && result) {
    return (
      <main className="stage-wrap">
        <div className="stage climate-stage" style={{ backgroundImage: `url(${assets.today2})` }}>
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
              <p className="climate-comparison-text">
                {result.comparison_text.replace(/([.?!])\s+/g, '$1\n')}
              </p>
            </div>
          </div>

          {assets.today3 && (
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
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="stage-wrap">
      <div className="stage climate-stage" style={{ backgroundImage: `url(${assets.today1})` }}>
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
