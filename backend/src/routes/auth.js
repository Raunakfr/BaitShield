const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { db } = require('../db');

// Store active 2FA secret
let authSecret = speakeasy.generateSecret({
  name: 'BaitShield (admin@company.com)',
  issuer: 'BaitShield Deception SOC'
});

// POST /api/auth/login — Step 1: Real Password Verification
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Verify Password against bcrypt hash
    const isPasswordValid = db.verifyPassword(password);
    if (!isPasswordValid || username.toLowerCase() !== 'admin') {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate QR Code for Google Authenticator App
    const otpauthUrl = authSecret.otpauth_url;
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    res.json({
      step: '2FA_REQUIRED',
      message: 'Password verified. Scan QR Code with Google Authenticator or enter 6-digit code.',
      username,
      qrCodeUrl,
      secret: authSecret.base32
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/verify-2fa — Step 2: Verify TOTP Code & Issue Session Token
router.post('/verify-2fa', (req, res) => {
  try {
    const { code, secret } = req.body;
    const targetSecret = secret || authSecret.base32;

    // Verify 6-digit code with Google Authenticator
    const verified = speakeasy.totp.verify({
      secret: targetSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    // Check if demo bypass mode is permitted (default true for hackathon, configurable via env)
    const allowDemo2FA = process.env.ALLOW_DEMO_2FA !== 'false';
    const isDemoCode = allowDemo2FA && (code === '123456' || code === '000000' || code === '888888');

    if (verified || isDemoCode) {
      const session = db.createSession({ username: 'admin', role: 'Security Operations Lead' });
      res.json({
        status: 'authenticated',
        token: session.token,
        user: {
          username: session.username,
          email: 'admin@company.com',
          role: session.role,
          twoFactorAuth: 'Google Authenticator (Verified)'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid Google Authenticator code. Please check 2FA app.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout — Revoke Session
router.post('/logout', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      db.revokeSession(token);
    }
    res.json({ status: 'logged_out' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
