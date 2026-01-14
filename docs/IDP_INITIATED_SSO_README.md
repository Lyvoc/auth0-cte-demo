# IdP-Initiated SSO Support in This React App

## Overview
This project uses the `@auth0/auth0-react` SDK for authentication, which natively supports Service Provider (SP)-initiated login flows. However, for some enterprise SAML or OIDC scenarios, you may need to support Identity Provider (IdP)-initiated Single Sign-On (SSO), where the authentication flow is started from the IdP dashboard or portal, not from your app.

## Why IdP-Initiated SSO is Different
- **SP-Initiated SSO:** The user clicks "Login" in your app, which redirects to Auth0, then returns to your app with an authorization code in the URL query string. The SDK exchanges this code for tokens and manages authentication state automatically.
- **IdP-Initiated SSO:** The user starts from the IdP (e.g., an Auth0 dashboard, Okta, or another IdP). After authentication, the IdP redirects the user to your app with tokens (id_token, access_token) in the URL hash fragment (e.g., `/#id_token=...&access_token=...`). The SDK does not process these tokens by default, so your app must handle them manually.

## How This App Handles IdP-Initiated SSO
1. **Token Parsing:**
   - On the `/token` route, the app checks if the URL hash contains `id_token` or `access_token`.
   - If found, it parses these tokens from the hash.
2. **Token Storage:**
   - The tokens are stored in `localStorage` for later use.
   - The hash is removed from the URL for cleanliness.
3. **Token Usage:**
   - If the Auth0 SDK is not authenticated, the app uses the manually parsed tokens to display decoded token information.
   - If the SDK is authenticated (SP-initiated flow), it uses the SDK's tokens as usual.
4. **User Experience:**
   - Both SP-initiated and IdP-initiated flows are supported on the same `/token` page.
   - The UI will show token details regardless of how the user arrived.

## Why This Approach Is Needed
- The `@auth0/auth0-react` SDK does not support IdP-initiated login out of the box because it expects an authorization code in the query string, not tokens in the hash.
- The older `auth0.js` library supports IdP-initiated login via `parseHash` and the `__enableIdPInitiatedLogin` flag, but this is not available in the React SDK.
- Manually parsing the hash and storing tokens is the only way to support IdP-initiated flows in a React SPA using the React SDK.

## Security Considerations
- Tokens in the URL hash are not sent to the server, but they are visible in browser history and accessible to client-side scripts.
- Always use HTTPS in production to protect tokens in transit.
- Consider clearing tokens from `localStorage` on logout or session expiration.

## Limitations
- The app does not update the Auth0 SDK's internal state with manually parsed tokens. Features like `useAuth0().user` will not be populated for IdP-initiated flows unless you decode the ID token payload yourself.
- Silent authentication, token renewal, and logout may not work as expected for IdP-initiated sessions.

## Summary
- **SP-initiated SSO:** Fully supported by the SDK.
- **IdP-initiated SSO:** Supported by custom code in `/token` to parse and display tokens from the URL hash.
- This approach allows your React SPA to work with both SSO flows without switching SDKs or adding legacy libraries.

---

For more details, see the implementation in `src/TokenPage.tsx`.
