const clean = value => String(value ?? '').trim();
const unique = values => [...new Set(values.filter(Boolean))];

export const methodTracks = {
  pusula: [
    {
      letter: 'P',
      title: 'Problemi seç',
      child: '“AI ile ne yapabilirim?” diye değil, “İnsanların hangi sıkıcı işini kolaylaştırabilirim?” diye başla.',
      question: 'Kullanıcı bugün hangi işi yaparken zaman kaybediyor veya hata yapıyor?',
      example: ({ idea }) => idea?.problem || 'Güvenlik analisti yüzlerce CVE arasından önemli olanları seçmekte zorlanıyor.'
    },
    {
      letter: 'U',
      title: 'Kullanıcıyı anla',
      child: 'Herkes için ürün yapma. Önce tek bir kullanıcı grubunu ve onun günlük işini seç.',
      question: 'Bu işi kim yapıyor, bugün nasıl çözüyor ve en çok nerede zorlanıyor?',
      example: ({ idea }) => idea?.user || 'DevSecOps ekibi her sabah tarama raporlarını elle inceliyor.'
    },
    {
      letter: 'S',
      title: 'Sonucu tanımla',
      child: 'Başarıyı ölçülebilir bir cümleye çevir. “Daha iyi olsun” yerine hangi sayının değişeceğini söyle.',
      question: 'Ürün çalışırsa hangi süre, hata veya maliyet azalacak?',
      example: ({ idea }) => idea?.metric || '30 dakikalık ilk incelemeyi 8 dakikaya düşürmek.'
    },
    {
      letter: 'U',
      title: 'Uygun model ve aracı seç',
      child: 'En büyük modeli değil, görevi yeterince iyi ve güvenli yapan en basit sistemi seç.',
      question: 'Metin dışında dosya, web, kod, görsel veya yerel çalışma gerekiyor mu?',
      example: ({ idea, journey }) => journey?.stack?.join(' → ') || idea?.starter || 'JSON girişi + küçük model + insan onaylı rapor.'
    },
    {
      letter: 'L',
      title: 'Limitleri ve güvenliği test et',
      child: 'Ürünü yalnızca doğru örneklerde değil; kötü veri, eksik bilgi ve kötü niyetli talimatta da dene.',
      question: 'Yanlış cevap, veri sızıntısı, yüksek maliyet veya yetkisiz işlem nasıl durdurulacak?',
      example: ({ idea, journey }) => journey?.tests?.attack?.[0] || idea?.risk || 'Model öneri verse bile kritik işlem insan onayı olmadan başlamaz.'
    },
    {
      letter: 'A',
      title: 'Az kullanıcıyla başlat',
      child: 'Önce üç gerçek kullanıcı. Hataları gör, düzelt, sonra on kişiye çık. Büyük lansman en son gelir.',
      question: 'İlk pilot kimlerle, hangi veriyle ve kaç gerçek görevle yapılacak?',
      example: ({ idea, journey }) => journey?.pilotOffer || (idea ? `3 ${idea.user.toLocaleLowerCase('tr-TR')} kullanıcısıyla kontrollü pilot.` : 'Üç analist bir hafta boyunca yalnızca öneri modunda dener.')
    }
  ],
  kazan: [
    {
      letter: 'K',
      title: 'Kitleyi belirle',
      child: '“Herkes” müşteri değildir. İlk satış için problemi en sık ve en pahalı yaşayan küçük bir grup seç.',
      question: 'Satın alma kararını kim verir, ürünü kim kullanır ve pilota kim izin verir?',
      example: ({ idea, journey }) => journey ? `${journey.customerType}. İlk görüşme hedefi: ${journey.interviewTargets.join(' · ')}` : idea?.user || 'Önce tek bir kullanıcı grubu seç.'
    },
    {
      letter: 'A',
      title: 'Açılış teklifini hazırla',
      child: 'Ürünün bütün özelliklerini değil, müşterinin elde edeceği ilk sonucu anlat.',
      question: 'İlk demo, pilot ve fiyat hipotezi hangi riski azaltacak?',
      example: ({ journey }) => journey ? `${journey.promise} Pilot: ${journey.pilotOffer}` : 'Tek cümlelik vaat + düşük riskli pilot.'
    },
    {
      letter: 'Z',
      title: 'Ziyaretçiyi getir',
      child: 'Her kanalda görünmeye çalışma. Müşterinin zaten bulunduğu en fazla üç kanalı seç.',
      question: 'İlk 50 olası müşteriye nereden ve hangi faydalı içerikle ulaşacaksın?',
      example: ({ journey, category }) => unique([...(journey?.channels || []), ...(category?.channels || [])]).slice(0, 3).join(' · ') || 'LinkedIn · topluluk · iş ortaklığı'
    },
    {
      letter: 'A',
      title: 'Alıcıyı müşteriye çevir',
      child: 'İlk mesajda satış baskısı kurma. Problem görüşmesi → demo → pilot → sonuç raporu → teklif akışını kullan.',
      question: 'Müşteri ürünü satın almadan önce hangi kanıtı görmek istiyor?',
      example: ({ category, journey }) => category ? `${category.salesFlow.join(' → ')}. Ana demo: ${journey?.demoIdea || 'tek gerçek iş akışı'}` : 'Problem görüşmesi → demo → pilot → teklif.'
    },
    {
      letter: 'N',
      title: 'Neticeyi ölç ve müşteriyi tut',
      child: 'Satış bitiş değil, başlangıçtır. Kullanıcıyı hızlıca ilk değere ulaştır ve geri dönüp dönmediğini ölç.',
      question: 'Kullanıcının ilk değer anı nedir; 1, 3, 7 ve 30. gün neyi kontrol edeceksin?',
      example: ({ journey }) => journey ? `${journey.activationEvent} Ölç: ${journey.metrics.slice(0, 3).join(' · ')}` : 'İlk değer → tekrar kullanım → ödeme → devam.'
    }
  ]
};

export const journeyStepMeta = [
  { key: 'passport', number: '00', phase: 'PLAN', title: 'Ürün pasaportu', short: 'Rota, süre ve iş modelini netleştir.' },
  { key: 'validate', number: '01', phase: 'PUSULA', title: 'Problemi doğrula', short: 'İnşa etmeden önce gerçek kullanıcıyla konuş.' },
  { key: 'offer', number: '02', phase: 'PUSULA', title: 'Teklifi oluştur', short: 'Bir cümlelik vaat, pilot ve fiyat hipotezi.' },
  { key: 'build', number: '03', phase: 'PUSULA', title: 'MVP’yi inşa et', short: 'Olması gerekeni yap; geri kalanını ertele.' },
  { key: 'test', number: '04', phase: 'PUSULA', title: 'Güvenli test et', short: 'Normal, zor ve saldırı örneklerini dene.' },
  { key: 'launch', number: '05', phase: 'PUSULA', title: 'Canlıya al', short: 'Özel pilot, kapalı beta veya kontrollü yayın.' },
  { key: 'acquire', number: '06', phase: 'KAZAN', title: 'İlk müşterileri bul', short: 'İlk 10 müşteri için dar ve uygulanabilir plan.' },
  { key: 'market', number: '07', phase: 'KAZAN', title: 'Pazarlama ve satış', short: 'Mesaj, içerik, demo, pilot ve teklif.' },
  { key: 'retain', number: '08', phase: 'KAZAN', title: 'Takip et ve büyüt', short: 'İlk değer, tekrar kullanım ve müşteri kaybı.' }
];

function durationLimit(duration) {
  if (duration === 'weekend') return 3;
  if (duration === '14days') return 5;
  return 8;
}

function launchMode(duration) {
  if (duration === 'weekend') return 'ÖZEL DEMO — yalnızca sen ve 1–2 problem görüşmesi yaptığın kişi görür.';
  if (duration === '14days') return 'ÖZEL PİLOT — 3–5 kullanıcı, kontrollü veri ve manuel destek.';
  return 'KAPALI BETA — davetli ilk 10 kullanıcı, ölçüm ve destek döngüsü.';
}

function budgetStack(budget, idea, journey) {
  const base = [...(journey.stack || [])];
  if (budget === 'free') return unique(['Statik arayüz veya basit form', 'Ücretsiz model kotası ya da yerel küçük model', 'Sentetik/maskelenmiş veri', 'Manuel operasyon', ...base]).slice(0, 6);
  if (budget === 'low') return unique(['Cloudflare Worker veya benzer serverless API', 'Ekonomik model + kullanım limiti', 'Yönetilen küçük veritabanı', 'Basit loglama', ...base]).slice(0, 7);
  return unique(['Kurumsal model hesabı veya kontrollü yerel model', 'SSO/RBAC', 'Observability ve audit', 'Yedekleme/rollback', 'Destek süreci', ...base]).slice(0, 8);
}

function firstTenPlan(route, journey, category) {
  const channels = unique([...(journey.channels || []), ...(category.channels || [])]).slice(0, 3);
  const base = [
    `50 olası müşteri veya kullanıcıdan oluşan dar bir liste çıkar: ${journey.customerType}.`,
    `İlk 10 kişiye satış yapmadan problem sorularını gönder.`,
    `En az 5 problem görüşmesi yap; aynı problemi doğrulayan cümleleri kaydet.`,
    `3 kişiye “${journey.pilotOffer}” teklif et.`,
    `İlk değer anını ölç: ${journey.activationEvent}`,
    `İtirazları ve kullanıcının kendi kelimelerini satış metnine ekle.`,
    `Bir sonuç özeti veya mini vaka çalışması hazırla.`,
    `İkinci müşteri grubuna kanıtla git: ${channels.join(' · ')}.`,
    `Ücretli paket hipotezini sun: ${journey.firstPrice}`,
    `Memnun kullanıcıdan referans veya tanıştırma iste.`
  ];
  if (route === 'open') {
    return [
      'GitHub reposunu güvenli varsayılanlar, kısa README ve örnek veriyle yayınla.',
      'İlk 10 hedef geliştiriciye kurulum yaptır ve nerede takıldıklarını izle.',
      'En az 3 gerçek issue ve 1 dış katkı hedefle.',
      'Demo videosu ve küçük “good first issue” listesi hazırla.',
      `Topluluk kanalları: ${channels.join(' · ')}.`,
      'Hosted sürüm veya ekip özellikleri için bekleme listesi aç.',
      'En çok tekrarlanan kurulum işini ürüne ekle.',
      'İlk ekip pilotunu ücretsiz veya düşük ücretli yap.',
      'Destek/hosted teklifini ölçülebilir sonuçla sun.',
      'Referans, yıldız veya vaka çalışması iste.'
    ];
  }
  if (route === 'custom') {
    return [
      `20 hedef kurum belirle: ${journey.customerType}.`,
      'Karar verici, kullanıcı ve güvenlik/IT onaylayıcısını ayrı yaz.',
      '5 keşif görüşmesi yap ve entegrasyon sınırını çıkar.',
      'Tek müşteri için kapsamı dar bir ücretli/indirimli pilot teklifi hazırla.',
      'Kabul kriterlerini ve veri sınırını yazılı onaylat.',
      `Kapalı demo: ${journey.demoIdea}`,
      'Pilot sonucunu zaman, hata veya maliyet metriğiyle raporla.',
      'Kurulum + lisans + destek teklifini ayrı kalemlerle sun.',
      'İkinci kurum için tekrar kullanılabilir parçaları ayır.',
      'Referans veya anonim vaka çalışması iste.'
    ];
  }
  if (route === 'saas') {
    return [
      `30 hedef kullanıcı belirle: ${journey.customerType}.`,
      'Tek cümlelik açılış sayfası ve bekleme listesi hazırla.',
      '10 kullanıcı görüşmesi ve en az 5 demo yap.',
      '3–5 kullanıcıya davetli ücretsiz pilot aç.',
      `Aktivasyonu ölç: ${journey.activationEvent}`,
      'Onboarding’de kullanıcıyı ilk değere götürmeyen adımları kaldır.',
      `İçerik ve dağıtım kanalları: ${channels.join(' · ')}.`,
      'Ücretsiz planın sınırını ve ücretli paketin değerini test et.',
      'İlk ücretli kullanıcıdan kullanım görüşmesi yap.',
      'Referans ve davet mekanizmasını ekle.'
    ];
  }
  return base;
}

function routeSpecificNote(route, routeData, journey) {
  if (route === 'service') return `${routeData.summary} Bu fikir için başlangıç: ${journey.serviceFirst}`;
  return routeData.summary;
}

function task(id, text) {
  return { id, text: clean(text) };
}

function section(title, items = [], intro = '', tone = '') {
  return { title, items: items.filter(Boolean), intro: clean(intro), tone };
}

export function buildJourneySteps({ idea, journey, category, route, duration, budget, config }) {
  const routeData = config.routes[route];
  const durationData = config.durations[duration];
  const budgetData = config.budgets[budget];
  const limit = durationLimit(duration);
  const mustHave = journey.mustHave.slice(0, limit);
  const buildStack = budgetStack(budget, idea, journey);
  const channels = unique([...(journey.channels || []), ...(category.channels || [])]).slice(0, 3);
  const firstTen = firstTenPlan(route, journey, category);
  const allTests = [
    ...journey.tests.normal.map(value => `NORMAL · ${value}`),
    ...journey.tests.edge.map(value => `ZOR · ${value}`),
    ...journey.tests.attack.map(value => `SALDIRI · ${value}`)
  ];
  const launchChecks = unique([
    `Domain, HTTPS, hata sayfası ve mobil görünüm kontrol edildi.`,
    `Canlıya alma seviyesi seçildi: ${launchMode(duration)}`,
    ...category.launchChecks,
    `Ürün özel riski açıkça ele alındı: ${idea.risk}`
  ]);
  const contentPlan = category.contentPlan;
  const metrics = unique([...(journey.metrics || []), ...(category.baseMetrics || [])]).slice(0, 6);

  return [
    {
      ...journeyStepMeta[0],
      summary: 'Bütün ayrıntıya girmeden önce ürünün kime, neyi, hangi yolla sunduğunu tek ekranda gör.',
      today: `Bugün: “${journey.promise}” cümlesini hedef kullanıcıya göster ve anlaşılır olup olmadığını sor.`,
      sections: [
        section('Ürün pasaportu', [
          `Hedef müşteri: ${journey.customerType}`,
          `Çözülen problem: ${idea.problem}`,
          `Temel vaat: ${journey.promise}`,
          `MVP süresi: ${journey.mvpTime}`,
          `Satış zorluğu: ${journey.salesDifficulty}`,
          `Veri hassasiyeti: ${journey.dataSensitivity}`,
          `İlk müşteri kanalı: ${journey.firstChannel}`,
          `Aktivasyon anı: ${journey.activationEvent}`
        ]),
        section('Seçtiğin rota', [
          `${routeData.label}: ${routeSpecificNote(route, routeData, journey)}`,
          `${durationData.label}: ${durationData.summary}`,
          `${budgetData.label}: ${budgetData.summary}`
        ], '', 'highlight'),
        section('Gelir hipotezleri', journey.businessModels)
      ],
      tasks: [
        task('passport-promise', `Ürün vaadini onayla: ${journey.promise}`),
        task('passport-route', `Başlangıç rotasını seç: ${routeData.label}`),
        task('passport-duration', `İlk hedef süreyi seç: ${durationData.label}`),
        task('passport-budget', `Bütçe yaklaşımını seç: ${budgetData.label}`),
        task('passport-metric', `İlk değer anını yaz: ${journey.activationEvent}`)
      ]
    },
    {
      ...journeyStepMeta[1],
      summary: 'Kod yazmadan önce problemin gerçek, sık ve yeterince pahalı olup olmadığını doğrula.',
      today: `Bugün: ${journey.interviewTargets[0]} grubundan bir kişiye ilk problem görüşmesi mesajını gönder.`,
      sections: [
        section('Görüşülecek kişiler', journey.interviewTargets),
        section('Sorulacak sorular', category.interviewQuestions),
        section('Ürünü yapmama sinyalleri', journey.stopSignals, 'Bu işaretlerden ikisi görünüyorsa kapsamı değiştir veya fikri durdur.', 'warning'),
        section('Bitti sayılır', ['En az 5 kullanıcıyla konuşuldu.', 'En az 3 kişi aynı problemi kendi cümlesiyle doğruladı.', 'En az 1 kişi kontrollü pilotu kabul etti.'])
      ],
      tasks: [
        ...journey.interviewTargets.slice(0, 3).map((value, index) => task(`validate-target-${index}`, `${value} için görüşme listesi hazırla.`)),
        task('validate-five', 'En az 5 problem görüşmesi yap.'),
        task('validate-evidence', 'Aynı problemi doğrulayan 3 gerçek cümleyi kaydet.'),
        task('validate-pilot', 'En az 1 pilot adayı bul.'),
        task('validate-stop', 'Ürünü yapmama sinyallerini dürüstçe kontrol et.')
      ]
    },
    {
      ...journeyStepMeta[2],
      summary: 'Özellikleri değil, müşterinin elde edeceği ilk sonucu ve düşük riskli pilotu paketle.',
      today: `Bugün: Bu mesajı sadeleştir — “${journey.promise}”`,
      sections: [
        section('Bir cümlelik teklif', [journey.promise], '', 'highlight'),
        section('Pilot teklifi', [journey.pilotOffer, routeData.salesNote]),
        section('Hizmetten ürüne başlangıç', [journey.serviceFirst]),
        section('İlk fiyat hipotezi', [journey.firstPrice]),
        section('Satış konuşmasının açılışı', [journey.salesOpener])
      ],
      tasks: [
        task('offer-one-line', 'Bir cümlelik ürün vaadini yaz ve 3 kişiye okut.'),
        task('offer-pilot', 'Pilot kapsamını, süresini ve veri sınırını yaz.'),
        task('offer-proof', 'Pilot sonunda gösterilecek tek sonucu seç.'),
        task('offer-price', 'Kesin fiyat değil, test edilecek fiyat mantığını belirle.'),
        task('offer-message', 'Satış yapmadan problem görüşmesi isteyen ilk mesajı hazırla.')
      ]
    },
    {
      ...journeyStepMeta[3],
      summary: 'MVP, küçük görünen ama gerçek kullanıcının ana işi tamamlayabildiği ilk çalışan sürümdür.',
      today: `Bugün: “Olması gerekenler” listesindeki ilk işi çalışan küçük bir prototipe dönüştür: ${mustHave[0]}`,
      sections: [
        section(`${durationData.label} — olması gerekenler`, mustHave, durationData.summary, 'highlight'),
        section('Daha sonra', journey.later),
        section('Şimdilik yapılmayacaklar', journey.notNow, 'Bu liste MVP’nin aylar sürmesini engeller.', 'warning'),
        section(`${budgetData.label} — önerilen yapı`, buildStack, routeData.buildNote)
      ],
      tasks: [
        ...mustHave.map((value, index) => task(`build-must-${index}`, value)),
        task('build-not-now', '“Şimdilik yapılmayacaklar” listesini görünür yere koy.'),
        task('build-observe', 'En az bir maliyet, hata ve kullanım ölçümü ekle.'),
        task('build-rollback', 'Çalışmayan sürümü geri alma yöntemini yaz.')
      ]
    },
    {
      ...journeyStepMeta[4],
      summary: 'Sadece güzel demoyu değil; yanlış, eksik ve kötü niyetli girdiyi de test et.',
      today: `Bugün: İlk saldırı testini yap — ${journey.tests.attack[0]}`,
      sections: [
        section('Test matrisi', allTests),
        section('Ürün özel ana risk', [idea.risk], '', 'warning'),
        section('Geçiş kuralı', ['10 normal test', '10 zor/kenar test', '5 saldırı testi', 'Kritik sonuçlarda insan onayı', 'Bilinen hataların açık listesi'])
      ],
      tasks: [
        ...journey.tests.normal.map((value, index) => task(`test-normal-${index}`, `Normal test: ${value}`)),
        ...journey.tests.edge.map((value, index) => task(`test-edge-${index}`, `Zor test: ${value}`)),
        ...journey.tests.attack.map((value, index) => task(`test-attack-${index}`, `Saldırı testi: ${value}`)),
        task('test-human', 'Kritik sonuçların insan onayı olmadan işlem başlatmadığını doğrula.'),
        task('test-cost', 'İstek, token veya dosya başına maliyet sınırını test et.')
      ]
    },
    {
      ...journeyStepMeta[5],
      summary: 'Büyük lansman yerine geri alınabilir, ölçülebilir ve desteklenebilir küçük yayın yap.',
      today: `Bugün: Canlıya alma seviyesini onayla — ${launchMode(duration)}`,
      sections: [
        section('Canlıya alma seviyesi', [launchMode(duration)], '', 'highlight'),
        section('Teknik checklist', launchChecks),
        section('İş checklist’i', ['Ürün adı ve bir cümlelik açıklama', 'Fiyat/pilot sayfası', 'Gizlilik ve kullanım şartları', 'Destek e-postası veya iletişim yolu', '2–5 dakikalık demo', 'Basit kullanım rehberi']),
        section('Rollback', ['Önceki çalışan sürümü koru.', 'Özelliği kapatma yolu tanımla.', 'Veri silme ve müşteri bilgilendirme planı yaz.'])
      ],
      tasks: [
        ...launchChecks.slice(0, 8).map((value, index) => task(`launch-check-${index}`, value)),
        task('launch-demo', 'Kısa demo ve kullanım rehberi hazırla.'),
        task('launch-support', 'Destek ve acil kapatma kanalını belirle.'),
        task('launch-rollback', 'Geri alma planını gerçek ortamdan önce dene.')
      ]
    },
    {
      ...journeyStepMeta[6],
      summary: 'İlk müşteriler reklamla değil; dar liste, problem görüşmesi, demo ve kontrollü pilotla gelir.',
      today: `Bugün: ${journey.customerType} içinden ilk 10 olası müşteriyi listele.`,
      sections: [
        section('Öncelikli kanallar', channels, `Satış biçimi: ${category.customerMotion}`),
        section('İlk 10 müşteri planı', firstTen),
        section('Düşük riskli giriş teklifi', [journey.pilotOffer, journey.leadMagnet]),
        section('Kaçın', ['Toplu ve kişiselleştirilmemiş spam', 'Problem doğrulanmadan ücretli reklam', 'İlk mesajda bütün özellikleri anlatmak', 'Müşteri izni olmadan verisini demoda kullanmak'], '', 'warning')
      ],
      tasks: firstTen.map((value, index) => task(`acquire-${index}`, value))
    },
    {
      ...journeyStepMeta[7],
      summary: 'Pazarlama doğru kişiyi konuşmaya getirir; satış ise problemi kanıt, pilot ve teklif üzerinden çözer.',
      today: `Bugün: “${journey.marketingMessage}” mesajıyla 60 saniyelik demo taslağı hazırla.`,
      sections: [
        section('Ana mesaj', [journey.marketingMessage], '', 'highlight'),
        section('Lead magnet ve demo', [`Ücretsiz içerik: ${journey.leadMagnet}`, `Demo: ${journey.demoIdea}`]),
        section('İlk 4 haftalık içerik', contentPlan),
        section('Satış akışı', category.salesFlow),
        section('Keşif soruları', journey.discoveryQuestions),
        section('Beklenen itirazlar', journey.objections, '', 'warning')
      ],
      tasks: [
        task('market-message', 'Ana mesajı tek cümleye indir.'),
        task('market-lead', `Lead magnet hazırla: ${journey.leadMagnet}`),
        task('market-demo', `2–5 dakikalık demo hazırla: ${journey.demoIdea}`),
        ...contentPlan.map((value, index) => task(`market-content-${index}`, value)),
        task('market-discovery', 'Keşif görüşmesi sorularını prova et.'),
        task('market-offer', 'Pilot sonucuna bağlı teklif şablonu hazırla.')
      ]
    },
    {
      ...journeyStepMeta[8],
      summary: 'Müşteri satın aldıktan sonra ürünü kullanamazsa satış başarısızdır. İlk değer anını hızlandır ve davranışı ölç.',
      today: `Bugün: İlk değer anını tek cümleye yaz — ${journey.activationEvent}`,
      sections: [
        section('Aktivasyon anı', [journey.activationEvent], 'Kullanıcı mümkün olduğunca hızlı bu ana ulaşmalı.', 'highlight'),
        section('1 / 3 / 7 / 30 günlük takip', [
          `1. gün: ${category.followUp.day1}`,
          `3. gün: ${category.followUp.day3}`,
          `7. gün: ${category.followUp.day7}`,
          `30. gün: ${category.followUp.day30}`
        ]),
        section('Başlangıç metrikleri', metrics),
        section('Basit ürün hunisi', ['Ziyaretçi', 'Kayıt veya demo talebi', 'İlk değer', 'Tekrar kullanım', 'Ücretli müşteri', 'Devam eden müşteri']),
        section('Müşteriyi kaybetme sinyalleri', ['İlk değere ulaşamıyor.', 'İkinci kez kullanmıyor.', 'Sonuç için sürekli manuel düzeltme gerekiyor.', 'Fiyat, elde edilen değerden yüksek algılanıyor.'], '', 'warning')
      ],
      tasks: [
        task('retain-activation', 'İlk değer anını ürün içinde ölç.'),
        task('retain-day1', '1. gün takip mesajını hazırla.'),
        task('retain-day3', '3. gün ürün geri bildirimi al.'),
        task('retain-day7', '7. gün değer metriğini ölç.'),
        task('retain-day30', '30. gün devam, referans ve yükseltme görüşmesi yap.'),
        ...metrics.slice(0, 5).map((value, index) => task(`retain-metric-${index}`, `Ölç: ${value}`))
      ]
    }
  ];
}

export function buildPlanMarkdown({ idea, journey, category, route, duration, budget, config, completed = {} }) {
  const steps = buildJourneySteps({ idea, journey, category, route, duration, budget, config });
  const routeData = config.routes[route];
  const durationData = config.durations[duration];
  const budgetData = config.budgets[budget];
  const lines = [
    `# ${idea.title} — Ürün Yol Haritası`,
    '',
    `- Hedef müşteri: ${journey.customerType}`,
    `- Temel vaat: ${journey.promise}`,
    `- Rota: ${routeData.label}`,
    `- Süre: ${durationData.label}`,
    `- Bütçe: ${budgetData.label}`,
    `- Aktivasyon: ${journey.activationEvent}`,
    '',
    '> Bu plan müşteri adı, e-posta veya özel veri içermez. Gerçek müşteri bilgilerini güvenli CRM ya da onaylı sistemde tut.',
    ''
  ];
  for (const step of steps) {
    lines.push(`## ${step.number} · ${step.title} (${step.phase})`, '', step.summary, '', `**Bugünkü görev:** ${step.today}`, '');
    for (const block of step.sections) {
      lines.push(`### ${block.title}`, '');
      if (block.intro) lines.push(block.intro, '');
      block.items.forEach(item => lines.push(`- ${item}`));
      lines.push('');
    }
    lines.push('### Checklist', '');
    step.tasks.forEach(item => lines.push(`- [${completed[item.id] ? 'x' : ' '}] ${item.text}`));
    lines.push('');
  }
  return lines.join('\n');
}
