import { NotificationSettings } from "../../components/NotificationSettings";

const notifications = [
  { title: "Low Inventory Alert", message: "Urea Fertilizer is approaching its reorder threshold.", priority: "High" },
  { title: "Harvest Reminder", message: "Potato harvest needs equipment and labor scheduling.", priority: "Normal" },
  { title: "Equipment Maintenance", message: "Potato Harvester service is due May 20, 2026.", priority: "Normal" },
];

export default function NotificationsPage() {
  return (
    <div>
      <section className="section">
        <h1>Notifications</h1>
        <p>Review active alerts and manage delivery preferences.</p>
      </section>

      <section className="section">
        <div className="card-list">
          {notifications.map((notification) => (
            <article className="card" key={notification.title}>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <span className="status-pill attention">{notification.priority}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <NotificationSettings />
      </section>
    </div>
  );
}
