# 기후 탐정: 장마 사건 파일 — 백엔드 뼈대

## 실행 방법

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

실행 후 http://localhost:8000/docs 에서 Swagger UI로 모든 엔드포인트를 바로 테스트할 수 있습니다.

## 폴더 구조

```
climate-detective-backend/
├── app/
│   ├── main.py          # FastAPI 앱, 4개 핵심 엔드포인트
│   ├── models.py         # Pydantic 요청/응답 모델
│   └── data/
│       ├── case_2020_jangma.json     # ⚠️ SST 값 PENDING (주최측 답변 대기)
│       ├── case_2018_heatwave.json   # ⚠️ 위성 구름 자료 PENDING (천리안 1호 확인 필요)
│       └── case_2022_flood.json      # value는 전부 TODO (실제 값 채워야 함)
├── requirements.txt
└── README.md
```

## 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/cases` | 사건 목록 |
| GET | `/cases/{case_id}` | 사건 상세 + 증거 목록 |
| POST | `/cases/{case_id}/logs` | 사용자 클릭/연결 로그 저장 |
| GET | `/cases/{case_id}/logs/{user_id}` | 저장된 로그 조회 (AI 리포트용) |
| POST | `/cases/{case_id}/check` | 인과관계 연결 정답 판정 |
| GET | `/health` | 서버 상태 확인 |

## 데이터 파일 채우는 법 (다음 할 일)

각 `case_*.json` 안의 `"value": "TODO"` 를 실제 기상자료개방포털에서 조회한 값으로 바꾸면 됩니다.
`PENDING`으로 표시된 항목(2020년 SST, 2018년 위성)은 주최측 답변이나 천리안 1호 확인 후 채워주세요.

## /check 판정 로직 핵심

`causal_stages`는 순서가 있는 단계 리스트이고, 각 단계 안의 `required_evidence`는
"이 단계에서 반드시 다 모여야 하는 증거들"(AND 조건, 단계 내부는 순서 무관)입니다.

예: 2022년 사건 1단계는 `["E_wind", "E_vapor_sat", "E_cloud_sat"]` 세 개를
어떤 순서로 연결하든 모두 모아야 다음 단계로 인정됩니다.
이 구조로 "수증기유입 + 정체전선형성이 동시에 필요하다"는 인과관계를 표현했습니다.

## 아직 안 만든 것 (다음 단계)

- AI 연동 (오답 해설 / 힌트 / 탐정 등급 리포트 / 오늘 날씨 연결) — `/check`가 반환하는
  `failed_stage`, `failed_stage_label`, `message`를 프롬프트에 그대로 넣으면 오답 해설 붙이기 쉬움
- 로그 영속 저장 (현재는 메모리 저장이라 서버 재시작하면 날아감) — SQLite로 교체 권장
- 프론트엔드 연동
