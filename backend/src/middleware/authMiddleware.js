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

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-session-token']) {
    token = req.headers['x-session-token'];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required. Session token missing.' });
  }

  const session = db.validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token.' });
  }

  req.user = session;
  next();
}

module.exports = { requireAuth };
