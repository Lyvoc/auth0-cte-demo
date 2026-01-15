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
      <li>Email: <strong>daetest@gmail.com</strong></li>
      <li>Password: <strong>Password1234</strong></li>
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
