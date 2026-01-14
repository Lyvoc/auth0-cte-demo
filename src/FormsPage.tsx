import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const actionCode = `exports.onExecutePostLogin = async (event, api) => {
  // Only show form for users from 'lyvoc' connection
  // who haven't accepted the policy yet
  if (
    event.connection.name === 'lyvoc' &&
    event.user.app_metadata?.isLoremIpsumPolicyAccepted !== true
  ) {
    api.prompt.render('ap_e7WVdUGskJhURkrx5UYbHP');
  }
};

exports.onContinuePostLogin = async (event, api) => {
  // After form completion, set the flag to true
  api.user.setAppMetadata('isLoremIpsumPolicyAccepted', true);
};`;

const FormsPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div style={{ padding: 24 }}>
      <h2>Auth0 Forms & Custom Actions</h2>
      <p>
        <b>Forms</b> in Auth0 Actions allow you to collect additional information or require user consent during the authentication flow. You can prompt users with custom forms based on conditions, such as connection or user metadata.
      </p>
      <p>
        <b>Example: Policy Acceptance Form</b>
      </p>
      <p>
        The following Auth0 Action logic shows a form to users from the <b>lyvoc</b> connection who have not yet accepted a policy. After the form is completed, a flag is set in the user's app_metadata:
      </p>
      <pre style={{ background: '#23263a', color: '#e2e8f0', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
        <code>{actionCode}</code>
      </pre>
      <p>
        <b>How it works:</b>
        <ul>
          <li>If the user logs in via the <b>lyvoc</b> connection and has not accepted the policy, Auth0 renders a form (ID: <code>ap_e7WVdUGskJhURkrx5UYbHP</code>).</li>
          <li>After the user completes the form, <code>onContinuePostLogin</code> sets <code>isLoremIpsumPolicyAccepted</code> to <code>true</code> in their app_metadata.</li>
        </ul>
      </p>
      <p>
        <b>Try Workforce Identity Login:</b>
      </p>
      <button
        onClick={() => {
          loginWithRedirect({
            authorizationParams: {
              connection: "lyvoc",
              redirect_uri: window.location.origin + "/token",
              scope: "openid profile email",
              prompt: "login"
            }
          });
        }}
        style={{
          marginTop: 24,
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
        Login with Okta Workforce (OIDC)
      </button>
    </div>
  );
};

export default FormsPage;
