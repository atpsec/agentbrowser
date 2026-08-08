const BUILDER_STORAGE = 'ai-pusula-build-system-v2';

const builderState = {
  data: null,
  ideas: [],
  productId: null,
  profile: 'minimum',
  tab: 'roadmap',
  stage: 0,
  node: 'ui',
  entity: null,
  completed: {}
};

const $b = (selector, root = document) => root.querySelector(selector);
const $$b = (selector, root = document) => [...root.querySelectorAll(selector)];

function esc(value = '') {
  return String(value).replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[char]);
}

function readState() {
  try { return JSON.parse(localStorage.getItem(BUILDER_STORAGE) || '{}'); } catch { return {}; }
}

function persistState() {
  try {
    localStorage.setItem(BUILDER_STORAGE, JSON.stringify({
      productId: builderState.productId,
      profile: builderState.profile,
      stage: builderState.stage,
      completed: builderState.completed
    }));
  } catch { /* localStorage is optional */ }
}

function notify(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { toast.hidden = true; }, 2200);
}

async function loadBuilderData() {
  const [blueprintsResponse, ideasResponse] = await Promise.all([
    fetch('./data/build-blueprints.json', { cache: 'no-store' }),
    fetch('./data/ideas.json', { cache: 'no-store' })
  ]);
  if (!blueprintsResponse.ok || !ideasResponse.ok) throw new Error('Ürün inşa verileri yüklenemedi.');
  builderState.data = await blueprintsResponse.json();
  builderState.ideas = (await ideasResponse.json()).items || [];
}

function productById(id) {
  return builderState.data.products.find(item => item.id === id) || builderState.data.products[0];
}

function ideaById(id) {
  return builderState.ideas.find(item => item.id === id) || null;
}

function currentProduct() { return productById(builderState.productId); }
function currentIdea() { return ideaById(currentProduct().id); }

function toolById(id) { return builderState.data.tools[id]; }

function toolIdsForProduct(product) {
  const base = builderState.data.profiles[builderState.profile]?.tools || [];
  return [...new Set([...base, ...(product.specialTools || [])])].filter(id => toolById(id));
}

function toolLogo(tool) {
  const initials = tool.name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return `<span class="builder-tool-logo"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${esc(tool.slug)}.svg" alt="" loading="lazy" data-builder-logo><span data-builder-logo-fallback hidden>${esc(initials)}</span></span>`;
}

function wireLogoFallbacks(root) {
  $$b('[data-builder-logo]', root).forEach(image => {
    const fallback = () => {
      image.hidden = true;
      if (image.nextElementSibling) image.nextElementSibling.hidden = false;
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && image.naturalWidth === 0) fallback();
  });
}

function categoryLabel(category) {
  return ({security:'Siber güvenlik', software:'Yazılım', education:'Eğitim', business:'İşletme', content:'İçerik'})[category] || category;
}

function architectureFor(product) {
  const common = [
    {id:'ui',label:'FRONTEND',tool:'nextjs',summary:'Kullanıcının gördüğü ekranlar ve etkileşimler.',checks:['Responsive tasarım','Loading / error / empty state','Form doğrulama','Klavye erişilebilirliği']},
    {id:'auth',label:'AUTH',tool:builderState.profile === 'minimum' ? 'supabase' : 'clerk',summary:`${product.roles.join(', ')} için kimlik ve rol sınırı.`,checks:['E-posta doğrulama','Şifre sıfırlama','Session süresi','Server-side rol kontrolü']},
    {id:'api',label:'BACKEND / API',tool:'cloudflare',summary:'İş kuralları, güvenli mutasyonlar ve harici servis çağrıları.',checks:['Input validation','Authorization','Rate limit','Structured error']},
    {id:'db',label:'DATABASE',tool:'supabase',summary:`${product.entities.length} temel veri varlığını güvenli saklar.`,checks:['RLS / ownership','Foreign key','Migration','Backup / retention']},
    {id:'ai',label:'AI KATMANI',tool:builderState.profile === 'minimum' ? 'gemini' : 'openai',summary:product.aiFeatures.join(' · '),checks:['Structured output','Kullanım kotası','Timeout / fallback',product.securityFocus[0]]},
    {id:'pay',label:'BILLING',tool:'stripe',summary:'Ücretsiz/ücretli paket ve abonelik yaşam döngüsü.',checks:['Webhook signature','Idempotency','Cancel flow','Failed payment']},
    {id:'mail',label:'EMAIL',tool:'resend',summary:'Doğrulama, onboarding ve ürün bildirimleri.',checks:['Verified domain','Server-only secret','Unsubscribe kararı','Gönderim limiti']},
    {id:'analytics',label:'ANALYTICS',tool:'posthog',summary:'Aktivasyon, funnel ve tekrar kullanım ölçümü.',checks:['Gereksiz PII yok','Ana eventler','Retention','Consent kararı']},
    {id:'monitor',label:'MONITORING',tool:'sentry',summary:'Production hata ve performans görünürlüğü.',checks:['PII scrubbing','Release tag','Alert threshold','Error ownership']},
    {id:'cicd',label:'CI / CD',tool:'github-actions',summary:'Test edilmemiş kodun production’a çıkmasını engeller.',checks:['Lint / syntax','Test','Secret scan','Protected production step']}
  ];
  const extras = [];
  if (product.specialTools.includes('vector')) extras.push({id:'rag',label:'RAG / SEARCH',tool:'vector',summary:'Kaynakları bulur ve AI bağlamını sınırlar.',checks:['Kaynak ACL','Citation','Chunk sınırı','Retrieval injection testi']});
  if (product.specialTools.includes('r2')) extras.push({id:'storage',label:'FILE STORAGE',tool:'r2',summary:'Belge, ses veya büyük dosyaları uygulama kodundan ayrı tutar.',checks:['Signed URL','MIME doğrulama','Boyut limiti','Retention']});
  if (product.specialTools.includes('github')) extras.push({id:'github',label:'GITHUB',tool:'github',summary:'Repo, PR veya release verisini kontrollü şekilde bağlar.',checks:['Read-only scope','Repo allowlist','Secret redaction','Audit']});
  if (product.specialTools.includes('stt')) extras.push({id:'stt',label:'SPEECH → TEXT',tool:'stt',summary:'Ses kaydını zaman damgalı metne dönüştürür.',checks:['İzin / telif','Dosya limiti','Speaker privacy','Transkript doğrulama']});
  return [...common, ...extras];
}

function stageTemplate(product) {
  const idea = currentIdea() || {};
  const firstEntity = product.entities[0] || 'records';
  const aiFeature = product.aiFeatures[0] || 'AI özelliği';
  const stages = [
    {id:'scope',number:'01',title:'Ürün kapsamını kilitle',owner:'Ürün',tools:['figma'],goal:'İlk sürümde kimin hangi işi yapacağını netleştir.',tasks:[`Hedef kullanıcıyı yaz: ${product.target}`,`Temel vaadi tek cümlede sabitle: ${product.promise}`,'MVP’de olacak 6–8 özelliği seç','İlk sürümde olmayacak özellikleri yaz'],done:['Tek hedef kullanıcı tanımlı','İlk değer anı tanımlı','MVP 8 özelliği geçmiyor']},
    {id:'ux',number:'02',title:'Ekranları ve akışı tasarla',owner:'UX / Frontend',tools:['figma'],goal:'Kod yazmadan kullanıcı yolculuğunu ve hata durumlarını gör.',tasks:[`Ana ekranları çiz: ${product.pages.slice(0,6).join(' → ')}`,'Loading, empty ve error state ekle','Mobil akışı ayrıca çiz','Rol bazlı ekran farklarını işaretle'],done:['Ana ekranlar wireframe hazır','Mobil akış hazır','Hata ve loading durumları unutulmamış']},
    {id:'foundation',number:'03',title:'Proje iskeletini kur',owner:'Frontend / DevOps',tools:['nextjs','cursor','github-actions'],goal:'Çalışan, test edilebilir ve GitHub’da izlenen uygulama iskeleti.',tasks:['Next.js uygulamasını oluştur','.env.example ekle ve gerçek secret koyma','Lint / syntax ve temel test komutlarını kur','GitHub Actions doğrulaması ekle'],done:['Local uygulama açılıyor','Secret repoda değil','PR üzerinde otomatik kontrol çalışıyor']},
    {id:'auth',number:'04',title:'Kullanıcı girişini tamamla',owner:'Auth',tools:[builderState.profile === 'minimum' ? 'supabase':'clerk','cursor'],goal:`${product.roles.join(', ')} rollerini güvenli biçimde ayır.`,tasks:['Kayıt ve giriş','E-posta doğrulama','Şifre sıfırlama','Çıkış ve session kontrolü','Rol ve admin sınırı'],done:['Kayıt/giriş çalışıyor','Şifre sıfırlama çalışıyor','Normal kullanıcı admin alanına giremiyor','Session server tarafında doğrulanıyor']},
    {id:'database',number:'05',title:'Veritabanını kur',owner:'Backend / Data',tools:['supabase','cursor'],goal:'Ürünün verisini migration ve yetki politikalarıyla sakla.',tasks:[`Temel tabloları oluştur: ${product.entities.slice(0,5).join(', ')}`,'Foreign key ilişkilerini ekle','RLS / ownership politikalarını yaz','Önemli sorgulara index ekle','Farklı kullanıcılarla yetki testi yap'],done:['Migration tekrar çalıştırılabiliyor',`Kullanıcı izinsiz ${firstEntity} kaydı okuyamıyor`,'Admin işlemleri ayrılmış']},
    {id:'frontend',number:'06',title:'Gerçek frontend’i geliştir',owner:'Frontend',tools:['nextjs','cursor'],goal:'Wireframe’i çalışan, erişilebilir ürüne dönüştür.',tasks:product.pages.slice(0,6).map(page => `${page} ekranını geliştir`).concat(['Form doğrulama ve hata mesajları','Mobil/keyboard kontrolü']),done:['Ana kullanıcı akışı tamam','Responsive','Loading/error/empty state var','Keyboard ile ana akış kullanılabiliyor']},
    {id:'backend',number:'07',title:'Backend ve iş kurallarını kur',owner:'Backend',tools:['cloudflare','supabase','cursor'],goal:'Yetki, kota ve iş kurallarını client’tan bağımsız çalıştır.',tasks:[`Ana kayıt işlemlerini kur: ${product.entities.slice(0,4).join(', ')}`,'Her mutasyonda authorization','Rate limit','Yapılandırılmış hata cevapları','Audit gerektiren işlemleri logla'],done:['Client yetki uyduramıyor','Her mutasyonda kullanıcı doğrulanıyor','Rate limit çalışıyor','Hatalar güvenli dönüyor']},
    {id:'ai',number:'08',title:'AI özelliğini ekle',owner:'AI / Backend',tools:[builderState.profile === 'minimum' ? 'gemini':'openai','cursor'],goal:`AI gerçek değer üretsin: ${product.aiFeatures.join(' · ')}`,tasks:[`${aiFeature} için server-side prompt oluştur`,'Structured JSON output kullan','Kullanıcı/ürün bağlamını server-side ekle','Prompt injection testleri','Kullanıcı başı kota ve maliyet limiti','Timeout ve fallback'],done:['Model cevabı şemaya uyuyor','Prompt kullanıcı yetkisini değiştiremiyor','Kota aşımında çağrı duruyor','AI hatasında uygulama kontrollü davranıyor']},
    {id:'billing',number:'09',title:'Ödeme ve aboneliği bağla',owner:'Billing',tools:['stripe','cursor'],goal:'Ödeme durumunu güvenilir biçimde ürün yetkisine dönüştür.',tasks:['Ücretsiz ve ücretli paketleri tanımla','Checkout Session oluştur','Webhook endpoint ekle','Webhook imzasını doğrula','Subscription durumunu DB’ye yansıt','İptal ve başarısız ödeme akışı'],done:['Ödeme sonrası erişim doğru','İptal davranışı doğru','Tekrarlanan webhook çift işlem yapmıyor']},
    {id:'email',number:'10',title:'E-posta ve bildirimleri kur',owner:'Lifecycle',tools:['resend'],goal:'Kullanıcıya yalnızca gerekli anda işlem ve onboarding mesajı gönder.',tasks:['Hoş geldin e-postası','Kritik işlem bildirimi','Onboarding hatırlatması','Domain doğrulama','Gönderim tercihleri'],done:['Production domaininden mail gidiyor','Secret yalnız server’da','Gereksiz bildirim yok']},
    {id:'observability',number:'11',title:'Analytics ve hata takibini ekle',owner:'Operations',tools:['posthog','sentry'],goal:'Tahmin etmek yerine ürünün gerçekten çalışıp çalışmadığını ölç.',tasks:['signup_completed event','first_value_completed event','subscription_started event','AI feature used event','Error tracking','PII scrubbing'],done:['Aktivasyon hunisi görülebiliyor','Production hatası alarm üretiyor','Gereksiz PII analytics’e gitmiyor']},
    {id:'security',number:'12',title:'Güvenlik kapılarını geç',owner:'Security',tools:['github-actions','cloudflare'],goal:'Canlıya çıkmadan önce kötü girdi ve yetki ihlallerini zorla.',tasks:['Authorization testleri','RLS / ownership testleri','XSS ve input validation','Rate limit testi','Prompt injection testi','Secret scan','Dependency scan',...product.securityFocus.map(item => `Ürüne özel: ${item}`)],done:['Yüksek riskli açık yok','Secret scan temiz','Başka kullanıcı verisine erişilemiyor','AI kritik yetki kazanamıyor']},
    {id:'deploy',number:'13',title:'Staging ve production’a çık',owner:'DevOps',tools:['cloudflare','github-actions','sentry'],goal:'Geri alınabilir, ölçülebilir ve doğrulanabilir release yap.',tasks:['Staging environment','Production env vars','Domain + HTTPS','Migration plan','Smoke test','Rollback prosedürü','Health/error alarmı'],done:['Staging/production ayrılmış','Rollback yöntemi var','Canlı smoke test geçiyor','Repo iç dosyaları yayınlanmıyor']},
    {id:'growth',number:'14',title:'İlk değeri ve büyümeyi ölç',owner:'Ürün / Growth',tools:['posthog','resend'],goal:`Kullanıcının ${idea.metric || 'ürünün temel değerini'} gerçekten elde edip etmediğini ölç.`,tasks:['İlk değer eventini tanımla','1 / 7 / 30 günlük retention ölç','İlk 5 kullanıcıyla görüş','En çok bırakılan adımı bul','Tek bir iyileştirme hipotezi seç'],done:['Aktivasyon metriği ölçülüyor','Retention görülebiliyor','İlk kullanıcı geri bildirimi kaydedildi']}
  ];
  return stages;
}

function fieldSet(entity) {
  const specific = {
    profiles:['id','user_id','display_name','role','created_at'],
    users:['id','email','status','created_at'],
    documents:['id','owner_id','title','storage_key','version','created_at'],
    audit_logs:['id','actor_id','action','resource_type','resource_id','created_at'],
    subscriptions:['id','user_id','provider_customer_id','plan','status','current_period_end'],
    conversations:['id','user_id','title','created_at'],
    tickets:['id','customer_id','subject','status','priority','created_at'],
    analyses:['id','user_id','input_hash','risk_level','result_json','created_at'],
    attempts:['id','user_id','item_id','answer','score','created_at']
  };
  return specific[entity] || ['id','owner_id','status','data_json','created_at','updated_at'];
}

function completionFor(product, stages) {
  const completed = builderState.completed[product.id] || {};
  const tasks = stages.flatMap(stage => stage.tasks.map((text,index) => ({id:`${stage.id}-${index}`,text})));
  const done = tasks.filter(task => completed[task.id]).length;
  return {done,total:tasks.length,percent:tasks.length ? Math.round(done / tasks.length * 100) : 0};
}

function injectBuilderShell() {
  const ideasSection = document.getElementById('ideas');
  if (!ideasSection || document.getElementById('product-builder')) return;
  const section = document.createElement('section');
  section.id = 'product-builder';
  section.className = 'builder-section';
  section.innerHTML = `
    <div class="builder-shell">
      <div class="builder-heading"><div><span class="builder-badge">ÜRÜN İNŞA LABORATUVARI · 18 BLUEPRINT</span><h2>Fikri seç. Sistemi parça parça kur.</h2></div><p>Frontend, backend, kullanıcı girişi, veritabanı, AI, ödeme, güvenlik ve canlıya alma aynı haritada. Uzun doküman değil; tıklayarak ilerleyen çalışma alanı.</p></div>
      <div class="builder-catalog" id="builderCatalog"></div>
    </div>`;
  ideasSection.insertAdjacentElement('afterend', section);

  const dialog = document.createElement('dialog');
  dialog.id = 'builderDialog';
  dialog.className = 'builder-dialog';
  dialog.setAttribute('aria-label','Ürün inşa çalışma alanı');
  dialog.innerHTML = `<div class="builder-dialog-inner"><div class="builder-topbar"><strong>AI PUSULA / ÜRÜN İNŞA LABORATUVARI</strong><button class="builder-close" type="button" data-builder-close>Kapat ×</button></div><div class="builder-main" id="builderMain"></div></div>`;
  document.body.appendChild(dialog);
}

function renderCatalog() {
  const root = document.getElementById('builderCatalog');
  if (!root) return;
  root.innerHTML = builderState.data.products.map((product,index) => {
    const stages = stageTemplate(product);
    const progress = completionFor(product, stages);
    return `<button class="builder-product-card" type="button" data-builder-open="${esc(product.id)}"><span>${String(index+1).padStart(2,'0')} · ${esc(categoryLabel(product.category))}</span><b>${esc(product.title)}</b><small>${esc(product.promise)}</small><progress class="builder-card-progress" max="100" value="${progress.percent}" aria-label="${progress.percent}% tamamlandı"></progress><em>${progress.percent}% · İnşa haritasını aç →</em></button>`;
  }).join('');
}

function attachIdeaBuildButtons() {
  $$b('[data-product-plan]').forEach(existing => {
    const id = existing.dataset.productPlan;
    const actions = existing.closest('.card-actions');
    if (!actions || actions.querySelector(`[data-builder-open="${CSS.escape(id)}"]`)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.builderOpen = id;
    button.className = 'builder-inline-button';
    button.textContent = 'Ürünü inşa et ↗';
    actions.appendChild(button);
  });
}

function renderProductPicker(product) {
  return `<label class="builder-product-select">ÜRÜN <select data-builder-product>${builderState.data.products.map(item => `<option value="${esc(item.id)}" ${item.id === product.id ? 'selected':''}>${esc(item.title)}</option>`).join('')}</select></label>`;
}

function renderTabs() {
  const tabs = [['roadmap','14 adım'],['architecture','Mimari'],['database','Veritabanı'],['scope','Ürün kapsamı'],['tools','Araçlar']];
  return `<div class="builder-tabs" role="tablist">${tabs.map(([id,label]) => `<button type="button" role="tab" data-builder-tab="${id}" aria-selected="${builderState.tab === id}">${label}</button>`).join('')}</div>`;
}

function renderRoadmap(product, stages) {
  const stage = stages[builderState.stage] || stages[0];
  const completed = builderState.completed[product.id] || {};
  const doneInStage = stage.tasks.filter((_,i) => completed[`${stage.id}-${i}`]).length;
  const tools = stage.tools.map(toolById).filter(Boolean);
  const prompt = `Sen kıdemli bir ${stage.owner} mühendisisin. ${product.title} ürünü üzerinde çalışıyoruz. Hedef: ${stage.goal} Bu aşamada şu işleri güvenli ve küçük adımlarla tamamla: ${stage.tasks.join('; ')}. Secret değerleri kaynak koda yazma. Yetkilendirmeyi client'a güvenme. Her değişiklik için test ve geri alma notu üret. Bittiğinde şu kabul kriterlerini tek tek doğrula: ${stage.done.join('; ')}.`;
  return `<div class="builder-workspace"><nav class="builder-stage-list">${stages.map((item,index) => `<button type="button" data-builder-stage="${index}" class="${index === builderState.stage ? 'is-active':''}"><span>${item.number}</span><b>${esc(item.title)}</b></button>`).join('')}</nav><article class="builder-stage-panel"><div class="builder-stage-head"><span>${esc(stage.owner)} · ${stage.number}/14</span><h3>${esc(stage.title)}</h3><p>${esc(stage.goal)}</p></div><div class="builder-stage-tools">${tools.map(tool => `<div>${toolLogo(tool)}<b>${esc(tool.name)}</b></div>`).join('')}</div><div class="builder-stage-grid"><section><h4>YAPILACAKLAR</h4>${stage.tasks.map((task,index) => `<label class="builder-task"><input type="checkbox" data-builder-task="${stage.id}-${index}" ${completed[`${stage.id}-${index}`] ? 'checked':''}><span>${esc(task)}</span></label>`).join('')}</section><section><h4>BİTTİ SAYILIR</h4><ul>${stage.done.map(item => `<li>${esc(item)}</li>`).join('')}</ul><div class="builder-stage-score">${doneInStage} / ${stage.tasks.length} görev</div></section></div><details class="builder-prompt"><summary>AI kodlama aracına vereceğin görev</summary><pre>${esc(prompt)}</pre><button type="button" data-builder-copy-prompt>Kopyala</button></details></article></div>`;
}

function renderArchitecture(product) {
  const nodes = architectureFor(product);
  const selected = nodes.find(item => item.id === builderState.node) || nodes[0];
  builderState.node = selected.id;
  const tool = toolById(selected.tool);
  return `<div class="builder-architecture"><div class="builder-graph">${nodes.map(node => `<button type="button" class="builder-node ${node.id === selected.id ? 'is-active':''}" data-builder-node="${esc(node.id)}"><span>${esc(node.label)}</span><small>${esc(toolById(node.tool)?.name || '')}</small></button>`).join('')}<div class="builder-flow-note">KULLANICI → FRONTEND → AUTH/API → DATABASE/AI/ÖDEME → ÖLÇÜM → CI/CD</div></div><aside class="builder-inspector">${toolLogo(tool)}<span>${esc(selected.label)}</span><h3>${esc(tool.name)}</h3><p>${esc(selected.summary)}</p><p><b>AI entegrasyonu:</b> ${esc(tool.ai)}</p><h4>Kontrol listesi</h4><ul>${selected.checks.map(item => `<li>${esc(item)}</li>`).join('')}</ul><a href="${esc(tool.official)}" target="_blank" rel="noopener noreferrer">Resmî doküman ↗</a></aside></div>`;
}

function renderDatabase(product) {
  const selected = product.entities.includes(builderState.entity) ? builderState.entity : product.entities[0];
  builderState.entity = selected;
  return `<div class="builder-database"><div class="builder-entity-map">${product.entities.map((entity,index) => `<button type="button" data-builder-entity="${esc(entity)}" class="${entity === selected ? 'is-active':''}"><span>${String(index+1).padStart(2,'0')}</span><b>${esc(entity)}</b></button>`).join('')}</div><aside class="builder-inspector"><span>POSTGRESQL TABLOSU</span><h3>${esc(selected)}</h3><p>Bu tablo ${esc(product.title)} ürününün temel veri modelinin bir parçasıdır. Gerçek şema migration ile oluşturulmalı; erişim kuralı server-side ve RLS ile test edilmelidir.</p><h4>Başlangıç alanları</h4><ul>${fieldSet(selected).map(field => `<li><code>${esc(field)}</code></li>`).join('')}</ul><h4>Güvenlik</h4><ul><li>Owner / rol ilişkisini açık tanımla.</li><li>Başka kullanıcının satırına erişim testini yaz.</li><li>Silme ve retention politikasını belirle.</li></ul></aside></div>`;
}

function renderScope(product) {
  const idea = currentIdea() || {};
  const columns = [
    ['KULLANICI ROLLERİ',product.roles],['ANA EKRANLAR',product.pages],['AI ÖZELLİKLERİ',product.aiFeatures],['GÜVENLİK ODAKLARI',product.securityFocus]
  ];
  return `<div class="builder-scope"><div class="builder-product-summary"><span>${esc(categoryLabel(product.category))}</span><h3>${esc(product.promise)}</h3><p>${esc(idea.problem || '')}</p><div><b>Girdi</b><span>${esc(idea.input || 'Kullanıcı girdisi')}</span><b>Çıktı</b><span>${esc(idea.output || 'Ürün sonucu')}</span><b>Başarı</b><span>${esc(idea.metric || 'Aktivasyon ve tekrar kullanım')}</span></div></div><div class="builder-scope-grid">${columns.map(([title,items]) => `<section><h4>${title}</h4><ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>`).join('')}</div></div>`;
}

function renderTools(product) {
  const ids = toolIdsForProduct(product);
  return `<div class="builder-profile-bar"><div><b>TEKNOLOJİ ROTASI</b><p>${esc(builderState.data.profiles[builderState.profile].summary)}</p></div><div>${Object.entries(builderState.data.profiles).map(([id,profile]) => `<button type="button" data-builder-profile="${id}" aria-pressed="${id === builderState.profile}">${esc(profile.label)}</button>`).join('')}</div></div><div class="builder-tool-grid">${ids.map(id => { const tool=toolById(id); return `<article>${toolLogo(tool)}<span>${esc(tool.kind)}</span><h3>${esc(tool.name)}</h3><p>${esc(tool.why)}</p><p class="builder-ai-label">${esc(tool.ai)}</p><a href="${esc(tool.official)}" target="_blank" rel="noopener noreferrer">Resmî doküman ↗</a></article>`; }).join('')}</div>`;
}

function buildMarkdown(product, stages) {
  const idea = currentIdea() || {};
  const completed = builderState.completed[product.id] || {};
  const lines = [`# ${product.title}`,'',product.promise,'',`Hedef: ${product.target}`,`Kategori: ${categoryLabel(product.category)}`,'',`## Problem`,``,idea.problem || '','',`## Roller`];
  product.roles.forEach(item => lines.push(`- ${item}`));
  lines.push('', '## Ekranlar'); product.pages.forEach(item => lines.push(`- ${item}`));
  lines.push('', '## Veri varlıkları'); product.entities.forEach(item => lines.push(`- ${item}: ${fieldSet(item).join(', ')}`));
  lines.push('', '## 14 aşamalı plan');
  stages.forEach(stage => {
    lines.push('', `### ${stage.number}. ${stage.title}`, stage.goal);
    stage.tasks.forEach((task,index) => lines.push(`- [${completed[`${stage.id}-${index}`] ? 'x':' '}] ${task}`));
    lines.push('','Bitti sayılır:'); stage.done.forEach(item => lines.push(`- ${item}`));
  });
  return lines.join('\n');
}

function renderBuilder() {
  const root = document.getElementById('builderMain');
  if (!root) return;
  const product = currentProduct();
  const stages = stageTemplate(product);
  builderState.stage = Math.max(0,Math.min(builderState.stage,stages.length-1));
  const completion = completionFor(product, stages);
  const body = builderState.tab === 'roadmap' ? renderRoadmap(product,stages) : builderState.tab === 'architecture' ? renderArchitecture(product) : builderState.tab === 'database' ? renderDatabase(product) : builderState.tab === 'scope' ? renderScope(product) : renderTools(product);
  root.innerHTML = `<div class="builder-hero"><div>${renderProductPicker(product)}<span class="builder-badge">${esc(categoryLabel(product.category))}</span><h2>${esc(product.title)}</h2><p>${esc(product.promise)}</p></div><div class="builder-progress-card"><span>ÜRÜN İLERLEMESİ</span><strong>${completion.percent}%</strong><progress max="100" value="${completion.percent}"></progress><small>${completion.done} / ${completion.total} görev</small></div></div>${renderTabs()}${body}<div class="builder-export"><button type="button" data-builder-copy-plan>Markdown planını kopyala</button><span>İlerleme yalnızca bu tarayıcıda saklanır.</span></div>`;
  wireLogoFallbacks(root);
  persistState();
}

function openBuilder(id) {
  if (id && builderState.data.products.some(item => item.id === id)) builderState.productId = id;
  if (!builderState.productId) builderState.productId = builderState.data.products[0].id;
  builderState.stage = 0;
  builderState.tab = 'roadmap';
  renderBuilder();
  const dialog = document.getElementById('builderDialog');
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
}

function closeBuilder() {
  const dialog = document.getElementById('builderDialog');
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
}

async function copyText(text, message) {
  try { await navigator.clipboard.writeText(text); notify(message); } catch { notify('Kopyalama izni verilemedi.'); }
}

function bindEvents() {
  document.addEventListener('click', event => {
    const open = event.target.closest('[data-builder-open]');
    if (open) { event.preventDefault(); openBuilder(open.dataset.builderOpen); return; }
    if (event.target.closest('[data-builder-close]')) { closeBuilder(); return; }
    const tab = event.target.closest('[data-builder-tab]');
    if (tab) { builderState.tab = tab.dataset.builderTab; renderBuilder(); return; }
    const stage = event.target.closest('[data-builder-stage]');
    if (stage) { builderState.stage = Number(stage.dataset.builderStage) || 0; renderBuilder(); return; }
    const node = event.target.closest('[data-builder-node]');
    if (node) { builderState.node = node.dataset.builderNode; renderBuilder(); return; }
    const entity = event.target.closest('[data-builder-entity]');
    if (entity) { builderState.entity = entity.dataset.builderEntity; renderBuilder(); return; }
    const profile = event.target.closest('[data-builder-profile]');
    if (profile) { builderState.profile = profile.dataset.builderProfile; renderBuilder(); return; }
    if (event.target.closest('[data-builder-copy-plan]')) { const p=currentProduct(); copyText(buildMarkdown(p,stageTemplate(p)),'Ürün planı kopyalandı.'); return; }
    if (event.target.closest('[data-builder-copy-prompt]')) { const pre=$b('.builder-prompt pre'); if (pre) copyText(pre.textContent,'AI görevi kopyalandı.'); }
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-builder-product]')) { builderState.productId = event.target.value; builderState.stage=0; builderState.entity=null; builderState.node='ui'; renderBuilder(); renderCatalog(); return; }
    if (event.target.matches('[data-builder-task]')) {
      const product=currentProduct();
      builderState.completed[product.id] ||= {};
      builderState.completed[product.id][event.target.dataset.builderTask] = event.target.checked;
      renderBuilder(); renderCatalog();
    }
  });
}

async function initBuilder() {
  try {
    await loadBuilderData();
    const saved = readState();
    builderState.productId = builderState.data.products.some(item => item.id === saved.productId) ? saved.productId : builderState.data.products[0].id;
    builderState.profile = builderState.data.profiles[saved.profile] ? saved.profile : 'minimum';
    builderState.stage = Number(saved.stage) || 0;
    builderState.completed = saved.completed && typeof saved.completed === 'object' ? saved.completed : {};
    injectBuilderShell();
    renderCatalog();
    attachIdeaBuildButtons();
    bindEvents();
    const observer = new MutationObserver(() => attachIdeaBuildButtons());
    const ideaGrid = document.getElementById('ideaGrid');
    if (ideaGrid) observer.observe(ideaGrid,{childList:true,subtree:true});
  } catch (error) {
    console.error('Product builder init failed:', error);
  }
}

initBuilder();