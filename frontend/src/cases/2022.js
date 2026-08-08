// 2022년 수도권 집중호우 사건의 모든 케이스별 콘텐츠(이미지, 텍스트, 목소리 등).
// 화면 배치(좌표)와 화면 전환 로직은 App.jsx의 공통 코드로 남아있고,
// 이 파일은 "그림과 글자"만 담당한다.
// 아직 해양관측소/국가태풍센터 사이트만 만들었고, 위성센터/수사보드/기후비교는 추후 추가 예정.

import emptyhintbook1 from '../assets/2022/emptyhintbook1.png'
import emptyhintbook2 from '../assets/2022/emptyhintbook2.png'
import emptyhintbook3 from '../assets/2022/emptyhintbook3.png'
import emptyhintbook4 from '../assets/2022/emptyhintbook4.png'
import startInvestigationBg from '../assets/2022/Start_investigation.png'

import mapBg from '../assets/2018/map.png'
import mapCompleteBg from '../assets/2022/map_complete.png'
import oceanBuilding from '../assets/2022/building2.png'
import typhoonBuilding from '../assets/2022/building1.png'
import satelliteBuilding from '../assets/2022/building3.png'

import today1Bg from '../assets/2020/common/today1.png'
import today2Bg from '../assets/2020/common/today2.png'
import today3Bg from '../assets/2022/today.png'
import today3Title1 from '../assets/2022/title_low.png'
import today3Title2 from '../assets/2022/title_high.png'
import today3High from '../assets/2022/title2_high.png'
import today3Low from '../assets/2022/title2_low.png'
import solutionBg from '../assets/2022_solution.png'

import oceanDialogueBg from '../assets/2022/ocean/ocean.png'
import oceanQuiz1Bg from '../assets/2022/ocean/quiz1.png'
import oceanQuiz1Wrong1Bg from '../assets/2022/ocean/quiz1_1.png'
import oceanQuiz1CorrectBg from '../assets/2022/ocean/quiz1_2.png'
import oceanQuiz1Wrong2Bg from '../assets/2022/ocean/quiz1_3.png'
import oceanHintBg from '../assets/2022/ocean/background.png'
import oceanHintFront from '../assets/2022/ocean/bg_card1.png'
import oceanHintBack from '../assets/2022/ocean/bg_card2.png'
import oceanNotebookBg from '../assets/2022/ocean/hintbook.png'

import typhoonDialogueBg from '../assets/2022/typhoon/typoon.png'
import typhoonQuiz1Bg from '../assets/2022/typhoon/quiz1.png'
import typhoonQuiz1CorrectBg from '../assets/2022/typhoon/quiz1_1.png'
import typhoonQuiz1Wrong1Bg from '../assets/2022/typhoon/quiz1_2.png'
import typhoonQuiz1Wrong2Bg from '../assets/2022/typhoon/quiz1_3.png'
import typhoonHintBg from '../assets/2022/typhoon/background.png'
import typhoonHintFront from '../assets/2022/typhoon/bg_card1.png'
import typhoonHintBack from '../assets/2022/typhoon/bg_card2.png'
import typhoonNotebookBg from '../assets/2022/typhoon/hintbook.png'

import satelliteDialogueBg from '../assets/2022/satellite/satellite.png'
import satelliteQuiz1Bg from '../assets/2022/satellite/quiz1.png'
import satelliteQuiz1Wrong1Bg from '../assets/2022/satellite/quiz1_1.png'
import satelliteQuiz1Wrong2Bg from '../assets/2022/satellite/quiz1_2.png'
import satelliteQuiz1CorrectBg from '../assets/2022/satellite/quiz1_3.png'
import satelliteHintBg from '../assets/2022/satellite/background.png'
import satelliteHintFront from '../assets/2022/satellite/bg_card1.png'
import satelliteHintBack from '../assets/2022/satellite/bg_card2.png'
import satelliteNotebookBg from '../assets/2022/satellite/hintbook.png'

import board1Bg from '../assets/2022/board1.png'
import board2Bg from '../assets/2022/board2.png'
import board3Bg from '../assets/2022/board3.png'
import board4Bg from '../assets/2022/board4.png'
// 주의: board5.png 파일 안에는 실제로 "오답" 그림이, board6.png 파일 안에는 "정답" 그림이 들어있다
// (파일명과 내용이 서로 바뀜). BoardScreen.jsx는 board5=정답/board6=오답 화면으로 고정돼있으므로
// import 파일을 서로 바꿔서 맞춘다.
import board5Bg from '../assets/2022/board6.png'
import board6Bg from '../assets/2022/board5.png'
import hintbookPage1 from '../assets/2022/hintbook1.png'
import hintbookPage2 from '../assets/2022/hintbook2.png'
import hintbookPage3 from '../assets/2022/hintbook3.png'
import evi1Img from '../assets/2022/evi1.png'
import evi2Img from '../assets/2022/evi2.png'
import evi3Img from '../assets/2022/evi3.png'
import evi1WrongImg from '../assets/2022/evi1_x.png'
import evi2WrongImg from '../assets/2022/evi2_x.png'
import evi3WrongImg from '../assets/2022/evi3_x.png'
import gisangImg from '../assets/2020/common/gisang.png'

// 해양관측소/국가태풍센터 대화 화면(ocean.png, typoon.png)은 같은 템플릿이라 바 위치가 동일하다.
// 바 자체는 이미지에 이미 그려져 있어 bare 모드로, 위치만 이 값으로 덮어쓴다
// (stage 바로 아래 자식이라 cqi 아닌 일반 %를 쓴다).
// padding/justifyContent는 바 안에서 "대사 텍스트"가 시작하는 위치 — 화자명(예: 국가태풍센터)은
// 이미지에 이미 그려져 있고 code는 렌더링하지 않으므로, 대사가 화자명 바로 옆에서 시작하도록
// 화자명 기준이 아니라 대사 텍스트 자체의 Figma 좌표로 padding을 계산해야 한다.
// Figma 실측(ocean, 1920x1080 기준): 바 left=75,top=731,w=1769,h=323 / 대사 left=390,top=781
// -> paddingLeft=(390-75)/1769=17.81%, paddingTop=(781-731)/1769=2.83%
const SITE_INTRO_BAR_BOX = {
  left: '3.91%', top: '67.69%', width: '92.14%', height: '29.91%', right: 'auto', bottom: 'auto',
  justifyContent: 'flex-start', paddingTop: '2.83%', paddingLeft: '17.81%',
}
// 위성센터(satellite.png)는 바 크기가 조금 다르다(같은 템플릿이지만 상단이 15px 더 높음).
// Figma 실측: 바 left=75,top=716,w=1769,h=338 / 대사 left=410,top=759
// -> paddingLeft=(410-75)/1769=18.93%, paddingTop=(759-716)/1769=2.43%
const SATELLITE_BAR_BOX = {
  left: '3.91%', top: '66.30%', width: '92.14%', height: '31.30%', right: 'auto', bottom: 'auto',
  justifyContent: 'flex-start', paddingTop: '2.43%', paddingLeft: '18.93%',
}
const RETRY_BOX = { right: '7cqi', bottom: '6cqi' }
const NOTEBOOK_RETURN_BOX = { left: '85.10cqi', top: '2.03cqi', width: '12.76cqi', height: '3.85cqi' }

const case2022 = {
  key: '2022',
  backendCaseId: '2022_flood',
  ready: true,

  notebook: {
    pages: [emptyhintbook1, emptyhintbook2, emptyhintbook3, emptyhintbook4],
    tabs: [
      { label: '해양관측소', pageIndex: 1 },
      { label: '국가태풍센터', pageIndex: 2 },
      { label: '위성센터', pageIndex: 3 },
    ],
    // 모든 페이지 우상단에 있는 "조사 시작하기" 버튼 (페이지 상관없이 항상 같은 위치).
    finishBox: { left: '86.0cqi', top: '2.03cqi', width: '11.88cqi', height: '3.85cqi' },
  },

  // "다른 배경 없이 글자만" — 바가 이미 이미지에 그려져 있어 bare + 정확한 바 위치만 지정.
  startInvestigation: {
    background: startInvestigationBg,
    lines: [
      '나는 시간이 없어서 말이지...',
      '자네가 대신 현장조사를 나가서 증거들을 찾아주게!!',
    ],
    buttonLabel: '네! 열심히 해볼게요',
    barBox: { left: '3.96%', top: '71.30%', width: '92.03%', height: '24.54%', right: 'auto', bottom: 'auto', paddingLeft: '14cqi', paddingBottom: '4cqi' },
    nextScreen: 'map',
  },

  map: {
    background: mapBg,
    sites: [
      { id: 'ocean', label: '해양관측소', image: oceanBuilding, box: { left: '25.57%', top: '15.82%', width: '12.96%', height: '26.14%' }, stampScale: 0.75 },
      { id: 'typhoon', label: '국가태풍센터', image: typhoonBuilding, box: { left: '26.44%', top: '54.48%', width: '25.15%', height: '26.24%' }, stampScale: 0.75 },
      { id: 'satellite', label: '위성센터', image: satelliteBuilding, box: { left: '57.0%', top: '14.72%', width: '16.82%', height: '31.35%' }, stampScale: 0.75 },
    ],
  },

  caseFinale: {
    background: mapCompleteBg,
    bare: true,
    lines: [
      '훌륭한 자료조사구만!',
      '{nickname} 자네는 조수의 자격이 충분해!',
      '이제 찾은 단서를 토대로 범인을 찾아 보게나!',
    ],
    buttonLabel: '네!',
    // map_complete.png(1920x1090) 실측: 바 top=743,height=347(전체 너비) / "기상이" 라벨
    // left=148,top=790 -> 대사는 라벨 옆에서 시작하도록 paddingLeft/paddingTop으로 위치 지정.
    barBox: {
      left: '0%', top: '68.17%', width: '100%', height: '31.83%', right: 'auto', bottom: 'auto',
      justifyContent: 'flex-start', paddingTop: '2.45%', paddingLeft: '17.08%',
    },
    buttonBox: { right: '7cqi', bottom: '5cqi' },
  },

  climateCompare: {
    today1: today1Bg,
    today2: today2Bg,
    today3: today3Bg,
    today3Title1, // 안 비슷할 때 ("다행히 오늘은 다른 조건이야!")
    today3Title2, // 비슷할 때 ("사실 오늘도 비슷한 조건이야!")
    today3High, // 비슷할 때 결론 리본
    today3Low, // 안 비슷할 때 결론 리본
    metricValueOffsetY: 57.6, // "높음"/"발생하지 않음" 텍스트를 3cqi(1920 기준) 위로
    solution: solutionBg,
  },

  board: {
    board1: board1Bg,
    board2: board2Bg,
    board3: board3Bg,
    board4: board4Bg,
    board5: board5Bg,
    board6: board6Bg,
    hintBookPages: [hintbookPage1, hintbookPage2, hintbookPage3],
    hintBookTabs: [
      { label: '해양관측소', pageIndex: 0 },
      { label: '국가태풍센터', pageIndex: 1 },
      { label: '위성센터', pageIndex: 2 },
    ],
    gisang: gisangImg,
    reactionText: '그래서 그랬던 거군',
    evidence: [
      { id: 'evi1', src: evi1Img, wrongSrc: evi1WrongImg, w: 484, h: 152 },
      { id: 'evi2', src: evi2Img, wrongSrc: evi2WrongImg, w: 437, h: 157 },
      { id: 'evi3', src: evi3Img, wrongSrc: evi3WrongImg, w: 545, h: 158 },
    ],
    // board1.png(1920x1080) 기준 픽셀 좌표를 cqi로 환산 (evi1->box1, evi2->box2, evi3->box3가 정답).
    boxes: [
      { id: 'box1', style: { left: '15.36cqi', top: '9.84cqi', width: '15.16cqi', height: '7.97cqi' }, widthPx: 291, heightPx: 153 },
      { id: 'box2', style: { left: '39.58cqi', top: '29.58cqi', width: '15.05cqi', height: '7.14cqi' }, widthPx: 289, heightPx: 137 },
      { id: 'box3', style: { left: '72.66cqi', top: '26.25cqi', width: '14.74cqi', height: '8.85cqi' }, widthPx: 283, heightPx: 170 },
    ],
    confirmBtn: { left: '85.83cqi', top: '50.05cqi', width: '11.82cqi', height: '3.80cqi' },
    nextLink: { left: '85.68cqi', top: '47.50cqi', width: '8.91cqi', height: '4.32cqi' },
    reactionBox: { left: '25.36cqi', top: '45.05cqi', width: '44.22cqi', height: '7.76cqi' },
    // board4.png는 1920x1080(1배), board5~6.png(=위에서 서로 바꿔 넣은 파일)는 3840x2160(2배).
    finalChoice: {
      wrong: { label: '북태평양 고기압', box: { left: '16.51cqi', top: '20.42cqi', width: '32.29cqi', height: '30.94cqi' } },
      correct: { label: '따뜻한 해역', box: { left: '50.68cqi', top: '20.42cqi', width: '32.24cqi', height: '30.94cqi' } },
    },
    retryBtn: { left: '41.82cqi', top: '44.74cqi', width: '16.28cqi', height: '3.78cqi' },
    climateCompareBtn: { left: '76.82cqi', top: '50.00cqi', width: '18.49cqi', height: '3.39cqi' },
  },

  sites: {
    ocean: {
      dialogue: {
        background: oceanDialogueBg,
        speaker: '해양관측소',
        bare: true,
        barBox: SITE_INTRO_BAR_BOX,
        lines: [
          '안녕하세요 {nickname} 조수님.',
          '해양관측소는 바닷물의 흐름과 수온, 염분 등 우리바다에 대한 기초적인',
          '조사를 수행하는 곳입니다. 저희가 드리는 단서를 갖고 추리해보세요!',
        ],
        voiceName: '인준',
      },
      quiz: {
        background: oceanQuiz1Bg,
        options: [
          { label: '태풍의 세력이 점차 약해질 것이다.', outcome: 'wrong1', box: { left: '43.39cqi', top: '22.50cqi', width: '42.40cqi', height: '7.03cqi' } },
          { label: '태풍은 따뜻한 해역에서 많은 열과 수증기를 지속적으로 공급받을 수 있다.', outcome: 'correct', box: { left: '43.39cqi', top: '30.10cqi', width: '42.40cqi', height: '7.03cqi' } },
          { label: '태풍은 육지에서 많은 열과 수증기를 공급받을 것이다.', outcome: 'wrong2', box: { left: '43.39cqi', top: '37.71cqi', width: '42.40cqi', height: '7.08cqi' } },
        ],
      },
      wrong1: { background: oceanQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      wrong2: { background: oceanQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      correct: { background: oceanQuiz1CorrectBg, hintBox: { left: '41.35cqi', top: '37.76cqi', width: '17.34cqi', height: '3.80cqi' } },
      hint: {
        background: oceanHintBg,
        frontImage: oceanHintFront,
        backImage: oceanHintBack,
        hotspotBox: { left: '32.96%', top: '74.19%', width: '33.88%', height: '8.94%' },
      },
      notebook: { background: oceanNotebookBg, returnBox: NOTEBOOK_RETURN_BOX },
    },

    typhoon: {
      dialogue: {
        background: typhoonDialogueBg,
        speaker: '국가태풍센터',
        bare: true,
        barBox: SITE_INTRO_BAR_BOX,
        lines: [
          '안녕하세요 {nickname}조수님.',
          '저희 국가태풍센터는 기상청에 소속되어, 우리나라 태풍 감시을 감시하고',
          '예보하는 기관입니다. 저희가 드리는 단서를 갖고 추리해보세요!',
        ],
        voiceName: 'Hyunsu Multilingual',
      },
      quiz: {
        background: typhoonQuiz1Bg,
        options: [
          { label: '힌남노는 여러 날 동안 강한 세력을 유지하였다.', outcome: 'correct', box: { left: '41.82cqi', top: '21.82cqi', width: '42.40cqi', height: '6.98cqi' } },
          { label: '힌남노는 시간이 지날수록 빠르게 약해졌다.', outcome: 'wrong1', box: { left: '41.82cqi', top: '29.43cqi', width: '42.40cqi', height: '6.98cqi' } },
          { label: '힌남노는 여러 날 동안 약한 태풍의 세력을 유지하였다', outcome: 'wrong2', box: { left: '41.82cqi', top: '37.03cqi', width: '42.40cqi', height: '7.03cqi' } },
        ],
      },
      wrong1: { background: typhoonQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      wrong2: { background: typhoonQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      correct: { background: typhoonQuiz1CorrectBg, hintBox: { left: '41.35cqi', top: '38.65cqi', width: '17.34cqi', height: '3.80cqi' } },
      hint: {
        background: typhoonHintBg,
        frontImage: typhoonHintFront,
        backImage: typhoonHintBack,
        hotspotBox: { left: '31.94%', top: '71.99%', width: '33.88%', height: '8.94%' },
      },
      notebook: { background: typhoonNotebookBg, returnBox: NOTEBOOK_RETURN_BOX },
    },

    satellite: {
      dialogue: {
        background: satelliteDialogueBg,
        speaker: '위성센터',
        bare: true,
        barBox: SATELLITE_BAR_BOX,
        lines: [
          '안녕하세요 {nickname} 조수님.',
          '저희 위성센터(국가기상위성센터)는 기상위성으로 촬영한 영상을',
          '분석하여 대기 상태를 관측합니다. 저희가 드리는 단서를 갖고 추리해보세요!',
        ],
        voiceName: '선히',
      },
      quiz: {
        background: satelliteQuiz1Bg,
        options: [
          { label: '힌남노 주변의 대류가 약해져 구름이 점차 사라지고 있다', outcome: 'wrong1', box: { left: '50.57cqi', top: '21.35cqi', width: '42.14cqi', height: '6.46cqi' } },
          { label: '힌남노는 육지에서 열과 수증기를 공급받고 있다', outcome: 'wrong2', box: { left: '50.57cqi', top: '28.02cqi', width: '42.14cqi', height: '6.46cqi' } },
          { label: '힌남노에서는 강한 대류가 지속되고 있다.', outcome: 'correct', box: { left: '50.57cqi', top: '34.64cqi', width: '42.14cqi', height: '6.46cqi' } },
        ],
      },
      wrong1: { background: satelliteQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      wrong2: { background: satelliteQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: RETRY_BOX },
      correct: { background: satelliteQuiz1CorrectBg, hintBox: { left: '41.35cqi', top: '38.65cqi', width: '17.34cqi', height: '3.80cqi' } },
      hint: {
        background: satelliteHintBg,
        frontImage: satelliteHintFront,
        backImage: satelliteHintBack,
        hotspotBox: { left: '31.94%', top: '73%', width: '33.88%', height: '8.94%' },
      },
      notebook: { background: satelliteNotebookBg, returnBox: NOTEBOOK_RETURN_BOX },
    },
  },
}

export default case2022
