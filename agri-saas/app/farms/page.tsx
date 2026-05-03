import { getFarms } from "../../lib/data";

export default function FarmsPage() {
  const farms = getFarms();

  return (
    <div>
      <section className="section">
        <h1>Farms</h1>
        <p>Manage farms, locations, and farm-specific tasks.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Farm</th>
              <th>Region</th>
              <th>Crop count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {farms.map((farm) => (
              <tr key={farm.id}>
                <td>{farm.name}</td>
                <td>{farm.region}</td>
                <td>{farm.crops.length}</td>
                <td>{farm.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
