import { filterStoreDirectory } from "./search.js?v=e77828885b05";
import { externalLink } from "./dom.js?v=e77828885b05";

export function initStoreFinder(
  document,
  window,
  storeDirectory,
  providers,
  navigate,
  selectProvider,
) {
  let storeFinderExpanded = false;
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
    const preview = !storeFinderExpanded && !input.value.trim() && !region;
    const shown = preview ? matched.slice(0, 4) : matched;
    const expand = document.getElementById("store-expand");
    expand.textContent = preview
      ? "전체 매장 보기 (" + storeDirectory.length + ")"
      : "기본 미리보기로";
    expand.setAttribute("aria-expanded", String(!preview));
    count.textContent = preview
      ? `전체 ${matched.length}개 중 ${shown.length}개 미리보기 · 검색하면 전체 결과를 표시합니다`
      : `${matched.length}개 검색 결과 · 지점·쇼핑시설·체인 공통 안내`;
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
  document.getElementById("go-store-finder")?.addEventListener("click", () => {
    navigate("home");
    window.requestAnimationFrame(() => {
      document
        .querySelector("#home .store-search")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.getElementById("store-expand").addEventListener("click", () => {
    const active =
      storeFinderExpanded ||
      document.getElementById("store-query").value.trim() ||
      document.getElementById("store-region").value;
    storeFinderExpanded = !active;
    if (active) {
      document.getElementById("store-query").value = "";
      document.getElementById("store-region").value = "";
    }
    renderStoreSearch();
  });
  document
    .getElementById("store-query")
    ?.addEventListener("input", renderStoreSearch);
  document
    .getElementById("store-region")
    ?.addEventListener("change", renderStoreSearch);
  renderStoreSearch();
}
