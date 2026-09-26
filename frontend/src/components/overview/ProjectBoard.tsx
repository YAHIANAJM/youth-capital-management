import { useEffect, useState } from "react";
import { ChevronDownIcon } from "../icons";
import { IdeaStatus } from "../../types/idea";
import { ProjectFilters, REVIEW_STAGE_OPTIONS } from "./ProjectFilterBar";
import memberAmine from "../../assets/images/member-amine.jpg";
import memberKarim from "../../assets/images/member-karim.jpg";
import memberNadia from "../../assets/images/member-nadia.jpg";

// Mock rows for the "Projects" list — no backend wired yet. moneyRaised/
// moneyNeeded and daysElapsed/daysTotal drive the two progress bars. status
// reuses the same IdeaStatus the rest of the app already tracks per project
// (see types/idea.ts, IdeaCard.tsx) — a project's lifecycle stage isn't a
// separate concept invented for this board. scope/department match
// ProjectFilterBar's SCOPE_OPTIONS/DEPARTMENT_OPTIONS exactly, so the main
// filter bar can drive this list directly (see ProjectBoard's filters prop).
const PROJECTS_BASE: {
  name: string;
  ownerImage: string;
  status: IdeaStatus;
  scope: "Global" | "Department";
  department: string;
  total: string;
  type: "extern" | "intern";
  sponsors: string[];
  members: number;
  moneyRaised: number;
  moneyNeeded: number;
  daysElapsed: number;
  daysTotal: number;
}[] = [
  {
    name: "Neighborhood Cleanup Drive",
    ownerImage: memberNadia,
    status: "draft",
    scope: "Department",
    department: "Social Work",
    total: "20K MAD",
    type: "intern",
    sponsors: ["Salma"],
    members: 10,
    moneyRaised: 0,
    moneyNeeded: 20,
    daysElapsed: 0,
    daysTotal: 25,
  },
  {
    name: "Youth Leadership Summit",
    ownerImage: memberAmine,
    status: "approved",
    scope: "Global",
    department: "Political Training",
    total: "450K MAD",
    type: "extern",
    sponsors: ["Youssef", "Mehdi"],
    members: 32,
    moneyRaised: 300,
    moneyNeeded: 450,
    daysElapsed: 40,
    daysTotal: 90,
  },
  {
    name: "Digital Skills Academy",
    ownerImage: memberNadia,
    status: "approved",
    scope: "Global",
    department: "Tech",
    total: "180K MAD",
    type: "intern",
    sponsors: ["Salma"],
    members: 18,
    moneyRaised: 120,
    moneyNeeded: 180,
    daysElapsed: 55,
    daysTotal: 60,
  },
  {
    name: "Green Campus Initiative",
    ownerImage: memberKarim,
    status: "submitted",
    scope: "Department",
    department: "Social Work",
    total: "90K MAD",
    type: "intern",
    sponsors: ["Youssef", "Salma"],
    members: 14,
    moneyRaised: 40,
    moneyNeeded: 90,
    daysElapsed: 10,
    daysTotal: 45,
  },
  {
    name: "Civic Tech Hackathon",
    ownerImage: memberNadia,
    status: "approved",
    scope: "Global",
    department: "Tech",
    total: "300K MAD",
    type: "extern",
    sponsors: ["Mehdi"],
    members: 25,
    moneyRaised: 210,
    moneyNeeded: 300,
    daysElapsed: 20,
    daysTotal: 50,
  },
  {
    name: "Rural Library Project",
    ownerImage: memberKarim,
    status: "submitted",
    scope: "Department",
    department: "Culture & Arts",
    total: "60K MAD",
    type: "intern",
    sponsors: ["Salma", "Youssef"],
    members: 16,
    moneyRaised: 15,
    moneyNeeded: 60,
    daysElapsed: 5,
    daysTotal: 30,
  },
  {
    name: "Youth Podcast Network",
    ownerImage: memberAmine,
    status: "approved",
    scope: "Department",
    department: "Media & Communication",
    total: "100K MAD",
    type: "extern",
    sponsors: ["Youssef"],
    members: 12,
    moneyRaised: 80,
    moneyNeeded: 100,
    daysElapsed: 70,
    daysTotal: 80,
  },
  {
    name: "Solar Schools Initiative",
    ownerImage: memberNadia,
    status: "submitted",
    scope: "Global",
    department: "Tech",
    total: "900K MAD",
    type: "extern",
    sponsors: ["Mehdi", "Salma"],
    members: 48,
    moneyRaised: 500,
    moneyNeeded: 900,
    daysElapsed: 12,
    daysTotal: 120,
  },
  {
    name: "Women in Tech Bootcamp",
    ownerImage: memberKarim,
    status: "approved",
    scope: "Department",
    department: "Tech",
    total: "60K MAD",
    type: "intern",
    sponsors: ["Salma"],
    members: 30,
    moneyRaised: 60,
    moneyNeeded: 60,
    daysElapsed: 58,
    daysTotal: 60,
  },
  {
    name: "National Debate League",
    ownerImage: memberAmine,
    status: "submitted",
    scope: "Global",
    department: "Political Training",
    total: "70K MAD",
    type: "intern",
    sponsors: ["Youssef", "Mehdi"],
    members: 20,
    moneyRaised: 25,
    moneyNeeded: 70,
    daysElapsed: 3,
    daysTotal: 40,
  },
  {
    name: "Regional Youth Forum",
    ownerImage: memberNadia,
    status: "regional_review",
    scope: "Department",
    department: "Organization",
    total: "50K MAD",
    type: "intern",
    sponsors: ["Salma"],
    members: 22,
    moneyRaised: 30,
    moneyNeeded: 50,
    daysElapsed: 18,
    daysTotal: 35,
  },
  {
    name: "National Innovation Challenge",
    ownerImage: memberAmine,
    status: "national_review",
    scope: "Global",
    department: "Tech",
    total: "400K MAD",
    type: "extern",
    sponsors: ["Mehdi", "Youssef"],
    members: 40,
    moneyRaised: 250,
    moneyNeeded: 400,
    daysElapsed: 60,
    daysTotal: 100,
  },
  {
    name: "Street Art Festival",
    ownerImage: memberKarim,
    status: "rejected",
    scope: "Department",
    department: "Culture & Arts",
    total: "35K MAD",
    type: "intern",
    sponsors: ["Salma"],
    members: 11,
    moneyRaised: 5,
    moneyNeeded: 35,
    daysElapsed: 8,
    daysTotal: 20,
  },
  {
    name: "Cross-Border Volunteer Exchange",
    ownerImage: memberNadia,
    status: "regional_review",
    scope: "Global",
    department: "Social Work",
    total: "120K MAD",
    type: "extern",
    sponsors: ["Youssef", "Mehdi"],
    members: 27,
    moneyRaised: 70,
    moneyNeeded: 120,
    daysElapsed: 25,
    daysTotal: 55,
  },
  {
    name: "Youth Policy Lab",
    ownerImage: memberAmine,
    status: "national_review",
    scope: "Department",
    department: "Political Training",
    total: "80K MAD",
    type: "intern",
    sponsors: ["Salma", "Mehdi"],
    members: 15,
    moneyRaised: 55,
    moneyNeeded: 80,
    daysElapsed: 33,
    daysTotal: 45,
  },
];

// Only 3 avatars exist as assets, so member entries cycle through this pool
// rather than needing a unique image per person — fine for mock detail data.
const MEMBER_POOL = [
  { first: "Amine", last: "Tazi", image: memberAmine },
  { first: "Nadia", last: "Chraibi", image: memberNadia },
  { first: "Karim", last: "Ouazzani", image: memberKarim },
];

const ROLE_POOL = ["Coordinator", "Content Lead", "Logistics", "Design Lead", "Outreach", "Finance Lead"];


// Deterministic mock generator, keyed by the project's own index — avoids
// hand-authoring a member list for all 15 projects. Renders every member
// (10-50 per project) — .project-board-detail-left scrolls internally once
// the list is taller than the panel.
function buildMemberList(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => {
    const person = MEMBER_POOL[(seed + i) % MEMBER_POOL.length];
    return {
      ...person,
      joinDate: `202${((seed + i) % 4) + 2}-${String(((seed + i * 3) % 12) + 1).padStart(2, "0")}-${String(
        ((seed + i * 5) % 27) + 1
      ).padStart(2, "0")}`,
      role: ROLE_POOL[(seed + i * 2) % ROLE_POOL.length],
      openTasks: ((seed + i * 3) % 5) + 1,
      activity: buildActivityGrid(seed + i * 11),
    };
  });
}

// Per-member tasks — clicking a member reveals these. assignedFrom is
// always the project owner (they hand the task out), assignedTo is the
// member themselves, so "from who to who" is explicit on each task.
const TASK_TITLES = [
  "Draft outline",
  "Book venue",
  "Collect signatures",
  "Review budget",
  "Send invites",
  "Prepare materials",
  "Coordinate volunteers",
  "Final walkthrough",
];
const TASK_DESCRIPTIONS = [
  "Needs sign-off before moving to the next step.",
  "Coordinate with the regional office first.",
  "Waiting on confirmation from the department.",
  "Double-check numbers against the latest budget sheet.",
  "Keep it short — just the essentials.",
  "Match the format used last time.",
  "Loop in the coordinator before finalizing.",
  "Cross-check against the sponsor's requirements.",
];
const TASK_STATUSES = ["done", "pending", "late"] as const;
const DELAY_REASONS = [
  "Waiting on sponsor approval",
  "Vendor delay",
  "Missing documents",
  "Scheduling conflict",
];

function buildTasks(count: number, seed: number, assignedFrom: string, assignedTo: string) {
  return Array.from({ length: count }, (_, i) => {
    const status = TASK_STATUSES[(seed + i) % TASK_STATUSES.length];
    return {
      title: TASK_TITLES[(seed + i) % TASK_TITLES.length],
      description: TASK_DESCRIPTIONS[(seed + i * 2) % TASK_DESCRIPTIONS.length],
      date: `202${((seed + i) % 4) + 2}-${String(((seed + i * 3) % 12) + 1).padStart(2, "0")}-${String(
        ((seed + i * 5) % 27) + 1
      ).padStart(2, "0")}`,
      status,
      assignedFrom,
      assignedTo,
      delayReason: status === "late" ? DELAY_REASONS[(seed + i) % DELAY_REASONS.length] : undefined,
    };
  });
}

// Tasks-per-day activity heatmap (GitHub contribution graph style) — no
// real day-by-day history exists (only a handful of dated tasks per
// member), so both the level AND the tasks shown on hover are synthetic
// but deterministic, same spirit as the rest of this file's mock
// generators. 5 levels (0 = none), same shape as the reference's 5-swatch
// key; each non-zero cell gets `level` mock tasks for the hover tooltip.
const HEATMAP_WEEKS = 20;
function buildActivityGrid(seed: number) {
  return Array.from({ length: HEATMAP_WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const level = (seed + w * 7 + d * 3) % 5;
      const cellSeed = seed + w * 7 + d;
      const tasks = Array.from({ length: level }, (_, t) => ({
        title: TASK_TITLES[(cellSeed + t * 2) % TASK_TITLES.length],
        status: TASK_STATUSES[(cellSeed + t) % TASK_STATUSES.length],
      }));
      return { level, tasks };
    })
  );
}

// Per-sponsor invoices. company is a placeholder for now (no real per-sponsor
// company data yet). items is a 3-way split of amount into mock categories —
// there's no real line-item data either, so this invents a plausible
// breakdown that sums back to the invoice's own total.
const INVOICE_STATUSES = ["paid", "pending", "overdue"] as const;
const INVOICE_CATEGORIES = ["UI/UX", "Development", "Logistics", "Printing", "Venue", "Marketing"];
const COMPANY_PLACEHOLDERS = ["BrightWave", "Atlas Group", "Northline Co.", "Cedar Partners"];

function buildInvoices(seed: number) {
  const count = (seed % 6) + 1; // 1-6, so some sponsors actually have enough to test the "load more" pagination below
  return Array.from({ length: count }, (_, i) => {
    const amount = (((seed + i * 7) % 15) + 1) * 5;
    const ratios = [0.4, 0.35, 0.25];
    const catStart = (seed + i) % INVOICE_CATEGORIES.length;
    const items = ratios.map((r, k) => ({
      label: INVOICE_CATEGORIES[(catStart + k) % INVOICE_CATEGORIES.length],
      amount: Math.round(amount * r),
    }));
    items[items.length - 1].amount += amount - items.reduce((s, it) => s + it.amount, 0); // fix rounding drift so items sum exactly to amount
    return {
      id: `INV-${1000 + seed * 7 + i * 13}`,
      company: COMPANY_PLACEHOLDERS[(seed + i) % COMPANY_PLACEHOLDERS.length],
      amount,
      date: `202${((seed + i) % 4) + 2}-${String(((seed + i * 3) % 12) + 1).padStart(2, "0")}-${String(
        ((seed + i * 5) % 27) + 1
      ).padStart(2, "0")}`,
      status: INVOICE_STATUSES[(seed + i) % INVOICE_STATUSES.length],
      items,
    };
  });
}

// Chart 1 — the "global" chart: Money/Time/Tasks all plotted together on
// one shared timeline, each normalized to 0-100% so 3 different units
// (K MAD, days, task count) can share one y-axis. There's no real
// historical data (only current totals), so each series is an eased ramp
// from 0 up to today's real value — honest about "where it ends up", not a
// claim about the actual day-by-day history.
const GLOBAL_CHART_POINTS = 7;

function buildGlobalSeries(project: (typeof PROJECTS)[number]) {
  const totalTasks = project.memberList.reduce((s, m) => s + m.tasks.length, 0);
  const doneTasks = project.memberList.reduce(
    (s, m) => s + m.tasks.filter((t) => t.status === "done").length,
    0
  );
  const moneyTarget = Math.min(100, (project.moneyRaised / project.moneyNeeded) * 100);
  const timeTarget = Math.min(100, (project.daysElapsed / project.daysTotal) * 100);
  const tasksTarget = totalTasks ? Math.min(100, (doneTasks / totalTasks) * 100) : 0;

  return Array.from({ length: GLOBAL_CHART_POINTS }, (_, i) => {
    const t = i / (GLOBAL_CHART_POINTS - 1);
    const ease = Math.pow(t, 0.7); // gentle ease-in so the ramp isn't a flat diagonal
    return {
      day: Math.round(t * project.daysTotal),
      money: Math.round(moneyTarget * ease),
      time: Math.round(timeTarget * ease),
      tasks: Math.round(tasksTarget * ease),
    };
  });
}

// ownerImage already picks one of these three people per project — this
// just maps the image back to the name that goes with it, matching
// GlobalStats' member captions (Amine Tazi/Nadia Chraibi/Karim Ouazzani).
const OWNER_NAME_BY_IMAGE = new Map([
  [memberAmine, "Amine Tazi"],
  [memberKarim, "Karim Ouazzani"],
  [memberNadia, "Nadia Chraibi"],
]);

const PROJECTS = PROJECTS_BASE.map((project, i) => {
  const ownerName = OWNER_NAME_BY_IMAGE.get(project.ownerImage) ?? "";
  const memberList = buildMemberList(project.members, i).map((member, j) => ({
    ...member,
    // assignedFrom/assignedTo make the "from who to who" explicit on each
    // task — the owner hands it to this member.
    tasks: buildTasks(member.openTasks, i + j, ownerName, `${member.first} ${member.last}`),
  }));
  // sponsors is just names (no image data) — cycle the same avatar pool used
  // for members, keyed off the project so it's stable across renders.
  const sponsorList = project.sponsors.map((name, j) => ({
    name,
    image: MEMBER_POOL[(i + j) % MEMBER_POOL.length].image,
    invoices: buildInvoices(i + j + 1),
  }));
  return { ...project, ownerName, memberList, sponsorList };
});

// Main filter bar's "In Review" bucket merges these two real IdeaStatus
// values — everything else is a direct 1:1 lowercase match. Once "In
// Review" is picked, reviewStage ("Regional review"/"National review") can
// narrow it further to just one of the two real statuses underneath it.
function matchesStatus(project: (typeof PROJECTS)[number], statusFilter: string, reviewStage = ""): boolean {
  if (!statusFilter) return true;
  if (statusFilter === "In Review") {
    if (reviewStage === "Regional review") return project.status === "regional_review";
    if (reviewStage === "National review") return project.status === "national_review";
    return project.status === "regional_review" || project.status === "national_review";
  }
  return project.status === statusFilter.toLowerCase();
}

// Same labels as ProjectFilterBar's STATUS_OPTIONS — regional_review and
// national_review both read as "In Review" here too, for the same reason
// matchesStatus merges them.
const STATUS_LABEL: Record<IdeaStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  regional_review: "In Review",
  national_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
};

// The board's own quick-status buttons — kept for the pill UI, but they now
// just write into the same shared `filters.status` the main filter bar
// reads/writes, instead of keeping a second, separate status state.
const QUICK_STATUS_TABS = [
  { key: "", label: "All" },
  { key: "Draft", label: "Draft" },
  { key: "Submitted", label: "Submitted" },
  { key: "Approved", label: "Approved" },
];

export function ProjectBoard({
  filters,
  onChange,
}: {
  filters: ProjectFilters;
  onChange: (patch: Partial<ProjectFilters>) => void;
}) {
  const visibleProjects = PROJECTS.filter(
    (p) =>
      (!filters.scope || p.scope === filters.scope) &&
      (!filters.department || p.department === filters.department) &&
      (!filters.type || p.type === filters.type.toLowerCase()) &&
      matchesStatus(p, filters.status, filters.reviewStage)
  );
  const activeFilterLabel = [filters.scope, filters.department, filters.type, filters.reviewStage || filters.status]
    .filter(Boolean)
    .join(" · ");
  // Project capsules render 3 at a time, same idea as the member list's
  // 5-at-a-time — reset back to 3 whenever the active filters change, so a
  // new search doesn't stay expanded from a previous one.
  const [visibleProjectCount, setVisibleProjectCount] = useState(3);
  useEffect(() => {
    setVisibleProjectCount(3);
  }, [filters.scope, filters.department, filters.type, filters.status, filters.reviewStage]);
  // Clicking the capsule, or either pill inside it, all select the same
  // project — the right-hand detail panel renders whichever is selected.
  // stopPropagation on the two pills so clicking one doesn't also count as
  // clicking the capsule underneath it (same handler either way, but keeps
  // event handling honest).
  const [selectedName, setSelectedName] = useState<string | null>(null);
  // Members render 5 at a time — reset back to 5 every time a different
  // project gets selected, so switching projects doesn't leave a huge list
  // expanded from a previous click.
  const [visibleMemberCount, setVisibleMemberCount] = useState(5);
  // Clicking a member expands their task list (title/description/date/
  // status/assignedFrom→assignedTo/delayReason) right under that row — only
  // one open at a time, keyed by index within the member list.
  const [expandedMemberIndex, setExpandedMemberIndex] = useState<number | null>(null);
  // Legend toggle for the Chart 1 global chart — all 3 series on by default.
  const [visibleSeries, setVisibleSeries] = useState({ money: true, time: true, tasks: true });
  // Which invoice is "opened" (sponsor name + its index in that sponsor's
  // invoice list) — replaces the flat invoice list with that one invoice's
  // detail view until closed.
  const [openInvoice, setOpenInvoice] = useState<{ sponsorName: string; index: number } | null>(null);
  // Remaining-invoices list is paginated per sponsor, 3 at a time — keyed by
  // sponsor name since each sponsor's own invoice count varies.
  const [visibleInvoiceCounts, setVisibleInvoiceCounts] = useState<Record<string, number>>({});
  // Heatmap cell tooltip — position:fixed + real screen coordinates (from
  // the hovered cell's own bounding box) instead of position:absolute,
  // since the heatmap's own overflow-x:auto clips anything that pops
  // outside its box (including upward/downward). Fixed positioning escapes
  // that entirely, rendering as a true top layer above everything.
  const [heatmapTooltip, setHeatmapTooltip] = useState<{
    x: number;
    y: number;
    tasks: { title: string; status: string }[];
  } | null>(null);
  // Auto-select the first visible project whenever there's no selection, or
  // the current selection just filtered itself out of view — the purple
  // panel then always has something to show instead of the "click a
  // project" prompt.
  useEffect(() => {
    if (visibleProjects.length === 0) return;
    if (!selectedName || !visibleProjects.some((p) => p.name === selectedName)) {
      setSelectedName(visibleProjects[0].name);
      setVisibleMemberCount(5);
      setExpandedMemberIndex(null);
      setOpenInvoice(null);
      setVisibleInvoiceCounts({});
    }
  }, [visibleProjects, selectedName]);
  const selectProject = (name: string) => () => {
    setSelectedName(name);
    setVisibleMemberCount(5);
    setExpandedMemberIndex(null);
    setOpenInvoice(null);
    setVisibleInvoiceCounts({});
  };
  const selectProjectFromPill = (name: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSelectedName(name);
    setVisibleMemberCount(5);
    setExpandedMemberIndex(null);
    setOpenInvoice(null);
    setVisibleInvoiceCounts({});
  };
  const selectedProject = PROJECTS.find((p) => p.name === selectedName) ?? null;

  return (
    <div className="project-board-wrap">
      {/* Sits outside the navy box now — a separate block stacked directly
          on top of it, zero gap, instead of overlapping into its padding. */}
      <div className="project-board-tabs">
        {QUICK_STATUS_TABS.map((tab) => (
          <button
            key={tab.key || "all"}
            type="button"
            className={`project-board-tab${filters.status === tab.key ? " active" : ""}`}
            onClick={() => onChange({ status: tab.key })}
          >
            {tab.label}
            <span className="project-board-tab-count">
              {tab.key
                ? PROJECTS.filter((p) => matchesStatus(p, tab.key)).length
                : PROJECTS.length}
            </span>
          </button>
        ))}
      </div>

      {/* Only shows up once "In Review" is active — the sub-filter that
          narrows it to one of the two real statuses it merges. */}
      {filters.status === "In Review" && (
        <div className="project-board-substatus-row">
          <button
            type="button"
            className={`project-board-substatus${!filters.reviewStage ? " active" : ""}`}
            onClick={() => onChange({ reviewStage: "" })}
          >
            All
          </button>
          {REVIEW_STAGE_OPTIONS.map((stage) => (
            <button
              key={stage}
              type="button"
              className={`project-board-substatus${filters.reviewStage === stage ? " active" : ""}`}
              onClick={() => onChange({ reviewStage: stage })}
            >
              {stage}
            </button>
          ))}
        </div>
      )}

      <div className="project-board">
        <div className="project-board-side project-board-side-left">
          <span className="project-board-side-title-text">Projects</span>
        </div>
        <div className="project-board-side-accent-black project-board-side-accent-black-left" />
        <div className="project-board-side-accent project-board-side-accent-left" />
        <div className="project-board-side project-board-side-right" />
        <div className="project-board-side-accent-black project-board-side-accent-black-right" />
        <div className="project-board-side-accent project-board-side-accent-right" />
        {/* Positioned relative to .project-board now (same as the side
            rectangles above), instead of the pill's wrapper — that's what
            guarantees they land exactly on the green rectangles with no
            coordinate-system mismatch. */}
        <span className="project-board-tab-curve-left">
          <span className="project-board-tab-curve-base" />
          <span className="project-board-tab-curve-bulge" />
          <span className="project-board-tab-curve-scoop" />
        </span>
        <span className="project-board-tab-curve-right">
          <span className="project-board-tab-curve-base" />
          <span className="project-board-tab-curve-bulge" />
          <span className="project-board-tab-curve-scoop" />
        </span>
        <div className="project-board-columns">
          <div className="project-board-list">
            <div className="project-board-list-body">
              {visibleProjects.length === 0 && (
                <div className="project-board-empty">
                  No projects{activeFilterLabel ? ` for "${activeFilterLabel}"` : ""} yet.
                </div>
              )}
              {visibleProjects.slice(0, visibleProjectCount).map((project) => {
                const moneyPct = Math.min(100, (project.moneyRaised / project.moneyNeeded) * 100);
                const timePct = Math.min(100, (project.daysElapsed / project.daysTotal) * 100);
                return (
                  <div
                    key={project.name}
                    className={`project-capsule${selectedName === project.name ? " selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={selectProject(project.name)}
                    onKeyDown={(e) => e.key === "Enter" && selectProject(project.name)()}
                  >
                    <div className="project-capsule-row">
                      <img className="project-capsule-avatar" src={project.ownerImage} alt="" />
                      <span className="project-capsule-name">{project.name}</span>
                      <span className={`project-capsule-type project-capsule-type-${project.type}`}>
                        Project type: {project.type}
                      </span>
                      <span className="project-capsule-status-pill">{STATUS_LABEL[project.status]}</span>
                      <span className="project-capsule-scope-pill">
                        {project.scope === "Global" ? "Global" : project.department}
                      </span>
                    </div>
                    <div className="project-capsule-row project-capsule-row-bottom">
                      <div className="project-capsule-pill-stack">
                        <span
                          className="project-capsule-members-pill"
                          role="button"
                          tabIndex={0}
                          onClick={selectProjectFromPill(project.name)}
                          onKeyDown={(e) => e.key === "Enter" && selectProjectFromPill(project.name)(e)}
                        >
                          {project.members} members
                          <span className="project-capsule-pill-divider" />
                          <ChevronDownIcon size={13} strokeWidth={3} className="project-capsule-pill-arrow" />
                        </span>
                        <span
                          className="project-capsule-sponsors-pill"
                          role="button"
                          tabIndex={0}
                          onClick={selectProjectFromPill(project.name)}
                          onKeyDown={(e) => e.key === "Enter" && selectProjectFromPill(project.name)(e)}
                        >
                          {project.sponsors.length} sponsors
                          <span className="project-capsule-pill-divider" />
                          <ChevronDownIcon size={13} strokeWidth={3} className="project-capsule-pill-arrow" />
                        </span>
                      </div>
                      <span className="project-capsule-divider" />
                      <div className="project-capsule-progress-stack">
                        <div className="project-capsule-progress">
                          <span className="project-capsule-progress-label">Money</span>
                          <div className="project-capsule-bar">
                            <div className="project-capsule-bar-fill" style={{ width: `${moneyPct}%` }} />
                          </div>
                          <span className="project-capsule-progress-value">
                            {project.moneyRaised}K / {project.moneyNeeded}K
                          </span>
                        </div>
                        <div className="project-capsule-progress">
                          <span className="project-capsule-progress-label">Time</span>
                          <div className="project-capsule-bar">
                            <div className="project-capsule-bar-fill project-capsule-bar-fill-time" style={{ width: `${timePct}%` }} />
                          </div>
                          <span className="project-capsule-progress-value">
                            {project.daysElapsed}d / {project.daysTotal}d
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(visibleProjectCount > 3 || visibleProjectCount < visibleProjects.length) && (
                <div className="project-board-load-row">
                  {visibleProjectCount > 3 && (
                    <button
                      type="button"
                      className="project-board-load-more"
                      onClick={() => setVisibleProjectCount((n) => Math.max(3, n - 3))}
                    >
                      Load less
                    </button>
                  )}
                  {visibleProjectCount < visibleProjects.length && (
                    <button
                      type="button"
                      className="project-board-load-more"
                      onClick={() => setVisibleProjectCount((n) => n + 3)}
                    >
                      Load more
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Right column — mirrors the reference's "Invoice details" panel.
              Has its own left/right split: left is the selected project's
              member list (built here), right is still TBD (see
              PLATFORM-SECTIONS.md discussion) — not built yet. */}
          <div className="project-board-detail">
            <div className="project-board-detail-left">
              {!selectedProject && (
                <div className="project-detail-empty">Click a project to see its members.</div>
              )}
              {selectedProject &&
                (() => {
                  const openedMember =
                    expandedMemberIndex !== null ? selectedProject.memberList[expandedMemberIndex] : null;

                  // Opening a member fully replaces this whole section (header
                  // row, member list) — same pattern as opening an invoice —
                  // instead of expanding their tasks inline under their row.
                  if (openedMember) {
                    return (
                      <>
                        <button
                          type="button"
                          className="project-detail-invoice-back"
                          onClick={() => setExpandedMemberIndex(null)}
                        >
                          ← Back to Members
                        </button>
                        {/* Header mirrors .project-detail-invoice-detail-header's
                            structure — name pill left, role + joined date on
                            the far right. Rest of the body still TBD. */}
                        <div className="project-detail-invoice-detail-header">
                          <div className="project-detail-owner">
                            <img className="project-detail-owner-avatar" src={openedMember.image} alt="" />
                            <span className="project-detail-owner-name">
                              {openedMember.first} {openedMember.last}
                            </span>
                          </div>
                          <div className="project-detail-member-header-meta">
                            <span className="project-detail-invoice-company">Role: {openedMember.role}</span>
                            <span className="project-detail-invoice-company">
                              Joined {openedMember.joinDate}
                            </span>
                          </div>
                        </div>

                        <div className="project-detail-section-header">
                          <span className="project-detail-heading">Activity</span>
                          <span className="project-detail-total-pill">
                            Total tasks: {openedMember.tasks.length}
                          </span>
                        </div>
                        <div className="project-detail-heatmap">
                          {openedMember.activity.map((week, w) => (
                            <div key={w} className="project-detail-heatmap-week">
                              {week.map((cell, d) => (
                                <span
                                  key={d}
                                  className={`project-detail-heatmap-cell project-detail-heatmap-level-${cell.level}`}
                                  onMouseEnter={(e) => {
                                    const r = e.currentTarget.getBoundingClientRect();
                                    setHeatmapTooltip({ x: r.left + r.width / 2, y: r.top, tasks: cell.tasks });
                                  }}
                                  onMouseLeave={() => setHeatmapTooltip(null)}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                        {heatmapTooltip && (
                          <div
                            className="project-detail-heatmap-tooltip"
                            style={{ left: heatmapTooltip.x, top: heatmapTooltip.y }}
                          >
                            {heatmapTooltip.tasks.length === 0 ? (
                              <span>No tasks</span>
                            ) : (
                              heatmapTooltip.tasks.map((t, ti) => (
                                <span key={ti} className="project-detail-heatmap-tooltip-line">
                                  {t.title} — {t.status}
                                </span>
                              ))
                            )}
                          </div>
                        )}
                        <div className="project-detail-heatmap-key">
                          <span className="project-detail-heatmap-key-label">Less</span>
                          {[0, 1, 2, 3, 4].map((level) => (
                            <span
                              key={level}
                              className={`project-detail-heatmap-cell project-detail-heatmap-level-${level}`}
                            />
                          ))}
                          <span className="project-detail-heatmap-key-label">More</span>
                        </div>
                      </>
                    );
                  }

                  return (
                    <>
                      <div className="project-detail-section-header">
                        <span className="project-detail-heading">Members:</span>
                        <span className="project-detail-total-pill">
                          Total members: {selectedProject.memberList.length}
                        </span>
                      </div>
                      {selectedProject.memberList.slice(0, visibleMemberCount).map((member, i, shown) => (
                        <div key={`${member.first}-${member.last}-${i}`}>
                          <div
                            className="project-detail-member"
                            role="button"
                            tabIndex={0}
                            onClick={() => setExpandedMemberIndex(i)}
                            onKeyDown={(e) => e.key === "Enter" && setExpandedMemberIndex(i)}
                          >
                            <img className="project-detail-member-avatar" src={member.image} alt="" />
                            <div className="project-detail-member-info">
                              <div className="project-detail-member-row">
                                <span className="project-detail-member-name">
                                  {member.first} {member.last}
                                </span>
                                <span className="project-detail-member-meta">Joined {member.joinDate}</span>
                              </div>
                              <div className="project-detail-member-row">
                                <span className="project-detail-member-role">Role: {member.role}</span>
                                <span className="project-detail-member-tasks-btn">
                                  {member.openTasks} open tasks
                                </span>
                              </div>
                            </div>
                          </div>
                          {i < shown.length - 1 && <div className="project-detail-member-divider" />}
                        </div>
                      ))}
                      {(visibleMemberCount > 5 || visibleMemberCount < selectedProject.memberList.length) && (
                        <div className="project-detail-load-row">
                          {visibleMemberCount > 5 && (
                            <button
                              type="button"
                              className="project-detail-load-more"
                              onClick={() => setVisibleMemberCount((n) => Math.max(5, n - 5))}
                            >
                              Load less
                            </button>
                          )}
                          {visibleMemberCount < selectedProject.memberList.length && (
                            <button
                              type="button"
                              className="project-detail-load-more"
                              onClick={() => setVisibleMemberCount((n) => n + 5)}
                            >
                              Load more
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
            </div>
            <div className="project-board-detail-right">
              {!selectedProject && (
                <div className="project-detail-empty">Click a project to see its details.</div>
              )}
              {selectedProject && (
                <>
                  <span className="project-detail-heading">Project owner:</span>
                  <div className="project-detail-owner-row">
                    <div className="project-detail-owner">
                      <img className="project-detail-owner-avatar" src={selectedProject.ownerImage} alt="" />
                      <span className="project-detail-owner-name">{selectedProject.ownerName}</span>
                    </div>
                    <div className="project-detail-owner-badges">
                      <span
                        className={`project-capsule-type project-capsule-type-${selectedProject.type}`}
                      >
                        Project type: {selectedProject.type}
                      </span>
                      <span className="project-capsule-status-pill">{STATUS_LABEL[selectedProject.status]}</span>
                    </div>
                  </div>
                  <div className="project-detail-progress-stack">
                    <div className="project-capsule-progress">
                      <span className="project-capsule-progress-label">Money</span>
                      <div className="project-capsule-bar">
                        <div
                          className="project-capsule-bar-fill"
                          style={{
                            width: `${Math.min(100, (selectedProject.moneyRaised / selectedProject.moneyNeeded) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="project-capsule-progress-value">
                        {selectedProject.moneyRaised}K / {selectedProject.moneyNeeded}K
                      </span>
                    </div>
                    <div className="project-capsule-progress">
                      <span className="project-capsule-progress-label">Time</span>
                      <div className="project-capsule-bar">
                        <div
                          className="project-capsule-bar-fill project-capsule-bar-fill-time"
                          style={{
                            width: `${Math.min(100, (selectedProject.daysElapsed / selectedProject.daysTotal) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="project-capsule-progress-value">
                        {selectedProject.daysElapsed}d / {selectedProject.daysTotal}d
                      </span>
                    </div>
                  </div>

                  {/* Chart 1 — "global": Money/Time/Tasks together on one
                      shared, toggleable chart instead of 3 separate widgets. */}
                  {(() => {
                    const series = buildGlobalSeries(selectedProject);
                    const padL = 30;
                    const padR = 8;
                    const padT = 12;
                    const padB = 20;
                    const w = 520;
                    const h = 190;
                    const plotW = w - padL - padR;
                    const plotH = h - padT - padB;
                    const x = (i: number) => padL + (i / (series.length - 1)) * plotW;
                    const y = (v: number) => padT + ((100 - v) / 100) * plotH;
                    const linePath = (key: "money" | "time" | "tasks") =>
                      series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p[key])}`).join(" ");
                    const areaPath = (key: "money" | "time" | "tasks") =>
                      `${linePath(key)} L${x(series.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;

                    return (
                      <div className="project-global-chart">
                        <div className="project-global-chart-legend">
                          {(
                            [
                              { key: "money", label: "Money", color: "#caa849" },
                              { key: "time", label: "Time", color: "hsl(222 46% 15%)" },
                              { key: "tasks", label: "Tasks", color: "#6659ea" },
                            ] as const
                          ).map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              className={`project-global-chart-legend-btn${visibleSeries[s.key] ? "" : " off"}`}
                              onClick={() => setVisibleSeries((cur) => ({ ...cur, [s.key]: !cur[s.key] }))}
                            >
                              <span className="project-global-chart-legend-dot" style={{ background: s.color }} />
                              {s.label}
                            </button>
                          ))}
                        </div>
                        <svg
                          className="project-global-chart-svg"
                          viewBox={`0 0 ${w} ${h}`}
                          preserveAspectRatio="none"
                        >
                          {[0, 25, 50, 75, 100].map((g) => (
                            <line
                              key={g}
                              x1={padL}
                              x2={w - padR}
                              y1={y(g)}
                              y2={y(g)}
                              className="project-global-chart-gridline"
                            />
                          ))}
                          {[0, 25, 50, 75, 100].map((g) => (
                            <text key={g} x={padL - 6} y={y(g) + 3} className="project-global-chart-axis-label">
                              {g}%
                            </text>
                          ))}
                          {series.map((p, i) => (
                            <text
                              key={p.day}
                              x={x(i)}
                              y={h - 4}
                              className="project-global-chart-axis-label project-global-chart-axis-label-x"
                            >
                              d{p.day}
                            </text>
                          ))}
                          {visibleSeries.time && (
                            <path d={areaPath("time")} className="project-global-chart-area-time" />
                          )}
                          {visibleSeries.money && (
                            <path d={areaPath("money")} className="project-global-chart-area-money" />
                          )}
                          {visibleSeries.tasks && (
                            <path d={areaPath("tasks")} className="project-global-chart-area-tasks" />
                          )}
                          {visibleSeries.time && <path d={linePath("time")} className="project-global-chart-line-time" />}
                          {visibleSeries.money && (
                            <path d={linePath("money")} className="project-global-chart-line-money" />
                          )}
                          {visibleSeries.tasks && (
                            <path d={linePath("tasks")} className="project-global-chart-line-tasks" />
                          )}
                        </svg>
                      </div>
                    );
                  })()}

                  <div className="project-detail-divider" />

                  {/* Opening an invoice fully replaces this whole section
                      (header row, sponsor list, remaining-invoices list) —
                      not just something appended under the clicked row. */}
                  {(() => {
                    const openedSponsor = openInvoice
                      ? selectedProject.sponsorList.find((s) => s.name === openInvoice.sponsorName)
                      : null;
                    const openedInvoice = openedSponsor ? openedSponsor.invoices[openInvoice!.index] : null;

                    if (openedSponsor && openedInvoice) {
                      return (
                        <>
                          <button
                            type="button"
                            className="project-detail-invoice-back"
                            onClick={() => setOpenInvoice(null)}
                          >
                            ← Back to invoices
                          </button>
                          <div className="project-detail-invoice-detail-header">
                            <div className="project-detail-invoice-id-block">
                              <span className="project-detail-invoice-id">#{openedInvoice.id}</span>
                              <span
                                className={`project-detail-invoice-status project-detail-invoice-status-${openedInvoice.status}`}
                              >
                                {openedInvoice.status}
                              </span>
                            </div>
                            <span className="project-detail-invoice-company">
                              Company: {openedInvoice.company}
                            </span>
                            <div className="project-detail-owner">
                              <img className="project-detail-owner-avatar" src={openedSponsor.image} alt="" />
                              <span className="project-detail-owner-name">{openedSponsor.name}</span>
                            </div>
                          </div>

                          <span className="project-detail-progress-label-sm">Invoice details</span>
                          <div className="project-detail-invoice-items">
                            {openedInvoice.items.map((item) => (
                              <div key={item.label} className="project-detail-invoice-item">
                                <span className="project-detail-invoice-item-label">{item.label}</span>
                                <span className="project-detail-invoice-item-amount">{item.amount}K MAD</span>
                              </div>
                            ))}
                          </div>

                          <div className="project-detail-invoice-total-row">
                            <span>
                              Total: {openedInvoice.amount}K MAD
                            </span>
                          </div>
                        </>
                      );
                    }

                    // One block per sponsor: name+avatar on the left (shown
                    // once), all of that sponsor's own invoices stacked to
                    // the right (not split between a "first one up top" row
                    // and "the rest" further down) — 3 at a time, with
                    // load more/less, then a divider before the next
                    // sponsor's block.
                    return (
                      <>
                        <div className="project-detail-section-header">
                          <div className="project-detail-heading-group">
                            <span className="project-detail-heading">Sponsors:</span>
                            <span className="project-detail-heading">Invoices:</span>
                          </div>
                          <span className="project-detail-total-pill">
                            Total sponsors: {selectedProject.sponsorList.length}
                          </span>
                        </div>
                        <div className="project-detail-invoices">
                          {selectedProject.sponsorList.map((sponsor, si) => {
                            const visibleCount = visibleInvoiceCounts[sponsor.name] ?? 3;
                            const shown = sponsor.invoices.slice(0, visibleCount);
                            const setCount = (n: number) =>
                              setVisibleInvoiceCounts((cur) => ({ ...cur, [sponsor.name]: n }));

                            return (
                              <div key={sponsor.name}>
                                <div className="project-detail-sponsor-invoice-block">
                                  <div className="project-detail-owner">
                                    <img className="project-detail-owner-avatar" src={sponsor.image} alt="" />
                                    <span className="project-detail-owner-name">{sponsor.name}</span>
                                  </div>
                                  <div className="project-detail-invoice-rows">
                                    {shown.map((invoice, i) => (
                                      <div key={i} className="project-detail-invoice">
                                        <span className="project-detail-invoice-amount">
                                          {invoice.amount}K MAD
                                        </span>
                                        <span className="project-detail-invoice-date">{invoice.date}</span>
                                        <span
                                          className={`project-detail-invoice-status project-detail-invoice-status-${invoice.status}`}
                                        >
                                          {invoice.status}
                                        </span>
                                        <button
                                          type="button"
                                          className="project-detail-invoice-open-btn"
                                          onClick={() => setOpenInvoice({ sponsorName: sponsor.name, index: i })}
                                        >
                                          Open →
                                        </button>
                                      </div>
                                    ))}
                                    {(visibleCount > 3 || visibleCount < sponsor.invoices.length) && (
                                      <div className="project-detail-load-row">
                                        {visibleCount > 3 && (
                                          <button
                                            type="button"
                                            className="project-detail-load-more"
                                            onClick={() => setCount(Math.max(3, visibleCount - 3))}
                                          >
                                            Load less
                                          </button>
                                        )}
                                        {visibleCount < sponsor.invoices.length && (
                                          <button
                                            type="button"
                                            className="project-detail-load-more"
                                            onClick={() => setCount(visibleCount + 3)}
                                          >
                                            Load more
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {si < selectedProject.sponsorList.length - 1 && (
                                  <div className="project-detail-divider" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
