import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { isMockMode, supabase } from "../lib/supabaseClient";
import loginBg from "../assets/images/login-bg.jpg";
import logoFull from "../assets/images/youth-capital-full.svg";

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
  const navigate = useNavigate();
  const { tr } = useLang();

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

        <form onSubmit={handleSubmit} className="auth-card">
        <h2>{tr.login.title}</h2>
        {sent ? (
          <p className="hint">{tr.login.sent}</p>
        ) : (
          <>
            <p className="hint">{isMockMode ? tr.login.hintMock : tr.login.hintReal}</p>

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
