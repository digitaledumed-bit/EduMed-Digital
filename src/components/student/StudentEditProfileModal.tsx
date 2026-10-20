import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  ShieldCheck,
  GraduationCap,
  Clock,
  Sun,
  AlertCircle,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';

interface StudentEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvatarModal?: () => void;
}

export const StudentEditProfileModal: React.FC<StudentEditProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAvatarModal
}) => {
  const { currentUser, language, students } = useApp();
  const isEs = language === 'es';

  if (!isOpen || !currentUser) return null;

  // Find linked student record if available
  const student = students.find(
    s => s.id === currentUser.id ||
         (currentUser.documentNumber && s.documentNumber === currentUser.documentNumber) ||
         (currentUser.email && s.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
         (currentUser.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase()))
  ) || {
    id: currentUser.id || 'std-current',
    fullName: currentUser.name || 'Estudiante EduMed',
    documentType: 'TI',
    documentNumber: currentUser.documentNumber || '1035982147',
    gender: currentUser.gender || 'Masculino',
    grade: '10°A',
    shift: 'Mañana',
    birthDate: '12/04/2008',
    phone: currentUser.phone || '315 987 6543',
    email: currentUser.email || 'estudiante@edumed.edu.co',
    address: 'Calle 45 # 12-34',
    neighborhood: 'Boston'
  };

  const currentAvatar = currentUser.avatarUrl || getDefaultAvatarByGender(student.gender);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-2xl relative text-slate-900 dark:text-white my-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isEs ? 'Ficha Oficial del Estudiante' : 'Official Student Record'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Expediente institucional verificado ante el SIMAT' : 'Institutional record verified in SIMAT'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Notice Banner: Non-editable info rule */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-100">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{isEs ? 'Información Institucional Protegida (Solo Lectura)' : 'Protected Institutional Record (Read-Only)'}</span>
          </div>
          <p className="leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
            {isEs 
              ? 'Por políticas institucionales y del Ministerio de Educación, la información personal, datos de matrícula, grado y jornada están protegidos contra modificaciones por parte del estudiante. Cualquier rectificación debe tramitarse presencialmente en Secretaría Académica.'
              : 'By institutional policy, student personal data, grade, and shift cannot be modified by the student. Any corrections must be processed with the Academic Office.'}
          </p>
          <div className="pt-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{isEs ? 'Única acción autorizada: Cambiar tu foto de perfil.' : 'Only allowed action: Change your profile photo.'}</span>
          </div>
        </div>

        {/* Student Identity Overview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <img 
            src={currentAvatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md bg-white dark:bg-slate-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </h3>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              {student.documentType} {student.documentNumber}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-[11px] font-bold">
                {isEs ? 'Grado:' : 'Grade:'} {student.grade}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                {isEs ? 'Jornada:' : 'Shift:'} {student.shift}
              </span>
            </div>
          </div>
        </div>

        {/* Read-Only Information Fields */}
        <div className="space-y-3">
          {/* Nombre completo */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {isEs ? 'Nombre Completo del Estudiante:' : 'Full Student Name:'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
              </span>
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-not-allowed select-none">
              {currentUser.name}
            </div>
          </div>

          {/* Grado y Jornada asignada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  {isEs ? 'Grado Asignado:' : 'Assigned Grade:'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
                </span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-sm font-black text-teal-900 dark:text-teal-200 cursor-not-allowed select-none">
                {student.grade} (Educación Media)
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  {isEs ? 'Jornada Asignada:' : 'Assigned Shift:'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
                </span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm font-black text-amber-900 dark:text-amber-200 cursor-not-allowed select-none">
                {isEs ? `Jornada ${student.shift}` : `${student.shift} Shift`}
              </div>
            </div>
          </div>

          {/* Contacto: Teléfono y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {isEs ? 'Teléfono Registrado:' : 'Registered Phone:'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
                </span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed select-none">
                {currentUser.phone || student.phone || '315 987 6543'}
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {isEs ? 'Correo Institucional:' : 'School Email:'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
                </span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed select-none truncate">
                {currentUser.email || student.email || 'estudiante@edumed.edu.co'}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {isEs ? 'Dirección y Barrio:' : 'Address & Neighborhood:'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> {isEs ? 'Bloqueado' : 'Locked'}
              </span>
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed select-none">
              {student.address} • Barrio {student.neighborhood}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons: Only Change Photo allowed or Close */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center"
          >
            {isEs ? 'Cerrar Ficha' : 'Close Record'}
          </button>

          {onOpenAvatarModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAvatarModal();
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isEs ? 'Cambiar Foto de Perfil' : 'Change Profile Photo'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
