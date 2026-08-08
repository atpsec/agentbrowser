# AI Pusula Her Şey Kutusu v1

## Problem
AI Pusula güçlü fotoğraf, PDF, QR, eğitim ve ürün üretim araçlarına sahip; ancak günlük yaşamda herkesin tekrar tekrar kullanacağı küçük yardımcılar tek bir keşif yüzeyinde değil.

## Desired behavior
`/toolbox/` altında günlük yaşam, para, sağlık günlüğü, mutfak, seyahat, araç, aile, iş, freelancer, öğrenci, metin, dosya, dijital, gizlilik, medya, etkinlik, evcil hayvan, erişilebilirlik ve genel hesap kategorilerini tek arama/filtre deneyiminde sun.

## Acceptance criteria
- En az 150 çalışan mikro araç tanımı ve en az 18 kategori.
- Her araç arama ile bulunabilir ve tek ekranda açılır.
- Checklist/tracker/timer tercihleri yalnız cihazda saklanır; kullanıcı tüm toolbox verisini tek tuşla silebilir.
- Metin, finans, dönüştürme, hash, JSON/CSV ve tarih hesapları deterministik ve tarayıcı içinde çalışır.
- Sağlık araçları tanı/tedavi iddiası taşımaz; yalnız kayıt veya basit bilgilendirici hesap yapar.
- IP aracı dış servise gitmez; kullanıcının girdiği IP metnini yalnız yerel olarak sınıflandırır.
- Text-to-speech yalnız tarayıcı `speechSynthesis` desteği varsa çalışır.
- Hiçbir araç credential, API key, ödeme bilgisi, fotoğraf/PDF içeriği veya donanım fingerprint'i toplamaz.
- Uygulama dış HTTP(S) çağrısı yapmaz.
- Mobil 390px görünümde yatay taşma yoktur.
- PWA offline cache toolbox varlıklarını içerir.
- Ana sayfa araması ve navigasyon toolbox'a ulaşabilir.

## Security/privacy
- Strict CSP korunur; yeni üçüncü taraf script/frame/connect kaynağı eklenmez.
- `eval`, `new Function`, `document.write`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` kullanılmaz.
- Kullanıcı metni DOM'a `textContent` ile yazılır; HTML olarak yürütülmez.
- Yerel kayıtlar `ai-pusula-toolbox-*` namespace'i ile sınırlandırılır.
- Hash için Web Crypto kullanılır.
- Şifre/passphrase için `crypto.getRandomValues` kullanılır.

## Rollback
Bu PR geri alınır. Mevcut `/easy/`, `/apps/`, `/studio/`, `/demo/` ve landing sayfaları bağımsız kalır.

## Verification
- Node syntax/import checks.
- Tool count/category/unique-id contract.
- Secret + unsafe API static scan.
- Playwright: arama, kategori, checklist persistence, calculator, converter, text tools, password, hash, JSON/CSV, timer, accessibility, clear-local-data, 390px overflow, zero unexpected external requests/errors.
- Existing regression workflows remain green.