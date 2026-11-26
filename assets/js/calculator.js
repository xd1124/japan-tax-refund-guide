import { readSaved, writeSaved } from "./storage.js?v=1dc4618cbf6a";

export const FX_KEY = "japan-refund-official-fx-v1";
export const FX_URL = "https://api.frankfurter.dev/v2/rate/JPY/KRW";
export function refundAmount(amount, rate, fee) {
  const purchase = Math.max(0, Number(amount) || 0);
  const taxRate = Math.max(0, Number(rate) || 0);
  const handlingFee = Math.max(0, Number(fee) || 0);
  const tax = taxRate ? Math.round((purchase * taxRate) / (100 + taxRate)) : 0;
  return { tax, fee: handlingFee, refund: Math.max(0, tax - handlingFee) };
}
// Ceiling to two decimals per 100 JPY, excluding floating point noise.
export function officialFxValue(rate) {
  return Math.ceil(Number((rate * 10000).toFixed(8))) / 100;
}
export function validFx(data) {
  return Boolean(
    data &&
      data.base === "JPY" &&
      data.quote === "KRW" &&
      Number.isFinite(data.rate) &&
      data.rate > 0 &&
      /^\d{4}-\d{2}-\d{2}$/.test(data.date) &&
      Number.isFinite(data.fetchedAt),
  );
}

export function initCalculator(
  document,
  { storage, fetchRate, now = Date.now },
) {
  const el = (id) => document.getElementById(id);
  const saved = readSaved(storage, FX_KEY);
  let official = validFx(saved) ? saved : null;
  let mode = official ? "saved" : "auto";
  let value = official ? officialFxValue(official.rate) : null;
  let busy = false;
  let error = "";

  function render() {
    const result = refundAmount(
      el("amount").value,
      el("rate").value,
      el("fee").value,
    );
    el("estimate").textContent = "¥" + result.refund.toLocaleString("ja-JP");
    el("breakdown").textContent =
      `세금 상당액 ¥${result.tax.toLocaleString()} − 수수료 ¥${result.fee.toLocaleString()}`;
    el("estimate-krw").textContent =
      Number.isFinite(value) && value > 0
        ? "₩" +
          Math.round((result.refund * value) / 100).toLocaleString("ko-KR")
        : "환율을 확인하거나 입력해 주세요";
    el("fx-mode").textContent =
      mode === "manual"
        ? "수동 입력"
        : mode === "saved"
          ? "저장된 환율"
          : "자동 조회";
    el("fx-date").textContent = official?.date || "확인되지 않음";
    el("fx-time").textContent = official
      ? new Date(official.fetchedAt).toLocaleString("ko-KR")
      : "조회 기록 없음";
    el("fx-error").textContent = error;
    el("fx-auto").disabled = !official;
    el("fx-refresh").disabled = busy;
  }
  function applyOfficial() {
    value = officialFxValue(official.rate);
    el("fx-input").value = value.toFixed(2);
    el("fx-input").setAttribute("aria-invalid", "false");
  }
  async function refresh() {
    if (busy) return;
    busy = true;
    error = "환율 조회 중…";
    render();
    try {
      const response = await fetchRate(FX_URL, {
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("환율 응답 실패");
      const data = { ...(await response.json()), fetchedAt: now() };
      if (!validFx(data)) throw new Error("환율 형식 오류");
      official = data;
      writeSaved(storage, FX_KEY, data);
      if (mode !== "manual") {
        mode = "auto";
        applyOfficial();
      }
      error =
        mode === "manual"
          ? "최신 공시 환율을 조회했습니다. 수동 입력값은 유지됩니다."
          : "";
    } catch {
      if (mode !== "manual" && official) {
        mode = "saved";
        applyOfficial();
      }
      error =
        "환율 조회에 실패했습니다. " +
        (mode === "manual"
          ? "수동 입력값을 유지합니다."
          : official
            ? "마지막으로 저장된 환율을 사용합니다."
            : "직접 환율을 입력해 주세요. 엔화 계산은 계속 사용할 수 있습니다.");
    } finally {
      busy = false;
      render();
    }
  }
  el("fx-input").value = value === null ? "" : value.toFixed(2);
  el("fx-input").addEventListener("input", () => {
    mode = "manual";
    const entered = Number(el("fx-input").value);
    value = Number.isFinite(entered) && entered > 0 ? entered : null;
    error =
      value === null
        ? "100엔당 원화 환율을 0보다 큰 숫자로 입력해 주세요."
        : "";
    el("fx-input").setAttribute("aria-invalid", String(value === null));
    render();
  });
  el("fx-auto").addEventListener("click", () => {
    if (!official) return;
    mode = "auto";
    applyOfficial();
    error = "";
    render();
  });
  el("fx-refresh").addEventListener("click", refresh);
  for (const id of ["amount", "rate", "fee"])
    el(id).addEventListener("input", render);
  render();
  return { refresh };
}
