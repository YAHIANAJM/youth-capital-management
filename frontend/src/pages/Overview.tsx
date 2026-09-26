import { useState } from "react";
import { SectionNav } from "../components/layout/SectionNav";
import { GlobalStats } from "../components/overview/GlobalStats";
import { EMPTY_FILTERS, ProjectFilterBar, ProjectFilters } from "../components/overview/ProjectFilterBar";
import { ProjectBoard } from "../components/overview/ProjectBoard";

const PREVIEW_ITEMS = [
  { key: "overview", label: "Overview", plus: true },
  { key: "projects", label: "Projects" },
  { key: "invoices", label: "Invoices", plus: true },
  { key: "payments", label: "Payments" },
  { key: "recurring", label: "Recurring" },
];

// TEMPORARY — a twin pair of marker squares beside the L's connect point.
export function Overview() {
  const [active, setActive] = useState("invoices");
  // Shared by ProjectFilterBar (writes it) and ProjectBoard (filters its
  // mock list with it) — one filter state driving both, not two separate
  // ones that happen to look similar.
  const [filters, setFilters] = useState<ProjectFilters>(EMPTY_FILTERS);
  const updateFilters = (patch: Partial<ProjectFilters>) =>
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // reviewStage only makes sense while status is "In Review" — drop it
      // the moment status moves away, so it can't silently linger and
      // narrow a filter it no longer belongs to.
      if (patch.status !== undefined && patch.status !== "In Review") next.reviewStage = "";
      // department is disabled (and meaningless) once scope is "Global" —
      // clear it so a stale selection doesn't keep filtering behind a
      // control the user can no longer see or change.
      if (patch.scope === "Global") next.department = "";
      return next;
    });

  return (
    <main className="wireframe">
      <div className="debug-square-2" />
      <div className="debug-square-3" />
      <div className="debug-square" />
      {/* TEMPORARY — SectionNav style preview */}
      <SectionNav items={PREVIEW_ITEMS} activeKey={active} onSelect={setActive} />

      <div className="wireframe-body">
        <GlobalStats />
        <ProjectFilterBar filters={filters} onChange={updateFilters} />
        <ProjectBoard filters={filters} onChange={updateFilters} />
      </div>
    </main>
  );
}
