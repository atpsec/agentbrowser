(() => {
  const providerMap = {
    cursor: ['Cursor','IDE Agent','Projeyi aç, Agent/Composer alanına yapıştır.'],
    codex: ['Codex','Coding Agent','Repo bağlamında görevi ver; testler geçmeden bitmiş sayma.'],
    claude: ['Claude Code','Terminal Agent','Repo kökünde çalıştır; değişiklikleri ve riskleri adım adım doğrulat.'],
    gemini: ['Gemini Code Assist','IDE Assistant','Workspace bağlamıyla çalış; her parçadan sonra test çalıştır.']
  };
  const stageIds = ['scope','ux','foundation','auth','database','frontend','backend','ai','billing','email','observability','security','deploy','growth'];
  const stageGuides = {
    scope:{files:['docs/product-brief.md','docs/mvp-scope.md'],checks:['PII ve kritik veri akışını tasarımda işaretle.','MVP dışını açıkça yaz.']},
    ux:{files:['docs/user-flows.md','docs/ui-states.md'],checks:['Rol bazlı ekran farklarını belirt.','Yetkisiz, hata, loading ve empty durumlarını tasarla.']},
    foundation:{files:['package.json','.env.example','.gitignore','.github/workflows/ci.yml'],commands:['npm run lint','npm test','npm run build'],checks:['Gerçek secret değerini repoya koyma.','CI içinde secret ve dependency kontrolü bulunsun.']},
    auth:{files:['src/auth/*','middleware.*','app/(auth)/*'],checks:['Sessionı server tarafında doğrula.','Admin rolünü client verisinden kabul etme.','Password reset ve email verification testleri yaz.']},
    database:{files:['supabase/migrations/*','db/schema.*','db/policies.*'],checks:['RLS/ownership negatif testleri yaz.','Migration ve veri silme/retention planını doğrula.']},
    frontend:{files:['app/*','components/*'],commands:['npm run lint','npm test','npm run build'],checks:['Kullanıcı girdisini HTML olarak enjekte etme.','Form validation ve erişilebilirlik kontrollerini yap.']},
    backend:{files:['api/*','server/*','workers/*'],checks:['Her mutasyonda authentication + authorization yap.','Input validation ve rate limit uygula.','Hatalarda secret veya stack trace sızdırma.']},
    ai:{files:['lib/ai/*','prompts/*','schemas/*'],checks:['Structured output doğrulaması yap.','Prompt injection adversarial testleri ekle.','Kota, timeout ve fallback uygula.','AI çıktısına kritik yetki verme.']},
    billing:{files:['billing/*','api/webhooks/stripe*'],checks:['Webhook imzasını doğrula.','Idempotency uygula.','Clienttan gelen plan/status değerine güvenme.']},
    email:{files:['emails/*','lib/email/*'],checks:['API anahtarını yalnız serverda tut.','Kullanıcı kontrollü içeriği güvenli render et.']},
    observability:{files:['lib/analytics/*','lib/monitoring/*'],checks:['Gereksiz PII gönderme.','Analytics ve hata payloadlarında redaction uygula.']},
    security:{files:['tests/security/*','.github/workflows/security.yml'],commands:['npm audit --omit=dev','npm test -- security'],checks:['Authorization, XSS, rate-limit, webhook replay ve prompt-injection negatif testlerini kapsa.','Secret scan ve dependency scan çalıştır.']},
    deploy:{files:['wrangler.jsonc','.github/workflows/deploy.yml','docs/runbook.md'],commands:['npm run build','npm test'],checks:['Production secretlarını repo dışında tut.','Staging/production ayır.','Rollback + smoke test planı uygula.','Yalnız gerekli asset klasörünü yayınla.']},
    growth:{files:['docs/metrics.md','docs/onboarding.md'],checks:['Analytics için gereksiz kişisel veri toplama.','Manipülatif bildirimlerden kaçın.']}
  };
  let blueprints = null;

  function ensureCss(){
    if(document.querySelector('link[data-ai-build-css]')) return;
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='ai-build-assistant.css'; link.dataset.aiBuildCss=''; document.head.appendChild(link);
  }
  async function loadData(){
    if(blueprints) return blueprints;
    const r=await fetch('./data/build-blueprints.json',{cache:'no-store'}); if(!r.ok) throw new Error('AI görev verisi yüklenemedi'); blueprints=await r.json(); return blueprints;
  }
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function selectedProduct(){
    const id=document.querySelector('[data-builder-product]')?.value;
    return blueprints?.products?.find(x=>x.id===id) || blueprints?.products?.[0] || null;
  }
  function selectedStage(){
    const active=document.querySelector('[data-builder-stage].is-active');
    const index=Number(active?.dataset.builderStage||0);
    const panel=document.querySelector('.builder-stage-panel');
    return {
      id:stageIds[index]||'scope',
      title:panel?.querySelector('.builder-stage-head h3')?.textContent?.trim()||'Seçili aşama',
      goal:panel?.querySelector('.builder-stage-head p')?.textContent?.trim()||'',
      tasks:[...panel?.querySelectorAll('.builder-task span')||[]].map(x=>x.textContent.trim()),
      done:[...panel?.querySelectorAll('.builder-stage-grid section:nth-child(2) li')||[]].map(x=>x.textContent.trim())
    };
  }
  function packet(providerKey){
    const p=selectedProduct(); const s=selectedStage(); const g=stageGuides[s.id]||{files:[],commands:[],checks:[]}; const provider=providerMap[providerKey]||providerMap.cursor;
    const security=[...new Set([...(g.checks||[]),...(p?.securityFocus||[])])];
    return `# AI Pusula — Uygulama Görev Paketi\n\n## Araç\n- ${provider[0]} — ${provider[1]}\n- Kullanım: ${provider[2]}\n\n## Ürün\n- Ad: ${p?.title||'Seçili ürün'}\n- Hedef kullanıcı: ${p?.target||''}\n- Değer önerisi: ${p?.promise||''}\n- Roller: ${(p?.roles||[]).join(', ')}\n- Ana ekranlar: ${(p?.pages||[]).slice(0,8).join(', ')}\n- Veri varlıkları: ${(p?.entities||[]).slice(0,10).join(', ')}\n- AI özellikleri: ${(p?.aiFeatures||[]).join(', ')}\n\n## Aşama\n- ${s.title}\n- Amaç: ${s.goal}\n\n## Yapılacak işler\n${(s.tasks.length?s.tasks:['Ekrandaki görevleri sırayla uygula.']).map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\n## Beklenen dosya / alanlar\n${(g.files.length?g.files:['Mevcut repo yapısına uygun dosyalar']).map(x=>`- ${x}`).join('\n')}\n\n## Güvenlik kapıları — ASLA ATLAMA\n${security.map(x=>`- ${x}`).join('\n')}\n- Gerçek API anahtarı, token, parola veya müşteri PII verisini kaynak koda yazma.\n- Kritik yetki kararlarını client tarafına bırakma.\n- Yeni bağımlılık eklemeden önce gerekliliğini ve güvenlik etkisini değerlendir.\n- Güvenlik kontrolünü geçici olarak kapatıp işi bitmiş sayma.\n\n## Çalıştırılacak kontroller\n${(g.commands?.length?g.commands:['Projede tanımlı lint, test ve build komutları']).map(x=>`- ${x}`).join('\n')}\n\n## Bitti sayılması için\n${(s.done.length?s.done:['Aşamanın tüm kabul kriterleri']).map(x=>`- ${x}`).join('\n')}\n- İlgili negatif testler geçiyor.\n- Build/lint/test hatası yok.\n- Değişen dosyalar, testler, kalan riskler ve rollback notu raporlandı.\n\n## Ajan talimatı\nBu repo üzerinde doğrudan uygula. Önce mevcut mimariyi oku. En küçük güvenli değişikliklerle ilerle. Her önemli adımdan sonra ilgili testi çalıştır. Başarısız kontrolü gizleme. Secret değerlerini loglama. Sonunda değişen dosyaları, çalıştırılan testleri, güvenlik etkisini, kalan riskleri ve bir sonraki aşamayı raporla.`;
  }
  async function copy(text){try{await navigator.clipboard.writeText(text);return true;}catch{return false;}}
  function download(name,text){const b=new Blob([text],{type:'text/markdown;charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500);}
  async function mount(){
    const root=document.querySelector('#builderMain'); if(!root||root.querySelector('[data-ai-exec]')) return;
    try{await loadData();}catch(e){console.error(e);return;}
    const box=document.createElement('section'); box.className='ai-exec'; box.dataset.aiExec='';
    box.innerHTML=`<div class="ai-exec-head"><div><span>AI İLE ŞİMDİ YAP</span><h3>Bu aşamayı kodlama ajanına ver</h3><p>Dosya hedefleri, testler, kabul kriterleri ve zorunlu güvenlik kapılarıyla kopyalanabilir görev paketi.</p></div><b>SECRET TOPLAMAZ</b></div><div class="ai-exec-providers">${Object.entries(providerMap).map(([k,v],i)=>`<button type="button" data-ai-provider="${k}" aria-pressed="${i===0?'true':'false'}"><strong>${esc(v[0])}</strong><small>${esc(v[1])}</small></button>`).join('')}</div><div class="ai-exec-actions"><button type="button" class="ai-exec-primary" data-ai-copy>Görev paketini kopyala</button><button type="button" data-ai-preview>Önizle</button><button type="button" data-ai-download>Markdown indir</button></div><details data-ai-details><summary>Görev paketi</summary><pre data-ai-output></pre></details><p class="ai-exec-note">Bu özellik doğrudan AI servisine bağlanmaz; API anahtarı istemez. Paketi seçtiğin kodlama aracına sen aktarırsın.</p>`;
    root.appendChild(box);
    let provider='cursor'; const out=box.querySelector('[data-ai-output]'); const refresh=()=>out.textContent=packet(provider); refresh();
    box.addEventListener('click',async e=>{
      const pb=e.target.closest('[data-ai-provider]'); if(pb){provider=pb.dataset.aiProvider;box.querySelectorAll('[data-ai-provider]').forEach(x=>x.setAttribute('aria-pressed',String(x===pb)));refresh();return;}
      if(e.target.closest('[data-ai-copy]')){const ok=await copy(packet(provider)); const toast=document.getElementById('toast'); if(toast){toast.textContent=ok?'AI görev paketi kopyalandı.':'Kopyalama izni verilemedi.';toast.hidden=false;setTimeout(()=>toast.hidden=true,2200);} }
      if(e.target.closest('[data-ai-preview]')){refresh();box.querySelector('[data-ai-details]').open=true;}
      if(e.target.closest('[data-ai-download]')){const p=selectedProduct(),s=selectedStage();download(`ai-pusula-${p?.id||'urun'}-${s.id}-${provider}.md`,packet(provider));}
    });
  }
  ensureCss(); const observer=new MutationObserver(()=>mount()); observer.observe(document.documentElement,{subtree:true,childList:true}); if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
