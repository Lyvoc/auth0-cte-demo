# Auth0 Custom Token Exchange - Complete Setup Guide

This guide walks you through setting up **Auth0's Custom Token Exchange** feature to exchange external/legacy tokens for Auth0 tokens.

> ⚠️ **Important**: Custom Token Exchange is an Early Access feature available for Auth0 Enterprise and B2B Pro customers.

## What You'll Build

A complete token exchange flow that:
1. Generates a demo "external" token (simulating a legacy system)
2. Exchanges it for Auth0 tokens via your backend
3. Displays both tokens side-by-side

## Prerequisites
- Auth0 account (Enterprise or B2B Pro for CTE feature)
- Node.js installed
- Basic understanding of OAuth 2.0

## Step 1: Get Management API Access

You need a Management API token to configure Custom Token Exchange.

1. **Go to Auth0 Dashboard** → **Applications** → **APIs** → **Auth0 Management API**
2. Click **API Explorer** tab
3. Click **Create & Authorize a Test Application**
4. **Copy the token** that appears
5. Required scopes:
   - `read:clients`
   - `update:clients`
   - `create:actions`
   - `read:actions`
   - `create:token_exchange_profiles`

**Save this token** - you'll use it in Step 4.


## Step 2: Create/Configure Your Application

> 🔑 **Important Architecture**: 
> - Your **frontend** is a React SPA (runs in browser)
> - Your **backend** is an Express server (runs on server)
> - **Token exchange happens in the backend** using a `client_secret`
> - **All Auth0 application types have client secrets** - including SPAs
> - The key is to **only use the secret server-side**, never in browser code

1. **Navigate to Applications**
   - Go to your Auth0 Dashboard: https://manage.auth0.com/
   - Click on "Applications" in the left sidebar
   - Click on "Applications" again in the submenu

2. **Use Existing or Create New Application**
   
   **Option A: Use your existing SPA (Recommended)**
   - Go to your SPA application settings
   - Go to the "Settings" tab → "Basic Information"
   - Click "Show" next to **Client Secret** and copy it
   - ✅ Your application can remain as "Single Page Application" type
   - The secret will only be used in your backend server (never exposed to the browser)
   
   **Option B: Create a separate application for the backend**
   - Click "+ Create Application"
   - Choose any type (SPA, Regular Web App, or M2M)
   - Name it "Token Exchange Backend"
   - Use this client's ID and secret in your `.env` file

3. **Configure Application Settings**
   - Go to the "Settings" tab
   - **Copy these values:**
     - `Domain`: Your Auth0 domain (e.g., `your-tenant.auth0.com` or `your-tenant.us.auth0.com`)
     - `Client ID`: Your application Client ID
     - `Client Secret`: Click "Show" and **copy it** - add to .env as `AUTH0_CLIENT_SECRET`
   
   - **Scroll to Advanced Settings** → **OAuth** tab:
     - Verify **OIDC Conformant**: ON

   - **URLs (in Settings tab):**
     - **Allowed Callback URLs**: `http://localhost:5173`
     - **Allowed Logout URLs**: `http://localhost:5173`
     - **Allowed Web Origins**: `http://localhost:5173`
   
   - Click **"Save Changes"**

> 🔒 **Security Note**: The client secret should **ONLY** be stored in your backend `.env` file and used in `server.js`. Never include it in frontend code or commit it to version control.

---

## Step 3: Create a Custom API

1. **Navigate to APIs**
   - In the Auth0 Dashboard, click on "Applications" → "APIs"

2. **Create New API (if not exists)**
   - Click the "+ Create API" button
   - **Name**: `My Demo API`
   - **Identifier**: `https://my-api.example.com` (already in your .env)
   - **Signing Algorithm**: RS256 (default)
   - Click "Create"

---

## Step 4: Enable Custom Token Exchange for Your Application

> **Important**: This step enables token exchange for a specific Auth0 application (client).
> - Use the Client ID from Step 2 (can be an SPA, Regular Web App, or M2M)
> - This is the SAME client whose `client_secret` you'll use in your backend `.env` file
> - All Auth0 application types have client secrets - just use them securely (server-side only)

Use PowerShell to enable token exchange via Management API:

```powershell
$domain = "your-tenant.auth0.com"  # Your actual Auth0 domain
$clientId = "YOUR_CLIENT_ID"  # YOUR application Client ID from Step 2
$managementToken = "YOUR_MANAGEMENT_API_TOKEN"  # From Step 1

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $managementToken"
}

$body = @{
    token_exchange = @{
        allow_any_profile_of_type = @("custom_authentication")
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://$domain/api/v2/clients/$clientId" `
    -Method PATCH `
    -Headers $headers `
    -Body $body
```

You should see a response confirming token_exchange is enabled.

---

## Step 5: Create Custom Token Exchange Action

---

## Step 5: Create Custom Token Exchange Action

> ⚠️ **Important**: This is a **Custom Token Exchange** Action, NOT a Post Login Action!

1. **Navigate to Actions**
   - In the Auth0 Dashboard, click on "Actions" → "Library"

2. **Create Custom Action**
   - Click "+ Create Action" → **"Build from Scratch"**
   - **Name**: `Custom Token Exchange Handler`
   - **Trigger**: Select **"Custom Token Exchange"** (NOT "Login / Post Login"!)
   - Click "Create"

3. **Add Action Code**
   Replace the default code with:

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
      'Users',
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

4. **Deploy the Action**
   - Click **"Deploy"** (top right)
   
5. **Copy the Action ID**
   - Look at the browser URL
   - The Action ID is the last part: `https://manage.auth0.com/.../actions/{ACTION_ID}`
   - Example: `act_abc123xyz`
   - **Save this ID** for Step 6

---

## Step 6: Create Token Exchange Profile

Use PowerShell to create the profile:

```powershell
$domain = "demo-lyvoc.eu.auth0.com"  # Your actual Auth0 domain
$managementToken = "YOUR_MANAGEMENT_API_TOKEN"  # From Step 1
$actionId = "YOUR_ACTION_ID"  # From Step 5

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $managementToken"
}

$body = @{
    name = "legacy-system-migration"
    subject_token_type = "urn:mycompany:legacy-system"
    action_id = $actionId
    type = "custom_authentication"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://$domain/api/v2/token-exchange-profiles" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

You should receive a response with the profile ID. **Custom Token Exchange is now configured!**

---

## Step 7: Update Environment Variables

---

## Step 7: Update Environment Variables

Your `.env` file should have:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID  # Same Client ID from Step 2 & Step 4
VITE_AUTH0_AUDIENCE=https://my-api.example.com
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET  # The client_secret for the above Client ID
```

**⚠️ Critical**: 
- `VITE_AUTH0_CLIENT_ID` must match the Client ID you enabled token exchange for in Step 4
- `AUTH0_CLIENT_SECRET` must be the secret for that SAME client (visible in Application Settings → Basic Information)
- ✅ Your application can remain as "Single Page Application" type
- 🔒 **Never use `AUTH0_CLIENT_SECRET` in frontend code** - it's only for the backend server (server.js)

---

## Step 8: Install Dependencies and Run

1. **Install backend dependencies:**
```bash
npm install
```

2. **Start both frontend and backend:**
```bash
npm run dev:all
```

Or run separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

3. **Open your browser:** http://localhost:5173

---

## How to Use the Demo

1. **Enter user details** (email and name)
2. **Click "Generate External Token"** - Creates a demo legacy system token
3. **Click "Exchange Token via Auth0"** - Exchanges it for Auth0 tokens
4. **View the results:**
   - External/Legacy Token (left): Your input token
   - Auth0 Access Token (middle): JWT with standard claims
   - Auth0 ID Token (right): User identity with app_metadata (legacy_user_id, migration_source, migrated_at)

---

## How It Works
(React SPA) sends to backend** (`POST /api/exchange-token`)
3. **Backend (Express server) calls Auth0** with `grant_type=urn:ietf:params:oauth:grant-type:token-exchange` using client_secret
4. **Auth0 Action validates** the external token
5. **Auth0 provisions/finds user** based on email
6. **Auth0 issues new tokens** (access_token, id_token, refresh_token)
7. **Frontend displays tokens** side-by-side

> 🔒 **Security Note**: Token exchange happens server-side (backend) where the client_secret is kept secure. Even though the Auth0 application may be configured as "Single Page Application", the client_secret is NEVER exposed to the browser - it's only used in your Express backend (server.js).

---

## Troubleshooting

### "Token exchange is not enabled for this client"
- Run the PATCH request from Step 4 again
- Verify you're using the correct client_id
- Check your Management API token has `update:clients` scope
- Application type (SPA, Regular Web App, etc.) doesn't matter - all have client secrets

### "Custom Token Exchange Profile not found"
- Verify Step 6 completed successfully
- Check the `subject_token_type` matches exactly: `urn:mycompany:legacy-system`

### "invalid_token" error
- Check the external token format in the Action code
- Verify the token isn't expired
- Check Action logs: Actions → Library → Your Action → "Real-time Webtask Logs"

### Backend connection refused
- Ensure backend is running: `npm run dev:backend`
- Check it's on port 3001: http://localhost:3001
- Verify client secret in .env file

### "User provisioning failed"
- Check the database connection exists and is named correctly in the Action code
- Enable it for your application: Applications → Your App → Connections tab
- Verify the connection name in the Action matches your database connection (e.g., "Users")

---

## Use Cases for Custom Token Exchange

- **Legacy System Migration**: Gradually migrate users without forcing password resets
- **Partner SSO**: Accept tokens from partner identity providers
- **Just-in-Time Provisioning**: Create Auth0 users on-demand during authentication
- **Custom Authentication Flows**: Implement proprietary authentication methods

---

## Resources

- [Auth0 Custom Token Exchange Docs](https://auth0.com/docs/authenticate/custom-token-exchange)
- [RFC 8693 - OAuth Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Management API Documentation](https://auth0.com/docs/api/management/v2)
- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
