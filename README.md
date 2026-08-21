# 기후 탐정: 장마 사건 파일

배포 URL: https://weather-ochre-kappa.vercel.app/ (로그인/결제 없이 크롬 브라우저에서 바로 이용 가능)

<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/ce58edd8-9fd7-4bd1-bd38-66b2acd1b8c9" />

<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/74dc3a34-8b2b-484c-b5d4-ad8959539aac" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/516d12b8-ec24-4940-adfd-a3f751b4812f" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/af5f80d9-7595-44c1-b13d-548e899e96ec" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7f06099f-fa61-4bf1-b70a-425dbac0fccf" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9f4ed1ae-9f1b-46cb-8754-9ce7c181f7e2" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f0ed309e-d659-4def-917a-64016fbbe529" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a20b422b-3a67-43c3-badc-8436c53e2643" />

<img width="3840" height="2160" alt="image" src="https://github.com/user-attachments/assets/aa5fe5a3-adf4-4445-a9ff-1b652c75ace6" />



중학생을 대상으로 한 기후 교육용 웹 콘텐츠입니다. 학생은 "기후 탐정"이 되어 2018년 폭염, 2020년 역대 최장 장마, 2022년 수도권 집중호우, 세 가지 실제 이상기후 사건을 조사합니다. 각 사건 현장(기상관측소, 해양관측소, 위성센터, 기후분석센터, 국가태풍센터 등)을 돌며 관측 자료 퀴즈를 풀고, 증거를 인과관계 순서대로 수사보드에 배치해 사건의 원인을 추리합니다. 세 사건을 모두 해결하면 AI가 학생의 오답 이력을 바탕으로 개인화된 탐정 리포트(헷갈렸던 개념 정리 + 총평)를 생성해 주고, 브라우저 위치 기반으로 오늘의 실제 기상청 관측값을 가져와 과거 사건의 기후 패턴과 비교해 보여줍니다.

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [로컬 실행 방법](#로컬-실행-방법)
- [환경 변수](#환경-변수)
- [배포](#배포)
- [API 키 및 보안](#api-키-및-보안)
- [외부 리소스 출처 및 라이선스](#외부-리소스-출처-및-라이선스)

## 주요 기능

- 사건별 현장 조사: 관측소를 돌며 실제와 유사한 관측 자료(기상 특보, 위성 이미지, 해수면 온도, 태풍 진로도 등)를 보고 퀴즈를 풂
- 수사보드: 모은 증거를 원인 -> 결과 순서로 배치해 인과관계를 완성하면 정답/오답을 판정하고, 오답 시 AI가 왜 틀렸는지 설명
- 탐정 수첩: 사이트별로 조사한 내용을 정리해서 보여주는 요약 페이지
- 탐정 리포트: 3개 사건을 모두 해결하면, 사용자의 오답 이력을 근거로 AI가 헷갈린 개념과 총평을 사건별로 생성
- 오늘 기후 비교: 브라우저 위치 권한으로 가장 가까운 기상청 관측소를 찾아 오늘 실측 날씨를 가져오고, 사건 당시 패턴과 얼마나 비슷한지 AI가 설명
- 진행 상황은 닉네임 기반 계정으로 Postgres에 저장되어, 새로고침하거나 다시 접속해도 이어서 진행 가능

## 기술 스택

**프론트엔드**
- React 19 + Vite
- 순수 CSS (컴포넌트별 `.css` 파일), 컨테이너 쿼리 단위(`cqi`)로 반응형 레이아웃 구성
- 별도 라우터 없이 `screen` 상태값으로 화면을 전환하는 단일 페이지 구조

**백엔드**
- FastAPI + Uvicorn
- Pydantic (요청/응답 모델)
- PostgreSQL (psycopg2) — 유저, 진행 상황, 행동 로그 저장
- OpenAI API — 오답 해설, 탐정 리포트, 오늘 기후 비교 설명 등 자연어 생성
- 기상청(KMA) API 허브 — 지상관측(ASOS), 해양기상부이, 태풍 실시간 정보 조회
- httpx — 외부 API(KMA) 호출

## 폴더 구조

```
Weather/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI 앱, 전체 API 엔드포인트
│   │   ├── ai.py           # OpenAI 연동 (해설/리포트/기후비교 문구 생성)
│   │   ├── weather.py      # 기상청 API 연동 및 유사도 판정 로직
│   │   ├── db.py            # Postgres 연결 및 쿼리
│   │   ├── models.py        # Pydantic 모델
│   │   └── data/            # 사건별 데이터(JSON): 증거, 인과관계 단계 등
│   ├── requirements.txt
│   └── .env                 # 로컬 전용 환경 변수 (git에 포함되지 않음)
└── frontend/
    ├── src/
    │   ├── App.jsx           # 화면 전환 및 전체 흐름 제어
    │   ├── cases/            # 사건별(2018/2020/2022) 콘텐츠 데이터(이미지 경로, 좌표, 대사, 정답 등)
    │   ├── assets/           # 이미지, 폰트, 효과음
    │   └── *Screen.jsx       # 화면 단위 컴포넌트 (지도, 퀴즈, 수사보드, 리포트 등)
    └── package.json
```

## 로컬 실행 방법

### 1. 백엔드

```bash
cd backend
pip install -r requirements.txt
```

`backend/.env` 파일을 만들고 [환경 변수](#환경-변수) 항목을 채웁니다.

```bash
uvicorn app.main:app --reload --port 8000
```

- 실행 후 `http://localhost:8000/docs`에서 Swagger UI로 모든 API를 확인할 수 있습니다.
- `http://localhost:8000/health`로 서버 상태를 확인할 수 있습니다.

컴퓨터에 여러 Python 버전이 설치되어 있다면, 반드시 `requirements.txt`를 설치한 것과 같은 Python으로 실행해야 합니다(`py -m uvicorn`처럼 launcher로 실행하면 다른 버전이 잡혀서 패키지를 못 찾을 수 있습니다).

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

- 기본적으로 `http://localhost:5173`에서 실행되며, 백엔드는 `http://localhost:8000`을 기본값으로 바라봅니다.
- 백엔드 주소를 바꾸고 싶다면 `frontend/.env`에 `VITE_API_BASE=http://다른주소:포트`를 지정합니다.

### 3. 화면 바로가기 (테스트용)

`?screen=` 쿼리 파라미터로 특정 화면에 바로 진입할 수 있습니다. 예: `http://localhost:5173/?screen=caseSelect&case=2018`

## 환경 변수

`backend/.env` (git에 커밋되지 않으며, 배포 환경에는 별도로 등록해야 합니다):

| 변수명 | 설명 | 발급/확인 방법 |
|---|---|---|
| `DATABASE_URL` | Postgres 연결 문자열 | 사용 중인 Postgres 호스팅(예: Neon)에서 발급 |
| `KMA_AUTH_KEY` | 기상청 API 허브 인증키 | [기상청 API 허브](https://apihub.kma.go.kr)에서 회원가입 후 발급 |
| `OPENAI_API_KEY` | OpenAI API 키 | [OpenAI Platform](https://platform.openai.com)에서 발급 |
| `PYTHON_VERSION` | 배포 플랫폼(Render 등)에 파이썬 버전을 알려주는 값 | 로컬 실행에는 필요 없음 |

`frontend/.env` (선택):

| 변수명 | 설명 | 기본값 |
|---|---|---|
| `VITE_API_BASE` | 프론트엔드가 호출할 백엔드 주소 | `http://localhost:8000` |

## 배포

- **백엔드**: Render 등 Python 웹 서비스 호스팅에 `backend/` 디렉터리를 배포합니다. 시작 명령은 `uvicorn app.main:app --host 0.0.0.0 --port $PORT` 형태로 지정하고, 위 [환경 변수](#환경-변수) 4개를 호스팅 플랫폼의 환경 변수 설정 화면에 그대로 등록해야 합니다. `.env` 파일 자체는 git에 포함되지 않으므로 배포 서버는 로컬 파일을 볼 수 없습니다.
- **프론트엔드**: Vite로 빌드되는 정적 사이트이므로 Vercel, Netlify 등 정적 호스팅 어디에나 배포 가능합니다. 빌드 명령 `npm run build`, 배포 디렉터리 `dist/`. 배포 시 `VITE_API_BASE`를 실제 백엔드 URL로 지정해야 합니다.
- CORS는 현재 모든 origin을 허용하도록 되어 있습니다(`backend/app/main.py`). 운영 환경에서는 실제 프론트엔드 도메인으로 좁히는 것을 권장합니다.

## API 키 및 보안

- `OPENAI_API_KEY`, `KMA_AUTH_KEY`, `DATABASE_URL`은 모두 `.env` 파일로만 관리하며, 저장소의 `.gitignore`에 `.env`가 등록되어 있어 커밋되지 않습니다.
- 이 저장소에는 실제 키 값이 포함되어 있지 않습니다. 실행/배포 전에 반드시 각자 발급받은 키로 `.env`를 채워야 합니다.
- 프론트엔드에는 어떤 API 키도 노출되지 않으며, OpenAI/기상청 API 호출은 전부 백엔드를 거쳐서 이루어집니다.

## 외부 리소스 출처 및 라이선스

**오픈소스 라이브러리** (각 라이브러리의 라이선스 조건을 따름)

| 구분 | 라이브러리 | 라이선스 |
|---|---|---|
| 프론트엔드 | React, React DOM | MIT |
| 프론트엔드 | Vite | MIT |
| 백엔드 | FastAPI | MIT |
| 백엔드 | Uvicorn | BSD-3-Clause |
| 백엔드 | Pydantic | MIT |
| 백엔드 | httpx | BSD-3-Clause |
| 백엔드 | python-dotenv | BSD-3-Clause |
| 백엔드 | psycopg2-binary | LGPL |
| 백엔드 | openai (Python SDK) | Apache-2.0 |

**폰트**
- PyeongChang(평창평화체) — 강원도가 2018 평창 동계올림픽을 기념해 무료로 배포한 서체로, 별도 사용료 없이 사용 가능합니다. (`frontend/src/assets/fonts/`)

**이미지**
- 마스코트("기상이") 및 사건별 배경·증거 이미지는 ChatGPT(OpenAI 이미지 생성 기능)로 생성했습니다. 실사용 촬영물이나 저작권이 있는 원본 이미지를 그대로 사용하지 않았습니다.
- 기상 특보, 위성 이미지, 일기도 등 자료 이미지는 실제 기상청 관측값/자료를 바탕으로 제작했습니다.

**효과음**
- Mixkit(https://mixkit.co/free-sound-effects/) 의 무료 효과음을 사용했습니다.

**음성(내레이션)**
- Typecast(https://typecast.ai) AI 음성 합성으로 캐릭터 음성을 생성했습니다.

**외부 데이터 API**
- 기상청(KMA) API 허브 — 지상관측(ASOS), 해양기상부이, 태풍 실시간 정보. 이용을 위해서는 기상청 API 허브에서 발급받은 인증키가 필요합니다.
- OpenAI API — 오답 해설, 탐정 리포트, 기후 비교 설명 문구 생성에 사용됩니다.
