const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json());
app.get('/app-worker.js', (_req, res) => res.set({'Cache-Control':'no-store','Service-Worker-Allowed':'/'}).sendFile(path.join(__dirname, '../public/app-worker.js')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/trust-public-config', async (_req, res) => {
  try {
    const upstream = await fetch('https://guvazafamilytrust.com/api/config/public', { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) return res.status(503).json({ ok:false });
    const result = await upstream.json();
    if (!result.ok || !result.config) return res.status(503).json({ ok:false });
    return res.set('Cache-Control','public, max-age=60').json({ ok:true, config:result.config });
  } catch { return res.status(503).json({ ok:false, error:'Public Trust settings are temporarily unavailable.' }); }
});

app.get('/api/health', (req, res) => {
  res.json({
    service: 'GFT.TV',
    status: 'running'
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/gft-tv.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GFT.TV server running on port ${PORT}`);
});
