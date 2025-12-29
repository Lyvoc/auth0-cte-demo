import React from "react";

const ORGANIZATION_ID = "org_NuioIiSZARzIcDR9";
const CLIENT_ID = "Yf2tITbm5pGvZGRrzWnMq9xBZtZriuaF"; // Main app client ID
const DOMAIN = "demo-lyvoc.eu.auth0.com";

const OrganizationPage: React.FC = () => {
  const handleOrgLogin = () => {
    const redirectUri = encodeURIComponent(window.location.origin + "/token");
    const url = `https://${DOMAIN}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&organization=${ORGANIZATION_ID}`;
    window.location.href = url;
  };

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>Organization Login</h2>
      <p>
        Click the button below to log in as a member of your organization using Auth0 Organizations.
      </p>
      <button
        onClick={handleOrgLogin}
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
        }}
      >
        Login with Organization
      </button>
    </div>
  );
};

export default OrganizationPage;
