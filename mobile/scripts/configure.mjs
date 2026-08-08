import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(here, '..');
const products = JSON.parse(fs.readFileSync(path.join(mobileRoot, 'products.json'), 'utf8'));
const selectedId = process.env.MOBILE_PRODUCT || 'ai-pusula-tools';
const product = products.find(item => item.id === selectedId);
if (!product) throw new Error(`Unknown MOBILE_PRODUCT: ${selectedId}`);

const config = {
  appId: product.appId,
  appName: product.appName,
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

fs.writeFileSync(path.join(mobileRoot, 'capacitor.config.json'), JSON.stringify(config, null, 2) + '\n');
fs.writeFileSync(path.join(mobileRoot, '.selected-product.json'), JSON.stringify(product, null, 2) + '\n');
console.log(`Configured ${product.appName} (${product.appId})`);
