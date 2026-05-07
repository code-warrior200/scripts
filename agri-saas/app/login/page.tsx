import Link from "next/link";
import { LoginForm } from "../../components/LoginForm";

export default function LoginPage() {
  return (
    <section className="auth-card" aria-labelledby="login-title">
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
        <h1 id="login-title">Sign in</h1>
        <p>Access farm activity, crop records, analytics, and team settings.</p>
      </div>

      <LoginForm />

      <p className="auth-switch">
        New to AgriSaaS? <Link href="/signup">Create an account</Link>
      </p>
    </section>
  );
}
