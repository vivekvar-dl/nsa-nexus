# NSA Nexus

Landing page and sign-in for a No Surprises Act compliance and
dispute-management platform. React + Vite + Tailwind v4 + Motion.

Portfolio project — sign-in validates against the same client-side demo
directory the NSA frontend ships with, until `POST /v1/auth/login` exists.

Content is drawn from the real NSA Nexus application: three suites (Payor
Intelligence, Provider Revenue, Arbiter Workspace), thirty-three modules, and
the actual domain vocabulary — titles, field labels and status enums, not
invented copy.

No output number on this site is assumed. Every dollar figure, count and
percentage the product would normally compute (QPA liability, OON billed,
overage, dispute probability, audit counts, volume) comes from
`POST /v1/financial/simulate`, `POST /v1/qpa/*` or `POST /v1/ai/idr-score` —
none of which have a backend in this project, and none of which have a
hard-coded example response anywhere in the reference source. So, exactly
like the shipped app's own `fmt()` helper, every such value renders as `—`.
The only numbers shown are literal *inputs* that exist as real defaults in
the source: 85,000 simulated claims, a 0.35 IDR take rate, a 0.25
log-normal σ, service year 2025, the nine-specialty `claim_mix` percentages,
the 90-day deadline scan window, the six KPI trend values that are typed
directly into `payorService.js`, and the `INACTIVE_PARTY` /
`EXPIRING_SOON` / `EXPIRED` warning taxonomy from `DeadlineContext.js`.

```bash
npm install
npm run dev
```

## Typeface

The brand stack is fixed:

```
season, "season Fallback", ui-sans-serif, system-ui, sans-serif
```

`season` (Season Mix) is a licensed font and is not bundled. Drop your licensed
`woff2` at `public/fonts/season.woff2` and it takes over everywhere — the
`@font-face` and preload are already wired in `src/index.css` and `index.html`.
Until then `"season Fallback"` carries the layout with metric overrides
(`size-adjust`, `ascent-override`) so nothing reflows when the real file lands.

## Structure

| Path | What |
| --- | --- |
| `src/index.css` | Design tokens (OKLCH), type scale, keyframes, `.pill` / `.card` / `.ember` / `.lattice` / `.wire` |
| `src/components/ui.jsx` | Reveal, Button, Card, Notif, Bar, icon set |
| `src/components/Chrome.jsx` | Nav + footer |
| `src/components/HeroStage.jsx` | Wired hero graphic (1440×480 stage, scaled to fit) |
| `src/pages/Landing.jsx` | Landing page |
| `src/components/FlickeringGrid.jsx` | Magic UI flickering grid (MIT), ported to JS — the signup backdrop |
| `src/components/BorderBeam.jsx` | Magic UI border beam (MIT), ported to JS — tracer on the QPA card |
| `src/components/Ripple.jsx` | Magic UI ripple (MIT), ported to JS — rings behind the closing CTA |
| `src/components/DashboardPreview.jsx` | Payor dashboard section — KPIs, claim-mix donut, volume bars, live deadline countdowns |
| `src/pages/Login.jsx` | Sign-in page |

Sign-in fakes the POST — see the `ponytail:` comment in `src/pages/Login.jsx`
for where `POST /v1/auth/login` goes.
