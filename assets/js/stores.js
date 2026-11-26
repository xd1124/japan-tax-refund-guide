import { filterStoreDirectory } from "./search.js?v=62079fed8885";
import { externalLink } from "./dom.js?v=62079fed8885";

export function initStoreFinder(
  document,
  storeDirectory,
  providers,
  navigate,
  selectProvider,
) {
  const pageSize = 20;
  let visibleCount = pageSize;
  let currentPage = "home";
  const panel = document.getElementById("store-finder");
  function appendStoreDetails(main, d) {
    const labels = {
      official: "면세 가능 · 공식 확인",
      "not-eligible": "면세 대상 아님 · 공식 확인",
      tenant: "면세 취급 · 입점 점포별 확인",
      "branch-check": "면세 취급 · 지점별 확인",
      unknown: "면세 여부 미확인",
    };
    const meta = document.createElement("p");
    meta.className = "store-item-detail";
    meta.textContent = [
      d.city || d.region,
      d.scope === "chain"
        ? "체인 공통"
        : d.scope === "facility"
          ? "쇼핑시설"
          : "개별 지점",
    ].join(" · ");
    const tax = document.createElement("span");
    tax.className = "tax-state tax-" + (d.taxFreeAvailability || "unknown");
    tax.textContent = labels[d.taxFreeAvailability] || labels.unknown;
    meta.append(" · ", tax);
    main.prepend(meta);
    const links = main.querySelector(".store-result-links");
    if (!links) return;
    (d.sources || [])
      .filter((s) => s.url !== d.source)
      .forEach((s) => {
        const a = externalLink(document, s.label + " ↗", s.url);
        links.append(a);
      });
  }
  function renderStoreSearch() {
    const input = document.getElementById("store-query"),
      result = document.getElementById("store-results"),
      count = document.getElementById("store-count");
    if (!input || !result) return;
    const region = document.getElementById("store-region").value;
    const matched = filterStoreDirectory(
      storeDirectory,
      input.value,
      region,
      providers,
    );
    const isHome = currentPage === "home";
    const shown = matched.slice(0, isHome ? 4 : visibleCount);
    const more = document.getElementById("store-more");
    more.hidden = !isHome && shown.length >= matched.length;
    more.textContent = isHome
      ? "전체 매장 보기"
      : Math.min(pageSize, matched.length - shown.length) + "개 더 보기";
    count.textContent = matched.length + "개 검색 결과 · " + shown.length + "개 표시"
      + (isHome && matched.length > shown.length ? " · 나머지는 전체 매장 보기에서 확인하세요." : "");
    result.replaceChildren();
    if (!matched.length) {
      const empty = document.createElement("div");
      empty.className = "store-empty";
      empty.textContent =
        "검색 결과가 없습니다. 매장 또는 업체 이름을 다르게 입력해 보세요.";
      result.append(empty);
      return;
    }
    shown.forEach(({ d }) => {
      const row = document.createElement("div");
      row.className = "store-item";
      const main = document.createElement("div");
      main.className = "store-item-main";
      const name = document.createElement("div");
      name.className = "store-item-title";
      name.textContent = d.ko;
      const en = document.createElement("span");
      en.className = "store-item-en";
      en.textContent = d.en;
      name.append(en);
      const note = document.createElement("div");
      note.className = "store-item-detail";
      note.textContent = d.note;
      const links = document.createElement("div");
      links.className = "store-result-links";
      const link = externalLink(document, "매장 공식 사이트 ↗", d.source);
      links.append(link);
      if (providers[d.providerId] && d.taxFreeAvailability !== "not-eligible") {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = "05 업체 정보 보기 ↗";
        b.addEventListener("click", () => {
          navigate("services");
          selectProvider(d.providerId);
        });
        links.append(b);
      }
      main.append(name, note, links);
      appendStoreDetails(main, d);
      const side = document.createElement("div");
      side.className = "store-item-side";
      const provider = document.createElement("div");
      provider.className = "store-provider";
      provider.textContent =
        d.taxFreeAvailability === "not-eligible"
          ? "해당 없음"
          : d.providerLabel;
      const status = document.createElement("span");
      status.className =
        "store-status" + (d.providerStatus === "official" ? "" : " uncertain");
      status.textContent =
        d.taxFreeAvailability === "not-eligible"
          ? "환급업체 · 해당 없음"
          : d.providerStatus === "official"
            ? "환급업체 · 공식 확인"
            : d.providerStatus === "reported"
              ? "환급업체 · 여행자 제보 / 확인 필요"
              : "환급업체 · 확인되지 않음";
      side.append(provider, status);
      row.append(main, side);
      result.append(row);
    });
  }
  document.getElementById("store-more").addEventListener("click", () => {
    if (currentPage === "home") {
      navigate("stores");
      return;
    }
    visibleCount += pageSize;
    renderStoreSearch();
  });
  function resetSearch() {
    visibleCount = pageSize;
    renderStoreSearch();
  }
  document
    .getElementById("store-query")
    ?.addEventListener("input", resetSearch);
  document
    .getElementById("store-region")
    ?.addEventListener("change", resetSearch);
  function enter(page) {
    if (page !== "home" && page !== "stores") return;
    currentPage = page;
    document.getElementById(page + "-store-mount").append(panel);
    renderStoreSearch();
  }
  enter("home");
  return { enter };
}
