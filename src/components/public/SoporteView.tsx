import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LifeBuoy, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Send,
  Home,
  HelpCircle,
  FileQuestion
} from 'lucide-react';

export const SoporteView: React.FC = () => {
  const { language, setActiveTab } = useApp();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 inline-block">
              {language === 'es' ? 'Atención a la Comunidad' : 'Community Support'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {language === 'es' ? 'Centro de Ayuda y Soporte Institucional' : 'Help & Support Center'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'es'
                ? 'Canales oficiales para resolución de dudas sobre inscripciones, carga de documentos, matrículas y solicitudes académicas de la I.E. Félix Henao Botero.'
                : 'Official channels for enrollment queries, document verification, academic records, and support for the Félix Henao Botero school community.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>{language === 'es' ? 'Volver a Inicio' : 'Return to Home'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">
              {language === 'es' ? 'Línea Telefónica' : 'Phone Call'}
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
              +57 (4) 284 5678
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Lunes a Viernes 7:00 AM - 4:00 PM
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">
              {language === 'es' ? 'Correo de Secretaría' : 'Secretary Email'}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block break-all">
              secretaria@felixhenaobotero.edu.co
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Respuesta en menos de 24 horas hábiles
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">
              {language === 'es' ? 'Atención Presencial' : 'Campus Office'}
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
              Calle 52 # 38-42
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Medellín, Antioquia (Ventanilla Única)
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">
              {language === 'es' ? 'Jornada Continua' : 'Operating Hours'}
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
              6:30 AM - 6:30 PM
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Sede Secundaria y Primaria
            </p>
          </div>
        </div>

        {/* Quick Ticket Submission */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'es' ? 'Enviar Solicitud o Petición Digital (PQRSF)' : 'Submit Digital Inquiry / Request'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              {language === 'es' 
                ? 'Diligencie el formulario a continuación para radicar una consulta sobre su proceso de matrícula.'
                : 'Fill out the form below to submit an inquiry regarding your enrollment application.'}
            </p>

            {ticketSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">
                    {language === 'es' ? '¡Solicitud Radicada Correctamente!' : 'Inquiry Submitted Successfully!'}
                  </h4>
                  <p className="text-xs mt-1 text-emerald-700 dark:text-emerald-300">
                    {language === 'es'
                      ? 'Número de radicado: #PQRS-2025-' + Math.floor(1000 + Math.random() * 9000) + '. La secretaría responderá a su correo registrado.'
                      : 'Ticket #PQRS-2025-' + Math.floor(1000 + Math.random() * 9000) + '. We will reply to your email shortly.'}
                  </p>
                  <button
                    onClick={() => { setTicketSent(false); setTicketSubject(''); setTicketMessage(''); }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    {language === 'es' ? 'Enviar otra consulta' : 'Send another inquiry'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'es' ? 'Asunto o Motivo de la Solicitud' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder={language === 'es' ? 'Ej. Duda sobre documentos para grado 6°' : 'E.g., Query about 6th grade documents'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {language === 'es' ? 'Mensaje o Detalle' : 'Message Details'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder={language === 'es' ? 'Describa su solicitud o indique su radicado de matrícula...' : 'Describe your request or provide your enrollment ID...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'es' ? 'Radicar Solicitud' : 'Submit Ticket'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
