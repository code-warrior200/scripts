import Link from "next/link";
import { SignupForm } from "../../components/SignupForm";

export default function SignupPage() {
  return (
    <section className="auth-card auth-card-wide" aria-labelledby="signup-title">
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
        <h1 id="signup-title">Create account</h1>
        <p>Set up your workspace for farm teams, crop planning, and operations tracking.</p>
      </div>

      <SignupForm />

      <p className="auth-switch">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </section>
  );
}
