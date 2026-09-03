import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Filter, 
  ExternalLink, 
  Lock, 
  BellRing,
  Globe
} from 'lucide-react';
import { THIRD_PARTY_SUBPROCESSORS } from '../../utils/dataLocationManager';
import { ThirdPartySubprocessor, SubprocessorCategory } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface SubprocessorsRegistrySectionProps {
  onToast: (msg: string) => void;
}

export const SubprocessorsRegistrySection: React.FC<SubprocessorsRegistrySectionProps> = ({
  onToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [childFilter, setChildFilter] = useState<string>('ALL');
  const [subscribedEmail, setSubscribedEmail] = useState('PillayN@gmail.com');
  const [subscribed, setSubscribed] = useState(true);

  const categories: SubprocessorCategory[] = [
    'Cloud Infrastructure & Database',
    'Object & Video Storage',
    'Biometric Video AI & Telemetry',
    'Urgent SMS & Safeguarding Alerts',
    'Transactional Email Delivery',
    'KMS Cryptographic Security',
    'Error & Crash Telemetry'
  ];

  const filteredSubprocessors = THIRD_PARTY_SUBPROCESSORS.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.corporateEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.servicePurpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.dataHostingRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.personalDataProcessed.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || sub.category === selectedCategory;
    const matchesChild = childFilter === 'ALL' || sub.childDataPolicy === childFilter;

    return matchesSearch && matchesCategory && matchesChild;
  });

  const handleDownloadRegistry = () => {
    playBallImpact();
    const exportData = {
      title: "Pitch Precision Third-Party Subprocessor Register",
      version: "2026.3-AU",
      lastUpdated: new Date().toISOString(),
      governanceFramework: "Privacy Act 1988 (Cth) APP 8 & Child Safeguarding Data Protection",
      subprocessors: THIRD_PARTY_SUBPROCESSORS
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PitchPrecision-Subprocessor-Registry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Subprocessor register exported successfully.');
  };

  const handleSubscribeToggle = () => {
    playBeep(650, 0.04);
    setSubscribed(!subscribed);
    onToast(!subscribed 
      ? `Subscribed ${subscribedEmail} to 30-day subprocessor change alerts.` 
      : 'Unsubscribed from subprocessor updates.');
  };

  const getChildPolicyBadge = (policy: ThirdPartySubprocessor['childDataPolicy']) => {
    switch (policy) {
      case 'AU-DOMESTIC RESIDENCY ONLY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'STRICTLY PROHIBITED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'ENCRYPTED ZERO-KNOWLEDGE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'PSEUDONYMIZED_ONLY':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Overview Banner */}
      <div className="bg-[#181717] border border-[#282727] rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#c3f400] text-xs font-bold uppercase tracking-wider">
              Transparency & Vendor Governance
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#a6ab9d] text-[10px] font-mono">
              7 Active Subprocessors
            </span>
          </div>
          <h2 className="text-xl font-bold font-headline text-white tracking-tight">
            Third-Party Subprocessor Registry
          </h2>
          <p className="text-xs text-[#a6ab9d] leading-relaxed">
            Record of all third-party entities processing personal information on behalf of Pitch Precision. Every subprocessor undergoes stringent privacy impact assessments, contractual data protection addendums (DPAs), and strict child protection screening.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
          <button
            onClick={handleDownloadRegistry}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.2)] transition"
          >
            <Download className="w-4 h-4" />
            Export Subprocessor Register (JSON)
          </button>
        </div>
      </div>

      {/* Advance Notice Notification Box */}
      <div className="p-4 bg-[#141414] border border-[#262626] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/20 text-[#c3f400]">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">30-Day Advance Subprocessor Change Notification</span>
            <span className="text-[11px] text-[#8e9285]">
              Alerts sent to <span className="font-mono text-white">{subscribedEmail}</span> prior to onboarding any new third-party subprocessor.
            </span>
          </div>
        </div>

        <button
          onClick={handleSubscribeToggle}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
            subscribed 
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25' 
              : 'bg-[#222] border-[#333] text-white hover:bg-[#333]'
          }`}
        >
          {subscribed ? '✓ Active Alerts' : 'Subscribe to Alerts'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#181717] p-4 rounded-2xl border border-[#282727]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'ALL' 
                ? 'bg-[#c3f400] text-black' 
                : 'bg-[#222] text-[#8e9285] hover:text-white border border-[#333]'
            }`}
          >
            All Categories ({THIRD_PARTY_SUBPROCESSORS.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat 
                  ? 'bg-[#c3f400] text-black' 
                  : 'bg-[#222] text-[#8e9285] hover:text-white border border-[#333]'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9285]" />
          <input
            type="text"
            placeholder="Search subprocessor, data, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#121111] border border-[#333] rounded-xl text-xs text-white placeholder-[#8e9285] focus:outline-none focus:border-[#c3f400]"
          />
        </div>
      </div>

      {/* Subprocessor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubprocessors.map((sub) => (
          <div
            key={sub.id}
            className="bg-[#181717] border border-[#282727] hover:border-[#383737] rounded-3xl p-5 shadow-lg space-y-4 transition flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#8e9285] text-[10px] font-mono">
                      {sub.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      {sub.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {sub.name}
                  </h3>
                  <p className="text-[11px] text-[#8e9285]">
                    {sub.corporateEntity} • {sub.headquarters}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border uppercase tracking-wider text-center ${getChildPolicyBadge(sub.childDataPolicy)}`}>
                  {sub.childDataPolicy}
                </span>
              </div>

              {/* Service Purpose */}
              <p className="text-xs text-[#c4c9ac] leading-relaxed mb-3">
                {sub.servicePurpose}
              </p>

              {/* Data Processed Badges */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8e9285] block">
                  Personal Information Handled:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sub.personalDataProcessed.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#222] border border-[#333] text-white text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Location & Transfer Details */}
              <div className="p-3 bg-[#121111] rounded-2xl border border-white/5 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#8e9285] text-[11px]">Hosting Region:</span>
                  <span className="font-mono text-white text-right text-[11px]">
                    {sub.dataHostingRegion}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[#8e9285] text-[11px]">Transfer Mechanism:</span>
                  <span className="text-emerald-400 text-right text-[11px] font-medium">
                    {sub.crossBorderTransferMechanism}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications & Audit Footer */}
            <div className="pt-3 border-t border-[#262525] flex items-center justify-between gap-2 text-[11px] text-[#8e9285] flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {sub.certifications.map((cert, cIdx) => (
                  <span key={cIdx} className="px-1.5 py-0.5 rounded bg-white/5 text-[#a6ab9d] text-[10px] font-mono">
                    {cert}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono">
                Audited: {new Date(sub.lastAuditDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
