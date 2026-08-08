# Change: AI Pusula Studio

## Problem
AI Pusula can teach, recommend, and expose ready-made apps, but a beginner still needs a guided path from an idea to a small working artifact.

## Desired behavior
Add `/studio/` as a local-first creation environment for beginner-to-intermediate users. A user chooses their level, intent, time budget, and a template; Studio recommends a path, lets them compose safe blocks, generates a working single-file browser app, previews the result structurally, shows the code, audits security, improves prompts, teaches concepts in context, and downloads the generated app.

## Acceptance criteria
- 100 starter templates mapped to 8 working artifact families.
- Beginner/low-code/intermediate modes and intent/time wizard.
- Build Blocks for local capabilities and explicit backend-required capabilities.
- Working generated artifact for web app, mini tool, game, quiz, dashboard, content, automation, and local assistant families.
- Code view, copy, and one-file offline HTML download.
- Prompt Lab with simple/good/pro prompt transformations.
- Security audit with secret/network/eval/handler/CSP checks.
- Contextual learning cards for frontend, backend, API, database, auth, AI, test, security, and deploy.
- No external AI/API call from Studio; no secret input or storage.
- Generated offline artifact has `connect-src 'none'`, no external resources, no `eval`, no `new Function`, and user content is escaped before insertion.
- Main AI Pusula entry, PWA shortcut, and offline service-worker cache.
- Chromium CI exercises all 8 artifact families, prompt lab, audit, download, persistence, mobile layout, and absence of Studio-origin external requests.

## Technical approach
Static `public/studio/` module. `studio-engine.js` owns catalog, recommendations, generation, prompt transforms, learning cards, and security audit. `studio.js` owns DOM state and localStorage. Generated files are controlled templates, not arbitrary code execution.

## Risks and rollback
Primary risks are unsafe string interpolation, misleading server features, and CSP regressions. Escape all user text, separate browser-safe blocks from backend-required blocks, and test strict network/security boundaries. Rollback by removing Studio files/import/cache/manifest shortcut.

## Verification
GitHub Actions syntax/security checks plus Playwright Chromium tests and post-merge production verification.