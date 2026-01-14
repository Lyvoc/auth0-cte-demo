# SAML IdP-Initiated Login Flow (with Auth0)

## What is IdP-Initiated SAML SSO?
- **IdP-initiated SSO** means the authentication flow starts from the Identity Provider (IdP) (e.g., an Auth0 tenant, Okta, or another SAML IdP), not from your application (the Service Provider, SP).
- The IdP authenticates the user and then sends a SAML assertion directly to your app's SAML endpoint, which then logs the user in.

## How to Trigger IdP-Initiated SSO in This Demo
1. **Open the IdP Portal URL:**
   - Use this URL in your browser:
     
     https://darius-test-lyvoc.eu.auth0.com/samlp/oSvYuQlm5XjUS9morF4Z0lNWBBETMRKV
   - This is the SAML IdP-initiated SSO endpoint for your Auth0 IdP tenant and SAML connection.
2. **Authenticate at the IdP:**
   - If not already logged in, the IdP will prompt for credentials and (optionally) MFA.
3. **Redirection:**
   - After successful authentication, the IdP will POST a SAML assertion to your app's SAML ACS (Assertion Consumer Service) endpoint (configured in the IdP connection settings).
   - Auth0 (as SP) will process the assertion and, if successful, redirect the browser to your SPA's callback URL (e.g., `/token`).
   - For OIDC/OAuth flows, tokens may be returned in the URL hash fragment (see below).

## How the Flow Works in This App
- The app supports both SP-initiated and IdP-initiated SSO.
- For IdP-initiated SSO, after authentication at the IdP, the browser is redirected to your SPA with tokens in the URL hash (e.g., `/#id_token=...&access_token=...`).
- The `/token` page in this app parses these tokens from the hash, stores them, and displays their decoded contents.
- This is necessary because the Auth0 React SDK does not natively process tokens from the hash for IdP-initiated flows.

## How to Test
1. Open the IdP portal URL above in a new browser tab or window.
2. Complete authentication at the IdP.
3. You will be redirected to your SPA's `/token` page, and your tokens will be displayed.

## Notes
- The IdP-initiated SSO flow is often used for enterprise SSO scenarios where users start from a company portal.
- For security, always use HTTPS in production and ensure your SAML connection settings (ACS URL, EntityID, etc.) are correct.
- For more technical details, see `IDP_INITIATED_SSO_README.md` and the implementation in `src/TokenPage.tsx`.
