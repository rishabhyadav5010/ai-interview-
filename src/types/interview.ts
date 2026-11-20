export type RoleType = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'data-science' 
  | 'devops' 
  | 'product-manager' 
  | 'hr-behavioral';

export type ExperienceLevel = 'fresher' | 'mid' | 'senior';

export type InterviewMode = 'voice' | 'coding' | 'behavioral';

export interface InterviewConfig {
  role: RoleType;
  experience: ExperienceLevel;
  targetCompany: string;
  candidateName: string;
  resumeText: string;
  mode: InterviewMode;
  questionCount: number;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode?: string;
  expectedKeyPoints: string[];
  idealAnswer: string;
}

export interface CandidateAnswer {
  questionId: number;
  questionText: string;
  spokenAnswer: string;
  submittedCode?: string;
  timeSpentSeconds: number;
}

export interface QuestionEvaluation {
  questionId: number;
  questionText: string;
  candidateAnswer: string;
  submittedCode?: string;
  score: number; // 0 - 100
  critique: string;
  idealAnswer: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewScorecard {
  overallScore: number; // 0 - 100
  verdict: 'STRONG HIRE' | 'HIRE' | 'LEANING HIRE' | 'NEEDS IMPROVEMENT';
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  areasToImprove: string[];
  questionsEvaluation: QuestionEvaluation[];
  summary: string;
}
