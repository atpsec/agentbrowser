import{getDemoSession,setDemoSession,clearDemoSession}from'/demo-session.js';
const $=s=>document.querySelector(s);const demoUser={id:'demo-user-001',name:'Demo Kullanıcı',email:'demo@aipusula.local',plan:'Demo Pro'};
function render(){const s=getDemoSession(),profile=$('#profile'),logout=$('#logout');if(s){profile.hidden=false;profile.textContent=`${s.name} · ${s.email} · ${s.plan||'Demo'}`;logout.hidden=false;$('#authStatus').textContent='Demo oturumu aktif. Uygulamalara geçebilirsin.';$('#demoLogin').textContent='Demo oturumunu yenile'}else{profile.hidden=true;logout.hidden=true;$('#authStatus').textContent='Henüz demo oturumu yok.';$('#demoLogin').textContent='Demo kullanıcı olarak giriş yap'}}
$('#demoLogin').addEventListener('click',()=>{setDemoSession(demoUser);localStorage.setItem('ai-pusula-demo-data-v1',JSON.stringify({users:42,projects:12,workspace:'Demo Teknoloji',recent:['PhotoFix kampanya görseli','PDF Toolbox teklif dosyası','QR Maker Wi-Fi kartı']}));render()});
$('#googleLogin').addEventListener('click',()=>location.assign('/login/'));
$('#logout').addEventListener('click',()=>{clearDemoSession();render()});
render();