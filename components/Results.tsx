import React, { useEffect, useState } from 'react';
import { ExamResult, User } from '../types';
import { AlertTriangle, Check, Code, LogOut, FileText, UserCircle, Briefcase, CreditCard, Loader2, ShieldAlert, ExternalLink } from 'lucide-react';

interface ResultsProps {
  result: ExamResult;
  user: User;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, user, onRestart }) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const rawPercentage = result.maxScore > 0 ? (result.totalScore / result.maxScore) : 0;
  const gradeOver20 = rawPercentage * 20;
  
  const answeredCount = result.details.filter(d => d.userAnswer && d.userAnswer.trim().length > 0).length;
  const totalQuestions = result.details.length;
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

    // Nueva URL generada por el usuario
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
      // Usamos mode: 'no-cors' y text/plain para evitar bloqueos de seguridad del navegador (CORS)
      // Google Apps Script procesará el string de JSON correctamente.
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      
      // En modo no-cors la respuesta es opaca, por lo que marcamos éxito tras completar la petición
      setSaveStatus('success');
    } catch (error) {
      console.error("Error crítico de guardado:", error);
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    // Retraso de cortesía para asegurar que el usuario vea la pantalla de resultados antes de iniciar el guardado
    const timer = setTimeout(submitToGoogleSheets, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-teal-100">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${accentBar}`}></div>
          <div className="p-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Informe de Desempeño</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <UserCircle className="w-6 h-6 text-slate-400 mb-2"/>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiante</span>
                  <p className="text-sm font-bold text-slate-800 truncate w-full">{user.fullName}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <CreditCard className="w-6 h-6 text-slate-400 mb-2"/>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificación</span>
                  <p className="text-sm font-bold text-slate-800">{user.cedula}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                  <Briefcase className="w-6 h-6 text-slate-400 mb-2"/>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrera</span>
                  <p className="text-sm font-bold text-slate-800 truncate w-full">{user.carrera}</p>
               </div>
            </div>
            
            <div className="flex justify-center items-center mb-8">
              <div className={`w-52 h-52 rounded-full flex flex-col items-center justify-center border-[6px] shadow-inner ${gradeOver20 >= 12 ? 'border-teal-50 bg-teal-50/30' : 'border-rose-50 bg-rose-50/30'}`}>
                <span className={`text-7xl font-black tracking-tighter ${gradeColor}`}>{gradeOver20.toFixed(2)}</span>
                <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Score / 20.00</span>
              </div>
            </div>

            {aiDetectedCount > 0 && (
              <div className="mb-8 inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                <ShieldAlert className="w-4 h-4" /> Penalización por uso de IA externa
              </div>
            )}

            <div className="mt-10">
              {saveStatus === 'saving' && (
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900 text-slate-300 text-xs font-bold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400"/>
                      Registrando expediente en base de datos...
                  </div>
              )}
              {saveStatus === 'success' && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-teal-800 text-white text-xs font-bold shadow-lg shadow-teal-900/20 animate-in zoom-in-95">
                        <Check className="w-4 h-4"/> Sincronización Exitosa
                    </div>
                    <a 
                      href="https://docs.google.com/spreadsheets/d/181BEvlgzEjacHOyB2YOb6u3P26FStVLc9mEZT_BQ_Fk/edit?usp=sharing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-teal-600 font-bold hover:underline flex items-center gap-2 uppercase tracking-widest"
                    >
                      Verificar en Hoja de Cálculo <ExternalLink className="w-3 h-3"/>
                    </a>
                  </div>
              )}
              {saveStatus === 'error' && (
                <div className="max-w-md mx-auto bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 text-left">
                   <div className="bg-rose-100 p-2 rounded-lg"><AlertTriangle className="w-5 h-5 text-rose-600"/></div>
                   <div>
                     <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">Fallo de Conexión</p>
                     <p className="text-[10px] text-rose-700 font-medium">No se pudo guardar automáticamente. Por favor, guarde una captura de pantalla de estos resultados.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Evaluación Detallada</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Criterio IA</span>
          </div>
          <div className="divide-y divide-slate-100">
            {result.details.map((detail, idx) => {
              const hasAnswer = detail.userAnswer && detail.userAnswer.trim().length > 0;
              const isAi = detail.aiAnalysis?.aiDetected;
              
              return (
              <div key={idx} className={`p-8 md:p-10 transition-colors group ${isAi ? 'bg-rose-50/30' : 'hover:bg-slate-50/30'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                       <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg">ITEM {idx + 1}</span>
                       {isAi && (
                         <span className="text-[9px] bg-rose-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                           <ShieldAlert className="w-3 h-3"/> IA Detectada
                         </span>
                       )}
                   </div>
                   <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Puntos:</span>
                        <span className={`px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${detail.pointsEarned > 0 ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            {detail.pointsEarned.toFixed(2)} / {detail.maxPoints.toFixed(2)}
                        </span>
                   </div>
                </div>
                
                <div className="mb-6 pl-8 border-l-4 border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Producción Académica:</p>
                  <div className={`text-slate-700 text-lg leading-relaxed font-serif italic ${isAi ? 'line-through opacity-50' : ''}`}>
                    {hasAnswer ? detail.userAnswer : <span className="text-slate-300">Respuesta omitida.</span>}
                  </div>
                </div>

                {detail.aiAnalysis && (
                   <div className={`${isAi ? 'bg-rose-900' : 'bg-slate-900'} border border-slate-800 rounded-2xl p-6 md:p-8 mt-4 shadow-xl`}>
                     <div className="flex items-center gap-3 mb-4">
                       <Code className={`w-4 h-4 ${isAi ? 'text-rose-400' : 'text-teal-400'}`}/>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Dictamen de Evaluación</span>
                     </div>
                     <p className="text-sm text-slate-300 leading-relaxed font-medium">
                       "{detail.aiAnalysis.feedback}"
                     </p>
                   </div>
                )}
              </div>
            )})}
          </div>
        </div>
        
        <div className="flex justify-center pt-4 pb-16">
            <button 
                onClick={onRestart}
                className="group flex items-center gap-3 px-10 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-2xl transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs"
            >
                <LogOut className="w-5 h-5 text-teal-500" />
                Finalizar y Salir
            </button>
        </div>

      </div>
    </div>
  );
};

export default Results;