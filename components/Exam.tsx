import React, { useState } from 'react';
import { User, Question, Answer } from '../types';
import QuestionCard from './QuestionCard';
import { EXAM_TEXTS } from '../data';
import { Loader2, ChevronLeft, ChevronRight, Menu, X, BookOpen, CheckCircle } from 'lucide-react';

interface ExamProps {
  user: User;
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
  isSubmitting: boolean;
}

const Exam: React.FC<ExamProps> = ({ user, questions, onSubmit, isSubmitting }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  const isReadingSection = !!currentQuestion?.textId && currentQuestion.textId !== 0;
  const currentTextObj = isReadingSection 
    ? EXAM_TEXTS.find(t => t.id === currentQuestion!.textId) 
    : null;

  const handleAnswerChange = (val: string) => {
    if (currentQuestion) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    }
  };

  const submitExamNow = () => {
    const formattedAnswers: Answer[] = questions.map(q => ({
      questionId: q.id,
      value: answers[q.id] || '' 
    }));
    setShowFinishModal(false);
    onSubmit(formattedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  
  if (!questions || questions.length === 0) {
      return (
          <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-gray-600">Cargando evaluación...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden relative text-slate-800">
      
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">¿Finalizar Evaluación?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Has completado <strong className="text-teal-700">{answeredCount}</strong> de <strong className="text-slate-800">{totalCount}</strong> preguntas.
                {answeredCount < totalCount && (
                  <span className="block mt-2 text-rose-500 font-medium">
                    Las preguntas no contestadas se calificarán con 0 puntos.
                  </span>
                )}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm border border-slate-200"
                >
                  Continuar
                </button>
                <button 
                  onClick={submitExamNow}
                  className="flex-1 px-4 py-2.5 bg-accent hover:bg-teal-700 text-white font-bold rounded-lg shadow-md transition-all text-sm"
                >
                  Entregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 z-30 h-16 flex-shrink-0 shadow-sm">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors">
                <Menu className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3">
                <div className="bg-accent p-1.5 rounded-lg shadow-sm">
                   <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-base lg:text-lg font-bold text-slate-800 tracking-tight hidden sm:block">Evaluación Académica Profesional</h1>
                <h1 className="text-base font-bold text-slate-800 tracking-tight sm:hidden">Evaluación</h1>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-semibold text-slate-500">
                Sesión: <span className="text-slate-800 uppercase tracking-tighter">{user.fullName.split(' ')[0]}</span>
             </div>
             <button
               type="button"
               onClick={() => setShowFinishModal(true)}
               disabled={isSubmitting}
               className="bg-accent hover:bg-teal-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all shadow-sm disabled:opacity-50 transform active:scale-95"
             >
               Finalizar
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`
            absolute lg:static top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-20 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Navegación</span>
               <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-2 prose-scroll">
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          setSidebarOpen(false);
                        }}
                        className={`
                          h-10 rounded-lg text-xs font-bold transition-all border
                          ${isCurrent 
                              ? 'bg-accent text-white border-teal-600 shadow-md ring-2 ring-teal-100' 
                              : isAnswered 
                                  ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' 
                                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}
                        `}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className="p-5 border-t border-slate-200 bg-slate-50">
               <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">
                 <span>Progreso Total</span>
                 <span>{Math.round((answeredCount / totalCount) * 100)}%</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
                 <div 
                   className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                   style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                 ></div>
               </div>
             </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-slate-900/30 z-10 lg:hidden backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 overflow-y-auto bg-slate-50/50 prose-scroll relative">
          <div className="max-w-4xl mx-auto p-4 md:p-10 min-h-full flex flex-col">
            
            {isReadingSection && currentTextObj && (
              <div className="mb-10 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-slate-300">Lectura de Comprensión</span>
                  </div>
                  <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-400 font-mono">Ref. {currentTextObj.id}</span>
                </div>
                <div className="p-8 md:p-10 max-h-[50vh] overflow-y-auto prose-scroll bg-white">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif leading-tight">{currentTextObj.title}</h3>
                  <div className="prose prose-slate max-w-none text-slate-700 text-lg leading-relaxed font-serif whitespace-pre-line border-l-4 border-teal-50 pl-6">
                    {currentTextObj.content}
                  </div>
                </div>
              </div>
            )}

            {currentQuestion && (
                <div className="flex-1">
                    <QuestionCard
                        question={currentQuestion}
                        currentAnswer={answers[currentQuestion.id] || ''}
                        onAnswerChange={handleAnswerChange}
                        questionIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                    />
                </div>
            )}

            <div className="mt-10 flex justify-between items-center pt-8 border-t border-slate-200">
               <button
                 onClick={prevQuestion}
                 disabled={currentQuestionIndex === 0}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm
                   ${currentQuestionIndex === 0 
                      ? 'text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed' 
                      : 'text-slate-600 hover:bg-white hover:shadow-md bg-white border border-slate-200 active:scale-95'}`}
               >
                 <ChevronLeft className="w-5 h-5" />
                 Anterior
               </button>

               {currentQuestionIndex < questions.length - 1 ? (
                 <button
                   onClick={nextQuestion}
                   className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-teal-700 text-white rounded-xl font-bold shadow-md transition-all transform active:scale-95 text-sm"
                 >
                   Siguiente
                   <ChevronRight className="w-5 h-5" />
                 </button>
               ) : (
                 <button
                    onClick={() => setShowFinishModal(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-black shadow-lg transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                 >
                    Finalizar Evaluación
                 </button>
               )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exam;