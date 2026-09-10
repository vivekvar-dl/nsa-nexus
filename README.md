# NSA Nexus

Landing page and sign-in for a No Surprises Act compliance and
dispute-management platform. React + Vite + Tailwind v4 + Motion.

Portfolio project — sign-in validates against the same client-side demo
directory the NSA frontend ships with, until `POST /v1/auth/login` exists.

Content is drawn from the real NSA Nexus application: three suites (Payor
Intelligence, Provider Revenue, Arbiter Workspace), thirty-three modules, and
the actual domain vocabulary. The dashboard section mirrors `PayorDashboard`
and `payorService` exactly — the six design.md §2.4 KPIs with their trends,
the `financialSimulate` defaults (85,000 claims, 35% IDR take-rate, service
year 2025), the `claim_mix` percentages, the six-month volume formula
`total / 6 * (0.85 + i * 0.03)`, and the Critical / Warning / Monitor
urgency bands.

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
