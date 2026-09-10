import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "./ui";

/* ---------------------------------------------------------------------------
   Every value below is literal, from the NSA Nexus frontend source — nothing
   here is computed or assumed:

   · KPI titles & trends     PayorDashboard.jsx (design.md §2.4 KPI row) and
                              payorService.js — trend: 4.2 / 3.1 / 5.8 / 7.2 /
                              1.4 / 0 are hardcoded in the service, not derived
   · Simulation defaults     payorService.js / FinancialForecast.jsx —
                              total_claims 85000, idr_take_rate 0.35,
                              log_normal_sigma 0.25, service_year 2025,
                              fixed_growth_rate 0.03
   · Claim mix %             FinancialForecast.jsx DEFAULT_MIX (sums to 100)
   · Deadlines window        payorService.js / deadlineTrackerService.js —
                              days_ahead default is 90
   · Urgency bands           PayorDashboard.jsx urgencyDot()
   · "—" fallback            FinancialForecast.jsx fmt(): every KPI is an
                              output of POST /v1/financial/simulate. There is
                              no backend in this project, so — like the app's
                              own fmt() — every value the API would supply
                              renders as "—" instead of an invented number.
--------------------------------------------------------------------------- */

const INPUTS = [
  { label: "Total claims", value: "85,000" },
  { label: "IDR take rate", value: "0.35" },
  { label: "Log-normal σ", value: "0.25" },
  { label: "Service year", value: "2025" },
];

/* payorService.js — trend values are typed literally in the file, the dollar
   VALUES are not (they come from `sim?.summary` and are undefined here). */
const KPIS = [
  { title: "Total NSA Claims", trend: 4.2 },
  { title: "QPA Plan Liability", trend: 3.1 },
  { title: "OON Billed at 175%", trend: 5.8 },
  { title: "Overage Above QPA", trend: 7.2 },
  { title: "Mean Overage / Claim", trend: 1.4 },
  { title: "IDR Escalations", trend: 0, note: "35% take-rate" },
];

/* FinancialForecast.jsx DEFAULT_MIX, in the file's own order. */
const CLAIM_MIX = [
  { name: "Anesthesiology", value: 58 },
  { name: "Emergency Medicine", value: 9 },
  { name: "General Surgery", value: 8 },
  { name: "Pathology", value: 6 },
  { name: "Radiology", value: 5 },
  { name: "Cardiology", value: 5 },
  { name: "Air Ambulance", value: 2 },
  { name: "Neonatology", value: 4 },
  { name: "Internal Medicine", value: 3 },
];

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

/* --- donut ------------------------------------------------------------- */

function Donut() {
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
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
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
                whileInView={{ strokeDasharray: `${a.value} ${100 - a.value}`, opacity: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, delay: 0.1 + a.i * 0.07, ease: [0, 0, 0.2, 1] }}
                onMouseEnter={() => setHover(a.i)}
                className="cursor-default transition-[stroke-width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
            ))}
          </g>
        </svg>
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

/* --- panels -------------------------------------------------------------- */

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
        <div>
          <h3 className="text-h4">Payor Dashboard</h3>
          <p className="mt-1 text-caption text-white/35">
            Simulation parameters — POST /v1/financial/simulate
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

      {/* Literal simulation inputs — nothing here is derived. */}
      <div className="mt-5 flex flex-wrap gap-2">
        {INPUTS.map((p) => (
          <span
            key={p.label}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption"
            style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)" }}
          >
            <span className="text-white/40">{p.label}</span>
            <span className="tabular-nums text-bone">{p.value}</span>
          </span>
        ))}
      </div>

      {/* KPI row — design.md §2.4 titles + payorService.js trends. The values
          are API output with no backend behind this project, so — same as
          the shipped app's own fmt() helper — they render "—". */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
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
            <p className="mt-2 text-h4 leading-none text-white/25">—</p>
            <div className="mt-3">
              <Trend value={k.trend} note={k.note} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* claim mix — literal DEFAULT_MIX */}
      <div className="mt-3">
        <Panel title="Claim Mix by Specialty">
          <Donut />
        </Panel>
      </div>

      {/* active deadlines — real 90-day window, real urgency bands, and the
          app's own literal empty-state copy since there is no live row data. */}
      <div className="mt-3">
        <Panel
          title="Active Deadlines (Next 90 Days)"
          action={
            <div className="flex gap-3 text-caption text-white/30">
              {["Critical", "Warning", "Monitor"].map((u) => (
                <span key={u} className="flex items-center gap-1.5">
                  <span
                    className="size-1.5 rounded-full"
                    style={{
                      background:
                        u === "Critical" ? "var(--color-ember-600)" : u === "Warning" ? "var(--color-ember-300)" : "oklch(1 0 0 / 0.35)",
                    }}
                  />
                  {u}
                </span>
              ))}
            </div>
          }
        >
          <p className="text-ui text-white/40">No upcoming deadlines.</p>
        </Panel>
      </div>
    </div>
  );
}
