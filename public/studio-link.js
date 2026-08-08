const grid=document.querySelector('.path-grid');
if(grid&&!grid.querySelector('[data-studio-hub]')){
  const a=document.createElement('a');a.className='path-card';a.href='/studio/';a.dataset.studioHub='true';a.setAttribute('aria-label','AI Pusula Studio üretim alanını aç');
  const i=document.createElement('span');i.className='path-index';i.textContent='05';
  const strong=document.createElement('strong');strong.textContent='AI ile bir şey üretmek istiyorum';
  const small=document.createElement('small');small.textContent='100 şablon · uygulama, oyun, quiz, dashboard, otomasyon ve daha fazlası.';
  const arrow=document.createElement('span');arrow.className='path-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
  a.append(i,strong,small,arrow);grid.append(a);
}
