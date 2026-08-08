const STYLE_HREF='/platform-pwa.css';
if(!document.querySelector(`link[href="${STYLE_HREF}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=STYLE_HREF;document.head.append(link)}

let deferredInstall=null;
const canStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
function makeButton(){if(document.querySelector('.pwa-install')||canStandalone())return;const box=document.createElement('div');box.className='pwa-install';box.innerHTML='<span>AI PUSULA · UYGULAMA</span><button type="button">Cihaza yükle</button>';const button=box.querySelector('button');button.addEventListener('click',async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice.catch(()=>null);deferredInstall=null;box.hidden=true;return}showHelp()});document.body.append(box)}
function showHelp(){let panel=document.querySelector('.pwa-help');if(panel){panel.hidden=false;return}panel=document.createElement('aside');panel.className='pwa-help';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Uygulama kurulum yardımı');const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);panel.innerHTML=`<h2>AI Pusula'yı cihazına ekle</h2><p>${ios?'Safari paylaş menüsünden “Ana Ekrana Ekle” seçeneğini kullan.':'Tarayıcı menüsündeki “Uygulamayı yükle / Install app” seçeneğini kullan. Destekleyen tarayıcılarda kurulum istemi otomatik görünür.'}</p><p>Kurulumdan sonra uygulama ayrı pencere olarak açılır; temel sayfalar service worker ile offline kullanılabilir.</p><button type="button">Kapat</button>`;panel.querySelector('button').addEventListener('click',()=>panel.hidden=true);document.body.append(panel)}
addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;makeButton()});
addEventListener('appinstalled',()=>{deferredInstall=null;document.querySelector('.pwa-install')?.remove()});
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{}))}
addEventListener('DOMContentLoaded',makeButton);
