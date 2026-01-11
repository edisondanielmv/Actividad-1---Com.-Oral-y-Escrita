
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
      const mainContent = document.getElementById('main-exam-content');
      if (mainContent) mainContent.scrollTop = 0;
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const mainContent = document.getElementById('main-exam-content');
      if (mainContent) mainContent.scrollTop = 0;
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  
  if (!questions || questions.length === 0) {
      return (
          <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-gray-600 text-sm font-medium">Cargando evaluación...</p>
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
              <h2 className="text-lg font-bold text-slate-900 mb-2">¿Finalizar Evaluación?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Has completado <strong className="text-teal-700">{answeredCount}</strong> de <strong className="text-slate-800">{totalCount}</strong> preguntas.
                {answeredCount < totalCount && (
                  <span className="block mt-2 text-rose-500 font-medium">
                    Se asignará 0 puntos a las preguntas vacías.
                  </span>
                )}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowFinishModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm border border-slate-200"
                >
                  Volver
                </button>
                <button 
                  onClick={submitExamNow}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-md transition-all text-sm"
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
             <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-slate-900 p-1.5 rounded-lg">
                   <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-base font-bold text-slate-800 tracking-tight hidden sm:block">Evaluación Académica</h1>
                <h1 className="text-sm font-bold text-slate-800 tracking-tight sm:hidden">Evaluación</h1>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-xs font-semibold text-slate-500">
                Sesión: <span className="text-slate-900 font-bold uppercase">{user.fullName.split(' ')[0]}</span>
             </div>
             <button
               type="button"
               onClick={() => setShowFinishModal(true)}
               disabled={isSubmitting}
               className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm disabled:opacity-50"
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
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navegación</span>
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
                          const mainContent = document.getElementById('main-exam-content');
                          if (mainContent) mainContent.scrollTop = 0;
                        }}
                        className={`
                          h-10 rounded-lg text-sm font-bold transition-all border
                          ${isCurrent 
                              ? 'bg-slate-800 text-white border-slate-900 shadow-md' 
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
               <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                 <span>Progreso</span>
                 <span>{Math.round((answeredCount / totalCount) * 100)}%</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-2">
                 <div 
                   className="bg-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
                   style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                 ></div>
               </div>
             </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-slate-900/20 z-10 lg:hidden backdrop-blur-[1px]"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main id="main-exam-content" className="flex-1 overflow-y-auto bg-slate-50 prose-scroll relative scroll-smooth">
          <div className="max-w-4xl mx-auto p-4 sm:p-8 min-h-full flex flex-col">
            
            {isReadingSection && currentTextObj && (
              <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 text-slate-700 px-6 py-3 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs uppercase tracking-wider">Lectura de Comprensión</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 max-h-[40vh] overflow-y-auto prose-scroll">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">{currentTextObj.title}</h3>
                  <div className="text-slate-700 text-base leading-relaxed font-serif whitespace-pre-line">
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

            <div className="mt-8 flex justify-between items-center pt-8 border-t border-slate-200">
               <button
                 onClick={prevQuestion}
                 disabled={currentQuestionIndex === 0}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm
                   ${currentQuestionIndex === 0 
                      ? 'text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed' 
                      : 'text-slate-600 hover:bg-white hover:shadow-sm bg-white border border-slate-200'}`}
               >
                 <ChevronLeft className="w-4 h-4" />
                 <span>Anterior</span>
               </button>

               {currentQuestionIndex < questions.length - 1 ? (
                 <button
                   onClick={nextQuestion}
                   className="flex items-center gap-2 px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold shadow-md transition-all text-sm"
                 >
                   <span>Siguiente</span>
                   <ChevronRight className="w-4 h-4" />
                 </button>
               ) : (
                 <button
                    onClick={() => setShowFinishModal(true)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold shadow-md transition-all text-sm uppercase tracking-wide"
                 >
                    Finalizar
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
