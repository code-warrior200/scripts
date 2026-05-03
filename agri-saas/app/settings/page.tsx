import { NotificationSettings } from "../../components/NotificationSettings";
import { SubscriptionManager } from "../../components/SubscriptionManager";

export default function SettingsPage() {
  return (
    <div>
      <section className="section">
        <h1>Settings</h1>
        <p>Configure your account, team access, and subscription plan.</p>
      </section>

      <section className="section">
        <SubscriptionManager />
      </section>

      <section className="section">
        <NotificationSettings />
      </section>
    </div>
  );
}
