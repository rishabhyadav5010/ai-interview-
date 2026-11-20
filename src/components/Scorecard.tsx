'use client';

import React, { useEffect, useState } from 'react';
import { InterviewConfig, InterviewScorecard } from '@/types/interview';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  MessageSquare,
  Code2
} from 'lucide-react';

interface ScorecardProps {
  scorecard: InterviewScorecard;
  config: InterviewConfig;
  onRetake: () => void;
}

export const Scorecard: React.FC<ScorecardProps> = ({
  scorecard,
  config,
  onRetake
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignored if confetti fails
    }
  }, []);

  const getVerdictColor = (verdict: InterviewScorecard['verdict']) => {
    switch (verdict) {
      case 'STRONG HIRE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'HIRE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'LEANING HIRE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          Evaluation Complete
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Interview Performance Scorecard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed assessment for <span className="text-slate-200 font-semibold">{config.candidateName}</span> · {config.role} ({config.experience}) at {config.targetCompany}
        </p>
      </div>

      {/* Main Score & Verdict Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          {/* Big Score Display */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex flex-col items-center justify-center text-white shadow-xl shadow-cyan-500/20">
              <span className="text-3xl font-black">{scorecard.overallScore}</span>
              <span className="text-[10px] font-semibold tracking-wider text-cyan-100 uppercase">out of 100</span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-lg border text-xs font-bold tracking-wide uppercase ${getVerdictColor(scorecard.verdict)}`}>
                {scorecard.verdict}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                {scorecard.overallScore >= 75 ? 'Outstanding Performance!' : 'Solid Effort with Scope to Grow'}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mt-0.5">
                {scorecard.summary}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onRetake}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Interview</span>
            </button>
          </div>

        </div>

        {/* 4 Dimension Metrics Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {[
            { label: 'Technical Depth', score: scorecard.technicalScore, color: 'bg-cyan-500' },
            { label: 'Communication Clarity', score: scorecard.communicationScore, color: 'bg-indigo-500' },
            { label: 'Problem-Solving', score: scorecard.problemSolvingScore, color: 'bg-emerald-500' },
            { label: 'Confidence & Delivery', score: scorecard.confidenceScore, color: 'bg-purple-500' }
          ].map((metric, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-medium">{metric.label}</span>
                <span className="font-bold text-white">{metric.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${metric.color} transition-all duration-1000`} 
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Strengths & Weaknesses Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Strengths Observed</span>
          </div>
          <ul className="space-y-2">
            {scorecard.strengths.map((str, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Target Areas for Improvement</span>
          </div>
          <ul className="space-y-2">
            {scorecard.areasToImprove.map((imp, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Question-by-Question Deep Dive (Accordion) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Question-by-Question Detailed Feedback</span>
        </h3>

        <div className="space-y-3">
          {scorecard.questionsEvaluation.map((qEval, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden transition-colors"
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-1">
                      {qEval.questionText}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {qEval.score}/100
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 space-y-4 text-xs bg-slate-900/30">
                    
                    {/* Candidate's answer */}
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        Your Spoken Answer:
                      </span>
                      <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 italic leading-relaxed">
                        "{qEval.candidateAnswer}"
                      </p>
                    </div>

                    {/* Candidate's code (if submitted) */}
                    {qEval.submittedCode && (
                      <div>
                        <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                          Your Code Submission:
                        </span>
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-emerald-400 overflow-x-auto text-[11px]">
                          {qEval.submittedCode}
                        </pre>
                      </div>
                    )}

                    {/* AI Critique */}
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">
                        AI Interviewer Critique:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {qEval.critique}
                      </p>
                    </div>

                    {/* Ideal Model Answer */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                      <span className="text-cyan-400 font-semibold block mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ideal Model Answer (Benchmark):
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {qEval.idealAnswer}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
