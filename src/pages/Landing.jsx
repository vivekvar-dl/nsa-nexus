import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import HeroStage, { FEED } from "../components/HeroStage";
import { BorderBeam } from "../components/BorderBeam";
import { Ripple } from "../components/Ripple";
import { Bar, Button, Card, CountUp, Eyebrow, Icon, Notif, Reveal } from "../components/ui";

/* -------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const stageFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-16">
      <div className="lattice-rules pointer-events-none absolute inset-0 opacity-90" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{ background: "radial-gradient(60% 70% at 50% 0%, oklch(0.741 0.122 64.7 / 0.09), transparent 70%)" }}
      />

      <motion.div
        className="relative mx-auto max-w-[76rem] px-5 pt-20 text-center sm:px-8 sm:pt-28"
        style={still ? undefined : { y: copyY }}
      >
        <Reveal delay={0}>
          <p className="eyebrow">Built for payors and TPAs</p>
        </Reveal>

        <Reveal delay={0.09}>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-[2.5rem] leading-[1.02] sm:text-[3.25rem] lg:text-[3.75rem]">
            No&nbsp;Surprises&nbsp;Act infrastructure for <span className="ember">every claim</span>
          </h1>
        </Reveal>

        <Reveal delay={0.18}>
          <p
            className="mx-auto mt-6 max-w-[54ch] text-lead text-white/55"
            style={{ textWrap: "balance" }}
          >
            NSA Nexus runs out-of-network claims, QPA calculation, provider negotiations, IDR
            disputes, financial exposure and regulatory reporting from one system — so nothing
            slips between the deadline and the audit trail.
          </p>
        </Reveal>

        <Reveal delay={0.27}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button to="/signup" arrow>Get started</Button>
            <Button variant="ghost" href="#platform">See the platform</Button>
          </div>
        </Reveal>

        <Reveal delay={0.36}>
          <p className="mt-5 text-caption text-white/35">
            Free to set up. Deploys against your existing claims stack.
          </p>
        </Reveal>
      </motion.div>

      {/* The wired stage needs width to read; below sm it collapses to the
          three events it would have surfaced anyway. */}
      <motion.div
        className="relative mt-6 hidden sm:mt-8 sm:block"
        style={still ? undefined : { y: stageY, opacity: stageFade }}
      >
        <Reveal delay={0.42} y={16}>
          <HeroStage />
        </Reveal>
      </motion.div>
      <div className="relative mx-auto mt-12 flex max-w-[22rem] flex-col items-center gap-3 px-5 pb-16 sm:hidden">
        {FEED.slice(0, 3).map((f, i) => (
          <Reveal key={f.title} delay={0.3 + i * 0.1} className="w-full">
            <Notif {...f} className="!w-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const SYSTEMS = [
  "X12 837 / 835", "FHIR R4", "CMS Federal IDR Portal", "NPPES", "Availity", "Edifecs",
  "Facets", "QNXT", "HealthEdge", "Snowflake", "Databricks", "S3 / SFTP",
];

function Systems() {
  return (
    <section className="relative border-y border-white/[0.06] py-12">
      <Reveal>
        <p className="text-center text-caption text-white/35">
          Reads from the systems you already run
        </p>
      </Reveal>
      <div
        className="relative mt-7 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="group flex w-max animate-[marquee_42s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-3" aria-hidden={dup === 1}>
              {SYSTEMS.map((s) => (
                <span
                  key={s}
                  className="whitespace-nowrap rounded-full px-4 py-2 text-ui text-white/55"
                  style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SectionHead({ eyebrow, title, body, id }) {
  return (
    <div id={id} className="scroll-mt-24">
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 max-w-[20ch] text-[2rem] sm:text-[2.5rem]">{title}</h2>
      </Reveal>
      {body && (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-[62ch] text-lead text-white/50" style={{ textWrap: "pretty" }}>
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* --- bento visuals -------------------------------------------------------- */

function QpaVisual() {
  return (
    <div className="mt-7 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-caption text-white/40">Median contracted rate · CPT 43239</span>
        <span className="text-h3 tabular-nums">$1,284</span>
      </div>
      <div className="flex h-16 items-end gap-[3px]">
        {[24, 38, 31, 52, 68, 84, 96, 88, 71, 55, 44, 36, 29, 22, 18].map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-[2px]"
            style={{
              background: i === 6 ? "linear-gradient(to top, var(--color-ember-600), var(--color-ember-300))" : "oklch(1 0 0 / 0.13)",
            }}
            initial={{ height: 2, opacity: 0 }}
            whileInView={{ height: `${h}%`, opacity: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.03, ease: [0, 0, 0.2, 1] }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-caption text-white/35">
        <span>42 qualifying rates</span>
        <span>Indexed CPI-U 2019 → 2026</span>
      </div>
    </div>
  );
}

function TimelineVisual() {
  const steps = [
    { label: "Initiate", day: "Day 0", done: true },
    { label: "Open negotiation", day: "Day 1–30", done: true },
    { label: "IDR initiation", day: "+4 bus. days", done: false },
    { label: "Offer selection", day: "+30 days", done: false },
  ];
  return (
    <ol className="mt-7 space-y-3.5">
      {steps.map((s, i) => (
        <motion.li
          key={s.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.4, delay: i * 0.09, ease: [0, 0, 0.2, 1] }}
        >
          <span
            className="grid size-6 shrink-0 place-items-center rounded-full text-ink"
            style={{
              background: s.done ? "linear-gradient(in oklab, var(--color-cream), var(--color-cream-2))" : "oklch(1 0 0 / 0.07)",
              boxShadow: s.done ? "none" : "inset 0 0 0 1px oklch(1 0 0 / 0.12)",
            }}
          >
            {s.done ? <Icon.check size={13} /> : <span className="size-1.5 rounded-full bg-white/40" />}
          </span>
          <span className={`flex-1 text-ui ${s.done ? "text-bone" : "text-white/45"}`}>{s.label}</span>
          <span className="text-caption tabular-nums text-white/35">{s.day}</span>
        </motion.li>
      ))}
    </ol>
  );
}

function ExposureVisual() {
  return (
    <div className="mt-7 space-y-3">
      <Bar label="Emergency" value="$4.2M" pct={78} tone="ember" delay={0} />
      <Bar label="Ancillary INF" value="$2.6M" pct={48} delay={0.1} />
      <Bar label="Air ambulance" value="$1.1M" pct={21} delay={0.2} />
      <p className="pt-1 text-caption text-white/35">
        Projected 12-month IDR exposure at current offer strategy
      </p>
    </div>
  );
}

function GuardrailVisual() {
  const rows = [
    { t: "Notice & consent missing", s: "§2799B-2 · claim held", bad: true },
    { t: "Ancillary at in-network facility", s: "Consent not waivable", bad: true },
    { t: "Cost-share set to in-network", s: "Auto-applied", bad: false },
  ];
  return (
    <div className="mt-7 space-y-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.t}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06)" }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0, 0, 0.2, 1] }}
        >
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: r.bad ? "var(--color-ember-300)" : "oklch(0.8 0.11 155)" }}
          />
          <span className="min-w-0 flex-1 truncate text-ui">{r.t}</span>
          <span className="shrink-0 text-caption text-white/35">{r.s}</span>
        </motion.div>
      ))}
    </div>
  );
}

const BENTO = [
  {
    icon: <Icon.calc />,
    title: "QPA engine",
    body: "Compute the qualifying payment amount from your own contracted rates, index it, and keep the full methodology attached to the claim so it survives an IDRE challenge.",
    visual: <QpaVisual />,
    wide: true,
  },
  {
    icon: <Icon.shield />,
    title: "Billing guardrails",
    body: "Every out-of-network claim is screened against notice-and-consent rules before it pays. Violations are held, not discovered in an audit.",
    visual: <GuardrailVisual />,
  },
  {
    icon: <Icon.handshake />,
    title: "Negotiation workspace",
    body: "Open negotiation runs on a clock. Offers, counters, and provider correspondence live in one thread with the 30-day deadline enforced.",
    visual: <TimelineVisual />,
  },
  {
    icon: <Icon.chart />,
    title: "Exposure modeling",
    body: "Model what your offer strategy costs before you commit to it — by service line, facility, and IDRE win rate.",
    visual: <ExposureVisual />,
    wide: true,
  },
];

function Platform() {
  return (
    <section className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="platform"
        eyebrow="The platform"
        title="One system from claim intake to IDR decision"
        body="Payors lose NSA disputes on process, not on price. NSA Nexus keeps the calculation, the correspondence, and the deadline in the same record."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {BENTO.map((b, i) => (
          <Reveal key={b.title} delay={(i % 2) * 0.08} className={b.wide ? "md:col-span-2" : ""}>
            <Card className="h-full p-7 sm:p-8">
              {i === 0 && (
                <BorderBeam
                  size={140}
                  duration={11}
                  borderWidth={1}
                  colorFrom="var(--color-ember-100)"
                  colorTo="var(--color-ember-600)"
                />
              )}
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white/[0.05] text-white/70 ring-1 ring-white/[0.07] ring-inset">
                  {b.icon}
                </span>
                <h3 className="text-h4">{b.title}</h3>
              </div>
              <p className="mt-4 max-w-[56ch] text-ui text-white/50" style={{ textWrap: "pretty" }}>
                {b.body}
              </p>
              {b.visual}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Ingest and classify every out-of-network claim",
    body: "837 claims, remits, provider rosters and contracted rates land in one model. Each claim is tagged emergency, ancillary-at-in-network-facility, air ambulance, or consented — the four paths that decide everything downstream.",
    tag: "INTAKE",
  },
  {
    n: "02",
    title: "Calculate and defend the QPA",
    body: "The median contracted rate is computed from your own data, indexed, and frozen with its inputs. When a provider disputes it, the methodology is already written, timestamped, and exportable.",
    tag: "QPA",
  },
  {
    n: "03",
    title: "Negotiate, then escalate on the clock",
    body: "Open negotiation, the four-business-day IDR window, batching eligibility, certified IDRE selection, and offer submission are tracked as one case with the deadline that actually applies.",
    tag: "DISPUTE",
  },
];

function How() {
  const stepsRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 62%", "end 78%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0.04, 1]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length + 0.35)))
  );

  return (
    <section className="relative border-y border-white/[0.06] bg-ink-deep">
      <div className="lattice pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 md:grid-cols-[20rem_1fr] md:gap-16">
          {/* The heading parks itself while the steps run past it. */}
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHead id="how" eyebrow="How it works" title="Three moves, one audit trail" />

            <div className="mt-10 hidden gap-5 md:flex">
              <div className="relative w-px shrink-0 bg-white/[0.08]">
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top rounded-full"
                  style={{
                    height: "100%",
                    scaleY: still ? 1 : fill,
                    background: "linear-gradient(to bottom, var(--color-ember-300), var(--color-ember-600))",
                  }}
                />
              </div>
              <ol className="flex flex-col gap-4">
                {STEPS.map((s, i) => (
                  <li
                    key={s.n}
                    className="flex items-center gap-3 text-ui transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ color: i <= active ? "var(--color-bone)" : "oklch(1 0 0 / 0.32)" }}
                  >
                    <span className="tabular-nums text-caption text-white/30">{s.n}</span>
                    {s.tag}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            ref={stepsRef}
            className="space-y-px overflow-hidden rounded-2xl"
            style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
          >
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div
                  className="card-hover grid gap-5 bg-white/[0.02] p-7 transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:p-9 md:grid-cols-[auto_1fr] md:gap-8"
                  style={{ backgroundColor: i === active ? "oklch(1 0 0 / 0.045)" : undefined }}
                >
                  <span
                    className="text-h2 tabular-nums transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ color: i <= active ? "oklch(1 0 0 / 0.5)" : "oklch(1 0 0 / 0.16)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="max-w-[26ch] text-h3">{s.title}</h3>
                      <span className="eyebrow whitespace-nowrap">{s.tag}</span>
                    </div>
                    <p className="mt-3 max-w-[64ch] text-ui text-white/50" style={{ textWrap: "pretty" }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const OUTCOMES = [
  { k: "Deadline misses", to: 0, format: (n) => n, s: "IDR windows tracked per case, not per queue" },
  { k: "QPA defensibility", to: 100, format: (n) => `${n}%`, s: "Every amount ships with its inputs and index" },
  { k: "Retention", to: 6, format: (n) => `${n} yrs`, s: "Audit packets sealed at the moment of decision" },
];

function Outcomes() {
  return (
    <section className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="outcomes"
        eyebrow="Why it matters"
        title="Compliance is a deadline problem before it is a pricing problem"
        body="A missed four-business-day window is a lost dispute regardless of how strong the QPA was. NSA Nexus is built around the clock first."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {OUTCOMES.map((o, i) => (
          <Reveal key={o.k} delay={i * 0.08}>
            <Card className="h-full p-7">
              <p className="eyebrow">{o.k}</p>
              <p className="mt-4 text-[2.75rem] leading-none">
                <CountUp to={o.to} format={o.format} className="ember inline-block" />
              </p>
              <p className="mt-3 text-ui text-white/45" style={{ textWrap: "pretty" }}>{o.s}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <Card className="mt-4 p-7 sm:p-9">
          <div className="grid gap-9 md:grid-cols-2 md:gap-14">
            <div>
              <p className="eyebrow">Where NSA cases are lost</p>
              <div className="mt-6 space-y-3">
                <Bar label="Missed windows" value="41%" pct={41} tone="ember" />
                <Bar label="Weak QPA record" value="28%" pct={28} tone="ember" delay={0.08} />
                <Bar label="Batching errors" value="19%" pct={19} delay={0.16} />
                <Bar label="Notice defects" value="12%" pct={12} delay={0.24} />
              </div>
              <p className="mt-5 text-caption text-white/30">
                Illustrative distribution across payor dispute programs.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-5 md:border-l md:border-white/[0.07] md:pl-14">
              {[
                "Prevent surprise billing violations before adjudication",
                "Calculate and defend the Qualified Payment Amount",
                "Manage provider negotiations on an enforced clock",
                "Track every IDR case to its selected offer",
                "Reduce financial risk with modeled exposure",
                "Stay audit-ready without assembling packets by hand",
              ].map((t, i) => (
                <motion.div
                  key={t}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.42, delay: i * 0.07, ease: [0, 0, 0.2, 1] }}
                >
                  <span className="mt-0.5 text-ember-300"><Icon.check size={17} /></span>
                  <span className="text-ui text-white/70" style={{ textWrap: "pretty" }}>{t}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const FAQ = [
  {
    cat: "Scope",
    q: "Which claims does NSA Nexus cover?",
    a: "Out-of-network emergency services, non-emergency items and services delivered by out-of-network providers at in-network facilities, and air ambulance. Consented non-emergency claims are tracked separately with their notice-and-consent evidence attached.",
  },
  {
    cat: "QPA",
    q: "How is the qualifying payment amount calculated?",
    a: "From the median of your own contracted rates for the same or a similar item or service in the same geographic region, as of January 31, 2019, indexed forward by CPI-U. Where you have insufficient information, the fallback methodology is applied and flagged in the record.",
  },
  {
    cat: "IDR",
    q: "Does it submit to the Federal IDR portal?",
    a: "Cases are prepared, batched where eligible, and submitted with the offer and supporting record. Certified IDRE selection, conflict checks and administrative fees are tracked to the decision.",
  },
  {
    cat: "Deployment",
    q: "How long does implementation take?",
    a: "Most payors are live on a read-only ingest in two to four weeks, then move guardrails and negotiations onto the platform line of business at a time.",
  },
  {
    cat: "Security",
    q: "How is PHI handled?",
    a: "HIPAA-aligned controls, encryption in transit and at rest, per-tenant isolation, role-scoped access and a full immutable audit log. Data residency is configurable.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative border-t border-white/[0.06] bg-ink-deep">
      <div className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead id="faq" eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 max-w-[60rem]">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="border-b border-white/[0.07]">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-6 py-6 text-left"
                  >
                    <span className="eyebrow w-32 shrink-0 hidden sm:block">{f.cat}</span>
                    <span className="flex-1 text-lead">{f.q}</span>
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full text-white/50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.09)" }}
                    >
                      <Icon.chevron size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="max-w-[68ch] pb-7 text-ui text-white/50 sm:pl-38"
                          style={{ textWrap: "pretty" }}
                        >
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="lattice-rules pointer-events-none absolute inset-0 opacity-80" />
      <Ripple mainCircleSize={260} mainCircleOpacity={0.3} numCircles={6} className="opacity-80" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 80% at 50% 100%, oklch(0.741 0.122 64.7 / 0.1), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[76rem] px-5 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <h2 className="mx-auto max-w-[18ch] text-[2.25rem] sm:text-[3rem]">
            Close the gap between the <span className="ember">deadline</span> and the record
          </h2>
        </Reveal>
        <Reveal delay={0.09}>
          <p className="mx-auto mt-6 max-w-[52ch] text-lead text-white/50" style={{ textWrap: "pretty" }}>
            Set up a workspace, connect a quarter of out-of-network claims, and see what the
            platform would have caught.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex justify-center">
            <Button to="/signup" arrow>Get started</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <main>
      <Hero />
      <Systems />
      <Platform />
      <How />
      <Outcomes />
      <Faq />
      <FinalCta />
    </main>
  );
}
