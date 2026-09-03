/**
 * Offline Cache & State Manager
 * Ensures players and coaches can access drill cards, training plans,
 * masterclass guides, chalkboard diagrams, and video telemetry even with zero pitch reception.
 */

import { DrillItem, TrainingPlan, TacticalMasterclass, ScenarioItem } from '../types';

const OFFLINE_DRILLS_KEY = 'pp_offline_cached_drills';
const OFFLINE_PLANS_KEY = 'pp_offline_cached_plans';
const OFFLINE_MASTERCLASSES_KEY = 'pp_offline_cached_masterclasses';
const OFFLINE_SCENARIOS_KEY = 'pp_offline_cached_scenarios';
const OFFLINE_CHALKBOARDS_KEY = 'pp_offline_saved_chalkboards';
const OFFLINE_WAGON_KEY = 'pp_offline_wagon_shots';
const OFFLINE_PITCHMAP_KEY = 'pp_offline_pitchmap_deliveries';
const SIMULATED_OFFLINE_KEY = 'pp_simulated_offline_mode';

export interface SavedChalkboard {
  id: string;
  title: string;
  format: string;
  fielders: { id: string; label: string; x: number; y: number; role: string }[];
  paths: { points: { x: number; y: number }[]; color: string; type: 'line' | 'arrow' | 'curve' | 'ball' }[];
  notes: string;
  savedAt: string;
}

export class OfflineStorageManager {
  private static isSimulatedOffline: boolean = (() => {
    try {
      return localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
    } catch {
      return false;
    }
  })();

  static isOffline(): boolean {
    if (this.isSimulatedOffline) return true;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
    return false;
  }

  static toggleSimulatedOffline(): boolean {
    this.isSimulatedOffline = !this.isSimulatedOffline;
    try {
      localStorage.setItem(SIMULATED_OFFLINE_KEY, String(this.isSimulatedOffline));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    return this.isSimulatedOffline;
  }

  static getSimulatedOfflineState(): boolean {
    return this.isSimulatedOffline;
  }

  // Drill Caching
  static saveDrills(drills: DrillItem[]): void {
    try {
      localStorage.setItem(OFFLINE_DRILLS_KEY, JSON.stringify(drills));
    } catch (e) {
      console.warn('Failed saving drills to offline cache', e);
    }
  }

  static getCachedDrills(): DrillItem[] | null {
    try {
      const data = localStorage.getItem(OFFLINE_DRILLS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Masterclasses Caching
  static saveMasterclasses(classes: TacticalMasterclass[]): void {
    try {
      localStorage.setItem(OFFLINE_MASTERCLASSES_KEY, JSON.stringify(classes));
    } catch (e) {
      console.warn('Failed saving masterclasses to offline cache', e);
    }
  }

  static getCachedMasterclasses(): TacticalMasterclass[] | null {
    try {
      const data = localStorage.getItem(OFFLINE_MASTERCLASSES_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Scenarios Caching
  static saveScenarios(scenarios: ScenarioItem[]): void {
    try {
      localStorage.setItem(OFFLINE_SCENARIOS_KEY, JSON.stringify(scenarios));
    } catch (e) {
      console.warn('Failed saving scenarios to offline cache', e);
    }
  }

  static getCachedScenarios(): ScenarioItem[] | null {
    try {
      const data = localStorage.getItem(OFFLINE_SCENARIOS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Training Plans Caching
  static savePlans(plans: TrainingPlan[]): void {
    try {
      localStorage.setItem(OFFLINE_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
      console.warn('Failed saving plans to offline cache', e);
    }
  }

  static getCachedPlans(): TrainingPlan[] | null {
    try {
      const data = localStorage.getItem(OFFLINE_PLANS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Chalkboard Diagrams
  static saveChalkboard(chalkboard: SavedChalkboard): void {
    try {
      const existing = this.getSavedChalkboards();
      const filtered = existing.filter((c) => c.id !== chalkboard.id);
      const updated = [chalkboard, ...filtered];
      localStorage.setItem(OFFLINE_CHALKBOARDS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving chalkboard to offline cache', e);
    }
  }

  static getSavedChalkboards(): SavedChalkboard[] {
    try {
      const data = localStorage.getItem(OFFLINE_CHALKBOARDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static deleteChalkboard(id: string): void {
    try {
      const existing = this.getSavedChalkboards().filter((c) => c.id !== id);
      localStorage.setItem(OFFLINE_CHALKBOARDS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed deleting chalkboard', e);
    }
  }

  // Cache All Assets in 1 click
  static cacheAllGroundAssets(
    drills: DrillItem[],
    masterclasses: TacticalMasterclass[],
    scenarios: ScenarioItem[],
    plans: TrainingPlan[]
  ): { success: boolean; totalItems: number } {
    this.saveDrills(drills);
    this.saveMasterclasses(masterclasses);
    this.saveScenarios(scenarios);
    this.savePlans(plans);

    return {
      success: true,
      totalItems: drills.length + masterclasses.length + scenarios.length + plans.length
    };
  }
}
