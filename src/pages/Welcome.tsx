import React from "react";

const technologies = [
  "React 18 (frontend)",
  "TypeScript",
  "Vite (build tool)",
  "Express (backend)",
  "Auth0 (Okta Customer Identity Cloud)",
  "@auth0/auth0-react (Auth0 React SDK)",
  // ...removed Axios (HTTP client)
  "Cloudflare Workers (deployment)",
  "Node.js"
];

const features = [
  "Custom Token Exchange: Exchange tokens between Auth0 and external IdPs (see dedicated page)",
  "Passwordless Authentication: Log in with a magic link sent to your email (Universal Login)",
  "OIDC Workforce Login: Enterprise login via OIDC Workforce connection (if enabled)",
  "DAE Admin Login: Delegated Admin Extension demo for admin access flows",
  "Adaptive MFA: Step-up authentication using Guardian MFA for database users, with custom claims",
  "Token / Profile Page: View and decode your access and ID tokens side by side, including custom claims and SAML attributes",
  "Sidebar Navigation: Quickly access all authentication flows and documentation",
  "Logout: Fully clear Auth0 and IdP sessions, including local tokens, for all login types"
];


const Welcome = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%" }}>
    <h1 className="main-title" style={{ textAlign: "center", marginBottom: 24 }}>
      Welcome to the Auth0 CIC Demo Application
    </h1>
    <div className="action-card" style={{ maxWidth: 800, margin: "0 auto", background: "#23263a", borderRadius: 12, padding: "2rem" }}>
      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <h2 style={{ color: "#ed8936", marginBottom: 12, textAlign: "left" }}>Project Features & Auth0 Capabilities</h2>
        <div style={{ color: "#a0aec0", fontSize: "1.1rem", margin: "1.5rem 0", textAlign: "left" }}>
          {features.map((feature, idx) => (
            <React.Fragment key={feature}>
              <div style={{ marginBottom: 8 }}>{feature}</div>
              {idx < features.length - 1 && <div style={{ height: 12 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <p style={{ color: "#63b3ed", marginTop: 24, fontWeight: 500 }}>
        Use the sidebar to explore all features. For more details, see the documentation pages included in this project.
      </p>
      <div style={{ marginTop: 40, textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
        <h2 style={{ color: "#63b3ed", marginBottom: 12, textAlign: "left" }}>Technologies Used</h2>
        <div style={{ color: "#a0aec0", fontSize: "1.1rem", margin: "1.5rem 0", textAlign: "left" }}>
          {technologies.map((tech) => (
            <div key={tech} style={{ marginBottom: 8 }}>{tech}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Welcome;
