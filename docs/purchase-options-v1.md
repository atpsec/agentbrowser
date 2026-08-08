# Purchase options v1

## Goal
Expose clear commercial choices on each product landing page without pretending that checkout/payment is live before a payment provider and entitlement backend are connected.

## Plans
- Free — use the current local-first web tool.
- Personal Lifetime — one-person commercial-use license candidate, launch reference price USD 49.
- Agency — small agency/white-label-ready license candidate, launch reference price USD 199.
- Full Acquisition — source/product acquisition path; price by verified offer/due diligence.

## Current boundary
Paid CTAs record only a local purchase intent and route the user to the Account page. They do not collect card data, send PII, issue a license, or claim payment success. Real checkout remains blocked until a server-side payment provider + verified webhook + entitlement backend are connected.

## Security
- No payment/card fields in browser code.
- No external checkout scripts.
- No secret/token storage.
- Purchase intent is non-sensitive localStorage metadata only (product, plan, timestamp).
- Existing strict CSP remains unchanged.

## Verification
- All four product pages render four plans.
- Free CTA opens the working product.
- Paid CTA stores local purchase intent and routes to `/account/?purchase=...`.
- No external network request is introduced by plan selection.
- 390px mobile layout remains overflow-free.
