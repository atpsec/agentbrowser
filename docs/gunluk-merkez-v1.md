# AI Pusula Günlük Merkez v1

## Problem
Mevcut platform güçlü ancak aile, veli, çocuk, öğrenci ve küçük esnaf için seçenek yoğunluğu yüksek. Bu kullanıcıların çoğu kategori değil, doğrudan günlük bir işi bitirmek istiyor.

## Hedef
`/gunluk/` altında dört persona için basit, büyük hedefli ve local-first bir günlük merkez sunmak:
- Aile & Veli
- Çocuk
- Öğrenci
- Esnaf

## İlk sürüm araçları
Aile & Veli: haftalık aile planı, alışveriş listesi, okul çantası kontrolü.
Çocuk: odak zamanlayıcı, görev yıldızları, güvenli internet mini kartları.
Öğrenci: çalışma oturumu, ödev planı, hızlı tekrar kartları.
Esnaf: günlük kasa özeti, stok sayımı, hızlı teklif notu.

## Güvenlik / gizlilik
- Tüm araçlar browser içinde çalışır; app-owned JS ağ isteği yapmaz.
- Hesap, reklam, analitik, üçüncü taraf SDK veya harici AI yoktur.
- Çocuk araçları isim, konum, okul adı, fotoğraf, ses veya iletişim bilgisi istemez.
- Yerel kayıtlar sadece `ai-pusula-gunluk-*` anahtarlarını kullanır ve tek tuşla temizlenebilir.
- Finans araçları muhasebe/vergi beyanı değildir; sadece kullanıcının girdiği rakamların yerel özetidir.
- Ekran/odak aracı sağlık tavsiyesi veya ebeveyn gözetimi/izleme sistemi değildir.

## Kabul kriterleri
- Dört persona sekmesi klavye ile kullanılabilir.
- En az 12 günlük mikro araç görünür ve çalışır.
- Veriler reload sonrası localStorage üzerinden korunur.
- Clear-local-data işlemi yalnız Günlük Merkez anahtarlarını siler.
- 390px görünümde yatay taşma olmaz.
- App-owned JS içinde fetch/XHR/WebSocket/sendBeacon/eval/new Function/document.write/http(s) yoktur.
- PWA offline cache ve sitemap/manifest entegrasyonu vardır.

## Rollback
PR revert edilerek `/gunluk/`, manifest/sitemap/cache entegrasyonu kaldırılabilir.