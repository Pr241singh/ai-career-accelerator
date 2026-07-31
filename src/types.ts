export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  targetRole: string;
  experienceLevel: string;
  yearsOfExperience: number;
  currentSkills: string[];
  resumeText: string;
  savedJobs: string[];
  savedRoadmaps: string[];
  atsScore?: number;
  skillGapScore?: number;
  interviewScore?: number;
  roadmapProgress?: number;
  overallReadiness?: number;
  token?: string;
  createdAt?: string;
}

export interface BulletPointFix {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  summary: string;
  contactDetailsPresent: boolean;
  formattingScore: number;
  impactScore: number;
  skillsFound: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  bulletPointFixes: BulletPointFix[];
  actionableRecommendations: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Problem Solving' | 'HR';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyTalkingPoints: string[];
  modelAnswer: string;
  userAnswer?: string;
  score?: number;
  technicalScore?: number;
  communicationScore?: number;
  starFormatScore?: number;
  feedback?: string;
  betterResponseExample?: string;
}

export interface InterviewSession {
  id: string;
  targetRole: string;
  companyTarget?: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  status: 'setup' | 'active' | 'completed';
  overallScore?: number;
  executiveSummary?: string;
  keyStrengths?: string[];
  areasToImprove?: string[];
}

export interface RoadmapResource {
  title: string;
  url: string;
  type: 'Documentation' | 'Course' | 'YouTube' | 'GitHub' | 'Article';
  isFree: boolean;
}

export interface RoadmapMilestone {
  id: string;
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  summary: string;
  focusSkills: string[];
  keyTopics: string[];
  recommendedProjects: string[];
  freeResources: RoadmapResource[];
  completed: boolean;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  targetRole: string;
  durationMonths: number;
  estimatedHoursPerWeek: number;
  overview: string;
  milestones: RoadmapMilestone[];
  createdAt: string;
}

export interface SkillCategory {
  name: string;
  level: 'Proficient' | 'Learning' | 'Missing';
  importance: 'High' | 'Medium' | 'Nice to Have';
  description?: string;
  freeResourceUrl?: string;
}

export interface SkillGapAnalysis {
  targetRole: string;
  currentSkillList: string[];
  gapScore: number; // 0 to 100 (100 = full match, 0 = big gap)
  masteredSkills: SkillCategory[];
  partiallyKnownSkills: SkillCategory[];
  criticalMissingSkills: SkillCategory[];
  learningStrategy: string[];
}

export interface CoverLetterResult {
  coverLetterText: string;
  keyHighlights: string[];
  wordCount: number;
  toneUsed: string;
  customizationTips: string[];
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Remote';
  experienceLevel: string;
  salaryOrStipend: string;
  description: string;
  requirements: string[];
  skillsNeeded: string[];
  applyUrl: string;
  source: string;
  postedDate: string;
  matchScore?: number;
  matchReason?: string;
}
