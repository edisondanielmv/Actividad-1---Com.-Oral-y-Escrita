import React from 'react';
import { Question, QuestionType } from '../types';
import { FileText, CheckCircle, Info, Edit3, ShieldAlert, GraduationCap } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentAnswer: string;
  onAnswerChange: (val: string) => void;
  questionIndex: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  questionIndex,
  totalQuestions
}) => {
  
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'Síntesis': return <FileText className="w-4 h-4" />;
      case 'Paráfrasis': return <Edit3 className="w-4 h-4" />;
      case 'Normas APA': return <ShieldAlert className="w-4 h-4" />;
      case 'Texto Crítico': return <CheckCircle className="w-4 h-4" />;
      case 'Redacción Administrativa': return <GraduationCap className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryStyles = (cat: string) => {
    switch(cat) {
      case 'Normas APA': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Paráfrasis': return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'Síntesis': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Texto Crítico': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getCategoryStyles(question.category)}`}>
            {getCategoryIcon(question.category)}
            <span>{question.category}</span>
        </div>
        {question.instruction && (
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 italic">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
             {question.instruction}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-5 tracking-tight">
          {question.questionText}
        </h2>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-lg border border-teal-100 uppercase tracking-tighter">
                Valor: {question.points} {question.points === 1 ? 'punto' : 'puntos'}
            </span>
            <div className="h-px w-8 bg-slate-200"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                {questionIndex + 1} de {totalQuestions}
            </span>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/40">
        {question.type === QuestionType.MULTIPLE_CHOICE && question.options ? (
          <div className="space-y-4">
            {question.options.map((option, idx) => {
              const isSelected = currentAnswer === option;
              return (
                <label 
                  key={idx} 
                  className={`group relative flex items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/20' 
                      : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center h-6 mt-0.5">
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="h-5 w-5 text-teal-700 border-slate-300 focus:ring-teal-500 focus:ring-offset-0"
                    />
                  </div>
                  <div className={`ml-5 text-lg leading-relaxed transition-colors ${isSelected ? 'text-teal-900 font-bold' : 'text-slate-600 font-medium'}`}>
                    {option}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="relative group">
            <textarea
              className="w-full p-8 border-2 border-slate-50 rounded-2xl focus:ring-0 focus:border-teal-500 transition-all text-slate-800 bg-slate-50/30 placeholder-slate-400 text-lg leading-relaxed min-h-[250px] resize-y font-sans shadow-inner"
              placeholder="Desarrolle su respuesta utilizando un registro académico pertinente..."
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
            <div className="absolute bottom-5 right-6 flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white shadow-sm border ${currentAnswer.length > 50 ? 'text-teal-600 border-teal-100' : 'text-slate-300 border-slate-100'}`}>
                {currentAnswer.split(/\s+/).filter(word => word.length > 0).length} PALABRAS
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-5 bg-slate-900 text-slate-300 rounded-2xl flex gap-4 items-start shadow-xl">
          <div className="mt-1 bg-teal-500/20 p-2 rounded-xl">
             <Info className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xs leading-relaxed">
            <strong className="text-white uppercase tracking-wider block mb-1">Criterio de Evaluación:</strong>
            Las respuestas abiertas son analizadas por un modelo lingüístico avanzado que prioriza la precisión conceptual, el rigor sintáctico y la adecuación al registro universitario.
          </div>
      </div>
    </div>
  );
};

export default QuestionCard;