import { useCallback, useRef, useState, type KeyboardEvent } from "react";


const Icon = {
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
  Plus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  Minus: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
};

export type BentoFeatureId =
  | "intent-to-runbook"
  | "deterministic-routing"
  | "governance"
  | "connected-estate"
  | "composable-flows"
  | "operational-visibility";

export const BENTO_FEATURES: {
  id: BentoFeatureId;
  gridClass: string;
  accordionTitle: string;
}[] = [
  { id: "intent-to-runbook", gridClass: "col-span-12 row-span-2 md:col-span-7", accordionTitle: "Intent-to-runbook" },
  { id: "deterministic-routing", gridClass: "col-span-12 md:col-span-5", accordionTitle: "Deterministic routing" },
  { id: "governance", gridClass: "col-span-12 md:col-span-5", accordionTitle: "Governance by default" },
  { id: "connected-estate", gridClass: "col-span-12 md:col-span-4", accordionTitle: "Your connected estate" },
  { id: "composable-flows", gridClass: "col-span-12 md:col-span-4", accordionTitle: "Composable flows" },
  { id: "operational-visibility", gridClass: "col-span-12 md:col-span-4", accordionTitle: "Operational visibility" },
];

export function BentoFeatureBody({ id }: { id: BentoFeatureId }) {
  switch (id) {
    case "intent-to-runbook":
      return (
        <>
          <div className="flex items-center gap-2 font-mono text-xs text-primary"><Icon.Sparkle className="h-3.5 w-3.5" /> INTENT-TO-RUNBOOK</div>
          <h3 className="mt-4 text-xl font-semibold leading-snug md:text-2xl">Define the outcome.<br/>AnnAI drafts the runbook.</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mute md:mt-4">Describe what should happen in plain language. AnnAI produces a versioned runbook, simulates edge cases, and routes it through your approval chain.</p>
          <div className="mt-7 overflow-hidden rounded-xl border border-line bg-bg/60 font-mono text-[13px] shadow-card md:mt-8">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-mute">
              <span className="h-2 w-2 rounded-full bg-primary" /> vendor_approval.runbook
            </div>
            <pre className="overflow-x-auto p-4 leading-relaxed text-light">
<span className="text-mute"># Route high-value invoices for dual approval</span>{"\n"}
<span className="text-secondary">when</span> invoice.total <span className="text-primary">&gt;</span> <span className="text-primary">50000</span>{"\n"}
{"  "}<span className="text-secondary">require</span> approval <span className="text-secondary">from</span> finance_controller{"\n"}
{"  "}<span className="text-secondary">then</span> publish <span className="text-secondary">to</span> erp.settlement{"\n"}
<span className="text-secondary">else</span>{"\n"}
{"  "}<span className="text-secondary">publish</span> <span className="text-secondary">to</span> erp.auto_settle
            </pre>
          </div>
        </>
      );
    case "deterministic-routing":
      return (
        <>
          <Icon.Bolt className="h-6 w-6 text-primary" />
          <h3 className="mt-5 text-xl font-semibold">Deterministic routing</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mute">Events traverse your estate with predictable latency and explicit handoffs — no silent retries, no orphaned jobs.</p>
          <div className="mt-6 flex items-end gap-1">
            {[30, 45, 38, 60, 52, 75, 48, 82, 65, 90, 70, 100].map((h, i) => (
              <div key={i} className="w-2.5 rounded-sm bg-primary/70 animate-pulse-bar" style={{ height: `${h * 0.7}px`, animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </>
      );
    case "governance":
      return (
        <>
          <Icon.Shield className="h-6 w-6 text-secondary" />
          <h3 className="mt-5 text-xl font-semibold">Governance by default</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mute">SOC 2 Type II, HIPAA, GDPR. Customer-managed keys, private networking, and immutable audit logs on every state change.</p>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">
            {["SOC 2", "HIPAA", "GDPR", "ISO 27001", "BYO-KMS"].map(b => (
              <span key={b} className="rounded-md border border-line bg-bg/40 px-2.5 py-1 text-mute transition-surface hover:border-light/15 hover:bg-bg/55">{b}</span>
            ))}
          </div>
        </>
      );
    case "connected-estate":
      return (
        <>
          <Icon.Plug className="h-6 w-6 text-primary" />
          <h3 className="mt-5 text-xl font-semibold">Your connected estate</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mute">ERP, CRM, identity, messaging, and warehouse endpoints — provisioned once, governed centrally.</p>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-lg border border-line bg-bg/40 font-mono text-[10px] text-mute transition-surface hover:border-light/15 hover:bg-bg/55">
                {["ERP","CRM","IAM","WH","MSG","DOC","API","BI"][i]}
              </div>
            ))}
          </div>
        </>
      );
    case "composable-flows":
      return (
        <>
          <Icon.Flow className="h-6 w-6 text-secondary" />
          <h3 className="mt-5 text-xl font-semibold">Composable flows</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mute">Branch, merge, and version every path. Diff runbooks like code and roll back without touching production data.</p>
          <div className="relative mt-6 h-24">
            <span className="absolute left-0 top-2 rounded-md border border-line bg-bg/60 px-2 py-1 font-mono text-[10px]">source</span>
            <span className="absolute left-1/2 top-8 -translate-x-1/2 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary">transform</span>
            <span className="absolute right-0 top-2 rounded-md border border-line bg-bg/60 px-2 py-1 font-mono text-[10px]">load</span>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 100" fill="none">
              <path d="M40 20 Q 100 80 150 60 T 260 20" stroke="var(--color-primary)" strokeOpacity="0.5" strokeDasharray="3 3" strokeWidth="1.2"/>
            </svg>
          </div>
        </>
      );
    case "operational-visibility":
      return (
        <>
          <Icon.Graph className="h-6 w-6 text-primary" />
          <h3 className="mt-5 text-xl font-semibold">Operational visibility</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-mute">Lineage, drift detection, and run health in one pane — so incidents surface before downstream teams notice.</p>
          <div className="mt-6 space-y-2.5">
            {[["Run health","99.1%"],["Lineage","verified"],["Open exceptions","3"]].map(([k,v]) => (
              <div key={k} className="flex items-center justify-between rounded-md border border-line bg-bg/40 px-3 py-2.5 text-xs transition-surface hover:border-light/10 hover:bg-bg/55">
                <span className="text-mute">{k}</span><span className="font-mono text-light">{v}</span>
              </div>
            ))}
          </div>
        </>
      );
  }
}

type BentoPlatformProps = {
  container: string;
  sectionY: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionLead: string;
  cardInteractive: string;
};

export function BentoPlatform({
  container,
  sectionY,
  sectionLabel,
  sectionTitle,
  sectionLead,
  cardInteractive,
}: BentoPlatformProps) {
  const [activeId, setActiveId] = useState<BentoFeatureId | null>("intent-to-runbook");
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = useCallback((id: BentoFeatureId) => {
    setActiveId(id);
  }, []);

  const toggleAccordion = useCallback((id: BentoFeatureId) => {
    setActiveId(prev => (prev === id ? null : id));
  }, []);

  const onAccordionKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLButtonElement>) => {
    const last = BENTO_FEATURES.length - 1;
    let next = index;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      next = index < last ? index + 1 : 0;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      next = index > 0 ? index - 1 : last;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = last;
    } else {
      return;
    }
    headerRefs.current[next]?.focus();
  }, []);

  return (
    <section id="product" className={sectionY}>
      <div className={container}>
        <div className="max-w-2xl">
          <span className={sectionLabel}>// Platform</span>
          <h2 className={sectionTitle}>One surface.<br/>Every operational motion.</h2>
          <p className={sectionLead}>AnnAI consolidates workflow design, data movement, and delegated execution — without the patchwork of scripts, queues, and one-off integrations.</p>
        </div>

        {/* Desktop bento grid */}
        <div
          className="mt-12 hidden grid-cols-2 gap-4 md:grid md:mt-16 md:gap-5 lg:grid-cols-3"
          role="list"
          aria-label="Platform features"
        >
          {BENTO_FEATURES.map(feature => {
            const isActive = activeId === feature.id;
            return (
              <div
                key={feature.id}
                role="listitem"
                className="flex"
              >
                <div
                  className={`h-full flex flex-col overflow-hidden p-7 md:p-8 ${cardInteractive} outline-none transition-surface-slow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive ? "border-primary/45 bg-primary/[0.03] scale-[1.015] ring-2 ring-primary/20 shadow-glow" : "scale-100"
                  }`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`${feature.accordionTitle} feature`}
                  onClick={() => activate(feature.id)}
                  onFocus={() => activate(feature.id)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activate(feature.id);
                    }
                  }}
                >
                  <BentoFeatureBody id={feature.id} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile accordion */}
        <div
          className="mt-12 space-y-3 md:hidden"
          role="region"
          aria-label="Platform features accordion"
        >
          {BENTO_FEATURES.map((feature, index) => {
            const isOpen = activeId === feature.id;
            const panelId = `bento-panel-${feature.id}`;
            const headerId = `bento-header-${feature.id}`;
            return (
              <div key={feature.id} className="overflow-hidden rounded-2xl border border-line-strong bg-card shadow-card">
                <button
                  ref={el => { headerRefs.current[index] = el; }}
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left outline-none transition-surface hover:bg-card/80 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                  onClick={() => toggleAccordion(feature.id)}
                  onKeyDown={e => onAccordionKeyDown(index, e)}
                >
                  <span className="font-mono text-sm text-light">{feature.accordionTitle}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong transition-surface ${
                      isOpen ? "border-primary/30 bg-primary text-bg shadow-btn" : "text-mute"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Icon.Minus className="h-3.5 w-3.5" /> : <Icon.Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  aria-hidden={!isOpen}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-line px-5 pb-5 pt-4">
                      <BentoFeatureBody id={feature.id} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
