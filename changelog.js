// User-facing releases only. Update CHANGELOG.md with this array. Newest first.
const changelogEntries = [
  {"date":"2026.11.24","version":"v1.4","summary":["여행 단계와 지원 도구를 정리하고 출국 준비 체크리스트·페이지 이동을 개선했습니다. DAISO·Seria 22개 지점을 추가하고 지점별 면세 상태를 구분합니다."]},
  {"date":"2026.11.24","version":"v1.3","summary":["주요 안내 문구 가독성 개선, 단계별 이동 버튼 추가, 체크리스트 접근성 향상 및 매장 검색 미리보기 최적화"]},
  {date:"2026.11.24",version:"v1.2",summary:["Store Finder에 도쿄·나고야와 지역 필터를 추가했습니다.","지점별 면세 취급·환급업체·수속·출처를 구분해 확인할 수 있습니다."]},
  {
    "date": "2026.11.23",
    "version": "v1.1",
    "commit": "2ad358f822429a5247bf445c18cbab11aaf23ce3",
    "summary": [
      "계산기에 JPY/KRW 최신 공시 환율과 예상 원화 환급액을 추가했습니다.",
      "환율 직접 입력·자동 복원과 조회 실패 시 저장 환율 사용을 지원합니다."
    ]
  },
  {
    "date": "2026.11.23",
    "version": "v1.0",
    "summary": [
      "업데이트 내역을 제목 옆에서 확인할 수 있습니다.",
      "이번 업데이트부터 사용자용 버전 번호를 관리합니다."
    ]
  }
];

(()=>{const dialog=document.getElementById('changelog-dialog'),open=document.getElementById('changelog-open'),list=document.getElementById('changelog-list');
changelogEntries.forEach(entry=>{const article=document.createElement('article');article.className='changelog-item';const meta=document.createElement('div');meta.className='changelog-meta';const time=document.createElement('time');time.dateTime=entry.date.replaceAll('.','-');time.textContent=entry.date;const version=document.createElement('b');version.textContent=entry.version||'버전 미지정';meta.append(time,version);article.append(meta);entry.summary.forEach(text=>{const p=document.createElement('p');p.textContent=text;article.append(p)});list.append(article)});
open.addEventListener('click',()=>dialog.showModal());document.getElementById('changelog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});dialog.addEventListener('close',()=>open.focus());})();
