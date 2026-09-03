import React, { useState, useEffect } from 'react';
import { ScreenType } from '../../types';
import {
  INITIAL_BETA_GROUP,
  BetaTester,
  WORKFLOW_STAGES,
  TESTFLIGHT_TRACK_DETAILS,
  PLAYSTORE_INTERNAL_TRACK_DETAILS
} from '../../data/betaTestingData';

interface TestFlightInternalTestingScreenProps {
  onNavigate?: (screen: ScreenType) => void;
  onBack?: () => void;
}

export const TestFlightInternalTestingScreen: React.FC<TestFlightInternalTestingScreenProps> = ({
  onNavigate,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'testers' | 'distribution' | 'safeguarding'>('workflow');
  const [testers, setTesters] = useState<BetaTester[]>(INITIAL_BETA_GROUP);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Workflow Simulator State
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [workflowLogs, setWorkflowLogs] = useState<{
    timestamp: string;
    actor: string;
    event: string;
    status: 'SUCCESS' | 'BLOCKED_BY_POLICY' | 'SECURITY_PASS';
    details: string;
  }[]>([
    {
      timestamp: 'Just now',
      actor: 'Aarav Sharma (14yo Junior)',
      event: 'SESSION_RECORDED_LOCAL',
      status: 'SUCCESS',
      details: 'Recorded 6 deliveries at 128.4 km/h using iPhone 14 120fps camera sensor in private sandbox.'
    }
  ]);
  const [coSignSignature, setCoSignSignature] = useState<string>('');
  const [signedVideoUrl, setSignedVideoUrl] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [selectedTester, setSelectedTester] = useState<BetaTester | null>(null);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string>('');

  // Fetch initial workflow state from server
  useEffect(() => {
    fetch('/api/v1/beta/workflow/state')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.state) {
          setCurrentStage(data.state.currentStage || 1);
          if (data.state.logs) {
            setWorkflowLogs(data.state.logs);
          }
          if (data.state.consentRequest?.coSignSignature) {
            setCoSignSignature(data.state.consentRequest.coSignSignature);
          }
          if (data.state.coachReview?.signedVideoUrl) {
            setSignedVideoUrl(data.state.coachReview.signedVideoUrl);
          }
        }
      })
      .catch(err => console.error('Failed to load beta workflow state:', err));
  }, []);

  const handleAdvanceStep = async (target?: number) => {
    try {
      const res = await fetch('/api/v1/beta/workflow/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStage: target })
      });
      const data = await res.json();
      if (data.success && data.state) {
        setCurrentStage(data.state.currentStage);
        setWorkflowLogs(data.state.logs || []);
        if (data.state.consentRequest?.coSignSignature) {
          setCoSignSignature(data.state.consentRequest.coSignSignature);
        }
        if (data.state.coachReview?.signedVideoUrl) {
          setSignedVideoUrl(data.state.coachReview.signedVideoUrl);
        }
      }
    } catch (err) {
      console.error('Failed to advance workflow step:', err);
    }
  };

  const handleResetWorkflow = async () => {
    try {
      const res = await fetch('/api/v1/beta/workflow/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success && data.state) {
        setCurrentStage(1);
        setWorkflowLogs(data.state.logs || []);
        setCoSignSignature('');
        setSignedVideoUrl('');
      }
    } catch (err) {
      console.error('Failed to reset workflow:', err);
    }
  };

  const handleRunAllSteps = async () => {
    setIsAutoRunning(true);
    await handleResetWorkflow();
    
    for (let step = 2; step <= 6; step++) {
      await new Promise(r => setTimeout(r, 700));
      await handleAdvanceStep(step);
    }
    setIsAutoRunning(false);
  };

  const filteredTesters = testers.filter(t => {
    if (roleFilter === 'ALL') return true;
    return t.role === roleFilter;
  });

  const handleSendTesterFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTester || !feedbackInput.trim()) return;

    try {
      const res = await fetch('/api/v1/beta/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testerId: selectedTester.id,
          testerRole: selectedTester.role,
          rating: 5,
          feedbackText: feedbackInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSuccessMsg(`Feedback recorded for ${selectedTester.name}! (${data.feedbackId})`);
        setFeedbackInput('');
        setTimeout(() => setFeedbackSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-30 bg-[#131313]/95 backdrop-blur-md border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[#1c1b1b] border border-[#2c2c2c] flex items-center justify-center text-white hover:bg-[#252424] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#c3f400]">Step 5 Deployment</span>
              <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-extrabold">LIVE BETA</span>
            </div>
            <h1 className="text-base font-bold text-white leading-tight">
              TestFlight & Google Play Internal Testing
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1c1b1b] border border-[#333] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-zinc-300">11 Controlled Testers</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Executive Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1b1b] via-[#161616] to-[#141414] border border-[#333] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c3f400]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-[#60a5fa] text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">apple</span>
                  TestFlight v1.0.0 (42)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">android</span>
                  Google Play Internal (10042)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#c3f400]/20 border border-[#c3f400]/40 text-[#c3f400] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">family_restroom</span>
                  Junior → Parent → Coach E2E
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                First Genuine Mobile Release & Controlled Group E2E Verification
              </h2>
              <p className="text-xs text-[#8e9285] max-w-3xl leading-relaxed">
                Pitch Precision is deployed to an authenticated, closed testing ring of <strong className="text-white">11 controlled accounts</strong> (3 Adults, 3 Juniors, 2 Parents, 2 Coaches, 1 Admin). This environment verifies the entire high-stakes safeguarding and biomechanical review lifecycle across genuine iOS and Android mobile hardware.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111] p-3 rounded-xl border border-[#222] shrink-0">
              <div className="text-center px-2">
                <div className="text-lg font-black text-[#c3f400]">11</div>
                <div className="text-[10px] text-[#8e9285] uppercase tracking-wider font-bold">Testers Active</div>
              </div>
              <div className="text-center px-2 border-l border-[#222]">
                <div className="text-lg font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-[#8e9285] uppercase tracking-wider font-bold">Crash-Free</div>
              </div>
              <div className="text-center px-2 border-l border-[#222]">
                <div className="text-lg font-black text-blue-400">0</div>
                <div className="text-[10px] text-[#8e9285] uppercase tracking-wider font-bold">Public Leaks</div>
              </div>
              <div className="text-center px-2 border-l border-[#222]">
                <div className="text-lg font-black text-amber-400">15 min</div>
                <div className="text-[10px] text-[#8e9285] uppercase tracking-wider font-bold">Signed URL TTL</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#262626] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-zinc-400 hover:text-white hover:bg-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>E2E Workflow Simulator (Junior → Parent → Coach)</span>
          </button>
          <button
            onClick={() => setActiveTab('testers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'testers'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-zinc-400 hover:text-white hover:bg-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>11 Beta Testers & Roster Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'distribution'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-zinc-400 hover:text-white hover:bg-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            <span>TestFlight & Play Internal Tracks</span>
          </button>
          <button
            onClick={() => setActiveTab('safeguarding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'safeguarding'
                ? 'bg-[#c3f400] text-black shadow-md'
                : 'bg-[#1c1b1b] text-zinc-400 hover:text-white hover:bg-[#252424]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Safeguarding & ReBAC Audit</span>
          </button>
        </div>

        {/* TAB 1: E2E WORKFLOW SIMULATOR */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c3f400]"></span>
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Active Lifecycle Stage: Stage {currentStage} of 6
                </span>
                <span className="text-xs text-[#8e9285]">
                  ({WORKFLOW_STAGES[currentStage - 1]?.title})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetWorkflow}
                  className="px-3 py-1.5 rounded-xl bg-[#262626] hover:bg-[#333] text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Reset State</span>
                </button>
                <button
                  disabled={currentStage >= 6 || isAutoRunning}
                  onClick={() => handleAdvanceStep()}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                    currentStage >= 6 || isAutoRunning
                      ? 'bg-[#333] text-zinc-500 cursor-not-allowed'
                      : 'bg-[#262626] hover:bg-[#333] text-white border border-[#444]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>Step Forward (+1)</span>
                </button>
                <button
                  disabled={isAutoRunning}
                  onClick={handleRunAllSteps}
                  className="px-4 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[16px]">fast_forward</span>
                  <span>{isAutoRunning ? 'Simulating E2E...' : 'Auto-Run Complete E2E Flow'}</span>
                </button>
              </div>
            </div>

            {/* Visual Step Pipeline Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {WORKFLOW_STAGES.map((step) => {
                const isCurrent = currentStage === step.stage;
                const isPassed = currentStage > step.stage;
                return (
                  <div
                    key={step.stage}
                    onClick={() => handleAdvanceStep(step.stage)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-[#1f2413] border-[#c3f400] ring-1 ring-[#c3f400] shadow-lg'
                        : isPassed
                        ? 'bg-[#141d17] border-emerald-500/50 text-zinc-300'
                        : 'bg-[#181818] border-[#262626] text-zinc-500 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          isCurrent
                            ? 'bg-[#c3f400] text-black'
                            : isPassed
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#2a2a2a] text-zinc-400'
                        }`}>
                          STAGE {step.stage}
                        </span>
                        {isPassed && (
                          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                        )}
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping"></span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white leading-tight mb-1">{step.title}</div>
                      <div className="text-[10px] text-[#8e9285] line-clamp-2">{step.actor}</div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-semibold text-zinc-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">badge</span>
                      <span>{step.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Stage Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Active Actor Viewport Simulation */}
              <div className="lg:col-span-7 space-y-4">
                {/* Stage 1: Junior Player Session Capture */}
                {currentStage === 1 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f59e0b] text-black font-black flex items-center justify-center text-sm">
                          AS
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#f59e0b] uppercase tracking-wider">Junior Athlete Viewport</div>
                          <div className="text-sm font-bold text-white">Aarav Sharma (Age 14 • U15 Bowler)</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-bold">
                        DEVICE: iPhone 14
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131313] border border-[#262626] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white">Live Bowling Session #001 Captured</div>
                        <span className="text-[11px] text-emerald-400 font-mono">120 FPS HIGH SPEED</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222]">
                          <div className="text-lg font-black text-[#c3f400]">128.4 <span className="text-[10px] text-zinc-400">km/h</span></div>
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Release Speed</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222]">
                          <div className="text-lg font-black text-white">6 / 6</div>
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Deliveries in Spell</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#181818] border border-[#222]">
                          <div className="text-lg font-black text-blue-400">164°</div>
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Front Knee Brace</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] shrink-0 text-amber-400">lock</span>
                        <span>Video stored strictly in local application sandbox. Cannot be shared publicly or sent to third-parties without verified guardian authorization.</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStep(2)}
                      className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Request Coach Review from Coach David Miller</span>
                    </button>
                  </div>
                )}

                {/* Stage 2: Junior Safeguarding Gate Triggered */}
                {currentStage === 2 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-amber-500/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                          <span className="material-symbols-outlined text-[22px]">shield</span>
                        </div>
                        <div>
                          <div className="text-xs font-black text-amber-400 uppercase tracking-wider">Automated Safeguarding Gate</div>
                          <div className="text-sm font-bold text-white">Direct Coach Transfer Blocked</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        COPPA / ECB SAFEPATH
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131313] border border-[#262626] space-y-3">
                      <div className="text-xs text-zinc-300 leading-relaxed">
                        Aarav is 14 years old. In compliance with <strong className="text-white">COPPA</strong>, <strong className="text-white">GDPR-K</strong>, and the <strong className="text-white">ECB Safe Hands Safeguarding Policy</strong>, junior video footage cannot be transmitted directly to coaches without verifiable parental consent.
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#333] space-y-2 font-mono text-xs">
                        <div className="flex justify-between text-zinc-400">
                          <span>Target Coach:</span>
                          <span className="text-white font-bold">Coach David Miller (ECB Level 3)</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Linked Guardian:</span>
                          <span className="text-[#c3f400] font-bold">Priya Sharma (priya.sharma@...)</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Verification Challenge:</span>
                          <span className="text-emerald-400 font-bold">SMS / App Push Dual-Auth Dispatched</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStep(3)}
                      className="w-full py-2.5 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                      <span>Switch to Guardian View (Priya Sharma) to Review & Co-Sign</span>
                    </button>
                  </div>
                )}

                {/* Stage 3: Parent / Guardian Co-Signing */}
                {currentStage === 3 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#14b8a6]/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#14b8a6] text-black font-black flex items-center justify-center text-sm">
                          PS
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#14b8a6] uppercase tracking-wider">Parent / Legal Guardian Portal</div>
                          <div className="text-sm font-bold text-white">Priya Sharma (Guardian to Aarav Sharma)</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#14b8a6]/20 text-[#14b8a6] text-[10px] font-bold">
                        VERIFIED PARENT
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131313] border border-[#262626] space-y-3">
                      <div className="text-xs font-bold text-white">Pending Coaching Grant Authorization</div>
                      <div className="p-3 rounded-lg bg-[#181818] border border-[#222] text-xs space-y-1.5">
                        <div className="text-zinc-300"><strong>Coach:</strong> Coach David Miller (ECB L3 Certified #48912)</div>
                        <div className="text-zinc-300"><strong>Session:</strong> Fast Bowling Drill (128.4 km/h, 6 balls)</div>
                        <div className="text-zinc-300"><strong>Scope:</strong> Biomechanical Pose Angles & Slow-Mo Telestrator</div>
                        <div className="text-zinc-300"><strong>Grant Duration:</strong> 30 Days (Instant Unilateral Revocation Available)</div>
                      </div>

                      {coSignSignature && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>Guardian Co-Sign Cryptographic Signature Minted</span>
                          </div>
                          <div className="font-mono text-[10px] text-zinc-400 break-all">{coSignSignature}</div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdvanceStep(4)}
                      className="w-full py-2.5 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">sports</span>
                      <span>Switch to Coach View (Coach David Miller) to Review Video</span>
                    </button>
                  </div>
                )}

                {/* Stage 4: Coach ReBAC Review & Telestrator */}
                {currentStage === 4 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#c3f400]/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c3f400] text-black font-black flex items-center justify-center text-sm">
                          DM
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#c3f400] uppercase tracking-wider">Coach Telestrator Studio</div>
                          <div className="text-sm font-bold text-white">Coach David Miller (ECB Level 3 High Performance)</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold">
                        ReBAC AUTHORIZED
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131313] border border-[#262626] space-y-3">
                      {signedVideoUrl ? (
                        <div className="p-3 rounded-lg bg-[#181818] border border-[#333] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px]">timer</span>
                              15-Minute Expiring Signed Video URL Issued
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">TTL: 900s</span>
                          </div>
                          <div className="font-mono text-[9px] text-zinc-500 truncate">{signedVideoUrl}</div>
                        </div>
                      ) : null}

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
                          <div className="text-[10px] text-zinc-400 uppercase">Front-Knee Angle</div>
                          <div className="text-base font-black text-white">164° <span className="text-[10px] text-emerald-400 font-bold">(Solid Brace)</span></div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
                          <div className="text-[10px] text-zinc-400 uppercase">Shoulder Counter-Rot.</div>
                          <div className="text-base font-black text-white">28° <span className="text-[10px] text-amber-400 font-bold">(Safe Margin)</span></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-1">
                        <div className="text-[11px] font-bold text-white">Coach Feedback Notes & Video Annotations:</div>
                        <div className="text-xs text-zinc-300 italic">
                          "Superb release speed at 128.4 km/h! Front-knee bracing angle is solid at 164° (ideal is 165°-170°). Keep head upright through follow-through to maximize outswing seam stability."
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStep(5)}
                      className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      <span>Publish Review & Dispatch Dual Notifications</span>
                    </button>
                  </div>
                )}

                {/* Stage 5: Dual Delivery to Junior & Parent */}
                {currentStage === 5 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-blue-500/50 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-sm">
                          <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                        </div>
                        <div>
                          <div className="text-xs font-black text-blue-400 uppercase tracking-wider">Dual Notification Engine</div>
                          <div className="text-sm font-bold text-white">Simultaneous Multi-Cast Delivery</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                        ZERO-LEAK SAFEGUARD
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Recipient 1: Junior */}
                      <div className="p-3 rounded-xl bg-[#131313] border border-[#262626] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-black font-black flex items-center justify-center text-xs">AS</div>
                          <div>
                            <div className="text-xs font-bold text-white">Aarav Sharma (Player)</div>
                            <div className="text-[10px] text-zinc-400">Push notification delivered to iPhone 14</div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">mark_email_read</span>
                      </div>

                      {/* Recipient 2: Parent */}
                      <div className="p-3 rounded-xl bg-[#131313] border border-[#262626] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#14b8a6] text-black font-black flex items-center justify-center text-xs">PS</div>
                          <div>
                            <div className="text-xs font-bold text-white">Priya Sharma (Guardian CC)</div>
                            <div className="text-[10px] text-zinc-400">Push & in-app audit ledger updated</div>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-emerald-400 text-[18px]">mark_email_read</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStep(6)}
                      className="w-full py-2.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      <span>Switch to Club Admin View (Marcus Vance) to Audit Compliance</span>
                    </button>
                  </div>
                )}

                {/* Stage 6: Club Administrator Compliance Audit */}
                {currentStage === 6 && (
                  <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-emerald-500/60 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e11d48] text-white font-black flex items-center justify-center text-sm">
                          MV
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#e11d48] uppercase tracking-wider">Club Safeguarding Lead Audit</div>
                          <div className="text-sm font-bold text-white">Marcus Vance (Academy Director & DSL)</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        100% AUDIT COMPLIANT
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#131313] border border-[#262626] space-y-3 font-mono text-xs">
                      <div className="text-xs font-bold text-white font-sans flex items-center gap-2">
                        <span>Immutable Safeguarding Ledger Record</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold">VERIFIED</span>
                      </div>
                      <div className="space-y-1.5 text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Audit ID:</span>
                          <span>AUDIT-LEGAL-99410</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Junior Player:</span>
                          <span>Aarav Sharma (U15)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Parent Consent:</span>
                          <span className="text-emerald-400">Priya Sharma (Co-signed)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Assigned Coach:</span>
                          <span>Coach David Miller (ECB L3)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">GCS Bucket Isolation:</span>
                          <span className="text-emerald-400">UNIFORM_PRIVATE</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
                      <span>Lifecycle complete: End-to-end multi-actor workflow successfully verified without a single privacy breach or policy violation.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Immutable Real-Time Audit Log */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#c3f400] text-[18px]">receipt_long</span>
                        <h3 className="text-xs font-black text-white uppercase tracking-wider">Immutable Security Ledger</h3>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{workflowLogs.length} Events</span>
                    </div>

                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {workflowLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#141414] border border-[#262626] space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono">{log.timestamp.includes('T') ? log.timestamp.split('T')[1].substring(0, 8) : log.timestamp}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                              log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                              log.status === 'SECURITY_PASS' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {log.event}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white">{log.actor}</div>
                          <div className="text-[11px] text-[#8e9285] leading-relaxed">{log.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Cryptographic Verification:</span>
                    <span className="text-emerald-400 font-mono font-bold">SHA-256 MATCHED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 11 BETA TESTERS & ROSTER MATRIX */}
        {activeTab === 'testers' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All 11 Testers' },
                  { id: 'ADULT_PLAYER', label: '3 Adult Players' },
                  { id: 'JUNIOR_PLAYER', label: '3 Junior Players' },
                  { id: 'PARENT_GUARDIAN', label: '2 Parents' },
                  { id: 'COACH', label: '2 Coaches' },
                  { id: 'CLUB_ADMIN', label: '1 Club Admin' }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setRoleFilter(pill.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      roleFilter === pill.id
                        ? 'bg-[#c3f400] text-black shadow-md'
                        : 'bg-[#1c1b1b] text-zinc-400 hover:text-white border border-[#2c2c2c]'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                Showing {filteredTesters.length} of 11 Registered Beta Accounts
              </div>
            </div>

            {/* Testers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTesters.map((tester) => (
                <div
                  key={tester.id}
                  onClick={() => setSelectedTester(tester)}
                  className={`p-4 rounded-2xl bg-[#1c1b1b] border transition cursor-pointer hover:border-[#444] space-y-3 ${
                    selectedTester?.id === tester.id ? 'border-[#c3f400] ring-1 ring-[#c3f400]' : 'border-[#262626]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-black shadow-md"
                        style={{ backgroundColor: tester.avatarBg }}
                      >
                        {tester.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{tester.name}</span>
                          {tester.age && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
                              {tester.age}y
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8e9285]">{tester.club}</div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      tester.role === 'JUNIOR_PLAYER' ? 'bg-amber-500/20 text-amber-300' :
                      tester.role === 'PARENT_GUARDIAN' ? 'bg-teal-500/20 text-teal-300' :
                      tester.role === 'COACH' ? 'bg-[#c3f400]/20 text-[#c3f400]' :
                      tester.role === 'CLUB_ADMIN' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {tester.role.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{tester.bio}</p>

                  <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Device:</span>
                      <span className="text-white font-medium">{tester.deviceModel} ({tester.osVersion})</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Track:</span>
                      <span className="text-[#c3f400] font-medium">{tester.buildTrack}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Last Active:</span>
                      <span className="text-emerald-400 font-medium">{tester.lastActiveSession}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Active Beta Tester
                    </span>
                    <span className="text-zinc-500">{tester.feedbackSubmitted} reviews sent</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tester Feedback Modal / Submission Panel */}
            {selectedTester && (
              <div className="p-5 rounded-2xl bg-[#181818] border border-[#333] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#c3f400]">rate_review</span>
                    <h3 className="text-sm font-bold text-white">
                      Simulate Beta Feedback as: <span className="text-[#c3f400]">{selectedTester.name}</span> ({selectedTester.role})
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTester(null)}
                    className="text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleSendTesterFeedback} className="space-y-3">
                  <textarea
                    rows={2}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder={`e.g. "Bowling speed radar calibration on ${selectedTester.deviceModel} matched our Stalker radar gun within 0.8 km/h!"`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#333] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c3f400]"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Logs: {selectedTester.deviceModel} • {selectedTester.osVersion} • 0 crashes
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Submit TestFlight Feedback</span>
                    </button>
                  </div>
                </form>

                {feedbackSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{feedbackSuccessMsg}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MOBILE DISTRIBUTION TRACKS */}
        {activeTab === 'distribution' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Apple TestFlight Card */}
              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#007aff] text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#007aff] uppercase">Apple TestFlight Track</div>
                      <div className="text-sm font-bold text-white">Pitch Precision iOS Beta</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">
                    8 ACTIVE TESTERS
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Bundle ID:</span>
                    <span className="text-white">{TESTFLIGHT_TRACK_DETAILS.bundleId}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>App Store Connect ID:</span>
                    <span className="text-white">{TESTFLIGHT_TRACK_DETAILS.appStoreConnectAppId}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Version & Build:</span>
                    <span className="text-[#c3f400]">{TESTFLIGHT_TRACK_DETAILS.version} (Build {TESTFLIGHT_TRACK_DETAILS.buildNumber})</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Minimum OS:</span>
                    <span className="text-white">{TESTFLIGHT_TRACK_DETAILS.minOS}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Expiration Window:</span>
                    <span className="text-zinc-300">{TESTFLIGHT_TRACK_DETAILS.expirationDate}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Crash-Free Rate:</span>
                    <span className="text-emerald-400 font-bold">{TESTFLIGHT_TRACK_DETAILS.crashFreeSessionRate}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#161616] border border-[#2a2a2a] space-y-1">
                  <div className="text-[11px] font-bold text-white">What's New in this TestFlight Build:</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    {TESTFLIGHT_TRACK_DETAILS.whatsNewInThisBuild}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#111] border border-[#222] font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                  <span className="truncate">{TESTFLIGHT_TRACK_DETAILS.testflightPublicLink}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#222] text-[#c3f400]">INVITE ONLY</span>
                </div>
              </div>

              {/* Google Play Internal Testing Card */}
              <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">android</span>
                    </div>
                    <div>
                      <div className="text-xs font-black text-emerald-400 uppercase">Google Play Internal Testing</div>
                      <div className="text-sm font-bold text-white">Pitch Precision Android AAB</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">
                    3 ACTIVE TESTERS
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Package Name:</span>
                    <span className="text-white">{PLAYSTORE_INTERNAL_TRACK_DETAILS.packageId}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Version Code:</span>
                    <span className="text-[#c3f400]">{PLAYSTORE_INTERNAL_TRACK_DETAILS.versionCode} ({PLAYSTORE_INTERNAL_TRACK_DETAILS.versionName})</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Target SDK:</span>
                    <span className="text-white">{PLAYSTORE_INTERNAL_TRACK_DETAILS.targetSdk}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Track Type:</span>
                    <span className="text-zinc-300">{PLAYSTORE_INTERNAL_TRACK_DETAILS.trackType}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Authorized Email List:</span>
                    <span className="text-white truncate">{PLAYSTORE_INTERNAL_TRACK_DETAILS.distributionList}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>AAB SHA-256:</span>
                    <span className="text-zinc-500 truncate">{PLAYSTORE_INTERNAL_TRACK_DETAILS.aabSha256.substring(0, 20)}...</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#161616] border border-[#2a2a2a] space-y-1">
                  <div className="text-[11px] font-bold text-white">Target Architecture & Optimizations:</div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Built using Android App Bundle (AAB) with R8 code shrinking and ProGuard rules. CameraX high-framerate API enabled for 120/240fps bowling release detection.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#111] border border-[#222] font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                  <span className="truncate">{PLAYSTORE_INTERNAL_TRACK_DETAILS.playConsoleUrl}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#222] text-emerald-400">TESTERS VERIFIED</span>
                </div>
              </div>
            </div>

            {/* CI/CD Fastlane Build Automation Script */}
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400]">terminal</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Fastlane & GitHub Actions Automated Delivery Pipeline</h3>
                </div>
                <span className="text-xs text-emerald-400 font-mono">AUTOMATED_BETA_LANE</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#222] font-mono text-xs text-zinc-300 space-y-2 overflow-x-auto">
                <div className="text-zinc-500"># fastlane/Fastfile for Pitch Precision Mobile Beta Distribution</div>
                <div><span className="text-[#c3f400]">lane</span> <span className="text-blue-400">:beta_dual_release</span> <span className="text-[#c3f400]">do</span></div>
                <div className="pl-4 text-zinc-400"># 1. Build and distribute iOS TestFlight to 11 Controlled Testers</div>
                <div className="pl-4">build_app(workspace: <span className="text-amber-300">"PitchPrecision.xcworkspace"</span>, scheme: <span className="text-amber-300">"PitchPrecision"</span>)</div>
                <div className="pl-4">upload_to_testflight(groups: [<span className="text-amber-300">"Controlled Beta Ring"</span>], notify_external_testers: <span className="text-purple-400">false</span>)</div>
                <div className="pl-4 text-zinc-400"># 2. Build Android AAB and deploy to Play Console Internal Testing</div>
                <div className="pl-4">gradle(task: <span className="text-amber-300">"bundleRelease"</span>)</div>
                <div className="pl-4">upload_to_play_store(track: <span className="text-amber-300">"internal"</span>, aab: <span className="text-amber-300">"app/build/outputs/bundle/release/app-release.aab"</span>)</div>
                <div><span className="text-[#c3f400]">end</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAFEGUARDING & ReBAC VERIFICATION PROOF */}
        {activeTab === 'safeguarding' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#1c1b1b] border border-[#2c2c2c] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#c3f400] text-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">gavel</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Safeguarding Architecture: Physical Enforcement of Junior Privacy
                  </h3>
                  <p className="text-xs text-[#8e9285]">
                    Why unverified coaches or random users can never intercept or view junior athlete video files.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified_user</span>
                    <span>1. ReBAC (Relationship-Based Access Control)</span>
                  </div>
                  <p className="text-xs text-[#8e9285] leading-relaxed">
                    Every video download request validates that a <code className="text-zinc-300">guardian_co_sign</code> record exists in the database linking the exact player ID, guardian ID, and coach ID. Without this cryptographic grant, HTTP 403 Forbidden is returned instantly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">timer</span>
                    <span>2. 15-Minute Short-Lived Signed URLs</span>
                  </div>
                  <p className="text-xs text-[#8e9285] leading-relaxed">
                    Cloud Storage buckets have uniform bucket-level access enabled with zero public ACLs. The app generates RSA-SHA256 signed URLs expiring in 900 seconds exclusively for the authorized coach's telestrator player.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">cancel</span>
                    <span>3. Unilateral Guardian Revocation</span>
                  </div>
                  <p className="text-xs text-[#8e9285] leading-relaxed">
                    Parents can tap "Revoke Coach Access" at any moment in their portal. This immediately deletes the ReBAC grant and invalidates all cached video tokens across Cloud Run and Cloud SQL.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">visibility_off</span>
                    <span>4. Zero Search Indexing / No Public Feed</span>
                  </div>
                  <p className="text-xs text-[#8e9285] leading-relaxed">
                    Junior profiles are completely invisible to global search queries, public discovery tabs, and external API queries. Only registered club coaches approved by parents can establish contact.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation to other steps */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#161616] border border-[#2c2c2c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400]">arrow_back</span>
                <span className="text-xs text-zinc-300 font-semibold">Previous Milestone: Step 4 (Store Assets & Privacy Center)</span>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('store-assets-privacy')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#262626] hover:bg-[#333] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>View Step 4 Store Assets</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
