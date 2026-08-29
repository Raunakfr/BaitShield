const express = require('express');
const cors = require('cors');
const http = require('http');
const { db, initialize, seed } = require('./db');
const websocket = require('./websocket');
const { requireAuth } = require('./middleware/authMiddleware');

// Routes
const analyzeRouter = require('./routes/analyze');
const plantRouter = require('./routes/plant');
const detectRouter = require('./routes/detect');
const traceRouter = require('./routes/trace');
const explainRouter = require('./routes/explain');
const decoysRouter = require('./routes/decoys');
const simulateRouter = require('./routes/simulate');
const assetsRouter = require('./routes/assets');
const authRouter = require('./routes/auth');
const decoyServeRouter = require('./routes/decoyServe');

const app = express();
const server = http.createServer(app);

// Environment
const PORT = process.env.PORT || 3001;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Initialize DB
initialize();
seed();

// Initialize WebSocket
websocket.init(server);

// Public Decoy & Auth Routes
app.use('/', decoyServeRouter);
app.use('/api/auth', authRouter);

// Guard all protected /api/* endpoints with requireAuth session middleware
app.use('/api', requireAuth);

// Protected API Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/plant', plantRouter);
app.use('/api/detect', detectRouter);
app.use('/api/trace', traceRouter);
app.use('/api/explain', explainRouter);
app.use('/api/decoys', decoysRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/assets', assetsRouter);

// Direct incidents endpoint
app.get('/api/incidents', (req, res) => {
  try {
    const incidents = db.getAllIncidents();
    res.json(incidents);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Bind to 0.0.0.0 so any device on the local Wi-Fi / LAN network can reach the backend
server.listen(PORT, '0.0.0.0', () => {
  console.log(`BaitShield backend running on port ${PORT} (Listening on 0.0.0.0 for external network attacks)`);
});
