const { db } = require('../db');

function requireAuth(req, res, next) {
  // Exclude public endpoints (Auth routes, Direct Decoy Attack routes, Real Benign File demo)
  const publicPaths = ['/api/auth/login', '/api/auth/verify-2fa', '/decoy', '/real/readme.md', '/favicon.ico'];
  const isPublic = publicPaths.some(p => req.path.startsWith(p));

  if (isPublic) {
    return next();
  }

  const authHeader = req.headers.authorization || req.headers['authorization'];
  let token = null;

  // Extract session token from cookie, Authorization header, or x-session-token header
  if (req.cookies && req.cookies.baitshield_session) {
    token = req.cookies.baitshield_session;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-session-token']) {
    token = req.headers['x-session-token'];
  }

  if (token) {
    const session = db.validateSession(token);
    if (session) {
      req.user = session;
      return next();
    }
  }

  // If strict auth mode is enabled via env, enforce 401 Unauthorized
  if (process.env.REQUIRE_STRICT_AUTH === 'true') {
    return res.status(401).json({ error: 'Unauthorized: Authentication required. Session token missing or expired.' });
  }

  // Default Demo Mode: Attach demo admin session so dashboard never breaks during live presentations
  req.user = { username: 'admin', role: 'Security Operations Lead' };
  next();
}

module.exports = { requireAuth };
