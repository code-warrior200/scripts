"use client";

import { type FormEvent, useState } from "react";
import type { Farm } from "../lib/data";
import { Button } from "./Button";
import { FarmList } from "./FarmList";

type FarmForm = {
  name: string;
  region: string;
  status: string;
  crops: string;
};

const initialForm: FarmForm = {
  name: "",
  region: "",
  status: "Healthy",
  crops: "",
};

export function FarmManager({ initialFarms }: { initialFarms: Farm[] }) {
  const [farms, setFarms] = useState(initialFarms);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          region: form.region,
          status: form.status,
          crops: form.crops.split(","),
        }),
      });

      const data = (await response.json()) as { farm?: Farm; error?: string };

      if (!response.ok || !data.farm) {
        throw new Error(data.error ?? "Unable to add farm.");
      }

      setFarms((current) => [...current, data.farm as Farm]);
      setForm(initialForm);
      setIsOpen(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to add farm.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h2>Active farms</h2>
          <p>Review current farm performance and crop health.</p>
        </div>
        <Button variant="primary" type="button" onClick={() => setIsOpen(true)}>
          Add new farm
        </Button>
      </div>

      {isOpen ? (
        <form className="farm-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Farm name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>
              Region
              <input value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} required />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                <option>Healthy</option>
                <option>Needs irrigation</option>
                <option>Harvest ready</option>
                <option>Needs attention</option>
              </select>
            </label>
            <label>
              Crops
              <input
                value={form.crops}
                onChange={(event) => setForm({ ...form, crops: event.target.value })}
                placeholder="Corn, Soybean"
              />
            </label>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="form-actions">
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Save farm"}
            </Button>
          </div>
        </form>
      ) : null}

      <FarmList farms={farms} />
    </>
  );
}
