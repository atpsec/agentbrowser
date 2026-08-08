import {explainTopic,makeStory,makeQuiz,makeGame,codingLesson,cyberScenarios,mathCoach,homeworkCoach,experiments,getExperiment,creativeStudio,dailyPlan,teacherPack,parentSummary} from './kids-engine.js';

const $=s=>document.querySelector(s);const stateKey='ai-pusula-kids-v1';
let state={completed:0,quiz:0,game:0,cyber:0};try{state={...state,...JSON.parse(localStorage.getItem(stateKey)||'{}')}}catch{}
const age=()=>Math.max(6,Math.min(16,Number($('#ageInput').value)||10));
const interest=()=>$('#interestInput').value.trim()||'merak';
const save=()=>{localStorage.setItem(stateKey,JSON.stringify(state));renderProgress()};
const done=(kind)=>{state.completed=(state.completed||0)+1;if(kind)state[kind]=(state[kind]||0)+1;save()};
function renderProgress(){$('#progressValue').textContent=String(state.completed||0);$('#progressBar').value=Math.min(20,state.completed||0)}
function toast(t){const n=$('#toast');n.textContent=t;n.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>n.hidden=true,1800)}
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function renderResult(root,data){root.replaceChildren();root.append(node('h3',data.title||'Sonuç','result-title'));if(data.summary)root.append(node('p',data.summary));for(const sec of data.sections||[]){const box=node('section',undefined,'result-section');box.append(node('h3',sec.title));const ul=node('ul');for(const item of sec.items||[])ul.append(node('li',item));box.append(ul);root.append(box)}if(data.items){const ul=node('ul');for(const item of data.items)ul.append(node('li',item));root.append(ul)}}
function scrollToModule(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}

document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>scrollToModule(b.dataset.open)));
$('#ageInput').addEventListener('change',()=>{if(Number($('#ageInput').value)<6)$('#ageInput').value=6;if(Number($('#ageInput').value)>16)$('#ageInput').value=16});
$('#resetProgress').addEventListener('click',()=>{state={completed:0,quiz:0,game:0,cyber:0};save();toast('Bu cihazdaki ilerleme sıfırlandı.')});

$('#learnRun').addEventListener('click',()=>{renderResult($('#learnOut'),explainTopic({topic:$('#learnTopic').value,known:$('#learnKnown').value,age:age()}));done()});
$('#storyRun').addEventListener('click',()=>{renderResult($('#storyOut'),makeStory({topic:$('#storyTopic').value,hero:$('#storyHero').value,age:age()}));done()});

$('#quizRun').addEventListener('click',()=>{try{const data=makeQuiz({source:$('#quizSource').value,count:$('#quizCount').value,age:age()});const root=$('#quizOut');root.replaceChildren(node('h3',data.title,'result-title'),node('p',data.summary));data.questions.forEach((q,i)=>{const card=node('section',undefined,'quiz-card');card.append(node('b',`${i+1}. ${q.q}`));const input=node('input');input.placeholder='Cevabını yaz';const check=node('button','Kontrol et');check.type='button';const fb=node('p','', 'feedback');check.addEventListener('click',()=>{const ok=input.value.trim().toLowerCase()===q.answer.toLowerCase();fb.textContent=ok?`Doğru. ${q.explain}`:`Tekrar dene. İpucu: kelime ${q.answer.length} harf.`;if(ok){check.disabled=true;done('quiz')}});card.append(input,check,fb);root.append(card)})}catch(e){toast(e.message)}});

let activeGame=null,gameIndex=0,gameScore=0;
function renderGameQuestion(){const root=$('#gameOut');root.replaceChildren();if(!activeGame)return;if(gameIndex>=activeGame.questions.length){root.append(node('h3','Oyun tamamlandı!','result-title'),node('p',`Puan: ${gameScore}`));done('game');return}const q=activeGame.questions[gameIndex];root.append(node('h3',activeGame.title,'result-title'),node('p',`${gameIndex+1}/${activeGame.questions.length} · ${q.q}`));const input=node('input');input.placeholder='Cevap';const btn=node('button','Cevabı kilitle');btn.type='button';const fb=node('p','', 'feedback');btn.addEventListener('click',()=>{const ok=input.value.trim().toLowerCase()===q.a.toLowerCase();if(ok){gameScore+=q.points;fb.textContent=`Doğru! +${q.points} puan`;btn.disabled=true;setTimeout(()=>{gameIndex++;renderGameQuestion()},550)}else fb.textContent='Yaklaştın. Başka bir cevap dene.'});root.append(input,btn,fb)}
$('#gameBuild').addEventListener('click',()=>{activeGame=makeGame({theme:$('#gameTheme').value,hero:$('#gameHero').value});gameIndex=0;gameScore=0;renderGameQuestion()});

$('#codeRun').addEventListener('click',()=>{const d=codingLesson({age:age()});const root=$('#codeOut');root.replaceChildren(node('h3',d.title,'result-title'),node('pre',d.code.join('\n'),'code-block'),node('p',`Görev: ${d.task}`),node('p',d.output));done()});

let cyberIndex=0;function renderCyber(){const s=cyberScenarios[cyberIndex%cyberScenarios.length],root=$('#cyberOut');root.replaceChildren(node('h3',s.title,'result-title'),node('p',s.message));const safe=node('button','Güvenli');const suspicious=node('button','Şüpheli');safe.type=suspicious.type='button';const fb=node('p','', 'feedback');const answer=v=>{const ok=v===s.safe;fb.textContent=`${ok?'Doğru':'Tekrar düşün'} · ${s.why}`;safe.disabled=suspicious.disabled=true;if(ok)done('cyber');const next=node('button','Sonraki senaryo');next.type='button';next.addEventListener('click',()=>{cyberIndex++;renderCyber()});root.append(next)};safe.addEventListener('click',()=>answer(true));suspicious.addEventListener('click',()=>answer(false));root.append(safe,suspicious,fb)}renderCyber();

$('#mathRun').addEventListener('click',()=>{const d=mathCoach({problem:$('#mathProblem').value,age:age()}),root=$('#mathOut');root.replaceChildren(node('h3',d.title,'result-title'),node('p',d.summary));const ol=node('ol');for(const h of d.hints||[])ol.append(node('li',h));root.append(ol);if(d.answer){const reveal=node('button','Cevabı kontrol için göster');reveal.type='button';reveal.addEventListener('click',()=>{reveal.replaceWith(node('p',`Kontrol cevabı: ${d.answer}`,'feedback'));done()});root.append(reveal)}});
$('#homeworkRun').addEventListener('click',()=>{try{renderResult($('#homeworkOut'),homeworkCoach({question:$('#homeworkQuestion').value}));done()}catch(e){toast(e.message)}});

for(const e of experiments){const o=node('option',e.title);o.value=e.id;$('#experimentSelect').append(o)}
$('#scienceRun').addEventListener('click',()=>{const e=getExperiment($('#experimentSelect').value),root=$('#scienceOut');root.replaceChildren(node('h3',e.title,'result-title'));const badges=node('p');badges.append(node('span',e.age,'badge'),node('span',`${e.minutes} dk`,'badge'),node('span',e.adult?'Yetişkin gerekli':'Tek başına uygun','badge'));root.append(badges);const mats=node('section',undefined,'result-section');mats.append(node('h3','Malzemeler'));const ul=node('ul');e.materials.forEach(x=>ul.append(node('li',x)));mats.append(ul);root.append(mats);const steps=node('section',undefined,'result-section');steps.append(node('h3','Adımlar'));const ol=node('ol');e.steps.forEach(x=>ol.append(node('li',x)));steps.append(ol);root.append(steps,node('p',`Neden? ${e.why}`),node('p',`Güvenlik: ${e.safety}`,'safety'));done()});

$('#creativeRun').addEventListener('click',()=>{renderResult($('#creativeOut'),creativeStudio({kind:$('#creativeKind').value,theme:$('#creativeTheme').value,age:age()}));done()});
function runDaily(){renderResult($('#dailyOut'),dailyPlan({age:age(),interest:interest()}));done()}
$('#dailyButton').addEventListener('click',()=>{runDaily();scrollToModule('daily')});
$('#parentRun').addEventListener('click',()=>renderResult($('#parentOut'),parentSummary({age:age(),interest:interest(),minutes:$('#parentMinutes').value,stats:state})));
$('#teacherRun').addEventListener('click',()=>{renderResult($('#teacherOut'),teacherPack({topic:$('#teacherTopic').value,age:age(),minutes:$('#teacherMinutes').value}));done()});

renderProgress();renderResult($('#dailyOut'),dailyPlan({age:age(),interest:interest()}));
if('serviceWorker' in navigator)navigator.serviceWorker.register('../sw.js',{scope:'/'}).catch(()=>{});
