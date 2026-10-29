import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Search, 
  Award, 
  LifeBuoy, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  FilePlus, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen, 
  FileText,
  User,
  HeartHandshake,
  UserX,
  ArrowRight
} from 'lucide-react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';
import { Student } from '../../types';

export const GuardianMainDashboard: React.FC = () => {
  const { 
    currentUser, 
    language, 
    students, 
    guardians,
    enrollments,
    setActiveTab, 
    setSelectedStudentId,
    isWidgetEnabled,
    hasPermission
  } = useApp();

  const isEs = language === 'es';
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Find students linked and enrolled under this guardian
  const guardianEmail = currentUser?.email?.toLowerCase().trim() || '';
  const guardianName = currentUser?.name?.toLowerCase().trim() || '';
  const guardianDocDigits = (currentUser?.documentNumber || '').replace(/\D/g, '');

  const linkedStudents = students.filter(student => {
    // 1. Check if student's guardian list explicitly references this guardian
    const hasInStudentGuardians = student.guardians && student.guardians.some(g => {
      const gEmail = (g.email || '').toLowerCase().trim();
      const gName = (g.name || '').toLowerCase().trim();
      const gPhoneDigits = (g.phone || '').replace(/\D/g, '');
      const userPhoneDigits = (currentUser?.phone || '').replace(/\D/g, '');

      return (guardianEmail && gEmail === guardianEmail) || 
             (guardianName && gName && (gName.includes(guardianName) || guardianName.includes(gName))) ||
             (userPhoneDigits && gPhoneDigits && userPhoneDigits === gPhoneDigits);
    });
    if (hasInStudentGuardians) return true;

    // 2. Check if a guardian profile in the system belongs to this user and has associated students
    const matchingGuardian = guardians.find(g => {
      const gEmail = (g.email || '').toLowerCase().trim();
      const gName = (g.fullName || g.name || '').toLowerCase().trim();
      const gDocDigits = (g.documentNumber || '').replace(/\D/g, '');
      return (guardianEmail && gEmail === guardianEmail) ||
             (guardianDocDigits && gDocDigits && guardianDocDigits === gDocDigits) ||
             (guardianName && gName && (gName.includes(guardianName) || guardianName.includes(gName)));
    });
    if (matchingGuardian && matchingGuardian.associatedStudents?.some(as => as.id === student.id)) {
      return true;
    }

    // 3. Check if there is an enrollment record submitted by this guardian for this student
    const hasEnrollment = enrollments.some(e => {
      const eGuardianEmail = (e.guardianEmail || '').toLowerCase().trim();
      const eGuardianName = (e.guardianName || '').toLowerCase().trim();
      const eGuardianDocDigits = (e.guardianDoc || '').replace(/\D/g, '');

      const isGuardianMatch = (guardianEmail && eGuardianEmail === guardianEmail) ||
        (guardianDocDigits && eGuardianDocDigits && guardianDocDigits === eGuardianDocDigits) ||
        (guardianName && eGuardianName && (eGuardianName.includes(guardianName) || guardianName.includes(eGuardianName)));

      return isGuardianMatch && (e.studentId === student.id || e.studentDoc === student.documentNumber);
    });
    if (hasEnrollment) return true;

    return false;
  });

  // Strict requirement: No students appear if they haven't been enrolled/linked!
  const effectiveStudents: Student[] = linkedStudents;

  const handlePrintCertificate = (student: Student) => {
    setDownloadSuccessToast(student.fullName || student.firstName);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4500);
  };

  const handleViewStudentProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab('student-profile');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-bottom duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">
              {isEs ? 'Comprobante Oficial Generado' : 'Official Certificate Generated'}
            </p>
            <p className="text-emerald-100 text-xs">
              {isEs 
                ? `Certificado de matrícula para ${downloadSuccessToast} listo para imprimir.` 
                : `Enrollment certificate for ${downloadSuccessToast} ready for printing.`}
            </p>
          </div>
          <button 
            onClick={() => setDownloadSuccessToast(null)}
            className="ml-auto text-emerald-200 hover:text-white font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Welcome Card */}
      {isWidgetEnabled('guardian', 'welcome-hero') && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-teal-700/50">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Users className="w-3.5 h-3.5 text-teal-300" />
                <span>{isEs ? 'Portal del Acudiente y Familia' : 'Guardian & Family Portal'}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                {isEs ? `¡Bienvenido(a), ${currentUser?.name || 'Acudiente'}!` : `Welcome, ${currentUser?.name || 'Guardian'}!`}
              </h1>
              
              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal">
                {isEs 
                  ? 'Desde este portal oficial puedes consultar el estado de matrícula de tus hijos, verificar su radicado oficial, descargar certificados y acceder a los beneficios educativos de la I.E. Félix Henao Botero.'
                  : 'From this official portal you can check your children’s enrollment status, verify their official registration, download certificates, and access school benefits.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-teal-200/90">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  <span>{isEs ? 'Año Escolar Activo: 2026' : 'Active School Year: 2026'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  <span>{isEs ? 'Acudiente Oficial Autorizado' : 'Authorized Guardian'}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('wizard')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-teal-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-900/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FilePlus className="w-4 h-4 text-teal-950" />
                <span>{isEs ? 'Inscribir Nuevo Estudiante' : 'Enroll New Student'}</span>
              </button>

              <button
                onClick={() => setActiveTab('status')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer backdrop-blur-xs"
              >
                <Search className="w-4 h-4 text-teal-300" />
                <span>{isEs ? 'Consultar por Radicado' : 'Lookup by Docket'}</span>
              </button>
            </div>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -top-12 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
        </div>
      )}

      {/* Section: Linked Students */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{isEs ? 'Estudiantes a Tu Cargo' : 'Students Under Your Care'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isEs 
                ? 'Hijos o acudidos registrados en la I.E. Félix Henao Botero para el año lectivo.' 
                : 'Children or dependents registered at I.E. Félix Henao Botero for the academic year.'}
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 font-bold text-xs">
            {effectiveStudents.length} {isEs ? (effectiveStudents.length === 1 ? 'estudiante matriculado' : 'estudiantes matriculados') : 'enrolled student(s)'}
          </span>
        </div>

        {/* Student Cards Grid or Empty State */}
        {effectiveStudents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {effectiveStudents.map((student) => {
              const avatarSrc = student.avatarUrl || getDefaultAvatarByGender(student.gender);
              const isApproved = student.status === 'active' || student.status === 'in_process';
              const docketNumber = student.id === 'std-6' ? 'MAT-2026-0842' : student.id === 'std-4' ? 'MAT-2026-0119' : `MAT-2026-0${student.documentNumber.slice(-3)}`;

              return (
                <div 
                  key={student.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Status bar */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isApproved 
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Matrícula Oficial Activa' : 'Official Active Enrollment'}</span>
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {docketNumber}
                    </span>
                  </div>

                  {/* Main info row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative shrink-0">
                      <img 
                        src={avatarSrc} 
                        alt={student.fullName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-teal-500/40 bg-slate-100 dark:bg-slate-800 shadow-sm"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getDefaultAvatarByGender(student.gender);
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                        ✓
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                        {student.fullName || `${student.firstName} ${student.lastName}`}
                      </h3>

                      <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                        {student.grade || '10°A Básica Secundaria'} • {student.shift || 'Jornada Mañana'}
                      </p>

                      <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{student.documentType || 'T.I.'}:</span>
                          <span className="font-mono">{student.documentNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Radicado:</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">RAD-2026-{student.documentNumber.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-5">
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isEs ? 'Grupo / Aula' : 'Classroom'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{isEs ? 'Aula 204 - Bloque B' : 'Room 204 - Block B'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{isEs ? 'Director de Grupo' : 'Head Teacher'}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Prof. Carlos Restrepo</span>
                    </div>
                  </div>

                  {/* Actions with min-h-[44px] touch targets */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleViewStudentProfile(student.id)}
                      className="w-full sm:flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEs ? 'Ver Horario y Notas' : 'View Schedule & Grades'}</span>
                    </button>

                    {hasPermission('guardian', 'canDownloadCertificates') && (
                      <button
                        onClick={() => handlePrintCertificate(student)}
                        className="w-full sm:w-auto min-h-[44px] py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        title={isEs ? 'Descargar comprobante oficial de matrícula' : 'Download official enrollment certificate'}
                      >
                        <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        <span>{isEs ? 'Certificado Oficial' : 'Official Certificate'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-8 sm:p-10 text-center space-y-5 shadow-xs backdrop-blur-xs">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto shadow-xs">
              <UserX className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isEs ? 'No tienes estudiantes a cargo inscritos actualmente' : 'No Enrolled Students Under Your Care'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {isEs 
                  ? 'Aún no registras ningún estudiante formalmente inscrito o vinculado a tu cuenta en la I.E. Félix Henao Botero para el año lectivo 2026. Inicia una nueva solicitud de matrícula o consulta el estado de un radicado previo.'
                  : 'You do not have any registered students linked to your account at I.E. Félix Henao Botero for the 2026 school year. Start a new enrollment application or look up an existing application.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('wizard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-900/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FilePlus className="w-4 h-4" />
                <span>{isEs ? 'Comenzar Inscripción de Estudiante' : 'Start Student Enrollment'}</span>
              </button>

              <button
                onClick={() => setActiveTab('status')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>{isEs ? 'Consultar por Radicado' : 'Lookup by Docket'}</span>
              </button>
            </div>

            {/* Quick 3-Step Guide */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center mb-1.5 text-[11px]">1</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{isEs ? 'Formulario Oficial' : 'Official Form'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{isEs ? 'Ingresa los datos del estudiante y acudiente.' : 'Enter student and guardian details.'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center mb-1.5 text-[11px]">2</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{isEs ? 'Adjuntar Documentos' : 'Upload Documents'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{isEs ? 'Carga documento de identidad, EPS y notas.' : 'Attach ID document, EPS, and grades.'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center mb-1.5 text-[11px]">3</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{isEs ? 'Radicación y Cupo' : 'Formalization'}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{isEs ? 'Obtén tu número oficial y seguimiento institucional.' : 'Get your docket number and official confirmation.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Practical Family Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
        
        {/* Module 1: Documentación y Matrícula */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 border border-teal-200 dark:border-teal-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">
              {isEs ? 'Expediente y Documentos' : 'Files & Documents'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {isEs 
                ? 'Gestiona y consulta los documentos oficiales de tus acudidos con vista previa interactiva y opción de adjuntar nuevos soportes.'
                : 'Manage and review your children’s official documents with live preview and upload options.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('documents')}
            className="w-full py-2.5 px-4 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{isEs ? 'Ver y Subir Documentos' : 'View & Upload Documents'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 2: Beneficios y Alimentación Escolar (PAE) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">
              {isEs ? 'Beneficios y PAE' : 'Benefits & School Meals'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {isEs 
                ? 'Accede a los programas oficiales de la Alcaldía de Medellín: Alimentación Escolar (PAE), transporte escolar, seguro estudiantil y dotaciones.'
                : 'Access official educational programs: School meals (PAE), student transportation, insurance, and equipment subsidies.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('beneficios')}
            className="w-full py-2.5 px-4 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{isEs ? 'Conocer Beneficios' : 'Explore Benefits'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Module 3: Atención y Secretaría */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">
              {isEs ? 'Secretaría y Soporte' : 'Admissions & Help'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {isEs 
                ? 'Atención a familias en la sede principal: Lunes a Viernes de 7:00 a.m. a 1:00 p.m. Canales de comunicación directa con coordinadores y rectoría.'
                : 'Family support at main campus: Monday to Friday from 7:00 AM to 1:00 PM. Direct contact channels with teachers and leadership.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('soporte')}
            className="w-full py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{isEs ? 'Canales de Atención' : 'Contact Admissions'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Institutional Campus & Calendar Notice */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-850 p-6 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Institución Educativa Félix Henao Botero
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calle 50 # 38-45, Barrio Boston, Medellín • Teléfono: (604) 239 1234
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('institucion')}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          {isEs ? 'Ver Información de la Institución' : 'View School Details'}
        </button>
      </div>

    </div>
  );
};
