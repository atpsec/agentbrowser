const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJson=v=>JSON.stringify(v).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const slug=v=>String(v||'uygulama').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'uygulama';

export const families=[
  {id:'web',label:'Web uygulaması',promise:'Tanıtım, katalog veya basit hizmet sayfası'},
  {id:'tool',label:'Mini araç',promise:'Girdi alıp anında yararlı çıktı üreten araç'},
  {id:'game',label:'Oyun',promise:'Puanlı ve oynanabilir mini oyun'},
  {id:'quiz',label:'Quiz',promise:'Soru, seçenek ve puan akışı'},
  {id:'dashboard',label:'Dashboard',promise:'Kartlar, durum ve ilerleme görünümü'},
  {id:'content',label:'İçerik',promise:'Plan, brief ve içerik taslağı'},
  {id:'automation',label:'Otomasyon',promise:'Adımları takip eden yerel iş akışı'},
  {id:'assistant',label:'AI asistanı',promise:'Harici API olmadan kural-tabanlı yerel asistan prototipi'}
];

const seeds={
  web:['Portföy','Kişisel CV','Ürün landing page','Etkinlik sayfası','Kurs tanıtımı','Restoran menüsü','Hizmet kataloğu','Topluluk sayfası','Proje vitrini','Sık sorulan sorular','Kampanya sayfası','Mini dokümantasyon'],
  tool:['Bütçe hesaplayıcı','Metin özet planlayıcı','Şifre kontrol listesi','Toplantı süre hesaplayıcı','Fiyat teklifi hesaplayıcı','Çalışma süresi planlayıcı','Risk puanlayıcı','Alışkanlık takipçisi','Kontrol listesi','Karar matrisi','İsim fikirleyici','Hedef parçalayıcı','Okuma planlayıcı'],
  game:['Kelime yakalama','Hazine avı','Matematik yarışı','Doğru-yanlış oyunu','Hafıza meydan okuması','Siber güvenlik oyunu','Uzay puan oyunu','Bilgi avı','Renk eşleme','Hızlı karar oyunu','Mini macera','Günlük görev oyunu'],
  quiz:['Ders quiz’i','Siber güvenlik quiz’i','Dil quiz’i','Onboarding quiz’i','Ürün bilgisi quiz’i','Mülakat hazırlık quiz’i','Genel kültür quiz’i','Matematik quiz’i','Bilim quiz’i','Tarih quiz’i','Kodlama quiz’i','Kişisel değerlendirme quiz’i','Mikro öğrenme quiz’i'],
  dashboard:['Kişisel hedef dashboard’u','Proje durum dashboard’u','SOC özet dashboard’u','Öğrenme ilerleme dashboard’u','İçerik takvimi dashboard’u','Satış takip dashboard’u','Alışkanlık dashboard’u','Risk dashboard’u','Kampanya dashboard’u','Takım görev dashboard’u','Bütçe dashboard’u','Müşteri özet dashboard’u'],
  content:['Video brief üretici','Podcast bölüm planı','Sosyal içerik planı','Blog taslak planı','Ders planı','Toplantı agenda üretici','Ürün açıklaması planı','E-posta kampanya planı','Sunum akışı','Hikâye taslağı','Teklif taslağı','Haftalık içerik takvimi','Araştırma planı'],
  automation:['Günlük iş akışı','Müşteri onboarding akışı','Release kontrol akışı','İçerik yayın akışı','Güvenlik inceleme akışı','Toplantı sonrası akış','Ödev çalışma akışı','Proje başlangıç akışı','Teklif hazırlama akışı','QA kontrol akışı','Haftalık plan akışı','Incident ilk müdahale akışı'],
  assistant:['SSS asistanı','Doküman yönlendirici','Çalışma koçu','Güvenli internet koçu','Müşteri talep yönlendirici','Proje fikir koçu','Toplantı karar koçu','Kod inceleme rehberi','Öğrenme asistanı','İçerik fikir asistanı','Risk açıklayıcı','Kariyer plan koçu','Ürün kapsam asistanı']
};
export const templates=Object.entries(seeds).flatMap(([family,names])=>names.map((title,i)=>({id:`${family}-${i+1}`,family,title,level:i%3===0?'Başlangıç':i%3===1?'Az kod':'Orta',minutes:[10,30,60,120][i%4]}))).slice(0,100);

export const blocks=[
  {id:'form',label:'Form',kind:'local',detail:'Kullanıcıdan metin veya sayı alır.'},
  {id:'storage',label:'Cihazda kayıt',kind:'local',detail:'localStorage ile bu cihazda veri tutar.'},
  {id:'search',label:'Arama / filtre',kind:'local',detail:'Listeyi cihaz içinde filtreler.'},
  {id:'export',label:'Dışa aktar',kind:'local',detail:'Sonucu metin dosyası olarak indirir.'},
  {id:'checklist',label:'Checklist',kind:'local',detail:'Tamamlanan adımları takip eder.'},
  {id:'auth',label:'Gerçek kullanıcı girişi',kind:'server',detail:'Auth servisi + server-side yetkilendirme gerektirir.'},
  {id:'database',label:'Bulut veritabanı',kind:'server',detail:'Kalıcı backend/veritabanı ve erişim politikası gerektirir.'},
  {id:'ai',label:'Harici AI modeli',kind:'server',detail:'API anahtarı server-side tutulmalı; kota ve veri politikası gerekir.'},
  {id:'payment',label:'Ödeme',kind:'server',detail:'Ödeme sağlayıcısı, webhook ve server-side abonelik durumu gerektirir.'},
  {id:'email',label:'E-posta gönderimi',kind:'server',detail:'Sunucu tarafı sağlayıcı ve abuse/rate-limit kontrolü gerektirir.'}
];

export const concepts={
  frontend:['Frontend','Kullanıcının gördüğü ekran ve etkileşim katmanıdır.','Bu projede form, buton, kart ve sonuç görünümüdür.'],
  backend:['Backend','Tarayıcının güvenli biçimde yapmaması gereken sunucu işlemleridir.','Gerçek hesap, ödeme, gizli API anahtarı ve ortak veri burada yaşar.'],
  api:['API','İki yazılımın kontrollü biçimde konuştuğu arayüzdür.','Harici AI veya ödeme bağlanırsa istek/yanıt sözleşmesi gerekir.'],
  database:['Database (veritabanı)','Kalıcı ve sorgulanabilir veri deposudur.','Birden fazla cihaz/kullanıcı aynı veriyi görecekse localStorage yerine gerekir.'],
  auth:['Authentication / Authorization','Kim olduğunu doğrulama ve ne yapabileceğini kontrol etmedir.','Login tek başına yetmez; her server işlemi yetki kontrolü yapmalıdır.'],
  ai:['AI model','Metin/görsel/kod gibi içerik üreten veya analiz eden modeldir.','Bu Studio harici modele veri yollamaz; gerçek entegrasyon server-side yapılmalıdır.'],
  test:['Test','Beklenen davranışın bozulmadığını otomatik doğrular.','Üretilen akışın temel girdileri, sınırları ve güvenlik varsayımları test edilmelidir.'],
  security:['Security (güvenlik)','Yetkisiz erişim, veri sızıntısı ve kötü girdiye karşı sınırlar bütünüdür.','Secret gizleme, input validation, CSP, rate limit ve authorization temel kapılardır.'],
  deploy:['Deploy (yayınlama)','Test edilmiş sürümü kullanıcıların erişebildiği ortama çıkarmaktır.','Önce staging/smoke test, sonra production ve rollback yolu gerekir.']
};

export function recommend({level='beginner',intent='build',time='30'}){
  const mins=Number(time)||30;
  const family=intent==='learn'?'quiz':intent==='work'?'tool':intent==='content'?'content':intent==='security'?'dashboard':intent==='game'?'game':'web';
  const picks=templates.filter(t=>t.family===family).sort((a,b)=>Math.abs(a.minutes-mins)-Math.abs(b.minutes-mins)).slice(0,3);
  const mode=level==='intermediate'?'Kod + mimari':level==='lowcode'?'Az kod + bloklar':'Adım adım';
  return {mode,picks,steps:['Bir şablon seç','Amacı ve kullanıcıyı yaz','Çalışan yerel blokları seç','Önizle ve güvenlik kontrolünü çalıştır','Tek dosya uygulamayı indir']};
}

function baseCss(){return `:root{font-family:Inter,system-ui,sans-serif;color:#161616;background:#f7f2e8}*{box-sizing:border-box}body{margin:0;padding:24px}main{max-width:860px;margin:auto}h1{font-size:clamp(2rem,7vw,4rem);margin:.2em 0}.card{border:3px solid #161616;background:#fff;padding:18px;margin:14px 0;box-shadow:6px 6px 0 #161616}button,input,textarea{font:inherit;border:2px solid #161616;padding:10px;background:#fff}button{cursor:pointer;font-weight:800;background:#ffd84d}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.muted{color:#555}.big{font-size:2rem;font-weight:900}progress{width:100%;height:22px}`}
function shell(title,body,script=''){return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"><title>${esc(title)}</title><style>${baseCss()}</style></head><body><main>${body}</main>${script?`<script>${script}</script>`:''}</body></html>`}
function commonHeader(c){return `<p class="muted">AI Pusula Studio ile oluşturuldu · Offline · ağ erişimi yok</p><h1>${esc(c.title)}</h1><p>${esc(c.purpose)}</p><div class="card"><strong>Hedef kullanıcı:</strong> ${esc(c.audience)}</div>`}
function generatedByFamily(c){
  const h=commonHeader(c); const data=safeJson({title:c.title,purpose:c.purpose,audience:c.audience});
  if(c.family==='web')return shell(c.title,`${h}<section class="card"><h2>Değer önerisi</h2><p>${esc(c.purpose)}</p><button id="cta">Başla</button><p id="msg" aria-live="polite"></p></section><section class="grid"><div class="card">Basit</div><div class="card">Hızlı</div><div class="card">Yerel</div></section>`,`document.querySelector('#cta').onclick=()=>document.querySelector('#msg').textContent='İlk adım hazır: ihtiyacını netleştir ve küçük başla.';`);
  if(c.family==='tool')return shell(c.title,`${h}<div class="card"><label>Girdi<textarea id="in" rows="6"></textarea></label><br><button id="run">Çalıştır</button></div><div class="card" id="out" aria-live="polite">Sonuç burada görünecek.</div>`,`document.querySelector('#run').onclick=()=>{const v=document.querySelector('#in').value.trim();document.querySelector('#out').textContent=v?('Özetlenen girdi: '+v.slice(0,220)+(v.length>220?'…':'')):'Önce bir girdi yaz.'};`);
  if(c.family==='game')return shell(c.title,`${h}<div class="card"><div class="big">Puan: <span id="score">0</span></div><p>30 saniyelik prototip: hedefe her tıklamada puan kazan.</p><button id="hit">Hedefi yakala</button></div>`,`let s=0;document.querySelector('#hit').onclick=()=>document.querySelector('#score').textContent=String(++s);`);
  if(c.family==='quiz')return shell(c.title,`${h}<div class="card" id="q"><h2>Mini quiz</h2><p>${esc(c.purpose)} için en iyi ilk adım hangisi?</p><button data-a="1">Küçük bir hedef belirlemek</button> <button data-a="0">Her şeyi aynı anda yapmak</button><p id="answer"></p></div>`,`document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>document.querySelector('#answer').textContent=b.dataset.a==='1'?'Doğru. Küçük ve doğrulanabilir adımlar daha güvenlidir.':'Tekrar düşün: kapsamı küçültmek işleri kolaylaştırır.');`);
  if(c.family==='dashboard')return shell(c.title,`${h}<div class="grid"><div class="card"><div class="big">3</div>Aktif iş</div><div class="card"><div class="big">72%</div>İlerleme</div><div class="card"><div class="big">1</div>Risk</div></div><div class="card"><label>İlerleme <progress value="72" max="100">72%</progress></label></div>`);
  if(c.family==='content')return shell(c.title,`${h}<div class="card"><h2>İçerik akışı</h2><ol><li>Hook: problemi tek cümlede söyle</li><li>Değer: 3 somut nokta ver</li><li>Kanıt: küçük örnek ekle</li><li>CTA: tek sonraki adım iste</li></ol></div><div class="card"><strong>Tema:</strong> ${esc(c.purpose)}</div>`);
  if(c.family==='automation')return shell(c.title,`${h}<div class="card"><h2>Yerel iş akışı</h2><label><input type="checkbox"> Girdiyi kontrol et</label><br><label><input type="checkbox"> Ana işi tamamla</label><br><label><input type="checkbox"> Sonucu doğrula</label><br><label><input type="checkbox"> Çıktıyı kaydet</label><p id="done"></p></div>`,`document.querySelectorAll('input').forEach(x=>x.onchange=()=>{const all=[...document.querySelectorAll('input')];document.querySelector('#done').textContent=all.every(i=>i.checked)?'Akış tamamlandı.':'Kalan adım: '+all.filter(i=>!i.checked).length;});`);
  return shell(c.title,`${h}<div class="card"><label>Sorun veya hedef<textarea id="ask" rows="5"></textarea></label><br><button id="askBtn">Rehberlik et</button></div><div class="card" id="reply">Bu prototip harici AI servisi kullanmaz.</div>`,`const meta=${data};document.querySelector('#askBtn').onclick=()=>{const q=document.querySelector('#ask').value.trim();document.querySelector('#reply').textContent=q?('Önce hedefi küçült: '+q.slice(0,120)+'. Sonra tek bir başarı ölçütü ve bir test belirle.'):'Bir hedef yaz.'};`);
}

export function buildProject(config={}){
  const family=families.some(f=>f.id===config.family)?config.family:'tool';
  const c={family,title:String(config.title||'Benim uygulamam').slice(0,80),purpose:String(config.purpose||'Küçük bir işi daha kolay yapmak').slice(0,280),audience:String(config.audience||'Genel kullanıcı').slice(0,120)};
  const html=generatedByFamily(c);
  const selected=(config.blocks||[]).map(id=>blocks.find(b=>b.id===id)).filter(Boolean);
  const local=selected.filter(b=>b.kind==='local'); const server=selected.filter(b=>b.kind==='server');
  return {filename:`${slug(c.title)}-offline.html`,html,preview:{...c,localBlocks:local.map(x=>x.label),serverBlocks:server.map(x=>x.label)},architecture:server.map(x=>`${x.label}: ${x.detail}`)};
}

export function improvePrompt(input,mode='pro'){
  const goal=String(input||'Bir uygulama oluştur').trim().slice(0,600);
  if(mode==='simple')return `Amaç: ${goal}\nÇıktı: Çalışan en küçük örnek.\nKural: Gereksiz özellik ekleme.`;
  if(mode==='good')return `Rol: Deneyimli ürün geliştirici.\nAmaç: ${goal}\nKullanıcı: Teknik olmayan başlangıç kullanıcısı.\nÇıktı: Önce kısa plan, sonra çalışan küçük örnek, sonra test listesi.\nSınır: Secret hardcode etme; kullanıcı girdisini doğrula.`;
  return `Rol: Güvenlik odaklı kıdemli full-stack geliştirici.\nHedef: ${goal}\nBağlam: Başlangıçtan orta seviyeye ilerleyen kullanıcı için üretim.\nTeslimat: 1) kapsam 2) dosyalar 3) çalışan implementasyon 4) testler 5) güvenlik kontrolleri 6) rollback.\nKabul kriteri: Mobil uyumlu, klavye erişilebilir, hata durumları tanımlı, gizli anahtarlar yalnız server-side, authorization her hassas işlemde server-side, input validation ve güvenli loglama var.\nYasak: Uydurma API sonucu, hardcoded secret, eval/new Function, testleri atlama.`;
}

export function securityAudit(html=''){
  const s=String(html); const checks=[
    ['Ağ erişimi kapalı',/connect-src 'none'/.test(s)],
    ['Harici URL yok',!/(https?:\/\/|\/\/cdn\.)/i.test(s)],
    ['eval yok',!/\beval\s*\(/.test(s)],
    ['new Function yok',!/new\s+Function/.test(s)],
    ['Inline event attribute yok',!/<[^>]+\son[a-z]+\s*=/i.test(s)],
    ['Secret benzeri anahtar yok',!/(sk-[A-Za-z0-9]{12,}|AKIA[0-9A-Z]{16}|PRIVATE KEY)/.test(s)],
    ['Object ve form dışarı kapalı',/object-src 'none'/.test(s)&&/form-action 'none'/.test(s)]
  ];
  return {score:Math.round(checks.filter(x=>x[1]).length/checks.length*100),checks:checks.map(([label,pass])=>({label,pass}))};
}

export function learningCard(key){const x=concepts[key]||concepts.frontend;return {title:x[0],simple:x[1],context:x[2]};}
