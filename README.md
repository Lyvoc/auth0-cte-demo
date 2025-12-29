# Auth0 Custom Token Exchange Demo

A complete demonstration of **Auth0's Custom Token Exchange** feature (RFC 8693) that shows how to exchange external/legacy tokens for Auth0 tokens.

## 🎯 What This Demo Does

This application demonstrates the complete Custom Token Exchange flow:

1. **Generate external/legacy token** - Simulates a token from a legacy system or external IdP
2. **Exchange via backend** - Backend calls Auth0's `/oauth/token` endpoint with token exchange grant
3. **Auth0 validates and provisions** - Custom Token Exchange Action validates the external token and creates/finds the user
4. **Display Auth0 tokens** - Shows the resulting access_token and id_token with user metadata

## 🚀 Features

- ✅ **Full Custom Token Exchange Implementation** - Uses Auth0's official CTE feature
- ✅ **Backend Server** - Express server handling token exchange securely
- ✅ **Visual Token Display** - Side-by-side comparison of external vs Auth0 tokens
- ✅ **JWT Decoder** - See token headers, payloads, and custom claims
- ✅ **Demo Token Generator** - No external system needed for testing
- ✅ **Custom Auth0 Action** - Validates external tokens and provisions users

## 📋 Prerequisites

- Node.js 14+
- Auth0 account (Enterprise or B2B Pro for Custom Token Exchange Early Access)
- Management API access

## 🛠️ Quick Setup

### 1. Configure Auth0

Follow the complete setup in [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md):

1. Get Management API token
2. Configure your Auth0 application
3. Create API audience
4. Enable Custom Token Exchange via Management API
5. Create Custom Token Exchange Action
6. Create Token Exchange Profile

### 2. Update Environment Variables

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://my-api.example.com
AUTH0_CLIENT_SECRET=your-client-secret-here
```

### 3. Install & Run

```bash
npm install
npm run dev:all
```

Open http://localhost:5173

## 📁 Project Structure

```
auth0-react-app/
├── server.js                   # Backend Express server
├── src/
│   ├── App.tsx                # Main app component
│   ├── TokenExchange.tsx      # Token exchange demo component
│   ├── main.tsx               # Auth0Provider setup
│   └── ...
├── .env                        # Environment configuration
├── AUTH0_SETUP_GUIDE.md       # Complete Auth0 setup
└── README.md                  # This file
```

## 🎬 How to Use

1. **Enter User Details** - Email and name for demo user
2. **Generate External Token** - Creates a base64-encoded demo token
3. **Exchange Token** - Backend exchanges it for Auth0 tokens
4. **View Results** - See external token, access token, and ID token side-by-side

## 🔄 Token Exchange Flow

```
External/Legacy Token
         ↓
    Frontend App
         ↓
  Backend Server (/api/exchange-token)
         ↓
Auth0 /oauth/token (grant_type=token-exchange)
         ↓
Custom Token Exchange Action
    - Validates external token
    - Provisions/finds user
    - Sets user app_metadata
         ↓
Auth0 Issues Tokens
    - access_token (JWT)
    - id_token (JWT)
    - refresh_token
```

## 🛠️ Built With

- **React 18** + **TypeScript**
- **Auth0 React SDK** - Authentication
- **Express** - Backend server
- **Axios** - HTTP client
- **Vite** - Build tool

## 📚 API Endpoints

### Backend (http://localhost:3001)

- `POST /api/generate-demo-token` - Generate demo external token
- `POST /api/exchange-token` - Exchange external token for Auth0 tokens

## 🐛 Troubleshooting

**"Token exchange is not enabled"**
- Run the Management API PATCH request from AUTH0_SETUP_GUIDE.md Step 4
- Verify Enterprise/B2B Pro subscription

**"Custom Token Exchange Profile not found"**
- Verify the profile was created (Step 6 in guide)
- Check subject_token_type matches: `urn:mycompany:legacy-system`

**Backend errors**
- Verify client secret in .env file
- Ensure backend is running on port 3001
- Check Auth0 database connection is enabled for your application (e.g., "Users")

## 🎓 Use Cases

- **Legacy System Migration** - Migrate users without password resets
- **Partner SSO** - Accept tokens from external identity providers
- **Custom Authentication** - Implement proprietary auth flows
- **JIT User Provisioning** - Create users on-demand during authentication

## 📖 Learn More

- [Auth0 Custom Token Exchange Docs](https://auth0.com/docs/authenticate/custom-token-exchange)
- [RFC 8693 - OAuth Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html)
- [Auth0 Actions](https://auth0.com/docs/customize/actions)
- [Management API](https://auth0.com/docs/api/management/v2)

## 📄 License

This project is licensed under the MIT License.