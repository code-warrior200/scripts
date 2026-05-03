type StatCardProps = {
  label: string;
  value: string | number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="card">
      <strong>{label}</strong>
      <div className="stat-value">{value}</div>
    </div>
  );
}
