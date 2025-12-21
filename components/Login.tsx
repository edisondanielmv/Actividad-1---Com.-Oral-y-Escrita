import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, User as UserIcon, CreditCard, Loader2, AlertTriangle, Key, HelpCircle, X, GraduationCap } from 'lucide-react';
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
      setError('Por favor complete su Nombre, Cédula y Carrera.');
      return;
    }

    const cleanApiKey = apiKey.trim();
    setIsVerifying(true);
    const isSystemReady = await checkSystemAvailability(cleanApiKey);
    
    if (!isSystemReady) {
        setIsVerifying(false);
        setError(cleanApiKey ? 'La Clave ingresada fue rechazada. Verifique su validez.' : 'El servidor está saturado. Intente con una Clave Personal.');
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
                <HelpCircle className="w-5 h-5 text-teal-400"/> Generar Clave Personal
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed">
                Para una experiencia fluida sin esperas de servidor, se recomienda usar una clave personal de Google AI. Es gratuito y rápido.
              </p>
              
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">1</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Acceda a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-bold underline hover:text-teal-800 transition-colors">Google AI Studio</a>.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">2</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Seleccione <strong>"Create API Key"</strong>.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm border border-teal-100">3</span>
                  <div className="text-sm text-slate-700 pt-1">
                    Copie el código (AIza...) y péguelo en el formulario de acceso.
                  </div>
                </li>
              </ol>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-md mt-4"
              >
                Tengo mi clave lista
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
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Portal de Evaluación</h1>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-[0.2em]">Competencias Académicas</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cedula" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Documento Identidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="cedula"
                  className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  placeholder="Cédula o ID"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div>
              <label htmlFor="carrera" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">Carrera Académica</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="carrera"
                  className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                  placeholder="Ej: Ingeniería en Sistemas"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-3">
                   <label htmlFor="apiKey" className="block text-xs font-black text-slate-500 uppercase tracking-wider">
                       Clave Personal (API)
                   </label>
                   <button
                     type="button"
                     onClick={() => setShowHelp(true)}
                     className="text-[10px] text-teal-600 font-bold hover:text-teal-800 flex items-center gap-1 uppercase tracking-tighter"
                   >
                     <HelpCircle className="w-3 h-3" />
                     Obtener Clave
                   </button>
               </div>
               
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className={`h-5 w-5 transition-colors ${apiKey ? 'text-teal-500' : 'text-slate-400'}`} />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  className={`block w-full pl-12 pr-4 py-3 border rounded-xl bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono text-sm`}
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isVerifying}
                />
               </div>
            </div>
          </div>

          {error && (
            <div className="text-rose-700 text-xs bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full flex justify-center py-4 px-6 text-sm font-black uppercase tracking-widest rounded-xl text-white shadow-lg transition-all transform active:scale-[0.98]
                ${isVerifying 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-teal-700 hover:bg-teal-800 hover:shadow-teal-900/10'
                }`}
          >
            {isVerifying ? (
                <span className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin"/> Validando...
                </span>
            ) : (
                "Acceder al Examen"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;