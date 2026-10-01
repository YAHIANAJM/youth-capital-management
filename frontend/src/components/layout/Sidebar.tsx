import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import {
  BellIcon,
  BoardIcon,
  BuildingIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CoinsIcon,
  FileIcon,
  GridIcon,
  InboxIcon,
  LogOutIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  WalletIcon,
} from "../icons";
import youthCapitalMark from "../../assets/images/youth-capital-mark.svg";
import youthCapitalFull from "../../assets/images/youth-capital-full.svg";

// Member-tier sections only — a guest previews what opens up after sign-in.
// Coordinator/national-lead/leadership review sections are role-gated and
// stay out of the guest sidebar entirely (see PLATFORM-SECTIONS.md §4).
// Icon-only rail at rest: each item still needs a real aria-label/title for
// screen readers, and carries a label span that only becomes visible while
// the rail is hovered/expanded.
const ITEMS = [
  { key: "overview", to: "/", Icon: GridIcon },
  {
    key: "finance",
    to: null,
    Icon: CoinsIcon,
    children: [
      { key: "financeDashboard", Icon: GridIcon },
      { key: "financeIncome", Icon: WalletIcon },
      { key: "financeExpenses", Icon: CoinsIcon },
      { key: "financeDocuments", Icon: FileIcon },
      { key: "financeReports", Icon: ChartBarIcon },
    ],
  },
  {
    key: "board",
    to: null,
    Icon: BoardIcon,
    children: [
      { key: "boardDashboard", Icon: GridIcon },
      { key: "boardCreateProject", Icon: CalendarIcon },
      { key: "boardApprovalPipeline", Icon: CheckCircleIcon },
    ],
  },
  { key: "newIdea", to: null, Icon: PlusCircleIcon },
  { key: "myRequests", to: null, Icon: InboxIcon },
  { key: "directory", to: null, Icon: BuildingIcon },
  { key: "notifications", to: null, Icon: BellIcon },
] as const;

// The second, smaller box — account-scoped actions, always in this order.
const ACCOUNT_ITEMS = [
  { key: "account", Icon: UserIcon },
  { key: "settings", Icon: SettingsIcon },
  { key: "logout", Icon: LogOutIcon },
] as const;

export function Sidebar() {
  const { tr } = useLang();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  // Not-yet-built stubs have no route to key an active state off, so a
  // click just selects one directly — same light-purple-box/dark-purple
  // treatment as a real route match, shared across both boxes (one
  // selection at a time for the whole rail).
  const [selectedStub, setSelectedStub] = useState<string | null>(null);
  // Finance and Board are both grouped now — one open at a time, keyed by
  // group, instead of the single boolean this used to be when only Finance
  // had children. Finance defaults open (and mouse-leave returns to that
  // default rather than closing everything) — with the tighter row gap the
  // collapsed rail left empty space at the bottom; an open Finance fills it.
  const [openGroup, setOpenGroup] = useState<string | null>("finance");

  return (
    <>
      <div
        className={`sidebar-col${expanded ? " expanded" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          setExpanded(false);
          setOpenGroup("finance"); // back to the resting default — Board closes, Finance stays open
        }}
      >
        <aside className="sidebar">
          <div className="sidebar-scroll">
          <Link to="/" className="sidebar-mark" title={tr.brand.name} aria-label={tr.brand.name}>
            {expanded ? (
              <img src={youthCapitalFull} alt={tr.brand.name} className="sidebar-mark-full" />
            ) : (
              <img src={youthCapitalMark} alt="" className="sidebar-mark-icon" />
            )}
          </Link>

          <nav className="sidebar-nav">
            {ITEMS.map((item) => {
              const { key, to, Icon } = item;
              const label = tr.sidebar.nav[key];
              const children = "children" in item ? item.children : null;

              if (children) {
                const isOpen = openGroup === key;
                return (
                  <div key={key} className="sidebar-group">
                    <div
                      className={`sidebar-item${selectedStub === key ? " active" : ""}`}
                      title={`${label} — ${tr.sidebar.soon}`}
                      aria-label={label}
                      aria-expanded={isOpen}
                      onClick={() => {
                        setSelectedStub(key);
                        setOpenGroup((cur) => (cur === key ? null : key));
                      }}
                    >
                      <Icon size={19} />
                      <span className="sidebar-item-label">{label}</span>
                      <ChevronDownIcon size={14} className={`sidebar-group-chevron${isOpen ? " open" : ""}`} />
                    </div>
                    {isOpen && (
                      <div className="sidebar-group-children">
                        {children.map((child) => {
                          const childLabel = tr.sidebar.nav[child.key];
                          const ChildIcon = child.Icon;
                          return (
                            <div
                              key={child.key}
                              className={`sidebar-item sidebar-subitem${selectedStub === child.key ? " active" : ""}`}
                              title={`${childLabel} — ${tr.sidebar.soon}`}
                              aria-label={childLabel}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStub(child.key);
                              }}
                            >
                              <ChildIcon size={15} />
                              <span className="sidebar-item-label">{childLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return to ? (
                <Link
                  key={key}
                  to={to}
                  className={`sidebar-item${pathname === to ? " active" : ""}`}
                  title={label}
                  aria-label={label}
                >
                  <Icon size={19} />
                  <span className="sidebar-item-label">{label}</span>
                </Link>
              ) : (
                <div
                  key={key}
                  className={`sidebar-item${selectedStub === key ? " active" : ""}`}
                  title={`${label} — ${tr.sidebar.soon}`}
                  aria-label={label}
                  onClick={() => setSelectedStub(key)}
                >
                  <Icon size={19} />
                  <span className="sidebar-item-label">{label}</span>
                </div>
              );
            })}
          </nav>
          </div>
        </aside>

        <aside className="sidebar-account">
          {ACCOUNT_ITEMS.map(({ key, Icon }) => {
            const label = tr.sidebar.nav[key];
            return (
              <div
                key={key}
                className={`sidebar-item${selectedStub === key ? " active" : ""}`}
                title={`${label} — ${tr.sidebar.soon}`}
                aria-label={label}
                onClick={() => setSelectedStub(key)}
              >
                <Icon size={19} />
                <span className="sidebar-item-label">{label}</span>
              </div>
            );
          })}
        </aside>
      </div>

      <div className={`sidebar-backdrop${expanded ? " visible" : ""}`} />
    </>
  );
}
