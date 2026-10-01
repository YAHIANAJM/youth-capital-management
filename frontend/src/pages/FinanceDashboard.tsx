import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import {
  BALANCE_MONTHLY,
  CURRENT_BALANCE,
  EXPENSE_CATEGORIES,
  EXPENSE_MONTHLY,
  EXPENSE_PCT_CHANGE,
  formatMAD,
  INCOME_MONTHLY,
  INCOME_PCT_CHANGE,
  MONTH_LABELS,
  PROJECT_BUDGETS,
  THIS_MONTH_EXPENSE,
  THIS_MONTH_EXPENSE_CATEGORY_COUNT,
  THIS_MONTH_EXPENSE_TXNS,
  THIS_MONTH_INCOME,
  THIS_MONTH_INCOME_SOURCE_COUNT,
  THIS_MONTH_INCOME_TXNS,
  TOTAL_SPENT,
} from "../lib/financeData";

type Tooltip = { x: number; y: number; lines: string[] } | null;

const TILES = [
  {
    key: "balance",
    label: "Total balance",
    value: formatMAD(CURRENT_BALANCE),
    sub: `${THIS_MONTH_INCOME_TXNS.length + THIS_MONTH_EXPENSE_TXNS.length} transactions this month`,
    change: null as number | null,
  },
  {
    key: "income",
    label: "Income",
    value: formatMAD(THIS_MONTH_INCOME),
    sub: `${THIS_MONTH_INCOME_TXNS.length} transactions · ${THIS_MONTH_INCOME_SOURCE_COUNT} sources`,
    change: INCOME_PCT_CHANGE,
  },
  {
    key: "expense",
    label: "Expense",
    value: formatMAD(THIS_MONTH_EXPENSE),
    sub: `${THIS_MONTH_EXPENSE_TXNS.length} transactions · ${THIS_MONTH_EXPENSE_CATEGORY_COUNT} categories`,
    change: EXPENSE_PCT_CHANGE,
  },
];

// Line/area chart — "Total balance overview" — three toggleable series on
// one shared axis, same legend-toggle interaction ProjectBoard's own
// project-global-chart already uses (never a second y-axis).
function BalanceChart() {
  const [visible, setVisible] = useState({ income: true, expense: true, balance: true });
  const [tooltip, setTooltip] = useState<Tooltip>(null);

  const w = 760;
  const h = 220;
  const padL = 44;
  const padR = 10;
  const padT = 14;
  const padB = 22;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const maxVal = Math.max(...INCOME_MONTHLY, ...EXPENSE_MONTHLY, ...BALANCE_MONTHLY, 1);
  const x = (i: number) => padL + (i / (MONTH_LABELS.length - 1)) * plotW;
  const y = (v: number) => padT + (1 - Math.max(0, v) / maxVal) * plotH;
  const linePath = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaPath = (arr: number[]) => `${linePath(arr)} L${x(arr.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

  const SERIES = [
    { key: "balance" as const, label: "Balance", color: "hsl(222 46% 15%)", data: BALANCE_MONTHLY },
    { key: "income" as const, label: "Income", color: "#1659f3", data: INCOME_MONTHLY },
    { key: "expense" as const, label: "Expense", color: "#caa849", data: EXPENSE_MONTHLY },
  ];

  return (
    <div className="finance-chart-card">
      <div className="finance-chart-header">
        <span className="finance-chart-title">Total balance overview</span>
        <span className="finance-chart-subtitle">Last 12 months</span>
      </div>
      <div className="project-global-chart-legend">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`project-global-chart-legend-btn${visible[s.key] ? "" : " off"}`}
            onClick={() => setVisible((cur) => ({ ...cur, [s.key]: !cur[s.key] }))}
          >
            <span className="project-global-chart-legend-dot" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>
      <svg className="finance-chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padL}
            x2={w - padR}
            y1={padT + (1 - g) * plotH}
            y2={padT + (1 - g) * plotH}
            className="project-global-chart-gridline"
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <text key={g} x={padL - 6} y={padT + (1 - g) * plotH + 3} className="project-global-chart-axis-label" textAnchor="end">
            {formatMAD(Math.round(g * maxVal))}
          </text>
        ))}
        {MONTH_LABELS.map((label, i) =>
          i % 2 === 0 ? (
            <text key={label + i} x={x(i)} y={h - 4} className="project-global-chart-axis-label project-global-chart-axis-label-x">
              {label}
            </text>
          ) : null
        )}
        {SERIES.map(
          (s) =>
            visible[s.key] && (
              <path key={`area-${s.key}`} d={areaPath(s.data)} fill={s.color} fillOpacity={0.14} stroke="none" />
            )
        )}
        {SERIES.map(
          (s) =>
            visible[s.key] && (
              <path key={`line-${s.key}`} d={linePath(s.data)} fill="none" stroke={s.color} strokeWidth={2} />
            )
        )}
        {MONTH_LABELS.map((label, i) => (
          <rect
            key={`hit-${label}-${i}`}
            x={x(i) - plotW / MONTH_LABELS.length / 2}
            y={padT}
            width={plotW / MONTH_LABELS.length}
            height={plotH}
            fill="transparent"
            onMouseEnter={(e) => {
              const r = (e.currentTarget as SVGRectElement).getBoundingClientRect();
              setTooltip({
                x: r.left + r.width / 2,
                y: r.top,
                lines: [
                  label,
                  ...SERIES.filter((s) => visible[s.key]).map((s) => `${s.label}: ${formatMAD(s.data[i])}`),
                ],
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div className="finance-chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.lines.map((line, i) => (
            <span key={i} className={i === 0 ? "finance-chart-tooltip-title" : "finance-chart-tooltip-line"}>
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Dual bar chart — "Comparing income and expense", one bar pair per month,
// both series read straight off the same monthly arrays the line chart uses.
function IncomeExpenseBars() {
  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const w = 760;
  const h = 200;
  const padL = 44;
  const padR = 10;
  const padT = 14;
  const padB = 22;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const maxVal = Math.max(...INCOME_MONTHLY, ...EXPENSE_MONTHLY, 1);
  const slot = plotW / MONTH_LABELS.length;
  const barW = slot * 0.3;
  const y = (v: number) => padT + (1 - v / maxVal) * plotH;

  return (
    <div className="finance-chart-card">
      <div className="finance-chart-header">
        <span className="finance-chart-title">Comparing income and expense</span>
        <span className="finance-chart-subtitle">Per month</span>
      </div>
      <div className="project-global-chart-legend">
        <span className="project-global-chart-legend-btn" style={{ cursor: "default" }}>
          <span className="project-global-chart-legend-dot" style={{ background: "#1659f3" }} />
          Income
        </span>
        <span className="project-global-chart-legend-btn" style={{ cursor: "default" }}>
          <span className="project-global-chart-legend-dot" style={{ background: "#caa849" }} />
          Expense
        </span>
      </div>
      <svg className="finance-chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padL}
            x2={w - padR}
            y1={padT + (1 - g) * plotH}
            y2={padT + (1 - g) * plotH}
            className="project-global-chart-gridline"
          />
        ))}
        {MONTH_LABELS.map((label, i) => {
          const cx = padL + i * slot + slot / 2;
          return (
            <g
              key={label + i}
              onMouseEnter={(e) => {
                const r = (e.currentTarget as SVGGElement).getBoundingClientRect();
                setTooltip({
                  x: r.left + r.width / 2,
                  y: r.top,
                  lines: [label, `Income: ${formatMAD(INCOME_MONTHLY[i])}`, `Expense: ${formatMAD(EXPENSE_MONTHLY[i])}`],
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <rect x={cx - barW - 2} y={y(INCOME_MONTHLY[i])} width={barW} height={plotH + padT - y(INCOME_MONTHLY[i])} rx={2} fill="#1659f3" />
              <rect x={cx + 2} y={y(EXPENSE_MONTHLY[i])} width={barW} height={plotH + padT - y(EXPENSE_MONTHLY[i])} rx={2} fill="#caa849" />
              <rect x={cx - slot / 2} y={padT} width={slot} height={plotH} fill="transparent" />
              {i % 2 === 0 && (
                <text x={cx} y={h - 4} className="project-global-chart-axis-label project-global-chart-axis-label-x">
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div className="finance-chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.lines.map((line, i) => (
            <span key={i} className={i === 0 ? "finance-chart-tooltip-title" : "finance-chart-tooltip-line"}>
              {line}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Donut — "Statistics": the same 1.1M MAD expense total, broken down by the
// Finance module's own category field (PLATFORM-TREE.md §2), not a separate
// number. Built from stroke-dasharray segments on stacked circles rather
// than hand-rolled arc paths.
function CategoryDonut() {
  const size = 160;
  const strokeWidth = 26;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="finance-chart-card finance-donut-card">
      <div className="finance-chart-header">
        <span className="finance-chart-title">Statistics</span>
        <span className="finance-chart-subtitle">Expense by category</span>
      </div>
      <div className="finance-donut-body">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {EXPENSE_CATEGORIES.map((cat) => {
              const fraction = cat.amount / TOTAL_SPENT;
              const dash = fraction * circumference;
              const offset = -cumulative * circumference;
              cumulative += fraction;
              return (
                <circle
                  key={cat.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </g>
          <text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="finance-donut-center-value">
            {formatMAD(TOTAL_SPENT)}
          </text>
          <text x={size / 2} y={size / 2 + 14} textAnchor="middle" className="finance-donut-center-label">
            Total spent
          </text>
        </svg>
        <div className="finance-donut-legend">
          {EXPENSE_CATEGORIES.map((cat) => (
            <div key={cat.key} className="finance-donut-legend-row">
              <span className="finance-donut-legend-dot" style={{ background: cat.color }} />
              <span className="finance-donut-legend-label">{cat.label}</span>
              <span className="finance-donut-legend-value">{formatMAD(cat.amount)}</span>
              <span className="finance-donut-legend-pct">{Math.round((cat.amount / TOTAL_SPENT) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Budget per project — reuses the exact same bar classes ProjectBoard
// already renders its own money progress bars with, instead of a new style.
function BudgetPerProject() {
  return (
    <div className="finance-chart-card">
      <div className="finance-chart-header">
        <span className="finance-chart-title">Budget per project</span>
        <span className="finance-chart-subtitle">Raised vs needed</span>
      </div>
      <div className="finance-budget-list">
        {PROJECT_BUDGETS.map((p) => (
          <div key={p.name} className="project-capsule-progress finance-budget-row">
            <span className="project-capsule-progress-label finance-budget-name">{p.name}</span>
            <div className="project-capsule-bar">
              <div className="project-capsule-bar-fill" style={{ width: `${Math.min(100, (p.raised / p.needed) * 100)}%` }} />
            </div>
            <span className="project-capsule-progress-value">
              {formatMAD(p.raised)} / {formatMAD(p.needed)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinanceDashboard() {
  return (
    <div className="page-template">
      <Sidebar />
      <div className="page-template-main">
        <div className="finance-dashboard">
          <div className="finance-dashboard-header">
            <span className="finance-dashboard-title">Finance Dashboard</span>
          </div>
          <div className="finance-dashboard-body">
            <div className="finance-tiles">
              {TILES.map((tile) => (
                <div key={tile.key} className="finance-tile">
                  <span className="finance-tile-label">{tile.label}</span>
                  <div className="finance-tile-value-row">
                    <span className="finance-tile-value">{tile.value}</span>
                    {tile.change !== null && (
                      <span className={`finance-tile-change${tile.change < 0 ? " negative" : ""}`}>
                        {tile.change >= 0 ? "+" : ""}
                        {tile.change}%
                      </span>
                    )}
                  </div>
                  <span className="finance-tile-sub">{tile.sub}</span>
                </div>
              ))}
            </div>

            <BalanceChart />

            <div className="finance-chart-row">
              <IncomeExpenseBars />
              <CategoryDonut />
            </div>

            <BudgetPerProject />
          </div>
        </div>
      </div>
    </div>
  );
}
