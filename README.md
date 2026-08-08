# AI Pusula

Yapay zekâyı sıfırdan anlatan, güncel araç ve modelleri karşılaştıran, ürün fikirlerini **PUSULA + KAZAN** yaklaşımıyla ürüne ve müşteriye dönüştürmeye yardım eden etkileşimli Türkçe rehber.

## Ne sunuyor?

- Üç başlangıç rotası: öğren, araç seç, ürün geliştir
- Model / uygulama / araç / agent kavramlarını sade anlatan etkileşimli bölüm
- Arama, kategori ve ücretsiz erişim filtreli AI uygulama kataloğu
- Bulut, ücretsiz ve yerel model filtreleri ile üçlü karşılaştırma
- Siber güvenlik, yazılım, eğitim, küçük işletme ve içerik alanlarında 18 ürün fikri
- Her ürün fikri için doğrulamadan canlıya almaya ve ilk müşteriden büyümeye uzanan yol haritası
- Hizmet, SaaS, açık kaynak ve kuruma özel çözüm rotaları
- Hafta sonu, 14 günlük ve 30 günlük plan seçenekleri
- Ücretsiz, düşük bütçeli ve profesyonel altyapı seçenekleri
- PUSULA ürün geliştirme ve KAZAN müşteri kazanma metodolojileri
- Agent Security policy simülatörü
- Tarayıcıda saklanan kişisel ilerleme
- Resmî kaynaklara bağlı güncel gelişme zaman çizgisi

## Ürün yolculuğu

Her ürün fikri dokuz aşamada ele alınır:

```text
Ürün pasaportu
    ↓
Problemi doğrula
    ↓
Teklifi oluştur
    ↓
MVP'yi inşa et
    ↓
Güvenli test et
    ↓
Canlıya al
    ↓
İlk müşterileri bul
    ↓
Pazarlama ve satış
    ↓
Müşteriyi tut ve büyüt
```

Kullanıcı tek bir ürün için rota, süre ve bütçe seçebilir; adımları işaretleyebilir ve planı Markdown olarak kopyalayabilir veya indirebilir.

## Teknik yapı

Proje build gerektirmeyen statik HTML, CSS, JavaScript ve JSON dosyalarından oluşur.

```text
public/
├── index.html
├── styles.css
├── fit-scores.css
├── app.js
├── product-planner.js
├── _headers
├── favicon.svg
├── manifest.webmanifest
└── data/
    ├── apps.json
    ├── models.json
    ├── ideas.json
    ├── product-journeys.json
    └── updates.json
```

`product-journeys.json`, değişmeyen ortak metodoloji ile ürüne özel doğrulama, MVP, güvenlik, müşteri bulma, satış ve takip içeriğini birbirinden ayırır. `product-planner.js` seçilen rota, süre ve bütçeye göre dokuz aşamalı planı üretir.

## Lokal çalıştırma

```bash
python3 -m http.server 8080 -d public
```

Ardından `http://localhost:8080` adresini aç.

## Doğrulama

```bash
node --check public/app.js
node --check public/product-planner.js
```

GitHub Actions ayrıca:

- bütün JSON dosyalarını parse eder,
- ürün fikri ve yolculuk kimliklerini eşleştirir,
- dört rota / üç süre / üç bütçe yapılarını doğrular,
- her ürün için dokuz aşamalı plan üretir,
- yerel asset yollarını kontrol eder,
- lokal HTTP smoke testi çalıştırır.

## Cloudflare Workers deploy

`wrangler.jsonc`, yalnızca `public/` klasörünü statik asset olarak yayınlar.

```bash
npx wrangler deploy
```

GitHub entegrasyonu açıksa `main` branch'e gelen değişiklikler otomatik deploy edilir.

## İçerik güncelleme

Yeni uygulama, model, fikir veya gelişme eklemek için ilgili JSON dosyasına kayıt eklemek yeterlidir. Yeni ürün fikrinin tam yolculuk deneyimine katılması için aynı `id` değeriyle `product-journeys.json` içine bir kayıt eklenmelidir.

Değişebilen her uygulama ve model kaydında:

- resmî kaynak bağlantısı,
- son doğrulama tarihi,
- ücretsiz erişim veya lisans sınırı

bulunmalıdır.

## Güvenlik ve gizlilik

- Backend, kullanıcı hesabı veya secret yoktur.
- Öğrenme ve ürün planı ilerlemesi yalnızca `localStorage` içinde tutulur.
- Gerçek müşteri isimleri, e-postaları veya özel şirket bilgileri saklanmaz.
- Dışa aktarılan Markdown planı yalnızca rehber içeriği ve işaretlenen görevleri içerir.
- `_headers` temel CSP, frame, referrer ve permission politikalarını uygular.
- Cloudflare yalnızca `public/` klasörünü yayınlar; repository iç dosyaları asset olmaz.
- Harici olarak yalnızca sabit sürüme bağlanan Simple Icons SVG dosyaları kullanılır; logo yüklenmezse metin rozeti gösterilir.
