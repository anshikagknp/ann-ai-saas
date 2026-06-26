import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Send,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Terminal,
  Activity,
  Database,
  ArrowLeft,
  FileText,
  Share2,
  Github,
  BookOpen,
  Download,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/console")({
  component: ConsolePage,
});

/* ─── Types ─── */
type StepType = "ingestion" | "policy" | "ai" | "approval" | "db" | "notification";
type RiskLevel = "low" | "medium" | "high";
type StepStatus = "idle" | "running" | "ok" | "warning" | "error";

interface ComplianceCheck {
  name: string;
  status: "pass" | "fail" | "warning";
}

interface RiskDetail {
  reason: string;
  fix: string;
}

interface Step {
  id: string;
  name: string;
  type: StepType;
  description: string;
  status: StepStatus;
  prompt?: string;
  model?: string;
  confidence?: number;
  cost?: number;
  tokens?: number;
  latency?: number;
  rationale?: string;
  complianceChecks?: ComplianceCheck[];
  risks: {
    accuracy: RiskLevel;
    compliance: RiskLevel;
    security: RiskLevel;
    costLatency: RiskLevel;
  };
  riskDetails?: {
    accuracy?: RiskDetail;
    compliance?: RiskDetail;
    security?: RiskDetail;
    costLatency?: RiskDetail;
  };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: Step[];
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  time: string;
}

interface TimelineEntry {
  time: string;
  label: string;
  status: "ok" | "warning" | "running" | "pending";
}

/* ─── Initial data ─── */
const VENDOR_INVOICE_WORKFLOW: Workflow = {
  id: "vendor_invoice",
  name: "vendor_invoice_processing",
  description: "Enterprise vendor invoice extraction, risk scoring, and ERP settlement.",
  steps: [
    {
      id: "extract_invoice",
      name: "extract.invoice_ocr",
      type: "ingestion",
      description: "Extract structured fields from raw PDF invoices via OCR pipeline.",
      status: "ok",
      rationale:
        "Ingested 47 vendor invoices from erp.inbox. OCR confidence averaged 98.4%. Schema validated against ERP v3.1 spec. All mandatory fields present: vendor_id, line_items, tax_ids, bank_coordinates.",
      complianceChecks: [
        { name: "Schema validation", status: "pass" },
        { name: "Signature integrity", status: "pass" },
        { name: "Source authentication", status: "pass" },
      ],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
    },
    {
      id: "pii_detection",
      name: "validate.pii_shield",
      type: "policy",
      description: "Detect and mask PII fields: Tax IDs, bank routing numbers, and contact data.",
      status: "ok",
      rationale:
        "Policy engine scanned 47 invoice payloads. Identified and hashed 18 Tax IDs, 12 bank routing numbers, and 34 contact name fields using SHA-256. GDPR Article 25 data minimisation applied.",
      complianceChecks: [
        { name: "PII masking (GDPR Art.25)", status: "pass" },
        { name: "Data governance rules", status: "pass" },
        { name: "Retention policy check", status: "warning" },
      ],
      risks: { accuracy: "low", compliance: "medium", security: "low", costLatency: "low" },
      riskDetails: {
        compliance: {
          reason: "Custom address lines may contain vendor owner names not covered by standard NER patterns.",
          fix: "Apply Named Entity Recognition (NER) to freeform address fields before policy engine runs.",
        },
      },
    },
    {
      id: "ai_risk_analysis",
      name: "ai.risk_score_gemini",
      type: "ai",
      description: "Gemini-powered anomaly detection on billing frequency and invoice totals.",
      status: "warning",
      prompt:
        "You are a financial compliance AI. Analyze billing history: {{vendor.history}} and invoice total: {{invoice.total}}. Flag statistical anomalies, duplicate line items, or pricing discrepancies. Return structured JSON with risk_score (0–100), flags[], and recommended_action.",
      model: "Gemini 1.5 Flash",
      confidence: 91,
      cost: 0.0024,
      tokens: 1450,
      latency: 480,
      rationale:
        "AI flagged invoice #INV-52400: total ($52,400) is 1.47× the vendor's 90-day median ($35,600). Risk score: 74/100. Two duplicate line items detected: 'Consulting Services Q2' appears twice at $8,200 each. Recommended action: ESCALATE_TO_APPROVAL.",
      complianceChecks: [
        { name: "Prompt injection shield", status: "pass" },
        { name: "Output schema validation", status: "warning" },
        { name: "Model output toxicity filter", status: "pass" },
      ],
      risks: { accuracy: "medium", compliance: "low", security: "medium", costLatency: "medium" },
      riskDetails: {
        accuracy: {
          reason: "4.2% false-positive rate on seasonal billing spikes — Q4 vendors routinely invoice higher amounts.",
          fix: "Inject seasonal_baseline parameter from the data warehouse or switch to Gemini 1.5 Pro for improved context window.",
        },
        security: {
          reason: "Freeform invoice description fields can be crafted to leak system prompt context via injection.",
          fix: "Sanitize all user-supplied text fields with allowlist filtering before prompt assembly.",
        },
      },
    },
    {
      id: "approval_chain",
      name: "route.approval_chain",
      type: "approval",
      description: "Dual-control approval gate for invoices above $50,000 or risk score > 70.",
      status: "ok",
      rationale:
        "Two conditions triggered: invoice.total ($52,400) > $50,000 AND AI risk_score (74) > 70. Escalation dispatched to finance-controller@company.com and CFO delegate. Approval token expires in 4 hours. SLA: 99.2% resolved within window.",
      complianceChecks: [
        { name: "Dual-control rule", status: "pass" },
        { name: "Audit trail logged", status: "pass" },
        { name: "SOX compliance check", status: "pass" },
      ],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "high" },
      riskDetails: {
        costLatency: {
          reason: "Human approval step has a median wait time of 4.5 hours — blocking downstream ERP sync.",
          fix: "Enable auto-escalation to Finance VP after 2-hour SLA breach. Send SMS notifications in addition to email.",
        },
      },
    },
    {
      id: "erp_sync",
      name: "publish.erp_ledger",
      type: "db",
      description: "Commit approved invoice records to the ERP settlement ledger.",
      status: "ok",
      rationale:
        "Committed invoice #INV-52400 to erp.settlements. Transaction receipt: tx_910238120. Idempotency key validated — no duplicate writes. ERP sync confirmed via webhook response 200 OK at 14:23:07 UTC.",
      complianceChecks: [
        { name: "Write authorization", status: "pass" },
        { name: "Idempotency verified", status: "pass" },
      ],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
    },
  ],
};

const CRM_WORKFLOW: Workflow = {
  id: "crm_handoff",
  name: "crm_salesforce → slack_alert",
  description: "Listens for closed-won CRM opportunities and routes onboarding briefs to post-sale team.",
  steps: [
    {
      id: "poll_sf",
      name: "ingest.salesforce_won",
      type: "ingestion",
      description: "Poll CRM Opportunity webhook for 'Closed-Won' events.",
      status: "ok",
      rationale: "Fetched 1 new Closed-Won contract event. Customer: Northgate Atlas. ACV: $240,000/yr.",
      complianceChecks: [{ name: "OAuth token verify", status: "pass" }],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
    },
    {
      id: "summarize_transcript",
      name: "ai.summarize_call_brief",
      type: "ai",
      description: "Extract key customer concerns and deliverables from call transcripts.",
      status: "ok",
      prompt:
        "Read sales call transcripts: {{calls.transcript}}. Extract: key_concerns[], requested_features[], timeline, integration_requirements. Return structured JSON for onboarding team handoff.",
      model: "Gemini 1.5 Pro",
      confidence: 96,
      cost: 0.0078,
      tokens: 3100,
      latency: 1200,
      rationale:
        "Extracted onboarding brief: Primary concern is integration latency (<200ms SLA). Deliverables: SSO via SAML2, ERP bidirectional sync, Custom SLA reporting dashboard. Timeline: 6-week sprint.",
      complianceChecks: [{ name: "Data scrubbing", status: "pass" }],
      risks: { accuracy: "medium", compliance: "low", security: "low", costLatency: "medium" },
      riskDetails: {
        accuracy: {
          reason: "Highly technical integration constraints mentioned once may be under-weighted in summary.",
          fix: "Add domain-specific technical glossary to system prompt context.",
        },
      },
    },
    {
      id: "notify_slack",
      name: "notify.slack_onboarding",
      type: "notification",
      description: "Format brief and publish to #onboarding-success Slack channel.",
      status: "ok",
      rationale: "Message delivered to #onboarding-success. Rich text Slack Block Kit format. Acknowledged by 2 team members within 4 minutes.",
      complianceChecks: [{ name: "Slack token verify", status: "pass" }],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
    },
  ],
};

const LEDGER_WORKFLOW: Workflow = {
  id: "ledger_sync",
  name: "stripe_ledger → db_reconcile",
  description: "Reconcile Stripe payout transactions against internal billing database.",
  steps: [
    {
      id: "stripe_fetch",
      name: "ingest.stripe_payouts",
      type: "ingestion",
      description: "Download Stripe payout reports and transaction event logs.",
      status: "ok",
      rationale: "Fetched 12,042 transaction events from Stripe API. Date range: last 30 days. Total volume: $2.4M.",
      complianceChecks: [{ name: "API key scope check", status: "pass" }],
      risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
    },
    {
      id: "reconcile_match",
      name: "ai.ledger_reconcile",
      type: "ai",
      description: "Match Stripe transactions to internal invoice records using LLM reasoning.",
      status: "ok",
      prompt:
        "Match Stripe transaction entries {{stripe.logs}} against internal invoice records {{db.invoices}}. For each transaction, find the matching invoice by amount, date proximity (±2 days), and descriptor similarity. Flag: mismatched_amounts[], name_mismatches[], unmatched_transactions[].",
      model: "Gemini 1.5 Flash",
      confidence: 94,
      cost: 0.0035,
      tokens: 2100,
      latency: 680,
      rationale:
        "Reconciliation complete: 12,039/12,042 transactions matched. 3 flagged for human review due to bank descriptor mismatch. Total unmatched value: $1,240. Confidence: 94%.",
      complianceChecks: [{ name: "Ledger integrity check", status: "pass" }],
      risks: { accuracy: "medium", compliance: "medium", security: "low", costLatency: "low" },
      riskDetails: {
        compliance: {
          reason: "Unmatched transactions resolved without documented justification create audit gaps.",
          fix: "Require resolution_reason field when manually closing unmatched items.",
        },
      },
    },
  ],
};

const INITIAL_WORKFLOWS: Record<string, Workflow> = {
  vendor_invoice: VENDOR_INVOICE_WORKFLOW,
  crm_handoff: CRM_WORKFLOW,
  ledger_sync: LEDGER_WORKFLOW,
};

/* ─── Icon helpers ─── */
function StepIcon({ type, className = "h-3.5 w-3.5" }: { type: StepType; className?: string }) {
  switch (type) {
    case "ingestion":
      return <Database className={`${className} text-primary`} />;
    case "policy":
      return <ShieldAlert className={`${className} text-secondary`} />;
    case "ai":
      return <Sparkles className={`${className} text-primary`} />;
    case "approval":
      return <CheckCircle2 className={`${className} text-soft`} />;
    case "db":
      return <Terminal className={`${className} text-primary`} />;
    case "notification":
      return <Activity className={`${className} text-secondary`} />;
  }
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const cls =
    level === "high"
      ? "bg-[#FF9932]/20 text-[#FF9932] border-[#FF9932]/40"
      : level === "medium"
        ? "bg-secondary/10 text-secondary border-secondary/25"
        : "bg-primary/10 text-primary border-primary/20";
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-surface ${cls}`}
    >
      {level}
    </span>
  );
}

/* ─── Main component ─── */
function ConsolePage() {
  const [workflows, setWorkflows] = useState<Record<string, Workflow>>(INITIAL_WORKFLOWS);
  const [activeId, setActiveId] = useState("vendor_invoice");
  const [selectedStepId, setSelectedStepId] = useState("ai_risk_analysis");

  const [heatmapCell, setHeatmapCell] = useState<{
    stepId: string;
    category: "accuracy" | "compliance" | "security" | "costLatency";
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [runIndex, setRunIndex] = useState(-1);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "I'm your AnnAI workflow intelligence layer. Select any node on the canvas to inspect its rationale, or use the suggestions below to optimize this runbook.",
      time: nowTime(),
    },
  ]);
  const [assistantInput, setAssistantInput] = useState("");

  const [nlInput, setNlInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState(0);

  const timelineEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeWorkflow = workflows[activeId] ?? workflows["vendor_invoice"];
  const steps = activeWorkflow.steps;
  const selectedStep = steps.find((s) => s.id === selectedStepId) ?? steps[0];

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timelineEntries]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ─── Workflow switching ─── */
  const selectWorkflow = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setActiveId(id);
      setTimelineEntries([]);
      setIsRunning(false);
      setRunIndex(-1);
      setHeatmapCell(null);
      const wf = workflows[id];
      if (wf?.steps.length) setSelectedStepId(wf.steps[0].id);
    },
    [activeId, workflows],
  );

  /* ─── Builder mutations ─── */
  const deleteStep = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setWorkflows((prev) => {
        const next = prev[activeId].steps.filter((s) => s.id !== id);
        if (selectedStepId === id && next.length) setSelectedStepId(next[0].id);
        return { ...prev, [activeId]: { ...prev[activeId], steps: next } };
      });
    },
    [activeId, selectedStepId],
  );

  const moveStep = useCallback(
    (index: number, dir: "up" | "down", e: React.MouseEvent) => {
      e.stopPropagation();
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= steps.length) return;
      const arr = [...steps];
      [arr[index], arr[target]] = [arr[target], arr[index]];
      setWorkflows((prev) => ({ ...prev, [activeId]: { ...prev[activeId], steps: arr } }));
    },
    [activeId, steps],
  );

  const addStep = useCallback(
    (type: StepType) => {
      const id = `step_${Date.now()}`;
      const labels: Record<StepType, string> = {
        ingestion: "ingest.custom_source",
        policy: "validate.compliance_check",
        ai: "ai.custom_analysis",
        approval: "route.approval_gate",
        db: "publish.db_write",
        notification: "notify.event_dispatch",
      };
      const newStep: Step = {
        id,
        name: labels[type],
        type,
        description: `Custom ${type} step added via builder.`,
        status: "idle",
        risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
        rationale: `Dynamically added ${type} node. Configure parameters and run the workflow to generate rationale.`,
        complianceChecks: [{ name: "Standard policy scan", status: "pass" }],
        ...(type === "ai" && {
          prompt: "Analyze input payload: {{payload}}. Return structured JSON with analysis_result and confidence_score.",
          model: "Gemini 1.5 Flash",
          confidence: 95,
          cost: 0.001,
          tokens: 500,
          latency: 280,
        }),
      };
      setWorkflows((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], steps: [...prev[activeId].steps, newStep] },
      }));
      setSelectedStepId(id);
    },
    [activeId],
  );

  const updatePrompt = useCallback(
    (text: string) => {
      setWorkflows((prev) => ({
        ...prev,
        [activeId]: {
          ...prev[activeId],
          steps: prev[activeId].steps.map((s) =>
            s.id === selectedStepId ? { ...s, prompt: text } : s,
          ),
        },
      }));
    },
    [activeId, selectedStepId],
  );

  /* ─── Timeline execution ─── */
  const runWorkflow = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setRunIndex(0);
    setTimelineEntries([]);
    setWorkflows((prev) => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        steps: prev[activeId].steps.map((s, i) => ({
          ...s,
          status: i === 0 ? "running" : "idle",
        })),
      },
    }));
  }, [activeId, isRunning]);

  useEffect(() => {
    if (!isRunning || runIndex < 0 || runIndex >= steps.length) {
      if (runIndex >= steps.length && isRunning) {
        setIsRunning(false);
        setTimelineEntries((prev) => [
          ...prev,
          { time: nowTime(), label: "Runbook completed — all steps verified", status: "ok" },
        ]);
      }
      return;
    }

    const step = steps[runIndex];
    const duration = (step.latency ?? 400) + 500;

    const timer = setTimeout(() => {
      const nextStatus: StepStatus =
        step.id === "ai_risk_analysis" || step.id === "score_risk" ? "warning" : "ok";

      setWorkflows((prev) => {
        const arr = [...prev[activeId].steps];
        arr[runIndex] = { ...arr[runIndex], status: nextStatus };
        if (runIndex + 1 < arr.length) {
          arr[runIndex + 1] = { ...arr[runIndex + 1], status: "running" };
        }
        return { ...prev, [activeId]: { ...prev[activeId], steps: arr } };
      });

      setTimelineEntries((prev) => [
        ...prev,
        {
          time: nowTime(),
          label: step.name,
          status: nextStatus === "warning" ? "warning" : "ok",
        },
      ]);

      setRunIndex((prev) => prev + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [isRunning, runIndex, activeId]);

  const resetWorkflow = useCallback(() => {
    setIsRunning(false);
    setRunIndex(-1);
    setTimelineEntries([]);
    setWorkflows((prev) => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        steps: prev[activeId].steps.map((s) => ({ ...s, status: "ok" })),
      },
    }));
  }, [activeId]);

  /* ─── NL Generator ─── */
  const handleGenerate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = nlInput.trim();
      if (!text || isGenerating) return;

      setIsGenerating(true);
      setGenPhase(1);

      const lower = text.toLowerCase();

      // For "vendor onboarding" type queries, generate multiple steps
      const isMultiStep =
        lower.includes("vendor onboarding") ||
        lower.includes("onboarding workflow") ||
        lower.includes("vendor workflow") ||
        lower.includes("invoice workflow");

      setTimeout(() => {
        setGenPhase(2);
        setTimeout(() => {
          setGenPhase(3);
          setTimeout(() => {
            setIsGenerating(false);
            setGenPhase(0);
            setNlInput("");

            let newSteps: Step[];

            if (isMultiStep) {
              newSteps = [
                {
                  id: `gen_${Date.now()}_1`,
                  name: "ingest.vendor_portal",
                  type: "ingestion",
                  description: "Pull vendor registration forms from the vendor portal API.",
                  status: "ok",
                  rationale: "Generated by NL engine. Ingests new vendor submissions hourly.",
                  risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
                  complianceChecks: [{ name: "API auth check", status: "pass" }],
                },
                {
                  id: `gen_${Date.now()}_2`,
                  name: "validate.kyc_screen",
                  type: "policy",
                  description: "Run KYC and sanctions screening against OFAC and EU watchlists.",
                  status: "ok",
                  rationale: "Generated by NL engine. Checks vendor against global sanctions databases.",
                  risks: { accuracy: "low", compliance: "medium", security: "low", costLatency: "low" },
                  complianceChecks: [
                    { name: "OFAC screening", status: "pass" },
                    { name: "EU sanctions list", status: "pass" },
                  ],
                },
                {
                  id: `gen_${Date.now()}_3`,
                  name: "ai.vendor_risk_profile",
                  type: "ai",
                  description: "Score vendor risk using financial history and public data signals.",
                  status: "ok",
                  prompt:
                    "Assess vendor risk for {{vendor.name}}. Review: {{vendor.financials}}, {{vendor.public_records}}. Return risk_tier (A/B/C/D) and risk_factors[].",
                  model: "Gemini 1.5 Flash",
                  confidence: 89,
                  cost: 0.003,
                  tokens: 1800,
                  latency: 560,
                  rationale: "Generated by NL engine. Profiles vendor financial health and compliance posture.",
                  risks: { accuracy: "medium", compliance: "low", security: "low", costLatency: "medium" },
                  complianceChecks: [{ name: "Prompt safety filter", status: "pass" }],
                },
              ];

              const notifyMsg =
                `I generated 3 workflow nodes for "${text}": vendor portal ingestion, KYC screening, and AI risk profiling. All nodes are now live on the canvas. Click each to inspect.`;
              setChatMessages((prev) => [
                ...prev,
                { sender: "assistant", text: notifyMsg, time: nowTime() },
              ]);
            } else {
              // Single step generation
              let step: Step;

              if (lower.includes("slack") || lower.includes("alert") || lower.includes("notif")) {
                step = {
                  id: `gen_${Date.now()}`,
                  name: "notify.slack_dispatch",
                  type: "notification",
                  description: "Dispatch workflow event alerts to a configured Slack channel.",
                  status: "ok",
                  rationale: "Generated by NL engine. Publishes formatted diagnostic payload to Slack on trigger.",
                  risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
                  complianceChecks: [{ name: "Token scope validation", status: "pass" }],
                };
              } else if (lower.includes("validat") || lower.includes("check") || lower.includes("polic")) {
                step = {
                  id: `gen_${Date.now()}`,
                  name: "validate.custom_policy",
                  type: "policy",
                  description: "Apply custom compliance ruleset against the current payload fields.",
                  status: "ok",
                  rationale: "Generated by NL engine. Enforces allowlist patterns on all incoming field values.",
                  risks: { accuracy: "low", compliance: "medium", security: "low", costLatency: "low" },
                  complianceChecks: [
                    { name: "Field allowlist check", status: "pass" },
                    { name: "Schema contract", status: "pass" },
                  ],
                };
              } else if (lower.includes("ai") || lower.includes("llm") || lower.includes("analys") || lower.includes("anomal")) {
                step = {
                  id: `gen_${Date.now()}`,
                  name: "ai.custom_analysis",
                  type: "ai",
                  description: "Gemini-powered semantic analysis on the current payload.",
                  status: "ok",
                  prompt:
                    "Analyze the input payload: {{payload}}. Identify anomalies, outliers, or policy violations. Return structured JSON with findings[] and recommended_action.",
                  model: "Gemini 1.5 Flash",
                  confidence: 93,
                  cost: 0.0018,
                  tokens: 1100,
                  latency: 410,
                  rationale: "Generated by NL engine. Performs semantic analysis using Gemini 1.5 Flash.",
                  risks: { accuracy: "medium", compliance: "low", security: "medium", costLatency: "medium" },
                  complianceChecks: [{ name: "Output alignment check", status: "pass" }],
                };
              } else {
                step = {
                  id: `gen_${Date.now()}`,
                  name: "db.write_audit_record",
                  type: "db",
                  description: "Persist the current execution result to the audit database.",
                  status: "ok",
                  rationale: "Generated by NL engine. Writes compliance artifacts to the audit ledger.",
                  risks: { accuracy: "low", compliance: "low", security: "low", costLatency: "low" },
                  complianceChecks: [{ name: "Write authorization", status: "pass" }],
                };
              }

              newSteps = [...steps, step];
              setChatMessages((prev) => [
                ...prev,
                {
                  sender: "assistant",
                  text: `Generated "${step.name}" from your description. The node has been added to the canvas. Click it to configure or inspect.`,
                  time: nowTime(),
                },
              ]);
            }

            const finalSteps = isMultiStep ? [...steps, ...newSteps] : newSteps;
            setWorkflows((prev) => ({
              ...prev,
              [activeId]: { ...prev[activeId], steps: finalSteps },
            }));
            setSelectedStepId(finalSteps[finalSteps.length - 1].id);
          }, 900);
        }, 1000);
      }, 1100);
    },
    [activeId, isGenerating, nlInput, steps],
  );

  /* ─── AI Assistant ─── */
  const presetResponses: Record<string, (steps: Step[]) => string> = {
    "Optimize workflow": (steps) => {
      const aiStep = steps.find((s) => s.type === "ai");
      if (!aiStep) return "No AI nodes found. Add an AI step to receive prompt optimization advice.";
      return `Optimization analysis for "${aiStep.name}":\n\n1. Token reduction: Currently using ${aiStep.tokens} tokens. Removing static boilerplate from the prompt template could reduce this by ~22%, saving ~$${((aiStep.cost ?? 0) * 0.22).toFixed(5)} per run.\n\n2. Caching: Enable semantic caching for repeated vendor lookups — estimated 30% latency reduction.\n\n3. Model fit: ${aiStep.model} is appropriate for this workload. Consider Gemini 1.5 Pro only if accuracy needs exceed 95%.`;
    },
    "Reduce latency": (steps) => {
      const slowSteps = steps.filter((s) => (s.latency ?? 0) > 500);
      if (!slowSteps.length) return "All steps are within acceptable latency bounds (< 500ms). No immediate action required.";
      return `Latency bottleneck identified in "${slowSteps[0].name}" (${slowSteps[0].latency}ms).\n\nRecommendations:\n1. Enable streaming responses for LLM steps to reduce perceived latency.\n2. Move non-critical enrichment to an async sidecar process.\n3. Pre-warm the model context window during ingestion phase.`;
    },
    "Add validation": (steps) => {
      addStep("policy");
      return "Added a 'validate.compliance_check' node to the canvas. It's pre-configured with standard policy scanning. Click the node to customize the ruleset.";
    },
    "Explain decision": (steps) => {
      const aiStep = steps.find((s) => s.type === "ai");
      if (!aiStep) return "No AI nodes present. The workflow uses deterministic rules — no model inference decisions to explain.";
      return `Decision trace for "${aiStep.name}":\n\nThe AI flagged this invoice as HIGH_RISK because:\n• Invoice total ($52,400) is 1.47× the 90-day vendor median\n• Two duplicate line items detected (Consulting Services Q2 @ $8,200 each)\n• Confidence: ${aiStep.confidence}%\n\nThe ESCALATE_TO_APPROVAL action was recommended per policy rule #RF-72.`;
    },
    "Detect risks": (steps) => {
      const highRisk = steps.filter(
        (s) =>
          s.risks.accuracy === "high" ||
          s.risks.compliance === "high" ||
          s.risks.security === "high" ||
          s.risks.costLatency === "high",
      );
      if (!highRisk.length) return "No HIGH risk nodes detected. Workflow compliance posture is healthy. Review medium-risk nodes periodically.";
      const mitigated = steps.map((s) =>
        s.id === highRisk[0].id
          ? { ...s, risks: { ...s.risks, costLatency: "medium" as RiskLevel }, rationale: "Mitigated: SLA auto-escalation timeout added. " + s.rationale }
          : s,
      );
      setWorkflows((prev) => ({ ...prev, [activeId]: { ...prev[activeId], steps: mitigated } }));
      return `Detected HIGH risk in "${highRisk[0].name}" (Cost/Latency vector).\n\nMitigation applied: Added 2-hour auto-escalation timeout to the approval step. Risk downgraded from HIGH → MEDIUM. Heatmap has been updated.`;
    },
  };

  const executePreset = useCallback(
    (command: string) => {
      setChatMessages((prev) => [...prev, { sender: "user", text: command, time: nowTime() }]);
      setTimeout(() => {
        const handler = presetResponses[command];
        const response = handler ? handler(steps) : `Received: "${command}". How else can I help configure this runbook?`;
        setChatMessages((prev) => [...prev, { sender: "assistant", text: response, time: nowTime() }]);
      }, 650);
    },
    [steps, activeId],
  );

  const handleChatSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = assistantInput.trim();
      if (!text) return;
      setAssistantInput("");
      setChatMessages((prev) => [...prev, { sender: "user", text, time: nowTime() }]);
      setTimeout(() => {
        const q = text.toLowerCase();
        let resp = `Analyzing your query against the active workflow context. `;
        if (q.includes("optim") || q.includes("cost") || q.includes("fast")) {
          resp = presetResponses["Optimize workflow"](steps);
        } else if (q.includes("latenc") || q.includes("slow")) {
          resp = presetResponses["Reduce latency"](steps);
        } else if (q.includes("risk") || q.includes("danger") || q.includes("vuln")) {
          resp = presetResponses["Detect risks"](steps);
        } else if (q.includes("explain") || q.includes("why") || q.includes("decision")) {
          resp = presetResponses["Explain decision"](steps);
        } else if (q.includes("add") || q.includes("create") || q.includes("new step")) {
          addStep("ai");
          resp = "Added a new AI analysis node to the canvas. Select it to configure the prompt template.";
        } else if (q.includes("reset") || q.includes("clear")) {
          resetWorkflow();
          resp = "Workflow execution state cleared. All nodes reset to baseline.";
        } else {
          resp += `I can help with: workflow optimization, latency reduction, risk mitigation, decision explainability, or building new steps. Try one of the suggestions below.`;
        }
        setChatMessages((prev) => [...prev, { sender: "assistant", text: resp, time: nowTime() }]);
      }, 700);
    },
    [assistantInput, steps, activeId],
  );

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-bg text-light antialiased" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Console Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl backdrop-saturate-150">
        <div className="flex h-14 items-center gap-0 divide-x divide-line">

          {/* Brand / back */}
          <div className="flex items-center gap-3 px-4 shrink-0">
            <Link
              to="/"
              aria-label="Back to marketing site"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card/40 px-3 py-1.5 font-mono text-[11px] text-mute transition-surface hover:border-light/20 hover:text-light"
            >
              <ArrowLeft className="h-3 w-3" />
              Landing
            </Link>
            <span className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-bg shadow-btn">
                <span className="font-mono text-[10px] font-bold">A</span>
              </span>
              <span className="font-mono text-[13px] font-semibold">
                Ann<span className="text-primary">AI</span>
                <span className="text-mute font-normal"> / Control Plane</span>
              </span>
            </span>
          </div>

          {/* Workflow breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 px-4 font-mono text-[11px] text-mute flex-1">
            <span className="text-light">{activeWorkflow.name}</span>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span>{steps.length} nodes</span>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="inline-flex items-center gap-1 text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              live
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 px-4 shrink-0">
            <a
              href="#"
              aria-label="Documentation"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card/30 px-3 py-1.5 font-mono text-[11px] text-mute transition-surface hover:border-light/20 hover:text-light"
            >
              <BookOpen className="h-3 w-3" />
              Docs
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card/30 px-3 py-1.5 font-mono text-[11px] text-mute transition-surface hover:border-light/20 hover:text-light"
            >
              <Github className="h-3 w-3" />
              GitHub
            </a>
            <button
              aria-label="Export workflow"
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card/30 px-3 py-1.5 font-mono text-[11px] text-mute transition-surface hover:border-light/20 hover:text-light"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
            <button
              aria-label="Share workflow"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-mono text-[11px] font-semibold text-bg shadow-btn transition-surface hover:bg-secondary"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* Main three-column layout */}
      <div className="grid min-h-[calc(100vh-3.5rem)]" style={{ gridTemplateColumns: "200px 1fr 280px" }}>

        {/* ── LEFT SIDEBAR: Workflow list ── */}
        <aside
          aria-label="Workflow navigator"
          className="border-r border-line bg-bg flex flex-col overflow-y-auto"
        >
          <div className="p-3 border-b border-line">
            <span className="font-mono text-[9px] uppercase tracking-widest text-mute">Runbooks</span>
          </div>

          <nav className="flex-1 p-2 space-y-1" aria-label="Workflow list">
            {Object.values(workflows).map((w) => {
              const active = activeId === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => selectWorkflow(w.id)}
                  aria-current={active ? "page" : undefined}
                  className={`w-full text-left rounded-lg px-2.5 py-2 transition-surface outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "bg-card border border-primary/20 shadow-card"
                      : "hover:bg-card/40 border border-transparent"
                  }`}
                >
                  <div className={`font-mono text-[11px] font-medium truncate ${active ? "text-light" : "text-mute"}`}>
                    {w.name}
                  </div>
                  <div className="text-[10px] text-mute mt-0.5 line-clamp-2 leading-relaxed">{w.description}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="font-mono text-[9px] text-mute">{w.steps.length} nodes</span>
                    {active && (
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] text-primary">
                        <span className="h-1 w-1 rounded-full bg-primary" /> active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-line p-3 space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px] text-mute">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                All systems
              </span>
              <span className="text-primary">OK</span>
            </div>
            <div className="font-mono text-[10px] text-mute flex justify-between">
              <span>v4.2</span>
              <span>SOC 2 Type II</span>
            </div>
          </div>
        </aside>

        {/* ── CENTER: Canvas + Timeline + Heatmap ── */}
        <main aria-label="Workflow canvas" className="flex flex-col min-h-0 bg-bg/30 overflow-hidden">

          {/* NL Generator bar */}
          <div className="border-b border-line bg-card/20 px-4 py-3">
            <form onSubmit={handleGenerate} className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                <input
                  type="text"
                  value={nlInput}
                  disabled={isGenerating}
                  onChange={(e) => setNlInput(e.target.value)}
                  placeholder='Describe a workflow in plain English, e.g. "Create vendor onboarding workflow"…'
                  aria-label="Natural language workflow generator"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-line-strong bg-card/50 font-mono text-[12px] text-light placeholder:text-mute focus:border-primary/50 focus:outline-none transition-surface"
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="shrink-0 rounded-lg bg-primary px-4 py-2 font-mono text-[11px] font-semibold text-bg shadow-btn transition-surface hover:bg-secondary active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? "Generating…" : "Generate"}
              </button>
            </form>

            {isGenerating && (
              <div className="mt-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 font-mono text-[11px] text-primary">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                  {genPhase === 1 && "Parsing intent and extracting workflow semantics…"}
                  {genPhase === 2 && "Validating against compliance policy constraints…"}
                  {genPhase === 3 && "Constructing node graph and injecting into canvas…"}
                </div>
                <div className="h-0.5 w-full rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: genPhase === 1 ? "30%" : genPhase === 2 ? "65%" : "100%" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Canvas toolbar */}
          <div className="flex items-center justify-between border-b border-line bg-card/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-mute uppercase tracking-wider">Workflow Canvas</span>
              <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary font-semibold">
                {steps.length} nodes
              </span>
              {isRunning && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                  executing
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={runWorkflow}
                disabled={isRunning}
                aria-label="Run workflow simulation"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 font-mono text-[10px] font-semibold text-bg shadow-btn transition-surface hover:bg-secondary active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play className="h-3 w-3 fill-bg" />
                Run Workflow
              </button>
              <button
                onClick={resetWorkflow}
                aria-label="Reset workflow"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card/30 px-3 py-1.5 font-mono text-[10px] text-mute transition-surface hover:bg-card/70 hover:text-light"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Scrollable canvas content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* ── Workflow Builder ── */}
            <section aria-label="Workflow node sequence">
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[22px] top-8 bottom-8 w-px bg-line pointer-events-none" />

                <div className="space-y-2.5">
                  {steps.map((step, index) => {
                    const selected = selectedStepId === step.id;
                    const running = step.status === "running";
                    const warn = step.status === "warning";
                    const ok = step.status === "ok";

                    return (
                      <div
                        key={step.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selected}
                        aria-label={`Workflow node: ${step.name}`}
                        onClick={() => {
                          setSelectedStepId(step.id);
                          setHeatmapCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedStepId(step.id);
                          }
                        }}
                        className={`relative flex gap-3 rounded-xl border p-3.5 cursor-pointer select-none outline-none transition-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                          selected
                            ? "border-primary/40 bg-card shadow-glow"
                            : running
                              ? "border-primary bg-primary/5"
                              : warn
                                ? "border-secondary/35 bg-card/50"
                                : "border-line bg-card/30 hover:border-line-strong hover:bg-card/55"
                        }`}
                      >
                        {/* Step number badge */}
                        <div
                          className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-surface ${
                            running
                              ? "bg-primary text-bg shadow-btn"
                              : selected
                                ? "bg-primary text-bg shadow-btn"
                                : warn
                                  ? "bg-secondary text-bg"
                                  : ok
                                    ? "bg-primary/20 text-primary"
                                    : "border border-line-strong bg-bg text-mute"
                          }`}
                        >
                          {running ? (
                            <span className="h-2 w-2 rounded-full bg-bg animate-ping" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {/* Step details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-light">
                                <StepIcon type={step.type} />
                                <span className="truncate">{step.name}</span>
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-mute truncate">
                                {step.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Status badge */}
                              <span
                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9px] ${
                                  ok
                                    ? "bg-primary/10 text-primary"
                                    : warn
                                      ? "bg-secondary/15 text-secondary"
                                      : running
                                        ? "bg-primary/15 text-primary"
                                        : "bg-line text-mute"
                                }`}
                              >
                                <span
                                  className={`h-1 w-1 rounded-full ${
                                    ok ? "bg-primary" : warn ? "bg-secondary" : running ? "bg-primary animate-ping" : "bg-mute/40"
                                  }`}
                                />
                                {step.status}
                              </span>

                              {/* Controls */}
                              <button
                                onClick={(e) => moveStep(index, "up", e)}
                                disabled={index === 0}
                                aria-label="Move node up"
                                className="text-mute transition-surface hover:text-light disabled:opacity-25 disabled:pointer-events-none"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => moveStep(index, "down", e)}
                                disabled={index === steps.length - 1}
                                aria-label="Move node down"
                                className="text-mute transition-surface hover:text-light disabled:opacity-25 disabled:pointer-events-none"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => deleteStep(step.id, e)}
                                aria-label="Delete node"
                                className="text-mute transition-surface hover:text-secondary"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add node bar */}
              <div
                role="group"
                aria-label="Add workflow node"
                className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-dashed border-line bg-card/10 px-3 py-2.5"
              >
                <span className="mr-1 font-mono text-[9px] uppercase tracking-wider text-mute">
                  + Add node:
                </span>
                {(["ingestion", "policy", "ai", "approval", "db", "notification"] as StepType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => addStep(t)}
                    className="inline-flex items-center gap-1 rounded border border-line-strong bg-card px-2 py-1 font-mono text-[10px] text-mute transition-surface hover:border-primary/30 hover:text-primary"
                  >
                    <StepIcon type={t} className="h-3 w-3" />
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Risk Heatmap ── */}
            <section aria-label="Risk heatmap" className="border-t border-line pt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-mute">Risk Heatmap</span>
                </div>
                <span className="font-mono text-[10px] text-mute">Select a cell for remediation detail</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-line-strong bg-card/20 shadow-card">
                <table className="w-full font-mono text-[11px]" aria-label="Step risk matrix">
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2.5 pl-4 pr-3 text-left font-normal text-mute text-[9px] uppercase tracking-wider">
                        Step
                      </th>
                      {["Accuracy", "Compliance", "Security", "Cost / Latency"].map((h) => (
                        <th key={h} scope="col" className="py-2.5 px-2 text-center font-normal text-mute text-[9px] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {steps.map((step) => {
                      const isSelectedRow = selectedStepId === step.id;
                      return (
                        <tr
                          key={step.id}
                          className={`transition-surface ${isSelectedRow ? "bg-primary/5" : "hover:bg-bg/20"}`}
                        >
                          <td className="py-2.5 pl-4 pr-3">
                            <div className="flex items-center gap-1.5">
                              {isSelectedRow && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                              <span className={`truncate max-w-[130px] ${isSelectedRow ? "text-light" : "text-mute"}`}>
                                {step.name}
                              </span>
                            </div>
                          </td>
                          {(["accuracy", "compliance", "security", "costLatency"] as const).map((cat) => {
                            const risk = step.risks[cat];
                            const cellActive = heatmapCell?.stepId === step.id && heatmapCell?.category === cat;
                            return (
                              <td key={cat} className="px-2 py-1.5 text-center">
                                <button
                                  onClick={() => {
                                    setHeatmapCell({ stepId: step.id, category: cat });
                                    setSelectedStepId(step.id);
                                  }}
                                  aria-label={`${step.name} ${cat} risk: ${risk}`}
                                  aria-pressed={cellActive}
                                  className={`mx-auto block rounded px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase border transition-all focus:outline-none ${
                                    risk === "high"
                                      ? "bg-[#FF9932]/15 text-[#FF9932] border-[#FF9932]/35 hover:bg-[#FF9932]/30"
                                      : risk === "medium"
                                        ? "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20"
                                        : "bg-primary/10 text-primary border-primary/15 hover:bg-primary/20"
                                  } ${cellActive ? "ring-2 ring-primary ring-offset-1 ring-offset-bg scale-105" : ""}`}
                                >
                                  {risk}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Heatmap detail card */}
                {heatmapCell && (() => {
                  const step = steps.find((s) => s.id === heatmapCell.stepId);
                  if (!step) return null;
                  const cat = heatmapCell.category;
                  const catLabel: Record<string, string> = {
                    accuracy: "Accuracy",
                    compliance: "Compliance",
                    security: "Security",
                    costLatency: "Cost / Latency",
                  };
                  const risk = step.risks[cat];
                  const detail = step.riskDetails?.[cat] ?? {
                    reason: `No elevated risk detected. This node operates deterministically within policy bounds for the ${catLabel[cat]} vector.`,
                    fix: "No mitigation required at this time.",
                  };
                  return (
                    <div className="mx-4 mb-4 mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold text-light flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                          {step.name} — {catLabel[cat]} Risk
                        </span>
                        <RiskBadge level={risk} />
                      </div>
                      <div className="text-[11px] space-y-2">
                        <div>
                          <span className="text-mute font-mono uppercase text-[9px] tracking-wider block mb-1">Risk Rationale</span>
                          <p className="text-light leading-relaxed">{detail.reason}</p>
                        </div>
                        <div>
                          <span className="text-primary font-mono uppercase text-[9px] tracking-wider block mb-1">Suggested Mitigation</span>
                          <p className="font-mono text-[11px] text-soft bg-bg/50 border border-line rounded p-2.5 leading-relaxed">
                            {detail.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* ── Execution Timeline ── */}
            <section aria-label="Workflow execution timeline" className="border-t border-line pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-mute">Execution Timeline</span>
                {isRunning && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] text-primary">
                    <span className="h-1 w-1 rounded-full bg-primary animate-ping" />
                    running
                  </span>
                )}
              </div>

              <div
                role="log"
                aria-live="polite"
                aria-label="Execution log"
                className="rounded-xl border border-line-strong bg-[#0D1A20] h-44 overflow-y-auto p-4 shadow-card"
              >
                {timelineEntries.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Terminal className="h-5 w-5 text-mute mx-auto mb-2 opacity-40" />
                      <p className="font-mono text-[11px] text-mute">
                        Click <span className="text-primary">Run Workflow</span> to start live execution trace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timelineEntries.map((entry, i) => (
                      <div key={i} className="flex items-start gap-3 font-mono text-[11px]">
                        <span className="text-mute shrink-0">{entry.time}</span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1 ${
                            entry.status === "warning"
                              ? "bg-secondary"
                              : entry.status === "ok"
                                ? "bg-primary"
                                : "bg-mute"
                          }`}
                        />
                        <span
                          className={
                            entry.status === "warning"
                              ? "text-secondary"
                              : entry.status === "ok"
                                ? "text-soft"
                                : "text-mute"
                          }
                        >
                          {entry.label}
                          {entry.status === "warning" && " — flagged, review required"}
                          {entry.status === "ok" && " — completed"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={timelineEndRef} />
              </div>
            </section>

          </div>
        </main>

        {/* ── RIGHT SIDEBAR: Explainability + Assistant ── */}
        <aside
          aria-label="Node inspector and AI assistant"
          className="border-l border-line bg-bg flex flex-col min-h-0 overflow-hidden"
          style={{ height: "calc(100vh - 3.5rem)" }}
        >

          {/* Explainability panel */}
          <div className="border-b border-line overflow-y-auto" style={{ flex: "0 0 auto", maxHeight: "55%" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-mute">Node Inspector</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Node header */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-mute mb-1">Selected node</div>
                <div className="flex items-center gap-2">
                  <StepIcon type={selectedStep.type} className="h-4 w-4" />
                  <span className="font-mono text-[12px] font-semibold text-light truncate">
                    {selectedStep.name}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-mute">{selectedStep.description}</p>
              </div>

              {/* AI metrics */}
              {selectedStep.type === "ai" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Confidence", value: `${selectedStep.confidence}%`, highlight: true },
                      { label: "Latency", value: `${selectedStep.latency}ms`, highlight: false },
                      { label: "Run cost", value: `$${selectedStep.cost?.toFixed(4)}`, highlight: true },
                      { label: "Tokens", value: `${selectedStep.tokens?.toLocaleString()}`, highlight: false },
                    ].map((m) => (
                      <div key={m.label} className="rounded border border-line bg-bg/40 p-2 text-center">
                        <div className="font-mono text-[9px] uppercase tracking-wider text-mute mb-0.5">{m.label}</div>
                        <div className={`font-mono text-[13px] font-semibold ${m.highlight ? "text-primary" : "text-soft"}`}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-mute mb-1.5">
                      Prompt template
                    </div>
                    <textarea
                      value={selectedStep.prompt ?? ""}
                      onChange={(e) => updatePrompt(e.target.value)}
                      rows={4}
                      aria-label="Edit prompt template"
                      className="w-full rounded border border-line bg-bg/60 p-2.5 font-mono text-[10px] text-soft leading-relaxed focus:border-primary/50 focus:outline-none resize-none transition-surface"
                    />
                  </div>
                </>
              )}

              {selectedStep.type !== "ai" && (
                <div className="rounded border border-line bg-bg/20 p-2.5 text-center font-mono text-[10px] text-mute">
                  Deterministic node — no LLM inference
                </div>
              )}

              {/* Rationale */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-mute mb-1.5">
                  Execution rationale
                </div>
                <p className="rounded border border-line bg-bg/40 p-2.5 text-[11px] leading-relaxed text-light">
                  {selectedStep.rationale ?? "Run the workflow to generate rationale for this node."}
                </p>
              </div>

              {/* Compliance checks */}
              {selectedStep.complianceChecks && selectedStep.complianceChecks.length > 0 && (
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-mute mb-1.5">
                    Governance checks
                  </div>
                  <div className="space-y-1.5">
                    {selectedStep.complianceChecks.map((check, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded border border-line bg-bg/25 px-2.5 py-1.5"
                      >
                        <span className="font-mono text-[10px] text-mute">{check.name}</span>
                        <span
                          className={`font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            check.status === "pass"
                              ? "bg-primary/10 text-primary"
                              : check.status === "warning"
                                ? "bg-secondary/15 text-secondary"
                                : "bg-[#FF9932]/15 text-[#FF9932]"
                          }`}
                        >
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line shrink-0">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-mute">AI Assistant</span>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              aria-label="AI assistant conversation"
              className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
            >
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-bg font-semibold rounded-br-sm"
                        : "bg-card border border-line-strong text-light rounded-bl-sm"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 px-1 font-mono text-[9px] text-mute">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested prompts */}
            <div className="border-t border-line bg-card/10 px-3 py-2 flex flex-wrap gap-1.5 shrink-0">
              {["Optimize workflow", "Reduce latency", "Add validation", "Explain decision", "Detect risks"].map(
                (cmd) => (
                  <button
                    key={cmd}
                    onClick={() => executePreset(cmd)}
                    className="rounded-full border border-line-strong bg-card/40 px-2.5 py-1 font-mono text-[9px] text-mute transition-surface hover:border-primary/25 hover:text-primary"
                  >
                    {cmd}
                  </button>
                ),
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleChatSubmit}
              className="border-t border-line bg-card/20 p-2 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask the assistant…"
                aria-label="Chat with AI assistant"
                className="flex-1 rounded border border-line bg-bg/50 px-2.5 py-1.5 font-mono text-[11px] text-light placeholder:text-mute focus:border-primary/30 focus:outline-none transition-surface"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="shrink-0 rounded bg-primary p-2 text-bg shadow-btn transition-surface hover:bg-secondary"
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>

        </aside>
      </div>
    </div>
  );
}
