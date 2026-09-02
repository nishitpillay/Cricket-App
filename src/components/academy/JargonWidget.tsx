import React, { useState } from 'react';
import { mockJargon, JargonTerm } from '../../data/academyData';
import { playBeep } from '../../utils/audioFeedback';

export const JargonWidget: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Fielding' | 'Bowling' | 'Batting' | 'Slang & Tactics'>('All');
  const [selectedTerm, setSelectedTerm] = useState<JargonTerm>(mockJargon[0]);
  const [selectedFieldCoord, setSelectedFieldCoord] = useState<{ name: string; x: number; y: number; desc: string } | null>(null);

  const categories = ['All', 'Fielding', 'Bowling', 'Batting', 'Slang & Tactics'] as const;

  const filteredJargon = mockJargon.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Key 360 Field Positions for Visual Radar
  const fieldPositions = [
    { name: 'Silly Mid-On', x: 44, y: 47, desc: 'Ultra-close catching position on the leg side right beside the batter.' },
    { name: 'Gully', x: 72, y: 25, desc: 'Positioned backward of point for catching sliced deflections and edges.' },
    { name: 'Cow Corner', x: 22, y: 72, desc: 'Deep boundary region between deep mid-wicket and long-on for slogs.' },
    { name: 'Sweeper Cover', x: 82, y: 48, desc: 'Boundary rider on the off-side to prevent boundaries off cover drives.' },
    { name: 'Slip Cordon', x: 60, y: 15, desc: 'Slips 1st, 2nd, and 3rd waiting for outside edges behind wicketkeeper.' },
    { name: 'Fine Leg', x: 28, y: 18, desc: 'Behind the batter on the leg-side boundary to stop glances and hooks.' },
    { name: 'Mid-Off', x: 60, y: 62, desc: 'Inner ring position on the off side preventing straight singles.' },
    { name: 'Mid-Wicket', x: 32, y: 52, desc: 'Inner ring position on the leg side catching wristy flicks.' },
    { name: 'Point', x: 78, y: 36, desc: 'Directly square on the off side, crucial for cutting off back-foot square drives.' }
  ];

  const handleSelectTerm = (term: JargonTerm) => {
    playBeep(750, 0.05);
    setSelectedTerm(term);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search terms (e.g., Doosra, Silly Mid-On)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#202020] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#c3f400] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playBeep(650, 0.04);
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Term Deck + Term Detail / Field Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Term List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredJargon.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#202020] border border-white/10">
              <span className="material-symbols-outlined text-gray-500 text-4xl mb-2">menu_book</span>
              <p className="text-xs text-[#c4c9ac]">No matching cricket terms found for "{searchQuery}".</p>
            </div>
          ) : (
            filteredJargon.map((item) => {
              const isSelected = selectedTerm?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTerm(item)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-lg'
                      : 'bg-[#1e1e1e] border-white/5 hover:border-white/20 text-white/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-headline font-bold text-sm text-white group-hover:text-[#c3f400] transition-colors">
                        {item.term}
                      </span>
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-[#c3f400] uppercase">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#c4c9ac] line-clamp-2 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#c4c9ac] group-hover:text-[#c3f400] group-hover:translate-x-0.5 transition-transform shrink-0 mt-1">
                    chevron_right
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Term Detail & Interactive Visualizer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Term Card Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#202020] border border-white/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 uppercase">
                  {selectedTerm.category} Glossary
                </span>
                {selectedTerm.pronunciation && (
                  <span className="text-xs text-[#c4c9ac] font-mono">{selectedTerm.pronunciation}</span>
                )}
              </div>
              <h3 className="font-headline font-black text-2xl text-white tracking-tight">
                {selectedTerm.term}
              </h3>
              <p className="text-sm text-white/90 leading-relaxed mt-2.5">
                {selectedTerm.definition}
              </p>
            </div>

            {/* Historical Origin / Context */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdb3c] block mb-1">
                Cricket Origin & Tactical Purpose:
              </span>
              <p className="text-xs text-[#c4c9ac] leading-relaxed">
                {selectedTerm.originOrContext}
              </p>
            </div>

            {/* Example Usage */}
            <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400] block mb-0.5">
                Commentary Example:
              </span>
              <p className="text-xs text-white/90 italic">
                "{selectedTerm.exampleSentence}"
              </p>
            </div>
          </div>

          {/* Interactive 360 Field Position Radar (If Fielding Term or explore mode) */}
          <div className="p-5 rounded-3xl bg-[#181818] border border-white/10 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[20px]">explore</span>
                <h4 className="font-headline font-bold text-sm text-white">
                  360° Field Position Radar
                </h4>
              </div>
              <span className="text-[10px] text-[#c4c9ac]">Tap any position dot to inspect</span>
            </div>

            {/* Interactive Oval SVG */}
            <div className="relative w-full aspect-[16/10] bg-[#142617] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden p-2">
              {/* Outer boundary line */}
              <div className="absolute inset-4 rounded-[50%] border border-dashed border-white/30" />
              {/* 30-yard circle */}
              <div className="absolute w-[60%] h-[60%] rounded-[50%] border-2 border-[#c3f400]/40 bg-[#1b341f]/50" />

              {/* Pitch strip in center */}
              <div className="absolute w-4 h-16 bg-[#caa469] rounded-sm flex flex-col justify-between py-1 items-center shadow-md">
                <div className="w-2.5 h-0.5 bg-white" />
                <div className="w-2.5 h-0.5 bg-white" />
              </div>

              {/* Batter / Keeper reference text */}
              <span className="absolute top-[32%] text-[8px] font-mono text-white/40">KEEPER</span>
              <span className="absolute bottom-[32%] text-[8px] font-mono text-white/40">BOWLER</span>

              {/* Fielder Position Pins */}
              {fieldPositions.map((pos) => {
                const isSelected = selectedFieldCoord?.name === pos.name || selectedTerm.term.includes(pos.name);
                return (
                  <button
                    key={pos.name}
                    onClick={() => {
                      playBeep(800, 0.05);
                      setSelectedFieldCoord(pos);
                    }}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all shadow-md flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#c3f400] text-[#161e00] scale-110 ring-2 ring-white z-20'
                        : 'bg-black/75 text-white/90 hover:bg-[#c3f400] hover:text-[#161e00] border border-white/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                    {pos.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Pin Callout */}
            {selectedFieldCoord && (
              <div className="p-3 rounded-2xl bg-[#202020] border border-[#c3f400]/30 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-headline font-bold text-xs text-[#c3f400]">
                    {selectedFieldCoord.name}
                  </span>
                  <button
                    onClick={() => setSelectedFieldCoord(null)}
                    className="text-[10px] text-[#c4c9ac] hover:text-white"
                  >
                    ✕ Close
                  </button>
                </div>
                <p className="text-xs text-white/90 mt-1">{selectedFieldCoord.desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
