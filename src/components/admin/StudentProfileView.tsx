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

export const StudentProfileView: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    selectedStudentId, 
    setSelectedStudentId, 
    setActiveTab 
  } = useApp();

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  if (!student) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">{language === 'es' ? 'Estudiante no encontrado.' : 'Student not found.'}</p>
        <button
          onClick={() => setActiveTab('students')}
          className="mt-4 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
        >
          {language === 'es' ? 'Volver al listado' : 'Back to list'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('students')}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.admin.studentProfile.breadcrumbs}</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white">{student.fullName}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('documents')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.admin.studentProfile.viewProcedures}</span>
          </button>

          <button
            onClick={() => alert(language === 'es' ? 'Modal de edición abierto.' : 'Edit modal opened.')}
            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t.admin.studentProfile.editProfile}</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={student.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
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
