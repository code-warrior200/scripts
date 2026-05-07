import Link from "next/link";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordPage() {
  return (
    <section className="auth-card" aria-labelledby="forgot-title">
      <div className="auth-brand">
        <span className="auth-logo" aria-hidden="true">
          A
        </span>
        <div>
          <strong>AgriSaaS</strong>
          <span>Farm operations platform</span>
        </div>
      </div>

      <div className="auth-heading">
        <h1 id="forgot-title">Reset password</h1>
        <p>Enter your account email and we will send instructions to recover access.</p>
      </div>

      <form className="auth-form">
        <label>
          Email address
          <span className="auth-input">
            <FiMail aria-hidden="true" />
            <input type="email" name="email" autoComplete="email" placeholder="manager@farm.com" required />
          </span>
        </label>

        <button className="primary auth-submit" type="submit">
          Send reset link
        </button>
      </form>

      <p className="auth-switch">
        Remembered your password? <Link href="/login">Back to sign in</Link>
      </p>
    </section>
  );
}
