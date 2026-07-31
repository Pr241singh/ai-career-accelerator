import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, InterviewQuestion, InterviewSession } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  BarChart3,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Zap,
  Building
} from 'lucide-react';
import { AILoadingState } from './AILoadingState';

interface MockInterviewerProps {
  userProfile: UserProfile;
}

export const MockInterviewer: React.FC<MockInterviewerProps> = ({ userProfile }) => {
  // Setup config
  const [targetRole, setTargetRole] = useState<string>(userProfile.targetRole || 'Full Stack Developer');
  const [companyTarget, setCompanyTarget] = useState<string>('FAANG / Tech Startup');
  const [category, setCategory] = useState<string>('Mixed');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');

  // Session state
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [userAnswerText, setUserAnswerText] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [generatingQuestions, setGeneratingQuestions] = useState<boolean>(false);

  // Voice AI States
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  // Check Web Speech API Support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak question when current question changes
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStartSession = async () => {
    setGeneratingQuestions(true);
    try {
      const res = await fetch('/api/ai/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          companyTarget,
          category,
          difficulty
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate interview questions');
      }

      const data = await res.json();
      const questions: InterviewQuestion[] = data.questions || [];

      const newSession: InterviewSession = {
        id: `session-${Date.now()}`,
        targetRole,
        companyTarget,
        questions,
        currentQuestionIndex: 0,
        status: 'active'
      };

      setSession(newSession);
      setUserAnswerText('');

      if (questions.length > 0 && ttsEnabled) {
        speakText(questions[0].question);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  // Toggle Speech-to-Text Recognition
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. You can type your response.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setUserAnswerText(prev => {
            // Append or update cleanly
            return prev ? `${prev} ${currentTranscript}` : currentTranscript;
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Mic access error:', err);
        setIsListening(false);
      }
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !userAnswerText.trim()) return;

    setEvaluating(true);
    const currentQ = session.questions[session.currentQuestionIndex];

    try {
      const res = await fetch('/api/ai/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          userAnswer: userAnswerText,
          targetRole: session.targetRole
        })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const evalResult = await res.json();

      // Update question in state
      const updatedQuestions = [...session.questions];
      updatedQuestions[session.currentQuestionIndex] = {
        ...currentQ,
        userAnswer: userAnswerText,
        score: evalResult.score,
        technicalScore: evalResult.technicalScore,
        communicationScore: evalResult.communicationScore,
        starFormatScore: evalResult.starFormatScore,
        feedback: evalResult.feedback,
        betterResponseExample: evalResult.betterResponseExample
      };

      setSession({
        ...session,
        questions: updatedQuestions
      });
    } catch (err) {
      console.error('Answer evaluation error:', err);
      alert('Could not evaluate answer. Please retry.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= session.questions.length) {
      // Calculate overall score
      const scores = session.questions.map(q => q.score || 0);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

      setSession({
        ...session,
        status: 'completed',
        overallScore: avgScore
      });
    } else {
      setSession({
        ...session,
        currentQuestionIndex: nextIndex
      });
      setUserAnswerText('');
      if (ttsEnabled) {
        speakText(session.questions[nextIndex].question);
      }
    }
  };

  // If session is setup / not started
  if (!session || session.status === 'setup') {
    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full text-xs font-semibold text-sky-300">
              <Mic className="w-3.5 h-3.5 text-sky-400" />
              <span>Free Browser Web Speech AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Voice Mock Interview <span className="gradient-text">Simulator</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Practice role-specific interview questions using <span className="text-sky-300 font-semibold">Web Speech Voice Recognition</span> and <span className="text-indigo-300 font-semibold">Browser Text-to-Speech</span>. Get real-time feedback on STAR format, technical accuracy, and communication clarity.
            </p>
          </div>
        </div>

        {/* Setup Configuration Card */}
        {generatingQuestions ? (
          <AILoadingState
            title="Interview Simulation Engine"
            steps={[
              'Analyzing company & role difficulty level...',
              'Generating STAR-format technical & behavioral questions...',
              'Configuring speech recognition & voice synthesis parameters...',
              'Launching interactive simulation session...'
            ]}
          />
        ) : (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-2xl border border-white/10">
          <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>Configure Interview Parameters</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, AI Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Company Context / Target</label>
              <input
                type="text"
                value={companyTarget}
                onChange={e => setCompanyTarget(e.target.value)}
                placeholder="e.g. Top Tech Companies, Early Stage Startup, FinTech"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Question Focus</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Mixed">Mixed (Technical + Behavioral)</option>
                  <option value="Technical">Technical & Coding Architecture</option>
                  <option value="Behavioral">Behavioral (STAR Method)</option>
                  <option value="HR">HR & Culture Fit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Beginner">Entry-Level / Fresher</option>
                  <option value="Intermediate">Intermediate (1-3 yrs)</option>
                  <option value="Advanced">Advanced / Senior</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-slate-400 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-sky-400" />
                <span>AI Voice Synthesis (Read aloud questions)</span>
              </span>
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  ttsEnabled ? 'bg-sky-500 text-slate-950 neon-glow' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {ttsEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>

          <button
            onClick={handleStartSession}
            disabled={generatingQuestions}
            className="w-full py-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl shadow-lg neon-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
          >
            {generatingQuestions ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Generating Customized AI Questions...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-slate-950" />
                <span>Start AI Voice Mock Interview</span>
              </>
            )}
          </button>
        </div>
        )}
      </div>
    );
  }

  // Active Session View
  const currentQ = session.questions[session.currentQuestionIndex];
  const isEvaluated = currentQ?.score !== undefined;

  // Final Summary Report
  if (session.status === 'completed') {
    return (
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 text-white">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Mock Session Completed</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Interview Executive Report</h2>
            <p className="text-slate-400 text-sm mt-1">Role: {session.targetRole} | Company Target: {session.companyTarget}</p>
          </div>

          <div className="inline-flex items-center space-x-3 bg-slate-950 border border-slate-800 px-8 py-4 rounded-2xl">
            <span className="text-sm font-semibold text-slate-400">Overall Score:</span>
            <span className="text-4xl font-extrabold text-indigo-400 font-mono">{session.overallScore}/100</span>
          </div>

          {/* Breakdown per question */}
          <div className="space-y-4 text-left">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">Question Performance Summary</h3>
            {session.questions.map((q, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-300">Question {idx + 1} ({q.category}):</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    {q.score || 0}/100
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{q.question}</p>
                {q.feedback && <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{q.feedback}</p>}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSession(null)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors text-xs"
          >
            Start New Interview Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Active Question Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold rounded-lg font-mono">
              Q{session.currentQuestionIndex + 1} / {session.questions.length}
            </span>
            <span className="text-slate-400 font-medium">[{currentQ.category}]</span>
            <span className="text-slate-500">• {currentQ.difficulty}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => speakText(currentQ.question)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              title="Repeat question audio"
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{currentQ.question}</h2>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Key talking points to cover:</span>
            {currentQ.keyTalkingPoints.map((pt, i) => (
              <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                • {pt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Input Card with Speech Recognition */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Your Verbal or Written Answer</span>
          </label>

          {/* Speech Recognition Toggle */}
          <button
            onClick={toggleListening}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30'
                : 'bg-indigo-950 border border-indigo-800 text-indigo-300 hover:bg-indigo-900'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Recording... (Click to Stop)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-indigo-400" />
                <span>Speak Answer (Web Speech)</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Waveform indicator when recording */}
        {isListening && (
          <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-red-300 font-medium animate-pulse">
              🎙️ Listening to mic input in real-time...
            </span>
            <div className="flex space-x-1">
              <span className="w-1.5 h-4 bg-red-500 rounded animate-bounce delay-75" />
              <span className="w-1.5 h-6 bg-red-400 rounded animate-bounce delay-150" />
              <span className="w-1.5 h-3 bg-red-500 rounded animate-bounce delay-100" />
            </div>
          </div>
        )}

        <textarea
          value={userAnswerText}
          onChange={e => setUserAnswerText(e.target.value)}
          disabled={isEvaluated}
          placeholder="Type or speak your answer here using the mic button above..."
          className="w-full min-h-[160px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-75"
        />

        {!isEvaluated ? (
          <button
            onClick={handleEvaluateAnswer}
            disabled={evaluating || !userAnswerText.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-xs"
          >
            {evaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Response with AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Submit & Evaluate Answer</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <span>
              {session.currentQuestionIndex + 1 < session.questions.length ? 'Proceed to Next Question' : 'View Final Interview Summary'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Evaluation Results Card */}
      {isEvaluated && currentQ.score !== undefined && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>AI Evaluation Feedback</span>
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-slate-400">Score:</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">{currentQ.score}/100</span>
            </div>
          </div>

          {/* Breakdown Scores Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-medium">Technical Depth</span>
              <span className="text-sm font-bold text-indigo-300 font-mono">{currentQ.technicalScore}/100</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-medium">Communication</span>
              <span className="text-sm font-bold text-violet-300 font-mono">{currentQ.communicationScore}/100</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-medium">STAR Format</span>
              <span className="text-sm font-bold text-emerald-300 font-mono">{currentQ.starFormatScore}/100</span>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase">Constructive Feedback</h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              {currentQ.feedback}
            </p>
          </div>

          {/* Model Answer & Better Response Comparison */}
          {currentQ.betterResponseExample && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase">Ideal STAR Response Example</h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-900/60 font-mono">
                {currentQ.betterResponseExample}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
