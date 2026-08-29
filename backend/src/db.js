const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'baitshield-data.json');

// Default hashed password for admin / baitshield2024
const DEFAULT_ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'baitshield2024', 10);

// ─── Default Seed Data ───────────────────────────────────────────────────────
const SEED_ASSETS = [
  { id: 'fs-1', type: 'file_share',   name: 'Engineering File Share', path: '/shares/engineering/' },
  { id: 'fs-2', type: 'file_share',   name: 'Finance File Share',     path: '/shares/finance/'     },
  { id: 'cc-1', type: 'cloud_config', name: 'AWS Config Store',       path: '/config/aws/'         },
  { id: 'wk-1', type: 'wiki',         name: 'Internal Wiki',          path: '/wiki/infra/'         },
  { id: 'db-1', type: 'database',     name: 'Prod DB Config',         path: '/config/db/'          },
];

const SEED_DECOYS = [
  {
    id: 'dcoy-1', asset_id: 'fs-1',
    name: 'deployment-prod.env',
    path: '/shares/engineering/deployment-prod.env',
    type: 'credential',
    content_preview: 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7FAKE001\nAWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYFAKEKEY1\nDB_PASSWORD=Pr0dSecret2024',
    planted_at: new Date().toISOString(), triggered: false,
  },
  {
    id: 'dcoy-2', asset_id: 'fs-1',
    name: 'backup_config.yml',
    path: '/shares/engineering/backup_config.yml',
    type: 'file',
    content_preview: 'database:\n  host: prod-db.internal\n  user: backup_svc\n  password: B4ckupPass2024\n  port: 5432',
    planted_at: new Date().toISOString(), triggered: false,
  },
  {
    id: 'dcoy-3', asset_id: 'fs-2',
    name: 'Q3_payroll.xlsx',
    path: '/shares/finance/Q3_payroll.xlsx',
    type: 'file',
    content_preview: 'Employee payroll data Q3 2024 - CONFIDENTIAL',
    planted_at: new Date().toISOString(), triggered: false,
  },
  {
    id: 'dcoy-4', asset_id: 'cc-1',
    name: 'aws-credentials.conf',
    path: '/config/aws/aws-credentials.conf',
    type: 'api_key',
    content_preview: '[default]\naws_access_key_id = AKIAIOSFODNN7FAKE002\naws_secret_access_key = v7aX8bK9pL0qR1sT2uV3wX4yZ5DECOYKEY2',
    planted_at: new Date().toISOString(), triggered: false,
  },
  {
    id: 'dcoy-5', asset_id: 'wk-1',
    name: 'infrastructure-passwords.md',
    path: '/wiki/infra/infrastructure-passwords.md',
    type: 'credential',
    content_preview: '# Master Infrastructure Credentials\nVPN Access: vpn.company.com\nUser: sysadmin\nToken: 994820',
    planted_at: new Date().toISOString(), triggered: false,
  }
];

let store = {
  assets: [...SEED_ASSETS],
  decoys: [...SEED_DECOYS],
  events: [],
  incidents: [],
  legitimateLogs: [],
  sessions: []
};

function save() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write baitshield-data.json:', err.message);
  }
}

function initialize() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      store = {
        assets: loaded.assets || [...SEED_ASSETS],
        decoys: loaded.decoys || [...SEED_DECOYS],
        events: loaded.events || [],
        incidents: loaded.incidents || [],
        legitimateLogs: loaded.legitimateLogs || [],
        sessions: loaded.sessions || []
      };
    } catch (e) {
      console.warn('Could not parse baitshield-data.json, initializing fresh store');
    }
  } else {
    save();
  }
}

function seed() {
  if (!store.assets || store.assets.length === 0) store.assets = [...SEED_ASSETS];
  if (!store.decoys || store.decoys.length === 0) store.decoys = [...SEED_DECOYS];
  save();
}

const db = {
  // Session & Authentication Store
  verifyPassword: (password) => {
    if (!password) return false;
    return bcrypt.compareSync(password, DEFAULT_ADMIN_PASSWORD_HASH);
  },
  createSession: (userData) => {
    const token = uuidv4();
    const session = {
      token,
      username: userData.username || 'admin',
      role: userData.role || 'Security Operations Lead',
      created_at: new Date().toISOString()
    };
    if (!store.sessions) store.sessions = [];
    store.sessions.push(session);
    save();
    return session;
  },
  validateSession: (token) => {
    if (!token) return null;
    if (!store.sessions) return null;
    return store.sessions.find(s => s.token === token) || null;
  },
  revokeSession: (token) => {
    if (!token || !store.sessions) return;
    store.sessions = store.sessions.filter(s => s.token !== token);
    save();
  },

  // Assets
  getAllAssets: () => store.assets,

  // Decoys (PLANT & DETECT)
  getAllDecoys: () => store.decoys.map(d => {
    const asset = store.assets.find(a => a.id === d.asset_id) || {};
    return { ...d, asset_name: asset.name || 'Unknown Asset', asset_type: asset.type || 'unknown' };
  }),
  getDecoyById: (id) => {
    const d = store.decoys.find(item => item.id === id);
    if (!d) return null;
    const asset = store.assets.find(a => a.id === d.asset_id) || {};
    return { ...d, asset_name: asset.name || 'Unknown Asset', asset_type: asset.type || 'unknown' };
  },
  insertDecoy: (decoyData) => {
    const newDecoy = {
      id: decoyData.id || uuidv4(),
      asset_id: decoyData.asset_id,
      name: decoyData.name,
      path: decoyData.path || `/decoy/${decoyData.name}`,
      type: decoyData.type || 'file',
      content_preview: decoyData.content_preview || '',
      planted_at: new Date().toISOString(),
      triggered: false
    };
    store.decoys.push(newDecoy);
    save();
    return db.getDecoyById(newDecoy.id);
  },
  markDecoyTriggered: (id) => {
    const d = store.decoys.find(item => item.id === id);
    if (d) {
      d.triggered = true;
      save();
    }
  },
  deleteDecoy: (id) => {
    const idx = store.decoys.findIndex(d => d.id === id);
    if (idx !== -1) {
      const removed = store.decoys.splice(idx, 1)[0];
      save();
      return removed;
    }
    return null;
  },
  resetDecoys: () => {
    store.decoys.forEach(d => { d.triggered = false; });
    save();
  },
  getCoverage: () => {
    const total = store.assets.length;
    const coveredAssetIds = new Set(store.decoys.map(d => d.asset_id));
    const covered = coveredAssetIds.size;
    const percentage = total > 0 ? Math.round((covered / total) * 100) : 0;
    return { covered, total, percentage };
  },

  // Events & Telemetry (DETECT & TRACE)
  getAllEvents: () => store.events.map(e => {
    const decoy = store.decoys.find(d => d.id === e.decoy_id) || {};
    return {
      ...e,
      decoy_name: decoy.name || e.target || 'Decoy Asset',
      decoy_path: decoy.path || '/unknown/path',
      decoy_type: decoy.type || 'file'
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),

  insertEvent: ({ decoy_id, source_ip, source_host, action, severity }) => {
    const newEvent = {
      id: uuidv4(),
      decoy_id,
      source_ip: source_ip || '192.168.1.200',
      source_host: source_host || 'attacker-kali',
      action: action || 'READ',
      severity: severity || 'HIGH',
      timestamp: new Date().toISOString()
    };
    store.events.push(newEvent);
    db.markDecoyTriggered(decoy_id);
    save();
    
    const decoy = store.decoys.find(d => d.id === decoy_id) || {};
    return {
      ...newEvent,
      decoy_name: decoy.name || decoy_id,
      decoy_path: decoy.path || '',
      decoy_type: decoy.type || 'file'
    };
  },
  clearEvents: () => {
    store.events = [];
    save();
  },

  // Attack Graph Construction
  getForGraph: () => {
    const eventsSorted = [...store.events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const attackerIp = eventsSorted[0]?.source_ip || '192.168.1.200';
    const nodesMap = new Map();
    nodesMap.set('attacker', { id: 'attacker', label: `Attacker (${attackerIp})`, ip: attackerIp, type: 'attacker' });

    const edges = [];
    let previousNodeId = 'attacker';

    eventsSorted.forEach(event => {
      const decoy = store.decoys.find(d => d.id === event.decoy_id) || {};
      const decoyNodeId = `decoy-${event.decoy_id}`;
      
      if (!nodesMap.has(decoyNodeId)) {
        nodesMap.set(decoyNodeId, {
          id: decoyNodeId,
          label: decoy.name || event.decoy_id,
          type: 'decoy',
          path: decoy.path,
          severity: event.severity
        });
      }

      edges.push({
        id: `edge-${event.id}`,
        source: previousNodeId,
        target: decoyNodeId,
        label: event.action
      });

      previousNodeId = decoyNodeId;
    });

    return {
      nodes: Array.from(nodesMap.values()),
      edges
    };
  },

  // Incidents (EXPLAIN)
  getAllIncidents: () => store.incidents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  getLatestIncident: () => store.incidents.length > 0 ? store.incidents[store.incidents.length - 1] : null,
  insertIncident: (summary) => {
    const incident = {
      id: uuidv4(),
      summary,
      created_at: new Date().toISOString()
    };
    store.incidents.push(incident);
    save();
    return incident;
  },
  clearIncidents: () => {
    store.incidents = [];
    save();
  },

  // Legitimate User Logs (0 FP Proof)
  getLegitimateLogs: () => store.legitimateLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  insertLegitimateLog: ({ user, action, asset_name, path }) => {
    const log = {
      id: uuidv4(),
      user: user || 'legitimate_user',
      action: action || 'READ',
      asset_name: asset_name || 'Production Asset',
      path: path || '/shares/readme.md',
      timestamp: new Date().toISOString()
    };
    store.legitimateLogs.push(log);
    save();
    return log;
  },
  clearLegitimateLogs: () => {
    store.legitimateLogs = [];
    save();
  }
};

module.exports = { db, initialize, seed };
