function attachPhishingLabLink() {
  const planButton = document.querySelector('[data-product-plan="phishing-explainer"]');
  if (!planButton) return;
  const actions = planButton.closest('.card-actions');
  if (!actions || actions.querySelector('[data-phishing-lab-link]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.phishingLabLink = 'true';
  button.textContent = 'Canlı prototip ↗';
  button.addEventListener('click', () => { window.location.href = './labs/phishing-explainer/'; });
  actions.append(button);
}

attachPhishingLabLink();
const ideaGrid = document.getElementById('ideaGrid');
if (ideaGrid) new MutationObserver(attachPhishingLabLink).observe(ideaGrid, { childList: true, subtree: true });
