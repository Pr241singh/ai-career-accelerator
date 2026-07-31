import React from 'react';
import { UserProfile } from '../types';
import {
  FileText,
  Mic,
  Map,
  BarChart3,
  Mail,
  Briefcase,
  Zap,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: (mode?: 'login' | 'signup' | 'profile') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  setActiveTab,
  onOpenAuthModal
}) => {
  // Compute dynamic stats based on user profile
  const targetRole = userProfile.targetRole || 'Full Stack Web Developer';

  let completedCount = 0;
  let totalScorePoints = 0;

  if (typeof userProfile.atsScore === 'number') {
    completedCount++;
    totalScorePoints += userProfile.atsScore;
  }
  if (typeof userProfile.skillGapScore === 'number') {
    completedCount++;
    totalScorePoints += userProfile.skillGapScore;
  }
  if (typeof userProfile.interviewScore === 'number') {
    completedCount++;
    totalScorePoints += userProfile.interviewScore;
  }
  if (typeof userProfile.roadmapProgress === 'number' && userProfile.roadmapProgress > 0) {
    completedCount++;
    const rmScore = Math.min(100, Math.round((userProfile.roadmapProgress / 7) * 100));
    totalScorePoints += rmScore;
  }

  const readinessOverall = completedCount > 0
    ? Math.round((totalScorePoints / completedCount) * (completedCount / 4))
    : (userProfile.overallReadiness || 0);

  const quickTools = [
    {
      id: 'resume',
      title: 'ATS Resume Fixer',
      desc: 'Scan your resume against ATS criteria, fix bullet points, and highlight high-impact keywords.',
      icon: FileText,
      tag: 'AI Analyzer',
      badgeColor: 'from-sky-500 to-indigo-600',
      action: 'Fix Resume'
    },
    {
      id: 'skillgap',
      title: 'Skill Gap Analyzer',
      desc: 'Identify missing technical competencies for target roles and generate free learning paths.',
      icon: BarChart3,
      tag: 'Role Matcher',
      badgeColor: 'from-indigo-500 to-violet-600',
      action: 'Check Skills'
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      desc: 'Step-by-step personalized learning milestones, weekly objectives, and project deliverables.',
      icon: Map,
      tag: 'Timeline Plan',
      badgeColor: 'from-violet-500 to-purple-600',
      action: 'View Roadmap'
    },
    {
      id: 'interview',
      title: 'AI Mock Interview',
      desc: 'Practice role-specific behavioral & technical questions with Web Speech Voice input.',
      icon: Mic,
      tag: 'Voice Beta',
      badgeColor: 'from-emerald-500 to-teal-600',
      action: 'Practice Interview'
    },
    {
      id: 'coverletter',
      title: 'Cover Letter Generator',
      desc: 'Generate recruiter-tailored, persuasive cover letters matching job descriptions in seconds.',
      icon: Mail,
      tag: '1-Click Writer',
      badgeColor: 'from-amber-500 to-orange-600',
      action: 'Generate Letter'
    },
    {
      id: 'jobs',
      title: 'Curated Job Board',
      desc: 'Discover software engineering, AI, & design internships with 1-click skill match scoring.',
      icon: Briefcase,
      tag: 'Live Openings',
      badgeColor: 'from-cyan-500 to-sky-600',
      action: 'Explore Jobs'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-bold text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Career Command Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="gradient-text">{userProfile.name}</span> 👋
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              Targeting <span className="text-sky-300 font-bold">{targetRole}</span> • <span className="text-slate-400">{userProfile.experienceLevel}</span>. Here is your real-time AI career readiness breakdown and actionable next steps.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {userProfile.currentSkills.slice(0, 5).map((skill, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 font-mono">
                  {skill}
                </span>
              ))}
              {userProfile.currentSkills.length > 5 && (
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 font-mono">
                  +{userProfile.currentSkills.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('resume')}
              className="px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-sm shadow-xl neon-glow transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-current text-slate-950" />
              <span>Analyze Resume with AI</span>
            </button>

            <button
              onClick={() => onOpenAuthModal('profile')}
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4 text-sky-400" />
              <span>Edit Career Goals & Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Overall Readiness */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Readiness</span>
            <Award className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <span className="text-3xl font-black text-white">{readinessOverall}%</span>
            <span className="text-[11px] font-medium text-slate-400">
              {readinessOverall === 0 ? 'Upload your resume to begin.' : 'Role Readiness Level'}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${readinessOverall}%` }}
            />
          </div>
        </div>

        {/* Metric 2: ATS Resume */}
        <div
          onClick={() => setActiveTab('resume')}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>ATS Resume</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {typeof userProfile.atsScore === 'number' ? `${userProfile.atsScore}/100` : 'Not Generated'}
            </span>
            <span className="text-[11px] text-sky-400 font-semibold group-hover:underline flex items-center">
              {typeof userProfile.atsScore === 'number' ? 'ATS Analyzed' : 'Analyze Resume →'}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: typeof userProfile.atsScore === 'number' ? `${userProfile.atsScore}%` : '0%' }}
            />
          </div>
        </div>

        {/* Metric 3: Skill Gap */}
        <div
          onClick={() => setActiveTab('skillgap')}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Skill Gap</span>
            <BarChart3 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {typeof userProfile.skillGapScore === 'number' ? `${userProfile.skillGapScore}%` : 'Not Analyzed'}
            </span>
            <span className="text-[11px] text-indigo-400 font-semibold group-hover:underline flex items-center">
              {typeof userProfile.skillGapScore === 'number' ? 'Skill Match' : 'Run Analysis →'}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: typeof userProfile.skillGapScore === 'number' ? `${userProfile.skillGapScore}%` : '0%' }}
            />
          </div>
        </div>

        {/* Metric 4: Interview */}
        <div
          onClick={() => setActiveTab('interview')}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Interview</span>
            <Mic className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {typeof userProfile.interviewScore === 'number' ? `${userProfile.interviewScore}/100` : 'Not Attempted'}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold group-hover:underline flex items-center">
              {typeof userProfile.interviewScore === 'number' ? 'Voice Ready' : 'Start Interview →'}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: typeof userProfile.interviewScore === 'number' ? `${userProfile.interviewScore}%` : '0%' }}
            />
          </div>
        </div>

        {/* Metric 5: Roadmap */}
        <div
          onClick={() => setActiveTab('roadmap')}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3 relative overflow-hidden group hover:border-sky-500/40 transition-all cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Roadmap</span>
            <Map className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {typeof userProfile.roadmapProgress === 'number' && userProfile.roadmapProgress > 0
                ? `${userProfile.roadmapProgress} / 7`
                : '0 / 7'}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold group-hover:underline flex items-center">
              {typeof userProfile.roadmapProgress === 'number' && userProfile.roadmapProgress > 0
                ? 'Active Steps'
                : 'Generate Roadmap →'}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{
                width: typeof userProfile.roadmapProgress === 'number' && userProfile.roadmapProgress > 0
                  ? `${Math.round((userProfile.roadmapProgress / 7) * 100)}%`
                  : '0%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Core AI Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">AI Career Tools & Suite</h2>
            <p className="text-xs text-slate-400">Comprehensive AI modules designed to accelerate your hiring success</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickTools.map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/80 hover:bg-slate-900/95 hover:border-sky-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 group relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${tool.badgeColor} text-slate-950 font-black shadow-md`}>
                      <Icon className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-bold group-hover:border-sky-500/40 group-hover:text-sky-300 transition-colors">
                      {tool.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <span>{tool.action}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
