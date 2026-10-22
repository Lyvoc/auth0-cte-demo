require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const escape = require('escape-html');

const app = express();

/* highlight-start auth-config */
app.use(
  auth({
    authRequired: false, // set to true to require authentication for all routes
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  })
);
/* highlight-end auth-config */

app.get('/signup', (req, res) =>
  res.oidc.login({
    returnTo: '/',
    authorizationParams: { screen_hint: 'signup' },
  })
);

const page = (body) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Webapp - Regular Web Application</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      background: #f5f6f8; color: #111827;
    }
    .card {
      width: min(92vw, 400px); padding: 40px 32px; text-align: center;
      background: #fff; border-radius: 16px; border: 1px solid #e5e7eb;
      box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
    }
    .card.wide { width: min(92vw, 560px); text-align: left; }
    .badge {
      display: inline-block; margin: 0 0 16px; padding: 4px 10px;
      border-radius: 999px; background: #eff6ff; color: #1d4ed8;
      font-size: 12px; font-weight: 600; letter-spacing: .02em;
    }
    h1 { margin: 0 0 8px; font-size: 24px; font-weight: 650; }
    p { margin: 0 0 28px; color: #6b7280; font-size: 15px; }
    .actions { display: flex; flex-direction: column; gap: 12px; }
    .btn {
      display: block; padding: 12px 20px; border-radius: 10px;
      font-size: 15px; font-weight: 600; text-decoration: none;
      transition: background .15s, border-color .15s, transform .05s;
    }
    .btn:active { transform: translateY(1px); }
    .btn-primary { background: #2563eb; color: #fff; border: 1px solid #2563eb; }
    .btn-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }
    .btn-secondary { background: #fff; color: #111827; border: 1px solid #d1d5db; }
    .btn-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
    pre {
      margin: 0 0 24px; padding: 16px; overflow: auto; font-size: 13px;
      background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;
    }
  </style>
</head>
<body>${body}</body>
</html>`;

// SSO check: on the first visit of the browser session, ask Auth0 for a silent
// login (prompt=none). If the Auth0 session already exists (e.g. user signed in
// through the other app), the user lands here authenticated. Otherwise Auth0
// answers login_required and we fall back to the buttons below. The cookie
// short-lived cookie prevents a redirect loop while still letting a later visit
// pick up a session created in the meantime by the other app.
const SSO_CHECK_COOKIE = 'sso_checked';
const SSO_CHECK_TTL_MS = 30 * 1000;
const hasCookie = (req, name) =>
  (req.headers.cookie || '').split(/;\s*/).some((c) => c.startsWith(`${name}=`));

app.get('/', (req, res) => {
  /* highlight-start is-authenticated */
  if (!req.oidc.isAuthenticated()) {
    if (!hasCookie(req, SSO_CHECK_COOKIE)) {
      res.cookie(SSO_CHECK_COOKIE, '1', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: SSO_CHECK_TTL_MS,
      });
      return res.oidc.login({
        returnTo: '/',
        authorizationParams: { prompt: 'none' },
      });
    }
    return res.type('html').send(page(`
      <main class="card">
        <span class="badge">Webapp - Regular Web Application</span>
        <h1>Bienvenue</h1>
        <p>Connectez-vous ou créez un compte pour continuer.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/login">Se connecter</a>
          <a class="btn btn-secondary" href="/signup">Créer un compte</a>
        </div>
      </main>
    `));
  }

  res.type('html').send(page(`
    <main class="card wide">
      <span class="badge">Webapp - Regular Web Application</span>
      <h1>Bonjour, ${escape(req.oidc.user.name)}</h1>
      <p>Votre profil</p>
      <pre>${escape(JSON.stringify(req.oidc.user, null, 2))}</pre>
      <a class="btn btn-secondary" href="/logout">Se déconnecter</a>
    </main>
  `));
  /* highlight-end is-authenticated */
});

// The silent SSO check ends with an OAuth error when there is no Auth0 session.
// That is expected: show the logged-out home page instead of an error.
const SILENT_LOGIN_ERRORS = ['login_required', 'consent_required', 'interaction_required'];
app.use((err, req, res, next) => {
  if (SILENT_LOGIN_ERRORS.includes(err.error)) {
    return res.redirect('/');
  }
  return next(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
