export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  OPEN_TEXT = 'OPEN_TEXT'
}

export interface TextContext {
  id: number;
  title: string;
  content: string;
}

export interface Question {
  id: number;
  category: string;
  instruction?: string;
  textId?: number; 
  questionText: string;
  type: QuestionType;
  options?: string[];
  correctOptionIndex?: number;
  expectedAnswer?: string;
  points: number;
}

export interface User {
  fullName: string;
  cedula: string;
  carrera: string;
  apiKey?: string;
}

export interface Answer {
  questionId: number;
  value: string;
}

export interface AIAnalysis {
  questionId: number;
  score: number;
  feedback: string;
  aiDetected?: boolean; // Nuevo campo para detección de IA externa
}

export interface ExamResult {
  totalScore: number;
  maxScore: number;
  details: {
    questionId: number;
    userAnswer: string;
    isCorrect?: boolean;
    aiAnalysis?: AIAnalysis;
    pointsEarned: number;
    maxPoints: number;
  }[];
}