import React, { useState } from 'react';
import { 
  Globe2, 
  Server, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Ban, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  Sliders, 
  Building2, 
  Download,
  Fingerprint,
  UserCheck
} from 'lucide-react';
import { 
  SUPPORTED_REGIONS, 
  getActiveHostingRegion, 
  setActiveHostingRegion, 
  getAustralianResidencyPolicy, 
  saveAustralianResidencyPolicy, 
  getChildDataProtectionPolicy, 
  saveChildDataProtectionPolicy, 
  getCrossBorderAuditLogs, 
  detectAustralianCustomer, 
  validateCrossBorderTransfer, 
  generateDataLocationCompliancePacket 
} from '../../utils/dataLocationManager';
import { CloudHostingRegion, UserProfile } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface DataLocationGovernanceSectionProps {
  currentUser?: UserProfile;
  onToast: (msg: string) => void;
}

export const DataLocationGovernanceSection: React.FC<DataLocationGovernanceSectionProps> = ({
  currentUser,
  onToast
}) => {
  const [activeRegion, setActiveRegionState] = useState<CloudHostingRegion>(getActiveHostingRegion);
  const [auPolicy, setAuPolicy] = useState(getAustralianResidencyPolicy);
  const [childPolicy, setChildPolicy] = useState(getChildDataProtectionPolicy);
  const [auditLogs, setAuditLogs] = useState(getCrossBorderAuditLogs);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [complianceJson, setComplianceJson] = useState('');

  // Cross-Border Simulator State
  const [simSourceRegion, setSimSourceRegion] = useState<CloudHostingRegion>('australia-southeast1');
  const [simTargetRegion, setSimTargetRegion] = useState<CloudHostingRegion>('us-central1');
  const [simIsChildData, setSimIsChildData] = useState(true);
  const [simDualConsent, setSimDualConsent] = useState(false);
  const [simResult, setSimResult] = useState<{
    allowed: boolean;
    actionTaken: string;
    reason: string;
    ruleCode: string;
  } | null>(null);

  const auDetection = detectAustralianCustomer(currentUser);
  const currentRegionConfig = SUPPORTED_REGIONS[activeRegion];

  const handleRegionChange = (newRegion: CloudHostingRegion) => {
    playBeep(700, 0.05);
    setActiveHostingRegion(newRegion);
    setActiveRegionState(newRegion);
    onToast(`Regional hosting updated to ${SUPPORTED_REGIONS[newRegion].regionName}.`);
  };

  const handleToggleAuResidency = (val: boolean) => {
    playBeep(650, 0.04);
    const updated = saveAustralianResidencyPolicy({ enforceAustralianResidency: val });
    setAuPolicy(updated);
    onToast(val ? 'Australian Sovereign Enclave (APP 8) activated.' : 'Australian residency enforcement set to relaxed.');
  };

  const handleToggleChildBlock = (val: boolean) => {
    playBeep(650, 0.04);
    const updated = saveChildDataProtectionPolicy({ blockCrossBorderTransfer: val });
    setChildPolicy(updated);
    onToast(val ? 'Cross-border transfer of children\'s data strictly blocked.' : 'Warning: International child data transfer guardrail disabled.');
  };

  const handleRunSimulator = () => {
    playBallImpact();
    const result = validateCrossBorderTransfer({
      payload: { sample: 'Biometrics & Video Analysis', juniorId: 'usr-kiyara-junior' },
      sourceRegion: simSourceRegion,
      targetRegion: simTargetRegion,
      isChildData: simIsChildData,
      dualGuardianConsentGranted: simDualConsent
    });
    setSimResult(result);
    setAuditLogs(getCrossBorderAuditLogs());
    onToast(result.allowed ? 'Boundary check passed.' : 'Intercepted: Cross-border transfer prohibited.');
  };

  const handleOpenCompliancePacket = () => {
    playBeep(880, 0.04);
    const packet = generateDataLocationCompliancePacket(currentUser);
    setComplianceJson(JSON.stringify(packet, null, 2));
    setComplianceModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Australian Cloud Region Recommendation Banner */}
      <div className="bg-gradient-to-r from-[#1c2e17] via-[#1a2319] to-[#171c26] border-2 border-[#c3f400]/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🇦🇺</span>
              <span className="px-3 py-1 rounded-full bg-[#c3f400]/20 border border-[#c3f400]/40 text-[#c3f400] text-xs font-extrabold uppercase tracking-wider">
                Australian Data Sovereignty Enclave
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                APP 8 Compliant
              </span>
            </div>
            <h2 className="text-xl font-bold font-headline text-white tracking-tight">
              Domestic Cloud Hosting for Australian Players & Academies
            </h2>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">
              In accordance with <strong className="text-white">Australian Privacy Principle 8 (APP 8)</strong> and the <strong className="text-white">Privacy Act 1988 (Cth)</strong>, Australian player records, bowling biomechanics, and junior training videos are strongly recommended to be hosted exclusively within an Australian cloud region (<strong className="text-[#c3f400]">Sydney: australia-southeast1</strong> or <strong className="text-[#c3f400]">Melbourne: australia-southeast2</strong>).
            </p>
            {auDetection.isAustralian && (
              <div className="p-3 bg-black/40 border border-[#c3f400]/30 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#c3f400]">
                  <CheckCircle2 className="w-4 h-4" />
                  Australian Customer Profile Detected
                </div>
                <p className="text-[11px] text-[#8e9285]">
                  {auDetection.recommendation}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-auto p-4 bg-black/50 border border-white/10 rounded-2xl flex flex-col gap-2 min-w-[240px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Australian Pinned Mode</span>
                <button
                  onClick={() => handleToggleAuResidency(!auPolicy.enforceAustralianResidency)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    auPolicy.enforceAustralianResidency ? 'bg-[#c3f400]' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                      auPolicy.enforceAustralianResidency ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              <span className="text-[10px] text-[#8e9285]">
                Locks database cluster and video storage bucket strictly within Australia.
              </span>
            </div>

            <button
              onClick={handleOpenCompliancePacket}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#3e3d3d] text-xs font-bold text-white flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-[#c3f400]" />
              Data Sovereignty Statement
            </button>
          </div>
        </div>
      </div>

      {/* Regional Hosting Architecture Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-headline flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#c3f400]" />
              Supported Regional Cloud Infrastructure
            </h3>
            <p className="text-xs text-[#8e9285]">
              Select primary tenancy region for data persistence, video vaults, and KMS key rings.
            </p>
          </div>
          <span className="text-xs font-mono text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/20 px-3 py-1 rounded-full">
            Active: {currentRegionConfig.regionName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(SUPPORTED_REGIONS) as CloudHostingRegion[]).map((regionKey) => {
            const region = SUPPORTED_REGIONS[regionKey];
            const isSelected = activeRegion === regionKey;
            const isAustralian = regionKey.startsWith('australia-');

            return (
              <div
                key={regionKey}
                onClick={() => handleRegionChange(regionKey)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1e2316] border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.15)] ring-1 ring-[#c3f400]'
                    : 'bg-[#181717] hover:bg-[#1f1e1e] border-[#292828]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{region.flagEmoji}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {region.regionName}
                        </h4>
                        <span className="text-[10px] font-mono text-[#8e9285]">
                          {region.activeRegion}
                        </span>
                      </div>
                    </div>

                    {isAustralian && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-extrabold uppercase">
                        AU Sovereign
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#c4c9ac] mb-3">
                    {region.dataCenterCity}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-[#8e9285] border-t border-white/5 pt-3 mb-3">
                    <div className="flex justify-between">
                      <span>Firestore Cluster:</span>
                      <span className="font-mono text-white text-[10px] truncate max-w-[140px]" title={region.firestoreCluster}>
                        {region.firestoreCluster}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Media Bucket:</span>
                      <span className="font-mono text-white text-[10px] truncate max-w-[140px]" title={region.mediaStorageBucket}>
                        {region.mediaStorageBucket}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Latency:</span>
                      <span className="font-mono text-emerald-400 text-[10px] font-bold">
                        ~{region.latencyMs} ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Operational</span>
                  </div>
                  {isSelected ? (
                    <span className="text-xs font-bold text-[#c3f400] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Current Active Region
                    </span>
                  ) : (
                    <span className="text-xs text-[#8e9285] hover:text-white flex items-center gap-1">
                      Select Region <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Child Information Cross-Border Protection Guardrail */}
      <div className="bg-[#181717] border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#282727] pb-5">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-headline">
                  Child Protection & International Transfer Safeguards
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                  Zero International Egress
                </span>
              </div>
              <p className="text-xs text-[#8e9285] mt-1">
                Avoid unnecessary international transfer of children's information. Minors' records stay strictly in-country.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white">Block Overseas Child Transfer</span>
            <button
              onClick={() => handleToggleChildBlock(!childPolicy.blockCrossBorderTransfer)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                childPolicy.blockCrossBorderTransfer ? 'bg-purple-500' : 'bg-[#333]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                  childPolicy.blockCrossBorderTransfer ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Protection Core Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#111] rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Ban className="w-4 h-4" />
              Domestic In-Country Boundary
            </div>
            <p className="text-[11px] text-[#a6ab9d] leading-relaxed">
              Junior player profile data, contact information, DoBs, and technique videos cannot be replicated or transferred to foreign cloud databases.
            </p>
          </div>

          <div className="p-4 bg-[#111] rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Fingerprint className="w-4 h-4" />
              In-Region Edge AI Processing
            </div>
            <p className="text-[11px] text-[#a6ab9d] leading-relaxed">
              Batting and bowling computer vision models run strictly on local Australian edge nodes with zero overseas model training or frame persistence.
            </p>
          </div>

          <div className="p-4 bg-[#111] rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              Dual-Guardian Tour Exceptions
            </div>
            <p className="text-[11px] text-[#a6ab9d] leading-relaxed">
              If an overseas junior cricket tour requires temporary access, both verified guardian consent and club safeguarding officer digital tokens are strictly required.
            </p>
          </div>
        </div>

        {/* Interactive Cross-Border Transfer Boundary Simulator */}
        <div className="bg-[#121111] p-5 rounded-2xl border border-[#2a2929] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#c3f400]" />
              Interactive Boundary Transfer Validator
            </h4>
            <span className="text-[11px] text-[#8e9285]">
              Simulate real-time data transit attempt against compliance policies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#8e9285] mb-1">Source Cloud Region</label>
              <select
                value={simSourceRegion}
                onChange={(e) => setSimSourceRegion(e.target.value as any)}
                className="w-full bg-[#1c1b1b] border border-[#333] rounded-xl p-2.5 text-white text-xs"
              >
                <option value="australia-southeast1">🇦🇺 Australia East (Sydney)</option>
                <option value="australia-southeast2">🇦🇺 Australia Southeast (Melb)</option>
                <option value="europe-west2">🇬🇧 United Kingdom (London)</option>
                <option value="asia-south1">🇮🇳 India (Mumbai)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#8e9285] mb-1">Proposed Destination</label>
              <select
                value={simTargetRegion}
                onChange={(e) => setSimTargetRegion(e.target.value as any)}
                className="w-full bg-[#1c1b1b] border border-[#333] rounded-xl p-2.5 text-white text-xs"
              >
                <option value="us-central1">🇺🇸 North America (Iowa)</option>
                <option value="europe-west3">🇪🇺 European Union (Frankfurt)</option>
                <option value="australia-southeast2">🇦🇺 Australia Southeast (Melb - Domestic)</option>
                <option value="australia-southeast1">🇦🇺 Australia East (Sydney - Domestic)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 bg-[#1c1b1b] rounded-xl border border-[#333] cursor-pointer">
                <input
                  type="checkbox"
                  checked={simIsChildData}
                  onChange={(e) => setSimIsChildData(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
                <span className="text-white text-[11px] font-bold">Contains Minor's Data</span>
              </label>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={handleRunSimulator}
                className="w-full py-2.5 px-4 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition shadow-[0_0_15px_rgba(195,244,0,0.2)]"
              >
                Validate Transfer
              </button>
            </div>
          </div>

          {/* Result Box */}
          {simResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 animate-in fade-in ${
              simResult.allowed 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {simResult.allowed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>TRANSFER PERMITTED (Domestic In-Country Residency)</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-5 h-5 text-rose-400" />
                    <span>CROSS-BORDER TRANSFER INTERCEPTED & BLOCKED</span>
                  </>
                )}
                <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 border border-current">
                  {simResult.ruleCode}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#c4c9ac]">
                {simResult.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Cross-Border Interception Audit Log */}
      <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c3f400]" />
              Data Sovereignty Boundary Interception Trail
            </h3>
            <p className="text-xs text-[#8e9285]">
              Cryptographic audit log of cross-border evaluations and blocked foreign transfers.
            </p>
          </div>
          <span className="text-xs font-mono text-[#8e9285]">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map((log) => {
            const isBlocked = log.decision.startsWith('BLOCKED');
            return (
              <div
                key={log.id}
                className="p-3.5 bg-[#121111] border border-[#242323] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      isBlocked ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {log.decision}
                    </span>
                    <span className="text-white font-bold">{log.dataType}</span>
                    <span className="text-[#8e9285] font-mono text-[10px]">{log.playerIdentifierMasked}</span>
                  </div>
                  <p className="text-[11px] text-[#a6ab9d]">
                    {log.reason}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-[11px] text-white">
                    {log.sourceRegion} ➔ {log.targetRegion}
                  </div>
                  <div className="text-[10px] text-[#8e9285]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Statement Modal */}
      {complianceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181717] border border-[#c3f400]/40 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-[#282727] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-headline">
                    Data Location & Sovereignty Compliance Packet
                  </h3>
                  <p className="text-xs text-[#8e9285]">
                    APP 8 / Australian Cloud Hosting & Child Protection Verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setComplianceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <pre className="p-4 bg-[#0d0d0d] border border-[#222] rounded-xl font-mono text-xs text-[#c3f400] overflow-x-auto whitespace-pre-wrap">
                {complianceJson}
              </pre>
            </div>

            <div className="p-4 border-t border-[#282727] bg-[#141313] flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(complianceJson);
                  onToast('Compliance statement copied to clipboard.');
                }}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-bold border border-[#333]"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([complianceJson], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `PitchPrecision-Data-Sovereignty-Audit-AU-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  onToast('Compliance statement downloaded.');
                }}
                className="px-4 py-2 rounded-xl bg-[#c3f400] text-black text-xs font-extrabold"
              >
                Download Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
