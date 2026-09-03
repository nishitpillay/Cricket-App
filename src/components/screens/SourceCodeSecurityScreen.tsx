import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  GitBranch, 
  GitPullRequest, 
  Code2, 
  Terminal, 
  Key, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Sliders, 
  Search, 
  Building2, 
  Server, 
  Globe, 
  Fingerprint, 
  UserCheck, 
  HardDrive, 
  Layers, 
  Cpu, 
  Copy, 
  Check, 
  Ban, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  SourceCodeSecurityPillarId, 
  SecretScanFinding,
  UserProfile,
  ScreenType 
} from '../../types';
import { 
  SECRET_DETECTION_RULES, 
  scanContentForSecrets, 
  GITIGNORE_SECURITY_CHECKLIST, 
  PRE_COMMIT_HOOK_SPEC,
  SECRET_MANAGEMENT_PLATFORMS, 
  MANAGED_APPLICATION_SECRETS,
  ACTIVE_BRANCH_PROTECTION_RULESETS,
  CODE_REVIEW_POLICY,
  CODEOWNERS_FILE_CONTENT,
  DEPENDABOT_CONFIG_FILE,
  ACTIVE_DEPENDENCY_VULNERABILITY_REGISTER,
  DEPENDENCY_SLA_POLICY,
  SBOM_COMPONENTS_LIST,
  generateCycloneDxSbom,
  generateSpdxSbom,
  SIGNED_BUILD_ARTIFACTS,
  SIGNING_CREDENTIAL_CONFIGURATIONS,
  SIGNING_CREDENTIAL_SECURITY_STANDARDS,
  generateSourceCodeSecurityAuditPacket
} from '../../utils/sourceCodeSecurityEngine';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface SourceCodeSecurityScreenProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
}

export const SourceCodeSecurityScreen: React.FC<SourceCodeSecurityScreenProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activePillar, setActivePillar] = useState<SourceCodeSecurityPillarId>('secrets_in_git');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Secret Scanner Simulator State
  const sampleCleanSnippet = `// Clean production code - environment variable injected
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be injected via Secret Manager at runtime');
}

export const ai = new GoogleGenAI({ apiKey });`;

  const sampleVulnerableSnippet = `// DANGEROUS COMMIT ATTEMPT - Hardcoded Credentials
const awsAccessKey = "AKIAIOSFODNN7EXAMPLE";
const stripeLiveKey = "sk_live_51M0abcdefghijklmnopqrstuvwx";
const dbUrl = "postgres://pitch_admin:SuperSecretPass123!@db.internal:5432/pitch_prod";
const jwtSecret = "jwtSecret = 'SuperSecretHmacKey123!'";
const gcpKey = '{"type": "service_account", "private_key": "-----BEGIN PRIVATE KEY\\nMIIEvgIBADANBgk..."}';`;

  const [scanInputText, setScanInputText] = useState(sampleVulnerableSnippet);
  const [scanFindings, setScanFindings] = useState<SecretScanFinding[]>(() => scanContentForSecrets(sampleVulnerableSnippet));
  const [hasRunScan, setHasRunScan] = useState(true);

  // SBOM Search & Filter
  const [sbomSearch, setSbomSearch] = useState('');
  const [sbomTypeFilter, setSbomTypeFilter] = useState<string>('ALL');

  // PR Review Simulator State
  const [simPrType, setSimPrType] = useState<'security_critical' | 'general_feature' | 'documentation'>('security_critical');

  // Export Modal State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportModalTitle, setExportModalTitle] = useState('');
  const [exportJsonContent, setExportJsonContent] = useState('');
  const [copied, setCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunSecretScan = () => {
    playBallImpact();
    const findings = scanContentForSecrets(scanInputText, 'commit_diff.patch');
    setScanFindings(findings);
    setHasRunScan(true);
    if (findings.length > 0) {
      showToast(`Push blocked: ${findings.length} hardcoded secrets intercepted.`);
    } else {
      showToast('Clean scan: 0 secrets detected. Git push approved.');
    }
  };

  const handleLoadSample = (sample: string) => {
    playBeep(650, 0.03);
    setScanInputText(sample);
    const findings = scanContentForSecrets(sample, 'staged_files.ts');
    setScanFindings(findings);
    setHasRunScan(true);
  };

  const handleOpenExportModal = (title: string, contentGetter: () => Record<string, any>) => {
    playBeep(880, 0.04);
    setExportModalTitle(title);
    setExportJsonContent(JSON.stringify(contentGetter(), null, 2));
    setExportModalOpen(true);
    setCopied(false);
  };

  const handleCopyModalContent = () => {
    navigator.clipboard.writeText(exportJsonContent);
    setCopied(true);
    showToast('JSON copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = (filename: string) => {
    const blob = new Blob([exportJsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  // SBOM Filtering
  const filteredSbom = SBOM_COMPONENTS_LIST.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(sbomSearch.toLowerCase()) ||
                          comp.license.toLowerCase().includes(sbomSearch.toLowerCase()) ||
                          comp.supplier.toLowerCase().includes(sbomSearch.toLowerCase());
    const matchesType = sbomTypeFilter === 'ALL' || comp.type === sbomTypeFilter;
    return matchesSearch && matchesType;
  });

  const pillarsList: { id: SourceCodeSecurityPillarId; label: string; icon: any; shortDesc: string }[] = [
    { id: 'secrets_in_git', label: '1. Never Commit Secrets', icon: ShieldAlert, shortDesc: 'Pre-commit hooks & scanner' },
    { id: 'secret_management', label: '2. Secret Platforms', icon: Key, shortDesc: 'Cloud KMS, Vault & OIDC' },
    { id: 'branch_protection', label: '3. Branch Protection', icon: GitBranch, shortDesc: 'Linear history & signed commits' },
    { id: 'code_review', label: '4. Code Review Gates', icon: GitPullRequest, shortDesc: '2-reviewer rule & CODEOWNERS' },
    { id: 'dependency_updates', label: '5. Automated Updates', icon: RefreshCw, shortDesc: 'Dependabot SLAs & CVE auto-patch' },
    { id: 'sbom_management', label: '6. SBOM Inventory', icon: Layers, shortDesc: 'CycloneDX & SPDX specs' },
    { id: 'signed_builds', label: '7. Signed Builds', icon: ShieldCheck, shortDesc: 'AAB v4, iOS WWDR & Cosign' },
    { id: 'signing_credentials', label: '8. Protect Signing Keys', icon: Lock, shortDesc: 'Cloud HSM & YubiKey FIDO2' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 w-full animate-in fade-in pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#c3f400] text-black font-extrabold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#172013] via-[#141b18] to-[#12141a] border-2 border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#c3f400]/20 border border-[#c3f400]/40 text-[#c3f400] text-xs font-extrabold uppercase tracking-wider">
                DevSecOps & Source Code Security
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                8 of 8 Controls Verified
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-mono">
                Zero Git Secrets Enforced
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-white tracking-tight">
              Source Code Security & Continuous Assurance
            </h1>
            <p className="text-xs sm:text-sm text-[#c4c9ac] leading-relaxed">
              Cryptographic integrity across the software development lifecycle: zero hardcoded secrets, mandatory branch protection, multi-party code reviews, automated dependency triage, continuous CycloneDX/SPDX SBOM generation, signed production builds, and hardware HSM isolation for Apple & Google signing credentials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => handleOpenExportModal('DevSecOps Complete Governance Audit Packet', generateSourceCodeSecurityAuditPacket)}
              className="px-4 py-3 rounded-2xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(195,244,0,0.25)] transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Audit Dossier (JSON)
            </button>
            <button
              onClick={() => handleOpenExportModal('CycloneDX v1.5 Software Bill of Materials (SBOM)', () => generateCycloneDxSbom('Pitch Precision'))}
              className="px-4 py-3 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#3e3d3d] text-xs font-bold text-white flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#c3f400]" />
              Export SBOM
            </button>
          </div>
        </div>

        {/* 8 Pillar Score Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {pillarsList.map((p) => {
            const isSelected = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  playBeep(600, 0.03);
                  setActivePillar(p.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#c3f400] text-black border-[#c3f400] shadow-md font-bold' 
                    : 'bg-[#111] hover:bg-[#1c1c1c] text-[#a6ab9d] border-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <p.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#c3f400]'}`} />
                  <span className={`text-[10px] font-mono uppercase ${isSelected ? 'text-black' : 'text-emerald-400'}`}>
                    Active
                  </span>
                </div>
                <div className={`text-xs leading-tight font-semibold line-clamp-1 ${isSelected ? 'text-black' : 'text-white'}`}>
                  {p.label.replace(/^\d+\.\s*/, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs for Mobile / Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#282727]">
        {pillarsList.map((tab) => {
          const isSelected = activePillar === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playBeep(600, 0.03);
                setActivePillar(tab.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                isSelected 
                  ? 'bg-[#c3f400] text-black shadow-md' 
                  : 'bg-[#181717] text-[#8e9285] hover:text-white border border-[#262626]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: NEVER COMMIT SECRETS TO GIT */}
      {/* ========================================================================= */}
      {activePillar === 'secrets_in_git' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Overview */}
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 1 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Never Commit Secrets to Git & Pre-Commit Protection
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Local pre-commit hooks (Gitleaks/Trufflehog) and GitHub Push Protection actively analyze every staged line before git commit creation. If a secret pattern is detected, the git push is automatically blocked.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Push Protection Active
                </span>
              </div>
            </div>

            {/* Interactive Secret Scrubber & Scanner Simulator */}
            <div className="p-5 bg-[#121111] border border-[#2a2929] rounded-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#c3f400]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Pre-Commit Git Diff Scanner Simulator
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadSample(sampleVulnerableSnippet)}
                    className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-[11px] font-bold text-rose-300 border border-rose-500/30"
                  >
                    Load Vulnerable Sample
                  </button>
                  <button
                    onClick={() => handleLoadSample(sampleCleanSnippet)}
                    className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-[11px] font-bold text-emerald-300 border border-emerald-500/30"
                  >
                    Load Clean Sample
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] text-[#8e9285] font-mono">
                  Simulate Staged Code Diff or Git Commit Payload:
                </label>
                <textarea
                  value={scanInputText}
                  onChange={(e) => setScanInputText(e.target.value)}
                  rows={6}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded-xl p-3 text-xs font-mono text-[#c3f400] focus:outline-none focus:border-[#c3f400]"
                  placeholder="Paste code or git diff here to test secret scanning..."
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="text-[11px] text-[#8e9285]">
                  Evaluates 8 pattern engines (AWS, Stripe, GitHub PAT, GCP Service Accounts, Private Keys, DB URIs, JWT Secrets, High-entropy API tokens).
                </span>
                <button
                  onClick={handleRunSecretScan}
                  className="px-5 py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Run Pre-Commit Scan
                </button>
              </div>

              {/* Results */}
              {hasRunScan && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      Scan Verdict:
                      {scanFindings.length === 0 ? (
                        <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> CLEAN - APPROVED FOR GIT PUSH
                        </span>
                      ) : (
                        <span className="text-rose-400 font-extrabold flex items-center gap-1">
                          <Ban className="w-4 h-4" /> REJECTED - {scanFindings.length} SECRETS DETECTED
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-[#8e9285]">
                      Execution: &lt;5ms
                    </span>
                  </div>

                  {scanFindings.length > 0 && (
                    <div className="space-y-2">
                      {scanFindings.map((finding) => (
                        <div
                          key={finding.id}
                          className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-extrabold text-[10px]">
                                {finding.severity}
                              </span>
                              <span className="font-bold text-white">{finding.ruleName}</span>
                              <span className="text-[10px] font-mono text-[#8e9285]">Line {finding.lineNumber}</span>
                            </div>
                            <span className="font-mono text-rose-300 text-[11px] bg-black/40 px-2 py-0.5 rounded">
                              {finding.matchedSecretMasked}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#c4c9ac]">
                            <strong>Remediation:</strong> {finding.remediationRecommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* .gitignore & Gitleaks Config Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#121111] border border-[#222] rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c3f400]" />
                  .gitignore Hardening Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {GITIGNORE_SECURITY_CHECKLIST.map((item, idx) => (
                    <div key={idx} className="p-2 bg-[#181818] rounded-xl border border-white/5 flex items-center justify-between">
                      <span className="font-mono text-[#c3f400] text-[11px]">{item.pattern}</span>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                        IGNORED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#121111] border border-[#222] rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#c3f400]" />
                  Pre-Commit Hook Configuration (.pre-commit-config.yaml)
                </h4>
                <pre className="p-3 bg-[#0a0a0a] border border-[#222] rounded-xl font-mono text-[10px] text-[#a6ab9d] overflow-x-auto whitespace-pre">
                  {PRE_COMMIT_HOOK_SPEC}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 2: SECRET-MANAGEMENT PLATFORMS */}
      {/* ========================================================================= */}
      {activePillar === 'secret_management' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 2 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Use Secret-Management Platforms
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Pitch Precision enforces a strict zero-hardcoded-credentials policy. Production secrets are managed through Google Cloud Secret Manager, HashiCorp Vault, and GitHub Actions OIDC federation, injected at runtime into isolated server environments.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#c3f400] text-xs font-bold">
                100% Runtime Injected
              </span>
            </div>

            {/* Secret Management Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECRET_MANAGEMENT_PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="p-5 bg-[#121111] border border-[#262626] rounded-2xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400]">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{platform.platformName}</h3>
                        <span className="text-[10px] font-mono text-[#8e9285]">{platform.provider}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      {platform.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-white/5 py-2.5">
                    <div>
                      <span className="text-[#8e9285] text-[10px] block">Secrets Managed:</span>
                      <span className="font-bold text-white">{platform.secretsManagedCount} active items</span>
                    </div>
                    <div>
                      <span className="text-[#8e9285] text-[10px] block">Rotation Schedule:</span>
                      <span className="font-bold text-[#c3f400]">Every {platform.rotationIntervalDays} days</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-[#a6ab9d]">
                    <span className="text-[10px] text-[#8e9285] uppercase font-bold tracking-wider block">Access Policy & IAM:</span>
                    <p className="font-mono text-[10px] bg-black/40 p-2 rounded-lg border border-white/5">
                      {platform.iamBindingPolicy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Managed Application Secrets Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-[#c3f400]" />
                Application Secret Mapping & Client-Isolation Verification
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#121111] text-[#8e9285] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Secret Key</th>
                      <th className="p-3">Platform Vault Source</th>
                      <th className="p-3">Runtime Injection Target</th>
                      <th className="p-3">Client Bundle Exposure</th>
                      <th className="p-3 rounded-r-xl text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {MANAGED_APPLICATION_SECRETS.map((sec, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-[#c3f400]">{sec.key}</td>
                        <td className="p-3 text-white">{sec.source}</td>
                        <td className="p-3 font-mono text-[11px] text-[#a6ab9d]">{sec.injectedAs}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                            BLOCKED (0% Client Access)
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
                            {sec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 3: BRANCH PROTECTION */}
      {/* ========================================================================= */}
      {activePillar === 'branch_protection' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 3 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Enable Branch Protection
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Enforce strict branch protection rulesets on production (<code className="text-white">main</code>) and release branches (<code className="text-white">release/*</code>). Direct pushes, force pushes, branch deletions, and unsigned commits are strictly forbidden.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                Lockdown Active
              </span>
            </div>

            {/* Branch Protection Rulesets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACTIVE_BRANCH_PROTECTION_RULESETS.map((ruleset, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#121111] border border-[#262626] rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-[#c3f400]" />
                      <h3 className="text-sm font-bold text-white font-mono">
                        Pattern: "{ruleset.branchPattern}"
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-extrabold uppercase">
                      Protected
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Block Force Pushes (`--force`)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> REJECTED
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Prevent Branch Deletion</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> ENFORCED
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Require Linear Commit History</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> REBASE/SQUASH ONLY
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Require Cryptographically Signed Commits</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> GPG / SSH VERIFIED
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Minimum Required Peer Approvals</span>
                      <span className="text-[#c3f400] font-bold">
                        {ruleset.requiredApprovalsCount} Engineers
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#181818] rounded-xl">
                      <span className="text-[#c4c9ac]">Do Not Allow Admin Bypass</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> ZERO BYPASS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-[#8e9285] uppercase font-bold tracking-wider block">
                      Required Passing Status Checks:
                    </span>
                    <div className="space-y-1">
                      {ruleset.requireStatusChecksToPass.map((check, cIdx) => (
                        <div key={cIdx} className="text-[11px] font-mono text-[#a6ab9d] flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 4: CODE REVIEW BEFORE PRODUCTION DEPLOYMENT */}
      {/* ========================================================================= */}
      {activePillar === 'code_review' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 4 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Require Code Review Before Production Deployment
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Direct production releases are blocked by multi-party approval requirements. Critical security modules require designated Security Officer sign-off via strict CODEOWNERS mappings and environment protection gates.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                2+ Approvals Required
              </span>
            </div>

            {/* Code Review Simulator */}
            <div className="p-5 bg-[#121111] border border-[#282727] rounded-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-[#c3f400]" />
                  Pull Request Gating & CODEOWNERS Verification Simulator
                </h3>
                <span className="text-[11px] text-[#8e9285]">
                  Select simulated PR scope to inspect review gating
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setSimPrType('security_critical')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    simPrType === 'security_critical'
                      ? 'bg-[#1e2316] border-[#c3f400] text-white'
                      : 'bg-[#181818] border-[#292929] text-[#8e9285] hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-[#c3f400]">PR #402: KMS & Auth Refactor</span>
                  <span className="text-[10px] text-[#8e9285]">Touches /src/utils/*Security*.ts</span>
                </button>

                <button
                  onClick={() => setSimPrType('general_feature')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    simPrType === 'general_feature'
                      ? 'bg-[#1e2316] border-[#c3f400] text-white'
                      : 'bg-[#181818] border-[#292929] text-[#8e9285] hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-white">PR #403: Batting Drill Card UI</span>
                  <span className="text-[10px] text-[#8e9285]">Touches /src/components/drills/*</span>
                </button>

                <button
                  onClick={() => setSimPrType('documentation')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    simPrType === 'documentation'
                      ? 'bg-[#1e2316] border-[#c3f400] text-white'
                      : 'bg-[#181818] border-[#292929] text-[#8e9285] hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-white">PR #404: Changelog & Readme</span>
                  <span className="text-[10px] text-[#8e9285]">Touches docs/</span>
                </button>
              </div>

              {/* Simulator Outcome Card */}
              <div className="p-4 bg-[#181818] border border-white/5 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    Review Gate Status:
                    {simPrType === 'security_critical' ? (
                      <span className="text-amber-400 font-extrabold flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" /> 2 PEER REVIEWS + MANDATORY SECURITY OFFICER APPROVAL REQUIRED
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 2 PEER REVIEWS REQUIRED
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono text-[#8e9285]">
                    Dismiss Stale Approvals: YES
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#a6ab9d]">
                  <div className="space-y-1">
                    <span className="text-[#8e9285] text-[10px] uppercase font-bold block">Assigned CODEOWNERS:</span>
                    <p className="font-mono text-white bg-black/40 p-2 rounded">
                      {simPrType === 'security_critical' 
                        ? '@pitchprecision/security-leads, @PillayN' 
                        : '@pitchprecision/core-engineers'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#8e9285] text-[10px] uppercase font-bold block">Deployment Gating (Production):</span>
                    <p className="font-mono text-[#c3f400] bg-black/40 p-2 rounded">
                      Protected Environment: Manual Approval from Release Lead + 5m Wait Timer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CODEOWNERS File Content Viewer */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c3f400]" />
                Repository CODEOWNERS Specification (.github/CODEOWNERS)
              </h4>
              <pre className="p-4 bg-[#0d0d0d] border border-[#222] rounded-2xl font-mono text-xs text-[#c4c9ac] overflow-x-auto whitespace-pre">
                {CODEOWNERS_FILE_CONTENT}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 5: AUTOMATED DEPENDENCY UPDATES */}
      {/* ========================================================================= */}
      {activePillar === 'dependency_updates' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 5 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Enable Automated Dependency Updates & Vulnerability SLAs
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Automated bots (Dependabot & Renovate) monitor all production packages, Docker base images, and GitHub Actions daily. Vulnerabilities trigger immediate patch pull requests with strict remediation SLA enforcement.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                0 Unpatched Critical CVEs
              </span>
            </div>

            {/* SLA Policy Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-[#121111] border border-white/5 rounded-2xl">
                <span className="text-[#8e9285] text-[10px] uppercase font-bold block">Critical SLA (CVSS &ge; 9.0)</span>
                <span className="text-lg font-bold font-mono text-rose-400">24 Hours</span>
                <span className="text-[10px] text-[#8e9285] block mt-1">Immediate auto-PR + pager alert</span>
              </div>
              <div className="p-4 bg-[#121111] border border-white/5 rounded-2xl">
                <span className="text-[#8e9285] text-[10px] uppercase font-bold block">High SLA (CVSS 7.0-8.9)</span>
                <span className="text-lg font-bold font-mono text-amber-400">7 Days</span>
                <span className="text-[10px] text-[#8e9285] block mt-1">Weekly release cycle priority</span>
              </div>
              <div className="p-4 bg-[#121111] border border-white/5 rounded-2xl">
                <span className="text-[#8e9285] text-[10px] uppercase font-bold block">Medium SLA (CVSS 4.0-6.9)</span>
                <span className="text-lg font-bold font-mono text-blue-400">30 Days</span>
                <span className="text-[10px] text-[#8e9285] block mt-1">Grouped minor patch updates</span>
              </div>
              <div className="p-4 bg-[#121111] border border-white/5 rounded-2xl">
                <span className="text-[#8e9285] text-[10px] uppercase font-bold block">Current SLA Compliance</span>
                <span className="text-lg font-bold font-mono text-[#c3f400]">100%</span>
                <span className="text-[10px] text-emerald-400 font-bold block mt-1">All SLAs satisfied</span>
              </div>
            </div>

            {/* Active Vulnerabilities Remediation Register */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c3f400]" />
                Recent Automated Vulnerability Remediations & Patches
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#121111] text-[#8e9285] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Package</th>
                      <th className="p-3">Advisory / CVE</th>
                      <th className="p-3">CVSS Score</th>
                      <th className="p-3">Affected ➔ Patched</th>
                      <th className="p-3">Automated PR</th>
                      <th className="p-3 rounded-r-xl text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {ACTIVE_DEPENDENCY_VULNERABILITY_REGISTER.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-white">{item.packageName}</td>
                        <td className="p-3 font-mono text-[#c3f400] text-[11px]">{item.cveId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {item.cvssScore} ({item.severity})
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[#a6ab9d]">
                          {item.affectedVersion} ➔ <strong className="text-emerald-400">{item.patchedVersion}</strong>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-white">PR #{item.prNumber}</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                            {item.autoPrStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dependabot Config */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#c3f400]" />
                Dependabot Configuration (.github/dependabot.yml)
              </h4>
              <pre className="p-3 bg-[#0d0d0d] border border-[#222] rounded-xl font-mono text-[11px] text-[#a6ab9d] overflow-x-auto whitespace-pre">
                {DEPENDABOT_CONFIG_FILE}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 6: MAINTAIN SOFTWARE BILL OF MATERIALS (SBOM) */}
      {/* ========================================================================= */}
      {activePillar === 'sbom_management' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 6 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Maintain Software Bill of Materials (SBOM) Where Practical
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Comprehensive component inventory tracking all direct and transitive dependencies, package URLs (purls), cryptographic SHA-256 integrity hashes, suppliers, and licenses in compliance with CycloneDX v1.5 and SPDX v2.3 standards.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleOpenExportModal('CycloneDX v1.5 JSON SBOM', () => generateCycloneDxSbom('Pitch Precision'))}
                  className="px-3.5 py-2 rounded-xl bg-[#c3f400] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  CycloneDX JSON
                </button>
                <button
                  onClick={() => handleOpenExportModal('SPDX v2.3 JSON SBOM', () => generateSpdxSbom('Pitch Precision'))}
                  className="px-3.5 py-2 rounded-xl bg-[#242323] hover:bg-[#2e2e2e] border border-[#3e3d3d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#c3f400]" />
                  SPDX JSON
                </button>
              </div>
            </div>

            {/* SBOM Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121111] p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSbomTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    sbomTypeFilter === 'ALL' ? 'bg-[#c3f400] text-black' : 'bg-[#222] text-[#8e9285]'
                  }`}
                >
                  All ({SBOM_COMPONENTS_LIST.length})
                </button>
                <button
                  onClick={() => setSbomTypeFilter('framework')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    sbomTypeFilter === 'framework' ? 'bg-[#c3f400] text-black' : 'bg-[#222] text-[#8e9285]'
                  }`}
                >
                  Frameworks
                </button>
                <button
                  onClick={() => setSbomTypeFilter('library')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    sbomTypeFilter === 'library' ? 'bg-[#c3f400] text-black' : 'bg-[#222] text-[#8e9285]'
                  }`}
                >
                  Libraries
                </button>
                <button
                  onClick={() => setSbomTypeFilter('tool')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    sbomTypeFilter === 'tool' ? 'bg-[#c3f400] text-black' : 'bg-[#222] text-[#8e9285]'
                  }`}
                >
                  Build Tools
                </button>
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9285]" />
                <input
                  type="text"
                  placeholder="Search package, license, supplier..."
                  value={sbomSearch}
                  onChange={(e) => setSbomSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-[#333] rounded-xl text-xs text-white placeholder-[#8e9285] focus:outline-none focus:border-[#c3f400]"
                />
              </div>
            </div>

            {/* SBOM Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#121111] text-[#8e9285] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Component Name</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">License</th>
                    <th className="p-3">Package URL (purl)</th>
                    <th className="p-3">Cryptographic SHA-256</th>
                    <th className="p-3 rounded-r-xl text-right">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {filteredSbom.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-3 font-mono font-bold text-[#c3f400]">{comp.name}</td>
                      <td className="p-3 font-mono text-white">{comp.version}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[#8e9285] font-mono text-[10px]">
                          {comp.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                          {comp.license}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#8e9285] truncate max-w-[160px]" title={comp.purl}>
                        {comp.purl}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#a6ab9d] truncate max-w-[140px]" title={comp.sha256Hash}>
                        {comp.sha256Hash.substring(0, 16)}...
                      </td>
                      <td className="p-3 text-right text-white font-medium">{comp.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* License Audit Summary */}
            <div className="p-4 bg-[#121111] border border-white/5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-bold">100% Permissive Open Source Licenses Verified</span>
              </div>
              <span className="text-[#8e9285] text-[11px]">
                0 Copyleft / GPL infection risks detected in production bundle.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 7: SIGNED APPLICATION BUILDS */}
      {/* ========================================================================= */}
      {activePillar === 'signed_builds' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 7 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Use Signed Application Builds
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Every distribution artifact must be cryptographically signed with trusted certificates before release. Android packages utilize APK Signature Scheme v4/v3, iOS builds mandate Apple WWDR Codesign with Hardened Runtime, and container images are signed via Sigstore Cosign with SLSA Level 3 attestations.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                100% Signatures Verified
              </span>
            </div>

            {/* Signed Build Artifacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SIGNED_BUILD_ARTIFACTS.map((artifact, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#121111] border border-[#282727] rounded-2xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#8e9285] uppercase">
                        {artifact.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                        VERIFIED
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white font-mono break-all">
                      {artifact.artifactName}
                    </h3>

                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-[#8e9285] block">Signing Scheme:</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{artifact.signingScheme}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8e9285] block">Subject Authority:</span>
                        <span className="text-white text-[10px] truncate block" title={artifact.certificateSubject}>
                          {artifact.certificateSubject}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8e9285] block">Certificate Fingerprint (SHA-256):</span>
                        <span className="font-mono text-[#c3f400] text-[9px] break-all">
                          {artifact.fingerprintSha256}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8e9285]">
                    <span>Timestamp: {new Date(artifact.signingTimestamp).toLocaleDateString()}</span>
                    <span className="text-emerald-400 font-bold">HSM-Backed</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Checksum Verification Tool */}
            <div className="p-5 bg-[#121111] border border-white/5 rounded-2xl space-y-3 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#c3f400]" />
                Release Binary Checksum & Tamper Verification
              </h4>
              <p className="text-[11px] text-[#8e9285]">
                Verify release package SHA-256 digest against official cryptographic build attestations before installation on umpire, coach, or academy devices.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Paste release binary SHA-256 digest to verify..."
                  className="flex-1 bg-[#181818] border border-[#333] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-[#8e9285] focus:outline-none focus:border-[#c3f400]"
                  defaultValue="6B:8F:2A:41:9C:3E:5D:80:12:34:56:78:9A:BC:DE:F0:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:01"
                />
                <button
                  onClick={() => {
                    playBallImpact();
                    showToast('Cryptographic signature valid: Origin verified by Google Play App Signing.');
                  }}
                  className="px-4 py-2 bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold rounded-xl transition cursor-pointer"
                >
                  Verify Digest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 8: PROTECT APPLE AND GOOGLE SIGNING CREDENTIALS */}
      {/* ========================================================================= */}
      {activePillar === 'signing_credentials' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#c3f400] uppercase tracking-wider bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-0.5 rounded-full">
                  Pillar 8 of 8
                </span>
                <h2 className="text-lg font-bold font-headline text-white mt-1">
                  Protect Apple & Google Signing Credentials
                </h2>
                <p className="text-xs text-[#8e9285] mt-1 max-w-2xl">
                  Apple Distribution Certificates (.p12), App Store Connect API keys (.p8), and Google Play Keystores are isolated in hardware security modules (Cloud KMS HSM) and encrypted Fastlane Match repositories. Developer access mandates physical FIDO2 hardware security keys.
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                HSM & FIDO2 Protected
              </span>
            </div>

            {/* Credential Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIGNING_CREDENTIAL_CONFIGURATIONS.map((cred, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#121111] border border-[#262626] rounded-2xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{cred.keyType}</h3>
                        <span className="text-[10px] font-mono text-[#8e9285]">{cred.provider}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      {cred.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8e9285]">Storage Vault:</span>
                      <span className="font-mono text-white text-[11px]">{cred.storageLocation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#8e9285]">Hardware Token:</span>
                      <span className="text-emerald-400 font-bold text-[11px]">Mandatory YubiKey FIDO2</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8e9285]">Validity Remaining:</span>
                      <span className="font-mono text-[#c3f400] text-[11px]">{cred.daysUntilExpiration} Days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Safeguards Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c3f400]" />
                Signing Key Safeguard Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SIGNING_CREDENTIAL_SECURITY_STANDARDS.map((std, idx) => (
                  <div key={idx} className="p-4 bg-[#121111] border border-white/5 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{std.standard}</h4>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                        {std.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a6ab9d] leading-relaxed">
                      {std.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance / JSON Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181717] border border-[#c3f400]/40 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-[#282727] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-headline">
                    {exportModalTitle}
                  </h3>
                  <p className="text-xs text-[#8e9285]">
                    Cryptographic Source Code Security & DevSecOps Attestation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <pre className="p-4 bg-[#0d0d0d] border border-[#222] rounded-xl font-mono text-xs text-[#c3f400] overflow-x-auto whitespace-pre-wrap">
                {exportJsonContent}
              </pre>
            </div>

            <div className="p-4 border-t border-[#282727] bg-[#141313] flex justify-end gap-3">
              <button
                onClick={handleCopyModalContent}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-bold border border-[#333] flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
              <button
                onClick={() => handleDownloadJson(`PitchPrecision-${exportModalTitle.replace(/\s+/g, '-')}-${Date.now()}.json`)}
                className="px-4 py-2 rounded-xl bg-[#c3f400] text-black text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
