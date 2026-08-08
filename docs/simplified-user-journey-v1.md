# Simplified user journey v1

## Problem
AI Pusula has many useful surfaces, but first-time visitors can lose orientation because tools, learning content, templates, architecture, security and production concepts appear as parallel destinations.

## Desired behavior
The public experience has three primary intentions:

1. **Kullan** — open a ready tool and finish a task.
2. **Oluştur** — describe an idea, see three recommendations, answer three short questions, build a working local app.
3. **Öğren** — choose one learning outcome and reveal technical depth only when needed.

`Hesabım` is the only persistent secondary destination.

## Routes
- `/` — clean intent hub. Legacy guide sections remain accessible when opening their anchors or using `?guide=1`.
- `/use/` — focused local tool finder and fast links to PDF, Photo Studio, QR, Toolbox and Apps.
- `/studio/?mode=simple` — default guided creator.
- `/studio/?mode=advanced` — existing full Studio with templates, architecture, code and security detail.
- `/learn/` — learning outcome hub.
- `/account/` — account and local portfolio.

## Studio simple flow
`Fikir → Oluştur → Test et → Kullan`

1. Visitor writes the desired outcome in normal language.
2. Local deterministic matching shows only three relevant templates.
3. Visitor answers application name, target user and expected result.
4. Existing Studio engine creates the project and runs the existing security audit.
5. Visitor can preview, download offline HTML, switch to advanced mode or open the production transition wizard.

The 100-template gallery remains available but is not the default decision surface.

## Security and privacy
- No new remote API, AI request, tracking or user-data upload.
- Intent routing and template recommendations are deterministic and local.
- Existing Studio security and build boundaries are reused.
- Real auth, database, external AI and payments remain server-side production prerequisites and are not faked in simple mode.
- No secrets are added.

## Accessibility
- Primary routes use semantic links/forms.
- Simple Studio maintains explicit progress state and accessible buttons.
- Mobile layout must avoid horizontal overflow at 390px.
- Technical content is hidden visually in simple mode but remains in the DOM so the existing engine can execute without duplicating build logic.

## Rollback
Revert the feature PR. Existing application routes and advanced Studio implementation are preserved; this change adds a progressive-disclosure shell rather than replacing their engines.
