import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";


const decodeJWT = (token: string) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return {
      header: JSON.parse(atob(parts[0])),
      payload: JSON.parse(atob(parts[1])),
      signature: parts[2],
    };
  } catch {
    return null;
  }
};

const TokenPage = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, getIdTokenClaims, user } = useAuth0();
  const [accessToken, setAccessToken] = React.useState<string>("");
  const [idTokenValue, setIdTokenValue] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [copiedAccess, setCopiedAccess] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then(setAccessToken)
        .catch((err) => setError(err.message));
      getIdTokenClaims()
        .then((claims) => {
          if (claims && claims.__raw) {
            setIdTokenValue(claims.__raw);
          } else {
            setIdTokenValue("");
          }
        })
        .catch(() => setIdTokenValue(""));
    }
  }, [isAuthenticated, getAccessTokenSilently, getIdTokenClaims]);

  const decodedAccess = decodeJWT(accessToken);
  const decodedId = decodeJWT(idTokenValue);

  const handleCopyAccess = () => {
    navigator.clipboard.writeText(accessToken);
    setCopiedAccess(true);
    setTimeout(() => setCopiedAccess(false), 1200);
  };
  const handleCopyId = () => {
    navigator.clipboard.writeText(idTokenValue);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1200);
  };


  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="loading-text" style={{ color: "#63b3ed", fontSize: 24 }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <h2 style={{ color: "#f7fafc" }}>You need to log in to view your token</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1600, width: "100%", margin: "2rem auto", background: "#2d313c", borderRadius: 15, padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ color: "#63b3ed", marginBottom: 24, textAlign: "center" }}>Your Auth0 Tokens</h2>
      {error && <div style={{ color: "#fc8181", marginBottom: 16 }}>{error}</div>}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", width: "100%" }}>
        {/* Access Token Column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: "#ed8936", marginBottom: 8 }}>Access Token</h3>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#a0aec0", fontSize: 15 }}>Raw Token:</span>
            <button onClick={handleCopyAccess} className="token-copy-button" style={{ fontSize: 14 }}>
              {copiedAccess ? "Copied!" : "📋 Copy"}
            </button>
          </div>
          <div style={{ background: "#1a1e27", padding: 16, borderRadius: 8, color: "#e2e8f0", fontFamily: "monospace", wordBreak: "break-all", marginBottom: 24, maxHeight: 200, overflow: "auto" }}>
            {accessToken || "No access token available."}
          </div>
          {decodedAccess && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Header:</div>
                <pre className="token-decoded-display">{JSON.stringify(decodedAccess.header, null, 2)}</pre>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Payload:</div>
                <pre className="token-decoded-display">{JSON.stringify(decodedAccess.payload, null, 2)}</pre>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Signature:</div>
                <div className="token-raw-display">{decodedAccess.signature}</div>
              </div>
            </>
          )}
        </div>
        {/* ID Token Column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: "#38a169", marginBottom: 8 }}>ID Token</h3>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#a0aec0", fontSize: 15 }}>Raw Token:</span>
            <button onClick={handleCopyId} className="token-copy-button" style={{ fontSize: 14 }}>
              {copiedId ? "Copied!" : "📋 Copy"}
            </button>
          </div>
          <div style={{ background: "#1a1e27", padding: 16, borderRadius: 8, color: "#e2e8f0", fontFamily: "monospace", wordBreak: "break-all", marginBottom: 24, maxHeight: 200, overflow: "auto" }}>
            {idTokenValue || "No ID token available."}
          </div>
          {decodedId && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Header:</div>
                <pre className="token-decoded-display">{JSON.stringify(decodedId.header, null, 2)}</pre>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Payload:</div>
                <pre className="token-decoded-display">{JSON.stringify(decodedId.payload, null, 2)}</pre>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="token-section-label">Signature:</div>
                <div className="token-raw-display">{decodedId.signature}</div>
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{ marginTop: 32, color: "#a0aec0", textAlign: "center" }}>
        <strong>User:</strong> {user?.email || user?.name || "Unknown"}
      </div>
    </div>
  );
};

export default TokenPage;
