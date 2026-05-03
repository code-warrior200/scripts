import { getFarms } from "../../lib/data";
import { FarmManager } from "../../components/FarmManager";

export default function FarmsPage() {
  const farms = getFarms();

  return (
    <div>
      <section className="section">
        <h1>Farms</h1>
        <p>Manage farms, locations, and farm-specific tasks.</p>
      </section>

      <section className="section">
        <FarmManager initialFarms={farms} />
      </section>
    </div>
  );
}
