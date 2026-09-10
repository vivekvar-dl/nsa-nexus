import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CountUp, Icon } from "./ui";

/* ---------------------------------------------------------------------------
   Every figure below comes from the NSA Nexus payor dashboard, not invented:

   · KPI titles and trends      PayorDashboard.jsx  (design.md §2.4 KPI row)
   · 85,000 claims · 35% IDR    payorService.js     financialSimulate defaults
     take-rate · 175% of QPA
   · Claim mix percentages      payorService.js     claim_mix
   · 6-month volume curve       payorService.js     total/6 * (0.85 + i*0.03)
   · Critical/Warning/Monitor   PayorDashboard.jsx  urgencyDot()

   Dollar figures are that simulation carried through at the platform's own
   $1,284 mean QPA: 85,000 × $1,284 = $109.1M liability, billed at 175%
   = $191.0M, leaving $81.9M of overage, or $963 per claim.
--------------------------------------------------------------------------- */

const TOTAL_CLAIMS = 85000;
const IDR_TAKE_RATE = 0.35;

const KPIS = [
  { title: "Total NSA Claims", to: 85000, format: (n) => n.toLocaleString(), trend: 4.2 },
  { title: "QPA Plan Liability", to: 109.1, format: (n) => `$${n}M`, decimals: 1, trend: 3.1 },
  { title: "OON Billed at 175%", to: 191.0, format: (n) => `$${n}M`, decimals: 1, trend: 5.8 },
  { title: "Overage Above QPA", to: 81.9, format: (n) => `$${n}M`, decimals: 1, trend: 7.2 },
  { title: "Mean Overage / Claim", to: 963, format: (n) => `$${n}`, trend: 1.4 },
  { title: "IDR Escalations", to: TOTAL_CLAIMS * IDR_TAKE_RATE, format: (n) => n.toLocaleString(), trend: 0, note: "35% take-rate" },
];

const CLAIM_MIX = [
  { name: "Anesthesiology", value: 58 },
  { name: "Emergency Medicine", value: 9 },
  { name: "General Surgery", value: 8 },
  { name: "Pathology", value: 6 },
  { name: "Radiology", value: 5 },
  { name: "Cardiology", value: 5 },
  { name: "Neonatology", value: 4 },
  { name: "Internal Medicine", value: 3 },
  { name: "Air Ambulance", value: 2 },
];

/* payorService.js: claimsVolume = total/6 * (0.85 + i * 0.03) */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const VOLUME = MONTHS.map((name, i) => ({
  name,
  value: Math.round((TOTAL_CLAIMS / 6) * (0.85 + i * 0.03)),
}));
/* The real curve only spans ~15%, so bars drawn from zero read as a flat wall.
   Cropping the baseline shows the actual month-on-month climb; the caption
   still carries the absolute range. */
const V_MIN = Math.min(...VOLUME.map((v) => v.value));
const V_MAX = Math.max(...VOLUME.map((v) => v.value));
const barHeight = (v) => 34 + ((v - V_MIN) / (V_MAX - V_MIN)) * 66;

/* Offsets, not fixed dates, so the countdown stays honest whenever it runs. */
const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString();
const DEADLINES = [
  { id: "DSP-8F21A4", specialty: "Anesthesiology", neg: inDays(2), urgency: "Critical" },
  { id: "DSP-3C77E0", specialty: "Emergency Medicine", neg: inDays(14), urgency: "Warning" },
  { id: "DSP-B10D95", specialty: "Air Ambulance", neg: inDays(28), urgency: "Warning" },
  { id: "DSP-5A4EC2", specialty: "Radiology", neg: inDays(61), urgency: "Monitor" },
];

const URGENCY = {
  Critical: { dot: "var(--color-ember-600)", text: "oklch(0.741 0.122 64.7)" },
  Warning: { dot: "var(--color-ember-300)", text: "oklch(0.862 0.065 69.8)" },
  Monitor: { dot: "oklch(1 0 0 / 0.35)", text: "oklch(1 0 0 / 0.5)" },
};

/* Slice colours stay on the site's own ramp: the dominant specialty carries
   the accent, everything else steps down in neutral. */
const SLICE = [
  "url(#mixEmber)",
  "oklch(1 0 0 / 0.34)",
  "oklch(1 0 0 / 0.29)",
  "oklch(1 0 0 / 0.25)",
  "oklch(1 0 0 / 0.21)",
  "oklch(1 0 0 / 0.18)",
  "oklch(1 0 0 / 0.15)",
  "oklch(1 0 0 / 0.12)",
  "oklch(1 0 0 / 0.09)",
];

/* --- live countdown, the same idea as the app's DeadlineCountdown --------- */

function useCountdown(iso, enabled) {
  const [left, setLeft] = useState(() => new Date(iso) - new Date());
  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(() => setLeft(new Date(iso) - new Date()), 1000);
    return () => clearInterval(t);
  }, [iso, enabled]);
  const s = Math.max(0, Math.floor(left / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Countdown({ iso }) {
  const still = useReducedMotion();
  const { d, h, m, s } = useCountdown(iso, !still);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span className="tabular-nums">
      {d}d {pad(h)}:{pad(m)}
      {!still && <span className="text-white/40">:{pad(s)}</span>}
    </span>
  );
}

/* --- donut ---------------------------------------------------------------- */

function Donut() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const still = useReducedMotion();
  const [hover, setHover] = useState(0);

  let offset = 0;
  const arcs = CLAIM_MIX.map((slice, i) => {
    const arc = { ...slice, i, offset };
    offset += slice.value;
    return arc;
  });
  const active = CLAIM_MIX[hover];

  return (
    <div ref={ref} className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative shrink-0">
        <svg viewBox="0 0 128 128" className="size-[152px]" aria-hidden="true">
          <defs>
            <linearGradient id="mixEmber" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-ember-100)" />
              <stop offset="100%" stopColor="var(--color-ember-600)" />
            </linearGradient>
          </defs>
          <g transform="rotate(-90 64 64)">
            {arcs.map((a) => (
              <motion.circle
                key={a.name}
                cx="64" cy="64" r="52"
                pathLength="100"
                fill="none"
                stroke={SLICE[a.i]}
                strokeWidth={hover === a.i ? 17 : 13}
                strokeDashoffset={-a.offset}
                initial={still ? false : { strokeDasharray: "0 100", opacity: 0 }}
                animate={inView || still ? { strokeDasharray: `${a.value} ${100 - a.value}`, opacity: 1 } : undefined}
                transition={{ duration: 0.6, delay: 0.1 + a.i * 0.07, ease: [0, 0, 0.2, 1] }}
                onMouseEnter={() => setHover(a.i)}
                className="cursor-default transition-[stroke-width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
            ))}
          </g>
        </svg>
        {/* Centre reads whichever slice the pointer is on. */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-h4 leading-none tabular-nums">{active.value}%</p>
            <p className="mx-auto mt-1 max-w-[11ch] text-[0.6875rem] leading-tight text-white/40">
              {active.name}
            </p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {CLAIM_MIX.map((s, i) => (
          <li
            key={s.name}
            onMouseEnter={() => setHover(i)}
            className="flex items-center gap-2.5 rounded-md px-1.5 py-1 text-caption transition-colors duration-200"
            style={{ backgroundColor: hover === i ? "oklch(1 0 0 / 0.05)" : "transparent" }}
          >
            <span
              className="size-2 shrink-0 rounded-[3px]"
              style={{ background: i === 0 ? "var(--color-ember-300)" : SLICE[i] }}
            />
            <span className="min-w-0 flex-1 truncate text-white/60">{s.name}</span>
            <span className="tabular-nums text-white/40">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --- panels --------------------------------------------------------------- */

function Panel({ title, action, children, className = "" }) {
  return (
    <div
      className={`flex flex-col rounded-xl p-5 ${className}`}
      style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-ui text-white/70">{title}</h4>
        {action}
      </div>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}

function Trend({ value, note }) {
  const up = value >= 0;
  return (
    <span className="flex items-center gap-1.5 text-caption">
      <span
        className="flex items-center gap-1 rounded-full px-1.5 py-0.5 tabular-nums"
        style={{
          color: value === 0 ? "oklch(1 0 0 / 0.45)" : up ? "oklch(0.8 0.11 155)" : "oklch(0.75 0.15 25)",
          backgroundColor: value === 0 ? "oklch(1 0 0 / 0.05)" : up ? "oklch(0.8 0.11 155 / 0.12)" : "oklch(0.75 0.15 25 / 0.12)",
        }}
      >
        {value !== 0 && <Icon.trend size={12} className={up ? "" : "rotate-180"} />}
        {Math.abs(value)}%
      </span>
      <span className="text-white/30">{note ?? "vs last month"}</span>
    </span>
  );
}

export default function DashboardPreview() {
  const still = useReducedMotion();
  const [spin, setSpin] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-7"
      style={{
        background: "oklch(1 0 0 / 0.02)",
        boxShadow:
          "inset 0 0 0 1px oklch(1 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.35), 0 24px 64px -24px oklch(0 0 0 / 0.6)",
      }}
    >
      {/* window chrome */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div>
          <h3 className="text-h4">Payor Dashboard</h3>
          <p className="mt-1 text-caption text-white/35">
            85,000 claims · 35% IDR take-rate · service year 2025
          </p>
        </div>
        <button
          type="button"
          onMouseEnter={() => setSpin(true)}
          onAnimationEnd={() => setSpin(false)}
          className="flex min-h-9 items-center gap-2 rounded-lg px-3 text-caption text-white/55 transition-colors duration-200 hover:text-bone"
          style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.09)" }}
        >
          <span className={spin && !still ? "flex animate-spin" : "flex"}>
            <Icon.refresh size={14} />
          </span>
          Refresh
        </button>
      </div>

      {/* KPI row — design.md §2.4 */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.title}
            className="rounded-xl p-4"
            style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
            initial={still ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0, 0, 0.2, 1] }}
          >
            <p className="truncate text-caption text-white/40" title={k.title}>{k.title}</p>
            <p className="mt-2 text-h4 leading-none tabular-nums">
              <CountUp to={k.to} decimals={k.decimals} format={k.format} />
            </p>
            <div className="mt-3">
              <Trend value={k.trend} note={k.note} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* charts */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.25fr_1fr]">
        <Panel title="Claim Mix by Specialty">
          <Donut />
        </Panel>

        <Panel title="Claims Volume (6-Month)">
          {/* Bars own their own fixed-height box, so a % height has a basis
              that the month labels cannot eat into. */}
          <div className="flex h-[118px] items-end gap-2.5">
            {VOLUME.map((v, i) => (
              <div key={v.name} className="group relative flex h-full flex-1 items-end justify-center">
                <span className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-caption tabular-nums text-white/0 transition-colors duration-200 group-hover:text-white/60">
                  {v.value.toLocaleString()}
                </span>
                <motion.div
                  className="w-full max-w-[46px] rounded-[3px]"
                  style={{
                    background:
                      i === VOLUME.length - 1
                        ? "linear-gradient(to top, var(--color-ember-600), var(--color-ember-300))"
                        : "oklch(1 0 0 / 0.13)",
                  }}
                  initial={still ? false : { height: "2%", opacity: 0 }}
                  whileInView={{ height: `${barHeight(v.value)}%`, opacity: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0, 0, 0.2, 1] }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2.5">
            {VOLUME.map((v) => (
              <span key={v.name} className="flex-1 text-center text-caption text-white/35">{v.name}</span>
            ))}
          </div>
          <p className="mt-4 text-caption text-white/30 tabular-nums">
            {VOLUME[0].value.toLocaleString()} → {VOLUME.at(-1).value.toLocaleString()} claims / month
          </p>
        </Panel>
      </div>

      {/* active deadlines */}
      <div className="mt-3">
        <Panel
          title="Active Deadlines (Next 90 Days)"
          action={<span className="text-caption text-white/30">Negotiation window</span>}
        >
          <ul className="flex flex-col">
            {DEADLINES.map((d, i) => (
              <motion.li
                key={d.id}
                className="flex items-center gap-3 border-b border-white/[0.06] py-2.5 last:border-0"
                initial={still ? false : { opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.35, delay: i * 0.07, ease: [0, 0, 0.2, 1] }}
              >
                <span className="relative flex size-2 shrink-0">
                  {d.urgency === "Critical" && !still && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full"
                      style={{ background: URGENCY[d.urgency].dot }}
                    />
                  )}
                  <span className="relative size-2 rounded-full" style={{ background: URGENCY[d.urgency].dot }} />
                </span>
                <span className="shrink-0 font-mono text-caption text-white/70">{d.id}</span>
                <span className="min-w-0 flex-1 truncate text-caption text-white/45">{d.specialty}</span>
                <span className="hidden shrink-0 text-caption text-white/35 sm:block">
                  <Countdown iso={d.neg} />
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-caption"
                  style={{ color: URGENCY[d.urgency].text, backgroundColor: "oklch(1 0 0 / 0.05)" }}
                >
                  {d.urgency}
                </span>
              </motion.li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
