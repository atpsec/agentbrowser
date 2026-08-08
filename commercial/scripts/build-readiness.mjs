import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const commercialRoot=path.resolve(here,'..');
const repoRoot=path.resolve(commercialRoot,'..');
const products=JSON.parse(fs.readFileSync(path.join(commercialRoot,'products.json'),'utf8'));
const mobile=JSON.parse(fs.readFileSync(path.join(repoRoot,'mobile/products.json'),'utf8'));
const thirdParty=fs.existsSync(path.join(repoRoot,'public/vendor/THIRD_PARTY.txt'))
  ? fs.readFileSync(path.join(repoRoot,'public/vendor/THIRD_PARTY.txt'),'utf8').trim().split(/\r?\n/).filter(Boolean)
  : [];

const out=path.join(commercialRoot,'dist-readiness');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});

const components=[
  ...thirdParty.map(line=>({type:'library',name:line.split(' - ')[0],evidence:line})),
  {type:'library',name:'@capacitor/core',version:'8.4.2'},
  {type:'library',name:'@capacitor/android',version:'8.4.2'},
  {type:'library',name:'@capacitor/ios',version:'8.4.2'},
  {type:'library',name:'@capacitor/cli',version:'8.4.2'}
];
fs.writeFileSync(path.join(out,'SBOM.json'),JSON.stringify({bomFormat:'AI-Pusula-SBOM',specVersion:'0.1',components},null,2)+'\n');

for(const p of products){
  const m=mobile.find(x=>x.id===p.id);if(!m)throw new Error(`Mobile config missing ${p.id}`);
  const report=`# Satışa Hazırla - ${p.displayName}\n\n## Hazır\n- [x] Çalışan web ürünü\n- [x] Android debug APK CI\n- [x] Android unsigned release AAB CI\n- [x] iOS Simulator Xcode build CI\n- [x] Ürün kimliği: ${m.appId}\n- [x] Marketplace satış paketi üretici\n- [x] Provider-neutral License API sözleşmesi\n- [x] Lisans SQL veri modeli\n- [x] Üçüncü taraf bağımlılık envanteri / SBOM\n\n## Dış hesap veya secret gerektiği için henüz canlı değil\n- [ ] Google Play upload signing + Play Console uygulama kaydı\n- [ ] Apple Developer signing + App Store Connect uygulama kaydı\n- [ ] Kalıcı lisans veritabanı\n- [ ] Ödeme sağlayıcısı ve doğrulanmış webhooklar\n- [ ] AppSumo redemption provider doğrulaması\n- [ ] Gerçek müşteri hesabı / entitlement servisi\n\n## Satış verisi - doğrulanmış değer olmadan doldurma\n- MRR: TBD_VERIFIED\n- ARR: TBD_VERIFIED\n- Paying customers: TBD_VERIFIED\n- Churn: TBD_VERIFIED\n- Monthly profit: TBD_VERIFIED\n\n## Lisans adayları\n${p.plans.map(x=>`- ${x}`).join('\n')}\n\n**Kural:** Kırmızı/boş dış kapılar tamamlanmadan bu ürünü 'tam mağaza yayını', 'aktif ödeme' veya 'çalışan AppSumo redemption' olarak tanıtma.\n`;
  fs.writeFileSync(path.join(out,`${p.id}.md`),report);
}
console.log(`Built readiness reports for ${products.length} products`);
