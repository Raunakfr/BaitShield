const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  try {
    const assets = db.getAllAssets();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
