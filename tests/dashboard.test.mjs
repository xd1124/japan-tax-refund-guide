import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { boot, memoryStorage } from "./helpers.mjs";
import { initApp } from "../assets/js/app.js";
import { stores } from "../data/stores.js";
import { providers } from "../data/providers.js";
import { guideContent } from "../data/guides.js";
import { checklistItems } from "../data/checklist.js";
import { changelogEntries } from "../data/changelog.js";
import { CHECKLIST_KEY } from "../assets/js/checklist.js";

test("기존 업체·가이드·체크리스트·업데이트 내용 보존", () => {
  const fixture = JSON.parse(
    fs.readFileSync(new URL("./fixtures/content.json", import.meta.url)),
  );
  assert.deepEqual(
    { providers, guideContent, checklistItems, changelogEntries },
    fixture,
  );
});
test("전체 앱 초기화·라우팅·상단 로고·이전 다음·해시 복원", () => {
  const { document: d, window: w, app, click } = boot();
  assert.equal(initApp(d, w), app, "재초기화는 리스너를 추가하지 않음");
  const active = () => d.querySelector(".page.on").id;
  for (const page of [
    "before",
    "afterbuy",
    "beforehome",
    "summary",
    "services",
    "faq",
    "checklist",
    "stores",
  ]) {
    app.navigation.navigate(page);
    click(".logo-home");
    assert.equal(active(), "home");
    assert.equal(w.lastScroll.top, 0);
  }
  for (const [page, next] of [
    ["before", "afterbuy"],
    ["afterbuy", "beforehome"],
    ["beforehome", "home"],
  ]) {
    app.navigation.navigate(page);
    click("#" + page + " .step-next");
    assert.equal(active(), next);
  }
  app.navigation.navigate("beforehome");
  click("#beforehome .page-actions button");
  assert.equal(active(), "afterbuy");
  for (const page of ["summary", "services", "faq", "checklist"])
    assert.equal(d.querySelectorAll("#" + page + " .page-actions").length, 0);
  w.location.hash = "#checklist";
  w.dispatch("hashchange");
  assert.equal(active(), "checklist");
  w.location.hash = "#%broken";
  assert.doesNotThrow(() => w.dispatch("hashchange"));
  assert.equal(d.querySelectorAll(".page-actions").length, 3);
  assert.equal(d.querySelectorAll('#home [data-route="checklist"]').length, 1);
  assert.equal(d.querySelectorAll("#provider-content .provider-row").length, 5);
  click('[data-tabs="provider"] [data-tab="globalblue"]');
  assert.equal(d.querySelectorAll("#provider-content .provider-row").length, 6);
  click('#shopping-stage-tabs [data-shopping-stage="after"]');
  assert.equal(d.getElementById("shopping-after").hidden, false);
  click('#shopping-provider-tabs [data-registration="jtax"]');
  assert(
    d.querySelector(
      '#shopping-provider-registration img[src^="assets/images/"]',
    ),
  );
  click("#changelog-open");
  assert.equal(d.getElementById("changelog-dialog").open, true);
  click("#changelog-close");
  assert.equal(d.getElementById("changelog-dialog").open, false);
});
test("독립 검색 20개씩 표시·고정 미리보기·면세 상태·업체 이동", () => {
  const { document: d, input, click } = boot();
  const count = () => d.querySelectorAll("#store-results .store-item").length;
  assert.equal(d.querySelectorAll("#home #store-results .store-item").length, 4);
  assert.equal(d.querySelectorAll("#home input, #home select").length, 2);
  click("#store-more");
  assert.equal(d.querySelector(".page.on").id, "stores");
  assert.equal(count(), 20);
  for (const expected of [40, 60, 80]) {
    click("#store-more");
    assert.equal(count(), expected);
  }
  assert.equal(d.getElementById("store-more").hidden, true);
  assert.equal(d.querySelectorAll("#home #store-results .store-item").length, 0);
  input("#store-query", "다이소");
  input("#store-region", "나고야", "change");
  assert.equal(count(), 6);
  assert(
    d.getElementById("store-results").textContent.includes("면세 여부 미확인"),
  );
  input("#store-region", "", "change");
  input("#store-query", "마로니에");
  assert.equal(count(), 1);
  assert(
    d
      .getElementById("store-results")
      .textContent.includes("면세 대상 아님 · 공식 확인"),
  );
  assert.equal(d.querySelectorAll("#store-results button").length, 0);
  input("#store-query", "유니클로");
  click("#store-results button");
  assert.equal(d.querySelector(".page.on").id, "services");
  assert(
    d.getElementById("provider-content").textContent.includes("J-TaxRefund"),
  );
});
test("체크리스트 메인·상세 동기화, 새 세션 저장 복원, 초기화", () => {
  const storage = memoryStorage();
  let view = boot({ storage });
  const check = view.document.querySelector('[data-check="0"]');
  check.checked = true;
  check.dispatchEvent(new view.domWindow.Event("change", { bubbles: true }));
  assert.equal(
    view.document.getElementById("home-check-count").textContent,
    "1 / 8 완료",
  );
  assert.equal(view.document.getElementById("counter").textContent, "1 / 8");
  assert.equal(view.document.getElementById("fill").style.width, "12.5%");
  assert.equal(JSON.parse(storage.getItem(CHECKLIST_KEY))[0], true);
  view = boot({ storage });
  assert(view.document.querySelector('[data-check="0"]').checked);
  view.click("#reset");
  assert.equal(storage.getItem(CHECKLIST_KEY), null);
  for (const malformed of ["null", "[]", "invalid"])
    assert.doesNotThrow(() =>
      boot({ storage: memoryStorage({ [CHECKLIST_KEY]: malformed }) }),
    );
});
test("스크롤 위치·동작 감소 설정과 경계 비활성화", () => {
  const { document: d, window: w, click } = boot();
  Object.defineProperty(d.documentElement, "scrollHeight", { value: 2000 });
  w.dispatch("scroll");
  assert.equal(d.getElementById("scroll-top").disabled, true);
  click("#scroll-bottom");
  assert.equal(w.lastScroll.top, 2000);
  w.scrollY = 1200;
  w.dispatch("scroll");
  assert.equal(d.getElementById("scroll-bottom").disabled, true);
  w.matchMedia = () => ({ matches: true });
  click("#scroll-top");
  assert.equal(w.lastScroll.behavior, "instant");
});
test("새 업체 데이터로 두 탭·프로필·등록 방법·매장 연결 자동 생성", () => {
  const sample = {
    ...structuredClone(providers.jtax),
    name: "검증 업체",
    tabLabel: "검증 업체",
    aliases: ["검증 업체"],
  };
  const data = {
    providers: { ...providers, fixture: sample },
    stores: [
      ...stores,
      {
        ...stores[0],
        id: "fixture-store",
        ko: "검증 매장",
        providerId: "fixture",
      },
    ],
  };
  const { document: d, click, input } = boot({ data });
  assert.equal(d.querySelectorAll('[data-tabs="provider"] button').length, 6);
  click('[data-tabs="provider"] [data-tab="fixture"]');
  assert.equal(
    d.querySelector("#provider-content h2").textContent,
    "검증 업체",
  );
  click('[data-registration="fixture"]');
  assert.equal(
    d.getElementById("shopping-provider-name").textContent,
    "검증 업체",
  );
  input("#store-query", "검증 매장");
  click("#store-results button");
  assert.equal(
    d.querySelector("#provider-content h2").textContent,
    "검증 업체",
  );
});
test("검색 데이터의 HTML·위험 URL은 실행 가능한 마크업이 되지 않음", () => {
  const unsafe = {
    ...stores[0],
    id: "unsafe",
    ko: "<img src=x onerror=alert(1)>",
    en: "unsafe",
    source: "javascript:alert(1)",
    sources: [],
    providerId: null,
  };
  const { document: d, input } = boot({ data: { stores: [unsafe] } });
  input("#store-query", "unsafe");
  assert.equal(d.querySelectorAll("#store-results img").length, 0);
  assert.equal(d.querySelector("#store-results a").getAttribute("href"), null);
  assert(d.getElementById("store-results").textContent.includes("<img"));
});

test("검색 전체 데이터 필터링·추가 지점·빈 결과·해시 복원", () => {
  const data = { stores: [...stores, { ...stores[0], id: "new-last", ko: "새로운 마지막 지점", en: "New last branch" }] };
  const { document: d, window: w, input, click } = boot({ hash: "#stores", data });
  assert.equal(d.querySelector(".page.on").id, "stores");
  assert.equal(d.querySelectorAll("#store-query").length, 1);
  input("#store-query", "새로운 마지막 지점");
  assert.equal(d.querySelectorAll("#store-results .store-item").length, 1);
  assert.match(d.getElementById("store-results").textContent, /새로운 마지막 지점/);
  input("#store-query", "zzzz없음99999");
  assert(d.querySelector("#store-results .store-empty"));
  assert.equal(d.getElementById("store-more").hidden, true);
  input("#store-query", "");
  assert.equal(d.querySelectorAll("#store-results .store-item").length, 20);
  click('#stores [data-route="home"]');
  assert.equal(d.querySelector(".page.on").id, "home");
  w.location.hash = "#stores"; w.dispatch("hashchange");
  assert.equal(d.querySelector(".page.on").id, "stores");
  w.location.hash = ""; w.dispatch("hashchange");
  assert.equal(d.querySelector(".page.on").id, "home");
  click("#go-store-finder");
  assert.equal(w.location.hash, "stores");
  assert.equal(w.lastScroll.top, 0);
  assert.equal(boot({ hash: "#stores" }).document.querySelector(".page.on").id, "stores");
});

test("지역 필터 후 더 보기·필터 변경 초기화와 작은 데이터 미리보기", () => {
  const { document: d, input, click } = boot({ hash: "#stores" });
  input("#store-region", "나고야", "change");
  assert.match(d.getElementById("store-count").textContent, /^21개 검색 결과/);
  assert.equal(d.querySelectorAll("#store-results .store-item").length, 20);
  click("#store-more");
  assert.equal(d.querySelectorAll("#store-results .store-item").length, 21);
  assert.equal(d.getElementById("store-more").hidden, true);
  input("#store-region", "", "change");
  assert.equal(d.querySelectorAll("#store-results .store-item").length, 20);
  for (const size of [0, 2, 5]) {
    const { document } = boot({ data: { stores: stores.slice(0, size) } });
    assert.equal(document.querySelectorAll("#home #store-results .store-item").length, Math.min(size, 4));
  }
});

test("메인 검색 UI·4개 제한·동일 패널과 검색 조건 왕복 보존", () => {
  const { document: d, input, click, app } = boot();
  const panel = d.getElementById("store-finder");
  input("#store-query", "다이소");
  input("#store-region", "나고야", "change");
  assert.equal(d.querySelectorAll("#home .store-item").length, 4);
  assert.match(d.getElementById("store-count").textContent, /6개 검색 결과.*전체 매장 보기/);
  assert(d.querySelector("#home .store-provider"));
  assert(d.querySelector("#home .store-status"));
  assert(d.querySelector("#home .store-result-links a"));
  click("#store-more");
  assert.equal(d.querySelector(".page.on").id, "stores");
  assert.equal(d.querySelectorAll("#stores .store-item").length, 6);
  assert.equal(d.querySelector("#stores #store-finder"), panel);
  click('#stores [data-route="home"]');
  assert.equal(d.getElementById("store-query").value, "다이소");
  assert.equal(d.getElementById("store-region").value, "나고야");
  assert.equal(d.querySelectorAll("#home .store-item").length, 4);
  assert.equal(d.querySelectorAll("#store-query").length, 1);

  input("#store-query", "없음zzzz9999");
  assert(d.querySelector("#home .store-empty"));
  assert.equal(d.getElementById("store-more").hidden, false);
});
