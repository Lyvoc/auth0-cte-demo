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

const DEMO_PASSWORD = "Test123456Abc!";

type TestStep = {
  title: string;
  where: string;
  instructions?: (string | { warning: string })[];
  account?: string;
};

const testPlan: TestStep[] = [
  {
    title: "Email / password login (SPA)",
    where: "Menu: Token / Profile → Log In",
    account: "demo-login-pwd@lyvoc.com",
  },
  {
    title: "Test SSO between the SPA and the web app",
    where: "Open the web app: http://localhost:3000/",
  },
  {
    title: "Login with two MFA factors (WebAuthn + SMS)",
    where: "Menu: Adaptive MFA → Log In",
    account: "user-with-mfa-db@lyvoc.com",
  },
  {
    title: "Invite a user to an organization",
    where: "Auth0 → Organizations → client-1 → Invite",
    instructions: [
      "Log out first (sidebar → Log Out)",
      "Invite the email below, then copy the invitation URL.",
      { warning: "Before opening the invitation URL, change its domain to http://localhost:8080/ (keep the path and query string)." },
      "Open the invitation URL in the browser.",
      "Create the account using the password below.",
    ],
    account: "demo-org-client-1-test.login-pwd@lyvoc.com",
  },
  {
    title: "Login through an organization (email / password)",
    where: "Menu: Organization → client-1",
    account: "demo-org-client-1.login-pwd@lyvoc.com",
  },
  {
    title: "Login to org 2 with an Okta IdP",
    where: "Menu: Organization → client-2",
    account: "leo.airaudi+okta@lyvoc-okta.com",
  },
  {
    title: "Login to org 3 with another Auth0 tenant",
    where: "Menu: Organization → client-3",
    account: "demo-user-other-auth0@exemple.com",
  },
  {
    title: "DAE (Delegated Admin Extension)",
    where: "Open: http://localhost:8080/dae-extension",
    account: "demo-login-pwd@lyvoc.com",
  },
];

const monoStyle: React.CSSProperties = {
  fontFamily: "monospace",
  background: "#1a1d2e",
  borderRadius: 4,
  padding: "2px 6px",
  color: "#e2e8f0",
  userSelect: "all",
};

const Welcome = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%" }}>
    <h1 className="main-title" style={{ textAlign: "center", marginBottom: 24 }}>
      Welcome to the Auth0 CIC Demo Application
    </h1>
    <div
      className="action-card"
      style={{
        maxWidth: 1300,
        width: "100%",
        margin: "0 auto",
        background: "#23263a",
        borderRadius: 12,
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
        gap: "3rem",
        alignItems: "start",
      }}
    >
      <div>
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
      <div style={{ textAlign: "left" }}>
        <h2 style={{ color: "#48bb78", marginBottom: 12 }}>Demo Test Plan</h2>
        <p style={{ color: "#a0aec0", marginBottom: 16 }}>
          Run the steps in order. All test accounts share the password <code style={monoStyle}>{DEMO_PASSWORD}</code>.
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {testPlan.map((step, idx) => (
            <li
              key={step.title}
              style={{ background: "#1a1d2e", borderRadius: 8, padding: "1rem 1.25rem", borderLeft: "4px solid #48bb78" }}
            >
              <div style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: 6 }}>
                Step {idx + 1} — {step.title}
              </div>
              <div style={{ color: "#63b3ed", marginBottom: 6 }}>{step.where}</div>
              {step.instructions && (
                <ul style={{ color: "#a0aec0", margin: "0 0 6px", paddingLeft: 20 }}>
                  {step.instructions.map((line) =>
                    typeof line === "string" ? (
                      <li key={line}>{line}</li>
                    ) : (
                      <li key={line.warning} style={{ color: "#ed8936", listStyle: "none", marginLeft: -20 }}>
                        ⚠️ {line.warning}
                      </li>
                    )
                  )}
                </ul>
              )}
              {step.account && (
                <div style={{ color: "#a0aec0", marginBottom: 6 }}>
                  Account: <code style={monoStyle}>{step.account}</code>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);

export default Welcome;
