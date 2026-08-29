const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { db } = require('../db');

router.get('/', async (req, res) => {
  try {
    const assets = db.getAllAssets();
    const decoys = db.getAllDecoys();
    const result = await aiService.analyze(assets, decoys);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
