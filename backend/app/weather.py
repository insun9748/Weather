"""기상청(KMA) API 허브 - 지상관측자료(kma_sfctm2) 연동.

위경도로 가장 가까운 ASOS 관측소를 찾고, 그 관측소의 최신 관측값을 가져온다.
인증키가 없거나 호출/파싱이 실패해도 예외를 던지지 않고 None을 반환한다 (호출부에서 처리).
"""

import math
import os
from typing import Dict, Optional

import httpx

KMA_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php"
BUOY_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_buoy.php"
TYPHOON_URL = "https://apihub.kma.go.kr/api/typ01/url/typ_now.php"

# 2022년 힌남노 태풍이 지나간 남해 인근 부이 (해수면 온도 조회 기본값).
DEFAULT_BUOY_STATION = 22107

# 전국을 대략적으로 커버하는 주요 ASOS 관측소 발췌 (station id, 이름, 위경도).
STATIONS = [
    {"id": 90, "name": "속초", "lat": 38.2509, "lon": 128.5647},
    {"id": 101, "name": "춘천", "lat": 37.9026, "lon": 127.7357},
    {"id": 105, "name": "강릉", "lat": 37.7515, "lon": 128.8761},
    {"id": 108, "name": "서울", "lat": 37.5714, "lon": 126.9658},
    {"id": 112, "name": "인천", "lat": 37.4776, "lon": 126.6249},
    {"id": 119, "name": "수원", "lat": 37.2568, "lon": 126.9831},
    {"id": 129, "name": "서산", "lat": 36.7766, "lon": 126.4944},
    {"id": 131, "name": "청주", "lat": 36.6392, "lon": 127.4407},
    {"id": 133, "name": "대전", "lat": 36.3722, "lon": 127.3720},
    {"id": 136, "name": "안동", "lat": 36.5730, "lon": 128.7073},
    {"id": 138, "name": "포항", "lat": 36.0326, "lon": 129.3799},
    {"id": 143, "name": "대구", "lat": 35.8798, "lon": 128.6528},
    {"id": 146, "name": "전주", "lat": 35.8410, "lon": 127.1229},
    {"id": 152, "name": "울산", "lat": 35.5824, "lon": 129.3301},
    {"id": 156, "name": "광주", "lat": 35.1729, "lon": 126.8916},
    {"id": 159, "name": "부산", "lat": 35.1047, "lon": 129.0320},
    {"id": 165, "name": "목포", "lat": 34.8173, "lon": 126.3816},
    {"id": 168, "name": "여수", "lat": 34.7394, "lon": 127.7407},
    {"id": 184, "name": "제주", "lat": 33.5141, "lon": 126.5297},
    {"id": 189, "name": "서귀포", "lat": 33.2461, "lon": 126.5653},
    {"id": 192, "name": "진주", "lat": 35.1633, "lon": 128.0429},
    {"id": 202, "name": "양평", "lat": 37.4892, "lon": 127.4944},
    {"id": 232, "name": "천안", "lat": 36.7686, "lon": 127.1174},
    {"id": 253, "name": "김해", "lat": 35.2011, "lon": 128.8885},
]


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def find_nearest_station(latitude: float, longitude: float) -> Dict:
    return min(STATIONS, key=lambda s: _haversine_km(latitude, longitude, s["lat"], s["lon"]))


def _parse_value(raw: str) -> Optional[float]:
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    return None if value <= -9 else value  # -9 = 결측(관측값 없음)


_COMPASS_16 = [
    "북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동",
    "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서",
]


def _wind_direction_label(code: Optional[float]) -> Optional[str]:
    """WD는 16방위 코드(1~36, 10도 단위)로 온다. 예: 27 -> 270도 -> 서."""
    if code is None:
        return None
    degrees = code * 10 % 360
    index = round(degrees / 22.5) % 16
    return _COMPASS_16[index]


def fetch_kma_weather(station_id: int) -> Optional[Dict]:
    """해당 관측소의 최신 관측값(기온/습도/강수량/풍향/풍속)을 가져온다. 실패하면 None."""
    auth_key = os.environ.get("KMA_AUTH_KEY", "").strip()
    if not auth_key or "여기에" in auth_key:
        return None

    try:
        res = httpx.get(
            KMA_URL,
            params={"tm": "", "stn": station_id, "help": 1, "authKey": auth_key},
            timeout=8,
        )
        res.raise_for_status()
        text = res.content.decode("euc-kr", errors="ignore")
    except Exception:
        return None

    data_line = next(
        (line for line in text.splitlines() if line.strip() and not line.startswith("#")),
        None,
    )
    if not data_line:
        return None

    cols = data_line.split()
    # 컬럼 순서: TM STN WD WS GST_WD GST_WS GST_TM PA PS PT PR TA TD HM PV RN RN_DAY ...
    try:
        wind_code = _parse_value(cols[2])
        wind_speed = _parse_value(cols[3])
        # RN(그 시각 강수량)은 계절에 따라 1~3시간 간격으로만 갱신되어 그 사이엔 결측(-9)으로
        # 찍히는 경우가 많다. 지금 비가 오고 있어도 0mm로 보일 수 있어서, 결측이면 자정부터
        # 누적된 RN_DAY(일 강수량)로 대체해 "오늘 비가 왔는지"를 더 안정적으로 판단한다.
        precipitation = _parse_value(cols[15])
        if precipitation is None:
            precipitation = _parse_value(cols[16])
        return {
            "temperature": _parse_value(cols[11]),
            "humidity": _parse_value(cols[13]),
            "precipitation": precipitation,
            "wind_direction": _wind_direction_label(wind_code),
            "wind_speed": wind_speed,
        }
    except IndexError:
        return None


def fetch_sea_surface_temperature(station_id: int = DEFAULT_BUOY_STATION) -> Optional[float]:
    """해양기상부이(kma_buoy)에서 해수면 온도(TW, 12번째 컬럼)를 가져온다. 실패하면 None."""
    auth_key = os.environ.get("KMA_AUTH_KEY", "").strip()
    if not auth_key or "여기에" in auth_key:
        return None

    try:
        res = httpx.get(
            BUOY_URL,
            params={"tm": 0, "stn": station_id, "help": 1, "authKey": auth_key},
            timeout=8,
        )
        res.raise_for_status()
        text = res.content.decode("euc-kr", errors="ignore")
    except Exception:
        return None

    data_lines = [line for line in text.splitlines() if line.strip() and not line.startswith("#")]
    if not data_lines:
        return None

    # tm=0은 최근 구간 여러 줄을 시간순으로 주므로 가장 마지막(최신) 줄을 쓴다.
    cols = data_lines[-1].split()
    try:
        return _parse_value(cols[11])  # TW: 해수면 온도(C)
    except IndexError:
        return None


def is_typhoon_active() -> Optional[bool]:
    """북서태평양에 현재 진행 중인 태풍이 있는지(typ_now) 확인한다. 조회 실패 시 None."""
    auth_key = os.environ.get("KMA_AUTH_KEY", "").strip()
    if not auth_key or "여기에" in auth_key:
        return None

    try:
        res = httpx.get(
            TYPHOON_URL,
            params={"tm": 0, "mode": 1, "disp": 0, "help": 1, "authKey": auth_key},
            timeout=8,
        )
        res.raise_for_status()
        text = res.content.decode("euc-kr", errors="ignore")
    except Exception:
        return None

    data_lines = [line for line in text.splitlines() if line.strip() and not line.startswith("#")]
    return len(data_lines) > 0


# 몬순(아시아 여름 몬순)의 핵심 특징: 남서~서남서 계열 바람 + 높은 습도.
_MONSOON_WIND_DIRECTIONS = {"남서", "남남서", "서남서"}
_HUMID_THRESHOLD = 70.0  # % 이상이면 "높음"
_STRONG_WIND_THRESHOLD = 4.0  # m/s 이상이면 "강함"


def classify_monsoon_similarity(humidity, wind_direction, wind_speed) -> Dict:
    """습도/풍향(+풍속)만으로 오늘이 몬순(2020년 장마) 패턴과 얼마나 비슷한지 규칙 기반으로 판정."""
    humidity_label = "높음" if humidity is not None and humidity >= _HUMID_THRESHOLD else "낮음"

    if wind_direction:
        strength = "강함" if wind_speed is not None and wind_speed >= _STRONG_WIND_THRESHOLD else "약함"
        wind_label = f"{wind_direction}풍 ({strength})"
    else:
        wind_label = "-"

    is_similar = humidity_label == "높음" and wind_direction in _MONSOON_WIND_DIRECTIONS

    return {
        "metric1_label": humidity_label,
        "metric2_label": wind_label,
        "is_similar": is_similar,
    }


# 2018년 폭염의 핵심 특징: 높은 기온 + (강수가 없어 일조시간이 긴) 맑은 날씨.
# 기상청 지상관측(kma_sfctm2)에는 일조시간 컬럼이 없어, 강수량 0mm를 "일조량 높음"의 대체 지표로 쓴다.
_HEATWAVE_TEMP_THRESHOLD = 33.0  # 폭염주의보 기준(°C)과 동일하게 맞춤
_SUNSHINE_PRECIPITATION_THRESHOLD = 0.5  # mm 미만이면 "일조량 높음"으로 간주


def classify_heatwave_similarity(temperature, precipitation) -> Dict:
    """기온/강수량만으로 오늘이 폭염(2018년) 패턴과 얼마나 비슷한지 규칙 기반으로 판정."""
    temp_label = "높음" if temperature is not None and temperature >= _HEATWAVE_TEMP_THRESHOLD else "낮음"
    sunshine_label = (
        "높음" if precipitation is not None and precipitation < _SUNSHINE_PRECIPITATION_THRESHOLD else "낮음"
    )
    is_similar = temp_label == "높음" and sunshine_label == "높음"

    return {
        "metric1_label": temp_label,
        "metric2_label": sunshine_label,
        "is_similar": is_similar,
    }


# 2022년 수도권 집중호우의 핵심 특징: 태풍(힌남노)이 따뜻한 해역에서 열/수증기를 공급받은 것.
_SEA_TEMP_THRESHOLD = 27.0


def classify_flood_similarity(sea_temp: Optional[float], typhoon_active: Optional[bool]) -> Dict:
    """해수면 온도(부이 실측)와 현재 태풍 발생 여부(실시간 조회)로 2022년 패턴과 얼마나 비슷한지 판정.
    두 값 다 조회에 실패하면(None) 안전하게 "낮음"/"발생하지 않음"으로 처리한다."""
    sea_temp_label = "높음" if sea_temp is not None and sea_temp >= _SEA_TEMP_THRESHOLD else "낮음"
    typhoon_label = "발생함" if typhoon_active else "발생하지 않음"

    return {
        "metric1_label": sea_temp_label,
        "metric2_label": typhoon_label,
        "is_similar": sea_temp_label == "높음",
    }
