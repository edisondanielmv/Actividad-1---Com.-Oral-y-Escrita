
import React, { useEffect, useState } from 'react';
import { ExamResult, User } from '../types';
import { AlertTriangle, Check, Code, LogOut, UserCircle, Briefcase, CreditCard, Loader2, ShieldAlert } from 'lucide-react';

interface ResultsProps {
  result: ExamResult;
  user: User;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, user, onRestart }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const rawPercentage = result.maxScore > 0 ? (result.totalScore / result.maxScore) : 0;
  const gradeOver20 = rawPercentage * 20;
  
  const aiDetectedCount = result.details.filter(d => d.aiAnalysis?.aiDetected).length;

  let gradeColor = 'text-rose-600';
  let accentBar = 'bg-rose-500';

  if (gradeOver20 >= 16) { 
    gradeColor = 'text-teal-700';
    accentBar = 'bg-teal-600';
  } else if (gradeOver20 >= 12) { 
    gradeColor = 'text-amber-700';
    accentBar = 'bg-amber-500';
  }

  const submitToGoogleSheets = async () => {
    if (saveStatus !== 'idle') return;
    setSaveStatus('saving');

    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwHT7i1Tlpkt7CAEkGJHemLGMa5afCdG8biEsjeZaWtsSKBPmUmypZ5m6IYUmQJT-t6xQ/exec';

    const detailedReport = result.details.map((d, idx) => {
       const qNum = idx + 1;
       const isAi = d.aiAnalysis?.aiDetected ? "[ALERTA: IA DETECTADA]" : "[HUMANO]";
       const answerText = d.userAnswer ? d.userAnswer.replace(/[\r\n]+/g, ' ').trim() : "SIN RESPUESTA";
       const feedbackText = d.aiAnalysis ? d.aiAnalysis.feedback.replace(/[\r\n]+/g, ' ').trim() : "N/A";
       return `P${qNum}: (${d.pointsEarned}/${d.maxPoints}) ${isAi} | Resp: ${answerText} | Feedback: ${feedbackText}`;
    }).join('\n\n');

    const payload = {
      fullName: user.fullName,
      cedula: user.cedula,
      carrera: user.carrera,
      score: gradeOver20.toFixed(2), 
      maxScore: "20.00",
      percentage: (rawPercentage * 100).toFixed(1) + '%',
      detailedReport: detailedReport
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setSaveStatus('success');
    } catch (error) {
      console.error("Error crítico de guardado:", error);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(submitToGoogleSheets, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tarjeta Principal de Resultados */}
        <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 relative`}>
          <div className={`absolute top-0 left-0 w-full h-1.5 ${accentBar}`}></div>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Informe de Desempeño Académico</h1>
            
            {/* Datos del Estudiante */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                  <UserCircle className="w-5 h-5 text-slate-400 mb-1"/>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Estudiante</span>
                  <p className="text-sm font-semibold text-slate-800 truncate w-full">{user.fullName}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                  <CreditCard className="w-5 h-5 text-slate-400 mb-1"/>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Documento</span>
                  <p className="text-sm font-semibold text-slate-800">{user.cedula}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center">
                  <Briefcase className="w-5 h-5 text-slate-400 mb-1"/>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Carrera</span>
                  <p className="text-sm font-semibold text-slate-800 truncate w-full">{user.carrera}</p>
               </div>
            </div>
            
            {/* Nota */}
            <div className="flex justify-center items-center mb-6">
              <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 shadow-sm ${gradeOver20 >= 12 ? 'border-teal-100 bg-teal-50' : 'border-rose-100 bg-rose-50'}`}>
                <span className={`text-5xl font-bold tracking-tight ${gradeColor}`}>{gradeOver20.toFixed(2)}</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Nota Final</span>
              </div>
            </div>

            {aiDetectedCount > 0 && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4" /> Se detectó uso de IA externa
              </div>
            )}

            {/* Estado de Guardado */}
            <div className="mt-6 h-8">
              {saveStatus === 'saving' && (
                  <div className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Loader2 className="w-4 h-4 animate-spin"/>
                      Guardando resultados...
                  </div>
              )}
              {saveStatus === 'success' && (
                  <div className="inline-flex items-center gap-2 text-teal-700 text-sm font-bold bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
                      <Check className="w-4 h-4"/> Resultados registrados correctamente
                  </div>
              )}
              {saveStatus === 'error' && (
                <div className="inline-flex items-center gap-2 text-rose-600 text-sm font-medium">
                   <AlertTriangle className="w-4 h-4"/> Error de conexión al guardar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Evaluación Detallada */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Retroalimentación Detallada</h3>
            <span className="text-xs font-medium text-slate-500">Revisión Automática</span>
          </div>
          <div className="divide-y divide-slate-100">
            {result.details.map((detail, idx) => {
              const hasAnswer = detail.userAnswer && detail.userAnswer.trim().length > 0;
              const isAi = detail.aiAnalysis?.aiDetected;
              
              return (
              <div key={idx} className={`p-6 md:p-8 transition-colors ${isAi ? 'bg-rose-50/50' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                       <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded">#{idx + 1}</span>
                       {isAi && (
                         <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                           IA Detectada
                         </span>
                       )}
                   </div>
                   <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">Puntos:</span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${detail.pointsEarned > 0 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            {detail.pointsEarned.toFixed(2)} / {detail.maxPoints.toFixed(2)}
                        </span>
                   </div>
                </div>
                
                <div className="mb-5 pl-4 border-l-4 border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Tu Respuesta:</p>
                  <div className={`text-slate-800 text-base leading-relaxed ${isAi ? 'line-through opacity-60' : ''}`}>
                    {hasAnswer ? detail.userAnswer : <span className="text-slate-400 italic">Sin respuesta.</span>}
                  </div>
                </div>

                {detail.aiAnalysis && (
                   <div className={`rounded-xl p-5 border ${isAi ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                     <div className="flex items-center gap-2 mb-2">
                       <Code className={`w-4 h-4 ${isAi ? 'text-rose-500' : 'text-teal-600'}`}/>
                       <span className={`text-xs font-bold uppercase tracking-wide ${isAi ? 'text-rose-700' : 'text-teal-800'}`}>
                         Feedback del Docente (IA)
                       </span>
                     </div>
                     <p className="text-sm text-slate-700 leading-relaxed font-medium">
                       {detail.aiAnalysis.feedback}
                     </p>
                   </div>
                )}
              </div>
            )})}
          </div>
        </div>
        
        <div className="flex justify-center pb-10">
            <button 
                onClick={onRestart}
                className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
                <LogOut className="w-4 h-4" />
                Salir de la Evaluación
            </button>
        </div>

      </div>
    </div>
  );
};

export default Results;
