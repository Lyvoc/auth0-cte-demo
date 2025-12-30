import { useState } from "react";

// Use environment variable for backend URL, fallback to localhost for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
}

interface ExternalTokenData {
  userId: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

const TokenExchange = () => {
  const [externalToken, setExternalToken] = useState<string>("");
  const [externalTokenData, setExternalTokenData] = useState<ExternalTokenData | null>(null);
  const [auth0AccessToken, setAuth0AccessToken] = useState<string>("");
  const [auth0IdToken, setAuth0IdToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [userEmail, setUserEmail] = useState("demo@example.com");
  const [userName, setUserName] = useState("Demo User");

  const generateExternalToken = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${BACKEND_URL}/api/generate-demo-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName
        })
      });
      if (!response.ok) {
        throw new Error('Failed to generate token');
      }
      const data = await response.json();
      setExternalToken(data.token);
      // Decode the token (base64) and set as externalTokenData
      try {
        const decoded = JSON.parse(atob(data.token));
        setExternalTokenData(decoded);
      } catch (decodeErr) {
        setExternalTokenData(null);
      }
    } catch (err: any) {
      setError(`Error generating token: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exchangeToken = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${BACKEND_URL}/api/exchange-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subjectToken: externalToken
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Token exchange failed');
      }
      
      const tokens = await response.json();
      setAuth0AccessToken(tokens.access_token);
      setAuth0IdToken(tokens.id_token || '');
    } catch (err: any) {
      setError(`Error exchanging token: ${err.message}`);
      console.error("Error exchanging token:", err);
    } finally {
      setLoading(false);
    }
  };

  const decodeJWT = (token: string): DecodedToken | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      return {
        header: JSON.parse(atob(parts[0])),
        payload: JSON.parse(atob(parts[1])),
        signature: parts[2]
      };
    } catch (err) {
      console.error("Error decoding JWT:", err);
      return null;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const ExternalTokenDisplay = () => {
    if (!externalToken) return null;

    return (
      <div className="token-card">
        <div className="token-card-header">
          <h3 className="token-card-title token-card-title-external">
            External/Legacy Token
          </h3>
          <button
            onClick={() => copyToClipboard(externalToken, "External Token")}
            className="token-copy-button token-copy-button-external"
          >
            📋 Copy
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div className="token-section-label">
            Raw Token (Base64):
          </div>
          <div className="token-raw-display">
            {externalToken}
          </div>
        </div>

        {externalTokenData && (
          <div style={{ marginBottom: "1rem" }}>
            <div className="token-section-label">
              Decoded Token Data:
            </div>
            <pre className="token-decoded-display">
              {JSON.stringify(externalTokenData, null, 2)}
            </pre>
          </div>
        )}

        <div className="token-meta-section">
          <div className="token-meta-item">
            <strong className="token-meta-label">Source:</strong> Legacy System / External IdP
          </div>
          <div>
            <strong className="token-meta-label">Type:</strong> urn:mycompany:legacy-system
          </div>
        </div>
      </div>
    );
  };

  const TokenDisplay = ({ token, title }: { token: string; title: string }) => {
    const decoded = token ? decodeJWT(token) : null;

    return (
      <div className="token-card">
        <div className="token-card-header">
          <h3 className="token-card-title token-card-title-auth0">
            {title}
          </h3>
          {token && (
            <button
              onClick={() => copyToClipboard(token, title)}
              className="token-copy-button"
            >
              📋 Copy
            </button>
          )}
        </div>

        {!token ? (
          <div className="token-empty-state">
            No token available yet
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="token-section-label">
                Raw Token:
              </div>
              <div className="token-raw-display">
                {token}
              </div>
            </div>

            {decoded && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <div className="token-section-label">
                    Payload:
                  </div>
                  <pre className="token-decoded-display">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="token-section-label">
                    Custom Claims:
                  </div>
                  <div className="token-meta-section">
                    {Object.entries(decoded.payload)
                      .filter(([key]) => key.startsWith('https://'))
                      .map(([key, value]) => (
                        <div key={key} className="token-claims-item">
                          <strong className="token-claims-key">{key.split('/').pop()}:</strong>{" "}
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="token-exchange-container">
      <div className="token-exchange-header">
        <h2 className="token-exchange-title">
          🔄 Custom Token Exchange Demo
        </h2>
        <p className="token-exchange-description">
          Exchange external/legacy tokens for Auth0 tokens
        </p>

        {error && (
          <div className="token-error">
            ⚠️ {error}
          </div>
        )}

        <div className="token-step-section">
          <h3 className="token-step-title">
            Step 1: Generate External/Legacy Token
          </h3>
          <div className="token-input-group">
            <div className="token-input-wrapper">
              <label>
                Email:
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="token-input"
              />
            </div>
            <div className="token-input-wrapper">
              <label>
                Name:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="token-input"
              />
            </div>
          </div>
          <button
            onClick={generateExternalToken}
            disabled={loading}
            className="token-button token-button-generate"
          >
            {loading ? "Generating..." : "🎫 Generate External Token"}
          </button>
        </div>

        {externalToken && (
          <div className="token-step-section">
            <h3 className="token-step-title" style={{ color: "#48bb78" }}>
              Step 2: Exchange for Auth0 Tokens
            </h3>
            <button
              onClick={exchangeToken}
              disabled={loading || !externalToken}
              className="token-button token-button-exchange"
            >
              {loading ? "Exchanging..." : "🔄 Exchange Token via Auth0"}
            </button>
          </div>
        )}
      </div>

      <div className="token-displays-grid">
        <ExternalTokenDisplay />
        {auth0AccessToken && <TokenDisplay token={auth0AccessToken} title="Auth0 Access Token" />}
        {auth0IdToken && <TokenDisplay token={auth0IdToken} title="Auth0 ID Token" />}
      </div>

      <div className="token-how-it-works">
        <h3>📝 How Custom Token Exchange Works:</h3>
        <ol>
          <li>
            <strong>External Token Generation:</strong> User provides credentials/data from a legacy system or external IdP
          </li>
          <li>
            <strong>Backend Receives Token:</strong> Your backend receives the external token
          </li>
          <li>
            <strong>Token Exchange Request:</strong> Backend calls Auth0's <code>/oauth/token</code> endpoint
          </li>
          <li>
            <strong>Auth0 Action Validates:</strong> Custom Token Exchange Action validates the external token and sets the Auth0 user
          </li>
          <li>
            <strong>Auth0 Issues Tokens:</strong> Auth0 returns access_token, id_token, and refresh_token
          </li>
          <li>
            <strong>User Authenticated:</strong> User can now access your application with Auth0 tokens
          </li>
        </ol>
        <div className="token-use-cases-box">
          <p>
            💡 <strong>Use Cases:</strong>
          </p>
          <ul>
            <li>Migrate users from legacy authentication systems</li>
            <li>Accept tokens from partner identity providers</li>
            <li>Implement custom authentication flows</li>
            <li>Just-in-time user provisioning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenExchange;
