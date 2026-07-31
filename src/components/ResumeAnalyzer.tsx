import React, { useState } from 'react';
import { UserProfile, ResumeAnalysisResult } from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Target,
  BarChart2,
  Briefcase
} from 'lucide-react';
import { AILoadingState } from './AILoadingState';

interface ResumeAnalyzerProps {
  userProfile: UserProfile;
  onUpdateResumeText: (text: string) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ userProfile, onUpdateResumeText }) => {
  const [resumeText, setResumeText] = useState<string>(userProfile.resumeText || '');
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<string>(userProfile.experienceLevel || 'Entry-Level');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const processFile = async (file: File) => {
    if (!file) return;
    setErrorMsg(null);
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (!result) {
          setErrorMsg('Failed to read file from local disk.');
          setUploading(false);
          return;
        }

        const base64Data = result.includes(',') ? result.split(',')[1] : result;

        const res = await fetch('/api/parse-resume-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileBase64: base64Data
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.details || 'Failed to parse resume document.');
        }

        const data = await res.json();
        if (data.text) {
          setResumeText(data.text);
          onUpdateResumeText(data.text);
        } else {
          throw new Error('No readable text could be extracted from document.');
        }
        setUploading(false);
      };

      reader.onerror = () => {
        setErrorMsg('Error reading file.');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('File Processing Error:', err);
      setErrorMsg(err.message || 'Error processing resume file.');
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.length < 20) {
      setErrorMsg('Please paste or upload a resume with at least 20 characters.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          experienceLevel
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.details || 'Failed to analyze resume');
      }

      const data: ResumeAnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Resume Analysis Error:', err);
      setErrorMsg(err.message || 'Error communicating with AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>ATS Resume Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Audit & Upgrade Your Resume with <span className="gradient-text">AI Precision</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Get an instant ATS score, missing keywords for <span className="text-sky-300 font-semibold">{targetRole}</span>, formatting audit, and AI STAR-method bullet point improvements.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl shadow-lg neon-glow transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running ATS Audit...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>Analyze Resume Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Role & Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Settings & Upload */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Target Role & Profile</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Target Job Title</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Entry-Level / Student / Fresher">Entry-Level / Student / Fresher</option>
                <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                <option value="Senior (5+ years)">Senior (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Import Resume File (.pdf, .docx, .txt)</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/60 relative ${
                  dragActive ? 'border-sky-400 bg-sky-950/30 scale-[1.02]' : 'border-slate-800 hover:border-sky-500/60'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf,.text,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                {uploading ? (
                  <div className="flex flex-col items-center py-2 space-y-2 text-sky-400">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-xs font-bold">Extracting Resume with AI...</span>
                  </div>
                ) : (
                  <>
                    <div className="p-2 bg-sky-950/80 border border-sky-800/80 text-sky-400 rounded-xl mb-1.5">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-slate-200 font-bold text-xs">Drop File or Click to Upload</span>
                    <span className="text-slate-400 text-[10px] mt-0.5 font-mono text-center">Supports PDF, Word (.docx), TXT & MD</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Text Editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Resume Content</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {resumeText.length} characters
            </span>
          </div>

          <textarea
            value={resumeText}
            onChange={e => {
              setResumeText(e.target.value);
              onUpdateResumeText(e.target.value);
            }}
            placeholder="Paste your full resume text here (Education, Experience, Projects, Skills)..."
            className="w-full flex-1 min-h-[280px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
          />

          {errorMsg && (
            <div className="mt-3 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <AILoadingState
          title="ATS Resume Neural Audit"
          steps={[
            'Reading and parsing document typography & layout...',
            'Comparing against ATS parsers & keyword density metrics...',
            'Calculating role fit for ' + targetRole + '...',
            'Writing STAR-method bullet point improvements...'
          ]}
        />
      )}

      {/* Audit Results Presentation */}
      {!loading && result && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Score Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ATS Score Gauge */}
            <div className="glass-panel stat-card rounded-2xl p-5 flex items-center space-x-4 shadow-xl">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      result.atsScore >= 80
                        ? 'text-sky-400'
                        : result.atsScore >= 60
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }
                    strokeDasharray={`${result.atsScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-extrabold text-lg text-white font-mono">{result.atsScore}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">ATS Match Score</p>
                <p className="text-sm font-bold text-slate-100">
                  {result.atsScore >= 80
                    ? 'Excellent Match'
                    : result.atsScore >= 60
                    ? 'Moderate Match'
                    : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Target: {targetRole}</p>
              </div>
            </div>

            {/* Impact & Action Verbs */}
            <div className="glass-panel stat-card rounded-2xl p-5 flex items-center space-x-4 shadow-xl">
              <div className="p-3 bg-sky-950/80 border border-sky-800/80 rounded-xl text-sky-400">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Metrics & Impact</p>
                <p className="text-xl font-bold text-white font-mono">{result.impactScore}%</p>
                <p className="text-[11px] text-slate-400">Quantified results score</p>
              </div>
            </div>

            {/* Formatting Rating */}
            <div className="glass-panel stat-card rounded-2xl p-5 flex items-center space-x-4 shadow-xl">
              <div className="p-3 bg-indigo-950/80 border border-indigo-800/80 rounded-xl text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Formatting Rating</p>
                <p className="text-xl font-bold text-white font-mono">{result.formattingScore}%</p>
                <p className="text-[11px] text-slate-400">Structure & parseability</p>
              </div>
            </div>

            {/* Contact Details Check */}
            <div className="glass-panel stat-card rounded-2xl p-5 flex items-center space-x-4 shadow-xl">
              <div
                className={`p-3 rounded-xl border ${
                  result.contactDetailsPresent
                    ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
                    : 'bg-red-950/80 border-red-800/80 text-red-400'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-400 uppercase tracking-wider">Contact Info</p>
                <p className="text-sm font-bold text-white">
                  {result.contactDetailsPresent ? 'Complete Detected' : 'Missing Details'}
                </p>
                <p className="text-[11px] text-slate-400">Email, Phone & Links</p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Recruiter Executive Assessment</h3>
            <p className="text-slate-200 text-sm leading-relaxed">{result.summary}</p>
          </div>

          {/* Missing Keywords vs Found Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords Tag Cloud */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Missing Keywords (Add These to Pass ATS)</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-medium rounded-lg"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Detected Skills in Your Resume</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skillsFound.map((sk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium rounded-lg"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* STAR Method Bullet Point Transformer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-indigo-400 fill-current" />
                  <span>AI STAR Bullet Point Transformer</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Replace weak or passive resume phrases with high-impact, metrics-driven achievements.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {result.bulletPointFixes.map((fix, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3 relative hover:border-slate-700 transition-colors"
                >
                  {/* Before / Original */}
                  <div className="flex items-start space-x-3 text-xs">
                    <span className="px-2 py-0.5 bg-red-950 border border-red-800/80 text-red-400 font-mono font-bold rounded shrink-0">
                      BEFORE
                    </span>
                    <p className="text-slate-400 line-through leading-relaxed">{fix.original}</p>
                  </div>

                  {/* After / Improved */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start space-x-3">
                      <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-mono font-bold rounded shrink-0">
                        AFTER (STAR)
                      </span>
                      <p className="text-emerald-300 font-medium leading-relaxed">{fix.improved}</p>
                    </div>

                    <button
                      onClick={() => handleCopyBullet(fix.improved, idx)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                      title="Copy improved bullet"
                    >
                      {copiedIndex === idx ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Why this works */}
                  <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-indigo-400 font-semibold">Why this works: </span>
                    {fix.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Step-by-step Recommendations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              <span>Step-by-Step Action Plan to Reach 90+ Score</span>
            </h3>
            <ul className="space-y-2.5">
              {result.actionableRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
