import { Link, useLocation } from "react-router-dom";
import { useLang } from "../../i18n/LanguageContext";
import penBanner from "../../assets/images/header-pen.svg";

// Overview pinned at the start of the navy barrel, the rest spread across
// the remaining wide navy section (justify-content: space-between does
// both at once). Connect/sign-in sits separately, over the cap.
const NAV = [
  { key: "overview", to: "/" },
  { key: "projects", to: null },
  { key: "events", to: null },
  { key: "about", to: null },
] as const;

export function Topbar() {
  const { tr } = useLang();
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div className="topbar-pen-wrap">
        <img src={penBanner} alt="" className="topbar-pen" />

        <nav className="pen-nav">
          {NAV.map(({ key, to }) => {
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
              />
            ) : (
              <div
                key={key}
                className={`pen-nav-item disabled${edge ? " pen-nav-item-edge" : ""}${key === "about" ? " pen-nav-item-about" : ""}`}
                title={tr.sidebar.soon}
                aria-disabled="true"
              />
            );
          })}
        </nav>

        <Link to="/login" className="pen-signin" title={`${tr.topbar.signIn} / ${tr.topbar.register}`} />
      </div>
    </header>
  );
}
