import React, { useState } from 'react';
import { mockGearGuides, GearGuideSection } from '../../data/academyData';
import { playBeep } from '../../utils/audioFeedback';

export const GearGuideWidget: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<GearGuideSection>(mockGearGuides[0]);

  // Interactive Bat Sizing Calculator State
  const [playerHeightFeet, setPlayerHeightFeet] = useState<number>(5);
  const [playerHeightInches, setPlayerHeightInches] = useState<number>(8);
  const [playerAge, setPlayerAge] = useState<number>(18);
  const [pitchType, setPitchType] = useState<'bouncy' | 'low-subcontinent' | 'standard'>('standard');

  // Calculate Bat Recommendations
  const calculateBatRecommendation = () => {
    const totalInches = playerHeightFeet * 12 + playerHeightInches;

    let size = 'Short Handle (SH)';
    let length = '33.5 inches';
    let weight = '2 lb 8 oz - 2 lb 10 oz';

    if (totalInches <= 45) {
      size = 'Size 0 (Junior)';
      length = '26 inches';
      weight = '1 lb 10 oz - 1 lb 14 oz';
    } else if (totalInches <= 48) {
      size = 'Size 1';
      length = '27 inches';
      weight = '1 lb 12 oz - 2 lb 0 oz';
    } else if (totalInches <= 51) {
      size = 'Size 2';
      length = '28 inches';
      weight = '1 lb 14 oz - 2 lb 2 oz';
    } else if (totalInches <= 54) {
      size = 'Size 3';
      length = '29 inches';
      weight = '2 lb 0 oz - 2 lb 4 oz';
    } else if (totalInches <= 57) {
      size = 'Size 4';
      length = '30 inches';
      weight = '2 lb 2 oz - 2 lb 6 oz';
    } else if (totalInches <= 60) {
      size = 'Size 5';
      length = '31 inches';
      weight = '2 lb 4 oz - 2 lb 7 oz';
    } else if (totalInches <= 63) {
      size = 'Size 6';
      length = '32 inches';
      weight = '2 lb 6 oz - 2 lb 9 oz';
    } else if (totalInches <= 66) {
      size = 'Harrow';
      length = '32.5 inches';
      weight = '2 lb 7 oz - 2 lb 10 oz';
    } else if (totalInches > 72) {
      size = 'Long Handle (LH)';
      length = '34.25 inches';
      weight = '2 lb 9 oz - 2 lb 13 oz';
    }

    const sweetSpot =
      pitchType === 'bouncy'
        ? 'Mid-High Sweet Spot (for back-foot punch, pull & cut)'
        : pitchType === 'low-subcontinent'
        ? 'Low Sweet Spot (for subcontinental drives & wristy flicks)'
        : 'Mid Sweet Spot (all-round balance for front and back foot)';

    return { size, length, weight, sweetSpot };
  };

  const batCalc = calculateBatRecommendation();

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mockGearGuides.map((guide) => {
          const isSelected = selectedSection.id === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => {
                playBeep(700, 0.05);
                setSelectedSection(guide);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-headline font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {guide.category}
            </button>
          );
        })}
      </div>

      {/* Main Gear Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Calculator / Diagram (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {selectedSection.id === 'gear-bat-sizing' ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#202020] border border-white/10 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400] text-[20px]">sports_cricket</span>
                  <h4 className="font-headline font-bold text-sm text-white">
                    Interactive Bat Sizing Calculator
                  </h4>
                </div>
                <span className="text-[10px] text-[#c4c9ac] font-mono">Custom Fit Engine</span>
              </div>

              {/* Height Sliders */}
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1.5">
                  <span>Player Height:</span>
                  <span className="text-[#c3f400]">
                    {playerHeightFeet} ft {playerHeightInches} in ({Math.round((playerHeightFeet * 12 + playerHeightInches) * 2.54)} cm)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#c4c9ac] block mb-1">Feet (ft)</label>
                    <input
                      type="range"
                      min={3}
                      max={6}
                      value={playerHeightFeet}
                      onChange={(e) => setPlayerHeightFeet(Number(e.target.value))}
                      className="w-full accent-[#c3f400] cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c4c9ac] block mb-1">Inches (in)</label>
                    <input
                      type="range"
                      min={0}
                      max={11}
                      value={playerHeightInches}
                      onChange={(e) => setPlayerHeightInches(Number(e.target.value))}
                      className="w-full accent-[#c3f400] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Pitch Conditions / Profile Selection */}
              <div>
                <label className="text-xs font-bold text-white block mb-1.5">Playing Conditions / Pitch Style:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPitchType('standard')}
                    className={`p-2 rounded-xl text-[11px] font-bold transition-all border ${
                      pitchType === 'standard'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80'
                    }`}
                  >
                    All-Round (Mid)
                  </button>
                  <button
                    onClick={() => setPitchType('bouncy')}
                    className={`p-2 rounded-xl text-[11px] font-bold transition-all border ${
                      pitchType === 'bouncy'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80'
                    }`}
                  >
                    Bouncy (Mid-High)
                  </button>
                  <button
                    onClick={() => setPitchType('low-subcontinent')}
                    className={`p-2 rounded-xl text-[11px] font-bold transition-all border ${
                      pitchType === 'low-subcontinent'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80'
                    }`}
                  >
                    Subcontinent (Low)
                  </button>
                </div>
              </div>

              {/* Recommended Bat Result Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c260f] to-[#12170a] border border-[#c3f400]/40 flex flex-col gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  Your Recommended Bat Specs
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-black text-2xl text-white">
                    {batCalc.size}
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#c3f400] text-[#161e00]">
                    {batCalc.length}
                  </span>
                </div>
                <div className="text-xs text-[#c4c9ac] space-y-1 mt-1">
                  <p>⚖️ <strong>Ideal Weight:</strong> <span className="text-white">{batCalc.weight}</span></p>
                  <p>🎯 <strong>Profile:</strong> <span className="text-white">{batCalc.sweetSpot}</span></p>
                </div>
              </div>
            </div>
          ) : selectedSection.id === 'gear-helmet-safety' ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#202020] border border-white/10 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffdb3c] text-[22px]">health_and_safety</span>
                <h4 className="font-headline font-bold text-sm text-white">
                  BS 7928:2013 Safety Standards Checklist
                </h4>
              </div>

              {/* Visual Helmet Gap Diagram */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-white/10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 border-4 border-[#ffdb3c] flex items-center justify-center relative mb-2 shadow-lg">
                  <span className="material-symbols-outlined text-4xl text-[#ffdb3c]">sports_motorsports</span>
                  {/* StemGuard indicator */}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#c3f400] text-[#161e00]">
                    STEMGUARD OK
                  </span>
                </div>
                <span className="font-headline font-bold text-xs text-white">
                  Grille-to-Peak Clearance Test
                </span>
                <p className="text-[11px] text-[#c4c9ac] mt-1 max-w-xs">
                  A regulation 5.5cm cricket ball must NEVER penetrate between the peak and metal bars when forced.
                </p>
              </div>

              {/* Safety Alert */}
              {selectedSection.safetyAlert && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-red-400 text-[18px] shrink-0 mt-0.5">
                    warning
                  </span>
                  <p className="text-xs text-red-200 leading-relaxed">{selectedSection.safetyAlert}</p>
                </div>
              )}
            </div>
          ) : selectedSection.id === 'gear-pads-protection' ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#202020] border border-white/10 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[20px]">shield</span>
                <h4 className="font-headline font-bold text-sm text-white">
                  Batting Pad Fitting Diagram
                </h4>
              </div>

              {/* 3 Step Pad Anatomy */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-xs text-white">Top Hat / Wing</h5>
                    <p className="text-[11px] text-[#c4c9ac]">Must sit under the hip socket to allow crouching without hitting thigh guard.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-xs text-[#c3f400]">Knee Bolster (Roll)</h5>
                    <p className="text-[11px] text-white/90 font-medium">Critical: The centered circle must align squarely over the kneecap (patella).</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#c3f400] text-[#161e00] text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-xs text-white">Shin & Instep</h5>
                    <p className="text-[11px] text-[#c4c9ac]">Rests comfortably on the shoe tongue without dragging on the grass.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-3xl bg-[#202020] border border-white/10 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[20px]">pan_tool</span>
                <h4 className="font-headline font-bold text-sm text-white">
                  Glove Styles & Spike Types
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold text-[#c3f400] uppercase block mb-1">Split-Finger</span>
                  <p className="text-xs text-white">Maximum flexibility for 360° shots and bottom hand wrist play.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold text-[#ffdb3c] uppercase block mb-1">Sausage-Finger</span>
                  <p className="text-xs text-white">Maximum density foam tubes for facing 140+ km/h fast bowling.</p>
                </div>
              </div>
            </div>
          )}

          {/* Official Specs Table (if available) */}
          {selectedSection.specsTable && (
            <div className="p-4 rounded-3xl bg-[#181818] border border-white/10 overflow-x-auto max-h-60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4c9ac] block mb-2">
                MCC Junior to Senior Bat Sizing Matrix
              </span>
              <table className="w-full text-[11px] text-left text-white/90">
                <thead className="border-b border-white/15 text-[#c3f400]">
                  <tr>
                    {selectedSection.specsTable.header.map((h, i) => (
                      <th key={i} className="py-1.5 px-2 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#c4c9ac]">
                  {selectedSection.specsTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/5">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-1.5 px-2 ${cIdx === 0 ? 'font-bold text-white' : ''}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Step Checklist & Pro Tips (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Summary Card */}
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <h3 className="font-headline font-black text-lg text-white mb-1.5">
              {selectedSection.title}
            </h3>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">{selectedSection.summary}</p>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#ffdb3c]/10 border border-[#ffdb3c]/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdb3c] block mb-1">
                Equipment Specialist Tip:
              </span>
              <p className="text-xs text-white/95 italic font-medium">{selectedSection.proTip}</p>
            </div>
          </div>

          {/* Sizing & Inspection Checklist */}
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#c3f400] mb-3">
              Pre-Purchase & Fitting Checklist
            </h4>
            <ul className="space-y-3">
              {selectedSection.checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                  <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
