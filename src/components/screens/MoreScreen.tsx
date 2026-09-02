import React from 'react';
import { ScreenType } from '../../types';

interface MoreScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: 'Academy & Training',
      items: [
        { id: 'academy', label: 'Academy & Masterclasses', icon: 'school' },
        { id: 'feedback', label: 'Session Feedback', icon: 'rate_review' },
      ]
    },
    {
      title: 'Support & Help',
      items: [
        { id: 'support', label: 'Support Center', icon: 'help_center', highlight: true },
        { id: 'help', label: 'Help & FAQs', icon: 'contact_support' },
      ]
    },
    {
      title: 'Security & Legal',
      items: [
        { id: 'security-settings', label: 'Security & Sessions', icon: 'shield' },
        { id: 'terms', label: 'Terms of Service', icon: 'gavel' },
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6 w-full">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-headline font-bold text-white mb-2">More Options</h2>
        <p className="text-[#c4c9ac] text-sm">Additional resources, learning, and app settings.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold text-[#8e918f] uppercase tracking-wider pl-2">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as ScreenType)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer border ${
                    item.highlight 
                      ? 'bg-[#c3f400]/10 border-[#c3f400]/30 hover:bg-[#c3f400]/20 text-[#c3f400]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[24px]">
                      {item.icon}
                    </span>
                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] opacity-50">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
