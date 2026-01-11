
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
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    const cleanApiKey = apiKey.trim();
    setIsVerifying(true);
    
    const isSystemReady = await checkSystemAvailability(cleanApiKey);
    
    if (!isSystemReady) {
        setIsVerifying(false);
        if (cleanApiKey) {
          setError('La Clave API proporcionada no es válida.');
        } else {
          setError('El sistema requiere una Clave API para continuar.');
        }
        return;
    }

    setIsVerifying(false);
    onLogin({ fullName, cedula, carrera, apiKey: cleanApiKey });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans text-slate-800">
      
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
                Esta evaluación utiliza inteligencia artificial. Para garantizar el acceso, utilice su clave personal.
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
                    Copie el código y péguelo en el campo de Clave API.
                  </div>
                </li>
              </ol>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-md mt-4 text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="mx-auto bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-slate-700">
            <BookOpen className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Evaluación Académica</h1>
          <p className="text-slate-400 text-xs mt-2 font-medium">Ingrese sus credenciales para comenzar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cedula" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Documento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="cedula"
                    className="block w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                    placeholder="ID"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="carrera" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Carrera</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="carrera"
                    className="block w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm"
                    placeholder="Facultad"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100">
               <div className="flex justify-between items-center mb-2">
                   <label htmlFor="apiKey" className="block text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                       <Key className="w-3 h-3 text-teal-600" /> Clave API
                   </label>
                   <button
                     type="button"
                     onClick={() => setShowHelp(true)}
                     className="text-xs text-teal-600 font-bold hover:underline"
                   >
                     ¿Ayuda?
                   </button>
               </div>
               
               <div className="relative">
                <input
                  type="password"
                  id="apiKey"
                  className={`block w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono text-sm`}
                  placeholder="Pegue su API Key aquí"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isVerifying}
                />
               </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-rose-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full flex justify-center items-center py-3 px-6 text-sm font-bold uppercase tracking-wide rounded-xl text-white shadow-md transition-all
                ${isVerifying 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-teal-700 hover:bg-teal-800'
                }`}
          >
            {isVerifying ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/> Verificando...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Comenzar Examen
                </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
