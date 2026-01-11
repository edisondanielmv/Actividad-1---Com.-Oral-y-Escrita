
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
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
      
      {/* Header: Categoría e Instrucciones */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${getCategoryStyles(question.category)}`}>
            {getCategoryIcon(question.category)}
            <span>{question.category}</span>
        </div>
        {question.instruction && (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 italic">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
             {question.instruction}
          </div>
        )}
      </div>

      {/* Pregunta Principal - Tamaño normalizado */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug mb-4 text-balance">
          {question.questionText}
        </h2>
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-100 uppercase tracking-wide">
                Valor: {question.points} {question.points === 1 ? 'punto' : 'puntos'}
            </span>
            <div className="h-px w-8 bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Pregunta {questionIndex + 1} de {totalQuestions}
            </span>
        </div>
      </div>

      {/* Área de Respuesta */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {question.type === QuestionType.MULTIPLE_CHOICE && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = currentAnswer === option;
              return (
                <label 
                  key={idx} 
                  className={`group relative flex items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/30 ring-1 ring-teal-500' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="h-4 w-4 text-teal-700 border-slate-300 focus:ring-teal-500 focus:ring-offset-0"
                    />
                  </div>
                  <div className={`ml-3 text-base leading-relaxed ${isSelected ? 'text-teal-900 font-semibold' : 'text-slate-600 font-medium'}`}>
                    {option}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="relative group">
            <textarea
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-800 bg-slate-50 placeholder-slate-400 text-base leading-relaxed min-h-[200px] resize-y font-sans"
              placeholder="Escriba su respuesta aquí..."
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white border ${currentAnswer.length > 50 ? 'text-teal-600 border-teal-100' : 'text-slate-300 border-slate-100'}`}>
                {currentAnswer.split(/\s+/).filter(word => word.length > 0).length} PALABRAS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Informativo */}
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 items-start">
          <div className="mt-0.5">
             <Info className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-700">Criterio:</span> La IA evalúa la precisión, el uso de normas y el registro académico formal.
          </p>
      </div>
    </div>
  );
};

export default QuestionCard;
