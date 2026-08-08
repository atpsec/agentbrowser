const c=(id,title,category,items,desc='Hazır listeyi işaretle, kendi maddelerini ekle ve ilerlemeyi cihazında tut.')=>({id,title,category,type:'checklist',items,desc});
const t=(id,title,category,mode,desc)=>({id,title,category,type:'text',mode,desc});
const k=(id,title,category,formula,desc)=>({id,title,category,type:'calc',formula,desc});
const r=(id,title,category,fields,desc)=>({id,title,category,type:'tracker',fields,desc});
const g=(id,title,category,mode,desc)=>({id,title,category,type:'generator',mode,desc});
const v=(id,title,category,kind,desc)=>({id,title,category,type:'converter',kind,desc});
const tm=(id,title,category,seconds,desc)=>({id,title,category,type:'timer',seconds,desc});

export const categories=[
['daily','Günlük yaşam'],['finance','Para'],['wellness','Sağlık günlüğü'],['kitchen','Mutfak'],['travel','Seyahat'],['vehicle','Araç'],['family','Aile & ev'],['work','İş'],['freelance','Freelancer'],['student','Öğrenci'],['text','Metin'],['file','Dosya & veri'],['digital','Dijital'],['privacy','Gizlilik & güvenlik'],['media','Medya'],['events','Etkinlik'],['pet','Evcil hayvan'],['access','Erişilebilirlik'],['calc','Hesap merkezi']
];

export const tools=[
// Günlük yaşam
c('shopping-list','Alışveriş listesi','daily',['Sebze/meyve','Süt ürünleri','Temel gıda','Temizlik','Kişisel bakım']),
c('home-todos','Ev yapılacaklar listesi','daily',['Bugün','Bu hafta','Bu ay']),
c('bag-pack','Çanta hazırlayıcı','daily',['Telefon','Cüzdan','Anahtar','Şarj kablosu','Su','İlaç']),
c('leave-home','Evden çıkış kontrolü','daily',['Anahtar','Cüzdan','Telefon','Ocak kapalı','Pencereler','Kapı kilidi']),
c('moving','Taşınma kontrol listesi','daily',['Koli/etiket','Elektrik-su-internet','Adres değişikliği','Temizlik','Anahtar teslimi']),
c('cleaning','Temizlik planlayıcı','daily',['Mutfak','Banyo','Toz','Süpürme','Çamaşır','Çöp']),
c('guest-prep','Misafir hazırlığı','daily',['Masa','İçecek','Yemek','Havlu','Oturma alanı']),
r('pantry-stock','Ev stok takipçisi','daily',['Ürün','Miktar'],'Deterjan, pil, kağıt gibi ev stoklarını cihazında kaydet.'),
r('expiry-log','Son kullanma takipçisi','daily',['Ürün','Tarih'],'Buzdolabı ve kiler ürünlerini yerel olarak kaydet.'),
c('today-plan','Bugün planım','daily',['En önemli iş','Kısa iş','Kendim için','Akşam kontrolü']),
g('decision-wheel','Karar seçici','daily','choice','Yemek, film veya aktivite seçeneklerinden güvenli rastgele seçim yap.'),
c('emergency-home','Ev acil durum listesi','daily',['Acil numaralar','Sigorta bilgisi','Su vanası','Elektrik panosu','İlk yardım çantası']),

// Para
k('split-bill','Hesap bölüştürücü','finance','split','Toplam hesabı kişi sayısına böl.'),
k('tip','Bahşiş hesaplayıcı','finance','tip','Hesap ve yüzdeye göre bahşiş ile toplamı hesapla.'),
k('discount','İndirim hesaplayıcı','finance','discount','Etiket fiyatı ve indirim yüzdesinden son fiyatı bul.'),
k('vat','KDV hesaplayıcı','finance','vat','Tutar ve KDV oranından dahil/hariç değeri hesapla.'),
k('percent-change','Yüzde değişim','finance','percent-change','Eski ve yeni değer arasındaki yüzde değişimi bul.'),
k('unit-price','Birim fiyat karşılaştırıcı','finance','unit-price','Paket fiyatlarını kg/litre/adet bazında karşılaştır.'),
k('savings-goal','Birikim hedefi','finance','savings','Hedef tutar, mevcut birikim ve aylık katkı ile süre tahmini yap.'),
k('annual-cost','Aylık → yıllık maliyet','finance','annual','Aylık bir giderin yıllık toplamını göster.'),
k('margin','Kâr marjı hesaplayıcı','finance','margin','Maliyet ve satış fiyatından kâr ve marjı hesapla.'),
r('subscriptions','Abonelik takipçisi','finance',['Abonelik','Aylık tutar'],'Abonelikleri cihazında kaydet; ödeme servisine bağlanmaz.'),
r('income-expense','Gelir-gider defteri','finance',['Açıklama','Tutar'],'Basit kişisel kayıt; finansal danışmanlık değildir.'),
c('holiday-budget','Tatil bütçesi listesi','finance',['Ulaşım','Konaklama','Yemek','Aktivite','Acil pay']),
c('event-budget','Etkinlik bütçesi listesi','finance',['Mekan','Yiyecek','Dekor','Ulaşım','Beklenmeyen']),
c('shared-home','Ortak ev giderleri','finance',['Kira','Elektrik','Su','İnternet','Market']),

// Sağlık günlüğü - teşhis yok
r('water-log','Su takipçisi','wellness',['Miktar (ml)','Saat'],'Yalnız kişisel kayıt. Tıbbi öneri üretmez.'),
r('med-log','İlaç saat çizelgesi','wellness',['İlaç adı','Saat'],'Yalnız hatırlatma kaydı; doz/tedavi önermez.'),
r('sleep-log','Uyku günlüğü','wellness',['Saat','Süre'],'Uyku süreni kaydet; teşhis üretmez.'),
r('mood-log','Ruh hali günlüğü','wellness',['Not','Puan 1-5'],'Kişisel farkındalık günlüğü.'),
r('symptom-log','Semptom not defteri','wellness',['Belirti','Not'],'Doktor görüşmesine not hazırlamak içindir; tanı koymaz.'),
c('doctor-visit','Doktor randevusu hazırlığı','wellness',['Belirtilerim','Kullandığım ilaçlar','Sorularım','Önceki sonuçlar']),
r('bp-log','Kan basıncı kaydı','wellness',['Sistolik/Diyastolik','Saat'],'Ölçüm kaydıdır; sonuç yorumlamaz.'),
r('glucose-log','Kan şekeri kaydı','wellness',['Değer','Saat'],'Ölçüm kaydıdır; tıbbi karar vermez.'),
r('weight-log','Kilo değişim kaydı','wellness',['Kilo','Tarih'],'Sadece kişisel takip.'),
r('walk-log','Yürüyüş kaydı','wellness',['Dakika','Mesafe'],'Günlük hareket kaydı.'),
tm('breathing','Nefes egzersizi zamanlayıcı','wellness',120,'Basit süre sayacı; sağlık tedavisi değildir.'),
tm('screen-break','20-20-20 ekran molası','wellness',1200,'20 dakikalık ekran çalışma periyodu için yerel sayaç.'),

// Mutfak
k('portion-scale','Porsiyon çevirici','kitchen','portion','Tarif miktarlarını kişi sayısına göre ölçekle.'),
v('kitchen-units','Mutfak ölçü dönüştürücü','kitchen','volume','ml, litre, bardak ve yemek kaşığı arasında yaklaşık dönüşüm.'),
tm('kitchen-timer','Mutfak timer','kitchen',300,'Sekme açıkken çalışan basit mutfak sayacı.'),
c('weekly-menu','Haftalık yemek planı','kitchen',['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']),
c('meal-shopping','Menüden alışveriş kontrolü','kitchen',['Protein','Sebze','Tahıl','Süt ürünü','Atıştırmalık']),
c('leftovers','Kalan yemek değerlendirme','kitchen',['Buzdolabındakileri yaz','Önce bozulacakları ayır','Yeni kombinasyon planla']),
c('lunchbox','Beslenme kutusu planı','kitchen',['Ana öğün','Meyve/sebze','İçecek','Atıştırmalık']),
c('guest-menu','Misafir menüsü','kitchen',['Başlangıç','Ana yemek','Yan yemek','Tatlı','İçecek']),
c('breakfast-plan','Kahvaltı planı','kitchen',['Protein','Tahıl','Meyve/sebze','İçecek']),
c('quick-meal','10 dakikalık yemek listesi','kitchen',['Yumurta','Sandviç','Yoğurt/kase','Salata','Hazır çorba + ek']),
r('fridge-inventory','Buzdolabı envanteri','kitchen',['Ürün','Miktar'],'Malzemeleri yerel olarak kaydet.'),
r('recipe-box','Tarif koleksiyonu','kitchen',['Tarif adı','Kısa not'],'Kısa tarif notlarını cihazında sakla.'),

// Seyahat
c('travel-pack','Valiz hazırlayıcı','travel',['Kimlik/pasaport','Bilet/rezervasyon','Kıyafet','Şarj','İlaç','Hijyen']),
c('flight-check','Uçuş öncesi kontrol','travel',['Online check-in','Belge','Bagaj','Havalimanı ulaşımı','Kapı/saat']),
c('hotel-checkout','Otel çıkış kontrolü','travel',['Dolap','Banyo','Prizler','Kasa','Anahtar/kart']),
c('camp-pack','Kamp hazırlık listesi','travel',['Çadır','Uyku ekipmanı','Su','Fener','İlk yardım','Çöp poşeti']),
c('beach-pack','Plaj çantası','travel',['Havlu','Güneş koruyucu','Su','Şapka','Yedek kıyafet']),
c('baby-travel','Bebekli seyahat','travel',['Bez','Islak mendil','Yedek kıyafet','Mama','İlaç/termometre']),
c('road-trip','Uzun yol hazırlığı','travel',['Yakıt','Lastik','Su','Şarj','Belge','Dinlenme planı']),
k('trip-fuel','Yol yakıt maliyeti','travel','fuel','Mesafe, tüketim ve yakıt fiyatından tahmini maliyet.'),
k('trip-split','Yolculuk masraf bölüştür','travel','split','Ortak seyahat giderini kişi sayısına böl.'),
r('travel-notes','Seyahat notları','travel',['Başlık','Not'],'Rezervasyon numarası gibi hassas sırları kaydetmemen önerilir.'),

// Araç
k('fuel-cost','100 km yakıt maliyeti','vehicle','fuel100','100 km tüketim ve yakıt fiyatından maliyet.'),
k('fuel-consumption','Yakıt tüketimi','vehicle','consumption','Alınan yakıt ve gidilen km ile L/100 km hesapla.'),
r('car-maintenance','Araç bakım takipçisi','vehicle',['Bakım','Km/Tarih'],'Bakım kayıtlarını cihazında tut.'),
r('oil-change','Yağ değişimi kaydı','vehicle',['Km','Tarih'],'Son yağ değişimini kaydet.'),
r('tire-change','Lastik değişimi kaydı','vehicle',['Set','Tarih'],'Mevsimsel lastik değişimini kaydet.'),
r('inspection-date','Muayene tarih kaydı','vehicle',['Araç','Tarih'],'Takvim kaydı; resmi süreyi otomatik doğrulamaz.'),
r('insurance-date','Sigorta tarih kaydı','vehicle',['Poliçe notu','Tarih'],'Hassas poliçe numarası kaydetmek yerine kısa not kullan.'),
r('car-expense','Araç masraf defteri','vehicle',['Açıklama','Tutar'],'Yakıt/bakım giderlerini yerel tut.'),
c('used-car-check','İkinci el araç bakma listesi','vehicle',['Şasi/evrak kontrolü','Servis geçmişi','Lastikler','Fren','Elektronik','Ekspertiz']),
c('sell-car','Araç satışı hazırlığı','vehicle',['Temizlik','Fotoğraflar','Bakım kayıtları','Evrak','Kişisel verileri sil']),

// Aile & ev
c('family-board','Aile görev panosu','family',['Mutfak','Çöp','Çamaşır','Alışveriş','Evcil hayvan']),
c('kids-chores','Çocuk görev çizelgesi','family',['Oda','Çanta','Kitap','Oyuncak','Masa']),
r('allowance','Harçlık takipçisi','family',['Açıklama','Tutar'],'Basit aile içi kayıt.'),
c('school-bag','Okul çantası kontrolü','family',['Kitap','Defter','Kalemlik','Su','Beslenme']),
c('birthday-plan','Doğum günü planlayıcı','family',['Davetli','Mekan','Pasta','Hediye','Fotoğraf']),
r('home-warranty','Garanti takipçisi','family',['Cihaz','Bitiş tarihi'],'Ev cihazı garanti tarihlerini sakla.'),
r('home-inventory','Ev envanteri','family',['Eşya','Oda'],'Sigorta/taşınma için genel envanter; hassas seri no şart değil.'),
c('important-docs','Önemli belge listesi','family',['Kimlik','Pasaport','Sigorta','Diploma','Tapu/kira'],'Belge içeriğini değil, nerede olduğunu takip et.'),
c('move-in','Eve yerleşme listesi','family',['Sayaçlar','İnternet','Temizlik','Kilit','Duman alarmı']),
c('family-emergency','Aile acil durum kartı hazırlığı','family',['İletişim kişisi','Buluşma noktası','İlaç notu','Evcil hayvan planı']),

// İş
c('daily-work','Günlük iş listesi','work',['1 önemli iş','2 kısa iş','Toplantılar','Gün sonu notu']),
tm('pomodoro','Pomodoro','work',1500,'25 dakikalık odak sayacı.'),
tm('focus-50','50 dakika odak','work',3000,'Uzun odak oturumu sayacı.'),
k('meeting-cost','Toplantı süre maliyeti','work','meeting','Kişi sayısı, süre ve saatlik maliyetten kaba toplam.'),
k('work-hours','Mesai süresi','work','hours','Başlangıç, bitiş ve mola ile günlük çalışma süresi.'),
r('overtime-log','Fazla mesai kaydı','work',['Süre','Not'],'Kişisel kayıt; resmi bordro hesabı değildir.'),
c('weekly-work','Haftalık çalışma planı','work',['Pazartesi','Salı','Çarşamba','Perşembe','Cuma']),
r('done-log','Bugün ne yaptım?','work',['İş','Sonuç'],'Tamamlanan işleri cihazında tut.'),
c('eisenhower','Eisenhower matrisi','work',['Acil + önemli','Önemli, acil değil','Acil, önemli değil','Ne acil ne önemli']),
c('decision-matrix','Karar matrisi','work',['Seçenekler','Maliyet','Fayda','Risk','Geri dönüş']),

// Freelancer
k('hourly-rate','Saatlik ücret hedefi','freelance','hourly-rate','Aylık gelir hedefi, çalışma günü ve faturalandırılabilir saatten saatlik hedef.'),
k('project-price','Proje fiyatı','freelance','project-price','Saat, saatlik ücret ve risk payından kaba teklif tutarı.'),
k('profit-price','Ürün fiyatlandırma','freelance','margin-price','Maliyet ve hedef marjdan öneri satış fiyatı.'),
c('client-brief','Müşteri brief formu','freelance',['Amaç','Hedef kitle','Teslimler','Deadline','Onaylayan kişi']),
r('simple-crm','Basit CRM','freelance',['Müşteri','Durum'],'Kişisel cihazda hafif müşteri takibi.'),
r('collection-log','Tahsilat takipçisi','freelance',['Müşteri/Fatura','Durum'],'Kart/banka verisi kaydetmez.'),
r('order-log','Sipariş takipçisi','freelance',['Sipariş','Durum'],'Basit yerel sipariş durumu.'),
c('delivery-check','Teslimat checklist','freelance',['Dosyalar','İsimlendirme','Yedek','Müşteri onayı','Fatura']),
c('service-package','Hizmet paketi oluşturucu','freelance',['Sonuç','Kapsam','Hariçler','Süre','Fiyat']),
r('cashbook','Basit kasa defteri','freelance',['Açıklama','Tutar'],'Yerel kayıt; muhasebe yazılımı değildir.'),

// Öğrenci
k('grade-average','Not ortalaması','student','average','Virgülle girilen notların basit ortalaması.'),
k('grade-needed','Geçmek için kaç almalıyım?','student','grade-needed','Mevcut not, ağırlık ve hedef ortalamaya göre gereken son notu hesapla.'),
tm('study-timer','Ders çalışma timer','student',1800,'30 dakikalık çalışma sayacı.'),
c('exam-plan','Sınav çalışma planı','student',['Konular','Zayıf alanlar','Deneme','Tekrar','Uyku']),
r('homework-log','Ödev takipçisi','student',['Ödev','Tarih'],'Ödevleri cihazında tut.'),
r('reading-log','Okuma takipçisi','student',['Kaynak','Sayfa/İlerleme'],'Kitap/makale ilerlemesini kaydet.'),
r('flashcards','Kelime kartı defteri','student',['Ön yüz','Arka yüz'],'Basit yerel flashcard kayıtları.'),
r('formula-book','Formül defteri','student',['Başlık','Formül'],'Kısa formülleri cihazda sakla.'),
c('weekly-study','Haftalık ders programı','student',['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']),
r('study-streak','Çalışma serisi','student',['Dakika','Tarih'],'Kendi çalışma süreni kaydet.'),

// Metin
t('word-count','Kelime sayacı','text','count','Kelime, karakter, satır ve yaklaşık okuma süresi.'),
t('case-upper','Büyük harfe çevir','text','upper','Metni locale-aware büyük harfe çevir.'),
t('case-lower','Küçük harfe çevir','text','lower','Metni küçük harfe çevir.'),
t('title-case','Başlık biçimlendirici','text','title','Kelimelerin ilk harflerini büyüt.'),
t('space-clean','Boşluk temizleyici','text','spaces','Fazla boşluk ve gereksiz satır sonlarını temizle.'),
t('dedupe-lines','Tekrarlanan satırları kaldır','text','dedupe','Aynı satırları ilk sıralarını koruyarak tekilleştir.'),
t('sort-lines','Satırları alfabetik sırala','text','sort','Satırları Türkçe locale ile sırala.'),
t('reverse-lines','Listeyi ters çevir','text','reverse','Satır sırasını tersine çevir.'),
t('comma-lines','Virgül ↔ satır listesi','text','comma-lines','Virgülle ayrılmış veriyi satırlara veya tersine çevir.'),
t('slug','Slug oluşturucu','text','slug','Başlığı URL/dosya dostu slug biçimine getir.'),
t('filename','Dosya adı temizleyici','text','filename','Riskli/uygunsuz dosya adı karakterlerini temizle.'),
t('lorem','Lorem ipsum','text','lorem','Yerel örnek metin üret.'),
t('base64','Base64 encode/decode','text','base64','UTF-8 metni Base64 dönüştür veya geri aç.'),
t('url-code','URL encode/decode','text','url','Metni URL encoding biçimine dönüştür.'),
t('link-clean','Link temizleyici','text','clean-url','utm_* ve yaygın tracking query parametrelerini yerel olarak kaldır.'),
t('diff-text','İki metni karşılaştır','text','diff','İki metnin aynı olup olmadığını ve temel uzunluk farkını göster.'),

// Dosya & veri
{ id:'sha256',title:'SHA-256 hesaplayıcı',category:'file',type:'hash',desc:'Dosyayı sunucuya göndermeden Web Crypto ile SHA-256 hesapla.'},
{ id:'json-format',title:'JSON düzenle/doğrula',category:'file',type:'json',desc:'JSON metnini parse edip girintili biçimde göster.'},
{ id:'csv-json',title:'CSV → JSON',category:'file',type:'csvjson',direction:'csv-json',desc:'Basit virgülle ayrılmış CSV verisini tarayıcıda JSON yap.'},
{ id:'json-csv',title:'JSON → CSV',category:'file',type:'csvjson',direction:'json-csv',desc:'Düz nesne dizisini CSV metnine dönüştür.'},
t('xml-escape','XML/HTML güvenli kaçış','file','escape','Metindeki &, <, >, tırnak karakterlerini entity olarak kaçır.'),
t('markdown-preview','Markdown hızlı önizleme','file','markdown','Başlık, kalın, italik ve listeler için güvenli düz önizleme; HTML yürütmez.'),
t('data-uri','Data URI metin üretici','file','data-uri','Kısa düz metni data:text/plain URI biçimine getir.'),
t('lines-json','Satırlar → JSON dizi','file','lines-json','Her satırı bir JSON string öğesine dönüştür.'),
t('json-lines','JSON dizi → satırlar','file','json-lines','String dizisini satır listesine dönüştür.'),
c('file-organize','Dosya düzenleme planı','file',['İndirilenler','Belgeler','Fotoğraflar','Arşiv','Silinecekler']),
c('backup-check','Yedekleme checklist','file',['Önemli dosyaları seç','İkinci kopya','Bulut/harici disk','Geri yükleme testi','Tarih notu']),
c('digital-cleanup','Dijital temizlik listesi','file',['Masaüstü','İndirilenler','Büyük dosyalar','Eski ekran görüntüleri','Çöp kutusu']),

// Dijital
{ id:'ip-explain',title:'IP adresi yerel açıklayıcı',category:'digital',type:'ip',desc:'Girdiğin IPv4 adresinin özel/loopback/link-local olup olmadığını yerel olarak sınıflandır; internete sorgu atmaz.'},
{ id:'browser-check',title:'Tarayıcı özellik kontrolü',category:'digital',type:'browser',desc:'Web Crypto, Service Worker, localStorage, speechSynthesis gibi yerel browser yeteneklerini göster.'},
t('timestamp','Unix timestamp çevirici','digital','timestamp','Unix saniye/milisaniye ile yerel tarih arasında dönüşüm.'),
t('url-parts','URL parçalarını açıkla','digital','url-parts','Protokol, host, path, query ve fragment bölümlerini yerel olarak ayır.'),
t('utm-builder','UTM oluşturucu','digital','utm','URL, source, medium ve campaign metninden link üret.'),
g('uuid','UUID oluşturucu','digital','uuid','Tarayıcı crypto API ile UUID üret.'),
g('random-number','Rastgele sayı','digital','number','Belirttiğin aralıkta güvenli rastgele tam sayı üret.'),
g('random-choice','Listeden rastgele seç','digital','choice','Satırlardan birini crypto tabanlı rastgele seç.'),
g('teams','Rastgele takım oluştur','digital','teams','İsimleri yerel olarak karıştırıp takım gruplarına ayır.'),
c('new-device','Yeni cihaz kurulum listesi','digital',['Güncelle','Ekran kilidi','2FA','Yedek','Bul cihazımı','Gizlilik ayarları']),

// Gizlilik & güvenlik
g('password','Güçlü şifre üretici','privacy','password','crypto.getRandomValues ile cihazda güçlü rastgele parola üret.'),
g('passphrase','Passphrase üretici','privacy','passphrase','Yerel kelime listesinden crypto tabanlı passphrase üret.'),
c('account-security','Hesap güvenliği checklist','privacy',['Benzersiz parola','2FA','Kurtarma kodu','Oturumları kontrol et','Kurtarma e-postası']),
c('phone-security','Telefon güvenliği checklist','privacy',['Güncellemeler','PIN/biometri','Yedek','Uygulama izinları','Bul cihazımı']),
c('travel-security','Seyahat dijital güvenlik','privacy',['Gereksiz veriyi kaldır','Yedekle','2FA kurtarma','Otomatik Wi-Fi kapalı','Şarj adaptörü']),
c('social-privacy','Sosyal medya gizlilik kontrolü','privacy',['Profil görünürlüğü','Konum','Etiket izinleri','Bağlı uygulamalar','Eski gönderiler']),
c('shopping-security','Online alışveriş güvenliği','privacy',['Alan adını kontrol et','HTTPS','Satıcı bilgisi','Aşırı ucuzluk şüphesi','Kart kaydetmeyi düşün']),
c('breach-response','Veri ihlali sonrası yapılacaklar','privacy',['Parolayı değiştir','Aynı parolayı kullanan hesaplar','2FA aç','Oturumları kapat','Finansal hareketleri izle']),
c('phishing-check','Şüpheli mesaj kontrolü','privacy',['Gönderen alan adı','Acil baskı dili','Link hedefi','Dosya eki','Bağımsız kanaldan doğrula']),
c('recovery-codes','2FA kurtarma kodu saklama planı','privacy',['Kodları indir','Çevrimdışı güvenli kopya','Şifre yöneticisi notu','Erişim testi']),

// Medya
k('aspect-ratio','Görüntü oranı','media','aspect','Genişlik/yükseklik oranını sadeleştir.'),
k('video-total','Video süre toplama','media','durations','Dakika cinsinden süre listesinin toplamını hesapla.'),
t('srt-text','SRT → düz metin','media','srt','Zaman kodlarını ve sıra numaralarını ayıklayıp konuşma metnini çıkar.'),
t('youtube-title','Başlık uzunluğu kontrolü','media','title-length','Bir başlığın karakter sayısını göster; platform limiti iddiası yapmaz.'),
c('video-shoot','Video çekim checklist','media',['Pil','Depolama','Ses','Işık','Kadraj','Yedek çekim']),
c('podcast-plan','Podcast bölüm planı','media',['Açılış','Ana konu 1','Ana konu 2','Özet','CTA']),
c('social-image','Sosyal görsel hazırlık listesi','media',['Platform','Oran','Güvenli alan','Başlık','Alt metin']),
c('subtitle-check','Altyazı kalite listesi','media',['Yazım','Satır uzunluğu','Zamanlama','Konuşmacı ayrımı','Okunabilirlik']),

// Etkinlik
k('birthday-countdown','Doğum günü/etkinlik geri sayacı','events','days','İki tarih arasındaki gün sayısını göster.'),
r('gift-ideas','Hediye fikir defteri','events',['Kişi','Fikir'],'Hediye fikirlerini cihazında tut.'),
r('guest-list','Davetli listesi','events',['İsim','Durum'],'Basit yerel davetli takibi.'),
c('party-list','Parti alışveriş listesi','events',['İçecek','Atıştırmalık','Ana yemek','Pasta','Peçete/tabak']),
c('wedding-check','Düğün kontrol listesi','events',['Bütçe','Mekan','Davetli','Fotoğraf','Ulaşım','Ödeme takvimi']),
c('potluck','Kim ne getirecek?','events',['Ana yemek','Salata','Tatlı','İçecek','Servis']),
g('raffle','Çekiliş yapıcı','events','choice','Satır listesinden bir kazananı yerel olarak seç.'),
g('groups','Rastgele grup oluşturucu','events','teams','Katılımcıları rastgele gruplara ayır.'),
c('event-day','Etkinlik günü akışı','events',['Kurulum','Karşılama','Program','Yemek','Kapanış','Toplama']),
c('host-check','Ev sahibi kontrolü','events',['Tuvalet','Çöp','Oturma','Müzik','Yedek bardak']),

// Evcil hayvan
r('pet-food','Mama takipçisi','pet',['Miktar','Saat'],'Evcil hayvan bakım kaydı; veteriner önerisi değildir.'),
r('pet-water','Su değişim kaydı','pet',['Not','Saat'],'Su kabı yenileme kaydı.'),
r('pet-vet','Veteriner tarihleri','pet',['Ziyaret','Tarih'],'Veteriner randevu geçmişi/takvimi.'),
r('pet-vaccine','Aşı kayıt notu','pet',['Aşı adı','Tarih'],'Resmi sağlık kaydının yerine geçmez.'),
r('pet-weight','Kilo kaydı','pet',['Kilo','Tarih'],'Veteriner yorumunun yerine geçmez.'),
r('pet-walk','Gezdirme kaydı','pet',['Dakika','Saat'],'Basit yürüyüş günlüğü.'),
c('pet-sitter','Pet sitter bilgi listesi','pet',['Mama düzeni','Veteriner iletişimi','Gezdirme','Ev kuralları','Acil kişi']),
c('pet-travel','Evcil hayvan seyahat listesi','pet',['Taşıma çantası','Su','Mama','Belge','Temizlik','Oyuncak']),

// Erişilebilirlik
{ id:'read-aloud',title:'Metni sesli okut',category:'access',type:'access',mode:'speak',desc:'Tarayıcının yerel speechSynthesis özelliği varsa metni seslendirir.'},
{ id:'big-text',title:'Büyük yazı okuma modu',category:'access',type:'access',mode:'big',desc:'Araç ekranındaki metni daha büyük göster.'},
{ id:'high-contrast',title:'Yüksek kontrast modu',category:'access',type:'access',mode:'contrast',desc:'Toolbox görünümüne yüksek kontrast sınıfı uygula.'},
{ id:'reading-width',title:'Dar okuma sütunu',category:'access',type:'access',mode:'width',desc:'Uzun metinler için okuma alanını daralt.'},
{ id:'line-spacing',title:'Satır aralığı artır',category:'access',type:'access',mode:'spacing',desc:'Okuma panelinde satır aralığını artır.'},
{ id:'reading-ruler',title:'Okuma cetveli',category:'access',type:'access',mode:'ruler',desc:'Metin satırını takip etmeye yardımcı görsel cetvel aç.'},
{ id:'touch-targets',title:'Büyük dokunma alanı',category:'access',type:'access',mode:'touch',desc:'Buton ve alanların minimum dokunma boyutunu büyüt.'},
{ id:'contrast-check',title:'Renk kontrast hesaplayıcı',category:'access',type:'contrast',desc:'İki hex rengin WCAG kontrast oranını yerel olarak hesapla.'},

// Hesap merkezi
k('percentage','Yüzde hesapla','calc','percentage','Bir sayının belirli yüzdesini hesapla.'),
k('age','Yaş hesapla','calc','age','Doğum tarihinden bugüne yaklaşık tam yaş.'),
k('date-diff','İki tarih arası gün','calc','days','İki tarih arasındaki mutlak gün farkı.'),
k('business-days','İş günü hesapla','calc','business-days','Hafta sonlarını çıkaran basit iş günü hesabı; resmi tatilleri bilmez.'),
k('average','Ortalama hesapla','calc','average','Virgülle ayrılmış sayıların ortalaması.'),
k('ratio','Oran/orantı','calc','ratio','a/b = c/x denkleminde x değerini bul.'),
k('speed','Hız-mesafe-zaman','calc','speed','Mesafe ve süreden ortalama hız.'),
k('area','Dikdörtgen alanı','calc','area','Genişlik × yükseklik.'),
k('volume','Dikdörtgen prizma hacmi','calc','volume','En × boy × yükseklik.'),
k('bmi','BMI hesaplayıcı','calc','bmi','Boy ve kilodan BMI hesaplar; tanı veya sağlık tavsiyesi değildir.'),
k('data-transfer','Veri transfer süresi','calc','transfer','Dosya boyutu ve bağlantı Mbps ile teorik süre tahmini.'),
k('storage','Depolama birimi','calc','storage','MB, GB, TB arasında ondalık dönüşüm.'),
v('length-convert','Uzunluk dönüştürücü','calc','length','mm, cm, m, km, inç, ft, mil dönüşümü.'),
v('weight-convert','Ağırlık dönüştürücü','calc','weight','g, kg, oz ve lb dönüşümü.'),
v('temp-convert','Sıcaklık dönüştürücü','calc','temperature','Celsius, Fahrenheit ve Kelvin dönüşümü.'),
v('data-convert','Veri boyutu dönüştürücü','calc','data','B, KB, MB, GB, TB ondalık dönüşümü.')
];

export const toolMap=new Map(tools.map(x=>[x.id,x]));
