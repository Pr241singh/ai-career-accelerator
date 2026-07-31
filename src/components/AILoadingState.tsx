import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

interface AILoadingStateProps {
  title?: string;
  steps?: string[];
  currentStepIndex?: number;
}

const DEFAULT_STEPS = [
  'Parsing document context & keywords...',
  'Executing Gemini 2.5 Flash neural evaluation...',
  'Checking ATS compatibility & density metrics...',
  'Generating personalized recommendations & action items...'
];

export const AILoadingState: React.FC<AILoadingStateProps> = ({
  title = 'AI Reasoning & Synthesis',
  steps = DEFAULT_STEPS,
  currentStepIndex
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (typeof currentStepIndex === 'number') {
      setActiveStep(currentStepIndex);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [steps, currentStepIndex]);

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-sky-500/30 bg-slate-900/90 shadow-2xl text-center space-y-6 max-w-xl mx-auto my-8 relative overflow-hidden animate-fade-in">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Central Spinner Emblem */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 p-0.5 animate-spin">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Zap className="w-8 h-8 text-sky-400 fill-current animate-bounce" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-950/80 border border-sky-800/80 rounded-full text-xs font-bold text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>{title}</span>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">
          Gemini AI is processing your request...
        </h3>
      </div>

      {/* Steps checklist animation */}
      <div className="space-y-2 text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        {steps.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-2 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-sky-950/60 border border-sky-500/40 text-sky-200'
                  : isDone
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className={`text-xs font-medium ${isCurrent ? 'font-bold text-sky-300' : ''}`}>
                {stepText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
