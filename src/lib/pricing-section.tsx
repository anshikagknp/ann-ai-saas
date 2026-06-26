import { memo, useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  pricing,
  PLANS,
  CURRENCIES,
  PLAN_META,
  formatPlanPrice,
  type Currency,
  type Billing,
  type Plan,
} from "@/lib/pricing-matrix";

const CheckIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}><path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

type PricingControlsProps = {
  currency: Currency;
  billing: Billing;
  onCurrencyChange: (currency: Currency) => void;
  onBillingChange: (billing: Billing) => void;
};

const PricingControls = memo(function PricingControls({
  currency,
  billing,
  onCurrencyChange,
  onBillingChange,
}: PricingControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div
        className="inline-flex rounded-full border border-line-strong bg-card/50 p-1 font-mono text-xs shadow-card"
        role="group"
        aria-label="Billing period"
      >
        <button
          type="button"
          aria-pressed={billing === "monthly"}
          className={`rounded-full px-4 py-2 transition-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            billing === "monthly" ? "bg-primary text-bg shadow-btn hover:bg-secondary" : "text-mute hover:text-light"
          }`}
          onClick={() => onBillingChange("monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={billing === "annual"}
          className={`rounded-full px-4 py-2 transition-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            billing === "annual" ? "bg-primary text-bg shadow-btn hover:bg-secondary" : "text-mute hover:text-light"
          }`}
          onClick={() => onBillingChange("annual")}
        >
          Annual <span className="text-primary">-20%</span>
        </button>
      </div>
      <label className="sr-only" htmlFor="pricing-currency">Currency</label>
      <select
        id="pricing-currency"
        value={currency}
        aria-label="Select currency"
        className="rounded-full border border-line-strong bg-card/50 px-4 py-2.5 font-mono text-xs text-light shadow-card outline-none transition-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onChange={e => onCurrencyChange(e.target.value as Currency)}
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code} className="bg-card text-light">
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
});

type PlanPriceProps = {
  plan: Plan;
  currency: Currency;
  billing: Billing;
};

const PlanPrice = memo(function PlanPrice({ plan, currency, billing }: PlanPriceProps) {
  const amount = pricing[currency][plan][billing];
  const { display, sub } = formatPlanPrice(amount, currency, billing, plan);

  return (
    <div className="mt-5 flex items-baseline gap-2">
      <span
        key={`${currency}-${billing}-${plan}`}
        className="animate-price-update text-4xl font-semibold tracking-tight md:text-5xl"
        aria-live="polite"
        aria-atomic="true"
      >
        {display}
      </span>
      <span className="text-sm text-mute">{sub}</span>
    </div>
  );
});

type PricingCardProps = {
  plan: Plan;
  currency: Currency;
  billing: Billing;
  cardInteractive: string;
};

const PricingCard = memo(function PricingCard({ plan, currency, billing, cardInteractive }: PricingCardProps) {
  const meta = PLAN_META[plan];
  const featured = meta.featured;

  return (
    <div
      className={`relative rounded-2xl border p-7 transition-surface-slow md:p-8 ${
        featured
          ? "border-primary/40 bg-card shadow-glow hover:border-primary/50"
          : `${cardInteractive} bg-card/70 hover:-translate-y-0.5`
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-bg">
          Most popular
        </span>
      )}
      <div className="font-mono text-xs uppercase tracking-wider text-mute">{plan}</div>
      <PlanPrice plan={plan} currency={currency} billing={billing} />
      <p className="mt-3 text-sm leading-relaxed text-mute">{meta.blurb}</p>
      <Link
        to="/console"
        className={`mt-7 block w-full rounded-full py-3 text-center text-sm font-semibold transition-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] ${
          featured
            ? "bg-primary text-bg shadow-btn hover:bg-secondary hover:shadow-btn-hover"
            : "border border-line-strong text-light hover:border-light/20 hover:bg-card"
        }`}
      >
        {meta.cta}
      </Link>
      <ul className="mt-8 space-y-3.5 text-sm">
        {meta.features.map(f => (
          <li key={f} className="flex items-center gap-2.5">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/15">
              <CheckIcon className="h-2.5 w-2.5 text-primary" />
            </span>
            <span className="text-light/90">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

type PricingSectionProps = {
  container: string;
  sectionY: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionLead: string;
  cardInteractive: string;
};

export function PricingSection({
  container,
  sectionY,
  sectionLabel,
  sectionTitle,
  sectionLead,
  cardInteractive,
}: PricingSectionProps) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [billing, setBilling] = useState<Billing>("monthly");

  const onCurrencyChange = useCallback((next: Currency) => setCurrency(next), []);
  const onBillingChange = useCallback((next: Billing) => setBilling(next), []);

  return (
    <section id="pricing" className={`border-t border-line ${sectionY}`}>
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-8 md:gap-10">
          <div className="max-w-xl">
            <span className={sectionLabel}>// Pricing</span>
            <h2 className={sectionTitle}>Pricing that scales with runs, not surprises.</h2>
            <p className={sectionLead}>Evaluate on Starter. Move to Growth when volume demands it. Enterprise when policy, residency, or SLAs require a dedicated footprint.</p>
          </div>
          <PricingControls
            currency={currency}
            billing={billing}
            onCurrencyChange={onCurrencyChange}
            onBillingChange={onBillingChange}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {PLANS.map(plan => (
            <PricingCard
              key={plan}
              plan={plan}
              currency={currency}
              billing={billing}
              cardInteractive={cardInteractive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
