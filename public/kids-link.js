const grid=document.querySelector('.path-grid');
if(grid&&!grid.querySelector('[data-kids-hub]')){
  const a=document.createElement('a');a.className='path-card';a.href='/kids/';a.dataset.kidsHub='true';a.setAttribute('aria-label','AI Pusula Çocuk alanını aç');
  const i=document.createElement('span');i.className='path-index';i.textContent='04';
  const strong=document.createElement('strong');strong.textContent='Çocuklar için öğrenmek ve üretmek istiyorum';
  const small=document.createElement('small');small.textContent='6–16 yaş · quiz, oyun, kodlama, güvenli internet.';
  const arrow=document.createElement('span');arrow.className='path-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
  a.append(i,strong,small,arrow);grid.append(a);
}
