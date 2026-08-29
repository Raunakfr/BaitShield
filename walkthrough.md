# Walkthrough — BaitShield Deception Cybersecurity MVP

BaitShield is a deception-based cybersecurity product that deploys realistic, context-aware digital decoys (fake AWS keys, DB credentials, payroll spreadsheets, VPN configurations) inside a simulated corporate network. Any interaction with a decoy is by definition malicious (real users never touch fake bait), guaranteeing **100% confidence security alerts with zero false positives**.

---

## 🚀 How to Run the Application

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3001 with WebSocket support
```

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🛠️ Five-Stage Deception Loop Implementation

| Stage | Feature | Implementation Detail |
|---|---|---|
| **1. ANALYZE** | Environment Vulnerability Scanner | Scans file shares, cloud config stores, and wikis. Uses **Claude API** (`ANTHROPIC_API_KEY` or fallback) to identify high-value targets and recommend decoy placements. |
| **2. PLANT** | AI Decoy Honey-Token Generator | Interactively generates context-aware decoys (fake AWS secrets, DB creds, payroll files) blending into realistic naming conventions. Updates Deception Coverage % live. |
| **3. DETECT** | Rule-Based Deterministic Engine | **100% Non-AI engine**. Instantly fires HIGH/MED severity alerts on decoy read/open/auth attempts and broadcasts via WebSockets. |
| **4. TRACE** | Attack Timeline & Attack Graph | Reconstructs events into a step-by-step **Attack Timeline** and interactive **Attack Node Graph** showing Attacker → Asset → Decoy traversal. |
| **5. EXPLAIN** | AI Incident Narrative Panel | Feeds triggered decoy event telemetry to **Claude API** to produce a plain-English summary inferring attacker intent and recommending containment. |

---

## 🎯 Verification & Demo Workflow

### 1. Deception Coverage & Inventory
- Open [http://localhost:5173](http://localhost:5173).
- Notice the **Deception Coverage Gauge** initialized at **80%** (4 of 5 attack surfaces protected).
- The **Decoy Inventory** table lists active honey-tokens (`deployment-prod.env`, `backup_config.yml`, `Q3_payroll.xlsx`, `aws-credentials.conf`, `infrastructure-passwords.md`).

### 2. Stage 1 & 2 Demo (ANALYZE & PLANT)
- Click **"Stage 1: Analyze"** in top header -> Runs AI scanner over environment assets and displays attack vectors.
- Click **"Stage 2: Plant Decoy"** -> Select asset (e.g. AWS Config Store) -> AI generates fake AWS root key -> Coverage updates live to **100%**.

### 3. Zero False Positives Demonstration
- Click **"Simulate Legitimate User"** (0 FP badge).
- Simulates real employees accessing real files (`/shares/engineering/readme.md`, `/shares/finance/q3_report.pdf`).
- **Result:** 0 alerts fire. Legitimate Telemetry status banner verifies zero false positives.

### 4. Live Hackathon Pitch Demo ("Simulate Attacker")
- Click **"Simulate Attacker"**.
- Within seconds:
  1. Alerts stream into **Recent Alerts** list with HIGH severity badges via WebSockets.
  2. **Stage 4 TRACE**: Switch between **Attack Timeline** (Step 1 -> Step 2 -> Step 3 -> Step 4) and **Attack Graph** visualization.
  3. **Stage 5 EXPLAIN**: The **AI Incident Analysis** panel populates with Claude API's plain-English narrative detailing the attacker's trajectory.

---

## 📊 Summary of Code Changes

- [`backend/src/db.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/db.js): Replaced broken SQLite `db.prepare` calls with pure JavaScript JSON file persistence supporting all CRUD operations.
- [`backend/src/services/aiService.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/services/aiService.js): Implemented multi-provider AI engine supporting Anthropic Claude API (`ANTHROPIC_API_KEY`), local Ollama, and smart fallback engines.
- [`backend/src/routes/simulate.js`](file:///d:/WaddaHeckUdoinNiga/BaitShield/backend/src/routes/simulate.js): Added attacker intrusion loop and legitimate employee traffic simulation.
- [`frontend/src/components/AnalyzeModal.jsx`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/components/AnalyzeModal.jsx): Added Stage 1 ANALYZE modal interface.
- [`frontend/src/components/PlantModal.jsx`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/components/PlantModal.jsx): Added Stage 2 PLANT AI decoy generator modal.
- [`frontend/src/components/AttackTimeline.jsx`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/components/AttackTimeline.jsx): Added Stage 4 TRACE sequence timeline visualization.
- [`frontend/src/components/Dashboard.jsx`](file:///d:/WaddaHeckUdoinNiga/BaitShield/frontend/src/components/Dashboard.jsx): Refined dark navy design (#0F1F38 / #162440) with orange (#F97316) accent colors.
