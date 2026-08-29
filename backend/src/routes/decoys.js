const express = require('express');
const router = express.Router();
const decoyEngine = require('../services/decoyEngine');

router.get('/', (req, res) => {
  try {
    const decoys = decoyEngine.getAll();
    res.json(decoys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/coverage', (req, res) => {
  try {
    const coverage = decoyEngine.getCoverage();
    res.json(coverage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const removed = decoyEngine.remove(id);
    if (!removed) return res.status(404).json({ error: 'Decoy not found' });
    res.json({ status: 'decoy_removed', decoy: removed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
