# Auth0 Custom Token Exchange - Complete Implementation Guide

This guide implements **Auth0's Custom Token Exchange** feature (RFC 8693), which allows you to exchange external tokens for Auth0 tokens.

> ⚠️ **Note**: Custom Token Exchange is currently in Early Access for Enterprise and B2B Pro customers.

## What is Custom Token Exchange?

Custom Token Exchange allows you to:
- Exchange tokens from external identity providers for Auth0 tokens
- Migrate users from legacy systems without storing passwords
- Implement custom authentication flows
- Use tokens from partner systems to authenticate users

## Architecture Overview

```
1. User has external token (from legacy system, partner IdP, etc.)
2. Frontend sends token to your backend
3. Backend calls Auth0 /oauth/token with grant_type=urn:ietf:params:oauth:grant-type:token-exchange
4. Auth0 Action validates the external token
5. Auth0 issues new Auth0 tokens for the user
```

## Prerequisites

- Auth0 Enterprise or B2B Pro subscription
- Auth0 tenant with Custom Token Exchange enabled (Early Access)
- Management API access

---

## Step 1: Get Management API Token

You'll need a Management API token to configure Custom Token Exchange.

1. Go to Auth0 Dashboard → **Applications** → **APIs** → **Auth0 Management API**
2. Click **API Explorer** tab
3. Click **Create & Authorize a Test Application**
4. Copy the token (or use your own M2M application with Management API scopes)

Required scopes:
- `read:clients`
- `update:clients`
- `create:actions`
- `read:actions`
- `create:token_exchange_profiles`
- `read:token_exchange_profiles`

---

## Step 2: Configure Your Application for Token Exchange

### 2.1 Create/Update Application Settings

First, ensure your application is First-Party and OIDC-Conformant:

1. Go to **Applications** → **Applications** → Select your app
2. Go to **Settings** → **Advanced Settings** → **OAuth**
3. Check:
   - ✅ **OIDC Conformant**: ON
   - ✅ **Application Type**: First-Party (should show "First Party" badge)

### 2.2 Enable Token Exchange via Management API

Use the Management API to enable token exchange for your application:

```bash
curl --location --request PATCH 'https://your-tenant.auth0.com/api/v2/clients/YOUR_CLIENT_ID' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_MANAGEMENT_API_TOKEN' \
--data '{
  "token_exchange": {
    "allow_any_profile_of_type": ["custom_authentication"]
  }
}'
```

Replace:
- `demo-cic.lyvoc.com` with your Auth0 domain
- `YOUR_CLIENT_ID` with your actual Client ID
- `YOUR_MANAGEMENT_API_TOKEN` with your Management API token

---

## Step 3: Create Custom Token Exchange Action

### 3.1 Create the Action

1. Go to **Actions** → **Library** → **Create Action** → **Build from Scratch**
2. **Name**: `Custom Token Exchange Handler`
3. **Trigger**: Select **Custom Token Exchange** (not Post Login!)
4. Click **Create**

### 3.2 Add Action Code

This Action validates the external token and sets the user:

```javascript
/**
 * Handler for Custom Token Exchange
 * @param {Event} event - Details about the token exchange request
 * @param {CustomTokenExchangeAPI} api - Methods to control the exchange
 */
exports.onExecuteCustomTokenExchange = async (event, api) => {
  const namespace = 'https://my-api.example.com';
  
  // Get the external token being exchanged
  const subjectToken = event.transaction.subject_token;
  const subjectTokenType = event.transaction.subject_token_type;
  
  console.log('Token Exchange Request:', {
    subject_token_type: subjectTokenType
  });

  // Validate it's our expected token type
  if (subjectTokenType !== 'urn:mycompany:legacy-system') {
    return api.access.deny('unsupported_token_type', 'Unsupported token type');
  }

  // STEP 1: Decode and validate the external token
  let externalUserId;
  let userEmail;
  let userName;
  
  try {
    // Decode the base64 token (this is our demo format)
    const decoded = Buffer.from(subjectToken, 'base64').toString('utf-8');
    const tokenData = JSON.parse(decoded);
    
    // Validate token has required fields
    if (!tokenData.userId || !tokenData.email) {
      return api.access.deny('invalid_token', 'Token missing required fields');
    }
    
    // Check expiration
    if (tokenData.exp && tokenData.exp < Date.now() / 1000) {
      return api.access.deny('token_expired', 'External token has expired');
    }
    
    externalUserId = tokenData.userId;
    userEmail = tokenData.email;
    userName = tokenData.name || 'User';
    
  } catch (error) {
    console.error('Token validation error:', error);
    return api.access.deny('invalid_token', 'Failed to validate token');
  }

  // STEP 2: Set the Auth0 user (create if doesn't exist)
  try {
    api.authentication.setUserByConnection(
      'Users',  // Your database connection name - update if different
      {
        user_id: externalUserId,
        email: userEmail,
        email_verified: true,
        name: userName,
        verify_email: false
      },
      {
        creationBehavior: 'create_if_not_exists',
        updateBehavior: 'none'
      }
    );
  } catch (error) {
    console.error('Error setting user:', error);
    return api.access.deny('user_provisioning_failed', 'Failed to provision user');
  }

  // STEP 3: Set user metadata (can be used later in Post Login Action for custom claims)
  api.user.setAppMetadata('legacy_user_id', externalUserId);
  api.user.setAppMetadata('migration_source', 'legacy-system');
  api.user.setAppMetadata('migrated_at', new Date().toISOString());
  
  console.log('Token exchange successful for:', userEmail);
};
```

> **Important Notes:**
> - Custom Token Exchange Actions use `api.authentication.setUserByConnection()` to provision users
> - Custom claims (`api.accessToken.setCustomClaim()`) are NOT supported in CTE Actions
> - Instead, use `api.user.setAppMetadata()` to store data
> - To add custom claims to tokens, create a Post Login Action that reads the app_metadata
> - Update the connection name `'Users'` to match your Auth0 database connection

### 3.3 Deploy the Action

1. Click **Deploy** (top right)
2. **Important**: Copy the Action ID from the URL (e.g., `act_abc123xyz`)
   - The Action ID is the last part of the URL: `https://manage.auth0.com/dashboard/.../actions/act_abc123xyz`

---

## Step 4: Create Token Exchange Profile

Use the Management API to create a Custom Token Exchange Profile:

```bash
curl --location 'https://demo-cic.lyvoc.com/api/v2/token-exchange-profiles' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_MANAGEMENT_API_TOKEN' \
--data '{
  "name": "legacy-system-migration",
  "subject_token_type": "urn:mycompany:legacy-system",
  "action_id": "YOUR_ACTION_ID",
  "type": "custom_authentication"
}'
```

Replace:
- `YOUR_MANAGEMENT_API_TOKEN` with your Management API token
- `YOUR_ACTION_ID` with the Action ID from Step 3.3
- `urn:mycompany:legacy-system` with your unique token type identifier

**Important**: The `subject_token_type` must:
- Start with `https://` or `urn:`
- Be unique across your tenant
- Not use reserved namespaces (auth0, okta, ietf)

You should receive a response with the profile ID:
```json
{
  "id": "tep_abc123",
  "name": "legacy-system-migration",
  "type": "custom_authentication",
  "subject_token_type": "urn:mycompany:legacy-system",
  "action_id": "act_abc123xyz"
}
```

---

## Step 5: Implement Backend Token Exchange

Your backend needs to call Auth0's `/oauth/token` endpoint to exchange tokens.

### Example: Node.js Backend

```javascript
// backend/tokenExchange.js
const axios = require('axios');

async function exchangeToken(externalToken) {
  const domain = 'your-tenant.auth0.com';
  const clientId = 'YOUR_CLIENT_ID';
  const clientSecret = 'YOUR_CLIENT_SECRET'; // From Auth0 Application settings
  const audience = 'https://my-api.example.com';
  
  try {
    const response = await axios.post(`https://${domain}/oauth/token`, {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: clientId,
      client_secret: clientSecret,
      subject_token: externalToken,
      subject_token_type: 'urn:mycompany:legacy-system',
      audience: audience,
      scope: 'openid profile email read:data write:data'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return {
      access_token: response.data.access_token,
      id_token: response.data.id_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in
    };
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    throw error;
  }
}

// Express endpoint
app.post('/api/exchange-token', async (req, res) => {
  const { external_token } = req.body;
  
  if (!external_token) {
    return res.status(400).json({ error: 'Missing external_token' });
  }
  
  try {
    const tokens = await exchangeToken(external_token);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Token exchange failed' });
  }
});
```

---

## Step 6: Update Frontend to Use Token Exchange

Create a component to demonstrate token exchange:

```typescript
// src/TokenExchangeDemo.tsx
import { useState } from 'react';

const TokenExchangeDemo = () => {
  const [externalToken, setExternalToken] = useState('');
  const [auth0Tokens, setAuth0Tokens] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDemoToken = () => {
    // Generate a demo external token (base64 encoded JSON)
    const tokenData = {
      userId: 'legacy-user-12345',
      email: 'user@example.com',
      name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    setExternalToken(token);
  };

  const exchangeToken = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_token: externalToken
        })
      });
      
      if (!response.ok) {
        throw new Error('Token exchange failed');
      }
      
      const tokens = await response.json();
      setAuth0Tokens(tokens);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Custom Token Exchange Demo</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={generateDemoToken}>
          Generate Demo External Token
        </button>
      </div>
      
      {externalToken && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>External Token:</h3>
          <textarea 
            value={externalToken}
            onChange={(e) => setExternalToken(e.target.value)}
            rows={5}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
      )}
      
      <button 
        onClick={exchangeToken}
        disabled={!externalToken || loading}
      >
        {loading ? 'Exchanging...' : 'Exchange for Auth0 Tokens'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          Error: {error}
        </div>
      )}
      
      {auth0Tokens && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Auth0 Tokens:</h3>
          <pre>{JSON.stringify(auth0Tokens, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TokenExchangeDemo;
```

---

## Testing the Implementation

1. **Generate a test external token**
2. **Call your backend endpoint** with the external token
3. **Backend calls Auth0** `/oauth/token` with token exchange grant
4. **Auth0 Action validates** the external token
5. **Auth0 issues new tokens** for the user
6. **Frontend receives** Auth0 access token, ID token, refresh token

---

## Troubleshooting

### "Token exchange is not enabled"
- Verify you've made the PATCH request to enable token_exchange in Step 2.2
- Check your tenant has Custom Token Exchange enabled (Early Access feature)

### "Invalid action_id"
- Ensure the Action is deployed
- Verify the Action ID matches the one from the Action URL

### "Unsupported subject_token_type"
- Verify the token exchange profile was created successfully
- Ensure subject_token_type matches between the profile and your request

### "User not found"
- Check your Action's user lookup logic
- Verify the connection exists and is enabled for your application

---

## Use Cases

1. **Legacy System Migration**: Exchange tokens from old system during migration
2. **Partner SSO**: Accept tokens from partner identity providers
3. **Custom Authentication**: Implement custom auth flows with external validation
4. **Just-in-Time User Provisioning**: Create users on-demand during token exchange

---

## Resources

- [Auth0 Custom Token Exchange Docs](https://auth0.com/docs/authenticate/custom-token-exchange)
- [RFC 8693 - OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Management API - Token Exchange Profiles](https://auth0.com/docs/api/management/v2/token-exchange-profiles)
