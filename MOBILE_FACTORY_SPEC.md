# AI Pusula Mobile Factory

## Goal
Turn the existing local-first web tools into reproducible Android/iOS-ready product builds without duplicating application logic.

## Milestone 1 - Android build factory

### Products
- `ai-pusula-tools` -> full Easy hub
- `photofix` -> Photo Studio
- `pdf-toolbox` -> PDF tools
- `qr-maker` -> QR maker

### Build contract
1. Copy `public/` to an ephemeral `mobile/www/` directory.
2. Replace the root launcher with a local redirect to the selected product route.
3. Generate `capacitor.config.json` from `mobile/products.json`.
4. Add/sync the Android platform with Capacitor.
5. Build a debug APK in CI and publish it as a workflow artifact.
6. Run static checks to ensure no product points outside the bundled app.

### Security boundaries
- No API keys or signing secrets are committed.
- Existing Easy tools stay local-first and retain their no-upload behavior.
- Debug APKs are test artifacts only; Google Play AAB signing is a later release gate.
- Store signing, Apple signing, billing, payment provider setup and production license infrastructure require dedicated secure credentials and are not faked.

### Commercialization path
Milestone 2 adds product-specific branding/store metadata and release AABs.
Milestone 3 adds server-side license/account contracts.
Milestone 4 adds AppSumo redemption, white-label packaging and acquisition data-room exports.
