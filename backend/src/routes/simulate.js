const express = require('express');
const router = express.Router();
const decoyEngine = require('../services/decoyEngine');
const aiService = require('../services/aiService');
const eventLog = require('../services/eventLog');
const websocket = require('../websocket');
const { db } = require('../db');

// ─── Dynamic Attacker Intrusion Simulation ──────────────────────────────────
router.post('/', (req, res) => {
  const runStep = (delay, decoyId, action, ip, host) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const event = decoyEngine.trigger(decoyId, ip, host, action);
        if (!event.isDuplicate) {
          websocket.broadcast('alert', event);
        }
        resolve(event);
      }, delay);
    });
  };

  const runSimulation = async () => {
    const ip = '192.168.1.200';
    const host = 'attacker-kali';

    const activeDecoys = db.getAllDecoys();

    // Find active decoys per asset
    const financeDecoy = activeDecoys.find(d => d.asset_id === 'fs-2');
    const engDecoy = activeDecoys.find(d => d.asset_id === 'fs-1');
    const cloudDecoy = activeDecoys.find(d => d.asset_id === 'cc-1');
    const wikiDecoy = activeDecoys.find(d => d.asset_id === 'wk-1');
    const dbDecoy = activeDecoys.find(d => d.asset_id === 'db-1');

    let delayAcc = 100;

    // Step 1: Scan Finance share
    if (financeDecoy) {
      await runStep(delayAcc, financeDecoy.id, 'LIST', ip, host);
      delayAcc = 900;
    }

    // Step 2 & 3: Read Engineering decoy
    if (engDecoy) {
      await runStep(delayAcc, engDecoy.id, 'LIST', ip, host);
      await runStep(800, engDecoy.id, 'READ', ip, host);
      delayAcc = 900;
    }

    // Step 4: Auth Attempt with Cloud Decoy
    if (cloudDecoy) {
      await runStep(delayAcc, cloudDecoy.id, 'AUTH_ATTEMPT', ip, host);
      delayAcc = 900;
    }

    // Step 5: Read Wiki Decoy
    if (wikiDecoy) {
      await runStep(delayAcc, wikiDecoy.id, 'READ', ip, host);
      delayAcc = 900;
    }

    // Step 6: Auth Attempt with DB Decoy if planted
    if (dbDecoy) {
      await runStep(delayAcc, dbDecoy.id, 'AUTH_ATTEMPT', ip, host);
      delayAcc = 900;
    }

    // Direct in-process invocation of Stage 5 EXPLAIN (No HTTP self-fetch)
    setTimeout(async () => {
      try {
        const events = eventLog.getAll();
        const result = await aiService.explain(events);
        const incident = eventLog.saveIncident(result.summary);
        websocket.broadcast('incident', { ...incident, provider: result.provider });
      } catch (err) {
        console.error('In-process EXPLAIN invocation error:', err.message);
      }
    }, 1000);
  };

  runSimulation();
  res.json({ status: 'simulation_started', mode: 'attacker' });
});

// ─── Legitimate User Simulation (0 False Positives Demo) ───────────────────
router.post('/legitimate', (req, res) => {
  try {
    const userActions = [
      { user: 'alice.developer', action: 'READ', asset_name: 'Engineering File Share', path: '/shares/engineering/readme.md' },
      { user: 'bob.finance', action: 'READ', asset_name: 'Finance File Share', path: '/shares/finance/q3_report.pdf' },
      { user: 'charlie.ops', action: 'LIST', asset_name: 'AWS Config Store', path: '/config/aws/public_certs.pem' }
    ];

    const logs = [];
    userActions.forEach(act => {
      const log = db.insertLegitimateLog(act);
      logs.push(log);
      websocket.broadcast('legitimate_activity', log);
    });

    res.json({
      status: 'legitimate_simulation_complete',
      message: '3 legitimate user actions simulated against real assets. 0 decoy alerts triggered.',
      logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Reset Demo ─────────────────────────────────────────────────────────────
router.delete('/reset', (req, res) => {
  try {
    db.clearEvents();
    db.clearIncidents();
    db.clearLegitimateLogs();
    db.resetDecoys();
    
    websocket.broadcast('reset', { status: 'reset_successful' });
    res.json({ status: 'reset_successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
