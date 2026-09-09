import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FlickeringGrid } from "../components/FlickeringGrid";
import { Arrow, CountUp, Eyebrow, Icon, Reveal } from "../components/ui";

const ROLES = [
  "Payment integrity",
  "Network / provider contracting",
  "Claims operations",
  "Compliance & regulatory",
  "Finance / actuarial",
  "Engineering & data",
];

const STEPS = [
  { n: "01", t: "Create your workspace", s: "One account per payor. Invite the rest of the team once you are in." },
  { n: "02", t: "Connect a claims feed", s: "837s, remits, and your contracted rate table — SFTP, S3, or a direct X12 drop." },
  { n: "03", t: "Get your first QPA read", s: "Qualifying payment amounts, notice-and-consent flags, and modeled IDR exposure, usually within two business days." },
];

const REQUIRED = ["firstName", "lastName", "email", "org", "password"];
const FREE_MAIL = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "proton.me"];

/* Four checks, four segments. */
function strength(pw) {
  return [pw.length >= 10, /[A-Z]/.test(pw), /\d/.test(pw), /[^\w\s]/.test(pw)].filter(Boolean).length;
}

function validate(v) {
  const e = {};
  if (!v.firstName.trim()) e.firstName = "Required";
  if (!v.lastName.trim()) e.lastName = "Required";
  const email = v.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter a valid email address";
  else if (FREE_MAIL.includes(email.split("@")[1]))
    e.email = "Use your work email so we can verify the organization";
  if (!v.org.trim()) e.org = "Required";
  if (v.password.length < 10) e.password = "At least 10 characters";
  else if (strength(v.password) < 3) e.password = "Add a capital, a number, or a symbol";
  return e;
}

/* Icons swap by scaling up out of a blur rather than popping in. */
const iconIn = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: { type: "spring", duration: 0.3, bounce: 0 },
};

/* --- field ---------------------------------------------------------------- */

function Field({ label, hint, error, valid, children }) {
  return (
    <label className="group block">
      <span className="flex items-baseline justify-between gap-3 text-ui">
        <span className="text-white/70 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-focus-within:text-ember-100">
          {label}
        </span>
        <span className="flex items-center gap-2 text-caption text-white/30">
          {hint}
          <AnimatePresence initial={false}>
            {valid && (
              <motion.span key="ok" {...iconIn} className="flex text-ember-300">
                <Icon.check size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </span>

      <span className="relative mt-2 block">
        {children}
        {/* Focus reads as a line drawn under the field, left to right. */}
        <span
          className="pointer-events-none absolute inset-x-3 bottom-0 h-[1.5px] origin-left scale-x-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0,0,0.2,1)] group-focus-within:scale-x-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-ember-300), var(--color-ember-100), transparent)",
          }}
        />
      </span>

      <AnimatePresence initial={false}>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="block overflow-hidden text-caption text-ember-300"
          >
            <span className="block pt-1.5">{error}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const control =
  "w-full rounded-[10px] bg-white/[0.03] px-3.5 py-3 text-base sm:text-ui text-bone " +
  "shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.09)] " +
  "transition-[box-shadow,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "hover:bg-white/[0.05] focus:outline-none focus:bg-white/[0.05] " +
  "focus:shadow-[inset_0_0_0_1px_oklch(0.741_0.122_64.7_/_0.28)]";

function Select({ name, value, onChange, options, placeholder = "Select…" }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${control} appearance-none pr-10 ${value ? "" : "text-white/40"}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-raise text-bone">{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-white/40 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-focus-within:translate-y-px">
        <Icon.chevron size={16} />
      </span>
    </div>
  );
}

/* Segments fill as the password clears each check; the last segment goes ember. */
function Strength({ value }) {
  const n = strength(value);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return (
    <div className="mt-2.5 flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="h-[3px] flex-1 origin-left rounded-full"
            initial={false}
            animate={{
              scaleX: i < n ? 1 : 0,
              backgroundColor: n === 4 ? "var(--color-ember-300)" : "oklch(1 0 0 / 0.55)",
            }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0, 0, 0.2, 1] }}
            style={{ boxShadow: i < n ? "none" : "inset 0 0 0 1px oklch(1 0 0 / 0.1)" }}
          />
        ))}
      </div>
      <span className="w-12 text-right text-caption tabular-nums text-white/35">{labels[n]}</span>
    </div>
  );
}

/* --- backdrop -------------------------------------------------------------- */

/* Magic UI's flickering grid, tinted and masked so it reads as quiet system
   activity behind the form rather than a lit-up wall. */
function Backdrop({ still }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="rules absolute inset-0 opacity-70" />

      {still ? (
        <div className="lattice absolute inset-0 opacity-70" />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              maskImage: "radial-gradient(110% 90% at 22% 8%, black 0%, black 34%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(110% 90% at 22% 8%, black 0%, black 34%, transparent 76%)",
            }}
          >
            <FlickeringGrid squareSize={3} gridGap={9} flickerChance={0.16} color="#F7F7F3" maxOpacity={0.16} />
          </div>
          {/* A second, warmer pass low and right, so the two corners differ. */}
          <div
            className="absolute inset-0"
            style={{
              maskImage: "radial-gradient(88% 78% at 84% 94%, black 0%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(88% 78% at 84% 94%, black 0%, transparent 70%)",
            }}
          >
            <FlickeringGrid squareSize={3} gridGap={9} flickerChance={0.12} color="#E09A52" maxOpacity={0.26} />
          </div>
        </>
      )}

      <div
        className="absolute inset-x-0 top-0 h-[620px]"
        style={{ background: "radial-gradient(55% 60% at 30% 0%, oklch(0.741 0.122 64.7 / 0.09), transparent 72%)" }}
      />
      {/* Keeps the grid from crawling behind the copy. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(70% 55% at 30% 34%, oklch(0.205 0 0 / 0.72), transparent 70%)" }}
      />
    </div>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Signup() {
  const still = useReducedMotion();
  const [values, setValues] = useState({
    firstName: "", lastName: "", email: "", org: "", password: "", role: "",
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [state, setState] = useState("idle"); // idle | sending | sent

  const live = validate(values);
  const isValid = (k) => Boolean(String(values[k]).trim()) && !live[k];
  const done = REQUIRED.filter(isValid).length;
  const ready = done === REQUIRED.length;

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setState("sending");
    // ponytail: no backend yet — swap this for the real POST when the API lands.
    await new Promise((r) => setTimeout(r, 1100));
    setState("sent");
  }

  return (
    <main className="relative min-h-dvh overflow-hidden pt-16">
      <Backdrop still={still} />

      <div className="relative mx-auto grid max-w-[76rem] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* ---------------- left rail ---------------- */}
        <div className="max-w-[34rem]">
          <Reveal><Eyebrow>Create account</Eyebrow></Reveal>
          <Reveal delay={0.09}>
            <h1 className="mt-5 text-[2.25rem] leading-[1.06] sm:text-[2.75rem]">
              Know your out&#8209;of&#8209;network exposure before the <span className="ember">IDRE does</span>
            </h1>
          </Reveal>

          <ol className="mt-12 flex flex-col gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.18 + i * 0.09}>
                <li className="flex gap-5">
                  <span
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-caption tabular-nums text-white/45"
                    style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.1)" }}
                  >
                    {s.n}
                  </span>
                  <span className="block">
                    <span className="block text-lead">{s.t}</span>
                    <span className="mt-1.5 block max-w-[52ch] text-ui text-white/45" style={{ textWrap: "pretty" }}>
                      {s.s}
                    </span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.45}>
            <div className="mt-12 rounded-2xl p-6" style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.07)" }}>
              <p className="eyebrow">The window you are working against</p>
              <div className="mt-5 grid grid-cols-3 gap-4">
                {[
                  [30, "business days of open negotiation"],
                  [4, "business days to initiate IDR"],
                  [6, "years of records you must retain"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-h2 leading-none">
                      <CountUp to={n} className="ember inline-block" />
                    </p>
                    <p className="mt-2 text-caption text-white/40" style={{ textWrap: "pretty" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------- form card ---------------- */}
        <Reveal delay={0.12} y={16}>
          <div className="card relative overflow-hidden rounded-[20px] p-6 sm:p-8">
            {/* Completion rail across the top edge of the card. */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] origin-left"
              style={{ background: "linear-gradient(90deg, var(--color-ember-600), var(--color-ember-100))" }}
              initial={false}
              animate={{ scaleX: state === "sent" ? 1 : done / REQUIRED.length }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            />

            <AnimatePresence mode="wait" initial={false}>
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
                  className="relative py-10 text-center"
                >
                  <span
                    className="mx-auto grid size-14 place-items-center rounded-full text-ink"
                    style={{ background: "linear-gradient(in oklab, var(--color-cream), var(--color-cream-2))" }}
                  >
                    {/* The tick draws itself instead of appearing. */}
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <motion.path
                        d="m5 12.5 4.5 4.5L19 7"
                        initial={still ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </svg>
                  </span>
                  {[
                    <h2 key="h" className="mt-6 text-h3">Workspace ready</h2>,
                    <p key="p" className="mx-auto mt-3 max-w-[36ch] text-ui text-white/50" style={{ textWrap: "pretty" }}>
                      {values.org.trim()} is set up. A verification link is on its way to
                    </p>,
                    <p key="e" className="mt-3 flex justify-center">
                      <span
                        className="max-w-full truncate rounded-full px-3.5 py-1.5 text-ui text-bone"
                        style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.1)" }}
                        title={values.email}
                      >
                        {values.email}
                      </span>
                    </p>,
                    <Link key="l" to="/" className="group mt-8 inline-flex min-h-11 items-center gap-2 text-ui text-white/55 transition-colors duration-200 hover:text-bone">
                      Back to home <Arrow />
                    </Link>,
                  ].map((el, i) => (
                    <motion.div
                      key={i}
                      initial={still ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + i * 0.09, ease: [0, 0, 0.2, 1] }}
                    >
                      {el}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 1, 1] }}
                  className="relative flex flex-col gap-5"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h2 className="text-h3">Create your account</h2>
                      <p className="mt-2 text-ui text-white/45">Free to set up. No card required.</p>
                    </div>
                    <p className="shrink-0 text-caption tabular-nums text-white/35" aria-live="polite">
                      <span className="text-bone">{done}</span> / {REQUIRED.length}
                    </p>
                  </div>

                  {/* Fields arrive one after another rather than as one block. */}
                  {[
                    <div key="name" className="grid gap-4 sm:grid-cols-2">
                      <Field label="First name" error={errors.firstName} valid={isValid("firstName")}>
                        <input name="firstName" autoComplete="given-name" className={control}
                          value={values.firstName} onChange={set("firstName")} />
                      </Field>
                      <Field label="Last name" error={errors.lastName} valid={isValid("lastName")}>
                        <input name="lastName" autoComplete="family-name" className={control}
                          value={values.lastName} onChange={set("lastName")} />
                      </Field>
                    </div>,
                    <Field key="email" label="Work email" error={errors.email} valid={isValid("email")}>
                      <input name="email" type="email" inputMode="email" autoComplete="email"
                        placeholder="you@payor.com" className={control}
                        value={values.email} onChange={set("email")} />
                    </Field>,
                    <Field key="org" label="Organization" error={errors.org} valid={isValid("org")}>
                      <input name="org" autoComplete="organization" className={control}
                        value={values.org} onChange={set("org")} />
                    </Field>,
                    <div key="pw">
                      <Field label="Password" error={errors.password} valid={isValid("password")}>
                        <div className="relative">
                          <input name="password" type={showPw ? "text" : "password"} autoComplete="new-password"
                            className={`${control} pr-12`} value={values.password} onChange={set("password")} />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            aria-label={showPw ? "Hide password" : "Show password"}
                            aria-pressed={showPw}
                            className="absolute inset-y-0 right-1 grid w-10 place-items-center text-white/40 transition-colors duration-200 hover:text-bone"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span key={showPw ? "on" : "off"} {...iconIn} className="flex">
                                {showPw ? <Icon.eyeOff size={17} /> : <Icon.eye size={17} />}
                              </motion.span>
                            </AnimatePresence>
                          </button>
                        </div>
                      </Field>
                      <Strength value={values.password} />
                    </div>,
                    <Field key="role" label="Team" hint="Optional" valid={Boolean(values.role)}>
                      <Select name="role" value={values.role} onChange={set("role")} options={ROLES} />
                    </Field>,
                  ].map((el, i) => (
                    <motion.div
                      key={el.key}
                      initial={still ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.18 + i * 0.07, ease: [0, 0, 0.2, 1] }}
                    >
                      {el}
                    </motion.div>
                  ))}

                  <motion.div
                    initial={still ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.53, ease: [0, 0, 0.2, 1] }}
                    className="flex flex-col gap-4 pt-2"
                  >
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      /* The button arms itself once every required field passes. */
                      className="pill group relative flex min-h-12 w-full items-center justify-center rounded-full px-6 text-ui font-medium
                        transition-[scale,filter,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        hover:brightness-[1.04] active:scale-[0.96] disabled:cursor-wait"
                      style={
                        ready && state === "idle"
                          ? { boxShadow: "inset 0 2px 2px oklch(1 0 0 / 0.6), inset 0 -2px 2px oklch(0 0 0 / 0.08), 0 0 0 2px oklch(0.741 0.122 64.7 / 0.14), 0 8px 24px -14px oklch(0.741 0.122 64.7 / 0.5)" }
                          : undefined
                      }
                    >
                      {/* Label swaps in place so the button never changes size. */}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={state}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="flex items-center gap-2"
                        >
                          {state === "sending" ? (
                            <>
                              <span className="size-4 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
                              Creating workspace
                            </>
                          ) : (
                            <>
                              Create account
                              <Arrow />
                            </>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>

                    <p className="text-center text-caption text-white/35" style={{ textWrap: "pretty" }}>
                      By continuing you agree to the Terms and acknowledge the Privacy Policy.
                    </p>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
