import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";

/* --- motion primitives ---------------------------------------------------
   One rule everywhere: 10px of travel, 0.5s, decelerating. Enter animations
   are split into semantic chunks and staggered ~90ms rather than animating a
   whole container as one block.                                          */

export function Reveal({ children, delay = 0, y = 12, className, as = "div" }) {
  const still = useReducedMotion();
  const M = motion[as] ?? motion.div;
  return (
    <M
      className={className}
      initial={still ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.3, delay, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </M>
  );
}

/* --- actions ------------------------------------------------------------ */

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full " +
  "text-[0.9375rem] font-medium leading-none select-none " +
  "min-h-11 px-6 " +
  "transition-[scale,box-shadow,background-color,border-color,color] duration-200 " +
  "ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.96]";

export function Button({ variant = "cream", to, href, children, className = "", arrow, ...rest }) {
  const skin =
    variant === "cream"
      ? "pill hover:brightness-[1.04]"
      : variant === "ghost"
        ? "pill-ghost hover:bg-white/[0.08] hover:border-white/20"
        : "text-muted hover:text-bone";
  const cls = `${base} ${skin} ${arrow ? "pr-4 pl-6" : ""} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}

/* Arrow nudges on hover; only translate transitions, never `all`. */
function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"
      className="translate-y-px transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3.5 10h13M11.5 5l5 5-5 5" />
    </svg>
  );
}
export { Arrow };

/* --- surfaces ----------------------------------------------------------- */

export function Card({ className = "", children, ...rest }) {
  return (
    <div className={`card card-hover rounded-2xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className = "" }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/* Notification chip lifted from the reference hero: 40px avatar, title +
   timestamp on one row, muted subtitle beneath, blurred translucent plate. */
export function Notif({ icon, title, time, sub, className = "", style }) {
  return (
    <div
      className={`flex w-[285px] items-center gap-3 rounded-2xl p-3 pr-4 backdrop-blur-md ${className}`}
      style={{
        background: "oklch(0.295 0.003 106.6 / 0.92)",
        boxShadow:
          "inset 0 0 0 1px oklch(1 0 0 / 0.08), 0 10px 34px -12px oklch(0 0 0 / 0.7)",
        ...style,
      }}
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/[0.07] text-muted">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <div className="flex w-full items-center justify-between gap-3">
          <span className="min-w-0 flex-1 truncate text-[0.875rem] leading-[1.375]">{title}</span>
          <span className="shrink-0 text-caption text-white/40 tabular-nums">{time}</span>
        </div>
        <span className="truncate text-caption text-white/50">{sub}</span>
      </div>
    </div>
  );
}

/* Counts to `to` the first time it scrolls into view. Digits are tabular so
   the box never twitches while the number climbs. */
export function CountUp({ to, duration = 1.1, format = (n) => n, className = "" }) {
  const still = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [n, setN] = useState(still ? to : 0);
  useEffect(() => {
    if (!inView || still || to === 0) return setN(to);
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, still, to, duration]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {format(n)}
    </span>
  );
}

/* --- iconography (16px grid, 1.5 stroke) -------------------------------- */

const I = (p) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 20} height={p.size ?? 20} fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" className={p.className}>{p.children}</svg>
);

export const Icon = {
  shield: (p) => <I {...p}><path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></I>,
  calc: (p) => <I {...p}><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h3" /></I>,
  handshake: (p) => <I {...p}><path d="m3 12 4-4 4 3 3-3 3 2 4-3" /><path d="m7 8 4 4-2 2-2-2" /><path d="M13 11.5 17 15l-2 2-2.5-2.5" /></I>,
  gavel: (p) => <I {...p}><path d="m14 4 6 6-3 3-6-6 3-3Z" /><path d="m10 8-6 6 3 3 6-6" /><path d="M4 20h8" /></I>,
  chart: (p) => <I {...p}><path d="M4 20V10M10 20V5M16 20v-7M22 20H2" /></I>,
  file: (p) => <I {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></I>,
  bell: (p) => <I {...p}><path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" /><path d="M10.5 19a2 2 0 0 0 3 0" /></I>,
  clock: (p) => <I {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></I>,
  spark: (p) => <I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></I>,
  check: (p) => <I {...p}><path d="m5 12.5 4.5 4.5L19 7" /></I>,
  lock: (p) => <I {...p}><rect x="4.5" y="10" width="15" height="10.5" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></I>,
  chevron: (p) => <I {...p}><path d="m6 9 6 6 6-6" /></I>,
  eye: (p) => <I {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></I>,
  eyeOff: (p) => <I {...p}><path d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M6.6 6.7C4 8.5 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.9 0 3.5-.5 4.9-1.3M9.9 5.8A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.4 17.4 0 0 1-2.4 3.2" /></I>,
};

/* --- data display ------------------------------------------------------- */

/* Bar with a sheen that sweeps once the bar is in view. */
export function Bar({ label, value, pct, tone = "neutral", delay = 0 }) {
  const still = useReducedMotion();
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-caption text-white/45">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="wire h-full rounded-full"
          style={{
            background:
              tone === "ember"
                ? "linear-gradient(90deg, var(--color-ember-600), var(--color-ember-300))"
                : "oklch(1 0 0 / 0.2)",
            "--wire-delay": `${delay + 0.4}s`,
          }}
          initial={still ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, delay, ease: [0, 0, 0.2, 1] }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-caption tabular-nums text-bone">{value}</span>
    </div>
  );
}
