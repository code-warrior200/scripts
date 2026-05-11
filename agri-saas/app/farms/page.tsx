import { getSampleFarms } from "../../lib/data";
import { FarmManager } from "../../components/FarmManager";

export default function FarmsPage() {
  const farms = getSampleFarms();

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
