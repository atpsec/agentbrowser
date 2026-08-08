# AI Pusula — Ürün İnşa Laboratuvarı

## Amaç

Az kod bilen bir ziyaretçinin profesyonel bir SaaS ürününü hangi sırayla, hangi teknik katmanlarla ve hangi güvenlik kontrolleriyle kuracağını görsel ve etkileşimli biçimde öğrenmesini sağlamak.

## İlk tam blueprint

**Duolingo benzeri AI Dil Öğrenme SaaS**

Kapsam:

- kullanıcı rolleri ve ekranlar
- frontend
- backend/API
- PostgreSQL veri modeli
- authentication + authorization
- AI öğretmen özellikleri
- abonelik ve webhook
- transactional email
- product analytics
- error monitoring
- CI/CD
- security gates
- staging / production / rollback
- activation / retention

## Etkileşim modeli

Ziyaretçi uzun bir doküman yerine şu beş görünüm arasında ilerler:

1. **Mimari** — tıklanabilir teknik katmanlar
2. **Yapım adımları** — 14 aşamalı profesyonel sıra
3. **Araçlar** — her servis ne işe yarar ve AI ile ilişkisi
4. **Veritabanı** — tablo bazlı veri şeması
5. **Ürün kapsamı** — roller, ekranlar, özellikler ve stack

Her yapım aşamasında:

- sorumlu teknik alan
- gerekli araçlar
- yapılacak görevler
- tamamlanma kriterleri
- AI kodlama aracına verilebilecek güvenlik odaklı görev promptu
- yüzde ilerleme

bulunur.

## Teknoloji rotaları

- **Minimum çaba:** entegrasyon sayısını azaltır
- **Dengeli profesyonel:** auth, data, AI ve operasyon sınırlarını ayırır
- **Profesyonel ölçek:** observability, CI/CD ve object storage gibi ek operasyon katmanları içerir

## Güvenlik ilkeleri

- secret veya gerçek müşteri verisi istenmez
- ilerleme sadece `localStorage` içinde tutulur
- AI/API anahtarları client tarafında önerilmez
- authorization server-side ve/veya RLS ile uygulanır
- payment webhook imzası ve idempotency kontrol edilir
- AI özelliklerinde input validation, structured output, kota, timeout ve prompt-injection sınırı bulunur
- production release staging, smoke test ve rollback adımlarından geçer
- Cloudflare yalnızca `public/` klasörünü yayınlar

## Kabul kriterleri

- [x] Bir tam profesyonel SaaS blueprint'i
- [x] En az 10 mimari katman
- [x] 14 yapım aşaması
- [x] Her aşamada görev ve tamamlanma kriterleri
- [x] Üç teknoloji rotası
- [x] Tıklanabilir mimari
- [x] Tıklanabilir yol haritası
- [x] Araç-resmî doküman bağlantıları
- [x] Veritabanı tablo gezgini
- [x] AI görev promptları
- [x] Tarayıcıda yüzde ilerleme
- [x] CSP uyumlu script yaklaşımı
- [x] Secret ve deployment sınırı CI kontrolleri

## Sonraki dikey dilimler

1. Aynı build engine'i mevcut 18 ürün fikrine bağlamak
2. Kullanıcı sorularına göre otomatik stack önerisi
3. Blueprint'lerden export edilebilir teknik proje brief'i üretmek
4. Her entegrasyon için bağlantı adımlarını ve örnek environment-variable isimlerini eklemek
5. Mobil uygulama ve B2B multi-tenant blueprint'leri eklemek
