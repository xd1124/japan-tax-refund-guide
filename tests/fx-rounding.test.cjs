const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const c=vm.createContext({});vm.runInContext(html.match(/function officialFxValue\(rate\)\{[^\n]+\}/)[0],c);
for(const [rate,expected] of [[8.4386,843.86],[8.438601,843.87],[9.5,950],[9.501,950.1],[8.438599999999999,843.86]])assert.equal(vm.runInContext(`officialFxValue(${rate})`,c),expected);
assert.equal(vm.runInContext('officialFxValue(9.5).toFixed(2)',c),'950.00');
assert.equal((html.match(/fxValue=officialFxValue\(/g)||[]).length,4,'cached, restore, fetch and failure fallback all rounded');
assert(!/fxValue=(saved|officialFx|data)\.rate\*100/.test(html));
assert(html.includes("fxMode='manual';const value=Number(fxEl('fx-input').value)"),'manual input remains independent');
console.log('PASS: two-decimal upward rounding, float noise, fixed display, all automatic paths, manual input preservation.');
