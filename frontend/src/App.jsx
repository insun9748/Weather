import { useState } from 'react'
import HomeScreen from './HomeScreen'
import DialogueScreen from './DialogueScreen'
import CaseSelectScreen from './CaseSelectScreen'
import PhotoScreen from './PhotoScreen'
import greetingBg from './assets/page1.png'
import assignmentBg from './assets/page2.png'
import caseFileBg from './assets/page4.png'

function App() {
  const [screen, setScreen] = useState('home')
  const [user, setUser] = useState(null)
  const nickname = user?.nickname ?? ''

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
        onSelectCase={() => setScreen('caseFile')}
      />
    )
  }

  if (screen === 'caseFile') {
    return (
      <PhotoScreen
        background={caseFileBg}
        buttonLabel="와! 감사합니다"
        onButtonClick={() => {
          // TODO: 실제 수사(단서 조사) 화면으로 이동
        }}
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
