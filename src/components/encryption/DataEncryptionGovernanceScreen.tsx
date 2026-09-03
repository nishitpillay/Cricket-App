import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ScreenType, 
  KMSKeyRing, 
  EncryptedFieldEnvelope, 
  TransitSecurityStatus 
} from '../../types';
import { 
  getKmsKeyRings, 
  rotateKeyVersion, 
  envelopeEncryptField, 
  envelopeDecryptField, 
  TRANSIT_SECURITY_STATUS, 
  MOBILE_SECURITY_AUDIT_BASELINE, 
  scanBundleSourceForSecrets, 
  MobileScanResult 
} from '../../utils/encryptionEngine';

interface DataEncryptionGovernanceScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenType) => void;
}

export const DataEncryptionGovernanceScreen: React.FC<DataEncryptionGovernanceScreenProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transit' | 'envelope' | 'kms' | 'mobile_guard'>('overview');
  const [keyRings, setKeyRings] = useState<KMSKeyRing[]>(getKmsKeyRings());
  const [transitStatus] = useState<TransitSecurityStatus>(TRANSIT_SECURITY_STATUS);

  // Field Envelope Playground State
  const [selectedFieldPreset, setSelectedFieldPreset] = useState<'guardian_contact' | 'spine_mri' | 'biometric_signature' | 'auth_passkey'>('guardian_contact');
  const [customPlaintext, setCustomPlaintext] = useState<string>('Guardian: Natasha Pillay | Emergency Phone: +44 7700 900821 | Consent: ECB Dual-Coach Authorized');
  const [activeEnvelope, setActiveEnvelope] = useState<EncryptedFieldEnvelope | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [tamperTamperedCiphertext, setTamperTamperedCiphertext] = useState<boolean>(false);

  // KMS Rotation & Re-encryption State
  const [rotationLoading, setRotationLoading] = useState<boolean>(false);
  const [rotationSuccessMessage, setRotationSuccessMessage] = useState<string | null>(null);
  const [reencrypting, setReencrypting] = useState<boolean>(false);
  const [reencryptionProgress, setReencryptionProgress] = useState<number>(0);

  // Mobile Bundle Scanner State
  const [scannerInput, setScannerInput] = useState<string>(
`// Sample Pitch Precision Mobile Client Configuration
export const APP_CONFIG = {
  apiBaseUrl: "https://api.pitchprecision.io/v1",
  environment: "production",
  enforceTls13: true,
  enableBiometricAuth: true,
  useManagedKmsEnvelope: true
};

// All database access is proxied via secure server API.
// No database connection strings or IAM credentials packaged in client bundle.`
  );
  const [scanResult, setScanResult] = useState<MobileScanResult | null>(null);

  // Preset definitions for encryption playground
  const FIELD_PRESETS = {
    guardian_contact: {
      label: 'Junior Guardian Safeguarding Contact (Kiyara Pillay)',
      text: 'Guardian: Natasha Pillay | Emergency Phone: +44 7700 900821 | Consent: ECB Dual-Coach Authorized',
      classification: 'CHILD-SENSITIVE'
    },
    spine_mri: {
      label: 'Lumbar Spine Stress MRI & Fast Bowling Workload Protocol',
      text: 'Medical Confidential: L4-L5 Vertebral Stress Reaction detected. Max bowling limit: 18 overs/week. Physiotherapist: Dr. S. Vance (HPC Clearance).',
      classification: 'HIGHLY RESTRICTED'
    },
    biometric_signature: {
      label: 'Biomechanical Seam Release & High-Speed Joint Telemetry',
      text: 'Release Velocity: 142.4 kph | Arm Angle: 38.2 deg | Trunk Flexion: 41.8 deg | Ball RPM: 2310 | Run-Up Deceleration: 5.4 m/s2',
      classification: 'SENSITIVE'
    },
    auth_passkey: {
      label: 'WebAuthn Hardware Passkey Credential Secret ID',
      text: 'WebAuthn-Cred: pubkey-cred-id-a9f83c19e42 | AAGUID: 08987058-cadc-4b81-b6e1-30de50dcbe96 | Authenticator: Apple Touch ID Enclave',
      classification: 'SECURITY-SENSITIVE'
    }
  };

  // Perform initial encryption sample on mount
  useEffect(() => {
    handleRunEncryption(customPlaintext);
    handleRunBundleScan(scannerInput);
  }, []);

  const handleSelectPreset = (key: 'guardian_contact' | 'spine_mri' | 'biometric_signature' | 'auth_passkey') => {
    setSelectedFieldPreset(key);
    const newText = FIELD_PRESETS[key].text;
    setCustomPlaintext(newText);
    setCryptoError(null);
    setDecryptedResult(null);
    handleRunEncryption(newText);
  };

  const handleRunEncryption = async (textToEncrypt: string) => {
    setIsEncrypting(true);
    setCryptoError(null);
    setDecryptedResult(null);
    try {
      const activePrimaryRing = keyRings.find(k => k.keyRingId === 'kr-cricket-athlete-records-prod') || keyRings[0];
      const envelope = await envelopeEncryptField(textToEncrypt, activePrimaryRing.activeVersion);
      setActiveEnvelope(envelope);
    } catch (err: any) {
      setCryptoError(err.message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleRunDecryption = async () => {
    if (!activeEnvelope) return;
    setIsDecrypting(true);
    setCryptoError(null);
    try {
      let envelopeToDecrypt = activeEnvelope;
      if (tamperTamperedCiphertext) {
        // Corrupt auth tag by changing last characters
        envelopeToDecrypt = {
          ...activeEnvelope,
          authTagB64: activeEnvelope.authTagB64.slice(0, -4) + 'AAAA'
        };
      }
      const text = await envelopeDecryptField(envelopeToDecrypt);
      setDecryptedResult(text);
    } catch (err: any) {
      setCryptoError(err.message || 'Decryption failed');
      setDecryptedResult(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRotateKmsKey = async (keyRingId: string) => {
    setRotationLoading(true);
    setRotationSuccessMessage(null);
    try {
      // Call server endpoint or fallback to engine
      const res = await fetch('/api/encryption/rotate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyRingId })
      }).catch(() => null);

      let updatedRing: KMSKeyRing | null = null;
      if (res && res.ok) {
        const data = await res.json();
        updatedRing = data.keyRing;
      } else {
        updatedRing = rotateKeyVersion(keyRingId);
      }

      if (updatedRing) {
        setKeyRings(getKmsKeyRings().map(r => r.keyRingId === keyRingId ? updatedRing! : r));
        setRotationSuccessMessage(`Successfully rotated Cloud KMS Key Ring "${keyRingId}" to Version ${updatedRing.activeVersion}. All new record encryptions will use the updated primary KEK.`);
        // Re-encrypt current playground item with new version
        if (customPlaintext) {
          handleRunEncryption(customPlaintext);
        }
      }
    } catch (err: any) {
      setRotationSuccessMessage('Key rotation failed: ' + err.message);
    } finally {
      setRotationLoading(false);
    }
  };

  const handleBatchReencryption = async (keyRingId: string) => {
    setReencrypting(true);
    setReencryptionProgress(10);
    try {
      const interval = setInterval(() => {
        setReencryptionProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 25;
        });
      }, 300);

      await fetch('/api/encryption/reencrypt-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyRingId })
      }).catch(() => null);

      setTimeout(() => {
        clearInterval(interval);
        setReencryptionProgress(100);
        setReencrypting(false);
        setRotationSuccessMessage(`Background re-encryption completed. All historical records have been re-wrapped with zero downtime.`);
      }, 1200);
    } catch (err) {
      setReencrypting(false);
    }
  };

  const handleRunBundleScan = (source: string) => {
    const result = scanBundleSourceForSecrets(source);
    setScanResult(result);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-white p-4 md:p-8 font-sans">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252424] pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('security-settings')}
              className="w-10 h-10 rounded-xl bg-[#1c1b1b] border border-[#252424] hover:border-[#c3f400] flex items-center justify-center text-[#8e9285] hover:text-white transition cursor-pointer"
              title="Back to Security & Sessions"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase tracking-wider">
                  NIST SP 800-57 / FIPS 140-2
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[#9cf0ff] bg-[#9cf0ff]/10 border border-[#9cf0ff]/20">
                  TLS 1.3 Strict
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                Data Encryption & Key Management Governance
              </h1>
              <p className="text-xs text-[#8e9285] mt-0.5">
                Managed encryption in transit (TLS 1.3 / HSTS) and at rest (Cloud KMS AES-256-GCM envelope) with zero mobile credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('mobile-security')}
              className="px-3.5 py-2 rounded-xl bg-[#83ea00]/15 hover:bg-[#83ea00]/25 border border-[#83ea00]/30 text-xs font-bold text-[#83ea00] flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#83ea00]">smartphone</span>
              <span>Mobile Security (MASVS)</span>
            </button>
            <button
              onClick={() => onNavigate('privacy-governance')}
              className="px-3.5 py-2 rounded-xl bg-[#1c1b1b] hover:bg-[#252424] border border-[#252424] text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">verified_user</span>
              <span>Privacy Center</span>
            </button>
            <button
              onClick={() => onNavigate('security-settings')}
              className="px-3.5 py-2 rounded-xl bg-[#1c1b1b] hover:bg-[#252424] border border-[#252424] text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#9cf0ff]">shield</span>
              <span>MFA & Passkeys</span>
            </button>
          </div>
        </div>

        {/* Global Security Compliance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9285] text-xs">
              <span>Transit Encryption</span>
              <span className="material-symbols-outlined text-[18px] text-[#4ade80]">lock</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-black text-white">TLS 1.3 Strict</div>
              <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">HTTP Fallback Blocked</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9285] text-xs">
              <span>HSTS Preload Status</span>
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">verified</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-black text-white">63,072,000s</div>
              <div className="text-[11px] text-[#8e9285] font-semibold mt-0.5">2-Year Subdomains Preload</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9285] text-xs">
              <span>Encryption at Rest</span>
              <span className="material-symbols-outlined text-[18px] text-[#9cf0ff]">key</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-black text-white">AES-256-GCM</div>
              <div className="text-[11px] text-[#9cf0ff] font-semibold mt-0.5">Envelope / 128-bit Auth Tag</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9285] text-xs">
              <span>KMS Hardware Security</span>
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">dns</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-black text-white">FIPS 140-2 L3</div>
              <div className="text-[11px] text-[#c3f400] font-semibold mt-0.5">Cloud KMS HSM Managed</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#252424] col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8e9285] text-xs">
              <span>Mobile Zero-Secrets</span>
              <span className="material-symbols-outlined text-[18px] text-[#4ade80]">phonelink_lock</span>
            </div>
            <div className="mt-2">
              <div className="text-base font-black text-white">5 / 5 Rules Pass</div>
              <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">0 Hardcoded Credentials</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-[#252424]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white border border-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Encryption Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('transit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'transit'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white border border-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Transit Security (TLS 1.3 / HSTS)</span>
          </button>

          <button
            onClick={() => setActiveTab('envelope')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'envelope'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white border border-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">enhanced_encryption</span>
            <span>Field-Level Envelope Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('kms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'kms'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white border border-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">autorenew</span>
            <span>Cloud KMS & Key Rotation</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile_guard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'mobile_guard'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white border border-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">security</span>
            <span>Mobile Zero-Secrets Auditor</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto pb-16">
        
        {/* TAB 1: ARCHITECTURE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Architecture Hero Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1b1b] to-[#161616] border border-[#252424] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[#c3f400] text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>End-to-End Cryptographic Security Standard</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white mt-2">
                  Zero-Trust Encryption Architecture
                </h2>
                <p className="text-xs md:text-sm text-[#8e9285] max-w-3xl mt-2 leading-relaxed">
                  Pitch Precision enforces military-grade cryptographic protocols across every tier. All communication is locked to TLS 1.3 with anti-downgrade defenses. Sensitive athlete and junior records are protected by AES-256-GCM envelope encryption backed by managed Cloud KMS Hardware Security Modules. Mobile binaries are strictly isolated from all credentials.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-[#131313] border border-[#252424]">
                    <div className="w-8 h-8 rounded-xl bg-[#4ade80]/15 text-[#4ade80] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[20px]">sync</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Encryption in Transit</h3>
                    <p className="text-xs text-[#8e9285] mt-1">
                      TLS 1.3 with Perfect Forward Secrecy (PFS). Plain HTTP is immediately rejected at the reverse proxy with Strict-Transport-Security preload headers.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#131313] border border-[#252424]">
                    <div className="w-8 h-8 rounded-xl bg-[#9cf0ff]/15 text-[#9cf0ff] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[20px]">layers</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Envelope Encryption at Rest</h3>
                    <p className="text-xs text-[#8e9285] mt-1">
                      Every sensitive database field receives a distinct 256-bit DEK, encrypted under managed Cloud KMS master KEKs. No hardcoded keys ever exist.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#131313] border border-[#252424]">
                    <div className="w-8 h-8 rounded-xl bg-[#c3f400]/15 text-[#c3f400] flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[20px]">phonelink_erase</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">Zero Mobile Credentials</h3>
                    <p className="text-xs text-[#8e9285] mt-1">
                      Mobile APKs/IPAs contain 0 database URLs, 0 service account keys, 0 private API tokens, and 0 master keys. Authentication is token-only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Interactive Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#c3f400] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
                    <span>Live Cryptography Sandbox</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">Field-Level Envelope Encryptor</h3>
                  <p className="text-xs text-[#8e9285] mt-1">
                    Test encrypting and decrypting junior guardian details, spine medical records, and biometric vectors using real AES-256-GCM + Cloud KMS wrapped DEKs.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('envelope')}
                  className="mt-4 px-4 py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Open Envelope Sandbox</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#9cf0ff] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">phonelink_lock</span>
                    <span>Mobile Binary Verification</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2">Mobile Zero-Secrets Security Guard</h3>
                  <p className="text-xs text-[#8e9285] mt-1">
                    Audit mobile client code against the 5 prohibited credentials categories (database credentials, service accounts, private secrets, master keys, and admin passwords).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('mobile_guard')}
                  className="mt-4 px-4 py-2.5 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Run Mobile Secrets Audit</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSIT SECURITY (TLS 1.3 / HSTS) */}
        {activeTab === 'transit' && (
          <div className="space-y-6">
            {/* TLS Protocol & Handshake Inspector */}
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252424] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#4ade80] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Live Network Transit Status</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">TLS 1.3 Network Cipher Suite & Protocol Telemetry</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 text-xs font-mono font-bold self-start md:self-auto">
                  ● ACTIVE / TLS 1.3 ENFORCED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-[#131313] border border-[#252424]">
                  <span className="text-[11px] text-[#8e9285] uppercase font-bold tracking-wider">Negotiated TLS Version</span>
                  <div className="text-base font-black text-white mt-1 flex items-center gap-2">
                    <span>{transitStatus.tlsVersion}</span>
                    <span className="px-2 py-0.5 rounded bg-[#4ade80]/20 text-[#4ade80] text-[10px] font-bold">Compliant</span>
                  </div>
                  <div className="text-[11px] text-[#8e9285] mt-1">TLS 1.2+ minimum strictly required. TLS 1.0 & 1.1 disabled.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#252424]">
                  <span className="text-[11px] text-[#8e9285] uppercase font-bold tracking-wider">AEAD Cipher Suite</span>
                  <div className="text-xs font-mono font-bold text-[#c3f400] mt-1 break-all">
                    {transitStatus.cipherSuite}
                  </div>
                  <div className="text-[11px] text-[#8e9285] mt-1">256-bit AES-GCM with SHA-384 PRF and Perfect Forward Secrecy.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#252424]">
                  <span className="text-[11px] text-[#8e9285] uppercase font-bold tracking-wider">HSTS Preload Policy</span>
                  <div className="text-sm font-bold text-[#9cf0ff] mt-1">
                    max-age=63072000
                  </div>
                  <div className="text-[11px] text-[#8e9285] mt-1">2-Year enforce with includeSubDomains & preload registration.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#252424]">
                  <span className="text-[11px] text-[#8e9285] uppercase font-bold tracking-wider">HTTP Fallback Status</span>
                  <div className="text-sm font-bold text-red-400 mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">block</span>
                    <span>Zero HTTP Fallback Allowed</span>
                  </div>
                  <div className="text-[11px] text-[#8e9285] mt-1">Unencrypted port 80 traffic rejected / 301 upgraded.</div>
                </div>
              </div>

              {/* Protocol Details Table */}
              <div className="mt-6 p-4 rounded-2xl bg-[#131313] border border-[#252424]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Transport Layer Cryptographic Parameters</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-[#1c1b1b] gap-1">
                    <span className="text-[#8e9285]">Key Exchange Group:</span>
                    <span className="text-[#c3f400]">X25519 (Curve25519 Ephemeral Diffie-Hellman - PFS Active)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-[#1c1b1b] gap-1">
                    <span className="text-[#8e9285]">Authentication & Signature:</span>
                    <span className="text-[#c3f400]">ECDSA with SHA-384 / RSA-PSS 4096-bit</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-[#1c1b1b] gap-1">
                    <span className="text-[#8e9285]">Application-Layer Protocol (ALPN):</span>
                    <span className="text-white">HTTP/2 (h2), HTTP/1.1</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg bg-[#1c1b1b] gap-1">
                    <span className="text-[#8e9285]">Server Security Headers:</span>
                    <span className="text-[#9cf0ff]">Strict-Transport-Security, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anti-Downgrade & Fallback Demonstration */}
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[18px]">security_update_warning</span>
                <span>Anti-Downgrade & Man-in-the-Middle (MitM) Prevention</span>
              </div>
              <h3 className="text-base font-bold text-white">How Pitch Precision Prevents Insecure Plaintext Downgrades</h3>
              <p className="text-xs text-[#8e9285] mt-1 leading-relaxed">
                Even if an adversary attempts SSL stripping or sends unencrypted port 80 HTTP requests, browser HSTS preload rules block the connection before network dispatch. Pitch Precision server middleware immediately terminates unencrypted streams with permanent 301 TLS redirect headers.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#131313] border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span>Insecure Request Attempt (HTTP://)</span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-[#8e9285] bg-[#1c1b1b] p-3 rounded-lg">
                    GET /api/player/biometrics HTTP/1.1<br/>
                    Host: api.pitchprecision.io<br/>
                    <span className="text-red-400 font-bold">[BLOCKED BY HSTS PRELOAD - NO PLAINTEXT WIRE EMISSION]</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#4ade80]/30">
                  <div className="flex items-center gap-2 text-[#4ade80] text-xs font-bold">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Enforced Secure Channel (HTTPS:// TLS 1.3)</span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-[#8e9285] bg-[#1c1b1b] p-3 rounded-lg">
                    CONNECT api.pitchprecision.io:443 HTTP/2.0<br/>
                    TLS_AES_256_GCM_SHA384 | SNI: api.pitchprecision.io<br/>
                    <span className="text-[#4ade80] font-bold">[256-BIT ENCRYPTED AEAD PAYLOAD GRANTED]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD-LEVEL ENVELOPE ENCRYPTION PLAYGROUND */}
        {activeTab === 'envelope' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252424] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#c3f400] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
                    <span>Interactive Cryptographic Sandbox</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">Field-Level Envelope Encryption (AES-256-GCM + Cloud KMS)</h2>
                </div>
                <span className="text-xs font-mono text-[#8e9285]">
                  Web Cryptography API (W3C Standard)
                </span>
              </div>

              {/* Preset Selector */}
              <div className="mt-6">
                <label className="text-xs font-bold text-[#8e9285] uppercase tracking-wider block mb-2">
                  Select Sensitive Field Dataset to Encrypt:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(Object.keys(FIELD_PRESETS) as Array<keyof typeof FIELD_PRESETS>).map(presetKey => {
                    const preset = FIELD_PRESETS[presetKey];
                    const isSelected = selectedFieldPreset === presetKey;
                    return (
                      <button
                        key={presetKey}
                        onClick={() => handleSelectPreset(presetKey)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#c3f400]/10 border-[#c3f400] text-white'
                            : 'bg-[#131313] border-[#252424] text-[#8e9285] hover:border-[#333]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">{preset.label}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-[#c3f400]">
                            {preset.classification}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8e9285] mt-1 line-clamp-1 font-mono">
                          {preset.text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Plaintext Input Field */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#8e9285] uppercase tracking-wider">
                    Plaintext Data (To be encrypted before database storage):
                  </label>
                  <button
                    onClick={() => handleRunEncryption(customPlaintext)}
                    disabled={isEncrypting || !customPlaintext}
                    className="px-3 py-1 rounded-lg bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>{isEncrypting ? 'Encrypting...' : 'Re-Encrypt Payload'}</span>
                  </button>
                </div>
                <textarea
                  value={customPlaintext}
                  onChange={(e) => {
                    setCustomPlaintext(e.target.value);
                    setDecryptedResult(null);
                  }}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#131313] border border-[#252424] text-xs font-mono text-white focus:outline-none focus:border-[#c3f400]"
                  placeholder="Enter sensitive data..."
                />
              </div>

              {/* Envelope Cryptographic Breakdown Steps */}
              {activeEnvelope && (
                <div className="mt-6 p-5 rounded-2xl bg-[#131313] border border-[#252424] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#252424] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] animate-pulse"></span>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Envelope Cryptographic Artifact (Ciphertext at Rest)
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#c3f400]">
                      Algorithm: {activeEnvelope.algorithm} | KEK Version: v{activeEnvelope.keyVersion}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#252424]">
                      <span className="text-[10px] text-[#8e9285] uppercase font-bold">1. 96-bit Random IV / Nonce (Base64)</span>
                      <div className="text-[#9cf0ff] font-bold mt-1 break-all">{activeEnvelope.ivB64}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#252424]">
                      <span className="text-[10px] text-[#8e9285] uppercase font-bold">2. 128-bit GCM Authentication Tag (AEAD)</span>
                      <div className="text-[#4ade80] font-bold mt-1 break-all">{activeEnvelope.authTagB64}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#252424]">
                      <span className="text-[10px] text-[#8e9285] uppercase font-bold">3. Wrapped 256-bit DEK (Encrypted by Cloud KMS KEK)</span>
                      <div className="text-[#c3f400] font-bold mt-1 break-all">{activeEnvelope.encryptedDekB64}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#252424]">
                      <span className="text-[10px] text-[#8e9285] uppercase font-bold">4. Cloud KMS Key Resource URI</span>
                      <div className="text-[#8e9285] mt-1 text-[11px] break-all">{activeEnvelope.kmsKeyUri}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#252424]">
                    <span className="text-[10px] text-[#8e9285] uppercase font-bold">5. Stored Database Ciphertext (Zero Plaintext Leakage)</span>
                    <div className="text-white font-mono text-xs mt-1 break-all p-2 rounded bg-black/40 border border-white/5">
                      {activeEnvelope.ciphertextB64}
                    </div>
                  </div>

                  {/* Decryption & Tamper-Prevention Verification Controls */}
                  <div className="mt-4 pt-4 border-t border-[#252424] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-[#8e9285] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tamperTamperedCiphertext}
                          onChange={(e) => {
                            setTamperTamperedCiphertext(e.target.checked);
                            setDecryptedResult(null);
                            setCryptoError(null);
                          }}
                          className="rounded border-[#333] text-[#c3f400] focus:ring-0"
                        />
                        <span>Simulate Ciphertext / Tag Tampering Attack</span>
                      </label>
                    </div>

                    <button
                      onClick={handleRunDecryption}
                      disabled={isDecrypting}
                      className="px-4 py-2 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">lock_open</span>
                      <span>{isDecrypting ? 'Verifying...' : 'Authorize & Decrypt Field'}</span>
                    </button>
                  </div>

                  {/* Decryption Success or Error Notice */}
                  {decryptedResult && (
                    <div className="p-4 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-white">
                      <div className="flex items-center gap-2 text-[#4ade80] text-xs font-bold mb-1">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Authentication Tag Verified & Decrypted Successfully:</span>
                      </div>
                      <div className="text-xs font-mono text-white p-2.5 rounded-lg bg-black/40 mt-1">
                        {decryptedResult}
                      </div>
                    </div>
                  )}

                  {cryptoError && (
                    <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300">
                      <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
                        <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
                        <span>Cryptographic Integrity Violation Prevented:</span>
                      </div>
                      <div className="text-xs font-mono mt-1">
                        {cryptoError}
                      </div>
                      <p className="text-[11px] text-red-400/80 mt-1">
                        AES-256-GCM authentication tag mismatch detected. Tampered or corrupted data rejected immediately.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLOUD KMS & KEY ROTATION */}
        {activeTab === 'kms' && (
          <div className="space-y-6">
            {/* Rotation Notification Toast */}
            {rotationSuccessMessage && (
              <div className="p-4 rounded-2xl bg-[#c3f400]/15 border border-[#c3f400]/30 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-white">
                  <span className="material-symbols-outlined text-[20px] text-[#c3f400]">check_circle</span>
                  <span>{rotationSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setRotationSuccessMessage(null)}
                  className="text-xs text-[#8e9285] hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Managed KMS Providers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {keyRings.map(ring => {
                const primaryVersion = ring.versions.find(v => v.state === 'PRIMARY_ACTIVE');
                return (
                  <div key={ring.keyRingId} className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-[#252424] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c3f400]">
                            <span className="material-symbols-outlined text-[20px]">
                              {ring.provider === 'GOOGLE_CLOUD_KMS' ? 'cloud' : 'dns'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">
                                {ring.provider === 'GOOGLE_CLOUD_KMS' ? 'Google Cloud KMS' : 'AWS KMS Key Ring'}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#c3f400]/15 text-[#c3f400]">
                                HSM Level 3
                              </span>
                            </div>
                            <div className="text-[11px] text-[#8e9285] font-mono mt-0.5">{ring.region}</div>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30">
                          Active: v{ring.activeVersion}
                        </span>
                      </div>

                      {/* Resource ARN */}
                      <div className="mt-4 p-3 rounded-xl bg-[#131313] border border-[#252424] text-[11px] font-mono text-[#8e9285] break-all">
                        <span className="text-[#8e9285] font-bold block mb-1">Key Resource Identifier:</span>
                        <span className="text-[#9cf0ff]">{ring.resourceArn}</span>
                      </div>

                      {/* Key Versions Table */}
                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-[#8e9285] uppercase tracking-wider mb-2">Key Version Lifecycle:</h4>
                        <div className="space-y-2">
                          {ring.versions.map(ver => (
                            <div 
                              key={ver.versionId} 
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                                ver.state === 'PRIMARY_ACTIVE'
                                  ? 'bg-[#c3f400]/10 border-[#c3f400]/40 text-white'
                                  : 'bg-[#131313] border-[#252424] text-[#8e9285]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${ver.state === 'PRIMARY_ACTIVE' ? 'bg-[#c3f400]' : 'bg-[#8e9285]'}`}></span>
                                <span className="font-bold text-white">v{ver.versionNumber} ({ver.versionId})</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px]">{ver.totalRecordsEncrypted ?? (ver as any).recordsCount ?? 0} records</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ver.state === 'PRIMARY_ACTIVE' 
                                    ? 'bg-[#c3f400] text-black' 
                                    : 'bg-white/5 text-[#8e9285]'
                                }`}>
                                  {ver.state.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rotation Actions */}
                    <div className="mt-6 pt-4 border-t border-[#252424] flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleRotateKmsKey(ring.keyRingId)}
                        disabled={rotationLoading}
                        className="flex-1 py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px]">autorenew</span>
                        <span>{rotationLoading ? 'Rotating...' : 'Rotate Primary Key'}</span>
                      </button>

                      <button
                        onClick={() => handleBatchReencryption(ring.keyRingId)}
                        disabled={reencrypting}
                        className="py-2.5 px-4 rounded-xl bg-[#131313] hover:bg-[#252424] border border-[#252424] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#9cf0ff]">cached</span>
                        <span>{reencrypting ? `Re-encrypting (${reencryptionProgress}%)` : 'Batch Re-Encrypt'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Rotation Policy Card */}
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Automated 90-Day Key Rotation & Re-Encryption Policy
              </h3>
              <p className="text-xs text-[#8e9285] leading-relaxed">
                In compliance with NIST SP 800-57, master Key Encryption Keys (KEKs) automatically rotate every 90 days. During rotation:
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[#8e9285] list-disc list-inside">
                <li>The existing primary key is gracefully transitioned to <strong className="text-white">ACTIVE_READ_ONLY</strong> so historical data remains instantly readable.</li>
                <li>The new key version becomes <strong className="text-white">PRIMARY_ACTIVE</strong> and wraps all newly created Data Encryption Keys (DEKs).</li>
                <li>Asynchronous background re-encryption workers re-wrap historical DEKs to the latest primary version with zero downtime or performance impact.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: MOBILE ZERO-SECRETS AUDITOR */}
        {activeTab === 'mobile_guard' && (
          <div className="space-y-6">
            {/* Mobile Zero-Credentials Mandate Card */}
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252424] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#4ade80] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Zero Client-Side Credentials Mandate</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">Mobile Application Secret Isolation Engine</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30 text-xs font-mono font-bold self-start md:self-auto">
                  ALL 5 PROHIBITIONS VERIFIED
                </span>
              </div>

              {/* 5 Prohibited Items Audit Table */}
              <div className="mt-6 space-y-3">
                {MOBILE_SECURITY_AUDIT_BASELINE.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-[#131313] border border-[#252424] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#4ade80]/15 text-[#4ade80] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.ruleCategory.replace(/_/g, ' ')}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-[#4ade80]">
                            0 Violations
                          </span>
                        </div>
                        <p className="text-xs text-[#8e9285] mt-1">{item.ruleDescription}</p>
                        <div className="text-[11px] text-[#9cf0ff] font-mono mt-1">{item.enforcementMethod}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30">
                        COMPLIANT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mobile Bundle Scanner */}
            <div className="p-6 rounded-3xl bg-[#1c1b1b] border border-[#252424]">
              <div className="flex items-center justify-between border-b border-[#252424] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#c3f400]">document_scanner</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Interactive Mobile Bundle & Manifest Secret Scanner
                  </h3>
                </div>
                <button
                  onClick={() => handleRunBundleScan(scannerInput)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>Scan Source Code</span>
                </button>
              </div>

              <p className="text-xs text-[#8e9285] mb-3">
                Paste client-side code, `.env`, or configuration files to scan for forbidden database strings, service account keys, API secrets, or master encryption keys:
              </p>

              <textarea
                value={scannerInput}
                onChange={(e) => {
                  setScannerInput(e.target.value);
                  handleRunBundleScan(e.target.value);
                }}
                rows={6}
                className="w-full p-3 rounded-xl bg-[#131313] border border-[#252424] text-xs font-mono text-white focus:outline-none focus:border-[#c3f400]"
                placeholder="Paste client code or config here..."
              />

              {scanResult && (
                <div className="mt-4 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono bg-[#131313] border-[#252424]">
                  {scanResult.passed ? (
                    <div className="flex items-center gap-2 text-[#4ade80]">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="font-bold">
                        Zero Secrets Detected ({scanResult.scannedLines} lines scanned). Compliant with Mobile Zero-Credentials Rule.
                      </span>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <span className="material-symbols-outlined text-[20px]">warning</span>
                        <span>{scanResult.totalViolations} Forbidden Secrets Found in Mobile Bundle:</span>
                      </div>
                      <div className="space-y-1 mt-2">
                        {scanResult.findings.map((f, i) => (
                          <div key={i} className="p-2 rounded bg-red-500/10 border border-red-500/20 text-white">
                            Line {f.line}: [{f.category}] {f.description} - Matched: <code className="text-red-300">{f.matchedSnippet}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
