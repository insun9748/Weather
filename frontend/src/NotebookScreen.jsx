import { useState } from 'react'
import lensIcon from './assets/readingglasses.png'
import pageTurnSfx from './assets/sounds/책 넘기는 소리.wav'
import './Stage.css'
import './NotebookScreen.css'

const ZOOM = 2.4
const LENS_RATIO = 0.18
// readingglasses.png: outer rim is ~500px of the 786px-wide source,
// centered at (250, 250) -> diameter 63.6% of width, center offset 31.8%.
// The inner (glass) opening is a bit smaller than the rim.
const GLASS_CIRCLE_RATIO = 0.636
const GLASS_CENTER_RATIO = 0.318
const GLASS_INNER_RATIO = 0.5

function NotebookScreen({ pages, tabs = [], finishBox, finishButton, pageOverlays, onFinish }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [lens, setLens] = useState(null)

  const page = { src: pages[pageIndex] }
  const showMagnifier = pageIndex === 0

  const goTo = (index) => {
    if (index < 0 || index >= pages.length) return
    const sfx = new Audio(pageTurnSfx)
    sfx.volume = 0.4
    sfx.play().catch(() => {})
    setPageIndex(index)
  }

  const goNext = () => {
    if (pageIndex === pages.length - 1) {
      onFinish?.()
      return
    }
    goTo(pageIndex + 1)
  }

  const updateLensFromPoint = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect()
    setLens({
      px: clientX - rect.left,
      py: clientY - rect.top,
      w: rect.width,
      h: rect.height,
    })
  }

  const handleMouseMove = (event) => {
    if (!showMagnifier) return
    if (event.target.closest('.nb-hit')) {
      setLens(null)
      return
    }
    updateLensFromPoint(event.clientX, event.clientY, event.currentTarget)
  }

  // 모바일(터치)에서는 mousemove가 안 일어나서 돋보기가 아예 안 켜졌음 — 터치 이벤트로도 같은 동작 지원.
  const handleTouchMove = (event) => {
    if (!showMagnifier) return
    const touch = event.touches[0]
    if (!touch) return
    const touchedEl = document.elementFromPoint(touch.clientX, touch.clientY)
    if (touchedEl?.closest('.nb-hit')) {
      setLens(null)
      return
    }
    updateLensFromPoint(touch.clientX, touch.clientY, event.currentTarget)
  }

  let lensStyle = null
  let glassStyle = null
  if (showMagnifier && lens) {
    const outerSize = lens.w * LENS_RATIO
    const glassWidth = outerSize / GLASS_CIRCLE_RATIO
    const innerSize = glassWidth * GLASS_INNER_RATIO
    lensStyle = {
      width: innerSize,
      height: innerSize,
      left: lens.px - innerSize / 2,
      top: lens.py - innerSize / 2,
      backgroundImage: `url(${page.src})`,
      backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
      backgroundPosition: `${-(lens.px * ZOOM - innerSize / 2)}px ${-(lens.py * ZOOM - innerSize / 2)}px`,
    }
    glassStyle = {
      width: glassWidth,
      left: lens.px - glassWidth * GLASS_CENTER_RATIO,
      top: lens.py - glassWidth * GLASS_CENTER_RATIO,
    }
  }

  return (
    <main className="stage-wrap">
      <div
        className="stage notebook-stage"
        style={{
          backgroundImage: `url(${page.src})`,
          cursor: lensStyle ? 'none' : undefined,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setLens(null)}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setLens(null)}
      >
        {pageOverlays?.[pageIndex]?.map((overlay, i) => (
          <img key={i} className="nb-page-overlay" src={overlay.src} alt="" style={overlay.style} />
        ))}
        <button
          type="button"
          className="nb-hit nb-arrow-left"
          aria-label="이전 페이지"
          onClick={() => goTo(pageIndex - 1)}
          disabled={pageIndex === 0}
        />
        <button
          type="button"
          className="nb-hit nb-arrow-right"
          aria-label="다음 페이지"
          onClick={goNext}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            className={`nb-hit nb-tab-${index + 1}`}
            aria-label={tab.label}
            onClick={() => goTo(tab.pageIndex)}
          />
        ))}
        {finishBox && (
          <button
            type="button"
            className="nb-hit"
            style={finishBox}
            aria-label="조사 시작하기"
            onClick={() => onFinish?.()}
          />
        )}
        {finishButton && (
          <button
            type="button"
            className="nb-finish-button"
            style={finishButton}
            onClick={() => onFinish?.()}
          >
            조사 시작하기
          </button>
        )}

        {glassStyle && (
          <img className="magnifier-glass" src={lensIcon} alt="" style={glassStyle} />
        )}
        {lensStyle && <div className="magnifier-lens" style={lensStyle} />}
      </div>
    </main>
  )
}

export default NotebookScreen