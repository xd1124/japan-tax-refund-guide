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
test("미리보기 4개·전체 80개·면세 제외와 미확인·업체 이동", () => {
  const { document: d, input, click } = boot();
  const count = () => d.querySelectorAll("#store-results .store-item").length;
  assert.equal(count(), 4);
  click("#store-expand");
  assert.equal(count(), 80);
  click("#store-expand");
  assert.equal(count(), 4);
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
