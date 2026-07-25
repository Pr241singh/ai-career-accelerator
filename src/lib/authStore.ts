import { UserProfile } from '../types';
import { DEMO_PROFILES } from '../data/mockData';

const USERS_STORAGE_KEY = 'ai_accelerator_users_v1';
const ACTIVE_USER_ID_KEY = 'ai_accelerator_active_user_id_v1';

// Initial default users list
const DEFAULT_ACCOUNTS: UserProfile[] = [
  DEMO_PROFILES.student,
  DEMO_PROFILES.ai_enthusiast
];

// Helper to get all registered users from LocalStorage
export function getRegisteredUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch (e) {
    console.error('Failed to parse registered users from LocalStorage', e);
    return DEFAULT_ACCOUNTS;
  }
}

// Helper to save users list
export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users', e);
  }
}

// Get active user profile
export function getActiveUserProfile(): UserProfile {
  try {
    const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
    const users = getRegisteredUsers();
    if (activeId) {
      const found = users.find(u => u.id === activeId);
      if (found) return found;
    }
    return users[0] || DEMO_PROFILES.student;
  } catch (e) {
    return DEMO_PROFILES.student;
  }
}

// Set active user ID
export function setActiveUserId(userId: string): void {
  try {
    localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
  } catch (e) {
    console.error('Failed to set active user ID', e);
  }
}

// Register a brand new user
export function registerNewUser(data: {
  name: string;
  email: string;
  password?: string;
  targetRole: string;
  experienceLevel: string;
  currentSkills: string[];
  resumeText?: string;
}): UserProfile {
  const users = getRegisteredUsers();
  
  // Check if user with same email exists
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === data.email.toLowerCase());
  
  const defaultResume = `${data.name.toUpperCase()}
Email: ${data.email} | Target Role: ${data.targetRole} | Experience: ${data.experienceLevel}

SUMMARY
Motivated candidate aiming for a ${data.targetRole} position. Skilled in ${data.currentSkills.join(', ')}.

SKILLS & CORE COMPETENCIES
- Key Technical Skills: ${data.currentSkills.join(', ')}
- Professional Focus: ${data.targetRole}

EXPERIENCE & PROJECTS
- Project Developer | Key Highlights
  * Designed and built web applications using ${data.currentSkills.slice(0, 3).join(', ') || 'Modern Tech Stack'}.
  * Demonstrated problem solving, API integration, and clean code principles.`;

  const newUser: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: data.name,
    email: data.email,
    password: data.password || 'password123',
    targetRole: data.targetRole || 'Full Stack Web Developer',
    experienceLevel: data.experienceLevel || 'Entry-Level / Student / Fresher',
    yearsOfExperience: data.experienceLevel.includes('Senior') ? 5 : data.experienceLevel.includes('Mid') ? 3 : 0,
    currentSkills: data.currentSkills.length > 0 ? data.currentSkills : ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    resumeText: data.resumeText || defaultResume,
    savedJobs: [],
    savedRoadmaps: [],
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    // Update existing user profile
    users[existingIndex] = { ...users[existingIndex], ...newUser, id: users[existingIndex].id };
    saveRegisteredUsers(users);
    setActiveUserId(users[existingIndex].id);
    return users[existingIndex];
  } else {
    // Add new user
    const updatedUsers = [newUser, ...users];
    saveRegisteredUsers(updatedUsers);
    setActiveUserId(newUser.id);
    return newUser;
  }
}

// Login existing user with email & password
export function loginUser(email: string, password?: string): UserProfile | null {
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (found) {
    setActiveUserId(found.id);
    return found;
  }
  return null;
}

// Update single user profile
export function updateProfileInStore(updatedProfile: UserProfile): UserProfile {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => u.id === updatedProfile.id);
  if (index >= 0) {
    users[index] = updatedProfile;
    saveRegisteredUsers(users);
  } else {
    users.unshift(updatedProfile);
    saveRegisteredUsers(users);
  }
  setActiveUserId(updatedProfile.id);
  return updatedProfile;
}
