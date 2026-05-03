import type { CropArea, YieldTrend } from "../lib/data";

type AnalyticsChartsProps = {
  yieldTrends: YieldTrend[];
  cropAreas: CropArea[];
};

function buildLinePoints(data: YieldTrend[]) {
  const width = 520;
  const height = 220;
  const padding = 32;
  const values = data.map((item) => item.yield);
  const min = Math.min(...values) - 0.5;
  const max = Math.max(...values) + 0.5;
  const range = max - min || 1;

  return data
    .map((item, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((item.yield - min) / range) * (height - padding * 2);

      return { ...item, x, y };
    });
}

export function AnalyticsCharts({ yieldTrends, cropAreas }: AnalyticsChartsProps) {
  const linePoints = buildLinePoints(yieldTrends);
  const linePath = linePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const maxAcres = Math.max(...cropAreas.map((item) => item.acres), 1);

  return (
    <div className="analytics-grid">
      <article className="analytics-card">
        <div className="chart-header">
          <div>
            <h2>Yield trend</h2>
            <p>Estimated production across the current season.</p>
          </div>
          <strong>+47.6%</strong>
        </div>

        <svg className="line-chart" viewBox="0 0 520 220" role="img" aria-label="Yield trend from January to June">
          <path className="chart-grid-line" d="M 32 48 H 488" />
          <path className="chart-grid-line" d="M 32 110 H 488" />
          <path className="chart-grid-line" d="M 32 172 H 488" />
          <path className="line-chart-path" d={linePath} />
          {linePoints.map((point) => (
            <g key={point.month}>
              <circle className="line-chart-dot" cx={point.x} cy={point.y} r="5" />
              <text className="chart-label" x={point.x} y="204" textAnchor="middle">
                {point.month}
              </text>
            </g>
          ))}
        </svg>
      </article>

      <article className="analytics-card">
        <div className="chart-header">
          <div>
            <h2>Crop area</h2>
            <p>Acres currently allocated by crop type.</p>
          </div>
          <strong>{cropAreas.reduce((total, item) => total + item.acres, 0)} acres</strong>
        </div>

        <div className="bar-chart" role="img" aria-label="Crop area by acres">
          {cropAreas.map((item) => (
            <div className="bar-row" key={item.crop}>
              <div className="bar-meta">
                <span>{item.crop}</span>
                <strong>{item.acres}</strong>
              </div>
              <div className="bar-track">
                <span style={{ width: `${(item.acres / maxAcres) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
