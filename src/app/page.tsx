'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { InterviewSetup } from '@/components/InterviewSetup';
import { InterviewRoom } from '@/components/InterviewRoom';
import { Scorecard } from '@/components/Scorecard';
import { 
  InterviewConfig, 
  InterviewQuestion, 
  CandidateAnswer, 
  InterviewScorecard 
} from '@/types/interview';
import { getInterviewQuestions } from '@/lib/interviewData';
import { Loader2, Sparkles, Brain } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'setup' | 'interview' | 'evaluating' | 'scorecard'>('setup');
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [scorecard, setScorecard] = useState<InterviewScorecard | null>(null);

  // Start interview from setup screen
  const handleStartInterview = (newConfig: InterviewConfig) => {
    setConfig(newConfig);
    const generatedQuestions = getInterviewQuestions(newConfig);
    setQuestions(generatedQuestions);
    setView('interview');
  };

  // When interview finishes, evaluate answers via API
  const handleFinishInterview = async (answers: CandidateAnswer[]) => {
    setView('evaluating');

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          answers
        })
      });

      if (!res.ok) {
        throw new Error('Evaluation request failed');
      }

      const data: InterviewScorecard = await res.json();
      setScorecard(data);
      setView('scorecard');
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Could not complete automated scoring. Showing session overview.');
      setView('setup');
    }
  };

  // Reset to setup
  const handleReset = () => {
    setView('setup');
    setScorecard(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Navbar (Persistent on Setup and Scorecard, hidden in Live Room for immersion) */}
      {view !== 'interview' && (
        <Navbar 
          onReset={view !== 'setup' ? handleReset : undefined} 
          statusText={view === 'evaluating' ? 'Scoring Answers...' : undefined}
        />
      )}

      {/* Main Dynamic View */}
      <main className="flex-1">
        {view === 'setup' && (
          <InterviewSetup onStart={handleStartInterview} />
        )}

        {view === 'interview' && config && (
          <InterviewRoom
            config={config}
            questions={questions}
            onFinish={handleFinishInterview}
            onExit={handleReset}
          />
        )}

        {view === 'evaluating' && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/10">
              <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span>AI Hiring Lead is Analyzing Your Interview</span>
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            </h2>
            <p className="text-sm text-slate-400 max-w-md">
              Evaluating speech clarity, technical depth, problem-solving structure, and preparing a personalized scorecard...
            </p>
          </div>
        )}

        {view === 'scorecard' && scorecard && config && (
          <Scorecard
            scorecard={scorecard}
            config={config}
            onRetake={handleReset}
          />
        )}
      </main>

      {/* Subtle Footer on Setup & Scorecard */}
      {view !== 'interview' && (
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <p>© 2026 PrepAI · Built for collaborative AI interview preparation.</p>
        </footer>
      )}

    </div>
  );
}
