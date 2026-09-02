import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Key, 
  FileCheck, 
  Link as LinkIcon, 
  EyeOff, 
  Clipboard, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  Layers, 
  Globe, 
  HardDrive, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Fingerprint
} from 'lucide-react';
import { UserProfile, MASVSCheckItem, MASVSDomain, SecureStorageEntry, DeepLinkValidationResult, DeviceIntegrityCheck, FileUploadScanResult } from '../../types';
import { 
  MASVS_COMPLIANCE_MATRIX, 
  SecureStorageManager, 
  DeepLinkSecurityEngine, 
  DeviceIntegrityEngine, 
  FileUploadSecurityEngine, 
  SensitiveClipboardManager 
} from '../../utils/mobileSecurityEngine';

interface MobileSecurityGovernanceScreenProps {
  currentUser: UserProfile;
  onNavigate: (screen: any) => void;
}

export const MobileSecurityGovernanceScreen: React.FC<MobileSecurityGovernanceScreenProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'storage' | 'screen_clipboard' | 'deeplinks_tamper' | 'device_attestation' | 'network_files'>('matrix');
  const [filterDomain, setFilterDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Storage Vault State
  const [vaultEntries, setVaultEntries] = useState<SecureStorageEntry[]>(SecureStorageManager.getVaultEntries());
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [newPlatform, setNewPlatform] = useState<'iOS_KEYCHAIN' | 'ANDROID_KEYSTORE_ENCRYPTED_SP'>('iOS_KEYCHAIN');
  const [storageFeedback, setStorageFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Insecure Plaintext Test State
  const [plaintextKey, setPlaintextKey] = useState('auth_jwt_bearer_token');
  const [plaintextVal, setPlaintextVal] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [plaintextResult, setPlaintextResult] = useState<{ blocked: boolean; violationReason: string } | null>(null);

  // Screen Protection & Clipboard State
  const [isScreenShieldActive, setIsScreenShieldActive] = useState(true);
  const [isSimulatedRecentsMode, setIsSimulatedRecentsMode] = useState(false);
  const [clipboardTimerSeconds, setClipboardTimerSeconds] = useState<number | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [lastPurgedTime, setLastPurgedTime] = useState<string | null>(null);

  // Deep Link State
  const [deepLinkInput, setDeepLinkInput] = useState('https://pitchprecision.io/drill/d-inswing-01?session=s-883');
  const [deepLinkResult, setDeepLinkResult] = useState<DeepLinkValidationResult>(
    DeepLinkSecurityEngine.validateDeepLink('https://pitchprecision.io/drill/d-inswing-01?session=s-883')
  );

  // Device Integrity State
  const [simulateCompromisedDevice, setSimulateCompromisedDevice] = useState(false);
  const [integrityReport, setIntegrityReport] = useState(DeviceIntegrityEngine.run10PointIntegrityCheck(false));
  const [isScanningIntegrity, setIsScanningIntegrity] = useState(false);

  // File Upload State
  const [fileScanResult, setFileScanResult] = useState<FileUploadScanResult | null>(null);
  const [selectedPresetFile, setSelectedPresetFile] = useState<string>('cricket_inswing_1080p.mp4');

  // Network Pinning State
  const [pinningHost, setPinningHost] = useState('api.pitchprecision.io');
  const [pinningScenario, setPinningScenario] = useState<'LEGITIMATE' | 'ROGUE_PROXY'>('LEGITIMATE');
  const [pinningVerdict, setPinningVerdict] = useState<{ status: 'VALID' | 'INTERCEPTED'; details: string }>({
    status: 'VALID',
    details: 'TLS 1.3 handshake verified. SPKI hash `sha256/WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=` matched pinned root.'
  });

  // Request Signing State
  const [signedPayloadInput, setSignedPayloadInput] = useState('{"athleteId":"usr-alex","biomechanicalVector":{"armSlotDeg":48.2}}');
  const [signatureOutput, setSignatureOutput] = useState<{ nonce: string; timestamp: number; signature: string } | null>(null);

  const handleTestDeepLink = (urlToTest: string) => {
    setDeepLinkInput(urlToTest);
    const res = DeepLinkSecurityEngine.validateDeepLink(urlToTest);
    setDeepLinkResult(res);
  };

  const handleSaveSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newVal.trim()) return;

    const entry = SecureStorageManager.storeSecureSecret(newKey.trim(), newVal.trim(), newPlatform);
    setVaultEntries([...SecureStorageManager.getVaultEntries()]);
    setNewKey('');
    setNewVal('');
    setStorageFeedback({
      type: 'success',
      message: `Successfully encrypted and stored in ${entry.storageTarget} via Hardware Keystore/Secure Enclave.`
    });
    setTimeout(() => setStorageFeedback(null), 4000);
  };

  const handleDeleteSecret = (key: string) => {
    SecureStorageManager.deleteSecret(key);
    setVaultEntries([...SecureStorageManager.getVaultEntries()]);
  };

  const handleTestInsecurePlaintext = () => {
    const res = SecureStorageManager.attemptInsecurePlaintextStore(plaintextKey, plaintextVal);
    setPlaintextResult(res);
  };

  const handleCopySensitiveWithPurge = async (text: string) => {
    setCopiedSuccess(true);
    await SensitiveClipboardManager.copySensitiveText(text, (remainingSec) => {
      setClipboardTimerSeconds(remainingSec);
      if (remainingSec <= 0) {
        setClipboardTimerSeconds(null);
        setLastPurgedTime(new Date().toLocaleTimeString());
      }
    });
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const handlePurgeClipboardNow = () => {
    SensitiveClipboardManager.cancelTimerAndPurgeNow();
    setClipboardTimerSeconds(null);
    setLastPurgedTime(new Date().toLocaleTimeString());
  };

  const handleRunIntegrityScan = () => {
    setIsScanningIntegrity(true);
    setTimeout(() => {
      const res = DeviceIntegrityEngine.run10PointIntegrityCheck(simulateCompromisedDevice);
      setIntegrityReport(res);
      setIsScanningIntegrity(false);
    }, 600);
  };

  const handleToggleSimulatedThreat = () => {
    const nextThreat = !simulateCompromisedDevice;
    setSimulateCompromisedDevice(nextThreat);
    const res = DeviceIntegrityEngine.run10PointIntegrityCheck(nextThreat);
    setIntegrityReport(res);
  };

  const handleInspectPresetFile = (presetName: string) => {
    setSelectedPresetFile(presetName);
    if (presetName === 'cricket_inswing_1080p.mp4') {
      const res = FileUploadSecurityEngine.inspectFile({ name: 'cricket_inswing_1080p.mp4', size: 18450000, type: 'video/mp4' });
      setFileScanResult(res);
    } else if (presetName === 'lumbar_mri_scan.jpg') {
      const res = FileUploadSecurityEngine.inspectFile({ name: 'lumbar_mri_scan.jpg', size: 2400000, type: 'image/jpeg' });
      setFileScanResult(res);
    } else if (presetName === 'malicious_reverse_shell.mp4.exe') {
      const res = FileUploadSecurityEngine.inspectFile({ name: 'malicious_reverse_shell.mp4.exe', size: 48000, type: 'application/x-msdownload' });
      setFileScanResult(res);
    } else if (presetName === 'exploit_xxe_diagram.svg') {
      const res = FileUploadSecurityEngine.inspectFile({ name: 'exploit_xxe_diagram.svg', size: 12000, type: 'image/svg+xml' });
      setFileScanResult(res);
    }
  };

  const handleTestPinning = (scenario: 'LEGITIMATE' | 'ROGUE_PROXY') => {
    setPinningScenario(scenario);
    if (scenario === 'LEGITIMATE') {
      setPinningVerdict({
        status: 'VALID',
        details: 'TLS 1.3 handshake verified. SPKI hash `sha256/WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=` matched pinned root. Zero user-CA fallback.'
      });
    } else {
      setPinningVerdict({
        status: 'INTERCEPTED',
        details: 'BLOCKED MITM ATTACK: Untrusted User-Installed CA certificate (e.g. Burp/Charles Proxy). SubjectPublicKeyInfo mismatch against pinned anchor. Connection aborted.'
      });
    }
  };

  const handleSignRequest = () => {
    const nonce = 'nc_' + Math.random().toString(36).substring(2, 12);
    const ts = Date.now();
    const signature = 'dpop_sig_' + btoa(`SHA256(${signedPayloadInput}+${nonce}+${ts})`).substring(0, 32);
    setSignatureOutput({ nonce, timestamp: ts, signature });
  };

  const filteredMatrix = MASVS_COMPLIANCE_MATRIX.filter(item => {
    const matchesDomain = filterDomain === 'ALL' || item.domain === filterDomain;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.threatTarget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mitigationEngine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pb-24">
      {/* Top Breadcrumb & Return Nav */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#2d2c2c]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-xl bg-[#1c1b1b] hover:bg-[#262525] text-[#8e9285] hover:text-white transition flex items-center justify-center border border-[#2d2c2c]"
              title="Return to Home"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#9cf0ff]/15 text-[#9cf0ff] border border-[#9cf0ff]/30">
                  OWASP MASVS v2.0
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30">
                  MASVS-L2 & MASVS-R
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-[#9cf0ff]" />
                Mobile Application Security Verification
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('encryption-governance')}
              className="px-3 py-1.5 rounded-lg bg-[#1c1b1b] hover:bg-[#262525] border border-[#2d2c2c] text-xs font-semibold text-[#8e9285] hover:text-white transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#9cf0ff]" />
              Data Encryption & KMS
            </button>
            <button
              onClick={() => onNavigate('privacy-governance')}
              className="px-3 py-1.5 rounded-lg bg-[#1c1b1b] hover:bg-[#262525] border border-[#2d2c2c] text-xs font-semibold text-[#8e9285] hover:text-white transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#83ea00]" />
              Privacy & Safeguarding
            </button>
          </div>
        </div>

        {/* Hero KPIs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] shadow-md">
            <div className="flex items-center justify-between text-[#8e9285]">
              <span className="text-xs font-bold uppercase tracking-wider">Storage Security</span>
              <HardDrive className="w-4 h-4 text-[#83ea00]" />
            </div>
            <div className="text-xl font-black text-white mt-2 flex items-center gap-1.5">
              <span>iOS Keychain</span>
              <span className="text-xs text-[#83ea00] font-bold">/ Keystore</span>
            </div>
            <p className="text-[11px] text-[#8e9285] mt-1">
              Zero plaintext tokens in NSUserDefaults / SharedPreferences.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] shadow-md">
            <div className="flex items-center justify-between text-[#8e9285]">
              <span className="text-xs font-bold uppercase tracking-wider">Anti-Tampering</span>
              <ShieldAlert className="w-4 h-4 text-[#9cf0ff]" />
            </div>
            <div className="text-xl font-black text-white mt-2 flex items-center gap-1.5">
              <span>ProGuard / R8</span>
              <span className="text-xs text-[#9cf0ff] font-bold">+ ptrace</span>
            </div>
            <p className="text-[11px] text-[#8e9285] mt-1">
              Anti-debugging, Frida hook defense, and control flow obfuscation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] shadow-md">
            <div className="flex items-center justify-between text-[#8e9285]">
              <span className="text-xs font-bold uppercase tracking-wider">Network & Auth</span>
              <Lock className="w-4 h-4 text-[#9cf0ff]" />
            </div>
            <div className="text-xl font-black text-white mt-2 flex items-center gap-1.5">
              <span>RFC 9449 DPoP</span>
              <span className="text-xs text-[#9cf0ff] font-bold">+ SPKI Pin</span>
            </div>
            <p className="text-[11px] text-[#8e9285] mt-1">
              Device-bound cryptographic tokens & strict TLS 1.3 pinning.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] shadow-md">
            <div className="flex items-center justify-between text-[#8e9285]">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Guard</span>
              <EyeOff className="w-4 h-4 text-[#83ea00]" />
            </div>
            <div className="text-xl font-black text-white mt-2 flex items-center gap-1.5">
              <span>FLAG_SECURE</span>
              <span className="text-xs text-[#83ea00] font-bold">+ 30s Purge</span>
            </div>
            <p className="text-[11px] text-[#8e9285] mt-1">
              Task switcher blur, deep link sanitization, and clipboard wipe.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-6 scrollbar-none border-b border-[#2d2c2c]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>MASVS Threat Matrix (12 Controls)</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Secure Storage (Keychain & Keystore)</span>
          </button>

          <button
            onClick={() => setActiveTab('screen_clipboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'screen_clipboard'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Screen Shield & Clipboard Purge</span>
          </button>

          <button
            onClick={() => setActiveTab('deeplinks_tamper')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'deeplinks_tamper'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Deep Links & API Tampering</span>
          </button>

          <button
            onClick={() => setActiveTab('device_attestation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'device_attestation'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Root / Jailbreak Attestation</span>
          </button>

          <button
            onClick={() => setActiveTab('network_files')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'network_files'
                ? 'bg-[#9cf0ff] text-black shadow-lg shadow-[#9cf0ff]/20'
                : 'bg-[#1c1b1b] text-[#8e9285] hover:text-white hover:bg-[#262525]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>SSL Pinning & File Upload Guard</span>
          </button>
        </div>

        {/* TAB 1: OWASP MASVS THREAT MATRIX */}
        {activeTab === 'matrix' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#9cf0ff]" />
                  OWASP MASVS Verification Baseline
                </h3>
                <p className="text-xs text-[#8e9285] mt-0.5">
                  Full coverage against all 12 mobile threat vectors across MASVS-STORAGE, MASVS-CODE, MASVS-AUTH, MASVS-NETWORK, MASVS-PLATFORM, and MASVS-RESILIENCE.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9285]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search controls..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-[#1c1b1b] border border-[#2d2c2c] text-xs text-white placeholder-[#8e9285] focus:outline-none focus:border-[#9cf0ff]"
                  />
                </div>

                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#1c1b1b] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#9cf0ff]"
                >
                  <option value="ALL">All Domains</option>
                  <option value="MASVS-STORAGE">MASVS-STORAGE</option>
                  <option value="MASVS-CODE">MASVS-CODE</option>
                  <option value="MASVS-AUTH">MASVS-AUTH</option>
                  <option value="MASVS-NETWORK">MASVS-NETWORK</option>
                  <option value="MASVS-PLATFORM">MASVS-PLATFORM</option>
                  <option value="MASVS-RESILIENCE">MASVS-RESILIENCE</option>
                  <option value="MASVS-DATA-INGESTION">MASVS-DATA-INGESTION</option>
                </select>
              </div>
            </div>

            {/* Matrix Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatrix.map((item) => (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] hover:border-[#3e3d3d] transition space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#9cf0ff]/10 text-[#9cf0ff] border border-[#9cf0ff]/20">
                          {item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#83ea00]/10 text-[#83ea00] border border-[#83ea00]/20">
                          {item.verificationLevel}
                        </span>
                        <span className="text-[11px] text-[#8e9285] font-mono">
                          {item.targetPlatform}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.status === 'COMPLIANT' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          COMPLIANT
                        </span>
                      )}
                      {item.status === 'ACTIVE_SHIELD' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9cf0ff]/15 text-[#9cf0ff] border border-[#9cf0ff]/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          ACTIVE SHIELD
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#131313] border border-[#242323] space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#ffb4ab] tracking-wider block">
                        Threat Target:
                      </span>
                      <p className="text-xs text-[#d1cece] mt-0.5 leading-relaxed">
                        {item.threatTarget}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#9cf0ff] tracking-wider block">
                        Mitigation Architecture:
                      </span>
                      <p className="text-xs text-[#a4c8d1] mt-0.5 leading-relaxed">
                        {item.mitigationEngine}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#8e9285] flex items-center gap-1.5 pt-1">
                    <Check className="w-3.5 h-3.5 text-[#83ea00] shrink-0" />
                    <span>Evidence: {item.technicalEvidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SECURE STORAGE VAULT */}
        {activeTab === 'storage' && (
          <div className="mt-6 space-y-6">
            {/* Architecture Explainer */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#9cf0ff]/30 shadow-lg">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#9cf0ff]/15 text-[#9cf0ff] border border-[#9cf0ff]/30 uppercase">
                      MASVS-STORAGE & Hardware Keystore Mandate
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    iOS Keychain & Android Keystore Secure Storage
                  </h3>
                  <p className="text-xs text-[#8e9285] mt-1 leading-relaxed">
                    Under OWASP MASVS principles, sensitive authentication tokens, guardian PINs, and biomechanical telemetry must NEVER be stored in ordinary application preferences (<code className="text-[#9cf0ff]">NSUserDefaults</code>, <code className="text-[#9cf0ff]">SharedPreferences</code>, or plaintext <code className="text-[#9cf0ff]">localStorage</code>). All credentials are encapsulated in hardware-backed secure storage.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#2d2c2c] text-center">
                    <div className="text-xs font-bold text-[#8e9285]">iOS Implementation</div>
                    <div className="text-sm font-black text-[#9cf0ff] mt-0.5">Keychain + Secure Enclave</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#2d2c2c] text-center">
                    <div className="text-xs font-bold text-[#8e9285]">Android Implementation</div>
                    <div className="text-sm font-black text-[#83ea00] mt-0.5">Keystore + EncryptedSharedPreferences</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insecure Plaintext Storage Blocker Demo */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#ffb4ab]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab]">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Runtime Plaintext Storage Interceptor & Blocker
                    </h4>
                    <p className="text-xs text-[#8e9285]">
                      Tests the active safety guard that blocks raw JWTs from entering unencrypted preferences.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTestInsecurePlaintext}
                  className="px-3.5 py-1.5 rounded-xl bg-[#ffb4ab]/15 hover:bg-[#ffb4ab]/25 border border-[#ffb4ab]/30 text-xs font-bold text-[#ffb4ab] transition flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Test Plaintext Write Block
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Target Key</label>
                  <input
                    type="text"
                    value={plaintextKey}
                    onChange={(e) => setPlaintextKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#ffb4ab]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Target Value Payload</label>
                  <input
                    type="text"
                    value={plaintextVal}
                    onChange={(e) => setPlaintextVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#ffb4ab]"
                  />
                </div>
              </div>

              {plaintextResult && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  plaintextResult.blocked 
                    ? 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]' 
                    : 'bg-[#83ea00]/10 border-[#83ea00]/30 text-[#83ea00]'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {plaintextResult.blocked ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{plaintextResult.blocked ? 'BLOCKED BY MASVS-STORAGE POLICY' : 'ALLOWED'}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#e5e2e1]">
                    {plaintextResult.violationReason}
                  </p>
                </div>
              )}
            </div>

            {/* Store New Secret in Vault */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#9cf0ff]" />
                Store Sensitive Credential in Hardware Vault
              </h4>

              <form onSubmit={handleSaveSecret} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Key Name</label>
                    <input
                      type="text"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="e.g. coach_pin_hash_09"
                      className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#9cf0ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Plaintext Credential / Secret</label>
                    <input
                      type="text"
                      value={newVal}
                      onChange={(e) => setNewVal(e.target.value)}
                      placeholder="e.g. 8492-auth-key-pass"
                      className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#9cf0ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Storage Provider</label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#9cf0ff]"
                    >
                      <option value="iOS_KEYCHAIN">iOS Keychain (Secure Enclave)</option>
                      <option value="ANDROID_KEYSTORE_ENCRYPTED_SP">Android Keystore (EncryptedSharedPreferences)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#8e9285]">
                    Hardware key wrapping applies automatically via FIPS 140-2 Level 3 HSM / TEE.
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Encrypt & Write to Vault
                  </button>
                </div>
              </form>

              {storageFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  storageFeedback.type === 'success' ? 'bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30' : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30'
                }`}>
                  {storageFeedback.message}
                </div>
              )}
            </div>

            {/* Active Vault Entries Table */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#83ea00]" />
                  Active Hardware Vault Records ({vaultEntries.length})
                </h4>
                <span className="text-xs text-[#8e9285]">Hardware-Protected</span>
              </div>

              <div className="space-y-2.5">
                {vaultEntries.map((entry) => (
                  <div
                    key={entry.key}
                    className="p-4 rounded-xl bg-[#131313] border border-[#242323] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white font-mono">{entry.key}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          entry.storageTarget === 'iOS_KEYCHAIN' 
                            ? 'bg-[#9cf0ff]/15 text-[#9cf0ff] border border-[#9cf0ff]/30' 
                            : 'bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30'
                        }`}>
                          {entry.storageTarget === 'iOS_KEYCHAIN' ? 'iOS Keychain' : 'Android Keystore'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffb4ab]/15 text-[#ffb4ab]">
                          {entry.classification}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8e9285]">
                        Access Control: <span className="text-[#a4c8d1] font-mono">{entry.accessControl}</span>
                      </div>
                      <div className="text-[11px] text-[#8e9285] font-mono truncate">
                        Ciphertext: <span className="text-[#83ea00]">{entry.encryptedDataB64}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-[#83ea00] bg-[#83ea00]/10 px-2.5 py-1 rounded-lg border border-[#83ea00]/20 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Hardware TEE
                      </div>
                      <button
                        onClick={() => handleDeleteSecret(entry.key)}
                        className="p-2 rounded-lg bg-[#242323] hover:bg-[#ffb4ab]/20 text-[#8e9285] hover:text-[#ffb4ab] transition"
                        title="Delete Secret"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCREEN PROTECTION & CLIPBOARD */}
        {activeTab === 'screen_clipboard' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Screen Shield (FLAG_SECURE & Recents Task Switcher Blur) */}
              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 flex items-center justify-center text-[#9cf0ff]">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Screen Shield (FLAG_SECURE)</h4>
                      <p className="text-xs text-[#8e9285]">Protects junior medical & coaching data from screen capture</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#83ea00]">
                      {isScreenShieldActive ? 'SHIELD ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => setIsScreenShieldActive(!isScreenShieldActive)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                        isScreenShieldActive ? 'bg-[#9cf0ff]' : 'bg-[#2d2c2c]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-black transition-transform ${
                        isScreenShieldActive ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#242323] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9285]">Android Implementation:</span>
                    <code className="text-[#9cf0ff] font-mono text-[11px]">WindowManager.LayoutParams.FLAG_SECURE</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9285]">iOS Implementation:</span>
                    <code className="text-[#83ea00] font-mono text-[11px]">UIWindow.isCaptured + willResignActive Blur</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9285]">Recents App Switcher:</span>
                    <span className="text-[#83ea00] font-bold">Privacy Mask Overlay</span>
                  </div>
                </div>

                {/* Simulated Recents Switcher Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Live Recents Switcher Simulator:</span>
                    <button
                      onClick={() => setIsSimulatedRecentsMode(!isSimulatedRecentsMode)}
                      className="text-xs text-[#9cf0ff] hover:underline font-bold"
                    >
                      {isSimulatedRecentsMode ? 'Exit App Switcher View' : 'Simulate App Entering Background'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border relative transition-all min-h-[140px] flex items-center justify-center ${
                    isSimulatedRecentsMode && isScreenShieldActive
                      ? 'bg-[#1c1b1b]/95 backdrop-blur-xl border-[#9cf0ff]/40'
                      : 'bg-[#131313] border-[#242323]'
                  }`}>
                    {isSimulatedRecentsMode && isScreenShieldActive ? (
                      <div className="text-center space-y-1.5 animate-fadeIn">
                        <ShieldCheck className="w-8 h-8 text-[#9cf0ff] mx-auto" />
                        <div className="text-xs font-black text-white uppercase tracking-wider">
                          Pitch Precision Privacy Shield Active
                        </div>
                        <p className="text-[10px] text-[#8e9285] max-w-xs">
                          Screen snapshot obscured for athlete safeguarding & HIPAA/GDPR data compliance.
                        </p>
                      </div>
                    ) : (
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-bold">Junior Athlete: Alex Pillay (U16)</span>
                          <span className="text-[#83ea00] font-mono font-bold">138.4 km/h</span>
                        </div>
                        <div className="text-[11px] text-[#8e9285]">
                          Lumbar Spine L5 Stress Score: <span className="text-white font-bold">0.14 mm displacement (Low)</span>
                        </div>
                        <div className="text-[11px] text-[#8e9285]">
                          Guardian Emergency Contact: <span className="text-white font-bold">+44 7700 900142</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sensitive Clipboard Auto-Purge & SNOOP Guard */}
              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#83ea00]/10 border border-[#83ea00]/30 flex items-center justify-center text-[#83ea00]">
                      <Clipboard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sensitive Clipboard Auto-Purge</h4>
                      <p className="text-xs text-[#8e9285]">Prevents clipboard snoop malware from exfiltrating credentials</p>
                    </div>
                  </div>

                  {clipboardTimerSeconds !== null && (
                    <div className="px-3 py-1 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 text-xs font-bold text-[#ffb4ab] animate-pulse">
                      Purge in {clipboardTimerSeconds}s
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#131313] border border-[#242323] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">Android 13+ Flag:</span>
                    <code className="text-[#9cf0ff] font-mono text-[11px]">ClipDescription.EXTRA_IS_SENSITIVE</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">Auto-Wipe Timer:</span>
                    <span className="text-white font-bold">30 Seconds In-Memory Purge</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">Last Purged Timestamp:</span>
                    <span className="text-[#83ea00] font-mono">{lastPurgedTime || 'Zero active leaks'}</span>
                  </div>
                </div>

                {/* Interactive Copy Demo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block">Test Secure Copy Sandbox:</label>
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#242323] flex items-center justify-between gap-2">
                    <div className="truncate text-xs font-mono text-[#9cf0ff]">
                      COACH_MFA_TOKEN: 894-192-KLU
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopySensitiveWithPurge('COACH_MFA_TOKEN: 894-192-KLU')}
                        className="px-3 py-1.5 rounded-lg bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSuccess ? 'Copied!' : 'Copy (30s Purge)'}</span>
                      </button>
                      {clipboardTimerSeconds !== null && (
                        <button
                          onClick={handlePurgeClipboardNow}
                          className="px-3 py-1.5 rounded-lg bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-bold transition"
                          title="Purge Now"
                        >
                          Wipe Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#8e9285]">
                  When copied, the clipboard content is tagged as sensitive and automatically overwritten with an empty buffer after 30 seconds.
                </div>
              </div>
            </div>

            {/* Insecure WebView Security Hardener */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 flex items-center justify-center text-[#9cf0ff]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">WebView Security Hardening Standards (MASVS-PLATFORM-02)</h4>
                  <p className="text-xs text-[#8e9285]">Enforced settings for in-app video coaching guides and external rulebooks</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#131313] border border-[#242323] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">File Scheme Access</span>
                    <CheckCircle2 className="w-4 h-4 text-[#83ea00]" />
                  </div>
                  <code className="text-[10px] text-[#9cf0ff] block">setAllowFileAccess(false)</code>
                  <p className="text-[10px] text-[#8e9285]">Blocks exfiltration of app internal files via file://</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131313] border border-[#242323] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Universal URL Access</span>
                    <CheckCircle2 className="w-4 h-4 text-[#83ea00]" />
                  </div>
                  <code className="text-[10px] text-[#9cf0ff] block">setAllowUniversalAccessFromFileURLs(false)</code>
                  <p className="text-[10px] text-[#8e9285]">Prevents cross-domain file origin bypass</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#131313] border border-[#242323] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Safe Browsing</span>
                    <CheckCircle2 className="w-4 h-4 text-[#83ea00]" />
                  </div>
                  <code className="text-[10px] text-[#9cf0ff] block">setSafeBrowsingEnabled(true)</code>
                  <p className="text-[10px] text-[#8e9285]">Protects against phishing and malicious domains</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEEP LINKS & API TAMPERING */}
        {activeTab === 'deeplinks_tamper' && (
          <div className="mt-6 space-y-6">
            {/* Deep Link Validator Sandbox */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 flex items-center justify-center text-[#9cf0ff]">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Universal Links & Deep Link Security Validator</h4>
                    <p className="text-xs text-[#8e9285]">Protects against scheme hijacking, SQLi/XSS parameters, and unvalidated redirects</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30">
                  AASA & assetlinks.json Anchored
                </span>
              </div>

              {/* Preset Test Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-[#8e9285]">Test Attack Vectors:</span>
                <button
                  onClick={() => handleTestDeepLink('https://pitchprecision.io/drill/d-inswing-01?session=s-883')}
                  className="px-2.5 py-1 rounded-lg bg-[#131313] hover:bg-[#242323] border border-[#2d2c2c] text-[11px] text-white transition font-mono"
                >
                  Valid Drill Link
                </button>
                <button
                  onClick={() => handleTestDeepLink('javascript:alert(document.cookie)')}
                  className="px-2.5 py-1 rounded-lg bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 border border-[#ffb4ab]/30 text-[11px] text-[#ffb4ab] transition font-mono"
                >
                  javascript: XSS Attack
                </button>
                <button
                  onClick={() => handleTestDeepLink('https://pitchprecision.io/drill/1?session=1%27+OR+1%3D1--')}
                  className="px-2.5 py-1 rounded-lg bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 border border-[#ffb4ab]/30 text-[11px] text-[#ffb4ab] transition font-mono"
                >
                  SQL Injection in Param
                </button>
                <button
                  onClick={() => handleTestDeepLink('https://rogue-hacker-site.com/session/steal-token')}
                  className="px-2.5 py-1 rounded-lg bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 border border-[#ffb4ab]/30 text-[11px] text-[#ffb4ab] transition font-mono"
                >
                  Unregistered Domain
                </button>
              </div>

              {/* Input URL */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={deepLinkInput}
                  onChange={(e) => handleTestDeepLink(e.target.value)}
                  placeholder="Enter deep link URL to validate..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white focus:outline-none focus:border-[#9cf0ff] font-mono"
                />
                <button
                  onClick={() => handleTestDeepLink(deepLinkInput)}
                  className="px-4 py-2 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold transition shrink-0"
                >
                  Validate URL
                </button>
              </div>

              {/* Validation Result Box */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                deepLinkResult.isValid 
                  ? 'bg-[#83ea00]/10 border-[#83ea00]/30' 
                  : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {deepLinkResult.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-[#83ea00]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#ffb4ab]" />
                    )}
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      deepLinkResult.isValid ? 'text-[#83ea00]' : 'text-[#ffb4ab]'
                    }`}>
                      {deepLinkResult.securityVerdict}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8e9285]">Scheme: {deepLinkResult.scheme}</span>
                </div>
                <p className="text-xs text-[#e5e2e1] leading-relaxed">
                  {deepLinkResult.details}
                </p>
              </div>
            </div>

            {/* API Anti-Tampering & Request Signing */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#83ea00]/10 border border-[#83ea00]/30 flex items-center justify-center text-[#83ea00]">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">API Anti-Tampering & HMAC Request Signing</h4>
                    <p className="text-xs text-[#8e9285]">Every request includes timestamp, nonces, and hardware-signed payload hashes</p>
                  </div>
                </div>
                <button
                  onClick={handleSignRequest}
                  className="px-3.5 py-1.5 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Signed Payload
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8e9285] block mb-1">Request JSON Body</label>
                <textarea
                  value={signedPayloadInput}
                  onChange={(e) => setSignedPayloadInput(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#131313] border border-[#2d2c2c] text-xs text-white font-mono focus:outline-none focus:border-[#9cf0ff]"
                />
              </div>

              {signatureOutput && (
                <div className="p-4 rounded-xl bg-[#131313] border border-[#242323] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">Anti-Replay Nonce:</span>
                    <span className="text-[#9cf0ff] font-mono">{signatureOutput.nonce}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">Drift Timestamp (60s Window):</span>
                    <span className="text-white font-mono">{signatureOutput.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e9285]">DPoP Private Key Signature:</span>
                    <span className="text-[#83ea00] font-mono">{signatureOutput.signature}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ROOT / JAILBREAK ATTESTATION */}
        {activeTab === 'device_attestation' && (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    integrityReport.deviceStatus === 'CLEAN_VERIFIED'
                      ? 'bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30'
                      : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30'
                  }`}>
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        10-Point Root & Jailbreak Attestation Engine
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        integrityReport.deviceStatus === 'CLEAN_VERIFIED'
                          ? 'bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30'
                          : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 animate-pulse'
                      }`}>
                        {integrityReport.deviceStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#8e9285] mt-0.5">
                      {integrityReport.passedChecksCount} of {integrityReport.totalChecksCount} security checks passed successfully.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSimulatedThreat}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      simulateCompromisedDevice 
                        ? 'bg-[#83ea00]/15 text-[#83ea00] border border-[#83ea00]/30 hover:bg-[#83ea00]/25' 
                        : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/25'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{simulateCompromisedDevice ? 'Restore Clean Device' : 'Simulate Rooted / Compromised Device'}</span>
                  </button>

                  <button
                    onClick={handleRunIntegrityScan}
                    disabled={isScanningIntegrity}
                    className="px-4 py-2 rounded-xl bg-[#9cf0ff] hover:bg-[#80e5f7] text-black text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanningIntegrity ? 'animate-spin' : ''}`} />
                    <span>Rescan Diagnostics</span>
                  </button>
                </div>
              </div>

              {/* Checks Checklist */}
              <div className="space-y-2.5 pt-2">
                {integrityReport.checks.map((check, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      check.passed 
                        ? 'bg-[#131313] border-[#242323]' 
                        : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {check.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#83ea00] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${check.passed ? 'text-white' : 'text-[#ffb4ab]'}`}>
                          {check.checkName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8e9285] pl-6">
                        Indicator: {check.threatIndicator}
                      </p>
                    </div>

                    <div className="pl-6 sm:pl-0 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        check.passed 
                          ? 'bg-[#83ea00]/10 text-[#83ea00]' 
                          : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                      }`}>
                        Action: {check.remediationAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SSL PINNING & FILE UPLOADS */}
        {activeTab === 'network_files' && (
          <div className="mt-6 space-y-6">
            {/* SSL Pinning Sandbox */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#9cf0ff]/10 border border-[#9cf0ff]/30 flex items-center justify-center text-[#9cf0ff]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Public Key SPKI Certificate Pinning (Anti-MITM)</h4>
                    <p className="text-xs text-[#8e9285]">Rejects rogue user-installed root CAs (Burp Suite, Charles Proxy, Fiddler)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestPinning('LEGITIMATE')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      pinningScenario === 'LEGITIMATE'
                        ? 'bg-[#83ea00] text-black'
                        : 'bg-[#131313] text-[#8e9285] hover:text-white'
                    }`}
                  >
                    Legitimate TLS Handshake
                  </button>
                  <button
                    onClick={() => handleTestPinning('ROGUE_PROXY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      pinningScenario === 'ROGUE_PROXY'
                        ? 'bg-[#ffb4ab] text-black'
                        : 'bg-[#131313] text-[#8e9285] hover:text-white'
                    }`}
                  >
                    Simulate Rogue MITM Interception
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#131313] border border-[#242323] space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e9285]">Pinned Host:</span>
                  <span className="text-white">{pinningHost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8e9285]">SPKI SHA-256 Pin:</span>
                  <span className="text-[#9cf0ff]">sha256/WoiWRyIOVNa9ihaBciRSC7XHjliYS9VwUGOIud4PB18=</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8e9285]">Certificate Transparency:</span>
                  <span className="text-[#83ea00]">Enforced (CT Logs Verified)</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-1.5 ${
                pinningVerdict.status === 'VALID' 
                  ? 'bg-[#83ea00]/10 border-[#83ea00]/30 text-[#83ea00]' 
                  : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]'
              }`}>
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  {pinningVerdict.status === 'VALID' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{pinningVerdict.status === 'VALID' ? 'PINNING VALIDATED' : 'INTERCEPTION DETECTED & BLOCKED'}</span>
                </div>
                <p className="text-xs text-[#e5e2e1]">
                  {pinningVerdict.details}
                </p>
              </div>
            </div>

            {/* Malicious File Upload & Magic Bytes Inspector */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2d2c2c] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#83ea00]/10 border border-[#83ea00]/30 flex items-center justify-center text-[#83ea00]">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Malicious File Upload & Magic Bytes Inspector</h4>
                    <p className="text-xs text-[#8e9285]">Inspects true binary file signatures, strips EXIF GPS tags, and blocks polyglots</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-[#8e9285]">Test Files:</span>
                  <button
                    onClick={() => handleInspectPresetFile('cricket_inswing_1080p.mp4')}
                    className="px-2.5 py-1 rounded-lg bg-[#131313] hover:bg-[#242323] border border-[#2d2c2c] text-[11px] text-white transition font-mono"
                  >
                    inswing_1080p.mp4
                  </button>
                  <button
                    onClick={() => handleInspectPresetFile('lumbar_mri_scan.jpg')}
                    className="px-2.5 py-1 rounded-lg bg-[#131313] hover:bg-[#242323] border border-[#2d2c2c] text-[11px] text-white transition font-mono"
                  >
                    lumbar_mri.jpg
                  </button>
                  <button
                    onClick={() => handleInspectPresetFile('malicious_reverse_shell.mp4.exe')}
                    className="px-2.5 py-1 rounded-lg bg-[#ffb4ab]/15 hover:bg-[#ffb4ab]/25 border border-[#ffb4ab]/30 text-[11px] text-[#ffb4ab] transition font-mono"
                  >
                    shell.mp4.exe
                  </button>
                  <button
                    onClick={() => handleInspectPresetFile('exploit_xxe_diagram.svg')}
                    className="px-2.5 py-1 rounded-lg bg-[#ffb4ab]/15 hover:bg-[#ffb4ab]/25 border border-[#ffb4ab]/30 text-[11px] text-[#ffb4ab] transition font-mono"
                  >
                    xxe_bomb.svg
                  </button>
                </div>
              </div>

              {fileScanResult && (
                <div className={`p-4 rounded-xl border space-y-2 ${
                  fileScanResult.status === 'CLEAN_VERIFIED'
                    ? 'bg-[#83ea00]/10 border-[#83ea00]/30'
                    : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {fileScanResult.status === 'CLEAN_VERIFIED' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#83ea00]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#ffb4ab]" />
                      )}
                      <span className={`text-xs font-bold ${
                        fileScanResult.status === 'CLEAN_VERIFIED' ? 'text-[#83ea00]' : 'text-[#ffb4ab]'
                      }`}>
                        {fileScanResult.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8e9285]">
                      Magic Bytes: <code className="text-[#9cf0ff]">{fileScanResult.magicBytesHex}</code>
                    </span>
                  </div>
                  <p className="text-xs text-[#e5e2e1] leading-relaxed">
                    {fileScanResult.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
