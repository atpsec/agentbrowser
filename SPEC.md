# Change: AI Pusula etkileşimli rehberi

## Problem

Mevcut site Agent Security konusunu görsel olarak anlatıyor ancak yeni ziyaretçiye açık bir başlangıç rotası, araç seçme akışı, model karşılaştırması veya ürün geliştirme yöntemi sunmuyor. Uzun doğrusal içerik, başlangıç seviyesindeki kullanıcıyı yorabiliyor.

## İstenen davranış

Siteyi, 10 yaşındaki bir çocuğun anlayabileceği sade dille başlayıp isteyen kullanıcıya teknik ayrıntı açan; etkileşimli, güncellenebilir ve güvenlik odaklı kapsamlı bir Türkçe yapay zekâ rehberine dönüştürmek.

## Kabul kriterleri

- [x] Üç net başlangıç rotası: AI öğren, araç seç, ürün geliştir
- [x] Model, uygulama, araç ve agent için etkileşimli temel anlatım
- [x] Arama, kategori ve ücretsiz seçenek filtresi olan uygulama kataloğu
- [x] Güncel model kataloğu ve en fazla üçlü karşılaştırma
- [x] Bulut, ücretsiz ve yerel model görünümü
- [x] Kategori ve zorluk filtreli ürün/hizmet fikirleri
- [x] PUSULA metodolojisi için adım adım etkileşim
- [x] Agent Security policy simülatörü
- [x] Resmî kaynaklı güncel gelişme zaman çizgisi
- [x] Tarayıcıda kalıcı öğrenme ilerlemesi
- [x] Mobil, klavye ve azaltılmış hareket desteği
- [x] Cloudflare deploy'un yalnızca `public/` klasörünü yayınlaması

## Teknik yaklaşım

- Framework yok: semantik HTML, modern CSS ve vanilla JavaScript
- İçerik `public/data/*.json` dosyalarında tutulur
- Uygulama durumu ve ilerleme `localStorage` içinde saklanır
- Native `<dialog>`, `<details>`, filtreler ve event delegation kullanılır
- Logo SVG'leri sabit Simple Icons sürümünden yüklenir; başarısız olursa metin rozeti görünür
- Backend, kullanıcı hesabı ve secret gerekmez

## Güvenlik ve gizlilik

- CSP yalnızca site dosyalarına ve sabit logo CDN'ine izin verir
- Kamera, mikrofon ve konum izinleri kapalıdır
- Site iframe içinde çalıştırılamaz
- Kullanıcı verisi sunucuya gönderilmez
- Model ve ürün kartlarında değişebilen bilgiler için kaynak ve doğrulama tarihi bulunur
- Agent örneklerinde en az yetki, insan onayı, ağ çıkışı ve secret sınırı vurgulanır

## Riskler ve geri alma

Model adları, ücretsiz kotalar ve plan koşulları zamanla değişebilir. Veriler JSON dosyalarında ayrıldığı için tek kayıt güncellenebilir. Değişiklik bir Git revert ile geri alınabilir.

## Doğrulama planı

- JavaScript sözdizimi kontrolü
- Tüm JSON dosyalarında parse kontrolü
- HTML/CSS/asset yolları ve CSP kontrolü
- Lokal HTTP sunucusu üzerinden tarayıcı smoke testi
- Mobil görünüm ve temel etkileşim testi
- Cloudflare Worker asset kapsamının `public/` ile sınırlı olduğunun kontrolü
