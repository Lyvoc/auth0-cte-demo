import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>;
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  return (
    isAuthenticated && user ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        {user.picture && (
          <img 
            src={user.picture} 
            alt={user.name || 'User'} 
            className="profile-picture"
            style={{ 
              width: '110px', 
              height: '110px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '3px solid #63b3ed'
            }}
          />
        )}
        <div style={{ width: '100%', background: '#2d313c', borderRadius: '15px', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#f7fafc', marginBottom: '1.5rem', borderBottom: '1px solid #4a5568', paddingBottom: '0.5rem' }}>
            User Profile Information
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(user).map(([key, value]) => (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', alignItems: 'start' }}>
                <div style={{ 
                  color: '#a0aec0', 
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  wordBreak: 'break-word'
                }}>
                  {key.replace(/_/g, ' ')}:
                </div>
                <div style={{ 
                  color: '#f7fafc',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  fontFamily: key === 'sub' ? 'monospace' : 'inherit'
                }}>
                  {formatValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          width: '100%', 
          background: '#2d313c', 
          borderRadius: '15px', 
          padding: '2rem', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginTop: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#f7fafc', marginBottom: '1.5rem', borderBottom: '1px solid #4a5568', paddingBottom: '0.5rem' }}>
            Raw User Object
          </h2>
          <pre style={{ 
            background: '#1a1e27', 
            padding: '1rem', 
            borderRadius: '8px',
            overflowX: 'auto',
            color: '#a0aec0',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    ) : null
  );
};

export default Profile;