import React from 'react';
import { ScreenType } from '../../types';

interface SupportScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  const supportItems = [
    { id: 'privacy-governance', label: 'Data Privacy', icon: 'verified_user', desc: 'Governance & classification' },
    { id: 'encryption-governance', label: 'Data Encryption', icon: 'lock', desc: 'KMS & transit settings' },
    { id: 'mobile-security', label: 'Mobile Security', icon: 'smartphone', desc: 'OWASP MASVS controls' },
    { id: 'source-code-security', label: 'Source Code Security', icon: 'code', desc: 'Git secrets, branch protection, SBOM & signed builds' },
    { id: 'mobile-bridge', label: 'Mobile Bridge & Hardware', icon: 'devices', desc: 'Capacitor 6, 60fps camera, mic & store manifests' },
    { id: 'cloud-infrastructure', label: 'Cloud Infra & Video Pipeline', icon: 'cloud_sync', desc: 'Cloud Run, Cloud SQL pooling, private buckets & signed URL gate' },
    { id: 'security-gate-1', label: 'Security Gate 1 Freeze', icon: 'gavel', desc: 'RBAC, Guardian consent, signed video URLs & audit trail' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-4 w-full">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-headline font-bold text-white mb-2">Support & Security</h2>
        <p className="text-[#c4c9ac] text-sm">Manage your security settings, privacy, and get help.</p>
      </div>

      <div className="space-y-3">
        {supportItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ScreenType)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer text-left"
          >
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[24px] text-[#c3f400]">
                {item.icon}
              </span>
              <div>
                <span className="font-bold text-sm tracking-wide text-white block">{item.label}</span>
                <span className="text-xs text-[#8e918f] mt-0.5 block">{item.desc}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-white/50">
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
