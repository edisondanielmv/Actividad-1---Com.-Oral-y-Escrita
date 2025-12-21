import React, { useState } from 'react';
import Login from './components/Login';
import Exam from './components/Exam';
import Results from './components/Results';
import { User, Answer, ExamResult, QuestionType, Question } from './types';
import { QUESTIONS, EXAM_TEXTS, TOTAL_QUESTIONS_TO_SHOW } from './data';
import { evaluateOpenAnswer, reformulateExam } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleLogin = async (userData: User) => {
    setIsGenerating(true);
    setUser(userData); 
    
    try {
      const shuffledPool = shuffleArray(QUESTIONS);
      const selectedQuestions = shuffledPool.slice(0, TOTAL_QUESTIONS_TO_SHOW);
      const uniqueExam = await reformulateExam(selectedQuestions, userData.fullName, userData.apiKey);
      setExamQuestions(uniqueExam);
    } catch (error) {
      setExamQuestions(shuffleArray(QUESTIONS).slice(0, TOTAL_QUESTIONS_TO_SHOW));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestart = () => {
    setUser(null);
    setExamQuestions([]);
    setExamResult(null);
    setIsSubmitting(false);
    setIsGenerating(false);
    setGradingProgress(0);
  };

  const gradeSingleQuestion = async (question: Question, answerValue: string) => {
    const safeResponse = {
        questionId: question.id,
        userAnswer: answerValue || '',
        isCorrect: false,
        pointsEarned: 0,
        maxPoints: question.points,
        aiAnalysis: undefined as any
    };

    try {
        if (question.type === QuestionType.MULTIPLE_CHOICE) {
            if (question.options && typeof question.correctOptionIndex === 'number') {
                const safeIndex = Math.min(Math.max(0, question.correctOptionIndex), question.options.length - 1);
                const correctText = question.options[safeIndex];
                if (correctText && answerValue && answerValue.trim().toLowerCase() === correctText.trim().toLowerCase()) {
                    safeResponse.pointsEarned = question.points;
                    safeResponse.isCorrect = true;
                }
            }
        } else {
            if (!answerValue || answerValue.trim().length === 0) {
                 safeResponse.pointsEarned = 0;
                 safeResponse.aiAnalysis = {
                    questionId: question.id,
                    score: 0,
                    feedback: "Pregunta sin responder (0 puntos)."
                 };
                 return safeResponse;
            }
            const contextText = EXAM_TEXTS.find(t => t.id === question.textId);
            const result = await evaluateOpenAnswer(question, answerValue, contextText, user?.apiKey);
            safeResponse.aiAnalysis = result;
            safeResponse.pointsEarned = result.score;
        }
        return safeResponse;
    } catch (e) {
        safeResponse.aiAnalysis = { questionId: question.id, score: 0, feedback: "Error de evaluación." };
        return safeResponse;
    }
  };

  const handleExamSubmit = async (answers: Answer[]) => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    setGradingProgress(0);
    const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
    const allDetails: any[] = [];
    
    try {
      for (let i = 0; i < examQuestions.length; i++) {
         const q = examQuestions[i];
         const ans = answers.find(a => a.questionId === q.id)?.value || '';
         const res = await gradeSingleQuestion(q, ans);
         allDetails.push(res);
         setGradingProgress(Math.round(((i + 1) / examQuestions.length) * 100));
         await new Promise(r => setTimeout(r, 800));
      }
      setExamResult({ totalScore: allDetails.reduce((sum, d) => sum + d.pointsEarned, 0), maxScore, details: allDetails });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full text-center border border-slate-100">
          <Loader2 className="h-14 w-14 text-teal-600 animate-spin mb-6" />
          <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Preparando Evaluación</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Configurando 20 ejercicios académicos personalizados para tu perfil...</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full text-center border border-slate-100">
          <Loader2 className="h-16 w-16 text-teal-700 animate-spin mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">Calificación en Proceso</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Analizando estructura lingüística y normas APA ({gradingProgress}%)...</p>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
             <div className="bg-teal-600 h-full transition-all duration-500 ease-out" style={{ width: `${gradingProgress}%` }}></div>
          </div>
        </div>
      </div>
     );
  }

  if (examResult) return <Results result={examResult} user={user} onRestart={handleRestart} />;

  return <Exam user={user} questions={examQuestions} onSubmit={handleExamSubmit} isSubmitting={isSubmitting} />;
};

export default App;