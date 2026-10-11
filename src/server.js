const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
