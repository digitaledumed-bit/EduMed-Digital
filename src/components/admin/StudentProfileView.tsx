import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Edit3, 
  FileText, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  HeartPulse, 
  GraduationCap, 
  Calendar, 
  User, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const StudentProfileView: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    guardians,
    selectedStudentId, 
    setSelectedStudentId, 
    setActiveTab,
    currentUser
  } = useApp();

  const [feedbackToast, setFeedbackToast] = React.useState<string | null>(null);

  // Strict student resolution based purely on user's authentic data
  const resolveStudent = () => {
    if (currentUser?.role === 'student') {
      return (
        students.find(
          (s) => s.id === currentUser.id ||
                 (currentUser.documentNumber && s.documentNumber && s.documentNumber.replace(/\D/g, '') === currentUser.documentNumber.replace(/\D/g, '')) ||
                 (currentUser.email && s.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
                 (s.fullName && currentUser.name && s.fullName.toLowerCase() === currentUser.name.toLowerCase())
        ) || null
      );
    }

    if (currentUser?.role === 'guardian') {
      const myGuardian = guardians.find(
        (g) => (currentUser.documentNumber && g.documentNumber && g.documentNumber.replace(/\D/g, '') === currentUser.documentNumber.replace(/\D/g, '')) ||
               (currentUser.email && g.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
               (g.fullName && currentUser.name && g.fullName.toLowerCase() === currentUser.name.toLowerCase())
      );
      if (myGuardian && myGuardian.associatedStudents?.length > 0) {
        const foundChild = students.find((s) => s.id === myGuardian.associatedStudents[0].id);
        if (foundChild) return foundChild;
      }
      return (
        students.find((s) => s.guardians?.some((g) => 
          (currentUser.email && g.email?.toLowerCase() === currentUser.email.toLowerCase()) || 
          (currentUser.name && g.name && g.name.toLowerCase() === currentUser.name.toLowerCase())
        )) || null
      );
    }

    // Admin / Directivo: free to select any student
    if (selectedStudentId) {
      const found = students.find((s) => s.id === selectedStudentId);
      if (found) return found;
    }
    return students.length > 0 ? students[0] : null;
  };

  const student = resolveStudent();

  if (!student) {
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-200 dark:border-teal-800">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {language === 'es' ? 'No hay estudiante matriculado aún' : 'No student enrolled yet'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          {language === 'es'
            ? 'Actualmente no tienes ningún estudiante matriculado asociado a tu cuenta. Puedes iniciar el proceso de matrícula oficial en este momento.'
            : 'You do not have any enrolled student associated with your account. You can start the enrollment process now.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('wizard')}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            {language === 'es' ? 'Iniciar Nueva Matrícula' : 'Start New Enrollment'}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            {language === 'es' ? 'Consultar Estado' : 'Check Status'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        {currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('students')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.admin.studentProfile.breadcrumbs}</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white">{student.fullName}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span>{currentUser?.role === 'student' ? (language === 'es' ? 'Portal Estudiante' : 'Student Portal') : (language === 'es' ? 'Portal Acudiente' : 'Guardian Portal')}</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white">{student.fullName}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('status')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Ver Estado de Matrícula' : 'View Enrollment Status'}</span>
          </button>

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => setFeedbackToast(language === 'es' ? 'Ficha académica en modo de edición directiva.' : 'Academic file in editing mode.')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.admin.studentProfile.editProfile}</span>
            </button>
          ) : (
            <button
              onClick={() => setFeedbackToast(language === 'es' ? 'Para actualizar datos personales o de contacto, por favor radique la solicitud ante la secretaría de la I.E. Félix Henao Botero.' : 'To update personal info, please request at school secretary office.')}
              className="px-3.5 py-1.5 rounded-lg border border-teal-500/50 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Solicitar Actualización' : 'Request Update'}</span>
            </button>
          )}
        </div>
      </div>

      {feedbackToast && (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-700 text-xs font-semibold text-teal-900 dark:text-teal-200 flex items-center justify-between">
          <span>{feedbackToast}</span>
          <button onClick={() => setFeedbackToast(null)} className="underline text-[11px] font-bold ml-2 cursor-pointer">Cerrar</button>
        </div>
      )}

      {/* Main Student Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <UserAvatar 
            name={student.fullName} 
            size="xl" 
            className="rounded-2xl border-2 border-teal-500 shadow-md" 
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {student.fullName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                student.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : student.status === 'in_process'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {t.statuses[student.status]}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {student.documentType} {student.documentNumber} • {student.grade} • Jornada {student.shift}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {student.birthDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {student.neighborhood}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Academic Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t.admin.studentProfile.academicInfo}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.currentGrade}</span>
              <span className="font-bold text-slate-900 dark:text-white">{student.grade}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.wizard.fields.shift}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.shift}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.admissionDate}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.admissionDate}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.previousInstitution}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.previousSchool || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact & Health Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {language === 'es' ? 'Contacto y Salud' : 'Contact & Health'}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.bloodType}</span>
              <span className="font-bold text-teal-700 dark:text-teal-400">{student.bloodType}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.medicalConditions}</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{student.medicalNotes || t.admin.studentProfile.noneReported}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.address}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.address} ({student.neighborhood})</span>
            </div>

            <div>
              <span className="text-slate-400 block text-xs">{t.admin.studentProfile.studentPhone}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.phone}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Associated Guardians (Acudientes Asociados) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t.admin.studentProfile.associatedGuardians}
          </h2>

          <button
            onClick={() => setActiveTab('link-guardian')}
            className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.admin.studentProfile.addGuardian}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.guardians.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {g.name}
                  </span>
                  {g.isPrimary && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {t.admin.studentProfile.primaryGuardian}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {g.relationship} • {g.livesWithStudent ? (language === 'es' ? 'Convive con estudiante' : 'Lives with student') : ''}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <a
                  href={`tel:${g.phone}`}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-600 font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{g.phone}</span>
                </a>

                <a
                  href={`mailto:${g.email}`}
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-teal-600 font-medium truncate max-w-[150px]"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  <span>{g.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
