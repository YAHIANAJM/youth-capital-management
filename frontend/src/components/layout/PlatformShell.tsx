import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function PlatformShell({ children }: { children: ReactNode }) {
  return (
    <div className="platform-shell">
      <Sidebar />
      <div className="platform-main">
        <div className="platform-content">{children}</div>
      </div>
    </div>
  );
}
