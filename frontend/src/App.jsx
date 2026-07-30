import { useState, useEffect } from 'react'
import { sendLog, fetchCompletedSites } from './api'
import { getCase } from './cases'
import HomeScreen from './HomeScreen'
import DialogueScreen from './DialogueScreen'
import CaseSelectScreen from './CaseSelectScreen'
import PhotoScreen from './PhotoScreen'
import NotebookScreen from './NotebookScreen'
import MapScreen from './MapScreen'
import QuizScreen from './QuizScreen'
import HintCardScreen from './HintCardScreen'
import BoardScreen from './BoardScreen'
import ClimateCompareScreen from './ClimateCompareScreen'
import greetingBg from './assets/page1.png'
import assignmentBg from './assets/page2.png'

// 사건 콘텐츠 안의 '{nickname}' 자리를 실제 닉네임으로 치환.
const withNickname = (lines, nickname) => lines.map((line) => line.replaceAll('{nickname}', nickname))

function App() {
  const [screen, setScreen] = useState(
    () => new URLSearchParams(window.location.search).get('screen') || 'home',
  )
  const [caseKey, setCaseKey] = useState('2020')
  const [user, setUser] = useState(null)
  const [completedSites, setCompletedSites] = useState([])
  const nickname = user?.nickname ?? ''

  const c = getCase(caseKey)
  const CASE_ID = c.backendCaseId

  useEffect(() => {
    if (!user) return
    fetchCompletedSites(CASE_ID, user.user_id).then(setCompletedSites)
  }, [user, CASE_ID])

  const logEvent = (action, evidenceId) => sendLog(CASE_ID, user?.user_id, action, evidenceId)

  const ALL_SITES = c.map.sites.map((site) => site.id)

  const finishSite = (siteId) => {
    const next = completedSites.includes(siteId) ? completedSites : [...completedSites, siteId]
    setCompletedSites(next)
    logEvent('site_complete', siteId)
    setScreen(ALL_SITES.every((id) => next.includes(id)) ? 'caseFinale' : 'map')
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  // 조사 사이트(기상관측소/기후분석센터/해양관측소 등) 화면 흐름은 사건마다
  // 이미지/문구/좌표만 다르고 구조(대화->퀴즈->정답/오답->힌트->수첩)는 동일하므로
  // 사건 콘텐츠(cases/*.js)의 box/outcome 데이터만으로 화면을 그려낸다.
  const renderSiteScreen = (siteKey, prefix, currentScreen) => {
    const site = c.sites[siteKey]
    if (!site) return undefined

    if (currentScreen === `${prefix}Dialogue`) {
      return (
        <DialogueScreen
          background={site.dialogue.background}
          speaker={site.dialogue.speaker}
          lines={withNickname(site.dialogue.lines, nickname)}
          buttonLabel="추리하러 가기"
          onButtonClick={() => setScreen(`${prefix}Quiz`)}
          voiceName={site.dialogue.voiceName}
          panel={!site.dialogue.bare}
          bare={site.dialogue.bare}
        />
      )
    }

    if (currentScreen === `${prefix}Quiz`) {
      return (
        <QuizScreen
          background={site.quiz.background}
          options={site.quiz.options.map((opt) => ({
            label: opt.label,
            ...opt.box,
            onClick: () => {
              logEvent(opt.outcome === 'correct' ? 'correct_answer' : 'wrong_answer', `${siteKey}_q1_${opt.outcome}`)
              setScreen(opt.outcome === 'correct' ? `${prefix}Correct` : `${prefix}${cap(opt.outcome)}`)
            },
          }))}
        />
      )
    }

    if (currentScreen === `${prefix}Correct`) {
      return (
        <PhotoScreen
          background={site.correct.background}
          hotspot={{ label: '다음 문제로', ...site.correct.nextBox, onClick: () => setScreen(`${prefix}Quiz2`) }}
        />
      )
    }

    if (currentScreen === `${prefix}Quiz2`) {
      return (
        <QuizScreen
          background={site.quiz2.background}
          videos={site.quiz2.videos ?? []}
          options={site.quiz2.options.map((opt) => ({
            label: opt.label,
            ...opt.box,
            onClick: () => {
              logEvent(opt.outcome === 'correct' ? 'correct_answer' : 'wrong_answer', `${siteKey}_q2_${opt.outcome}`)
              setScreen(opt.outcome === 'correct' ? `${prefix}Correct2` : `${prefix}${cap(opt.outcome)}`)
            },
          }))}
        />
      )
    }

    if (currentScreen === `${prefix}Correct2`) {
      return (
        <PhotoScreen
          background={site.correct2.background}
          hotspot={{ label: '획득한 단서 보기', ...site.correct2.hintBox, onClick: () => setScreen(`${prefix}Hint`) }}
        />
      )
    }

    if (currentScreen === `${prefix}Hint`) {
      return (
        <HintCardScreen
          background={site.hint.background}
          frontImage={site.hint.frontImage}
          backImage={site.hint.backImage}
          hotspot={{ label: '탐정 수첩 채우기', ...site.hint.hotspotBox, onClick: () => setScreen(`${prefix}Notebook`) }}
        />
      )
    }

    if (currentScreen === `${prefix}Notebook`) {
      return (
        <PhotoScreen
          background={site.notebook.background}
          hotspot={{ label: '지도로 돌아가기', ...site.notebook.returnBox, onClick: () => finishSite(siteKey) }}
        />
      )
    }

    // wrong1 / wrong2 / wrong3 / wrong3a ... 처럼 정답이 아닌 선택지를 골랐을 때의
    // 오답 설명 화면. 사건 콘텐츠에 outcome 키로 등록돼있으면 여기서 공통 처리.
    if (currentScreen.startsWith(prefix)) {
      const outcomeKey = currentScreen.slice(prefix.length)
      const key = outcomeKey.charAt(0).toLowerCase() + outcomeKey.slice(1)
      const wrong = site[key]
      if (wrong?.background && wrong?.retryTarget) {
        return (
          <PhotoScreen
            background={wrong.background}
            buttonLabel="다시 풀기"
            onButtonClick={() => setScreen(`${prefix}${cap(wrong.retryTarget)}`)}
            buttonStyle={wrong.retryBox}
            solidButton
          />
        )
      }
    }

    return undefined
  }

  const weatherScreen = renderSiteScreen('weather', 'weather', screen)
  if (weatherScreen) return weatherScreen
  const climateScreen = renderSiteScreen('climate', 'climate', screen)
  if (climateScreen) return climateScreen

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
          const target = getCase(caseId)
          if (!target?.ready) return // 아직 준비 안 된 사건
          setCaseKey(caseId)
          setScreen(target.caseFile ? 'caseFile' : 'notebook')
        }}
      />
    )
  }

  if (screen === 'caseFile') {
    return (
      <PhotoScreen
        background={c.caseFile.background}
        buttonLabel="와! 감사합니다"
        onButtonClick={() => setScreen('notebook')}
        compactBox
      />
    )
  }

  if (screen === 'notebook') {
    return (
      <NotebookScreen
        pages={c.notebook.pages}
        tabs={c.notebook.tabs}
        onFinish={() => setScreen(c.briefing ? 'briefing' : 'map')}
      />
    )
  }

  if (screen === 'briefing') {
    return (
      <PhotoScreen
        background={c.briefing.background}
        buttonLabel="네! 열심히 해볼게요"
        onButtonClick={() => setScreen('map')}
      />
    )
  }

  if (screen === 'map') {
    return (
      <MapScreen
        background={c.map.background}
        sites={c.map.sites}
        detective={c.map.detective}
        onSelectSite={(siteId) => {
          if (siteId === 'ocean') setScreen('oceanDialogue')
          if (siteId === 'weather') setScreen('weatherDialogue')
          if (siteId === 'satellite') setScreen('satelliteDialogue')
          if (siteId === 'climate') setScreen('climateDialogue')
        }}
        completedSites={completedSites}
      />
    )
  }

  if (screen === 'climateCompare') {
    return (
      <ClimateCompareScreen
        caseId={CASE_ID}
        assets={c.climateCompare}
        onExit={() => setScreen('caseSelect')}
      />
    )
  }

  if (screen === 'board1') {
    return (
      <BoardScreen
        caseId={CASE_ID}
        userId={user?.user_id}
        nickname={nickname}
        assets={c.board}
        onSolved={() => logEvent('case_solved', CASE_ID)}
        onExit={() => setScreen('map')}
        onCompareClimate={() => setScreen('climateCompare')}
      />
    )
  }

  if (screen === 'oceanDialogue') {
    return (
      <DialogueScreen
        background={c.sites.ocean.dialogue.background}
        speaker={c.sites.ocean.dialogue.speaker}
        lines={withNickname(c.sites.ocean.dialogue.lines, nickname)}
        buttonLabel="추리하러 가기"
        onButtonClick={() => setScreen('oceanQuiz')}
        voiceName={c.sites.ocean.dialogue.voiceName}
        panel
      />
    )
  }

  if (screen === 'satelliteDialogue') {
    return (
      <DialogueScreen
        background={c.sites.satellite.dialogue.background}
        speaker={c.sites.satellite.dialogue.speaker}
        lines={withNickname(c.sites.satellite.dialogue.lines, nickname)}
        buttonLabel="추리하러 가기"
        onButtonClick={() => setScreen('satelliteQuiz')}
        voiceName={c.sites.satellite.dialogue.voiceName}
        panel
      />
    )
  }

  if (screen === 'satelliteQuiz') {
    const [wrong1, correct, wrong2] = c.sites.satellite.quiz.options
    return (
      <QuizScreen
        background={c.sites.satellite.quiz.background}
        options={[
          {
            label: c.sites.satellite.quiz.zoomLabel,
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
            label: wrong1.label,
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
            label: correct.label,
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
            label: wrong2.label,
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
        background={c.sites.satellite.zoom.background}
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
        background={c.sites.satellite.wrong1.background}
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
        background={c.sites.satellite.wrong2.background}
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
        background={c.sites.satellite.correct.background}
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
        background={c.sites.satellite.hint.background}
        frontImage={c.sites.satellite.hint.frontImage}
        backImage={c.sites.satellite.hint.backImage}
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
        background={c.sites.satellite.notebook.background}
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
        background={c.caseFinale.background}
        speaker="기상이"
        lines={withNickname(c.caseFinale.lines, nickname)}
        buttonLabel={c.caseFinale.buttonLabel}
        onButtonClick={() => setScreen(c.caseFinale.nextScreen ?? 'board1')}
        panel={!c.caseFinale.bare}
        bare={c.caseFinale.bare}
        barBox={c.caseFinale.barBox}
        buttonBox={c.caseFinale.buttonBox}
      />
    )
  }

  if (screen === 'oceanQuiz') {
    const [correct, wrong] = c.sites.ocean.quiz.options
    return (
      <QuizScreen
        background={c.sites.ocean.quiz.background}
        options={[
          {
            label: correct.label,
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
            label: wrong.label,
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
        background={c.sites.ocean.correct.background}
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
    const [correct, wrong2a, wrong2b] = c.sites.ocean.quiz2.options
    return (
      <QuizScreen
        background={c.sites.ocean.quiz2.background}
        options={[
          {
            label: correct.label,
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
            label: wrong2a.label,
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
            label: wrong2b.label,
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
        background={c.sites.ocean.correct2.background}
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
        background={c.sites.ocean.hint.background}
        frontImage={c.sites.ocean.hint.frontImage}
        backImage={c.sites.ocean.hint.backImage}
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
        background={c.sites.ocean.notebook.background}
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
        background={c.sites.ocean.wrong.background}
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
        background={c.sites.ocean.wrong2a.background}
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
        background={c.sites.ocean.wrong2b.background}
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
