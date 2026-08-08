import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const repoRoot = path.resolve(mobileRoot, '..');
const products = JSON.parse(fs.readFileSync(path.join(mobileRoot, 'products.json'), 'utf8'));

if (!Array.isArray(products) || products.length < 4) throw new Error('Expected at least four mobile products');
const ids = new Set();
const appIds = new Set();
for (const product of products) {
  for (const key of ['id', 'appId', 'appName', 'route', 'sku', 'licenseFamily']) {
    if (!product[key] || typeof product[key] !== 'string') throw new Error(`${product.id || 'product'} missing ${key}`);
  }
  if (ids.has(product.id)) throw new Error(`Duplicate product id: ${product.id}`);
  if (appIds.has(product.appId)) throw new Error(`Duplicate appId: ${product.appId}`);
  if (!/^[a-z0-9.-]+$/.test(product.appId)) throw new Error(`Invalid appId: ${product.appId}`);
  if (product.route.startsWith('/') || product.route.includes('..') || /^https?:/i.test(product.route)) throw new Error(`Route must be bundled and relative: ${product.route}`);
  const target = path.join(repoRoot, 'public', product.route, 'index.html');
  if (!fs.existsSync(target)) throw new Error(`Missing bundled route for ${product.id}: ${target}`);
  ids.add(product.id);
  appIds.add(product.appId);
}
console.log(`Validated ${products.length} mobile products`);
