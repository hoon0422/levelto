# ADR 0001: 12/4 제출 범위와 결정 사항

- 상태: 승인 (2026-11-27, Paul 인터뷰 결과)
- 대상: Toronto Open Data Awards 2026, Open Data Applications 부문, grassroots, 마감 2026-12-04

이 문서는 팀 인터뷰에서 정한 내용을 모은 것입니다. 세션이나 팀원이 작업을 시작할 때 이 문서를 기준으로 삼고, README나 AGENTS.md와 다르면 **이 문서가 우선**합니다 (README의 TTC 연계, 제보, 도시 전체 타일은 다음 단계 목표입니다).

## 제품 한 줄

휠체어 이용자를 위한 지도: 주변 장소를 직선 거리가 아니라 "휠체어로 실제 가기 편한 순서"로 보여주고, 경사, 계단 의심, 공사 구간, 도착지 입구와 화장실 접근성을 함께 알려준다.

## 1차 범위 (12/4까지)

- **도보(휠체어) 경로만.** Google 길찾기(Routes) API는 쓰지 않는다. 경로는 우리 엔진(`src/lib/routing/`)이 계산한다.
- **시범 구역 두 곳**: Bloor-Yonge 역 주변(반경 1.5km 요청 중, 페르소나 A의 College 역 출발을 포함하기 위해), High Park 역 반경 1km.
- **모바일 우선 웹앱**, 데스크톱에서도 동작. **영어 UI만.**
- 흐름: 출발지 선택(두 역 버튼, 주소 검색, 내 위치) -> 주변 장소(카페) 목록을 가기 편한 순서로 -> 장소 선택 -> 경로 확인(지도 선, 고도 그래프, 텍스트 단계 안내, 경고).
- 범위 밖 출발지는 `OUT_OF_COVERAGE` 안내를 보여주고 두 역 버튼으로 유도한다.

## 범위 밖 (다음 단계로 발표)

TTC 연계, 실시간 GPS 길안내, 막힌 길 제보와 우회 제안, 잘못된 정보 신고, 즐겨찾기, 도시 전체 타일, 장소 사진, 지하(PATH) 경로, 네이티브 앱.

## 추천 순위 규칙

1. 경로 비용은 시간: 경사별 휠체어 속도, 횡단보도 +30초, **계단 의심 간선 +2분**(오탐이 많아 차단하지 않음), **도로 제한 30m 이내 +5분**.
2. 사용자 **경사 한도**를 넘는 간선은 경로에서 제외. 기본값 **8.33%(1:12)**, 최종값은 CILT 응답을 보고 정한다 (브리프의 12%는 1:12를 옮겨 적은 것으로 보고 확인 중).
3. 도착지 접근성(Google Places `accessibilityOptions`)은 세 가지 상태로 다룬다.
   - 입구 **불가(false)**: 목록에서 제외하고 "N places excluded: entrance not accessible"을 보여준다.
   - 입구 **가능(true)**: 이동시간 그대로 순위.
   - **정보 없음(null)**: 제외하지 않고 순위용 시간에 **+5분**을 더하며 "Not verified, call ahead" 표시.
   - 화장실은 사용자가 "Need accessible washroom"을 켰을 때만 같은 규칙을 적용한다.
4. 벌점 값(+2분, +5분)은 근거 없는 가정값이므로 화면(About/Data 화면)에 공개한다.
5. 시간은 범위로 표시한다 (계산값의 0.85~1.3배).

## 정보 표시 원칙

- 확실한 것과 추정을 구분한다: "Stairs suspected"(추정), "No info"(정보 없음)를 숨기지 않는다.
- 출처와 기준 시각을 표시한다.
- **아이콘 + 짧은 글자 + 숫자**를 함께 쓴다. 색만으로, 아이콘만으로 정보를 전달하지 않는다.

## 접근성 기준

- 목표는 **WCAG 2.2 AA** (AGENTS.md의 2.1 AA를 포함). "준수"라고 주장하지 않고 "목표로 제작, 자동 점검 결과, 알려진 한계"를 공개한다.
- 키보드만으로 모든 기능, 지도 없이 텍스트 목록으로 모든 결과 사용, 대비 4.5:1, 터치 대상 24px 이상(가능하면 44px), 라벨, 상태 변화는 `aria-live`.
- 경사 표시: 선 모양(실선/점선) + % 라벨 + 등급 글자. 색만 쓰지 않는다.
- 접근성 성명서 페이지를 둔다.

## 데이터와 출처

| 데이터                               | 라이선스                                                    |
| ------------------------------------ | ----------------------------------------------------------- |
| Pedestrian Network (open.toronto.ca) | Open Government Licence - Toronto                           |
| Road Restrictions (open.toronto.ca)  | Open Government Licence - Toronto                           |
| HRDEM 1m DTM (NRCan)                 | Open Government Licence - Canada                            |
| OSM `highway=steps`                  | ODbL, "© OpenStreetMap contributors"                        |
| Google Maps, Places                  | Google 약관: Places 결과 저장 금지, Google 지도 위에만 표시 |

앱 안에 "Data & attribution" 화면, 레포에 `ATTRIBUTION.md`. 생성 타일은 공개하고 OSM에서 온 계단 필드는 ODbL로 명시한다. Pedestrian Network 페이지가 스스로 밝힌 한계(위상 정확도 우선, 완전성 한계)를 알려진 한계에 인용한다.

## 역할과 파일 경계

| 영역                          | 담당  | 파일                                                                     |
| ----------------------------- | ----- | ------------------------------------------------------------------------ |
| 전처리, 타일, 경로 탐색       | Young | `pipeline/`, `src/lib/routing/` (단 `types.ts` 변경은 합의 후)           |
| 화면, 추천 점수, Places 검색  | Paul  | `src/app/`, `src/components/`, `src/lib/scoring/`, `src/app/api/places/` |
| 디자인, 서베이, 이용자 테스트 | Dahye | 시안, CILT 서베이                                                        |

- 경로 탐색과 화면의 계약은 `src/lib/routing/types.ts`의 `WalkRouteRequest`, `WalkRouteResult`, `NearbyWalkSummary`다.
- 탐색이 완성되기 전에는 `src/lib/routing/fixtures.ts`의 가짜 결과로 화면을 만든다.
- 화면 쪽 컴포넌트 경계: `components/map/RouteLayer.tsx`와 `components/routing/RouteDetail.tsx`(경로 표시), `components/places/PlaceList.tsx`(장소와 추천), `components/layout/AppShell.tsx`(상태와 배치).

## 심사 항목별 증거

| 항목        | 증거                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| 오픈소스    | 공개 레포(MIT), 데이터 재생성 README, ATTRIBUTION.md                                |
| 접근성      | axe/Lighthouse 결과, 키보드 시연, 지도 없는 목록, 접근성 성명서                     |
| 디자인      | Dahye 시안 기반 모바일 화면                                                         |
| 시민 문제   | CILT 응답 인용, 시범 구역 데이터 수치                                               |
| 이용자 참여 | CILT 서베이, 12/1~2 폰 테스트, 의견으로 바꾼 점                                     |
| 사용과 영향 | 약점으로 인정: 공개 URL, 테스트 결과, 반영 사례로 대신 (KPI 수치를 지어내지 않는다) |

## 열린 질문

- 경사 한도 기본값 (8.33% vs 12%): Dahye 확인, CILT 응답
- Bloor-Yonge 구역 1.5km 확대: Young 확인
- 타일 파일명과 위치(`public/data/tiles` vs Supabase): Young 확인
- OSM 계단 필드의 ODbL 해석: 제출 전 재확인
