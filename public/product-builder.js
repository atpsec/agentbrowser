const BUILDER_STORAGE = 'ai-pusula-build-system-v1';

const builderState = {
  data: null,
  blueprint: null,
  profile: 'minimum',
  tab: 'architecture',
  stage: 0,
  node: 'ui',
  table: 'profiles',
  completed: {}
};

const $b = (selector, root = document) => root.querySelector(selector);
const $$b = (selector, root = document) => [...root.querySelectorAll(selector)];

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]);
}

function readBuilderState() {
  try {
    const raw = localStorage.getItem(BUILDER_STORAGE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBuilderState() {
  try {
    localStorage.setItem(BUILDER_STORAGE, JSON.stringify({
      profile: builderState.profile,
      stage: builderState.stage,
      completed: builderState.completed
    }));
  } catch {
    // The builder remains usable when storage is disabled.
  }
}

function toast(message) {
  const existing = document.getElementById('toast');
  if (existing) {
    existing.textContent = message;
    existing.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { existing.hidden = true; }, 2200);
    return;
  }
  window.alert(message);
}

async function loadBlueprints() {
  const response = await fetch('./data/build-blueprints.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`build-blueprints.json yüklenemedi (${response.status})`);
  return response.json();
}

function toolLogo(tool) {
  const initials = tool.name.split(/\s+/).map(item => item[0]).join('').slice(0, 2).toUpperCase();
  return `<span class="builder-tool-logo"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${esc(tool.slug)}.svg" alt="" loading="lazy"><span hidden>${esc(initials)}</span></span>`;
}

function injectBuilderShell() {
  const ideas = document.getElementById('ideas');
  if (!ideas || document.getElementById('product-builder')) return;

  const section = document.createElement('section');
  section.className = 'builder-section';
  section.id = 'product-builder';
  section.innerHTML = `
    <div class="builder-shell">
      <div class="builder-heading">
        <div>
          <span class="builder-badge">ÜRÜN İNŞA LABORATUVARI</span>
          <h2>Fikirden çalışan SaaS'a, parça parça.</h2>
        </div>
        <p>Çok az kod biliyor olsan bile hangi ekranı, veritabanını, kullanıcı girişini, AI entegrasyonunu, ödemeyi, güvenliği ve deployment'ı hangi sırayla kuracağını gör.</p>
      </div>
      <article class="builder-launch">
        <div class="builder-launch-copy">
          <p class="kicker">İLK TAM ÖRNEK</p>
          <h3>Duolingo benzeri AI Dil Öğrenme SaaS</h3>
          <p>Kullanıcı girişli, veritabanlı, AI öğretmenli, abonelikli ve admin panelli gerçek bir ürünün profesyonel yapım haritası.</p>
          <div class="builder-launch-meta"><span>14 YAPIM AŞAMASI</span><span>10 TEKNİK KATMAN</span><span>GÜVENLİK KAPILARI</span></div>
          <button class="builder-open" type="button" data-builder-open>İnşa haritasını aç →</button>
        </div>
        <div class="builder-launch-visual" aria-hidden="true">
          <div class="mini-stack">
            <div><b>FRONTEND</b><small>Next.js</small></div>
            <div><b>AUTH + DATA</b><small>Supabase / Clerk</small></div>
            <div><b>AI TEACHER</b><small>Gemini / OpenAI</small></div>
            <div><b>BILLING</b><small>Stripe</small></div>
            <div><b>DEPLOY</b><small>Cloudflare + GitHub</small></div>
          </div>
        </div>
      </article>
    </div>`;
  ideas.insertAdjacentElement('afterend', section);

  const dialog = document.createElement('dialog');
  dialog.className = 'builder-dialog';
  dialog.id = 'builderDialog';
  dialog.innerHTML = `
    <div class="builder-dialog-inner">
      <div class="builder-topbar"><strong>AI PUSULA / ÜRÜN İNŞA SİSTEMİ</strong><button class="builder-close" type="button" data-builder-close>Kapat ×</button></div>
      <div class="builder-main" id="builderMain"></div>
    </div>`;
  document.body.append(dialog);
}

function completion() {
  const stages = builderState.blueprint?.stages || [];
  const tasks = stages.flatMap(stage => stage.tasks.map((text, index) => ({ id: `${stage.id}:${index}`, text })));
  const done = tasks.filter(task => builderState.completed[task.id]).length;
  return { done, total: tasks.length, percent: tasks.length ? Math.round(done / tasks.length * 100) : 0 };
}

function stagePercent(stage) {
  if (!stage?.tasks?.length) return 0;
  const done = stage.tasks.filter((_, index) => builderState.completed[`${stage.id}:${index}`]).length;
  return Math.round(done / stage.tasks.length * 100);
}

function renderTop() {
  const blueprint = builderState.blueprint;
  const profile = builderState.data.toolProfiles[builderState.profile];
  const progress = completion();
  return `
    <div class="builder-hero">
      <div><p class="kicker">${esc(blueprint.target)} · ${esc(blueprint.difficulty)}</p><h2>${esc(blueprint.title)}</h2><p>${esc(blueprint.outcome)}</p></div>
      <div class="builder-progress-card"><span>ÜRÜN İLERLEMESİ</span><strong>${progress.percent}%</strong><progress value="${progress.done}" max="${progress.total}">${progress.percent}%</progress><small>${progress.done} / ${progress.total} görev</small></div>
    </div>
    <div class="builder-controls">
      <label>Teknoloji rotası <select id="builderProfile">${Object.entries(builderState.data.toolProfiles).map(([key, item]) => `<option value="${esc(key)}" ${key === builderState.profile ? 'selected' : ''}>${esc(item.label)}</option>`).join('')}</select></label>
      <span>${esc(profile.summary)}</span>
    </div>
    <div class="builder-tabs" role="tablist" aria-label="Ürün inşa bölümleri">
      ${[['architecture','Mimari'],['stages','Yapım adımları'],['tools','Araçlar'],['database','Veritabanı'],['spec','Ürün kapsamı']].map(([key,label]) => `<button type="button" role="tab" aria-selected="${builderState.tab === key}" data-builder-tab="${key}">${label}</button>`).join('')}
    </div>`;
}

function toolCard(toolId, compact = false) {
  const tool = builderState.data.tools[toolId];
  if (!tool) return '';
  if (compact) return `<div class="tool-card-mini"><b>${esc(tool.name)}</b><p>${esc(tool.why)}</p><a href="${esc(tool.official)}" target="_blank" rel="noreferrer noopener">Resmî doküman ↗</a></div>`;
  return `<article class="builder-tool-card">${toolLogo(tool)}<div><p class="kicker">${esc(tool.kind)}</p><h4>${esc(tool.name)}</h4></div><p>${esc(tool.why)}</p><p class="ai-note"><b>AI ilişkisi:</b> ${esc(tool.ai)}</p><a href="${esc(tool.official)}" target="_blank" rel="noreferrer noopener">Resmî kaynağı aç ↗</a></article>`;
}

function renderArchitecture() {
  const blueprint = builderState.blueprint;
  const active = blueprint.architecture.find(node => node.id === builderState.node) || blueprint.architecture[0];
  const mainTool = builderState.data.tools[active.tool];
  const alternativeNames = (active.alternatives || []).map(id => builderState.data.tools[id]?.name).filter(Boolean);
  return `
    <div class="builder-view-head"><div><h3>Tıklanabilir sistem mimarisi</h3><p>Her kutu gerçek ürünün bir parçası. Kutuyu seç; neden gerektiğini, hangi aracı kullanacağını ve tamamlanma kontrolünü gör.</p></div></div>
    <div class="architecture-map">${blueprint.architecture.map(node => `<button class="arch-node ${node.id === active.id ? 'is-active' : ''}" type="button" data-arch-node="${esc(node.id)}"><span>${esc(node.id.toUpperCase())}</span><b>${esc(node.label)}</b><small>${esc(builderState.data.tools[node.tool]?.name || node.tool)}</small></button>`).join('')}</div>
    <div class="arch-detail">
      <div><p class="kicker">${esc(active.label)}</p><h4>${esc(active.summary)}</h4><ul class="check-list">${active.checks.map(item => `<li>${esc(item)}</li>`).join('')}</ul>${alternativeNames.length ? `<p><b>Alternatif:</b> ${esc(alternativeNames.join(' · '))}</p>` : ''}</div>
      ${toolCard(active.tool, true)}
    </div>
    <div class="builder-footer-note"><b>Bağlantı mantığı:</b> Browser/client doğrudan secret veya ödeme webhook'u taşımaz. Hassas AI, ödeme ve mutasyon işlemleri server-side sınırdan geçer.</div>`;
}

function stagePrompt(stage) {
  const direct = builderState.blueprint.aiTaskTemplates[stage.id];
  if (direct) return direct;
  const toolNames = stage.tools.map(id => builderState.data.tools[id]?.name).filter(Boolean).join(', ');
  return `Bu ürün için “${stage.title}” aşamasını uygula. Kullanılan araçlar: ${toolNames}. Hedef: ${stage.goal} Görevler: ${stage.tasks.join('; ')}. Secret değerleri kaynak koda yazma, authorization kontrollerini server tarafında yap ve tamamlandığını doğrulamak için testleri de üret. Değiştirdiğin dosyaları ve bitti sayılma kriterlerini listele.`;
}

function renderStages() {
  const stages = builderState.blueprint.stages;
  const stage = stages[builderState.stage] || stages[0];
  const percent = stagePercent(stage);
  return `
    <div class="builder-view-head"><div><h3>Profesyonel yapım sırası</h3><p>Bir profesyonel ekibin frontend, backend, auth, veri, AI, ödeme ve operasyon sırasını sadeleştirdik. Bir aşamayı bitirmeden kritik bağımlılığı atlama.</p></div></div>
    <div class="stage-roadmap">
      <nav class="stage-list" aria-label="Yapım aşamaları">${stages.map((item,index) => `<button type="button" data-builder-stage="${index}" aria-current="${index === builderState.stage ? 'step' : 'false'}"><b>${esc(item.number)}</b><span>${esc(item.title)}</span><em>${stagePercent(item)}%</em></button>`).join('')}</nav>
      <article class="stage-panel">
        <div class="stage-panel-head"><div><span class="stage-owner">${esc(stage.owner)}</span><h4>${esc(stage.number)} — ${esc(stage.title)}</h4><p>${esc(stage.goal)}</p></div><strong>${percent}%</strong></div>
        <div class="stage-tools">${stage.tools.map(id => `<button type="button" data-tool-jump="${esc(id)}">${esc(builderState.data.tools[id]?.name || id)}</button>`).join('')}</div>
        <div class="stage-checks">
          <section><h5>Yapılacaklar</h5><div class="task-list">${stage.tasks.map((item,index) => { const id = `${stage.id}:${index}`; return `<label><input type="checkbox" data-builder-task="${esc(id)}" ${builderState.completed[id] ? 'checked' : ''}><span>${esc(item)}</span></label>`; }).join('')}</div></section>
          <section><h5>Bitti sayılması için</h5><ul class="done-list">${stage.done.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
        </div>
        <div class="ai-prompt-box"><p class="kicker">AI KODLAMA GÖREVİ</p><pre>${esc(stagePrompt(stage))}</pre><button class="copy-prompt" type="button" data-copy-stage-prompt>Prompt'u kopyala</button></div>
      </article>
    </div>`;
}

function renderTools() {
  const profile = builderState.data.toolProfiles[builderState.profile];
  const selected = new Set(profile.tools);
  const used = new Set(builderState.blueprint.stages.flatMap(stage => stage.tools));
  const ids = [...new Set([...selected, ...used])];
  return `
    <div class="builder-view-head"><div><h3>Bu üründe hangi araç ne yapıyor?</h3><p>Araç seçimi moda göre değil, sorumluluğa göre. “Minimum çaba” rotasında mümkün olduğunca az servis; profesyonel rotada sorumluluklar daha net ayrılır.</p></div></div>
    <div class="builder-tool-grid">${ids.map(id => toolCard(id)).join('')}</div>`;
}

function renderDatabase() {
  const tables = builderState.blueprint.tables;
  const active = tables.find(table => table.name === builderState.table) || tables[0];
  return `
    <div class="builder-view-head"><div><h3>Veritabanını kutular halinde gör</h3><p>Tabloyu seç; ne tuttuğunu ve hangi alanlara ihtiyacın olduğunu gör. Gerçek projede şema migration ile yönetilmeli ve kullanıcı verisi RLS/authorization ile sınırlandırılmalı.</p></div></div>
    <div class="db-layout"><nav class="db-list">${tables.map(table => `<button type="button" data-db-table="${esc(table.name)}" class="${table.name === active.name ? 'is-active' : ''}">${esc(table.name)}</button>`).join('')}</nav><article class="db-detail"><p class="kicker">VERİ HASSASİYETİ · ${esc(active.sensitive)}</p><h4>${esc(active.name)}</h4><p>${esc(active.purpose)}</p><div class="field-grid">${active.fields.map(field => `<code>${esc(field)}</code>`).join('')}</div><div class="builder-footer-note"><b>Kontrol:</b> Kullanıcı kimliğiyle bağlı tablolar başka kullanıcı tarafından okunamamalı veya değiştirilememeli. Ödeme ve audit tabloları client'tan doğrudan yazılmamalı.</div></article></div>`;
}

function renderSpec() {
  const b = builderState.blueprint;
  const profile = builderState.data.toolProfiles[builderState.profile];
  return `
    <div class="builder-view-head"><div><h3>Ürünün teknik pasaportu</h3><p>Koda başlamadan önce ürünün sayfaları, rolleri, veri modeli ve AI sorumlulukları belli olmalı.</p></div></div>
    <div class="feature-columns">
      <section class="feature-box"><h4>Kullanıcı rolleri</h4><ul>${b.roles.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="feature-box"><h4>Temel özellikler</h4><ul>${b.features.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="feature-box"><h4>AI özellikleri</h4><ul>${b.aiFeatures.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="feature-box"><h4>Ekranlar</h4><ul>${b.pages.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>
      <section class="feature-box"><h4>Seçilen stack</h4><ul>${profile.tools.map(id => `<li>${esc(builderState.data.tools[id]?.name || id)}</li>`).join('')}</ul></section>
      <section class="feature-box"><h4>Profesyonel minimum</h4><ul><li>Auth + authorization</li><li>Migration + backup</li><li>Observability</li><li>CI/CD + security checks</li><li>Rollback planı</li><li>Analytics + retention</li></ul></section>
    </div>`;
}

function renderBuilder() {
  const main = document.getElementById('builderMain');
  if (!main || !builderState.blueprint) return;
  let body = '';
  if (builderState.tab === 'architecture') body = renderArchitecture();
  if (builderState.tab === 'stages') body = renderStages();
  if (builderState.tab === 'tools') body = renderTools();
  if (builderState.tab === 'database') body = renderDatabase();
  if (builderState.tab === 'spec') body = renderSpec();
  const progress = completion();
  main.innerHTML = `${renderTop()}<div class="builder-view">${body}</div><div class="progress-float"><b>GENEL ÜRÜN İLERLEMESİ · ${progress.percent}%</b></div>`;
}

function openBuilder() {
  const dialog = document.getElementById('builderDialog');
  renderBuilder();
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
}

function closeBuilder() {
  const dialog = document.getElementById('builderDialog');
  if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
}

function bindBuilderEvents() {
  document.addEventListener('click', async event => {
    const open = event.target.closest('[data-builder-open]');
    if (open) return openBuilder();
    if (event.target.closest('[data-builder-close]')) return closeBuilder();

    const tab = event.target.closest('[data-builder-tab]');
    if (tab) { builderState.tab = tab.dataset.builderTab; renderBuilder(); return; }

    const node = event.target.closest('[data-arch-node]');
    if (node) { builderState.node = node.dataset.archNode; renderBuilder(); return; }

    const stage = event.target.closest('[data-builder-stage]');
    if (stage) { builderState.stage = Number(stage.dataset.builderStage) || 0; saveBuilderState(); renderBuilder(); return; }

    const toolJump = event.target.closest('[data-tool-jump]');
    if (toolJump) { builderState.tab = 'tools'; renderBuilder(); return; }

    const table = event.target.closest('[data-db-table]');
    if (table) { builderState.table = table.dataset.dbTable; renderBuilder(); return; }

    const copy = event.target.closest('[data-copy-stage-prompt]');
    if (copy) {
      const stageData = builderState.blueprint.stages[builderState.stage];
      try { await navigator.clipboard.writeText(stagePrompt(stageData)); toast('AI görev promptu kopyalandı.'); } catch { toast('Kopyalama izni verilemedi.'); }
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'builderProfile') {
      builderState.profile = event.target.value in builderState.data.toolProfiles ? event.target.value : 'minimum';
      saveBuilderState();
      renderBuilder();
      return;
    }
    if (event.target.matches('[data-builder-task]')) {
      builderState.completed[event.target.dataset.builderTask] = event.target.checked;
      saveBuilderState();
      renderBuilder();
    }
  });
}

async function initProductBuilder() {
  try {
    const data = await loadBlueprints();
    builderState.data = data;
    builderState.blueprint = data.blueprints[0];
    const saved = readBuilderState();
    if (saved.profile && saved.profile in data.toolProfiles) builderState.profile = saved.profile;
    if (Number.isInteger(saved.stage)) builderState.stage = saved.stage;
    if (saved.completed && typeof saved.completed === 'object') builderState.completed = saved.completed;
    injectBuilderShell();
    bindBuilderEvents();
  } catch (error) {
    console.error('Product builder could not initialize:', error);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProductBuilder, { once: true });
else initProductBuilder();
