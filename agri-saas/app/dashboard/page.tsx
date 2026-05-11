import { AnalyticsCharts } from "../../components/AnalyticsCharts";
import { StatCard } from "../../components/StatCard";
import { getAnalytics, getCrops, getFarms } from "../../lib/data";

export default function DashboardPage() {
  const farms = getFarms();
  const crops = getCrops();
  const analytics = getAnalytics();

  return (
    <div>
      <section className="section">
        <h1>Operations</h1>
        <p>High-level farm and crop performance metrics.</p>
      </section>

      <section className="section">
        <div className="stat-grid">
          <StatCard label="Farms" value={farms.length} />
          <StatCard label="Crops" value={crops.length} />
          <StatCard label="Subscription" value="Premium" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Analytics</h2>
            <p>Track yield movement and crop distribution at a glance.</p>
          </div>
        </div>
        <AnalyticsCharts yieldTrends={analytics.yieldTrends} cropAreas={analytics.cropAreas} />
      </section>
    </div>
  );
}
