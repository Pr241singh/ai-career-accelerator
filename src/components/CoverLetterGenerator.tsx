import React, { useState } from 'react';
import { UserProfile, CoverLetterResult } from '../types';
import {
  Mail,
  Sparkles,
  Copy,
  Download,
  CheckCircle2,
  Zap,
  RefreshCw,
  Building,
  Target
} from 'lucide-react';
import { AILoadingState } from './AILoadingState';

interface CoverLetterGeneratorProps {
  userProfile: UserProfile;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ userProfile }) => {
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Developer');
  const [companyName, setCompanyName] = useState<string>('Innovate Cloud Systems');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tone, setTone] = useState<string>('Professional');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      alert('Please enter a target company name.');
      return;
    }

    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          companyName,
          jobDescription,
          userSkills: Array.isArray(userProfile?.currentSkills) ? userProfile.currentSkills : [],
          tone
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data: CoverLetterResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Cover letter error:', err);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const element = document.createElement('a');
    const file = new Blob([result.coverLetterText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>Tailored Job Applications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Cover Letter <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Craft persuasive, recruiter-friendly cover letters personalized for <span className="text-sky-300 font-semibold">{companyName || 'Target Company'}</span> with zero generic fluff.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-black rounded-xl shadow-lg neon-glow transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50 text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Writing Cover Letter...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                <span>Generate Cover Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Target Job Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Google, Acme Corp"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Tone of Voice</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Professional">Professional & Polished</option>
              <option value="Enthusiastic">Enthusiastic & High-Energy</option>
              <option value="Technical">Technical & Engineering Focused</option>
              <option value="Concise">Concise & Direct (Under 200 words)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1.5">
            Job Description Snippet (Optional - for deeper customization)
          </label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste key responsibilities or requirements from the job posting..."
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <AILoadingState
          title="Cover Letter AI Synthesis"
          steps={[
            'Analyzing candidate achievements & target role specs...',
            'Formatting tailored hook & company enthusiasm paragraph...',
            'Injecting relevant keywords & STAR accomplishments...',
            'Refining tone & professional closing signature...'
          ]}
        />
      )}

      {/* Output Letter */}
      {!loading && result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Cover Letter for {companyName}</h2>
              <span className="text-xs text-slate-400">
                Word Count: {result.wordCount} words • Tone: {result.toneUsed}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center space-x-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          {/* Letter Body */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-slate-200 text-sm font-sans leading-relaxed whitespace-pre-line">
            {result.coverLetterText}
          </div>

          {/* Highlights */}
          {result.keyHighlights && result.keyHighlights.length > 0 && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase">Key Value Hooks Included:</span>
              <ul className="space-y-1">
                {result.keyHighlights.map((hl, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center space-x-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
