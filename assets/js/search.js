const initialConsonants = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
function normalizeSearchText(s) {
  return String(s || "")
    .normalize("NFC")
    .toLocaleLowerCase()
    .replace(/[\s\-_.·・\/()]/g, "");
}
function initialOf(char) {
  const x = char.charCodeAt(0) - 0xac00;
  return x >= 0 && x < 11172 ? initialConsonants[Math.floor(x / 588)] : char;
}
// '돈ㅋ'처럼 마지막 글자만 초성으로 입력한 경우까지 부분 일치 처리.
function mixedPrefixMatch(term, query) {
  for (let offset = 0; offset <= term.length - query.length; offset++) {
    let ok = true;
    for (let i = 0; i < query.length; i++) {
      const q = query[i],
        t = term[offset + i];
      if (q !== t && !(initialConsonants.includes(q) && initialOf(t) === q)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}
// 짧은 입력은 부정확한 결과가 많아 오타 보정을 제한합니다.
function editDistanceWithin(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let min = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      min = Math.min(min, curr[j]);
    }
    if (min > limit) return false;
    prev = curr;
  }
  return prev[b.length] <= limit;
}
function matchScore(term, query) {
  if (!term || !query) return 0;
  if (term === query) return 100;
  if (term.startsWith(query)) return 90;
  if (term.includes(query)) return 80;
  if (mixedPrefixMatch(term, query)) return 70;
  // '돈키호태' → '돈키호테', '글러벌블루' → '글로벌블루'
  if (query.length >= 3) {
    const limit = query.length >= 7 ? 2 : 1;
    if (editDistanceWithin(term, query, limit)) return 55;
    // 단어를 완성하지 않고 입력 중일 때의 오타를 허용
    if (
      term.length > query.length &&
      editDistanceWithin(term.slice(0, query.length), query, 1)
    )
      return 40;
  }
  return 0;
}

export function storeTerms(d, directory, providers) {
  const parent = directory.find((p) => p.id === d.parentFacilityId);
  const cityAliases = {
    도쿄: ["Tokyo", "東京"],
    나고야: ["Nagoya", "名古屋"],
    오사카: ["Osaka", "大阪"],
  };
  return [
    d.ko,
    d.en,
    d.ja,
    d.providerLabel,
    d.region,
    d.city,
    d.brand,
    d.address,
    ...d.aliases,
    ...(cityAliases[d.region] || []),
    ...(parent ? [parent.ko, parent.en, parent.ja] : []),
    ...(providers[d.providerId]?.aliases || []),
  ]
    .filter(Boolean)
    .map(normalizeSearchText);
}
export function filterStoreDirectory(directory, query, region, providers = {}) {
  const normalized = normalizeSearchText(query);
  const tokens = query
    .trim()
    .split(/\s+/)
    .map(normalizeSearchText)
    .filter(Boolean);
  return directory
    .filter((d) => !region || d.region === region)
    .map((d) => {
      const terms = storeTerms(d, directory, providers);
      const direct = normalized
        ? Math.max(0, ...terms.map((t) => matchScore(t, normalized)))
        : 1;
      const allTokens =
        tokens.length > 1 &&
        tokens.every((token) => terms.some((t) => t.includes(token)));
      return { d, score: Math.max(direct, allTokens ? 85 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
