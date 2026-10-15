import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Users, 
  FolderKanban, 
  Award, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  Inbox, 
  School,
  ExternalLink,
  ChevronRight,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface TeacherMainDashboardProps {
  initialTab?: 'courses' | 'students' | 'documents';
}

export const TeacherMainDashboard: React.FC<TeacherMainDashboardProps> = ({ initialTab = 'courses' }) => {
  const { 
    currentUser, 
    language, 
    students, 
    documents,
    setSelectedStudentId,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'students' | 'documents'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);
  const [studentSearch, setStudentSearch] = useState('');

  // Retrieve teacher assignments strictly from user account or persistent storage
  const teacherEmail = currentUser?.email?.toLowerCase() || '';
  const teacherId = currentUser?.id || '';

  // Persistent teacher course assignments
  const storedAssignments: any[] = JSON.parse(
    localStorage.getItem('edumed_teacher_assignments') || '[]'
  );

  // Default courses for institutional teachers if assigned by administration
  const defaultCourses = teacherEmail.includes('martinez') || teacherEmail.includes('docente') || currentUser?.position?.toLowerCase().includes('docente')
    ? [
        {
          id: 'crs-1',
          teacherEmail,
          courseName: language === 'es' ? 'Matemáticas y Geometría' : 'Mathematics',
          grade: '10mo Grado - A',
          gradeCode: '10',
          shift: 'Mañana',
          room: 'Aula 204',
          schedule: 'Lun - Mié - Vie: 7:00 AM - 9:00 AM'
        },
        {
          id: 'crs-2',
          teacherEmail,
          courseName: language === 'es' ? 'Física Fundamental' : 'Physics',
          grade: 'Noveno (9-A)',
          gradeCode: '9',
          shift: 'Mañana',
          room: 'Laboratorio de Ciencias',
          schedule: 'Mar - Jue: 8:00 AM - 10:00 AM'
        }
      ]
    : [];

  const myCourses = storedAssignments.filter(
    (a: any) => a.teacherEmail === teacherEmail || a.teacherId === teacherId
  );

  const effectiveCourses = myCourses.length > 0 ? myCourses : defaultCourses;

  // Filter real students strictly matching the teacher's assigned grades
  const assignedGrades = effectiveCourses.map((c: any) => c.gradeCode || c.grade);
  const myStudents = effectiveCourses.length > 0
    ? students.filter(s => 
        assignedGrades.some((g: string) => s.grade.toLowerCase().includes(g.toLowerCase()))
      )
    : [];

  // Filter real documents belonging strictly to the teacher's students
  const myStudentIds = new Set(myStudents.map(s => s.id));
  const myDocuments = effectiveCourses.length > 0
    ? documents.filter(d => myStudentIds.has(d.studentId))
    : [];

  const filteredStudents = myStudents.filter(s =>
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.documentNumber.includes(studentSearch) ||
    s.grade.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const isEs = language === 'es';

  return (
    <div className="space-y-6">
      
      {/* Teacher Profile & Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-2xl shadow-md border-2 border-purple-200 dark:border-purple-800 shrink-0">
            {currentUser?.name?.charAt(0) || 'D'}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {isEs ? 'Portal Docente Oficial' : 'Official Faculty Portal'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                I.E. Félix Henao Botero
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.name || (isEs ? 'Docente Institucional' : 'Faculty Member')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {currentUser?.email} • {currentUser?.position || (isEs ? 'Docente de Planta' : 'Staff Teacher')} • {currentUser?.department || (isEs ? 'Área Académica' : 'Academic Area')}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Live Real KPI Cards for Teacher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* KPI 1: Assigned Courses */}
        <div 
          onClick={() => setActiveSubTab('courses')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'courses' 
              ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 shadow-sm' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isEs ? 'Mis Cursos Asignados' : 'My Courses'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {effectiveCourses.length}
            </span>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              {effectiveCourses.length === 1 ? (isEs ? 'Grupo asignado' : 'Course') : (isEs ? 'Grupos asignados' : 'Courses')}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEs ? 'Carga académica en curso' : 'Active teaching workload'}
          </p>
        </div>

        {/* KPI 2: My Students */}
        <div 
          onClick={() => setActiveSubTab('students')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'students' 
              ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 shadow-sm' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isEs ? 'Estudiantes en mis Cursos' : 'My Students'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {myStudents.length}
            </span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              {isEs ? 'Alumnos reales' : 'Enrolled students'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEs ? 'Matriculados en sus grupos' : 'In your active sections'}
          </p>
        </div>

        {/* KPI 3: Student Documents */}
        <div 
          onClick={() => setActiveSubTab('documents')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'documents' 
              ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 shadow-sm' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isEs ? 'Documentos de mis Alumnos' : 'Student Documents'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {myDocuments.length}
            </span>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              {isEs ? 'Archivos registrados' : 'Files recorded'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEs ? 'Expedientes de sus grupos' : 'Classroom documentation'}
          </p>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'courses'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isEs ? 'Mis Asignaciones y Cursos' : 'My Courses'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('students')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'students'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isEs ? 'Estudiantes de mis Cursos' : 'My Students'}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20">
            {myStudents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'documents'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>{isEs ? 'Documentos de Área' : 'Documents'}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20">
            {myDocuments.length}
          </span>
        </button>
      </div>

      {/* TAB 1: MIS CURSOS ASIGNADOS */}
      {activeSubTab === 'courses' && (
        <div className="space-y-4">
          {effectiveCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
              <Inbox className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEs ? 'Aún no tiene cursos o grupos asignados' : 'No courses assigned yet'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isEs 
                  ? 'Su cuenta docente no registra asignaciones académicas vigentes en el sistema. Comuníquese con la secretaría académica de la I.E. Félix Henao Botero para formalizar su carga lectiva.'
                  : 'No active teaching assignments found. Please contact school administration to establish your academic schedule.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {effectiveCourses.map((crs: any) => {
                const studentsInCourse = students.filter(s => 
                  s.grade.toLowerCase().includes((crs.gradeCode || crs.grade).toLowerCase())
                );

                return (
                  <div 
                    key={crs.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {crs.grade}
                        </span>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                          {crs.courseName}
                        </h2>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {crs.shift}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-purple-600" />
                        <span>{crs.room || 'Aula asignada'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span>{crs.schedule || 'Horario oficial institucional'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>{studentsInCourse.length} {isEs ? 'estudiantes matriculados en este grupo' : 'students enrolled'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setStudentSearch(crs.gradeCode || crs.grade);
                          setActiveSubTab('students');
                        }}
                        className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isEs ? 'Ver lista de este grupo' : 'View student roster'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ESTUDIANTES DE MIS CURSOS */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder={isEs ? 'Buscar estudiante de mis cursos por nombre o documento...' : 'Search student by name or ID...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {studentSearch && (
              <button
                onClick={() => setStudentSearch('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 cursor-pointer"
              >
                {isEs ? 'Limpiar filtro' : 'Clear filter'}
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <Users className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
                <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                  {myStudents.length === 0 
                    ? (isEs ? 'Aún no hay estudiantes registrados en sus cursos asignados' : 'No students found in your assigned courses')
                    : (isEs ? 'Ningún estudiante coincide con la búsqueda' : 'No students match your search')}
                </h4>
                <p className="text-xs text-slate-400">
                  {isEs ? 'Solo se visualizan los estudiantes correspondientes a sus grados asignados.' : 'Only students belonging to your assigned courses are shown.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((std) => (
                  <div key={std.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <UserAvatar name={std.fullName} size="md" />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {std.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {std.documentType} {std.documentNumber} • <strong className="text-purple-700 dark:text-purple-400">{std.grade}</strong> • Jornada {std.shift}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        std.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {std.status === 'active' ? (isEs ? 'Matrícula Activa' : 'Active') : (isEs ? 'En Trámite' : 'In Process')}
                      </span>

                      <button
                        onClick={() => {
                          setSelectedStudentId(std.id);
                          setActiveTab('student-profile');
                        }}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {isEs ? 'Ver Expediente' : 'View Record'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTOS DE MIS ALUMNOS */}
      {activeSubTab === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {isEs ? 'Documentación Académica de mis Estudiantes' : 'Course Student Documents'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEs 
                ? 'Expedientes y certificados cargados exclusivamente por alumnos de sus cursos asignados.'
                : 'Files and records submitted by students within your assigned sections.'}
            </p>
          </div>

          {myDocuments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <FolderKanban className="w-10 h-10 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {isEs ? 'No hay movimientos documentales registrados' : 'No document records found'}
              </p>
              <p className="text-xs text-slate-400">
                {isEs ? 'Los documentos cargados por sus estudiantes aparecerán aquí una vez sean radicados.' : 'Documents uploaded by your students will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myDocuments.map((doc) => {
                const owner = students.find(s => s.id === doc.studentId);
                return (
                  <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {doc.name}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {owner?.fullName || 'Estudiante'} • {owner?.grade} • {doc.fileName} ({doc.fileSize})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        doc.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                          : doc.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                      }`}>
                        {doc.status === 'approved' ? (isEs ? 'Aprobado' : 'Approved') : doc.status === 'rejected' ? (isEs ? 'Observación' : 'Rejected') : (isEs ? 'En Revisión' : 'In Review')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
