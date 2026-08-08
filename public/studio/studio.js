import './studio-plus.js';
import './preview-runtime-v4.js';
import {families,templates,blocks,concepts,recommend,buildProject,improvePrompt,securityAudit,learningCard} from './studio-engine.js';
import {createTemplatePreview} from './template-previews.js';

const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const state={family:'tool',project:null};
const storeKey='ai-pusula-studio-v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{return {}}};
const save=patch=>localStorage.setItem(storeKey,JSON.stringify({...load(),...patch}));

function renderFamilies(){
  $('#familyButtons').innerHTML='';
  families.forEach(f=>{const label=document.createElement('label');label.className='choice';const input=document.createElement('input');input.type='radio';input.name='family';input.value=f.id;input.checked=f.id===state.family;input.addEventListener('change',()=>{state.family=f.id;save({family:f.id})});const strong=document.createElement('strong');strong.textContent=f.label;const p=document.createElement('p');p.textContent=f.promise;label.append(input,strong,p);$('#familyButtons').append(label)});
  const sel=$('#familyFilter');families.forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent=f.label;sel.append(o)});
}
function renderBlocks(){
  $('#blockGrid').innerHTML='';
  const saved=new Set(load().blocks||['form','storage','export']);
  blocks.forEach(b=>{const l=document.createElement('label');l.className=`block ${b.kind}`;const i=document.createElement('input');i.type='checkbox';i.value=b.id;i.checked=saved.has(b.id);i.addEventListener('change',()=>save({blocks:$$('#blockGrid input:checked').map(x=>x.value)}));const s=document.createElement('strong');s.textContent=b.label;const p=document.createElement('p');p.textContent=b.detail;const k=document.createElement('span');k.className='kind';k.textContent=b.kind==='local'?'HEMEN ÇALIŞIR':'BACKEND GEREKİR';l.append(i,s,p,k);$('#blockGrid').append(l)});
}
function renderTemplates(){
  const q=$('#templateSearch').value.trim().toLowerCase();const fam=$('#familyFilter').value;
  const list=templates.filter(t=>(fam==='all'||t.family===fam)&&(!q||`${t.title} ${families.find(f=>f.id===t.family)?.label}`.toLowerCase().includes(q)));
  $('#templateGrid').innerHTML='';$('#templateCount').textContent=String(list.length);
  list.forEach(t=>{const card=document.createElement('article');card.className='template-card';card.dataset.templateId=t.id;const preview=createTemplatePreview(t);const body=document.createElement('div');body.className='template-card-body';const h=document.createElement('strong');h.textContent=t.title;const meta=document.createElement('div');meta.className='template-meta';meta.textContent=`${families.find(f=>f.id===t.family)?.label} · ${t.level} · ~${t.minutes} dk`;body.append(h,meta);const b=document.createElement('button');b.className='button';b.textContent='Bu şablonla başla';b.addEventListener('click',()=>{state.family=t.family;$('#projectTitle').value=t.title;$('#purpose').value=`${t.title} için küçük, anlaşılır ve çalışan bir uygulama oluştur.`;$$('input[name=family]').forEach(x=>x.checked=x.value===t.family);save({family:t.family,title:t.title});$('#projectTitle').scrollIntoView({behavior:'smooth',block:'center'})});card.append(preview,body,b);$('#templateGrid').append(card)});
}
function renderRecommendation(){const r=recommend({level:$('#level').value,intent:$('#intent').value,time:$('#time').value});$('#modeBadge').textContent=r.mode;const box=$('#recommendation');box.innerHTML='';const intro=document.createElement('div');intro.className='recommend-card';intro.textContent=`Önerilen çalışma modu: ${r.mode}. ${r.steps.join(' → ')}`;box.append(intro);r.picks.forEach(p=>{const d=document.createElement('div');d.className='recommend-card';const b=document.createElement('button');b.className='button';b.textContent=`${p.title} ile başla`;b.addEventListener('click',()=>{state.family=p.family;$('#projectTitle').value=p.title;$('#purpose').value=`${p.title} ile ilk çalışan sürümü üret.`;$$('input[name=family]').forEach(x=>x.checked=x.value===p.family);$('#projectTitle').scrollIntoView({behavior:'smooth',block:'center'})});d.append(b);box.append(d)});save({level:$('#level').value,intent:$('#intent').value,time:$('#time').value})}
function renderProject(){
  const blocksSelected=$$('#blockGrid input:checked').map(x=>x.value);
  state.project=buildProject({family:state.family,title:$('#projectTitle').value,purpose:$('#purpose').value,audience:$('#audience').value,blocks:blocksSelected});
  const p=state.project.preview;const box=$('#preview');box.classList.remove('empty');box.innerHTML='';const title=document.createElement('div');title.className='preview-title';title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.purpose;const who=document.createElement('p');who.textContent=`Hedef kullanıcı: ${p.audience}`;const grid=document.createElement('div');grid.className='preview-grid';['Girdi','İş mantığı','Sonuç'].forEach(x=>{const c=document.createElement('div');c.className='preview-card';c.textContent=x;grid.append(c)});box.append(title,desc,who,grid);
  const arch=$('#architecture');arch.classList.remove('empty');arch.innerHTML='';if(!state.project.architecture.length){arch.textContent='Bu sürüm tamamen browser içinde çalışabilir. Seçili yerel bloklar: '+(p.localBlocks.join(', ')||'temel uygulama');}else state.project.architecture.forEach(x=>{const d=document.createElement('div');d.className='architecture-item';d.textContent=x;arch.append(d)});
  $('#codeView code').textContent=state.project.html;$('#downloadButton').disabled=false;$('#copyCodeButton').disabled=false;renderAudit();save({family:state.family,title:p.title,audience:p.audience,purpose:p.purpose,blocks:blocksSelected,lastBuild:Date.now()});
}
function renderAudit(){const a=securityAudit(state.project?.html||'');$('#securityScore').textContent=`${a.score}/100`;const box=$('#securityResults');box.innerHTML='';a.checks.forEach(c=>{const d=document.createElement('div');d.className=`security-item ${c.pass?'pass':'fail'}`;d.textContent=`${c.pass?'✓':'!'} ${c.label}`;box.append(d)})}
function downloadProject(){if(!state.project)return;const blob=new Blob([state.project.html],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=state.project.filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0)}
async function copyCode(){if(!state.project)return;try{await navigator.clipboard.writeText(state.project.html);$('#copyCodeButton').textContent='Kopyalandı';setTimeout(()=>$('#copyCodeButton').textContent='Kodu kopyala',1200)}catch{$('#copyCodeButton').textContent='Kopyalama engellendi'}}
function renderConcepts(){Object.keys(concepts).forEach(k=>{const b=document.createElement('button');b.textContent=concepts[k][0];b.addEventListener('click',()=>{const c=learningCard(k);const box=$('#conceptCard');box.innerHTML='';const h=document.createElement('strong');h.textContent=c.title;const p=document.createElement('p');p.textContent=c.simple;const ctx=document.createElement('p');ctx.textContent=`Bu projede: ${c.context}`;box.append(h,p,ctx)});$('#conceptButtons').append(b)})}
function restore(){const s=load();if(s.family&&families.some(f=>f.id===s.family))state.family=s.family;if(s.level)$('#level').value=s.level;if(s.intent)$('#intent').value=s.intent;if(s.time)$('#time').value=s.time;if(s.title)$('#projectTitle').value=s.title;if(s.audience)$('#audience').value=s.audience;if(s.purpose)$('#purpose').value=s.purpose}

restore();renderFamilies();renderBlocks();renderTemplates();renderConcepts();
$('#templateSearch').addEventListener('input',renderTemplates);$('#familyFilter').addEventListener('change',renderTemplates);$('#recommendButton').addEventListener('click',renderRecommendation);$('#buildButton').addEventListener('click',renderProject);$('#downloadButton').addEventListener('click',downloadProject);$('#copyCodeButton').addEventListener('click',copyCode);
$$('.prompt-mode').forEach(b=>b.addEventListener('click',()=>{$('#promptOutput').textContent=improvePrompt($('#promptInput').value,b.dataset.mode)}));
if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});
