import React, { useState } from 'react';
import { ActiveGoal, PDPItemCategory } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PDPGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: ActiveGoal) => void;
}

export const PDPGoalModal: React.FC<PDPGoalModalProps> = ({ isOpen, onClose, onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PDPItemCategory>('bowling');
  const [targetMetric, setTargetMetric] = useState('');
  const [baselineValue, setBaselineValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('30 Sep 2026');
  const [coachNotes, setCoachNotes] = useState('');
  const [milestone1, setMilestone1] = useState('');
  const [milestone2, setMilestone2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetMetric.trim() || !targetValue.trim()) {
      playBeep(400, 0.1);
      return;
    }

    const newGoal: ActiveGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      targetMetric: targetMetric.trim(),
      baselineValue: baselineValue.trim() || 'Baseline under review',
      currentValue: currentValue.trim() || baselineValue.trim() || 'Starting evaluation',
      targetValue: targetValue.trim(),
      deadline: deadline.trim() || 'End of Cycle',
      status: 'ACTIVE',
      progressPct: 15,
      coachNotes: coachNotes.trim() || 'New developmental target established in consultation with coach.',
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: milestone1.trim() || 'Initial diagnostic telemetry baseline capture',
          completed: false,
          targetDate: 'Week 1'
        },
        ...(milestone2.trim()
          ? [
              {
                id: `m-${Date.now()}-2`,
                title: milestone2.trim(),
                completed: false,
                targetDate: 'Week 3'
              }
            ]
          : [])
      ]
    };

    playCelebration();
    onAddGoal(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#181a15] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Add Active Development Goal</h3>
              <p className="text-xs text-[#c4c9ac]">Set tangible, evidence-backed technical targets for this cycle</p>
            </div>
          </div>
          <button
            onClick={() => {
              playBeep(600, 0.05);
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Goal Title & Technical Focus</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Hold 170°+ knee brace lockout through 80% deliveries"
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Discipline</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PDPItemCategory)}
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#c3f400]"
              >
                <option value="bowling">Bowling Biomechanics</option>
                <option value="batting">Batting Technique</option>
                <option value="fielding">Fielding / Reflexes</option>
                <option value="fitness">Physical & Recovery</option>
                <option value="biomechanics">Kinetic Chain</option>
                <option value="mental">Mental & Tactical</option>
              </select>
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Target Metric</label>
              <input
                type="text"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                placeholder="e.g., Knee Extension Angle"
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Baseline Value</label>
              <input
                type="text"
                value={baselineValue}
                onChange={(e) => setBaselineValue(e.target.value)}
                placeholder="e.g., 144° flexed"
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              />
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Current State</label>
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder="e.g., 162°"
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              />
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Target Value</label>
              <input
                type="text"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder="e.g., 172°+"
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Deadline Date</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              />
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Milestone 1</label>
              <input
                type="text"
                value={milestone1}
                onChange={(e) => setMilestone1(e.target.value)}
                placeholder="e.g., 50 reps weighted ball snaps"
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Milestone 2 (Optional)</label>
            <input
              type="text"
              value={milestone2}
              onChange={(e) => setMilestone2(e.target.value)}
              placeholder="e.g., Match simulation verification"
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
            />
          </div>

          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Coach Notes & Tactical Guidance</label>
            <textarea
              rows={2}
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              placeholder="Guidance on form, cues, or rest intervals..."
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                playBeep(600, 0.05);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Commit Goal to PDP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
