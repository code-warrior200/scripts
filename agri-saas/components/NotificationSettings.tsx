"use client";

import { type FormEvent, useState } from "react";
import { Button } from "./Button";

type NotificationPreferences = {
  irrigation: boolean;
  harvest: boolean;
  inventory: boolean;
  delivery: string;
};

const defaultPreferences: NotificationPreferences = {
  irrigation: true,
  harvest: true,
  inventory: false,
  delivery: "Email",
};

export function NotificationSettings() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [draft, setDraft] = useState(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Unable to update notifications.");
      }

      setPreferences(draft);
      setMessage(data.message ?? "Notification preferences updated.");
      setIsOpen(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update notifications.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function cancelEdit() {
    setDraft(preferences);
    setError("");
    setIsOpen(false);
  }

  const enabledCount = [preferences.irrigation, preferences.harvest, preferences.inventory].filter(Boolean).length;

  return (
    <div className="notification-settings">
      <div className="subscription-summary">
        <div>
          <strong>Notifications</strong>
          <p>
            {enabledCount} alert types enabled via {preferences.delivery}.
          </p>
        </div>
        <Button variant="primary" type="button" onClick={() => setIsOpen((open) => !open)}>
          Edit notifications
        </Button>
      </div>

      {isOpen ? (
        <form className="notification-form" onSubmit={handleSubmit}>
          <div className="toggle-list">
            <label className="toggle-row">
              <span>
                <strong>Irrigation alerts</strong>
                <em>Moisture and watering reminders.</em>
              </span>
              <input
                type="checkbox"
                checked={draft.irrigation}
                onChange={(event) => setDraft({ ...draft, irrigation: event.target.checked })}
              />
            </label>

            <label className="toggle-row">
              <span>
                <strong>Harvest alerts</strong>
                <em>Readiness windows and harvest tasks.</em>
              </span>
              <input type="checkbox" checked={draft.harvest} onChange={(event) => setDraft({ ...draft, harvest: event.target.checked })} />
            </label>

            <label className="toggle-row">
              <span>
                <strong>Inventory alerts</strong>
                <em>Seed, fertilizer, and equipment updates.</em>
              </span>
              <input
                type="checkbox"
                checked={draft.inventory}
                onChange={(event) => setDraft({ ...draft, inventory: event.target.checked })}
              />
            </label>
          </div>

          <label className="delivery-field">
            Delivery method
            <select value={draft.delivery} onChange={(event) => setDraft({ ...draft, delivery: event.target.value })}>
              <option>Email</option>
              <option>SMS</option>
              <option>In-app</option>
            </select>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <Button type="button" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save notifications"}
            </Button>
          </div>
        </form>
      ) : null}

      {message ? <p className="form-success">{message}</p> : null}
    </div>
  );
}
