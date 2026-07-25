import React from 'react';
import { UserProfile } from '../types';
import {
  Sparkles,
  FileText,
  Mic,
  Map,
  BarChart3,
  Mail,
  Briefcase,
  User,
  CheckCircle2,
  RefreshCw,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onLoadPreset: (presetKey: 'student' | 'ai_enthusiast') => void;
  onOpenAuthModal: (mode?: 'login' | 'signup' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onLoadPreset,
  onOpenAuthModal
}) => {
  const navItems = [
    { id: 'resume', label: 'ATS Resume Fixer', icon: FileText, badge: 'AI Powered' },
    { id: 'interview', label: 'Voice Mock Interview', icon: Mic, badge: 'Voice AI' },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, badge: 'Free' },
    { id: 'skillgap', label: 'Skill Gap Analysis', icon: BarChart3 },
    { id: 'coverletter', label: 'Cover Letter', icon: Mail },
    { id: 'jobs', label: 'Internships & Jobs', icon: Briefcase, badge: 'Free API' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('resume')}>
            <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center neon-glow text-slate-950 font-black">
              <Zap className="w-5 h-5 fill-current text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  AI CAREER <span className="text-sky-400 font-black">ACCELERATOR</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded-full uppercase">
                  FREE AI PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI-powered ATS Resume Fixer, Voice Mock Interviewer & Career Roadmap</p>
            </div>
          </div>

          {/* Quick Presets for Demo */}
          <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs text-slate-300 glass-panel">
            <span className="px-2.5 font-medium text-slate-400 text-[11px]">Demo Accounts:</span>
            <button
              onClick={() => onLoadPreset('student')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                userProfile.id === 'demo-student-1'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md neon-glow'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span>Alex (CS Senior)</span>
            </button>
            <button
              onClick={() => onLoadPreset('ai_enthusiast')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                userProfile.id === 'demo-ai-1'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md neon-glow'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span>Priya (AI Intern)</span>
            </button>
          </div>

          {/* Auth & User Profile Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black px-3 py-1.5 rounded-xl transition-all text-xs neon-glow shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Sign Up</span>
            </button>

            <button
              onClick={() => onOpenAuthModal('profile')}
              className="flex items-center space-x-2.5 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-medium text-slate-200 glass-panel"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-inner">
                {userProfile.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="font-bold text-white text-xs max-w-[110px] truncate leading-tight">{userProfile.name}</p>
                <p className="text-[10px] text-sky-400 font-mono truncate max-w-[110px]">{userProfile.targetRole}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar border-t border-white/10 py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg neon-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400 border border-sky-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

