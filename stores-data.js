// Branch evidence is deliberately separate from chain-wide guidance.
// null means not verified, never "free" or "not eligible". See DATA_SOURCES.md.
window.storeExpansion = (() => {
  const checked = '2026-11-24';
  const unknown = '확인되지 않음';
  const source = (url, label = '공식 안내', scope = '지점 안내') => ({url, label, scope});
  function branch(id, ko, en, ja, region, brand, url, extra = {}) {
    return {id, ko, en, ja, region, city: region, brand, scope:'branch', category:'매장', aliases:[],
      provider:'업체 미확인', level:'unknown', refundProvider:null, refundProviderStatus:'unknown',
      taxFreeAvailability:'official', taxFreeProcedure:null, taxFreeCounter:null,
      refundMethods:null, refundFee:null, refundFeeBasis:null, address:null, parentFacilityId:null,
      verifiedStatus:'official-partial', verifiedAt:checked, travelerReviews:[],
      note:'공식 면세 안내 확인. 환급업체·수수료와 방문일의 접수 조건은 매장에서 재확인하세요.',
      source:url, sources:[source(url)], ...extra};
  }
  const loft = 'https://www.loft.co.jp/shop_list/';
  const oldWarning = '공식 페이지에 개정 전 안내가 함께 남아 있을 수 있습니다. 과거 구매 한도·밀봉 규정·수수료는 적용하지 않았습니다.';
  const data = [
    branch('loft-sakae','사카에 로프트','Sakae Loft','栄ロフト','나고야','로프트',loft+'detail.php?shop_id=525', {aliases:['Nagoya Loft','나고야 로프트','SAKAE NOVA'],address:'名古屋市中区栄3-4-5 SAKAE NOVA 3–6F',taxFreeCounter:'면세 접수 10:00–19:30 · 카운터 층은 현장 확인'}),
    branch('loft-minato','나고야 미나토 로프트','Nagoya Minato Loft','名古屋みなとロフト','나고야','로프트',loft+'detail.php?shop_id=441', {aliases:['Nagoya Loft','라라포트 나고야 미나토 아쿠루스'],address:'名古屋市港区港明2-3-2 ららぽーと名古屋みなとアクルス 1F',taxFreeCounter:'면세 접수 10:00–19:30'}),
    branch('loft-dome','이온몰 나고야돔마에 로프트','AEON Mall Nagoya Dome-mae Loft','イオンモールナゴヤドーム前ロフト','나고야','로프트',loft+'info.php?info_id=715249&shop_id=673', {aliases:['Nagoya Loft','나고야돔 로프트'],taxFreeAvailability:'unknown',note:'공식 개점 안내로 지점 존재만 확인했습니다. 면세 취급·접수 시간·환급업체는 확인되지 않았습니다.',sources:[source(loft+'info.php?info_id=715249&shop_id=673','공식 개점 안내','지점 존재만 확인')]}),
    branch('parco-nagoya','나고야 PARCO','Nagoya PARCO','名古屋パルコ','나고야','PARCO','https://nagoya.parco.jp/taxfree/', {scope:'facility',category:'쇼핑시설',aliases:['파르코','나고야 파르코'],taxFreeAvailability:'tenant',taxFreeCounter:'건물 통합 면세 카운터 없음',taxFreeProcedure:'구매하는 입점 매장에서 개별 수속',note:'입점 점포마다 면세 가능 여부와 수속이 다릅니다. 건물에 공통 환급업체를 지정하지 않습니다.'}),
    branch('pokemon-nagoya','포켓몬센터 나고야','Pokémon Center Nagoya','ポケモンセンターナゴヤ','나고야','포켓몬센터','https://nagoya.parco.jp/taxfree/', {parentFacilityId:'parco-nagoya',aliases:['나고야 파르코','Nagoya PARCO','Pokemon'],taxFreeCounter:'나고야 PARCO 내 매장에서 확인',note:'PARCO 공식 면세 대상 점포 목록에서 확인. PARCO 전체 또는 다른 포켓몬센터의 환급업체를 적용하지 않습니다.'}),
    branch('matsuzakaya-nagoya','마쓰자카야 나고야점','Matsuzakaya Nagoya','松坂屋名古屋店','나고야','마쓰자카야','https://www.matsuzakaya.co.jp/nagoya/service/gaikoku.html', {aliases:['마츠자카야'],taxFreeCounter:'일본어 공식 안내: 본관 6층 · 방문 전 층 재확인',taxFreeProcedure:'구매 당일 본인이 상품·영수증·여권 등을 지참해 수속',refundFee:'최대 2.3%',refundFeeBasis:'세전 구매금액',note:'일부 입점 매장은 별도 수속. 언어별 페이지에 카운터 위치가 다르게 남아 있어 현장 확인이 필요합니다. 수수료는 세액의 2.3%가 아닙니다.'}),
    branch('jr-takashimaya-nagoya','JR 나고야 다카시마야','JR Nagoya Takashimaya','ジェイアール名古屋タカシマヤ','나고야','다카시마야','https://www.jr-takashimaya.co.jp/faq/', {aliases:['타카시마야','고시마야'],taxFreeCounter:'11층 면세 카운터',taxFreeProcedure:'구매 당일 영업시간 안에 본인이 상품·영수증·여권·사용한 카드 지참',note:oldWarning+' Watch Maison 등 별도 수속 대상은 합산하지 마세요.'}),
    branch('bic-nagoya-west','빅카메라 나고야역 서쪽점','Bic Camera Nagoya Station West','ビックカメラ名古屋駅西店','나고야','빅카메라','https://www.biccamera.com/bc/i/shop/shoplist/shop033.jsp', {aliases:['나고야에키니시','Bic Camera Nagoya']}),
    branch('bic-nagoya-gate','빅카메라 나고야 JR 게이트타워점','Bic Camera Nagoya JR Gate Tower','ビックカメラ名古屋JRゲートタワー店','나고야','빅카메라','https://www.nagoya-info.jp/souvenir/detail/80/', {aliases:['게이트 타워','Bic Camera Nagoya'],sources:[source('https://www.nagoya-info.jp/souvenir/detail/80/','나고야 관광 공식 안내')]}),
    branch('loft-shibuya','시부야 로프트','Shibuya Loft','渋谷ロフト','도쿄','로프트',loft+'detail.php?shop_id=189&syclid=cj05ftiusvius06jc5h0', {aliases:['Tokyo Loft'],taxFreeCounter:'면세 접수 11:00–20:30',note:'공식 면세 접수 안내 확인. 검색 자료에 이전 주소가 함께 남아 있어 주소는 공식 페이지에서 확인하세요.'}),
    branch('loft-ginza','긴자 로프트','Ginza Loft','銀座ロフト','도쿄','로프트','https://www.loft.co.jp/ginzaloft/', {aliases:['Tokyo Loft'],taxFreeCounter:'3층 · 월–토·공휴일 11:00–20:00 / 일요일 11:00–19:00'}),
    branch('loft-ikebukuro','이케부쿠로 로프트','Ikebukuro Loft','池袋ロフト','도쿄','로프트',loft+'detail.php?shop_id=193', {aliases:['Tokyo Loft','LINKS IKEBUKURO'],address:'東京都豊島区南池袋1-28-1 LINKS IKEBUKURO 9–12F',taxFreeCounter:'9–12층 서비스 카운터 · 월–토 10:00–20:30 / 일·공휴일 10:00–19:30'}),
    branch('loft-shinjuku','신주쿠산초메 로프트','Shinjuku Sanchome Loft','新宿三丁目ロフト','도쿄','로프트',loft+'detail.php?shop_id=659', {aliases:['신주쿠 로프트','Tokyo Loft','신주쿠 마루이'],address:'東京都新宿区新宿3-30-13 新宿マルイ本館 3F',taxFreeCounter:'면세 접수 11:00–19:30'}),
    branch('parco-shibuya','시부야 PARCO','Shibuya PARCO','渋谷パルコ','도쿄','PARCO','https://shibuya.parco.jp/taxfree/', {scope:'facility',category:'쇼핑시설',aliases:['파르코','시부야 파르코'],taxFreeAvailability:'tenant',taxFreeCounter:'건물 통합 면세 카운터 없음',taxFreeProcedure:'구매하는 입점 매장에서 개별 수속',note:'입점 점포마다 면세 가능 여부와 수속이 다릅니다. 건물에 공통 환급업체를 지정하지 않습니다.'}),
    branch('parco-ikebukuro','이케부쿠로 PARCO','Ikebukuro PARCO','池袋パルコ','도쿄','PARCO','https://ikebukuro.parco.jp/taxfree/?type=type1', {scope:'facility',category:'쇼핑시설',aliases:['파르코','이케부쿠로 파르코'],taxFreeAvailability:'tenant',taxFreeProcedure:'공식 면세 대상 점포 목록과 실제 구매 매장의 수속 확인',note:'건물 단위로 환급업체를 확정하지 않습니다. 점포별 안내를 확인하세요.'}),
    branch('takashimaya-shinjuku','신주쿠 다카시마야','Shinjuku Takashimaya','新宿高島屋','도쿄','다카시마야','https://www.takashimaya.co.jp/shinjuku/service/', {aliases:['타카시마야'],taxFreeCounter:'11층 면세 카운터',taxFreeProcedure:'구매 당일 본인이 상품·영수증과 필요 서류를 지참해 수속',note:'공식 서비스 안내에 2026.11.1 이후 제도 안내가 있습니다. 개정 전 수수료는 적용하지 않았습니다.'}),
    branch('shinqs','시부야 히카리에 ShinQs','Shibuya Hikarie ShinQs','渋谷ヒカリエ ShinQs','도쿄','도큐백화점','https://www.tokyu-dept.co.jp/shinqs/foreign/', {scope:'facility',category:'쇼핑시설',aliases:['신큐스','시부야 도큐','Tokyu'],taxFreeAvailability:'tenant',taxFreeCounter:'B1 면세 카운터 · 별도 수속 점포 있음',taxFreeProcedure:'구매 당일 수속. 영수증 발행 점포에 따라 B1 또는 해당 점포로 이동',note:'ShinQs 영수증 및 일부 대상 점포는 B1에서 수속하고 그 외 점포는 개별 수속합니다.',sources:[source('https://www.tokyu-dept.co.jp/shinqs/foreign/'),source('https://www.tokyu-dept.co.jp/global/en/taxfree_information/','개정 제도 안내','체인 안내')]}),
    branch('bic-yurakucho','빅카메라 유라쿠초점','Bic Camera Yurakucho','ビックカメラ有楽町店','도쿄','빅카메라','https://www.biccamera.com/bc/i/shop/shoplist/shop014.jsp'),
    branch('muji-ginza','무인양품 긴자','MUJI Ginza','無印良品 銀座','도쿄','무인양품','https://www.muji.com/jp/ja/shop/detail/046604?sc_cid=web_special-feature_ia', {aliases:['무지','MUJI'],taxFreeCounter:'4층 면세 계산대',note:'공식 매장 페이지에서 면세 계산대 확인. 다른 무인양품 지점의 환급업체·한도를 이 지점에 적용하지 않습니다.'})
  ];
  data.push(
    branch('mitsukoshi-sakae','나고야 사카에 미쓰코시','Nagoya Sakae Mitsukoshi','名古屋栄三越','나고야','미쓰코시','https://www.mitsukoshi.mistore.jp/nagoya/global/en.html',{aliases:['미츠코시','三越'],taxFreeCounter:'공식 면세 카운터 안내 확인 · 층·접수 시간은 방문 전 확인'}),
    branch('isetan-shinjuku','이세탄 신주쿠점','Isetan Shinjuku','伊勢丹新宿店','도쿄','이세탄','https://cp.mistore.jp/global/en/shinjuku.html',{taxFreeCounter:'점내 면세 카운터 · 최신 층·접수 시간은 공식 안내 확인'}),
    branch('ginza-six','긴자 SIX','GINZA SIX','ギンザシックス','도쿄','GINZA SIX','https://www.ginza6.tokyo/services/',{scope:'facility',category:'쇼핑시설',aliases:['긴자식스','GSIX'],taxFreeAvailability:'tenant',taxFreeCounter:'면세 카운터 대상 점포 구매분만 취급',note:'면세 카운터 대응 점포와 개별 점포의 조건을 확인하세요. 모든 입점 매장의 면세 가능 여부·환급업체를 보장하지 않습니다.'})
  );
  const yodo='https://www.yodobashi.com/ec/support/news/2610280032675/index.html';
  [
    ['nagoya','메이테쓰 나고야','Meitetsu Nagoya','名鉄名古屋','나고야'],
    ['shinjuku','신주쿠 서쪽 본점','Shinjuku West Main','新宿西口本店','도쿄'],
    ['ikebukuro','멀티미디어 이케부쿠로','Multimedia Ikebukuro','マルチメディア池袋','도쿄'],
    ['akiba','멀티미디어 Akiba','Multimedia Akiba','マルチメディアAkiba','도쿄'],
    ['ueno','멀티미디어 우에노','Multimedia Ueno','マルチメディア上野','도쿄'],
    ['yokohama','멀티미디어 요코하마','Multimedia Yokohama','マルチメディア横浜','기타 지역']
  ].forEach(([id,ko,en,ja,region])=>data.push(branch('yodo-'+id,'요도바시카메라 '+ko,'Yodobashi '+en,'ヨドバシカメラ '+ja,region,'요도바시카메라',yodo,{
    city:id==='yokohama'?'요코하마':region, aliases:id==='akiba'?['아키하바라','Akihabara']:[],
    provider:'Global Blue',level:'official',refundProvider:'Global Blue',refundProviderStatus:'official',service:'globalblue',
    refundMethods:['시내 현금 선환급 (조건 확인 필요)'],taxFreeCounter:'점내 면세 카운터 · 층·접수 시간은 지점에서 확인',
    taxFreeProcedure:'점내 면세 수속 후 출국 시 세관 확인 필수',
    note:'공식 발표의 시내 선환급 대상 11개 지점에 포함됩니다. 세관 확인 미완료 시 선지급액이 카드에 청구될 수 있으므로 이용 조건을 확인하세요.',
    sources:[source(yodo,'요도바시 개정 안내','2026.11 시행'),source('https://prtimes.jp/main/html/rd/p/000000027.000022577.html','Global Blue 공식 발표','대상 11개 지점')]
  })));
  const common=(id,ko,en,ja,url,extra={})=>branch(id,ko,en,ja,'전국 공통',ko,url,{
    scope:'chain',category:'체인 공통 안내',city:null,taxFreeAvailability:'branch-check',
    note:'체인 공통 참고 정보입니다. 모든 지점의 면세 가능 여부·환급업체·수수료를 보장하지 않습니다.',...extra});
  data.push(
    common('chain-loft','로프트','Loft','ロフト',loft),
    common('chain-parco','PARCO','PARCO','パルコ','https://nagoya.parco.jp/taxfree/',{aliases:['파르코'],note:'시설·입점 점포별 안내를 확인하세요. 나고야와 시부야의 수속 방식을 다른 PARCO에 일괄 적용하지 않습니다.'}),
    common('chain-gu','GU','GU','ジーユー','https://faq.gu-global.com/articles/Knowledge/100015812/?fs=RelatedArticle&l=ja&q=%E8%BF%94%E5%93%81', {aliases:['지유','지유 지유'],provider:'J-TaxRefund',level:'official',refundProvider:'J-TaxRefund',refundProviderStatus:'official',service:'jtax',refundFee:'약 10%',refundFeeBasis:'환급액',taxFreeProcedure:'J-TaxRefund에서 환급 수속. 실제 면세 가능 지점은 별도 확인'}),
    common('chain-muji','무인양품','MUJI','無印良品','https://www.muji.com/jp/ja/shop/search/MUJI',{aliases:['무지']}),
    common('chain-hands','핸즈','Hands','ハンズ','https://nagoya.hands.net/NY_CH201909_Fs.pdf',{aliases:['도큐핸즈','Tokyu Hands'],note:'연결 자료는 나고야점의 과거 안내입니다. 개정 후 업체·수수료·최신 지점 조건은 확인되지 않아 적용하지 않았습니다.',verifiedStatus:'needs-check'}),
    common('chain-takashimaya','다카시마야','Takashimaya','高島屋','https://www.takashimaya.co.jp/store/special/tax_refund_procedure/index_kr.html',{aliases:['타카시마야'],note:oldWarning+' JR 나고야점 등은 해당 지점 안내를 우선 확인하세요.'}),
    common('chain-mistore','미쓰코시·이세탄','Mitsukoshi Isetan','三越 伊勢丹','https://www.isetan.mistore.jp/common/important_news/importantnews_detail024.html',{aliases:['미츠코시','이세탄','미쓰코시'],note:'2026.11.1 리펀드 제도 변경 공지. 지점별 카운터·환급업체·수수료는 별도 확인이 필요합니다.'}),
    common('chain-matsuzakaya','마쓰자카야','Matsuzakaya','松坂屋','https://www.matsuzakaya.co.jp/nagoya/service/gaikoku.html',{aliases:['마츠자카야'],note:'연결 자료는 나고야점 안내입니다. 나고야점의 수수료·카운터를 다른 지점에 적용하지 마세요.'})
  );
  // Individually verified hundred-yen shops; no chain-wide eligibility inference.
  data.push(...[
  {
    "id": "hundred-yen-daiso-1",
    "ko": "다이소 나고야 사카에 스카일점",
    "en": "DAISO Nagoya Sakae Skyle",
    "ja": "DAISO 名古屋栄スカイル店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市中区栄3-4-5 スカイル7階",
    "floor": "7F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/007352",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/007352",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-2",
    "ko": "다이소 나고야 이마이케점",
    "en": "DAISO Nagoya Imaike",
    "ja": "DAISO 名古屋今池店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市千種区今池3-12-12",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/007231",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/007231",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-3",
    "ko": "다이소 나고야 호리타점",
    "en": "DAISO Nagoya Horita",
    "ja": "DAISO 名古屋堀田店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市瑞穂区塩入町14番8号",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/005589",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/005589",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-4",
    "ko": "다이소 나고야 나루파크점",
    "en": "DAISO Nagoya Narupark",
    "ja": "DAISO 名古屋なるぱーく店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市緑区浦里3丁目232 なるぱーく2階",
    "floor": "2F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/003097",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/003097",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-5",
    "ko": "다이소 샴피아포트 나고야 다카쓰지점",
    "en": "DAISO Champia Port Nagoya Takatsuji",
    "ja": "DAISO シャンピアポート名古屋高辻店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市昭和区白金三丁目6-24 シャンピアポート内",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/007339",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/007339",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-6",
    "ko": "다이소 나고야 오스점",
    "en": "DAISO Nagoya Osu",
    "ja": "DAISO 名古屋大須店",
    "region": "나고야",
    "city": "나고야",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "愛知県名古屋市中区大須3-11-19 1階",
    "floor": "1F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/009076",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/009076",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-7",
    "ko": "다이소 시부야 마크시티점",
    "en": "DAISO Shibuya Mark City",
    "ja": "DAISO 渋谷マークシティ店",
    "region": "도쿄",
    "city": "도쿄",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "東京都渋谷区道玄坂1-12-1 渋谷マークシティ1階",
    "floor": "1F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/003086",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/003086",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      },
      {
        "url": "https://www.s-markcity.co.jp/shop-restaurant/w-1-4-1/",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-8",
    "ko": "다이소 시부야 센터가이점",
    "en": "DAISO Shibuya Center-gai",
    "ja": "DAISO 渋谷センター街店",
    "region": "도쿄",
    "city": "도쿄",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "東京都渋谷区宇田川町35-2",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/008931",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/008931",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-9",
    "ko": "다이소 하라주쿠점",
    "en": "DAISO Harajuku",
    "ja": "DAISO 原宿店",
    "region": "도쿄",
    "city": "도쿄",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "東京都渋谷区神宮前1-19-24 ビレッジ107 2階",
    "floor": "2F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/007157",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/007157",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-10",
    "ko": "다이소 난바 워크점",
    "en": "DAISO Namba Walk",
    "ja": "DAISO なんばウォーク店",
    "region": "오사카",
    "city": "오사카",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "大阪府大阪市中央区千日前1-5-4 虹のまち",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/002627",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/002627",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리. 시설 공식 페이지는 三番街로 안내. 타 추천 매장의 TAX FREE 표시는 이 지점에 적용하지 않음."
      },
      {
        "url": "https://walk.osaka-chikagai.jp/index.php/shopguide/586",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-11",
    "ko": "다이소 신사이바시점",
    "en": "DAISO Shinsaibashi",
    "ja": "DAISO 心斎橋店",
    "region": "오사카",
    "city": "오사카",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "大阪府大阪市中央区南船場3丁目10番3号3階",
    "floor": "3F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/008646",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/008646",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-12",
    "ko": "다이소 구로몬시장점",
    "en": "DAISO Kuromon Market",
    "ja": "DAISO 黒門市場店",
    "region": "오사카",
    "city": "오사카",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "大阪府大阪市中央区日本橋1-21-16 たこそうマンション1階",
    "floor": "1F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/005312",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/005312",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-13",
    "ko": "다이소 이온몰 교토점",
    "en": "DAISO AEON Mall Kyoto",
    "ja": "DAISO イオンモールKYOTO店",
    "region": "기타 지역",
    "city": "교토",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "京都府京都市南区西九条鳥居口町1番地 イオンモールKYOTO Kaede館4階",
    "floor": "4F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/008286",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/008286",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-14",
    "ko": "다이소 하카타 버스터미널점",
    "en": "DAISO Hakata Bus Terminal Fukuoka",
    "ja": "DAISO 博多バスターミナル店",
    "region": "기타 지역",
    "city": "후쿠오카",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "福岡県福岡市博多区博多駅中央街2-1 博多バスターミナル5階",
    "floor": "5F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/001516",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/001516",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      },
      {
        "url": "https://www.h-bt.jp/floor/shop31.html",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-15",
    "ko": "다이소 삿포로 다누키코지 2초메점",
    "en": "DAISO Sapporo Tanukikoji 2-chome",
    "ja": "DAISO 狸小路2丁目店",
    "region": "기타 지역",
    "city": "삿포로",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": "北海道札幌市中央区南2条西2丁目1 金市舘ビル6階",
    "floor": "6F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.daiso-sangyo.co.jp/shop/detail/002210",
    "sources": [
      {
        "url": "https://www.daiso-sangyo.co.jp/shop/detail/002210",
        "label": "공식 지점 안내",
        "scope": "브랜드 공식 지점 안내에서 지점·주소 및 서비스 목록 확인. 면세 취급 여부와 환급업체는 명시되지 않아 미확인으로 분리."
      }
    ]
  },
  {
    "id": "hundred-yen-seria-16",
    "ko": "세리아 시미즈야 후지가오카점",
    "en": "Seria Shimizuya Fujigaoka",
    "ja": "Seria 清水屋藤ヶ丘店",
    "region": "나고야",
    "city": "나고야",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": "愛知県名古屋市守山区森孝東1-509 清水屋藤ヶ丘店4F",
    "floor": "4F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.shimizuya.co.jp/store/p871/",
    "sources": [
      {
        "url": "https://www.shimizuya.co.jp/store/p871/",
        "label": "공식 지점 안내",
        "scope": "입점 시설/상점가 공식 안내에서 지점 존재 확인. 해당 세리아 지점의 면세 취급 여부와 환급업체는 확인되지 않음."
      },
      {
        "url": "https://shop.seria-group.com/seria/info/000002229",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-seria-17",
    "ko": "세리아 오스점",
    "en": "Seria Osu",
    "ja": "Seria 大須店",
    "region": "나고야",
    "city": "나고야",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": "愛知県名古屋市中区大須2-18-42",
    "floor": null,
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.kinsyachi.com/shop/seriaosuten/",
    "sources": [
      {
        "url": "https://www.kinsyachi.com/shop/seriaosuten/",
        "label": "공식 지점 안내",
        "scope": "입점 시설/상점가 공식 안내에서 지점 존재 확인. 해당 세리아 지점의 면세 취급 여부와 환급업체는 확인되지 않음."
      }
    ]
  },
  {
    "id": "hundred-yen-seria-18",
    "ko": "세리아 아스날 가나야마점",
    "en": "Seria Asunal Kanayama",
    "ja": "Seria アスナル金山店",
    "region": "나고야",
    "city": "나고야",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": "愛知県名古屋市中区金山1丁目17-1 アスナル金山3F",
    "floor": "3F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.asunal.jp/shopguide/detail/?cd=000050",
    "sources": [
      {
        "url": "https://www.asunal.jp/shopguide/detail/?cd=000050",
        "label": "공식 지점 안내",
        "scope": "입점 시설/상점가 공식 안내에서 지점 존재 확인. 해당 세리아 지점의 면세 취급 여부와 환급업체는 확인되지 않음. 2026-11-01 시설 면세 대상 목록에 Seria는 없으나 직접적인 대상외 표기가 아니므로 미확인 유지."
      },
      {
        "url": "https://www.asunal.jp/news/",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-seria-19",
    "ko": "세리아 빅카메라 나고야역 서쪽점",
    "en": "Seria Bic Camera Nagoya Station West",
    "ja": "Seria ビックカメラ名古屋駅西店",
    "region": "나고야",
    "city": "나고야",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": null,
    "floor": "5F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://www.biccamera.com/bc/i/shop/shoplist/shop033.jsp",
    "sources": [
      {
        "url": "https://www.biccamera.com/bc/i/shop/shoplist/shop033.jsp",
        "label": "공식 지점 안내",
        "scope": "입점 시설/상점가 공식 안내에서 지점 존재 확인. 해당 세리아 지점의 면세 취급 여부와 환급업체는 확인되지 않음. 빅카메라 자체의 면세 서비스 표시는 입점 세리아의 면세 근거로 사용하지 않음. 공식 페이지 텍스트에서 번지 주소 미확인으로 null."
      }
    ]
  },
  {
    "id": "hundred-yen-seria-20",
    "ko": "세리아 키테라타운 후쿠오카 나가하마점",
    "en": "Seria Kitera Town Fukuoka Nagahama",
    "ja": "Seria キテラタウン福岡長浜店",
    "region": "기타 지역",
    "city": "후쿠오카",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": "福岡県福岡市中央区港1丁目10-1 キテラタウン福岡長浜3F",
    "floor": "3F",
    "parentFacilityId": null,
    "taxFreeAvailability": "unknown",
    "provider": "업체 미확인",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "unknown",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official-partial",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내에서 지점 존재를 확인했습니다. 면세 가능 여부·환급업체는 확인되지 않았으므로 구매 전에 매장에서 확인하세요.",
    "source": "https://fukuoka-nagahama.kiteratown.jp/tenpo/seria/",
    "sources": [
      {
        "url": "https://fukuoka-nagahama.kiteratown.jp/tenpo/seria/",
        "label": "공식 지점 안내",
        "scope": "입점 시설/상점가 공식 안내에서 지점 존재 확인. 해당 세리아 지점의 면세 취급 여부와 환급업체는 확인되지 않음."
      },
      {
        "url": "https://shop.seria-group.com/seria/info/000002463",
        "label": "브랜드 공식 지점 안내",
        "scope": "지점 존재 확인 · 면세 미확인"
      }
    ]
  },
  {
    "id": "hundred-yen-daiso-21",
    "ko": "다이소 마로니에 게이트 긴자점",
    "en": "DAISO Marronnier Gate Ginza",
    "ja": "DAISO マロニエゲート銀座店",
    "region": "도쿄",
    "city": "도쿄",
    "brand": "DAISO",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "다이소",
      "ダイソー"
    ],
    "address": null,
    "floor": "마로니에 게이트 긴자 2 · 6F",
    "parentFacilityId": null,
    "taxFreeAvailability": "not-eligible",
    "provider": "해당 없음",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "not-applicable",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내상 면세 대상이 아닌 지점입니다. 구매금액이 기준을 넘어도 이 지점 구매분은 환급 대상이 아닙니다.",
    "source": "https://www.marronniergate.com/shop/index/304",
    "sources": [
      {
        "url": "https://www.marronniergate.com/shop/index/304",
        "label": "공식 지점 안내",
        "scope": "입점 시설 공식 지점 안내의 免税: 対象外 확인."
      }
    ]
  },
  {
    "id": "hundred-yen-seria-22",
    "ko": "세리아 이케부쿠로 P’PARCO점",
    "en": "Seria Ikebukuro P'PARCO",
    "ja": "Seria 池袋P'PARCO",
    "region": "도쿄",
    "city": "도쿄",
    "brand": "Seria",
    "scope": "branch",
    "category": "100엔숍",
    "aliases": [
      "세리아",
      "セリア"
    ],
    "address": null,
    "floor": "P’PARCO 5F",
    "parentFacilityId": null,
    "taxFreeAvailability": "not-eligible",
    "provider": "해당 없음",
    "level": "unknown",
    "refundProvider": null,
    "refundProviderStatus": "not-applicable",
    "taxFreeProcedure": null,
    "taxFreeCounter": null,
    "refundMethods": null,
    "refundFee": null,
    "refundFeeBasis": null,
    "verifiedStatus": "official",
    "verifiedAt": "2026-11-24",
    "travelerReviews": [],
    "note": "공식 안내상 면세 대상이 아닌 지점입니다. 구매금액이 기준을 넘어도 이 지점 구매분은 환급 대상이 아닙니다.",
    "source": "https://ikebukuro.parco.jp/shop/detail/?cd=027190",
    "sources": [
      {
        "url": "https://ikebukuro.parco.jp/shop/detail/?cd=027190",
        "label": "공식 지점 안내",
        "scope": "입점 시설 공식 지점 안내의 免税: 対象外 확인. 본관 주소는 P’PARCO 지점 주소로 전용하지 않음."
      }
    ]
  }
]);
  return data;
})();
