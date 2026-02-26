import React from 'react';

const sectionStyle: React.CSSProperties = {
  background: '#2d313c',
  borderRadius: '10px',
  padding: '1.25rem',
  marginBottom: '1rem',
};

const credentialStyle: React.CSSProperties = {
  background: '#1a1e27',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  marginTop: '0.5rem',
  fontFamily: 'monospace',
  fontSize: '0.9rem',
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  textDecoration: 'none',
  marginRight: '0.75rem',
  marginTop: '0.5rem',
};

const DaeExtensionPage: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '900px' }}>
    <h1>Delegated Administration Extension (DAE)</h1>
    <p>
      The <strong>DAE</strong> allows you to delegate user management to non-technical users without full Auth0 Dashboard access. It provides a secure interface for managing users, roles, and permissions scoped to specific organizations.
    </p>
    <div style={{ marginBottom: '1.5rem' }}>
      <a 
        href="https://auth0.com/docs/customize/extensions/delegated-administration-extension" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ ...buttonStyle, background: '#4a5568', color: '#fff' }}
      >
        Auth0 Documentation
      </a>
      <a 
        href="https://demo-lyvoc.eu.webtask.run/auth0-delegated-admin" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ ...buttonStyle, background: '#805ad5', color: '#fff' }}
      >
        Open DAE App
      </a>
    </div>

    <h2>Use Cases</h2>

    <div style={sectionStyle}>
      <h3>7.1 Assigning a Delegated Administrator - Auditor</h3>
      <p>Assign DA role scoped to Organization <strong>Schleuniger Head</strong>. Auditor can only <em>read</em> users.</p>
      <div style={credentialStyle}>
        <strong>head.admin2@schleuniger.fr</strong> / Password1234
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Roles: <em>Delegated Admin - Auditor</em>, <em>Schleuniger Head Admin</em></p>
    </div>

    <div style={sectionStyle}>
      <h3>7.2 Using a Delegated Administrator - Operator</h3>
      <p>Operator role scoped to <strong>Schleuniger Head</strong>. Can read and perform actions on users.</p>
      <div style={credentialStyle}>
        <strong>head.admin@schleuniger.fr</strong> / Password1234
      </div>
    </div>

    <div style={sectionStyle}>
      <h3>7.3 Komax Singapore Admin - Permission Scope</h3>
      <p>DAs cannot exceed their granted permission set when creating users.</p>
      <div style={credentialStyle}>
        <strong>singapore.admin@komax.fr</strong> / Password1234
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        Assignable DAE Roles: <em>Administrator, Operator, Auditor, User</em><br />
        Assignable Business Roles: <em>Komax Head Admin, Komax Singapore Admin</em>
      </p>
    </div>

    <div style={sectionStyle}>
      <h3>7.4 & 7.5 Komax Head Admin - User Creation</h3>
      <p>Create users with scoped permissions. New users receive organization invitations.</p>
      <div style={credentialStyle}>
        <strong>head.admin@komax.fr</strong> / Password1234
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        Test user: <em>jeremie.poisson+test@lyvoc.com</em> (Connection: DB, no roles)
      </p>
    </div>

    <div style={sectionStyle}>
      <h3>7.6 Komax Head Admin - Creating an Admin</h3>
      <p>Create admin users with DAE and business roles pre-assigned.</p>
      <div style={credentialStyle}>
        <strong>head.admin@komax.fr</strong> / Password1234
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        Test admin: <em>jeremie.poisson+test2@lyvoc.com</em><br />
        DAE Role: <em>Delegated Admin - Operator</em> | Business Role: <em>Komax Singapore Admin</em>
      </p>
    </div>

    <div style={sectionStyle}>
      <h3>7.7 DA Resets a User Password</h3>
      <p>DAs can reset passwords only for users within their organization scope.</p>
      <p style={{ fontSize: '0.9rem' }}>Log in as any Komax Singapore admin, select a user, click <strong>Reset Password</strong>.</p>
    </div>
  </div>
);

export default DaeExtensionPage;
