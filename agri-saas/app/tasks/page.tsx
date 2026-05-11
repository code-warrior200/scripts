const tasks = [
  { title: "Inspect irrigation system", owner: "Noah Bennett", due: "May 12, 2026", priority: "High", status: "In progress" },
  { title: "Schedule potato harvest", owner: "Maya Collins", due: "May 18, 2026", priority: "Urgent", status: "Pending" },
  { title: "Order fertilizer supply", owner: "Maya Collins", due: "May 20, 2026", priority: "Medium", status: "Pending" },
  { title: "Equipment maintenance", owner: "John Mitchell", due: "May 22, 2026", priority: "Normal", status: "Planned" },
];

export default function TasksPage() {
  return (
    <div>
      <section className="section">
        <h1>Tasks</h1>
        <p>Coordinate field work, maintenance, harvesting, and procurement from one queue.</p>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Owner</th>
              <th>Due</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.title}>
                <td>{task.title}</td>
                <td>{task.owner}</td>
                <td>{task.due}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
