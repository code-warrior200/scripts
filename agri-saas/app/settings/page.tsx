export default function SettingsPage() {
  return (
    <div>
      <section className="section">
        <h1>Settings</h1>
        <p>Configure your account, team access, and subscription plan.</p>
      </section>

      <section className="section">
        <div className="card">
          <strong>Subscription</strong>
          <p>Current plan: Premium</p>
          <button className="primary">Manage subscription</button>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <strong>Notifications</strong>
          <p>Receive updates for irrigation, harvest, and inventory alerts.</p>
          <button className="primary">Edit notifications</button>
        </div>
      </section>
    </div>
  );
}
