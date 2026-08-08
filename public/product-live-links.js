const hrefFor=id=>`./apps/?app=${encodeURIComponent(id)}`;
function enhance(){
  document.querySelectorAll('[data-product-plan]').forEach(button=>{
    const id=button.dataset.productPlan;if(!id)return;
    const actions=button.closest('.card-actions');if(!actions||actions.querySelector(`[data-live-product="${CSS.escape(id)}"]`))return;
    const link=document.createElement('a');link.href=hrefFor(id);link.dataset.liveProduct=id;link.textContent='Uygulamayı aç ↗';link.className='live-product-link';actions.append(link);
  });
}
const observer=new MutationObserver(enhance);observer.observe(document.documentElement,{subtree:true,childList:true});enhance();
