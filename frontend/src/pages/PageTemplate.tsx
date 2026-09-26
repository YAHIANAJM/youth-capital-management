import { Sidebar } from "../components/layout/Sidebar";

// Preview of the shared inner-page shell: sidebar keeps its real nav, the
// main rectangle is left empty on purpose — this is just to confirm the
// layout (grey canvas, white sidebar + white main box, 10px spacing
// everywhere) before it becomes the template every sidebar link / KPI
// drill-down page reuses.
export function PageTemplate() {
  return (
    <div className="page-template">
      <Sidebar />
      <div className="page-template-main" />
    </div>
  );
}
