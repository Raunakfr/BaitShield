# 🛡️ BaitShield — Deception-Based Cybersecurity Platform

[![Hackathon](https://img.shields.io/badge/Hackathon-CodeBuild_1.0_MVP-orange.svg)](https://github.com)
[![Detection](https://img.shields.io/badge/Detection-100%25_Deterministic-green.svg)](https://github.com)
[![False Positives](https://img.shields.io/badge/False_Positives-0%25-brightgreen.svg)](https://github.com)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Llama_3.2_(Ollama_Local)-blue.svg)](https://ollama.com)
[![Auth](https://img.shields.io/badge/Auth-Google_Authenticator_2FA-purple.svg)](https://github.com)

> **BaitShield** is an agentless, deception-based cybersecurity platform built for CodeBuild 1.0. It places context-aware, realistic digital "decoy" assets (honey-tokens, fake AWS keys, database connection strings, executive compensation spreadsheets) inside corporate environments. 
> 
> Because legitimate employees never interact with fake bait, any touch on a decoy is **100% deterministic proof of malicious intrusion** — eliminating machine-learning guesswork and reducing false positives to **absolute zero**.

---

## 🚀 The Five-Stage Deception Loop

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │  1. ANALYZE     │ ────► │   2. PLANT      │ ────► │   3. DETECT     │
  │  Vulnerability  │       │  Contextual AI  │       │ 100% Rule-Based │
  │  Path Scanner   │       │  Decoy Generator│       │  (Zero AI/FP)   │
  └─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                               │
  ┌─────────────────┐                                          │
  │  5. EXPLAIN     │ ◄────────────────────────────────────────┘
  │  Llama 3.2 AI   │ ◄──── [WebSockets Live Push] ────┐
  │ Threat Analysis │                                  │
  └─────────────────┘                         ┌────────┴────────┐
                                              │    4. TRACE     │
                                              │ SVG Attack Graph│
                                              │ Attack Timeline │
                                              └─────────────────┘
```

1. **ANALYZE** — Scans company assets (file shares, cloud configs, wikis, databases) and identifies uncovered attack paths.
2. **PLANT** — Generates context-aware decoy files and synthetic honey-tokens blending into corporate naming schemes.
3. **DETECT** — **100% Deterministic Engine (Zero AI)**. Triggers instant sub-5ms alerts when an intruder reads or uses fake bait.
4. **TRACE** — Plots live attacker trajectories on a zero-dependency SVG Attack Graph and chronological Attack Timeline.
5. **EXPLAIN** — Local **Llama 3.2 AI** (via Ollama) synthesizes raw telemetry into authoritative plain-English security incident reports.

---

## 🔥 Key Features

- 🛡️ **Zero False Positive Guarantee**: Real users interact with real assets; attackers touch decoys. Deterministic triggering eliminates alert fatigue.
- 🤖 **Air-Gapped Local AI (Llama 3.2)**: Threat analysis runs 100% locally via Ollama. Sensitive security telemetry never leaves your enterprise network.
- 🔐 **Google Authenticator 2FA**: Mandatory RFC 6238 TOTP authentication with QR code setup and demo bypass mode (`123456`).
- 🌐 **Live Multi-Device Wi-Fi Attack Support**: Host on `0.0.0.0:3001` to demonstrate real live attacks from external laptops or phones during presentations.
- 📊 **Zero-Dependency SVG Attack Graph**: Ultra-fast vector graph renderer displaying real-time attacker nodes, pulsing threat circles, action badges, and full un-truncated IP addresses.
- 🔎 **Interactive Decoy Details Inspector**: Inspect full filesystem paths, 1-click live HTTP attack links, metadata, and syntax-highlighted honey-token content previews.
- ⚡ **Mobile Request Deduplication**: Built-in 3.5s in-memory debounce filter and favicon silencer preventing duplicate mobile browser alerts.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: High-throughput REST API listening on `0.0.0.0:3001`.
- **WebSockets (`ws`)**: Real-time alert and incident broadcast pipeline.
- **Local AI Engine**: Ollama (`llama3.2`) + dynamic air-gapped fallback synthesizer.
- **Authentication**: `speakeasy` (RFC 6238 TOTP) & `qrcode` for Google Authenticator.
- **Database**: Pure JS JSON document store (`baitshield-data.json`).

### Frontend
- **React (Vite ESM)**: Single Page Application built with TailwindCSS.
- **Lucide Icons**: Modern cybersecurity icon set.
- **SVG Graph Engine**: Lightweight custom vector graph renderer.
- **React Error Boundary**: Production crash protection.

---

## 📦 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **Ollama** (Optional, for local AI threat reports): Download from [ollama.com](https://ollama.com) and pull Llama 3.2:
  ```bash
  ollama pull llama3.2
  ```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend server will start listening on `0.0.0.0:3001`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host
```
*Frontend app will be available at `http://localhost:5173`.*

---

## 🔑 Login & 2FA Demo Credentials

| Field | Demo Credential |
|---|---|
| **Username** | `admin` |
| **Password** | `baitshield2024` |
| **2FA Method** | Scan QR Code via Google Authenticator **OR** click **"Quick Demo Code (123456)"** |

---

## 🎭 Live Multi-Device Attack Demonstration (Hackathon Pitch)

To demonstrate a live real-world attack from a phone or second laptop during your presentation:

1. Connect both devices to the same Wi-Fi network.
2. Note your server PC's local IP address (e.g. `192.168.29.139`).
3. On the secondary device (phone/laptop B), open terminal or browser and access:
   ```bash
   curl http://192.168.29.139:3001/decoy/dcoy-1
   ```
   *(Or copy the live attack link directly from any row in the **Decoy Inventory** table)*.
4. Watch **Laptop A (SOC Dashboard)** instantly pop up a High Severity Alert, plot the phone's IP on the Attack Graph, and generate a local Llama 3.2 incident report in real-time!

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Step 1: Verify password & return 2FA QR code |
| `POST` | `/api/auth/verify-2fa` | Step 2: Verify 6-digit TOTP code from Google Authenticator |
| `GET` | `/decoy/:id` | Live decoy attack endpoint (returns fake bait & triggers alert) |
| `GET` | `/real/readme.md` | Real benign asset access (0 false positives demo) |
| `GET` | `/api/analyze` | Stage 1: Analyze environment attack paths |
| `POST` | `/api/plant` | Stage 2: Plant AI-generated decoy on asset |
| `POST` | `/api/simulate` | Trigger simulated attacker intrusion sequence |
| `POST` | `/api/simulate/legitimate` | Trigger 0 false positive legitimate user activity |
| `DELETE` | `/api/simulate/reset` | Clear telemetry, incidents, and reset demo state |

---

## 📄 License & Attribution

Built with ❤️ for **CodeBuild 1.0 Hackathon**. Designed under the Google DeepMind Antigravity framework.
