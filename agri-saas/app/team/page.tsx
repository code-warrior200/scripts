const team = [
  { name: "John Mitchell", role: "Administrator", email: "admin@sunnyacres.com", status: "Active" },
  { name: "Maya Collins", role: "Farm Manager", email: "maya@sunnyacres.com", status: "Active" },
  { name: "Noah Bennett", role: "Staff", email: "noah@sunnyacres.com", status: "Active" },
];

export default function TeamPage() {
  return (
    <div>
      <section className="section">
        <h1>Team</h1>
        <p>Review workspace access and operating responsibilities for the demo farm.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.email}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.email}</td>
                <td>{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
