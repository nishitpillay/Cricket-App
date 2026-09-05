import React, { useState, useMemo } from 'react';
import { DrillItem, ScreenType } from '../../types';
import { mockSmartDrillsVault } from '../../data/smartDrillsVaultData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface SmartDrillsVaultProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill: (drill: DrillItem) => void;
}

export const SmartDrillsVault: React.FC<SmartDrillsVaultProps> = ({
  onNavigate,
  onSelectDrill
}) => {
  const [drills] = useState<DrillItem[]>(mockSmartDrillsVault);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [quickCardDrill, setQuickCardDrill] = useState<DrillItem | null>(null);

  const subCategories = ['All', 'Spin Bowling', 'Slip Fielding', 'Power Hitting', 'Fast Bowling', 'Wicketkeeping', 'Ground Fielding'];
  const levels = ['All', 'Beginner', 'Int/Pro', 'Pro', 'Elite'];

  // Filtered Drills
  const filteredDrills = useMemo(() => {
    return drills.filter((drill) => {
      const matchesSearch =
        drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drill.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubCat =
        selectedSubCategory === 'All' || drill.subCategory === selectedSubCategory;

      const matchesLevel =
        selectedLevel === 'All' || drill.level === selectedLevel;

      return matchesSearch && matchesSubCat && matchesLevel;
    });
  }, [drills, searchQuery, selectedSubCategory, selectedLevel]);

  const handleOpenQuickCard = (drill: DrillItem) => {
    playBeep(700, 0.05);
    setQuickCardDrill(drill);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Core Cricket Loop Context Strip */}
      <div className="p-3 rounded-2xl bg-[#162215] border border-[#c3f400]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400] shrink-0 font-mono font-bold">
            5/7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#c3f400] uppercase font-mono text-[10px]">Core Loop Stage 5: Assign Drill</span>
              <span className="text-[#8e918f]">•</span>
              <span className="text-white font-medium">Smart Drills Vault Library</span>
            </div>
            <p className="text-[11px] text-[#c4c9ac] hidden sm:block">
              Select corrective drill to execute in Stage 6 (Train Again) and verify in Stage 7 (Compare Improvement).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('drill-practice');
            }}
            className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#c3f400] text-[#111800] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
          >
            <span>Next: Train Again (Stage 6)</span>
            <span className="material-symbols-outlined text-[15px]">sports_cricket</span>
          </button>
        </div>
      </div>

      {/* Top Vault Banner */}
      <div className="bg-gradient-to-r from-[#1c260f] via-[#161f0d] to-[#202020] p-6 rounded-3xl border border-[#c3f400]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-[10px] uppercase tracking-wider">
              Pitch-Ready Library
            </span>
            <span className="text-xs text-[#ffdb3c] font-bold">Offline Cached Drill Cards</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">
            Smart Drills Vault
          </h1>
          <p className="text-sm text-[#c4c9ac] mt-1 max-w-xl">
            Granular drill database organized by specialized skill sets for instant lookup and execution on the pitch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#c3f400]">
            {filteredDrills.length} ACTIVITIES READY
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 bg-[#201f1f] p-4 rounded-2xl border border-white/10 glass">
        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4c9ac] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search drills by skill, equipment (Katchet ramp, band), or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-[#c4c9ac]/50 focus:border-[#c3f400] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Skill Subcategory Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {subCategories.map((cat) => {
            const isSelected = selectedSubCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playBeep(650, 0.04);
                  setSelectedSubCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                    : 'bg-black/30 text-[#c4c9ac] hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Level Filters */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
          <span className="text-[11px] text-[#c4c9ac] font-bold">Difficulty:</span>
          <div className="flex items-center gap-1">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-white/20 text-[#c3f400]'
                    : 'text-[#c4c9ac] hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrills.map((drill) => (
          <div
            key={drill.id}
            className="group p-5 rounded-3xl bg-[#201f1f] border border-white/10 hover:border-[#c3f400]/40 transition-all flex flex-col justify-between gap-4 glass shadow-xl hover:-translate-y-1"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/5">
                <img
                  src={drill.image}
                  alt={drill.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#161e00]/90 text-[#c3f400] text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border border-[#c3f400]/30">
                    {drill.subCategory || drill.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold backdrop-blur-md">
                    {drill.level}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  <span className="material-symbols-outlined text-[13px] text-[#c3f400]">
                    timer
                  </span>
                  <span>{drill.duration}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-headline font-bold text-base text-white group-hover:text-[#c3f400] transition-colors mb-1.5">
                {drill.title}
              </h3>
              <p className="text-xs text-[#c4c9ac] leading-relaxed line-clamp-2">
                {drill.description}
              </p>

              {/* Tags & Equipment */}
              <div className="flex flex-wrap gap-1 mt-3">
                {drill.tags?.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[#c4c9ac] text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Quick Card vs Full Detail */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => handleOpenQuickCard(drill)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-headline font-bold text-xs flex items-center justify-center gap-1 border border-white/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                  visibility
                </span>
                <span>Pitch Quick-Card</span>
              </button>

              <button
                onClick={() => {
                  onSelectDrill(drill);
                  onNavigate('drill-details');
                }}
                className="p-2 rounded-xl bg-[#c3f400] text-[#161e00] font-bold hover:bg-[#abd600] transition-colors cursor-pointer"
                title="Open full interactive mode"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pitch Quick-Card Modal (Zero Distraction on Field) */}
      {quickCardDrill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#201f1f] border border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#c3f400] text-[#161e00] uppercase">
                    {quickCardDrill.subCategory || quickCardDrill.category}
                  </span>
                  <span className="text-xs font-mono text-[#ffdb3c]">
                    {quickCardDrill.duration} ({quickCardDrill.level})
                  </span>
                </div>
                <h2 className="font-headline font-black text-xl text-white">
                  {quickCardDrill.title}
                </h2>
              </div>

              <button
                onClick={() => setQuickCardDrill(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Coach Cue Banner */}
            <div className="p-3.5 rounded-2xl bg-[#1c260f] border border-[#c3f400]/30 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px] shrink-0 mt-0.5">
                psychology
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider block">
                  COACH GOLDEN CUE
                </span>
                <p className="text-xs text-white italic mt-0.5">
                  {quickCardDrill.coachTip}
                </p>
              </div>
            </div>

            {/* Quick 3-Step Execution */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider">
                EXECUTION CHECKPOINTS
              </span>
              {quickCardDrill.steps.map((step) => (
                <div
                  key={step.number}
                  className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#c3f400] text-[#161e00] font-headline font-black text-xs flex items-center justify-center shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-xs text-white">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[#c4c9ac] mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Equipment Checklist */}
            {quickCardDrill.equipment && (
              <div className="p-3 rounded-xl bg-black/20 text-xs flex items-center justify-between">
                <span className="text-[#c4c9ac] font-bold">Gear Needed:</span>
                <div className="flex gap-1.5">
                  {quickCardDrill.equipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-white text-[10px]">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectDrill(quickCardDrill);
                  setQuickCardDrill(null);
                  onNavigate('drill-practice');
                }}
                className="flex-1 py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
                <span>Launch Camera Tracking</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
