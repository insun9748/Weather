// 2020년 역대 최장 장마 사건의 모든 케이스별 콘텐츠(이미지, 텍스트, 목소리 등).
// 화면 배치(좌표)와 화면 전환 로직은 App.jsx / BoardScreen.jsx / ClimateCompareScreen.jsx에
// 공통 코드로 남아있고, 이 파일은 "그림과 글자"만 담당한다.
// 2018/2022 사건을 추가할 때는 이 파일을 복사해서 이미지 경로와 텍스트만 바꾸면 된다.

import caseFileBg from '../assets/page4.png'
import briefingBg from '../assets/2020/common/page9.png'

import mapBg from '../assets/2020/common/map1.png'
import oceanBuilding from '../assets/2020/common/building1.png'
import satelliteBuilding from '../assets/2020/common/building2.png'
import weatherBuilding from '../assets/2020/common/building3.png'
import mapDetective from '../assets/2020/common/map_gisang.png'

import notebookCasePage from '../assets/2020/common/page5.png'
import notebookOceanPage from '../assets/2020/common/page6.png'
import notebookWeatherPage from '../assets/2020/common/page7.png'
import notebookSatellitePage from '../assets/2020/common/page8.png'

import oceanStationBg from '../assets/2020/ocean/b1_p1.png'
import oceanQuizBg from '../assets/2020/ocean/b1_p2.png'
import oceanQuiz1Tip from '../assets/2020/ocean/quiz1_tip.png'
import oceanQuiz1Wrong1Bg from '../assets/2020/ocean/b1_p3.png'
import oceanQuiz1CorrectBg from '../assets/2020/ocean/b1_p4.png'
import oceanQuiz1Wrong2Bg from '../assets/2020/ocean/b1_p4_2.png'
import oceanQuiz2Bg from '../assets/2020/ocean/b1_p5.png'
import oceanCorrect2Bg from '../assets/2020/ocean/b1_p6.png'
import oceanWrong2aBg from '../assets/2020/ocean/b1_p7.png'
import oceanWrong2bBg from '../assets/2020/ocean/b1_p8.png'
import oceanHintBg from '../assets/2020/ocean/b1_p9.png'
import oceanHintFront from '../assets/2020/ocean/b1_p9_hint1.png'
import oceanHintBack from '../assets/2020/ocean/b1_p9_hint2.png'
import oceanNotebookBg from '../assets/2020/ocean/b1_p10.png'
// 이 사이트는 원래 해양관측소였다가 기후분석센터로 콘텐츠가 바뀜 — 목소리도 기후분석센터 것으로 교체.
import oceanSiteVoice from '../assets/sounds/기후분석센터.mp3'
import oceanSiteAmbient from '../assets/sounds/바람소리.wav'

import weatherStationBg from '../assets/2020/weather/p1.png'
import weatherQuizBg from '../assets/2020/weather/p2.png'
import weatherQuiz1Tip from '../assets/2020/weather/quiz1_tip.png'
import weatherWrong1Bg from '../assets/2020/weather/p3.png'
import weatherWrong2Bg from '../assets/2020/weather/p4.png'
import weatherQuiz2Bg from '../assets/2020/weather/p5.png'
import weatherVapor2020 from '../assets/2020/weather/2020-07-23.webm'
import weatherVapor2021 from '../assets/2020/weather/2021-07-23.webm'
import weatherCorrectBg from '../assets/2020/weather/p8.png'
import weatherCorrect2Bg from '../assets/2020/weather/p6.png'
import weatherWrong3Bg from '../assets/2020/weather/p7.png'
import weatherHintBg from '../assets/2020/weather/p9.png'
import weatherHintFront from '../assets/2020/weather/p9_hint1.png'
import weatherHintBack from '../assets/2020/weather/p9_hint2.png'
import weatherNotebookBg from '../assets/2020/weather/p10.png'

import satelliteStationBg from '../assets/2020/satellite/p1.png'
import satelliteQuizBg from '../assets/2020/satellite/p2.png'
import satelliteQuiz1Tip from '../assets/2020/satellite/quiz1_tip.png'
import satelliteZoomBg from '../assets/2020/satellite/p3.png'
import satelliteWrong1Bg from '../assets/2020/satellite/p4.png'
import satelliteCorrectBg from '../assets/2020/satellite/p5.png'
import satelliteWrong2Bg from '../assets/2020/satellite/p6.png'
import satelliteHintBg from '../assets/2020/satellite/p7.png'
import satelliteHintFront from '../assets/2020/satellite/p7_hint1.png'
import satelliteHintBack from '../assets/2020/satellite/p7_hint2.png'
import satelliteNotebookBg from '../assets/2020/satellite/p8.png'
import caseFinaleBg from '../assets/2020/satellite/p9.png'

import board1Bg from '../assets/2020/common/board1.png'
import board2Bg from '../assets/2020/common/board2.png'
import board3Bg from '../assets/2020/common/board3.png'
import board4Bg from '../assets/2020/common/board4.png'
import board5Bg from '../assets/2020/common/board5.png'
import board6Bg from '../assets/2020/common/board6.png'
import boardBook1 from '../assets/2020/common/board_book1.png'
import boardBook2 from '../assets/2020/common/board_book2.png'
import boardBook3 from '../assets/2020/common/board_book3.png'
import evi1Img from '../assets/2020/common/evi1.png'
import evi2Img from '../assets/2020/common/evi2.png'
import evi3Img from '../assets/2020/common/evi3.png'
import evi1WrongImg from '../assets/2020/common/evi1_x.png'
import evi2WrongImg from '../assets/2020/common/evi2_x.png'
import evi3WrongImg from '../assets/2020/common/evi3x.png'
import gisangImg from '../assets/2020/common/gisang.png'

import today1Bg from '../assets/2020/common/today1.png'
import today2Bg from '../assets/2020/common/today2.png'
import today3Bg from '../assets/2020/common/today3.png'
import today3Title1 from '../assets/2020/common/today3_title1.png'
import today3Title2 from '../assets/2020/common/today3_title2.png'
import today3High from '../assets/2020/common/today3_high.png'
import today3Low from '../assets/2020/common/today3_low.png'
import solutionBg from '../assets/2020_solution.png'

// 사이트 소개(대화) 배경엔 이미 회색 바+건물이름이 그려져 있으므로 bare 모드로
// 코드가 그리는 기본 바/화자이름을 끄고, 대사 텍스트만 그 바 위에 얹는다.
const SITE_INTRO_BAR_BOX = {
  left: '3.91%', top: '67.69%', width: '92.14%', height: '29.91%', right: 'auto', bottom: 'auto',
  justifyContent: 'flex-start', paddingTop: '2.83%', paddingLeft: '17.81%',
}
const SATELLITE_BAR_BOX = {
  left: '3.91%', top: '66.30%', width: '92.14%', height: '31.30%', right: 'auto', bottom: 'auto',
  justifyContent: 'flex-start', paddingTop: '2.43%', paddingLeft: '18.93%',
}

const case2020 = {
  key: '2020',
  backendCaseId: '2020_jangma',
  ready: true,

  briefing: { background: briefingBg },
  caseFile: { background: caseFileBg },

  notebook: {
    pages: [notebookCasePage, notebookOceanPage, notebookWeatherPage, notebookSatellitePage],
    tabs: [
      { label: '해양 관측소', pageIndex: 1 },
      { label: '기상 관측소', pageIndex: 2 },
      { label: '위성 센터', pageIndex: 3 },
    ],
    // 이 케이스의 노트북 페이지 그림에는 버튼이 안 그려져 있어서 코드로 직접 그려준다.
    finishButton: { left: '88.54cqi', top: '1.35cqi', width: '9.5cqi', height: '3.8cqi' },
  },

  map: {
    background: mapBg,
    detective: {
      image: mapDetective,
      box: { left: '59.69%', top: '69.07%', width: '16.2%', height: '26.49%' },
    },
    sites: [
      {
        id: 'ocean',
        label: '해양관측소',
        image: oceanBuilding,
        box: { left: '25.57%', top: '13.94%', width: '13.88%', height: '28.07%' },
        stampScale: 0.8,
      },
      {
        id: 'weather',
        label: '기상관측소',
        image: weatherBuilding,
        box: { left: '54.69%', top: '21.56%', width: '15.52%', height: '26.88%' },
        stampScale: 0.72,
      },
      {
        id: 'satellite',
        label: '위성센터',
        image: satelliteBuilding,
        box: { left: '30.52%', top: '50.18%', width: '17.08%', height: '31.47%' },
        stampScale: 0.65,
      },
    ],
  },

  caseFinale: {
    background: caseFinaleBg,
    lines: [
      '훌륭한 자료조사구만!',
      '{nickname} 자네는 조수의 자격이 충분해!',
      '이제 찾은 단서를 토대로 범인을 찾아 보게나!',
    ],
    buttonLabel: '네!',
  },

  sites: {
    ocean: {
      dialogue: {
        background: oceanStationBg,
        speaker: '기후분석센터',
        bare: true,
        barBox: SITE_INTRO_BAR_BOX,
        voiceSrc: oceanSiteVoice,
        ambientSrc: oceanSiteAmbient,
        lines: [
          '안녕하세요 {nickname} 조수님',
          '저희 기후분석센터(기상청)는 대한민국의 기상 및 기후에 대한 관측, 연구',
          '및 예보를 실시하는 일을 합니다',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ],
      },
      quiz: {
        background: oceanQuizBg,
        tipImage: oceanQuiz1Tip,
        options: [
          { label: '북태평양고기압이 우리나라 북쪽으로 빠르게 확장했다.', outcome: 'wrong1', box: { left: '45.73cqi', top: '20.99cqi', width: '51.82cqi', height: '7.29cqi' } },
          { label: '북태평양고기압이 북쪽으로 확장하지 못하고 일본 남쪽에 머물렀다.', outcome: 'correct', box: { left: '45.73cqi', top: '29.43cqi', width: '51.82cqi', height: '7.29cqi' } },
          { label: '북태평양고기압이 우리나라 주변에서 완전히 사라졌다.', outcome: 'wrong2', box: { left: '45.73cqi', top: '37.86cqi', width: '51.82cqi', height: '7.29cqi' } },
        ],
      },
      correct: { background: oceanQuiz1CorrectBg, nextBox: { left: '41.41cqi', top: '38.13cqi', width: '17.19cqi', height: '4.06cqi' } },
      quiz2: {
        background: oceanQuiz2Bg,
        options: [
          { label: '장마전선이 빠르게 북쪽으로 이동했다.', outcome: 'wrong2a', box: { left: '22.86cqi', top: '20.16cqi', width: '54.27cqi', height: '5.94cqi' } },
          { label: '장마전선이 한반도 주변에 오래 머물렀다.', outcome: 'correct', box: { left: '22.86cqi', top: '28.18cqi', width: '54.27cqi', height: '5.94cqi' } },
          { label: '장마전선이 빠르게 소멸했다.', outcome: 'wrong2b', box: { left: '22.86cqi', top: '36.20cqi', width: '54.27cqi', height: '5.94cqi' } },
        ],
      },
      correct2: { background: oceanCorrect2Bg, hintBox: { left: '41.35cqi', top: '37.76cqi', width: '17.29cqi', height: '4.64cqi' } },
      wrong1: { background: oceanQuiz1Wrong1Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      wrong2: { background: oceanQuiz1Wrong2Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      wrong2a: { background: oceanWrong2aBg, retryTarget: 'quiz2', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      wrong2b: { background: oceanWrong2bBg, retryTarget: 'quiz2', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      hint: { background: oceanHintBg, frontImage: oceanHintFront, backImage: oceanHintBack, hotspotBox: { left: '32%', top: '78%', width: '38%', height: '10%' } },
      notebook: { background: oceanNotebookBg, returnBox: { left: '86cqi', top: '0.8cqi', width: '15cqi', height: '5cqi' } },
    },

    weather: {
      dialogue: {
        background: weatherStationBg,
        speaker: '기상관측소',
        bare: true,
        barBox: SITE_INTRO_BAR_BOX,
        lines: [
          '안녕하세요 {nickname}조수님.',
          '저희 기상관측소는 지상 부근의 대기 상태를 관측하는 곳입니다',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ],
      },
      quiz: {
        background: weatherQuizBg,
        tipImage: weatherQuiz1Tip,
        options: [
          { label: '북쪽 계열의 바람이 주로 불어 차갑고 건조한 공기가 유입되었다.', outcome: 'wrong1', box: { left: '50.16cqi', top: '21.35cqi', width: '42.40cqi', height: '7.03cqi' } },
          { label: '남쪽 계열의 바람이 주로 불어 남쪽 바다의 따뜻하고 습한 공기가 한반도로 유입되었다.', outcome: 'correct', box: { left: '50.16cqi', top: '28.96cqi', width: '42.40cqi', height: '7.03cqi' } },
          { label: '동쪽 계열의 바람이 주로 불어 장마전선이 약해졌다.', outcome: 'wrong2', box: { left: '50.16cqi', top: '36.56cqi', width: '42.40cqi', height: '7.03cqi' } },
        ],
      },
      wrong1: { background: weatherWrong1Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      wrong2: { background: weatherWrong2Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      correct: { background: weatherCorrectBg, nextBox: { left: '41.35cqi', top: '38.65cqi', width: '17.29cqi', height: '4.64cqi' } },
      quiz2: {
        background: weatherQuiz2Bg,
        videos: [
          { src: weatherVapor2020, left: '6.7cqi', top: '21cqi', width: '20.73cqi', height: '19.69cqi' },
          { src: weatherVapor2021, left: '28cqi', top: '21cqi', width: '20.73cqi', height: '19.69cqi' },
        ],
        options: [
          { label: '2020년에는 더 많은 수증기가 한반도 주변에서 관측된다.', outcome: 'correct', box: { left: '56.67cqi', top: '21.56cqi', width: '34.58cqi', height: '8.59cqi' } },
          { label: '2020년에는 더 적은 수증기가 한반도 주변에서 관측된다.', outcome: 'wrong3', box: { left: '56.67cqi', top: '31.51cqi', width: '34.58cqi', height: '8.59cqi' } },
        ],
      },
      correct2: { background: weatherCorrect2Bg, hintBox: { left: '41.35cqi', top: '38.65cqi', width: '17.29cqi', height: '4.58cqi' } },
      wrong3: { background: weatherWrong3Bg, retryTarget: 'quiz2', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      hint: { background: weatherHintBg, frontImage: weatherHintFront, backImage: weatherHintBack, hotspotBox: { left: '30.62%', top: '75%', width: '33.77%', height: '8.89%' } },
      notebook: { background: weatherNotebookBg, returnBox: { left: '83.95cqi', top: '2.02cqi', width: '14.71cqi', height: '5.65cqi' } },
    },

    satellite: {
      dialogue: {
        background: satelliteStationBg,
        speaker: '위성센터',
        bare: true,
        barBox: SATELLITE_BAR_BOX,
        lines: [
          '안녕하세요 {nickname} 조수님.',
          '저희 위성센터(국가기상위성센터)는 기상위성으로 촬영한 영상을',
          '분석하여 대기 상태를 관측합니다.',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ],
      },
      quiz: {
        background: satelliteQuizBg,
        tipImage: satelliteQuiz1Tip,
        zoomLabel: '자료 확대해서 보기',
        zoomBox: { left: '38.54cqi', top: '41.67cqi', width: '5.73cqi', height: '5.73cqi' },
        options: [
          { label: '장마전선이 빠르게 북상했다.', outcome: 'wrong1', box: { left: '50.83cqi', top: '21.61cqi', width: '41.51cqi', height: '4.79cqi' } },
          { label: '장마전선이 한반도 부근에 오랫동안 정체했다.', outcome: 'correct', box: { left: '50.83cqi', top: '28.28cqi', width: '41.56cqi', height: '4.74cqi' } },
          { label: '장마전선이 사라졌다.', outcome: 'wrong2', box: { left: '50.83cqi', top: '35.00cqi', width: '41.56cqi', height: '4.69cqi' } },
        ],
      },
      zoom: { background: satelliteZoomBg, backBox: { left: '79.01cqi', top: '2.34cqi', width: '17.29cqi', height: '3.75cqi' } },
      wrong1: { background: satelliteWrong1Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      wrong2: { background: satelliteWrong2Bg, retryTarget: 'quiz', retryBox: { right: '5.5cqi', bottom: '5cqi' } },
      correct: { background: satelliteCorrectBg, hintBox: { left: '41.35cqi', top: '38.49cqi', width: '17.29cqi', height: '3.75cqi' } },
      hint: { background: satelliteHintBg, frontImage: satelliteHintFront, backImage: satelliteHintBack, hotspotBox: { left: '33.16%', top: '72.39%', width: '33.83%', height: '7.29%' } },
      notebook: { background: satelliteNotebookBg, returnBox: { left: '83.54cqi', top: '2.71cqi', width: '13.33cqi', height: '4.58cqi' } },
    },
  },

  board: {
    board1: board1Bg,
    board2: board2Bg,
    board3: board3Bg,
    board4: board4Bg,
    board5: board5Bg,
    board6: board6Bg,
    hintBookPages: [boardBook1, boardBook2, boardBook3],
    hintBookTabs: [
      { label: '해양 관측소', pageIndex: 0 },
      { label: '기상 관측소', pageIndex: 1 },
      { label: '위성 센터', pageIndex: 2 },
    ],
    gisang: gisangImg,
    reactionText: '아하... 그래서 그랬던 거군',
    evidence: [
      { id: 'evi1', src: evi1Img, wrongSrc: evi1WrongImg, w: 533, h: 158 },
      { id: 'evi2', src: evi2Img, wrongSrc: evi2WrongImg, w: 374, h: 152 },
      { id: 'evi3', src: evi3Img, wrongSrc: evi3WrongImg, w: 486, h: 229 },
    ],
    // board1.png(1920x1080) 기준 픽셀 좌표를 cqi(스테이지 너비 기준 %)로 환산.
    boxes: [
      { id: 'box1', style: { left: '16.61cqi', top: '17.24cqi', width: '15.26cqi', height: '6.98cqi' }, widthPx: 293, heightPx: 134 },
      { id: 'box2', style: { left: '38.91cqi', top: '36.61cqi', width: '15.21cqi', height: '6.77cqi' }, widthPx: 292, heightPx: 130 },
      { id: 'box3', style: { left: '74.95cqi', top: '12.24cqi', width: '15.42cqi', height: '7.55cqi' }, widthPx: 296, heightPx: 145 },
    ],
    confirmBtn: { left: '85.83cqi', top: '50.05cqi', width: '11.82cqi', height: '3.75cqi' },
    nextLink: { left: '85.42cqi', top: '49.74cqi', width: '9.38cqi', height: '3.65cqi' },
    reactionBox: { left: '28.18cqi', top: '44.74cqi', width: '44.17cqi', height: '7.71cqi' },
    // board4~6.png는 3840x2160(2배 해상도) 기준.
    finalChoice: {
      correct: { label: '아시아 여름 몬순', box: { left: '16.54cqi', top: '20.57cqi', width: '32.42cqi', height: '30.99cqi' } },
      wrong: { label: '태풍', box: { left: '50.65cqi', top: '20.57cqi', width: '32.68cqi', height: '30.99cqi' } },
    },
    retryBtn: { left: '41.80cqi', top: '44.66cqi', width: '16.15cqi', height: '4.69cqi' },
    climateCompareBtn: { left: '76.82cqi', top: '50.00cqi', width: '18.36cqi', height: '3.26cqi' },
  },

  climateCompare: {
    today1: today1Bg,
    today2: today2Bg,
    today3: today3Bg,
    today3Title1,
    today3Title2,
    today3High,
    today3Low,
    solution: solutionBg,
  },
}

export default case2020
