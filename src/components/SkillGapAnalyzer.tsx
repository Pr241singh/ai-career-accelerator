import React, { useState } from 'react';
import { UserProfile, SkillGapAnalysis } from '../types';
import {
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Zap,
  RefreshCw,
  Plus,
  X,
  Code,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';
import { AILoadingState } from './AILoadingState';

interface SkillGapAnalyzerProps {
  userProfile: UserProfile;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ userProfile }) => {
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Developer');
  const [skillInput, setSkillInput] = useState<string>('');
  const [skillsList, setSkillsList] = useState<string[]>(userProfile.currentSkills || ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js']);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SkillGapAnalysis | null>(null);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAnalyzeGap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills: skillsList
        })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate skill gap');
      }

      const data: SkillGapAnalysis = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Skill gap error:', err);
      alert('Error analyzing skill gap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-800/80 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Skill Gap & Market Demand Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Compare Your Skills with <span className="gradient-text">Market Demand</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Pinpoint critical missing competencies for <span className="text-sky-300 font-semibold">{targetRole}</span>, view market weightings, and access free learning resources.
            </p>
          </div>

          <button
            onClick={handleAnalyzeGap}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl shadow-lg neon-glow transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Evaluating Skill Matrix...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>Analyze Skill Gap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, AI Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Add Current Skills</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Type a skill (e.g. Docker, GraphQL, PyTorch)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Skills Tags */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">Your Current Skill Set ({skillsList.length}):</span>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((sk, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-semibold rounded-xl flex items-center space-x-2"
              >
                <span>{sk}</span>
                <button
                  onClick={() => handleRemoveSkill(sk)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <AILoadingState
          title="Skill Gap AI Evaluation"
          steps={[
            'Scanning target role market specifications...',
            'Comparing candidate skills against industry benchmarks...',
            'Calculating market demand weightings & skill gaps...',
            'Curating free tutorials & project suggestions...'
          ]}
        />
      )}

      {/* Results Output */}
      {!loading && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Score Meter */}
          <div className="glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-sky-400" />
                <span>Target Role Alignment</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {result.gapScore >= 75
                  ? 'Strong Role Match'
                  : result.gapScore >= 50
                  ? 'Moderate Skill Gap'
                  : 'Action Required for Role Readiness'}
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating against <span className="text-sky-300 font-bold">{result.targetRole}</span> industry standard criteria.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400 font-semibold">Skill Readiness</span>
                <span className="text-2xl font-black text-sky-400 font-mono">{result.gapScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.gapScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Categorized Skills Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mastered Skills */}
            <div className="glass-panel bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Mastered Skills</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-300 font-mono">
                  {result.masteredSkills.length}
                </span>
              </div>
              <div className="space-y-3">
                {result.masteredSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1 hover:border-emerald-500/40 transition-colors">
                    <span className="font-bold text-xs text-emerald-300">{sk.name}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{sk.description || 'Verified on candidate profile'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partially Known Skills */}
            <div className="glass-panel bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Needs Deepening</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/80 text-amber-300 font-mono">
                  {result.partiallyKnownSkills.length}
                </span>
              </div>
              <div className="space-y-3">
                {result.partiallyKnownSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-1 hover:border-amber-500/40 transition-colors">
                    <span className="font-bold text-xs text-amber-300">{sk.name}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{sk.description || 'Expand project practice'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Missing Skills */}
            <div className="glass-panel bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-white">Critical Missing</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800/80 text-rose-300 font-mono">
                  {result.criticalMissingSkills.length}
                </span>
              </div>
              <div className="space-y-3">
                {result.criticalMissingSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-300">{sk.name}</span>
                      <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-400 px-2 py-0.5 rounded-full font-mono">
                        High Demand
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{sk.description}</p>
                    {sk.freeResourceUrl && (
                      <a
                        href={sk.freeResourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 text-[11px] text-sky-400 hover:text-sky-300 hover:underline pt-1 font-semibold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Free Tutorial / Documentation</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Strategy */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Recommended Learning Strategy & Portfolio Deliverables</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.learningStrategy.map((strat, i) => (
                <li key={i} className="flex items-start space-x-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200">
                  <span className="w-6 h-6 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{strat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
