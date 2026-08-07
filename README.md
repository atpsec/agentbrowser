# Agent Security Lab

DevSecOps'tan AI Agent Security'ye geçişi basit ve somut senaryolarla anlatan statik öğrenme sitesi.

## İçerik

- Code Security ve Agent Security farkı
- Prompt Injection senaryosu
- Least Privilege, Sandbox, Network Egress, Secret Management, Human Approval ve Audit Logs
- LocalStorage ile tarayıcıda kalıcı kişisel öğrenme checklist'i

## Lokal çalıştırma

```bash
python3 -m http.server 8080
```

Ardından `http://localhost:8080` adresini aç.

## Cloudflare Pages

Bu proje build gerektirmez.

- Framework preset: `None`
- Build command: boş bırak
- Build output directory: `/`
- Production branch: `main`

Cloudflare Pages GitHub entegrasyonu bağlandığında `main` branch'e gelen her değişiklik otomatik deploy edilebilir.

## Güvenlik

`_headers` dosyası Cloudflare Pages üzerinde temel güvenlik header'larını uygular. Projede harici JavaScript/CDN bağımlılığı ve secret yoktur.
