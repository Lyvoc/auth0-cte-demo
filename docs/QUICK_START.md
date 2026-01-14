# Quick Start - Custom Token Exchange Demo

## ⚡ What You're Building

A live demo that exchanges external/legacy tokens for Auth0 tokens using the official Custom Token Exchange feature.

## 🎯 Before You Start

✅ Dependencies installed: `npm install` (already done!)  
⚠️ Need Auth0 configuration  
⚠️ Need Management API token  
⚠️ Need Client Secret from Auth0

## 📝 Required Auth0 Configuration

### 1. Get Your Client Secret

1. Go to https://manage.auth0.com/
2. Applications → Applications → Your App
3. Settings tab → **Client Secret** → Click "Show" → **Copy it**
4. Add to `.env`: `AUTH0_CLIENT_SECRET=your-secret-here`

### 2. Get Management API Token

1. Applications → APIs → Auth0 Management API
2. API Explorer tab → "Create & Authorize a Test Application"
3. **Copy the token**
4. Save for Steps 3 & 4

### 3. Enable Token Exchange

Run in PowerShell:

```powershell
$domain = "your-tenant.auth0.com"
$clientId = "YOUR_CLIENT_ID"
$token = "PASTE_YOUR_MANAGEMENT_TOKEN_HERE"

Invoke-RestMethod -Uri "https://$domain/api/v2/clients/$clientId" `
  -Method PATCH `
  -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body '{"token_exchange":{"allow_any_profile_of_type":["custom_authentication"]}}'
```

### 4. Create Custom Token Exchange Action

1. Actions → Library → "+ Create Action" → "Build from Scratch"
2. Name: `Custom Token Exchange Handler`
3. **Trigger**: Select **"Custom Token Exchange"** ⚠️ NOT "Post Login"!
4. Paste code from [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md) Step 5
5. Click **Deploy**
6. **Copy Action ID** from URL (e.g., `act_abc123`)

### 5. Create Token Exchange Profile

Run in PowerShell:

```powershell
$actionId = "PASTE_YOUR_ACTION_ID_HERE"  # From step 4

Invoke-RestMethod -Uri "https://$domain/api/v2/token-exchange-profiles" `
  -Method POST `
  -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body (@{
    name = "legacy-system-migration"
    subject_token_type = "urn:mycompany:legacy-system"
    action_id = $actionId
    type = "custom_authentication"
  } | ConvertTo-Json)
```

## 🚀 Run the App

```bash
npm run dev:all
```

Opens:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🎮 How to Use

1. **Enter email/name** in the form
2. **Click "Generate External Token"** → See base64-encoded demo token
3. **Click "Exchange Token via Auth0"** → Backend exchanges it
4. **View results:**
   - Left: External token (from "legacy system")
   - Middle: Auth0 Access Token (with custom claims!)
   - Right: Auth0 ID Token (user identity)

## ✅ What to Look For

### In the Auth0 Action Logs:
Go to Actions → Library → Your Custom Token Exchange Action → "Real-time Webtask Logs":

**Successful Exchange:**
- `Token Exchange Request: { subject_token_type: 'urn:mycompany:legacy-system' }`
- `Token exchange successful for: [user-email]`

**Common Errors:**
- `unsupported_token_type` - Wrong subject_token_type
- `invalid_token` - Token validation failed
- `token_expired` - External token is expired
- `user_provisioning_failed` - Database connection issue

### In the Tokens:

**External/Legacy Token (Left):**
- Base64-encoded demo token
- Contains: userId, email, name, exp, iat
- Simulates token from legacy system

**Auth0 Access Token (Middle):**
- Standard JWT format
- Audience: `https://my-api.example.com`
- Standard claims: sub, iss, aud, exp, iat
- No custom claims (those require Post Login Action)

**Auth0 ID Token (Right):**
- User identity token
- Standard OIDC claims: sub, email, name, email_verified
- **App Metadata** (stored during token exchange):
  - `legacy_user_id`: Original external user ID
  - `migration_source`: "legacy-system"
  - `migrated_at`: Timestamp of migration

> 💡 **Note**: Custom claims can be added in a Post Login Action using the metadata set during token exchange. The CTE Action only provisions the user and stores metadata.

## ❌ Troubleshooting

**"Token exchange is not enabled"**
→ Run Step 3 again, verify Management API token is valid

**"Custom Token Exchange Profile not found"**
→ Run Step 5 again, check Action ID is correct

**Backend won't start**
→ Check `AUTH0_CLIENT_SECRET` is in .env file

**"User provisioning failed"**
→ Verify connection "Users" exists and is enabled for your application in Auth0 Dashboard

## 📚 Full Documentation

See [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md) for complete step-by-step instructions with explanations.

## 🔐 Token Exchange Flow

```
1. User generates external/legacy token in frontend
2. Frontend sends token to backend (POST /api/exchange-token)
3. Backend calls Auth0 /oauth/token with:
   - grant_type: urn:ietf:params:oauth:grant-type:token-exchange
   - subject_token: The external token
   - subject_token_type: urn:mycompany:legacy-system
4. Auth0 Custom Token Exchange Action:
   - Validates external token
   - Provisions/finds user in Auth0
   - Sets app_metadata (legacy_user_id, migration_source, migrated_at)
5. Auth0 returns: access_token, id_token, refresh_token
6. Frontend displays tokens side-by-side
```

## 🐛 Additional Troubleshooting

### Backend returns 500 error
- Check backend console for detailed error
- Verify `AUTH0_CLIENT_SECRET` is correct in .env
- Ensure token exchange is enabled (Step 3)

### Action logs show "user_provisioning_failed"
- Check database connection name in Action code matches your Auth0 database
- Verify connection is enabled for your application
- Default is "Users" but yours might be named differently

### Tokens don't show metadata
- Metadata is stored on the user profile, not in tokens
- To see metadata in tokens, create a Post Login Action that reads app_metadata
- Custom claims require Post Login Action, not CTE Action

## 🎓 Learning Points

This demo teaches:
- How **RFC 8693 Token Exchange** works
- How to exchange external/legacy tokens for Auth0 tokens
- How **Custom Token Exchange Actions** validate and provision users
- How to securely handle client secrets in backend servers
- Difference between Custom Token Exchange and Post Login Actions
- Just-in-time user provisioning patterns

## 🚀 Next Steps

1. **Add Post Login Action** - Add custom claims to tokens using the metadata
2. **Real Token Validation** - Connect to actual legacy system for token validation
3. **Implement Backend API** - Validate Auth0 tokens server-side
4. **Refresh Tokens** - Implement token refresh flow
5. **Production Deployment** - Secure your client secrets and APIs

## 📖 Additional Resources

- [Auth0 Custom Token Exchange Docs](https://auth0.com/docs/authenticate/custom-token-exchange)
- [RFC 8693 - OAuth Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Auth0 Actions Documentation](https://auth0.com/docs/customize/actions)
- [JWT.io](https://jwt.io) - Debug JWT tokens
- [Auth0 Management API](https://auth0.com/docs/api/management/v2)
