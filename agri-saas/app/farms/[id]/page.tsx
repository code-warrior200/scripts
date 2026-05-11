import Link from "next/link";
import { notFound } from "next/navigation";
import { getSampleFarms, getSampleCrops } from "../../../lib/data";

type FarmDetailsPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return getSampleFarms().map((farm) => ({
    id: farm.id,
  }));
}

export default function FarmDetailsPage({ params }: FarmDetailsPageProps) {
  const farms = getSampleFarms();
  const farm = farms.find((f) => f.id === params.id);

  if (!farm) {
    notFound();
  }

  const allCrops = getSampleCrops();
  const relatedCrops = allCrops.filter((crop) => crop.farm === farm.name);

  return (
    <div>
      <section className="section farm-detail-hero">
        <div>
          <Link className="back-link" href="/farms">
            Back to farms
          </Link>
          <h1>{farm.name}</h1>
          <p>
            {farm.region} farm managed by {farm.manager}.
          </p>
        </div>
        <span className={`status-pill ${farm.status === "Healthy" ? "healthy" : "attention"}`}>{farm.status}</span>
      </section>

      <section className="section">
        <div className="detail-grid">
          <div className="detail-card">
            <span>Region</span>
            <strong>{farm.region}</strong>
          </div>
          <div className="detail-card">
            <span>Total area</span>
            <strong>{farm.area}</strong>
          </div>
          <div className="detail-card">
            <span>Soil type</span>
            <strong>{farm.soilType}</strong>
          </div>
          <div className="detail-card">
            <span>Last inspection</span>
            <strong>{farm.lastInspection}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Crop plan</h2>
            <p>Crop assignments and next field actions for this farm.</p>
          </div>
          <strong>{farm.crops.length} crops</strong>
        </div>

        {relatedCrops.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Area</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {relatedCrops.map((crop) => (
                <tr key={crop.id}>
                  <td>{crop.name}</td>
                  <td>{crop.area}</td>
                  <td>{crop.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No crop actions have been assigned to this farm yet.</div>
        )}
      </section>
    </div>
  );
}