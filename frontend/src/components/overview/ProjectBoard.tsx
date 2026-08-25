import { useState } from "react";

// Stripped down to the toggle + shell only — the list/detail content below
// didn't match the reference design closely enough, so it's cleared out to
// be rebuilt from scratch against that reference instead of patched.
const TABS = [
  { key: "submitted" as const, label: "Submitted", count: 5 },
  { key: "approved" as const, label: "Approved", count: 3 },
  { key: "raised" as const, label: "Raised", locked: true },
  { key: "spent" as const, label: "Spent", locked: true },
];

export function ProjectBoard() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("submitted");

  return (
    <div className="project-board">
      <div className="project-board-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`project-board-tab${active === tab.key ? " active" : ""}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
            {"count" in tab && <span className="project-board-tab-count">{tab.count}</span>}
          </button>
        ))}
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
      </div>

      <div className="project-board-placeholder" />
    </div>
  );
}
