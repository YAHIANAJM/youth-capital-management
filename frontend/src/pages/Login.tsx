import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alignment, EventType, Fit, Layout, useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useLang } from "../i18n/LanguageContext";
import { isMockMode, supabase } from "../lib/supabaseClient";
import { ChevronDownIcon, CloseIcon } from "../components/icons";
import loginBg from "../assets/images/login-bg.jpg";
import logoFull from "../assets/images/youth-capital-full.svg";
import loginTeddy from "../assets/rive/login-teddy.riv";
import loginTeddyWave from "../assets/rive/login-teddy-wave.riv";

// Rive's public "Animated Login Character" (community file, CC BY — credit
// JcToon): a teddy bear that covers its eyes when the password field is
// focused (isHandsUp), and otherwise holds a fixed glance toward the login
// box (numLook set once, not cursor-tracked — that animation is only a
// small glance, designed for a bear sitting directly above the field it
// watches; from its own separate box in the corner, live-tracking a cursor
// hundreds of pixels away never read as looking at anything).
// https://rive.app/community/files/2244-7248-animated-login-character/
function TeddyWatching({ passwordFocused }: { passwordFocused: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: loginTeddy,
    stateMachines: "Login Machine",
    autoplay: true,
    // default fit (Contain) was letterboxing — visible white gaps on the
    // left/right since the box's aspect ratio doesn't match the artboard's.
    // Cover fills the whole box on every side, cropping instead of gapping.
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });
  const isHandsUp = useStateMachineInput(rive, "Login Machine", "isHandsUp");
  const numLook = useStateMachineInput(rive, "Login Machine", "numLook");
  const isChecking = useStateMachineInput(rive, "Login Machine", "isChecking");

  useEffect(() => {
    if (isHandsUp) isHandsUp.value = passwordFocused;
  }, [passwordFocused, isHandsUp]);

  useEffect(() => {
    // isChecking gates the whole "Look" branch — without it numLook does
    // nothing. Held true whenever not covering the eyes for password.
    if (isChecking) isChecking.value = !passwordFocused;
    // 28 landed dead-center/straight-down — the true range is likely wider
    // than 0-30 (that 30-cap was a guess made before isChecking was wired
    // up, when nothing moved regardless of value). Pushing further out.
    if (numLook) numLook.value = 80;
  }, [passwordFocused, isChecking, numLook]);

  return <RiveComponent className="auth-teddy" aria-hidden="true" />;
}

// "Wave, Hear and Talk" by japarj (community remix of JcToon's character
// above, same rig/colors) — used only for its "wave" animation, played
// directly rather than through its own state machine, since we only need
// the one gesture: greet the visitor while the form is still empty. It's a
// one-shot animation, not a loop — left alone it plays once and then just
// holds its last frame forever, so `onFinish` (wired to Rive's own Stop
// event, fired once the animation has fully played out) hands off to
// TeddyWatching instead of freezing there.
// https://rive.app/community/files/5628-11215-wave-hear-and-talk/
function TeddyWave({ onFinish }: { onFinish: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: loginTeddyWave,
    animations: "wave",
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (!rive) return;
    rive.on(EventType.Stop, onFinish);
    return () => rive.off(EventType.Stop, onFinish);
  }, [rive, onFinish]);

  return <RiveComponent className="auth-teddy" aria-hidden="true" />;
}

function LoginTeddy({
  passwordFocused,
  emptyForm,
  collapsed,
  onClose,
}: {
  passwordFocused: boolean;
  emptyForm: boolean;
  collapsed: boolean;
  onClose: () => void;
}) {
  // Mirrors emptyForm on every change (waves again each time the visitor
  // clears back to empty, drops the wave immediately if they start typing
  // mid-wave) — but TeddyWave's own onFinish can also flip this to false on
  // its own once the animation ends, while emptyForm is still true.
  const [waving, setWaving] = useState(emptyForm);
  useEffect(() => setWaving(emptyForm), [emptyForm]);

  return (
    <div className={`auth-teddy-box${collapsed ? " auth-teddy-box-collapsed" : ""}`}>
      {!collapsed && (
        <button type="button" className="auth-teddy-close" onClick={onClose} aria-label="Hide character">
          <CloseIcon size={14} />
        </button>
      )}
      {waving ? (
        <TeddyWave onFinish={() => setWaving(false)} />
      ) : (
        <TeddyWatching passwordFocused={passwordFocused} />
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [sent, setSent] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [teddyVisible, setTeddyVisible] = useState(true);
  const navigate = useNavigate();
  const { tr } = useLang();
  // First entry to the page, and any time both fields are cleared back to
  // empty, greet with a wave instead of the watching/eyes-cover behavior.
  const isFormEmpty = email === "" && password === "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isMockMode || !supabase) {
      // No backend configured — let the visitor straight into the demo board.
      navigate("/board/submitted");
      return;
    }
    await supabase.auth.signInWithOtp({ email });
    setSent(true);
  }

  return (
    <main className="auth-wrap">
      <div className="auth-panels">
        <div className="auth-visual" style={{ backgroundImage: `url(${loginBg})` }}>
          <div className="auth-visual-overlay" />
          <div className="auth-visual-top">
            <img src={logoFull} alt="Youth Capital" className="auth-visual-logo" />
            <Link to="/" className="auth-visual-back">
              ← {tr.login.backToPlatform}
            </Link>
          </div>
          <div className="auth-visual-copy">
            <h1>{tr.login.visualTitle}</h1>
            <p>{tr.login.visualText}</p>
          </div>
        </div>

        <LoginTeddy
          passwordFocused={passwordFocused}
          emptyForm={isFormEmpty}
          collapsed={!teddyVisible}
          onClose={() => setTeddyVisible(false)}
        />
        {!teddyVisible && (
          <button
            type="button"
            className="auth-teddy-reopen"
            onClick={() => setTeddyVisible(true)}
            aria-label="Show character"
          >
            <ChevronDownIcon size={16} style={{ transform: "rotate(90deg)" }} />
          </button>
        )}

        <form onSubmit={handleSubmit} className="auth-card">
        <h2>{tr.login.title}</h2>
        <p className="auth-welcome-back">Welcome Back</p>
        {sent ? (
          <p className="hint">{tr.login.sent}</p>
        ) : (
          <>
            <label className="auth-field">
              <span className="auth-field-label">{tr.login.email}</span>
              <input
                type="email"
                required
                placeholder={tr.login.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="auth-field">
              <span className="auth-field-label">{tr.login.password}</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="current-password"
              />
            </label>

            <div className="auth-card-row">
              <label className="auth-checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                {tr.login.rememberMe}
              </label>
              <a href="#" className="auth-forgot" onClick={(e) => e.preventDefault()}>
                {tr.login.forgotPassword}
              </a>
            </div>

            <button className="auth-card-submit" type="submit">
              {isMockMode ? tr.login.btnMock : tr.login.btnReal}
            </button>

            <div className="auth-divider">
              <span />
              {tr.login.orContinueWith}
              <span />
            </div>

            <button type="button" className="auth-card-google" onClick={(e) => e.preventDefault()}>
              <GoogleIcon />
              {tr.login.continueWithGoogle}
            </button>

            <p className="auth-card-signup">
              {tr.login.noAccount}{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                {tr.login.signUpHere}
              </a>
            </p>
          </>
        )}
        </form>
      </div>
    </main>
  );
}
