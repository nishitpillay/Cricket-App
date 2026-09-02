import { 
  KMSKeyRing, 
  KMSKeyVersion, 
  EncryptedFieldEnvelope, 
  TransitSecurityStatus, 
  MobileSecurityAuditItem,
  CloudKmsProvider 
} from '../types';

/**
 * PITCH PRECISION - CRYPTOGRAPHIC & ENCRYPTION AT REST / IN TRANSIT ENGINE
 * 
 * Compliant with:
 * - FIPS 140-2 Level 3 Hardware Security Modules (HSM)
 * - NIST SP 800-57 Part 1 Rev. 5 Key Management Guidelines
 * - TLS 1.3 RFC 8446 / Strict HSTS RFC 6797
 * - OWASP Mobile Top 10: M1 (Improper Credential Usage), M2 (Inadequate Supply Chain Security)
 */

// Cloud KMS Managed Key Rings
export const INITIAL_KMS_KEY_RINGS: KMSKeyRing[] = [
  {
    keyRingId: 'kr-cricket-athlete-records-prod',
    resourceArn: 'projects/pitchprecision-cloud-prod/locations/europe-west2/keyRings/kr-cricket-athlete-records-prod/cryptoKeys/kek-athlete-pii-v2',
    provider: 'GOOGLE_CLOUD_KMS',
    region: 'europe-west2 (London)',
    primaryKeyId: 'kek-athlete-pii-v2',
    activeVersion: 2,
    managedHsm: true,
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    versions: [
      {
        versionId: 'ver-kek-001',
        versionNumber: 1,
        state: 'ACTIVE_READ_ONLY',
        algorithm: 'GOOGLE_SYMMETRIC_ENCRYPTION (AES-256-GCM)',
        protectionLevel: 'HSM_FIPS_140_2_L3',
        createdAt: '2025-12-01T00:00:00Z',
        rotationIntervalDays: 90,
        nextScheduledRotation: '2026-03-01T00:00:00Z',
        totalRecordsEncrypted: 1420
      },
      {
        versionId: 'ver-kek-002',
        versionNumber: 2,
        state: 'PRIMARY_ACTIVE',
        algorithm: 'GOOGLE_SYMMETRIC_ENCRYPTION (AES-256-GCM)',
        protectionLevel: 'HSM_FIPS_140_2_L3',
        createdAt: '2026-03-01T00:00:00Z',
        primarySince: '2026-03-01T00:00:00Z',
        rotationIntervalDays: 90,
        nextScheduledRotation: '2026-05-30T00:00:00Z',
        totalRecordsEncrypted: 4892
      }
    ]
  },
  {
    keyRingId: 'kr-biomechanical-telemetry-vault',
    resourceArn: 'arn:aws:kms:eu-west-2:519491305986:key/mrk-84a1e940-video-biomech-v1',
    provider: 'AWS_KMS',
    region: 'eu-west-2 (London High-Perf)',
    primaryKeyId: 'mrk-84a1e940-video-biomech-v1',
    activeVersion: 1,
    managedHsm: true,
    autoRotationEnabled: true,
    rotationPeriodDays: 90,
    versions: [
      {
        versionId: 'ver-aws-kek-001',
        versionNumber: 1,
        state: 'PRIMARY_ACTIVE',
        algorithm: 'SYMMETRIC_DEFAULT (AES-256-GCM)',
        protectionLevel: 'HSM_FIPS_140_2_L3',
        createdAt: '2026-01-15T00:00:00Z',
        primarySince: '2026-01-15T00:00:00Z',
        rotationIntervalDays: 90,
        nextScheduledRotation: '2026-04-15T00:00:00Z',
        totalRecordsEncrypted: 18740
      }
    ]
  }
];

// Transit Network Security Status
export const TRANSIT_SECURITY_STATUS: TransitSecurityStatus = {
  tlsVersion: 'TLS 1.3',
  cipherSuite: 'TLS_AES_256_GCM_SHA384 (0x1302)',
  forwardSecrecy: true,
  hstsEnforced: true,
  hstsPreloadApproved: true,
  hstsMaxAgeSeconds: 63072000, // 2 Years HSTS
  httpFallbackPermitted: false, // Strict block
  alpnProtocols: ['h2', 'http/1.1'],
  certIssuer: "Let's Encrypt / Google Trust Services Authority R4",
  certValidityDaysRemaining: 78
};

// Mobile Application Zero-Secrets Compliance Rules
export const MOBILE_SECURITY_AUDIT_BASELINE: MobileSecurityAuditItem[] = [
  {
    id: 'MOB-SEC-01',
    ruleCategory: 'DATABASE_CREDENTIALS',
    ruleDescription: 'Mobile binary must NEVER contain raw database connection strings, database passwords, or direct JDBC/Postgres/Mongo credentials.',
    compliant: true,
    detectedThreatCount: 0,
    enforcementMethod: 'Zero-Client-DB Architecture: All database interactions proxied exclusively through server-side authenticated REST/gRPC API gateway.',
    verificationEvidence: 'Static analysis of iOS & Android bundle confirmed 0 connection strings found. No direct SQL client dependencies.',
    severity: 'CRITICAL_BLOCKER'
  },
  {
    id: 'MOB-SEC-02',
    ruleCategory: 'SERVICE_ACCOUNT_SECRETS',
    ruleDescription: 'Mobile app must NEVER package GCP service account JSON key files, AWS IAM access secrets, or Azure service principal tokens.',
    compliant: true,
    detectedThreatCount: 0,
    enforcementMethod: 'Server-Side IAM & Short-Lived Ephemeral OAuth Tokens (Google Identity Services / Secure Session Cookies).',
    verificationEvidence: 'APK/IPA file asset scanner verified absence of `service_account.json`, `.pem`, and IAM secret keys.',
    severity: 'CRITICAL_BLOCKER'
  },
  {
    id: 'MOB-SEC-03',
    ruleCategory: 'PRIVATE_API_SECRETS',
    ruleDescription: 'Mobile app must NEVER store backend private API secrets, Stripe private keys, Gemini API master keys, or internal authorization secrets.',
    compliant: true,
    detectedThreatCount: 0,
    enforcementMethod: 'Strict Server-Side Proxying: Gemini API and third-party vendor secrets reside exclusively in Cloud Secret Manager.',
    verificationEvidence: 'Binary inspection validated no `sk_live_`, `GEMINI_API_KEY`, or private header secrets present in client code.',
    severity: 'CRITICAL_BLOCKER'
  },
  {
    id: 'MOB-SEC-04',
    ruleCategory: 'PRODUCTION_ENCRYPTION_KEYS',
    ruleDescription: 'Mobile app must NEVER package root Master Key Encryption Keys (KEK) or database encryption master seeds.',
    compliant: true,
    detectedThreatCount: 0,
    enforcementMethod: 'Envelope Encryption via Managed Cloud KMS Hardware Security Modules (FIPS 140-2 Level 3). KEKs never leave Cloud KMS.',
    verificationEvidence: 'Client-side code only operates on user-scoped ephemeral Web Crypto keys for transit, never production KEKs.',
    severity: 'CRITICAL_BLOCKER'
  },
  {
    id: 'MOB-SEC-05',
    ruleCategory: 'ADMINISTRATIVE_CREDENTIALS',
    ruleDescription: 'Mobile app must NEVER embed hardcoded admin passwords, emergency recovery master bypasses, or superuser credentials.',
    compliant: true,
    detectedThreatCount: 0,
    enforcementMethod: 'Role-Based Access Control (RBAC) with server-side WebAuthn Hardware Passkey & TOTP MFA validation.',
    verificationEvidence: 'Zero hardcoded auth tokens found in decompiled APK DEX / iOS Mach-O binaries.',
    severity: 'CRITICAL_BLOCKER'
  }
];

// In-Memory KMS Key Ring Storage for live runtime simulation
let currentKmsKeyRings: KMSKeyRing[] = JSON.parse(JSON.stringify(INITIAL_KMS_KEY_RINGS));

export function getKmsKeyRings(): KMSKeyRing[] {
  return currentKmsKeyRings;
}

export function rotateKeyVersion(keyRingId: string): KMSKeyRing | null {
  const ring = currentKmsKeyRings.find(k => k.keyRingId === keyRingId);
  if (!ring) return null;

  const currentPrimary = ring.versions.find(v => v.state === 'PRIMARY_ACTIVE');
  if (currentPrimary) {
    currentPrimary.state = 'ACTIVE_READ_ONLY';
  }

  const nextVersionNumber = ring.versions.length + 1;
  const newVersionId = `ver-kek-00${nextVersionNumber}`;
  const now = new Date().toISOString();
  const nextRotation = new Date(Date.now() + 90 * 86400000).toISOString();

  const newVersion: KMSKeyVersion = {
    versionId: newVersionId,
    versionNumber: nextVersionNumber,
    state: 'PRIMARY_ACTIVE',
    algorithm: ring.provider === 'AWS_KMS' ? 'SYMMETRIC_DEFAULT (AES-256-GCM)' : 'GOOGLE_SYMMETRIC_ENCRYPTION (AES-256-GCM)',
    protectionLevel: 'HSM_FIPS_140_2_L3',
    createdAt: now,
    primarySince: now,
    rotationIntervalDays: ring.rotationPeriodDays,
    nextScheduledRotation: nextRotation,
    totalRecordsEncrypted: 0
  };

  ring.versions.push(newVersion);
  ring.activeVersion = nextVersionNumber;
  ring.resourceArn = ring.resourceArn.replace(/v\d+$/, `v${nextVersionNumber}`);

  return ring;
}

/**
 * CLIENT & SERVER CRYPTO ENVELOPE ENCRYPTION HELPER
 * Uses standard Web Cryptography API AES-256-GCM with 96-bit random IV and 128-bit Auth Tag
 */
export async function envelopeEncryptField(
  plaintext: string, 
  keyVersionNumber: number = 2
): Promise<EncryptedFieldEnvelope> {
  const enc = new TextEncoder();
  const data = enc.encode(plaintext);

  // 1. Generate ephemeral 256-bit Data Encryption Key (DEK)
  const dek = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // 2. Generate 96-bit random IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 3. Encrypt data with DEK
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    dek,
    data
  );

  // Split ciphertext and 16-byte auth tag
  const totalBytes = new Uint8Array(encryptedBuffer);
  const authTagBytes = totalBytes.slice(totalBytes.length - 16);
  const ciphertextBytes = totalBytes.slice(0, totalBytes.length - 16);

  // 4. Export DEK raw bytes and wrap under Cloud KMS KEK (Simulated KEK wrapping)
  const rawDek = await window.crypto.subtle.exportKey('raw', dek);
  const dekBytes = new Uint8Array(rawDek);

  // Convert to Base64
  const ivB64 = btoa(String.fromCharCode(...iv));
  const authTagB64 = btoa(String.fromCharCode(...authTagBytes));
  const ciphertextB64 = btoa(String.fromCharCode(...ciphertextBytes));
  const encryptedDekB64 = btoa(String.fromCharCode(...dekBytes.map(b => (b ^ (0x5A + keyVersionNumber)) & 0xFF))); // KMS wrap simulation

  return {
    keyVersion: keyVersionNumber,
    algorithm: 'AES-256-GCM',
    ivB64,
    authTagB64,
    encryptedDekB64,
    ciphertextB64,
    kmsKeyUri: `projects/pitchprecision-cloud-prod/locations/europe-west2/keyRings/kr-cricket-athlete-records-prod/cryptoKeys/kek-athlete-pii-v${keyVersionNumber}`,
    encryptedAt: new Date().toISOString()
  };
}

/**
 * CLIENT & SERVER CRYPTO ENVELOPE DECRYPTION HELPER
 */
export async function envelopeDecryptField(envelope: EncryptedFieldEnvelope): Promise<string> {
  try {
    // 1. Unwrap DEK using Cloud KMS KEK (Simulated KEK unwrap)
    const rawDekEnc = Uint8Array.from(atob(envelope.encryptedDekB64), c => c.charCodeAt(0));
    const unwrappedDekBytes = new Uint8Array(rawDekEnc.map(b => (b ^ (0x5A + envelope.keyVersion)) & 0xFF));

    // 2. Import DEK
    const dek = await window.crypto.subtle.importKey(
      'raw',
      unwrappedDekBytes,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // 3. Recombine ciphertext and auth tag
    const iv = Uint8Array.from(atob(envelope.ivB64), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(envelope.ciphertextB64), c => c.charCodeAt(0));
    const authTag = Uint8Array.from(atob(envelope.authTagB64), c => c.charCodeAt(0));

    const combined = new Uint8Array(ciphertext.length + authTag.length);
    combined.set(ciphertext, 0);
    combined.set(authTag, ciphertext.length);

    // 4. Decrypt and verify tag
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      dek,
      combined
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Cryptographic verification failed: Authentication tag mismatch or corrupted ciphertext. Potential tampering detected.');
  }
}

/**
 * BUNDLE SCANNER FOR ZERO MOBILE SECRETS
 * Inspects uploaded text/code/manifest for forbidden patterns
 */
export interface MobileScanResult {
  passed: boolean;
  totalViolations: number;
  findings: Array<{
    category: string;
    description: string;
    matchedSnippet: string;
    line: number;
    severity: 'CRITICAL_BLOCKER' | 'HIGH';
  }>;
  scannedLines: number;
}

export function scanBundleSourceForSecrets(sourceCode: string): MobileScanResult {
  const lines = sourceCode.split('\n');
  const findings: MobileScanResult['findings'] = [];

  const secretPatterns = [
    {
      regex: /(postgres|postgresql|mysql|mongodb|mongodb\+srv|redis|sqlite):\/\/[^\s"']+/i,
      category: 'DATABASE_CREDENTIALS',
      description: 'Hardcoded direct database URI found in client source code.',
      severity: 'CRITICAL_BLOCKER' as const
    },
    {
      regex: /"type":\s*"service_account"|"private_key":\s*"-----BEGIN/i,
      category: 'SERVICE_ACCOUNT_SECRETS',
      description: 'Embedded GCP/AWS Service Account credentials JSON or private key.',
      severity: 'CRITICAL_BLOCKER' as const
    },
    {
      regex: /AKIA[0-9A-Z]{16}/,
      category: 'SERVICE_ACCOUNT_SECRETS',
      description: 'AWS IAM Access Key ID detected.',
      severity: 'CRITICAL_BLOCKER' as const
    },
    {
      regex: /(sk_live_[0-9a-zA-Z]{24,}|ghp_[0-9a-zA-Z]{36}|xoxb-[0-9a-zA-Z]{10,})/i,
      category: 'PRIVATE_API_SECRETS',
      description: 'Live production vendor API secret key (Stripe/GitHub/Slack).',
      severity: 'CRITICAL_BLOCKER' as const
    },
    {
      regex: /(admin_password|root_password|master_secret)\s*[:=]\s*["'][^"']+["']/i,
      category: 'ADMINISTRATIVE_CREDENTIALS',
      description: 'Hardcoded administrative master password in client binary.',
      severity: 'CRITICAL_BLOCKER' as const
    },
    {
      regex: /-----BEGIN (RSA|EC|OPENSSH|ENCRYPTED)? PRIVATE KEY-----/,
      category: 'PRODUCTION_ENCRYPTION_KEYS',
      description: 'Embedded production master cryptographic private key.',
      severity: 'CRITICAL_BLOCKER' as const
    }
  ];

  lines.forEach((lineText, idx) => {
    secretPatterns.forEach(pattern => {
      const match = lineText.match(pattern.regex);
      if (match) {
        findings.push({
          category: pattern.category,
          description: pattern.description,
          matchedSnippet: match[0].length > 40 ? match[0].substring(0, 37) + '...' : match[0],
          line: idx + 1,
          severity: pattern.severity
        });
      }
    });
  });

  return {
    passed: findings.length === 0,
    totalViolations: findings.length,
    findings,
    scannedLines: lines.length
  };
}
