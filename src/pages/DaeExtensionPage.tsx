import React from 'react';

const DaeExtensionPage: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Delegated Administration Extension (DAE)</h1>
    <p>
      The <strong>Delegated Administration Extension (DAE)</strong> is an Auth0 extension that allows you to delegate user management tasks to non-technical users, such as help desk administrators, without giving them full access to the Auth0 Dashboard. This extension provides a secure and customizable interface for managing users, roles, and permissions.
    </p>
    <p>
      <a href="https://auth0.com/docs/customize/extensions/delegated-administration-extension" target="_blank" rel="noopener noreferrer">
        Learn more about the DAE Extension in the Auth0 documentation
      </a>
    </p>
    <h2>Test Credentials</h2>
    <ul>
      <li>
        <strong>Admin User</strong><br />
        Email: <strong>daetest@gmail.com</strong><br />
        Password: <strong>Password1234</strong><br />
        <em>This user has full delegated admin permissions in the DAE app.</em>
      </li>
      <li style={{ marginTop: '1rem' }}>
        <strong>Auditor User</strong><br />
        Email: <strong>daeauditor@gmail.com</strong><br />
        Password: <strong>Password1234</strong><br />
        <em>This user has the <strong>auditor</strong> role, which provides fewer permissions than the admin user. The auditor can view user information but cannot perform management actions. This demonstrates how DAE can be used to assign different levels of access to different users, supporting the principle of least privilege.</em>
      </li>
    </ul>
    <h2>DAE App Link</h2>
    <p>
      <a href="https://demo-lyvoc.eu.webtask.run/auth0-delegated-admin" target="_blank" rel="noopener noreferrer">
        Open the DAE App
      </a>
    </p>
  </div>
);

export default DaeExtensionPage;
