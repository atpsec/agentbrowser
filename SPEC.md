# Change: Ürün fikirlerinden müşteriye giden etkileşimli yolculuk

## Problem

AI Pusula'daki ürün fikirleri kullanıcıya iyi başlangıç noktaları sunuyor; ancak fikir seçildikten sonra doğrulama, inşa, canlıya alma, müşteri bulma, satış ve takip adımlarının nasıl yürütüleceği görünmüyor. Kullanıcı fikirden sonra ne yapacağını başka kaynaklarda aramak zorunda kalıyor.

## İstenen davranış

Her ürün fikri için, kullanıcıyı bilgi duvarıyla boğmadan fikirden ilk müşteriye ve sürdürülebilir kullanıma taşıyan etkileşimli bir plan sunmak. Plan ürünün kategorisine ve özel koşullarına göre değişmeli; kullanıcı hizmet, SaaS, açık kaynak veya kuruma özel çözüm rotalarından birini, süre ve bütçe seviyesini seçebilmelidir.

## Kabul kriterleri

- [x] Tüm 18 ürün fikri için aynı kimlikle eşleşen ürün yolculuğu verisi
- [x] Ürün pasaportu: müşteri, MVP süresi, satış zorluğu, veri hassasiyeti, gelir modeli ve aktivasyon anı
- [x] Dokuz aşama: pasaport, doğrulama, teklif, MVP, güvenli test, canlıya alma, müşteri bulma, pazarlama/satış, takip/büyüme
- [x] Dört rota: hizmet, SaaS, açık kaynak, kuruma özel çözüm
- [x] Üç süre: hafta sonu, 14 gün, 30 gün
- [x] Üç bütçe: ücretsiz, düşük bütçe, profesyonel altyapı
- [x] Ürüne özel MVP kapsamı, yapılmayacaklar, stack, testler, kanallar, mesajlar, itirazlar ve metrikler
- [x] PUSULA ve KAZAN metodolojileri arasında geçiş
- [x] Her aşamada yalnızca o ana ait “bugünün görevi” ve görev listesi
- [x] Ürün bazında yerel ilerleme kaydı
- [x] Markdown kopyalama ve indirme
- [x] Gerçek müşteri PII'si için giriş alanı veya kalıcı kayıt olmaması
- [x] Mobil görünümde yatay taşma olmaması
- [x] Klavye ile kullanılabilir native dialog ve kontroller
- [x] Otomatik veri, JavaScript, plan üretimi ve HTTP smoke testleri

## Teknik yaklaşım

- Mevcut framework'süz yapı korunur.
- `public/data/product-journeys.json` ortak seçenekleri, kategori playbook'larını ve ürün özelindeki alanları tutar.
- `public/product-planner.js` saf fonksiyonlarla rota, süre ve bütçeye göre dokuz aşamalı plan ve Markdown çıktısı üretir.
- `public/app.js` seçimleri, dialog akışını, görev durumunu ve `localStorage` kaydını yönetir.
- `public/styles.css` masaüstü ve mobil yol haritası arayüzünü içerir.
- Ürün fikri kartları yalnızca kısa özet ve ilerleme gösterir; detaylar kullanıcı talep edince açılır.

## Veri ve arayüz değişiklikleri

### Yeni dosyalar

- `public/data/product-journeys.json`
- `public/product-planner.js`

### Güncellenen dosyalar

- `public/index.html`
- `public/app.js`
- `public/styles.css`
- `README.md`
- `.github/workflows/validate.yml`

### LocalStorage

Yeni anahtar:

```text
ai-pusula-product-plans-v1
```

Yalnızca seçilen ürün kimliği, rota/süre/bütçe tercihleri, aktif aşama ve tamamlanan görev kimlikleri tutulur. Serbest metin müşteri verisi tutulmaz.

## Güvenlik ve gizlilik

- Müşteri adı, e-posta, telefon, şirket içi bilgi veya secret toplayan alan yoktur.
- Planın bütün verisi statik ve istemci tarafındadır.
- Dışa aktarma yalnızca ürün rehberini ve görev durumunu kapsar.
- Ürünlerin güvenlik adımı; veri minimizasyonu, prompt injection, rate limiting, yetkilendirme, secret ve maliyet kontrollerini ürün bağlamında işler.
- Mevcut CSP ve `public/` deploy sınırı korunur.

## Riskler ve geri alma

- 18 ürün için içerik miktarı büyüktür; ortak kategori playbook'ları tekrarları azaltır.
- Ürün yolu kesin iş sonucu garantisi vermez; arayüzde planın hipotez olduğu belirtilir.
- `localStorage` temizlenirse ilerleme silinir; bu bilinçli ve gizlilik odaklı bir tercihtir.
- Değişiklik ayrı PR olarak geri alınabilir.

## Doğrulama planı

- `node --check` ile iki JavaScript dosyası
- Bütün JSON dosyalarında parse kontrolü
- `ideas.json` ve `product-journeys.json` kimliklerinin birebir eşleşmesi
- Rota, süre, bütçe ve kategori şema kontrolü
- Saf planner modülünün her ürün için dokuz aşama ve görev üretmesi
- HTML yerel asset yolları ve yinelenen id kontrolü
- Lokal HTTP sunucusu üzerinden ana sayfa, planner modülü ve journey verisi smoke testi
- Headless Chromium ile bütün 18 ürünün açılması, seçimlerin değişmesi, ilerleme kalıcılığı, Markdown üretimi ve mobil taşma kontrolü
