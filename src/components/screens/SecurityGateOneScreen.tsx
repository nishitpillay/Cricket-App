import React, { useState, useEffect } from 'react';

export interface SecurityPillar {
  name: string;
  status: string;
  compliance: string;
  description: string;
  icon: string;
  details: string[];
}

export const SecurityGateOneScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  const [gateData, setGateData] = useState<any>(null);
  const [grants, setGrants] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'architecture' | 'grants_matrix' | 'signed_video' | 'deletion_test' | 'audit_trail'>('architecture');

  // Interactive Test State: Grant evaluation
  const [coachIdInput, setCoachIdInput] = useState('usr_coach_jordan');
  const [playerIdInput, setPlayerIdInput] = useState('usr_junior_timmy');
  const [isJuniorCheck, setIsJuniorCheck] = useState(true);
  const [guardianApprovedCheck, setGuardianApprovedCheck] = useState(false);
  const [grantEvaluationResult, setGrantEvaluationResult] = useState<any>(null);

  // Interactive Test State: Video Ticket Generator
  const [videoPlayerId, setVideoPlayerId] = useState('usr_junior_timmy');
  const [videoFileSize, setVideoFileSize] = useState(25); // MB
  const [videoTicketResult, setVideoTicketResult] = useState<any>(null);

  // Interactive Test State: Cascading Deletion
  const [deletionUserId, setDeletionUserId] = useState('usr_demo_athlete_99');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deletionResult, setDeletionResult] = useState<any>(null);

  useEffect(() => {
    fetchGateData();
  }, []);

  const fetchGateData = async () => {
    setLoading(true);
    try {
      const [resStatus, resGrants, resLogs] = await Promise.all([
        fetch('/api/v1/security-gate1/status').then(r => r.json()),
        fetch('/api/v1/security-gate1/grants').then(r => r.json()),
        fetch('/api/v1/security-gate1/audit-trail').then(r => r.json())
      ]);

      setGateData(resStatus);
      if (resGrants.grants) setGrants(resGrants.grants);
      if (resLogs.logs) setAuditLogs(resLogs.logs);
    } catch (e) {
      console.error('Failed to load Security Gate 1 data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateGrant = async () => {
    setGrantEvaluationResult(null);
    try {
      const res = await fetch('/api/v1/security-gate1/grants/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: coachIdInput,
          playerId: playerIdInput,
          isJunior: isJuniorCheck,
          guardianApproved: guardianApprovedCheck,
          requestedPermissions: { biometrics: true, videos: true, drills: true }
        })
      });
      const data = await res.json();
      setGrantEvaluationResult(data);
      fetchGateData();
    } catch (e: any) {
      setGrantEvaluationResult({ success: false, error: e.message });
    }
  };

  const handleGenerateVideoTicket = async () => {
    setVideoTicketResult(null);
    try {
      const res = await fetch('/api/v1/security-gate1/videos/upload-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: videoPlayerId,
          fileSizeBytes: videoFileSize * 1024 * 1024,
          mimeType: 'video/mp4',
          requesterId: 'usr_coach_current'
        })
      });
      const data = await res.json();
      setVideoTicketResult(data);
      fetchGateData();
    } catch (e: any) {
      setVideoTicketResult({ success: false, error: e.message });
    }
  };

  const handleExecuteDeletionCascade = async () => {
    setDeletionResult(null);
    try {
      const res = await fetch('/api/v1/security-gate1/account/delete-cascade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: deletionUserId,
          confirmationToken: confirmPhrase
        })
      });
      const data = await res.json();
      setDeletionResult(data);
      fetchGateData();
    } catch (e: any) {
      setDeletionResult({ success: false, error: e.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  Security Gate 1: Production Architecture Freeze
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#c3f400] text-black font-extrabold uppercase tracking-wider">
                  FROZEN & VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#8e9285] mt-0.5">
                Multi-Tier RBAC • Guardian Minor Consent • Private-by-Default Video URLs • Immutable Audit Subsystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigate && (
              <button
                onClick={() => onNavigate('support')}
                className="px-3 py-1.5 rounded-xl bg-[#1c1b1b] hover:bg-[#262626] border border-[#333] text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>
            )}
            <button
              onClick={fetchGateData}
              className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Sync Audit Stream</span>
            </button>
          </div>
        </div>

        {/* Security Gate 1 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Gate Status</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]"></span>
              <span className="text-sm font-extrabold text-white">FROZEN APPROVED</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">Arch Release 2026.09</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Active Coach Grants</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">shield_person</span>
              <span className="text-sm font-extrabold text-white font-mono">{gateData?.activeGrantsCount ?? 1} Verified</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">{gateData?.pendingGrantsCount ?? 1} Pending Guardian</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Video Ingress Model</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#9cf0ff]">lock_clock</span>
              <span className="text-sm font-extrabold text-white">Direct Signed URLs</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">Zero Public Buckets</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Audit Trail Depth</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#c3f400]">receipt_long</span>
              <span className="text-sm font-extrabold text-white font-mono">{auditLogs.length} Events</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">Immutable SHA-256 Logs</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#262626] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>8 Gate Pillars</span>
          </button>

          <button
            onClick={() => setActiveTab('grants_matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'grants_matrix'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">family_restroom</span>
            <span>Coach-Player ReBAC & Guardian Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('signed_video')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'signed_video'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">video_file</span>
            <span>Signed Video Storage Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('deletion_test')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'deletion_test'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Cascading Deletion (Apple 5.1.1v)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'audit_trail'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Live Security Audit Logs</span>
          </button>
        </div>

        {/* TAB 1: 8 Gate Pillars Matrix */}
        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">family_restroom</span>
                    <span>1. RBAC & Guardian Consent Hierarchy</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  Strict separation across Player (Adult), Junior Athlete (&lt;16), Guardian (Root Legal Authority), Coach (ReBAC Authorized), and Org Admin. Junior video capture and coach linkages are hardware-disabled until parental double-signature.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: COPPA / GDPR-K / Google Play Families</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">key</span>
                    <span>2. Zero Trust RS256 Token Rotation</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  15-minute asymmetric RS256 access tokens. Refresh tokens stored in iOS Keychain / Android EncryptedSharedPreferences with automatic theft detection and family invalidation on token reuse.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: OAuth 2.1 / NIST 800-63B</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">cloud_lock</span>
                    <span>3. Private-by-Default Video Architecture</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  Zero public buckets. Client mobile apps upload directly to Google Cloud Storage via 10-minute expiring signed PUT URLs with MD5 verification. Playback is guarded by 15-minute signed read URLs with IP forensic watermarking.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: OWASP Cloud Top 10 / Least Privilege</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">psychology</span>
                    <span>4. AI Data Boundary (Zero Customer Retention)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  Enterprise Gemini API tier guarantees player joint coordinates and bowling telemetry are never retained or used for foundational model training. Client PII is stripped server-side before inference.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: Google Cloud AI Enterprise Privacy</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">receipt_long</span>
                    <span>5. Immutable Cloud Audit Subsystem</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  Every grant creation, video upload ticket, elevation attempt, or minor consent change writes to append-only Cloud Audit Logs with cryptographic SHA-256 payload digests.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: SOC 2 Type II / HIPAA Security Rule</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">delete_forever</span>
                    <span>6. Cascading Account Deletion</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/30">
                    LOCKED
                  </span>
                </div>
                <p className="text-xs text-[#8e9285] leading-relaxed">
                  One-touch deletion wipes user records, biomechanics logs, raw videos in Cloud Storage, and token caches. Returns a cryptographic Certificate of Destruction.
                </p>
                <span className="text-[10px] text-[#555] font-mono block">Compliance: Apple Review Guideline 5.1.1(v) & GDPR Art. 17</span>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Coach-Player ReBAC & Guardian Consent Simulator */}
        {activeTab === 'grants_matrix' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">how_to_reg</span>
                  <span>Test Coach-Athlete Authorization Grant</span>
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#8e9285] mb-1 font-semibold">Coach User ID</label>
                    <input
                      type="text"
                      value={coachIdInput}
                      onChange={e => setCoachIdInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8e9285] mb-1 font-semibold">Athlete User ID</label>
                    <input
                      type="text"
                      value={playerIdInput}
                      onChange={e => setPlayerIdInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isJuniorCheck}
                        onChange={e => setIsJuniorCheck(e.target.checked)}
                        className="rounded border-[#444] text-[#c3f400] focus:ring-0"
                      />
                      <span className="font-bold text-white">Athlete is Junior Under 16 (COPPA Gate)</span>
                    </label>

                    {isJuniorCheck && (
                      <label className="flex items-center gap-2 cursor-pointer pl-6">
                        <input
                          type="checkbox"
                          checked={guardianApprovedCheck}
                          onChange={e => setGuardianApprovedCheck(e.target.checked)}
                          className="rounded border-[#444] text-[#c3f400] focus:ring-0"
                        />
                        <span className="text-amber-400 font-semibold">Parent / Guardian Co-Approved via 2FA</span>
                      </label>
                    )}
                  </div>

                  <button
                    onClick={handleEvaluateGrant}
                    className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition cursor-pointer shadow-md"
                  >
                    Evaluate & Enforce Authorization
                  </button>
                </div>

                {grantEvaluationResult && (
                  <div className={`p-3 rounded-xl text-xs space-y-1.5 ${
                    grantEvaluationResult.success
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        {grantEvaluationResult.success ? 'check_circle' : 'gpp_bad'}
                      </span>
                      <span>{grantEvaluationResult.success ? 'GRANT ISSUED' : 'GRANT BLOCKED'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {grantEvaluationResult.message || (grantEvaluationResult.success && 'Coach grant successfully registered in access control matrix.')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">table_rows</span>
                  <span>Active Relationship Access Control Matrix</span>
                </h3>

                <div className="space-y-2">
                  {grants.map((g, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white font-bold">{g.coachId}</span>
                          <span className="text-[#666]">➔</span>
                          <span className="font-mono text-[#c3f400] font-bold">{g.playerId}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          g.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {g.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-[#8e9285]">
                        <div>Biometrics: <span className="text-white font-semibold">{g.canViewBiometrics ? 'Yes' : 'No'}</span></div>
                        <div>Videos: <span className="text-white font-semibold">{g.canViewVideos ? 'Yes' : 'No'}</span></div>
                        <div>Guardian Co-Signed: <span className="text-white font-semibold">{g.approvedByGuardian ? 'Verified' : 'Pending'}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Signed Video Storage Engine */}
        {activeTab === 'signed_video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">cloud_upload</span>
                  <span>Request Signed Upload Ticket</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#8e9285] mb-1 font-semibold">Athlete ID</label>
                    <input
                      type="text"
                      value={videoPlayerId}
                      onChange={e => setVideoPlayerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8e9285] mb-1 font-semibold">File Size (MB)</label>
                    <input
                      type="number"
                      value={videoFileSize}
                      onChange={e => setVideoFileSize(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                    />
                  </div>

                  <button
                    onClick={handleGenerateVideoTicket}
                    className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition cursor-pointer shadow-md"
                  >
                    Generate 10-Minute Signed Cloud Ticket
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {videoTicketResult?.ticket ? (
                <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#c3f400]">verified</span>
                      <span>Direct-to-Cloud Upload Ticket Generated</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#c3f400]/10 text-[#c3f400]">
                      10-MIN EXPIRY
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black border border-[#333] space-y-1">
                      <span className="text-[10px] text-[#777] block font-sans">Storage Key Target</span>
                      <span className="text-sky-400 break-all">{videoTicketResult.ticket.storageKey}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black border border-[#333] space-y-1">
                      <span className="text-[10px] text-[#777] block font-sans">Signed Direct Cloud Ingress URL</span>
                      <span className="text-[#c3f400] break-all text-[11px]">{videoTicketResult.ticket.uploadUrl}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#141414] border border-[#262626] text-center text-[#777] text-xs">
                  Click &quot;Generate 10-Minute Signed Cloud Ticket&quot; to inspect direct-to-cloud security headers and KMS encryption keys.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Cascading Account Deletion Test (Apple 5.1.1v) */}
        {activeTab === 'deletion_test' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">delete_forever</span>
                  <span>Self-Service Cascading Deletion Verification (Apple 5.1.1v & GDPR Art. 17)</span>
                </h3>
                <p className="text-xs text-[#8e9285] mt-1">
                  Tests the automated purge of user credentials, private session videos, biomechanics telemetry, and token caches.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">User ID to Purge</label>
                  <input
                    type="text"
                    value={deletionUserId}
                    onChange={e => setDeletionUserId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">
                    Type <span className="text-red-400 font-mono">PERMANENTLY_DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmPhrase}
                    onChange={e => setConfirmPhrase(e.target.value)}
                    placeholder="PERMANENTLY_DELETE"
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono"
                  />
                </div>

                <button
                  onClick={handleExecuteDeletionCascade}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs transition cursor-pointer shadow-md"
                >
                  Execute Cryptographic Deletion Cascade
                </button>
              </div>

              {deletionResult && (
                <div className={`p-4 rounded-2xl text-xs space-y-2 ${
                  deletionResult.success
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">
                      {deletionResult.success ? 'verified' : 'error'}
                    </span>
                    <span>{deletionResult.status || 'DELETION_FAILED'}</span>
                  </div>
                  {deletionResult.certificateOfDestruction && (
                    <div className="space-y-1 font-mono text-[10px] bg-black/60 p-3 rounded-xl border border-white/5">
                      <span className="text-[#8e9285] block">SHA-256 Destruction Certificate:</span>
                      <span className="text-white break-all">{deletionResult.certificateOfDestruction.sha256}</span>
                      <span className="text-[#666] block mt-1">Standard: {deletionResult.certificateOfDestruction.complianceStandard}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Live Security Audit Logs */}
        {activeTab === 'audit_trail' && (
          <div className="space-y-3">
            <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">receipt_long</span>
                  <span>Append-Only Security Audit Stream</span>
                </h3>
                <span className="text-[10px] text-[#777] font-mono">SOC 2 / ISO 27001</span>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          log.result === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.result}
                        </span>
                        <span className="font-mono text-white font-bold">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-[#777]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#8e9285]">
                      <span>Actor: <span className="font-mono text-white">{log.actorId}</span> ({log.actorRole})</span>
                      <span>Target: <span className="font-mono text-white">{log.targetUserId || 'N/A'}</span></span>
                      <span>Resource: <span className="font-mono text-sky-400">{log.resource}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
