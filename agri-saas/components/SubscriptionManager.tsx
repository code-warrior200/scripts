"use client";

import { type FormEvent, useState } from "react";
import { Button } from "./Button";

const plans = [
  { id: "free", name: "Starter", price: "$0/mo", description: "Core farm and crop tracking." },
  { id: "pro", name: "Premium", price: "$79/mo", description: "Analytics, AI assistant, and team workflows." },
  { id: "enterprise", name: "Enterprise", price: "Custom", description: "Multi-region operations and priority support." },
];

export function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [selectedPlan, setSelectedPlan] = useState("pro");
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
          <p>Current plan: {plans.find((plan) => plan.id === currentPlan)?.name ?? currentPlan}</p>
        </div>
        <Button variant="primary" type="button" onClick={() => setIsOpen((open) => !open)}>
          Manage subscription
        </Button>
      </div>

      {isOpen ? (
        <form className="subscription-form" onSubmit={handleSubmit}>
          <div className="plan-grid">
            {plans.map((plan) => (
              <label className={`plan-option${selectedPlan === plan.id ? " selected" : ""}`} key={plan.id}>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selectedPlan === plan.id}
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
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting || selectedPlan === currentPlan}>
              {isSubmitting ? "Updating..." : "Update plan"}
            </Button>
          </div>
        </form>
      ) : null}

      {message ? <p className="form-success">{message}</p> : null}
    </div>
  );
}
