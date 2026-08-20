import { useState } from 'react'
import './Stage.css'
import './BoardHintBookScreen.css'

function BoardHintBookScreen({ pages: PAGES, tabs = [], onReturn }) {
  const [pageIndex, setPageIndex] = useState(0)

  const goTo = (index) => {
    if (index < 0 || index >= PAGES.length) return
    setPageIndex(index)
  }

  return (
    <main className="stage-wrap">
      <div className="stage bhb-stage" style={{ backgroundImage: `url(${PAGES[pageIndex]})` }}>
        <button
          type="button"
          className="bhb-hit bhb-arrow-left"
          aria-label="이전 페이지"
          onClick={() => goTo(pageIndex - 1)}
          disabled={pageIndex === 0}
        />
        <button
          type="button"
          className="bhb-hit bhb-arrow-right"
          aria-label="다음 페이지"
          onClick={() => goTo(pageIndex + 1)}
          disabled={pageIndex === PAGES.length - 1}
        />
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            className={`bhb-hit bhb-tab-${index + 1}`}
            aria-label={tab.label}
            onClick={() => goTo(tab.pageIndex)}
          />
        ))}

        {pageIndex === PAGES.length - 1 ? (
          <button
            type="button"
            className="bhb-hit bhb-return"
            aria-label="수사보드로 돌아가기"
            onClick={onReturn}
          />
        ) : (
          // 마지막 페이지는 그림에 버튼이 이미 그려져 있지만, 나머지 페이지엔 없어서 직접 그려준다.
          <button type="button" className="bhb-return-visible" onClick={onReturn}>
            수사보드로 돌아가기
          </button>
        )}
      </div>
    </main>
  )
}

export default BoardHintBookScreen
