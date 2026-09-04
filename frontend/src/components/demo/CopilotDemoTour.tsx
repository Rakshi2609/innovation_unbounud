'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Play,
  Pause,
  PlayCircle,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Activity,
  Server,
  Layers,
  PhoneCall,
  Lock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Bot,
  Brain,
  X,
  FileCheck,
  Zap
} from "lucide-react";

export interface CopilotTourStep {
  step: number;
  title: string;
  subtitle: string;
  narrative: string;
  route: string;
  badge: string;
  techStack: string;
  metric: string;
  metricLabel: string;
  keyAction: string;
  codeSnippet?: string;
}

export const COPILOT_TOUR_STEPS: CopilotTourStep[] = [
  {
    step: 1,
    title: "1. Early Distress Detection & Triage",
    subtitle: "Borrower Rajesh Kumar exhibits credit utilization spike (82%) & DTI (46%).",
    narrative:
      "Step 1: Real LightGBM Model (Path A) evaluates Rajesh Kumar. Distress risk score is 85% with primary SHAP driver: Debt-to-Income ratio > 45%. System automatically triages into the high-priority queue.",
    route: "/triage",
    badge: "LightGBM ML Engine",
    techStack: "Path A LightGBM · TreeSHAP · Risk Tier: HIGH",
    metric: "85%",
    metricLabel: "Distress Score",
    keyAction: "Inspect Case CASE-IN-9021 in Triage Queue",
    codeSnippet: "POST /predict-risk -> model.predict_proba(features) = 0.852"
  },
  {
    step: 2,
    title: "2. RBI & Master Policy Grounding",
    subtitle: "Qdrant vector search retrieves RBI Moratorium 2020 & Restructuring Directions.",
    narrative:
      "Step 2: TheSuperRAG queries Qdrant policy vector collection. Retrieves Clause 4.2: Proactive Moratorium & Restructuring Relief with similarity score 0.92, ensuring zero hallucination.",
    route: "/policies",
    badge: "TheSuperRAG · Qdrant",
    techStack: "BAAI/bge-small-en-v1.5 · Cosine Sim: 0.92",
    metric: "0.92",
    metricLabel: "RAG Cosine Match",
    keyAction: "View RBI Restructuring Framework Clause 4.2",
    codeSnippet: "policy_store.search('distress restructuring 90 days', top_k=3)"
  },
  {
    step: 3,
    title: "3. 10-Node LangGraph Reasoning",
    subtitle: "Autonomous graph synthesizes income, debt, and policy into 3 structured relief options.",
    narrative:
      "Step 3: 10-Node LangGraph workflow executes: evaluates eligibility, synthesizes Options (3-month moratorium vs tenure extension), and drafts a compliant outreach notice.",
    route: "/copilot",
    badge: "LangGraph StateGraph",
    techStack: "10 Stateful Nodes · Conditional Routing · Option Synthesis",
    metric: "3 Options",
    metricLabel: "Restructuring Paths",
    keyAction: "Open Copilot Reasoning Workspace",
    codeSnippet: "graph.invoke({'case_id': 'CASE-IN-9021', 'policy_context': [...]})"
  },
  {
    step: 4,
    title: "4. Human Officer Approval & Voice Outreach",
    subtitle: "Officer verifies recommendation, selects Plan B, and dispatches Twilio AI Voice Call.",
    narrative:
      "Step 4: Bank Officer verifies the recommendation, signs off on a 3-month EMI freeze, and initiates proactive AI voice counseling call to the borrower.",
    route: "/copilot",
    badge: "Human-in-the-Loop & Twilio",
    techStack: "Twilio Media Streams · Proactive Outreach · Officer Sign-off",
    metric: "Verified",
    metricLabel: "Officer Sign-off",
    keyAction: "Review Officer Decision & Call Dispatch",
    codeSnippet: "POST /api/decisions/approve + Twilio Call -> +919461284678"
  },
  {
    step: 5,
    title: "5. Tamper-Evident SHA-256 Audit Trail",
    subtitle: "Deliberation, ML score, policy chunk, and officer decision sealed with SHA-256 hash.",
    narrative:
      "Step 5: Compliance sealed! Complete deliberation recorded in append-only cryptographic ledger with unique hash chain. Instant RBI compliance export ready.",
    route: "/audit",
    badge: "Cryptographic Governance",
    techStack: "SHA-256 Ledger · RBI Circular Compliance · Immutable Log",
    metric: "SHA-256",
    metricLabel: "Cryptographic Seal",
    keyAction: "Verify Hash Chain in Audit Dashboard",
    codeSnippet: "sha256(case_id + prompt + ml_score + officer_id + timestamp)"
  }
];

export default function CopilotDemoTour() {
  const router = useRouter();
  const pathname = usePathname();

  const [tourStep, setTourStep] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [syncCaption, setSyncCaption] = useState<string>(COPILOT_TOUR_STEPS[0].narrative);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState<number>(0);

  const autoPlayTimerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  const currentStep = COPILOT_TOUR_STEPS[tourStep - 1] || COPILOT_TOUR_STEPS[0];

  // TTS Speech Synthesis Function
  const speakVoice = (text: string) => {
    setSyncCaption(text);
    if (!speechEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.96;
      utterance.pitch = 1.0;
      utterance.lang = "en-IN";

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("en-in") ||
          v.name.includes("India") ||
          v.name.includes("Aditi") ||
          v.name.includes("Ravi") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Natural")
      );
      if (matchVoice) utterance.voice = matchVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis error:", e);
    }
  };

  // Step Execution
  const executeStep = (stepNum: number, navigate: boolean = false) => {
    setTourStep(stepNum);
    setIsTourActive(true);
    setAutoPlayProgress(0);

    const stepObj = COPILOT_TOUR_STEPS[stepNum - 1];
    if (stepObj) {
      speakVoice(stepObj.narrative);
      if (navigate && pathname !== stepObj.route) {
        router.push(stepObj.route);
      }
    }
  };

  const handleNextStep = () => {
    const next = tourStep >= 5 ? 1 : tourStep + 1;
    executeStep(next, false);
  };

  const handlePrevStep = () => {
    const prev = tourStep <= 1 ? 5 : tourStep - 1;
    executeStep(prev, false);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsAutoPlaying(true);
      executeStep(tourStep, false);
    }
  };

  // Auto-Play Timer Effect
  useEffect(() => {
    if (isAutoPlaying) {
      const STEP_DURATION = 8000; // 8 seconds per step
      const INTERVAL = 100;
      let elapsed = 0;

      progressTimerRef.current = setInterval(() => {
        elapsed += INTERVAL;
        const progress = Math.min(100, (elapsed / STEP_DURATION) * 100);
        setAutoPlayProgress(progress);
      }, INTERVAL);

      autoPlayTimerRef.current = setTimeout(() => {
        setTourStep((curr) => {
          const next = curr >= 5 ? 1 : curr + 1;
          const nextStepObj = COPILOT_TOUR_STEPS[next - 1];
          speakVoice(nextStepObj.narrative);
          return next;
        });
        elapsed = 0;
      }, STEP_DURATION);
    } else {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setAutoPlayProgress(0);
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isAutoPlaying, tourStep]);

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2.5 rounded-full shadow-2xl font-black text-xs uppercase tracking-wider hover:scale-105 transition-all border-2 border-amber-400 cursor-pointer"
        >
          <PlayCircle size={16} className="text-amber-400 animate-pulse" />
          <span>Open Interactive Demo Tour</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0F172A] text-white border-b-4 border-amber-400 shadow-2xl sticky top-0 z-50 font-sans">
      {/* Auto-Play Progress Bar */}
      {isAutoPlaying && (
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-100 ease-linear"
            style={{ width: `${autoPlayProgress}%` }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2.5">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand / Demo Mode Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-400 to-yellow-300 text-blue-950 font-black flex items-center justify-center text-sm shadow-md">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase tracking-wider text-amber-400">
                  Judges & Demo Tour Mode
                </span>
                <span className="bg-blue-900/90 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-700">
                  TheSuperRAG Copilot
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Live End-to-End System Walkthrough (Steps 1–5)
              </span>
            </div>
          </div>

          {/* Middle: Step Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COPILOT_TOUR_STEPS.map((s) => {
              const isActive = tourStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => executeStep(s.step, false)}
                  className={`px-3 py-1.5 rounded text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-blue-950 shadow-md ring-2 ring-white scale-105 font-black"
                      : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                  }`}
                >
                  <span>Step {s.step}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-950 animate-ping" />}
                </button>
              );
            })}
          </div>

          {/* Right: Player Controls */}
          <div className="flex items-center gap-2">
            {/* Auto-Play Video Simulator Button */}
            <button
              onClick={toggleAutoPlay}
              className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isAutoPlaying
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isAutoPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
              <span>{isAutoPlaying ? "Pause ⏸️" : "Auto-Play Tour ⚡"}</span>
            </button>

            {/* Prev / Next */}
            <button
              onClick={handlePrevStep}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 cursor-pointer"
              title="Previous Step"
            >
              <Rewind size={14} />
            </button>
            <button
              onClick={handleNextStep}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              title="Next Step"
            >
              <span>Next</span>
              <FastForward size={14} />
            </button>

            {/* Speech Toggle */}
            <button
              onClick={() => {
                const nextState = !speechEnabled;
                setSpeechEnabled(nextState);
                if (!nextState && typeof window !== "undefined" && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                } else if (nextState) {
                  speakVoice(currentStep.narrative);
                }
              }}
              className={`p-1.5 rounded border cursor-pointer ${
                speechEnabled
                  ? "bg-blue-900/80 text-blue-200 border-blue-600"
                  : "bg-slate-800 text-slate-500 border-slate-700"
              }`}
              title={speechEnabled ? "Voice narration active (Click to mute)" : "Voice narration muted (Click to unmute)"}
            >
              {speechEnabled ? <Volume2 size={14} className="text-amber-400" /> : <VolumeX size={14} />}
            </button>

            {/* Minimize */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded border border-slate-700 cursor-pointer ml-1"
              title="Minimize Demo Bar"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Banner: Active Step Detail & Live Audio Wave Subtitle */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Active Step Badge & Subtitle */}
          <div className="lg:col-span-8 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-blue-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                {currentStep.badge}
              </span>
              <span className="text-xs font-black text-white">{currentStep.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">[{currentStep.techStack}]</span>
            </div>

            {/* Synchronized Voice Subtitle Ticker */}
            <div className="flex items-start gap-2 bg-slate-900/90 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-200">
              <span className="text-amber-400 font-black text-[11px] shrink-0 flex items-center gap-1 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                </span>
                AI Voice:
              </span>
              <p className="leading-snug text-[11px] text-slate-200">{syncCaption}</p>
            </div>
          </div>

          {/* Quick Step Action & Page Link */}
          <div className="lg:col-span-4 flex items-center justify-end gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {currentStep.metricLabel}
              </div>
              <div className="text-sm font-black text-amber-400">{currentStep.metric}</div>
            </div>

            <Link
              href={currentStep.route}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider px-3.5 py-2 rounded flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <span>{pathname === currentStep.route ? "Active Screen" : "Go to Page"}</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
