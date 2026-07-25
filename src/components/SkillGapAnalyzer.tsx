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
  X
} from 'lucide-react';

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
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Skill Gap & Industry Readiness</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Compare Your Skills with <span className="gradient-text">Industry Demand</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Pinpoint critical missing skills required for <span className="text-sky-300 font-semibold">{targetRole}</span>, view market demand weightings, and get instant free course recommendations.
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
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-medium rounded-xl flex items-center space-x-2"
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

      {/* Results Output */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Score Meter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Skill Alignment Score</span>
              <h2 className="text-2xl font-extrabold text-white mt-0.5">
                {result.gapScore >= 75
                  ? 'Strong Job Readiness'
                  : result.gapScore >= 50
                  ? 'Moderate Skill Gap'
                  : 'Action Required for Target Role'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Role: {result.targetRole}
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl text-center">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase">Readiness</span>
              <span className="text-3xl font-extrabold text-indigo-400 font-mono">{result.gapScore}%</span>
            </div>
          </div>

          {/* Categorized Skills Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mastered Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Mastered Skills ({result.masteredSkills.length})</h3>
              </div>
              <div className="space-y-3">
                {result.masteredSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-xs text-emerald-300">{sk.name}</span>
                    <p className="text-[11px] text-slate-400">{sk.description || 'Verified on resume/profile'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partially Known Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Needs Deepening ({result.partiallyKnownSkills.length})</h3>
              </div>
              <div className="space-y-3">
                {result.partiallyKnownSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-xs text-amber-300">{sk.name}</span>
                    <p className="text-[11px] text-slate-400">{sk.description || 'Expand project practice'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Missing Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">Critical Missing ({result.criticalMissingSkills.length})</h3>
              </div>
              <div className="space-y-3">
                {result.criticalMissingSkills.map((sk, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-red-300">{sk.name}</span>
                      <span className="text-[10px] bg-red-950 border border-red-800 text-red-400 px-1.5 py-0.2 rounded">
                        High Demand
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{sk.description}</p>
                    {sk.freeResourceUrl && (
                      <a
                        href={sk.freeResourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[10px] text-indigo-400 hover:underline pt-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Free Tutorial / Docs</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Strategy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              Recommended Action Plan to Bridge Skill Gap
            </h3>
            <ul className="space-y-2">
              {result.learningStrategy.map((strat, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
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
