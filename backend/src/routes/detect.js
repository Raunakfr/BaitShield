const express = require('express');
const router = express.Router();
const decoyEngine = require('../services/decoyEngine');
const websocket = require('../websocket');

router.post('/trigger', (req, res) => {
  try {
    const { decoy_id, source_ip, source_host, action } = req.body;
    
    const event = decoyEngine.trigger(decoy_id, source_ip, source_host, action);
    websocket.broadcast('alert', event);
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
