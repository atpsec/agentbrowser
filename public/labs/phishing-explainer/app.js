import { analyzeEmail, reportText } from './analyzer.js';

const $ = selector => document.querySelector(selector);
const form = $('#analysisForm');
const rawInput = $('#rawEmail');
const senderInput = $('#sender');
const subjectInput = $('#subject');
const resultSection = $('#results');
const findingsRoot = $('#findings');
const positivesRoot = $('#positives');
const linksRoot = $('#links');
const scoreValue = $('#scoreValue');
const scoreMeter = $('#scoreMeter');
const verdict = $('#verdict');
const riskLabel = $('#riskLabel');
const copyButton = $('#copyReport');
const resetButton = $('#resetForm');
let currentResult = null;

const samples = {
  credential: {
    sender: 'Microsoft Security <security@microsoft-support.example>',
    subject: 'ACİL: Hesabınız 24 saat içinde askıya alınacak',
    raw: `From: Microsoft Security <security@microsoft-support.example>\nReply-To: verify-account@helpdesk-login.example\nReturn-Path: bounce@mailer.example\nAuthentication-Results: mx.example; spf=fail; dkim=fail; dmarc=fail\nSubject: ACİL: Hesabınız 24 saat içinde askıya alınacak\n\nMerhaba, hesabınızda olağandışı etkinlik tespit ettik. Hesabınızın kapanmaması için hemen doğrulama yapın ve şifrenizi girin:\nhttps://bit.ly/example-login\n\nSon uyarı.`
  },
  invoice: {
    sender: 'Tedarikçi Finans <finance@supplier.example>',
    subject: 'Gecikmiş fatura - bugün ödeme gerekli',
    raw: `From: Tedarikçi Finans <finance@supplier.example>\nReply-To: finance@supplier.example\nAuthentication-Results: mx.example; spf=pass; dkim=pass; dmarc=pass\nSubject: Gecikmiş fatura - bugün ödeme gerekli\n\nEkteki invoice_8841.xlsm dosyasını açıp yeni IBAN hesabına bugün havale yapmanız gerekiyor. Aksi halde yasal işlem başlatılacaktır.`
  },
  benign: {
    sender: 'BT Duyuruları <it@corp.example>',
    subject: 'Planlı bakım: Cumartesi 22:00',
    raw: `From: BT Duyuruları <it@corp.example>\nReply-To: it@corp.example\nReturn-Path: it@corp.example\nAuthentication-Results: mx.example; spf=pass; dkim=pass; dmarc=pass\nSubject: Planlı bakım: Cumartesi 22:00\n\nCumartesi 22:00-23:00 arasında planlı bakım yapılacaktır. İşlem yapmanız gerekmiyor. Sorularınız için şirket içi destek portalını kullanın.`
  }
};

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]);
}

function render(result) {
  currentResult = result;
  scoreValue.textContent = String(result.score);
  scoreMeter.value = result.score;
  verdict.textContent = result.verdict;
  riskLabel.textContent = `${result.level.toUpperCase()} RİSK`;
  riskLabel.dataset.level = result.level;

  findingsRoot.innerHTML = result.findings.length
    ? result.findings.map(item => `<article class="finding"><div class="finding-head"><span>+${item.weight}</span><h3>${esc(item.title)}</h3></div>${item.evidence ? `<code>${esc(item.evidence)}</code>` : ''}<p>${esc(item.explain)}</p></article>`).join('')
    : '<div class="empty"><strong>Belirgin kırmızı bayrak bulunamadı.</strong><p>Bu sonuç mesajın kesin güvenli olduğu anlamına gelmez. Beklenmeyen talepleri yine de ayrı kanaldan doğrula.</p></div>';

  positivesRoot.innerHTML = result.positives.length
    ? result.positives.map(item => `<li><b>${esc(item.title)}</b>${item.evidence ? `<code>${esc(item.evidence)}</code>` : ''}</li>`).join('')
    : '<li>Teknik olarak doğrulanmış olumlu sinyal bulunamadı.</li>';

  linksRoot.innerHTML = result.urls.length
    ? result.urls.map(item => `<li><code>${esc(item.host || item.url)}</code><span>${item.findings.length ? `${item.findings.length} risk işareti` : 'Belirgin URL işareti yok'}</span></li>`).join('')
    : '<li><span>Mesajda HTTP/HTTPS bağlantısı bulunamadı.</span></li>';

  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const raw = rawInput.value.trim();
  if (!raw && !senderInput.value.trim() && !subjectInput.value.trim()) {
    rawInput.focus();
    rawInput.setCustomValidity('Analiz için e-posta metni veya başlık bilgisi gir.');
    rawInput.reportValidity();
    return;
  }
  rawInput.setCustomValidity('');
  render(analyzeEmail({ raw, sender: senderInput.value, subject: subjectInput.value }));
});

rawInput.addEventListener('input', () => rawInput.setCustomValidity(''));

document.addEventListener('click', event => {
  const sample = event.target.closest('[data-sample]');
  if (!sample) return;
  const item = samples[sample.dataset.sample];
  if (!item) return;
  senderInput.value = item.sender;
  subjectInput.value = item.subject;
  rawInput.value = item.raw;
  render(analyzeEmail(item));
});

copyButton.addEventListener('click', async () => {
  if (!currentResult) return;
  const text = reportText(currentResult);
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = 'Kopyalandı ✓';
    setTimeout(() => { copyButton.textContent = 'Raporu kopyala'; }, 1500);
  } catch {
    const area = document.createElement('textarea');
    area.className = 'clipboard-fallback';
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
});

resetButton.addEventListener('click', () => {
  form.reset();
  currentResult = null;
  resultSection.hidden = true;
  rawInput.focus();
});
