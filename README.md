# 일본 세금환급 가이드

HTML/CSS/JavaScript 기반 GitHub Pages 정적 사이트입니다. 프레임워크·번들러·운영 서버 없이 동작하며 `linkedom`은 테스트 전용입니다.

[배포 사이트](https://xd1124.github.io/japan-tax-refund-guide/) · [자료 출처](DATA_SOURCES.md) · [업데이트 내역](CHANGELOG.md) · [개발 규칙](AGENTS.md)

## 실행

Node.js 22 이상과 npm을 사용합니다.

```sh
npm ci
npm test
npm run cache:check
npm run dev
```

미리보기는 `http://127.0.0.1:8765/japan-tax-refund-guide/`입니다. ES 모듈은 `file://` 대신 HTTP로 열어야 합니다. 테스트는 `.git`이나 과거 커밋 없이 소스 ZIP만으로 실행됩니다. 승인 전 Draft PR #1을 병합하거나 main에 push하지 않습니다.

## 구조 변경 전후

| 이전 | 현재 |
|---|---|
| HTML 안의 CSS·JS·base64 이미지 | HTML 화면, 기능별 `assets/css/`, `assets/js/`, `assets/images/` |
| 구형 22개와 추가 데이터를 실행 중 병합·변경 | `data/stores.js` 단일 스키마 80개 |
| 업체별 탭·별칭·등록·프로필 개별 수정 | `data/providers.js`로 두 탭·검색·안내 생성 |
| 전역 상태·navigate/calc 재정의 | `app.js`의 명시적 초기화와 기능 내부 상태 |
| 입력별 엔화·원화 이벤트 중복 | 한 계산 경로와 순수 계산 함수 |
| git show 기반 테스트 | 기준 fixture와 기능·DOM·환율 실패 테스트 |

`index.html`은 화면과 공항 안내 template, `data/`는 검토된 콘텐츠, `assets/css/`는 스타일입니다. `assets/js/app.js`에서 기능을 초기화하고 데이터·콜백을 전달합니다. `navigation.js`, `stores.js`, `providers.js`, `guides.js`, `checklist.js`, `calculator.js`, `changelog.js`, `scroll.js`는 각각의 화면 동작을 담당합니다. `search.js`는 DOM 없는 검색, `dom.js`는 안전한 텍스트·링크 생성, `storage.js`는 저장 오류 처리를 담당합니다.

## 새 매장을 추가하려면

**`data/stores.js`만으로 매장 추가와 검색·표시가 가능합니다.** 기존 항목의 필드 구조를 복사하고 다음 값을 확인합니다.

- 식별: `id`(고유), `ko`, `en`, `ja`, `brand`, `aliases`.
- 위치/종류: `region`, `city`, `address`, `floor`, `scope`(branch/facility/chain), `category`, `parentFacilityId`.
- 면세: `taxFreeAvailability`(official/not-eligible/unknown/tenant/branch-check).
- 업체: `providerId`(providers의 키 또는 null), `providerLabel`, `providerStatus`(official/reported/unknown/not-applicable).
- 조건: `refundFee`, `refundFeeBasis`, `taxFreeProcedure`, `taxFreeCounter`, `refundMethods`.
- 근거: `source`, `sources`의 url/label/scope, `verifiedAt`, `verifiedStatus`, `note`, `travelerReviews`.

미확인 값은 null 또는 unknown 규칙으로 남깁니다. 면세 제외 지점은 providerId를 null, providerStatus를 not-applicable로 둡니다. `providerLabel`의 여행자 참고 등 기존 의미를 공식 확인으로 바꾸지 않습니다. 입점 시설의 면세 상태는 상속하지 않습니다.

출처를 `DATA_SOURCES.md`에 기록하고 승인된 실제 변경은 `tests/fixtures/stores.json`에도 반영합니다. `npm run test:stores`를 실행합니다. 테스트의 임시 매장 추가 사례는 운영 데이터를 바꾸지 않고 검색 연결을 검증합니다.

## 새 환급업체를 추가하려면

**`data/providers.js`에 고유 키를 추가하면 프로필·등록 탭이 자동 생성됩니다.**

- `name`, `tabLabel`, `aliases`, `subtitle`.
- `stores`, `registration`, `fees`, `timing`, `caution`, `verified`, `sources`.
- 선택적 `appText`와 `guide`(steps/sources, 선택적 note/extras).
- `extras`는 afterStep/note 및 선택적 image/alt 또는 link/label로 등록 단계의 보충 안내를 표현합니다.

연결할 매장의 providerId를 지정합니다. HTML·검색·렌더러에 업체별 조건문을 추가하지 않습니다. 기존 필드로 표현할 수 없는 새 콘텐츠 유형만 스키마와 렌더러를 함께 확장합니다. 승인된 안내 변경은 `tests/fixtures/content.json`에 반영합니다.

`npm run test:dashboard`와 `npm run test:stores`가 임시 업체의 두 탭·프로필·등록 안내·매장 연결·별칭 검색을 검증합니다.

## 체크리스트 디자인을 수정하려면

| 변경 범위 | 파일 |
|---|---|
| 메인/상세 배치 | `index.html`의 .checklist-shortcut, #checklist |
| 카드·진행률·체크 행 스타일 | `assets/css/checklist.css` |
| 항목 행 DOM | `assets/js/checklist.js`의 render |
| 문구 | `data/checklist.js` |
| 상태·저장 키 | `assets/js/checklist.js` |
| 저장 읽기/쓰기 실패 처리 | `assets/js/storage.js` |

색상·여백 변경은 CSS만 수정합니다. 검색·계산기·저장 로직 변경과 결합할 필요가 없습니다. `npm run test:dashboard`로 메인/상세 진행률, 새 세션 복원, 초기화를 확인합니다.

## 오류 원인을 찾으려면

| 증상 | 확인 파일 | 명령 |
|---|---|---|
| 매장 누락·업체 연결 | stores/providers 데이터, search.js | `npm run test:stores` |
| 목록·탭·이동·체크 상태 | 해당 기능 JS, app.js, HTML ID | `npm run test:dashboard` |
| 금액·환율·저장 환율 | calculator.js, storage.js | `npm run test:fx` |
| 예전 코드·파일 404 | 상대 경로, 캐시 버전 | `npm run cache:check`, `npm test` |

브라우저 Console의 첫 오류와 Network의 실패 파일부터 확인합니다. 환율 문제는 실제 네트워크 상황과 `calculator.test.mjs`의 실패·경합 사례를 비교합니다. DOM 자동 테스트는 실제 CSS 배치 검사를 대체하지 않으므로 데스크톱/모바일 화면도 확인합니다.

## 캐시와 상대 경로

코드·스타일·데이터 수정 후 `npm run cache`를 실행합니다. HTML 자산 URL과 모듈 import를 전체 내용 기반 버전으로 갱신하며 번들링하지 않습니다. 갱신된 참조도 커밋합니다. `npm run cache:check`는 누락을 검사합니다. 데이터에서 직접 참조하는 이미지 교체 시에는 새 파일명을 사용합니다.

모든 자산은 GitHub Pages 하위 경로에서 동작하는 상대 경로입니다. `scripts/serve.mjs`도 동일한 하위 경로를 지원합니다. 빌드 단계나 서비스 워커는 없습니다.

## 남은 제약

- 기존 정보의 정확성 재조사는 이번 리팩터링 범위가 아닙니다. 확인 상태와 출처를 유지합니다.
- 체크 상태는 기존처럼 항목 순번 기반입니다. 항목 재정렬·삭제 시 저장 데이터 마이그레이션이 필요합니다.
- fixture는 승인된 변경만 함께 수정합니다. 단순 일치는 공식 정보의 정확성을 증명하지 않습니다.
- ES 모듈·dialog 등 현대 브라우저 기능을 사용하며 구형 브라우저용 호환 계층은 없습니다.
