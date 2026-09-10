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
          <p className="eyebrow">For payors, providers and IDR entities</p>
        </Reveal>

        <Reveal delay={0.09}>
          <h1 className="mx-auto mt-5 max-w-[16ch] text-[2.5rem] leading-[1.02] sm:text-[3.25rem] lg:text-[3.75rem]">
            No&nbsp;Surprises&nbsp;Act infrastructure for <span className="ember">every claim</span>
          </h1>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mx-auto mt-6 max-w-[54ch] text-lead text-white/55" style={{ textWrap: "balance" }}>
            The unified platform for No Surprises Act compliance, claim screening and provider
            network intelligence — thirty-three modules across three suites, on one record.
          </p>
        </Reveal>

        <Reveal delay={0.27}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button to="/signup" arrow>Get started</Button>
            <Button variant="ghost" href="#suites">Explore the suites</Button>
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

/* The actual module list, so the strip is the product rather than a logo wall. */
const MODULES = [
  "Claim Screener", "QPA Engine", "IDR Likelihood", "Dispute Initiation", "Open Negotiation",
  "Medical Records", "FWA / SIU", "Provider Directory", "Network Adequacy", "AEOB Validator",
  "Financial Forecast", "IDR Defense", "ASO Employer Hub", "Compliance Audit",
  "Eligibility Advisor", "QPA Lookup", "IDR Offer Optimizer", "Smart Batching",
  "Ambient Billing Coder", "Deadline Tracker", "Revenue at Risk", "Evidence Builder",
  "Notice-Consent Validator", "QPA Benchmark", "Decision Issued",
];

function Modules() {
  return (
    <section className="relative border-y border-white/[0.06] py-12">
      <Reveal>
        <p className="text-center text-caption text-white/35">
          Thirty-three modules across three suites
        </p>
      </Reveal>
      <div
        className="relative mt-7 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="group flex w-max animate-[marquee_60s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-3" aria-hidden={dup === 1}>
              {MODULES.map((m) => (
                <span
                  key={m}
                  className="whitespace-nowrap rounded-full px-4 py-2 text-ui text-white/55"
                  style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
                >
                  {m}
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

/* --- suites --------------------------------------------------------------- */

const SUITES = [
  {
    name: "Payor Intelligence",
    count: 15,
    icon: <Icon.shield />,
    blurb: "Claims, QPA, IDR defense, FWA and network compliance in one queue.",
    points: [
      "NSA claim screening and QPA calibration",
      "IDR likelihood scoring and defense",
      "FWA detection and compliance auditing",
    ],
    chips: ["Claim Screener", "QPA Engine", "IDR Likelihood", "FWA / SIU", "Network Adequacy", "Compliance Audit"],
  },
  {
    name: "Provider Revenue",
    count: 13,
    icon: <Icon.chart />,
    blurb: "Revenue recovery, IDR strategy, ambient billing and dispute management.",
    points: [
      "Eligibility advice and QPA benchmarking",
      "Dispute initiation and offer optimization",
      "Ambient billing and revenue-at-risk forecasting",
    ],
    chips: ["Eligibility Advisor", "QPA Lookup", "IDR Offer Optimizer", "Smart Batching", "Evidence Builder", "Revenue at Risk"],
  },
  {
    name: "Arbiter Workspace",
    count: 5,
    icon: <Icon.gavel />,
    blurb: "For certified IDR entities reviewing both sides of a dispute.",
    points: [
      "Offers reviewed side by side against the QPA",
      "Evidence packets from payor and provider",
      "Decision issued with its rationale attached",
    ],
    chips: ["Disputes", "Offers", "QPA Benchmark", "Evidence", "Decision Issued"],
  },
];

function Suites() {
  return (
    <section className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        id="suites"
        eyebrow="Three suites"
        title="Every party to a dispute, on the same record"
        body="A No Surprises Act dispute has three sides. NSA Nexus gives each one its own workspace over a single set of claims, offers and deadlines — so nobody is arguing from a different copy."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {SUITES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <Card className="flex h-full flex-col p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white/[0.05] text-white/70 ring-1 ring-white/[0.07] ring-inset">
                  {s.icon}
                </span>
                <span className="text-caption tabular-nums text-white/35">
                  <CountUp to={s.count} duration={0.9} /> modules
                </span>
              </div>
              <h3 className="mt-5 text-h4">{s.name}</h3>
              <p className="mt-3 text-ui text-white/50" style={{ textWrap: "pretty" }}>{s.blurb}</p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-ember-300"><Icon.check size={16} /></span>
                    <span className="text-ui text-white/70" style={{ textWrap: "pretty" }}>{p}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-7">
                {s.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-md px-2 py-1 text-caption text-white/40"
                    style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --- bento visuals -------------------------------------------------------- */

function QpaVisual() {
  return (
    <div className="mt-7 flex flex-col gap-3">
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-white/[0.07] pt-4 sm:grid-cols-4">
        {[
          ["Base rate 2019", "$1,102"],
          ["Cumulative factor", "1.165"],
          ["Deductible left", "$340"],
          ["Coinsurance", "20%"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-caption text-white/35">{k}</p>
            <p className="mt-1 text-ui tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The real eligibility gate the IDR Likelihood module runs. */
function EligibilityVisual() {
  const checks = [
    ["Service after Jan 1, 2022", true],
    ["Plan type subject to NSA", true],
    ["Open Neg window not expired", true],
    ["Notice-consent used?", false],
  ];
  return (
    <div className="mt-7 flex flex-col gap-2">
      {checks.map(([t, ok], i) => (
        <motion.div
          key={t}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06)" }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.4, delay: i * 0.09, ease: [0, 0, 0.2, 1] }}
        >
          <span className={ok ? "text-ember-300" : "text-white/25"}>
            <Icon.check size={15} />
          </span>
          <span className="min-w-0 flex-1 truncate text-ui">{t}</span>
          <span className="shrink-0 text-caption text-white/35">{ok ? "Pass" : "Review"}</span>
        </motion.div>
      ))}
      <div className="mt-2 flex items-baseline justify-between border-t border-white/[0.07] pt-4">
        <span className="text-caption text-white/40">IDR dispute probability</span>
        <span className="text-h4 tabular-nums"><CountUp to={68} format={(n) => `${n}%`} /></span>
      </div>
    </div>
  );
}

/* draft → send → counter → accept, on the 30-day clock. */
function NegotiationVisual() {
  const steps = [
    { label: "Offer drafted", day: "Day 1", done: true },
    { label: "Offer sent", day: "Day 3", done: true },
    { label: "Counter received", day: "Day 17", done: true },
    { label: "Accept or escalate", day: "Day 30", done: false },
  ];
  return (
    <div className="mt-7 flex flex-col gap-3.5">
      {steps.map((s, i) => (
        <motion.div
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
        </motion.div>
      ))}
      <p className="flex items-center gap-2 pt-1 text-caption text-ember-300">
        <Icon.clock size={14} /> Expiring soon · 13 days left
      </p>
    </div>
  );
}

function AuditVisual() {
  return (
    <div className="mt-7 flex flex-col gap-3">
      <Bar label="Audit events" value="18,204" pct={82} tone="ember" delay={0} />
      <Bar label="PHI access" value="2,431" pct={44} delay={0.1} />
      <Bar label="IDR right lost" value="3" pct={4} delay={0.2} />
      <p className="pt-1 text-caption text-white/35">
        Compliance health score recomputed on every write to the audit log
      </p>
    </div>
  );
}

const BENTO = [
  {
    icon: <Icon.calc />,
    title: "QPA Engine",
    body: "Compute the qualifying payment amount from your own contracted rates, index the 2019 base rate forward, and derive member liability against the remaining deductible and coinsurance — with the regulatory basis attached to the claim.",
    visual: <QpaVisual />,
    wide: true,
  },
  {
    icon: <Icon.chart />,
    title: "IDR Likelihood",
    body: "Score a dispute before you file it. Every eligibility gate runs first, then dispute probability, expected award and fee estimate.",
    visual: <EligibilityVisual />,
  },
  {
    icon: <Icon.handshake />,
    title: "Open Negotiation",
    body: "Draft, send, counter and accept in one thread, with the 30-day clock enforced and expiry warnings raised before the right is lost.",
    visual: <NegotiationVisual />,
  },
  {
    icon: <Icon.file />,
    title: "Compliance Audit",
    body: "A health score over the whole book, an audit log explorer, and PHI access events tracked separately — so an audit is a query, not a project.",
    visual: <AuditVisual />,
    wide: true,
  },
];

function Platform() {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-deep">
      <div className="lattice pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead
          id="platform"
          eyebrow="The platform"
          title="One system from claim intake to IDR decision"
          body="Payors lose NSA disputes on process, not on price. NSA Nexus keeps the calculation, the correspondence and the deadline in the same record."
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
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Screen every out-of-network claim",
    body: "Claims ingest through the Claim Screener, which runs the NSA eligibility and medical-necessity gates and tags each one emergency, ancillary-at-in-network-facility, air ambulance, or consented — the four paths that decide everything downstream.",
    tag: "SCREEN",
  },
  {
    n: "02",
    title: "Calibrate the QPA and the member's share",
    body: "The QPA Engine computes the median contracted rate from your own data, indexes the 2019 base rate by its cumulative factor, and derives member liability from the remaining deductible and coinsurance. The regulatory basis is frozen with the result.",
    tag: "CALIBRATE",
  },
  {
    n: "03",
    title: "Negotiate, then escalate on the clock",
    body: "Dispute initiation, the 30-day open negotiation thread, smart batching of similar disputes, evidence assembly and IDR submission are tracked as one case — with deadline warnings raised before a right expires.",
    tag: "RESOLVE",
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
    <section className="relative">
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
            className="flex flex-col gap-px overflow-hidden rounded-2xl"
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
  { k: "Deadline misses", to: 0, format: (n) => n, s: "Every negotiation scanned for expiry, not just the one you opened" },
  { k: "QPA defensibility", to: 100, format: (n) => `${n}%`, s: "Each amount ships with its base rate, factor and regulatory basis" },
  { k: "Retention", to: 6, format: (n) => `${n} yrs`, s: "Audit events sealed at the moment of decision" },
];

function Outcomes() {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-deep">
      <div className="lattice pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[76rem] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead
          id="outcomes"
          eyebrow="Why it matters"
          title="Compliance is a deadline problem before it is a pricing problem"
          body="A negotiation that quietly expires is a lost dispute regardless of how strong the QPA was. NSA Nexus scans every active negotiation for inactive parties, expiring windows and expired rights — and raises them before the clock runs out."
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
                <div className="mt-6 flex flex-col gap-3">
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
                  "Calculate and defend the qualifying payment amount",
                  "Manage provider negotiations on an enforced clock",
                  "Track every IDR case to its issued decision",
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
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const FAQ = [
  {
    cat: "Suites",
    q: "Who is NSA Nexus for?",
    a: "Three roles, three workspaces. Payor Intelligence covers claim screening through compliance audit. Provider Revenue covers eligibility through evidence assembly. The Arbiter Workspace is for certified IDR entities — Maximus Federal, JAMS and the like — reviewing offers, evidence and issuing decisions.",
  },
  {
    cat: "Scope",
    q: "Which claims does NSA Nexus cover?",
    a: "Out-of-network emergency services, non-emergency items and services delivered by out-of-network providers at in-network facilities, and air ambulance. Consented non-emergency claims are tracked separately with their notice-and-consent evidence attached.",
  },
  {
    cat: "QPA",
    q: "How is the qualifying payment amount calculated?",
    a: "From the median of your own contracted rates for the same or a similar item or service in the same geographic region, as of January 31, 2019, indexed forward by a cumulative factor. Member liability is then derived from the remaining deductible and coinsurance, and the regulatory basis is stored with the result.",
  },
  {
    cat: "IDR",
    q: "What happens before a dispute is filed?",
    a: "IDR Likelihood runs the eligibility gate first — service date, plan type, open negotiation window, active-dispute and duplicate-filing checks, Medicare and Medicaid exclusion, notice-and-consent use and state law preemption — then returns dispute probability, expected award and a fee estimate.",
  },
  {
    cat: "Deadlines",
    q: "How are negotiation deadlines tracked?",
    a: "Every active negotiation is scanned, not just the one on screen. Disputes come back grouped as inactive party, expiring soon, or expired, and a warning is raised on the case before the right lapses.",
  },
  {
    cat: "Security",
    q: "How is PHI handled?",
    a: "HIPAA-aligned controls, encryption in transit and at rest, per-tenant isolation, role-scoped access, and PHI access events recorded as their own class in the audit log so they can be reported on separately.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative">
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
                    <span className="eyebrow hidden w-32 shrink-0 sm:block">{f.cat}</span>
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
    <section className="relative overflow-hidden border-t border-white/[0.06]">
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
      <Modules />
      <Suites />
      <Platform />
      <How />
      <Outcomes />
      <Faq />
      <FinalCta />
    </main>
  );
}
