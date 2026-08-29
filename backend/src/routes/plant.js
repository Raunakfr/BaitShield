const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { db } = require('../db');

router.post('/', async (req, res) => {
  try {
    const { asset_id, context } = req.body;
    const targetAsset = db.getAssetById(asset_id) || db.getAllAssets()[0];
    
    const assetContext = {
      asset_id: targetAsset.id,
      name: targetAsset.name,
      type: targetAsset.type,
      path: targetAsset.path,
      user_context: context || 'High value target'
    };

    const { decoy: generated, provider } = await aiService.generateDecoy(assetContext);
    
    const plantedDecoy = db.insertDecoy({
      asset_id: targetAsset.id,
      name: generated.name,
      path: generated.path || `${targetAsset.path}${generated.name}`,
      type: generated.type || 'file',
      content_preview: generated.content_preview || ''
    });

    res.json({ decoy: plantedDecoy, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
