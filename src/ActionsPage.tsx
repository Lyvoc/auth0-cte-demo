import React from "react";

const ActionsPage = () => (
  <div style={{ maxWidth: 800, margin: "2rem auto", background: "#23263a", borderRadius: 12, padding: "2rem" }}>
    <h2 style={{ color: "#ed8936", marginBottom: 18 }}>Auth0 Actions</h2>
    <p style={{ color: "#a0aec0", fontSize: 18, marginBottom: 24 }}>
      <b>Actions</b> in Auth0 are secure, extensible functions that execute at specific points in the authentication and authorization pipeline. They allow you to customize and extend Auth0's behavior, such as adding custom claims, integrating with external APIs, or enforcing business logic during login, user registration, token issuance, and more.
    </p>
    <ul style={{ color: "#e2e8f0", fontSize: 16, marginLeft: 24 }}>
      <li><b>Post-Login:</b> Run after a user successfully authenticates. Add claims, call APIs, or modify tokens.</li>
      <li><b>Pre-User Registration:</b> Validate or enrich user data before registration completes.</li>
      <li><b>Post-User Registration:</b> Trigger actions after a new user signs up (e.g., send welcome emails).</li>
      <li><b>Machine to Machine:</b> Customize token issuance for client credentials flows.</li>
      <li><b>Custom Token Exchange:</b> Triggered during custom token exchange flows to validate, transform, or enrich tokens between identity providers.</li>
    </ul>
    <p style={{ color: "#63b3ed", marginTop: 24 }}>
      Actions are managed in the Auth0 Dashboard under <b>Actions</b>. They are the recommended way to extend Auth0, replacing legacy Rules and Hooks.
    </p>
  </div>
);

export default ActionsPage;
