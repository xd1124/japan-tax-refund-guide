# Store Finder 데이터 검토 — 2026.11.24

## 구조와 유지보수

- 기존 22개와 추가 58개 항목의 내용·출처·확인 상태를 `data/stores.js`의 단일 스키마로 보존합니다. 실행 중 구형/신규 배열을 병합하지 않습니다.
- 검색은 `assets/js/search.js`, 표시는 `assets/js/stores.js`, 스타일은 `assets/css/stores.css`입니다. 방문자용 외부 라이브러리는 없습니다.
- `scope`는 branch(개별 지점), facility(쇼핑시설), chain(체인 공통)입니다. `parentFacilityId`는 입점 매장과 시설을 연결합니다.
- `taxFreeAvailability`와 `providerStatus`(기존 refundProviderStatus/level)는 독립 상태입니다. 공식 면세 목록에 있어도 환급업체를 추정하지 않습니다. null은 미확인입니다. `providerId`는 기존 service, `providerLabel`은 기존 provider 표시를 보존합니다.
- `verifiedAt`은 자료 검토일입니다. 현장 확인일, 게시일, 경험일을 의미하지 않습니다. 기존 확인일은 만들지 않았습니다.
- 중요한 기능 변경은 `CHANGELOG.md`와 `data/changelog.js`를 함께 수정합니다. 사소한 데이터 보완은 이 문서에 기록합니다. 아래 조사 기록의 이전 파일명은 조사 당시 기준입니다.

## 추가 범위

36개 항목: 나고야 11, 도쿄 16, 기타 지역(요코하마) 1, 전국 체인 공통 8.
개별 지점 23개 중 공식 면세 안내 확인 22개, 지점 존재만 확인 1개. 시설 5개는 입점 점포별 상태입니다.
새 지점 23개 중 환급업체 공식 확인 6개(Global Blue), 미확인 17개.
기존 항목 22개와 합쳐 총 58개입니다. 체인 공통 항목을 지점 수에 포함하지 않습니다.

## 근거와 한계

각 항목의 정확한 링크는 `stores-data.js`의 `sources`에 저장하고 화면에 표시합니다. 검색 도구에서 공식 페이지 본문 및 공식 도메인의 색인 결과를 함께 검토했습니다. 일부 직접 열기 결과는 수개월 전 캐시였고, 일부는 수집 실패했습니다. 모든 URL에 실시간 HTTP 200 검사를 완료했다는 의미는 아닙니다.

- 로프트: 사카에(525), 미나토(441), 이케부쿠로(193), 신주쿠산초메(659) 공식 지점 페이지에서 접수 시간·면세 표시 확인. 긴자는 공식 전용 페이지. 업체·수수료는 미확인. 시부야는 최신 검색 자료와 이전 본문 주소가 달라 주소를 미기재했습니다.
- 나고야돔마에 로프트: 공식 개점 뉴스(715249 / shop_id=673)만 확인. 면세 가능으로 확정하지 않았습니다.
- 나고야·시부야 PARCO: 공식 `/taxfree/`에서 통합 카운터 없음, 입점 점포별 수속 확인. 나고야 포켓몬센터는 나고야 PARCO 대상 점포 목록 근거이며 다른 포켓몬센터의 업체를 승계하지 않습니다.
- 이케부쿠로 PARCO: 공식 대상 점포 목록 근거. 나고야·시부야의 카운터 규정을 일괄 복사하지 않았습니다.
- 마쓰자카야 나고야: 최신 공식 색인에 세전 구매액 최대 2.3% 명시. 이전 본문에는 1.55%가 있어 사용하지 않았습니다. 일본어 안내의 본관 6층과 다른 언어의 남관 3층 정보가 충돌해 카운터 재확인을 표시합니다.
- JR 나고야 다카시마야: 공식 FAQ의 11층·당일 수속만 반영. 이전 제도의 수수료·한도·포장 규정을 제외했습니다. 신주쿠는 공식 서비스 페이지의 당일 11층 수속과 개정 공지 확인.
- 나고야 사카에 미쓰코시·이세탄 신주쿠: 해당 공식 해외 방문객 안내에서 면세 안내 확인. 업체·수수료·정확한 카운터 층은 추정하지 않았습니다.
- ShinQs: 공식 외국인 안내 및 개정 제도 안내에서 영수증/입점 매장에 따른 B1 또는 개별 수속 구분. GINZA SIX는 공식 서비스 페이지의 카운터 대상 매장 구매분 범위만 반영합니다.
- 빅카메라: 나고야역 서쪽·유라쿠초 공식 지점 페이지와 나고야 관광 공식 JR 게이트타워 안내의 면세 취급 확인. 체인/후기 업체를 새 지점에 자동 지정하지 않았습니다.
- 무인양품 긴자: 공식 지점 페이지의 4층 면세 계산대만 반영. 과거 체인 한도는 제외했습니다.
- 요도바시: [2026.11 시행 공식 공지](https://www.yodobashi.com/ec/support/news/2610280032675/index.html), [Global Blue 공식 발표](https://prtimes.jp/main/html/rd/p/000000027.000022577.html)의 대상 11개 지점 목록에서 이번 6개 지점 확인. 공식 색인에서 제휴업체와 세관 미확인 시 등록 카드 청구 조건 확인. 접수 층·시간·수수료는 미확인입니다.
- 유니클로·GU: 공식 환급 FAQ의 J&J Tax Free / J-TaxRefund, 환급액 기준 약 10%를 체인 공통 정보로만 반영. 개별 지점 면세 취급은 확정하지 않습니다.
- 핸즈: 확인한 나고야 PDF는 개정 전 자료입니다. 체인 항목에 이전 자료임을 표시하고 새 지점의 현행 절차로 사용하지 않습니다.
- 제도 교차 확인: [관광청 여행자 안내](https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00021.html), [국세청 자료 위치](https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/format/002.htm), [빅카메라 개정 안내](https://www.biccamera.com/bc/c/super/okaimono/oshiharai/taxfree/index.jsp), [미쓰코시·이세탄 공지](https://www.isetan.mistore.jp/common/important_news/importantnews_detail024.html). 국세청은 연결 위치 확인이며 원문 전체 재검증은 완료하지 못했습니다.

## 여행자 후기 조사

새로 확정한 후기: 0건. 기존 제보와 기존 업체 가이드는 보존했습니다.

| 후보 | 검토 결과 | 처리 |
|---|---|---|
| [goldenori 나고야·주부공항](https://goldenori.com/일본-면세-환급-방법-주부공항/) | 검색 발췌는 2026.11 개인 경험과 작성 시 환급 미수령을 언급. 본문 열기 실패, 게시일 메타데이터와 본문 작성 시점이 달라 정확한 날짜·지점 검증 불가 | 검토 후보로만 보존. 환급 완료·특정 지점에 연결하지 않음 |
| [Reddit 1xlfigz](https://www.reddit.com/r/JapanTravelTips/comments/1xlfigz/) | 본문 수집 실패 | 제외 |
| [Reddit 1xyiuik](https://www.reddit.com/r/JapanTravelTips/comments/1xyiuik/) | 본문 수집 실패 | 제외 |
| [Reddit 1xz6bhc](https://www.reddit.com/r/JapanTravelTips/comments/1xz6bhc/) | 본문 수집 실패 | 제외 |

한국어·일본어·Reddit 추가 검색에서 검증 가능한 신규 1차 경험을 확보하지 못했습니다. 뉴스·업체 공지·일반 안내를 여행자 후기 수로 계산하지 않습니다. 향후 후기에는 실제 지점, 구매일, 출국일, 공항, 업체, 환급 상태/완료 여부, 게시일, 원문, 미확인 사항을 각각 기록하세요.

## 추가 확인이 필요한 대상

- 돈키호테 도쿄·나고야 지점: 지점별 개정 후 수속·업체 검증 보류. 기존 체인 제보 유지.
- 유니클로·GU 도쿄·나고야 지점: 체인 안내만 확인. 지점별 면세 제외 여부 검증 보류.
- 핸즈 나고야·도쿄, 무인양품 나고야: 최신 개별 안내 확보 필요.
- 미쓰코시 긴자: 개정 공지 연결은 확인했지만 지점 수속 자료를 충분히 검증하지 못해 신규 지점 추가 보류.
- 모든 업체 미확인 지점, 로프트 신규 지점 면세 가능 여부, 마쓰자카야 카운터 언어별 충돌은 현장·최신 공식 안내 재확인 필요.

## 검사

`node tests/store-finder.test.cjs`: 구문, 원본 22개 보존, 한국어/일본어/영어/초성 검색, 지역 필터, 중복 ID, 상위 시설 연결, 미확인 상태, 수수료 기준, 기존 앱·환율 코드 보존을 검사합니다. URL 문법 검사는 링크의 가용성 보장이 아닙니다. 화면·모바일 동작은 별도 브라우저 검사 대상입니다.


## DAISO·Seria 지점 확장 — 2026.11.24

이번 추가 22지점(DAISO 16, Seria 6), 나고야 10(DAISO 6, Seria 4). 기존 58항목을 보존해 총 80항목입니다.
추가분 면세 가능 공식 확인 0, 면세 대상 아님 공식 확인 2, 미확인 20. 환급업체 미확인 20, 해당 없음 2. 체인 전체로 일반화하지 않습니다.

`not-eligible`은 공식 면세 제외, `unknown`은 면세 여부 미확인입니다. 기존 `official`, `tenant`, `branch-check`의 의미는 보존했습니다. `refundProviderStatus: not-applicable`은 공식 제외 지점에만 사용합니다. 층수·주소 미확인은 null입니다. DAISO 계열의 Standard Products·THREEPPY 정보는 복사하지 않았습니다.

### 지점별 출처

| 지점 | 지역 | 층 | 면세 상태 | 공식 자료 |
|---|---|---|---|---|
| 다이소 나고야 사카에 스카일점 | 나고야 | 7F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/007352) |
| 다이소 나고야 이마이케점 | 나고야 | 미확인 | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/007231) |
| 다이소 나고야 호리타점 | 나고야 | 미확인 | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/005589) |
| 다이소 나고야 나루파크점 | 나고야 | 2F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/003097) |
| 다이소 샴피아포트 나고야 다카쓰지점 | 나고야 | 미확인 | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/007339) |
| 다이소 나고야 오스점 | 나고야 | 1F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/009076) |
| 다이소 시부야 마크시티점 | 도쿄 | 1F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/003086) · [브랜드 안내](https://www.s-markcity.co.jp/shop-restaurant/w-1-4-1/) |
| 다이소 시부야 센터가이점 | 도쿄 | 미확인 | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/008931) |
| 다이소 하라주쿠점 | 도쿄 | 2F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/007157) |
| 다이소 난바 워크점 | 오사카 | 미확인 | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/002627) · [브랜드 안내](https://walk.osaka-chikagai.jp/index.php/shopguide/586) |
| 다이소 신사이바시점 | 오사카 | 3F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/008646) |
| 다이소 구로몬시장점 | 오사카 | 1F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/005312) |
| 다이소 이온몰 교토점 | 기타 지역 | 4F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/008286) |
| 다이소 하카타 버스터미널점 | 기타 지역 | 5F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/001516) · [브랜드 안내](https://www.h-bt.jp/floor/shop31.html) |
| 다이소 삿포로 다누키코지 2초메점 | 기타 지역 | 6F | 미확인 | [공식 지점 안내](https://www.daiso-sangyo.co.jp/shop/detail/002210) |
| 세리아 시미즈야 후지가오카점 | 나고야 | 4F | 미확인 | [공식 지점 안내](https://www.shimizuya.co.jp/store/p871/) · [브랜드 안내](https://shop.seria-group.com/seria/info/000002229) |
| 세리아 오스점 | 나고야 | 미확인 | 미확인 | [공식 지점 안내](https://www.kinsyachi.com/shop/seriaosuten/) |
| 세리아 아스날 가나야마점 | 나고야 | 3F | 미확인 | [공식 지점 안내](https://www.asunal.jp/shopguide/detail/?cd=000050) · [브랜드 안내](https://www.asunal.jp/news/) |
| 세리아 빅카메라 나고야역 서쪽점 | 나고야 | 5F | 미확인 | [공식 지점 안내](https://www.biccamera.com/bc/i/shop/shoplist/shop033.jsp) |
| 세리아 키테라타운 후쿠오카 나가하마점 | 기타 지역 | 3F | 미확인 | [공식 지점 안내](https://fukuoka-nagahama.kiteratown.jp/tenpo/seria/) · [브랜드 안내](https://shop.seria-group.com/seria/info/000002463) |
| 다이소 마로니에 게이트 긴자점 | 도쿄 | 마로니에 게이트 긴자 2 · 6F | 대상 아님 · 공식 확인 | [공식 지점 안내](https://www.marronniergate.com/shop/index/304) |
| 세리아 이케부쿠로 P’PARCO점 | 도쿄 | P’PARCO 5F | 대상 아님 · 공식 확인 | [공식 지점 안내](https://ikebukuro.parco.jp/shop/detail/?cd=027190) |

긴자 DAISO와 이케부쿠로 Seria는 각각 시설 공식 페이지의 ‘免税 対象外’를 확인했습니다. 다른 20곳은 공식 지점·시설·상점가 안내로 존재를 확인했으나 면세 여부와 환급업체를 확정할 자료는 찾지 못했습니다. 빅카메라의 면세 표시는 입점 Seria에 적용하지 않습니다. 검색 색인 및 열람 가능한 공식 본문을 검토했으며 캐시된 자료도 포함되어 현장 영업·접수 상황을 보장하지 않습니다.

### 2026.11.1 이후 여행자 후기 조사

검증 가능한 DAISO·Seria 구매·환급 경험 0건, 환급 완료 사례 0건. 브랜드·지점·구매일·공항·업체·완료 증빙·작성일·원문 URL을 갖춘 후기를 확인하지 못해 데이터 배열은 비워 두었습니다. ‘없음’이 아닌 이번 검색 범위 내 미검증입니다.

- 한국: 네이버 블로그/카페 대상 검색 및 일반 검색. 해당 도메인은 robots 제한으로 원문 검증 불가.
- 일본: X, note, Yahoo!知恵袋 대상 DAISO·Seria/免税/リファンド/2026.11 검색. 조건에 맞는 지점별 실제 환급 후기를 검증하지 못함.
- 해외: Reddit JapanTravelTips 및 일반 검색. [Seria 방문 글](https://www.reddit.com/r/TabiJapan/comments/1w84nei/this_sub_told_me_to_check_out_seria_i_finally_did/)은 제도 시행 전 글이므로 제외.
- [100엔숍 비교 안내](https://imaginarithink.com/entry/일본-100엔숍-비교-다이소-세리아-캔두-3코인즈)는 정보 안내 글로 실제 환급 후기에 포함하지 않음.
- 제도 확인: [관광청 공식 안내](https://www.mlit.go.jp/kankocho/tax-free/page01_000001_00019.html). 이전 제도의 구매한도·수수료를 신규 지점 데이터에 전용하지 않음.
