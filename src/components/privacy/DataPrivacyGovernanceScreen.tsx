import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Search, 
  UserCheck, 
  HeartPulse, 
  Video, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  KeyRound, 
  Sparkles, 
  Terminal, 
  ChevronRight, 
  Sliders, 
  Trash2,
  BadgeAlert,
  Globe2,
  Building2
} from 'lucide-react';
import { 
  DATA_CLASSIFICATION_REGISTRY, 
  DEFAULT_DATA_PRIVACY_SETTINGS, 
  sanitizeForTelemetry, 
  secureLogger, 
  generateDataPrivacyExportPacket 
} from '../../utils/dataPrivacyEngine';
import { DataLocationGovernanceSection } from './DataLocationGovernanceSection';
import { SubprocessorsRegistrySection } from './SubprocessorsRegistrySection';
import { DataClassificationLevel, UserProfile, ScreenType, DataPrivacySettings } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface DataPrivacyGovernanceScreenProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
}

export const DataPrivacyGovernanceScreen: React.FC<DataPrivacyGovernanceScreenProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'classification' | 'location-sovereignty' | 'subprocessors' | 'sensitive-matrix' | 'scrubber-sim' | 'telemetry-stream' | 'settings'>('classification');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [privacySettings, setPrivacySettings] = useState<DataPrivacySettings>(DEFAULT_DATA_PRIVACY_SETTINGS);
  
  // Scrubber simulator state
  const [testPayloadInput, setTestPayloadInput] = useState(
    JSON.stringify(
      {
        event: "SESSION_RECORDING_ANALYZED",
        player: {
          name: currentUser?.name || "Devang Dalvi",
          dob: currentUser?.playerProfile?.dateOfBirth || "2003-05-14",
          email: "PillayN@gmail.com",
          phone: "+44 7700 900543",
          exactGps: "51.5074° N, 0.1278° W (Lord's Pitch Net 3)",
          videoBlobUrl: "blob:https://pitchprecision.internal/vid-session-38914.mp4",
          guardianEmail: "devi.pillay.parent@gmail.com"
        },
        coachingAssessment: {
          coach: "Arin Mishra",
          coreFocus: "Slight head-bob on front-foot contact; adjust back-foot alignment",
          confidentialBehavioralNote: "Player exhibited mild frustration after 3 consecutive swing misses"
        },
        medical: {
          injuryHistory: "Right rotator cuff tightness post 6 overs",
          bowlingWorkloadCapOvers: 4
        },
        authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },
      null,
      2
    )
  );

  const [simulatedSanitizedResult, setSimulatedSanitizedResult] = useState<{
    sanitized: any;
    redactedCount: number;
    categoriesRedacted: Set<DataClassificationLevel>;
  }>(() => {
    try {
      const parsed = JSON.parse(testPayloadInput);
      return sanitizeForTelemetry(parsed, { isJuniorContext: !!currentUser?.isJunior });
    } catch {
      return sanitizeForTelemetry({ raw: testPayloadInput });
    }
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportPacketJson, setExportPacketJson] = useState<string>('');
  const [telemetryLogs, setTelemetryLogs] = useState(secureLogger.getSanitizedTelemetryStream());
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleRunScrubberSim = () => {
    playBeep(880, 0.05);
    try {
      const parsed = JSON.parse(testPayloadInput);
      const result = sanitizeForTelemetry(parsed, { isJuniorContext: !!currentUser?.isJunior });
      setSimulatedSanitizedResult(result);
      triggerToast(`Privacy Scrubber: ${result.redactedCount} sensitive field(s) redacted with Zero Leakage.`);
    } catch {
      const result = sanitizeForTelemetry({ rawInput: testPayloadInput });
      setSimulatedSanitizedResult(result);
    }
  };

  const handleExportDataPacket = () => {
    playBallImpact();
    const packet = generateDataPrivacyExportPacket(currentUser);
    setExportPacketJson(JSON.stringify(packet, null, 2));
    setExportModalOpen(true);
    triggerToast('Data Subject Access (DSAR) Privacy Archive generated.');
  };

  const handlePresetScrubber = (type: 'junior' | 'medical' | 'auth') => {
    playBeep(700, 0.04);
    if (type === 'junior') {
      const sample = {
        event: "JUNIOR_COACH_REVIEW",
        juniorAthlete: "Kiyara Pillay (Age 15)",
        dateOfBirth: "2011-06-22",
        guardianName: "Devi Pillay",
        guardianPhone: "+44 7700 900543",
        guardianPortalPin: 5932,
        assignedCoaches: ["Arin Mishra", "Roshan Srilanka"],
        techniqueVideoUri: "blob:https://pitchprecision.internal/kiyara-cover-drive-hd.mp4",
        exactLocation: "51.5298° N, 0.1724° W (St. John's Wood)",
        safeguardingConsentToken: "GV-UK-94218-VERIFIED"
      };
      setTestPayloadInput(JSON.stringify(sample, null, 2));
      setSimulatedSanitizedResult(sanitizeForTelemetry(sample, { isJuniorContext: true }));
    } else if (type === 'medical') {
      const sample = {
        event: "WORKLOAD_FITNESS_CHECK",
        player: currentUser?.name || "Devang Dalvi",
        medicalDiagnosis: "Right ankle impingement (Grade 1)",
        fitnessTest: "Yo-Yo Level 17.8 - Max sprint velocity 27.2 km/h",
        confidentialPastoralNote: "Requires rest from express bowling workloads for 7 days",
        authorizedPhysioEmail: "sportsmedicine@pitchprecision.cricket"
      };
      setTestPayloadInput(JSON.stringify(sample, null, 2));
      setSimulatedSanitizedResult(sanitizeForTelemetry(sample));
    } else {
      const sample = {
        event: "AUTH_CREDENTIAL_SESSION",
        userId: currentUser?.id || "usr-devang",
        email: "PillayN@gmail.com",
        passwordHash: "$2b$12$e89bF5z6HkQ2Y1N...[PBKDF2-SALTED]",
        totpSecretKey: "JBSWY3DPEHPK3PXP",
        sessionToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s8f2...",
        clientIp: "192.168.1.44",
        city: "London, UK"
      };
      setTestPayloadInput(JSON.stringify(sample, null, 2));
      setSimulatedSanitizedResult(sanitizeForTelemetry(sample));
    }
  };

  const filteredRegistry = DATA_CLASSIFICATION_REGISTRY.filter(item => {
    const matchesFilter = selectedClassificationFilter === 'ALL' || item.classification === selectedClassificationFilter;
    const matchesSearch = 
      item.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purposeRationale.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.examples.some(ex => ex.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getClassificationBadge = (level: DataClassificationLevel) => {
    switch (level) {
      case 'PUBLIC':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'INTERNAL':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'PERSONAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SENSITIVE':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'CHILD-SENSITIVE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'SECURITY-SENSITIVE':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'HIGHLY RESTRICTED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pb-24">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1c1b1b] border border-[#c3f400] text-[#c3f400] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-[#2a2a2a] bg-[#1a1919]/80 backdrop-blur sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-center justify-center text-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.15)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-headline tracking-tight text-white">
                  Privacy by Design & Data Governance
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#c3f400] text-[10px] font-bold uppercase tracking-wider">
                  Zero Leakage
                </span>
              </div>
              <p className="text-xs text-[#8e9285]">
                Strict Data Minimization • 7 Classification Tiers • Redacted Telemetry Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('encryption-governance')}
              className="px-3.5 py-2 rounded-lg bg-[#9cf0ff]/15 hover:bg-[#9cf0ff]/25 border border-[#9cf0ff]/30 text-xs font-semibold text-[#9cf0ff] flex items-center gap-2 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#9cf0ff]" />
              Data Encryption & KMS
            </button>
            <button
              onClick={handleExportDataPacket}
              className="px-3.5 py-2 rounded-lg bg-[#242323] hover:bg-[#2e2d2d] border border-[#3e3d3d] text-xs font-semibold text-white flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-[#c3f400]" />
              Export My Data (DSAR)
            </button>
            <button
              onClick={() => onNavigate('security-settings')}
              className="px-3.5 py-2 rounded-lg bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.25)] transition"
            >
              <KeyRound className="w-4 h-4" />
              MFA & Passkeys
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* Privacy by Design Safeguards Banner */}
        <div className="bg-gradient-to-r from-[#1b1f15] via-[#1a1919] to-[#1e141a] border border-[#c3f400]/25 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Data Minimization</h4>
                <p className="text-[11px] text-[#a6ab9d] mt-0.5 leading-relaxed">
                  Only information genuinely required for cricket coaching service delivery is collected.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Child-Sensitive Protection</h4>
                <p className="text-[11px] text-[#a6ab9d] mt-0.5 leading-relaxed">
                  Dual-guardian consent, public blackout, and assigned DBS coach gating for junior athletes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Log Exposure</h4>
                <p className="text-[11px] text-[#a6ab9d] mt-0.5 leading-relaxed">
                  Emails, DoBs, video URLs, injuries, notes, and exact coordinates are strictly redacted from logs & analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Medical Isolation</h4>
                <p className="text-[11px] text-[#a6ab9d] mt-0.5 leading-relaxed">
                  Injury and fitness data segregated in encrypted partitions away from general club analytics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2b2a2a] pb-3 overflow-x-auto">
          {[
            { id: 'classification', label: 'Data Classification Registry', icon: Database },
            { id: 'location-sovereignty', label: 'Data Location & AU Hosting', icon: Globe2, badge: 'AU Cloud' },
            { id: 'subprocessors', label: 'Subprocessors Registry', icon: Building2, badge: '7 Vendors' },
            { id: 'sensitive-matrix', label: '12 Sensitive Categories', icon: BadgeAlert },
            { id: 'scrubber-sim', label: 'Zero-Leakage Simulator', icon: Sparkles },
            { id: 'telemetry-stream', label: 'Sanitized Audit Stream', icon: Terminal },
            { id: 'settings', label: 'Privacy Governance Controls', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playBeep(600, 0.03);
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#c3f400] text-black shadow-[0_0_15px_rgba(195,244,0,0.25)]' 
                    : 'bg-[#1c1b1b] text-[#a6ab9d] hover:text-white hover:bg-[#252424] border border-[#2b2a2a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-[#c3f400]/20 text-[#c3f400]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB: DATA LOCATION & REGIONAL SOVEREIGNTY */}
        {activeTab === 'location-sovereignty' && (
          <DataLocationGovernanceSection
            currentUser={currentUser}
            onToast={triggerToast}
          />
        )}

        {/* TAB: SUBPROCESSORS REGISTRY */}
        {activeTab === 'subprocessors' && (
          <SubprocessorsRegistrySection
            onToast={triggerToast}
          />
        )}

        {/* TAB 1: DATA CLASSIFICATION REGISTRY */}
        {activeTab === 'classification' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#181717] p-3.5 rounded-2xl border border-[#282727]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  'ALL',
                  'PUBLIC',
                  'INTERNAL',
                  'PERSONAL',
                  'SENSITIVE',
                  'CHILD-SENSITIVE',
                  'SECURITY-SENSITIVE',
                  'HIGHLY RESTRICTED'
                ].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      playBeep(750, 0.02);
                      setSelectedClassificationFilter(cat);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                      selectedClassificationFilter === cat
                        ? 'bg-white text-black font-extrabold'
                        : 'bg-[#201f1f] text-[#8e9285] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9285]" />
                <input
                  type="text"
                  placeholder="Search field, purpose, or rationale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#c3f400]"
                />
              </div>
            </div>

            {/* Classification List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRegistry.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#181717] border border-[#262525] hover:border-[#383737] rounded-2xl p-5 transition-all space-y-3 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e9285]">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-white font-headline mt-0.5">
                        {item.fieldName.replace(/_/g, ' ').toUpperCase()}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border uppercase ${getClassificationBadge(item.classification)}`}>
                      {item.classification}
                    </span>
                  </div>

                  {/* Purpose Rationale */}
                  <div className="bg-[#121111] p-3 rounded-xl border border-[#222121]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Data Minimization Justification
                    </div>
                    <p className="text-xs text-[#c4c9ac] mt-1 leading-relaxed">
                      {item.purposeRationale}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-[#1c1b1b] p-2 rounded-lg border border-[#282727]">
                      <span className="text-[#8e9285] block text-[10px] uppercase font-semibold">Retention Duration</span>
                      <span className="text-white font-medium">{item.retentionPeriod}</span>
                    </div>

                    <div className="bg-[#1c1b1b] p-2 rounded-lg border border-[#282727]">
                      <span className="text-[#8e9285] block text-[10px] uppercase font-semibold">Masking / Privacy Policy</span>
                      <span className="text-[#9cf0ff] font-medium truncate block" title={item.maskingMethod}>
                        {item.maskingMethod}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Redaction Status Badge */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#222121] text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#8e9285]">
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Telemetry Exposure:</span>
                    </div>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      item.isRedactedFromLogs 
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}>
                      {item.isRedactedFromLogs ? 'STRICTLY REDACTED FROM LOGS' : 'PUBLIC / NON-SENSITIVE'}
                    </span>
                  </div>

                  {/* Examples */}
                  <div className="text-[11px] text-[#7a7e72]">
                    <span className="font-semibold text-[#8e9285]">Field Examples: </span>
                    {item.examples.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 12 SENSITIVE CATEGORIES MATRIX */}
        {activeTab === 'sensitive-matrix' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#181717] p-5 rounded-2xl border border-[#2a2929]">
              <h2 className="text-lg font-bold text-white font-headline flex items-center gap-2">
                <BadgeAlert className="w-5 h-5 text-[#c3f400]" />
                Mandatory Sensitive Information Safeguards Matrix
              </h2>
              <p className="text-xs text-[#a6ab9d] mt-1">
                The platform enforces strict Privacy by Design safeguards for all 12 sensitive cricket coaching attributes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Date of Birth',
                  icon: Calendar,
                  classification: 'PERSONAL / CHILD-SENSITIVE',
                  level: 'CHILD-SENSITIVE',
                  purpose: 'Age-group validation (U-13 to Senior) and triggering junior safeguarding.',
                  telemetryRedaction: '[REDACTED: PERSONAL - DoB]',
                  storage: 'Encrypted at rest; masked in logs to age bracket'
                },
                {
                  title: 'Email Address',
                  icon: Mail,
                  classification: 'PERSONAL / SENSITIVE',
                  level: 'PERSONAL',
                  purpose: 'Authentication, passkey pairing, and dual-parent CC delivery.',
                  telemetryRedaction: '[REDACTED: PERSONAL - Email]',
                  storage: 'One-way masked in telemetry (p***y@gmail.com)'
                },
                {
                  title: 'Phone Number',
                  icon: Phone,
                  classification: 'PERSONAL / SENSITIVE',
                  level: 'PERSONAL',
                  purpose: 'Emergency safeguarding alerts and match rain notifications.',
                  telemetryRedaction: '[REDACTED: PERSONAL - Phone]',
                  storage: 'E.164 encrypted partition; scrubbed from debug'
                },
                {
                  title: 'Player Videos',
                  icon: Video,
                  classification: 'SENSITIVE / CHILD-SENSITIVE',
                  level: 'SENSITIVE',
                  purpose: 'AI motion capture, front-foot drive biomechanics, and telestration review.',
                  telemetryRedaction: '[REDACTED: SENSITIVE - Video Blob URI]',
                  storage: 'EXIF metadata stripped; DRM encrypted streaming tokens'
                },
                {
                  title: 'Photographs & Avatars',
                  icon: UserCheck,
                  classification: 'SENSITIVE / CHILD-SENSITIVE',
                  level: 'SENSITIVE',
                  purpose: 'Authenticated user profile display and coach roster recognition.',
                  telemetryRedaction: '[REDACTED: SENSITIVE - Photograph Asset]',
                  storage: 'Camera model, serial & GPS EXIF scrubbed'
                },
                {
                  title: 'Coaching Assessments',
                  icon: FileText,
                  classification: 'SENSITIVE',
                  level: 'SENSITIVE',
                  purpose: 'Personalized batting & bowling mechanical feedback and tactical plans.',
                  telemetryRedaction: '[REDACTED: SENSITIVE - Coaching Assessment]',
                  storage: 'Restricted to player, verified coach & parent'
                },
                {
                  title: 'Injury Information',
                  icon: HeartPulse,
                  classification: 'HIGHLY RESTRICTED',
                  level: 'HIGHLY RESTRICTED',
                  purpose: 'Bowling workload caps, lumbar spine stress fracture prevention, and return-to-play safety.',
                  telemetryRedaction: '[REDACTED: HIGHLY RESTRICTED - Medical Record]',
                  storage: 'Isolated medical partition with explicit consent'
                },
                {
                  title: 'Fitness & Biometrics',
                  icon: HeartPulse,
                  classification: 'HIGHLY RESTRICTED',
                  level: 'HIGHLY RESTRICTED',
                  purpose: 'Yo-Yo endurance tracking, sprint speeds, and heart rate recovery readiness.',
                  telemetryRedaction: '[REDACTED: HIGHLY RESTRICTED - Fitness Data]',
                  storage: 'Biometric isolation away from public leaderboards'
                },
                {
                  title: 'Behavioural Notes',
                  icon: Lock,
                  classification: 'HIGHLY RESTRICTED',
                  level: 'HIGHLY RESTRICTED',
                  purpose: 'Confidential coaching observations and safeguarding officer wellbeing notes.',
                  telemetryRedaction: '[REDACTED: HIGHLY RESTRICTED - Pastoral Note]',
                  storage: 'End-to-end encrypted; excluded from all exports'
                },
                {
                  title: 'Guardian Information',
                  icon: ShieldCheck,
                  classification: 'CHILD-SENSITIVE',
                  level: 'CHILD-SENSITIVE',
                  purpose: 'Legal consent records, parental portal access PINs, and dual-parent CC oversight.',
                  telemetryRedaction: '[REDACTED: CHILD-SENSITIVE - Guardian Data]',
                  storage: 'Supervision portal PIN hashed; zero plaintext logs'
                },
                {
                  title: 'Location Data / GPS',
                  icon: MapPin,
                  classification: 'SENSITIVE / CHILD-SENSITIVE',
                  level: 'SENSITIVE',
                  purpose: 'Match pitch venue check-in and cross-border login anomaly detection.',
                  telemetryRedaction: '[REDACTED: SENSITIVE - Exact GPS Coordinates]',
                  storage: 'Exact coordinates dropped immediately; coarse city only'
                },
                {
                  title: 'Security Credentials & MFA',
                  icon: KeyRound,
                  classification: 'SECURITY-SENSITIVE',
                  level: 'SECURITY-SENSITIVE',
                  purpose: 'Authentication, PBKDF2 hashes, TOTP RFC 6238 secrets, and passkey public keys.',
                  telemetryRedaction: '[REDACTED: SECURITY-SENSITIVE - Credential]',
                  storage: 'Zero plaintext passwords stored under any condition'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-[#181717] border border-[#282727] rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#222121] text-[#c3f400] border border-[#333]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${getClassificationBadge(item.level as any)}`}>
                            {item.classification}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#c4c9ac] leading-relaxed">
                      {item.purpose}
                    </p>

                    <div className="bg-[#111] p-2.5 rounded-xl border border-[#222] space-y-1.5 text-[10px]">
                      <div>
                        <span className="text-[#8e9285] block font-semibold">Telemetry & Log Redaction:</span>
                        <code className="text-[#ffdb3c] font-mono block mt-0.5">
                          {item.telemetryRedaction}
                        </code>
                      </div>
                      <div>
                        <span className="text-[#8e9285] block font-semibold">Storage & Access Safeguard:</span>
                        <span className="text-[#9cf0ff]">{item.storage}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ZERO-LEAKAGE SCRUBBER SIMULATOR */}
        {activeTab === 'scrubber-sim' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#181717] p-5 rounded-2xl border border-[#282727] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-headline flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c3f400]" />
                  Live Privacy Scrubber & Telemetry Redactor
                </h2>
                <p className="text-xs text-[#a6ab9d] mt-1">
                  Test raw diagnostic payloads to verify automatic real-time redaction of sensitive information before telemetry ingestion.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#8e9285] font-semibold">Load Preset:</span>
                <button
                  onClick={() => handlePresetScrubber('junior')}
                  className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-purple-300 text-xs font-bold border border-purple-500/30 transition"
                >
                  Junior + Guardian
                </button>
                <button
                  onClick={() => handlePresetScrubber('medical')}
                  className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-rose-300 text-xs font-bold border border-rose-500/30 transition"
                >
                  Medical & Injury
                </button>
                <button
                  onClick={() => handlePresetScrubber('auth')}
                  className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-orange-300 text-xs font-bold border border-orange-500/30 transition"
                >
                  Auth & Password
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Raw Input */}
              <div className="bg-[#181717] border border-[#2a2929] rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#ff8888] flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-[#ff8888]" />
                    Raw Telemetry / Diagnostic Payload (Contains Sensitive Data)
                  </span>
                  <button
                    onClick={handleRunScrubberSim}
                    className="px-3 py-1 rounded-lg bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-[0_0_10px_rgba(195,244,0,0.3)] transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Run Scrubber
                  </button>
                </div>

                <textarea
                  value={testPayloadInput}
                  onChange={(e) => setTestPayloadInput(e.target.value)}
                  className="w-full flex-1 min-h-[360px] bg-[#0f0f0f] border border-[#333] rounded-xl p-3 font-mono text-xs text-[#e5e2e1] focus:outline-none focus:border-[#c3f400] resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Sanitized Output */}
              <div className="bg-[#181717] border border-[#2a2929] rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#c3f400] flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#c3f400]" />
                    Sanitized Output (Zero-Leakage Guarantee)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold border border-[#c3f400]/40">
                      {simulatedSanitizedResult.redactedCount} Fields Redacted
                    </span>
                  </div>
                </div>

                <div className="w-full flex-1 min-h-[360px] bg-[#0f0f0f] border border-[#c3f400]/20 rounded-xl p-3 font-mono text-xs text-[#4ade80] overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(simulatedSanitizedResult.sanitized, null, 2)}
                </div>

                {/* Categories Redacted Badges */}
                <div className="mt-3 pt-3 border-t border-[#252424] flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-[#8e9285] font-semibold">Redacted Categories:</span>
                  {Array.from(simulatedSanitizedResult.categoriesRedacted).map((cat, idx) => (
                    <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getClassificationBadge(cat as DataClassificationLevel)}`}>
                      {String(cat)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SANITIZED TELEMETRY & AUDIT STREAM */}
        {activeTab === 'telemetry-stream' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#181717] p-5 rounded-2xl border border-[#282727] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-headline flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#c3f400]" />
                  Sanitized Application Telemetry & Debug Stream
                </h2>
                <p className="text-xs text-[#a6ab9d] mt-1">
                  Active diagnostic log entries intercepted by `secureLogger`. All sensitive fields are stripped prior to storage.
                </p>
              </div>

              <button
                onClick={() => {
                  secureLogger.clearTelemetryBuffer();
                  setTelemetryLogs([]);
                  triggerToast('Telemetry buffer cleared.');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-xs font-bold text-[#e5e2e1] flex items-center gap-1.5 border border-[#333]"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Clear Stream
              </button>
            </div>

            <div className="space-y-3">
              {telemetryLogs.map((log) => (
                <div key={log.id} className="bg-[#181717] border border-[#282727] rounded-2xl p-4 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#242323] text-white font-mono text-[11px] font-bold border border-[#333]">
                        {log.sourceComponent}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#c3f400]/15 text-[#c3f400] text-[10px] font-bold uppercase border border-[#c3f400]/30">
                        {log.complianceStatus}
                      </span>
                      <span className="text-[11px] text-[#8e9285]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {log.redactedCategories.map((cat, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getClassificationBadge(cat)}`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0f0f0f] p-3 rounded-xl border border-[#222] font-mono text-xs text-[#a6ab9d] overflow-x-auto">
                    {JSON.stringify(log.sanitizedPayload, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PRIVACY SETTINGS & RETENTION CONTROLS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-[#181717] p-5 rounded-2xl border border-[#282727]">
              <h2 className="text-lg font-bold text-white font-headline flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#c3f400]" />
                Privacy by Design Governance Controls
              </h2>
              <p className="text-xs text-[#a6ab9d] mt-1">
                Configure automated data retention limits, medical record access rules, and EXIF scrubbing behavior.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#181717] border border-[#282727] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c3f400]">
                  Automated Data Minimization Policies
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start justify-between gap-3 p-3 bg-[#111] rounded-xl border border-[#222] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-white block">Automatic Camera EXIF GPS Stripping</span>
                      <span className="text-[11px] text-[#8e9285] block mt-0.5">
                        Removes device serial numbers, GPS latitude/longitude, and camera models on video uploads.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.autoExifStripping}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, autoExifStripping: e.target.checked })}
                      className="w-4 h-4 accent-[#c3f400] rounded mt-1"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 p-3 bg-[#111] rounded-xl border border-[#222] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-white block">Strict Child Safeguarding Gating</span>
                      <span className="text-[11px] text-[#8e9285] block mt-0.5">
                        Prohibits public discovery and enforces dual-guardian CC for players under 18.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.strictChildProtectionActive}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, strictChildProtectionActive: e.target.checked })}
                      className="w-4 h-4 accent-[#c3f400] rounded mt-1"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 p-3 bg-[#111] rounded-xl border border-[#222] cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-white block">Medical & Injury Isolation Partition</span>
                      <span className="text-[11px] text-[#8e9285] block mt-0.5">
                        Restricts acute bowling injury and physical rehabilitation notes to player and guardian only.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.healthDataRestrictedToPlayerAndGuardian}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, healthDataRestrictedToPlayerAndGuardian: e.target.checked })}
                      className="w-4 h-4 accent-[#c3f400] rounded mt-1"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-[#181717] border border-[#282727] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#c3f400]">
                  Storage & Video Retention Limits
                </h3>

                <div className="space-y-3">
                  <div className="p-3 bg-[#111] rounded-xl border border-[#222] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Net Session Video Auto-Retention</span>
                      <span className="text-xs font-mono font-bold text-[#c3f400]">{privacySettings.videoRetentionDays} Days</span>
                    </div>
                    <input
                      type="range"
                      min={7}
                      max={90}
                      step={7}
                      value={privacySettings.videoRetentionDays}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, videoRetentionDays: Number(e.target.value) })}
                      className="w-full accent-[#c3f400]"
                    />
                    <span className="text-[10px] text-[#8e9285] block">
                      Videos automatically purged after selected timeframe to reduce digital footprint.
                    </span>
                  </div>

                  <div className="p-3 bg-[#111] rounded-xl border border-[#222] space-y-1.5">
                    <span className="text-xs font-bold text-white block">Analytics Redaction Level</span>
                    <select
                      value={privacySettings.analyticsRedactionLevel}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, analyticsRedactionLevel: e.target.value as any })}
                      className="w-full bg-[#201f1f] border border-[#333] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#c3f400]"
                    >
                      <option value="FULL_ANONYMIZED">FULL_ANONYMIZED (Zero sensitive data logged)</option>
                      <option value="PSEUDONYMIZED">PSEUDONYMIZED (Deterministic synthetic IDs)</option>
                      <option value="ZERO_TELEMETRY">ZERO_TELEMETRY (All telemetry disabled)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => triggerToast('Privacy governance policies updated & active.')}
                  className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs transition"
                >
                  Save Privacy Governance Settings
                </button>
              </div>
            </div>

            {/* Advertising & Third-Party Tracking Block List Guardrails */}
            <div className="bg-[#181717] border border-[#282727] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">no_meeting_room</span>
                Ad & Third-Party Tracker Guardrails (COPPA / GDPR Compliance)
              </h3>
              <p className="text-xs text-[#a6ab9d] leading-relaxed">
                To guarantee zero leakage of student or youth training habits, Pitch Precision enforces a hard block list against behavioral marketing engines, ad networks, and client-side profiling pixels.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#111] rounded-xl border border-white/5 space-y-1">
                  <strong className="text-white flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-red-400 text-[16px]">block</span>
                    No Behavioral Targeting
                  </strong>
                  <p className="text-[#a6ab9d] text-[10px] leading-snug">
                    Behavioral advertising targeting children and junior players is strictly disabled. No pixel or cookie networks are loaded for users under 18.
                  </p>
                </div>
                <div className="p-3 bg-[#111] rounded-xl border border-white/5 space-y-1">
                  <strong className="text-white flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-red-400 text-[16px]">vpn_lock</span>
                    Ad Platform Profile Isolation
                  </strong>
                  <p className="text-[#a6ab9d] text-[10px] leading-snug">
                    Junior profiles are completely blacklisted from external marketing systems. No demographic data or drill tracking is exported.
                  </p>
                </div>
                <div className="p-3 bg-[#111] rounded-xl border border-white/5 space-y-1">
                  <strong className="text-white flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]">shield</span>
                    Anonymized Analytics
                  </strong>
                  <p className="text-[#a6ab9d] text-[10px] leading-snug">
                    Crash reports and engine telemetry utilize strictly hashed pseudonymised keys (such as synthetic IDs like USER-DEV-42).
                  </p>
                </div>
                <div className="p-3 bg-[#111] rounded-xl border border-white/5 space-y-1">
                  <strong className="text-white flex items-center gap-1.5 text-[11px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[16px]">gavel</span>
                    Data Minimization Rule
                  </strong>
                  <p className="text-[#a6ab9d] text-[10px] leading-snug">
                    Zero unnecessary player attributes (e.g., precise GPS, phone numbers, technique notes) are shared with analytics endpoints.
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Data Sovereignty & Australian Hosting Quick Access */}
            <div className="bg-[#181717] border border-[#282727] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400]">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Regional Data Hosting & Subprocessor Governance
                  </h4>
                  <p className="text-[11px] text-[#8e9285] mt-0.5">
                    Australian cloud residency (APP 8), domestic child safeguards, and 7 approved subprocessors.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playBeep(600, 0.03);
                    setActiveTab('location-sovereignty');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#242323] hover:bg-[#2e2d2d] border border-[#3e3d3d] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe2 className="w-4 h-4 text-[#c3f400]" />
                  Manage Hosting
                </button>
                <button
                  onClick={() => {
                    playBeep(600, 0.03);
                    setActiveTab('subprocessors');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#242323] hover:bg-[#2e2d2d] border border-[#3e3d3d] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#c3f400]" />
                  Subprocessors
                </button>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* DSAR Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181717] border border-[#c3f400]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-[#282727] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-headline">
                    Data Subject Access Request (DSAR) Packet
                  </h3>
                  <p className="text-xs text-[#8e9285]">
                    GDPR / Privacy by Design Transparent Data Archive
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              <pre className="p-4 bg-[#0d0d0d] border border-[#222] rounded-xl font-mono text-xs text-[#c3f400] overflow-x-auto whitespace-pre-wrap">
                {exportPacketJson}
              </pre>
            </div>

            <div className="p-4 border-t border-[#282727] bg-[#141313] flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportPacketJson);
                  triggerToast('Data packet copied to clipboard.');
                }}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white text-xs font-bold border border-[#333]"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportPacketJson], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `PitchPrecision-Data-Privacy-Export-${currentUser?.name.replace(/\s+/g, '_')}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  triggerToast('Data archive download initiated.');
                }}
                className="px-4 py-2 rounded-xl bg-[#c3f400] text-black text-xs font-extrabold"
              >
                Download Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
