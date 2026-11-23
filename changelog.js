// User-facing releases only. Update CHANGELOG.md with this array. Newest first.
const changelogEntries = [
  {
    "date": "2026.11.23",
    "version": "v1.0",
    "summary": [
      "업데이트 내역을 제목 옆에서 확인할 수 있습니다.",
      "이번 업데이트부터 사용자용 버전 번호를 관리합니다."
    ]
  },
  {
    "date": "2026.11.23",
    "version": null,
    "commit": "2ad358f822429a5247bf445c18cbab11aaf23ce3",
    "summary": [
      "계산기에 JPY/KRW 최신 공시 환율과 예상 원화 환급액을 추가했습니다.",
      "환율 직접 입력·자동 복원과 조회 실패 시 저장 환율 사용을 지원합니다."
    ]
  },
  {
    "date": "2026.11.22",
    "version": null,
    "commit": "68ce5e965eda4ef5c98feb63e4fe55880453cbf0",
    "summary": [
      "상단 FAQ 앞에 계산기 메뉴를 추가해 계산 화면으로 바로 이동할 수 있습니다."
    ]
  },
  {
    "date": "2026.11.22",
    "version": null,
    "commit": "0c600cb935e14ef3fa1d573c288072fa9239484a",
    "summary": [
      "일본 세금환급 가이드를 GitHub Pages에 처음 공개했습니다.",
      "여행 단계별 안내, Store Finder, 환급 계산기, 체크리스트와 업체 정보를 제공합니다."
    ]
  }
];

(()=>{const dialog=document.getElementById('changelog-dialog'),open=document.getElementById('changelog-open'),list=document.getElementById('changelog-list');
changelogEntries.forEach(entry=>{const article=document.createElement('article');article.className='changelog-item';const meta=document.createElement('div');meta.className='changelog-meta';const time=document.createElement('time');time.dateTime=entry.date.replaceAll('.','-');time.textContent=entry.date;const version=document.createElement('b');version.textContent=entry.version||'버전 미지정';meta.append(time,version);article.append(meta);entry.summary.forEach(text=>{const p=document.createElement('p');p.textContent=text;article.append(p)});list.append(article)});
open.addEventListener('click',()=>dialog.showModal());document.getElementById('changelog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});dialog.addEventListener('close',()=>open.focus());})();
