export type UserRole = 'student' | 'faculty';

export interface StudentProfile {
  registerNumber: string;
  name: string;
  department: string;
  mobile: string;
  attendance: number;
  internalMarks: number;
  assignmentScore: number;
  studyHours: number;
  resumeUrl?: string;
  resumeName?: string;
  email?: string;
  bio?: string;
  targetCareer?: string;
  skills?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  semester?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export type PerformanceLevel = 'Excellent' | 'Good' | 'Average' | 'Poor';
export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';
export type MotivationLevel = 'Highly Motivated' | 'Moderately Motivated' | 'Low Motivation';

export interface PredictionResult {
  passStatus: 'Pass' | 'Fail';
  isExamPending?: boolean;
  overallPercentage: number;
  performanceLevel: PerformanceLevel;
  riskLevel: RiskLevel;
  riskReasons: string[];
  motivationScore: number;
  motivationLevel: MotivationLevel;
  accuracy: number;
  suggestions: {
    title: string;
    target: string;
    description: string;
  }[];
  features: {
    name: string;
    value: number;
    contribution: number;
    importance: number;
  }[];
  peerComparison: {
    student: number;
    average: number;
    category: 'Top' | 'Middle' | 'Bottom';
  };
  timeline: {
    period: string;
    score: number;
  }[];
}

export interface FacultyStats {
  totalStudents: number;
  passRate: number;
  averageScore: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  performanceDistribution: Record<PerformanceLevel, number>;
}

export interface AuthState {
  user: StudentProfile | { role: 'faculty' } | null;
  role: UserRole | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface PersonalizedRecommendations {
  studyPlan: {
    week: string;
    focusTopic: string;
    suggestedHours: number;
    tasks: string[];
  }[];
  learningResources: {
    title: string;
    type: 'Video' | 'Article' | 'Book' | 'Interactive Course';
    topic: string;
    searchQuery: string;
    description: string;
  }[];
  improvementStrategies: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    impact: 'High' | 'Medium' | 'Low';
    actionableStep: string;
    milestone: string;
  }[];
  aiAnalysis: {
    strengths: string[];
    weaknesses: string[];
    summary: string;
  };
  futureAcademicVideos?: {
    title: string;
    topic: string;
    platform: string;
    searchQuery: string;
    semesterTarget: string;
    whyRecommended: string;
  }[];
}

