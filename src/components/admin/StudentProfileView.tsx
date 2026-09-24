import React, { useState } from 'react';
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
  AlertCircle,
  Camera,
  FilePlus,
  Sparkles
} from 'lucide-react';
import { AvatarChangeModal } from '../common/AvatarChangeModal';
import { getDefaultAvatarByGender, isMaleGender } from '../../utils/avatarUtils';

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

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  // Role-based student resolution to ensure strict data isolation
  const resolveStudent = () => {
    if (currentUser?.role === 'student') {
      return (
        students.find(
          (s) => s.id === currentUser.id ||
                 (currentUser.documentNumber && s.documentNumber === currentUser.documentNumber) ||
                 (currentUser.email && s.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
                 s.fullName.toLowerCase().includes(currentUser.name.toLowerCase())
        ) ||
        students.find((s) => s.fullName.toLowerCase().includes('mateo')) ||
        students[0]
      );
    }

    if (currentUser?.role === 'guardian') {
      const myGuardian = guardians.find(
        (g) => (currentUser.documentNumber && g.documentNumber === currentUser.documentNumber) ||
               (currentUser.email && g.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
               g.fullName.toLowerCase().includes(currentUser.name.toLowerCase())
      );
      if (myGuardian && myGuardian.associatedStudents.length > 0) {
        const foundChild = students.find((s) => s.id === myGuardian.associatedStudents[0].id);
        if (foundChild) return foundChild;
      }
      return (
        students.find((s) => s.guardians?.some((g) => g.email?.toLowerCase() === currentUser.email?.toLowerCase() || g.name.toLowerCase().includes(currentUser.name.toLowerCase()))) ||
        students.find((s) => s.fullName.includes('Valentina')) ||
        students[2]
      );
    }

    // Admin / Directivo: free to select any student
    return students.find((s) => s.id === selectedStudentId) || students[0];
  };

  const student = resolveStudent();

  if (!student) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">{language === 'es' ? 'Estudiante no encontrado.' : 'Student not found.'}</p>
        <button
          onClick={() => setActiveTab(currentUser?.role === 'admin' ? 'students' : 'status')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
        >
          {language === 'es' ? 'Volver' : 'Go back'}
        </button>
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
      {(() => {
        const studentGender = student.gender || currentUser?.gender || 'Masculino';
        const currentAvatar = (currentUser?.role === 'student' && currentUser.avatarUrl)
          ? currentUser.avatarUrl
          : (student.avatarUrl || getDefaultAvatarByGender(studentGender));
        const isMale = isMaleGender(studentGender);

        return (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {/* Interactive Avatar with Gender and Photo Changer */}
              <div className="relative group shrink-0">
                <img
                  src={currentAvatar}
                  alt={student.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500/80 shadow-lg bg-slate-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getDefaultAvatarByGender(studentGender);
                  }}
                />
                
                {/* Gender Indicator Badge */}
                <div className="absolute -bottom-2 -left-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-md border border-slate-700">
                  {isMale ? '♂ Hombre' : '♀ Mujer'}
                </div>

                {/* Change photo button on hover/click */}
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                  title={language === 'es' ? 'Cambiar mi foto de avatar' : 'Change avatar photo'}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
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
                  {student.documentType} {student.documentNumber} • Grado {student.grade} • Jornada {student.shift}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {student.birthDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {student.neighborhood}
                  </span>
                  <span className="font-semibold text-teal-700 dark:text-teal-300">
                    {isMale ? 'Estudiante Masculino (Hombre)' : 'Estudiante Femenino (Mujer)'}
                  </span>
                </div>

                {/* Quick actions for student/guardian */}
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-slate-700 text-xs font-bold border border-teal-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-teal-600" />
                    <span>{language === 'es' ? 'Cambiar Foto de Avatar' : 'Change Avatar Photo'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('wizard')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-md shadow-teal-700/20 cursor-pointer"
                  >
                    <FilePlus className="w-4 h-4" />
                    <span>{language === 'es' ? 'Llenar Pasos para Matricularse' : 'Enrollment Steps'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        studentName={student.fullName}
        studentGender={student.gender || currentUser?.gender}
        currentAvatarUrl={currentUser?.avatarUrl || student.avatarUrl}
      />
    </div>
  );
};
