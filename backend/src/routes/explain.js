const express = require('express');
const router = express.Router();
const eventLog = require('../services/eventLog');
const aiService = require('../services/aiService');
const websocket = require('../websocket');

router.post('/', async (req, res) => {
  try {
    const events = eventLog.getAll();
    const result = await aiService.explain(events);
    
    const incident = eventLog.saveIncident(result.summary);
    websocket.broadcast('incident', { ...incident, provider: result.provider });
    
    res.json({ ...incident, provider: result.provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
