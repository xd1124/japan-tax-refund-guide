// Small additions reuse navigate(), drawChecks(), and the existing storage key.
let storeFinderExpanded=false;
function paintChecklistSummary(completed,total){
  document.getElementById('home-check-count').textContent=`${completed} / ${total} 완료`;
  document.getElementById('home-check-fill').style.width=`${total?completed/total*100:0}%`;
  const progress=document.getElementById('home-check-progress');
  progress.setAttribute('aria-valuenow',String(completed));
  progress.setAttribute('aria-valuemax',String(total));
}

// Observe page and result height changes, without adding route listeners.
function initScrollControls(){
  const top=document.getElementById('scroll-top'),bottom=document.getElementById('scroll-bottom');
  function update(){
    const remaining=document.documentElement.scrollHeight-window.innerHeight-window.scrollY;
    top.disabled=window.scrollY<=8;
    bottom.disabled=remaining<=8;
    const focused=document.activeElement;
    const editing=focused&&focused.matches('input,textarea,select,[contenteditable="true"]');
    top.parentElement.hidden=editing||(top.disabled&&bottom.disabled);
  }
  function move(toBottom){
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:toBottom?document.documentElement.scrollHeight:0,behavior:reduce?'instant':'smooth'});
  }
  top.addEventListener('click',()=>move(false));bottom.addEventListener('click',()=>move(true));
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  document.addEventListener('focusin',update);document.addEventListener('focusout',()=>requestAnimationFrame(update));
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(document.body);
  if(typeof MutationObserver!=='undefined')new MutationObserver(()=>requestAnimationFrame(update)).observe(document.querySelector('main'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initScrollControls,{once:true});else initScrollControls();
