import React from "react";

const LogStreamsPage: React.FC = () => (
  <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ color: "#63b3ed", marginBottom: 16 }}>Auth0 Log Streams Demo</h2>
    <p style={{ marginBottom: 16 }}>
      This page documents how Auth0 Log Streams can be used to push authentication and security logs to a third-party system in real time.
    </p>
    <h3 style={{ color: "#ed8936", marginBottom: 8 }}>How this was set up:</h3>
    <ol style={{ marginBottom: 16, color: "#a0aec0" }}>
      <li>Go to <b>Auth0 Dashboard → Monitoring → Streams</b>.</li>
      <li>Click <b>+ Create Stream</b> and select <b>Custom Webhook</b>.</li>
      <li>
        Get a temporary webhook URL from <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ed' }}>webhook.site</a>:
        visit the site and copy the unique URL shown (it will look like <i>https://webhook.site/&lt;your-id&gt;</i>).
        Paste that URL into the Webhook URL field in Auth0.
      </li>
      <li>Leave the Authorization Header blank (not required for webhook.site).</li>
      <li>Click <b>Create Stream</b> and then <b>Start Stream</b>.</li>
      <li>Trigger log events (e.g., login, logout) in your app.</li>
    </ol>
    <h3 style={{ color: "#38a169", marginBottom: 8 }}>View the logs:</h3>
    <p>
      You can view the real-time logs sent by Auth0 by opening <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" style={{ color: '#63b3ed' }}>webhook.site</a> and pasting your unique inspection URL (or use the inspector link shown when you create a new webhook.site endpoint).
      Do not reuse the example URL shown in earlier drafts — create and use your own temporary endpoint for testing.
    </p>
    <p style={{ marginTop: 12, color: '#e53e3e' }}>
      Demo configuration note: this implementation was configured in the Auth0 dashboard using the webhook URL
      <span style={{ color: '#63b3ed' }}> https://webhook.site/1ffeaca0-6569-4ee8-9cd0-34a5a660994f</span>. This URL is included here only to indicate how the demo was set up — for your own testing, generate and use a fresh webhook.site URL or a secure endpoint under your control.
    </p>
    <p style={{ marginTop: 24, color: '#a0aec0' }}>
      <b>Note:</b> For production, use your own secure endpoint and consider adding authentication to the webhook.
    </p>
  </div>
);

export default LogStreamsPage;
