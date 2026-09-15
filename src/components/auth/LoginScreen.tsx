import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import { 
  Lock, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Globe, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Users 
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    customLogoUrl 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Top Restricted Access Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Institution Brand */}
          <div className="flex items-center gap-3">
            <img 
              src={customLogoUrl} 
              alt="Escudo Institución Educativa Félix Henao Botero" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-md bg-white shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EduMed <span className="text-teal-600 dark:text-teal-400">Digital</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Lock className="w-3 h-3" />
                  <span>{language === 'es' ? 'Acceso Protegido' : 'Protected Access'}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-md">
                I.E. Félix Henao Botero • {language === 'es' ? 'Medellín, Antioquia' : 'Medellín, Colombia'}
              </p>
            </div>
          </div>

          {/* Language & Theme Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switch */}
            <button
              id="login-lang-switch-btn"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              id="login-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 my-auto py-6">
          
          {/* Institutional Presentation & Notice */}
          <div className="w-full lg:w-1/2 text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{language === 'es' ? 'Sistema Oficial Autenticado' : 'Authenticated Official System'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {language === 'es' ? (
                <>
                  Inicia sesión para acceder a la plataforma <span className="text-teal-600 dark:text-teal-400">EduMed Digital</span>
                </>
              ) : (
                <>
                  Log in to access the <span className="text-teal-600 dark:text-teal-400">EduMed Digital</span> platform
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'es'
                ? 'El contenido, las matrículas en línea, el seguimiento de radicados y la gestión escolar están protegidos. Identifícate con tu cuenta de acudiente, estudiante o docente para desbloquear todas las funciones.'
                : 'The platform content, online enrollments, application tracking, and academic records are protected. Please sign in with your guardian, student, or teacher account to unlock all features.'}
            </p>

            {/* Protected Modules List */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">
                    {language === 'es' ? 'Matrículas y Radicados Oficiales' : 'Official Enrollments & Records'}
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Registro paso a paso, carga de documentos y comprobantes' : 'Step-by-step registration and document uploads'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">
                    {language === 'es' ? 'Expediente y Perfil del Estudiante' : 'Student Academic Profiles'}
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Notas, acudientes vinculados y estado académico' : 'Grades, linked guardians, and academic status'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">
                    {language === 'es' ? 'Gestión Institucional y Acudientes' : 'Institutional Management & Guardians'}
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {language === 'es' ? 'Validación de documentos, cupos por grado y configuración' : 'Document verification, grade quotas, and institutional settings'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {language === 'es' 
                  ? '¿No tienes cuenta? Puedes crearla gratis desde la pestaña Crear Cuenta.' 
                  : "Don't have an account? Create one for free in the Register tab."}
              </span>
            </div>
          </div>

          {/* Centered Auth Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <AuthCard />
          </div>

        </div>
      </main>

      {/* Institutional Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <img 
              src={customLogoUrl} 
              alt="Escudo Institución Educativa" 
              className="w-7 h-7 rounded-full object-cover border border-teal-600/50 bg-white shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
              }}
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">I.E. Félix Henao Botero</span>
            <span>•</span>
            <span>{language === 'es' ? 'Sistema Oficial de Matrícula y Gestión Escolar' : 'Official Enrollment & School Management System'}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>DANE: 105001002345</span>
            <span>•</span>
            <span>Medellín, Antioquia</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
