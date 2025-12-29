const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Token exchange endpoint
app.post('/api/exchange-token', async (req, res) => {
  const { external_token } = req.body;
  
  if (!external_token) {
    return res.status(400).json({ error: 'Missing external_token' });
  }

  const domain = process.env.VITE_AUTH0_DOMAIN;
  const clientId = process.env.VITE_AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const audience = process.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  try {
    console.log('Exchanging token...');
    console.log('Domain:', domain);
    console.log('Client ID:', clientId);
    console.log('Audience:', audience);
    
    const response = await axios.post(`https://${domain}/oauth/token`, {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: clientId,
      client_secret: clientSecret,
      subject_token: external_token,
      subject_token_type: 'urn:mycompany:legacy-system',
      audience: audience,
      scope: 'openid profile email read:data write:data'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Token exchange successful!');
    
    res.json({
      access_token: response.data.access_token,
      id_token: response.data.id_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in
    });
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || 'token_exchange_failed',
      error_description: error.response?.data?.error_description || 'Failed to exchange token'
    });
  }
});

// Generate demo external token
app.post('/api/generate-demo-token', (req, res) => {
  const { email, name, userId } = req.body;
  
  const tokenData = {
    userId: userId || `legacy-${Date.now()}`,
    email: email || 'demo@example.com',
    name: name || 'Demo User',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
    iat: Math.floor(Date.now() / 1000)
  };
  
  // Create a simple base64 encoded token
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  
  res.json({
    external_token: token,
    decoded: tokenData
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  POST http://localhost:${PORT}/api/exchange-token`);
  console.log(`  POST http://localhost:${PORT}/api/generate-demo-token`);
});
