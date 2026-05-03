import { getCrops } from "../../lib/data";

export default function CropsPage() {
  const crops = getCrops();

  return (
    <div>
      <section className="section">
        <h1>Crops</h1>
        <p>Track crop varieties, field area, and projected harvest dates.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Farm</th>
              <th>Area</th>
              <th>Next action</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td>{crop.name}</td>
                <td>{crop.farm}</td>
                <td>{crop.area}</td>
                <td>{crop.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
