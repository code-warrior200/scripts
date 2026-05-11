"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "./AuthProvider";
import { Button } from "./Button";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      await login({ email, password });
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign in.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Email address
        <span className="auth-input">
          <FiMail aria-hidden="true" />
          <input type="email" name="email" autoComplete="email" placeholder="manager@farm.com" required />
        </span>
      </label>

      <label>
        Password
        <span className="auth-input">
          <FiLock aria-hidden="true" />
          <input type="password" name="password" autoComplete="current-password" placeholder="Enter password" required />
        </span>
      </label>

      <div className="auth-options">
        <label className="auth-check">
          <input type="checkbox" name="remember" />
          Remember me
        </label>
        <a href="/forgot-password">Forgot password?</a>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <Button className="auth-submit" variant="primary" type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
