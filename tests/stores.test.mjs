import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { stores } from "../data/stores.js";
import { providers } from "../data/providers.js";
import { filterStoreDirectory } from "../assets/js/search.js";

const search = (query, region = "", data = stores, companies = providers) =>
  filterStoreDirectory(data, query, region, companies).map(({ d }) => d.id);
test("80개 매장·출처·확인 상태 보존 및 일관된 필드", () => {
  const fixture = JSON.parse(
    fs.readFileSync(new URL("./fixtures/stores.json", import.meta.url)),
  );
  assert.deepEqual(stores, fixture);
  assert.equal(stores.length, 80);
  assert.equal(new Set(stores.map((store) => store.id)).size, stores.length);
  const keys = Object.keys(stores[0]).sort();
  for (const store of stores) {
    assert.deepEqual(Object.keys(store).sort(), keys);
    assert(["branch", "facility", "chain"].includes(store.scope));
    assert(
      [
        "official",
        "unknown",
        "not-eligible",
        "branch-check",
        "tenant",
      ].includes(store.taxFreeAvailability),
    );
    assert(
      ["official", "reported", "unknown", "not-applicable"].includes(
        store.providerStatus,
      ),
    );
    if (store.providerId) assert(providers[store.providerId]);
    if (store.parentFacilityId)
      assert(
        stores.some(
          (parent) =>
            parent.id === store.parentFacilityId && parent.scope === "facility",
        ),
      );
    for (const source of store.sources)
      assert.equal(new URL(source.url).protocol, "https:");
    if (store.taxFreeAvailability === "not-eligible") {
      assert.equal(store.providerId, null);
      assert.equal(store.providerStatus, "not-applicable");
    }
  }
  assert.equal(
    stores.filter((store) => store.taxFreeAvailability === "not-eligible")
      .length,
    2,
  );
  assert.equal(
    stores.filter(
      (store) =>
        store.id.startsWith("hundred-yen-") && store.region === "나고야",
    ).length,
    10,
  );
});
test("다국어·초성·오타·지역·환급업체 검색 유지", () => {
  for (const query of [
    "다이소",
    "ダイソー",
    "DAISO",
    "ㄷㅇㅅ",
    "세리아",
    "セリア",
    "Seria",
    "ㅅㄹㅇ",
  ])
    assert(search(query).length, query);
  for (const [query, id] of [
    ["나고야 로프트", "loft-sakae"],
    ["栄ロフト", "loft-sakae"],
    ["Nagoya Loft", "loft-minato"],
    ["ㅇㄴㅁㅇㅌ", "legacy-0"],
    ["돈키호태", "legacy-13"],
  ])
    assert(search(query).includes(id), query);
  assert.equal(search("Global Blue", "나고야").length, 1);
  assert.equal(search("다이소", "나고야").length, 6);
  assert.equal(search("세리아", "나고야").length, 4);
  assert(
    !search("다이소", "도쿄").some((id) =>
      search("다이소", "나고야").includes(id),
    ),
  );
});
test("새 매장과 환급업체를 데이터만 추가해 검색", () => {
  const sample = {
    ...stores[0],
    id: "test-only",
    ko: "검증용 새 매장",
    en: "Fixture Shop",
    ja: "テスト店",
    providerId: "fixture",
    providerLabel: "새 환급업체",
    aliases: ["검증별칭"],
  };
  const companies = {
    ...providers,
    fixture: {
      name: "새 환급업체",
      aliases: ["Fixture Refund", "새로운업체별칭"],
    },
  };
  for (const query of [
    "검증별칭",
    "Fixture Shop",
    "テスト店",
    "새로운업체별칭",
  ])
    assert(
      search(query, "", [...stores, sample], companies).includes("test-only"),
    );
  assert(!stores.some((store) => store.id === "test-only"));
});
