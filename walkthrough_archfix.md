# Walkthrough — BaitShield Security & Architecture Refactor

BaitShield is an agentless, deception-based cybersecurity platform that deploys realistic, context-aware digital decoys (fake AWS keys, DB credentials, payroll spreadsheets, VPN configurations) inside corporate networks. Any interaction with a decoy is by definition malicious, guaranteeing **100% confidence security alerts with zero false positives**.

---

## 🛠️ Summary of Security & Codebase Fixes Applied

### 1. Real Authentication & Bearer Token Middleware (`requireAuth`)
- **Real Password Hashing**: Integrated `bcryptjs` in [`db.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/db.js) to verify passwords against a bcrypt hash rather than non-empty string checks.
- **Session Token Management**: Added `createSession`, `validateSession`, and `revokeSession` methods in `db.js`.
- **Token Verification Middleware ([`authMiddleware.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/middleware/authMiddleware.js))**: Guarded all protected `/api/*` endpoints with token verification.
- **Frontend Authorization Headers ([`api.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/lib/api.js))**: Updated all API calls to automatically attach `Authorization: Bearer <token>` headers extracted from user session state.
- **Configurable 2FA Demo Mode**: Controlled 2FA bypass codes (`123456`) via `process.env.ALLOW_DEMO_2FA` (default true for hackathons, configurable for production).

### 2. Dead Code Cleanup & Documentation Alignment
- **Deleted Dead Code ([`ollamaClient.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/services/ollamaClient.js))**: Completely removed 94 lines of unimported legacy code.
- **Documentation Realism**: Aligned [`README.md`](file:///d:/WaddaHeckUdoinNiga/BaitShield/README.md), [`README_ELI5.md`](file:///d:/WaddaHeckUdoinNiga/BaitShield/README_ELI5.md), and [`baitshield_judging_qa.md`](file:///C:/Users/cabc4/.gemini/antigravity/brain/86c85ebe-e0bb-40e0-bbd3-593c8430937e/baitshield_judging_qa.md) to accurately document our air-gapped local Llama 3.2 (via Ollama) architecture.

### 3. Offline Mode & Multi-Device LAN Architecture
- **In-Process AI Execution ([`simulate.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/routes/simulate.js))**: Replaced hardcoded HTTP self-fetches (`fetch("http://localhost:${PORT}/api/explain")`) with direct in-process function calls to `aiService.explain()`.
- **Dynamic LAN API Resolution ([`api.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/lib/api.js))**: Replaced hardcoded `localhost:3001` with dynamic hostname resolution (`window.location.hostname` or `import.meta.env.VITE_API_URL`), allowing phones and external laptops on the Wi-Fi LAN to connect seamlessly.

### 4. Configurable CORS Security
- Updated `backend/src/index.js` to allow origins configured via `process.env.ALLOWED_ORIGINS` (defaulting to permissive `'*'` for hackathon Wi-Fi demos).

### 5. Telemetry & Deduplication Polish
- **Dynamic IP Extraction ([`decoyServe.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/routes/decoyServe.js))**: Removed hardcoded IP fallbacks, dynamically extracting caller IPv4 addresses from request headers and socket connections.
- **Frontend Alert Deduplication ([`App.jsx`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/App.jsx))**: Deduplicated incoming WebSocket alerts by event ID, preventing duplicate timeline entries during React re-renders.

---

## 🚀 How to Run the Refactored Application

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
# Backend runs on http://0.0.0.0:3001 with 2FA token authentication
```

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev -- --host
# Frontend runs on http://localhost:5173
```
