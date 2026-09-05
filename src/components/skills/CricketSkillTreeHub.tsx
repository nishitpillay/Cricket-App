import React, { useState } from 'react';
import { CricketDiscipline, ScreenType, CricketSkillNode, UserProfile, SkillNodeStatus } from '../../types';
import { mockAllSkillTrees } from '../../data/cricketSkillTreeData';
import { playBeep, playBallImpact, playCelebration } from '../../utils/audioFeedback';

interface CricketSkillTreeHubProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drillId: string) => void;
}

export const CricketSkillTreeHub: React.FC<CricketSkillTreeHubProps> = ({
  currentUser,
  onNavigate,
  onSelectDrill
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<CricketDiscipline>('bowling');
  const [activeBranchId, setActiveBranchId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SkillNodeStatus>('ALL');
  const [selectedNode, setSelectedNode] = useState<CricketSkillNode | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local state for interactive checkpoints toggling
  const [skillTrees, setSkillTrees] = useState(mockAllSkillTrees);

  const branches = skillTrees[selectedDiscipline] || [];
  const allNodes = branches.flatMap((b) => b.nodes);

  const filteredBranches = branches
    .filter((b) => activeBranchId === 'all' || b.id === activeBranchId)
    .map((branch) => ({
      ...branch,
      nodes: branch.nodes.filter((node) => {
        if (statusFilter === 'ALL') return true;
        return node.status === statusFilter;
      })
    }))
    .filter((b) => b.nodes.length > 0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleCheckpoint = (nodeId: string, checkpointId: string) => {
    playBeep(850, 0.04);
    setSkillTrees((prev) => {
      const updated = { ...prev };
      const currentList = updated[selectedDiscipline];
      for (const branch of currentList) {
        for (const node of branch.nodes) {
          if (node.id === nodeId) {
            const cp = node.checkpoints.find((c) => c.id === checkpointId);
            if (cp) {
              cp.completed = !cp.completed;
              // Recalculate progressPct
              const completedCount = node.checkpoints.filter((c) => c.completed).length;
              node.progressPct = Math.round((completedCount / node.checkpoints.length) * 100);
              if (node.progressPct === 100) {
                node.status = 'MASTERED';
                playCelebration();
                showToast(`Skill Mastered: ${node.title}!`);
              } else if (node.progressPct >= 50) {
                node.status = 'IN_TRAINING';
              }
            }
          }
        }
      }
      return updated;
    });

    if (selectedNode && selectedNode.id === nodeId) {
      const updatedNode = allNodes.find((n) => n.id === nodeId);
      if (updatedNode) setSelectedNode({ ...updatedNode });
    }
  };

  const totalDisciplineSkills = allNodes.length;
  const masteredDisciplineSkills = allNodes.filter((n) => n.status === 'MASTERED').length;
  const inTrainingDisciplineSkills = allNodes.filter((n) => n.status === 'IN_TRAINING').length;
  const needsWorkDisciplineSkills = allNodes.filter((n) => n.status === 'NEEDS_WORK').length;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#172514] via-[#121c10] to-[#1c1f1a] border border-[#c3f400]/40 shadow-2xl flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-[10px] uppercase tracking-wider">
                Cricket Skill Tree Engine
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">Domain-Specific Technical Pathways</span>
            </div>
            <h1 className="font-headline font-extrabold text-xl sm:text-2xl text-white">
              Biomechanical & Tactical Mastery Trees
            </h1>
            <p className="text-xs text-[#c4c9ac] mt-1 max-w-2xl">
              Authentic cricket skill progression. Every category breaks down into actionable biomechanical cues, video keyframe benchmarks, and targeted drills.
            </p>
          </div>

          <button
            onClick={() => {
              playBallImpact();
              onNavigate('video-analysis');
            }}
            className="px-4 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#abd600] transition-colors cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.3)] shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">slow_motion_video</span>
            <span>Open Motion Lab</span>
          </button>
        </div>

        {/* Discipline Tabs (Batting, Bowling, Fielding) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
            {(['bowling', 'batting', 'fielding'] as const).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDiscipline(d);
                  setActiveBranchId('all');
                  setSelectedNode(null);
                  playBeep(700, 0.04);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-headline font-bold capitalize transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedDiscipline === d
                    ? 'bg-[#c3f400] text-[#161e00] shadow-md'
                    : 'text-[#c4c9ac] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {d === 'bowling' ? 'sports_baseball' : d === 'batting' ? 'sports_cricket' : 'pan_tool'}
                </span>
                <span>{d} Tree</span>
              </button>
            ))}
          </div>

          {/* Skill Tree Progress Counts */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/5 text-white">
              Total: <strong className="text-white">{totalDisciplineSkills}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#c3f400]/15 border border-[#c3f400]/30 text-[#c3f400]">
              Mastered: <strong>{masteredDisciplineSkills}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300">
              In Training: <strong>{inTrainingDisciplineSkills}</strong>
            </span>
            {needsWorkDisciplineSkills > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Needs Work: <strong>{needsWorkDisciplineSkills}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills & Status Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Branch Picker */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveBranchId('all');
              playBeep(650, 0.03);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeBranchId === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-black/30 text-[#c4c9ac] hover:text-white border-white/10'
            }`}
          >
            All Categories ({branches.length})
          </button>

          {branches.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBranchId(b.id);
                playBeep(650, 0.03);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1 ${
                activeBranchId === b.id
                  ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-sm'
                  : 'bg-black/30 text-[#c4c9ac] hover:text-white border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{b.icon}</span>
              <span>{b.categoryLabel}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
          {(['ALL', 'IN_TRAINING', 'NEEDS_WORK', 'MASTERED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                playBeep(650, 0.03);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white/20 text-white'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Skill Trees Display (Branches & Structured Nodes) */}
      <div className="flex flex-col gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="p-4 sm:p-5 rounded-3xl bg-[#1c1f1a] border border-white/10 shadow-xl flex flex-col gap-4"
          >
            {/* Branch Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">{branch.icon}</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base text-white">
                    {branch.categoryLabel}
                  </h2>
                  <p className="text-xs text-[#c4c9ac] line-clamp-1">
                    {branch.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  {branch.masteredSkills}/{branch.totalSkills} Mastered
                </span>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {branch.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      playBeep(750, 0.03);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#182615] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.2)]'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Node Top info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-white/10 text-[#c4c9ac]">
                            Tier {node.tierLevel} • {node.masteryLevel.replace('L', 'Level ').replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-headline font-bold text-sm text-white">
                          {node.title}
                        </h3>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold shrink-0 border ${
                          node.status === 'MASTERED'
                            ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/40'
                            : node.status === 'IN_TRAINING'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {node.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Summary & Biomarker snippet */}
                    <p className="text-xs text-[#c4c9ac] leading-relaxed">
                      {node.shortSummary}
                    </p>

                    {/* Technical Biomarkers */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-[#c3f400] uppercase font-bold">
                        Biomechanical Target:
                      </span>
                      <ul className="text-[11px] text-white space-y-0.5">
                        {node.biomarkers.map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[10px] text-[#c4c9ac]">Checkpoints Complete</span>
                        <span className="font-bold text-[#c3f400]">
                          {node.checkpoints.filter((c) => c.completed).length} / {node.checkpoints.length} ({node.progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            node.status === 'MASTERED' ? 'bg-[#c3f400]' : 'bg-sky-400'
                          }`}
                          style={{ width: `${node.progressPct}%` }}
                        />
                      </div>

                      {/* Micro actions */}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[10px] text-[#8e918f] font-mono">
                          Verified by {node.verifiedByCoach || 'Specialist Coach'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playBallImpact();
                            onNavigate('drills-vault');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">fitness_center</span>
                          <span>Practice Drill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Skill Node Deep-Dive Drawer / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 rounded-3xl bg-[#1a1d19] border border-[#c3f400]/40 shadow-2xl flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-[10px] uppercase">
                    {selectedNode.categoryLabel}
                  </span>
                  <span className="text-xs text-[#c4c9ac] font-mono">
                    Tier {selectedNode.tierLevel} • {selectedNode.masteryLevel.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="font-headline font-bold text-lg text-white">
                  {selectedNode.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Coach Diagnostic Quote */}
            <div className="p-3.5 rounded-2xl bg-[#142213] border border-[#c3f400]/30 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#c3f400] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                Coach Assessment &amp; Diagnosis
              </span>
              <p className="text-xs text-white leading-relaxed italic">
                &ldquo;{selectedNode.coachDiagnostic}&rdquo;
              </p>
              <span className="text-[10px] text-[#c4c9ac] font-mono mt-1">
                Last Assessed: {selectedNode.lastAssessedDate || 'Recent Session'} by {selectedNode.verifiedByCoach}
              </span>
            </div>

            {/* Checkpoints Checklist (Interactive) */}
            <div className="flex flex-col gap-2">
              <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[18px]">checklist</span>
                Mastery Checkpoints &amp; Criteria
              </h3>
              <p className="text-xs text-[#c4c9ac]">
                Tap checkmark to verify mastery criteria during video review:
              </p>

              <div className="flex flex-col gap-2 mt-1">
                {selectedNode.checkpoints.map((cp) => (
                  <div
                    key={cp.id}
                    onClick={() => handleToggleCheckpoint(selectedNode.id, cp.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      cp.completed
                        ? 'bg-[#182615] border-[#c3f400]/60 text-white'
                        : 'bg-black/30 border-white/5 text-[#c4c9ac] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          cp.completed
                            ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                            : 'border-white/20 bg-black/20'
                        }`}
                      >
                        {cp.completed && (
                          <span className="material-symbols-outlined text-[14px] font-extrabold">check</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{cp.label}</span>
                        <span className="text-[10px] text-[#c4c9ac] font-mono">Target: {cp.targetCriteria}</span>
                      </div>
                    </div>

                    {cp.coachSignOff && (
                      <span className="px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] text-[9px] font-mono font-bold">
                        COACH SIGNED
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Faults & Coaching Cues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-red-500/20 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">warning</span>
                  Common Technical Faults
                </span>
                <ul className="text-[11px] text-[#c4c9ac] space-y-1 mt-1">
                  {selectedNode.commonFaults.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-[#c3f400]/20 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#c3f400] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">lightbulb</span>
                  Coaching Cues
                </span>
                <ul className="text-[11px] text-[#c4c9ac] space-y-1 mt-1">
                  {selectedNode.coachTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  playBallImpact();
                  onNavigate('video-analysis');
                  setSelectedNode(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span className="material-symbols-outlined text-[16px]">slow_motion_video</span>
                <span>Review Video Keyframe</span>
              </button>

              <button
                onClick={() => {
                  playBallImpact();
                  onNavigate('drills-vault');
                  setSelectedNode(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#abd600] transition-colors cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Start Drill: {selectedNode.assignedDrillTitle}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs shadow-2xl animate-fadeIn">
          {toastMsg}
        </div>
      )}
    </div>
  );
};
