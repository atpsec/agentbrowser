const $=s=>document.querySelector(s);const set=(id,text)=>{$(id).value=text};
function copyFrom(id,button){const el=$(id);const text='value'in el?el.value:el.textContent;navigator.clipboard?.writeText(text).then(()=>{const old=button.textContent;button.textContent='Kopyalandı';setTimeout(()=>button.textContent=old,1000)}).catch(()=>{el.focus?.();el.select?.()})}
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copyFrom(b.dataset.copy,b)));
function randomInt(max){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%max}
function makePassword(){const len=Math.max(8,Math.min(64,Number($('#passwordLength').value)||20));let chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';if($('#passwordSymbols').checked)chars+='!@#$%^&*_-+=';let out='';for(let i=0;i<len;i++)out+=chars[randomInt(chars.length)];set('#passwordOutput',out)}
$('#passwordButton').addEventListener('click',makePassword);makePassword();
function cleanText(){let t=$('#textInput').value;t=t.replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();set('#textOutput',t)}
$('#cleanTextButton').addEventListener('click',cleanText);
function slugify(){const t=$('#slugInput').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('tr-TR').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');set('#slugOutput',t)}
$('#slugButton').addEventListener('click',slugify);
function formatJson(){try{const obj=JSON.parse($('#jsonInput').value);set('#jsonOutput',JSON.stringify(obj,null,2));$('#jsonStatus').textContent='Geçerli JSON.'}catch(e){set('#jsonOutput','');$('#jsonStatus').textContent=`Hata: ${e.message}`}}
$('#jsonButton').addEventListener('click',formatJson);
function vat(){const amount=Number($('#vatAmount').value)||0,rate=Math.max(0,Number($('#vatRate').value)||0),mode=$('#vatMode').value;let net,tax,total;if(mode==='add'){net=amount;tax=net*rate/100;total=net+tax}else{total=amount;net=rate===0?total:total/(1+rate/100);tax=total-net}$('#vatResult').textContent=`Net: ${net.toFixed(2)} · Vergi: ${tax.toFixed(2)} · Toplam: ${total.toFixed(2)}`}
$('#vatButton').addEventListener('click',vat);
function budget(){const income=Number($('#budgetIncome').value)||0,fixed=Number($('#budgetFixed').value)||0,variable=Number($('#budgetVariable').value)||0,saving=Number($('#budgetSaving').value)||0,left=income-fixed-variable-saving;$('#budgetResult').textContent=`Ay sonu kalan: ${left.toFixed(2)} · Tasarruf oranı: ${income>0?(saving/income*100).toFixed(1):'0.0'}%`;$('#budgetResult').dataset.state=left<0?'negative':'ok'}
$('#budgetButton').addEventListener('click',budget);
const units={length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,ft:.3048},mass:{kg:1,g:.001,lb:.45359237,oz:.028349523125},data:{B:1,KB:1000,MB:1e6,GB:1e9,KiB:1024,MiB:1048576,GiB:1073741824}};
function fillUnits(){const type=$('#unitType').value,from=$('#unitFrom'),to=$('#unitTo');from.innerHTML='';to.innerHTML='';const names=type==='temp'?['C','F','K']:Object.keys(units[type]);for(const n of names){for(const s of [from,to]){const o=document.createElement('option');o.value=n;o.textContent=n;s.append(o)}}if(names.length>1)to.value=names[1]}
function convertUnit(){const type=$('#unitType').value,v=Number($('#unitValue').value);if(!Number.isFinite(v)){set('#unitOutput','');return}const from=$('#unitFrom').value,to=$('#unitTo').value;let result;if(type==='temp'){const c=from==='C'?v:from==='F'?(v-32)*5/9:v-273.15;result=to==='C'?c:to==='F'?c*9/5+32:c+273.15}else result=v*units[type][from]/units[type][to];set('#unitOutput',Number(result.toPrecision(12)).toString())}
$('#unitType').addEventListener('change',()=>{fillUnits();convertUnit()});$('#unitButton').addEventListener('click',convertUnit);fillUnits();convertUnit();
import '/demo-session.js';