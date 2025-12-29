import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import TokenExchange from './TokenExchange';

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <img 
          src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png" 
          alt="Auth0 Logo" 
          className="auth0-logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="main-title">Custom Token Exchange Demo</h1>
        
        {/* Token Exchange Demo - Available without login */}
        <TokenExchange />
        
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #4a5568" }}>
          <h2 style={{ color: "#a0aec0", textAlign: "center", marginBottom: "1rem" }}>
            Optional: Regular Auth0 Login
          </h2>
          {isAuthenticated ? (
            <div className="logged-in-section">
              <div className="logged-in-message">✅ Successfully authenticated!</div>
              <h2 className="profile-section-title">Your Profile</h2>
              <div className="profile-card">
                <Profile />
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div className="action-card">
              <p className="action-text">Test standard Auth0 login flow</p>
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;