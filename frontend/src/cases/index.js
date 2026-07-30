// 사건별 콘텐츠 모음. 2018/2022 사건을 추가할 때는:
//   1. cases/2018.js, cases/2022.js 를 cases/2020.js 복사해서 만들고
//   2. 아래에 한 줄씩 추가하면 App.jsx/BoardScreen.jsx/ClimateCompareScreen.jsx는 그대로 재사용된다.
import case2020 from './2020'
import case2018 from './2018'

export const CASES = {
  '2020': case2020,
  '2018': case2018,
}

export function getCase(caseKey) {
  return CASES[caseKey]
}
