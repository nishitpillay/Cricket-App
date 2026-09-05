import React, { useState } from 'react';
import { CoachObservation, PDPItemCategory } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PDPObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddObservation: (obs: CoachObservation) => void;
  defaultCoachName?: string;
}

export const PDPObservationModal: React.FC<PDPObservationModalProps> = ({
  isOpen,
  onClose,
  onAddObservation,
  defaultCoachName = 'Ryan Harris'
}) => {
  const [coachName, setCoachName] = useState(defaultCoachName);
  const [coachRole, setCoachRole] = useState('High Performance Bowling Specialist');
  const [discipline, setDiscipline] = useState<PDPItemCategory>('bowling');
  const [diagnostic, setDiagnostic] = useState('');
  const [praise, setPraise] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [keyframe, setKeyframe] = useState('Keyframe #142 (Delivery Stride Impact)');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceSec, setRecordedVoiceSec] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleVoiceRecordToggle = () => {
    if (!isRecordingVoice) {
      playBeep(900, 0.08);
      setIsRecordingVoice(true);
      // Simulate quick recording timer
      setTimeout(() => {
        setIsRecordingVoice(false);
        setRecordedVoiceSec(36);
        playBeep(1100, 0.1);
      }, 2500);
    } else {
      setIsRecordingVoice(false);
      setRecordedVoiceSec(24);
      playBeep(600, 0.08);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnostic.trim() || !correctiveAction.trim()) {
      playBeep(400, 0.1);
      return;
    }

    const newObs: CoachObservation = {
      id: `obs-${Date.now()}`,
      coachName: coachName.trim() || 'Coach',
      coachRole: coachRole.trim() || 'Technical Coach',
      coachAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      date: 'Today',
      primaryDiscipline: discipline,
      technicalDiagnostic: diagnostic.trim(),
      praisePoint: praise.trim() || 'Excellent intent and technical focus observed throughout the session.',
      correctiveAction: correctiveAction.trim(),
      audioVoiceNoteUrl: recordedVoiceSec ? '/audio/coach-voice-note.mp3' : undefined,
      audioDurationSec: recordedVoiceSec || undefined,
      linkedKeyframe: keyframe.trim() || undefined,
      verifiedBadge: true
    };

    playCelebration();
    onAddObservation(newObs);
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
              <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-white">Add Coach Observation</h3>
              <p className="text-xs text-[#c4c9ac]">Log technical diagnostics, praise, and targeted corrections</p>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Coach Name</label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Discipline Area</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as PDPItemCategory)}
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#c3f400]"
              >
                <option value="bowling">Bowling Biomechanics</option>
                <option value="batting">Batting Technique</option>
                <option value="fielding">Fielding & Reflexes</option>
                <option value="fitness">Physical / Workload</option>
                <option value="biomechanics">Kinetic Telemetry</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Technical Diagnostic</label>
            <textarea
              rows={3}
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
              placeholder="Detailed technical assessment: e.g., 'Release point stability improved, but wrist cock is still dropping 3° prior to fingertip snap...'"
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400] resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Praise & Positive Reinforcement</label>
            <input
              type="text"
              value={praise}
              onChange={(e) => setPraise(e.target.value)}
              placeholder="e.g., 'Front knee lockout is world-class; ball speed up to 142.4 kph with zero spinal strain.'"
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
            />
          </div>

          <div>
            <label className="block text-[#c4c9ac] font-medium mb-1">Actionable Corrective Cue</label>
            <input
              type="text"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="e.g., 'Keep index & middle fingers straddling the seam; snap downward through fingertip pads.'"
              className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Linked Keyframe Marker</label>
              <input
                type="text"
                value={keyframe}
                onChange={(e) => setKeyframe(e.target.value)}
                className="w-full bg-[#20241d] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#c3f400]"
              />
            </div>
            <div>
              <label className="block text-[#c4c9ac] font-medium mb-1">Audio Voice Note</label>
              <button
                type="button"
                onClick={handleVoiceRecordToggle}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isRecordingVoice
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : recordedVoiceSec
                    ? 'bg-[#c3f400]/20 border-[#c3f400]/40 text-[#c3f400]'
                    : 'bg-white/5 border-white/10 text-[#c4c9ac] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isRecordingVoice ? 'mic' : recordedVoiceSec ? 'check_circle' : 'mic'}
                </span>
                <span>
                  {isRecordingVoice
                    ? 'Recording...'
                    : recordedVoiceSec
                    ? `Recorded (${recordedVoiceSec}s)`
                    : 'Record 30s Audio Note'}
                </span>
              </button>
            </div>
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
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Publish Observation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
