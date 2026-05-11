const equipment = [
  { name: "John Deere Tractor", type: "Tractor", status: "Available", condition: "Good", service: "Jul 1, 2026" },
  { name: "Center Pivot Irrigator", type: "Irrigator", status: "In use", condition: "Good", service: "Sep 15, 2026" },
  { name: "Potato Harvester", type: "Harvester", status: "Maintenance", condition: "Good", service: "May 20, 2026" },
];

export default function EquipmentPage() {
  return (
    <div>
      <section className="section">
        <h1>Equipment</h1>
        <p>Track machinery availability, condition, and service windows.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Type</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Next service</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.status}</td>
                <td>{item.condition}</td>
                <td>{item.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
