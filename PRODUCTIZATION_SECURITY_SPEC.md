# AI Pusula Productization + Security v1

## Problem
AI Pusula has many working modules, but first-time visitors need a simpler path to value and commercial product pages need clearer trust, demo, plan, mobile and security boundaries.

## Desired behavior
- Root presents four primary routes: use a tool, build an app, learn, demo.
- Global intent search routes common jobs to working tools.
- Demo is a primary CTA.
- PhotoFix, PDF Toolbox, QR Maker and Passport Photo have product landing pages with demo, features, before/after, trust, plans and FAQ.
- Account page shows only device-local/demo state until real auth/database is connected.
- Analytics remains local-only; no remote telemetry is introduced.
- Free/Pro is visible without pretending payment is active.
- Mobile build readiness is visible without claiming App Store/Google Play publication.
- robots/sitemap and SoftwareApplication/WebSite structured data are present.
- PWA caches new product/account surfaces.
- Security headers include HSTS, strict referrer, COOP, CORP, Permissions-Policy and restrictive CSP. Google GIS exceptions remain route-scoped to `/demo/*`.

## Security/privacy
- No API keys or OAuth secrets in client code.
- No new third-party runtime scripts on product/account/root pages.
- No external analytics endpoint.
- Uploaded photo/PDF content is not added to analytics.
- Real Google auth remains gated on server-side token verification.
- Payment/Pro purchase stays inactive until a trusted billing + entitlement backend exists.

## Verification
- JS syntax and secret scans.
- Playwright: root finder, four primary routes, four landing pages, account boundary, mobile overflow, no unexpected external HTTP(S) requests.
- Lighthouse: performance >=80, accessibility >=95, best practices >=95, SEO >=90 on PhotoFix landing.
- Existing regression workflows and mobile Android/iOS workflows must remain green.

## Rollback
Revert the delivery PR. Existing tools remain available because the implementation adds a product shell instead of deleting the underlying modules.
