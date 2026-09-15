import React from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from './AuthCard';
import { InicioAccordions } from '../common/InicioAccordions';
import { 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language, setActiveTab, customLogoUrl, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      
      {/* SESSION CARD & ACCORDIONS SECTION */}
      <section className="relative overflow-hidden py-8 sm:py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-1 flex items-start justify-center">
        
        {/* Subtle background ambient accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10">
            
            {/* LADO IZQUIERDO: Cuadros desplegables (Cómo funciona, Ventajas, Preguntas frecuentes) */}
            <div className="w-full lg:w-7/12">
              <InicioAccordions />
            </div>

            {/* LADO DERECHO: Tarjeta de sesión activa / inicio de sesión */}
            <div className="w-full lg:w-5/12 flex justify-center sticky top-24 self-start">
              <AuthCard />
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT & SUPPORT SECTION */}
      <section id="soporte" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.landing.helpTitle}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {t.landing.helpSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-start shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t.landing.locationTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t.landing.locationDesc}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-start shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t.landing.phoneTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t.landing.phoneDesc}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-start shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {t.landing.emailTitle}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t.landing.emailDesc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={customLogoUrl} 
                alt="Escudo Institucional" 
                className="w-8 h-8 rounded-full object-cover border border-teal-500/50 bg-white p-0.5"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <div>
                <span className="font-bold text-white text-xs sm:text-sm">EduMed Digital</span>
                <span className="block text-[10px] text-slate-400">I.E. Félix Henao Botero - Medellín</span>
              </div>
            </div>

            {currentUser ? (
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
                <button onClick={() => setActiveTab('beneficios')} className="hover:text-white transition-colors cursor-pointer">{t.nav.benefits}</button>
                <button onClick={() => setActiveTab('soporte')} className="hover:text-white transition-colors cursor-pointer">{t.landing.contactSupport}</button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center">
                <span>Secretaría de Educación de Medellín • Calidad Oficial</span>
              </div>
            )}

            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center md:text-right">
              {t.brand.copyright}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
