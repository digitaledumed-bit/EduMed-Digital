import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Download, 
  Info,
  Calendar,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StatusLookup: React.FC = () => {
  const { t, language, lookupEnrollmentStatus, setActiveTab, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState(currentUser?.documentNumber || '');
  const [unauthorizedMsg, setUnauthorizedMsg] = useState<string | null>(null);
  const [downloadedToast, setDownloadedToast] = useState(false);
  
  // Resolve initial enrollment only if current logged-in user has an actual record
  const resolveInitialResult = () => {
    if (currentUser?.documentNumber) {
      const found = lookupEnrollmentStatus(currentUser.documentNumber);
      if (found) return found;
    }
    if (currentUser?.email) {
      const found = lookupEnrollmentStatus(currentUser.email);
      if (found) return found;
    }
    return null;
  };

  const initialRecord = resolveInitialResult();
  const [searched, setSearched] = useState(!!initialRecord);
  const [result, setResult] = useState<ReturnType<typeof lookupEnrollmentStatus>>(initialRecord);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUnauthorizedMsg(null);

    const term = searchQuery.trim();
    if (!term) {
      setSearched(true);
      setResult(resolveInitialResult());
      return;
    }

    setSearched(true);
    const found = lookupEnrollmentStatus(term);

    // Enforce data isolation for Student role
    if (currentUser?.role === 'student' && found) {
      const isMyRecord = 
        (currentUser.documentNumber && found.studentDoc === currentUser.documentNumber) ||
        (currentUser.email && found.studentEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
        found.studentName.toLowerCase().includes(currentUser.name.toLowerCase());

      if (!isMyRecord) {
        setUnauthorizedMsg(
          language === 'es'
            ? 'Acceso restringido: Desde el Portal Estudiante solo tienes autorización para consultar tu propio expediente y trámite de matrícula.'
            : 'Access restricted: From the Student Portal you can only view your own enrollment file.'
        );
        setResult(null);
        return;
      }
    }

    // Enforce data isolation for Guardian role
    if (currentUser?.role === 'guardian' && found) {
      const isMyChild =
        (currentUser.documentNumber && (found.guardianDoc === currentUser.documentNumber || found.studentDoc === currentUser.documentNumber)) ||
        (currentUser.email && found.guardianEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
        found.guardianName.toLowerCase().includes(currentUser.name.toLowerCase());

      if (!isMyChild) {
        setUnauthorizedMsg(
          language === 'es'
            ? 'Acceso restringido: Desde el Portal Acudiente solo tienes autorización para consultar los radicados y matrículas asociadas a tus acudidos.'
            : 'Access restricted: From the Guardian Portal you can only view enrollments associated with your children.'
        );
        setResult(null);
        return;
      }
    }

    setResult(found);
  };

  const handleUseMyDoc = () => {
    if (currentUser?.documentNumber) {
      setUnauthorizedMsg(null);
      setSearchQuery(currentUser.documentNumber);
      setSearched(true);
      const found = lookupEnrollmentStatus(currentUser.documentNumber);
      setResult(found);
    }
  };

  const isAllStepsCompleted = result && (result.status === 'approved' || result.status === 'completed');

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 py-10 sm:py-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 mb-4 shadow-xs">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.statusLookup.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t.statusLookup.subtitle}
          </p>
        </div>

        {/* Search Box - Sin ejemplos de búsqueda */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="status-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Ingrese el documento de identidad o el código de radicado (#MAT...)' : 'Enter document number or application code (#MAT...)'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <button
              id="status-search-submit"
              type="submit"
              disabled={!searchQuery.trim()}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              {t.statusLookup.searchBtn}
            </button>
          </div>

          {/* Opción rápida si el usuario está autenticado */}
          {currentUser?.documentNumber && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>
                {language === 'es' ? 'Sesión activa como:' : 'Signed in as:'}{' '}
                <strong className="text-slate-700 dark:text-slate-200">{currentUser.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleUseMyDoc}
                className="text-teal-700 dark:text-teal-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Consultar mi documento' : 'Search my document'}</span>
              </button>
            </div>
          )}
        </form>

        {/* State: Not Searched Yet */}
        {!searched && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-4 border border-teal-200 dark:border-teal-800">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {language === 'es' ? 'Verificación de Matrículas Escolares' : 'School Enrollment Verification'}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              {language === 'es'
                ? 'Consulte el estado del proceso en tiempo real para verificar el cumplimiento de los tres puntos obligatorios: Registro Inicial, En Revisión y Aprobación Final, junto con los datos del acudiente y el año académico asignado.'
                : 'Check the real-time status of the 3 official milestones: Initial Registration, Under Review, and Final Approval, including guardian details and academic year.'}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t.statusLookup.step1}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'es' ? 'Radicación de formulario e información' : 'Official registration form'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t.statusLookup.step2}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'es' ? 'Validación documental y paz y salvo' : 'Document and financial validation'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">3</div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{t.statusLookup.step3}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'es' ? 'Asignación de cupo y legalización' : 'Seat allocation and approval'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searched && (
          <div>
            {result ? (
              <div className="space-y-6">
                
                {/* 1. NOTIFICACIÓN CUANDO YA SE CUMPLIERON TODOS LOS PUNTOS */}
                {isAllStepsCompleted ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 dark:border-emerald-600 shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-base sm:text-lg font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <span>{language === 'es' ? '¡Todos los puntos han sido cumplidos con éxito!' : 'All steps have been successfully completed!'}</span>
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </h2>
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 uppercase tracking-wider">
                            100% Completado • Matrícula Aprobada
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 mt-1 leading-relaxed">
                          {language === 'es'
                            ? 'Se han cumplido a cabalidad las 3 etapas del proceso institucional: Registro Inicial, En Revisión y Aprobación Final. El estudiante cuenta con cupo oficial otorgado y matrícula legalizada en la I.E. Félix Henao Botero.'
                            : 'All 3 stages have been successfully fulfilled: Initial Registration, Under Review, and Final Approval. The student has an official enrolled seat.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-xs flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100">
                        {language === 'es' ? 'Proceso de Matrícula en Curso' : 'Enrollment in Progress'}
                      </h3>
                      <p className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-0.5 leading-relaxed">
                        {language === 'es'
                          ? 'El Punto 1 (Registro Inicial) fue completado. Actualmente el Punto 2 (En Revisión) se encuentra en validación. Una vez finalice satisfactoriamente, se habilitará el Punto 3 (Aprobación Final).'
                          : 'Step 1 (Initial Registration) is complete. Step 2 (Under Review) is currently being validated.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. CARD PRINCIPAL CON STEPPER DE LOS 3 PUNTOS Y DETALLES */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  
                  {/* Encabezado del resultado */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {t.statusLookup.radicado}:
                        </span>
                        <span className="text-base font-extrabold text-teal-700 dark:text-teal-400">
                          {result.id}
                        </span>
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {result.studentName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.wizard.fields.docNumber}: <span className="font-semibold">{result.studentDoc}</span> • Grado: <span className="font-semibold">{result.grade}</span>
                      </div>
                    </div>

                    {/* Estado de la Matrícula Badge */}
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[11px] text-slate-400 mb-1">
                        {t.statusLookup.lastUpdate}: {result.lastUpdated}
                      </span>
                      <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
                        result.status === 'approved' || result.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : result.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}>
                        {result.status === 'approved' || result.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                        ) : result.status === 'rejected' ? (
                          <XCircle className="w-4 h-4 mr-1.5 text-rose-600 dark:text-rose-400" />
                        ) : (
                          <Clock className="w-4 h-4 mr-1.5 animate-pulse text-amber-600 dark:text-amber-400" />
                        )}
                        <span>
                          {result.status === 'approved' || result.status === 'completed'
                            ? (language === 'es' ? 'Aprobada Oficialmente' : 'Approved')
                            : result.status === 'rejected'
                            ? (language === 'es' ? 'Con Observaciones' : 'Observations')
                            : (language === 'es' ? 'En Revisión' : 'In Review')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* 3. STEPPER VISUAL DE LOS 3 PUNTOS: REGISTRO INICIAL, EN REVISIÓN Y APROBACIÓN FINAL */}
                  <div className="p-6 sm:p-8">
                    
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>{language === 'es' ? 'Puntos del Proceso Institucional' : 'Institutional Milestones'}</span>
                      </h3>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {isAllStepsCompleted 
                          ? (language === 'es' ? '3 de 3 puntos cumplidos' : '3 of 3 steps completed')
                          : (language === 'es' ? '1 de 3 puntos cumplidos' : '1 of 3 steps completed')}
                      </span>
                    </div>

                    <div className="relative">
                      {/* Barra de progreso de fondo */}
                      <div className="overflow-hidden h-2.5 mb-8 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                        <div 
                          style={{ 
                            width: isAllStepsCompleted 
                              ? '100%' 
                              : result.status === 'rejected' 
                              ? '66%' 
                              : '50%' 
                          }} 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                            isAllStepsCompleted
                              ? 'bg-emerald-500'
                              : result.status === 'rejected'
                              ? 'bg-rose-500'
                              : 'bg-teal-600'
                          }`}
                        />
                      </div>

                      {/* Las 3 Columnas de los Puntos */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                        
                        {/* PUNTO 1: Registro Inicial */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950/80">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="mt-2.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            1. {t.statusLookup.step1}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {language === 'es' ? 'Cumplido' : 'Fulfilled'}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {result.submissionDate}
                          </span>
                        </div>

                        {/* PUNTO 2: En Revisión */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                            isAllStepsCompleted
                              ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/80'
                              : result.status === 'rejected'
                              ? 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950/80'
                              : 'bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-950/80'
                          }`}>
                            {isAllStepsCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : result.status === 'rejected' ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5 animate-pulse" />
                            )}
                          </div>
                          <span className="mt-2.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            2. {t.statusLookup.step2}
                          </span>
                          <span className={`text-[11px] font-bold mt-0.5 ${
                            isAllStepsCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : result.status === 'rejected'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-teal-600 dark:text-teal-400'
                          }`}>
                            {isAllStepsCompleted 
                              ? (language === 'es' ? 'Cumplido' : 'Fulfilled')
                              : result.status === 'rejected'
                              ? (language === 'es' ? 'Observaciones' : 'Observation')
                              : (language === 'es' ? 'En proceso' : 'In progress')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {language === 'es' ? 'Validación documental' : 'Document verification'}
                          </span>
                        </div>

                        {/* PUNTO 3: Aprobación Final */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                            isAllStepsCompleted
                              ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/80'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {isAllStepsCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>3</span>
                            )}
                          </div>
                          <span className="mt-2.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            3. {t.statusLookup.step3}
                          </span>
                          <span className={`text-[11px] font-bold mt-0.5 ${
                            isAllStepsCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {isAllStepsCompleted 
                              ? (language === 'es' ? 'Cumplido' : 'Fulfilled')
                              : (language === 'es' ? 'Pendiente' : 'Pending')}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {isAllStepsCompleted 
                              ? (language === 'es' ? 'Cupo oficial otorgado' : 'Seat officially assigned')
                              : (language === 'es' ? 'Paso final' : 'Final step')}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* 4. LOS 4 REQUERIMIENTOS EXPLÍCITOS: 
                        1) Año académico
                        2) Información del acudiente
                        3) Estado de la matrícula
                        4) Fecha de registro
                    */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                      
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{language === 'es' ? 'Detalles Oficiales del Registro' : 'Official Record Details'}</span>
                        </h4>
                        <span className="text-xs text-slate-400">I.E. Félix Henao Botero</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* ITEM 1: AÑO ACADÉMICO */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {language === 'es' ? 'Año Académico' : 'Academic Year'}
                            </span>
                          </div>
                          <div className="text-lg font-black text-slate-900 dark:text-white">
                            {result.academicYear || '2024 - 2025'}
                          </div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            Grado: <span className="font-bold">{result.grade}</span> • Jornada Mañana
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            Calendario A • Secretaría de Educación de Medellín
                          </div>
                        </div>

                        {/* ITEM 2: ESTADO DE LA MATRÍCULA */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {language === 'es' ? 'Estado de la Matrícula' : 'Enrollment Status'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                              isAllStepsCompleted
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                                : result.status === 'rejected'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                            }`}>
                              {isAllStepsCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : result.status === 'rejected' ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 animate-pulse" />
                              )}
                              <span>
                                {isAllStepsCompleted 
                                  ? (language === 'es' ? 'Aprobada Oficialmente' : 'Approved')
                                  : (language === 'es' ? 'En Revisión' : 'In Review')}
                              </span>
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                            {result.notes || (isAllStepsCompleted
                              ? (language === 'es' ? 'Matrícula activa y formalizada con cupo escolar asignado.' : 'Enrollment active and finalized.')
                              : (language === 'es' ? 'Documentación en verificación por coordinación.' : 'Under administrative verification.'))}
                          </div>
                        </div>

                        {/* ITEM 3: INFORMACIÓN DEL ACUDIENTE */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
                            <UserCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {language === 'es' ? 'Información del Acudiente' : 'Guardian Information'}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {result.guardianName || 'Carlos Eduardo Ramírez'}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Parentesco: <span className="font-semibold text-slate-700 dark:text-slate-300">{result.guardianRelationship || 'Padre / Acudiente Principal'}</span>
                          </div>
                          <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium">Documento:</span>
                              <span className="font-semibold">{result.guardianDoc || 'CC 1.034.567.890'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{result.guardianPhone || '+57 300 123 4567'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{result.guardianEmail || 'acudiente@ejemplo.com'}</span>
                            </div>
                          </div>
                        </div>

                        {/* ITEM 4: FECHA DE REGISTRO */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {language === 'es' ? 'Fecha de Registro' : 'Registration Date'}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {result.submissionDate}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Radicado oficial: <span className="font-bold text-teal-700 dark:text-teal-400">{result.id}</span>
                          </div>
                          <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            <div>
                              <span className="text-slate-400 font-medium">Última actualización:</span>{' '}
                              <span className="font-semibold">{result.lastUpdated}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">Modalidad:</span>{' '}
                              <span>Plataforma Digital Institucional</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Información y soporte */}
                    <div className="mt-6 p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs sm:text-sm text-teal-900 dark:text-teal-200 flex items-start gap-3">
                      <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">
                          {t.statusLookup.infoTitle}
                        </span>
                        <p className="leading-relaxed">
                          {isAllStepsCompleted
                            ? (language === 'es' 
                                ? 'La matrícula ha sido formalizada en su totalidad. Puede descargar su comprobante oficial firmado digitalmente o acercarse a la secretaría del colegio si requiere certificados físicos adicionales.'
                                : 'Enrollment has been fully processed. You may download your digitally signed receipt or contact the school office.')
                            : (result.notes || t.statusLookup.infoDesc)}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setActiveTab('wizard')}
                        className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <FileText className="w-4 h-4" />
                        {language === 'es' ? 'Radicar Otra Matrícula' : 'Submit Another Enrollment'}
                      </button>

                      <button
                        onClick={() => setDownloadedToast(true)}
                        className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {language === 'es' ? 'Descargar Comprobante PDF' : 'Download PDF Receipt'}
                      </button>
                    </div>

                    {downloadedToast && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                        <span>{language === 'es' ? '✓ Comprobante oficial de matrícula generado y listo para impresión.' : '✓ Official enrollment receipt generated and ready.'}</span>
                        <button onClick={() => setDownloadedToast(false)} className="text-emerald-700 dark:text-emerald-300 underline font-bold text-[11px] ml-2">Cerrar</button>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            ) : unauthorizedMsg ? (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border-2 border-rose-300 dark:border-rose-800/80 text-center shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-rose-900 dark:text-rose-200">
                  {language === 'es' ? 'Acceso Restringido por Portal' : 'Restricted Portal Access'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {unauthorizedMsg}
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUnauthorizedMsg(null);
                      setSearchQuery(currentUser?.documentNumber || '');
                      setResult(resolveInitialResult());
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer"
                  >
                    {language === 'es' ? 'Ver mi expediente autorizado' : 'View my authorized file'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'es' ? 'Registro no encontrado' : 'Record Not Found'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  {language === 'es'
                    ? `No se encontró ningún registro para "${searchQuery}". Verifique que el documento de identidad o el código de radicado (#MAT...) esté escrito correctamente.`
                    : t.statusLookup.notFound}
                </p>
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearched(false); }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {language === 'es' ? 'Limpiar y nueva búsqueda' : 'Clear and search again'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

