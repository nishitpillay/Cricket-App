# Pitch Precision

> High-Performance Biomechanical Cricket Analytics & Safeguarding Platform (OWASP MASVS & GDPR Compliant)

Pitch Precision is a state-of-the-art sports science and biomechanical coaching application designed to analyze delivery trajectories, swing metrics, and physical recovery markers for elite cricket athletes. Built with a full-stack architecture using **React, Vite, Express, and Tailwind CSS**, the platform incorporates enterprise-grade safeguarding, offline-first cryptographic vaults, and advanced session security frameworks.

---

## 🚀 Key Architectural Pillars

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
*   **Temporary Signed URLs:** Access links are short-lived, single-use, and signed with short expiration windows (e.g., 10 seconds).
*   **Header Magic-Bytes Verification:** Deep file header checks scan uploaded video buffers to verify true magic bytes (e.g., `ftypmp42`, `moov`) before saving, blocking executable masquerading attempts.
*   **Multi-Stage Ingestion Sanitization:** The gateway filters extension types (prohibiting `.sh`, `.exe`, `.dll`), restricts mime-type declarations, caps video sizes at 50MB, and enforces a 15-second duration threshold.
*   **Malware Scan Engine:** Simulated ClamAV secure scanning engine immediately quarantines suspicious files.
*   **Server-Side Metadata Stripping & Frame Grabbing:** Removes all unnecessary EXIF tags, GPS coordinate markers, and camera metadata, while rendering safe frame-grabbing base64 SVG thumbnails server-side.
*   **Self-Serve GDPR Purges:** Players or parents can trigger instant deletion of uploaded content, performing secure physical sanitization from disk.
*   **Relationship-Bound Access Controls:** Coaches lose access immediately if the active coaching relationship is disabled or removed.

### 3. Safeguarding & Offline Cryptographic Vaults
*   **Offline Local Vault Sync:** Complete support for local-first operations. Offline additions and logs are preserved locally and synced automatically when connections are restored.
*   **End-to-End Envelope Cryptography:** Employs the browser Web Crypto API to wrap sensitive safeguarding files using hardware-strength AES-256-GCM encryption.
*   **Zero-Knowledge Key Derivation:** Cryptographic keys are derived dynamically from user passwords on-the-fly and never written to persistent client storage, preventing offline side-channel leaks.

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
│   ├── App.tsx                     # Main Router and application wrapper
│   ├── main.tsx                    # React client entry point
│   ├── index.css                   # Global Tailwind CSS configurations
│   ├── types.ts                    # Global shared Types, interfaces, and enums
│   ├── utils/
│   │   ├── authSecurityManager.ts  # Secure Fetch Client, JWT in-memory store & token rotation
│   │   └── audioFeedback.ts        # UI Beeps & cricket ball impact sound synthesizers
│   └── components/
│       ├── ReauthModal.tsx         # Password Step-Up verification modal
│       ├── videoAnalysis/
│       │   ├── VideoAnalysisTool.tsx # Biomechanical slow-mo and angle tracker
│       │   └── SecureMediaVault.tsx  # Dynamic file uploader, sandbox validators & signed URLs list
│       ├── screens/
│       │   ├── SecurityAndSessionsScreen.tsx # JWT, Refresh token, active sessions & step-up panel
│       │   └── ...                  # Safeguarding, Tactile Boards & Athlete analytics modules
```

---

## 🛡️ OWASP MASVS Compliance Summary

The platform is designed against the **Mobile Application Security Verification Standard (MASVS v2.0)**:
*   **MASVS-DATA-1:** Strict encryption of static files inside standard key stores.
*   **MASVS-CRYPTO-1:** Hardware-backed cryptographic keys for device-bound sessions.
*   **MASVS-AUTH-1:** Device-bound RFC 9449 DPoP (Demonstrating Proof-of-Possession) token rotation.
*   **MASVS-NETWORK-1:** Zero insecure communication, forcing encrypted TLS 1.3 tunnels.
*   **MASVS-RESILIENCE-1:** Deep root detection traps, integrity verifications, and reverse-engineering safeguards.
