import React, { useState, useEffect } from 'react';
import { OfflineStorageManager } from '../utils/offlineStore';
import { mockSmartDrillsVault } from '../data/smartDrillsVaultData';
import { mockMasterclasses, mockScenarios, mockTrainingPlans } from '../data/tacticsAndPlannerData';
import { playBeep } from '../utils/audioFeedback';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(OfflineStorageManager.isOffline());
  const [isSimulated, setIsSimulated] = useState(OfflineStorageManager.getSimulatedOfflineState());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(OfflineStorageManager.isOffline());
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial cache preload on mount
    OfflineStorageManager.cacheAllGroundAssets(
      mockSmartDrillsVault,
      mockMasterclasses,
      mockScenarios,
      mockTrainingPlans
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleSimulated = () => {
    playBeep(750, 0.06);
    const newState = OfflineStorageManager.toggleSimulatedOffline();
    setIsSimulated(newState);
    setIsOffline(OfflineStorageManager.isOffline());
  };

  const handleCacheAll = () => {
    playBeep(850, 0.1);
    setIsSyncing(true);
    setTimeout(() => {
      const res = OfflineStorageManager.cacheAllGroundAssets(
        mockSmartDrillsVault,
        mockMasterclasses,
        mockScenarios,
        mockTrainingPlans
      );
      setIsSyncing(false);
      setSyncStatusMsg(`⚡ All ${res.totalItems} Drills, Masterclasses & Plans Cached for Offline Ground Use!`);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="w-full bg-[#181818] border-b border-white/5 py-1.5 px-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOffline ? 'bg-[#ffb4ab] animate-pulse shadow-[0_0_8px_#ffb4ab]' : 'bg-[#c3f400] shadow-[0_0_8px_#c3f400]'
          }`}
        />
        <span className="text-[#c4c9ac] font-medium text-[11px]">
          {isOffline ? (
            <span className="text-[#ffb4ab] font-bold">
              ⚡ Ground Offline Mode Active <span className="hidden sm:inline">(All Drills & Chalkboard Cached)</span>
            </span>
          ) : (
            <span>
              Connected <span className="text-white/40 hidden sm:inline">| Local Ground Sync Ready</span>
            </span>
          )}
        </span>
        {syncStatusMsg && (
          <span className="text-[#c3f400] font-bold text-[11px] animate-fadeIn hidden md:inline">
            {syncStatusMsg}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCacheAll}
          disabled={isSyncing}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
          title="Save all drills, masterclasses, and chalkboard templates to device memory for offline pitch use"
        >
          <span className="material-symbols-outlined text-[14px] text-[#c3f400]">
            {isSyncing ? 'sync' : 'cloud_download'}
          </span>
          <span>{isSyncing ? 'Caching...' : 'Cache for Ground'}</span>
        </button>

        <button
          onClick={handleToggleSimulated}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
            isSimulated
              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/40'
              : 'bg-black/30 text-[#c4c9ac] hover:text-white border-white/5'
          }`}
          title="Toggle simulated pitch environment without cellular network"
        >
          <span className="material-symbols-outlined text-[13px]">
            {isSimulated ? 'wifi_off' : 'signal_cellular_alt'}
          </span>
          <span>{isSimulated ? 'Simulating Offline' : 'Test Offline'}</span>
        </button>
      </div>
    </div>
  );
};
