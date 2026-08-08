# Change: 18 ürünün çalışan browser/offline MVP sürümleri

## Problem
AI Pusula'daki 18 ürün fikri için yol haritası ve builder mevcut, ancak phishing dışında kullanıcı doğrudan çalışan bir ürün açamıyor.

## Desired behavior
Her ürün kartı tarayıcıda çalışan bir MVP'ye bağlanır. Kullanıcı örnek veya kendi girdisini işler, sonucu kopyalar/rapor olarak indirir ve ürünü tek dosyalık offline HTML uygulaması olarak indirebilir.

## Acceptance criteria
- [x] 18 ürün için ayrı ürün sözleşmesi ve çalışan yerel işleyici
- [x] Tek browser workspace üzerinden ürün seçimi
- [x] Her üründe örnek veri + gerçek girdi + sonuç
- [x] Her üründe rapor kopyalama/indirme
- [x] Her üründe tek dosyalık offline HTML export
- [x] Ana fikir kartlarında `Uygulamayı aç` bağlantısı
- [x] Harici AI/API zorunluluğu yok; AI yapılmayan yerde AI çalışıyormuş gibi sunulmuyor
- [x] Mobil uyum
- [x] CSP / secret / external-network regresyon kontrolleri
- [x] Chromium ile 18/18 ürün smoke testi

## Technical approach
`public/apps/product-engines.js` saf ürün mantığını, `product-app.js` ortak UI ve offline export katmanını taşır. Ürünler tek kod tabanını paylaşır; her biri kendi alanları, örnek girdisi ve özel işleyicisine sahiptir. Offline export aynı motoru tek HTML içine gömer ve ağ erişimini `default-src 'none'` ile kapatır.

## Security and privacy
Browser MVP'leri kullanıcı girdisini harici AI modeline göndermez. Tek ağ isteği offline export sırasında aynı-origin `product-engines.js` dosyasını okumaktır. Gerçek müşteri/kurum verisi için maskeleme uyarısı korunur. Güvenlik ürünlerinde otomatik engelleme/iyileştirme yapılmaz; çıktı karar desteğidir.

## Known scope limits
PDF quiz'in offline MVP'si PDF binary parsing yapmaz; PDF metninin yapıştırılması gerekir. Podcast aracı ses dosyasını buluta göndermediği için transkript girdisiyle çalışır. Bunlar UI'da açıkça belirtilir.

## Rollback
`public/apps/`, `public/product-live-links.js`, `public/live-links.css` ve `product-builder.js` içindeki import geri alınarak özellik bağımsız şekilde kaldırılabilir.

## Verification
`Validate live products` workflow'u 18 motoru Node üzerinde, 18 ürünün tamamını Chromium üzerinde ve offline HTML export'unu doğrular. Mevcut AI Pusula/Product Builder/CSP workflow'ları da PR üzerinde çalışır.
