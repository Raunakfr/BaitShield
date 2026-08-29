const getBaseUrl = () => {
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:3001/api`;
};

export const BASE_URL = getBaseUrl();

// Helper to attach authorization header to authenticated requests
const authFetch = async (url, options = {}) => {
  let token = null;
  try {
    const stored = localStorage.getItem('baitshield_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed.token || null;
    }
  } catch (e) {}

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers
  });
};

// Auth & 2FA API
export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const verify2FA = async (code, secret) => {
  const res = await fetch(`${BASE_URL}/auth/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, secret })
  });
  return res.json();
};

export const logout = async () => {
  const res = await authFetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  return res.json();
};

// Decoys & Assets API
export const getDecoys = async () => {
  const res = await authFetch(`${BASE_URL}/decoys`);
  return res.json();
};

export const getCoverage = async () => {
  const res = await authFetch(`${BASE_URL}/decoys/coverage`);
  return res.json();
};

export const deleteDecoy = async (id) => {
  const res = await authFetch(`${BASE_URL}/decoys/${id}`, { method: 'DELETE' });
  return res.json();
};

export const getAssets = async () => {
  const res = await authFetch(`${BASE_URL}/assets`);
  return res.json();
};

export const getTrace = async () => {
  const res = await authFetch(`${BASE_URL}/trace`);
  return res.json();
};

export const getTraceGraph = async () => {
  const res = await authFetch(`${BASE_URL}/trace/graph`);
  return res.json();
};

export const getIncidents = async () => {
  const res = await authFetch(`${BASE_URL}/incidents`);
  return res.json();
};

export const getLegitimateLogs = async () => {
  const res = await authFetch(`${BASE_URL}/trace/legitimate`);
  return res.json();
};

export const simulateAttacker = async () => {
  const res = await authFetch(`${BASE_URL}/simulate`, { method: 'POST' });
  return res.json();
};

export const simulateLegitimate = async () => {
  const res = await authFetch(`${BASE_URL}/simulate/legitimate`, { method: 'POST' });
  return res.json();
};

export const reset = async () => {
  const res = await authFetch(`${BASE_URL}/simulate/reset`, { method: 'DELETE' });
  return res.json();
};

export const analyzeEnvironment = async () => {
  const res = await authFetch(`${BASE_URL}/analyze`);
  return res.json();
};

export const plantDecoy = async (asset_id, context) => {
  const res = await authFetch(`${BASE_URL}/plant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset_id, context })
  });
  return res.json();
};

export const explain = async (data) => {
  const res = await authFetch(`${BASE_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};
