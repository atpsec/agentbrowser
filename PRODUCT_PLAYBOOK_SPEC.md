# Change: Ürün fikirleri için PUSULA + KAZAN yol haritaları

## Problem

Ürün fikirleri şu anda problemi, kullanıcıyı ve başlangıç aracını açıklıyor; ancak ziyaretçiye fikri doğrulamadan canlıya alma, müşteri bulma, satış ve takip aşamalarına kadar uygulanabilir bir yol göstermiyor.

## İstenen davranış

Her ürün fikri için, ziyaretçiyi boğmadan ayrıntıyı aşamalı açan etkileşimli bir ürün kurma çalışma alanı sunmak. Kullanıcı rota, süre ve bütçe seçebilmeli; görevleri işaretleyebilmeli; ilerlemeyi yüzde olarak kenar panelde görmeli ve planı kopyalayabilmeli.

## Kabul kriterleri

- [ ] 18 ürün fikrinin her biri özel ürün pasaportu ve yol haritası taşır.
- [ ] PUSULA, ürün doğrulama/inşa/test/canlıya alma aşamalarını kapsar.
- [ ] KAZAN, müşteri bulma/pazarlama/satış/takip aşamalarını kapsar.
- [ ] Hizmet, SaaS ve açık kaynak rotaları planı değiştirir.
- [ ] Hafta sonu, iki hafta ve 30 gün süre seçimleri görev kapsamını değiştirir.
- [ ] Ücretsiz, düşük bütçe ve profesyonel altyapı seçimleri stack önerisini değiştirir.
- [ ] Her fikirde MVP, sonraya bırakılacaklar ve şimdilik yapılmayacaklar görünür.
- [ ] Her fikirde güvenlik testleri, canlıya alma kontrolü, ilk 10 müşteri planı, pazarlama, satış, onboarding ve metrikler bulunur.
- [ ] Görevler localStorage içinde ürün bazında saklanır.
- [ ] Kenar panel yüzde ilerleme ve ilk eksik “bugünkü görev”i gösterir.
- [ ] Plan Markdown olarak panoya kopyalanabilir.
- [ ] Mobil, klavye ve azaltılmış hareket desteği korunur.
- [ ] JSON şekli ve JavaScript GitHub Actions ile doğrulanır.

## Teknik yaklaşım

- Yeni içerik `public/data/playbooks.json` içinde tutulur.
- Ortak satış ve ürün geliştirme davranışları profil şablonlarından, ürüne özel ayrıntılar fikir kayıtlarından gelir.
- Mevcut `ideas.json`, filtreler ve PUSULA anlatımı korunur.
- Yeni tam ekran native `<dialog>` çalışma alanı eklenir.
- Backend, hesap veya müşteri verisi tutulmaz.

## Güvenlik ve gizlilik

- Gerçek müşteri isimleri, e-postaları veya satış kayıtları saklanmaz.
- İlerleme yalnızca kullanıcının tarayıcısında tutulur.
- Panoya kopyalanan plan örnek metinler içerir; kullanıcı verisi içermez.
- Hassas ürünlerde güvenlik/test görevleri kapsamdan çıkarılamaz.

## Rollback

Değişiklik tek branch/PR olarak geri alınabilir. Yeni JSON ve dialog kaldırıldığında mevcut fikir kartları ile PUSULA bölümü çalışmaya devam eder.
