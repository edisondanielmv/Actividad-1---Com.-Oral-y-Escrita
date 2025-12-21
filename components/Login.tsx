
import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, User as UserIcon, CreditCard, Loader2, AlertTriangle, Key, HelpCircle, X, GraduationCap, ShieldCheck } from 'lucide-react';
import { checkSystemAvailability } from '../services/geminiService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [carrera, setCarrera] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !cedula.trim() || !carrera.trim()) {
      setError('Datos incompletos. Por favor ingrese su Nombre, Documento e Identificación de Carrera.');
      return;
    }

    const cleanApiKey = apiKey.trim();
    setIsVerifying(true);
    
    // VALIDACIÓN CRÍTICA: El estudiante solo pasa si la conexión con Gemini Pro es exitosa
    const isSystemReady = await checkSystemAvailability(cleanApiKey);
    
    if (!isSystemReady) {
        setIsVerifying(false);
        if (cleanApiKey) {
          setError('ACCESO DENEGADO: La Clave API proporcionada no es válida o no tiene permisos para los modelos de evaluación. Verifíquela e intente nuevamente.');
        } else {
          setError('CONEXIÓN FALLIDA: No se detectó una clave de acceso válida y el servidor público está saturado. Se requiere una Clave Personal para ingresar.');
        }
        return;
    }

    setIsVerifying(false);
    onLogin({ fullName, cedula, carrera, apiKey: cleanApiKey });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-800 p-5 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-teal-400"/> Obtener Clave de Acceso
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed">
                Esta evaluación utiliza inteligencia artificial de alto nivel para calificar sus respuestas. Para garantizar el acceso, debe utilizar una clave de API personal (gratuita).
              </p>
              
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">1</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Vaya a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold underline hover:text-teal-800 transition-colors">Google AI Studio</a>.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">2</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Haga clic en <strong>"Create API Key"</strong>.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">3</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Copie el código generado y péguelo en el campo de Clave Personal abajo.
                  </div>
                </li>
              </ol>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-md mt-4"
              >
                Entendido, tengo mi clave
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
          <div className="mx-auto bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-slate-700">
            <BookOpen className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Acceso Estudiantil</h1>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Validación de Identidad y Conexión IA</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Nombre del Estudiante</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-300" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                  placeholder="Ej: María García"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cedula" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Documento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-slate-300" />
                  </div>
                  <input
                    type="text"
                    id="cedula"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                    placeholder="ID / Cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="carrera" className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Carrera</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GraduationCap className="h-4 w-4 text-slate-300" />
                  </div>
                  <input
                    type="text"
                    id="carrera"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                    placeholder="Facultad"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
               <div className="flex justify-between items-center mb-3">
                   <label htmlFor="apiKey" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Key className="w-3 h-3 text-teal-600" /> Clave de Acceso IA
                   </label>
                   <button
                     type="button"
                     onClick={() => setShowHelp(true)}
                     className="text-[9px] text-teal-600 font-bold hover:underline uppercase tracking-tighter"
                   >
                     ¿Cómo obtenerla?
                   </button>
               </div>
               
               <div className="relative">
                <input
                  type="password"
                  id="apiKey"
                  className={`block w-full px-4 py-3 border rounded-xl bg-slate-900 text-teal-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono text-xs`}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isVerifying}
                />
               </div>
               <p className="text-[9px] text-slate-400 mt-2 leading-tight">
                 La clave es necesaria para activar el motor de calificación en tiempo real.
               </p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-[11px] font-bold text-rose-800 leading-normal">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full flex justify-center items-center py-4 px-6 text-xs font-black uppercase tracking-[0.2em] rounded-xl text-white shadow-lg transition-all transform active:scale-[0.98]
                ${isVerifying 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-teal-700 hover:bg-teal-800 hover:shadow-teal-900/20'
                }`}
          >
            {isVerifying ? (
                <span className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin"/> Verificando Conexión...
                </span>
            ) : (
                <span className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> Iniciar Evaluación
                </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
