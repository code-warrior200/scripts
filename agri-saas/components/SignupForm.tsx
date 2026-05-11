"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiBriefcase, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAuth } from "./AuthProvider";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const organizationName = String(formData.get("organization") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!name.trim() || !organizationName.trim() || !email.trim() || password.length < 6) {
      setError("Complete all fields and use a password with at least 6 characters.");
      return;
    }

    signup({ name, organizationName, email, password });
    router.replace("/dashboard");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-grid">
        <label>
          Full name
          <span className="auth-input">
            <FiUser aria-hidden="true" />
            <input type="text" name="name" autoComplete="name" placeholder="Amina Bello" required />
          </span>
        </label>

        <label>
          Organization
          <span className="auth-input">
            <FiBriefcase aria-hidden="true" />
            <input type="text" name="organization" autoComplete="organization" placeholder="Green Valley Farms" required />
          </span>
        </label>
      </div>

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
          <input type="password" name="password" autoComplete="new-password" placeholder="Create password" required />
        </span>
      </label>

      <label className="auth-check auth-terms">
        <input type="checkbox" name="terms" required />
        I agree to receive account and workspace updates.
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="primary auth-submit" type="submit">
        Create account
      </button>
    </form>
  );
}
