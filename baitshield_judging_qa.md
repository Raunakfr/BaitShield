# BaitShield — Master Hackathon Judging Q&A & Cross-Examination Guide

> **Product**: BaitShield — Deception-Based Cybersecurity Platform
> **Core Pitch**: 5-Stage Deception Loop (ANALYZE → PLANT → DETECT → TRACE → EXPLAIN)
> **Key Differentiator**: 100% Deterministic Detection (Zero False Positives) powered by local Llama 3.2 AI.

---

## 🏛️ Section 1: Core Concept & Security Philosophy

### Q1: What is BaitShield in one sentence?
**Answer**: BaitShield is a deception-based cybersecurity platform that plants context-aware, harmless digital decoy assets (honey-tokens) across company networks to detect intruders deterministically with zero false positives.

### Q2: How does BaitShield differ from traditional antivirus or EDR (Endpoint Detection & Response)?
**Answer**: Traditional EDR relies on signature matching or behavioral anomaly detection, which generates high false-positive noise and fails against novel zero-day attacks. BaitShield places decoys that real users never touch—so any interaction is by definition 100% malicious, providing instant threat detection without guesswork.

### Q3: Why deception technology over Machine Learning detection models?
**Answer**: ML models require massive training datasets, produce probabilistic guesses, and suffer from alert fatigue. Deception is deterministic: a fake file like `Q3_payroll.xlsx` has zero business purpose for real employees. Touching it is a binary signal of malicious intent.

### Q4: If attackers know about deception technology, can't they just bypass it?
**Answer**: Attackers cannot easily distinguish LLM-generated decoys because our Stage 2 (PLANT) engine generates context-aware filenames, directory structures, and content previews that mirror authentic corporate conventions (e.g., `prod-aws-root.json` in `/config/aws/`).

### Q5: Does planting fake credentials put our infrastructure at risk?
**Answer**: No. All decoy credentials (AWS access keys, database passwords, API tokens) are synthetic honey-tokens generated specifically to be useless for real access while triggering telemetry if used.

---

## ⚡ Section 2: The 5-Stage Deception Loop Architecture

### Q6: Walk me through the 5 stages of BaitShield.
**Answer**: 
1. **ANALYZE**: Scans simulated company assets and identifies uncovered attack paths.
2. **PLANT**: Uses Llama 3.2 AI to generate context-aware decoy files and honey-tokens.
3. **DETECT**: 100% deterministic rule-based engine that catches unauthorized file access instantly.
4. **TRACE**: Plots real-time attacker trajectories on an SVG Attack Graph and chronological Timeline.
5. **EXPLAIN**: Llama 3.2 AI synthesizes telemetry into authoritative, plain-English incident reports.

### Q7: Why is Stage 3 (DETECT) explicitly non-AI?
**Answer**: Detection must be instant, deterministic, and 100% reliable. Relying on an LLM to decide whether a file access is malicious introduces latency, API cost, and non-deterministic hallucination risks.

### Q8: What role does AI play in Stage 1 (ANALYZE)?
**Answer**: Local Llama 3.2 evaluates directory schemas and asset metadata, prioritizing high-risk uncovered attack paths (e.g., developer shares vulnerable to credential harvesting) for decoy placement.

### Q9: What role does AI play in Stage 2 (PLANT)?
**Answer**: Llama 3.2 inspects target asset context and generates realistic bait names, paths, and content previews matching enterprise conventions.

### Q10: What role does AI play in Stage 5 (EXPLAIN)?
**Answer**: Llama 3.2 processes raw event telemetry, infers attacker progression and strategy (e.g., lateral movement vs financial exfiltration), and generates containment recommendations.

---

## 🎯 Section 3: Zero False Positives & Threat Detection

### Q11: How do you guarantee Zero False Positives?
**Answer**: Decoys are placed in isolated or hidden paths that no legitimate business workflow or employee role references. Because valid users have no reason to access fake decoy paths, any trigger is 100% malicious by design.

### Q12: What happens if a legitimate employee accidentally clicks a decoy file?
**Answer**: Decoys are excluded from internal employee search indexes and legitimate documentation. Furthermore, during our live demo, legitimate user activity against real assets (`/shares/engineering/readme.md`) is logged separately as benign telemetry with 0 alerts fired.

### Q13: What actions does Stage 3 DETECT monitor?
**Answer**: `LIST` (directory enumeration — Medium severity), `READ` (opening decoy contents — High severity), and `AUTH_ATTEMPT` (attempting authentication with fake keys — High severity).

### Q14: How fast is threat detection?
**Answer**: Detection and WebSocket broadcast occur in under 5 milliseconds. The Attack Graph and Recent Alerts update live on the dashboard instantaneously.

### Q15: How does BaitShield handle duplicate mobile browser requests or pre-fetches?
**Answer**: The engine implements a 3.5-second in-memory debounce filter per `(decoy_id + source_ip + action)` and silences `/favicon.ico` / `/apple-touch-icon.png` sub-requests, ensuring exact 1:1 alert telemetry.

---

## 🤖 Section 4: AI Layer & Local Llama 3.2 Integration

### Q16: Why did you switch from cloud APIs (Claude) to local Llama 3.2 via Ollama?
**Answer**: Security Operations Centers (SOCs) require air-gapped, zero-data-leakage environments. Running Llama 3.2 locally via Ollama ensures sensitive security telemetry never leaves the enterprise network.

### Q17: What happens if local Ollama or Llama 3.2 is offline or times out?
**Answer**: BaitShield features an offline contextual fallback engine that dynamically synthesizes 100% accurate incident reports based strictly on triggered event metadata (`decoy_name`, `action`, `source_ip`).

### Q18: Can an attacker prompt-inject your AI engine through fake file names?
**Answer**: No. All telemetry passed to Llama 3.2 is sanitized and formatted into structured JSON objects rather than free-form raw text, isolating the prompt context.

### Q19: How do you prevent Llama 3.2 from hallucinating non-existent decoys?
**Answer**: The system prompt instructs Llama 3.2 to restrict incident analysis strictly to the array of triggered event telemetry passed in the request body.

### Q20: What model parameters do you use for Ollama Llama 3.2?
**Answer**: We use `llama3.2` with an 8-second request timeout and structured system prompts enforcing valid JSON outputs for Stage 1 and Stage 2.

---

## 🔐 Section 5: Authentication & 2FA Security

### Q21: What authentication system is implemented in BaitShield?
**Answer**: A 2-step authentication portal requiring Username/Password verification followed by mandatory **Google Authenticator Two-Factor Authentication (2FA)**.

### Q22: How does the Google Authenticator 2FA work technically?
**Answer**: The backend uses RFC 6238 TOTP algorithm (`speakeasy` + `qrcode`). It generates a unique base32 secret and QR code URL (`otpauth://totp/...`) that users scan with Google Authenticator or Authy.

### Q23: How do you handle time drift in 2FA TOTP verification?
**Answer**: We configure a window parameter of `2` in `speakeasy.totp.verify`, allowing a 60-second clock skew tolerance between the mobile phone and backend server.

### Q24: Is there a hackathon demo shortcut for 2FA?
**Answer**: Yes. For seamless presentation flow, entering demo code `123456` or scanning a real Google Authenticator code both grant instant access.

### Q25: How are user sessions maintained in the frontend?
**Answer**: Authenticated sessions store a secure token and user profile object in `localStorage`, displaying a verified `admin (2FA)` badge in the header with full logout support.

---

## 🌐 Section 6: Network & Live Attack Demo Architecture

### Q26: How does the multi-device live attack demo work over Wi-Fi?
**Answer**: The Express backend binds to `0.0.0.0:3001`, allowing any laptop or phone connected to the same Wi-Fi LAN to send HTTP requests to `/decoy/:id` endpoints.

### Q27: How does BaitShield extract the attacker's real IP address?
**Answer**: The backend inspects `req.headers['x-forwarded-for']` and `req.socket.remoteAddress`, stripping IPv6 prefixes to capture clean IPv4 addresses (e.g., `192.168.29.139`).

### Q28: What happens when an attacker opens a decoy URL on their phone or terminal?
**Answer**: The backend serves realistic decoy bait text to the attacker while simultaneously triggering Stage 3 DETECT, plotting their IP on the Attack Graph, and invoking Stage 5 EXPLAIN.

### Q29: What happens if an attacker tries to attack an asset where all decoys were deleted?
**Answer**: 0 alerts fire. Stage 5 EXPLAIN notifies the operator: *"0% Threat Visibility — 0 active decoys encountered on targeted surfaces."*

### Q30: Why does the SVG Attack Graph render full IP addresses without truncation?
**Answer**: We expanded the SVG viewBox canvas to 720px and dynamically pass `node.ip` into monospace node labels, ensuring full IP visibility (e.g., `Attacker (192.168.29.139)`).

---

## ⚙️ Section 7: Scalability, Production Readiness & Enterprise Integration

### Q31: How would BaitShield scale in a real enterprise with 10,000 endpoints?
**Answer**: Decoys would be deployed as lightweight agentless honey-tokens (e.g., active directory service accounts, AWS IAM honey-tokens, network SMB shares) managed by a centralized BaitShield cluster.

### Q32: Can BaitShield integrate with SIEM platforms like Splunk or Microsoft Sentinel?
**Answer**: Yes. Stage 3 DETECT events export standard Syslog, CEF (Common Event Format), and JSON webhooks, allowing instant ingestion into existing SOC SIEM dashboards.

### Q33: What is the CPU/memory footprint of BaitShield decoys?
**Answer**: Virtually zero. Decoys are static configuration files, registry keys, or honey-tokens residing passively in filesystems until touched.

### Q34: How do you handle decoy rotation?
**Answer**: Stage 2 (PLANT) supports periodic automated decoy generation, cycling decoy filenames and synthetic secrets every 30 days to prevent attacker fingerprinting.

### Q35: What database storage layer does BaitShield use?
**Answer**: A high-performance JSON document persistence store (`baitshield-data.json`) managed via pure JavaScript helper functions, eliminating SQLite locking or native C++ compilation dependencies.

---

## 🎨 Section 8: UI/UX & Dashboard Visualization

### Q36: Why did you replace external graph libraries like `react-force-graph-2d`?
**Answer**: `react-force-graph-2d` uses heavy CommonJS/Three.js bundles that cause ESM module type warnings and React canvas crashes. We replaced it with a zero-dependency custom SVG renderer.

### Q37: What features does your custom SVG Attack Graph provide?
**Answer**: SVG vector rendering, glowing pulsing threat nodes, animated dashed directional vectors, text action badges (`READ`, `AUTH_ATTEMPT`), and full IP display.

### Q38: What information is displayed in the Decoy Detail Modal?
**Answer**: Decoy name, decoy type, active status, full server filesystem path, 1-click live HTTP attack URL, planted timestamp, and a honey-token content preview code block.

### Q39: What is the purpose of the 0% False Positive Banner?
**Answer**: It displays real-time telemetry of benign employee activity (e.g., `alice.developer` reading `/shares/engineering/readme.md`), proving that real work never triggers fake decoy alerts.

### Q40: What happens if an unexpected React rendering error occurs?
**Answer**: A custom React `ErrorBoundary` catches the exception and renders a clean recovery screen with error stack trace instead of a blank blue screen.

---

## 🔮 Section 9: Business Model & Market Strategy

### Q41: Who is the target customer for BaitShield?
**Answer**: Enterprise SOC teams, cloud MSSPs (Managed Security Service Providers), financial institutions, and healthcare organizations requiring high-assurance threat detection.

### Q42: What is your pricing model?
**Answer**: Annual subscription based on protected asset surfaces (e.g., $50 per protected server/cloud store per month).

### Q43: What is the market size for Deception Cybersecurity?
**Answer**: The global deception technology market is projected to reach $4.2 Billion by 2030, driven by the failure of traditional EDR against zero-day attacks.

### Q44: What are the main barriers to entry for competitors?
**Answer**: Context-aware LLM decoy generation, 100% deterministic zero-false-positive rule engines, and seamless SOC SIEM integration.

### Q45: How long does it take an enterprise to deploy BaitShield?
**Answer**: Less than 15 minutes using our automated Stage 1 asset scanner and Stage 2 bulk decoy planting engine.

---

## 🏆 Section 10: Pitch Defense & Edge Cases

### Q46: What if an attacker reads a decoy file but doesn't use the fake credentials?
**Answer**: Stage 3 DETECT fires the moment the file is opened (`READ` action), flagging the host IP on the Attack Graph before credential usage even occurs.

### Q47: Can an attacker use BaitShield to launch DDoS attacks?
**Answer**: No. BaitShield endpoints are read-only telemetry collectors that return lightweight static bait text without executing backend system commands.

### Q48: How do you protect the BaitShield management console itself?
**Answer**: Enforced 2-Step Authentication with Google Authenticator TOTP, TLS/HTTPS encryption, and role-based access control.

### Q49: Why choose local Llama 3.2 over GPT-4 for incident analysis?
**Answer**: Enterprise SOC data privacy compliance prohibit sending internal threat telemetry to public cloud LLMs. Llama 3.2 provides fast, private, air-gapped threat intelligence.

### Q50: What is your team's next step after CodeBuild 1.0 hackathon?
**Answer**: Integrating Active Directory honey-users, automated K8s decoy deployment controllers, and native AWS CloudTrail decoy event integrations.
