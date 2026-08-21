// 2018년 기록적 폭염 사건의 모든 케이스별 콘텐츠(이미지, 텍스트, 목소리 등).
// 화면 배치(좌표)와 화면 전환 로직은 App.jsx의 공통 코드로 남아있고,
// 이 파일은 "그림과 글자"만 담당한다.

import emptyhintbook1 from '../assets/2018/emptyhintbook1.png'
import emptyhintbook2 from '../assets/2018/emptyhintbook2.png'
import emptyhintbook3 from '../assets/2018/emptyhintbook3.png'
import notebookFillText from '../assets/2018/text.png'

import mapBg from '../assets/2018/map.png'
import weatherBuilding from '../assets/2018/build1.png'
import climateBuilding from '../assets/2018/build2.png'
import mapCompleteBg from '../assets/2018/map_complete.png'

import board1Bg from '../assets/2018/board1.png'
import board2Bg from '../assets/2018/board2.png'
import board3Bg from '../assets/2018/board3.png'
import board4Bg from '../assets/2018/board4.png'
import board5Bg from '../assets/2018/board5.png'
import board6Bg from '../assets/2018/board6.png'
import hintbook1 from '../assets/2018/hintbook1.png'
import hintbook2 from '../assets/2018/hintbook2.png'
import evi1Img from '../assets/2018/evi1.png'
import evi2Img from '../assets/2018/evi2.png'
import evi3Img from '../assets/2018/evi3.png'
import evi1WrongImg from '../assets/2018/evi1_x.png'
import evi2WrongImg from '../assets/2018/evi2_x.png'
import evi3WrongImg from '../assets/2018/evi3_x.png'
import gisangImg from '../assets/2020/common/gisang.png'
import today1Bg from '../assets/2020/common/today1.png'
import today2Bg from '../assets/2020/common/today2.png'
import today3Bg from '../assets/2018/today.png'
import today3Title1 from '../assets/2018/title_low.png'
import today3Title2 from '../assets/2018/title_high.png'
import today3High from '../assets/2018/title2_high.png'
import today3Low from '../assets/2018/title2_low.png'
import solutionBg from '../assets/2018_solution.png'

import weatherGisangBg from '../assets/2018/satellite/gisang.png'
import weatherQuiz1Bg from '../assets/2018/satellite/quiz1.png'
import weatherQuiz1Tip from '../assets/2018/satellite/quiz1_tip.png'
import weatherQuiz1CorrectBg from '../assets/2018/satellite/quiz1_1.png'
import weatherQuiz1Wrong1Bg from '../assets/2018/satellite/quiz1_2.png'
import weatherQuiz1Wrong2Bg from '../assets/2018/satellite/quiz1_3.png'
import weatherQuiz2Bg from '../assets/2018/satellite/quiz2.png'
import weatherQuiz2Wrong1Bg from '../assets/2018/satellite/quiz2_1.png'
import weatherQuiz2CorrectBg from '../assets/2018/satellite/quiz2_2.png'
import weatherQuiz2Wrong2Bg from '../assets/2018/satellite/quiz2_3.png'
import weatherHintBg from '../assets/2018/satellite/background.png'
import weatherHintFront from '../assets/2018/satellite/bg_card1.png'
import weatherHintBack from '../assets/2018/satellite/bg_card2.png'
import weatherNotebookBg from '../assets/2018/satellite/hintbook.png'

import climateGisangBg from '../assets/2018/wearher/gisang.png'
import climateQuiz1Bg from '../assets/2018/wearher/quiz1.png'
import climateQuiz1Tip from '../assets/2018/wearher/quiz1_tip.png'
import climateQuiz1Wrong1Bg from '../assets/2018/wearher/quiz1_1.png'
import climateQuiz1Wrong2Bg from '../assets/2018/wearher/quiz1_2.png'
import climateQuiz1CorrectBg from '../assets/2018/wearher/quiz1_3.png'
import climateQuiz2Bg from '../assets/2018/wearher/quiz2.png'
import climateQuiz2Wrong1Bg from '../assets/2018/wearher/quiz2_1.png'
import climateQuiz2Wrong2Bg from '../assets/2018/wearher/quiz2_2.png'
import climateQuiz2CorrectBg from '../assets/2018/wearher/quiz2_3.png'
import climateHintBg from '../assets/2018/wearher/background.png'
import climateHintFront from '../assets/2018/wearher/bg_card1.png'
import climateHintBack from '../assets/2018/wearher/bg_card2.png'
import climateNotebookBg from '../assets/2018/wearher/hintbook.png'

// quiz1(자료 카드 + 선지) / quiz2(선지만) 화면은 두 사이트가 같은 템플릿을 공유한다.
// 참고: cqi는 항상 컨테이너 "너비" 기준이므로, 1920x1080 기준 이미지에서 세로(top/height) 값은
// 픽셀을 1080이 아니라 1920으로 나눠 변환해야 한다 (px/1920*100).
const QUIZ1_BOX = { left: '50.50cqi', top: '18.80cqi', width: '48.40cqi', height: '5.52cqi' }
const QUIZ1_OPTION_BOXES = [
  QUIZ1_BOX,
  { ...QUIZ1_BOX, top: '25.68cqi' },
  { ...QUIZ1_BOX, top: '32.55cqi' },
]
// 기후분석센터 quiz1 배경은 같은 템플릿이지만 신문기사 내용 길이가 달라 선지 위치가 조금 더 아래에 있다.
const CLIMATE_QUIZ1_BOX = { left: '50.50cqi', top: '21.30cqi', width: '43.75cqi', height: '5.52cqi' }
const CLIMATE_QUIZ1_OPTION_BOXES = [
  CLIMATE_QUIZ1_BOX,
  { ...CLIMATE_QUIZ1_BOX, top: '28.18cqi' },
  { ...CLIMATE_QUIZ1_BOX, top: '35.05cqi' },
]
// 기상관측소/기후분석센터 quiz2 배경 이미지가 서로 달라서(선택지 픽셀 좌표가 다름) 따로 잡는다.
const WEATHER_QUIZ2_OPTION_BOXES = [
  { left: '22.86cqi', top: '19.43cqi', width: '54.27cqi', height: '7.40cqi' },
  { left: '22.86cqi', top: '27.45cqi', width: '54.27cqi', height: '7.40cqi' },
  { left: '22.86cqi', top: '35.47cqi', width: '54.27cqi', height: '7.40cqi' },
]
const CLIMATE_QUIZ2_OPTION_BOXES = [
  { left: '25.47cqi', top: '20.16cqi', width: '51.77cqi', height: '4.38cqi' },
  { left: '25.47cqi', top: '27.03cqi', width: '51.77cqi', height: '4.38cqi' },
  { left: '25.47cqi', top: '33.91cqi', width: '51.77cqi', height: '4.38cqi' },
]
const NEXT_BOX = { left: '41.40cqi', top: '38.53cqi', width: '17.20cqi', height: '4.16cqi' }
// quiz2 정답 화면은 해설 길이에 따라 "획득한 단서 보기" 버튼 위치가 더 아래로 내려가기도 한다.
const HINT_BOX_SHORT = NEXT_BOX
const HINT_BOX_LONG = { left: '41.40cqi', top: '46.60cqi', width: '17.20cqi', height: '3.60cqi' }
const RETRY_BOX = { right: '5.5cqi', bottom: '5cqi' }
const HINT_HOTSPOT_BOX = { left: '28%', top: '71%', width: '40%', height: '10%' }
const NOTEBOOK_RETURN_BOX = { left: '83.3cqi', top: '1.92cqi', width: '12.8cqi', height: '3.71cqi' }

// 사이트 소개(대화) 배경엔 이미 회색 바+건물이름이 그려져 있으므로 bare 모드로
// 코드가 그리는 기본 바/화자이름을 끄고, 대사 텍스트만 그 바 위에 얹는다.
const SITE_INTRO_BAR_BOX = {
  left: '3.91%', top: '67.69%', width: '92.14%', height: '29.91%', right: 'auto', bottom: 'auto',
  justifyContent: 'flex-start', paddingTop: '2.83%', paddingLeft: '17.81%',
}

const case2018 = {
  key: '2018',
  backendCaseId: '2018_heatwave',
  ready: true,

  notebook: {
    pages: [emptyhintbook1, emptyhintbook2, emptyhintbook3],
    tabs: [
      { label: '기상 관측소', pageIndex: 1 },
      { label: '기후분석센터', pageIndex: 2 },
    ],
    // 이 케이스의 노트북 페이지 그림에는 버튼이 안 그려져 있어서 코드로 직접 그려준다.
    finishButton: { left: '88.54cqi', top: '1.35cqi', width: '9.5cqi', height: '3.8cqi' },
    // 기상관측소 페이지(인덱스 1) 오른쪽에 "조사를 통해 자료를 채워주세요" 문구가 안 그려져 있어서 직접 얹는다.
    pageOverlays: {
      1: [
        { src: notebookFillText, style: { left: '64.45cqi', top: '23.09cqi', width: '12.5cqi', height: '2.42cqi' } },
      ],
    },
  },

  map: {
    background: mapBg,
    sites: [
      {
        id: 'weather',
        label: '기상관측소',
        image: weatherBuilding,
        box: { left: '25%', top: '42%', width: '25.0%', height: '36.7%' },
        stampScale: 0.7,
      },
      {
        id: 'climate',
        label: '기후분석센터',
        image: climateBuilding,
        box: { left: '55%', top: '20%', width: '20.8%', height: '34.0%' },
        stampScale: 0.7,
      },
    ],
  },

  caseFinale: {
    background: mapCompleteBg,
    lines: [
      '훌륭한 자료조사구만!',
      '{nickname} 자네는 조수의 자격이 충분해!',
      '이제 찾은 단서를 토대로 범인을 찾아 보게나!',
    ],
    // map_complete.png 위에 코드로 그리는 어두운 반투명 바 + "네!" 버튼 위치
    // (Figma 실측: 1944x1094 캔버스 기준 Rectangle 4123 / "네!" 버튼 좌표).
    barBox: {
      left: '3.86%', top: '66.18%', width: '91.0%', height: '26.78%', right: 'auto', bottom: 'auto',
      background: 'rgba(38, 38, 38, 0.7)', backdropFilter: 'blur(4.2px)', borderRadius: '1.03cqi',
    },
    // "네!" 버튼은 .dialogue-bar(위 barBox) 안에서 position:absolute이므로,
    // 캔버스 절대좌표가 아니라 바의 좌상단 기준 상대좌표로 넣어야 한다: (1679-75)/1944, (946-724)/1944.
    buttonBox: { left: '82.51cqi', top: '11.42cqi', right: 'auto', bottom: 'auto' },
    buttonLabel: '네!',
  },

  board: {
    board1: board1Bg,
    board2: board2Bg,
    board3: board3Bg,
    board4: board4Bg,
    board5: board5Bg,
    board6: board6Bg,
    hintBookPages: [hintbook1, hintbook2],
    gisang: gisangImg,
    reactionText: '그래서 그랬던 거군',
    evidence: [
      { id: 'evi1', src: evi1Img, wrongSrc: evi1WrongImg, w: 374, h: 152 },
      { id: 'evi2', src: evi2Img, wrongSrc: evi2WrongImg, w: 486, h: 229 },
      { id: 'evi3', src: evi3Img, wrongSrc: evi3WrongImg, w: 267, h: 154 },
    ],
    // board1.png(1920x1080) 기준 픽셀 좌표를 cqi로 환산 (evi2->box1, evi1->box2, evi3->box3 순서가 정답).
    boxes: [
      { id: 'box1', style: { left: '15.21cqi', top: '9.64cqi', width: '14.84cqi', height: '7.97cqi' }, widthPx: 285, heightPx: 153 },
      { id: 'box2', style: { left: '39.53cqi', top: '29.17cqi', width: '15.00cqi', height: '6.61cqi' }, widthPx: 288, heightPx: 127 },
      { id: 'box3', style: { left: '70.83cqi', top: '28.80cqi', width: '15.26cqi', height: '7.14cqi' }, widthPx: 293, heightPx: 137 },
    ],
    confirmBtn: { left: '85.83cqi', top: '50.05cqi', width: '11.88cqi', height: '3.80cqi' },
    nextLink: { left: '85.68cqi', top: '47.50cqi', width: '8.91cqi', height: '4.32cqi' },
    reactionBox: { left: '25.36cqi', top: '45.05cqi', width: '44.22cqi', height: '7.76cqi' },
    // board4.png는 2020과 달리 1920x1080(1배) 해상도, board5~6.png는 3840x2160(2배).
    finalChoice: {
      correct: { label: '북태평양 고기압', box: { left: '16.51cqi', top: '20.57cqi', width: '32.45cqi', height: '30.99cqi' } },
      wrong: { label: '엘니뇨', box: { left: '50.68cqi', top: '20.57cqi', width: '32.66cqi', height: '30.99cqi' } },
    },
    retryBtn: { left: '41.82cqi', top: '44.74cqi', width: '16.28cqi', height: '4.61cqi' },
    climateCompareBtn: { left: '76.82cqi', top: '49.74cqi', width: '18.36cqi', height: '3.26cqi' },
  },

  // today3(결론 화면)는 아직 준비 전이라 today1/today2만 넣는다 — ClimateCompareScreen이
  // assets.today3가 없으면 "결론 보러가기" 버튼/결론 화면을 자동으로 건너뛴다.
  climateCompare: {
    today1: today1Bg,
    today2: today2Bg,
    today3: today3Bg,
    today3Title1, // 안 비슷할 때 ("다행히 오늘은 다른 조건이야!")
    today3Title2, // 비슷할 때 ("사실 오늘도 비슷한 조건이야!")
    today3High, // 비슷할 때 결론 리본 ("...가능성 높음")
    today3Low, // 안 비슷할 때 결론 리본 ("...가능성 낮음")
    solution: solutionBg,
  },

  sites: {
    weather: {
      dialogue: {
        background: weatherGisangBg,
        speaker: '기상관측소',
        bare: true,
        barBox: SITE_INTRO_BAR_BOX,
        lines: [
          '안녕하세요 {nickname} 조수님.',
          '저희 기상관측소는 지상 부근의 대기 상태를 관측하는 곳입니다',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ],
      },
      quiz: {
        background: weatherQuiz1Bg,
        tipImage: weatherQuiz1Tip,
        options: [
          { label: '하루 동안 햇빛이 지표를 비추는 시간이 평년보다 길어졌다.', outcome: 'correct', box: QUIZ1_OPTION_BOXES[0] },
          { label: '하루 동안 햇빛이 지표를 비추는 시간이 평년과 비슷하였다.', outcome: 'wrong1', box: QUIZ1_OPTION_BOXES[1] },
          { label: '하루 동안 햇빛이 지표를 비추는 시간이 평년보다 짧아졌다.', outcome: 'wrong2', box: QUIZ1_OPTION_BOXES[2] },
        ],
      },
      wrong1: { background: weatherQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      wrong2: { background: weatherQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      correct: { background: weatherQuiz1CorrectBg, nextBox: NEXT_BOX },
      quiz2: {
        background: weatherQuiz2Bg,
        options: [
          { label: '지표가 흡수하는 태양 에너지가 감소한다.', outcome: 'wrong3a', box: WEATHER_QUIZ2_OPTION_BOXES[0] },
          { label: '지표에 많은 열이 축적된다.', outcome: 'correct', box: WEATHER_QUIZ2_OPTION_BOXES[1] },
          { label: '지표의 열이 빠르게 방출된다.', outcome: 'wrong3b', box: WEATHER_QUIZ2_OPTION_BOXES[2] },
        ],
      },
      wrong3a: { background: weatherQuiz2Wrong1Bg, retryTarget: 'quiz2', retryBox: RETRY_BOX },
      wrong3b: { background: weatherQuiz2Wrong2Bg, retryTarget: 'quiz2', retryBox: RETRY_BOX },
      correct2: { background: weatherQuiz2CorrectBg, hintBox: HINT_BOX_LONG },
      hint: { background: weatherHintBg, frontImage: weatherHintFront, backImage: weatherHintBack, hotspotBox: HINT_HOTSPOT_BOX },
      notebook: { background: weatherNotebookBg, returnBox: NOTEBOOK_RETURN_BOX },
    },

    climate: {
      dialogue: {
        background: climateGisangBg,
        speaker: '기후분석센터',
        bare: true,
        barBox: { ...SITE_INTRO_BAR_BOX, paddingTop: '2%' },
        lines: [
          '안녕하세요 {nickname} 조수님.',
          '저희 기후분석센터(기상청)는 대한민국의 기상 및 기후에 대한 관측, 연구 및 예보를 실시하는 일을 합니다. 저희가 드리는 단서를 갖고 추리해보세요!',
        ],
      },
      quiz: {
        background: climateQuiz1Bg,
        tipImage: climateQuiz1Tip,
        options: [
          { label: '구름량이 증가한다.', outcome: 'wrong1', box: CLIMATE_QUIZ1_OPTION_BOXES[0] },
          { label: '구름량에 큰 변화가 없다.', outcome: 'wrong2', box: CLIMATE_QUIZ1_OPTION_BOXES[1] },
          { label: '구름량이 감소한다.', outcome: 'correct', box: CLIMATE_QUIZ1_OPTION_BOXES[2] },
        ],
      },
      wrong1: { background: climateQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      wrong2: { background: climateQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      correct: { background: climateQuiz1CorrectBg, nextBox: NEXT_BOX },
      quiz2: {
        background: climateQuiz2Bg,
        options: [
          { label: '햇빛이 지표에 도달하는 시간이 줄어든다.', outcome: 'wrong3a', box: CLIMATE_QUIZ2_OPTION_BOXES[0] },
          { label: '비가 내리는 날이 늘어난다.', outcome: 'wrong3b', box: CLIMATE_QUIZ2_OPTION_BOXES[1] },
          { label: '맑은 날이 지속된다.', outcome: 'correct', box: CLIMATE_QUIZ2_OPTION_BOXES[2] },
        ],
      },
      wrong3a: { background: climateQuiz2Wrong1Bg, retryTarget: 'quiz2', retryBox: RETRY_BOX },
      wrong3b: { background: climateQuiz2Wrong2Bg, retryTarget: 'quiz2', retryBox: RETRY_BOX },
      correct2: { background: climateQuiz2CorrectBg, hintBox: HINT_BOX_SHORT },
      hint: { background: climateHintBg, frontImage: climateHintFront, backImage: climateHintBack, hotspotBox: HINT_HOTSPOT_BOX },
      notebook: { background: climateNotebookBg, returnBox: NOTEBOOK_RETURN_BOX },
    },
  },
}

export default case2018
