import { SubscriptionManager } from "../../components/SubscriptionManager";

export default function SubscriptionPage() {
  return (
    <div>
      <section className="section">
        <h1>Subscription</h1>
        <p>Switch plans for the demo workspace and preview billing controls.</p>
      </section>

      <section className="section">
        <SubscriptionManager />
      </section>
    </div>
  );
}
