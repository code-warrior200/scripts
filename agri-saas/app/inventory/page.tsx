const inventory = [
  { name: "Urea Fertilizer", type: "Fertilizer", quantity: "5,000 kg", reorder: "1,000 kg", location: "Warehouse A" },
  { name: "Corn Seeds", type: "Seed", quantity: "200 kg", reorder: "50 kg", location: "Cold Storage" },
  { name: "Glyphosate", type: "Herbicide", quantity: "25 liters", reorder: "10 liters", location: "Chemical Storage" },
  { name: "Diesel Fuel", type: "Fuel", quantity: "2,000 liters", reorder: "500 liters", location: "Fuel Tank" },
];

export default function InventoryPage() {
  return (
    <div>
      <section className="section">
        <h1>Inventory</h1>
        <p>Monitor seed, fertilizer, chemicals, fuel, and reorder thresholds.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>On hand</th>
              <th>Reorder at</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.quantity}</td>
                <td>{item.reorder}</td>
                <td>{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
