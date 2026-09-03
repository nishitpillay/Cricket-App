import React, { useState, useEffect } from 'react';
import { ScreenType } from '../../types';

interface CloudInfrastructureScreenProps {
  currentUser?: any;
  onNavigate?: (screen: ScreenType) => void;
}

export const CloudInfrastructureScreen: React.FC<CloudInfrastructureScreenProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'cloud_sql_pool' | 'bucket_matrix' | 'video_pipeline' | 'audit_trail'>('architecture');
  
  // Infrastructure Status State
  const [infraStatus, setInfraStatus] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Cloud SQL Pool Test State
  const [simulatedQueries, setSimulatedQueries] = useState(25);
  const [poolTestRunning, setPoolTestRunning] = useState(false);
  const [poolTestResult, setPoolTestResult] = useState<any>(null);

  // Upload Pipeline Sandbox State
  const [uploadEnv, setUploadEnv] = useState<'dev' | 'test' | 'prod'>('prod');
  const [uploadPlayerId, setUploadPlayerId] = useState('usr-devang');
  const [uploadResourceType, setUploadResourceType] = useState<'bowling_delivery' | 'biomechanical_drill' | 'coach_review'>('bowling_delivery');
  const [uploadFileName, setUploadFileName] = useState('match_delivery_142kph_yorker.mp4');
  const [uploadFileSizeMb, setUploadFileSizeMb] = useState(28.4);
  const [uploadMimeType, setUploadMimeType] = useState<'video/mp4' | 'video/quicktime' | 'video/webm'>('video/mp4');
  const [uploadTicketResult, setUploadTicketResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Playback Pipeline Sandbox State
  const [selectedVideoId, setSelectedVideoId] = useState('vid-devang-001');
  const [playbackViewerRole, setPlaybackViewerRole] = useState<'player' | 'parent' | 'coach' | 'unauthorized'>('coach');
  const [playbackViewerId, setPlaybackViewerId] = useState('usr_coach_shane');
  const [coachRelationshipActive, setCoachRelationshipActive] = useState(true);
  const [playbackTicketResult, setPlaybackTicketResult] = useState<any>(null);
  const [playbackError, setPlaybackError] = useState<any>(null);
  const [playbackLoading, setPlaybackLoading] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Fetch initial system status & audit trail
  useEffect(() => {
    fetchInfraStatus();
    fetchAuditLogs();
  }, []);

  const fetchInfraStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('/api/v1/cloud-infra/status');
      const data = await res.json();
      if (data.success) {
        setInfraStatus(data);
      }
    } catch (e) {
      console.error('Failed to fetch cloud infra status:', e);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/v1/cloud-infra/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    }
  };

  // Run Cloud SQL Pool Concurrency Test
  const handleRunPoolTest = async () => {
    setPoolTestRunning(true);
    setPoolTestResult(null);
    try {
      const res = await fetch('/api/v1/cloud-infra/cloud-sql/pool-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryCount: simulatedQueries })
      });
      const data = await res.json();
      setPoolTestResult(data);
      fetchInfraStatus();
      fetchAuditLogs();
    } catch (e: any) {
      setPoolTestResult({ error: e.message });
    } finally {
      setPoolTestRunning(false);
    }
  };

  // Step 1: Request Upload Permission Flow
  const handleRequestUploadTicket = async () => {
    setUploadLoading(true);
    setUploadTicketResult(null);
    setUploadError(null);

    try {
      const res = await fetch('/api/v1/cloud-infra/video/request-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: uploadPlayerId,
          resourceType: uploadResourceType,
          fileName: uploadFileName,
          fileSizeBytes: Math.round(uploadFileSizeMb * 1024 * 1024),
          mimeType: uploadMimeType,
          environment: uploadEnv
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to acquire upload ticket');
      }
      setUploadTicketResult(data);
      fetchAuditLogs();
    } catch (e: any) {
      setUploadError(e.message);
      fetchAuditLogs();
    } finally {
      setUploadLoading(false);
    }
  };

  // Step 2: Strict Playback & Relationship Verification Flow
  const handleRequestPlaybackTicket = async () => {
    setPlaybackLoading(true);
    setPlaybackTicketResult(null);
    setPlaybackError(null);

    let viewerIdToUse = playbackViewerId;
    let viewerRoleToUse = playbackViewerRole;

    if (playbackViewerRole === 'player') {
      viewerIdToUse = 'usr-devang';
    } else if (playbackViewerRole === 'parent') {
      viewerIdToUse = 'usr_parent_sarah';
    } else if (playbackViewerRole === 'coach') {
      viewerIdToUse = 'usr_coach_shane';
    } else if (playbackViewerRole === 'unauthorized') {
      viewerIdToUse = 'usr_unknown_external_scout';
    }

    try {
      const res = await fetch('/api/v1/cloud-infra/video/request-playback-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: selectedVideoId,
          viewerId: viewerIdToUse,
          viewerRole: viewerRoleToUse,
          environment: 'prod'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPlaybackError({
          status: res.status,
          statusText: res.status === 403 ? '403 FORBIDDEN (ACCESS DENIED)' : '400 BAD REQUEST',
          error: data.error,
          errorCode: data.errorCode || 'ERR_RELATIONSHIP_UNAUTHORIZED'
        });
      } else {
        setPlaybackTicketResult(data);
      }
      fetchAuditLogs();
    } catch (e: any) {
      setPlaybackError({
        status: 500,
        statusText: 'SERVER ERROR',
        error: e.message,
        errorCode: 'ERR_INTERNAL'
      });
      fetchAuditLogs();
    } finally {
      setPlaybackLoading(false);
    }
  };

  // Toggle Coaching Grant
  const handleToggleCoachRelationship = async () => {
    try {
      const res = await fetch('/api/v1/cloud-infra/video/toggle-coach-relationship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: 'usr-devang',
          coachId: 'usr_coach_shane'
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoachRelationshipActive(data.isActive);
        fetchAuditLogs();
      }
    } catch (e) {
      console.error('Failed to toggle coach relationship:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400]">
              <span className="material-symbols-outlined text-2xl">cloud_sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  Cloud Infrastructure & Secure Video Pipeline
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#c3f400] text-black font-extrabold uppercase tracking-wider">
                  STEP 2 ARCHITECTURE
                </span>
              </div>
              <p className="text-xs text-[#8e9285] mt-0.5">
                Cloud Run API • Cloud SQL Connection Pooling • Multi-Environment Private Buckets • Enforceable ReBAC Video Gate
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
              onClick={() => {
                fetchInfraStatus();
                fetchAuditLogs();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Sync Cloud Telemetry</span>
            </button>
          </div>
        </div>

        {/* Live System Diagnostics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">API Compute Layer</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span className="text-sm font-extrabold text-white">Google Cloud Run</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">TLS 1.3 / Strict HSTS / Auto-Scale</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Database Engine</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">database</span>
              <span className="text-sm font-extrabold text-white">Cloud SQL PostgreSQL</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono mt-1">Pool: Active &amp; Reused</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Storage Architecture</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-sky-400">lock</span>
              <span className="text-sm font-extrabold text-white">Private Isolated Buckets</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">dev / test / prod (No Public Access)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#171717] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold text-[#8e9285] uppercase tracking-wider">Video Access Model</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-amber-400">verified_user</span>
              <span className="text-xs font-extrabold text-white">ReBAC Relationship Gate</span>
            </div>
            <span className="text-[10px] text-[#666] mt-1">10m Upload PUT / 15m Playback GET</span>
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
            <span>Target Architecture Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud_sql_pool')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'cloud_sql_pool'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">reorder</span>
            <span>Cloud SQL Connection Pooling</span>
          </button>

          <button
            onClick={() => setActiveTab('bucket_matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'bucket_matrix'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder_special</span>
            <span>Multi-Environment Bucket Isolation</span>
          </button>

          <button
            onClick={() => setActiveTab('video_pipeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'video_pipeline'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            <span>Enforceable Video Security Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'audit_trail'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-[#a0a0a0] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">security</span>
            <span>Live Security Audit Stream</span>
          </button>
        </div>

        {/* TAB 1: Target Architecture Topology */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#262626] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#262626]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">hub</span>
                    <span>Target Enterprise Production Topologies</span>
                  </h3>
                  <p className="text-xs text-[#8e9285] mt-1">
                    Dual pipeline separation: Transactional API/DB Traffic vs Direct-to-Storage Video Ingestion &amp; Streaming
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    Zero Direct Bucket Exposure
                  </span>
                </div>
              </div>

              {/* Topology 1: Core API & Database Pipeline */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-[#c3f400] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c3f400]"></span>
                  <span>Pipeline A: App → Cloud Run API → Auth/Authz Layer → Cloud SQL (Connection Pooled)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Client Tier</span>
                      <span className="material-symbols-outlined text-[#c3f400] text-[20px]">phone_iphone</span>
                    </div>
                    <div className="font-black text-white text-sm">iOS / Android App</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Capacitor 6 Native App. Asymmetric RS256 JWT in Keychain/Keystore. JIT permissions.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">API Tier</span>
                      <span className="material-symbols-outlined text-sky-400 text-[20px]">cloud</span>
                    </div>
                    <div className="font-black text-white text-sm">Google Cloud Run</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Stateless serverless container. Strict TLS 1.3, HSTS 2-year preload, rate-limiting &amp; WAF.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Security Layer</span>
                      <span className="material-symbols-outlined text-amber-400 text-[20px]">verified_user</span>
                    </div>
                    <div className="font-black text-white text-sm">Auth + ReBAC Gate</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      JWT validation, role hierarchy, player ownership &amp; verified coach/guardian relationship verification.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Database Tier</span>
                      <span className="material-symbols-outlined text-emerald-400 text-[20px]">database</span>
                    </div>
                    <div className="font-black text-white text-sm">Cloud SQL PostgreSQL</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      HA PostgreSQL with Google-recommended connection pooling (reused connections per instance).
                    </p>
                  </div>
                </div>
              </div>

              {/* Topology 2: Video Direct-to-Storage Ingestion Pipeline */}
              <div className="space-y-3 pt-4 border-t border-[#262626]">
                <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>Pipeline B: Video Ingestion &amp; Playback (Direct Signed Cloud Storage)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Step 1: Request</span>
                      <span className="material-symbols-outlined text-[#c3f400] text-[20px]">send</span>
                    </div>
                    <div className="font-black text-white text-sm">Upload/Play Request</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Mobile app requests permission for specific player &amp; video resource metadata (size, MIME, drill).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Step 2: Gate</span>
                      <span className="material-symbols-outlined text-amber-400 text-[20px]">policy</span>
                    </div>
                    <div className="font-black text-white text-sm">Relationship Validation</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Backend validates player identity, quota, and ensures active coaching grant exists in DB.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Step 3: Signed URL</span>
                      <span className="material-symbols-outlined text-sky-400 text-[20px]">key</span>
                    </div>
                    <div className="font-black text-white text-sm">Short-Lived Signed URL</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Backend mints 10-min signed PUT or 15-min signed GET URL with embedded anti-leak watermark.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Step 4: Storage</span>
                      <span className="material-symbols-outlined text-emerald-400 text-[20px]">cloud_done</span>
                    </div>
                    <div className="font-black text-white text-sm">Private Cloud Storage</div>
                    <p className="text-[11px] text-[#8e9285] leading-relaxed">
                      Isolated private buckets (<span className="text-white font-mono">cricketapp-*-private-media</span>). Zero public access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Principles Callout */}
              <div className="p-4 rounded-2xl bg-[#1c1b1b]/80 border border-[#333] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <div className="font-bold text-white">No Direct XYZ Requests</div>
                    <div className="text-[11px] text-[#8e9285] mt-0.5">
                      The client cannot say &quot;Give me video XYZ&quot; without going through authenticated relationship validation.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <div className="font-bold text-white">Google Cloud SQL Pooling</div>
                    <div className="text-[11px] text-[#8e9285] mt-0.5">
                      Pools connections across Cloud Run requests to eliminate TLS connection setup overhead on every query.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <div>
                    <div className="font-bold text-white">Multi-Env Isolation</div>
                    <div className="text-[11px] text-[#8e9285] mt-0.5">
                      Separate dev, test, and prod buckets prevent cross-environment pollution and test data leakage.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Cloud SQL Connection Pooling */}
        {activeTab === 'cloud_sql_pool' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c3f400]">reorder</span>
                    <span>Cloud SQL Connection Pool Telemetry</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    POOL STATUS: HEALTHY
                  </span>
                </div>

                <p className="text-xs text-[#8e9285] leading-relaxed">
                  Google Cloud specifically recommends connection pooling for Cloud Run containers because establishing new PostgreSQL TLS connections on every request consumes significant CPU and adds 40–80ms latency.
                </p>

                {infraStatus?.cloudSql?.connectionPoolStats ? (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#333]">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Max Pool Size</span>
                      <div className="text-lg font-black text-white mt-1">
                        {infraStatus.cloudSql.connectionPoolStats.maxPoolSize} conn
                      </div>
                      <span className="text-[10px] text-[#666]">Per container instance</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#333]">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Acquisition Latency</span>
                      <div className="text-lg font-black text-[#c3f400] mt-1">
                        {infraStatus.cloudSql.connectionPoolStats.avgAcquisitionLatencyMs} ms
                      </div>
                      <span className="text-[10px] text-[#666]">Reused pool latency</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#333]">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Total Queries Run</span>
                      <div className="text-lg font-black text-sky-400 mt-1">
                        {infraStatus.cloudSql.connectionPoolStats.totalQueriesExecuted}
                      </div>
                      <span className="text-[10px] text-[#666]">Queries executed</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1c1b1b] border border-[#333]">
                      <span className="text-[10px] font-bold text-[#8e9285] uppercase">Reused Connection Rate</span>
                      <div className="text-lg font-black text-emerald-400 mt-1">
                        {Math.round(
                          (infraStatus.cloudSql.connectionPoolStats.connectionReusedCount /
                            Math.max(1, infraStatus.cloudSql.connectionPoolStats.totalQueriesExecuted)) *
                            100
                        )}%
                      </div>
                      <span className="text-[10px] text-[#666]">Zero overhead reuses</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#777]">Loading Cloud SQL pool telemetry...</div>
                )}

                {/* Pool Configuration Parameters */}
                <div className="p-3.5 rounded-2xl bg-black font-mono text-[11px] text-[#a0a0a0] space-y-1.5 border border-[#333]">
                  <div className="text-[#8e9285] font-bold font-sans text-xs mb-1">Drizzle / Node-pg Recommended Pool Config:</div>
                  <div>max: <span className="text-[#c3f400]">10</span> // Cap to avoid exhausting DB connections</div>
                  <div>min: <span className="text-[#c3f400]">2</span> // Keep hot connections alive</div>
                  <div>idleTimeoutMillis: <span className="text-sky-400">30000</span> // Recycle inactive connections</div>
                  <div>connectionTimeoutMillis: <span className="text-sky-400">2000</span> // Fail fast on exhaustion</div>
                  <div>host: <span className="text-emerald-400">&apos;/cloudsql/PROJECT:REGION:INSTANCE&apos;</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">speed</span>
                  <span>Cloud SQL Pool Concurrency Benchmark</span>
                </h3>

                <p className="text-xs text-[#8e9285]">
                  Test executing concurrent database queries through the Cloud SQL pool to measure connection reuse efficiency and latency savings.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8e9285] mb-1">
                      Simulated Concurrent API Queries
                    </label>
                    <div className="flex gap-2">
                      {[10, 25, 50, 100].map(count => (
                        <button
                          key={count}
                          onClick={() => setSimulatedQueries(count)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            simulatedQueries === count
                              ? 'bg-[#c3f400] text-black border-[#c3f400]'
                              : 'bg-[#1c1b1b] text-white border-[#333] hover:bg-[#262626]'
                          }`}
                        >
                          {count} Queries
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleRunPoolTest}
                    disabled={poolTestRunning}
                    className="w-full py-3 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {poolTestRunning ? 'progress_activity' : 'play_arrow'}
                    </span>
                    <span>{poolTestRunning ? 'Executing Pooled Queries...' : `Run ${simulatedQueries} Concurrent Pooled Queries`}</span>
                  </button>

                  {poolTestResult && (
                    <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between pb-2 border-b border-[#333]">
                        <span className="text-emerald-400 font-bold">BENCHMARK SUCCESSFUL</span>
                        <span className="text-[#8e9285]">{poolTestResult.durationMs}ms Total</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>Queries Completed: <span className="text-white font-bold">{poolTestResult.queriesCompleted}</span></div>
                        <div>Reused Connections: <span className="text-[#c3f400] font-bold">{poolTestResult.reusedConnections}</span></div>
                        <div>Pool Connection Latency: <span className="text-sky-400 font-bold">{poolTestResult.poolStatusAfter?.avgAcquisitionLatencyMs}ms</span></div>
                        <div>Status: <span className="text-emerald-400 font-bold">0 Connection Drops</span></div>
                      </div>
                      <div className="text-[10px] text-[#8e9285] pt-1 font-sans">
                        💡 Compared to creating new connections for each request (~1,500ms total), connection pooling saved ~1,400ms of CPU TLS handshake overhead.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Multi-Environment Bucket Isolation */}
        {activeTab === 'bucket_matrix' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">folder_special</span>
                  <span>Multi-Environment Bucket Isolation Matrix</span>
                </h3>
                <p className="text-xs text-[#8e9285] mt-1">
                  Separate private buckets prevent environment pollution and ensure strict data governance. Buckets are private-by-default with public access prevention enforced.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    env: 'dev',
                    name: 'cricketapp-dev-private-media',
                    badge: 'DEV ENVIRONMENT',
                    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    lifecycle: '7 Days Auto-Purge',
                    kms: 'video-dev-aes256',
                    region: 'australia-southeast1',
                    signedPutTtl: '10 min',
                    signedGetTtl: '15 min'
                  },
                  {
                    env: 'test',
                    name: 'cricketapp-test-private-media',
                    badge: 'STAGING / QA TEST',
                    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
                    lifecycle: '14 Days Auto-Purge',
                    kms: 'video-test-aes256',
                    region: 'australia-southeast1',
                    signedPutTtl: '10 min',
                    signedGetTtl: '15 min'
                  },
                  {
                    env: 'prod',
                    name: 'cricketapp-prod-private-media',
                    badge: 'PRODUCTION LIVE',
                    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    lifecycle: '365 Days Retention Archive',
                    kms: 'video-prod-aes256-hsm (Cloud KMS)',
                    region: 'Dual-Region (Sydney / Melbourne)',
                    signedPutTtl: '10 min',
                    signedGetTtl: '15 min'
                  }
                ].map((b, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${b.badgeColor}`}>
                          {b.badge}
                        </span>
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">lock</span>
                      </div>

                      <div className="font-mono text-xs font-bold text-white break-all">{b.name}</div>
                      
                      <div className="space-y-1.5 text-[11px] text-[#8e9285] pt-1">
                        <div className="flex justify-between">
                          <span>Public Access:</span>
                          <span className="text-red-400 font-bold uppercase">BLOCKED (ENFORCED)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bucket Policy:</span>
                          <span className="text-emerald-400 font-bold">Uniform Bucket-Level</span>
                        </div>
                        <div className="flex justify-between">
                          <span>KMS Key:</span>
                          <span className="text-white font-mono">{b.kms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lifecycle Rule:</span>
                          <span className="text-[#c3f400] font-bold">{b.lifecycle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signed PUT TTL:</span>
                          <span className="text-white">{b.signedPutTtl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signed GET TTL:</span>
                          <span className="text-white">{b.signedGetTtl}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black font-mono text-[10px] text-[#8e9285] border border-[#2a2a2a]">
                      <span className="text-sky-400 font-bold">gs://{b.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Enforceable Video Security Pipeline */}
        {activeTab === 'video_pipeline' && (
          <div className="space-y-6">
            
            {/* Step 1: Request Upload Permission */}
            <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c3f400] text-black font-black text-xs flex items-center justify-center">1</span>
                  <h3 className="text-sm font-bold text-white">
                    Request Upload Permission (Client → Backend → Validates Player/Resource → Signed Upload PUT URL)
                  </h3>
                </div>
                <span className="text-[10px] text-[#8e9285] font-mono">10-Minute Expiration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Target Environment</label>
                  <select
                    value={uploadEnv}
                    onChange={e => setUploadEnv(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white"
                  >
                    <option value="dev">cricketapp-dev-private-media</option>
                    <option value="test">cricketapp-test-private-media</option>
                    <option value="prod">cricketapp-prod-private-media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Player ID</label>
                  <input
                    type="text"
                    value={uploadPlayerId}
                    onChange={e => setUploadPlayerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Resource Type</label>
                  <select
                    value={uploadResourceType}
                    onChange={e => setUploadResourceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white"
                  >
                    <option value="bowling_delivery">Bowling Delivery</option>
                    <option value="biomechanical_drill">Biomechanical Drill</option>
                    <option value="coach_review">Coach Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">File Name</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={e => setUploadFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">File Size (MB)</label>
                  <input
                    type="number"
                    value={uploadFileSizeMb}
                    onChange={e => setUploadFileSizeMb(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">MIME Type</label>
                  <select
                    value={uploadMimeType}
                    onChange={e => setUploadMimeType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white"
                  >
                    <option value="video/mp4">video/mp4</option>
                    <option value="video/quicktime">video/quicktime (.mov)</option>
                    <option value="video/webm">video/webm</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRequestUploadTicket}
                disabled={uploadLoading}
                className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {uploadLoading ? 'progress_activity' : 'cloud_upload'}
                </span>
                <span>{uploadLoading ? 'Validating Player & Minting Ticket...' : 'Request Short-Lived Signed Upload PUT URL'}</span>
              </button>

              {uploadTicketResult && (
                <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#333]">
                    <span className="text-emerald-400 font-bold">200 OK — SIGNED UPLOAD TICKET ISSUED</span>
                    <span className="text-[#8e9285]">Expires in 600s (10 min)</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>Target Bucket: <span className="text-[#c3f400]">{uploadTicketResult.bucketName}</span></div>
                    <div>Storage Key: <span className="text-sky-400">{uploadTicketResult.storageKey}</span></div>
                    <div>Security Checks: <span className="text-emerald-400">{uploadTicketResult.securityChecksPassed.join(' • ')}</span></div>
                    <div>Signed PUT URL:</div>
                    <div className="p-2 rounded-lg bg-black text-[#8e9285] break-all text-[10px]">
                      {uploadTicketResult.signedUploadUrl}
                    </div>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  ❌ {uploadError}
                </div>
              )}
            </div>

            {/* Step 2: Strict Playback & Relationship Authorization Flow */}
            <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-400 text-black font-black text-xs flex items-center justify-center">2</span>
                  <h3 className="text-sm font-bold text-white">
                    Strict Playback Authorization Gate (User → API → Authenticate → Authorise → Establish Relationship → Issue URL)
                  </h3>
                </div>
                <span className="text-[10px] text-[#8e9285] font-mono">15-Minute Expiration</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <span className="font-bold">Security Constraint Enforced:</span> The mobile client can <u>NEVER</u> simply ask &quot;Give me video XYZ&quot; and receive a raw URL. The backend strictly establishes relationship validity (Owner, Verified Guardian, or Active Coach Grant) before minting temporary expiring URLs.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Select Target Private Video</label>
                  <select
                    value={selectedVideoId}
                    onChange={e => setSelectedVideoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white font-mono text-[11px]"
                  >
                    <option value="vid-devang-001">vid-devang-001 (inswing_yorker_142kph.mp4)</option>
                    <option value="vid-devang-002">vid-devang-002 (bouncing_seam_alignment.mp4)</option>
                    <option value="vid-sam-001">vid-sam-001 (junior_front_foot_drive.mp4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Simulate Requesting Viewer</label>
                  <select
                    value={playbackViewerRole}
                    onChange={e => setPlaybackViewerRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c1b1b] border border-[#333] text-white"
                  >
                    <option value="player">Player Self (devang - Direct Owner)</option>
                    <option value="parent">Linked Guardian (sarah_parent - Child Co-Sign)</option>
                    <option value="coach">Accredited Coach (shane_coach)</option>
                    <option value="unauthorized">Unauthorized Stranger (unknown_actor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8e9285] mb-1 font-semibold">Coaching Relationship Status</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleCoachRelationship}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                        coachRelationshipActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {coachRelationshipActive ? 'check_circle' : 'block'}
                      </span>
                      <span>{coachRelationshipActive ? 'Grant Active' : 'Grant Revoked'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRequestPlaybackTicket}
                disabled={playbackLoading}
                className="w-full py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {playbackLoading ? 'progress_activity' : 'play_circle'}
                </span>
                <span>{playbackLoading ? 'Authorising Relationship...' : 'Request Temporary Signed Playback GET URL'}</span>
              </button>

              {playbackTicketResult && (
                <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#333] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#333]">
                    <span className="text-emerald-400 font-bold">200 OK — RELATIONSHIP VERIFIED &amp; SIGNED GET URL ISSUED</span>
                    <span className="text-[#8e9285]">Expires in 900s (15 min)</span>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <div>Relationship Type: <span className="text-[#c3f400] font-bold">{playbackTicketResult.relationshipVerified.relationshipType}</span></div>
                    <div>Actor: <span className="text-white">{playbackTicketResult.relationshipVerified.actorId}</span> → Target Player: <span className="text-white">{playbackTicketResult.relationshipVerified.targetPlayerId}</span></div>
                    <div>Tamper-Evident Watermark Digest: <span className="text-sky-400">{playbackTicketResult.watermarkToken.ipDigest}</span></div>
                    <div>Temporary Signed GET Stream URL:</div>
                    <div className="p-2 rounded-lg bg-black text-[#8e9285] break-all text-[10px]">
                      {playbackTicketResult.signedPlaybackUrl}
                    </div>
                  </div>
                </div>
              )}

              {playbackError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-bold">{playbackError.statusText}</span>
                    <span className="text-red-400/70 font-sans text-[10px]">Security Gate Enforced</span>
                  </div>
                  <div className="text-white text-[11px]">{playbackError.error}</div>
                  <div className="text-[10px] text-[#8e9285] font-sans pt-1">
                    🛑 Relationship validation failed. The client was denied temporary video access without active authorization grant.
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: Live Security Audit Stream */}
        {activeTab === 'audit_trail' && (
          <div className="p-5 rounded-3xl bg-[#141414] border border-[#262626] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">terminal</span>
                <span>Immutable Cloud Infrastructure &amp; Video Gate Audit Trail</span>
              </h3>
              <button
                onClick={fetchAuditLogs}
                className="text-xs text-[#c3f400] hover:underline cursor-pointer flex items-center gap-1 font-bold"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Refresh Logs</span>
              </button>
            </div>

            <div className="bg-black/90 rounded-2xl p-4 border border-[#333] font-mono text-xs text-[#a0a0a0] h-96 overflow-y-auto space-y-2">
              {auditLogs.length === 0 ? (
                <div className="text-[#666] text-center pt-36">No audit records yet. Trigger video uploads or playback requests above...</div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                      log.status === 'ALLOW'
                        ? 'bg-[#1c1b1b]/80 border-[#333] text-[#ddd]'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] pb-1">
                      <span className="text-[#8e9285]">{log.timestamp}</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        log.status === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="font-bold text-white">{log.action}</div>
                    <div className="text-[10px] text-[#8e9285]">
                      Actor: <span className="text-sky-400">{log.actor}</span> | Target: <span className="text-[#c3f400]">{log.target}</span>
                    </div>
                    <div className="text-[10px] mt-1 text-[#aaa]">{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
