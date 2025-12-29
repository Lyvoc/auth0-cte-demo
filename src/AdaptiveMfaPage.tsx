import React from "react";

const AdaptiveMfaPage: React.FC = () => (
  <div style={{ padding: 24 }}>
    <h2>Adaptive MFA</h2>
    <p>
      <b>Adaptive Multi-Factor Authentication (MFA)</b> is a security feature that evaluates risk factors such as user location, device, and behavior to determine when to prompt for additional authentication. This helps balance security and user experience by only requiring MFA when necessary.
    </p>
    <p>
      The button below will log in using the <b>Users</b> database connection. Adaptive MFA is configured to trigger only for this connection.
    </p>

    <button
      onClick={() => {
        window.location.href =
          "https://demo-lyvoc.eu.auth0.com/authorize?response_type=code&client_id=Yf2tITbm5pGvZGRrzWnMq9xBZtZriuaF&redirect_uri=" +
          encodeURIComponent(window.location.origin + "/token") +
          "&scope=openid%20profile%20email&connection=Users";
      }}
      style={{
        marginTop: 32,
        background: "#3182ce",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "0.9rem 1.2rem",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      Login with Users (Adaptive MFA)
    </button>
  </div>
);

export default AdaptiveMfaPage;
