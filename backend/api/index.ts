import express from 'express';

const app = express();

app.all('/api/*', (req, res) => {
  res.json({ path: req.url, method: req.method, ok: true });
});

export default app;
