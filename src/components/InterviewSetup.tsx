'use client';

import React, { useState } from 'react';
import { 
  RoleType, 
  ExperienceLevel, 
  InterviewMode, 
  InterviewConfig 
} from '@/types/interview';
import { ROLE_INFO } from '@/lib/interviewData';
import { 
  Sparkles, 
  Mic, 
  Code2, 
  Users, 
  Building2, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { SpeechEngine } from '@/lib/speech';

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStart }) => {
  const [role, setRole] = useState<RoleType>('frontend');
  const [experience, setExperience] = useState<ExperienceLevel>('mid');
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [candidateName, setCandidateName] = useState<string>('Candidate');
  const [resumeText, setResumeText] = useState<string>('');
  const [mode, setMode] = useState<InterviewMode>('voice');
  const [questionCount, setQuestionCount] = useState<number>(3);
  
  // Microphone test state
  const [micTesting, setMicTesting] = useState(false);
  const [micStatus, setMicStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const testMicrophone = () => {
    if (!SpeechEngine.isSpeechRecognitionSupported()) {
      setMicStatus('failed');
      alert('Speech Recognition is not supported on this browser. We recommend Google Chrome or Microsoft Edge.');
      return;
    }

    setMicTesting(true);
    setMicStatus('testing');

    const recog = SpeechEngine.startListening(
      (transcript) => {
        if (transcript.trim().length > 0) {
          setMicStatus('success');
          SpeechEngine.stopListening(recog);
          setMicTesting(false);
        }
      },
      (err) => {
        console.error('Mic test error:', err);
        setMicStatus('failed');
        setMicTesting(false);
      },
      () => {
        setMicTesting(false);
      }
    );

    // Timeout after 6 seconds
    setTimeout(() => {
      if (micStatus === 'testing') {
        SpeechEngine.stopListening(recog);
        setMicTesting(false);
      }
    }, 6000);
  };

  const handleLaunch = () => {
    const config: InterviewConfig = {
      role,
      experience,
      targetCompany: targetCompany.trim() || 'Top Tech Firm',
      candidateName: candidateName.trim() || 'Candidate',
      resumeText: resumeText.trim(),
      mode,
      questionCount
    };
    onStart(config);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Interview Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Master Your Next Tech Interview
        </h1>
        <p className="mt-2.5 text-base text-slate-400 max-w-2xl mx-auto">
          Practice realistic voice and coding interviews with an intelligent AI interviewer that adapts to your target company, experience level, and resume.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl space-y-8">
        
        {/* Step 1: Select Role */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
            <span>1. Choose Your Target Role</span>
            <span className="text-xs text-slate-400 font-normal">Selected: {ROLE_INFO[role].title}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(ROLE_INFO) as RoleType[]).map((rKey) => {
              const info = ROLE_INFO[rKey];
              const isSelected = role === rKey;
              return (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => setRole(rKey)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-sm flex items-center justify-between">
                    <span>{info.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{info.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Experience & Target Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              2. Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fresher', label: 'Fresher', sub: '0-2 Yrs' },
                { id: 'mid', label: 'Mid-Level', sub: '2-5 Yrs' },
                { id: 'senior', label: 'Senior+', sub: '5+ Yrs' }
              ].map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperience(exp.id as ExperienceLevel)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    experience === exp.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium text-xs">{exp.label}</div>
                  <div className="text-[10px] text-slate-500">{exp.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Target Company (Optional)</span>
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Google, Amazon, Microsoft, Early Startup"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Step 3: Interview Mode & Question Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              3. Interview Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'voice', label: 'Voice Only', icon: Mic },
                { id: 'coding', label: 'Code + Voice', icon: Code2 },
                { id: 'behavioral', label: 'HR / STAR', icon: Users }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as InterviewMode)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 text-white'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 2, label: 'Quick (2 Qs)' },
                { count: 3, label: 'Standard (3 Qs)' },
                { count: 5, label: 'Full (5 Qs)' }
              ].map((q) => (
                <button
                  key={q.count}
                  type="button"
                  onClick={() => setQuestionCount(q.count)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    questionCount === q.count
                      ? 'border-cyan-500 bg-cyan-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-medium">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Resume or Key Skills (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Resume Summary or Key Projects (Optional)</span>
            </span>
            <span className="text-xs text-slate-500">AI will tailor questions to your projects</span>
          </label>
          <textarea
            rows={3}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your key skills, tech stack, or recent project overview here (e.g., 'Built an e-commerce platform using Next.js, Redux, PostgreSQL and AWS with 10k MAU')..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        {/* Hardware / Mic Quick Check */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Microphone & Audio Check</div>
              <p className="text-[11px] text-slate-400">
                {micStatus === 'idle' && 'Click test to verify speech recognition before starting.'}
                {micStatus === 'testing' && 'Listening... Please speak something out loud.'}
                {micStatus === 'success' && '✅ Voice detected successfully! Audio is ready.'}
                {micStatus === 'failed' && '⚠️ Mic access failed or browser unsupported. You can still type answers.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={testMicrophone}
            disabled={micTesting}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all self-end sm:self-center"
          >
            {micTesting ? 'Listening...' : 'Test Mic'}
          </button>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:to-indigo-600 text-white font-bold text-base shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
          >
            <span>Launch Mock Interview</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
