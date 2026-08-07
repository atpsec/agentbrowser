const STORAGE_KEY='agent-security-roadmap-v1';
const boxes=[...document.querySelectorAll('#checklist input[type="checkbox"]')];
const progressText=document.getElementById('progressText');
const progressBar=document.getElementById('progressBar');
const resetButton=document.getElementById('resetButton');
function readState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch{return{}}}
function writeState(){const state=Object.fromEntries(boxes.map(box=>[box.dataset.key,box.checked]));localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function renderProgress(){const done=boxes.filter(box=>box.checked).length;progressText.textContent=`${done} / ${boxes.length}`;progressBar.style.width=`${(done/boxes.length)*100}%`}
const state=readState();
boxes.forEach(box=>{box.checked=Boolean(state[box.dataset.key]);box.addEventListener('change',()=>{writeState();renderProgress()})});
resetButton.addEventListener('click',()=>{boxes.forEach(box=>{box.checked=false});localStorage.removeItem(STORAGE_KEY);renderProgress()});
renderProgress();
