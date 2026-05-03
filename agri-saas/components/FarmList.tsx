type Farm = {
  id: string;
  name: string;
  region: string;
  status: string;
  crops: string[];
};

export function FarmList({ farms }: { farms: Farm[] }) {
  return (
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
  );
}
