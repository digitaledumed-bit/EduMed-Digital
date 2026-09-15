import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  Sparkles, 
  MessageCircleQuestion, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Leaf, 
  Bell, 
  Users, 
  FolderCheck,
  Award,
  ArrowRight
} from 'lucide-react';

export const InicioAccordions: React.FC = () => {
  const { language } = useApp();

  // Manage independent open state for each of the 3 dropdown boxes
  const [openSections, setOpenSections] = useState<{
    howItWorks: boolean;
    advantages: boolean;
    faq: boolean;
  }>({
    howItWorks: true, // Open by default
    advantages: false,
    faq: false
  });

  const toggleSection = (section: 'howItWorks' | 'advantages' | 'faq') => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Sub-state for individual FAQ items
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(0);

  const toggleFaqItem = (index: number) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  const isEs = language === 'es';

  return (
    <div id="inicio-cuadros-desplegables" className="w-full space-y-4 text-left">
      
      {/* Header Info */}
      <div className="mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{isEs ? 'I.E. Félix Henao Botero • Plataforma Oficial' : 'Official School Platform'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isEs ? 'Información y Servicios del Sistema' : 'System Information & Services'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          {isEs 
            ? 'Despliega cada cuadro para conocer el funcionamiento del portal, beneficios institucionales y resolver dudas frecuentes.' 
            : 'Expand each section to learn how the portal works, system benefits, and common questions.'}
        </p>
      </div>

      {/* CUADRO 1: CÓMO FUNCIONA */}
      <div 
        id="accordion-como-funciona"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all duration-200"
      >
        <button
          type="button"
          id="btn-toggle-como-funciona"
          onClick={() => toggleSection('howItWorks')}
          className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          aria-expanded={openSections.howItWorks}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isEs ? '¿Cómo funciona el sistema?' : 'How does the system work?'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  {isEs ? '5 Pasos' : '5 Steps'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isEs ? 'Guía paso a paso desde el acceso hasta la asignación de cupo' : 'Step-by-step enrollment and verification roadmap'}
              </p>
            </div>
          </div>
          <div className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-200 ${openSections.howItWorks ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {openSections.howItWorks && (
          <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                1
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Identificación y Acceso por Portal' : 'Identification & Portal Login'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {isEs 
                    ? 'Selecciona tu portal asignado (Acudiente, Estudiante o Docente) e ingresa con tus credenciales. El sistema te otorgará acceso únicamente a la información autorizada para tu rol.' 
                    : 'Select your assigned portal (Guardian, Student, or Teacher) and sign in. You will only access data corresponding to your role.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                2
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Diligenciamiento del Formulario en Línea' : 'Online Form Registration'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {isEs 
                    ? 'Completa los datos personales, médicos y de residencia del estudiante, junto con la información de contacto del acudiente principal.' 
                    : 'Fill in the student’s personal, medical, and residential details along with primary guardian contact info.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                3
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Carga Digital de Documentos' : 'Digital Document Upload'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {isEs 
                    ? 'Adjunta en formato PDF o fotografía legible los documentos obligatorios (documento de identidad del aspirante y acudiente, certificado de EPS/Sisbén y notas anteriores).' 
                    : 'Upload valid PDFs or clear images of required documents (ID, health insurance certificate, and previous grades).'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                4
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Radicación Oficial y Código de Seguimiento' : 'Official Record Number & Real-Time Tracking'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {isEs 
                    ? 'El sistema expide un número de radicado oficial con el que puedes consultar el estado en cualquier momento desde el portal.' 
                    : 'The platform generates a unique record number to track your application status anytime.'}
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                5
              </span>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Validación, Cupo y Comprobante Oficial' : 'Validation, Quota & Official Certificate'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {isEs 
                    ? 'La secretaría académica verifica los requisitos, confirma el cupo en el grado solicitado y te permite descargar el comprobante de matrícula oficial.' 
                    : 'Academic administration reviews the files, confirms the grade placement, and issues the official certificate.'}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* CUADRO 2: VENTAJAS DEL SISTEMA DIGITAL */}
      <div 
        id="accordion-ventajas-sistema"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all duration-200"
      >
        <button
          type="button"
          id="btn-toggle-ventajas-sistema"
          onClick={() => toggleSection('advantages')}
          className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          aria-expanded={openSections.advantages}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Ventajas del Sistema Digital' : 'Advantages of the Digital System'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {isEs ? 'Beneficios' : 'Benefits'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isEs ? 'Innovación, seguridad, agilidad y ahorro para la comunidad educativa' : 'Security, speed, privacy and convenience for our community'}
              </p>
            </div>
          </div>
          <div className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-200 ${openSections.advantages ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {openSections.advantages && (
          <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 gap-2.5">
            
            {/* Benefit 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Cero Filas y Disponibilidad 24/7' : 'Zero Waiting Lines & 24/7 Availability'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Realiza matrículas, consultas y actualizaciones desde la comodidad de tu hogar, sin madrugar ni perder horas de trabajo haciendo filas en la secretaría.' 
                    : 'Manage applications and updates from home anytime, without waiting in lines at the school office.'}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Acceso Segmentado y Privacidad Estricta' : 'Strict Role Privacy & Protection'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Cumplimiento de la Ley 1581 de protección de datos: cada usuario accede exclusivamente a la información de su respectivo portal y núcleo familiar.' 
                    : 'Protected by data privacy standards: users access only their own family and academic records.'}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 shrink-0">
                <FolderCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Trazabilidad y Transparencia en Tiempo Real' : 'Real-Time Transparency & Traceability'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Consulta en todo momento el avance de tu trámite: sabrás exactamente si tus documentos fueron recibidos, si están en revisión o si ya están aprobados.' 
                    : 'Check your progress step by step: received, under review, or officially approved.'}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Ahorro Económico y Sostenibilidad Ambiental' : 'Paperless & Family Savings'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Cero fotocopias, carpetas de cartón ni transporte a las sedes. Todo el expediente permanece seguro y accesible en la nube institucional.' 
                    : 'Eliminate printing, folders, and travel costs. Your student file stays safe and digital.'}
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  {isEs ? 'Notificaciones Inmediatas y Atención Eficaz' : 'Instant Alerts & Fast Support'}
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Avisos directos en caso de requerir subsanar algún documento y confirmación inmediata de beneficios (PAE, kits escolares, transporte).' 
                    : 'Direct notifications if additional documents are needed and fast access to student benefits.'}
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* CUADRO 3: PREGUNTAS FRECUENTES (FAQ) */}
      <div 
        id="accordion-preguntas-frecuentes"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all duration-200"
      >
        <button
          type="button"
          id="btn-toggle-preguntas-frecuentes"
          onClick={() => toggleSection('faq')}
          className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          aria-expanded={openSections.faq}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800">
              <MessageCircleQuestion className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {isEs ? 'Respuestas Oficiales' : 'Official Answers'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isEs ? 'Dudas sobre radicación, documentos requeridos y gratuidad' : 'Answers regarding records, documents, and free enrollment'}
              </p>
            </div>
          </div>
          <div className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-200 ${openSections.faq ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {openSections.faq && (
          <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
            
            {/* FAQ 1 */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleFaqItem(0)}
                className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isEs ? '¿Cómo consulto el estado de mi matrícula o radicado?' : 'How do I check my enrollment or record status?'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${openFaqItem === 0 ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaqItem === 0 && (
                <div className="px-3.5 pb-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                  {isEs 
                    ? 'Inicia sesión con tu cuenta de acudiente o estudiante y ve al botón "Consultar Estado". Allí podrás ingresar tu número de radicado oficial o tu documento de identidad para ver el paso exacto en el que se encuentra.' 
                    : 'Sign in to your guardian or student portal and click "Check Status". You can search by your record code or ID number.'}
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleFaqItem(1)}
                className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isEs ? '¿Qué documentos debo tener listos para el registro digital?' : 'What documents do I need ready for digital enrollment?'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${openFaqItem === 1 ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaqItem === 1 && (
                <div className="px-3.5 pb-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                  {isEs 
                    ? 'Debes tener en formato digital (PDF o foto clara): 1) Documento de identidad del estudiante (RC o TI), 2) Cédula del acudiente principal, 3) Certificado de afiliación a EPS o Sisbén actualizado, y 4) Último boletín o certificado de notas en caso de traslado.' 
                    : 'You will need clear PDFs or photos of: student ID, guardian ID, valid health insurance/Sisbén certificate, and previous academic grades if transferring.'}
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleFaqItem(2)}
                className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isEs ? '¿Puedo matricular a varios hijos con una sola cuenta?' : 'Can I enroll multiple children with one account?'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${openFaqItem === 2 ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaqItem === 2 && (
                <div className="px-3.5 pb-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                  {isEs 
                    ? 'Sí. Desde tu Portal de Acudiente puedes radicar y gestionar las matrículas de todos los hijos o acudidos bajo tu responsabilidad sin necesidad de crear correos diferentes.' 
                    : 'Yes! A single guardian account can submit and manage enrollments for all children under your custody.'}
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleFaqItem(3)}
                className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isEs ? '¿Tiene algún costo la matrícula o el uso del sistema digital?' : 'Is there any fee for enrollment or system use?'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${openFaqItem === 3 ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaqItem === 3 && (
                <div className="px-3.5 pb-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                  {isEs 
                    ? 'No. La educación en la Institución Educativa Félix Henao Botero es 100% gratuita y oficial. El uso de la plataforma digital, la inscripción, asignación de cupos y expedición de certificados no tienen ningún costo.' 
                    : 'No. Enrollment and education at I.E. Félix Henao Botero are 100% free and public. The digital platform has no cost.'}
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40">
              <button
                type="button"
                onClick={() => toggleFaqItem(4)}
                className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isEs ? '¿Qué hago si olvidé mi contraseña de acceso?' : 'What if I forgot my account password?'}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${openFaqItem === 4 ? 'rotate-180 text-teal-600' : ''}`} />
              </button>
              {openFaqItem === 4 && (
                <div className="px-3.5 pb-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                  {isEs 
                    ? 'Haz clic en el enlace "¿Olvidó su contraseña?" en el panel de sesión. Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad para restablecer tu clave inmediatamente.' 
                    : 'Click "Forgot password?" in the sign-in box. Enter your registered email to receive a verification code and reset your password.'}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
