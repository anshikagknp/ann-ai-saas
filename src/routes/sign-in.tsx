import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="min-h-screen bg-bg text-light antialiased flex flex-col"
      style={{ fontFamily: "var(--font-sans, Inter, sans-serif)" }}
    >
      {/* ── Top bar ── */}
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
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
        <span className="font-mono text-[11px] text-mute">
          SOC 2 Type II &nbsp;·&nbsp; GDPR &nbsp;·&nbsp; HIPAA
        </span>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-bg shadow-btn mx-auto mb-5">
              <span className="font-mono text-base font-bold">A</span>
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Sign in to AnnAI</h1>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              Enterprise control plane for AI workflows.
            </p>
          </div>

          {/* SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-line-strong bg-card px-4 py-3 text-sm font-medium text-light shadow-card transition-surface hover:border-light/20 hover:bg-card/80 active:scale-[0.98]"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="#0073e6" />
              <circle cx="16" cy="16" r="7" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="3.5" fill="white" />
            </svg>
            Continue with Corporate SSO
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3" role="separator">
            <div className="flex-1 h-px bg-line" />
            <span className="font-mono text-[11px] text-mute">or sign in with email</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          {/* Email / Password form */}
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Sign in form"
          >
            <div>
              <label
                htmlFor="signin-email"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-mute"
              >
                Work email
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line-strong bg-card/50 px-3.5 py-2.5 text-sm text-light placeholder:text-mute focus:border-primary/50 focus:outline-none transition-surface"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signin-password"
                  className="font-mono text-[10px] uppercase tracking-wider text-mute"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="font-mono text-[11px] text-primary transition-surface hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line-strong bg-card/50 px-3.5 py-2.5 text-sm text-light placeholder:text-mute focus:border-primary/50 focus:outline-none transition-surface"
              />
            </div>

            {/* Submit — routes to console (simulated sign-in) */}
            <Link
              to="/console"
              className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-bg shadow-btn transition-surface hover:bg-secondary active:scale-[0.98]"
            >
              Continue →
            </Link>
          </form>

          {/* New account */}
          <p className="mt-6 text-center font-mono text-[11px] text-mute">
            Don't have an account?{" "}
            <Link to="/console" className="text-primary transition-surface hover:underline">
              Start free evaluation
            </Link>
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-[10px] text-mute border-t border-line pt-6">
            {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map((b) => (
              <span
                key={b}
                className="rounded border border-line bg-card/40 px-2 py-0.5 text-mute"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-line px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-mute">
          {["Privacy", "Terms", "Security", "Status", "Contact"].map((l) => (
            <a key={l} href="#" className="transition-surface hover:text-light">
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
