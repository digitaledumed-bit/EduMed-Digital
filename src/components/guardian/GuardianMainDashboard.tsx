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
  HeartHandshake
} from 'lucide-react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';
import { Student } from '../../types';

export const GuardianMainDashboard: React.FC = () => {
  const { 
    currentUser, 
    language, 
    students, 
    setActiveTab, 
    setSelectedStudentId,
    isWidgetEnabled,
    hasPermission
  } = useApp();

  const isEs = language === 'es';
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Find students linked to this guardian
  const guardianEmail = currentUser?.email?.toLowerCase().trim() || '';
  const guardianName = currentUser?.name?.toLowerCase().trim() || '';

  const linkedStudents = students.filter(student => {
    if (!student.guardians || student.guardians.length === 0) return false;
    return student.guardians.some(g => {
      const gEmail = (g.email || '').toLowerCase().trim();
      const gName = (g.name || '').toLowerCase().trim();
      return (guardianEmail && gEmail === guardianEmail) || 
             (guardianName && (gName.includes(guardianName) || guardianName.includes(gName)));
    });
  });

  // If no students linked by exact match, provide the seed student (Mateo Restrepo std-4 or Mariana Ríos std-6) as default
  const effectiveStudents: Student[] = linkedStudents.length > 0 
    ? linkedStudents 
    : [
        students.find(s => s.id === 'std-6') || 
        students.find(s => s.id === 'std-4') || 
        students[0]
      ].filter(Boolean) as Student[];

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
                  ? 'Desde este portal oficial puedes consultar el estado de matrícula de tus hijos, verificar su radicado SIMAT, descargar certificados y acceder a los beneficios educativos de la I.E. Félix Henao Botero.'
                  : 'From this official portal you can check your children’s enrollment status, verify their SIMAT registration, download certificates, and access school benefits.'}
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

        {/* Student Cards Grid */}
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
                        <span className="font-semibold text-slate-700 dark:text-slate-300">SIMAT:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">105001-{student.documentNumber.slice(-4)}</span>
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

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleViewStudentProfile(student.id)}
                    className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Ver Horario y Notas' : 'View Schedule & Grades'}</span>
                  </button>

                  {hasPermission('guardian', 'canDownloadCertificates') && (
                    <button
                      onClick={() => handlePrintCertificate(student)}
                      className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      title={isEs ? 'Descargar comprobante oficial de matrícula' : 'Download official enrollment certificate'}
                    >
                      <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{isEs ? 'Certificado Oficial' : 'Official Certificate'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
                ? 'Todos los documentos obligatorios de tus acudidos (documento de identidad, afiliación a EPS, certificados) están verificados ante secretaría.'
                : 'All mandatory student documents (ID, health insurance, previous grade records) are verified with academic admissions.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('status')}
            className="w-full py-2.5 px-4 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>{isEs ? 'Ver Estado Documental' : 'Check Document Status'}</span>
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
