// Small additions reuse navigate(), drawChecks(), and the existing storage key.
let storeFinderExpanded=false;
function paintChecklistSummary(completed,total){
  document.getElementById('home-check-count').textContent=`${completed} / ${total}`;
  document.getElementById('home-check-fill').style.width=`${total?completed/total*100:0}%`;
  const progress=document.getElementById('home-check-progress');
  progress.setAttribute('aria-valuenow',String(completed));
  progress.setAttribute('aria-valuemax',String(total));
}
