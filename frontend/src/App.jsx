import { useState, useEffect } from 'react'
import { sendLog, fetchCompletedSites } from './api'
import HomeScreen from './HomeScreen'
import DialogueScreen from './DialogueScreen'
import CaseSelectScreen from './CaseSelectScreen'
import PhotoScreen from './PhotoScreen'
import NotebookScreen from './NotebookScreen'
import MapScreen from './MapScreen'
import QuizScreen from './QuizScreen'
import HintCardScreen from './HintCardScreen'
import greetingBg from './assets/page1.png'
import assignmentBg from './assets/page2.png'
import caseFileBg from './assets/page4.png'
import briefingBg from './assets/2020/common/page9.png'
import oceanStationBg from './assets/2020/ocean/b1_p1.png'
import oceanQuizBg from './assets/2020/ocean/b1_p2.png'
import oceanCorrectBg from './assets/2020/ocean/b1_p3.png'
import oceanWrongBg from './assets/2020/ocean/b1_p4.png'
import oceanQuiz2Bg from './assets/2020/ocean/b1_p5.png'
import oceanCorrect2Bg from './assets/2020/ocean/b1_p6.png'
import oceanWrong2aBg from './assets/2020/ocean/b1_p7.png'
import oceanWrong2bBg from './assets/2020/ocean/b1_p8.png'
import oceanHintBg from './assets/2020/ocean/b1_p9.png'
import oceanHintFront from './assets/2020/ocean/b1_p9_hint1.png'
import oceanHintBack from './assets/2020/ocean/b1_p9_hint2.png'
import oceanNotebookBg from './assets/2020/ocean/b1_p10.png'
import weatherStationBg from './assets/2020/weather/p1.png'
import weatherQuizBg from './assets/2020/weather/p2.png'
import weatherWrong1Bg from './assets/2020/weather/p3.png'
import weatherWrong2Bg from './assets/2020/weather/p4.png'
import weatherQuiz2Bg from './assets/2020/weather/p5.png'
import weatherVapor2020 from './assets/2020/weather/2020-07-23.webm'
import weatherVapor2021 from './assets/2020/weather/2021-07-23.webm'
import weatherCorrectBg from './assets/2020/weather/p8.png'
import weatherCorrect2Bg from './assets/2020/weather/p6.png'
import weatherWrong3Bg from './assets/2020/weather/p7.png'
import weatherHintBg from './assets/2020/weather/p9.png'
import weatherHintFront from './assets/2020/weather/p9_hint1.png'
import weatherHintBack from './assets/2020/weather/p9_hint2.png'
import weatherNotebookBg from './assets/2020/weather/p10.png'
import satelliteStationBg from './assets/2020/satellite/p1.png'
import satelliteQuizBg from './assets/2020/satellite/p2.png'
import satelliteZoomBg from './assets/2020/satellite/p3.png'
import satelliteWrong1Bg from './assets/2020/satellite/p4.png'
import satelliteCorrectBg from './assets/2020/satellite/p5.png'
import satelliteWrong2Bg from './assets/2020/satellite/p6.png'
import satelliteHintBg from './assets/2020/satellite/p7.png'
import satelliteHintFront from './assets/2020/satellite/p7_hint1.png'
import satelliteHintBack from './assets/2020/satellite/p7_hint2.png'
import satelliteNotebookBg from './assets/2020/satellite/p8.png'
import caseFinaleBg from './assets/2020/satellite/p9.png'

const CASE_ID = '2020_jangma'

function App() {
  const [screen, setScreen] = useState(
    () => new URLSearchParams(window.location.search).get('screen') || 'home',
  )
  const [user, setUser] = useState(null)
  const [completedSites, setCompletedSites] = useState([])
  const nickname = user?.nickname ?? ''

  useEffect(() => {
    if (!user) return
    fetchCompletedSites(CASE_ID, user.user_id).then(setCompletedSites)
  }, [user])

  const logEvent = (action, evidenceId) => sendLog(CASE_ID, user?.user_id, action, evidenceId)

  const ALL_SITES = ['ocean', 'weather', 'satellite']

  const finishSite = (siteId) => {
    const next = completedSites.includes(siteId) ? completedSites : [...completedSites, siteId]
    setCompletedSites(next)
    logEvent('site_complete', siteId)
    setScreen(ALL_SITES.every((id) => next.includes(id)) ? 'caseFinale' : 'map')
  }

  if (screen === 'greeting') {
    return (
      <DialogueScreen
        background={greetingBg}
        speaker="기상이"
        lines={[`반갑네 ${nickname}.`, '나는 이상기후 탐정 기상이라고 하네']}
        buttonLabel="네 안녕하세요"
        onButtonClick={() => setScreen('assignment')}
      />
    )
  }

  if (screen === 'assignment') {
    return (
      <DialogueScreen
        background={assignmentBg}
        speaker="기상이"
        lines={[
          '후,, 요즘 사건이 너무 많아서 조수가 필요했다네',
          `${nickname} 자네가 이번 미제사건 수사에 도움을 주게나!`,
        ]}
        buttonLabel="수사 파일 보러가기"
        onButtonClick={() => setScreen('caseSelect')}
      />
    )
  }

  if (screen === 'caseSelect') {
    return (
      <CaseSelectScreen
        onSelectCase={(caseId) => {
          if (caseId !== '2020') return // 2018, 2022 사건은 아직 준비 중
          setScreen('caseFile')
        }}
      />
    )
  }

  if (screen === 'caseFile') {
    return (
      <PhotoScreen
        background={caseFileBg}
        buttonLabel="와! 감사합니다"
        onButtonClick={() => setScreen('notebook')}
        compactBox
      />
    )
  }

  if (screen === 'notebook') {
    return <NotebookScreen onFinish={() => setScreen('briefing')} />
  }

  if (screen === 'briefing') {
    return (
      <PhotoScreen
        background={briefingBg}
        buttonLabel="네! 열심히 해볼게요"
        onButtonClick={() => setScreen('map')}
      />
    )
  }

  if (screen === 'map') {
    return (
      <MapScreen
        onSelectSite={(siteId) => {
          if (siteId === 'ocean') setScreen('oceanDialogue')
          if (siteId === 'weather') setScreen('weatherDialogue')
          if (siteId === 'satellite') setScreen('satelliteDialogue')
        }}
        completedSites={completedSites}
      />
    )
  }

  if (screen === 'oceanDialogue') {
    return (
      <DialogueScreen
        background={oceanStationBg}
        speaker="해양관측소"
        lines={[
          `안녕하세요 ${nickname} 조수님.`,
          '해양관측소는 바닷물의 흐름과 수온, 염분 등 우리바다에 대한 기초적인',
          '조사를 수행하는 곳입니다. 저희가 드리는 단서를 갖고 추리해보세요!',
        ]}
        buttonLabel="추리하러 가기"
        onButtonClick={() => setScreen('oceanQuiz')}
        voiceName="인준"
        panel
      />
    )
  }

  if (screen === 'weatherDialogue') {
    return (
      <DialogueScreen
        background={weatherStationBg}
        speaker="기상관측소"
        lines={[
          `안녕하세요 ${nickname}조수님.`,
          '저희 기상관측소는 지상 부근의 대기 상태를 관측하는 곳입니다',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ]}
        buttonLabel="추리하러 가기"
        onButtonClick={() => setScreen('weatherQuiz')}
        voiceName="Hyunsu Multilingual"
        panel
      />
    )
  }

  if (screen === 'weatherQuiz') {
    return (
      <QuizScreen
        background={weatherQuizBg}
        options={[
          {
            label: '북쪽 계열의 바람이 주로 불어 차갑고 건조한 공기가 유입되었다.',
            left: '50.16cqi',
            top: '21.35cqi',
            width: '42.40cqi',
            height: '7.03cqi',
            onClick: () => {
              logEvent('wrong_answer', 'weather_q1_north')
              setScreen('weatherWrong1')
            },
          },
          {
            label: '남쪽 계열의 바람이 주로 불어 남쪽 바다의 따뜻하고 습한 공기가 한반도로 유입되었다.',
            left: '50.16cqi',
            top: '28.96cqi',
            width: '42.40cqi',
            height: '7.03cqi',
            onClick: () => {
              logEvent('correct_answer', 'weather_q1')
              setScreen('weatherCorrect')
            },
          },
          {
            label: '동쪽 계열의 바람이 주로 불어 장마전선이 약해졌다.',
            left: '50.16cqi',
            top: '36.56cqi',
            width: '42.40cqi',
            height: '7.03cqi',
            onClick: () => {
              logEvent('wrong_answer', 'weather_q1_east')
              setScreen('weatherWrong2')
            },
          },
        ]}
      />
    )
  }

  if (screen === 'weatherWrong1') {
    return (
      <PhotoScreen
        background={weatherWrong1Bg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('weatherQuiz')}
        buttonStyle={{ right: '8cqi', bottom: '5cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'weatherWrong2') {
    return (
      <PhotoScreen
        background={weatherWrong2Bg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('weatherQuiz')}
        buttonStyle={{ right: '6cqi', bottom: '5cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'weatherCorrect') {
    return (
      <PhotoScreen
        background={weatherCorrectBg}
        hotspot={{
          label: '다음 문제로',
          left: '41.35cqi',
          top: '38.65cqi',
          width: '17.29cqi',
          height: '4.64cqi',
          onClick: () => setScreen('weatherQuiz2'),
        }}
      />
    )
  }

  if (screen === 'weatherQuiz2') {
    return (
      <QuizScreen
        background={weatherQuiz2Bg}
        videos={[
          {
            src: weatherVapor2020,
            left: '6.7cqi',
            top: '21cqi',
            width: '20.73cqi',
            height: '19.69cqi',
          },
          {
            src: weatherVapor2021,
            left: '28cqi',
            top: '21cqi',
            width: '20.73cqi',
            height: '19.69cqi',
          },
        ]}
        options={[
          {
            label: '2020년에는 더 많은 수증기가 한반도 주변에서 관측된다.',
            left: '56.67cqi',
            top: '21.56cqi',
            width: '34.58cqi',
            height: '8.59cqi',
            onClick: () => {
              logEvent('correct_answer', 'weather_q2')
              setScreen('weatherCorrect2')
            },
          },
          {
            label: '2020년에는 더 적은 수증기가 한반도 주변에서 관측된다.',
            left: '56.67cqi',
            top: '31.51cqi',
            width: '34.58cqi',
            height: '8.59cqi',
            onClick: () => {
              logEvent('wrong_answer', 'weather_q2')
              setScreen('weatherWrong3')
            },
          },
        ]}
      />
    )
  }

  if (screen === 'weatherCorrect2') {
    return (
      <PhotoScreen
        background={weatherCorrect2Bg}
        hotspot={{
          label: '획득한 단서 보기',
          left: '41.35cqi',
          top: '38.65cqi',
          width: '17.29cqi',
          height: '4.58cqi',
          onClick: () => setScreen('weatherHint'),
        }}
      />
    )
  }

  if (screen === 'weatherWrong3') {
    return (
      <PhotoScreen
        background={weatherWrong3Bg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('weatherQuiz2')}
        buttonStyle={{ right: '8cqi', bottom: '8cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'weatherHint') {
    return (
      <HintCardScreen
        background={weatherHintBg}
        frontImage={weatherHintFront}
        backImage={weatherHintBack}
        hotspot={{
          label: '탐정 수첩 채우기',
          left: '30.62%',
          top: '75%',
          width: '33.77%',
          height: '8.89%',
          onClick: () => setScreen('weatherNotebook'),
        }}
      />
    )
  }

  if (screen === 'weatherNotebook') {
    return (
      <PhotoScreen
        background={weatherNotebookBg}
        hotspot={{
          label: '지도로 돌아가기',
          left: '83.95cqi',
          top: '2.02cqi',
          width: '14.71cqi',
          height: '5.65cqi',
          onClick: () => finishSite('weather'),
        }}
      />
    )
  }

  if (screen === 'satelliteDialogue') {
    return (
      <DialogueScreen
        background={satelliteStationBg}
        speaker="위성센터"
        lines={[
          `안녕하세요 ${nickname} 조수님.`,
          '저희 위성센터(국가기상위성센터)는 기상위성으로 촬영한 영상을',
          '분석하여 대기 상태를 관측합니다.',
          '저희가 드리는 단서를 갖고 추리해보세요!',
        ]}
        buttonLabel="추리하러 가기"
        onButtonClick={() => setScreen('satelliteQuiz')}
        voiceName="선히"
        panel
      />
    )
  }

  if (screen === 'satelliteQuiz') {
    return (
      <QuizScreen
        background={satelliteQuizBg}
        options={[
          {
            label: '자료 확대해서 보기',
            left: '38.54cqi',
            top: '41.67cqi',
            width: '5.73cqi',
            height: '5.73cqi',
            onClick: () => {
              logEvent('inspect_data', 'satellite_zoom')
              setScreen('satelliteZoom')
            },
          },
          {
            label: '장마전선이 빠르게 북상했다.',
            left: '50.83cqi',
            top: '21.61cqi',
            width: '41.51cqi',
            height: '4.79cqi',
            onClick: () => {
              logEvent('wrong_answer', 'satellite_q1_north')
              setScreen('satelliteWrong1')
            },
          },
          {
            label: '장마전선이 한반도 부근에 오랫동안 정체했다.',
            left: '50.83cqi',
            top: '28.28cqi',
            width: '41.56cqi',
            height: '4.74cqi',
            onClick: () => {
              logEvent('correct_answer', 'satellite_q1')
              setScreen('satelliteCorrect')
            },
          },
          {
            label: '장마전선이 사라졌다.',
            left: '50.83cqi',
            top: '35.00cqi',
            width: '41.56cqi',
            height: '4.69cqi',
            onClick: () => {
              logEvent('wrong_answer', 'satellite_q1_disappear')
              setScreen('satelliteWrong2')
            },
          },
        ]}
      />
    )
  }

  if (screen === 'satelliteZoom') {
    return (
      <PhotoScreen
        background={satelliteZoomBg}
        hotspot={{
          label: '문제로 가기',
          left: '79.01cqi',
          top: '2.34cqi',
          width: '17.29cqi',
          height: '3.75cqi',
          onClick: () => setScreen('satelliteQuiz'),
        }}
      />
    )
  }

  if (screen === 'satelliteWrong1') {
    return (
      <PhotoScreen
        background={satelliteWrong1Bg}
        hotspot={{
          label: '다시 풀기',
          left: '78.44cqi',
          top: '44.79cqi',
          width: '13.70cqi',
          height: '3.75cqi',
          onClick: () => setScreen('satelliteQuiz'),
        }}
      />
    )
  }

  if (screen === 'satelliteWrong2') {
    return (
      <PhotoScreen
        background={satelliteWrong2Bg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('satelliteQuiz')}
        buttonStyle={{ right: '7cqi', bottom: '7cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'satelliteCorrect') {
    return (
      <PhotoScreen
        background={satelliteCorrectBg}
        hotspot={{
          label: '획득한 단서 보기',
          left: '41.35cqi',
          top: '38.49cqi',
          width: '17.29cqi',
          height: '3.75cqi',
          onClick: () => setScreen('satelliteHint'),
        }}
      />
    )
  }

  if (screen === 'satelliteHint') {
    return (
      <HintCardScreen
        background={satelliteHintBg}
        frontImage={satelliteHintFront}
        backImage={satelliteHintBack}
        hotspot={{
          label: '탐정 수첩 채우기',
          left: '33.16%',
          top: '72.39%',
          width: '33.83%',
          height: '7.29%',
          onClick: () => setScreen('satelliteNotebook'),
        }}
      />
    )
  }

  if (screen === 'satelliteNotebook') {
    return (
      <PhotoScreen
        background={satelliteNotebookBg}
        hotspot={{
          label: '지도로 돌아가기',
          left: '83.54cqi',
          top: '2.71cqi',
          width: '13.33cqi',
          height: '4.58cqi',
          onClick: () => finishSite('satellite'),
        }}
      />
    )
  }

  if (screen === 'caseFinale') {
    return (
      <DialogueScreen
        background={caseFinaleBg}
        speaker="기상이"
        lines={[
          '훌륭한 자료조사구만!',
          `${nickname} 자네는 조수의 자격이 충분해!`,
          '이제 찾은 단서를 토대로 범인을 찾아 보게나!',
        ]}
        buttonLabel="네!"
        onButtonClick={() => {
          // TODO: p10(2초 표시 후 자동 전환) 에셋 준비되면 다음 화면으로 연결
          setScreen('map')
        }}
        panel
      />
    )
  }

  if (screen === 'oceanQuiz') {
    return (
      <QuizScreen
        background={oceanQuizBg}
        options={[
          {
            label: '2020년 해수면 온도가 평년보다 높았다.',
            left: '44.84cqi',
            top: '22.03cqi',
            width: '43.44cqi',
            height: '6.46cqi',
            onClick: () => {
              logEvent('correct_answer', 'ocean_q1')
              setScreen('oceanCorrect')
            },
          },
          {
            label: '2020년 해수면 온도가 평년보다 낮았다.',
            left: '44.84cqi',
            top: '30.05cqi',
            width: '43.44cqi',
            height: '6.46cqi',
            onClick: () => {
              logEvent('wrong_answer', 'ocean_q1')
              setScreen('oceanWrong')
            },
          },
        ]}
      />
    )
  }

  if (screen === 'oceanCorrect') {
    return (
      <PhotoScreen
        background={oceanCorrectBg}
        hotspot={{
          label: '다음 문제로',
          left: '41.41cqi',
          top: '38.13cqi',
          width: '17.19cqi',
          height: '4.06cqi',
          onClick: () => setScreen('oceanQuiz2'),
        }}
      />
    )
  }

  if (screen === 'oceanQuiz2') {
    return (
      <QuizScreen
        background={oceanQuiz2Bg}
        options={[
          {
            label: '증발이 활발해주고 남서풍을 타고 많은 수증기가 한반도로 이동한다.',
            left: '22.86cqi',
            top: '20.16cqi',
            width: '54.27cqi',
            height: '5.94cqi',
            onClick: () => {
              logEvent('correct_answer', 'ocean_q2')
              setScreen('oceanCorrect2')
            },
          },
          {
            label: '바닷물이 차가워져 수증기가 감소한다.',
            left: '22.86cqi',
            top: '28.18cqi',
            width: '54.27cqi',
            height: '5.94cqi',
            onClick: () => {
              logEvent('wrong_answer', 'ocean_q2_cold_water')
              setScreen('oceanWrong2a')
            },
          },
          {
            label: '수증기가 바로 비가 되어 바다에서 모두 내린다.',
            left: '22.86cqi',
            top: '36.20cqi',
            width: '54.27cqi',
            height: '5.94cqi',
            onClick: () => {
              logEvent('wrong_answer', 'ocean_q2_rain_over_sea')
              setScreen('oceanWrong2b')
            },
          },
        ]}
      />
    )
  }

  if (screen === 'oceanCorrect2') {
    return (
      <PhotoScreen
        background={oceanCorrect2Bg}
        hotspot={{
          label: '획득한 단서 보기',
          left: '41.35cqi',
          top: '37.76cqi',
          width: '17.29cqi',
          height: '4.64cqi',
          onClick: () => setScreen('oceanHint'),
        }}
      />
    )
  }

  if (screen === 'oceanHint') {
    return (
      <HintCardScreen
        background={oceanHintBg}
        frontImage={oceanHintFront}
        backImage={oceanHintBack}
        hotspot={{
          label: '탐정 수첩 채우기',
          left: '30.72%',
          top: '72.79%',
          width: '33.77%',
          height: '8.89%',
          onClick: () => setScreen('oceanNotebook'),
        }}
      />
    )
  }

  if (screen === 'oceanNotebook') {
    return (
      <PhotoScreen
        background={oceanNotebookBg}
        hotspot={{
          label: '지도로 돌아가기',
          left: '82.33cqi',
          top: '1.03cqi',
          width: '14.71cqi',
          height: '6.58cqi',
          onClick: () => finishSite('ocean'),
        }}
      />
    )
  }

  if (screen === 'oceanWrong') {
    return (
      <PhotoScreen
        background={oceanWrongBg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('oceanQuiz')}
        buttonStyle={{ right: '8cqi', bottom: '9cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'oceanWrong2a') {
    return (
      <PhotoScreen
        background={oceanWrong2aBg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('oceanQuiz2')}
        buttonStyle={{ right: '8cqi', bottom: '9cqi' }}
        solidButton
      />
    )
  }

  if (screen === 'oceanWrong2b') {
    return (
      <PhotoScreen
        background={oceanWrong2bBg}
        buttonLabel="다시 풀기"
        onButtonClick={() => setScreen('oceanQuiz2')}
        buttonStyle={{ right: '8cqi', bottom: '9cqi' }}
        solidButton
      />
    )
  }

  return (
    <HomeScreen
      onRegistered={(registeredUser) => {
        setUser(registeredUser)
        setScreen('greeting')
      }}
    />
  )
}

export default App
