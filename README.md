# AI Pusula

Yapay zekâyı sıfırdan anlatan, güncel araç ve modelleri karşılaştıran, ürün fikirlerini PUSULA metodolojisiyle geliştirmeye yardım eden etkileşimli Türkçe rehber.

## Ne sunuyor?

- Üç başlangıç rotası: öğren, araç seç, ürün geliştir
- Model / uygulama / araç / agent kavramlarını sade anlatan etkileşimli bölüm
- Arama, kategori ve ücretsiz erişim filtreli AI uygulama kataloğu
- Bulut, ücretsiz ve yerel model filtreleri ile üçlü karşılaştırma
- Siber güvenlik, yazılım, eğitim, küçük işletme ve içerik alanlarında ürün fikirleri
- PUSULA ürün geliştirme metodolojisi
- Agent Security policy simülatörü
- Tarayıcıda saklanan kişisel ilerleme
- Resmî kaynaklara bağlı güncel gelişme zaman çizgisi

## Teknik yapı

Proje build gerektirmeyen statik HTML, CSS, JavaScript ve JSON dosyalarından oluşur.

```text
public/
├── index.html
├── styles.css
├── app.js
├── _headers
├── favicon.svg
├── manifest.webmanifest
└── data/
    ├── apps.json
    ├── models.json
    ├── ideas.json
    └── updates.json
```

## Lokal çalıştırma

```bash
python3 -m http.server 8080 -d public
```

Ardından `http://localhost:8080` adresini aç.

## Cloudflare Workers deploy

`wrangler.jsonc`, yalnızca `public/` klasörünü statik asset olarak yayınlar.

```bash
npx wrangler deploy
```

GitHub entegrasyonu açıksa `main` branch'e gelen değişiklikler otomatik deploy edilir.

## İçerik güncelleme

Yeni uygulama, model, fikir veya gelişme eklemek için ilgili JSON dosyasına kayıt eklemek yeterlidir. Değişebilen her kayıtta:

- resmî kaynak bağlantısı,
- son doğrulama tarihi,
- ücretsiz erişim veya lisans sınırı

bulunmalıdır.

## Güvenlik

- Backend, kullanıcı hesabı veya secret yoktur.
- İlerleme yalnızca `localStorage` içinde tutulur.
- `_headers` temel CSP, frame, referrer ve permission politikalarını uygular.
- Harici olarak yalnızca sabit sürüme bağlanan Simple Icons SVG dosyaları kullanılır; logo yüklenmezse metin rozeti gösterilir.
