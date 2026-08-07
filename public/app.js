const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const STORAGE = {
  progress: 'ai-pusula-progress-v2',
  route: 'ai-pusula-route-v1'
};

const state = {
  apps: [],
  models: [],
  ideas: [],
  updates: [],
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
  const [apps, models, ideas, updates] = await Promise.all([
    fetchJson('./data/apps.json'),
    fetchJson('./data/models.json'),
    fetchJson('./data/ideas.json'),
    fetchJson('./data/updates.json')
  ]);
  state.apps = apps.items;
  state.models = models.items;
  state.ideas = ideas.items;
  state.updates = updates.items;
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
  return `<article class="idea-card">
    <div class="card-top"><span class="idea-number">${String(index + 1).padStart(2, '0')}</span><span class="difficulty ${escapeHtml(idea.difficulty)}">${escapeHtml(difficultyLabels[idea.difficulty])}</span></div>
    <h3>${escapeHtml(idea.title)}</h3>
    <p>${escapeHtml(idea.summary)}</p>
    <div class="tag-list"><span>${escapeHtml(categoryLabels[idea.category])}</span>${idea.tools.slice(0, 3).map(tool => `<span>${escapeHtml(tool)}</span>`).join('')}</div>
    <div class="card-actions"><button type="button" data-idea-detail="${escapeHtml(idea.id)}">Fikri aç</button><button type="button" data-idea-build="${escapeHtml(idea.id)}">PUSULA ile geliştir →</button></div>
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
  if (!idea) return;
  $('#ideaTitle').textContent = idea.title;
  $('#ideaContent').innerHTML = `<p class="child-copy">${escapeHtml(idea.summary)}</p><div class="idea-detail-list">${ideaDetailRows(idea)}</div><div class="dialog-actions"><span class="difficulty ${escapeHtml(idea.difficulty)}">${escapeHtml(difficultyLabels[idea.difficulty])}</span><button class="dark-button" type="button" data-idea-build="${escapeHtml(idea.id)}">PUSULA ile geliştir</button></div>`;
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
    if (detail) openIdeaDetail(detail.dataset.ideaDetail);
    if (build) selectIdeaForMethod(build.dataset.ideaBuild);
  });
  $('#ideaContent').addEventListener('click', event => {
    const button = event.target.closest('[data-idea-build]');
    if (button) selectIdeaForMethod(button.dataset.ideaBuild);
  });

  $('#methodSteps').addEventListener('click', event => {
    const button = event.target.closest('[data-method-step]');
    if (!button) return;
    state.methodStep = Number(button.dataset.methodStep);
    renderMethodSteps();
    renderMethodPanel();
  });
  $('#methodPanel').addEventListener('click', event => {
    const button = event.target.closest('[data-method-nav]');
    if (!button || button.disabled) return;
    if (button.dataset.methodNav === 'prev') state.methodStep = Math.max(0, state.methodStep - 1);
    else state.methodStep = state.methodStep === methodData.length - 1 ? 0 : state.methodStep + 1;
    renderMethodSteps();
    renderMethodPanel();
  });

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
