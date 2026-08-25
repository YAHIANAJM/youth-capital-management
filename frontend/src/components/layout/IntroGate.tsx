import { ReactNode, useEffect, useState } from "react";
import logoMark from "../../assets/images/youth-capital-mark.svg";
import penBanner from "../../assets/images/header-pen.svg";

const LINE_1 = "YOUTH CAPITAL";
const LINE_2 = "MANAGEMENT";
const LETTER_MS = 65;
const LETTER_ANIM_MS = 400; // matches .intro-loader-letter's own animation-duration
const HOLD_MS = 500; // pause after the bar finishes filling, before fading into the app

// Last letter's delay + its own reveal time = when typing finishes — the
// bar's fill duration is set to match this exactly, so it reaches 100% right
// as the last letter lands, then just sits there for HOLD_MS before fading.
const TYPING_DONE_MS = (LINE_1.length + LINE_2.length - 1) * LETTER_MS + LETTER_ANIM_MS;
const LOADER_MS = TYPING_DONE_MS + HOLD_MS;

// Same signature-font letters as the topbar pen nav (Home/About/...),
// revealed one at a time — line 2 picks up right where line 1 left off.
function AnimatedLine({ text, startIndex, className }: { text: string; startIndex: number; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="intro-loader-letter"
          style={{ animationDelay: `${(startIndex + i) * LETTER_MS}ms` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/**
 * App entry loader — navy splash with the logo, the typed-out name, and a
 * gold progress bar; holds a beat once everything's landed, then it's gone.
 * Shown on every load (first entry and hard refresh alike), not gated
 * behind sessionStorage. Same shape as the live site's SplashScreen
 * (frontend/src/components/layout.tsx there).
 */
export function IntroGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "fading" | "done">("loading");

  useEffect(() => {
    if (phase !== "loading") return;
    const t = window.setTimeout(() => setPhase("fading"), LOADER_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = window.setTimeout(() => setPhase("done"), 400); // matches CSS fade
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <>
      {children}
      {phase !== "done" && (
        <div className={`intro-loader${phase === "fading" ? " fading" : ""}`}>
          <div className="intro-loader-brand">
            <img src={logoMark} alt="" className="intro-loader-logo" />
            <div className="intro-loader-title">
              <AnimatedLine text={LINE_1} startIndex={0} className="intro-loader-title-line" />
              <AnimatedLine
                text={LINE_2}
                startIndex={LINE_1.length}
                className="intro-loader-title-line intro-loader-title-line-sub"
              />
            </div>
            <img src={penBanner} alt="" className="intro-loader-pen" />
          </div>

          <div className="intro-loader-bar">
            <div className="intro-loader-bar-fill" style={{ animationDuration: `${TYPING_DONE_MS}ms` }} />
          </div>
        </div>
      )}
    </>
  );
}
