import { element, externalLink, animatePanel } from "./dom.js?v=e77828885b05";

export function initProviders(document, providers) {
  const profileTabs = document.querySelector('[data-tabs="provider"]');
  const registrationTabs = document.getElementById("shopping-provider-tabs");
  const defaultKey = Object.keys(providers)[0];

  function renderProfile(key) {
    const data = providers[key];
    if (!data) return;
    const panel = document.getElementById("provider-content");
    const grid = element(document, "div", "provider-grid");
    const rows = [
      ["주요 매장", data.stores],
      ["등록 방식", data.registration],
      ...(data.appText ? [["전용 앱", data.appText]] : []),
      ["수수료", data.fees],
      ["환급 소요", data.timing],
      ["특징·주의사항", data.caution],
    ];
    for (const [label, value] of rows) {
      const row = element(document, "div", "provider-row");
      row.append(
        element(document, "div", "provider-label", label),
        element(document, "div", "provider-value", value),
      );
      grid.append(row);
    }
    const verification = element(document, "div", "light");
    verification.append(
      element(document, "b", "", "정보 검증 상태"),
      element(document, "p", "", data.verified),
    );
    const links = element(document, "div", "source-list");
    for (const [label, url] of data.sources)
      links.append(externalLink(document, label + " ↗", url, "source-link"));
    if (!data.sources.length)
      links.append(
        element(
          document,
          "span",
          "muted",
          "공식 운영사 링크 확인 중 · 영수증 URL을 우선하세요.",
        ),
      );
    panel.replaceChildren(
      element(document, "div", "kicker", "PROVIDER PROFILE / " + data.name),
      element(document, "h2", "", data.name),
      element(document, "p", "sub", data.subtitle),
      grid,
      verification,
      element(document, "div", "divider"),
      element(document, "h3", "", "공식 사이트 · 참고자료"),
      links,
      element(
        document,
        "p",
        "notice provider-footnote",
        "※ 업체·판매점별 이용 조건은 변경될 수 있습니다. 이 페이지는 구매·환급 비교용 가이드이며 실시간 재고나 환급 승인 상태를 조회하지 않습니다.",
      ),
    );
    profileTabs
      .querySelectorAll("button")
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.tab === key),
      );
    animatePanel(panel);
  }

  function renderRegistration(key) {
    const data = providers[key];
    if (!data) return;
    const guide = data.guide;
    const panel = document.getElementById("shopping-provider-registration");
    document.getElementById("shopping-provider-name").textContent = data.name;
    panel.replaceChildren();
    if (guide.note) panel.append(element(document, "p", "notice", guide.note));
    const list = element(document, "ol", "registration-steps");
    guide.steps.forEach(([title, text], index) => {
      const item = element(document, "li");
      item.append(
        element(document, "b", "", title),
        element(document, "div", "", text),
      );
      for (const extra of guide.extras || []) {
        if (extra.afterStep !== index) continue;
        item.append(
          element(document, "p", "notice registration-note", extra.note),
        );
        if (extra.image && /^assets\/images\/[\w.-]+$/.test(extra.image)) {
          const image = element(document, "img", "registration-image");
          image.src = extra.image;
          image.alt = extra.alt;
          image.loading = "lazy";
          item.append(image);
        }
        if (extra.link)
          item.append(externalLink(document, extra.label, extra.link));
      }
      list.append(item);
    });
    panel.append(list);
    const links = element(document, "div", "source-list");
    for (const [label, url] of guide.sources)
      links.append(externalLink(document, label + " ↗", url, "source-link"));
    panel.append(links);
    registrationTabs
      .querySelectorAll("button")
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.registration === key),
      );
  }
  for (const [key, data] of Object.entries(providers)) {
    const profile = element(document, "button", "", data.tabLabel);
    profile.type = "button";
    profile.dataset.tab = key;
    profileTabs.append(profile);
    const registration = element(document, "button", "", data.tabLabel);
    registration.type = "button";
    registration.dataset.registration = key;
    registrationTabs.append(registration);
  }
  profileTabs.addEventListener("click", (event) => {
    const key = event.target.closest("[data-tab]")?.dataset.tab;
    if (key) renderProfile(key);
  });
  registrationTabs.addEventListener("click", (event) => {
    const key = event.target.closest("[data-registration]")?.dataset
      .registration;
    if (key) renderRegistration(key);
  });
  renderProfile(defaultKey);
  renderRegistration(defaultKey);
  return { select: renderProfile };
}
