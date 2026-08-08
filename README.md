# AI Pusula

Yapay zekâyı sıfırdan anlatan; güncel araç ve modelleri karşılaştıran; ürün fikirlerini **PUSULA + KAZAN** yöntemiyle doğrulama, geliştirme, canlıya alma ve müşteri kazanma aşamalarına taşıyan etkileşimli Türkçe rehber.

## Ne sunuyor?

- Üç başlangıç rotası: öğren, araç seç, ürün geliştir
- Model / uygulama / araç / agent kavramlarını sade anlatan etkileşimli bölüm
- Arama, kategori ve ücretsiz erişim filtreli AI uygulama kataloğu
- Bulut, ücretsiz ve yerel model filtreleri ile üçlü karşılaştırma
- Siber güvenlik, yazılım, eğitim, küçük işletme ve içerik alanlarında 18 ürün fikri
- Her ürün fikri için özel ürün pasaportu ve ayrıntılı kurma planı
- **PUSULA:** problemi doğrula, teklifi oluştur, MVP’yi inşa et, güvenli test et, canlıya al
- **KAZAN:** ilk müşterileri bul, pazarla, sat, onboarding/takip ve büyüme
- Hizmet, SaaS ve açık kaynak başlangıç rotaları
- Hafta sonu, iki hafta ve 30 günlük kapsam seçenekleri
- Ücretsiz, düşük bütçe ve profesyonel stack önerileri
- Kenar panelde görev bazlı yüzde ilerleme ve “bugünkü tek görev”
- Planı Markdown olarak panoya kopyalama
- Agent Security policy simülatörü
- Tarayıcıda saklanan kişisel ilerleme
- Resmî kaynaklara bağlı güncel gelişme zaman çizgisi

## Teknik yapı

Proje build gerektirmeyen statik HTML, CSS, JavaScript ve JSON dosyalarından oluşur.

```text
public/
├── index.html
├── styles.css
├── fit-scores.css
├── app.js
├── _headers
├── favicon.svg
├── manifest.webmanifest
└── data/
    ├── apps.json
    ├── models.json
    ├── ideas.json
    ├── playbooks.json
    └── updates.json
```

`playbooks.json`, ortak müşteri/ürün profilleri ile 18 fikre özel MVP, test, satış, pazarlama, onboarding ve metrik verilerini içerir.

## Lokal çalıştırma

```bash
python3 -m http.server 8080 -d public
```

Ardından `http://localhost:8080` adresini aç.

## Doğrulama

GitHub Actions şu kontrolleri çalıştırır:

- JavaScript sözdizimi
- Tüm JSON dosyalarının ayrıştırılması
- Yinelenen HTML kimlikleri ve eksik yerel asset yolları
- Uygulama/model/fikir veri alanları
- 18 fikir ile 18 ürün planının bire bir eşleşmesi
- Her ürün planında zorunlu pasaport, MVP, test, kanal ve metrik alanları
- Wrangler asset kapsamı
- Yerel HTTP smoke testi

## Cloudflare Workers deploy

`wrangler.jsonc`, yalnızca `public/` klasörünü statik asset olarak yayınlar.

```bash
npx wrangler deploy
```

GitHub entegrasyonu açıksa `main` branch’e gelen değişiklikler otomatik deploy edilir.

## İçerik güncelleme

Yeni uygulama, model, fikir veya gelişme eklemek için ilgili JSON dosyasına kayıt eklenir. Yeni fikir ekleniyorsa aynı `id` ile `playbooks.json` içinde özel ürün planı da bulunmalıdır.

Değişebilen model ve uygulama kayıtlarında:

- resmî kaynak bağlantısı,
- son doğrulama tarihi,
- ücretsiz erişim veya lisans sınırı

bulunmalıdır.

## Güvenlik ve gizlilik

- Backend, kullanıcı hesabı veya secret yoktur.
- İlerleme yalnızca `localStorage` içinde tutulur.
- Gerçek müşteri isimleri, e-postaları veya CRM verileri kaydedilmez.
- `_headers` temel CSP, frame, referrer ve permission politikalarını uygular.
- Cloudflare yalnızca `public/` klasörünü yayınlar; repository iç dosyaları asset değildir.
- Harici olarak yalnızca sabit sürüme bağlanan Simple Icons SVG dosyaları kullanılır; logo yüklenmezse metin rozeti gösterilir.
