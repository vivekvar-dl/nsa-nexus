import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FlickeringGrid } from "../components/FlickeringGrid";
import { Arrow, CountUp, Eyebrow, Icon, Reveal } from "../components/ui";

/* The three demo users the NSA frontend ships with (authCredentials.js) —
   client-side only, and replaced once /v1/auth/login exists. */
const DEMO = [
  { role: "Payor", suite: "Payor Intelligence", name: "Michael Anderson", email: "michael.anderson@payor.com", password: "Payor@123" },
  { role: "Provider", suite: "Provider Revenue", name: "Sarah Johnson", email: "sarah.johnson@provider.com", password: "Provider@123" },
  { role: "Arbiter", suite: "Arbiter Workspace", name: "Judge Patricia Wells", email: "patricia.wells@jams-healthcare.com", password: "Arbiter@123" },
];

/* From the product's own login rail. */
const POINTS = [
  "Automated QPA & IDR workflows",
  "Real-time network adequacy monitoring",
  "FWA detection & compliance auditing",
];

const iconIn = {
  initial: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.25, filter: "blur(4px)" },
  transition: { type: "spring", duration: 0.3, bounce: 0 },
};

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/* --- field ---------------------------------------------------------------- */

function Field({ label, hint, valid, children }) {
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
    </label>
  );
}

const control =
  "w-full rounded-[10px] bg-white/[0.03] px-3.5 py-3 text-base sm:text-ui text-bone " +
  "shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.09)] " +
  "transition-[box-shadow,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "hover:bg-white/[0.05] focus:outline-none focus:bg-white/[0.05] " +
  "focus:shadow-[inset_0_0_0_1px_oklch(0.741_0.122_64.7_/_0.28)]";

/* --- backdrop -------------------------------------------------------------- */

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
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(70% 55% at 30% 34%, oklch(0.205 0 0 / 0.72), transparent 70%)" }}
      />
    </div>
  );
}

/* --- page ----------------------------------------------------------------- */

export default function Login() {
  const still = useReducedMotion();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done
  const [openDemo, setOpenDemo] = useState(false);
  const [matched, setMatched] = useState(null);

  const emailOk = validEmail(values.email);
  const pwOk = values.password.length > 0;
  const ready = emailOk && pwOk;

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setError("");
  };

  const useDemo = (u) => {
    setValues({ email: u.email, password: u.password });
    setError("");
    setOpenDemo(false);
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!values.email.trim() || !values.password) {
      setError("Please enter both email and password.");
      return;
    }
    setState("sending");
    // ponytail: no backend yet — the shipped app validates against
    // authCredentials.js until POST /v1/auth/login exists.
    await new Promise((r) => setTimeout(r, 900));
    const user = DEMO.find(
      (u) => u.email.toLowerCase() === values.email.trim().toLowerCase() && u.password === values.password
    );
    if (!user) {
      setError("Invalid email or password. Please try again.");
      setState("idle");
      return;
    }
    setMatched(user);
    setState("done");
  }

  return (
    <main className="relative min-h-dvh overflow-hidden pt-16">
      <Backdrop still={still} />

      <div className="relative mx-auto grid max-w-[76rem] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* ---------------- left rail ---------------- */}
        <div className="max-w-[34rem]">
          <Reveal><Eyebrow>Sign in</Eyebrow></Reveal>
          <Reveal delay={0.09}>
            <h1 className="mt-5 text-[2.25rem] leading-[1.06] sm:text-[2.75rem]">
              The unified platform for <span className="ember">No&nbsp;Surprises&nbsp;Act</span> compliance
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-[46ch] text-lead text-white/50" style={{ textWrap: "pretty" }}>
              Claim screening, QPA calibration and provider network intelligence — your role decides
              which suite opens.
            </p>
          </Reveal>

          <ul className="mt-10 flex flex-col gap-4">
            {POINTS.map((p, i) => (
              <Reveal key={p} delay={0.24 + i * 0.08}>
                <li className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full text-ember-300" style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.1)" }}>
                    <Icon.check size={13} />
                  </span>
                  <span className="text-ui text-white/70">{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.5}>
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
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] origin-left"
              style={{ background: "linear-gradient(90deg, var(--color-ember-600), var(--color-ember-100))" }}
              initial={false}
              animate={{ scaleX: state === "done" ? 1 : (emailOk ? 0.5 : 0) + (pwOk ? 0.5 : 0) }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            />

            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
                  className="relative py-10 text-center"
                >
                  <span
                    className="mx-auto grid size-14 place-items-center rounded-full text-ink"
                    style={{ background: "linear-gradient(in oklab, var(--color-cream), var(--color-cream-2))" }}
                  >
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
                    <h2 key="h" className="mt-6 text-h3">Welcome back, {matched.name.split(" ").at(-1)}</h2>,
                    <p key="p" className="mx-auto mt-3 max-w-[36ch] text-ui text-white/50" style={{ textWrap: "pretty" }}>
                      Opening the <span className="text-bone">{matched.suite}</span> suite.
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
                  <div>
                    <h2 className="text-h3">Welcome back</h2>
                    <p className="mt-2 text-ui text-white/45">Sign in to your NSA Nexus account.</p>
                  </div>

                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                        role="alert"
                      >
                        <span
                          className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-3 text-ui text-ember-100"
                          style={{ background: "oklch(0.741 0.122 64.7 / 0.1)", boxShadow: "inset 0 0 0 1px oklch(0.741 0.122 64.7 / 0.28)" }}
                        >
                          <Icon.alert size={16} />
                          {error}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {[
                    <Field key="email" label="Email" valid={emailOk}>
                      <input name="email" type="email" inputMode="email" autoComplete="username"
                        placeholder="you@company.com" className={control}
                        value={values.email} onChange={set("email")} />
                    </Field>,
                    <Field key="pw" label="Password" valid={pwOk}>
                      <div className="relative">
                        <input name="password" type={showPw ? "text" : "password"} autoComplete="current-password"
                          placeholder="••••••••" className={`${control} pr-12`}
                          value={values.password} onChange={set("password")} />
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

                  <div className="flex items-center justify-between gap-4 text-ui">
                    <button
                      type="button"
                      onClick={() => setRemember((v) => !v)}
                      className="group flex items-center gap-2.5 text-white/55 transition-colors duration-200 hover:text-bone"
                    >
                      <span
                        className="grid size-[18px] place-items-center rounded-[5px] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        style={
                          remember
                            ? { background: "linear-gradient(in oklab, var(--color-cream), var(--color-cream-2))", color: "var(--color-obsidian)" }
                            : { boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.14)" }
                        }
                      >
                        <AnimatePresence initial={false}>
                          {remember && (
                            <motion.span key="tick" {...iconIn} className="flex">
                              <Icon.check size={12} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      Remember me
                    </button>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-white/55 underline decoration-white/20 underline-offset-4 [text-decoration-thickness:from-font] transition-colors duration-200 hover:text-bone hover:decoration-white/50"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <motion.div
                    initial={still ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4, ease: [0, 0, 0.2, 1] }}
                    className="flex flex-col gap-4 pt-1"
                  >
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="pill group relative flex min-h-12 w-full items-center justify-center rounded-full px-6 text-ui font-medium
                        transition-[scale,filter,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                        hover:brightness-[1.04] active:scale-[0.96] disabled:cursor-wait"
                      style={
                        ready && state === "idle"
                          ? { boxShadow: "inset 0 2px 2px oklch(1 0 0 / 0.6), inset 0 -2px 2px oklch(0 0 0 / 0.08), 0 0 0 2px oklch(0.741 0.122 64.7 / 0.14), 0 8px 24px -14px oklch(0.741 0.122 64.7 / 0.5)" }
                          : undefined
                      }
                    >
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
                              Signing in
                            </>
                          ) : (
                            <>
                              Sign in
                              <Arrow />
                            </>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>

                    {/* The app ships a demo-credential drawer; this is that, inline. */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenDemo((v) => !v)}
                        aria-expanded={openDemo}
                        className="flex w-full items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5 text-caption text-white/45 transition-colors duration-200 hover:text-bone"
                        style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.08)" }}
                      >
                        Demo credentials
                        <span
                          className="flex transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                          style={{ transform: openDemo ? "rotate(180deg)" : "none" }}
                        >
                          <Icon.chevron size={15} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {openDemo && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-2 pt-2">
                              {DEMO.map((u, i) => (
                                <motion.button
                                  key={u.email}
                                  type="button"
                                  onClick={() => useDemo(u)}
                                  initial={still ? false : { opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06, ease: [0, 0, 0.2, 1] }}
                                  className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.05]"
                                  style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06)" }}
                                >
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-caption text-bone">{u.email}</span>
                                    <span className="block truncate text-caption text-white/35">{u.suite}</span>
                                  </span>
                                  <span className="shrink-0 rounded-full px-2 py-0.5 text-caption text-ember-100" style={{ background: "oklch(0.741 0.122 64.7 / 0.12)" }}>
                                    {u.role}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-center text-caption text-white/35">
                      Don&rsquo;t have an account? Contact your admin.
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
