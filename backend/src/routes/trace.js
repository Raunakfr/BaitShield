const express = require('express');
const router = express.Router();
const eventLog = require('../services/eventLog');
const { db } = require('../db');

router.get('/', (req, res) => {
  try {
    const events = eventLog.getAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/graph', (req, res) => {
  try {
    const graphData = eventLog.getForGraph();
    res.json(graphData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/incidents', (req, res) => {
  try {
    const incidents = db.getAllIncidents();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/legitimate', (req, res) => {
  try {
    const logs = db.getLegitimateLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
