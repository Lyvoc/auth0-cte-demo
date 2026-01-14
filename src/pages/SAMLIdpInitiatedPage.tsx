import React from "react";

const SAMLIdpInitiatedPage: React.FC = () => (
  <div style={{ maxWidth: 800, margin: "2rem auto", background: "#23263a", borderRadius: 15, padding: "2rem", color: "#e2e8f0" }}>
    <h2 style={{ color: "#63b3ed", marginBottom: 18 }}>SAML IdP-Initiated Login Flow</h2>
    <p style={{ marginBottom: 16 }}>
      <b>IdP-initiated SSO</b> means the authentication flow starts from the Identity Provider (IdP), not from this app. The IdP authenticates the user and sends a SAML assertion to your app's SAML endpoint, logging the user in.
    </p>
    <div style={{
      margin: '32px 0 24px 0',
      textAlign: 'center',
      background: '#1a202c',
      borderRadius: 10,
      padding: '1.2rem 1.2rem 1.5rem 1.2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      marginBottom: 32
    }}>
      <div style={{ marginBottom: 18, color: '#f7fafc', fontWeight: 600, fontSize: 18 }}>
        <span style={{ color: '#63b3ed' }}>Test Credentials</span>
        <div style={{ marginTop: 8, fontSize: 16, color: '#e2e8f0' }}>
          <div><b>Email:</b> test123@gmail.com</div>
          <div><b>Password:</b> Password1234</div>
        </div>
      </div>
      <button
        onClick={() => window.open("https://darius-test-lyvoc.eu.auth0.com/samlp/oSvYuQlm5XjUS9morF4Z0lNWBBETMRKV", "_blank", "noopener,noreferrer")}
        style={{
          background: "#2b6cb0",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "1.1rem 2.2rem",
          fontWeight: 700,
          fontSize: 18,
          cursor: "pointer",
          marginBottom: 10
        }}
      >
        Open IdP Portal (IdP-initiated SSO)
      </button>
      <div style={{ color: '#a0aec0', fontSize: 15, marginTop: 10 }}>
        This will open the IdP portal in a new tab.<br />
        After authenticating, you will be redirected to <b>/token</b> in this app and your tokens will be displayed.
      </div>
    </div>
    <h3 style={{ color: "#ed8936", marginBottom: 10 }}>How the Flow Works</h3>
    <ul style={{ marginBottom: 16 }}>
      <li>The IdP authenticates you and sends a SAML assertion to Auth0 (as SP).</li>
      <li>Auth0 processes the assertion and redirects you to this app's callback URL (e.g., <b>/token</b>).</li>
      <li>If tokens are returned in the URL hash, the <b>/token</b> page parses and displays them, even if the SDK is not authenticated.</li>
    </ul>
    <h3 style={{ color: "#ed8936", marginBottom: 10 }}>Why Custom Handling Is Needed</h3>
    <ul style={{ marginBottom: 16 }}>
      <li>The Auth0 React SDK does not natively support IdP-initiated login (tokens in hash fragment).</li>
      <li>This app adds custom code to <b>/token</b> to parse and display tokens from the URL hash for IdP-initiated flows.</li>
    </ul>
    <div style={{ marginTop: 24, fontSize: 15, color: "#a0aec0" }}>
      For more details, see <b>IDP_INITIATED_SSO_README.md</b> and the implementation in <b>src/TokenPage.tsx</b>.
    </div>
    <h3 style={{ color: "#ed8936", marginBottom: 10 }}>How the Flow Works</h3>
    <ul style={{ marginBottom: 16 }}>
      <li>The IdP authenticates you and sends a SAML assertion to Auth0 (as SP).</li>
      <li>Auth0 processes the assertion and redirects you to this app's callback URL (e.g., <b>/token</b>).</li>
      <li>If tokens are returned in the URL hash, the <b>/token</b> page parses and displays them, even if the SDK is not authenticated.</li>
    </ul>
    <h3 style={{ color: "#ed8936", marginBottom: 10 }}>Why Custom Handling Is Needed</h3>
    <ul style={{ marginBottom: 16 }}>
      <li>The Auth0 React SDK does not natively support IdP-initiated login (tokens in hash fragment).</li>
      <li>This app adds custom code to <b>/token</b> to parse and display tokens from the URL hash for IdP-initiated flows.</li>
    </ul>
    <div style={{ marginTop: 24, fontSize: 15, color: "#a0aec0" }}>
      For more details, see <b>IDP_INITIATED_SSO_README.md</b> and the implementation in <b>src/TokenPage.tsx</b>.
    </div>
  </div>
);

export default SAMLIdpInitiatedPage;
