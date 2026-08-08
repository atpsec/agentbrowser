import assert from 'node:assert/strict';
import { analyzeEmail, extractAddress, domainFromAddress, extractUrls, inspectUrl, parseRawEmail, reportText } from './analyzer.js';

assert.equal(extractAddress('Name <user@example.com>'), 'user@example.com');
assert.equal(domainFromAddress('USER@Example.COM'), 'example.com');
assert.deepEqual(extractUrls('x https://example.com/a, y http://1.2.3.4/login.'), ['https://example.com/a','http://1.2.3.4/login']);
assert.ok(inspectUrl('https://bit.ly/a').findings.some(x => x.id === 'short-link'));
assert.ok(inspectUrl('http://10.0.0.1/login').findings.some(x => x.id === 'ip-link'));
const parsed = parseRawEmail('From: A <a@example.com>\nSubject: Test\n\nHello');
assert.equal(parsed.headers.from, 'A <a@example.com>');
assert.equal(parsed.body, 'Hello');

const phishing = analyzeEmail({ raw: `From: Microsoft <security@microsoft-support.example>\nReply-To: reset@account-check.example\nAuthentication-Results: mx; spf=fail; dkim=fail; dmarc=fail\nSubject: ACİL: hesabınız kapanacak\n\nHemen şifrenizi doğrulayın: https://bit.ly/reset` });
assert.ok(phishing.score >= 70, phishing.score);
assert.equal(phishing.level, 'yüksek');
assert.ok(phishing.findings.some(x => x.id === 'reply-mismatch'));
assert.ok(phishing.findings.some(x => x.id === 'auth-dmarc'));
assert.ok(phishing.findings.some(x => x.id === 'credential'));
assert.ok(reportText(phishing).includes('Güvenli sonraki adımlar'));

const benign = analyzeEmail({ raw: `From: IT <it@corp.example>\nReply-To: it@corp.example\nReturn-Path: it@corp.example\nAuthentication-Results: mx; spf=pass; dkim=pass; dmarc=pass\nSubject: Planlı bakım\n\nCumartesi bakım yapılacaktır. İşlem yapmanız gerekmiyor.` });
assert.ok(benign.score < 15, benign.score);
assert.ok(benign.positives.length >= 4, benign.positives);

const attachment = analyzeEmail({ raw: 'Attached invoice.xlsm. Please open the attachment and pay invoice.' });
assert.ok(attachment.findings.some(x => x.id === 'attachment-xlsm'));
assert.ok(attachment.findings.some(x => x.id === 'payment'));

console.log('phishing analyzer unit tests passed');
