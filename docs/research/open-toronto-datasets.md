# Toronto Open Data Awards 2026: 데이터 조사

조사일: 2026-11-24. open.toronto.ca CKAN API로 직접 검색하고 필드 값을 확인했습니다.

## 대회 핵심 조건

- 마감: **2026-12-04**
- open.toronto.ca 데이터셋을 1개 이상 써야 함. 2026년에 진행 중이거나 완료된 프로젝트여야 하고, 무료로 공개되어야 함.
- 해당 카테고리: **Open Data Applications** (심사 기준: 시민 문제를 분명히 정의했는지, 사용과 임팩트를 보여주는지, 디자인, **접근성(accessibility)**, 사용자 참여, 오픈소스 공개)
- 학부생이면 **Student Projects** 카테고리도 가능
- 참고: 2025년 honourable mention에 "Toronto Parking Insights"가 있어 주차 주제는 이미 다뤄졌음

---

## 주제 2: 접근성 지도 (추천)

| 데이터셋                                                                                                                     | 쓸 만한 필드                                                                                                                                                                              | 규모 / 갱신           |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| [Park Washroom Facilities](https://open.toronto.ca/dataset/washroom-facilities/)                                             | `ACCESSIBLE_FEATURES`: Accessible Stall, **Entrance at Grade**(계단 없는 입구), Entrance Access Ramp, Automatic/Powered Door Opener, Adult/Child Change Table, 그리고 `Status`(운영 여부) | 355개 / 매일          |
| [CREM Public Washrooms](https://open.toronto.ca/dataset/corporate-real-estate-management-portfolio-washrooms/)               | `Accessible Washroom` (Yes 37 / No 82), `Gender Inclusive`, `Hours Available`                                                                                                             | 119개                 |
| [Off-Street Parking – Accessible Stalls](https://open.toronto.ca/dataset/off-street-parking-surface-lots-accessible-stalls/) | Green P 주차장의 장애인 주차칸 위치, `AODA_TYPE` (A 409 / B 187)                                                                                                                          | 669칸 / 매년          |
| [Traffic Signals Tabular](https://open.toronto.ca/dataset/traffic-signals-tabular/)                                          | `AUDIBLEPEDSIGNAL`, `APS_OPERATION`(음성 보행 신호), `PEDWALKSPEED`, LPI(보행자 우선 신호) 날짜                                                                                           | 신호등 2,564개        |
| [Pedestrian Network](https://open.toronto.ca/dataset/pedestrian-network/)                                                    | `SIDEWALK_DESCRIPTION`(양쪽 / 한쪽 / 없음 / 부분), `CROSSWALK`, `PX_TYPE`                                                                                                                 | 87,105개 구간         |
| [Sidewalk Inventory](https://open.toronto.ca/dataset/sidewalk-inventory/)                                                    | 인도 유무 (SHP)                                                                                                                                                                           | 2019년 이후 갱신 없음 |
| [TTC Routes and Schedules (GTFS)](https://open.toronto.ca/dataset/ttc-routes-and-schedules/)                                 | `stops.txt`의 `wheelchair_boarding`: 1(가능) 8,059개, 2(불가) 1,298개                                                                                                                     | 정류장 9,357개 / 매월 |
| [TTC GTFS-Realtime](https://open.toronto.ca/dataset/ttc-gtfs-realtime-gtfs-rt/)                                              | 실시간 운행 장애 (엘리베이터 정보 포함 여부는 확인 못함)                                                                                                                                  | 실시간                |
| [Parks and Recreation Facilities](https://open.toronto.ca/dataset/parks-and-recreation-facilities/)                          | 공원·커뮤니티센터 위치, `AMENITIES`(Washroom, Playground, Picnic Site, Beach 등 20종)                                                                                                     | 1,801개 / 매월        |
| [Green Spaces](https://open.toronto.ca/dataset/green-spaces/)                                                                | 공원 폴리곤                                                                                                                                                                               | 3,383개               |
| [Parks Drinking Water Sources](https://open.toronto.ca/dataset/parks-drinking-fountains/)                                    | 음수대 위치. `ACCESSIBLE_FEATURES` 필드는 있지만 **전부 비어 있음**                                                                                                                       | 802개                 |
| [Street Furniture - Bench](https://open.toronto.ca/dataset/street-furniture-bench/)                                          | 벤치 위치 (쉬어 갈 곳)                                                                                                                                                                    | 2,256개               |
| [Festivals & Events](https://open.toronto.ca/dataset/festivals-events/)                                                      | `accessible_event` (Yes 25,001 / No 4,278), `event_features`(Public Washrooms, Free/Paid Parking 등)                                                                                      | 29,279개 / 실시간     |
| [Places of Interest and Attractions](https://open.toronto.ca/dataset/places-of-interest-and-toronto-attractions/)            | 관광지 178곳, 카테고리                                                                                                                                                                    | 매년                  |
| [StrollTO](https://open.toronto.ca/dataset/strollto/)                                                                        | 158개 동네의 POI 1,838곳. `Accessibility` 필드는 있지만 **전부 비어 있음**                                                                                                                | 매년                  |
| [Multi-Use Trail Entrances](https://open.toronto.ca/dataset/multi-use-trail-entrances/)                                      | 트레일 입구 위치 (SHP)                                                                                                                                                                    | 2019년 이후 갱신 없음 |
| [Cycling Network](https://open.toronto.ca/dataset/cycling-network/)                                                          | 다목적 트레일 구간, `SURFACE`(노면)                                                                                                                                                       | 1,581개 구간          |

**빈 곳:** 시 데이터에는 "공원·트레일 자체가 휠체어로 갈 수 있는지"(노면, 경사, 계단 없는 입구)가 없습니다. 화장실을 빼면 시설 입구의 계단 유무도 없습니다. 아래 외부 소스로 이 부분을 채워야 하는데, 이 빈 곳을 메우는 것 자체가 프로젝트의 차별점이 됩니다.

## 주제 1: 드라이브 여행

| 데이터셋                                                                                                                                                                                                                                                                                                                                                                                   | 내용                                                | 비고                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------- |
| [Green P Parking](https://open.toronto.ca/dataset/green-p-parking/)                                                                                                                                                                                                                                                                                                                        | 주차장 252곳, 요금, 수용 대수, 높이 제한, 결제 방법 | **2019년 이후 갱신 없음**. 요금이 오래된 값 |
| [Parking Occupancy](https://open.toronto.ca/dataset/parking-occupancy/)                                                                                                                                                                                                                                                                                                                    | TPA 주차장 이용률                                   | 분기별                                      |
| [Parking Lot Facilities](https://open.toronto.ca/dataset/parking-lot-facilities/)                                                                                                                                                                                                                                                                                                          | 공원 주차장                                         | 2016년 데이터                               |
| [On-Street Permit Parking Area Maps](https://open.toronto.ca/dataset/on-street-permit-parking-area-maps/)                                                                                                                                                                                                                                                                                  | 거주자 주차 구역 (피해야 할 곳)                     | 매일                                        |
| [City EV Charging Stations](https://open.toronto.ca/dataset/city-operated-electric-vehicle-charging-station-map/)                                                                                                                                                                                                                                                                          | 시 운영 충전소 82곳, Level 2/3 포트 수              | 분기별                                      |
| [Road Restrictions](https://open.toronto.ca/dataset/road-restrictions/)                                                                                                                                                                                                                                                                                                                    | 실시간 도로 통제·공사                               | 실시간                                      |
| [Traffic Cameras](https://open.toronto.ca/dataset/traffic-cameras/)                                                                                                                                                                                                                                                                                                                        | 교통 카메라 위치                                    |                                             |
| [Places of Interest](https://open.toronto.ca/dataset/places-of-interest-and-toronto-attractions/), [StrollTO](https://open.toronto.ca/dataset/strollto/), [Heritage Register](https://open.toronto.ca/dataset/heritage-register/), [Public Art](https://open.toronto.ca/dataset/public-art/), [Cultural Hotspot POI](https://open.toronto.ca/dataset/cultural-hotspot-points-of-interest/) | 코스에 넣을 목적지                                  |                                             |
| [Festivals & Events](https://open.toronto.ca/dataset/festivals-events/)                                                                                                                                                                                                                                                                                                                    | 행사 정보, `event_features`의 Free/Paid Parking     | 실시간                                      |
| [Park Washroom Facilities](https://open.toronto.ca/dataset/washroom-facilities/), [Parks Drinking Water](https://open.toronto.ca/dataset/parks-drinking-fountains/)                                                                                                                                                                                                                        | 휴게 편의시설                                       | 매일                                        |
| [Toronto Beaches Water Quality](https://open.toronto.ca/dataset/toronto-beaches-water-quality/), [Island Ferry Ticket Counts](https://open.toronto.ca/dataset/toronto-island-ferry-ticket-counts/)                                                                                                                                                                                         | 여름 코스용                                         |                                             |

**약점:** 핵심 주차 데이터(Green P)가 2019년 값이고, "드라이브 코스"는 시민 문제와 연결하기 어렵습니다. 심사 기준 1번이 "clear civic problem"입니다.

---

## 지도 / 경로 API: 무료로 쓸 수 있는 것

### Google Maps Platform (pricing 페이지 2026-11-24 확인)

2025년 3월부터 월 $200 크레딧이 없어지고 **SKU별 월 무료 호출량**으로 바뀌었습니다. 결제 카드 등록은 필요합니다. 신규 가입 시 $300 체험 크레딧도 있습니다.

| SKU                                                  | 월 무료            | 초과 시 (1,000건당) |
| ---------------------------------------------------- | ------------------ | ------------------- |
| Maps Embed API (iframe)                              | **무제한**         | 무료                |
| Maps SDK (모바일)                                    | **무제한**         | 무료                |
| Dynamic Maps (Maps JavaScript API, 페이지 로드 기준) | 10,000             | $7                  |
| Static Maps                                          | 10,000             | $2                  |
| Map Tiles 2D                                         | 100,000            | $0.60               |
| Geocoding                                            | 10,000             | $5                  |
| Routes: Compute Routes Essentials / Pro              | 10,000 / 5,000     | $5 / $10            |
| Places (New) Place Details Essentials / **Pro**      | 10,000 / **5,000** | $5 / $17            |
| Places Text Search / Nearby Search Pro               | 5,000              | $32                 |
| Autocomplete                                         | 10,000             | $2.83               |

**접근성 주제에 특히 중요한 점:** Places API (New)의 `accessibilityOptions` 필드(`wheelchairAccessibleEntrance` / `Parking` / `Restroom` / `Seating`)가 **Pro 등급**에 들어 있어 월 5,000건까지 무료입니다. 시 데이터에 없는 "계단 없는 입구" 정보를 여기서 가져올 수 있습니다. 드라이브 주제에 쓸 `parkingOptions`는 Enterprise + Atmosphere 등급이라 월 1,000건까지만 무료입니다.

**약관 주의 (Maps Platform Terms 3.2.3):**

- Places 데이터를 캐시하거나 대량 다운로드해서 저장하면 안 됩니다. 미리 긁어 DB에 넣는 방식은 불가능하고, 사용자가 요청할 때마다 조회해야 합니다.
- Places 데이터를 **Google이 아닌 지도(Leaflet/OSM 등) 위에 표시하면 안 됩니다.** Google 데이터를 쓰려면 지도도 Google 지도여야 합니다.
- 비영리·스타트업용 크레딧 프로그램은 있지만 학생용 프로그램은 찾지 못했습니다.

### 완전 무료 대안 (오픈 데이터)

- **OpenStreetMap `wheelchair` 태그**: `yes`(계단 없음) / `limited` / `no` / `designated`. 공원 입구, 건물, 화장실, 길에 붙어 있습니다. 저장하고 재배포할 수 있습니다(ODbL, 출처 표기 필요).
- **Overpass API** (OSM 질의용): 공식 인스턴스 한도는 하루 1만 쿼리 / 1GB. 라이브 앱에서 직접 부르지 말고 **미리 한 번 받아 GeoJSON으로 저장**하는 방식을 권장합니다. 공식 정책상 lovable.app·netlify.app 같은 플랫폼에 올린 AI 생성 앱에서 직접 호출하는 것은 허용되지 않습니다.
- **OpenRouteService**: **`wheelchair` 경로 프로필**이 있습니다. 계단 회피(`avoid_features: steps`), 최대 경사, 턱 높이, 노면, 최소 폭을 지정할 수 있습니다. 휠체어 경로는 최대 300km. 무료 플랜의 일일 한도는 페이지가 JS라 확인하지 못했습니다(가입 후 확인 필요).
- **지도 표시**: Leaflet 또는 MapLibre에 OSM 계열 타일을 얹으면 됩니다. 단, 이 조합에는 Google Places 데이터를 올릴 수 없습니다.
- **AccessNow** (토론토 기반 접근성 지도): 공개 API는 없습니다. 제휴를 원하면 직접 연락해야 합니다.
- Wheelmap / accessibility.cloud: 사이트가 막혀 있어 확인하지 못했습니다.

---

## 결론과 제안

**주제 2(접근성)를 추천합니다.**

1. 시 데이터에 접근성 필드가 실제로 많습니다: 화장실 입구 계단 유무, 장애인 주차칸, 음성 신호등, 인도 유무, TTC 휠체어 탑승 가능 정류장, 접근 가능한 행사.
2. 심사 기준 중 "clear civic problem"과 "accessibility"에 바로 맞고, 주차 주제는 이미 2025년 수상작이 있습니다.
3. 드라이브 주제의 핵심인 주차 데이터는 2019년 값이라 품질이 약합니다.

**구성 방향 두 가지:**

- **A안 (완전 무료, 저장 가능):** 시 데이터 + OSM `wheelchair` 태그 + OpenRouteService wheelchair 경로 + Leaflet/MapLibre
- **B안 (Google):** Maps JavaScript API + Places `accessibilityOptions`(월 5,000건 무료) + 시 데이터. 지도는 반드시 Google 지도여야 하고 Places 결과는 저장할 수 없습니다.

공원·트레일 "계단 없는 입구" 데이터는 어느 쪽에도 완전하지 않습니다. 그래서 사용자 제보 기능을 넣는 것도 방법이고, 심사 기준의 "engagement with users"와도 맞습니다.
