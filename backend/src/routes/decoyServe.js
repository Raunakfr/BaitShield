const express = require('express');
const router = express.Router();
const decoyEngine = require('../services/decoyEngine');
const aiService = require('../services/aiService');
const eventLog = require('../services/eventLog');
const websocket = require('../websocket');
const { db } = require('../db');

// Silence mobile browser automatic favicon / touch icon sub-requests
router.get('/favicon.ico', (req, res) => res.status(204).end());
router.get('/apple-touch-icon*.png', (req, res) => res.status(204).end());

// Helper to extract clean caller IPv4 address dynamically without hardcoded fallbacks
function getCallerIp(req) {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'External Device';
  if (typeof ip === 'string') {
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '127.0.0.1 (Local Host)';
    }
  }
  return ip;
}

// ─── Direct Decoy Access Endpoint for External Attacks ───────────────────────
router.get('/decoy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const decoy = db.getDecoyById(id);

    if (!decoy) {
      return res.status(404).send('404 Not Found — Resource does not exist');
    }

    const callerIp = getCallerIp(req);
    const action = req.query.action ? req.query.action.toUpperCase() : 'READ';

    // STAGE 3: DETECT — 100% Deterministic Event Trigger
    const event = decoyEngine.trigger(decoy.id, callerIp, 'external-intruder', action);

    // Only broadcast WebSocket alert and trigger Llama 3.2 AI if NOT a duplicate request
    if (!event.isDuplicate) {
      websocket.broadcast('alert', event);

      // STAGE 5: EXPLAIN — Auto-trigger Llama 3.2 AI Analysis for the external attack
      setTimeout(async () => {
        try {
          const events = eventLog.getAll();
          const result = await aiService.explain(events);
          const incident = eventLog.saveIncident(result.summary);
          websocket.broadcast('incident', { ...incident, provider: result.provider });
        } catch (err) {
          console.error('External attack AI explain error:', err.message);
        }
      }, 800);
    }

    // Return realistic decoy bait content to the external attacker
    res.setHeader('Content-Type', 'text/plain');
    res.send(`[CONFIDENTIAL DIGITAL DECOY ASSET: ${decoy.name}]\nPath: ${decoy.path}\n\n${decoy.content_preview}`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// ─── Real Non-Decoy File Access Endpoint (0 False Positives Demo) ────────────
router.get('/real/readme.md', (req, res) => {
  const callerIp = getCallerIp(req);
  const log = db.insertLegitimateLog({
    user: `legitimate_employee (${callerIp})`,
    action: 'READ',
    asset_name: 'Engineering File Share',
    path: '/shares/engineering/readme.md'
  });

  websocket.broadcast('legitimate_activity', log);

  res.setHeader('Content-Type', 'text/plain');
  res.send('# Engineering Onboarding & Readme\nWelcome to Engineering team. Please consult official docs on Internal Wiki.');
});

module.exports = router;
