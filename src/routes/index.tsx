import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BentoPlatform } from "@/lib/bento-features";
import { PricingSection } from "@/lib/pricing-section";

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ───────────────────────── tiny icon set (inline SVG, no libs) ─────────────────────── */
const Icon = {
  Logo: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11C18.88 4 20 5.12 20 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11Z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Arrow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Bolt: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  ),
  Shield: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  ),
  Graph: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Flow: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="5" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6"/><circle cx="19" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.6"/><path d="M7 7.5 11 16M17 7.5 13 16" stroke="currentColor" strokeWidth="1.6"/></svg>
  ),
  Plug: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M9 2v4M15 2v4M7 6h10v6a5 5 0 1 1-10 0V6ZM12 17v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  Sparkle: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  Minus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
};

/* ───────────────────────── shared surface styles ───────────────────────── */
const container = "mx-auto max-w-7xl px-6 sm:px-8";
const sectionY = "py-24 md:py-32";
const sectionLabel = "font-mono text-xs uppercase tracking-[0.2em] text-primary";
const sectionTitle = "mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.025em] md:mt-5 md:text-5xl";
const sectionLead = "mt-5 max-w-2xl text-base leading-relaxed text-mute md:mt-6 md:text-lg";
const btnPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-bg shadow-btn transition-surface hover:bg-secondary hover:shadow-btn-hover active:scale-[0.98]";
const btnPrimarySm =
  "group inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-bg shadow-btn transition-surface hover:bg-secondary hover:shadow-btn-hover active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-card/40 px-5 py-3 text-sm font-medium text-light backdrop-blur-sm transition-surface hover:border-light/20 hover:bg-card/70 hover:shadow-card active:scale-[0.98]";
const btnGhost =
  "inline-flex items-center justify-center rounded-full border border-line-strong px-5 py-3 text-sm font-medium text-light transition-surface hover:border-light/20 hover:bg-bg/40 active:scale-[0.98]";
const cardInteractive =
  "rounded-2xl border border-line-strong bg-card shadow-card transition-surface-slow hover:border-light/15 hover:shadow-card-hover";
const cardStatic = "rounded-2xl border border-line-strong bg-card shadow-card";

/* ───────────────────────────── Navbar ───────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-surface-slow ${
        scrolled ? "border-b border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150" : "bg-transparent"
      }`}
    >
      <div className={`${container} flex h-16 items-center justify-between md:h-[4.25rem]`}>
        <a href="#" className="flex items-center gap-2.5 transition-surface hover:opacity-90">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-bg shadow-btn">
            <Icon.Logo className="h-4 w-4" />
          </span>
          <span className="font-mono text-[15px] font-semibold tracking-tight">Ann<span className="text-primary">AI</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-mute md:flex">
          {["Product", "Solutions", "Pricing", "Customers"].map(l => (
            <Link key={l} to="/" hash={l.toLowerCase()} className="transition-surface hover:text-light">{l}</Link>
          ))}
          <Link to="/docs" className="transition-surface hover:text-light">Docs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/sign-in" className="hidden text-sm text-mute transition-surface hover:text-light md:inline">Sign in</Link>
          <Link to="/console" className={btnPrimarySm}>
            Start free
            <Icon.Arrow className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-28 md:pt-40 md:pb-32">
      {/* ambient grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className={`relative ${container}`}>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-line-strong bg-card/50 px-3.5 py-1.5 text-xs text-mute shadow-card backdrop-blur-sm md:mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono">Release 4.2 — Policy-aware runbooks</span>
            <Icon.Arrow className="h-3 w-3 opacity-70" />
          </div>
          <h1 className="text-balance text-[2.75rem] font-semibold sm:text-5xl md:text-7xl">
            The control plane<br />
            <span className="text-mute">for</span> <span className="text-primary">critical work</span>.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-mute md:mt-8 md:text-lg">
            AnnAI is where enterprises design workflows, route data, and delegate repeatable decisions — with governance, lineage, and rollback built into every run.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-10">
            <Link to="/console" className={btnPrimary}>
              Begin evaluation <Icon.Arrow className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
            <Link to="/console" className={btnSecondary}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-light/10"><svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-light"><path d="M8 5v14l11-7z"/></svg></span>
              Platform tour
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs tracking-wide text-mute md:mt-7">No credit card · 14-day evaluation · SOC 2 Type II</p>
        </div>

        <DashboardMock />
      </div>
    </section>
  );
}

/* ───────────────────────── Dashboard mock ───────────────────────── */
function DashboardMock() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl md:mt-24">
      <div className="absolute -inset-x-6 -top-8 -bottom-8 rounded-[2rem] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent blur-2xl md:-inset-x-10 md:-top-10 md:-bottom-10" />
      <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${cardStatic}`}>
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-soft/30" />
          </div>
          <div className="hidden font-mono text-[11px] text-mute md:block">app.annai.io/runbooks/vendor-onboarding</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-mute">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> live</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-px bg-line">
          {/* sidebar */}
          <aside className="col-span-2 hidden bg-card p-4 md:block">
            <div className="font-mono text-[10px] uppercase tracking-wider text-mute">Workspace</div>
            <ul className="mt-3 space-y-1 text-sm">
              {["Runbooks", "Sources", "Policies", "Destinations", "Alerts"].map((t, i) => (
                <li key={t} className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-surface ${i === 0 ? "bg-light/5 text-light" : "text-mute hover:bg-light/5 hover:text-light"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-mute/40"}`} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 font-mono text-[10px] uppercase tracking-wider text-mute">Recent</div>
            <ul className="mt-3 space-y-1.5 text-xs text-mute">
              <li>· ledger-sync</li>
              <li>· crm-handoff</li>
              <li>· events-normalize</li>
            </ul>
          </aside>

          {/* main */}
          <main className="col-span-12 bg-card p-5 sm:p-6 md:col-span-7">
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-[11px] text-mute">RUNBOOK</div>
                <h3 className="mt-1 text-lg text-light">vendor_onboarding → erp_publish</h3>
              </div>
              <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-[11px] text-primary">+ 12.4%</span>
            </div>

            {/* chart */}
            <div className="mt-6 h-44 rounded-lg border border-line bg-bg/40 p-4">
              <div className="flex h-full items-end gap-2">
                {[40, 62, 48, 70, 55, 80, 66, 90, 74, 95, 82, 100, 88, 96].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-sm ${i % 3 === 0 ? "bg-primary" : i % 5 === 0 ? "bg-secondary" : "bg-light/15"} animate-pulse-bar`}
                      style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* table */}
            <div className="mt-6 overflow-hidden rounded-lg border border-line">
              <div className="grid grid-cols-4 border-b border-line bg-bg/30 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-mute">
                <span>Step</span><span>Runtime</span><span>Rows</span><span>Status</span>
              </div>
              {[
                ["ingest.ledger", "1.2s", "184,201", "ok"],
                ["validate.policy", "0.8s", "184,201", "ok"],
                ["route.approval", "2.4s", "183,994", "ok"],
                ["publish.warehouse", "0.6s", "183,994", "ok"],
              ].map(([a, b, c, d]) => (
                <div key={a} className="grid grid-cols-4 items-center px-4 py-2.5 text-xs text-light/90 transition-surface odd:bg-bg/10 hover:bg-bg/20">
                  <span className="font-mono text-light">{a}</span>
                  <span className="font-mono text-mute">{b}</span>
                  <span className="font-mono text-mute">{c}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{d}</span>
                </div>
              ))}
            </div>
          </main>

          {/* right panel */}
          <aside className="col-span-12 bg-card p-5 sm:p-6 md:col-span-3">
            <div className="rounded-xl border border-line bg-bg/40 p-4 shadow-card">
              <div className="flex items-center gap-2 font-mono text-[11px] text-mute"><Icon.Sparkle className="h-3.5 w-3.5 text-primary" /> RUNBOOK ADVISOR</div>
              <p className="mt-3 text-sm leading-relaxed text-light">
                A policy breach was flagged: <span className="text-primary">18 records</span> missing required approval metadata.
              </p>
              <button className="mt-4 w-full rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-bg shadow-btn transition-surface hover:bg-secondary hover:shadow-btn-hover active:scale-[0.98]">Review and reroute</button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {[
                ["Runs / hr", "12.4k", "bg-primary"],
                ["Policy exceptions", "0.02%", "bg-secondary"],
                ["Hours reclaimed", "640", "bg-soft"],
              ].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between rounded-md border border-line bg-bg/30 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-mute"><span className={`h-1.5 w-1.5 rounded-full ${c}`} /> {k}</span>
                  <span className="font-mono text-light">{v}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Logos ───────────────────────── */
function Logos() {
  const logos = ["Meridian Axis", "Kestrel Systems", "Northgate Atlas", "Helix Foundry", "Vantrell", "Crestline Group", "Bolivar & Co", "Ardent Works", "Pillar Nine", "Slate Meridian"];
  return (
    <section className="border-y border-line bg-bg py-16 md:py-20">
      <div className={container}>
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-mute">
          Selected by teams running mission-critical operations worldwide
        </p>
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] md:mt-12">
          <div className="flex w-max animate-ticker gap-12 md:gap-16">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="whitespace-nowrap font-mono text-xl font-medium text-light/35 transition-surface hover:text-light/75 md:text-2xl">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Console Bridge ───────────────────────── */
function ConsoleBridge() {
  return (
    <section className="border-y border-line bg-bg py-14 md:py-16">
      <div className={`${container} flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left`}>
        <div>
          <span className={sectionLabel}>// Live console</span>
          <p className="mt-2 text-lg font-semibold text-light tracking-tight md:text-xl">
            Experience the complete AI Control Plane
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-mute max-w-md">
            Workflow builder · Risk heatmap · AI assistant · Execution timeline — all interactive.
          </p>
        </div>
        <Link to="/console" className={btnPrimary}>
          Open Console <Icon.Arrow className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

/* ───────────────────────── Bento ───────────────────────── */
function Bento() {
  return (
    <BentoPlatform
      container={container}
      sectionY={sectionY}
      sectionLabel={sectionLabel}
      sectionTitle={sectionTitle}
      sectionLead={sectionLead}
      cardInteractive={cardInteractive}
    />
  );
}

/* ───────────────────────── Pricing ───────────────────────── */
function Pricing() {
  return (
    <PricingSection
      container={container}
      sectionY={sectionY}
      sectionLabel={sectionLabel}
      sectionTitle={sectionTitle}
      sectionLead={sectionLead}
      cardInteractive={cardInteractive}
    />
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */
function Testimonials() {
  const items = [
    { q: "We retired four internal tools the quarter we moved to AnnAI. Onboarding runbooks went live in eleven days.", a: "Elena Vasquez", r: "VP of Platform, Meridian Axis" },
    { q: "Policy exceptions surface before they become incidents. That alone changed how our ops team sleeps.", a: "James Okonkwo", r: "Director of IT, Kestrel Systems" },
    { q: "One hundred forty runbooks migrated over a long weekend. Rollback was never needed.", a: "Priya Menon", r: "Chief Digital Officer, Northgate Atlas" },
    { q: "Versioned runbooks, immutable logs, delegated execution — finally one system our auditors actually like.", a: "Marcus Webb", r: "Head of Infrastructure, Helix Foundry" },
  ];
  return (
    <section id="customers" className={`border-t border-line ${sectionY}`}>
      <div className={container}>
        <div className="max-w-2xl">
          <span className={sectionLabel}>// Customers</span>
          <h2 className={sectionTitle}>Proof from the teams<br/>who run on AnnAI.</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {items.map((it, i) => (
            <figure
              key={i}
              className={`flex flex-col justify-between p-6 md:p-7 ${cardInteractive} ${
                i === 1 ? "lg:translate-y-4" : ""
              } ${i === 2 ? "lg:-translate-y-4" : ""}`}
            >
              <blockquote className="text-[15px] leading-relaxed text-light/95">"{it.q}"</blockquote>
              <figcaption className="mt-7 flex items-center gap-3 md:mt-8">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                  {it.a.split(" ").map(s => s[0]).join("")}
                </span>
                <div>
                  <div className="text-sm text-light">{it.a}</div>
                  <div className="font-mono text-[11px] text-mute">{it.r}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */
function FAQ() {
  const items = [
    ["What does AnnAI replace in a typical stack?", "Point tools for scheduling, hand-rolled scripts, ad hoc data movement, and exception handling. AnnAI gives you one control plane with shared policy, lineage, and rollback."],
    ["Can we keep data inside our perimeter?", "Yes. AnnAI deploys to your cloud or ours. Connections are outbound-only where required, and raw payloads are not retained beyond your retention policy."],
    ["How does delegated execution work?", "Runbook steps can assign decisions to named roles or automated handlers. Every action is logged, reversible, and subject to the approval rules you define."],
    ["Is there a no-cost starting point?", "Starter remains free with three active runbooks and 1,000 runs per month. No payment method required to begin."],
    ["Which compliance frameworks do you support?", "SOC 2 Type II, HIPAA, and GDPR out of the box. Enterprise adds BYO-KMS, private networking, custom DPAs, and regional residency options."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className={`border-t border-line ${sectionY}`}>
      <div className={`${container} grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-16`}>
        <div className="md:col-span-5">
          <span className={sectionLabel}>// FAQ</span>
          <h2 className={sectionTitle}>Questions, answered.</h2>
          <p className={`${sectionLead} max-w-none`}>Can't find what you're looking for? <a href="#" className="text-primary underline-offset-4 transition-surface hover:underline">Talk to our team</a>.</p>
        </div>
        <div className="md:col-span-7">
          <div className={`divide-y divide-line overflow-hidden ${cardStatic} bg-card/50`}>
            {items.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <button
                  key={q}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="block w-full px-5 py-5 text-left transition-surface hover:bg-card/60 sm:px-6 sm:py-6"
                >
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-[15px] leading-snug text-light">{q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong transition-surface ${isOpen ? "border-primary/30 bg-primary text-bg shadow-btn" : "text-mute hover:border-light/20 hover:bg-bg/40"}`}>
                      {isOpen ? <Icon.Minus className="h-3.5 w-3.5" /> : <Icon.Plus className="h-3.5 w-3.5" />}
                    </span>
                  </div>
                  <div
                    className="grid overflow-hidden text-sm leading-relaxed text-mute transition-[grid-template-rows,margin-top] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", marginTop: isOpen ? "0.875rem" : 0 }}
                  >
                    <div className="min-h-0 pr-12">{a}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA + Footer ───────────────────────── */
function CTA() {
  return (
    <section className="px-6 py-20 sm:px-8 md:py-28">
      <div className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-line-strong bg-card p-10 shadow-glow md:p-16 lg:p-20`}>
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.025em] md:text-6xl">Put your first<br/>runbook in motion.</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mute md:mt-7">14-day evaluation. No credit card. Cancel anytime. Most teams reach a working runbook in under an hour.</p>
          <div className="mt-9 flex flex-wrap gap-3 md:mt-10">
            <Link to="/console" className={btnPrimary}>
              Begin evaluation <Icon.Arrow className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </Link>
            <a href="#" className={btnGhost}>Schedule a briefing</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ["Product", ["Features", "Integrations", "Pricing", "Changelog", "Roadmap"]],
    ["Company", ["About", "Customers", "Careers", "Press", "Contact"]],
    ["Resources", ["Docs", "Guides", "API reference", "Community", "Status"]],
    ["Legal", ["Privacy", "Terms", "Security", "DPA", "Cookies"]],
  ] as const;
  return (
    <footer className="border-t border-line">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-12 md:gap-10 md:py-20 lg:gap-12`}>
        <div className="md:col-span-4">
          <a href="#" className="flex items-center gap-2.5 transition-surface hover:opacity-90">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-bg shadow-btn">
              <Icon.Logo className="h-4 w-4" />
            </span>
            <span className="font-mono text-[15px] font-semibold">Ann<span className="text-primary">AI</span></span>
          </a>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">The enterprise control plane for workflows, data movement, and delegated execution.</p>
          <div className="mt-7 flex gap-2.5">
            {["X", "Gh", "In"].map(s => (
              <a key={s} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-line-strong font-mono text-xs text-mute transition-surface hover:border-light/20 hover:bg-card hover:text-light">{s}</a>
            ))}
          </div>
        </div>
        {cols.map(([title, links]) => (
          <div key={title} className="md:col-span-2">
            <div className="font-mono text-xs uppercase tracking-wider text-mute">{title}</div>
            <ul className="mt-5 space-y-3 text-sm">
              {links.map(l => (
                <li key={l}><a href="#" className="text-light/80 transition-surface hover:text-primary">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className={`${container} flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-xs text-mute md:py-7`}>
          <span>© 2026 AnnAI Labs, Inc. All rights reserved.</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */
function Landing() {
  return (
    <div className="min-h-screen bg-bg text-light antialiased">
      <Nav />
      <main>
        <Hero />
        <Logos />
        <span id="solutions" />
        <ConsoleBridge />
        <span id="product" />
        <Bento />
        <span id="pricing" />
        <Pricing />
        <Testimonials />
        <span id="docs" />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
