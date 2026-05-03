import { AnalyticsCharts } from "../../components/AnalyticsCharts";
import { getAnalytics, getFarms, getCrops } from "../../lib/data";

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
          <div className="card">
            <strong>Farms</strong>
            <div>{farms.length}</div>
          </div>
          <div className="card">
            <strong>Crops</strong>
            <div>{crops.length}</div>
          </div>
          <div className="card">
            <strong>Subscriptions</strong>
            <div>Premium</div>
          </div>
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
