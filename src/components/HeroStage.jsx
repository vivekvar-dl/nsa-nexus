import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon, Notif } from "./ui";

const W = 1440;
const H = 480;

/* Everything sits on four wire rows and one spine, so the whole graphic snaps
   to a grid instead of being scattered by hand. */
const ROWS = [84, 184, 284, 384];
const SPINE = 720;
const HUB = { cy: 250, r: 114 };

/* Where a wire has to stop so it meets the hub ring instead of floating: the
   x on the circle at that row, or the spine when the row clears the ring. */
const meetHub = (y) => {
  const dy = Math.abs(y - HUB.cy);
  return dy >= HUB.r ? SPINE : Math.round(SPINE - Math.sqrt(HUB.r ** 2 - dy ** 2));
};

const LEFT_EDGE = 224;
const RIGHT_EDGE = 1216;

const SOURCES = [
  { label: "837 Claims", row: 0, side: "l" },
  { label: "835 Remits", row: 1, side: "l" },
  { label: "Provider roster", row: 2, side: "l" },
  { label: "Contracted rates", row: 3, side: "l" },
  { label: "CMS IDR portal", row: 0, side: "r" },
  { label: "Eligibility 270/271", row: 3, side: "r" },
];

export const FEED = [
  { icon: <Icon.shield size={18} />, title: "Claim screened", time: "2m", sub: "NSA protected · OON emergency" },
  { icon: <Icon.calc size={18} />, title: "QPA computed", time: "now", sub: "Median contracted rate · methodology attached" },
  { icon: <Icon.chart size={18} />, title: "IDR likelihood scored", time: "6m", sub: "Eligibility gate passed" },
  { icon: <Icon.handshake size={18} />, title: "Open negotiation opened", time: "11m", sub: "Northline Surgical · thread started" },
  { icon: <Icon.file size={18} />, title: "Evidence packet sealed", time: "18m", sub: "Attached to the case record" },
];

const SLOTS = 3;
const SLOT_X = [896, 928, 960];
const SLOT_Y = [122, 204, 286];

/* One clock owns the whole stack. Each tick replaces exactly one slot with the
   next card that is not already on screen — so no two slots can ever show the
   same event, and only one card is ever in transition. */
function useFeed(period = 2400) {
  const [slots, setSlots] = useState([0, 1, 2]);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    let tick = 0;
    let cursor = SLOTS;
    const id = setInterval(() => {
      setSlots((prev) => {
        while (prev.includes(cursor % FEED.length)) cursor++;
        const next = prev.slice();
        next[tick % SLOTS] = cursor % FEED.length;
        cursor++;
        tick++;
        return next;
      });
    }, period);
    return () => clearInterval(id);
  }, [period, still]);

  return slots;
}

function useStageScale() {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, scale];
}

/* Chips are centred on their wire row and aligned to a shared edge, so the two
   columns read as columns. */
function Source({ label, row, side, delay }) {
  const right = side === "r";
  return (
    <motion.div
      className="absolute flex h-8 items-center gap-2.5 rounded-full px-3.5 backdrop-blur-md"
      style={{
        left: right ? RIGHT_EDGE + 8 : LEFT_EDGE - 8,
        top: ROWS[row],
        translate: right ? "0 -50%" : "-100% -50%",
        background: "oklch(1 0 0 / 0.03)",
        boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.09)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0, 0, 0.2, 1] }}
    >
      <span className="size-1.5 rounded-full bg-ember-300/80" />
      <span className="whitespace-nowrap text-caption text-white/70">{label}</span>
    </motion.div>
  );
}

function Wire({ x1, x2, y1, y2, delay }) {
  const vertical = x1 === x2;
  return (
    <div
      className={`wire absolute ${vertical ? "wire-y" : ""}`}
      style={{
        left: x1,
        top: y1,
        width: vertical ? 1 : x2 - x1,
        height: vertical ? y2 - y1 : 1,
        "--wire-delay": `${delay}s`,
        background: `linear-gradient(oklch(1 0 0 / 0.11), oklch(1 0 0 / 0.11)) center/${
          vertical ? "1.4px 100%" : "100% 1.4px"
        } no-repeat`,
      }}
    />
  );
}

function Hub() {
  const still = useReducedMotion();
  return (
    <div
      className="absolute grid place-items-center"
      style={{ left: SPINE, top: HUB.cy, translate: "-50% -50%", width: HUB.r * 2, height: HUB.r * 2 }}
    >
      {/* One slow sweep marks the ring as live without adding a second rhythm. */}
      <svg viewBox="0 0 228 228" className="absolute inset-0 size-full" aria-hidden="true">
        <circle cx="114" cy="114" r="113" fill="none" stroke="oklch(1 0 0 / 0.1)" strokeWidth="1" />
        <circle cx="114" cy="114" r="78" fill="none" stroke="oklch(1 0 0 / 0.07)" strokeWidth="1" />
        <g style={{ transformOrigin: "114px 114px", animation: still ? "none" : "sweep 14s linear infinite" }}>
          <circle
            cx="114" cy="114" r="113" fill="none"
            stroke="oklch(0.741 0.122 64.7 / 0.16)" strokeWidth="1.4"
            strokeLinecap="round" strokeDasharray="150 560"
          />
          <circle
            cx="114" cy="114" r="113" fill="none"
            stroke="oklch(0.862 0.065 69.8 / 0.7)" strokeWidth="1.4"
            strokeLinecap="round" strokeDasharray="46 664" strokeDashoffset="-104"
          />
        </g>
      </svg>
      <div
        className="relative grid size-[88px] place-items-center rounded-full backdrop-blur-md"
        style={{
          background: "oklch(0.238 0 0 / 0.92)",
          boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.14), 0 12px 40px -10px oklch(0 0 0 / 0.8)",
        }}
      >
        <span className="text-[0.8125rem] tracking-[-0.01em] text-white/85">Nexus</span>
      </div>
    </div>
  );
}

function AgentTag({ label, y }) {
  return (
    <div
      className="absolute flex h-7 items-center rounded-full px-3 backdrop-blur-md"
      style={{
        left: SPINE,
        top: y,
        translate: "-50% -50%",
        background: "oklch(0.949 0.018 89.4 / 0.92)",
        boxShadow: "0 4px 14px -4px oklch(0 0 0 / 0.7)",
      }}
    >
      <span className="whitespace-nowrap text-caption tracking-[-0.01em] text-obsidian">{label}</span>
    </div>
  );
}

function Slot({ index, feedIndex }) {
  const item = FEED[feedIndex];
  return (
    <div className="absolute" style={{ left: SLOT_X[index], top: SLOT_Y[index] }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.34, ease: [0, 0, 0.2, 1] }}
        >
          <Notif {...item} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroStage() {
  const [ref, scale] = useStageScale();
  const slots = useFeed();

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>
      <div
        className="absolute left-0 top-0"
        style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "left top" }}
      >
        {/* Wires run edge → hub. Rows that clear the ring carry on to the spine. */}
        {ROWS.map((y, i) => (
          <Wire key={`l${y}`} x1={LEFT_EDGE} x2={meetHub(y)} y1={y} y2={y} delay={i * 0.55} />
        ))}
        <Wire x1={SPINE} x2={RIGHT_EDGE} y1={ROWS[0]} y2={ROWS[0]} delay={0.85} />
        <Wire x1={SPINE} x2={RIGHT_EDGE} y1={ROWS[3]} y2={ROWS[3]} delay={1.95} />
        <Wire x1={SPINE} x2={SPINE} y1={24} y2={HUB.cy - HUB.r} delay={0.35} />
        <Wire x1={SPINE} x2={SPINE} y1={HUB.cy + HUB.r} y2={456} delay={1.4} />

        <Hub />

        {SOURCES.map((s, i) => (
          <Source key={s.label} {...s} delay={0.15 + i * 0.06} />
        ))}

        <AgentTag label="QPA Engine" y={54} />
        <AgentTag label="IDR Defense" y={416} />

        {slots.map((feedIndex, i) => (
          <Slot key={i} index={i} feedIndex={feedIndex} />
        ))}
      </div>

      {/* Vignette so the stage dissolves into the page instead of stopping. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(74% 100% at 50% 46%, transparent 46%, oklch(0.205 0 0 / 0.55) 100%), linear-gradient(to bottom, transparent 78%, var(--color-ink) 100%)",
        }}
      />
    </div>
  );
}
