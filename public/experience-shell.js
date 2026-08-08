const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

const oldSections=new Set(['basics','apps','models','ideas','method','security']);
const requestedOld=oldSections.has(location.hash.replace('#',''))||new URLSearchParams(location.search).get('guide')==='1';

function ensureStyles(){
  if(document.querySelector('link[data-experience-shell]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='/experience-shell.css';link.dataset.experienceShell='true';document.head.append(link);
}

function routeIntent(raw){
  const value=String(raw||'').trim();
  const q=value.toLocaleLowerCase('tr-TR');
  if(!value)return '/use/';
  if(/(oluştur|uygulama|site|web|dashboard|quiz|oyun|asistan|otomasyon|akış|landing|portföy|cv|menü|hesaplayıcı yap|program yap)/.test(q))return `/studio/?mode=simple&idea=${encodeURIComponent(value)}`;
  if(/(öğren|nedir|anlamak|eğitim|ders|yapay zeka|yapay zekâ|güvenlik öğren)/.test(q))return `/learn/?q=${encodeURIComponent(value)}`;
  return `/use/?q=${encodeURIComponent(value)}`;
}

function simplifyNav(){
  const nav=qs('.desktop-nav');
  if(nav)nav.innerHTML='<a href="/use/">Kullan</a><a href="/studio/?mode=simple">Oluştur</a><a href="/learn/">Öğren</a><a href="/account/">Hesabım</a>';
  const mobile=qs('.mobile-nav');
  if(mobile)mobile.innerHTML='<a href="/use/">Kullan</a><a href="/studio/?mode=simple">Oluştur</a><a href="/learn/">Öğren</a><a href="/account/">Hesabım</a>';
  const mark=qs('.wordmark');if(mark){mark.href='/';mark.setAttribute('aria-label','AI Pusula ana sayfa')}
}

function renderCleanHome(){
  const hero=qs('#top');const copy=qs('.hero-copy',hero);if(!hero||!copy)return;
  document.body.classList.add('experience-clean-home');
  copy.innerHTML=`
    <span class="experience-kicker">AI PUSULA · HEMEN BAŞLA</span>
    <h1 class="experience-title">Bir iş yap. Bir uygulama oluştur. İstersen nasıl çalıştığını öğren.</h1>
    <p class="experience-lead">Hazır araçları kullan veya fikrini birkaç adımda çalışan bir uygulamaya dönüştür. Teknik ayrıntılar yalnız istediğinde açılır.</p>
    <div class="experience-actions" aria-label="Ana yollar">
      <a class="experience-action" href="/use/"><span class="num">01 · KULLAN</span><strong>Hazır bir araç kullan</strong><small>PDF, fotoğraf, QR, metin, hesaplama, güvenlik ve günlük işler.</small></a>
      <a class="experience-action" href="/studio/?mode=simple"><span class="num">02 · OLUŞTUR</span><strong>Bir uygulama oluştur</strong><small>Ne istediğini yaz. Üç öneriden birini seç. Üç kısa soruyla çalışan sürümü üret.</small></a>
      <a class="experience-action" href="/learn/"><span class="num">03 · ÖĞREN</span><strong>Nasıl çalıştığını öğren</strong><small>İhtiyacın kadar ilerle: temel kavramlar, güvenlik, üretim ve çocuk modu.</small></a>
    </div>
    <form class="experience-intent" id="experienceIntentForm">
      <label class="sr-only" for="experienceIntent">Ne yapmak istiyorsun?</label>
      <input id="experienceIntent" autocomplete="off" placeholder="Örn. PDF küçültmek, fotoğraf düzeltmek, teklif hesaplayıcı yapmak...">
      <button type="submit">Beni doğru yere götür</button>
    </form>
    <p class="experience-examples">Ne yapmak istediğini normal cümleyle yaz. AI Pusula seni önce en kısa yola yönlendirir.</p>`;
  const form=qs('#experienceIntentForm');
  form?.addEventListener('submit',e=>{e.preventDefault();location.href=routeIntent(qs('#experienceIntent')?.value)});
  qs('.hero-map',hero)?.setAttribute('hidden','');
}

ensureStyles();simplifyNav();
if(!requestedOld)renderCleanHome();
else document.body.classList.remove('experience-clean-home');

export {routeIntent};
