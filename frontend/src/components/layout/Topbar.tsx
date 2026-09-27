import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import { BellIcon, BoardIcon, GridIcon, HelpIcon, LogInIcon } from "../icons";
import penBanner from "../../assets/images/header-pen.svg";

// Overview pinned at the start of the navy barrel, the rest spread across
// the remaining wide navy section (justify-content: space-between does
// both at once). Connect/sign-in sits separately, over the cap.
const NAV = [
  { key: "overview", to: "/", Icon: GridIcon },
  { key: "projects", to: null, Icon: BoardIcon },
  { key: "events", to: null, Icon: BellIcon },
  { key: "about", to: null, Icon: HelpIcon },
] as const;

export function Topbar() {
  const { tr } = useLang();
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div className="topbar-pen-wrap">
        <img src={penBanner} alt="" className="topbar-pen" />

        <nav className="pen-nav">
          {NAV.map(({ key, to, Icon }) => {
            // Overview and About sit right at the navy section's two edges —
            // their hover label would otherwise spill past it, so nudge the
            // whole pill left on hover to keep the expansion inside.
            const edge = key === "overview" || key === "about";
            return to ? (
              <Link
                key={key}
                to={to}
                className={`pen-nav-item${pathname === to ? " active" : ""}${edge ? " pen-nav-item-edge" : ""}`}
                title={tr.topbar.pen[key]}
              >
                <Icon size={18} strokeWidth={1.25} />
              </Link>
            ) : (
              <div
                key={key}
                className={`pen-nav-item disabled${edge ? " pen-nav-item-edge" : ""}${key === "about" ? " pen-nav-item-about" : ""}`}
                title={tr.sidebar.soon}
                aria-disabled="true"
              >
                <Icon size={18} strokeWidth={1.25} />
              </div>
            );
          })}
        </nav>

        <Link to="/login" className="pen-signin" title={`${tr.topbar.signIn} / ${tr.topbar.register}`}>
          <LogInIcon size={18} strokeWidth={1.25} />
        </Link>
      </div>
    </header>
  );
}
