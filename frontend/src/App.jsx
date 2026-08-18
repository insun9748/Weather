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
import ReportScreen from './ReportScreen'
import greetingBg from './assets/page1.png'
import assignmentBg from './assets/page2.png'
import weatherVoice from './assets/sounds/기상관측소.mp3'
import oceanVoice from './assets/sounds/해양관측소.mp3'
import satelliteVoice from './assets/sounds/위성센터.mp3'
import climateVoice from './assets/sounds/기후분석센터.mp3'
import typhoonVoice from './assets/sounds/국가태풍센터.mp3'
import oceanAmbient from './assets/sounds/바다.wav'
import windAmbient from './assets/sounds/바람소리.wav'

// 사이트별 소개 대사 TTS를 사전 녹음된 음성 파일로 대체.
const SITE_VOICE = {
  weather: weatherVoice,
  ocean: oceanVoice,
  satellite: satelliteVoice,
  climate: climateVoice,
  typhoon: typhoonVoice,
}

// 사이트 소개 화면에 작게 까는 배경음: 해양관측소는 바다 소리, 나머지는 바람 소리.
const SITE_AMBIENT = {
  weather: windAmbient,
  ocean: oceanAmbient,
  satellite: windAmbient,
  climate: windAmbient,
  typhoon: windAmbient,
}

// 사건 콘텐츠 안의 '{nickname}' 자리를 실제 닉네임으로 치환.
const withNickname = (lines, nickname) => lines.map((line) => line.replaceAll('{nickname}', nickname))

function App() {
  const [screen, setScreen] = useState(
    () => new URLSearchParams(window.location.search).get('screen') || 'home',
  )
  const [caseKey, setCaseKey] = useState(
    () => new URLSearchParams(window.location.search).get('case') || '2020',
  )
  const [user, setUser] = useState(null)
  const [completedSites, setCompletedSites] = useState([])
  const [detectiveReport, setDetectiveReport] = useState(null)
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
    const allDone = ALL_SITES.every((id) => next.includes(id))
    setScreen(allDone && c.caseFinale ? 'caseFinale' : 'map')
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
          voiceSrc={SITE_VOICE[siteKey]}
          ambientSrc={SITE_AMBIENT[siteKey]}
          panel={!site.dialogue.bare}
          bare={site.dialogue.bare}
          barBox={site.dialogue.barBox}
          buttonBox={site.dialogue.buttonBox}
        />
      )
    }

    if (currentScreen === `${prefix}Quiz`) {
      const options = site.quiz.options.map((opt) => ({
        label: opt.label,
        ...opt.box,
        onClick: () => {
          logEvent(opt.outcome === 'correct' ? 'correct_answer' : 'wrong_answer', opt.label)
          setScreen(opt.outcome === 'correct' ? `${prefix}Correct` : `${prefix}${cap(opt.outcome)}`)
        },
      }))
      // 일부 사이트(예: 위성센터)는 자료를 확대해서 보는 돋보기 버튼이 하나 더 있다.
      if (site.quiz.zoomLabel) {
        options.unshift({
          label: site.quiz.zoomLabel,
          ...site.quiz.zoomBox,
          onClick: () => {
            logEvent('inspect_data', `${siteKey}_zoom`)
            setScreen(`${prefix}Zoom`)
          },
        })
      }
      return <QuizScreen background={site.quiz.background} options={options} tipImage={site.quiz.tipImage} />
    }

    if (currentScreen === `${prefix}Zoom`) {
      return (
        <PhotoScreen
          background={site.zoom.background}
          hotspot={{ label: '문제로 가기', ...site.zoom.backBox, onClick: () => setScreen(`${prefix}Quiz`) }}
        />
      )
    }

    if (currentScreen === `${prefix}Correct`) {
      // quiz2가 없는(퀴즈 한 판만 있는) 사이트는 correct 화면에서 바로 힌트로 간다.
      const hotspot = site.quiz2
        ? { label: '다음 문제로', ...site.correct.nextBox, onClick: () => setScreen(`${prefix}Quiz2`) }
        : { label: '획득한 단서 보기', ...site.correct.hintBox, onClick: () => setScreen(`${prefix}Hint`) }
      return <PhotoScreen background={site.correct.background} hotspot={hotspot} />
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
              logEvent(opt.outcome === 'correct' ? 'correct_answer' : 'wrong_answer', opt.label)
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
        const retryScreen = `${prefix}${cap(wrong.retryTarget)}`
        // 오답 화면이 quiz1로 돌아가는 경우, 그 문제의 탐정 TIP도 계속 누를 수 있게 한다.
        const tipImage = wrong.retryTarget === 'quiz' ? site.quiz?.tipImage : undefined
        // 이미지에 "다시 풀기" 버튼이 이미 그려져 있는 경우엔 투명 히트존(retryHotspot)을,
        // 아니라면 코드가 그리는 불투명 버튼(retryBox)을 쓴다.
        if (wrong.retryHotspot) {
          return (
            <PhotoScreen
              background={wrong.background}
              hotspot={{ label: '다시 풀기', ...wrong.retryHotspot, onClick: () => setScreen(retryScreen) }}
              tipImage={tipImage}
            />
          )
        }
        return (
          <PhotoScreen
            background={wrong.background}
            buttonLabel="다시 풀기"
            onButtonClick={() => setScreen(retryScreen)}
            buttonStyle={wrong.retryBox}
            solidButton
            tipImage={tipImage}
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
  const oceanScreen = renderSiteScreen('ocean', 'ocean', screen)
  if (oceanScreen) return oceanScreen
  const typhoonScreen = renderSiteScreen('typhoon', 'typhoon', screen)
  if (typhoonScreen) return typhoonScreen
  const satelliteScreen = renderSiteScreen('satellite', 'satellite', screen)
  if (satelliteScreen) return satelliteScreen

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
        userId={user?.user_id}
        onSelectCase={(caseId) => {
          const target = getCase(caseId)
          if (!target?.ready) return // 아직 준비 안 된 사건
          setCaseKey(caseId)
          setScreen(target.caseFile ? 'caseFile' : 'notebook')
        }}
        onOpenReport={(report) => {
          setDetectiveReport(report)
          setScreen('report')
        }}
      />
    )
  }

  if (screen === 'report') {
    return (
      <ReportScreen
        data={detectiveReport}
        userId={user?.user_id}
        nickname={nickname}
        onExit={() => setScreen('caseSelect')}
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
        finishBox={c.notebook.finishBox}
        finishButton={c.notebook.finishButton}
        onFinish={() => setScreen(c.startInvestigation ? 'startInvestigation' : c.briefing ? 'briefing' : 'map')}
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

  if (screen === 'startInvestigation') {
    return (
      <DialogueScreen
        background={c.startInvestigation.background}
        speaker="기상이"
        lines={withNickname(c.startInvestigation.lines, nickname)}
        buttonLabel={c.startInvestigation.buttonLabel}
        onButtonClick={() => setScreen(c.startInvestigation.nextScreen ?? 'map')}
        bare
        barBox={c.startInvestigation.barBox}
        buttonBox={c.startInvestigation.buttonBox}
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
          if (siteId === 'typhoon') setScreen('typhoonDialogue')
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
