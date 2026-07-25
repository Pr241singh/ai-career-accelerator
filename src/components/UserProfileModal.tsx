import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, X, Plus, CheckCircle2, Target, Sparkles, RefreshCw } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onLoadPreset: (presetKey: 'student' | 'ai_enthusiast') => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onLoadPreset
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [targetRole, setTargetRole] = useState(userProfile.targetRole);
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel);
  const [skillsText, setSkillsText] = useState(userProfile.currentSkills.join(', '));

  const handleSave = () => {
    const updatedSkills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSaveProfile({
      ...userProfile,
      name,
      email,
      targetRole,
      experienceLevel,
      currentSkills: updatedSkills
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl border border-white/10 relative animate-fade-in text-slate-100 bg-slate-900/90">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-950 border border-sky-800 text-sky-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Manage User Profile</h2>
              <p className="text-xs text-slate-400">Configure your target career metrics & current skills</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <span className="font-bold text-sky-400 block">Quick Load Hackathon Preset Profiles:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onLoadPreset('student');
                onClose();
              }}
              className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-lg transition-colors text-[11px]"
            >
              🎓 CS Senior Student
            </button>
            <button
              onClick={() => {
                onLoadPreset('ai_enthusiast');
                onClose();
              }}
              className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-lg transition-colors text-[11px]"
            >
              🤖 AI Engineering Intern
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Job Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="Entry-Level / Student / Fresher">Entry-Level / Student / Fresher</option>
              <option value="Junior (1-2 years)">Junior (1-2 years)</option>
              <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
              <option value="Senior (5+ years)">Senior (5+ years)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Current Skills (comma-separated)</label>
            <textarea
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 resize-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs neon-glow transition-all"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
