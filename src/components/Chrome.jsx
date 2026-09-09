import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Button, Icon } from "./ui";

export function Mark({ size = 22, className = "" }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M16 2.6 27.2 9v14L16 29.4 4.8 23V9L16 2.6Z"
        fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.45"
      />
      <path d="M16 10.4 22 14v7l-6 3.6L10 21v-7l6-3.6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity="0.8" />
      <circle cx="16" cy="16.6" r="2.1" fill="currentColor" />
      <path d="M16 2.6v7.8M27.2 9 22 14M4.8 9 10 14M16 24.6v4.8" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

export function Wordmark({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="NSA Nexus home">
      <Mark />
      <span className="text-[1.0625rem] tracking-[-0.02em]">
        NSA <span className="text-white/55">Nexus</span>
      </span>
    </Link>
  );
}

const LINKS = [
  { label: "Platform", href: "/#platform" },
  { label: "How it works", href: "/#how" },
  { label: "Outcomes", href: "/#outcomes" },
  { label: "FAQ", href: "/#faq" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={
        stuck
          ? { backgroundColor: "oklch(0.205 0 0 / 0.74)", backdropFilter: "blur(14px)", boxShadow: "0 1px 0 oklch(1 0 0 / 0.07)" }
          : { boxShadow: "0 1px 0 oklch(1 0 0 / 0.05)" }
      }
    >
      <nav className="mx-auto flex h-16 max-w-[76rem] items-center justify-between px-5 sm:px-8">
        <Wordmark />

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="inline-flex min-h-10 items-center rounded-lg px-3 text-ui text-white/60 transition-colors duration-200 hover:text-bone"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/signup"
            className="hidden min-h-10 items-center rounded-lg px-3 text-ui text-white/60 transition-colors duration-200 hover:text-bone sm:inline-flex"
          >
            Sign in
          </Link>
          <Button to="/signup" className="!min-h-10 !px-4 text-caption sm:!px-5 sm:text-ui">
            Get started
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-lg text-white/70 transition-colors duration-200 hover:text-bone md:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className="absolute inset-x-0 top-1 h-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={open ? { transform: "translateY(6px) rotate(45deg)" } : undefined}
              />
              <span
                className="absolute inset-x-0 top-[13px] h-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={open ? { transform: "translateY(-6px) rotate(-45deg)" } : undefined}
              />
            </span>
          </button>
        </div>
      </nav>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(90deg, var(--color-ember-600), var(--color-ember-100))",
        }}
      />

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-white/[0.07] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto max-w-[76rem] px-5 py-3 sm:px-8">
              {LINKS.concat({ label: "Sign in", href: "/signup" }).map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="flex min-h-11 items-center text-lead text-white/70">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const FOOT = [
  {
    title: "Platform",
    items: ["QPA engine", "Negotiation workspace", "IDR case tracker", "Exposure modeling", "Reporting"],
  },
  { title: "Compliance", items: ["No Surprises Act", "Notice & consent", "Audit trail", "Data residency", "Security"] },
  { title: "Company", items: ["About", "Careers", "Contact", "Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-deep">
      <div className="lattice pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.07]" />
      <div className="relative mx-auto grid max-w-[76rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-[34ch] text-ui text-white/45" style={{ textWrap: "pretty" }}>
            Compliance and dispute infrastructure for payors operating under the No Surprises Act.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-caption text-white/50 ring-1 ring-white/[0.07] ring-inset">
            <Icon.lock size={14} />
            SOC 2 Type II · HIPAA
          </div>
        </div>
        {FOOT.map((col) => (
          <div key={col.title}>
            <p className="eyebrow">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-ui text-white/50 transition-colors duration-200 hover:text-bone"
                  >
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative mx-auto flex max-w-[76rem] flex-col gap-2 px-5 pb-10 text-caption text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} NSA Nexus, Inc.</p>
        <p>Not legal advice. Regulatory determinations remain the payor&rsquo;s responsibility.</p>
      </div>
    </footer>
  );
}
