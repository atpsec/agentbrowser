const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
  progress: 'ai-pusula-progress-v2',
  route: 'ai-pusula-route-v1',
  journeys: 'ai-pusula-product-journeys-v1'
};

const state = {
  apps: [],
  models: [],
  ideas: [],
  updates: [],
  playbookCatalog: null,
  appCategory: 'all',
  appSearch: '',
  appFreeOnly: false,
  appLimit: 6,
  modelView: 'all',
  modelLimit: 6,
  comparedModels: new Set(),
  ideaCategory: 'all',
  ideaDifficulty: 'all',
  ideaLimit: 6,
  selectedIdea: null,
  selectedPlaybook: null,
  journeyPlan: null,
  methodStep: 0,
  wizardStep: 0,
  wizardComplete: false,
  wizardRecommendation: null
};

const categoryLabels = {
  general: 'Genel',
  research: 'Araştırma',
  code: 'Kod',
  image: 'Görsel',
  video: 'Video',
  audio: 'Ses',
  security: 'Siber güvenlik',
  software: 'Yazılım',
  education: 'Eğitim',
  business: 'Küçük işletme',
  content: 'İçerik'
};

const difficultyLabels = {
  easy: 'Kolay',
  medium: 'Orta',
  advanced: 'İleri'
};

const conceptData = {
  model: {
    symbol: 'M',
    title: 'Model = beyin',
    child: 'Çok fazla örnek görmüş, yeni bir soru geldiğinde uygun cevabı tahmin etmeye çalışan dijital bir beyin gibi düşün.',
    example: '<b>Örnek:</b> GPT, Claude, Gemini, Qwen ve Gemma birer model ailesidir.',
    technical: 'Model, eğitim verisindeki örüntülerden parametreler öğrenir. Girdi geldiğinde sonraki tokenı, pikseli veya eylemi olasılıksal olarak üretir. Bilgi tabanı ya da insan gibi bilinçli bir varlık değildir.'
  },
  app: {
    symbol: 'UI',
    title: 'Uygulama = kumanda paneli',
    child: 'Modeli kullanmak için açtığın ekran. Araba motoruna doğrudan dokunmazsın; direksiyon ve pedalları kullanırsın.',
    example: '<b>Örnek:</b> ChatGPT, Claude, Gemini ve Qwen Studio birer uygulamadır; arkalarında bir veya daha fazla model çalışır.',
    technical: 'Uygulama; modele arayüz, dosya yükleme, hafıza, arama, güvenlik ayarları ve kullanıcı hesabı ekleyen ürün katmanıdır. Aynı model farklı uygulamalarda farklı davranabilir.'
  },
  tool: {
    symbol: '↗',
    title: 'Araç = eller',
    child: 'Model tek başına konuşur. Araç verilince webde arama yapabilir, dosya okuyabilir, kod çalıştırabilir veya takvime bakabilir.',
    example: '<b>Örnek:</b> Web search, terminal, GitHub, dosya arama ve hesap makinesi birer araçtır.',
    technical: 'Tool calling, modelin yapılandırılmış bir istek üretip harici bir fonksiyonu çağırmasıdır. Gerçek yetki araç katmanındadır; bu nedenle izin, girdi doğrulama ve audit gerekir.'
  },
  agent: {
    symbol: 'A',
    title: 'Agent = görevi takip eden yardımcı',
    child: 'Ona sadece tek soru sormazsın. Bir hedef verirsin; plan yapar, araç kullanır, sonucu kontrol eder ve gerektiğinde tekrar dener.',
    example: '<b>Örnek:</b> “Bu issueyu incele, kodu düzelt, test et ve PR hazırla.”',
    technical: 'Agent; model, araçlar, durum/hafıza ve bir kontrol döngüsünden oluşur. Otonomi arttıkça prompt injection, aşırı yetki, maliyet ve geri döndürülemez işlem riski de artar.'
  }
};

const methodData = [
  {
    letter: 'P',
    title: 'Problemi seç',
    child: '“AI ile ne yapabilirim?” diye değil, “İnsanların hangi sıkıcı işini kolaylaştırabilirim?” diye başla.',
    question: 'Kullanıcı bugün hangi işi yaparken zaman kaybediyor veya hata yapıyor?',
    example: idea => idea ? idea.problem : 'Örnek: Güvenlik analisti yüzlerce CVE arasından önemli olanları seçmekte zorlanıyor.'
  },
  {
    letter: 'U',
    title: 'Kullanıcıyı anla',
    child: 'Herkes için ürün yapma. Önce tek bir kullanıcı grubunu ve onun günlük işini seç.',
    question: 'Bu işi kim yapıyor, bugün nasıl çözüyor ve en çok nerede zorlanıyor?',
    example: idea => idea ? idea.user : 'Örnek: DevSecOps ekibi, her sabah tarama raporlarını elle inceliyor.'
  },
  {
    letter: 'S',
    title: 'Sonucu tanımla',
    child: 'Başarıyı ölçülebilir bir cümleye çevir. “Daha iyi olsun” yerine ne kadar zaman veya hata azalacağını söyle.',
    question: 'Ürün çalışırsa hangi sayı değişecek?',
    example: idea => idea ? idea.metric : 'Örnek: 30 dakikalık ilk incelemeyi 8 dakikaya düşürmek.'
  },
  {
    letter: 'U',
    title: 'Uygun model ve aracı seç',
    child: 'En büyük modeli değil, görevi yeterince iyi ve güvenli yapan en basit sistemi seç.',
    question: 'Sadece metin mi gerekiyor; dosya, web, kod, görsel veya yerel çalışma da gerekli mi?',
    example: idea => idea ? idea.starter : 'Örnek: JSON tarama çıktısı + küçük metin modeli + insan onaylı rapor.'
  },
  {
    letter: 'L',
    title: 'Limitleri ve güvenliği test et',
    child: 'Ürün sadece doğru örneklerde değil, kötü veri, eksik bilgi ve kötü niyetli talimatta da denenmeli.',
    question: 'Yanlış cevap, veri sızıntısı, yüksek maliyet veya yetkisiz işlem nasıl engellenecek?',
    example: idea => idea ? idea.risk : 'Örnek: Model “güvenli” dese bile deployment otomatik başlamaz; insan onayı gerekir.'
  },
  {
    letter: 'A',
    title: 'Az kullanıcıyla başlat',
    child: 'Önce üç gerçek kullanıcı. Hataları gör, düzelt, sonra on kişiye çık. Büyük lansman en son gelir.',
    question: 'İlk hafta ürünü kimler deneyecek ve hangi geri bildirimi toplayacaksın?',
    example: idea => idea ? `İlk pilot: 3 ${idea.user.toLocaleLowerCase('tr-TR')} kullanıcısıyla 10 gerçek görev.` : 'Örnek: Üç analist, bir hafta boyunca yalnızca öneri modunda dener.'
  }
];


const journeyStageLabels = [
  { id: 'validate', phase: 'PUSULA', number: '01', title: 'Problemi doğrula', summary: 'İnsanların gerçekten bu probleme sahip olduğunu kanıtla.' },
  { id: 'offer', phase: 'PUSULA', number: '02', title: 'Teklifi oluştur', summary: 'Kime, hangi sonucu ve hangi ilk paketle sunduğunu netleştir.' },
  { id: 'build', phase: 'PUSULA', number: '03', title: 'MVP’yi inşa et', summary: 'Tek kullanıcı ve tek ana iş akışı için en küçük çalışan ürünü kur.' },
  { id: 'test', phase: 'PUSULA', number: '04', title: 'Güvenli test et', summary: 'Doğru örneklerin yanında kötü veri, hata ve saldırı durumlarını da dene.' },
  { id: 'launch', phase: 'PUSULA', number: '05', title: 'Canlıya al', summary: 'Büyük lansman yerine ölçülebilir ve geri alınabilir bir pilot başlat.' },
  { id: 'acquire', phase: 'KAZAN', number: '06', title: 'İlk müşterileri bul', summary: 'Dar bir hedef liste oluştur ve problem görüşmeleriyle ilk pilotları bul.' },
  { id: 'market', phase: 'KAZAN', number: '07', title: 'Pazarla', summary: 'Ürünün özelliğini değil, çözdüğü problemi ve sonucu göster.' },
  { id: 'sell', phase: 'KAZAN', number: '08', title: 'Sat', summary: 'Keşif, demo, pilot ve teklif akışını basit bir satış sistemine dönüştür.' },
  { id: 'retain', phase: 'KAZAN', number: '09', title: 'Takip et ve büyüt', summary: 'İlk değer anını hızlandır, geri dönüşü ölç ve müşteriyi elde tut.' }
];

const policyData = {
  'repo-read': {
    status: 'ALLOW',
    statusClass: 'allow',
    title: 'İzin verildi.',
    text: 'Ajan yalnızca görev için gerekli repoyu salt-okunur biçimde görebilir.',
    code: 'resource: repository\naction: read\nscope: assigned-repo\nresult: allow'
  },
  'branch-create': {
    status: 'ALLOW',
    statusClass: 'allow',
    title: 'Sınırlı izin verildi.',
    text: 'Ajan kendi görev branchini oluşturabilir; korumalı branchlere doğrudan yazamaz.',
    code: 'resource: git-branch\naction: create\npattern: agent/*\nprotected-branches: deny'
  },
  'pr-merge': {
    status: 'HUMAN APPROVAL',
    statusClass: 'review',
    title: 'İnsan onayı gerekiyor.',
    text: 'Ajan PR hazırlayabilir fakat inceleme tamamlanmadan birleştirme yapamaz.',
    code: 'resource: pull-request\naction: merge\nchecks: required\napproval: human'
  },
  'prod-deploy': {
    status: 'HUMAN APPROVAL',
    statusClass: 'review',
    title: 'Production kapısı kapalı.',
    text: 'Test ve politika kontrolleri geçse bile gerçek ortama geçiş yetkili insan tarafından onaylanır.',
    code: 'resource: production\naction: deploy\npreview: allow\nproduction: human-approval'
  },
  'secrets-read': {
    status: 'DENY',
    statusClass: 'deny',
    title: 'İşlem engellendi.',
    text: 'Ajan bütün secret değerlerini okuyamaz. Gerekirse tek görev için kısa ömürlü token alır.',
    code: 'resource: secrets\naction: read-all\nresult: deny\nalternative: scoped-token'
  },
  'unknown-domain': {
    status: 'DENY',
    statusClass: 'deny',
    title: 'Ağ çıkışı engellendi.',
    text: 'İzin listesinde olmayan bir domaine şirket verisi gönderilemez.',
    code: 'resource: network-egress\ndomain: unknown\ndata-class: internal\nresult: deny'
  }
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function normalise(value = '') {
  return String(value).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function readJson(key, fallback = {}) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The guide remains usable when storage is disabled.
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function logoMarkup(item) {
  const initials = item.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const logo = escapeHtml(item.logo || '');
  const src = `https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${logo}.svg`;
  return `<span class="brand-logo"><img src="${src}" alt="" loading="lazy" data-logo-img><span data-logo-fallback hidden>${escapeHtml(initials)}</span></span>`;
}

function wireLogoFallbacks(root) {
  $$('[data-logo-img]', root).forEach(image => {
    const showFallback = () => {
      image.hidden = true;
      const fallback = image.nextElementSibling;
      if (fallback) fallback.hidden = false;
    };
    image.addEventListener('error', showFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) showFallback();
  });
}

function scoreDots(score) {
  const amount = Number(score) || 0;
  return `<span class="score-dots" aria-label="5 üzerinden ${amount}">${[1, 2, 3, 4, 5].map(index => `<i class="${index <= amount ? 'is-filled' : ''}"></i>`).join('')}</span>`;
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path} yüklenemedi (${response.status})`);
  return response.json();
}

async function loadData() {
  const [apps, models, ideas, updates, playbooks] = await Promise.all([
    fetchJson('./data/apps.json'),
    fetchJson('./data/models.json'),
    fetchJson('./data/ideas.json'),
    fetchJson('./data/updates.json'),
    fetchJson('./data/playbooks.json')
  ]);
  state.apps = apps.items;
  state.models = models.items;
  state.ideas = ideas.items;
  state.updates = updates.items;
  state.playbookCatalog = playbooks;
}

function renderConcept(key) {
  const concept = conceptData[key] || conceptData.model;
  const stage = $('#conceptStage');
  stage.innerHTML = `
    <div class="concept-visual"><div class="concept-symbol" aria-hidden="true">${escapeHtml(concept.symbol)}</div></div>
    <div class="concept-copy">
      <h3>${escapeHtml(concept.title)}</h3>
      <p class="child-copy">${escapeHtml(concept.child)}</p>
      <div class="concept-example">${concept.example}</div>
      <details><summary>Biraz daha teknik anlat</summary><p>${escapeHtml(concept.technical)}</p></details>
    </div>`;
  $$('[data-concept]').forEach(button => button.setAttribute('aria-selected', String(button.dataset.concept === key)));
}

function setRoute(path) {
  const routes = {
    learn: {
      title: 'Rotan: önce dört temel kavram',
      text: 'Model, uygulama, araç ve agent farkını öğren. Sonra ücretsiz uygulamalardan birini güvenli örneklerle dene.',
      target: 'basics'
    },
    choose: {
      title: 'Rotan: işi söyle, aracı filtrele',
      text: 'Araştırma, kod, görsel, video veya ses kategorisini seç. Ardından ücretsiz seçeneği olanları daralt.',
      target: 'apps'
    },
    build: {
      title: 'Rotan: problemi seç, küçük prototip yap',
      text: 'Bir ürün fikri seç ve PUSULA adımlarıyla kullanıcıdan güvenli pilota ilerle.',
      target: 'ideas'
    }
  };
  const route = routes[path] || routes.learn;
  const result = $('#routeResult');
  result.innerHTML = `<strong>${escapeHtml(route.title)}</strong><span>${escapeHtml(route.text)}</span><br><button class="text-button" type="button" data-route-target="${route.target}">Rotayı aç →</button>`;
  result.hidden = false;
  writeJson(STORAGE.route, { path, savedAt: new Date().toISOString() });
}

function restoreRoute() {
  const saved = readJson(STORAGE.route, null);
  if (saved?.path) setRoute(saved.path);
}

function resetWizard() {
  state.wizardStep = 0;
  state.wizardComplete = false;
  state.wizardRecommendation = null;
  $('#wizardForm').reset();
  $('#wizardResult').hidden = true;
  $('#wizardNext').textContent = 'Devam';
  renderWizardStep();
}

function renderWizardStep() {
  $$('[data-wizard-step]').forEach(step => {
    step.hidden = Number(step.dataset.wizardStep) !== state.wizardStep || state.wizardComplete;
  });
  $$('.wizard-progress span').forEach((dot, index) => dot.classList.toggle('is-active', index <= state.wizardStep));
  $('#wizardBack').hidden = state.wizardStep === 0 || state.wizardComplete;
}

function selectedWizardValue(name) {
  return $(`input[name="${name}"]:checked`, $('#wizardForm'))?.value || '';
}

function makeWizardRecommendation() {
  const goal = selectedWizardValue('goal');
  const budget = selectedWizardValue('budget');
  const privacy = selectedWizardValue('privacy');
  const target = goal === 'build' ? 'ideas' : goal === 'work' ? 'apps' : 'basics';
  const parts = [];
  if (goal === 'learn') parts.push('Dört temel kavramla başla ve bir ücretsiz uygulamada kişisel olmayan örnekler dene.');
  if (goal === 'work') parts.push('İş türüne göre araçları filtrele; aynı görevi iki uygulamada karşılaştır.');
  if (goal === 'build') parts.push('Bir problem fikri seç, PUSULA ile küçük prototipe ve üç kullanıcıya ilerle.');
  if (budget === 'free') parts.push('Ücretsiz seçeneği ve açık modelleri öne çıkar; kota tarihini kontrol et.');
  if (budget === 'small') parts.push('Önce küçük model veya hızlı modelle maliyet sınırı koy.');
  if (budget === 'quality') parts.push('Zor görevde güçlü modeli kullan; basit işleri ekonomik modele yönlendir.');
  if (privacy === 'business') parts.push('Şirket verisi için onaylı hesap, erişim kontrolü ve saklama politikasını kullan.');
  if (privacy === 'sensitive') parts.push('Yerel/açık model veya kurumsal veri sınırı değerlendir; agent yetkilerini kapalı başlat.');
  return { goal, budget, privacy, target, text: parts.join(' ') };
}

function applyWizardRecommendation(recommendation) {
  if (recommendation.budget === 'free') {
    state.appFreeOnly = true;
    $('#appFreeOnly').checked = true;
    state.modelView = recommendation.privacy === 'sensitive' ? 'local' : 'free';
    renderApps();
    renderModels();
  } else if (recommendation.privacy === 'sensitive') {
    state.modelView = 'local';
    renderModels();
  }
  closeDialog($('#wizardDialog'));
  document.getElementById(recommendation.target)?.scrollIntoView({ behavior: 'smooth' });
  showToast('Kişisel rotan hazır. Bölümler arasında istediğin zaman geçebilirsin.');
}

function filteredApps() {
  const query = normalise(state.appSearch);
  return state.apps.filter(app => {
    const categoryMatch = state.appCategory === 'all' || app.categories.includes(state.appCategory);
    const freeMatch = !state.appFreeOnly || app.free;
    const haystack = normalise([app.name, app.company, app.summary, app.bestFor, ...app.tags].join(' '));
    return categoryMatch && freeMatch && (!query || haystack.includes(query));
  });
}

function appCard(app) {
  return `<article class="app-card">
    <div class="card-top">
      <div class="brand-lockup">${logoMarkup(app)}<div><h3>${escapeHtml(app.name)}</h3><small>${escapeHtml(app.company)}</small></div></div>
      <span class="status-badge ${app.free ? 'free' : 'paid'}">${escapeHtml(app.freeLabel)}</span>
    </div>
    <p>${escapeHtml(app.summary)}</p>
    <div class="tag-list">${app.tags.slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
    <div class="card-facts">
      <div class="card-fact"><b>EN İYİ</b><span>${escapeHtml(app.bestFor)}</span></div>
      <div class="card-fact"><b>DİKKAT</b><span>${escapeHtml(app.limit)}</span></div>
    </div>
    <div class="card-actions"><button type="button" data-app-detail="${escapeHtml(app.id)}">Detayları aç</button><a href="${escapeHtml(app.official)}" target="_blank" rel="noreferrer">Resmî uygulama ↗</a></div>
  </article>`;
}

function renderApps() {
  if (!state.apps.length) return;
  const apps = filteredApps();
  const visible = apps.slice(0, state.appLimit);
  const grid = $('#appGrid');
  grid.innerHTML = visible.length ? visible.map(appCard).join('') : '<div class="empty-state"><strong>Bu filtrede araç bulunamadı.</strong><p>Bir kategoriyi kaldır veya arama kelimesini değiştir.</p></div>';
  $('#appResultCount').textContent = `${apps.length} araç`;
  $('#showMoreApps').hidden = apps.length <= state.appLimit;
  wireLogoFallbacks(grid);
}

function openAppDetail(id) {
  const app = state.apps.find(item => item.id === id);
  if (!app) return;
  $('#detailKicker').textContent = `${app.company} / UYGULAMA`;
  $('#detailTitle').textContent = app.name;
  $('#detailContent').innerHTML = `
    <p class="child-copy">${escapeHtml(app.summary)}</p>
    <div class="detail-grid">
      <div class="detail-block"><h3>KİM İÇİN?</h3><p>${escapeHtml(app.bestFor)}</p></div>
      <div class="detail-block"><h3>ÜCRETSİZ DURUMU</h3><p>${escapeHtml(app.freeLabel)}</p></div>
      <div class="detail-block"><h3>GÜÇLÜ ALANLAR</h3><p>${app.tags.map(escapeHtml).join(' · ')}</p></div>
      <div class="detail-block"><h3>ÖNEMLİ SINIR</h3><p>${escapeHtml(app.limit)}</p></div>
    </div>
    <div class="detail-source"><b>Son kontrol:</b> ${escapeHtml(app.verified)} · <a href="${escapeHtml(app.source)}" target="_blank" rel="noreferrer">Resmî kaynağı aç ↗</a></div>`;
  openDialog($('#detailDialog'));
}

function filteredModels() {
  return state.models.filter(model => {
    if (state.modelView === 'cloud') return model.access.includes('cloud') || model.access.includes('api');
    if (state.modelView === 'local') return model.local;
    if (state.modelView === 'free') return model.free;
    return true;
  });
}

function fitRow(label, value) {
  const score = Math.max(0, Math.min(5, Number(value) || 0));
  return `<div class="fit-row"><span>${escapeHtml(label)}</span><div class="fit-track" aria-label="5 üzerinden ${score}"><i class="fit-score-${score}"></i></div></div>`;
}

function modelCard(model) {
  const selected = state.comparedModels.has(model.id);
  return `<article class="model-card ${selected ? 'is-selected' : ''}">
    <div class="card-top">
      <div class="brand-lockup">${logoMarkup(model)}<div><h3>${escapeHtml(model.name)}</h3><small>${escapeHtml(model.company)}</small></div></div>
      <span class="status-badge ${model.free ? 'free' : 'paid'}">${escapeHtml(model.freeLabel)}</span>
    </div>
    <p>${escapeHtml(model.summary)}</p>
    <div class="model-meta"><span>${model.local ? 'Yerel çalışabilir' : 'Bulut modeli'}</span><span>${escapeHtml(model.license)}</span></div>
    <div class="fit-bars">${fitRow('Başlangıç', model.scores.ease)}${fitRow('Kod', model.scores.coding)}${fitRow('Araştırma', model.scores.research)}${fitRow('Agent', model.scores.agents)}</div>
    <div class="card-facts"><div class="card-fact"><b>UYGUN</b><span>${escapeHtml(model.bestFor)}</span></div><div class="card-fact"><b>DİKKAT</b><span>${escapeHtml(model.caveat)}</span></div></div>
    <button class="compare-button" type="button" data-model-compare="${escapeHtml(model.id)}" aria-pressed="${selected}">${selected ? 'Karşılaştırmadan çıkar' : 'Karşılaştırmaya ekle'}</button>
  </article>`;
}

function ensureModelMoreButton() {
  let button = $('#showMoreModels');
  if (button) return button;
  button = document.createElement('button');
  button.id = 'showMoreModels';
  button.type = 'button';
  button.className = 'text-button';
  button.textContent = 'Daha fazla model göster';
  button.addEventListener('click', () => {
    state.modelLimit += 6;
    renderModels();
  });
  $('#modelGrid').insertAdjacentElement('afterend', button);
  return button;
}

function renderModels() {
  if (!state.models.length) return;
  $$('[data-model-view]').forEach(button => button.classList.toggle('is-active', button.dataset.modelView === state.modelView));
  const models = filteredModels();
  const visible = models.slice(0, state.modelLimit);
  const grid = $('#modelGrid');
  grid.innerHTML = visible.length ? visible.map(modelCard).join('') : '<div class="empty-state"><strong>Bu görünümde model bulunamadı.</strong></div>';
  wireLogoFallbacks(grid);
  const more = ensureModelMoreButton();
  more.hidden = models.length <= state.modelLimit;
  updateCompareTray();
}

function toggleModelComparison(id) {
  if (state.comparedModels.has(id)) state.comparedModels.delete(id);
  else if (state.comparedModels.size < 3) state.comparedModels.add(id);
  else {
    showToast('En fazla 3 modeli yan yana karşılaştırabilirsin.');
    return;
  }
  renderModels();
}

function updateCompareTray() {
  const tray = $('#compareTray');
  const count = state.comparedModels.size;
  tray.hidden = count === 0;
  $('#compareCount').textContent = `${count} model seçildi`;
}

function comparisonRow(label, models, render) {
  return `<tr><th>${escapeHtml(label)}</th>${models.map(model => `<td>${render(model)}</td>`).join('')}</tr>`;
}

function openModelComparison() {
  const models = [...state.comparedModels].map(id => state.models.find(model => model.id === id)).filter(Boolean);
  if (models.length < 2) {
    showToast('Karşılaştırmak için en az 2 model seç.');
    return;
  }
  const rows = [
    comparisonRow('Şirket', models, model => escapeHtml(model.company)),
    comparisonRow('Erişim', models, model => model.access.map(value => escapeHtml(value)).join(' · ')),
    comparisonRow('Ücretsiz başlangıç', models, model => escapeHtml(model.freeLabel)),
    comparisonRow('Yerel çalışma', models, model => model.local ? 'Evet' : 'Hayır'),
    comparisonRow('Lisans', models, model => escapeHtml(model.license)),
    comparisonRow('En uygun kullanım', models, model => escapeHtml(model.bestFor)),
    comparisonRow('Başlangıç kolaylığı', models, model => scoreDots(model.scores.ease)),
    comparisonRow('Kodlama', models, model => scoreDots(model.scores.coding)),
    comparisonRow('Araştırma', models, model => scoreDots(model.scores.research)),
    comparisonRow('Türkçe', models, model => scoreDots(model.scores.turkish)),
    comparisonRow('Agent işleri', models, model => scoreDots(model.scores.agents)),
    comparisonRow('Yerel kullanım', models, model => scoreDots(model.scores.local)),
    comparisonRow('Önemli sınır', models, model => escapeHtml(model.caveat)),
    comparisonRow('Kaynak', models, model => `<a href="${escapeHtml(model.source)}" target="_blank" rel="noreferrer">Resmî kaynak ↗</a>`)
  ].join('');
  $('#comparisonTable').innerHTML = `<table class="comparison-table"><thead><tr><th>Ölçüt</th>${models.map(model => `<th>${escapeHtml(model.name)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><p class="source-note">Bu puanlar benchmark değildir; kullanım yönlendirmesidir. Nihai seçim için kendi verinle küçük bir test yap.</p>`;
  openDialog($('#compareDialog'));
}

function filteredIdeas() {
  return state.ideas.filter(idea => {
    const categoryMatch = state.ideaCategory === 'all' || idea.category === state.ideaCategory;
    const difficultyMatch = state.ideaDifficulty === 'all' || idea.difficulty === state.ideaDifficulty;
    return categoryMatch && difficultyMatch;
  });
}

function ideaCard(idea, index) {
  const playbook = getPlaybook(idea.id);
  const progress = playbook ? journeyPercentForIdea(idea, playbook) : 0;
  const passport = playbook?.passport;
  return `<article class="idea-card">
    <div class="card-top"><span class="idea-number">${String(index + 1).padStart(2, '0')}</span><span class="difficulty ${escapeHtml(idea.difficulty)}">${escapeHtml(difficultyLabels[idea.difficulty])}</span></div>
    <h3>${escapeHtml(idea.title)}</h3>
    <p>${escapeHtml(idea.summary)}</p>
    ${passport ? `<div class="idea-passport-mini"><span>${escapeHtml(passport.mvpTime)}</span><span>${escapeHtml(passport.salesDifficulty)} satış</span><span>${escapeHtml(passport.dataSensitivity)} veri</span></div>` : ''}
    <div class="tag-list"><span>${escapeHtml(categoryLabels[idea.category])}</span>${idea.tools.slice(0, 3).map(tool => `<span>${escapeHtml(tool)}</span>`).join('')}</div>
    ${progress ? `<div class="idea-plan-progress"><span>Plan ilerlemesi</span><b>%${progress}</b><i style="--value:${progress}"></i></div>` : ''}
    <div class="card-actions"><button type="button" data-idea-detail="${escapeHtml(idea.id)}">Fikri aç</button><button type="button" data-journey-open="${escapeHtml(idea.id)}">Kurma planını aç →</button></div>
  </article>`;
}

function renderIdeas() {
  if (!state.ideas.length) return;
  const ideas = filteredIdeas();
  const visible = ideas.slice(0, state.ideaLimit);
  const grid = $('#ideaGrid');
  grid.innerHTML = visible.length ? visible.map(ideaCard).join('') : '<div class="empty-state"><strong>Bu filtrede fikir bulunamadı.</strong><p>Kategoriyi veya zorluk seviyesini değiştir.</p></div>';
  $('#showMoreIdeas').hidden = ideas.length <= state.ideaLimit;
}

function ideaDetailRows(idea) {
  const rows = [
    ['Problem', idea.problem],
    ['Kullanıcı', idea.user],
    ['Girdi', idea.input],
    ['AI ne yapar?', idea.aiAction],
    ['Çıktı', idea.output],
    ['İlk prototip', idea.starter],
    ['Ücretsiz denenir mi?', idea.freePrototype],
    ['En önemli risk', idea.risk],
    ['Başarı ölçüsü', idea.metric]
  ];
  return rows.map(([label, value]) => `<div class="idea-detail-row"><b>${escapeHtml(label)}</b><span>${escapeHtml(value)}</span></div>`).join('');
}

function openIdeaDetail(id) {
  const idea = state.ideas.find(item => item.id === id);
  const playbook = getPlaybook(id);
  if (!idea) return;
  $('#ideaTitle').textContent = idea.title;
  const passport = playbook?.passport;
  const passportMarkup = passport ? `<div class="product-passport-grid">
    <div><b>HEDEF ALICI</b><span>${escapeHtml(passport.buyer)}</span></div>
    <div><b>MVP SÜRESİ</b><span>${escapeHtml(passport.mvpTime)}</span></div>
    <div><b>TEKNİK ZORLUK</b><span>${escapeHtml(passport.techDifficulty)}</span></div>
    <div><b>SATIŞ ZORLUĞU</b><span>${escapeHtml(passport.salesDifficulty)}</span></div>
    <div><b>VERİ HASSASİYETİ</b><span>${escapeHtml(passport.dataSensitivity)}</span></div>
    <div><b>İLK KANAL</b><span>${escapeHtml(passport.firstChannel)}</span></div>
  </div><blockquote class="product-promise">${escapeHtml(passport.promise)}</blockquote>` : '';
  $('#ideaContent').innerHTML = `<p class="child-copy">${escapeHtml(idea.summary)}</p>${passportMarkup}<div class="idea-detail-list">${ideaDetailRows(idea)}</div><div class="dialog-actions product-dialog-actions"><span class="difficulty ${escapeHtml(idea.difficulty)}">${escapeHtml(difficultyLabels[idea.difficulty])}</span><div><button class="text-button" type="button" data-idea-build="${escapeHtml(idea.id)}">PUSULA özeti</button><button class="dark-button" type="button" data-journey-open="${escapeHtml(idea.id)}">Detaylı kurma planı →</button></div></div>`;
  openDialog($('#ideaDialog'));
}

function selectIdeaForMethod(id) {
  const idea = state.ideas.find(item => item.id === id);
  if (!idea) return;
  state.selectedIdea = idea;
  state.methodStep = 0;
  $('#methodContext').textContent = `Seçilen fikir: ${idea.title}. Aşağıdaki örnekler bu fikre göre değişti.`;
  renderMethodSteps();
  renderMethodPanel();
  closeDialog($('#ideaDialog'));
  $('#method').scrollIntoView({ behavior: 'smooth' });
  showToast('Fikir PUSULA çalışma alanına aktarıldı.');
}


function getPlaybook(id) {
  return state.playbookCatalog?.items?.find(item => item.id === id) || null;
}

function journeyStore() {
  return readJson(STORAGE.journeys, {});
}

function defaultJourneyPlan(playbook) {
  return {
    route: playbook?.recommendedRoute || 'service',
    duration: 'two-weeks',
    budget: 'free',
    stage: 0,
    completed: {}
  };
}

function loadJourneyPlan(id, playbook) {
  const saved = journeyStore()[id] || {};
  return {
    ...defaultJourneyPlan(playbook),
    ...saved,
    completed: saved.completed && typeof saved.completed === 'object' ? saved.completed : {}
  };
}

function saveJourneyPlan() {
  if (!state.selectedIdea || !state.journeyPlan) return;
  const store = journeyStore();
  store[state.selectedIdea.id] = state.journeyPlan;
  writeJson(STORAGE.journeys, store);
}

function task(id, text, priority = 'essential') {
  return { id, text, priority };
}

function tasksFromList(prefix, values = [], priorities = ['essential', 'standard', 'extended']) {
  return values.map((value, index) => task(`${prefix}-${index + 1}`, value, priorities[Math.min(index, priorities.length - 1)]));
}

function buildJourneyStages(idea, playbook, plan) {
  if (!idea || !playbook || !state.playbookCatalog) return [];
  const catalog = state.playbookCatalog;
  const profile = catalog.profiles[playbook.profile];
  const route = catalog.routes[plan.route] || catalog.routes[playbook.recommendedRoute] || catalog.routes.service;
  const budget = catalog.budgets[plan.budget] || catalog.budgets.free;
  const duration = catalog.durations[plan.duration] || catalog.durations['two-weeks'];
  const allowed = new Set(duration.priorities);
  const stack = playbook.stack[budget.stackKey] || playbook.stack.free || [];
  const stage = (id, objective, doneWhen, tasks, cards) => {
    const meta = journeyStageLabels.find(item => item.id === id);
    return { ...meta, objective, doneWhen, tasks: tasks.filter(item => allowed.has(item.priority)), cards };
  };

  return [
    stage('validate',
      'Gerçek problem, gerçek kullanıcı ve pilot isteği bul.',
      'En az 5 görüşme yapıldı, üç kişi aynı problemi doğruladı ve en az bir kişi pilotu kabul etti.',
      [
        task('validate-targets', `Görüşme listesini hazırla: ${playbook.validationTargets.join(' · ')}`),
        task('validate-interviews', 'En az 5 problem görüşmesi yap; ürün sunumu yapma.'),
        task('validate-current-way', 'Kullanıcının bugün bu işi nasıl yaptığını ekranda veya gerçek örnekle izle.'),
        task('validate-go-stop', 'Go ve stop sinyallerini görüşme notlarıyla karşılaştır.', 'standard'),
        task('validate-pilot', `En az bir pilot sözü al: ${playbook.pilot}`),
        ...tasksFromList('validate-question', profile.validationQuestions, ['standard', 'standard', 'standard', 'extended', 'extended'])
      ],
      [
        { title: 'Görüşülecek kişiler', list: playbook.validationTargets },
        { title: 'Sorulacak sorular', list: profile.validationQuestions },
        { title: 'Devam et sinyalleri', list: playbook.goSignals },
        { title: 'Dur veya daralt sinyalleri', list: playbook.stopSignals, tone: 'danger' }
      ]),
    stage('offer',
      'Bir cümlelik ürün vaadini, başlangıç rotasını ve ilk fiyat hipotezini yaz.',
      'Kullanıcı kim, hangi sonucu alıyor, pilotun kapsamı ve bedeli ne soruları tek sayfada cevaplanıyor.',
      [
        task('offer-promise', `Ürün vaadini yaz ve sadeleştir: ${playbook.passport.promise}`),
        task('offer-route', `${route.label} rotasını neden seçtiğini bir cümleyle yaz.`),
        task('offer-pilot', `İlk pilot kapsamını yaz: ${playbook.pilot}`),
        task('offer-pricing', `Üç fiyat hipotezinden birini test için seç: ${playbook.pricing.join(' · ')}`, 'standard'),
        task('offer-boundaries', 'Pilotun yapacaklarını ve özellikle yapmayacaklarını açıkça yaz.'),
        task('offer-one-page', 'Tek sayfalık pilot teklifi hazırla: problem, sonuç, kapsam, süre, güvenlik ve sonraki karar.', 'extended')
      ],
      [
        { title: 'Tek cümlelik vaat', quote: playbook.passport.promise },
        { title: 'Seçilen rota', body: `${route.label}: ${route.summary}` },
        { title: 'Gelir seçenekleri', list: playbook.passport.revenue },
        { title: 'Fiyat hipotezleri', list: playbook.pricing }
      ]),
    stage('build',
      'Tek kullanıcı için tek ana işi baştan sona tamamlayan en küçük ürünü kur.',
      'Kullanıcı ana girdiyi verir, sonucu alır ve insan kontrolüyle işlemi tamamlar.',
      [
        task('build-stack', `Seçilen bütçeyle başlangıç stack’ini kur: ${stack.join(' · ')}`),
        ...tasksFromList('build-must', playbook.mvp.must, ['essential', 'essential', 'essential', 'standard', 'standard']),
        ...tasksFromList('build-route', route.buildTasks, ['standard', 'standard', 'extended']),
        task('build-out-of-scope', `Şimdilik yapılmayacakları backlog'a yaz: ${playbook.mvp.avoid.join(' · ')}`, 'standard')
      ],
      [
        { title: 'İlk sürümde olmalı', list: playbook.mvp.must },
        { title: 'Daha sonra', list: playbook.mvp.later },
        { title: 'Şimdilik yapma', list: playbook.mvp.avoid, tone: 'danger' },
        { title: `${budget.label} stack`, list: stack },
        { title: 'Kapsam sınırı', body: duration.scope }
      ]),
    stage('test',
      'Ürünü normal, zor, eksik ve kötü niyetli girdilerle dene.',
      'Kritik testler kaydedildi, hatalar güvenli davranıyor ve insan onayı gereken noktalar teknik olarak kapalı.',
      [
        task('test-risk', `En önemli risk için koruma ekle: ${idea.risk}`),
        ...tasksFromList('test-case', playbook.tests, ['essential', 'essential', 'essential', 'standard', 'standard', 'standard', 'extended', 'extended']),
        task('test-cost', 'Maliyet ve istek sınırı testi yap; tek kullanıcı sınırsız tüketim oluşturamasın.', 'standard'),
        task('test-rollback', 'Hatalı sürümü geri alma veya özelliği kapatma yolunu dene.', 'extended')
      ],
      [
        { title: 'Ürüne özel testler', list: playbook.tests },
        { title: 'Kırmızı çizgi', quote: idea.risk, tone: 'danger' },
        { title: 'Test sonucu', body: 'Her test için beklenen sonuç, gerçek sonuç, karar ve sorumlu alanlarını kaydet.' }
      ]),
    stage('launch',
      'Geri alınabilir, ölçülebilir ve dar kapsamlı bir pilotu gerçek kullanıcıya aç.',
      'Pilot kullanıcı ürüne erişiyor, ana görevi tamamlıyor, destek ve geri alma yolu çalışıyor.',
      [
        task('launch-mode', `Yayın seviyesini hazırla: ${playbook.launch.mode}`),
        ...tasksFromList('launch-profile', profile.launchBase, ['essential', 'essential', 'standard', 'standard']),
        ...tasksFromList('launch-extra', playbook.launch.extras, ['essential', 'standard', 'standard']),
        ...tasksFromList('launch-route', route.launchTasks, ['standard', 'extended']),
        task('launch-support', 'İletişim, hata mesajı, gizlilik ve basit kullanım rehberini yayınla.'),
        task('launch-monitor', 'İlk hafta kullanım, hata, maliyet ve güvenlik alarmını izle.', 'standard')
      ],
      [
        { title: 'Önerilen yayın biçimi', quote: playbook.launch.mode },
        { title: 'Canlıya alma kontrolleri', list: [...profile.launchBase, ...playbook.launch.extras] },
        { title: 'Rota notu', body: route.launchTasks.join(' ') }
      ]),
    stage('acquire',
      'İlk 10 müşteriye giden dar hedef listeyi ve temas düzenini kur.',
      'Hedef liste hazır, problem görüşmeleri başladı ve üç pilot adayı oluştu.',
      [
        task('acquire-list', `İlk hedef listeyi oluştur. Başlangıç kanalı: ${playbook.passport.firstChannel}`),
        task('acquire-ten', 'İlk 10 kişiye satış mesajı değil problem görüşmesi isteği gönder.'),
        task('acquire-demo', 'Beş kişiye gerçekçi örnekle kısa demo göster.'),
        task('acquire-pilots', 'Üç uygun kişiye sınırlı pilot teklif et.'),
        ...tasksFromList('acquire-channel', playbook.channels, ['standard', 'standard', 'extended']),
        ...tasksFromList('acquire-first-ten', profile.firstTenBase, ['standard', 'standard', 'standard', 'standard', 'extended', 'extended', 'extended', 'extended', 'extended', 'extended'])
      ],
      [
        { title: 'İlk müşteri kanalları', list: playbook.channels },
        { title: 'İlk 10 müşteri planı', list: profile.firstTenBase },
        { title: 'Pilot tanımı', quote: playbook.pilot }
      ]),
    stage('market',
      'Tek bir ana mesaj, bir ücretsiz değer ve dört haftalık içerik düzeni oluştur.',
      'Hedef kitle için üç ana kanal seçildi, ilk içerik ve ücretsiz değer yayınlandı.',
      [
        task('market-message', `Ana mesajı kullanıcının diliyle yaz: ${playbook.marketing.message}`),
        task('market-lead', `Ücretsiz değer üret: ${playbook.marketing.leadMagnet}`),
        task('market-proof', 'Ürünün nasıl çalıştığını gösteren kısa demo veya önce/sonra örneği hazırla.'),
        ...tasksFromList('market-content', playbook.marketing.contentIdeas, ['essential', 'standard', 'standard', 'extended']),
        task('market-calendar', 'Dört haftalık düzen kur: problem → demo → vaka → pilot çağrısı.', 'standard'),
        task('market-channel-focus', `En fazla üç kanalda kal: ${playbook.channels.join(' · ')}`, 'standard')
      ],
      [
        { title: 'Ana pazarlama mesajı', quote: playbook.marketing.message },
        { title: 'Ücretsiz değer', body: playbook.marketing.leadMagnet },
        { title: 'İçerik başlıkları', list: playbook.marketing.contentIdeas },
        { title: '4 haftalık ritim', list: ['1. hafta: problemi anlat', '2. hafta: ürünün nasıl çalıştığını göster', '3. hafta: gerçek kullanım veya vaka paylaş', '4. hafta: demo/pilot çağrısı yap'] }
      ]),
    stage('sell',
      'Keşif görüşmesi, demo, pilot ve teklif adımlarını tekrar edilebilir hale getir.',
      'İlk satış mesajı, demo akışı, fiyat hipotezi ve itiraz cevapları hazır.',
      [
        task('sell-opening', `İlk mesajı kişiselleştir ve gönder: ${playbook.sales.opening}`),
        task('sell-discovery', `Keşif görüşmesinde şu soruları kullan: ${profile.discoveryQuestions.join(' · ')}`),
        task('sell-demo', `5–10 dakikalık demo akışını prova et: ${playbook.sales.demo.join(' → ')}`),
        task('sell-pilot', `Pilot teklifini rota ile eşleştir: ${route.offer}`),
        task('sell-price', `Bir fiyat hipotezi seç ve üç görüşmede test et: ${playbook.pricing.join(' · ')}`, 'standard'),
        ...tasksFromList('sell-route', route.salesTasks, ['standard', 'extended']),
        task('sell-objections', 'En sık iki itiraza kısa ve dürüst cevap hazırla.', 'standard')
      ],
      [
        { title: 'İlk mesaj', quote: playbook.sales.opening },
        { title: 'Keşif soruları', list: profile.discoveryQuestions },
        { title: 'Demo akışı', list: playbook.sales.demo },
        { title: 'İtirazlar', objections: playbook.sales.objections },
        { title: 'Fiyat seçenekleri', list: playbook.pricing }
      ]),
    stage('retain',
      'Müşteriyi ilk değere hızlı ulaştır, düzenli takip et ve gerçek kullanım metriklerini izle.',
      'İlk değer anı ölçülüyor; 1, 3, 7 ve 30. gün takibi ile devam/bırakma nedenleri biliniyor.',
      [
        task('retain-activation', `İlk değer anını ölç: ${playbook.activation}`),
        task('retain-day1', `1. gün: ${profile.followUp.day1}`),
        task('retain-day3', `3. gün: ${profile.followUp.day3}`, 'standard'),
        task('retain-day7', `7. gün: ${profile.followUp.day7}`),
        task('retain-day30', `30. gün: ${profile.followUp.day30}`, 'extended'),
        task('retain-metrics', `En fazla beş temel metriği takip et: ${playbook.metrics.join(' · ')}`),
        task('retain-reference', 'Değer gören müşteriden izinli vaka, referans veya tanıştırma iste.', 'standard'),
        task('retain-roadmap', 'Özellik isteğini kullanım kanıtı, gelir etkisi ve risk ile önceliklendir.', 'extended')
      ],
      [
        { title: 'Aktivasyon anı', quote: playbook.activation },
        { title: 'Takip düzeni', list: [`1. gün — ${profile.followUp.day1}`, `3. gün — ${profile.followUp.day3}`, `7. gün — ${profile.followUp.day7}`, `30. gün — ${profile.followUp.day30}`] },
        { title: 'Temel metrikler', list: playbook.metrics }
      ])
  ];
}

function journeyPercent(stages, completed = {}) {
  const tasks = stages.flatMap(stage => stage.tasks);
  if (!tasks.length) return 0;
  const done = tasks.filter(item => completed[item.id]).length;
  return Math.round((done / tasks.length) * 100);
}

function journeyPercentForIdea(idea, playbook) {
  if (!state.playbookCatalog) return 0;
  const plan = loadJourneyPlan(idea.id, playbook);
  return journeyPercent(buildJourneyStages(idea, playbook, plan), plan.completed);
}

function journeyCardMarkup(card) {
  const className = `journey-note${card.tone === 'danger' ? ' is-danger' : ''}`;
  const list = card.list?.length ? `<ul>${card.list.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
  const objections = card.objections?.length ? `<div class="journey-objections">${card.objections.map(item => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</div>` : '';
  const quote = card.quote ? `<blockquote>${escapeHtml(card.quote)}</blockquote>` : '';
  const body = card.body ? `<p>${escapeHtml(card.body)}</p>` : '';
  return `<article class="${className}"><h4>${escapeHtml(card.title)}</h4>${quote}${body}${list}${objections}</article>`;
}

function renderJourneySettings() {
  const catalog = state.playbookCatalog;
  const plan = state.journeyPlan;
  const playbook = state.selectedPlaybook;
  const options = (items, current, recommended = '') => Object.entries(items).map(([key, item]) => `<option value="${escapeHtml(key)}" ${key === current ? 'selected' : ''}>${escapeHtml(item.label)}${key === recommended ? ' · önerilen' : ''}</option>`).join('');
  $('#journeySettings').innerHTML = `
    <label>Başlangıç rotası<select data-journey-setting="route">${options(catalog.routes, plan.route, playbook.recommendedRoute)}</select></label>
    <label>Süre<select data-journey-setting="duration">${options(catalog.durations, plan.duration)}</select></label>
    <label>Bütçe<select data-journey-setting="budget">${options(catalog.budgets, plan.budget)}</select></label>`;
}

function renderJourneyPassport() {
  const playbook = state.selectedPlaybook;
  const passport = playbook.passport;
  $('#journeyRailTitle').textContent = state.selectedIdea.title;
  $('#journeyPassport').innerHTML = `
    <p>${escapeHtml(passport.promise)}</p>
    <div><span>${escapeHtml(passport.mvpTime)}</span><span>${escapeHtml(passport.techDifficulty)} teknik</span><span>${escapeHtml(passport.salesDifficulty)} satış</span></div>`;
}

function renderJourneyStageNav(stages) {
  const completed = state.journeyPlan.completed;
  $('#journeyStageNav').innerHTML = stages.map((stage, index) => {
    const done = stage.tasks.filter(item => completed[item.id]).length;
    const total = stage.tasks.length;
    return `<button type="button" data-journey-stage="${index}" aria-current="${index === state.journeyPlan.stage ? 'step' : 'false'}"><span>${escapeHtml(stage.number)}</span><b>${escapeHtml(stage.title)}</b><small>${done}/${total}</small></button>`;
  }).join('');
}

function renderJourneyProgress(stages) {
  const tasks = stages.flatMap(stage => stage.tasks);
  const done = tasks.filter(item => state.journeyPlan.completed[item.id]).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const ring = $('#journeyProgressRing');
  ring.style.setProperty('--progress', String(percent));
  $('#journeyProgressPercent').textContent = `${percent}%`;
  $('#journeyProgressText').textContent = `${done} / ${tasks.length} görev`;
  const next = tasks.find(item => !state.journeyPlan.completed[item.id]);
  $('#journeyTodayTask').textContent = next ? next.text : 'Plan tamamlandı. Şimdi sonuçları ölç, müşterilerle konuş ve bir sonraki öğrenme döngüsünü başlat.';
}

function renderJourneyStageContent(stages) {
  const index = Math.min(Math.max(Number(state.journeyPlan.stage) || 0, 0), stages.length - 1);
  state.journeyPlan.stage = index;
  const stage = stages[index];
  $('#journeyPhase').textContent = `${stage.phase} · ${stage.number}`;
  $('#journeyTitle').textContent = stage.title;
  const done = stage.tasks.filter(item => state.journeyPlan.completed[item.id]).length;
  $('#journeyStageContent').innerHTML = `
    <header class="journey-stage-intro"><p>${escapeHtml(stage.summary)}</p><div><span>AŞAMA</span><b>${done}/${stage.tasks.length}</b></div></header>
    <div class="journey-objective"><div><b>AMAÇ</b><p>${escapeHtml(stage.objective)}</p></div><div><b>BİTTİ SAYILIR</b><p>${escapeHtml(stage.doneWhen)}</p></div></div>
    <div class="journey-task-list">
      <div class="journey-subhead"><h3>Yapılacaklar</h3><span>Görevleri tamamladıkça soldaki yüzde güncellenir.</span></div>
      ${stage.tasks.map(item => `<label><input type="checkbox" data-journey-task="${escapeHtml(item.id)}" ${state.journeyPlan.completed[item.id] ? 'checked' : ''}><span><b>${escapeHtml(item.text)}</b><small>${item.priority === 'essential' ? 'Temel görev' : item.priority === 'standard' ? 'MVP görevi' : '30 günlük genişletme'}</small></span></label>`).join('')}
    </div>
    <div class="journey-notes">${stage.cards.map(journeyCardMarkup).join('')}</div>
    <div class="journey-stage-actions"><button class="text-button" type="button" data-journey-nav="prev" ${index === 0 ? 'disabled' : ''}>← Önceki aşama</button><button class="dark-button" type="button" data-journey-nav="next">${index === stages.length - 1 ? 'İlk aşamaya dön' : 'Sonraki aşama →'}</button></div>`;
}

function renderProductJourney() {
  if (!state.selectedIdea || !state.selectedPlaybook || !state.journeyPlan) return;
  const stages = buildJourneyStages(state.selectedIdea, state.selectedPlaybook, state.journeyPlan);
  renderJourneyPassport();
  renderJourneySettings();
  renderJourneyStageNav(stages);
  renderJourneyProgress(stages);
  renderJourneyStageContent(stages);
}

function openProductJourney(id) {
  const idea = state.ideas.find(item => item.id === id);
  const playbook = getPlaybook(id);
  if (!idea || !playbook) {
    showToast('Bu fikir için ürün planı bulunamadı.');
    return;
  }
  state.selectedIdea = idea;
  state.selectedPlaybook = playbook;
  state.journeyPlan = loadJourneyPlan(id, playbook);
  renderProductJourney();
  closeDialog($('#ideaDialog'));
  openDialog($('#journeyDialog'));
}

function updateJourneySetting(key, value) {
  if (!state.journeyPlan || !['route', 'duration', 'budget'].includes(key)) return;
  state.journeyPlan[key] = value;
  saveJourneyPlan();
  renderProductJourney();
}

function toggleJourneyTask(id, checked) {
  if (!state.journeyPlan) return;
  if (checked) state.journeyPlan.completed[id] = true;
  else delete state.journeyPlan.completed[id];
  saveJourneyPlan();
  const stages = buildJourneyStages(state.selectedIdea, state.selectedPlaybook, state.journeyPlan);
  renderJourneyStageNav(stages);
  renderJourneyProgress(stages);
  const current = stages[state.journeyPlan.stage];
  const done = current.tasks.filter(item => state.journeyPlan.completed[item.id]).length;
  const counter = $('.journey-stage-intro div b');
  if (counter) counter.textContent = `${done}/${current.tasks.length}`;
  renderIdeas();
}

function journeyMarkdown() {
  const idea = state.selectedIdea;
  const playbook = state.selectedPlaybook;
  const plan = state.journeyPlan;
  const stages = buildJourneyStages(idea, playbook, plan);
  const catalog = state.playbookCatalog;
  const route = catalog.routes[plan.route];
  const duration = catalog.durations[plan.duration];
  const budget = catalog.budgets[plan.budget];
  const lines = [
    `# ${idea.title} — Ürün Yol Haritası`,
    '',
    `> ${playbook.passport.promise}`,
    '',
    `- Rota: ${route.label}`,
    `- Süre: ${duration.label}`,
    `- Bütçe: ${budget.label}`,
    `- Hedef alıcı: ${playbook.passport.buyer}`,
    `- Pilot: ${playbook.pilot}`,
    ''
  ];
  stages.forEach(stage => {
    lines.push(`## ${stage.number}. ${stage.title} — ${stage.phase}`, '', stage.objective, '');
    stage.tasks.forEach(item => lines.push(`- [${plan.completed[item.id] ? 'x' : ' '}] ${item.text}`));
    lines.push('', `**Bitti sayılır:** ${stage.doneWhen}`, '');
  });
  lines.push('---', 'Gerçek müşteri isimleri ve özel veriler bu plana eklenmemelidir.');
  return lines.join('\n');
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

async function copyJourneyPlan() {
  if (!state.journeyPlan) return;
  try {
    await copyText(journeyMarkdown());
    showToast('Ürün planı Markdown olarak kopyalandı.');
  } catch {
    showToast('Plan kopyalanamadı. Tarayıcı pano iznini kontrol et.');
  }
}

function resetJourneyPlan() {
  if (!state.selectedIdea || !state.selectedPlaybook) return;
  const accepted = window.confirm('Bu ürün için işaretlenen bütün görevler ve seçimler sıfırlansın mı?');
  if (!accepted) return;
  const store = journeyStore();
  delete store[state.selectedIdea.id];
  writeJson(STORAGE.journeys, store);
  state.journeyPlan = defaultJourneyPlan(state.selectedPlaybook);
  renderProductJourney();
  renderIdeas();
  showToast('Ürün planı sıfırlandı.');
}

function renderMethodSteps() {
  $('#methodSteps').innerHTML = methodData.map((step, index) => `<li><button type="button" data-method-step="${index}" aria-current="${index === state.methodStep ? 'step' : 'false'}"><b>${escapeHtml(step.letter)}</b><span>${escapeHtml(step.title)}</span></button></li>`).join('');
}

function renderMethodPanel() {
  const step = methodData[state.methodStep];
  const idea = state.selectedIdea;
  $('#methodPanel').innerHTML = `
    <span class="method-letter" aria-hidden="true">${escapeHtml(step.letter)}</span>
    ${idea ? `<p class="kicker">SEÇİLEN FİKİR · ${escapeHtml(idea.title)}</p>` : '<p class="kicker">GENEL ÖRNEK</p>'}
    <h3>${escapeHtml(step.title)}</h3>
    <p class="child-copy">${escapeHtml(step.child)}</p>
    <div class="method-question"><b>Kendine sor:</b><br>${escapeHtml(step.question)}</div>
    <div class="method-example"><b>Bu fikre uygulanışı:</b><p>${escapeHtml(step.example(idea))}</p></div>
    ${idea ? `<div class="method-full-plan"><b>PUSULA’dan sonra KAZAN:</b><span>Canlıya alma, ilk müşteri, pazarlama, satış ve takip planını aç.</span><button class="dark-button" type="button" data-journey-open="${escapeHtml(idea.id)}">Detaylı ürün yol haritası →</button></div>` : ''}
    <div class="method-nav"><button class="text-button" type="button" data-method-nav="prev" ${state.methodStep === 0 ? 'disabled' : ''}>← Önceki</button><button class="dark-button" type="button" data-method-nav="next">${state.methodStep === methodData.length - 1 ? 'Başa dön' : 'Sonraki adım →'}</button></div>`;
}

function renderPolicy(action) {
  const policy = policyData[action];
  if (!policy) return;
  $$('.security-actions button').forEach(button => button.classList.toggle('is-active', button.dataset.policyAction === action));
  $('#policyScreen').innerHTML = `<span class="policy-status ${escapeHtml(policy.statusClass)}">${escapeHtml(policy.status)}</span><h3>${escapeHtml(policy.title)}</h3><p>${escapeHtml(policy.text)}</p><pre class="policy-code">${escapeHtml(policy.code)}</pre>`;
}

function renderUpdates() {
  const timeline = $('#updateTimeline');
  timeline.innerHTML = state.updates.map(update => {
    const date = new Date(`${update.date}T00:00:00`).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    return `<article class="update-item"><div class="update-date">${escapeHtml(date)}</div><div><h3>${escapeHtml(update.title)}</h3><p>${escapeHtml(update.summary)}</p><div class="tag-list"><span>${escapeHtml(update.impact)}</span></div></div><a href="${escapeHtml(update.source)}" target="_blank" rel="noreferrer">Resmî kaynak ↗</a></article>`;
  }).join('');
}

function initProgress() {
  const saved = readJson(STORAGE.progress, {});
  const boxes = $$('#moduleChecklist input[data-progress]');
  boxes.forEach(box => {
    box.checked = Boolean(saved[box.dataset.progress]);
    box.addEventListener('change', () => {
      const next = Object.fromEntries(boxes.map(item => [item.dataset.progress, item.checked]));
      writeJson(STORAGE.progress, next);
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress() {
  const boxes = $$('#moduleChecklist input[data-progress]');
  const done = boxes.filter(box => box.checked).length;
  $('#headerProgress').textContent = `${done} / ${boxes.length}`;
  $('#headerProgress').setAttribute('aria-label', `${boxes.length} bölümden ${done} tamamlandı`);
}

function renderLoadingError(error) {
  console.error(error);
  ['appGrid', 'modelGrid', 'ideaGrid', 'updateTimeline'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.innerHTML = '<div class="empty-state"><strong>İçerik verisi yüklenemedi.</strong><p>Sayfayı yenile. Sorun sürerse GitHub deploy durumunu kontrol et.</p></div>';
  });
}

function wireEvents() {
  $('#menuButton').addEventListener('click', event => {
    const nav = $('#mobileNav');
    nav.hidden = !nav.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!nav.hidden));
  });
  $$('#mobileNav a').forEach(link => link.addEventListener('click', () => {
    $('#mobileNav').hidden = true;
    $('#menuButton').setAttribute('aria-expanded', 'false');
  }));

  $$('.path-card').forEach(button => button.addEventListener('click', () => setRoute(button.dataset.path)));
  $('#routeResult').addEventListener('click', event => {
    const button = event.target.closest('[data-route-target]');
    if (button) document.getElementById(button.dataset.routeTarget)?.scrollIntoView({ behavior: 'smooth' });
  });

  $('#startWizard').addEventListener('click', () => {
    resetWizard();
    openDialog($('#wizardDialog'));
  });
  $('#wizardNext').addEventListener('click', () => {
    if (state.wizardComplete && state.wizardRecommendation) {
      applyWizardRecommendation(state.wizardRecommendation);
      return;
    }
    const names = ['goal', 'budget', 'privacy'];
    if (!selectedWizardValue(names[state.wizardStep])) {
      showToast('Devam etmek için bir seçenek seç.');
      return;
    }
    if (state.wizardStep < 2) {
      state.wizardStep += 1;
      renderWizardStep();
      return;
    }
    state.wizardRecommendation = makeWizardRecommendation();
    state.wizardComplete = true;
    $$('[data-wizard-step]').forEach(step => { step.hidden = true; });
    const result = $('#wizardResult');
    result.innerHTML = `<strong>Önerilen başlangıç:</strong><p>${escapeHtml(state.wizardRecommendation.text)}</p>`;
    result.hidden = false;
    $('#wizardBack').hidden = true;
    $('#wizardNext').textContent = 'Rotayı aç';
  });
  $('#wizardBack').addEventListener('click', () => {
    state.wizardStep = Math.max(0, state.wizardStep - 1);
    renderWizardStep();
  });

  $('#conceptStage').addEventListener('click', () => {});
  $$('[data-concept]').forEach(button => button.addEventListener('click', () => renderConcept(button.dataset.concept)));

  $('#appSearch').addEventListener('input', event => {
    state.appSearch = event.target.value;
    state.appLimit = 6;
    renderApps();
  });
  $('#appFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.appCategory = button.dataset.category;
    state.appLimit = 6;
    $$('#appFilters .chip').forEach(chip => chip.classList.toggle('is-active', chip === button));
    renderApps();
  });
  $('#appFreeOnly').addEventListener('change', event => {
    state.appFreeOnly = event.target.checked;
    state.appLimit = 6;
    renderApps();
  });
  $('#showMoreApps').addEventListener('click', () => {
    state.appLimit += 6;
    renderApps();
  });
  $('#appGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-app-detail]');
    if (button) openAppDetail(button.dataset.appDetail);
  });

  $$('.model-switcher [data-model-view]').forEach(button => button.addEventListener('click', () => {
    state.modelView = button.dataset.modelView;
    state.modelLimit = 6;
    renderModels();
  }));
  $('#modelGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-model-compare]');
    if (button) toggleModelComparison(button.dataset.modelCompare);
  });
  $('#clearCompare').addEventListener('click', () => {
    state.comparedModels.clear();
    renderModels();
  });
  $('#openCompare').addEventListener('click', openModelComparison);

  $('#ideaFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-idea-category]');
    if (!button) return;
    state.ideaCategory = button.dataset.ideaCategory;
    state.ideaLimit = 6;
    $$('#ideaFilters .chip').forEach(chip => chip.classList.toggle('is-active', chip === button));
    renderIdeas();
  });
  $('#ideaDifficulty').addEventListener('change', event => {
    state.ideaDifficulty = event.target.value;
    state.ideaLimit = 6;
    renderIdeas();
  });
  $('#showMoreIdeas').addEventListener('click', () => {
    state.ideaLimit += 6;
    renderIdeas();
  });
  $('#randomIdea').addEventListener('click', () => {
    const ideas = filteredIdeas();
    if (!ideas.length) {
      showToast('Önce filtreleri genişlet.');
      return;
    }
    openIdeaDetail(ideas[Math.floor(Math.random() * ideas.length)].id);
  });
  $('#ideaGrid').addEventListener('click', event => {
    const detail = event.target.closest('[data-idea-detail]');
    const build = event.target.closest('[data-idea-build]');
    const journey = event.target.closest('[data-journey-open]');
    if (detail) openIdeaDetail(detail.dataset.ideaDetail);
    if (build) selectIdeaForMethod(build.dataset.ideaBuild);
    if (journey) openProductJourney(journey.dataset.journeyOpen);
  });
  $('#ideaContent').addEventListener('click', event => {
    const build = event.target.closest('[data-idea-build]');
    const journey = event.target.closest('[data-journey-open]');
    if (build) selectIdeaForMethod(build.dataset.ideaBuild);
    if (journey) openProductJourney(journey.dataset.journeyOpen);
  });

  $('#methodSteps').addEventListener('click', event => {
    const button = event.target.closest('[data-method-step]');
    if (!button) return;
    state.methodStep = Number(button.dataset.methodStep);
    renderMethodSteps();
    renderMethodPanel();
  });
  $('#methodPanel').addEventListener('click', event => {
    const journey = event.target.closest('[data-journey-open]');
    if (journey) {
      openProductJourney(journey.dataset.journeyOpen);
      return;
    }
    const button = event.target.closest('[data-method-nav]');
    if (!button || button.disabled) return;
    if (button.dataset.methodNav === 'prev') state.methodStep = Math.max(0, state.methodStep - 1);
    else state.methodStep = state.methodStep === methodData.length - 1 ? 0 : state.methodStep + 1;
    renderMethodSteps();
    renderMethodPanel();
  });

  $('#journeySettings').addEventListener('change', event => {
    const control = event.target.closest('[data-journey-setting]');
    if (control) updateJourneySetting(control.dataset.journeySetting, control.value);
  });
  $('#journeyStageNav').addEventListener('click', event => {
    const button = event.target.closest('[data-journey-stage]');
    if (!button || !state.journeyPlan) return;
    state.journeyPlan.stage = Number(button.dataset.journeyStage);
    saveJourneyPlan();
    renderProductJourney();
  });
  $('#journeyStageContent').addEventListener('change', event => {
    const checkbox = event.target.closest('[data-journey-task]');
    if (checkbox) toggleJourneyTask(checkbox.dataset.journeyTask, checkbox.checked);
  });
  $('#journeyStageContent').addEventListener('click', event => {
    const button = event.target.closest('[data-journey-nav]');
    if (!button || !state.journeyPlan) return;
    const total = journeyStageLabels.length;
    if (button.dataset.journeyNav === 'prev') state.journeyPlan.stage = Math.max(0, state.journeyPlan.stage - 1);
    else state.journeyPlan.stage = state.journeyPlan.stage === total - 1 ? 0 : state.journeyPlan.stage + 1;
    saveJourneyPlan();
    renderProductJourney();
    $('.journey-main')?.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('#copyJourneyPlan').addEventListener('click', copyJourneyPlan);
  $('#resetJourneyPlan').addEventListener('click', resetJourneyPlan);

  $$('.security-actions [data-policy-action]').forEach(button => button.addEventListener('click', () => renderPolicy(button.dataset.policyAction)));

  $('#headerProgress').addEventListener('click', () => $('#progress').scrollIntoView({ behavior: 'smooth' }));

  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.closeDialog))));
  $$('.dialog').forEach(dialog => dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog(dialog);
  }));
}

async function init() {
  wireEvents();
  renderConcept('model');
  renderMethodSteps();
  renderMethodPanel();
  initProgress();
  restoreRoute();
  try {
    await loadData();
    renderApps();
    renderModels();
    renderIdeas();
    renderUpdates();
  } catch (error) {
    renderLoadingError(error);
  }
}

init();
