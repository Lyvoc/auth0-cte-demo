/**
 * Cloudflare Worker for Auth0 Custom Token Exchange
 * Replaces the Express server.js for deployment
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate demo external token
    if (url.pathname === '/api/generate-demo-token' && request.method === 'POST') {
      try {
        const { email, name } = await request.json();

        const externalToken = {
          userId: `external_${Date.now()}`,
          email: email,
          name: name,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        };

        const base64Token = btoa(JSON.stringify(externalToken));

        return new Response(JSON.stringify({ token: base64Token }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to generate token' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Exchange token endpoint
    if (url.pathname === '/api/exchange-token' && request.method === 'POST') {
      try {
        const { subjectToken } = await request.json();

        if (!subjectToken) {
          return new Response(JSON.stringify({ error: 'Subject token is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get Auth0 credentials from environment
        const domain = env.VITE_AUTH0_DOMAIN;
        const clientId = env.VITE_AUTH0_CLIENT_ID;
        const clientSecret = env.AUTH0_CLIENT_SECRET;
        const audience = env.VITE_AUTH0_AUDIENCE;

        if (!domain || !clientId || !clientSecret || !audience) {
          return new Response(JSON.stringify({ error: 'Server configuration error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Call Auth0 token exchange endpoint
        const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            subject_token: subjectToken,
            subject_token_type: 'urn:mycompany:legacy-system',
            client_id: clientId,
            client_secret: clientSecret,
            audience: audience,
            scope: 'openid profile email',
          }),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
          console.error('Auth0 token exchange error:', data);
          return new Response(JSON.stringify({ 
            error: data.error || 'Token exchange failed',
            error_description: data.error_description || 'Unknown error'
          }), {
            status: tokenResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Token exchange error:', error);
        return new Response(JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 404 for other routes
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders 
    });
  },
};
