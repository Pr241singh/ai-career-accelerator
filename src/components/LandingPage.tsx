import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Zap,
  Sparkles,
  UserPlus,
  LogIn,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Mic,
  Map,
  BarChart3,
  Mail,
  Briefcase,
  Star,
  Users,
  Award,
  ChevronRight,
  Lock,
  Mail as MailIcon,
  User as UserIcon,
  Check
} from 'lucide-react';
import { DEMO_PROFILES, COMMON_JOB_ROLES } from '../data/mockData';
import { registerNewUser, loginUser, saveRegisteredUsers } from '../lib/authStore';

interface LandingPageProps {
  onAuthenticate: (profile: UserProfile) => void;
}

const POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'Tailwind CSS',
  'Google Gemini API',
  'Docker',
  'Git',
  'PostgreSQL'
];

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthenticate }) => {
  const [mode, setMode] = useState<'landing' | 'signup' | 'login'>('landing');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTargetRole, setSignupTargetRole] = useState('Full Stack Web Developer');
  const [signupExperience, setSignupExperience] = useState('Entry-Level / Student / Fresher');
  const [signupSkills, setSignupSkills] = useState<string[]>([
    'React',
    'JavaScript',
    'Node.js',
    'Tailwind CSS'
  ]);
  const [formError, setFormError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const toggleSignupSkill = (skill: string) => {
    if (signupSkills.includes(skill)) {
      setSignupSkills(signupSkills.filter(s => s !== skill));
    } else {
      setSignupSkills([...signupSkills, skill]);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setFormError('Please enter your name and email address.');
      return;
    }

    const newProfile = registerNewUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword.trim() || 'password123',
      targetRole: signupTargetRole,
      experienceLevel: signupExperience,
      currentSkills: signupSkills
    });

    onAuthenticate(newProfile);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!loginEmail.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    const found = loginUser(loginEmail.trim(), loginPassword.trim());
    if (found) {
      onAuthenticate(found);
    } else {
      setFormError('Account not found. Please create an account first.');
    }
  };

  const handleGuestLogin = () => {
    const guestUser = registerNewUser({
      name: `Guest Candidate #${Math.floor(1000 + Math.random() * 9000)}`,
      email: `guest_${Date.now()}@career-accelerator.ai`,
      targetRole: 'Full Stack Web Developer',
      experienceLevel: 'Entry-Level / Student / Fresher',
      currentSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS']
    });

    onAuthenticate(guestUser);
  };

  const handleDemoProfile = (presetKey: 'student' | 'ai_enthusiast') => {
    const profile = DEMO_PROFILES[presetKey];
    if (profile) {
      const demoProfileWithMetrics: UserProfile = {
        ...profile,
        atsScore: profile.atsScore || 84,
        skillGapScore: profile.skillGapScore || 78,
        interviewScore: profile.interviewScore || 80,
        roadmapProgress: profile.roadmapProgress || 4,
        overallReadiness: profile.overallReadiness || 81
      };
      onAuthenticate(demoProfileWithMetrics);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setMode('landing')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg neon-glow">
              <Zap className="w-5 h-5 fill-current text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>AI Career</span>
                <span className="gradient-text">Accelerator</span>
              </span>
              <p className="text-[10px] text-sky-400 font-mono hidden sm:block">National Hackathon Edition</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className="px-5 py-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs shadow-lg neon-glow transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Get Started Free</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero / Auth Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center relative z-10">
        {mode === 'landing' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-4 py-1.5 rounded-full text-xs font-extrabold text-sky-300 shadow-xl">
                <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>Next-Gen AI Career Suite for Developers & Students</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                Land Your Dream Tech Job with <br className="hidden sm:inline" />
                <span className="gradient-text">Gemini AI Precision</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Accelerate your tech career with instant AI ATS resume optimization, skill gap analysis, interactive voice mock interviews, and tailored roadmap execution.
              </p>

              {/* Action Gate Options */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setMode('signup')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-2xl text-base shadow-2xl neon-glow transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-slate-950" />
                </button>

                <button
                  onClick={handleGuestLogin}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-100 font-bold rounded-2xl text-base transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5 text-sky-400 fill-current" />
                  <span>Continue as Guest</span>
                </button>
              </div>

              {/* Try Demo Profile Box */}
              <div className="pt-8 max-w-xl mx-auto">
                <div className="p-5 glass-panel rounded-3xl border border-white/10 bg-slate-900/80 space-y-3">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                    ⚡ Fast 1-Click Evaluation Demo Profiles
                  </span>
                  <p className="text-xs text-slate-400">
                    Judge or evaluator? Load pre-configured candidate profiles instantly with zero setup:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleDemoProfile('student')}
                      className="p-3 bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all text-left flex items-center space-x-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 font-black flex items-center justify-center shrink-0">
                        🎓
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors">Alex Rivera</p>
                        <p className="text-[10px] text-slate-400 truncate">CS Senior • Frontend & Full Stack</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleDemoProfile('ai_enthusiast')}
                      className="p-3 bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition-all text-left flex items-center space-x-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black flex items-center justify-center shrink-0">
                        🤖
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">Priya Sharma</p>
                        <p className="text-[10px] text-slate-400 truncate">AI Engineering Intern • PyTorch & LLMs</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">ATS Resume Auditor</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Upload PDF, DOCX, or TXT resumes. Get instant ATS scores, keyword gap detection, and line-by-line bullet rewrites.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">AI Voice Mock Interviewer</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Practice behavioral and technical questions using Web Speech API voice input with detailed STAR feedback.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/60 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Interactive Career Roadmap</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Execute personalized weekly milestones, portfolio project goals, and skill gap closures tailored to target companies.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up Mode */}
        {mode === 'signup' && (
          <div className="max-w-xl mx-auto w-full glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white">Create Your Account</h2>
                <p className="text-xs text-slate-400">Build your AI-powered career profile in seconds</p>
              </div>
              <button
                onClick={() => setMode('landing')}
                className="text-xs text-sky-400 font-bold hover:underline"
              >
                &larr; Back
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                  <div className="relative">
                    <MailIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="e.g. sarah@college.edu"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Experience Level</label>
                  <select
                    value={signupExperience}
                    onChange={e => setSignupExperience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Entry-Level / Student / Fresher">Entry-Level / Student / Fresher</option>
                    <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                    <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                    <option value="Senior (5+ years)">Senior (5+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Tech Role</label>
                <input
                  type="text"
                  value={signupTargetRole}
                  onChange={e => setSignupTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, AI Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Select Current Technical Skills</label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                  {POPULAR_SKILLS.map(skill => {
                    const active = signupSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSignupSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                          active
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-sky-400" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-sm shadow-xl neon-glow transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4 text-slate-950 fill-current" />
                <span>Create Profile & Launch Dashboard</span>
              </button>
            </form>
          </div>
        )}

        {/* Sign In Mode */}
        {mode === 'login' && (
          <div className="max-w-md mx-auto w-full glass-panel p-8 rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white">Sign In</h2>
                <p className="text-xs text-slate-400">Access your saved career profile & history</p>
              </div>
              <button
                onClick={() => setMode('landing')}
                className="text-xs text-sky-400 font-bold hover:underline"
              >
                &larr; Back
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <div className="relative">
                  <MailIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@college.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs shadow-xl neon-glow transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-3">Don't have an account?</p>
              <button
                onClick={() => setMode('signup')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
              >
                Create New Account
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300">AI Career Accelerator</span>
            <span>— Hackathon Edition</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Powered by Google Gemini 2.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
