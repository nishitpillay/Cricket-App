import React, { useState } from 'react';
import { ScreenType, CricketDiscipline, UserProfile } from '../../types';
import { mockAllSkillTrees } from '../../data/cricketSkillTreeData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface SkillTreeProgressWidgetProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
}

export const SkillTreeProgressWidget: React.FC<SkillTreeProgressWidgetProps> = ({
  onNavigate
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<CricketDiscipline>('bowling');

  const branches = mockAllSkillTrees[activeDiscipline] || [];
  const activeFocusNodes = branches
    .flatMap((b) => b.nodes)
    .filter((n) => n.status === 'IN_TRAINING' || n.status === 'NEEDS_WORK')
    .slice(0, 3);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#1c1f1a] border border-white/10 shadow-xl flex flex-col gap-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm sm:text-base text-white">
              Cricket Skill Tree Focus Areas
            </h3>
            <p className="text-[11px] text-[#c4c9ac]">
              Targeted biomechanical milestones &amp; technical cues
            </p>
          </div>
        </div>

        {/* Discipline Filter */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {(['bowling', 'batting', 'fielding'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setActiveDiscipline(d);
                playBeep(650, 0.03);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-headline font-bold capitalize transition-all cursor-pointer ${
                activeDiscipline === d
                  ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Active Focus Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {activeFocusNodes.map((node) => (
          <div
            key={node.id}
            onClick={() => {
              playBallImpact();
              onNavigate('skill-tree');
            }}
            className="p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#c3f400] transition-all cursor-pointer flex flex-col justify-between gap-2.5 group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[9px] font-mono text-[#c3f400] font-bold uppercase tracking-wider">
                  {node.categoryLabel}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    node.status === 'IN_TRAINING'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {node.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-headline font-bold text-xs text-white group-hover:text-[#c3f400] transition-colors line-clamp-1">
                {node.title}
              </h4>
              <p className="text-[11px] text-[#c4c9ac] line-clamp-2 mt-1">
                {node.shortSummary}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-mono text-[#c4c9ac]">
                <span>Progress</span>
                <span className="text-white font-bold">{node.progressPct}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c3f400] rounded-full"
                  style={{ width: `${node.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Open Full Skill Tree */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[#c4c9ac]">
          Structured trees covering stance, balance, bat path, gather, brace &amp; release
        </span>
        <button
          onClick={() => {
            playBallImpact();
            onNavigate('skill-tree');
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#c3f400] font-headline font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors border border-white/10"
        >
          <span>Explore Full Skill Trees</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
