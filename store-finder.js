// Keeps legacy records and provider navigation; only extends Store Finder.
function extendStoreDirectory(legacy) {
  const osaka = ['난바CITY 칼디','한큐삼번가 치이카와랜드','그랜드프론트 오사카 무인양품','신사이바시 PARCO 포켓몬센터'];
  const tokyo = ['AKKY 아키하바라','라디오회관','타마시네이션즈 스토어 도쿄'];
  legacy.forEach((d,i)=>{
    d.id = 'legacy-'+i;
    d.region = osaka.includes(d.ko)?'오사카':tokyo.includes(d.ko)?'도쿄':'전국 공통';
    d.scope = d.region==='전국 공통'?'chain':'branch';
    d.taxFreeAvailability = d.scope==='chain'?'branch-check':'unknown';
    d.refundProviderStatus = d.level;
    d.sources = [{url:d.source,label:'기존 매장 공식 사이트',scope:'기존 연결 출처 (후기 원문 아님)'}];
    d.verifiedAt = null;
    d.aliases = d.ko.includes('PARCO')?['파르코']:[];
    // Existing user reports are preserved, without inventing a dated review.
    d.travelerReviews = [];
  });
  const uniqlo=legacy.find(d=>d.ko==='유니클로');
  if(uniqlo) Object.assign(uniqlo,{refundFee:'약 10%',refundFeeBasis:'환급액',verifiedAt:'2026-11-24',taxFreeProcedure:'J-TaxRefund에서 환급 수속. 면세 제외 지점이 있으므로 지점별 확인',sources:[...uniqlo.sources,{url:'https://faq.uniqlo.com/articles/Knowledge/100015857/?fs=RelatedArticle&l=ja',label:'공식 환급 절차',scope:'체인 공통 안내'}]});
  legacy.push(...(window.storeExpansion || []));
}

function storeSearchTermsExtra(d) {
  const cityAliases={'도쿄':['Tokyo','東京'],'나고야':['Nagoya','名古屋'],'오사카':['Osaka','大阪']};
  const parent=(window.storeExpansion||[]).find(p=>p.id===d.parentFacilityId);
  return [d.region,d.city,d.brand,d.address,...(d.aliases||[]),...(cityAliases[d.region]||[]),...(parent?[parent.ko,parent.en,parent.ja]:[])].filter(Boolean);
}

function filterStoreDirectory(directory, query, region) {
  const normalized=normalizeSearchText(query);
  const tokens=query.trim().split(/\s+/).map(normalizeSearchText).filter(Boolean);
  return directory.filter(d=>!region||d.region===region).map(d=>{
    const terms=storeTerms(d);
    const direct=normalized?Math.max(0,...terms.map(t=>matchScore(t,normalized))):1;
    const allTokens=tokens.length>1&&tokens.every(token=>terms.some(t=>t.includes(token)));
    return {d,score:Math.max(direct,allTokens?85:0)};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
}

function appendStoreDetails(main,d) {
  const labels={official:'면세 취급 · 공식 안내 확인',tenant:'면세 취급 · 입점 점포별 확인','branch-check':'면세 취급 · 지점별 확인',unknown:'면세 취급 · 확인되지 않음'};
  const meta=document.createElement('p');meta.className='store-item-detail';
  meta.textContent=[d.region,d.scope==='chain'?'체인 공통':d.scope==='facility'?'쇼핑시설':'개별 지점',labels[d.taxFreeAvailability]||labels.unknown].join(' · ');
  main.prepend(meta);
  const links=main.querySelector('.store-result-links');
  (d.sources||[]).filter(s=>s.url!==d.source).forEach(s=>{const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.label+' ↗';links.append(a)});
}
