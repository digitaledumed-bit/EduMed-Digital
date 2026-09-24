import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  Edit3, 
  RotateCcw, 
  User, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  FileText, 
  Users, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  Check,
  RefreshCw
} from 'lucide-react';
import { AvatarChangeModal } from '../common/AvatarChangeModal';
import { StudentEditProfileModal } from './StudentEditProfileModal';
import { getDefaultAvatarByGender, isMaleGender, isFemaleGender } from '../../utils/avatarUtils';

interface StudentMainDashboardProps {
  onResetEnrollmentForTest?: () => void;
}

export const StudentMainDashboard: React.FC<StudentMainDashboardProps> = ({
  onResetEnrollmentForTest
}) => {
  const { currentUser, language, students, setActiveTab, resetStudentEnrollment } = useApp();

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<'grades' | 'schedule' | 'documents' | 'guardian'>('grades');
  const [feedback, setFeedback] = useState<string | null>(null);

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
    admissionDate: '2024-01-15'
  };

  const studentName = currentUser?.name || student.fullName;
  const studentGender = currentUser?.gender || student.gender || 'Masculino';
  const defaultIllustratedAvatar = getDefaultAvatarByGender(studentGender);
  const currentAvatar = currentUser?.avatarUrl || defaultIllustratedAvatar;

  const isMale = isMaleGender(studentGender);
  const isFemale = isFemaleGender(studentGender);

  const subjects = [
    { id: 'mat', name: 'Matemáticas y Geometría', teacher: 'Lic. Claudia Restrepo', score: 4.8, period: 'Periodo 1', status: 'Superior' },
    { id: 'esp', name: 'Lengua Castellana y Literatura', teacher: 'Prof. Gabriel Arango', score: 4.5, period: 'Periodo 1', status: 'Alto' },
    { id: 'cie', name: 'Ciencias Naturales y Química', teacher: 'Dra. Patricia Botero', score: 4.7, period: 'Periodo 1', status: 'Superior' },
    { id: 'soc', name: 'Ciencias Sociales e Historia', teacher: 'Lic. Fernando Zapata', score: 4.2, period: 'Periodo 1', status: 'Alto' },
    { id: 'ing', name: 'Inglés Comunicativo B1', teacher: 'Prof. Diana Henao', score: 4.9, period: 'Periodo 1', status: 'Superior' },
    { id: 'tec', name: 'Tecnología e Informática', teacher: 'Ing. Carlos Medina', score: 5.0, period: 'Periodo 1', status: 'Superior' }
  ];

  const scheduleDays = [
    { day: 'Lunes', items: ['Matemáticas (6:30 - 8:30)', 'Lengua Castellana (8:30 - 10:00)', 'Descanso (10:00 - 10:30)', 'Química (10:30 - 12:30)'] },
    { day: 'Martes', items: ['Inglés (6:30 - 8:30)', 'Ciencias Sociales (8:30 - 10:00)', 'Descanso (10:00 - 10:30)', 'Informática (10:30 - 12:30)'] },
    { day: 'Miércoles', items: ['Educación Física (6:30 - 8:30)', 'Matemáticas (8:30 - 10:00)', 'Descanso (10:00 - 10:30)', 'Física (10:30 - 12:30)'] },
    { day: 'Jueves', items: ['Filosofía (6:30 - 8:30)', 'Lengua Castellana (8:30 - 10:00)', 'Descanso (10:00 - 10:30)', 'Biología (10:30 - 12:30)'] },
    { day: 'Viernes', items: ['Ética y Valores (6:30 - 8:30)', 'Artes (8:30 - 10:00)', 'Descanso (10:00 - 10:30)', 'Dirección de Grupo (10:30 - 12:30)'] }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. PARTE SUPERIOR: PANEL PRINCIPAL PERSONALIZADO DEL ESTUDIANTE           */}
      {/* Exact User Specification:                                                 */}
      {/* - Avatar del estudiante (ilustrado o fotografía seleccionada)             */}
      {/* - Nombre completo del estudiante (real de la cuenta)                      */}
      {/* - Opción para editar el perfil                                            */}
      {/* - Opción para cambiar la foto de perfil                                   */}
      {/* - [AVATAR] Nombre Completo - Estudiante                                   */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Avatar + Real Student Name + Role */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            
            {/* Interactive Avatar with Gender Badge & Camera button */}
            <div className="relative group shrink-0">
              <img
                src={currentAvatar}
                alt={studentName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500/90 shadow-xl bg-slate-100 dark:bg-slate-800 transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultIllustratedAvatar;
                }}
              />
              
              {/* Gender badge */}
              <div className="absolute -bottom-2 -left-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-md border border-slate-700">
                {isMale ? '♂ Hombre' : isFemale ? '♀ Mujer' : '🎓 Neutro'}
              </div>

              {/* Quick camera button */}
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all hover:scale-110 cursor-pointer"
                title="Cambiar foto de perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Real Account Student Name and Badges */}
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" />
                  Estudiante
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matrícula 100% Completada
                </span>
              </div>

              {/* Exact full name from account */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {studentName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {student.documentType} {student.documentNumber} • Grado <strong className="text-slate-800 dark:text-slate-200">{student.grade}</strong> • Jornada {student.shift}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {student.birthDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {student.neighborhood}
                </span>
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  {isMale ? '♂ Sexo: Masculino (Hombre)' : isFemale ? '♀ Sexo: Femenino (Mujer)' : '🎓 Sexo: No especificado'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Mandatory Profile Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-center md:self-auto w-full sm:w-auto">
            
            {/* 1. Botón "Cambiar foto de perfil" */}
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span>Cambiar foto de perfil</span>
            </button>

            {/* 2. Botón "Editar perfil" */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Editar perfil</span>
            </button>

            {/* Reset / Test Enrollment Gate Button for Demonstration */}
            {onResetEnrollmentForTest && (
              <button
                type="button"
                onClick={onResetEnrollmentForTest}
                className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Simula que la matrícula no ha sido completada para verificar la pantalla de 6 pasos obligatorios"
              >
                <RefreshCw className="w-3 h-3 text-amber-600" />
                <span>Simular matrícula incompleta</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* KPI Cards: Student Academic Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Estado Matrícula</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">Activa 100%</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Vigente año escolar 2025</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Promedio General</span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
              ★
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">4.7 / 5.0</span>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5 font-bold">Desempeño Superior</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Asistencia a Clases</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              %
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">98.4%</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Excelente cumplimiento</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Documentos</span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
              🗂
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">4 de 4</span>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">Aprobados por secretaría</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher for Student Content */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTabSection('grades')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTabSection === 'grades'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mis Asignaturas y Calificaciones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('schedule')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTabSection === 'schedule'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Horario de Clases</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('documents')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTabSection === 'documents'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documentos y Matrícula</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('guardian')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTabSection === 'guardian'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Acudiente Vinculado</span>
        </button>
      </div>

      {/* SECTION 1: GRADES */}
      {activeTabSection === 'grades' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Informe Académico Vigente (Periodo 1 - 2025)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calificaciones registradas por los docentes de la I.E. Félix Henao Botero
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
              Grado 10°A
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3">Asignatura</th>
                  <th className="pb-3">Docente Titular</th>
                  <th className="pb-3 text-center">Nota (1.0 - 5.0)</th>
                  <th className="pb-3 text-right">Desempeño</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{sub.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-400 font-medium">
                      {sub.teacher}
                    </td>
                    <td className="py-3.5 text-center font-black text-slate-900 dark:text-white text-base">
                      {sub.score.toFixed(1)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: SCHEDULE */}
      {activeTabSection === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Horario Escolar Semanal • Jornada Mañana
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Horario de entrada: 6:30 AM • Salida: 12:30 PM • Salón 204
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {scheduleDays.map((sch) => (
              <div key={sch.day} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2.5 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  {sch.day}
                </h4>
                <div className="space-y-2">
                  {sch.items.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 shadow-2xs">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: DOCUMENTS & OFFICIAL ENROLLMENT RECEIPT */}
      {activeTabSection === 'documents' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Comprobante Oficial y Documentos de Matrícula
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Radicado institucional oficial generado para el año lectivo 2025
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert(`Comprobante de matrícula institucional para ${studentName} (Radicado #MAT-2025-4821) listo para imprimir.`)}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Certificado de Matrícula</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                Código de Radicado Oficial
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                #MAT-2025-4821
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Registrado en SIMAT - Secretaría de Educación de Medellín
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Póliza Estudiantil Institucional
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                Seguros del Estado • Póliza No. 9028-2025
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Cobertura médica accidentes escolares 24/7
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: GUARDIAN */}
      {activeTabSection === 'guardian' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Acudiente Principal Vinculado
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Persona responsable ante la institución educativa para citaciones y seguimiento.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-lg shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                Padre / Acudiente Principal
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Carlos Eduardo Ramírez
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                CC 1.034.567.890 • Teléfono: 300 123 4567 • carlos.ramirez@email.com
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dirección: Calle 45 # 12-34, Boston (Convive con el estudiante)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Cambiar Foto de Perfil (Dispositivo, Previa, Confirmar, Restaurar) */}
      <AvatarChangeModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        studentName={studentName}
        studentGender={studentGender}
        currentAvatarUrl={currentAvatar}
      />

      {/* MODAL 2: Editar Perfil */}
      <StudentEditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

    </div>
  );
};
