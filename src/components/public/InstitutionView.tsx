import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Clock, 
  Calendar,
  CheckCircle2,
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const InstitutionView: React.FC = () => {
  const { language, customLogoUrl, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Institutional Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10 text-center md:text-left">
            {/* Logo */}
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Escudo Oficial I.E. Félix Henao Botero" 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-amber-400 dark:border-amber-300 ring-4 ring-amber-400/20 shadow-xl bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 text-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* General Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Sector Oficial • Medellín
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  DANE: 105001002345
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Vigencia 2024 - 2025
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                Institución Educativa Félix Henao Botero
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {language === 'es'
                  ? 'Entidad educativa de carácter oficial adscrita a la Secretaría de Educación de la Alcaldía de Medellín. Comprometida con la formación integral en valores, excelencia académica y desarrollo humano desde el nivel inicial hasta la educación media.'
                  : 'Official educational institution affiliated with the Secretary of Education of the Mayoralty of Medellin. Committed to comprehensive values-based education, academic excellence, and human development from early childhood through high school.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => setActiveTab('wizard')}
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'es' ? 'Iniciar Matrícula en Línea' : 'Start Online Enrollment'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>

                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Volver a Inicio' : 'Return to Home'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Rectoría y Autoridad */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-100 dark:border-teal-900">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'es' ? 'Rectoría y Dirección' : 'Leadership & Rector'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-200">Dra. Elena Valencia</strong>
              <br />
              {language === 'es' ? 'Liderazgo académico y directivo enfocado en convivencia ciudadana y calidad de los aprendizajes.' : 'Academic and directive leadership focused on citizen coexistence and learning quality.'}
            </p>
          </div>

          {/* Sedes Institucionales */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'es' ? 'Sedes Educativas' : 'School Campuses'}
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>Sede Principal:</strong> Secundaria y Media</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>Sede San Antonio:</strong> Preescolar y Primaria</span>
              </li>
            </ul>
          </div>

          {/* Jornadas y Grados */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-100 dark:border-amber-900">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'es' ? 'Jornadas y Grados' : 'Schedules & Grades'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Jornada Mañana (6:30 AM - 12:30 PM) y Tarde (12:30 PM - 6:30 PM). Cobertura desde Transición hasta 11° con modalidad académica y técnica.
            </p>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6">
            {language === 'es' ? 'Datos de Contacto y Ubicación Oficial' : 'Official Contact and Location'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  {language === 'es' ? 'Dirección' : 'Address'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  Calle 52 # 38-42
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Medellín, Antioquia
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  {language === 'es' ? 'Teléfono Secretaría' : 'Phone'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  +57 (4) 284 5678
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Lunes a Viernes 7am - 4pm
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  {language === 'es' ? 'Correo Electrónico' : 'Email'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug break-all">
                  secretaria@felixhenaobotero.edu.co
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                  {language === 'es' ? 'Radicación Oficial' : 'Official Registry'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  Resolución 12845
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Alcaldía de Medellín
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
