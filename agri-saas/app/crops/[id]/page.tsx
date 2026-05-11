import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "../../../components/Button";
import { getSampleCrops, getSampleFarms } from "../../../lib/data";

type CropDetailsPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return getSampleCrops().map((crop) => ({
    id: crop.id,
  }));
}

function getCropById(id: string) {
  return getSampleCrops().find((crop) => crop.id === id) ?? null;
}

export default function CropDetailsPage({ params }: CropDetailsPageProps) {
  const crop = getCropById(params.id);

  if (!crop) {
    notFound();
  }

  const farm = getSampleFarms().find((item) => item.name === crop.farm) ?? null;
  const isHealthy = crop.health === "Healthy" || crop.health === "Stable";

  return (
    <div>
      <section className="section farm-detail-hero">
        <div>
          <Link className="back-link" href="/crops">
            Back to crops
          </Link>
          <h1>{crop.name}</h1>
          <p>
            {crop.area} planted at {crop.farm}.
          </p>
        </div>
        <span className={`status-pill ${isHealthy ? "healthy" : "attention"}`}>
          {crop.health}
        </span>
      </section>

      <section className="section">
        <div className="detail-grid">
          <div className="detail-card">
            <span>Variety</span>
            <strong>{crop.variety}</strong>
          </div>
          <div className="detail-card">
            <span>Growth stage</span>
            <strong>{crop.growthStage}</strong>
          </div>
          <div className="detail-card">
            <span>Planting date</span>
            <strong>{crop.plantingDate}</strong>
          </div>
          <div className="detail-card">
            <span>Harvest window</span>
            <strong>{crop.harvestWindow}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Field action</h2>
            <p>Current task and farm context for this crop.</p>
          </div>
          {farm ? (
            <Button variant="table" href={`/farms/${farm.id}`}>
              View farm
            </Button>
          ) : null}
        </div>

        <div className="crop-action-panel">
          <div>
            <span>Next action</span>
            <strong>{crop.nextAction}</strong>
          </div>
          <div>
            <span>Farm status</span>
            <strong>{farm?.status ?? "Not available"}</strong>
          </div>
          <div>
            <span>Farm manager</span>
            <strong>{farm?.manager ?? "Unassigned"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
