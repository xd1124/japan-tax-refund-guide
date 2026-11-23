const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const before=cp.execFileSync('git',['show','316bf5d:index.html'],{cwd:root,encoding:'utf8',maxBuffer:4e6});
const ctx=vm.createContext({window:{}});
const inline=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
inline.forEach(s=>new vm.Script(s));
for(const file of ['stores-data.js','store-finder.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
new vm.Script(fs.readFileSync(path.join(root,'changelog.js'),'utf8'));
const legacyCode=html.match(/const storeDirectory=\[[\s\S]*?\n\];/)[0];
assert.equal(legacyCode,before.match(/const storeDirectory=\[[\s\S]*?\n\];/)[0],'all original records and sources preserved verbatim');
vm.runInContext(legacyCode+'\nextendStoreDirectory(storeDirectory);\n'+html.slice(html.indexOf('const providerAliases='),html.indexOf('function renderStoreSearch()')),ctx);
const get=code=>vm.runInContext(code,ctx),search=(q,r='')=>get(`filterStoreDirectory(storeDirectory,${JSON.stringify(q)},${JSON.stringify(r)}).map(x=>x.d.id)`);
assert.equal(get('storeDirectory.length'),58);
assert.equal(new Set(get('storeDirectory.map(d=>d.id)')).size,58);
assert.equal(search('','오사카').length,4);
for(const [query,id] of [['나고야 로프트','loft-sakae'],['栄ロフト','loft-sakae'],['Nagoya Loft','loft-minato'],['신주쿠 로프트','loft-shinjuku'],['파르코','parco-shibuya'],['다카시마야','jr-takashimaya-nagoya'],['ㅇㄴㅁㅇㅌ','legacy-0']])assert(search(query).includes(id),query);
assert(search('로프트','나고야').includes('loft-dome'));
assert(!search('로프트','도쿄').includes('loft-minato'));
assert.equal(search('','기타 지역').length,1);
const data=get('window.storeExpansion');
for(const d of data){
  assert(d.sources.length);for(const s of d.sources)assert.equal(new URL(s.url).protocol,'https:');
  if(d.parentFacilityId)assert(data.some(p=>p.id===d.parentFacilityId&&p.scope==='facility'));
  if(d.scope==='facility')assert.equal(d.refundProvider,null,'facility provider must not be inferred');
  assert.equal(d.travelerReviews.length,0,'unverified review must not become a fact');
}
assert.equal(data.find(d=>d.id==='loft-sakae').taxFreeAvailability,'official');
assert.equal(data.find(d=>d.id==='loft-sakae').refundProviderStatus,'unknown');
assert.equal(data.find(d=>d.id==='loft-dome').taxFreeAvailability,'unknown');
assert.equal(data.find(d=>d.id==='matsuzakaya-nagoya').refundFeeBasis,'세전 구매금액');
assert.equal(data.find(d=>d.id==='chain-gu').refundFeeBasis,'환급액');
// The existing calculator, checklist, routing and all provider information stay byte-identical.
for(const id of ['departure','arrival','shopping','summary','services']){
 const re=new RegExp('<section[^>]*id="'+id+'"[\\s\\S]*?<\\/section>');
 const old=before.match(re);if(old)assert.equal(html.match(re)?.[0],old[0],id);
}
// User-requested FX display rounding is tested separately in fx-rounding.test.cjs.
assert.equal(html.slice(html.indexOf('<script>')+8,html.indexOf('const storeDirectory=')),before.slice(before.indexOf('<script>')+8,before.indexOf('const storeDirectory=')),'existing app JS before directory unchanged');
const distribution=Object.fromEntries(['나고야','도쿄','기타 지역','전국 공통'].map(r=>[r,data.filter(d=>d.region===r).length]));
console.log('PASS: syntax; 22 legacy records; region, multilingual/initial search; unique IDs; parent links; evidence separation; original app/calculator preservation.');
console.log(JSON.stringify({added:data.length,distribution,branches:data.filter(d=>d.scope==='branch').length,officialBranches:data.filter(d=>d.scope==='branch'&&d.taxFreeAvailability==='official').length,unknownProviderBranches:data.filter(d=>d.scope==='branch'&&!d.refundProvider).length,newReviews:0},null,2));
