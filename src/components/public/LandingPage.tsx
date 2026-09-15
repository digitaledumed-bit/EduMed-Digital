import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from './AuthCard';
import { InicioAccordions } from '../common/InicioAccordions';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Layers, 
  FileCheck, 
  Activity, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  UserPlus, 
  Search,
  ExternalLink,
  Lock,
  BookOpen,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language, setActiveTab, setActiveRole, customLogoUrl, currentUser } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO SECTION WITH AUTHENTICATION & LOGO */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        
        {/* Subtle background ambient accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: School Presentation, Logo Banner & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Institutional Crest and Open Process Banner */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span>{t.landing.badgeOpen}</span>
                </div>
              </div>

              {/* Official School Identity Badge (Clean, without conflicting action buttons) */}
              <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5 w-full max-w-xl">
                <div className="relative shrink-0">
                  <img 
                    src={customLogoUrl} 
                    alt="Escudo Oficial I.E. Félix Henao Botero" 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-md bg-white"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-wider text-teal-700 dark:text-teal-400 uppercase block">
                    Institución Educativa Oficial
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    Félix Henao Botero
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Medellín • DANE 105001002345
                  </p>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mt-1">
                {t.landing.heroTitle}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                {t.landing.heroSubtitle}
              </p>

              {/* Actions - Only visible after login as requested */}
              {currentUser ? (
                <div className="mt-7 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    id="hero-start-enrollment-btn"
                    onClick={() => setActiveTab('wizard')}
                    className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-800/20 hover:shadow-teal-800/30 transition-all flex items-center justify-center cursor-pointer active:scale-98"
                  >
                    <span>{t.landing.startEnrollment}</span>
                  </button>

                  <button
                    id="hero-check-status-btn"
                    onClick={() => setActiveTab('status')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{t.nav.status}</span>
                  </button>

                  <button
                    id="hero-benefits-btn"
                    onClick={() => setActiveTab('beneficios')}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{t.nav.benefits}</span>
                  </button>

                  <button
                    id="hero-support-btn"
                    onClick={() => setActiveTab('soporte')}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{t.nav.support}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-7 p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 max-w-xl text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-teal-950 dark:text-teal-200">
                        {language === 'es' ? 'Acceso Seguro a Matrícula y Servicios' : 'Secure Access to Enrollment & Services'}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-teal-800/90 dark:text-teal-300/90 mt-1 leading-relaxed">
                        {language === 'es'
                          ? 'Por favor inicie sesión o regístrese en el formulario oficial (derecha) para acceder a Nueva Matrícula, Consultar Estado, Beneficios y Soporte.'
                          : 'Please log in or register using the official form (on the right) to access New Enrollment, Status Check, Benefits, and Support.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Institutional guarantee badges */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{t.landing.enrolledBadge}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Protección Ley 1581</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Resolución Oficial 2024-2025</span>
                </div>
              </div>

              {/* Cuadros desplegables de como funciona, ventajas del sistema digital y preguntas frecuentes */}
              <div className="mt-8 w-full">
                <InicioAccordions />
              </div>

            </div>

            {/* RIGHT COLUMN: Panel de sesión activa / Tarjeta de Autenticación */}
            <div className="lg:col-span-5 flex justify-center w-full sticky top-24 self-start">
              <AuthCard />
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS - 4 STEPS */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.landing.howItWorks}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.landing.steps.map((step, idx) => (
              <div 
                key={idx}
                id={`step-card-${step.num}`}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-extrabold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SYSTEM ADVANTAGES */}
      <section id="ventajas" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.landing.advantagesTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.advantagesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Highlighted Card - Security */}
            <div className="md:col-span-2 bg-gradient-to-br from-teal-900 to-slate-900 text-white p-8 rounded-2xl border border-teal-800 shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {t.landing.advantages[0].title}
                </h3>
                <p className="text-sm text-teal-100/80 leading-relaxed max-w-xl">
                  {t.landing.advantages[0].desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-teal-800/60 flex items-center gap-3 text-xs text-teal-300 font-medium">
                <Lock className="w-4 h-4" />
                <span>Cumplimiento Ley 1581 de Protección de Datos Personales</span>
              </div>
            </div>

            {/* Card 2: Time Savings */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.landing.advantages[1].title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.landing.advantages[1].desc}
              </p>
            </div>

            {/* Card 3: Organized Info */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.landing.advantages[2].title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.landing.advantages[2].desc}
              </p>
            </div>

            {/* Card 4: Document Management */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.landing.advantages[3].title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.landing.advantages[3].desc}
              </p>
            </div>

            {/* Card 5: Traceability */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.landing.advantages[4].title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.landing.advantages[4].desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.landing.faqTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.faqSub}
            </p>
          </div>

          <div className="space-y-4">
            {t.landing.faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-teal-600' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT & SUPPORT SECTION */}
      <section id="soporte" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.landing.helpTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.helpSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.landing.locationTitle}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t.landing.locationDesc}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.landing.phoneTitle}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t.landing.phoneDesc}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.landing.emailTitle}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t.landing.emailDesc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={customLogoUrl} 
                alt="Escudo Institucional" 
                className="w-10 h-10 rounded-xl object-cover border border-teal-500/50 bg-white p-0.5"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <div>
                <span className="font-bold text-white text-sm">EduMed Digital</span>
                <span className="block text-[11px] text-slate-400">I.E. Félix Henao Botero - Medellín</span>
              </div>
            </div>

            {currentUser ? (
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <button onClick={() => setActiveTab('beneficios')} className="hover:text-white transition-colors cursor-pointer">{t.nav.benefits}</button>
                <button onClick={() => setActiveTab('soporte')} className="hover:text-white transition-colors cursor-pointer">{t.landing.contactSupport}</button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center">
                <span>Secretaría de Educación de Medellín • Calidad Oficial</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center md:text-right">
              {t.brand.copyright}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
