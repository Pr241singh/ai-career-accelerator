import React, { useState } from 'react';
import { UserProfile, CareerRoadmap, RoadmapMilestone } from '../types';
import confetti from 'canvas-confetti';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  ExternalLink,
  Code,
  FolderGit2,
  RefreshCw,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface CareerRoadmapViewProps {
  userProfile: UserProfile;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ userProfile }) => {
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Developer');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills: userProfile.currentSkills,
          hoursPerWeek
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate career roadmap');
      }

      const data = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error('Roadmap generation error:', err);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!roadmap) return;

    const updatedMilestones = roadmap.milestones.map(m => {
      if (m.id === milestoneId) {
        const nextState = !m.completed;
        if (nextState) {
          // Trigger Confetti!
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        return { ...m, completed: nextState };
      }
      return m;
    });

    setRoadmap({
      ...roadmap,
      milestones: updatedMilestones
    });
  };

  const completedCount = roadmap?.milestones.filter(m => m.completed).length || 0;
  const totalCount = roadmap?.milestones.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
              <Map className="w-3.5 h-3.5 text-sky-400" />
              <span>100% Free Learning Resources</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Personalized AI Career <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Step-by-step technical learning path tailored to your goal as a <span className="text-sky-300 font-semibold">{targetRole}</span>, featuring curated free courses, project ideas, and documentation.
            </p>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl shadow-lg neon-glow transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Building Custom Learning Path...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>Generate Roadmap Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Inputs Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Target Career Goal</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, AI & GenAI Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Weekly Hours Dedicated to Learning</label>
            <select
              value={hoursPerWeek}
              onChange={e => setHoursPerWeek(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
            >
              <option value={5}>5 hours / week (Casual)</option>
              <option value={10}>10 hours / week (Regular)</option>
              <option value={15}>15 hours / week (Focused)</option>
              <option value={25}>25+ hours / week (Bootcamp speed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roadmap Output */}
      {roadmap ? (
        <div className="space-y-6 animate-fade-in">
          {/* Progress Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{roadmap.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Duration: approx. {roadmap.durationMonths} months • {roadmap.estimatedHoursPerWeek} hrs/week
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-medium uppercase">Roadmap Progress</span>
                  <span className="text-lg font-bold text-indigo-400 font-mono">{progressPercent}%</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  {completedCount}/{totalCount}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">{roadmap.overview}</p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-6">
            {roadmap.milestones.map((m, index) => (
              <div
                key={m.id || index}
                className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-xl space-y-5 ${
                  m.completed ? 'border-emerald-800/80 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Milestone Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleMilestone(m.id || `m-${index}`)}
                      className={`mt-0.5 p-1 rounded-lg border transition-colors ${
                        m.completed
                          ? 'bg-emerald-950 border-emerald-700 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-indigo-400'
                      }`}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Phase {m.phaseNumber} ({m.durationWeeks} Weeks)
                        </span>
                        {m.completed && (
                          <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.2 rounded font-semibold">
                            Completed ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">{m.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{m.summary}</p>

                {/* Key Focus Skills & Topics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-indigo-300 font-bold block flex items-center space-x-1.5">
                      <Code className="w-3.5 h-3.5" />
                      <span>Focus Skills & Topics</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.focusSkills.map((sk, i) => (
                        <span key={i} className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-[11px] text-slate-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-violet-300 font-bold block flex items-center space-x-1.5">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Hands-On Portfolio Projects</span>
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {m.recommendedProjects.map((proj, i) => (
                        <li key={i} className="flex items-center space-x-1.5 text-[11px]">
                          <span className="text-violet-400 font-bold">•</span>
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Free Learning Links */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Curated 100% Free Resources:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {m.freeResources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto text-indigo-400">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Roadmap Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Generate Roadmap Now" above to build a personalized free learning roadmap tailored to your experience level and goal.
          </p>
        </div>
      )}
    </div>
  );
};
