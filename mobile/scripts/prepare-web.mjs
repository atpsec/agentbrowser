import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const repoRoot = path.resolve(mobileRoot, '..');
const publicRoot = path.join(repoRoot, 'public');
const out = path.join(mobileRoot, 'www');
const products = JSON.parse(fs.readFileSync(path.join(mobileRoot, 'products.json'), 'utf8'));
const selectedId = process.env.MOBILE_PRODUCT || 'ai-pusula-tools';
const product = products.find(item => item.id === selectedId);
if (!product) throw new Error(`Unknown MOBILE_PRODUCT: ${selectedId}`);

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(publicRoot, out, { recursive: true });
const target = `./${product.route}`;
const launcher = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${target}"><title>${product.appName}</title></head><body><p>${product.appName} açılıyor… <a href="${target}">Devam et</a></p></body></html>`;
fs.writeFileSync(path.join(out, 'index.html'), launcher);
// PWA service workers are not needed inside the native bundle and can interfere with app updates.
fs.rmSync(path.join(out, 'sw.js'), { force: true });
console.log(`Prepared ${product.appName} web bundle -> ${product.route}`);
