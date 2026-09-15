import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import { InicioAccordions } from '../common/InicioAccordions';
import { 
  Sun, 
  Moon, 
  Globe
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
      
      {/* Top Brand Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          
          {/* Institution Brand: Logo with smaller EduMed Digital underneath */}
          <div className="flex flex-col items-center justify-center text-center">
            <img 
              src={customLogoUrl} 
              alt="Escudo Institución Educativa Félix Henao Botero" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-xs bg-white shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
              }}
            />
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight text-slate-600 dark:text-slate-300 mt-1 leading-none">
              edumed <span className="text-teal-600 dark:text-teal-400 font-bold">digital</span>
            </span>
          </div>

          <div className="hidden sm:block text-center">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Institución Educativa Félix Henao Botero
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Medellín, Colombia • DANE 105001002345
            </span>
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

      {/* Main Area: Cuadros desplegables al lado del panel de sesión activa */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 my-4">
          
          {/* LADO IZQUIERDO: Cuadros desplegables (Cómo funciona, Ventajas del sistema digital, Preguntas frecuentes) */}
          <div className="w-full lg:w-7/12">
            <InicioAccordions />
          </div>

          {/* LADO DERECHO: Panel de sesión activa / inicio de sesión */}
          <div className="w-full lg:w-5/12 flex justify-center sticky top-20">
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
