export type Currency = "INR" | "USD" | "EUR";
export type Plan = "Starter" | "Growth" | "Enterprise";
export type Billing = "monthly" | "annual";

export const PLANS: Plan[] = ["Starter", "Growth", "Enterprise"];

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

/** Monthly base amounts per currency and plan. Enterprise is negotiated (null). */
const monthlyBase: Record<Currency, Record<Plan, number | null>> = {
  USD: { Starter: 0, Growth: 49, Enterprise: null },
  EUR: { Starter: 0, Growth: 45, Enterprise: null },
  INR: { Starter: 0, Growth: 3999, Enterprise: null },
};

function buildPricingMatrix(): Record<Currency, Record<Plan, Record<Billing, number | null>>> {
  const matrix = {} as Record<Currency, Record<Plan, Record<Billing, number | null>>>;

  for (const currency of CURRENCIES) {
    matrix[currency.code] = {} as Record<Plan, Record<Billing, number | null>>;
    for (const plan of PLANS) {
      const monthly = monthlyBase[currency.code][plan];
      matrix[currency.code][plan] = {
        monthly,
        annual: monthly === null ? null : monthly * 12 * 0.8,
      };
    }
  }

  return matrix;
}

/** Multidimensional pricing: pricing[currency][plan][billing] */
export const pricing = buildPricingMatrix();

const localeMap: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
};

export function formatPlanPrice(
  amount: number | null,
  currency: Currency,
  billing: Billing,
  plan: Plan,
): { display: string; sub: string } {
  if (amount === null) {
    return { display: "Custom", sub: "Volume pricing" };
  }

  const { symbol } = CURRENCIES.find(c => c.code === currency)!;
  const formatted = new Intl.NumberFormat(localeMap[currency], {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  if (plan === "Starter" && amount === 0) {
    return { display: `${symbol}${formatted}`, sub: "Forever free" };
  }

  if (billing === "monthly") {
    return { display: `${symbol}${formatted}`, sub: "per seat / month" };
  }

  return { display: `${symbol}${formatted}`, sub: "per seat / year" };
}

export const PLAN_META: Record<
  Plan,
  {
    blurb: string;
    features: string[];
    cta: string;
    featured: boolean;
  }
> = {
  Starter: {
    blurb: "For teams proving a first runbook in production.",
    features: ["3 active runbooks", "10 system connections", "Community support", "1,000 runs / month"],
    cta: "Start free",
    featured: false,
  },
  Growth: {
    blurb: "For organizations running automation at scale.",
    features: [
      "Unlimited runbooks",
      "Full connection catalog",
      "Delegated execution",
      "100K runs / month",
      "Priority support",
    ],
    cta: "Start trial",
    featured: true,
  },
  Enterprise: {
    blurb: "For regulated environments with bespoke requirements.",
    features: ["SAML SSO & SCIM", "Dedicated cluster", "Custom SLA", "Solutions engineer", "BYO-KMS"],
    cta: "Talk to sales",
    featured: false,
  },
};
