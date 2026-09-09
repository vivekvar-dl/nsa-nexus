# NSA Nexus

Landing page and sign-up flow for a No Surprises Act compliance and
dispute-management platform. React + Vite + Tailwind v4 + Motion.

Portfolio project — the sign-up form validates client-side and fakes the POST.

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
| `src/pages/Signup.jsx` | Sign-up page |

The sign-up form validates client-side and fakes the POST — see the `ponytail:`
comment in `src/pages/Signup.jsx` for where the real endpoint goes.
