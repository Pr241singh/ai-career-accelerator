import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { DEMO_PROFILES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { MockInterviewer } from './components/MockInterviewer';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { JobBoard } from './components/JobBoard';
import { AuthModal } from './components/AuthModal';
import { getActiveUserProfile, updateProfileInStore, setActiveUserId } from './lib/authStore';
import { Zap } from 'lucide-react';

const SESSION_KEY = 'ai_accelerator_session_active_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getActiveUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup' | 'profile'>('profile');

  const handleAuthenticate = (profile: UserProfile) => {
    setUserProfile(profile);
    setActiveUserId(profile.id);
    updateProfileInStore(profile);
    setIsAuthenticated(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup' | 'profile' = 'profile') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleProfileChange = (updated: UserProfile) => {
    setUserProfile(updated);
    updateProfileInStore(updated);
  };

  const handleUpdateResumeText = (newText: string) => {
    setUserProfile(prev => {
      const updated = { ...prev, resumeText: newText };
      updateProfileInStore(updated);
      return updated;
    });
  };

  // If user is not yet logged in or selected a demo profile, show LandingPage first
  if (!isAuthenticated) {
    return <LandingPage onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            setActiveTab={setActiveTab}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeAnalyzer
            userProfile={userProfile}
            onUpdateResumeText={handleUpdateResumeText}
            onProfileChange={handleProfileChange}
          />
        )}

        {activeTab === 'interview' && (
          <MockInterviewer
            userProfile={userProfile}
            onProfileChange={handleProfileChange}
          />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapView
            userProfile={userProfile}
            onProfileChange={handleProfileChange}
          />
        )}

        {activeTab === 'skillgap' && (
          <SkillGapAnalyzer
            userProfile={userProfile}
            onProfileChange={handleProfileChange}
          />
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
            <span>— Pro SaaS Platform</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-800">•</span>
            <span>National Hackathon Edition</span>
          </div>
        </div>
      </footer>

      {/* Profile & Settings Modal */}
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
