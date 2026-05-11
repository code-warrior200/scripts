import Link from "next/link";
import { Button } from "../../components/Button";
import { getSampleCrops } from "../../lib/data";

export default function CropsPage() {
  const crops = getSampleCrops();

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
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td>
                  <Link className="table-link" href={`/crops/${crop.id}`}>
                    {crop.name}
                  </Link>
                </td>
                <td>{crop.farm}</td>
                <td>{crop.area}</td>
                <td>{crop.nextAction}</td>
                <td>
                  <Button variant="table" href={`/crops/${crop.id}`}>
                    View details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
