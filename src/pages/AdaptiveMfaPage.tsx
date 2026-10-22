import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { clearBrowserSession } from "../utils/clearSession";
import { PENDING_ADAPTIVE_MFA_LOGIN } from "../config/adaptiveMfa";

const AdaptiveMfaPage: React.FC = () => {
  const { logout } = useAuth0();

  // Log out first (clears the Auth0/IdP session), then App.tsx resumes the
  // login with the Users connection once Auth0 redirects back.
  const handleLogoutThenLogin = () => {
    clearBrowserSession();
    sessionStorage.setItem(PENDING_ADAPTIVE_MFA_LOGIN, "1");
    logout({
      logoutParams: {
        returnTo: window.location.origin,
        federated: true,
      },
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Adaptive MFA</h2>
      <p>
        <b>Adaptive Multi-Factor Authentication (MFA)</b> is a security feature that evaluates risk factors such as user location, device, and behavior to determine when to prompt for additional authentication. This helps balance security and user experience by only requiring MFA when necessary.
      </p>
      <p>
        The button below will log in using the <b>Users</b> database connection. Adaptive MFA is configured to trigger only for this connection.
      </p>

      <button
        onClick={handleLogoutThenLogin}
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
};

export default AdaptiveMfaPage;
