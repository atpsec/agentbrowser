const tools=[
{id:'photo',title:'Fotoğrafı düzenle',desc:'Onar, kırp, profil fotoğrafı hazırla, arka planı sadeleştir veya kolaj oluştur.',href:'/easy/photo-studio/',tags:['fotoğraf','foto','resim','görsel','profil','pasaport','arka plan','kolaj','onar','düzelt','slim'],tone:'coral'},
{id:'pdf',title:'PDF işlemi yap',desc:'PDF birleştir, böl veya yapısal olarak optimize et.',href:'/easy/pdf/',tags:['pdf','birleştir','böl','küçült','optimize','dosya'],tone:'yellow'},
{id:'qr',title:'QR kod oluştur',desc:'Metin veya bağlantı için QR kodu cihazında üret.',href:'/easy/qr/',tags:['qr','karekod','kod','link','bağlantı'],tone:'blue'},
{id:'password',title:'Güçlü şifre üret',desc:'Web Crypto ile cihazında güvenli parola üret.',href:'/toolbox/',tags:['şifre','parola','password','güvenlik','crypto'],tone:'green'},
{id:'text',title:'Metni düzenle',desc:'Metin temizle, kelime say, slug üret, satırları sırala veya karşılaştır.',href:'/toolbox/',tags:['metin','yazı','kelime','karakter','slug','temizle','düzenle','text'],tone:'blue'},
{id:'calc',title:'Hesaplama yap',desc:'Yüzde, KDV, bütçe, faiz, maaş, yakıt ve daha birçok hesap.',href:'/toolbox/',tags:['hesap','hesapla','yüzde','kdv','bütçe','faiz','maaş','yakıt','para','fiyat'],tone:'yellow'},
{id:'security',title:'Güvenlik aracını aç',desc:'Risk, şifre, IP ve tarayıcı kabiliyetleri gibi yerel güvenlik yardımcıları.',href:'/toolbox/',tags:['güvenlik','siber','risk','ip','tarayıcı','security'],tone:'green'},
{id:'daily',title:'Günlük işini hızlandır',desc:'Alışveriş, seyahat, kontrol listesi, takip ve günlük yardımcılar.',href:'/toolbox/',tags:['günlük','alışveriş','seyahat','liste','takip','ev','aile','iş'],tone:'coral'},
{id:'apps',title:'Hazır uygulamaları kullan',desc:'Phishing açıklayıcı, CVE önceliklendirici, toplantı kararları ve diğer ürünler.',href:'/apps/',tags:['phishing','cve','soc','politika','doküman','toplantı','uygulama'],tone:'blue'}
];
const normalize=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const results=document.querySelector('#toolResults');
const input=document.querySelector('#toolSearch');
const summary=document.querySelector('#resultSummary');

function score(tool,q){
  if(!q)return tool.id==='photo'||tool.id==='pdf'||tool.id==='qr'?10:1;
  const words=normalize(q).split(/\s+/).filter(Boolean);const hay=normalize(`${tool.title} ${tool.desc} ${tool.tags.join(' ')}`);
  return words.reduce((n,w)=>n+(hay.includes(w)?4:0),0)+(tool.tags.some(t=>normalize(q).includes(normalize(t)))?6:0);
}
function card(tool){
  const a=document.createElement('a');a.className='experience-tool-card';a.dataset.tone=tool.tone;a.href=tool.href;
  const tag=document.createElement('span');tag.className='tag';tag.textContent='HAZIR ARAÇ';
  const strong=document.createElement('strong');strong.textContent=tool.title;
  const p=document.createElement('p');p.textContent=tool.desc;
  const go=document.createElement('span');go.className='go';go.textContent='Aracı aç →';
  a.append(tag,strong,p,go);return a;
}
function render(raw=''){
  const q=String(raw||'').trim();
  const ranked=tools.map(t=>({t,s:score(t,q)})).sort((a,b)=>b.s-a.s).filter(x=>!q||x.s>0).slice(0,q?6:6);
  results.replaceChildren();
  if(!ranked.length){const box=document.createElement('div');box.className='experience-empty';box.textContent='Buna birebir uyan hazır araç bulamadım. Her Şey Kutusu’nda daha geniş arama yapabilir veya kendi uygulamanı oluşturabilirsin.';results.append(box);summary.textContent='Hazır araç bulunamadı.';return}
  ranked.forEach(({t})=>results.append(card(t)));
  summary.textContent=q?`“${q}” için en kısa yolları öne çıkardım.`:'En sık kullanılan araçlardan başla veya ne yapmak istediğini yaz.';
}
const params=new URLSearchParams(location.search);const initial=params.get('q')||'';input.value=initial;render(initial);
document.querySelector('#toolSearchForm')?.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();const url=new URL(location.href);if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');history.replaceState({},'',url);render(q)});
input.addEventListener('input',()=>{if(input.value.trim().length===0)render('')});
