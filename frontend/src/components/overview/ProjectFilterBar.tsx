import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "../icons";

// Rebuild of the reference invoice filter bar (customers/status/date-range/
// invoice#), retargeted at Projects instead of money. The two date pickers
// don't have an equivalent on a project (no billing period), so they're
// replaced with the two other confirmed project axes from README-IDEA-V2 §1:
// scope (global/department) and kind (intern/extern). Status options below
// are a placeholder guess (draft/submitted/in review/approved/rejected) —
// the exact lifecycle stages are still an open decision per that doc.
//
// These four are independent, flat filters (not nested in one another) —
// each one narrows the same underlying project list with straight AND
// logic, applied together in ProjectBoard. Order: scope, department, type,
// status.
export const DEPARTMENT_OPTIONS = [
  "Tech",
  "Media & Communication",
  "Political Training",
  "Social Work",
  "Culture & Arts",
  "Organization",
];

export const STATUS_OPTIONS = ["Draft", "Submitted", "In Review", "Approved", "Rejected"];

export const SCOPE_OPTIONS = ["Global", "Department"];

export const KIND_OPTIONS = ["Intern", "Extern"];

// Only meaningful once status === "In Review" — regional_review/national_review
// are the two real statuses that bucket merges (see ProjectBoard's
// matchesStatus). Not one of the four flat top-level filters; it only
// becomes visible/usable as a sub-filter once "In Review" is picked.
export const REVIEW_STAGE_OPTIONS = ["Regional review", "National review"];

export interface ProjectFilters {
  scope: string;
  department: string;
  type: string;
  status: string;
  reviewStage: string;
}

export const EMPTY_FILTERS: ProjectFilters = { scope: "", department: "", type: "", status: "", reviewStage: "" };

// Custom listbox instead of a native <select> — a native dropdown's popup
// can't be styled (no controlling its own box, the 3px gap below the
// control, or a per-option selected background) consistently across
// browsers, so the option list is just a rendered, positioned div instead.
function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="project-filter-select-wrap" ref={wrapRef}>
      <button
        type="button"
        className={`project-filter-select${value ? "" : " placeholder"}${disabled ? " disabled" : ""}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value || allLabel}
      </button>
      <ChevronDownIcon size={14} className="project-filter-chevron" />

      {open && (
        <div className="project-filter-dropdown" role="listbox">
          <div
            className={`project-filter-option${value === "" ? " selected" : ""}`}
            role="option"
            aria-selected={value === ""}
            onClick={() => choose("")}
          >
            {allLabel}
          </div>
          {options.map((option) => (
            <div
              key={option}
              className={`project-filter-option${value === option ? " selected" : ""}`}
              role="option"
              aria-selected={value === option}
              onClick={() => choose(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectFilterBar({
  filters,
  onChange,
}: {
  filters: ProjectFilters;
  onChange: (patch: Partial<ProjectFilters>) => void;
}) {
  const [search, setSearch] = useState("");

  const activeCount = [filters.scope, filters.department, filters.type, filters.status].filter(Boolean).length;

  return (
    <div className="project-filter-bar">
      <div className="project-filter-active">
        <span>Active filters</span>
        <span className="project-filter-active-count">{activeCount}</span>
      </div>
      <FilterSelect
        value={filters.scope}
        onChange={(v) => onChange({ scope: v })}
        options={SCOPE_OPTIONS}
        allLabel="All scopes"
      />
      <FilterSelect
        value={filters.department}
        onChange={(v) => onChange({ department: v })}
        options={DEPARTMENT_OPTIONS}
        allLabel="All departments"
        disabled={filters.scope === "Global"}
      />
      <FilterSelect
        value={filters.type}
        onChange={(v) => onChange({ type: v })}
        options={KIND_OPTIONS}
        allLabel="All types"
      />
      <FilterSelect
        value={filters.status}
        onChange={(v) => onChange({ status: v })}
        options={STATUS_OPTIONS}
        allLabel="All statuses"
      />
      <div className="project-filter-search">
        <input
          type="text"
          placeholder="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SearchIcon size={16} />
      </div>
    </div>
  );
}
