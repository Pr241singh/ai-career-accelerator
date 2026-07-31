import React, { useState } from 'react';
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
  Zap,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenAuthModal: (mode?: 'login' | 'signup' | 'profile') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAuthModal,
  onSignOut
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'ATS Resume Fixer', icon: FileText, badge: 'AI Powered' },
    { id: 'skillgap', label: 'Skill Gap Analysis', icon: BarChart3 },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'interview', label: 'Voice Mock Interview', icon: Mic, badge: 'Voice AI' },
    { id: 'coverletter', label: 'Cover Letter', icon: Mail },
    { id: 'jobs', label: 'Internships & Jobs', icon: Briefcase }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0 min-w-0" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 flex items-center justify-center neon-glow text-slate-950 font-black shadow-lg shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-black text-xs sm:text-lg tracking-tight text-white">
                  AI CAREER <span className="gradient-text font-black">ACCELERATOR</span>
                </span>
                <span className="text-[9px] font-bold tracking-wider text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded-full uppercase hidden sm:inline-block">
                  Pro SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">AI ATS Resume Fixer, Voice Mock Interview & Career Roadmaps</p>
            </div>
          </div>

          {/* User Profile Controls */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-medium text-slate-200 glass-panel shadow-md"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-inner">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-bold text-white text-xs max-w-[120px] truncate leading-tight">{userProfile.name}</p>
                <p className="text-[10px] text-sky-400 font-mono truncate max-w-[120px]">{userProfile.targetRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="font-bold text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuthModal('profile');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-sky-400" />
                  <span>Edit Profile & Skills</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors text-left font-semibold"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out / Switch User</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-white/10 py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 text-slate-950 font-black shadow-lg neon-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-sky-400 border border-sky-500/20'
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

