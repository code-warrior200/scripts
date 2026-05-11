"use client";

import { type FormEvent, useState } from "react";

const plans = [
  { name: "Starter", price: "$29/mo", description: "Core farm and crop tracking." },
  { name: "Premium", price: "$79/mo", description: "Analytics, AI assistant, and team workflows." },
  { name: "Enterprise", price: "Custom", description: "Multi-region operations and priority support." },
];

export function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState("Premium");
  const [selectedPlan, setSelectedPlan] = useState("Premium");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to update subscription.");
      }

      setCurrentPlan(selectedPlan);
      setMessage(data.message ?? `Subscription updated to ${selectedPlan}.`);
      setIsOpen(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update subscription.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="subscription-manager">
      <div className="subscription-summary">
        <div>
          <strong>Subscription</strong>
          <p>Current plan: {currentPlan}</p>
        </div>
        <button className="primary" type="button" onClick={() => setIsOpen((open) => !open)}>
          Manage subscription
        </button>
      </div>

      {isOpen ? (
        <form className="subscription-form" onSubmit={handleSubmit}>
          <div className="plan-grid">
            {plans.map((plan) => (
              <label className={`plan-option${selectedPlan === plan.name ? " selected" : ""}`} key={plan.name}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.name}
                  checked={selectedPlan === plan.name}
                  onChange={(event) => setSelectedPlan(event.target.value)}
                />
                <span>
                  <strong>{plan.name}</strong>
                  <small>{plan.price}</small>
                  <em>{plan.description}</em>
                </span>
              </label>
            ))}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button className="primary" type="submit" disabled={isSubmitting || selectedPlan === currentPlan}>
              {isSubmitting ? "Updating..." : "Update plan"}
            </button>
          </div>
        </form>
      ) : null}

      {message ? <p className="form-success">{message}</p> : null}
    </div>
  );
}
