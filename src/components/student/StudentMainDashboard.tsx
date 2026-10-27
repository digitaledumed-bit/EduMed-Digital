import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Sun, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Info,
  Printer,
  User,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { 
  getDefaultAvatarByGender, 
  isMaleGender, 
  isFemaleGender 
} from '../../utils/avatarUtils';

interface StudentMainDashboardProps {
  onResetEnrollmentForTest?: () => void;
}

export const StudentMainDashboard: React.FC<StudentMainDashboardProps> = () => {
  const { 
    currentUser, 
    language, 
    students
  } = useApp();

  const isEs = language === 'es';

  // Obtain student real data from database or currentUser
  const student = students.find(
    s => s.id === currentUser?.id ||
         (currentUser?.documentNumber && s.documentNumber === currentUser.documentNumber) ||
         (currentUser?.email && s.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
         (currentUser?.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase()))
  ) || {
    id: currentUser?.id || 'std-current',
    fullName: currentUser?.name || 'Estudiante EduMed',
    firstName: currentUser?.name ? currentUser.name.split(' ')[0] : 'Estudiante',
    lastName: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') : '',
    documentType: 'TI',
    documentNumber: currentUser?.documentNumber || '1035982147',
    gender: currentUser?.gender || 'Masculino',
    grade: '10°A',
    shift: 'Mañana',
    birthDate: '12/04/2008',
    bloodType: 'O+',
    phone: currentUser?.phone || '315 987 6543',
    email: currentUser?.email || 'estudiante@edumed.edu.co',
    address: 'Calle 45 # 12-34',
    neighborhood: 'Boston',
    status: 'active',
    admissionDate: '2025-01-15'
  };

  // Details regarding student shift and schedule
  const getShiftDetails = (shift: string) => {
    if (shift === 'Tarde') {
      return {
        name: isEs ? 'Jornada Tarde' : 'Afternoon Shift',
        hours: '12:30 PM - 6:30 PM',
        entry: '12:30 PM',
        exit: '6:30 PM',
        classroom: 'Salón 204',
        homeroomTeacher: 'Lic. Claudia Restrepo',
        breakTime: '3:30 PM - 4:00 PM',
        typeLabel: isEs ? 'Horario Vespertino' : 'Afternoon Schedule',
        description: isEs 
          ? 'Horario oficial vespertino para grado 10°A de Educación Media' 
          : 'Official afternoon shift schedule for grade 10°A'
      };
    }
    if (shift === 'Única') {
      return {
        name: isEs ? 'Jornada Única' : 'Full Day Shift',
        hours: '7:00 AM - 3:00 PM',
        entry: '7:00 AM',
        exit: '3:00 PM',
        classroom: 'Salón 204',
        homeroomTeacher: 'Lic. Claudia Restrepo',
        breakTime: '10:00 AM - 10:30 AM',
        typeLabel: isEs ? 'Jornada Continua' : 'Full Day Schedule',
        description: isEs 
          ? 'Horario extendido oficial con servicio de restaurante escolar PAE' 
          : 'Official full day shift schedule with lunch program'
      };
    }
    return {
      name: isEs ? 'Jornada Mañana' : 'Morning Shift',
      hours: '6:30 AM - 12:30 PM',
      entry: '6:30 AM',
      exit: '12:30 PM',
      classroom: 'Salón 204',
      homeroomTeacher: 'Lic. Claudia Restrepo',
      breakTime: '10:00 AM - 10:30 AM',
      typeLabel: isEs ? 'Horario Matutino' : 'Morning Schedule',
      description: isEs 
        ? 'Horario matutino oficial de la I.E. Félix Henao Botero' 
        : 'Official morning shift schedule'
    };
  };

  const shiftInfo = getShiftDetails(student.shift);

  const studentName = currentUser?.name || student.fullName;
  const studentGender = currentUser?.gender || student.gender;
  const defaultIllustratedAvatar = getDefaultAvatarByGender(studentGender);
  const currentAvatar = currentUser?.avatarUrl || defaultIllustratedAvatar;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. TARJETA DE IDENTIFICACIÓN INSTITUCIONAL DEL ESTUDIANTE (SOLO LECTURA)  */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Avatar Institucional + Nombre + Documento */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Non-editable Avatar */}
            <div className="relative shrink-0">
              <img
                src={currentAvatar}
                alt={studentName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500/90 shadow-xl bg-slate-100 dark:bg-slate-800"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultIllustratedAvatar;
                }}
              />
            </div>

            {/* Info textual del estudiante */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" />
                  {isEs ? 'Estudiante' : 'Student'}
                </span>
                
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isEs ? 'Matrícula Oficial Activa' : 'Active Enrollment'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-600" />
                  {isEs ? 'Solo Lectura (Datos de Acudiente)' : 'Read-Only (Guardian Data)'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  SIMAT 2025 - 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {studentName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {student.documentType}: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{student.documentNumber}</span> • {student.email}
              </p>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Institución Educativa Félix Henao Botero • Sede Principal • Medellín, Colombia
              </p>
            </div>
          </div>

          {/* Botón único permitido: Imprimir Constancia de asignación */}
          <div className="flex flex-col gap-2.5 shrink-0 self-center md:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>{isEs ? 'Imprimir constancia' : 'Print certificate'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LAS DOS TARJETAS PRINCIPALES: EL GRADO Y LA JORNADA QUE LE TOCÓ        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* ================= TARJETA 1: SU GRADO ASIGNADO ================= */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 rounded-3xl border-2 border-teal-300 dark:border-teal-800/80 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 translate-x-6 -translate-y-6 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header del Grado */}
            <div className="flex items-center justify-between pb-4 border-b border-teal-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{isEs ? 'Asignación Académica' : 'Academic Allocation'}</span>
              </span>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEs ? 'Confirmado' : 'Confirmed'}</span>
              </span>
            </div>

            {/* Título de la tarjeta */}
            <div className="mt-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isEs ? 'Su Grado Asignado' : 'Assigned Grade'}
              </span>
              
              {/* Gran Valor del Grado */}
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-teal-900 dark:text-teal-100 tracking-tight">
                  {student.grade}
                </span>
                <span className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">
                  {isEs ? 'Educación Media' : 'High School'}
                </span>
              </div>
            </div>

            {/* Detalles de la asignación del grado */}
            <div className="mt-6 space-y-3 bg-white/80 dark:bg-slate-800/60 rounded-2xl p-4 border border-teal-100 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Grupo Escolar:' : 'Class Group:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Grupo {student.grade}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Aula / Salón Asignado:' : 'Assigned Classroom:'}
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                  {shiftInfo.classroom}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Sede Institucional:' : 'Campus:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-right">
                  Sede Principal (Boston)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Año Lectivo Vigente:' : 'School Year:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  2025 - 2026
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-teal-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isEs ? 'Registro SIMAT oficial' : 'Official SIMAT registry'}</span>
            <span className="font-bold text-teal-700 dark:text-teal-300">I.E. Félix Henao Botero</span>
          </div>
        </div>

        {/* ================= TARJETA 2: LA JORNADA QUE LE TOCÓ ================= */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 rounded-3xl border-2 border-amber-300 dark:border-amber-800/80 p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 translate-x-6 -translate-y-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header de la Jornada */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-black uppercase tracking-wider">
                <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{isEs ? 'Turno Escolar' : 'School Shift'}</span>
              </span>

              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{shiftInfo.typeLabel}</span>
              </span>
            </div>

            {/* Título de la tarjeta */}
            <div className="mt-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isEs ? 'Jornada que le tocó' : 'Assigned Shift'}
              </span>
              
              {/* Gran Valor de la Jornada */}
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-950 dark:text-amber-100 tracking-tight">
                  {shiftInfo.name}
                </span>
              </div>
              <p className="text-sm font-black text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{shiftInfo.hours}</span>
              </p>
            </div>

            {/* Detalles de la jornada */}
            <div className="mt-6 space-y-3 bg-white/80 dark:bg-slate-800/60 rounded-2xl p-4 border border-amber-100 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Hora de Entrada:' : 'Entry Time:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {shiftInfo.entry}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Hora de Salida:' : 'Dismissal Time:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {shiftInfo.exit}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Director(a) de Grupo:' : 'Homeroom Teacher:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {shiftInfo.homeroomTeacher}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEs ? 'Descanso / Refrigerio:' : 'Break Time:'}
                </span>
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {shiftInfo.breakTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{isEs ? 'Asistencia obligatoria' : 'Mandatory attendance'}</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">{shiftInfo.hours}</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CONSTANCIA OFICIAL DE ASIGNACIÓN (FORMATO IMPRIMIBLE)                  */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isEs ? 'Constancia Oficial de Asignación de Grado y Jornada' : 'Official Grade & Shift Allocation Notice'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Secretaría Académica • I.E. Félix Henao Botero' : 'School Admissions • I.E. Félix Henao Botero'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>{isEs ? 'Descargar / Imprimir' : 'Download / Print'}</span>
          </button>
        </div>

        {/* Texto de la constancia */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            {isEs ? (
              <>
                La Rectoría y la Secretaría Académica de la <strong>Institución Educativa Félix Henao Botero</strong> hacen constar que el/la estudiante <strong>{studentName}</strong>, con documento de identidad <strong>{student.documentType} {student.documentNumber}</strong>, tiene legalizado su cupo escolar para la vigencia actual y ha sido asignado(a) formalmente en:
              </>
            ) : (
              <>
                The Administration of <strong>I.E. Félix Henao Botero</strong> hereby certifies that student <strong>{studentName}</strong> ({student.documentType} {student.documentNumber}) is officially enrolled and assigned to:
              </>
            )}
          </p>

          <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                {isEs ? 'Grado Asignado:' : 'Assigned Grade:'}
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {student.grade} ({isEs ? 'Educación Media • Salón 204' : 'High School • Room 204'})
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                {isEs ? 'Jornada que le tocó:' : 'Assigned Shift:'}
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {shiftInfo.name} ({shiftInfo.hours})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-700/60">
            <span>DANE: 105001002345 • NIT: 890980123-1</span>
            <span>Medellín, Colombia • {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Nota informativa de restricción y solo lectura */}
        <div className="mt-4 flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {isEs 
              ? 'Modalidad Solo Lectura Institucional: Tu portal de estudiante está habilitado exclusivamente para consultar el grado y la jornada escolar que te correspondió. Toda tu información y documentación fue formalizada por tu acudiente y no puede ser modificada desde esta cuenta, ni se permite subir documentos adicionales. Si requieres alguna corrección o trámite, debe ser gestionado directamente por tu acudiente legal.'
              : 'Institutional Read-Only Mode: Your student portal is configured exclusively to check your assigned grade and school shift. All personal information and documents were submitted by your guardian and cannot be edited from this account. Any administrative update must be handled directly by your legal guardian.'}
          </p>
        </div>
      </div>

    </div>
  );
};
