import React, { useState, useEffect } from 'react';
import { UserProfile, JobOpportunity } from '../types';
import {
  Briefcase,
  Search,
  MapPin,
  Filter,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Building,
  DollarSign
} from 'lucide-react';

interface JobBoardProps {
  userProfile: UserProfile;
}

export const JobBoard: React.FC<JobBoardProps> = ({ userProfile }) => {
  const [query, setQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [type, setType] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // AI Match state per job ID
  const [matchLoading, setMatchLoading] = useState<Record<string, boolean>>({});
  const [matchResults, setMatchResults] = useState<Record<string, any>>({});

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (location) params.append('location', location);
      if (type !== 'All') params.append('type', type);
      if (remoteOnly) params.append('remoteOnly', 'true');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Job fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type, remoteOnly]);

  const handleCalculateMatch = async (job: JobOpportunity) => {
    setMatchLoading(prev => ({ ...prev, [job.id]: true }));

    try {
      const res = await fetch('/api/jobs/match-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description,
          skillsNeeded: job.skillsNeeded,
          userSkills: userProfile.currentSkills,
          userResumeText: userProfile.resumeText
        })
      });

      if (!res.ok) throw new Error('Failed to match job');

      const data = await res.json();
      setMatchResults(prev => ({ ...prev, [job.id]: data }));
    } catch (err) {
      console.error('Match score error:', err);
      alert('Failed to calculate match score.');
    } finally {
      setMatchLoading(prev => ({ ...prev, [job.id]: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span>Curated Tech Internships & Openings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Free Tech Internship & <span className="gradient-text">Job Opportunities</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Explore software engineering, AI, product design, and data science internships. Run 1-click <span className="text-sky-300 font-semibold">AI Match Score</span> calculations against your resume skills.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Search Query */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              placeholder="Title, skill, or keyword (e.g. React, AI)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
              placeholder="City, state, or Remote..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Job Type Select */}
          <div>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Job Types</option>
              <option value="Internship">Internships Only</option>
              <option value="Full-time">Full-time Only</option>
              <option value="Remote">Remote Roles</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={e => setRemoteOnly(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Remote Roles Only</span>
          </label>

          <button
            onClick={fetchJobs}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center space-x-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Jobs</span>
          </button>
        </div>
      </div>

      {/* Job Listings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
            <span>Searching opportunities...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <span>No jobs matching your filters. Try adjusting search terms.</span>
          </div>
        ) : (
          jobs.map(job => {
            const matchData = matchResults[job.id];
            const isMatching = matchLoading[job.id];

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-xl space-y-4"
              >
                {/* Top Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-0.5 rounded-lg">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-slate-400">• {job.postedDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{job.title}</h3>
                    <p className="text-xs text-slate-300 font-medium flex items-center space-x-3 mt-1">
                      <span className="flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{job.salaryOrStipend}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleCalculateMatch(job)}
                      disabled={isMatching}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-900/60 font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {isMatching ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-indigo-400 fill-current" />
                      )}
                      <span>AI Match Score</span>
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors inline-flex items-center space-x-1.5"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skillsNeeded.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-medium rounded-lg"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* AI Match Result Card */}
                {matchData && (
                  <div className="bg-slate-950 border border-indigo-900/60 rounded-xl p-4 space-y-3 animate-fade-in mt-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">AI Candidate-Job Compatibility</span>
                      </div>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        {matchData.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{matchData.matchReason}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-bold text-emerald-400 block mb-1">✓ Matching Skills You Have:</span>
                        <div className="flex flex-wrap gap-1">
                          {matchData.matchingSkills?.map((s: string, idx: number) => (
                            <span key={idx} className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-amber-400 block mb-1">! Skills to Mention in Interview:</span>
                        <div className="flex flex-wrap gap-1">
                          {matchData.missingSkills?.map((s: string, idx: number) => (
                            <span key={idx} className="bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {matchData.interviewPrepTips && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[11px] font-bold text-indigo-300 block mb-1">Interview Prep Tips for {job.company}:</span>
                        <ul className="space-y-1">
                          {matchData.interviewPrepTips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
