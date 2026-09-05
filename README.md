# Pitch Precision

> High-Performance Biomechanical Cricket Analytics, Training Hub & Safeguarding Platform (OWASP MASVS & GDPR Compliant)

Pitch Precision is a comprehensive, elite sports science and biomechanical coaching application designed to analyze delivery trajectories, bat swing mechanics, training routines, and physical recovery markers for cricket athletes. Built with a full-stack architecture using **React, Vite, Express, and Tailwind CSS**, the platform organizes complex capabilities into intuitive core hubs, featuring enterprise-grade safeguarding, offline-first cryptographic vaults, and advanced session security frameworks.

---

## 🧭 Core Architectural Hubs

To provide a clean, focused user experience while housing deep coaching and analytics functionality, Pitch Precision groups all features into three unified flagship hubs:

### 1. 🏋️‍♂️ Train Hub (`TrainHubScreen`)
*   **Smart Drills Vault:** Curated drills repository categorized by discipline (bowling, batting, fielding, fitness, mental), difficulty tier, and skill tree paths.
*   **Training Plan & Bay Scheduling:** Interactive weekly calendar, net bay reservations, and workload volume allocation.
*   **Practice Sessions:** Active rep execution counters, target completion timers, and instant auditory feedback cues.
*   **Scenario Training:** Match tactical scenarios, death-overs simulation, tactical masterclasses, and an interactive digital tactical chalkboard.

### 2. 🎥 Video Studio Hub (`VideoHubScreen`)
*   **120–240 FPS Camera Capture:** High-frame-rate recording with live pitch landing zone grids, virtual stumps, release corridors, and simulated Doppler speed radar.
*   **Secure Media Vault:** Cloud and local encrypted media vault with auto-delivery slicing, tamper-proof hashes, and server-side EXIF sanitization.
*   **Frame-by-Frame Motion Lab:** Biomechanical video player with joint angle calculations (e.g. front knee brace at release, elbow extension), speed scrubbing, and multi-color telestrator drawing tools.
*   **Dual Video Synchronizer:** Side-by-side synchronized scrubbing with ghost overlay comparison between baseline and current deliveries.

### 3. 📈 Progress & PDP Hub (`ProgressHubScreen`)
*   **Active Goals & Milestones:** Player Development Plan (PDP) tracking with measurable targets, baseline-to-target meters, and completion deadlines.
*   **Biomechanical Statistics:** Radar performance profiles, Wagon Wheel shot distribution vectors, Pitch Corridor heatmap logs, and readiness indices.
*   **Coach Observations & Voice Memos:** Timestamped diagnostic feedback, praise cues, corrective action guides, and synchronized audio voice note playback.
*   **Development History & Evidence:** Side-by-side baseline vs. current telemetry comparison matrix with verified coach endorsements and PDF/Print reporting.

---

## 🚀 Key Security & Safeguarding Pillars

### 1. Robust Session Management & Security Clearance
*   **Short-Lived Access Tokens:** Stateless JWT access keys expire in 15 minutes to minimize exposure windows.
*   **Secure Rotated Cookies:** Refresh tokens are securely managed via `HttpOnly`, `Secure`, `SameSite=Strict` cookies, completely isolated from browser-accessible memory.
*   **Active Session Registries:** Backend tracking allows real-time session listing and immediate multi-device revocation.
*   **Inactive Auto-Purges:** Automated sliding window expiration purges inactive sessions after 30 minutes.
*   **7 Step-Up Re-Authentication Actions:** The following high-sensitivity events require a recent (within 5 minutes) step-up password verification check before execution:
    1.  Password Updates
    2.  Email Address Modifications
    3.  Linking Junior/Youth Athlete Accounts
    4.  Changing Parent-Guardian supervision bonds
    5.  DSAR (Data Subject Access Request) Personal Information Exports
    6.  Account Purges & Permanent Deletions
    7.  Changing Administrative / Coaching privileges

### 2. Video & Media Security (MASVS-DATA-INGESTION Compliance)
*   **Private-By-Default Isolation:** Athlete video recordings are private by default and visible only to the uploading athlete and authorized parent-guardian links.
*   **Zero Raw Storage URLs:** Raw storage and file system paths are never exposed to the public web root.
*   **Temporary Signed URLs:** Access links are short-lived, single-use, and signed with short expiration windows.
*   **Header Magic-Bytes Verification:** Deep file header checks scan uploaded video buffers to verify true magic bytes (e.g., `ftypmp42`, `moov`) before saving, blocking executable masquerading attempts.
*   **Multi-Stage Ingestion Sanitization:** The gateway filters extension types, restricts mime-type declarations, caps video sizes at 50MB, and enforces duration thresholds.
*   **Malware Scan Engine:** Secure scanning engine immediately quarantines suspicious files.
*   **Server-Side Metadata Stripping:** Removes all unnecessary EXIF tags, GPS coordinate markers, and camera metadata, while generating safe SVG thumbnails server-side.
*   **Self-Serve GDPR Purges:** Players or parents can trigger instant deletion of uploaded content, performing secure physical sanitization from disk.

### 3. Safeguarding & Offline Cryptographic Vaults
*   **Offline Local Vault Sync:** Complete support for local-first operations. Offline additions and logs are preserved locally and synced automatically when connections are restored.
*   **End-to-End Envelope Cryptography:** Employs the browser Web Crypto API to wrap sensitive safeguarding files using hardware-strength AES-256-GCM encryption.
*   **Zero-Knowledge Key Derivation:** Cryptographic keys are derived dynamically on-the-fly and never written to persistent client storage.

---

## 🛠️ Quick Start & Run Commands

Pitch Precision uses a unified full-stack server-client setup. The backend server proxies API queries and manages Vite assets dynamically during development.

### Prerequisite
Ensure you have **Node.js** (v18+) and **npm** installed.

### 1. Installation
Install the project dependencies defined in `package.json`:
```bash
npm install
```

### 2. Running in Development
Boot the Express + Vite server with hot-reloading:
```bash
npm run dev
```
The server will bind and be accessible on the default port: **`http://localhost:3000`**

### 3. Production Build & Bundling
Compile the React front-end assets and bundle the Express server using esbuild:
```bash
npm run build
```
This produces optimized production assets under `dist/` and compiles the Node backend into a single, high-efficiency CJS file: `dist/server.cjs`.

### 4. Running the Production Server
Start the production-ready full-stack application:
```bash
npm run start
```

---

## 📂 Project Directory Structure

```text
├── server.ts                       # Production Express entry point (Vite Dev Middleware + API Proxy)
├── package.json                    # Application manifest and unified run scripts
├── index.html                      # HTML5 Canvas container & application anchor
├── vite.config.ts                  # Vite build and asset pipeline configurations
├── src/
│   ├── App.tsx                     # Main Router and application hub orchestrator
│   ├── main.tsx                    # React client entry point
│   ├── index.css                   # Global Tailwind CSS configurations
│   ├── types.ts                    # Global shared Types, interfaces, and enums
│   ├── data/                       # Mock data, PDP schemas, drills & video keyframes
│   ├── utils/
│   │   ├── authSecurityManager.ts  # Secure Fetch Client, JWT in-memory store & token rotation
│   │   └── audioFeedback.ts        # UI Beeps & cricket ball impact sound synthesizers
│   └── components/
│       ├── Navbar.tsx              # Consolidated 5-tab navigation bar
│       ├── screens/
│       │   ├── TrainHubScreen.tsx  # Unified Train Hub (Drills, Planner, Practice, Scenarios)
│       │   ├── VideoHubScreen.tsx  # Unified Video Studio (Record, Vault, Analysis, Comparison)
│       │   ├── ProgressHubScreen.tsx # Unified Progress Hub (Goals, Stats, Feedback, History)
│       │   └── ...                 # Security, Safeguarding, Admin & Roster screens
│       ├── pdp/                    # Player Development Plan views, modals & evidence matrix
│       ├── videoAnalysis/          # Biomechanical slow-mo, telestrator, and dual synchronizer
│       └── drills/                 # Smart Drills catalog and execution modules
```

---

## 🛡️ OWASP MASVS Compliance Summary

The platform is designed against the **Mobile Application Security Verification Standard (MASVS v2.0)**:
*   **MASVS-DATA-1:** Strict encryption of static files inside standard key stores.
*   **MASVS-CRYPTO-1:** Hardware-backed cryptographic keys for device-bound sessions.
*   **MASVS-AUTH-1:** Device-bound RFC 9449 DPoP (Demonstrating Proof-of-Possession) token rotation.
*   **MASVS-NETWORK-1:** Zero insecure communication, forcing encrypted TLS 1.3 tunnels.
*   **MASVS-RESILIENCE-1:** Deep root detection traps, integrity verifications, and reverse-engineering safeguards.
