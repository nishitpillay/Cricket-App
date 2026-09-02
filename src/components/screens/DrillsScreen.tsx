import React, { useState } from 'react';
import { DrillItem, ScreenType } from '../../types';
import { mockDrills } from '../../data/mockData';
import { playBeep } from '../../utils/audioFeedback';

interface DrillsScreenProps {
  onSelectDrill: (drill: DrillItem) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DrillsScreen: React.FC<DrillsScreenProps> = ({ onSelectDrill, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Batting', 'Bowling', 'Fielding', 'Fitness', 'Masterclass'];

  const filteredDrills = mockDrills.filter((drill) => {
    const matchesCat = activeCategory === 'All' || drill.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.coach.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const drillOfTheDay = mockDrills.find((d) => d.isDrillOfDay) || mockDrills[0];

  const handleOpenDrill = (drill: DrillItem) => {
    playBeep(750, 0.1);
    onSelectDrill(drill);
    onNavigate('drill-details');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-4xl mx-auto">
      {/* Sticky Search and Filters */}
      <div className="px-4 sm:px-6 pt-3 pb-3 sticky top-16 z-30 bg-[#131313]/90 backdrop-blur-md border-b border-white/5">
        <div className="relative w-full mb-3">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c9ac] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drills, skills, or coaches..."
            className="w-full bg-[#201f1f]/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#e5e2e1] placeholder:text-[#c4c9ac] focus:outline-none focus:border-[#c3f400] focus:ring-1 focus:ring-[#c3f400] transition-all glass"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-2 pb-1 snap-x hide-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playBeep(600, 0.06);
                  setActiveCategory(cat);
                }}
                className={`snap-start shrink-0 px-3.5 py-1.5 rounded-full text-xs font-headline font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.35)] border border-[#c3f400]'
                    : 'bg-[#201f1f]/60 text-[#c4c9ac] border border-white/10 hover:border-[#c3f400]/40 hover:text-white glass'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 sm:px-6 py-4">
        {/* Academy Masterclass & Rules Feature Callout */}
        <section>
          <div
            onClick={() => onNavigate('academy')}
            className="p-5 rounded-3xl bg-gradient-to-r from-[#1c260f] via-[#161f0d] to-[#202020] border border-[#c3f400]/40 hover:border-[#c3f400] shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold shadow-[0_0_20px_rgba(195,244,0,0.4)] group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[28px]">school</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#c3f400]/20 text-[#c3f400] uppercase tracking-wider">
                    Academy & Guides
                  </span>
                  <span className="text-[10px] text-[#ffdb3c] font-bold">New Tutorials</span>
                </div>
                <h3 className="font-headline font-black text-base sm:text-lg text-white group-hover:text-[#c3f400] transition-colors">
                  Cricket Mechanics & Rule Breakdowns
                </h3>
                <p className="text-xs text-[#c4c9ac] mt-0.5">
                  Visual LBW rules, Jargon glossary, still-head drills & gear sizing checklists.
                </p>
              </div>
            </div>

            <button className="px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center gap-1 group-hover:bg-[#abd600] transition-colors shrink-0">
              <span>Open Academy</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Featured: Drill of the Day */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-lg text-white">Drill of the Day</h2>
            <span className="px-2 py-0.5 bg-[#ffdb3c]/15 text-[#ffdb3c] font-headline font-bold text-[10px] rounded border border-[#ffdb3c]/30 uppercase tracking-widest">
              Premium
            </span>
          </div>

          <div
            onClick={() => handleOpenDrill(drillOfTheDay)}
            className="relative w-full h-[280px] rounded-2xl overflow-hidden glass group cursor-pointer border border-[#c3f400]/30 shadow-[0_4px_24px_rgba(195,244,0,0.12)]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${drillOfTheDay.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent" />

            {/* Play Button Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center shadow-[0_0_30px_rgba(195,244,0,0.7)] backdrop-blur-sm transition-transform group-hover:scale-115">
                <span className="material-symbols-outlined text-[34px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </div>
            </div>

            {/* Bottom Content Info */}
            <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col gap-1 z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black/70 backdrop-blur text-[#c3f400] font-headline font-bold text-[10px] rounded border border-white/10">
                  {drillOfTheDay.category}
                </span>
                <span className="px-2 py-0.5 bg-black/70 backdrop-blur text-white font-headline font-bold text-[10px] rounded border border-white/10">
                  {drillOfTheDay.level}
                </span>
              </div>
              <h3 className="font-headline font-bold text-xl text-white group-hover:text-[#c3f400] transition-colors">
                {drillOfTheDay.title}
              </h3>
              <div className="flex items-center gap-3 text-[#c4c9ac] text-xs font-medium">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>{drillOfTheDay.duration}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  <span>{drillOfTheDay.coach}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended for You Horizontal Carousel */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-headline font-bold text-lg text-white">Recommended For You</h2>
              <p className="text-xs text-[#c4c9ac]">Based on recent footwork analysis</p>
            </div>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-[#c3f400] font-headline font-bold text-xs hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6">
            {filteredDrills.slice(1, 4).map((drill) => (
              <div
                key={drill.id}
                onClick={() => handleOpenDrill(drill)}
                className="snap-start shrink-0 w-[240px] rounded-2xl glass border border-white/10 overflow-hidden group cursor-pointer hover:border-[#c3f400]/40 transition-all shadow-lg flex flex-col"
              >
                <div className="relative h-[135px] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${drill.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201f1f] to-transparent" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur text-white font-bold text-[10px] rounded border border-white/10 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#c3f400]">timer</span>
                    {drill.duration}
                  </div>
                </div>

                <div className="p-3.5 flex flex-col gap-1.5 bg-[#201f1f]/50 flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">
                        {drill.category}
                      </span>
                      <span className="text-[10px] font-bold text-[#c4c9ac]">
                        {drill.level}
                      </span>
                    </div>
                    <h4 className="font-headline font-bold text-sm text-white line-clamp-1 group-hover:text-[#c3f400] transition-colors">
                      {drill.title}
                    </h4>
                  </div>

                  {drill.progressPercent ? (
                    <div>
                      <div className="w-full h-1.5 bg-[#353534] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#c3f400] to-white rounded-full shadow-[0_0_6px_#c3f400]"
                          style={{ width: `${drill.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#c4c9ac] text-right mt-1">
                        {drill.progressPercent}% Completed
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[#c4c9ac] text-[11px]">
                      <span className="material-symbols-outlined text-[14px] text-[#e9c400]">star</span>
                      <span>New drill added</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Power Building List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-lg text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffdb3c]">bolt</span>
              Power Building
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {mockDrills
              .filter((d) => d.id === 'drill-explosive-core' || d.id === 'drill-heavy-bat')
              .map((drill) => (
                <div
                  key={drill.id}
                  onClick={() => handleOpenDrill(drill)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl glass border border-white/10 hover:border-[#c3f400]/40 transition-all cursor-pointer bg-[#201f1f]/50 group shadow-md"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url('${drill.image}')` }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 bg-[#ffdb3c]/15 text-[#ffdb3c] font-headline font-bold text-[9px] rounded uppercase tracking-wider">
                        {drill.category}
                      </span>
                      <span className="text-[11px] text-[#c4c9ac] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        {drill.duration}
                      </span>
                    </div>
                    <h4 className="font-headline font-bold text-sm text-white truncate group-hover:text-[#c3f400] transition-colors">
                      {drill.title}
                    </h4>
                    <p className="text-xs text-[#c4c9ac] truncate">{drill.description}</p>
                  </div>

                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-white group-hover:bg-[#c3f400] group-hover:text-[#161e00] group-hover:border-[#c3f400] transition-all">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};
