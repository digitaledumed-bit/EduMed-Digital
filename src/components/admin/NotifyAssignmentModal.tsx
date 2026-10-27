import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  BellRing, 
  Send, 
  CheckCircle2, 
  GraduationCap, 
  Sun, 
  Clock, 
  User, 
  Building2, 
  Mail, 
  Smartphone, 
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StudentAssignmentTarget {
  id: string;
  studentName: string;
  studentDoc?: string;
  studentEmail?: string;
  grade?: string;
  shift?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

interface NotifyAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: StudentAssignmentTarget;
}

export const NotifyAssignmentModal: React.FC<NotifyAssignmentModalProps> = ({
  isOpen,
  onClose,
  initialStudent
}) => {
  const { students, language, notifyStudentAssignment } = useApp();
  const isEs = language === 'es';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudent?.id || '');
  const [assignedGrade, setAssignedGrade] = useState<string>(initialStudent?.grade || '10°A');
  const [assignedShift, setAssignedShift] = useState<string>(initialStudent?.shift || 'Mañana');
  const [classroom, setClassroom] = useState<string>('Salón 204');
  const [homeroomTeacher, setHomeroomTeacher] = useState<string>('Lic. Claudia Restrepo');
  const [customNote, setCustomNote] = useState<string>('');
  
  // Channels
  const [channelPortal, setChannelPortal] = useState<boolean>(true);
  const [channelEmail, setChannelEmail] = useState<boolean>(true);
  const [channelGuardian, setChannelGuardian] = useState<boolean>(true);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Sync state whenever opened or student changes
  useEffect(() => {
    if (isOpen) {
      if (initialStudent) {
        setSelectedStudentId(initialStudent.id);
        setAssignedGrade(initialStudent.grade || '10°A');
        setAssignedShift(initialStudent.shift || 'Mañana');
      } else if (students.length > 0) {
        const first = students[0];
        setSelectedStudentId(first.id);
        setAssignedGrade(first.grade || '10°A');
        setAssignedShift(first.shift || 'Mañana');
      }
      setSentSuccess(false);
      setIsSending(false);
    }
  }, [isOpen, initialStudent, students]);

  if (!isOpen) return null;

  // Selected student details
  const currentStudent = students.find(s => s.id === selectedStudentId) || {
    id: initialStudent?.id || 'std-1',
    fullName: initialStudent?.studentName || 'Estudiante Seleccionado',
    documentNumber: initialStudent?.studentDoc || '1035982147',
    email: initialStudent?.studentEmail || 'estudiante@edumed.edu.co',
    grade: assignedGrade,
    shift: assignedShift,
    guardians: initialStudent?.guardianName ? [{ name: initialStudent.guardianName, phone: initialStudent.guardianPhone }] : []
  };

  const getShiftHours = (shift: string) => {
    if (shift === 'Tarde') return '12:30 PM - 6:30 PM';
    if (shift === 'Única') return '7:00 AM - 3:00 PM';
    return '6:30 AM - 12:30 PM';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      notifyStudentAssignment({
        studentId: currentStudent.id,
        studentName: currentStudent.fullName,
        studentDoc: currentStudent.documentNumber,
        studentEmail: currentStudent.email,
        grade: assignedGrade,
        shift: assignedShift,
        classroom,
        homeroomTeacher,
        customNote
      });

      setIsSending(false);
      setSentSuccess(true);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // no-op
      }

      setTimeout(() => {
        onClose();
      }, 1600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5 sm:p-6 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shadow-xs border border-teal-300 dark:border-teal-800">
              <BellRing className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isEs ? 'Avisar Asignación de Grado y Jornada' : 'Notify Student of Grade & Shift Placement'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs 
                  ? 'Notificación oficial enviada directamente al portal y correo del estudiante' 
                  : 'Official placement notification sent to student portal and email'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Success Banner */}
          {sentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {isEs 
                  ? `✓ ¡Aviso oficial enviado exitosamente a ${currentStudent.fullName}! Se notificó el grado ${assignedGrade} y la jornada ${assignedShift}.` 
                  : `✓ Official assignment notification sent to ${currentStudent.fullName}!`}
              </span>
            </div>
          )}

          {/* Student Selector / Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {isEs ? 'Estudiante Destinatario' : 'Target Student'}
            </span>

            {initialStudent ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {currentStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Doc: {currentStudent.documentNumber} • {currentStudent.email}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold self-start sm:self-auto">
                  {currentStudent.grade || assignedGrade} • {currentStudent.shift || assignedShift}
                </span>
              </div>
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  const s = students.find(item => item.id === e.target.value);
                  if (s) {
                    setSelectedStudentId(s.id);
                    setAssignedGrade(s.grade || '10°A');
                    setAssignedShift(s.shift || 'Mañana');
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} - {s.documentNumber} ({s.grade} • {s.shift})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Assignment Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Grado Asignado */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>{isEs ? 'Grado que le correspondió:' : 'Assigned Grade:'}</span>
              </label>
              <select
                value={assignedGrade}
                onChange={(e) => setAssignedGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-300 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Transición">Transición (Preescolar)</option>
                <option value="1°">Primero (1°)</option>
                <option value="2°">Segundo (2°)</option>
                <option value="3°">Tercero (3°)</option>
                <option value="4°">Cuarto (4°)</option>
                <option value="5°">Quinto (5°)</option>
                <option value="6°">Sexto (6°)</option>
                <option value="7°">Séptimo (7°)</option>
                <option value="8°">Octavo (8°)</option>
                <option value="9°">Noveno (9°)</option>
                <option value="10°A">Décimo A (10°A)</option>
                <option value="10°B">Décimo B (10°B)</option>
                <option value="11°A">Undécimo A (11°A)</option>
                <option value="11°B">Undécimo B (11°B)</option>
              </select>
            </div>

            {/* Jornada que le correspondió */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>{isEs ? 'Jornada que le correspondió:' : 'Assigned Shift:'}</span>
              </label>
              <select
                value={assignedShift}
                onChange={(e) => setAssignedShift(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
              >
                <option value="Mañana">Jornada Mañana (6:30 AM - 12:30 PM)</option>
                <option value="Tarde">Jornada Tarde (12:30 PM - 6:30 PM)</option>
                <option value="Única">Jornada Única (7:00 AM - 3:00 PM)</option>
              </select>
            </div>

            {/* Aula / Salón */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{isEs ? 'Aula / Salón asignado:' : 'Assigned Classroom:'}</span>
              </label>
              <input
                type="text"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder="Ej. Salón 204"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Director(a) de Grupo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                <span>{isEs ? 'Director(a) de Grupo:' : 'Homeroom Teacher:'}</span>
              </label>
              <input
                type="text"
                value={homeroomTeacher}
                onChange={(e) => setHomeroomTeacher(e.target.value)}
                placeholder="Ej. Lic. Claudia Restrepo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Canales de notificación */}
          <div>
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {isEs ? 'Canales de Notificación Simultáneos:' : 'Notification Channels:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                channelPortal 
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelPortal}
                  onChange={(e) => setChannelPortal(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <BellRing className="w-4 h-4 shrink-0 text-teal-600" />
                <span>{isEs ? 'Portal Estudiante' : 'Student Portal'}</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                channelEmail 
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelEmail}
                  onChange={(e) => setChannelEmail(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <Mail className="w-4 h-4 shrink-0 text-teal-600" />
                <span>{isEs ? 'Correo Electrónico' : 'Email'}</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                channelGuardian 
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 font-bold' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}>
                <input
                  type="checkbox"
                  checked={channelGuardian}
                  onChange={(e) => setChannelGuardian(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <Smartphone className="w-4 h-4 shrink-0 text-teal-600" />
                <span>{isEs ? 'Aviso al Acudiente' : 'Guardian Copy'}</span>
              </label>
            </div>
          </div>

          {/* Live Preview of the notification message */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isEs ? 'Vista Previa del Aviso que verá el Estudiante:' : 'Student Message Preview:'}</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/40 text-slate-700 dark:text-slate-300 space-y-1 font-mono text-[11px] leading-relaxed">
              <p>
                <strong>Asunto:</strong> Asignación Oficial: Grado {assignedGrade} - Jornada {assignedShift} (SIMAT 2026)
              </p>
              <p className="pt-1">
                Hola <strong>{currentStudent.fullName}</strong>, la Secretaría Académica de la <strong>I.E. Félix Henao Botero</strong> te informa que has sido asignado(a) formalmente en el <strong>Grado {assignedGrade}</strong> en la <strong>Jornada {assignedShift}</strong> ({getShiftHours(assignedShift)}) en el <strong>{classroom}</strong>. Docente titular: <strong>{homeroomTeacher}</strong>.
              </p>
              {customNote && (
                <p className="pt-1 text-teal-700 dark:text-teal-400">
                  <em>Nota: {customNote}</em>
                </p>
              )}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isEs ? 'Nota o instrucción complementaria (opcional):' : 'Optional note for student:'}
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={isEs ? 'Ej. Traer documento original el primer día de clases' : 'e.g. Bring original ID on first day'}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {isEs ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSending || sentSuccess}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>
                {isSending 
                  ? (isEs ? 'Enviando aviso...' : 'Sending...') 
                  : (isEs ? 'Avisar al Estudiante' : 'Send Notification')}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
