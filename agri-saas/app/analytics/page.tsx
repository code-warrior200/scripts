import { AnalyticsCharts } from "../../components/AnalyticsCharts";
import { getCropAreas, getSampleStats, getYieldTrends } from "../../lib/data";

export default function AnalyticsPage() {
  const stats = getSampleStats();

  return (
    <div>
      <section className="section">
        <h1>Analytics</h1>
        <p>Track yield trends, crop allocation, and operating signals for the current season.</p>
      </section>

      <section className="section">
        <div className="stat-grid">
          {stats.map((item) => (
            <div className="card" key={item.label}>
              <strong>{item.label}</strong>
              <span className="stat-value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <AnalyticsCharts yieldTrends={getYieldTrends()} cropAreas={getCropAreas()} />
      </section>
    </div>
  );
}
