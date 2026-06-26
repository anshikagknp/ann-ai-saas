import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const categories = [
  {
    title: "Getting Started",
    desc: "Set up your workspace, connect your first source, and deploy a runbook in under an hour.",
    icon: "▹",
    count: 8,
  },
  {
    title: "Workflow Builder",
    desc: "Design, version, and publish AI runbooks with the visual canvas or YAML API.",
    icon: "⌥",
    count: 14,
  },
  {
    title: "Risk & Governance",
    desc: "Configure compliance policies, audit trails, dual-control approvals and rollback.",
    icon: "⊕",
    count: 11,
  },
  {
    title: "AI Nodes",
    desc: "Integrate Gemini and OpenAI steps with prompt templates, output schemas, and confidence thresholds.",
    icon: "✦",
    count: 9,
  },
  {
    title: "Integrations",
    desc: "Connect ERP, CRM, identity, messaging, and data warehouse endpoints centrally.",
    icon: "⇄",
    count: 23,
  },
  {
    title: "API Reference",
    desc: "Full REST and WebSocket API — runbooks, sources, policies, executions, and webhooks.",
    icon: "{ }",
    count: 47,
  },
];

const recentArticles = [
  ["Workflow execution timeline", "How execution logs are structured and how to query them via API.", "2 days ago"],
  ["Risk heatmap configuration", "Customize accuracy, compliance, security and cost/latency thresholds per node.", "5 days ago"],
  ["NL → Workflow generator", "Generate runbook steps from plain-language descriptions with the AI generator.", "1 week ago"],
  ["Gemini prompt templates", "Reference guide for all supported prompt variables, schemas and output formats.", "2 weeks ago"],
];

function DocsPage() {
  return (
    <div
      className="min-h-screen bg-bg text-light antialiased"
      style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              aria-label="Back to home"
              className="flex items-center gap-2 transition-surface hover:opacity-90"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-bg shadow-btn">
                <span className="font-mono text-[11px] font-bold">A</span>
              </span>
              <span className="font-mono text-[14px] font-semibold">
                Ann<span className="text-primary">AI</span>
              </span>
            </Link>
            <span className="text-line hidden sm:inline opacity-30">/</span>
            <span className="hidden sm:inline font-mono text-sm text-mute">Docs</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search 112 articles…"
              aria-label="Search documentation"
              className="hidden sm:block w-52 rounded-lg border border-line-strong bg-card/50 px-3 py-1.5 font-mono text-sm text-light placeholder:text-mute focus:border-primary/40 focus:outline-none transition-surface"
            />
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-mono text-xs font-semibold text-bg shadow-btn transition-surface hover:bg-secondary"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            // Documentation
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.025em] md:text-5xl">
            AnnAI Documentation
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-mute">
            Everything you need to design, deploy, and govern enterprise AI workflows at scale.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <input
              type="search"
              placeholder="Search 112 articles…"
              aria-label="Search documentation hero"
              className="w-full rounded-xl border border-line-strong bg-card/60 px-4 py-3 font-mono text-sm text-light placeholder:text-mute focus:border-primary/40 focus:outline-none shadow-card transition-surface sm:hidden"
            />
          </div>
        </div>
      </section>

      {/* ── Categories grid ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {categories.map((cat) => (
              <a
                key={cat.title}
                href="#"
                className="group flex flex-col gap-4 rounded-2xl border border-line-strong bg-card p-6 shadow-card transition-surface hover:border-light/15 hover:shadow-card-hover md:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xl text-primary select-none">{cat.icon}</span>
                  <span className="font-mono text-[10px] text-mute rounded-md border border-line px-2 py-0.5">
                    {cat.count} articles
                  </span>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-light transition-surface group-hover:text-primary">
                    {cat.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{cat.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent updates ── */}
      <section className="border-t border-line py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mb-5">
            Recent updates
          </div>
          <div className="overflow-hidden rounded-xl border border-line-strong divide-y divide-line">
            {recentArticles.map(([title, desc, date]) => (
              <a
                key={title}
                href="#"
                className="group flex items-start justify-between gap-6 bg-card px-5 py-4 transition-surface hover:bg-card/60"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-light transition-surface group-hover:text-primary truncate">
                    {title}
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-mute line-clamp-2">{desc}</div>
                </div>
                <span className="font-mono text-[10px] text-mute shrink-0 mt-0.5">{date}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-line py-7">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-mute">
          <span>© 2026 AnnAI Labs, Inc.</span>
          <div className="flex flex-wrap gap-5">
            {["Privacy", "Terms", "Security", "Status"].map((l) => (
              <a key={l} href="#" className="transition-surface hover:text-light">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
