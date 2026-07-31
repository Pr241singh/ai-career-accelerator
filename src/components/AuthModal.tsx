import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Mail,
  Lock,
  X,
  Sparkles,
  LogIn,
  UserPlus,
  CheckCircle2,
  Briefcase,
  Code,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Zap,
  RefreshCw,
  FileText,
  Check,
  Plus
} from 'lucide-react';
import {
  getRegisteredUsers,
  registerNewUser,
  loginUser,
  updateProfileInStore
} from '../lib/authStore';
import { COMMON_JOB_ROLES } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'profile';
}

const POPULAR_SKILLS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Python',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'SQL',
  'PostgreSQL',
  'Express.js',
  'Google Gemini API',
  'Docker',
  'Git',
  'FastAPI',
  'PyTorch',
  'Figma',
  'REST API'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserProfile,
  onProfileChange,
  initialMode = 'profile'
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>(initialMode);

  // Sign Up form state
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
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [signupResume, setSignupResume] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Edit Profile form state
  const [editName, setEditName] = useState(currentUserProfile.name);
  const [editEmail, setEditEmail] = useState(currentUserProfile.email);
  const [editTargetRole, setEditTargetRole] = useState(currentUserProfile.targetRole);
  const [editExperience, setEditExperience] = useState(currentUserProfile.experienceLevel);
  const [editSkillsText, setEditSkillsText] = useState(
    currentUserProfile.currentSkills.join(', ')
  );
  const [editResumeText, setEditResumeText] = useState(currentUserProfile.resumeText);

  const [successMessage, setSuccessMessage] = useState('');

  // Toggle skill selection in sign up
  const toggleSignupSkill = (skill: string) => {
    if (signupSkills.includes(skill)) {
      setSignupSkills(signupSkills.filter(s => s !== skill));
    } else {
      setSignupSkills([...signupSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !signupSkills.includes(customSkillInput.trim())) {
      setSignupSkills([...signupSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  // Handle New User Sign Up
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setLoginError('Please enter your full name and email address.');
      return;
    }

    const newProfile = registerNewUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword.trim() || 'password123',
      targetRole: signupTargetRole,
      experienceLevel: signupExperience,
      currentSkills: signupSkills,
      resumeText: signupResume.trim() || undefined
    });

    onProfileChange(newProfile);
    setSuccessMessage(`Account created successfully! Welcome, ${newProfile.name}.`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  // Handle User Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }

    const found = loginUser(loginEmail.trim(), loginPassword.trim());
    if (found) {
      onProfileChange(found);
      setSuccessMessage(`Welcome back, ${found.name}!`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    } else {
      setLoginError('Account not found. Please create an account first.');
    }
  };

  // Handle Quick Guest Login
  const handleQuickGuestLogin = () => {
    const guestUser = registerNewUser({
      name: `Guest User #${Math.floor(1000 + Math.random() * 9000)}`,
      email: `guest_${Date.now()}@career-accelerator.ai`,
      targetRole: 'Full Stack Web Developer',
      experienceLevel: 'Entry-Level / Student / Fresher',
      currentSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS']
    });

    onProfileChange(guestUser);
    setSuccessMessage('Logged in as Guest User!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  // Handle Select Existing Demo User
  const handleSelectDemoUser = (user: UserProfile) => {
    onProfileChange(user);
    setSuccessMessage(`Switched active profile to ${user.name}`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  // Save Edit Profile
  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = editSkillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updated: UserProfile = {
      ...currentUserProfile,
      name: editName,
      email: editEmail,
      targetRole: editTargetRole,
      experienceLevel: editExperience,
      currentSkills: updatedSkills,
      resumeText: editResumeText
    };

    updateProfileInStore(updated);
    onProfileChange(updated);
    setSuccessMessage('Profile information saved successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  const registeredUsers = getRegisteredUsers();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel rounded-3xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 relative animate-fade-in text-slate-100 bg-slate-900/95 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Success Toast Banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg neon-glow">
              <Zap className="w-5 h-5 fill-current text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {mode === 'signup' && 'Create New Account'}
                {mode === 'login' && 'Sign In to Your Account'}
                {mode === 'profile' && 'User Account & Profile'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'signup' && 'Join the AI Career Accelerator platform for free'}
                {mode === 'login' && 'Access your personalized AI career dashboard'}
                {mode === 'profile' && `Active session: ${currentUserProfile.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('profile')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'profile'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Active Profile</span>
          </button>

          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up (New)</span>
          </button>

          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md neon-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Switch</span>
          </button>
        </div>

        {/* -------------------- SIGN UP FORM (NEW USERS) -------------------- */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                {loginError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="e.g. John Doe, Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
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
                <label className="block text-slate-300 font-semibold mb-1">Experience Level</label>
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
              <label className="block text-slate-300 font-semibold mb-1">Target Job Role</label>
              <input
                type="text"
                value={signupTargetRole}
                onChange={e => setSignupTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI & GenAI Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-500 self-center">Popular:</span>
                {COMMON_JOB_ROLES.slice(0, 5).map(role => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setSignupTargetRole(role)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-300 hover:border-sky-500/50 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select / Add Your Technical Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2 max-h-28 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                {POPULAR_SKILLS.map(skill => {
                  const selected = signupSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSignupSkill(skill)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 ${
                        selected
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-sky-400" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill (e.g. GraphQL, AWS, Go)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Resume Text (Optional)</label>
              <textarea
                value={signupResume}
                onChange={e => setSignupResume(e.target.value)}
                placeholder="Paste your current resume content here or leave blank for auto-generated template..."
                className="w-full h-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 resize-none font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-sm shadow-lg neon-glow transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4 fill-current text-slate-950" />
              <span>Create Account & Start Learning</span>
            </button>
          </form>
        )}

        {/* -------------------- SIGN IN FORM (EXISTING USERS) -------------------- */}
        {mode === 'login' && (
          <div className="space-y-6 text-xs">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
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
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
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
                className="w-full py-3 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs shadow-lg neon-glow transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Sign In to Account</span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-semibold uppercase">Or Quick Access</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleQuickGuestLogin}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors border border-slate-700 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Instant Sign In as Guest</span>
              </button>

              <div>
                <span className="text-[11px] font-bold text-sky-400 block mb-2">Saved Accounts on this Device:</span>
                <div className="space-y-2">
                  {registeredUsers.map(user => {
                    const isCurrent = user.id === currentUserProfile.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectDemoUser(user)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-sky-950/60 border-sky-500 text-white'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-300 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-white">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.targetRole} • {user.email}</p>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="text-[10px] bg-sky-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">Active</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 hover:text-sky-400">Switch &rarr;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- ACTIVE PROFILE EDIT & SETTINGS -------------------- */}
        {mode === 'profile' && (
          <form onSubmit={handleSaveProfileEdit} className="space-y-5 text-xs">
            {/* User Profile Card */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg">
                  {currentUserProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <span>{currentUserProfile.name}</span>
                    <span className="bg-sky-950 border border-sky-800 text-sky-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {currentUserProfile.experienceLevel}
                    </span>
                  </h3>
                  <p className="text-slate-400 text-[11px]">{currentUserProfile.email}</p>
                  <p className="text-sky-300 font-semibold text-[11px] mt-0.5">Target: {currentUserProfile.targetRole}</p>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold transition-colors flex items-center space-x-1"
                >
                  <LogOut className="w-3 h-3 text-slate-400" />
                  <span>Switch Account</span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Job Role</label>
                  <input
                    type="text"
                    value={editTargetRole}
                    onChange={e => setEditTargetRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Experience Level</label>
                  <select
                    value={editExperience}
                    onChange={e => setEditExperience(e.target.value)}
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
                <label className="block text-slate-300 font-semibold mb-1">Current Technical Skills (comma-separated)</label>
                <textarea
                  value={editSkillsText}
                  onChange={e => setEditSkillsText(e.target.value)}
                  className="w-full h-16 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Resume Content (Used across ATS Audit & Cover Letter)</label>
                <textarea
                  value={editResumeText}
                  onChange={e => setEditResumeText(e.target.value)}
                  className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 resize-none font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl text-xs neon-glow transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
