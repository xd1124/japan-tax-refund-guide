// Run: node tests/dashboard-ux.test.mjs (npm install --no-save linkedom),
// or set DOM_LIB to an absolute path to the official linkedom worker.js module.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import cp from 'node:child_process';
const {parseHTML}=await import(process.env.DOM_LIB?pathToFileURL(process.env.DOM_LIB).href:'linkedom');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const saved=new Map();
function boot(){
 const {window}=parseHTML(html);const {document}=window;const loc={hash:''};
 Object.assign(window,{console,location:loc,AbortSignal,URL,innerHeight:800,scrollY:0,matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>fn(),scrollTo:opts=>{window.lastScroll=opts.top},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},fetch:async()=>({ok:true,json:async()=>({base:'JPY',quote:'KRW',rate:8.4386,date:'2026-11-23'})})});
 Object.defineProperty(document.getElementById('store-region'),'value',{value:'',writable:true});
 Object.defineProperty(window.HTMLInputElement.prototype,'checked',{configurable:true,get(){return this.hasAttribute('checked')},set(v){v?this.setAttribute('checked',''):this.removeAttribute('checked')}});
 window.HTMLElement.prototype.scrollIntoView=function(){};
 const context=vm.createContext(window);
 for(const script of document.querySelectorAll('script')){const src=script.getAttribute('src');vm.runInContext(src?fs.readFileSync(path.join(root,src.split('?')[0]),'utf8'):script.textContent,context)}
 return {window,document,context};
}
let app=boot();let {window:w,document:d,context:c}=app;
const click=selector=>{const el=d.querySelector(selector);assert(el,selector);el.click()};
const input=(selector,value,event='input')=>{const el=d.querySelector(selector);el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}))};
const active=()=>d.querySelector('.page.on').id;
assert.equal(d.querySelectorAll('#store-results .store-item').length,4);
click('#store-expand');assert.equal(d.querySelectorAll('#store-results .store-item').length,vm.runInContext('storeDirectory.length',c));
click('#store-expand');assert.equal(d.querySelectorAll('#store-results .store-item').length,4);
input('#store-query','로프트');assert(d.querySelectorAll('#store-results .store-item').length>4);
input('#store-region','도쿄','change');assert.equal(d.querySelectorAll('#store-results .store-item').length,4);assert(d.getElementById('store-results').textContent.includes('신주쿠'));
input('#store-query','Global Blue');assert.equal(d.querySelectorAll('#store-results .store-item').length,4);
input('#store-region','나고야','change');assert.equal(d.querySelectorAll('#store-results .store-item').length,1);
input('#store-query','栄ロフト');assert(d.getElementById('store-results').textContent.includes('사카에'));
assert.equal(d.querySelectorAll('#store-results details').length,0);assert(d.querySelector('#store-results a[href*="loft.co.jp"]'));
for(const id of ['before','afterbuy','beforehome','summary','services','faq','checklist']){
 vm.runInContext(`navigate('${id}')`,c);w.lastScroll=99;click('.logo-home');assert.equal(active(),'home');assert.equal(w.lastScroll,0);assert.equal(w.location.hash,'');
}
vm.runInContext("navigate('before')",c);
for(const [id,next] of [['before','afterbuy'],['afterbuy','beforehome'],['beforehome','home']]){w.lastScroll=99;click('#'+id+' .page-actions .step-next');assert.equal(active(),next);assert.equal(w.lastScroll,0);assert.equal(w.location.hash,next==='home'?'':next)}
for(const [id,previous] of [['afterbuy','before'],['beforehome','afterbuy']]){vm.runInContext(`navigate('${id}')`,c);click('#'+id+' .page-actions button');assert.equal(active(),previous)}
for(const id of ['summary','services','faq','checklist'])assert.equal(d.querySelectorAll('#'+id+' .page-actions').length,0);
for(const id of ['before','afterbuy','beforehome','summary','services','faq','checklist'])assert.equal(d.querySelector('#'+id+'>button.back').dataset.route,'home');
Object.defineProperty(d.documentElement,'scrollHeight',{value:2000,configurable:true});
w.scrollY=0;w.dispatchEvent(new w.Event('scroll'));assert.equal(d.getElementById('scroll-top').disabled,true);assert.equal(d.getElementById('scroll-bottom').disabled,false);
click('#scroll-bottom');assert.equal(w.lastScroll,2000);w.scrollY=1200;w.dispatchEvent(new w.Event('scroll'));assert.equal(d.getElementById('scroll-bottom').disabled,true);
w.matchMedia=()=>({matches:true});click('#scroll-top');assert.equal(w.lastScroll,0);
assert.equal(d.querySelector('#checklist h1').textContent,'출국 준비 체크리스트');
assert.equal(d.querySelectorAll('#home [data-route="checklist"]').length,1);
assert.equal(d.querySelectorAll('#home .metrics').length,0);
input('#store-query','마로니에');input('#store-region','도쿄','change');assert(d.getElementById('store-results').textContent.includes('면세 대상 아님 · 공식 확인'));assert.equal(d.querySelectorAll('#store-results button').length,0);assert(d.getElementById('store-results').textContent.includes('해당 없음'));
input('#store-query','다이소');input('#store-region','나고야','change');assert(d.querySelectorAll('#store-results .store-item').length>=5);assert(d.getElementById('store-results').textContent.includes('면세 여부 미확인'));
w.location.hash='#beforehome';w.dispatchEvent(new w.Event('hashchange'));assert.equal(active(),'beforehome');assert.equal(w.lastScroll,0);
click('#beforehome [data-route="checklist"]');assert.equal(active(),'checklist');
const check=d.querySelector('[data-check="0"]');check.checked=true;check.dispatchEvent(new w.Event('change',{bubbles:true}));
assert.equal(d.getElementById('home-check-count').textContent,'1 / 8 완료');assert.equal(d.getElementById('home-check-progress').getAttribute('aria-valuenow'),'1');assert.equal(d.getElementById('home-check-fill').style.width,'12.5%');
assert.equal(JSON.parse(saved.get('japan-refund-dashboard-checks-v2'))[0],true);
click('.logo-home');click('.checklist-shortcut button');assert.equal(active(),'checklist');
assert.equal(d.querySelectorAll('.nav [data-route="checklist"]').length,0);
assert.equal(d.querySelectorAll('.page-actions').length,3);
assert.equal(d.querySelectorAll('.important-emphasis').length,3);
assert(d.querySelector('.important-emphasis').getAttribute('style').includes('#c65d0a'));
const before=cp.execFileSync('git',['show','46e6d0f:index.html'],{cwd:root,encoding:'utf8',maxBuffer:4e6});
assert.equal(html.slice(html.indexOf("const fxKey=")),before.slice(before.indexOf("const fxKey=")).replaceAll('?v=1.2.1','?v=1.4'),'currency calculator unchanged');
for(const name of ['provider','stages','afterBuyTabs']){const re=new RegExp('const '+name+'=[^\\n]+');assert.equal(html.match(re)?.[0],before.match(re)?.[0],name+' data unchanged')}
const home=d.querySelector('#home');const order=[...home.children].map(el=>el.className);assert(order.indexOf('panel checklist-shortcut')<order.indexOf('panel store-search'));
input('#amount','11000');input('#fee','100');input('#fx-input','950');assert.equal(d.getElementById('estimate').textContent,'¥900');assert.equal(d.getElementById('estimate-krw').textContent,'₩8,550');
app=boot();assert.equal(app.document.getElementById('home-check-count').textContent,'1 / 8 완료');assert(app.document.querySelector('[data-check="0"]').checked);
app.document.getElementById('reset').click();assert.equal(app.document.getElementById('home-check-count').textContent,'0 / 8 완료');assert(!saved.has('japan-refund-dashboard-checks-v2'));
console.log('PASS: full app initialization, 4/all/search/regions/providers, source links, removed disclosure, all logo routes, step chain, hash navigation + scroll, checklist sync/storage/reset/reload, unchanged provider data + FX calculation.');
