# Cloudflare Deployment Guide

This guide will help you deploy the Auth0 Custom Token Exchange demo to Cloudflare.

## Prerequisites

- GitHub account (already done ✅)
- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`

---

## Part 1: Deploy Backend (Cloudflare Worker)

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser for authentication.

### 3. Set Environment Secrets

Run these commands to securely set your Auth0 credentials:

```bash
wrangler secret put AUTH0_CLIENT_SECRET
# Paste your Auth0 client secret when prompted

wrangler secret put VITE_AUTH0_DOMAIN
# Enter: your-tenant.auth0.com

wrangler secret put VITE_AUTH0_CLIENT_ID
# Enter: YOUR_CLIENT_ID

wrangler secret put VITE_AUTH0_AUDIENCE
# Enter: https://my-api.example.com
```

### 4. Deploy the Worker

```bash
wrangler deploy
```

**Copy the Worker URL** - it will look like: `https://auth0-cte-backend.YOUR-SUBDOMAIN.workers.dev`

---

## Part 2: Deploy Frontend (Cloudflare Pages)

### Option A: Via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Navigate to**: Workers & Pages → Create Application → Pages → Connect to Git
3. **Select Repository**: `dariusmuscalu-lyvoc/auth0-cte-demo`
4. **Configure Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave empty)

5. **Set Environment Variables** (click "Add variable"):
   ```
   VITE_AUTH0_DOMAIN = your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID = YOUR_CLIENT_ID
   VITE_AUTH0_AUDIENCE = https://my-api.example.com
   VITE_BACKEND_URL = https://auth0-cte-backend.YOUR-SUBDOMAIN.workers.dev
   ```
   ⚠️ Replace `VITE_BACKEND_URL` with your Worker URL from Part 1, Step 4

6. **Click "Save and Deploy"**

7. **Copy your Pages URL** - it will look like: `https://auth0-cte-demo.pages.dev`

### Option B: Via Wrangler CLI

```bash
# From project root
wrangler pages project create auth0-cte-demo

# Deploy
wrangler pages deploy dist --project-name=auth0-cte-demo
```

Then set environment variables in the dashboard.

---

## Part 3: Update Auth0 Configuration

1. **Go to Auth0 Dashboard**: https://manage.auth0.com/
2. **Applications → Your Application → Settings**
3. **Add your Cloudflare URLs**:

   **Allowed Callback URLs** (comma-separated):
   ```
   http://localhost:5173, https://auth0-cte-demo.pages.dev
   ```

   **Allowed Logout URLs**:
   ```
   http://localhost:5173, https://auth0-cte-demo.pages.dev
   ```

   **Allowed Web Origins**:
   ```
   http://localhost:5173, https://auth0-cte-demo.pages.dev
   ```

4. **Click "Save Changes"**

---

## Part 4: Update Frontend to Use Worker Backend

You need to update `src/TokenExchange.tsx` to use the Worker URL instead of localhost.

Add this at the top of the file after imports:

```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

Then replace hardcoded `http://localhost:3001` with `BACKEND_URL` in fetch calls.

---

## Testing Your Deployment

1. **Visit your Pages URL**: `https://auth0-cte-demo.pages.dev`
2. **Test the flow**:
   - Enter email/name
   - Generate external token
   - Exchange for Auth0 tokens
   - Verify tokens display correctly

---

## Troubleshooting

### Worker Returns 500 Error
- Check secrets are set: `wrangler secret list`
- Check Worker logs: `wrangler tail`

### CORS Errors
- Verify CORS headers in `workers/index.js`
- Check browser console for specific error

### Auth0 Callback Error
- Verify URLs are added to Auth0 dashboard
- No trailing slashes in URLs

### Build Fails on Cloudflare Pages
- Check environment variables are set
- Verify build command is `npm run build`
- Check build logs in Cloudflare dashboard

---

## Updating Your Deployment

### Update Backend (Worker):
```bash
wrangler deploy
```

### Update Frontend (Pages):
- Just push to GitHub main branch - auto-deploys!
- Or manual: `wrangler pages deploy dist --project-name=auth0-cte-demo`

---

## Cost

Both services are **FREE** on Cloudflare:
- **Workers**: 100,000 requests/day free
- **Pages**: Unlimited static requests, 500 builds/month

Perfect for demos and testing!

---

## Next Steps

1. Custom domain (optional): Add via Cloudflare Pages settings
2. Analytics: Enable in Cloudflare dashboard
3. Security: Consider adding rate limiting to Worker
