const SHORTENERS = new Set(['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','buff.ly','is.gd','cutt.ly','rebrand.ly','shorturl.at']);
const DANGEROUS_EXTENSIONS = ['exe','scr','js','jse','vbs','vbe','bat','cmd','ps1','hta','iso','img','lnk','msi','dll','docm','xlsm','pptm','html','htm','zip','rar','7z'];

const RULES = [
  { id: 'urgency', weight: 14, title: 'Acil davranman isteniyor', explain: '“hemen”, “son uyarı”, “24 saat içinde” gibi ifadeler düşünmeden hareket ettirmeyi amaçlayabilir.', regex: /\b(acil|hemen|derhal|son uyarı|son şans|24 saat|hesabınız kapanacak|hesabiniz kapanacak|urgent|immediately|final warning|within 24 hours|account (will be )?(closed|suspended|locked))\b/i },
  { id: 'credential', weight: 24, title: 'Şifre veya giriş bilgisi isteniyor', explain: 'E-posta üzerinden parola, doğrulama kodu veya oturum açma bilgisi istemek yüksek riskli bir işarettir.', regex: /(şifre\w*|sifre\w*|parola\w*|doğrulama kodu|dogrulama kodu|tek kullanımlık kod|\botp\b|\bpassword\b|\bpasscode\b|verification code|login credentials|sign in to verify)/i },
  { id: 'payment', weight: 20, title: 'Para veya ödeme talebi var', explain: 'Beklenmeyen ödeme, fatura, hediye kartı veya banka talebi özellikle ayrı bir kanaldan doğrulanmalıdır.', regex: /\b(havale|ödeme|odeme|fatura|iban|banka|hediye kartı|hediye karti|gift card|invoice|wire transfer|bank account|payment due|crypto|bitcoin)\b/i },
  { id: 'threat', weight: 12, title: 'Korkutma veya ceza dili kullanılıyor', explain: 'Hesabın kapanması, ceza, iş kaybı veya yasal işlem tehdidi karar vermeyi hızlandırmak için kullanılabilir.', regex: /\b(ceza|askıya alın|askiya alin|kapatıl|kapatil|yasal işlem|yasal islem|terminated|suspended|legal action|penalty|blocked)\b/i },
  { id: 'attachment-pressure', weight: 12, title: 'Ek dosyayı açman isteniyor', explain: 'Beklenmeyen ekleri, özellikle çalıştırılabilir veya makrolu dosyaları açmadan önce göndereni doğrula.', regex: /\b(eki aç|eki ac|ekteki dosya|attachment|open the attached|download the file|attached invoice)\b/i }
];

function clean(value = '') { return String(value ?? '').trim(); }
function unique(items) { return [...new Set(items.filter(Boolean))]; }
function safeLower(value = '') { return String(value).toLocaleLowerCase('tr-TR'); }

export function extractAddress(value = '') {
  const angle = String(value).match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/);
  const plain = String(value).match(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
  return clean(angle?.[1] || plain?.[1] || '').toLowerCase();
}

export function domainFromAddress(address = '') {
  const at = address.lastIndexOf('@');
  return at > -1 ? address.slice(at + 1).replace(/[>),;]+$/g, '').toLowerCase() : '';
}

export function parseRawEmail(raw = '') {
  const text = String(raw).replace(/\r\n/g, '\n');
  const [headerBlock = '', ...bodyParts] = text.split(/\n\n/);
  const likelyHeaders = /^(from|to|subject|reply-to|return-path|authentication-results|received|date):/im.test(headerBlock);
  const headers = {};
  let body = text;

  if (likelyHeaders) {
    const unfolded = headerBlock.replace(/\n[ \t]+/g, ' ');
    for (const line of unfolded.split('\n')) {
      const match = line.match(/^([A-Za-z0-9-]+):\s*(.*)$/);
      if (!match) continue;
      const key = match[1].toLowerCase();
      headers[key] = headers[key] ? `${headers[key]} ${match[2]}` : match[2];
    }
    body = bodyParts.join('\n\n');
  }

  return { headers, body, raw: text };
}

export function extractUrls(text = '') {
  const matches = String(text).match(/https?:\/\/[^\s<>"']+/gi) || [];
  return unique(matches.map(url => url.replace(/[),.;!?\]]+$/g, '')));
}

export function inspectUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const findings = [];
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) findings.push({ id: 'ip-link', weight: 22, title: 'Bağlantı alan adı yerine IP adresi kullanıyor', explain: 'Meşru hizmetler giriş bağlantılarında çoğunlukla tanınabilir alan adı kullanır.', evidence: host });
    if (SHORTENERS.has(host) || [...SHORTENERS].some(d => host.endsWith(`.${d}`))) findings.push({ id: 'short-link', weight: 12, title: 'Kısaltılmış bağlantı kullanılıyor', explain: 'Kısa link gerçek hedefi gizleyebilir. Tıklamadan önce hedefi güvenli bir yöntemle doğrula.', evidence: host });
    if (host.includes('xn--')) findings.push({ id: 'punycode', weight: 18, title: 'Punycode alan adı tespit edildi', explain: 'Bu biçim uluslararası alan adlarında normal olabilir; ancak benzer harflerle marka taklidi için de kullanılabilir.', evidence: host });
    if (parsed.username || parsed.password) findings.push({ id: 'url-credentials', weight: 20, title: 'URL içinde kullanıcı bilgisi bulunuyor', explain: 'Bu eski URL biçimi gerçek hedef alan adını gözden kaçırmaya yol açabilir.', evidence: host });
    return { url, host, findings };
  } catch {
    return { url, host: '', findings: [{ id: 'bad-url', weight: 8, title: 'Bağlantı biçimi olağandışı', explain: 'Adres düzgün bir web bağlantısı olarak çözümlenemedi.', evidence: url.slice(0, 120) }] };
  }
}

function parseAuthentication(headers = {}) {
  const auth = safeLower(headers['authentication-results'] || '');
  const checks = [];
  for (const name of ['spf','dkim','dmarc']) {
    const match = auth.match(new RegExp(`\\b${name}=([a-z-]+)`));
    if (match) checks.push({ name: name.toUpperCase(), result: match[1] });
  }
  return checks;
}

function attachmentFindings(text = '') {
  const filePattern = /\b[\w .()-]+\.([a-z0-9]{2,5})\b/gi;
  const findings = [];
  let match;
  while ((match = filePattern.exec(String(text)))) {
    const ext = match[1].toLowerCase();
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      findings.push({ id: `attachment-${ext}`, weight: ['exe','scr','js','vbs','hta','lnk','msi'].includes(ext) ? 28 : 16, title: `Riskli dosya uzantısı: .${ext}`, explain: 'Bu dosya türü kod çalıştırabilir, makro içerebilir veya kullanıcıyı sahte bir sayfaya yönlendirebilir.', evidence: match[0].trim().slice(-90) });
    }
  }
  return findings;
}

function addFinding(list, finding) {
  if (!list.some(item => item.id === finding.id && item.evidence === finding.evidence)) list.push(finding);
}

export function analyzeEmail({ raw = '', sender = '', subject = '' } = {}) {
  const parsed = parseRawEmail(raw);
  const headers = parsed.headers;
  const effectiveSender = clean(sender || headers.from || '');
  const effectiveSubject = clean(subject || headers.subject || '');
  const replyTo = clean(headers['reply-to'] || '');
  const returnPath = clean(headers['return-path'] || '');
  const senderAddress = extractAddress(effectiveSender);
  const replyAddress = extractAddress(replyTo);
  const returnAddress = extractAddress(returnPath);
  const senderDomain = domainFromAddress(senderAddress);
  const replyDomain = domainFromAddress(replyAddress);
  const returnDomain = domainFromAddress(returnAddress);
  const combined = `${effectiveSubject}\n${parsed.body}\n${parsed.raw}`;
  const findings = [];
  const positives = [];

  for (const rule of RULES) {
    if (rule.regex.test(combined)) addFinding(findings, { id: rule.id, weight: rule.weight, title: rule.title, explain: rule.explain, evidence: '' });
  }

  if (senderDomain && replyDomain && senderDomain !== replyDomain) {
    addFinding(findings, { id: 'reply-mismatch', weight: 24, title: 'From ve Reply-To alan adları farklı', explain: 'Yanıtın farklı bir domaine yönlendirilmesi meşru sistemlerde olabilir; beklenmiyorsa önemli bir kimlik taklidi işaretidir.', evidence: `${senderDomain} → ${replyDomain}` });
  } else if (senderDomain && replyDomain) {
    positives.push({ title: 'From ve Reply-To alan adı uyumlu', evidence: senderDomain });
  }

  if (senderDomain && returnDomain && senderDomain !== returnDomain) {
    addFinding(findings, { id: 'return-mismatch', weight: 12, title: 'Return-Path gönderen alanından farklı', explain: 'Toplu e-posta servislerinde normal olabilir; diğer işaretlerle birlikte değerlendirilmelidir.', evidence: `${senderDomain} → ${returnDomain}` });
  }

  const auth = parseAuthentication(headers);
  for (const check of auth) {
    if (['fail','softfail','temperror','permerror'].includes(check.result)) addFinding(findings, { id: `auth-${check.name.toLowerCase()}`, weight: check.name === 'DMARC' ? 24 : 16, title: `${check.name} doğrulaması başarısız`, explain: 'Gönderen alanının teknik kimlik doğrulamasında sorun görülüyor. Tek başına kesin kanıt değildir ama ciddi bir sinyaldir.', evidence: `${check.name}=${check.result}` });
    if (check.result === 'pass') positives.push({ title: `${check.name} doğrulaması geçti`, evidence: `${check.name}=pass` });
  }

  for (const finding of attachmentFindings(combined)) addFinding(findings, finding);

  const urls = extractUrls(combined).map(inspectUrl);
  for (const inspected of urls) for (const finding of inspected.findings) addFinding(findings, finding);

  if (senderDomain && /[\u0080-\uFFFF]/.test(senderDomain)) addFinding(findings, { id: 'unicode-domain', weight: 18, title: 'Gönderen alan adında Unicode karakter var', explain: 'Benzer görünen harflerle marka taklidi yapılabilir. Alan adını dikkatle karşılaştır.', evidence: senderDomain });

  const rawScore = findings.reduce((sum, item) => sum + item.weight, 0);
  const score = Math.max(0, Math.min(100, rawScore));
  const level = score >= 70 ? 'yüksek' : score >= 40 ? 'orta' : score >= 15 ? 'düşük' : 'çok düşük';
  const verdict = score >= 70 ? 'Güçlü phishing işaretleri var' : score >= 40 ? 'Birden fazla şüpheli işaret var' : score >= 15 ? 'Bazı işaretler dikkat gerektiriyor' : 'Belirgin phishing işareti az';
  const actions = [
    'Mesajdaki bağlantılara veya eklere tıklama.',
    'Göndereni e-postadaki telefon/link yerine bildiğin ayrı bir kanaldan doğrula.',
    'Kurumsal ortamdaysan mesajı güvenlik ekibine veya “phishing bildir” kanalına ilet.',
    'Şifre veya doğrulama kodu girdiysen parolanı güvenilir cihazdan değiştir ve aktif oturumları gözden geçir.'
  ];

  return {
    score,
    level,
    verdict,
    sender: effectiveSender,
    subject: effectiveSubject,
    senderDomain,
    replyDomain,
    returnDomain,
    findings: findings.sort((a,b) => b.weight - a.weight),
    positives,
    urls,
    auth,
    actions,
    note: 'Bu sonuç eğitim ve ilk inceleme içindir; tek başına kesin zararlı/zararsız kararı değildir.'
  };
}

export function reportText(result) {
  const lines = [
    'PHISHING E-POSTASI AÇIKLAYICI',
    `Risk: ${result.level.toUpperCase()} (${result.score}/100)`,
    result.verdict,
    '',
    'Bulgular:'
  ];
  if (!result.findings.length) lines.push('- Belirgin kırmızı bayrak bulunamadı. Bu, mesajın kesin güvenli olduğu anlamına gelmez.');
  for (const item of result.findings) lines.push(`- ${item.title}${item.evidence ? ` — ${item.evidence}` : ''}: ${item.explain}`);
  if (result.positives.length) {
    lines.push('', 'Olumlu sinyaller:');
    for (const item of result.positives) lines.push(`- ${item.title}${item.evidence ? ` — ${item.evidence}` : ''}`);
  }
  lines.push('', 'Güvenli sonraki adımlar:');
  result.actions.forEach(item => lines.push(`- ${item}`));
  lines.push('', result.note);
  return lines.join('\n');
}
