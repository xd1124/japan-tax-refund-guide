import test from "node:test";
import assert from "node:assert/strict";
import { boot, memoryStorage } from "./helpers.mjs";
import {
  refundAmount,
  officialFxValue,
  validFx,
  FX_KEY,
} from "../assets/js/calculator.js";

test("기존 세금 포함 계산·수수료·0원 하한 및 환율 올림", () => {
  assert.deepEqual(refundAmount(11000, 10, 100), {
    tax: 1000,
    fee: 100,
    refund: 900,
  });
  assert.equal(refundAmount(9300, 10, 0).refund, 845);
  assert.equal(refundAmount(11000, 10, 2000).refund, 0);
  assert.equal(refundAmount(-1, 10, 0).refund, 0);
  for (const [rate, result] of [
    [8.4386, 843.86],
    [8.438601, 843.87],
    [9.5, 950],
  ])
    assert.equal(officialFxValue(rate), result);
});
test("공식 환율 조회 및 기준일·조회시각·원화 결과", async () => {
  const { document: d, input, app, storage } = boot();
  await app.calculator.refresh();
  assert.equal(d.getElementById("fx-input").value, "843.86");
  assert.equal(d.getElementById("fx-date").textContent, "2026-11-23");
  assert(validFx(JSON.parse(storage.getItem(FX_KEY))));
  input("#amount", "11000");
  input("#fee", "100");
  input("#fx-input", "950");
  assert.equal(d.getElementById("estimate").textContent, "¥900");
  assert.equal(d.getElementById("estimate-krw").textContent, "₩8,550");
  for (const invalid of ["0", "-1", "abc", ""]) {
    input("#fx-input", invalid);
    assert.equal(
      d.getElementById("fx-input").getAttribute("aria-invalid"),
      "true",
    );
    assert.notEqual(d.getElementById("estimate-krw").textContent, "₩0");
  }
});
test("수동 입력 중 조회 완료해도 덮어쓰지 않고 자동 복원", async () => {
  let resolve;
  let calls = 0;
  const {
    document: d,
    input,
    app,
    click,
  } = boot({
    fetchRate: () => {
      calls++;
      return new Promise((done) => {
        resolve = done;
      });
    },
  });
  const pending = app.calculator.refresh();
  await app.calculator.refresh();
  assert.equal(calls, 1);
  input("#fx-input", "912.345");
  resolve({
    ok: true,
    json: async () => ({
      base: "JPY",
      quote: "KRW",
      rate: 8.4386,
      date: "2026-11-23",
    }),
  });
  await pending;
  assert.equal(d.getElementById("fx-input").value, "912.345");
  assert.equal(d.getElementById("fx-mode").textContent, "수동 입력");
  click("#fx-auto");
  assert.equal(d.getElementById("fx-input").value, "843.86");
  assert.equal(d.getElementById("fx-mode").textContent, "자동 조회");
});
test("실패·잘못된 API 응답·저장 정보 유무·저장 차단", async () => {
  const saved = {
    base: "JPY",
    quote: "KRW",
    rate: 9.5,
    date: "2026-11-20",
    fetchedAt: 1,
  };
  const view = boot({
    storage: memoryStorage({ [FX_KEY]: JSON.stringify(saved) }),
    fetchRate: async () => {
      throw Error("offline");
    },
  });
  await view.app.calculator.refresh();
  assert.equal(
    view.document.getElementById("fx-mode").textContent,
    "저장된 환율",
  );
  assert.equal(view.document.getElementById("fx-date").textContent, saved.date);
  for (const response of [
    { ok: false },
    { ok: true, json: async () => ({ rate: 0 }) },
  ]) {
    const noSaved = boot({ fetchRate: async () => response });
    await noSaved.app.calculator.refresh();
    assert.equal(
      noSaved.document.getElementById("estimate").textContent,
      "¥845",
    );
    assert(
      noSaved.document
        .getElementById("estimate-krw")
        .textContent.includes("환율"),
    );
  }
  const blocked = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    },
    removeItem() {
      throw Error();
    },
  };
  const viewBlocked = boot({ storage: blocked });
  await viewBlocked.app.calculator.refresh();
  assert.equal(viewBlocked.document.getElementById("fx-input").value, "843.86");
});
