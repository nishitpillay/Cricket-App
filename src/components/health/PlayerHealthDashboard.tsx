import React, { useState } from 'react';
import { PlayerHealthRecord, AIRecoveryPlan, ScreenType } from '../../types';
import { initialHealthRecord, initialAIRecoveryPlan, healthPresets, HealthPreset } from '../../data/healthData';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PlayerHealthDashboardProps {
  onNavigate?: (screen: ScreenType) => void;
}

export const PlayerHealthDashboard: React.FC<PlayerHealthDashboardProps> = ({ onNavigate }) => {
  const [healthData, setHealthData] = useState<PlayerHealthRecord>(initialHealthRecord);
  const [aiRecoveryPlan, setAiRecoveryPlan] = useState<AIRecoveryPlan>(initialAIRecoveryPlan);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rhr-hrv' | 'sleep' | 'workload' | 'ai-plan'>('overview');
  
  // Custom consultation input
  const [customAthleteNote, setCustomAthleteNote] = useState<string>('');
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('Lower Back');
  const [aiSuccessBadge, setAiSuccessBadge] = useState<boolean>(false);

  // Quick preset selector
  const handleApplyPreset = async (preset: HealthPreset) => {
    playBeep(700, 0.05);
    const updatedRecord: PlayerHealthRecord = {
      ...healthData,
      restingHeartRate: preset.rhr,
      hrvMs: preset.hrv,
      sleepHours: preset.sleep,
      sleepQualityScore: preset.sleepQuality,
      dailyWorkloadStrainAU: preset.workload,
      acwr: preset.acwr,
      bowlingDeliveriesCount: preset.bowlingBalls,
      muscleSorenessScore: preset.soreness,
      // Recalculate quick score
      readinessScore: preset.id === 'optimal' ? 88 : preset.id === 'heavy-bowling' ? 68 : preset.id === 'sleep-deprived' ? 62 : 95,
      readinessTier: preset.id === 'optimal' ? 'OPTIMAL' : preset.id === 'heavy-bowling' ? 'MODERATE' : preset.id === 'sleep-deprived' ? 'FATIGUE WARNING' : 'OPTIMAL'
    };
    setHealthData(updatedRecord);
    setCustomAthleteNote(preset.complaintNotes);
  };

  // Generate / Regenerate AI Recovery Recommendation
  const handleGenerateAIRecovery = async () => {
    playBeep(850, 0.08);
    setIsLoadingAI(true);
    setAiSuccessBadge(false);

    try {
      const response = await fetch('/api/recovery-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restingHeartRate: healthData.restingHeartRate,
          baselineRhr: healthData.baselineRhr,
          hrvMs: healthData.hrvMs,
          baselineHrv: healthData.baselineHrv,
          sleepHours: healthData.sleepHours,
          sleepQualityScore: healthData.sleepQualityScore,
          workloadStrain: healthData.dailyWorkloadStrainAU,
          acuteWorkload: healthData.acuteWorkload7d,
          chronicWorkload: healthData.chronicWorkload28d,
          acwr: healthData.acwr,
          bowlingDeliveriesCount: healthData.bowlingDeliveriesCount,
          highSpeedRunningKm: healthData.highSpeedRunningKm,
          muscleSoreness: healthData.muscleSorenessScore,
          userNotes: customAthleteNote ? `${customAthleteNote} (Primary Sensation Area: ${selectedBodyArea})` : `Primary focus area: ${selectedBodyArea}`,
          specialty: healthData.specialty,
          playerName: healthData.playerName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setAiRecoveryPlan(result.data);
          // Sync updated readiness score & tier
          setHealthData(prev => ({
            ...prev,
            readinessScore: result.data.readinessScore || prev.readinessScore,
            readinessTier: result.data.readinessTier || prev.readinessTier
          }));
          playCelebration();
          setAiSuccessBadge(true);
          setTimeout(() => setAiSuccessBadge(false), 4000);
        }
      } else {
        console.warn('API returned non-200, fallback local plan maintained');
      }
    } catch (err) {
      console.error('Failed to contact recovery API, using local recovery calculation', err);
    } finally {
      setIsLoadingAI(false);
      setActiveTab('ai-plan');
    }
  };

  // Color helper for readiness score
  const getReadinessColor = (score: number) => {
    if (score >= 85) return '#c3f400'; // Lime green
    if (score >= 70) return '#9cf0ff'; // Cyan
    if (score >= 55) return '#ffdb3c'; // Yellow
    return '#ffb4ab'; // Red warning
  };

  const readinessColor = getReadinessColor(healthData.readinessScore);

  // 7-day RHR chart path
  const rhrPoints = healthData.sevenDayTrends.map((t, idx) => {
    const x = (idx / (healthData.sevenDayTrends.length - 1)) * 260 + 20;
    // Map 44-60 bpm to height 80-20
    const y = 85 - ((t.restingHeartRate - 44) / 16) * 65;
    return `${x},${y}`;
  }).join(' ');

  // 7-day HRV chart path
  const hrvPoints = healthData.sevenDayTrends.map((t, idx) => {
    const x = (idx / (healthData.sevenDayTrends.length - 1)) * 260 + 20;
    // Map 50-95 ms to height 80-20
    const y = 85 - ((t.hrvMs - 50) / 45) * 65;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-6 animate-fadeIn w-full">
      {/* 1. Header Readiness Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1c1b1b] glass p-6 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#c3f400]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Athlete Bio & Main Readiness Gauge */}
          <div className="flex items-center gap-5">
            {/* Radial Readiness Score Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#2b2a2a"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={readinessColor}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * healthData.readinessScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                  {healthData.readinessScore}
                </span>
                <span className="text-[9px] font-bold text-[#c4c9ac] uppercase tracking-widest mt-0.5">
                  READINESS
                </span>
              </div>
            </div>

            {/* Title & Status Badges */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-headline font-black text-xl sm:text-2xl text-white">
                  Player Health & Readiness
                </h2>
                <span
                  className="px-2.5 py-0.5 rounded-full font-headline font-extrabold text-[10px] tracking-wider uppercase border"
                  style={{
                    backgroundColor: `${readinessColor}15`,
                    color: readinessColor,
                    borderColor: `${readinessColor}40`
                  }}
                >
                  {healthData.readinessTier}
                </span>
              </div>

              <p className="text-xs text-[#c4c9ac] line-clamp-1">
                Bio-telemetry: Resting HR, Sleep Circadian Architecture & Acute:Chronic Workload
              </p>

              <div className="flex items-center gap-3 text-xs text-[#c4c9ac] pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[#c3f400] text-[16px]">favorite</span>
                  RHR: <strong className="text-white">{healthData.restingHeartRate} bpm</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[#9cf0ff] text-[16px]">bedtime</span>
                  Sleep: <strong className="text-white">{healthData.sleepHours}h ({healthData.sleepQualityScore}%)</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[#ffdb3c] text-[16px]">speed</span>
                  ACWR: <strong className="text-white">{healthData.acwr.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick AI Action Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleGenerateAIRecovery}
              disabled={isLoadingAI}
              className="px-5 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs sm:text-sm hover:bg-[#abd600] active:scale-95 transition-all shadow-[0_0_20px_rgba(195,244,0,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLoadingAI ? 'animate-spin' : ''}`}>
                {isLoadingAI ? 'progress_activity' : 'smart_toy'}
              </span>
              <span>{isLoadingAI ? 'Analyzing Biomarkers...' : 'AI Recovery Prescriptions'}</span>
            </button>
          </div>
        </div>

        {/* Quick Simulation Presets */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#c4c9ac] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#c3f400] text-[16px]">tune</span>
              Load Scenario Presets:
            </span>
            {aiSuccessBadge && (
              <span className="text-[10px] text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                ✓ AI Prescription Updated
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {healthPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-[#c3f400]/40 text-left transition-all hover:bg-black/50 group cursor-pointer"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-white group-hover:text-[#c3f400] transition-colors">{preset.name}</span>
                </div>
                <div className="text-[9px] text-[#c4c9ac] font-mono mt-0.5">{preset.badge}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#201f1f] border border-white/10 glass overflow-x-auto">
        {[
          { id: 'overview', label: 'Telemetry Overview', icon: 'grid_view' },
          { id: 'rhr-hrv', label: 'RHR & HRV (Cardiac)', icon: 'favorite' },
          { id: 'sleep', label: 'Sleep & Circadian', icon: 'bedtime' },
          { id: 'workload', label: 'Workload & ACWR', icon: 'fitness_center' },
          { id: 'ai-plan', label: 'AI Recovery Advisor', icon: 'smart_toy', badge: 'AI PRO' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playBeep(700, 0.03);
              setActiveTab(tab.id as any);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono font-bold ${
                activeTab === tab.id ? 'bg-[#161e00] text-[#c3f400]' : 'bg-[#ffdb3c]/20 text-[#ffdb3c]'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT: OVERVIEW (3 Key Pillars Grid) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          {/* Pillar 1: Resting Heart Rate & Autonomic Tone */}
          <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4 shadow-lg hover:border-[#c3f400]/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[22px]">favorite</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-white">Resting HR & HRV</h3>
                  <span className="text-[10px] text-[#c4c9ac]">Autonomic Nervous Recovery</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded font-bold">
                {healthData.restingHeartRate <= healthData.baselineRhr + 2 ? 'STABILIZED' : 'ELEVATED STRAIN'}
              </span>
            </div>

            {/* Metric Displays */}
            <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-2xl border border-white/5">
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">RESTING HR</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-white">{healthData.restingHeartRate}</span>
                  <span className="text-xs text-[#c4c9ac]">bpm</span>
                </div>
                <span className="text-[10px] font-mono text-[#c4c9ac]">
                  Baseline: {healthData.baselineRhr} ({healthData.restingHeartRate - healthData.baselineRhr >= 0 ? '+' : ''}{healthData.restingHeartRate - healthData.baselineRhr})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">HRV (rMSSD)</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-[#9cf0ff]">{healthData.hrvMs}</span>
                  <span className="text-xs text-[#c4c9ac]">ms</span>
                </div>
                <span className="text-[10px] font-mono text-[#c4c9ac]">
                  Baseline: {healthData.baselineHrv} ms
                </span>
              </div>
            </div>

            {/* Sparkline Visual */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-[#c4c9ac]">
                <span>7-Day Heart Rate Stability</span>
                <span className="font-mono text-[#c3f400]">Avg: 49.6 bpm</span>
              </div>
              <svg className="w-full h-12 bg-black/20 rounded-xl p-1 overflow-visible" viewBox="0 0 300 100">
                {/* Baseline reference */}
                <line x1="20" y1="65" x2="280" y2="65" stroke="#444" strokeWidth="1" strokeDasharray="3,3" />
                <polyline fill="none" stroke="#c3f400" strokeWidth="2.5" points={rhrPoints} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <button
              onClick={() => setActiveTab('rhr-hrv')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#c3f400] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Cardiac Telemetry</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Pillar 2: Sleep Quality & Circadian Stages */}
          <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4 shadow-lg hover:border-[#9cf0ff]/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#9cf0ff]/10 flex items-center justify-center text-[#9cf0ff]">
                  <span className="material-symbols-outlined text-[22px]">bedtime</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-white">Sleep & Circadian</h3>
                  <span className="text-[10px] text-[#c4c9ac]">Cellular & Neuromuscular Repair</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#9cf0ff] bg-[#9cf0ff]/10 px-2 py-0.5 rounded font-bold">
                SCORE: {healthData.sleepQualityScore}%
              </span>
            </div>

            {/* Metric Displays */}
            <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-2xl border border-white/5">
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">SLEEP DURATION</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-white">{healthData.sleepHours}</span>
                  <span className="text-xs text-[#c4c9ac]">hrs</span>
                </div>
                <span className="text-[10px] font-mono text-[#c3f400]">
                  {healthData.sleepHours >= 8.0 ? '✓ Target Achieved' : 'Deficit Identified'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">DEEP & REM</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-[#ffdb3c]">
                    {Math.round(((healthData.deepSleepMinutes + healthData.remSleepMinutes) / 60) * 10) / 10}
                  </span>
                  <span className="text-xs text-[#c4c9ac]">hrs</span>
                </div>
                <span className="text-[10px] font-mono text-[#c4c9ac]">
                  {Math.round(((healthData.deepSleepMinutes + healthData.remSleepMinutes) / (healthData.sleepHours * 60)) * 100)}% of total sleep
                </span>
              </div>
            </div>

            {/* Sleep Architecture Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] text-[#c4c9ac]">
                <span>Stage Breakdown</span>
                <span className="font-mono">Deep: {healthData.deepSleepMinutes}m | REM: {healthData.remSleepMinutes}m</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-white/10">
                <div style={{ width: '23%' }} className="bg-[#9cf0ff] h-full" title="Deep Sleep" />
                <div style={{ width: '24%' }} className="bg-[#ffdb3c] h-full" title="REM Sleep" />
                <div style={{ width: '53%' }} className="bg-white/30 h-full" title="Light Sleep" />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('sleep')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#9cf0ff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Circadian Architecture</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Pillar 3: Workload Intensity & ACWR */}
          <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4 shadow-lg hover:border-[#ffdb3c]/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#ffdb3c]/10 flex items-center justify-center text-[#ffdb3c]">
                  <span className="material-symbols-outlined text-[22px]">fitness_center</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-white">Workload & ACWR</h3>
                  <span className="text-[10px] text-[#c4c9ac]">Acute vs Chronic Injury Risk</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#ffdb3c] bg-[#ffdb3c]/10 px-2 py-0.5 rounded font-bold">
                {healthData.acwr <= 1.3 ? 'OPTIMAL SWEET SPOT' : 'SPIKE WARNING'}
              </span>
            </div>

            {/* Metric Displays */}
            <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-2xl border border-white/5">
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">ACWR RATIO</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-[#c3f400]">{healthData.acwr.toFixed(2)}</span>
                </div>
                <span className="text-[10px] font-mono text-[#c4c9ac]">
                  Target: 0.80 - 1.30
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#c4c9ac] block">BOWLING VOLUME</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline font-black text-2xl text-white">{healthData.bowlingDeliveriesCount}</span>
                  <span className="text-xs text-[#c4c9ac]">balls</span>
                </div>
                <span className="text-[10px] font-mono text-[#c4c9ac]">
                  ({(healthData.bowlingDeliveriesCount / 6).toFixed(1)} overs bowled)
                </span>
              </div>
            </div>

            {/* ACWR Continuum Spectrum */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] text-[#c4c9ac]">
                <span>Injury Continuum</span>
                <span className="font-mono text-[#c3f400]">Low Risk (0.84-1.25)</span>
              </div>
              <div className="relative w-full h-2.5 rounded-full overflow-hidden bg-gradient-to-r from-[#9cf0ff] via-[#c3f400] via-70% to-[#ffb4ab]">
                {/* Needle */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-white border border-black shadow"
                  style={{ left: `${Math.min(96, Math.max(4, ((healthData.acwr - 0.5) / 1.5) * 100))}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('workload')}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ffdb3c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Analyze Strain & Bowling Volume</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: RHR & HRV DETAILED */}
      {activeTab === 'rhr-hrv' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Interactive Graph */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-headline font-bold text-base text-white">Cardiac Telemetry & Autonomic Balance</h3>
                  <p className="text-xs text-[#c4c9ac]">Resting Heart Rate (bpm) & Heart Rate Variability (rMSSD ms)</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-[#c3f400]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f400]" /> RHR
                  </span>
                  <span className="flex items-center gap-1 text-[#9cf0ff]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9cf0ff]" /> HRV
                  </span>
                </div>
              </div>

              {/* Multi-Series Chart */}
              <div className="relative aspect-[16/7] bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="20" y1="50" x2="280" y2="50" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="20" y1="80" x2="280" y2="80" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* RHR Polyline */}
                  <polyline fill="none" stroke="#c3f400" strokeWidth="3" points={rhrPoints} strokeLinecap="round" />
                  {/* HRV Polyline */}
                  <polyline fill="none" stroke="#9cf0ff" strokeWidth="2.5" points={hrvPoints} strokeLinecap="round" strokeDasharray="4,2" />

                  {/* Data Points */}
                  {healthData.sevenDayTrends.map((t, idx) => {
                    const x = (idx / (healthData.sevenDayTrends.length - 1)) * 260 + 20;
                    const yRhr = 85 - ((t.restingHeartRate - 44) / 16) * 65;
                    const yHrv = 85 - ((t.hrvMs - 50) / 45) * 65;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={yRhr} r="4" fill="#c3f400" stroke="#161e00" strokeWidth="1.5" />
                        <circle cx={x} cy={yHrv} r="3.5" fill="#9cf0ff" stroke="#161e00" strokeWidth="1.5" />
                        <text x={x} y="98" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">
                          {t.dayLabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Cardiac Recovery</span>
                  <span className="font-headline font-bold text-lg text-white">96.4%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Sympathetic Stress</span>
                  <span className="font-headline font-bold text-lg text-[#c3f400]">Low (2.4 AU)</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Vagal Modulation</span>
                  <span className="font-headline font-bold text-lg text-[#9cf0ff]">Robust</span>
                </div>
              </div>
            </div>

            {/* Interactive RHR & HRV Adjuster / Logger */}
            <div className="p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Simulate / Log Today's RHR</h4>
                <p className="text-xs text-[#c4c9ac]">Adjust cardiac markers to see instant recovery updates</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Resting Heart Rate</span>
                    <span className="font-mono text-[#c3f400] font-bold">{healthData.restingHeartRate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="42"
                    max="65"
                    value={healthData.restingHeartRate}
                    onChange={(e) => {
                      const newRhr = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        restingHeartRate: newRhr
                      }));
                    }}
                    className="w-full accent-[#c3f400] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#666] font-mono">
                    <span>42 bpm (Elite)</span>
                    <span>65 bpm (Fatigued)</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Heart Rate Variability</span>
                    <span className="font-mono text-[#9cf0ff] font-bold">{healthData.hrvMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="100"
                    value={healthData.hrvMs}
                    onChange={(e) => {
                      const newHrv = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        hrvMs: newHrv
                      }));
                    }}
                    className="w-full accent-[#9cf0ff] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#666] font-mono">
                    <span>45 ms (Suppressed)</span>
                    <span>100 ms (Supercharged)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAIRecovery}
                className="w-full py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                Update AI Recovery Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: SLEEP & CIRCADIAN ARCHITECTURE */}
      {activeTab === 'sleep' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Sleep Architecture Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline font-bold text-base text-white">Circadian Architecture & Sleep Stages</h3>
                  <p className="text-xs text-[#c4c9ac]">Restorative Deep Sleep (Physical) & REM (Cognitive Hand-Eye Reflex)</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#9cf0ff] bg-[#9cf0ff]/10 px-3 py-1 rounded-full">
                  Efficiency: {healthData.sleepEfficiencyPct}%
                </span>
              </div>

              {/* Sleep Stage Visual Rings & Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Deep Sleep */}
                <div className="p-4 rounded-2xl bg-black/30 border border-[#9cf0ff]/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#9cf0ff] font-bold">Deep Sleep (Stage 3/4)</span>
                    <span className="material-symbols-outlined text-[#9cf0ff] text-[18px]">healing</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline font-black text-2xl text-white">{healthData.deepSleepMinutes}</span>
                    <span className="text-xs text-[#c4c9ac]">mins</span>
                  </div>
                  <p className="text-[10px] text-[#c4c9ac]">
                    Peak Growth Hormone release, muscle tissue rebuilding and spinal disc rehydration.
                  </p>
                </div>

                {/* REM Sleep */}
                <div className="p-4 rounded-2xl bg-black/30 border border-[#ffdb3c]/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#ffdb3c] font-bold">REM Sleep</span>
                    <span className="material-symbols-outlined text-[#ffdb3c] text-[18px]">psychology</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline font-black text-2xl text-white">{healthData.remSleepMinutes}</span>
                    <span className="text-xs text-[#c4c9ac]">mins</span>
                  </div>
                  <p className="text-[10px] text-[#c4c9ac]">
                    Motor memory consolidation: batting trigger footwork, swing timing, and slip reflex speed.
                  </p>
                </div>

                {/* Light Sleep & Debt */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white font-bold">Sleep Debt</span>
                    <span className="material-symbols-outlined text-[#c3f400] text-[18px]">timelapse</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline font-black text-2xl text-[#c3f400]">
                      {healthData.sleepDebtMinutes <= 0 ? `${Math.abs(healthData.sleepDebtMinutes)}m Banked` : `+${healthData.sleepDebtMinutes}m Debt`}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#c4c9ac]">
                    Cumulative 7-day sleep balance relative to baseline need (8.0 hours/night).
                  </p>
                </div>
              </div>

              {/* 7-Day Sleep Duration Bar Chart */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-bold text-white">7-Day Sleep History</span>
                <div className="grid grid-cols-7 gap-2 items-end h-28 bg-black/20 p-3 rounded-2xl">
                  {healthData.sevenDayTrends.map((day, i) => {
                    const heightPct = Math.min(100, (day.sleepHours / 10) * 100);
                    const isOptimal = day.sleepHours >= 7.5;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[9px] font-mono text-[#c4c9ac]">{day.sleepHours}h</span>
                        <div
                          className={`w-full rounded-t-lg transition-all ${isOptimal ? 'bg-[#9cf0ff]' : 'bg-[#ffb4ab]'}`}
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[9px] font-mono text-[#888]">{day.dayLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sleep Adjuster */}
            <div className="p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Log Sleep Session</h4>
                <p className="text-xs text-[#c4c9ac]">Adjust hours & perceived restfulness</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Total Sleep Duration</span>
                    <span className="font-mono text-[#9cf0ff] font-bold">{healthData.sleepHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="4.5"
                    max="10.5"
                    step="0.1"
                    value={healthData.sleepHours}
                    onChange={(e) => {
                      const newSleep = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        sleepHours: newSleep
                      }));
                    }}
                    className="w-full accent-[#9cf0ff] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Sleep Quality Score</span>
                    <span className="font-mono text-[#ffdb3c] font-bold">{healthData.sleepQualityScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={healthData.sleepQualityScore}
                    onChange={(e) => {
                      const newQ = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        sleepQualityScore: newQ
                      }));
                    }}
                    className="w-full accent-[#ffdb3c] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateAIRecovery}
                className="w-full py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                Generate Sleep Recovery Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: WORKLOAD & ACWR DETAILED */}
      {activeTab === 'workload' && (
        <div className="flex flex-col gap-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Workload Science Dashboard */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline font-bold text-base text-white">Workload Intensity & Injury Risk (ACWR)</h3>
                  <p className="text-xs text-[#c4c9ac]">Tim Gabbett ACWR Model: 7-Day Acute vs 28-Day Chronic Rolling Workload</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/10 px-3 py-1 rounded-full">
                  Ratio: {healthData.acwr.toFixed(2)}
                </span>
              </div>

              {/* Fast Bowler & Batter Specific Safety Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Acute Load (7d)</span>
                  <span className="font-headline font-bold text-xl text-white">{healthData.acuteWorkload7d} AU</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Chronic Load (28d)</span>
                  <span className="font-headline font-bold text-xl text-white">{healthData.chronicWorkload28d} AU</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">High Speed Running</span>
                  <span className="font-headline font-bold text-xl text-[#9cf0ff]">{healthData.highSpeedRunningKm} km</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Deliveries Count</span>
                  <span className="font-headline font-bold text-xl text-[#ffdb3c]">{healthData.bowlingDeliveriesCount}</span>
                </div>
              </div>

              {/* ACWR Zones Breakdown */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-3">
                <span className="text-xs font-bold text-white">Injury Risk Zone Thresholds</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9cf0ff] font-bold">&lt; 0.80 Under-loaded</span>
                    <span className="text-[#c4c9ac]">Fitness decay & unprepared for match spikes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#c3f400] font-bold">0.80 - 1.30 The "Sweet Spot"</span>
                    <span className="text-[#c3f400] font-bold">Lowest injury risk & maximal adaptation</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ffdb3c] font-bold">1.30 - 1.50 Caution Zone</span>
                    <span className="text-[#c4c9ac]">Moderate fatigue accumulation</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ffb4ab] font-bold">&gt; 1.50 Danger Spike Zone</span>
                    <span className="text-[#ffb4ab]">High risk of lumbar stress fracture & hamstring strain</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Muscle Soreness & Spell Logger */}
            <div className="p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col justify-between gap-4">
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Workload & Soreness Log</h4>
                <p className="text-xs text-[#c4c9ac]">Record today's deliveries & physical strain</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Bowling Deliveries (Today)</span>
                    <span className="font-mono text-[#c3f400] font-bold">{healthData.bowlingDeliveriesCount} balls</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="6"
                    value={healthData.bowlingDeliveriesCount}
                    onChange={(e) => {
                      const newBalls = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        bowlingDeliveriesCount: newBalls,
                        dailyWorkloadStrainAU: 400 + newBalls * 8
                      }));
                    }}
                    className="w-full accent-[#c3f400] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                  <span className="text-[9px] text-[#888] font-mono">
                    Equivalent: {(healthData.bowlingDeliveriesCount / 6).toFixed(0)} overs in nets/match
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#c4c9ac] font-bold">Subjective Muscle Soreness</span>
                    <span className="font-mono text-[#ffdb3c] font-bold">{healthData.muscleSorenessScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={healthData.muscleSorenessScore}
                    onChange={(e) => {
                      const newSore = Number(e.target.value);
                      setHealthData(prev => ({
                        ...prev,
                        muscleSorenessScore: newSore
                      }));
                    }}
                    className="w-full accent-[#ffdb3c] h-1.5 bg-[#353534] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#c4c9ac] font-bold uppercase">Target Soreness Site</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Lower Back', 'Hamstrings', 'Shoulder', 'Groin', 'Calves', 'Quads'].map((area) => (
                      <button
                        key={area}
                        onClick={() => setSelectedBodyArea(area)}
                        className={`p-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedBodyArea === area
                            ? 'bg-[#c3f400] text-[#161e00]'
                            : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAIRecovery}
                className="w-full py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                Calculate Safe Workload Adaptation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: AI-GENERATED RECOVERY RECOMMENDATION (Full Pro Suite) */}
      {activeTab === 'ai-plan' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top AI Prescription Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1e250f] via-[#1c1b1b] to-[#122126] border border-[#c3f400]/30 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.3)]">
                  <span className="material-symbols-outlined text-[28px]">sports_cricket</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-black text-lg sm:text-xl text-white">
                      AI Sports Medicine Recovery Prescription
                    </h3>
                    <span className="text-[10px] font-mono text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded font-bold">
                      VERIFIED PROTOCOL
                    </span>
                  </div>
                  <p className="text-xs text-[#c4c9ac]">
                    Tailored for {healthData.playerName} ({healthData.specialty})
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateAIRecovery}
                disabled={isLoadingAI}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-[#c3f400] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isLoadingAI ? 'animate-spin' : ''}`}>
                  {isLoadingAI ? 'progress_activity' : 'refresh'}
                </span>
                <span>Regenerate with AI</span>
              </button>
            </div>

            {/* High-Level Diagnostics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-[#c4c9ac] font-bold uppercase">Physiological Assessment</span>
                <p className="text-xs text-white leading-relaxed">{aiRecoveryPlan.readinessAssessment}</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-[#c4c9ac] font-bold uppercase">Workload & ACWR Verdict</span>
                <p className="text-xs text-white leading-relaxed">{aiRecoveryPlan.workloadVerdict}</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-[#c4c9ac] font-bold uppercase">Injury Risk Classification</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[#c3f400] text-[18px]">verified_user</span>
                  <span className="text-xs font-bold text-[#c3f400]">{aiRecoveryPlan.injuryRiskIndex}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Specialized Recovery Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pillar A: Prescribed Training Adaptations */}
            <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#c3f400]">
                <span className="material-symbols-outlined text-[22px]">fitness_center</span>
                <h4 className="font-headline font-bold text-sm text-white">Prescribed Training Adaptations</h4>
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] text-[#c4c9ac] uppercase font-bold">Session Directive</span>
                <span className="text-sm font-bold text-white">{aiRecoveryPlan.prescribedTrainingAdaptation.headline}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-0.5">
                  <span className="text-[10px] text-[#c4c9ac]">Bowling Over Cap:</span>
                  <strong className="text-[#c3f400]">{aiRecoveryPlan.prescribedTrainingAdaptation.maxBowlingOvers}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-0.5">
                  <span className="text-[10px] text-[#c4c9ac]">Maximal Sprints:</span>
                  <strong className={aiRecoveryPlan.prescribedTrainingAdaptation.highIntensitySprintsAllowed ? 'text-[#c3f400]' : 'text-[#ffb4ab]'}>
                    {aiRecoveryPlan.prescribedTrainingAdaptation.highIntensitySprintsAllowed ? '✓ Permitted (>25 km/h)' : '✕ Prohibited (Cap at 70%)'}
                  </strong>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#c4c9ac] uppercase font-bold">Recommended Match Drills</span>
                <div className="flex flex-col gap-1.5">
                  {aiRecoveryPlan.prescribedTrainingAdaptation.recommendedDrills.map((drill, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 text-xs text-white">
                      <span className="material-symbols-outlined text-[#c3f400] text-[16px]">check_circle</span>
                      <span>{drill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {aiRecoveryPlan.prescribedTrainingAdaptation.drillsToAvoid.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">Contraindicated / Avoid Today</span>
                  {aiRecoveryPlan.prescribedTrainingAdaptation.drillsToAvoid.map((avoid, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#ffb4ab]/10 text-xs text-[#ffb4ab]">
                      <span className="material-symbols-outlined text-[16px]">do_not_disturb_on</span>
                      <span>{avoid}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pillar B: Active Recovery & Hydrotherapy Routine */}
            <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#9cf0ff]">
                  <span className="material-symbols-outlined text-[22px]">hot_tub</span>
                  <h4 className="font-headline font-bold text-sm text-white">Active Physical Recovery Routine</h4>
                </div>
                <span className="text-xs font-mono font-bold text-[#9cf0ff]">
                  {aiRecoveryPlan.activeRecoveryRoutine.durationMinutes} mins
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-[#c4c9ac] uppercase font-bold block">Primary Modality</span>
                <span className="text-xs font-bold text-white">{aiRecoveryPlan.activeRecoveryRoutine.modality}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {aiRecoveryPlan.activeRecoveryRoutine.steps.map((step) => (
                  <div key={step.order} className="p-3 rounded-2xl bg-black/20 border border-white/5 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#9cf0ff]/20 text-[#9cf0ff] flex items-center justify-center text-[10px] font-mono">
                          {step.order}
                        </span>
                        {step.action}
                      </span>
                      <span className="font-mono text-[10px] text-[#9cf0ff] font-bold">{step.duration}</span>
                    </div>
                    <p className="text-[11px] text-[#c4c9ac] pl-6.5 leading-relaxed">{step.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar C: Nutrition & Hydration Formula */}
            <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#ffdb3c]">
                <span className="material-symbols-outlined text-[22px]">water_drop</span>
                <h4 className="font-headline font-bold text-sm text-white">Hydration & Nutrient Replenishment</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-[#c4c9ac] block">WATER TARGET</span>
                  <span className="font-headline font-black text-xl text-white">{aiRecoveryPlan.nutritionHydrationProtocol.waterIntakeLiters} L</span>
                  <span className="text-[9px] text-[#c4c9ac] block mt-0.5">With electrolyte concentration</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#c4c9ac] block">ELECTROLYTE DOSING</span>
                  <span className="text-xs font-bold text-[#ffdb3c] leading-tight block">
                    {aiRecoveryPlan.nutritionHydrationProtocol.electrolytesMg}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#c4c9ac] uppercase font-bold">Key Recovery Nutrients</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiRecoveryPlan.nutritionHydrationProtocol.keySupplements.map((supp, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-white flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[#ffdb3c] text-[16px] flex-shrink-0">medication</span>
                      <span>{supp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/5 text-[11px] text-[#c4c9ac]">
                <strong className="text-white block mb-0.5">Nutrient Window Timing:</strong>
                {aiRecoveryPlan.nutritionHydrationProtocol.mealTimingAdvice}
              </div>
            </div>

            {/* Pillar D: Circadian Sleep Optimization */}
            <div className="p-5 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-4 shadow-lg">
              <div className="flex items-center gap-2 text-[#9cf0ff]">
                <span className="material-symbols-outlined text-[22px]">nights_stay</span>
                <h4 className="font-headline font-bold text-sm text-white">Circadian & Sleep Optimization</h4>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/5">
                <span className="text-xs text-[#c4c9ac]">Prescribed Lights-Out Time:</span>
                <span className="font-mono font-bold text-base text-[#c3f400]">
                  {aiRecoveryPlan.sleepOptimization.targetBedtime}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#c4c9ac] uppercase font-bold">Sleep Hygiene Protocols</span>
                {aiRecoveryPlan.sleepOptimization.sleepHygieneCues.map((cue, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 text-xs text-white">
                    <span className="material-symbols-outlined text-[#9cf0ff] text-[16px] flex-shrink-0 mt-0.5">bed</span>
                    <span className="leading-relaxed">{cue}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#c3f400]/10 border border-[#c3f400]/20 flex flex-col gap-1 mt-auto">
                <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">Coach Sign-Off Verdict</span>
                <p className="text-xs text-white leading-relaxed">{aiRecoveryPlan.coachSummary}</p>
              </div>
            </div>
          </div>

          {/* Custom Consultation Input Card */}
          <div className="p-6 rounded-3xl bg-[#201f1f] glass border border-white/10 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">edit_note</span>
              <h4 className="font-headline font-bold text-sm text-white">Custom Athlete Consultation / Report Symptom</h4>
            </div>
            <p className="text-xs text-[#c4c9ac]">
              Report specific soreness, travel tiredness, or upcoming match circumstances to customize today’s recovery plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customAthleteNote}
                onChange={(e) => setCustomAthleteNote(e.target.value)}
                placeholder="e.g., Felt sharp twinge in right groin during fielding; need low-impact conditioning..."
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#c3f400]"
              />
              <button
                onClick={handleGenerateAIRecovery}
                disabled={isLoadingAI}
                className="px-5 py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Ask AI Sports Doctor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
