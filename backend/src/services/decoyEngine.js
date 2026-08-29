const { db } = require('../db');

// In-memory debounce map to filter out duplicate mobile browser requests within 3.5s window
const lastTriggerMap = new Map();

function getAll() {
  return db.getAllDecoys();
}

function getById(id) {
  return db.getDecoyById(id);
}

function trigger(decoyId, sourceIp, sourceHost, action) {
  const key = `${decoyId}_${sourceIp}_${action}`;
  const now = Date.now();
  const lastTime = lastTriggerMap.get(key);

  // If duplicate request arrives within 3.5s from the same IP/decoy/action, flag as duplicate
  if (lastTime && (now - lastTime) < 3500) {
    return { isDuplicate: true };
  }

  lastTriggerMap.set(key, now);

  let severity = 'LOW';
  if (action === 'AUTH_ATTEMPT' || action === 'READ') severity = 'HIGH';
  else if (action === 'LIST') severity = 'MEDIUM';

  const event = db.insertEvent({
    decoy_id: decoyId,
    source_ip: sourceIp || '192.168.1.200',
    source_host: sourceHost || 'attacker-kali',
    action: action || 'READ',
    severity
  });

  return event;
}

function remove(id) {
  return db.deleteDecoy(id);
}

function getCoverage() {
  return db.getCoverage();
}

module.exports = {
  getAll,
  getById,
  trigger,
  remove,
  getCoverage
};
