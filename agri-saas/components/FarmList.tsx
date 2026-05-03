import Link from "next/link";

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
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {farms.map((farm) => (
          <tr key={farm.id}>
            <td>
              <Link className="table-link" href={`/farms/${farm.id}`}>
                {farm.name}
              </Link>
            </td>
            <td>{farm.region}</td>
            <td>{farm.crops.length}</td>
            <td>{farm.status}</td>
            <td>
              <Link className="table-action" href={`/farms/${farm.id}`}>
                View details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
