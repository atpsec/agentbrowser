import {templates,families} from './studio-engine.js';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const normalize=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const familyLabel=id=>families.find(f=>f.id===id)?.label||id;
const params=new URLSearchParams(location.search);
let mode=params.get('mode')==='advanced'?'advanced':'simple';
let selected=null;
let previewHome=null;

const familyHints={
  web:['site','web','portfoy','cv','landing','menu','etkinlik','sayfa','katalog','kampanya'],
  tool:['hesap','butce','fiyat','metin','sifre','risk','plan','takip','liste','karar','sure'],
  game:['oyun','game','yaris','macera','av','esleme'],
  quiz:['quiz','sinav','soru','degerlendirme','test'],
  dashboard:['dashboard','panel','takip','ozet','durum','soc'],
  content:['icerik','blog','video','podcast','sunum','hikaye','e-posta','email','brief','agenda'],
  automation:['otomasyon','akis','workflow','onboarding','release','qa','incident','surec'],
  assistant:['asistan','koc','rehber','yonlendirici','aciklayici','assistant']
};

function scoreTemplate(t,raw){
  const q=normalize(raw);if(!q)return 0;
  const words=q.split(/\s+/).filter(w=>w.length>1);const title=normalize(t.title);let score=0;
  words.forEach(w=>{if(title.includes(w))score+=7});
  for(const [family,hints] of Object.entries(familyHints)){
    const hits=hints.filter(h=>q.includes(h)).length;if(family===t.family)score+=hits*5;
  }
  if(title===q)score+=20;return score;
}
function recommend(raw){
  const scored=templates.map(t=>({t,s:scoreTemplate(t,raw)})).sort((a,b)=>b.s-a.s||a.t.minutes-b.t.minutes);
  const positive=scored.filter(x=>x.s>0).slice(0,3).map(x=>x.t);
  if(positive.length===3)return positive;
  const fallback=[templates.find(t=>t.title==='Fiyat teklifi hesaplayıcı'),templates.find(t=>t.title==='Ürün landing page'),templates.find(t=>t.title==='Toplantı karar koçu')].filter(Boolean);
  return [...positive,...fallback.filter(t=>!positive.some(p=>p.id===t.id))].slice(0,3);
}

function setNav(){
  const nav=$('.topbar nav');if(nav){nav.className='studio-experience-nav';nav.innerHTML='<a href="/use/">Kullan</a><a href="/studio/?mode=simple" aria-current="page">Oluştur</a><a href="/learn/">Öğren</a><a href="/account/">Hesabım</a>'}
  const brand=$('.topbar .brand');if(brand)brand.href='/';
}
function updateHero(next){
  const hero=$('.hero');if(!hero)return;
  const eyebrow=hero.querySelector('.eyebrow');const title=hero.querySelector('h1');const lead=hero.querySelector('.lead');
  if(next==='simple'){
    if(eyebrow)eyebrow.textContent='OLUŞTUR · BASİT MOD';
    if(title)title.textContent='Ne yapmak istediğini söyle. Gerisini adım adım daraltalım.';
    if(lead)lead.textContent='Önce üç öneri gör. Birini seç. Üç kısa soruyla çalışan sürümü üret. Kod ve mimari yalnız istersen açılır.';
  }else{
    if(eyebrow)eyebrow.textContent='ÜRETİM STÜDYOSU · GELİŞMİŞ MOD';
    if(title)title.textContent='Fikri seç. Adım adım üret. Çalıştır. İndir.';
    if(lead)lead.textContent='Şablonlar, Build Blocks, mimari, güvenlik, kod ve production ayrıntıları açık.';
  }
}
function placePreview(next){
  const preview=$('#preview');if(!preview)return;
  if(next==='simple')$('#simplePreviewWrap')?.append(preview);
  else previewHome?.append(preview);
}
function setMode(next,{push=true}={}){
  mode=next;document.body.classList.toggle('studio-simple-mode',next==='simple');document.body.classList.toggle('studio-advanced-mode',next==='advanced');
  updateHero(next);placePreview(next);
  $$('[data-studio-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.studioMode===next));
  if(push){const url=new URL(location.href);url.searchParams.set('mode',next);history.replaceState({},'',url)}
}
function progress(step){
  const labels=['Fikir','Oluştur','Test et','Kullan'];
  $$('.experience-progress span').forEach((el,i)=>{el.classList.toggle('is-done',i<step);el.classList.toggle('is-active',i===step);el.textContent=labels[i]});
}

function renderRecommendations(raw){
  const box=$('#simpleRecommendations');box.replaceChildren();const picks=recommend(raw);
  picks.forEach(t=>{
    const b=document.createElement('button');b.type='button';b.className='simple-recommendation';b.dataset.template=t.id;
    const fam=document.createElement('span');fam.className='family';fam.textContent=familyLabel(t.family);
    const strong=document.createElement('strong');strong.textContent=t.title;
    const small=document.createElement('small');small.textContent=`${t.level} · yaklaşık ${t.minutes} dk`;
    b.append(fam,strong,small);b.addEventListener('click',()=>selectTemplate(t));box.append(b);
  });
  $('#simpleRecommendCard').hidden=false;progress(1);
}
function selectTemplate(t){
  selected=t;$('#simpleQuestions').hidden=false;$('#simpleAppName').value=t.title;
  if(!$('#simpleAudience').value)$('#simpleAudience').value='Bu işi daha hızlı yapmak isteyen kullanıcı';
  $('#simpleOutcome').value=`${t.title} ile kullanıcıdan gerekli bilgileri alıp anlaşılır ve kullanışlı bir sonuç üret.`;
  $$('.simple-recommendation').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.template===t.id)));
  progress(1);$('#simpleQuestions').scrollIntoView({behavior:'smooth',block:'center'});
}
function applyToEngine(){
  const title=$('#simpleAppName').value.trim()||selected?.title||'Benim Uygulamam';
  const audience=$('#simpleAudience').value.trim()||'Bu araca ihtiyacı olan kullanıcı';
  const purpose=$('#simpleOutcome').value.trim()||`${title} için çalışan küçük bir uygulama oluştur.`;
  $('#projectTitle').value=title;$('#audience').value=audience;$('#purpose').value=purpose;
  const radio=$(`input[name="family"][value="${selected?.family||'tool'}"]`);if(radio){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}))}
  progress(2);$('#buildButton').click();window.setTimeout(showReady,80);
}
function showReady(){
  const ready=$('#simpleReady');ready.hidden=false;
  const score=$('#securityScore')?.textContent||'—';$('#simpleSecurityScore').textContent=score;
  progress(3);ready.scrollIntoView({behavior:'smooth',block:'start'});
}
function buildSimpleUI(){
  const hero=$('.hero');
  const section=document.createElement('section');section.id='simpleStudio';section.innerHTML=`
    <div class="simple-studio-shell">
      <div class="simple-mode-row">
        <div><strong>Basit Studio</strong><div class="simple-mode-copy">Aynı anda yalnız bir sonraki karar görünür.</div></div>
        <div class="experience-mode-switch" aria-label="Studio modu"><button type="button" data-studio-mode="simple">Basit mod</button><button type="button" data-studio-mode="advanced">Gelişmiş mod</button></div>
      </div>
      <div class="experience-progress" aria-label="Üretim ilerlemesi"><span class="is-active">Fikir</span><span>Oluştur</span><span>Test et</span><span>Kullan</span></div>
      <article class="simple-flow-card" id="simpleIdeaCard">
        <span class="eyebrow">1 · FİKRİNİ YAZ</span><h2>Ne yapmak istiyorsun?</h2><p>Teknik terim kullanmana gerek yok. Normal bir cümle yeterli.</p>
        <form class="simple-idea-form" id="simpleIdeaForm"><input id="simpleIdea" autocomplete="off" maxlength="180" placeholder="Örn. müşteriye hızlı fiyat teklifi hazırlamak istiyorum"><button type="submit">Bana 3 öneri ver</button></form>
        <div class="simple-examples">Örnek: portföy sitesi · bütçe hesaplayıcı · siber güvenlik quiz'i · toplantı karar asistanı</div>
      </article>
      <article class="simple-flow-card" id="simpleRecommendCard" hidden>
        <span class="eyebrow">2 · BİRİNİ SEÇ</span><h2>Sana uygun 3 başlangıç</h2><p>Yüz şablonun tamamını görmek zorunda değilsin. En yakın üç seçeneği öne çıkarıyoruz.</p><div class="simple-recommendations" id="simpleRecommendations"></div>
        <a href="#templates" class="simple-template-link" id="showAllTemplates">Tüm 100 şablonu keşfet →</a>
      </article>
      <article class="simple-flow-card" id="simpleQuestions" hidden>
        <span class="eyebrow">3 · ÜÇ KISA SORU</span><h2>Uygulamayı netleştir</h2><p>Bu bilgiler ilk çalışan sürüm için yeterli.</p>
        <div class="simple-question-grid"><label>Uygulamanın adı<input id="simpleAppName" maxlength="80"></label><label>Kim kullanacak?<input id="simpleAudience" maxlength="120" placeholder="Örn. küçük işletme sahibi"></label><label class="wide">Sonuçta ne yapabilmeli?<textarea id="simpleOutcome" maxlength="280"></textarea></label></div>
        <div class="simple-actions"><button type="button" class="simple-build-button" id="simpleBuild">Uygulamayı oluştur</button><button type="button" class="simple-secondary" id="backToIdea">Fikri değiştir</button></div>
      </article>
      <article class="simple-flow-card simple-ready" id="simpleReady" hidden>
        <div class="simple-ready-head"><div><span class="eyebrow">HAZIR</span><h2>İlk çalışan sürümün hazır.</h2><p>Önce kullan. Sonra gerekiyorsa geliştir.</p></div><span class="simple-ready-badge">LOCAL-FIRST</span></div>
        <div class="simple-preview-wrap" id="simplePreviewWrap"></div>
        <div class="simple-security-line"><span>Otomatik güvenlik kontrolü</span><strong id="simpleSecurityScore">—</strong></div>
        <div class="simple-actions"><button type="button" class="simple-build-button" id="simpleDownload">Offline HTML indir</button><button type="button" class="simple-secondary" id="simpleDevelop">Geliştir</button><a class="simple-secondary" href="/launch/">Yayınlamaya hazırlan</a></div>
        <p class="simple-note">Offline dosya cihazında çalışır. Gerçek hesap, database, harici AI veya ödeme seçersen bunlar ayrı server-side production adımlarıdır; Studio bunları sahte biçimde aktif göstermez.</p>
      </article>
    </div>`;
  hero?.after(section);
  const preview=$('#preview');if(preview)previewHome=preview.parentElement;
  const advancedBar=document.createElement('div');advancedBar.className='mode-bar-advanced';advancedBar.innerHTML='<div class="experience-mode-switch" aria-label="Studio modu"><button type="button" data-studio-mode="simple">Basit mod</button><button type="button" data-studio-mode="advanced">Gelişmiş mod</button></div>';hero?.before(advancedBar);
}

setNav();buildSimpleUI();setMode(mode,{push:false});progress(0);
$$('[data-studio-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.studioMode)));
$('#simpleIdeaForm')?.addEventListener('submit',e=>{e.preventDefault();const value=$('#simpleIdea').value.trim();if(value)renderRecommendations(value)});
$('#simpleBuild')?.addEventListener('click',()=>{if(selected)applyToEngine()});
$('#backToIdea')?.addEventListener('click',()=>{$('#simpleQuestions').hidden=true;$('#simpleIdea').focus();progress(0)});
$('#simpleDownload')?.addEventListener('click',()=>$('#downloadButton').click());
$('#simpleDevelop')?.addEventListener('click',()=>{setMode('advanced');$('#projectTitle').scrollIntoView({behavior:'smooth',block:'center'})});
$('#showAllTemplates')?.addEventListener('click',e=>{e.preventDefault();setMode('advanced');location.hash='templates';$('#templates').scrollIntoView({behavior:'smooth',block:'start'})});

const initialIdea=params.get('idea');if(initialIdea){$('#simpleIdea').value=initialIdea;renderRecommendations(initialIdea)}
