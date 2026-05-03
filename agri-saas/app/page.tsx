import { getFarms, getStats } from "../lib/data";
import { StatCard } from "../components/StatCard";
import { FarmManager } from "../components/FarmManager";

export default function HomePage() {
  const farms = getFarms();
  const stats = getStats();

  return (
    <div>
      <section className="section">
        <h1>AgriSaaS Dashboard</h1>
        <p>Monitor farms, crops, tasks, and operations in one place.</p>
      </section>

      <section className="section">
        <div className="stat-grid">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      <section className="section">
        <FarmManager initialFarms={farms} />
      </section>
    </div>
  );
}
