
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const sectionStyle: React.CSSProperties = {
  background: "#2d313c",
  borderRadius: "10px",
  padding: "1.25rem 1.5rem",
  marginBottom: "1.5rem",
};

const orgHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "0.75rem",
};

const orgIdBadge: React.CSSProperties = {
  background: "#1a1e27",
  color: "#a78bfa",
  fontFamily: "monospace",
  fontSize: "0.82rem",
  padding: "0.2rem 0.6rem",
  borderRadius: "5px",
  letterSpacing: "0.02em",
};

const credentialStyle: React.CSSProperties = {
  background: "#1a1e27",
  padding: "0.65rem 1rem",
  borderRadius: "6px",
  marginTop: "0.4rem",
  fontFamily: "monospace",
  fontSize: "0.88rem",
};


const loginBtnStyle: React.CSSProperties = {
  marginTop: "1rem",
  background: "#805ad5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.65rem 1.1rem",
  fontWeight: 600,
  fontSize: "0.95rem",
  cursor: "pointer",
};

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #3a3f50",
  margin: "0.85rem 0",
};

const OrganizationPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleOrgLogin = (orgId: string) => {
    loginWithRedirect({
      authorizationParams: {
        organization: orgId,
        redirect_uri: window.location.origin + "/token",
        scope: "openid profile email",
      },
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Auth0 Organizations</h1>
      <p>
        <strong>Organizations</strong> in Auth0 allow you to model business customers, partners, or teams as
        first-class entities. Each organization can have its own set of users, connections, roles, and branding —
        essential for B2B SaaS applications managing multi-tenant access.
      </p>
      <p>
        This section is the primary focus of the demo. It shows how Komax can{" "}
        <strong>delegate scoped administrative rights</strong> to Organization admins — whether they are Komax
        employees or customer employees — while Komax retains full control over the permission ceiling for each
        Delegated Administrator (DA).
      </p>

      <hr style={dividerStyle} />

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>

      {/* ── Komax Head ── */}
      <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
        <div style={orgHeaderStyle}>
          <h2 style={{ margin: 0 }}>Komax Head</h2>
          <span style={orgIdBadge}>org_uLeRVSP3bEako1sl</span>
        </div>
        <p style={{ marginTop: 0 }}>
          The central Komax organization. Head admins define the permission ceiling for all Delegated
          Administrators across child organizations and can create users with scoped DA and business roles.
        </p>

        <h4 style={{ marginBottom: "0.4rem" }}>Relevant DAE Use Cases</h4>

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>Assign DA – Auditor</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            Assign the <em>Delegated Admin - Auditor</em> role scoped to Schleuniger Head. Auditor can{" "}
            <em>read only</em>.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> head.admin2@schleuniger.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
            <br />
            <span style={{ color: "#a78bfa" }}>Roles:</span> Delegated Admin - Auditor · Schleuniger Head Admin
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>DA – Operator</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            Operator role scoped to Schleuniger Head. Can read users <em>and</em> perform management actions within
            the organization.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> head.admin@schleuniger.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>Komax Head Admin – User Creation</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            Create a standard user (Connection: DB, no roles). User is created in the tenant and receives an organization invitation.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> head.admin@komax.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>Komax Head Admin – Creating an Admin</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            Create an admin with Connection: DAE-DB, DAE Role: <em>Delegated Admin - Operator</em>, Business Role:{" "}
            <em>Komax Singapore Admin</em>. User is created and roles are immediately assigned.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> head.admin@komax.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
          </div>
        </div>

        <button style={loginBtnStyle} onClick={() => handleOrgLogin("org_uLeRVSP3bEako1sl")}>
          Login as Komax Head
        </button>
      </div>

      {/* ── Schleuniger Singapore ── */}
      <div style={{ ...sectionStyle, flex: 1, marginBottom: 0 }}>
        <div style={orgHeaderStyle}>
          <h2 style={{ margin: 0 }}>Schleuniger Singapore</h2>
          <span style={orgIdBadge}>org_hsE9ZHkDxEluGIs1</span>
        </div>
        <p style={{ marginTop: 0 }}>
          A customer organization under the Komax umbrella. Schleuniger admins can be granted Delegated
          Administrator rights, scoped exclusively to this organization — they have no access to other
          organizations.
        </p>

        <h4 style={{ marginBottom: "0.4rem" }}>Relevant DAE Use Cases</h4>

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>Komax Singapore Admin – Permission Scope on User Creation</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            DAs cannot exceed their granted permission ceiling. When creating a user, only the roles below the
            ceiling are selectable.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> singapore.admin@komax.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
            <br />
            <span style={{ color: "#a78bfa" }}>Assignable DAE Roles:</span> Administrator · Operator · Auditor ·
            User
            <br />
            <span style={{ color: "#a78bfa" }}>Assignable Business Roles:</span> Komax Head Admin · Komax Singapore
            Admin
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={{ marginBottom: "0.6rem" }}>
          <strong>DA Resets a User Password</strong>
          <p style={{ margin: "0.3rem 0 0.2rem", fontSize: "0.9rem" }}>
            Log in as the Komax Singapore admin (or any DA), select a user, and click{" "}
            <strong>Reset Password</strong>. Scope enforcement is demonstrated — the DA cannot reset passwords for
            users outside their organization.
          </p>
          <div style={credentialStyle}>
            <span style={{ color: "#a78bfa" }}>Username:</span> singapore.admin@komax.fr
            <br />
            <span style={{ color: "#a78bfa" }}>Password:</span> Password1234
          </div>
        </div>

        <button style={loginBtnStyle} onClick={() => handleOrgLogin("org_hsE9ZHkDxEluGIs1")}>
          Login as Schleuniger Singapore
        </button>
      </div>

      </div>{/* ── end flex row ── */}

      <div style={{ marginTop: "1.5rem" }} />

      {/* ── Key Concepts ── */}
      <div style={{ ...sectionStyle, background: "#23273a" }}>
        <h3 style={{ marginTop: 0 }}>Key Concepts</h3>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: "1.8" }}>
          <li>Each user can belong to one or more organizations.</li>
          <li>Organizations can have their own login experience and branding.</li>
          <li>
            Access is managed at the organization level — roles and permissions are scoped per org.
          </li>
          <li>
            Login flows can be customized per organization using the <code>org_id</code> parameter.
          </li>
          <li>
            <strong>Delegated Admins</strong> manage only their own organization — they cannot view or affect other
            orgs.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationPage;
