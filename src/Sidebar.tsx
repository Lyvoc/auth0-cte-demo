  const handleDAELogin = () => {
    window.location.href = "https://demo-lyvoc.eu.auth0.com/u/login/identifier?state=hKFo2SBCb1VNcUVPVEwxTGxzemZMaGN6ZUZxVGRSOEZEQS00SqFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHVlSjg0RkpsNmxOYWpZOVFKdGh6Z0NPNV90eHJrem5fo2NpZNkgbEdveEt1M1dOWGN4c0U3eXl4NTRad2VadkU4NVQ5RnY&ui_locales=en";
  };

import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = () => {
  const { loginWithRedirect, logout } = useAuth0();


  const handlePasswordless = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "email", // Change to your passwordless connection name (e.g., "email" or "sms")
        redirect_uri: window.location.origin + "/token"
      }
    });
  };

  const handleOktaWorkforce = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "lyvoc", // Okta Workforce connection name
        redirect_uri: window.location.origin + "/token"
      }
    });
  };

  return (
    <nav
      style={{
        width: 220,
        background: "#23263a",
        minHeight: "100vh",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ color: "#f7fafc", fontWeight: 700, fontSize: 18 }}>Auth0 CIC Demo</div>
      </div>
      <NavLink to="/" end style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Welcome
      </NavLink>
      <NavLink to="/token-exchange" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Custom Token Exchange
      </NavLink>
      <NavLink to="/adaptive-mfa" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Adaptive MFA
      </NavLink>
      <NavLink to="/token" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
      })}>
        Token / Profile
      </NavLink>
      <button
        onClick={handlePasswordless}
        style={{
          marginTop: 32,
          background: "#ed8936",
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
        Passwordless Login
      </button>
      <button
        onClick={handleDAELogin}
        style={{
          marginTop: 16,
          background: "#38a169",
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
        DAE Admin Login
      </button>
      <button
        onClick={handleOktaWorkforce}
        style={{
          marginTop: 16,
          background: "#63b3ed",
          color: "#23263a",
          border: "none",
          borderRadius: 8,
          padding: "0.9rem 1.2rem",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Okta Workforce (lyvoc)
      </button>
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to log out?")) {
            logout({ logoutParams: { returnTo: window.location.origin } });
          }
        }}
        style={{
          marginTop: 16,
          background: "#c53030",
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
        Log Out
      </button>
    </nav>
  );
};

export default Sidebar;
