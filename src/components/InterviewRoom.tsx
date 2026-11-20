'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  InterviewConfig, 
  InterviewQuestion, 
  CandidateAnswer 
} from '@/types/interview';
import { SpeechEngine } from '@/lib/speech';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  Code2, 
  Send, 
  CheckCircle, 
  Clock, 
  Play, 
  FileCode,
  RotateCw,
  Sparkles,
  Bot
} from 'lucide-react';

interface InterviewRoomProps {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  onFinish: (answers: CandidateAnswer[]) => void;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  questions,
  onFinish,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);
  
  // Current question states
  const currentQ = questions[currentIndex] || questions[0];
  const [spokenText, setSpokenText] = useState('');
  const [codeContent, setCodeContent] = useState(currentQ.starterCode || '');
  const [activeTab, setActiveTab] = useState<'answer' | 'code'>(
    config.mode === 'coding' ? 'code' : 'answer'
  );

  // Audio / Speech states
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Timer states
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Refs
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Check speech support on mount
  useEffect(() => {
    setSpeechSupported(SpeechEngine.isSpeechRecognitionSupported());
  }, []);

  // Sync starter code when question changes
  useEffect(() => {
    if (currentQ?.starterCode) {
      setCodeContent(currentQ.starterCode);
    } else {
      setCodeContent('');
    }
    setSpokenText('');
    setQuestionStartTime(Date.now());

    // Automatically speak the question via AI
    handleSpeakQuestion(currentQ?.question);
  }, [currentIndex, currentQ]);

  // Overall Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Webcam Handler
  const toggleCamera = async () => {
    if (isCameraOn) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.warn('Camera permission denied or unavailable:', err);
        alert('Could not access webcam. You can continue interview with voice only.');
      }
    }
  };

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      SpeechEngine.stopSpeaking();
      if (recognitionRef.current) {
        SpeechEngine.stopListening(recognitionRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Text to Speech for question
  const handleSpeakQuestion = (text: string) => {
    if (!text) return;
    setIsAiSpeaking(true);
    SpeechEngine.speak(
      text,
      () => setIsAiSpeaking(true),
      () => setIsAiSpeaking(false)
    );
  };

  // Speech to Text candidate input
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        SpeechEngine.stopListening(recognitionRef.current);
        recognitionRef.current = null;
      }
      setIsListening(false);
    } else {
      // Stop AI voice if speaking
      SpeechEngine.stopSpeaking();
      setIsAiSpeaking(false);

      const recog = SpeechEngine.startListening(
        (transcript) => {
          setSpokenText((prev) => (prev ? prev + ' ' + transcript : transcript));
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (recog) {
        recognitionRef.current = recog;
        setIsListening(true);
      }
    }
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Next Question or Submit
  const handleNext = () => {
    // Stop recording and speech
    if (recognitionRef.current) {
      SpeechEngine.stopListening(recognitionRef.current);
      setIsListening(false);
    }
    SpeechEngine.stopSpeaking();

    const timeSpentOnQ = Math.round((Date.now() - questionStartTime) / 1000);

    const newAnswer: CandidateAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      spokenAnswer: spokenText.trim(),
      submittedCode: config.mode === 'coding' ? codeContent : undefined,
      timeSpentSeconds: timeSpentOnQ
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finish interview
      onFinish(updatedAnswers);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Navigation & Status Bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            Q{currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentQ.category}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Role: <strong className="text-slate-300">{config.role}</strong> ({config.experience})
            </span>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(timeSpent)}</span>
        </div>

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          End Interview
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Interviewer Persona & Question Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* AI Avatar Tile */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6 flex flex-col items-center justify-center text-center shadow-xl">
            {/* Glowing background halo */}
            <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

            {/* AI Avatar Visualizer */}
            <div className="relative my-4">
              <div 
                className={`w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isAiSpeaking ? 'scale-110 shadow-cyan-500/50 ring-4 ring-cyan-400/40' : 'shadow-indigo-500/20'
                }`}
              >
                <Bot className="w-14 h-14 text-white" />
              </div>

              {/* Pulsing Audio Waves when AI is speaking */}
              {isAiSpeaking && (
                <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/60 animate-ping pointer-events-none" />
              )}
            </div>

            <h3 className="font-bold text-base text-white">Alex · Principal Interviewer</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Company: <span className="text-cyan-400 font-medium">{config.targetCompany}</span>
            </p>

            {/* Speaking Status Badge */}
            <div className="mt-3 flex items-center gap-2">
              {isAiSpeaking ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  Speaking question...
                </span>
              ) : isListening ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Listening to your answer...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                  Waiting for your answer
                </span>
              )}

              <button
                type="button"
                onClick={() => handleSpeakQuestion(currentQ.question)}
                title="Repeat question"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Current Question Text Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Question Prompt
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  currentQ.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                  currentQ.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>
              <p className="text-base text-slate-100 font-medium leading-relaxed">
                "{currentQ.question}"
              </p>
            </div>

            {/* Expected areas preview */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Key evaluation criteria:
              </span>
              <ul className="space-y-1">
                {currentQ.expectedKeyPoints.slice(0, 2).map((kp, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Column: Candidate Live Workspace (Webcam / Speech / Code Editor) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Top Tabs & Webcam Banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('answer')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'answer'
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎙️ Verbal Answer Transcript
              </button>

              {config.mode === 'coding' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'code'
                      ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code Workspace
                </button>
              )}
            </div>

            {/* Webcam Toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCamera}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                  isCameraOn
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isCameraOn ? 'Cam ON' : 'Cam OFF'}</span>
              </button>
            </div>
          </div>

          {/* Video Preview Picture-in-Picture (If enabled) */}
          {isCameraOn && (
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Candidate Stream
              </div>
            </div>
          )}

          {/* Active Workspace View: Verbal Answer vs Code Editor */}
          {activeTab === 'answer' ? (
            <div className="flex-1 min-h-[300px] rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300">Live Voice Transcript</span>
                    {isListening && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Listening... Speak clearly
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSpokenText('')}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear text
                  </button>
                </div>

                {/* Editable Transcript Textarea */}
                <textarea
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to you speak in real-time... (your words will appear here automatically)'
                      : 'Click the "Speak Answer" mic button below to speak, or type your answer directly here...'
                  }
                  className="w-full h-56 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Speech recognition hint */}
              {!speechSupported && (
                <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  Speech recognition is not supported in this browser. Please type your answer above or switch to Google Chrome / Edge.
                </div>
              )}
            </div>
          ) : (
            /* Code Editor Tab */
            <div className="flex-1 min-h-[300px] rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  Code Solution (TypeScript / JS)
                </span>
                <span className="text-[11px] text-slate-500">Live editor</span>
              </div>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="// Write your code solution here..."
                className="w-full h-64 p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 placeholder-slate-600 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

          {/* Bottom Action Controls Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Microphone Toggle Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 animate-pulse'
                    : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Stop Speaking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>Speak Answer (Mic)</span>
                  </>
                )}
              </button>

              {spokenText && (
                <span className="text-xs text-slate-400 hidden md:inline">
                  {spokenText.trim().split(/\s+/).filter(Boolean).length} words recorded
                </span>
              )}
            </div>

            {/* Next / Submit Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{isLastQuestion ? 'Complete Interview & View Scorecard' : 'Submit & Next Question'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
