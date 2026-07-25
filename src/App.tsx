import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { DEMO_PROFILES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MockInterviewer } from './components/MockInterviewer';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { JobBoard } from './components/JobBoard';
import { AuthModal } from './components/AuthModal';
import { getActiveUserProfile, updateProfileInStore, setActiveUserId } from './lib/authStore';
import {
  FileText,
  Mic,
  Map,
  BarChart3,
  Mail,
  Briefcase,
  Zap,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('resume');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getActiveUserProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup' | 'profile'>('profile');

  const handleOpenAuthModal = (mode: 'login' | 'signup' | 'profile' = 'profile') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleProfileChange = (updated: UserProfile) => {
    setUserProfile(updated);
    updateProfileInStore(updated);
  };

  const handleLoadPreset = (presetKey: 'student' | 'ai_enthusiast') => {
    if (DEMO_PROFILES[presetKey]) {
      const preset = DEMO_PROFILES[presetKey];
      setUserProfile(preset);
      setActiveUserId(preset.id);
      updateProfileInStore(preset);
    }
  };

  const handleUpdateResumeText = (newText: string) => {
    setUserProfile(prev => {
      const updated = { ...prev, resumeText: newText };
      updateProfileInStore(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onLoadPreset={handleLoadPreset}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Render Tab Component */}
        {activeTab === 'resume' && (
          <ResumeAnalyzer
            userProfile={userProfile}
            onUpdateResumeText={handleUpdateResumeText}
          />
        )}

        {activeTab === 'interview' && (
          <MockInterviewer userProfile={userProfile} />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapView userProfile={userProfile} />
        )}

        {activeTab === 'skillgap' && (
          <SkillGapAnalyzer userProfile={userProfile} />
        )}

        {activeTab === 'coverletter' && (
          <CoverLetterGenerator userProfile={userProfile} />
        )}

        {activeTab === 'jobs' && (
          <JobBoard userProfile={userProfile} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300">AI Career Accelerator</span>
            <span>— Immersive UI & Web Speech Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-800">•</span>
          </div>
        </div>
      </footer>

      {/* Auth & User Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUserProfile={userProfile}
        onProfileChange={handleProfileChange}
        initialMode={authModalInitialMode}
      />
    </div>
  );
}

