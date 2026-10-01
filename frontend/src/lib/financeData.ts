// Finance ▸ Dashboard mock data.
//
// This is NOT a second, disconnected mock dataset. Every total below is the
// exact same number already shown on Overview — GlobalStats.tsx's "Money
// raised" (2.4M MAD) / "Money spent" (1.1M MAD) cards, their named sponsors
// (Youssef/Mehdi/Salma) and named spent-on projects (Youth Coding Bootcamp /
// Green Campus Initiative) — plus a handful of real rows copied from
// ProjectBoard.tsx's own project list. This file only decomposes those same
// totals into a monthly trend and a transaction list so the Dashboard has
// something to chart; it never invents a new, unrelated set of numbers.

// ---- the shared ground truth (copied 1:1 from GlobalStats.tsx) ----

export const TOTAL_RAISED = 2_400_000; // "2.4M MAD" — GlobalStats "raised" card
export const TOTAL_SPENT = 1_100_000; // "1.1M MAD" — GlobalStats "spent" card
export const CURRENT_BALANCE = TOTAL_RAISED - TOTAL_SPENT;

// Same 3 sponsors + exact amounts as GlobalStats' "raised" card.
export const INCOME_SOURCES = [
  { name: "Youssef", amount: 1_000_000 },
  { name: "Mehdi", amount: 800_000 },
  { name: "Salma", amount: 600_000 },
] as const;

// Same 2 projects as GlobalStats' "spent" card stack — the 1.1M was spent on
// these, so expenses are attributed back to them.
export const EXPENSE_PROJECTS = ["Youth Coding Bootcamp", "Green Campus Initiative"] as const;

// Same categories the Finance module's own field spec already lists
// (PLATFORM-TREE.md §2 — Expenses > Category: Event/Marketing/Transport/
// Equipment) — not a new taxonomy invented for this chart.
export const EXPENSE_CATEGORIES = [
  { key: "event", label: "Event", amount: 350_000, color: "#1659f3" },
  { key: "equipment", label: "Equipment", amount: 300_000, color: "#caa849" },
  { key: "marketing", label: "Marketing", amount: 250_000, color: "#6659ea" },
  { key: "transport", label: "Transport", amount: 200_000, color: "#10b2a2" },
] as const;

// Same 3 member names already used as project owners/top members in
// GlobalStats/ProjectBoard, reused here as the people who sign off
// expenses instead of inventing new approver names.
const APPROVERS = ["Amine Tazi", "Nadia Chraibi", "Karim Ouazzani"];

// A handful of real rows carried over as-is from ProjectBoard's own
// PROJECTS_BASE (name + moneyRaised/moneyNeeded, converted from K MAD to
// MAD) for the Dashboard's "Budget per project" list — not a new project
// list invented for this page.
export const PROJECT_BUDGETS = [
  { name: "Youth Leadership Summit", raised: 300_000, needed: 450_000 },
  { name: "Digital Skills Academy", raised: 120_000, needed: 180_000 },
  { name: "Solar Schools Initiative", raised: 500_000, needed: 900_000 },
  { name: "Green Campus Initiative", raised: 40_000, needed: 90_000 },
  { name: "Women in Tech Bootcamp", raised: 60_000, needed: 60_000 },
];

// ---- derive a 12-month trend from those same totals (deterministic — same
// "eased ramp, no randomness" spirit as ProjectBoard's buildGlobalSeries) ----

const MONTHS = 12;

function monthLabels(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return d.toLocaleString("en", { month: "short" });
  });
}

// Splits `total` across `weights` proportionally, rounded to whole MAD, with
// any rounding drift folded into the last slot so the parts always sum back
// to exactly `total` — same drift-fix pattern ProjectBoard's buildInvoices
// already uses for its line items.
function distribute(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((s, w) => s + w, 0);
  const parts = weights.map((w) => Math.round((w / weightSum) * total));
  const drift = total - parts.reduce((s, p) => s + p, 0);
  parts[parts.length - 1] += drift;
  return parts;
}

export const MONTH_LABELS = monthLabels(MONTHS);

// Income grows steadily across the year (more sponsors sign on over time);
// expenses follow a step behind it — a steady-growth shape, not random.
const INCOME_WEIGHTS = Array.from({ length: MONTHS }, (_, i) => 0.6 + 0.4 * (i / (MONTHS - 1)));
const EXPENSE_WEIGHTS = Array.from({ length: MONTHS }, (_, i) => 0.5 + 0.5 * (Math.max(0, i - 1) / (MONTHS - 1)));

export const INCOME_MONTHLY = distribute(TOTAL_RAISED, INCOME_WEIGHTS);
export const EXPENSE_MONTHLY = distribute(TOTAL_SPENT, EXPENSE_WEIGHTS);
export const BALANCE_MONTHLY = INCOME_MONTHLY.map((v, i) => v - EXPENSE_MONTHLY[i]);

// ---- transaction-level rows (what the stat tiles' counts read from) ----

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  month: string; // one of MONTH_LABELS
  from?: string; // sponsor name (income only)
  category?: string; // expense category (expense only)
  project?: string; // which project the expense belongs to (expense only)
  approvedBy?: string; // expense only
  method: "Bank" | "Cash";
};

// Each sponsor's own total split into one payment per month, proportional to
// that month's income weight — so both the per-month total AND each
// sponsor's own grand total land back on the exact GlobalStats numbers.
export const INCOME_TRANSACTIONS: Transaction[] = INCOME_SOURCES.flatMap((source, si) => {
  const amounts = distribute(source.amount, INCOME_WEIGHTS);
  return amounts.map((amount, mi) => ({
    id: `INC-${1000 + si * 100 + mi}`,
    type: "income" as const,
    amount,
    month: MONTH_LABELS[mi],
    from: source.name,
    method: (mi % 2 === 0 ? "Bank" : "Cash") as "Bank" | "Cash",
  }));
});

export const EXPENSE_TRANSACTIONS: Transaction[] = EXPENSE_CATEGORIES.flatMap((cat, ci) => {
  const amounts = distribute(cat.amount, EXPENSE_WEIGHTS);
  return amounts.map((amount, mi) => ({
    id: `EXP-${2000 + ci * 100 + mi}`,
    type: "expense" as const,
    amount,
    month: MONTH_LABELS[mi],
    category: cat.label,
    project: EXPENSE_PROJECTS[(ci + mi) % EXPENSE_PROJECTS.length],
    approvedBy: APPROVERS[(ci + mi) % APPROVERS.length],
    method: (mi % 2 === 0 ? "Bank" : "Cash") as "Bank" | "Cash",
  }));
});

export const ALL_TRANSACTIONS: Transaction[] = [...INCOME_TRANSACTIONS, ...EXPENSE_TRANSACTIONS];

// ---- stat-tile helpers (this month vs last month) ----

const lastIndex = MONTHS - 1;
export const THIS_MONTH = MONTH_LABELS[lastIndex];
export const THIS_MONTH_INCOME = INCOME_MONTHLY[lastIndex];
export const LAST_MONTH_INCOME = INCOME_MONTHLY[lastIndex - 1];
export const THIS_MONTH_EXPENSE = EXPENSE_MONTHLY[lastIndex];
export const LAST_MONTH_EXPENSE = EXPENSE_MONTHLY[lastIndex - 1];

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export const INCOME_PCT_CHANGE = pctChange(THIS_MONTH_INCOME, LAST_MONTH_INCOME);
export const EXPENSE_PCT_CHANGE = pctChange(THIS_MONTH_EXPENSE, LAST_MONTH_EXPENSE);

export const THIS_MONTH_INCOME_TXNS = INCOME_TRANSACTIONS.filter((t) => t.month === THIS_MONTH);
export const THIS_MONTH_EXPENSE_TXNS = EXPENSE_TRANSACTIONS.filter((t) => t.month === THIS_MONTH);

export const THIS_MONTH_INCOME_SOURCE_COUNT = new Set(THIS_MONTH_INCOME_TXNS.map((t) => t.from)).size;
export const THIS_MONTH_EXPENSE_CATEGORY_COUNT = new Set(THIS_MONTH_EXPENSE_TXNS.map((t) => t.category)).size;

export function formatMAD(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M MAD`;
  if (Math.abs(amount) >= 1_000) return `${(amount / 1_000).toFixed(0)}K MAD`;
  return `${amount} MAD`;
}
