import { useState } from 'react'
import boardBook1 from './assets/2020/common/board_book1.png'
import boardBook2 from './assets/2020/common/board_book2.png'
import boardBook3 from './assets/2020/common/board_book3.png'
import './Stage.css'
import './BoardHintBookScreen.css'

const PAGES = [boardBook1, boardBook2, boardBook3]

function BoardHintBookScreen({ onReturn }) {
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
        <button
          type="button"
          className="bhb-hit bhb-tab-ocean"
          aria-label="해양 관측소"
          onClick={() => goTo(0)}
        />
        <button
          type="button"
          className="bhb-hit bhb-tab-weather"
          aria-label="기상 관측소"
          onClick={() => goTo(1)}
        />
        <button
          type="button"
          className="bhb-hit bhb-tab-satellite"
          aria-label="위성 센터"
          onClick={() => goTo(2)}
        />

        {pageIndex === PAGES.length - 1 && (
          <button
            type="button"
            className="bhb-hit bhb-return"
            aria-label="수사보드로 돌아가기"
            onClick={onReturn}
          />
        )}
      </div>
    </main>
  )
}

export default BoardHintBookScreen
