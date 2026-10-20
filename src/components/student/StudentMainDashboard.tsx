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
  RefreshCw, 
  X,
  Paperclip,
  Trash2,
  UploadCloud,
  FileCheck,
  FolderCheck,
  AlertCircle,
  XCircle,
  File,
  Loader2,
  HelpCircle,
  Upload,
  AlertTriangle,
  Eye,
  Lock,
  Sun
} from 'lucide-react';
import { AvatarChangeModal } from '../common/AvatarChangeModal';
import { StudentEditProfileModal } from './StudentEditProfileModal';
import { DocumentViewerModal } from '../common/DocumentViewerModal';
import { StudentDocument } from '../../types';
import { getDefaultAvatarByGender, isMaleGender, isFemaleGender, isDefaultIllustratedAvatar, getSavedCustomPhoto } from '../../utils/avatarUtils';

interface StudentMainDashboardProps {
  onResetEnrollmentForTest?: () => void;
}

export interface AttachedStudentFile {
  id: string;
  name: string;
  sizeFormatted: string;
  extension: string;
  rawSize: number;
  uploadedAt: string;
  file?: File;
  fileData?: string;
  fileType?: string;
}

export const StudentMainDashboard: React.FC<StudentMainDashboardProps> = ({
  onResetEnrollmentForTest
}) => {
  const { 
    currentUser, 
    language, 
    students, 
    enrollments, 
    setActiveTab, 
    resetStudentEnrollment, 
    restoreDefaultAvatar,
    documents,
    addStudentDocument,
    updateDocumentStatus
  } = useApp();

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [previewModalDoc, setPreviewModalDoc] = useState<StudentDocument | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'grades' | 'schedule' | 'documents' | 'guardian'>('grades');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Confirmation Status: 'approved' | 'rejected' | 'pending'
  const [confirmationStatus, setConfirmationStatus] = useState<'approved' | 'rejected' | 'pending'>('approved');
  const [rejectionReason] = useState<string>(
    'El certificado de paz y salvo del año escolar 2024 presenta baja resolución y los sellos de la secretaría de procedencia no son legibles.'
  );

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

  const isEs = language === 'es';

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
        breakTime: '10:00 AM - 10:30 AM • Almuerzo: 1:00 PM - 1:45 PM',
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

  const isMale = isMaleGender(studentGender);
  const isFemale = isFemaleGender(studentGender);
  const hasCustomPhoto = Boolean(
    currentUser?.id && getSavedCustomPhoto(currentUser.id, currentUser.email)
  ) || (!isDefaultIllustratedAvatar(currentAvatar));

  const handleRestoreDefault = () => {
    restoreDefaultAvatar();
    const genderLabel = isMale ? 'Masculino' : isFemale ? 'Femenino' : 'Neutro / No especificado';
    setFeedback(
      language === 'es'
        ? `✓ Fotografía personalizada eliminada. Se ha restaurado el avatar ilustrado oficial (${genderLabel}).`
        : `✓ Custom photo removed. Restored default illustrated avatar (${genderLabel}).`
    );
    setTimeout(() => setFeedback(null), 4500);
  };

  const subjects = [
    { id: 'mat', name: isEs ? 'Matemáticas y Geometría' : 'Mathematics & Geometry', teacher: 'Lic. Claudia Restrepo', score: 4.8, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Superior' : 'Top', room: 'Salón 204' },
    { id: 'esp', name: isEs ? 'Lengua Castellana y Literatura' : 'Spanish Language & Literature', teacher: 'Prof. Gabriel Arango', score: 4.5, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Alto' : 'High', room: 'Salón 204' },
    { id: 'cie', name: isEs ? 'Ciencias Naturales y Química' : 'Natural Sciences & Chemistry', teacher: 'Dra. Patricia Botero', score: 4.7, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Superior' : 'Top', room: 'Laboratorio 2' },
    { id: 'soc', name: isEs ? 'Ciencias Sociales e Historia' : 'Social Studies & History', teacher: 'Lic. Fernando Zapata', score: 4.2, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Alto' : 'High', room: 'Salón 204' },
    { id: 'ing', name: isEs ? 'Inglés Comunicativo B1' : 'Communicative English B1', teacher: 'Prof. Diana Henao', score: 4.9, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Superior' : 'Top', room: 'Aula Bilingüe' },
    { id: 'tec', name: isEs ? 'Tecnología e Informática' : 'Technology & Computer Science', teacher: 'Ing. Carlos Medina', score: 5.0, period: isEs ? 'Periodo 1' : 'Term 1', status: isEs ? 'Superior' : 'Top', room: 'Sala Sistemas 1' }
  ];

  // Weekly Schedule tailored to the student's assigned shift
  const scheduleDays = student.shift === 'Tarde' ? [
    { day: isEs ? 'Lunes' : 'Monday', items: [
      { time: '12:30 - 2:00 PM', subject: isEs ? 'Matemáticas y Cálculo' : 'Math', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '2:00 - 3:30 PM', subject: isEs ? 'Lengua Castellana' : 'Spanish', teacher: 'Prof. Gabriel Arango', room: 'Salón 204', isBreak: false },
      { time: '3:30 - 4:00 PM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '4:00 - 5:15 PM', subject: isEs ? 'Química Orgánica' : 'Chemistry', teacher: 'Dra. Patricia Botero', room: 'Laboratorio 2', isBreak: false },
      { time: '5:15 - 6:30 PM', subject: isEs ? 'Física Mecánica' : 'Physics', teacher: 'Ing. Carlos Medina', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Martes' : 'Tuesday', items: [
      { time: '12:30 - 2:00 PM', subject: isEs ? 'Inglés Comunicativo B1' : 'English', teacher: 'Prof. Diana Henao', room: 'Aula Bilingüe', isBreak: false },
      { time: '2:00 - 3:30 PM', subject: isEs ? 'Ciencias Sociales e Historia' : 'Social Studies', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false },
      { time: '3:30 - 4:00 PM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '4:00 - 5:15 PM', subject: isEs ? 'Tecnología e Informática' : 'Computer Science', teacher: 'Ing. Carlos Medina', room: 'Sala Sistemas 1', isBreak: false },
      { time: '5:15 - 6:30 PM', subject: isEs ? 'Geometría y Trigonometría' : 'Geometry', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Miércoles' : 'Wednesday', items: [
      { time: '12:30 - 2:00 PM', subject: isEs ? 'Educación Física y Deportes' : 'P.E.', teacher: 'Lic. Mateo Gallego', room: 'Cancha Polideportiva', isBreak: false },
      { time: '2:00 - 3:30 PM', subject: isEs ? 'Matemáticas y Geometría' : 'Math', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '3:30 - 4:00 PM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '4:00 - 5:15 PM', subject: isEs ? 'Física Experimental' : 'Physics', teacher: 'Ing. Carlos Medina', room: 'Laboratorio 1', isBreak: false },
      { time: '5:15 - 6:30 PM', subject: isEs ? 'Filosofía y Ética' : 'Philosophy', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Jueves' : 'Thursday', items: [
      { time: '12:30 - 2:00 PM', subject: isEs ? 'Filosofía y Pensamiento Crítico' : 'Philosophy', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false },
      { time: '2:00 - 3:30 PM', subject: isEs ? 'Lengua Castellana y Literatura' : 'Spanish', teacher: 'Prof. Gabriel Arango', room: 'Salón 204', isBreak: false },
      { time: '3:30 - 4:00 PM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '4:00 - 5:15 PM', subject: isEs ? 'Biología Celular y Genética' : 'Biology', teacher: 'Dra. Patricia Botero', room: 'Laboratorio 2', isBreak: false },
      { time: '5:15 - 6:30 PM', subject: isEs ? 'Inglés Comunicativo B1' : 'English', teacher: 'Prof. Diana Henao', room: 'Aula Bilingüe', isBreak: false }
    ] },
    { day: isEs ? 'Viernes' : 'Friday', items: [
      { time: '12:30 - 2:00 PM', subject: isEs ? 'Ética y Cátedra de Paz' : 'Ethics', teacher: 'Lic. Marta Cardona', room: 'Salón 204', isBreak: false },
      { time: '2:00 - 3:30 PM', subject: isEs ? 'Educación Artística y Cultural' : 'Arts', teacher: 'Prof. Samuel Londoño', room: 'Taller de Artes', isBreak: false },
      { time: '3:30 - 4:00 PM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '4:00 - 5:15 PM', subject: isEs ? 'Dirección de Grupo y Convivencia' : 'Homeroom', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '5:15 - 6:30 PM', subject: isEs ? 'Tutoría Académica y Refuerzo' : 'Tutoring', teacher: 'Equipo Docente 10°A', room: 'Biblioteca Escolar', isBreak: false }
    ] }
  ] : [
    // Mañana / Default
    { day: isEs ? 'Lunes' : 'Monday', items: [
      { time: '6:30 - 8:30 AM', subject: isEs ? 'Matemáticas y Geometría' : 'Math', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '8:30 - 10:00 AM', subject: isEs ? 'Lengua Castellana' : 'Spanish', teacher: 'Prof. Gabriel Arango', room: 'Salón 204', isBreak: false },
      { time: '10:00 - 10:30 AM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '10:30 - 11:30 AM', subject: isEs ? 'Química y Ciencias Naturales' : 'Chemistry', teacher: 'Dra. Patricia Botero', room: 'Laboratorio 2', isBreak: false },
      { time: '11:30 AM - 12:30 PM', subject: isEs ? 'Física Mecánica' : 'Physics', teacher: 'Ing. Carlos Medina', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Martes' : 'Tuesday', items: [
      { time: '6:30 - 8:30 AM', subject: isEs ? 'Inglés Comunicativo B1' : 'English', teacher: 'Prof. Diana Henao', room: 'Aula Bilingüe', isBreak: false },
      { time: '8:30 - 10:00 AM', subject: isEs ? 'Ciencias Sociales e Historia' : 'Social Studies', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false },
      { time: '10:00 - 10:30 AM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '10:30 - 11:30 AM', subject: isEs ? 'Tecnología e Informática' : 'Computer Science', teacher: 'Ing. Carlos Medina', room: 'Sala Sistemas 1', isBreak: false },
      { time: '11:30 AM - 12:30 PM', subject: isEs ? 'Geometría y Trigonometría' : 'Geometry', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Miércoles' : 'Wednesday', items: [
      { time: '6:30 - 8:30 AM', subject: isEs ? 'Educación Física y Deportes' : 'P.E.', teacher: 'Lic. Mateo Gallego', room: 'Cancha Polideportiva', isBreak: false },
      { time: '8:30 - 10:00 AM', subject: isEs ? 'Matemáticas y Geometría' : 'Math', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '10:00 - 10:30 AM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '10:30 - 11:30 AM', subject: isEs ? 'Física Experimental' : 'Physics', teacher: 'Ing. Carlos Medina', room: 'Laboratorio 1', isBreak: false },
      { time: '11:30 AM - 12:30 PM', subject: isEs ? 'Filosofía y Ética' : 'Philosophy', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false }
    ] },
    { day: isEs ? 'Jueves' : 'Thursday', items: [
      { time: '6:30 - 8:30 AM', subject: isEs ? 'Filosofía y Pensamiento Crítico' : 'Philosophy', teacher: 'Lic. Fernando Zapata', room: 'Salón 204', isBreak: false },
      { time: '8:30 - 10:00 AM', subject: isEs ? 'Lengua Castellana y Literatura' : 'Spanish', teacher: 'Prof. Gabriel Arango', room: 'Salón 204', isBreak: false },
      { time: '10:00 - 10:30 AM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '10:30 - 11:30 AM', subject: isEs ? 'Biología Celular y Genética' : 'Biology', teacher: 'Dra. Patricia Botero', room: 'Laboratorio 2', isBreak: false },
      { time: '11:30 AM - 12:30 PM', subject: isEs ? 'Inglés Comunicativo B1' : 'English', teacher: 'Prof. Diana Henao', room: 'Aula Bilingüe', isBreak: false }
    ] },
    { day: isEs ? 'Viernes' : 'Friday', items: [
      { time: '6:30 - 8:30 AM', subject: isEs ? 'Ética y Cátedra de Paz' : 'Ethics', teacher: 'Lic. Marta Cardona', room: 'Salón 204', isBreak: false },
      { time: '8:30 - 10:00 AM', subject: isEs ? 'Educación Artística y Cultural' : 'Arts', teacher: 'Prof. Samuel Londoño', room: 'Taller de Artes', isBreak: false },
      { time: '10:00 - 10:30 AM', subject: isEs ? 'Descanso y Refrigerio PAE' : 'Break & Meal', teacher: 'Personal PAE', room: 'Patio Central', isBreak: true },
      { time: '10:30 - 11:30 AM', subject: isEs ? 'Dirección de Grupo y Convivencia' : 'Homeroom', teacher: 'Lic. Claudia Restrepo', room: 'Salón 204', isBreak: false },
      { time: '11:30 AM - 12:30 PM', subject: isEs ? 'Tutoría Académica y Refuerzo' : 'Tutoring', teacher: 'Equipo Docente 10°A', room: 'Biblioteca Escolar', isBreak: false }
    ] }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button 
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PARTE SUPERIOR: PANEL PRINCIPAL PERSONALIZADO DEL ESTUDIANTE           */}
      {/* Exact User Specification:                                                 */}
      {/* - Avatar del estudiante (ilustrado o fotografía seleccionada)             */}
      {/* - Nombre completo del estudiante (real de la cuenta)                      */}
      {/* - Opción para editar el perfil                                            */}
      {/* - Opción para cambiar la foto de perfil                                   */}
      {/* - Botón "Restaurar avatar predeterminado"                                  */}
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
                onClick={() => setShowAvatarModal(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-teal-500/90 shadow-xl bg-slate-100 dark:bg-slate-800 transition-transform group-hover:scale-105 cursor-pointer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = defaultIllustratedAvatar;
                }}
              />
              
              {/* Quick camera button */}
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all hover:scale-110 cursor-pointer"
                title={isEs ? 'Cambiar foto de perfil' : 'Change profile photo'}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Real Account Student Name and Badges */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" />
                  {isEs ? 'Estudiante' : 'Student'}
                </span>
                
                {hasCustomPhoto ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    {isEs ? '📷 Foto personalizada' : '📷 Custom photo'}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                    {isEs ? '🎨 Avatar oficial' : '🎨 Official avatar'}
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isEs ? 'Matrícula 100%' : 'Enrolled 100%'}
                </span>
              </div>

              {/* Exact full name from account */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {studentName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {student.documentType} {student.documentNumber} • {student.neighborhood}
              </p>

              {/* PROMINENT BADGES: GRADO ASIGNADO, JORNADA ASIGNADA Y HORARIO */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3">
                {/* 1. Su Grado */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200 shadow-2xs">
                  <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 block leading-tight">
                      {isEs ? 'Su Grado Asignado' : 'Assigned Grade'}
                    </span>
                    <span className="text-sm font-black leading-tight text-slate-900 dark:text-white">
                      {student.grade}
                    </span>
                  </div>
                </div>

                {/* 2. Jornada que le tocó */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs">
                  <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block leading-tight">
                      {isEs ? 'Jornada que le tocó' : 'Assigned Shift'}
                    </span>
                    <span className="text-sm font-black leading-tight text-slate-900 dark:text-white">
                      {shiftInfo.name} ({shiftInfo.hours})
                    </span>
                  </div>
                </div>

                {/* 3. Horario Oficial */}
                <button
                  type="button"
                  onClick={() => setActiveTabSection('schedule')}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 shadow-2xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                  title={isEs ? 'Ver horario escolar completo' : 'View full class schedule'}
                >
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block leading-tight">
                      {isEs ? 'Horario de Clases' : 'Schedule'}
                    </span>
                    <span className="text-xs font-bold leading-tight text-slate-900 dark:text-white flex items-center gap-1">
                      {shiftInfo.hours} <ChevronRight className="w-3 h-3 text-blue-500" />
                    </span>
                  </div>
                </button>
              </div>

              {/* Read-Only Notice: Info cannot be modified */}
              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>
                  {isEs 
                    ? 'Información institucional protegida: únicamente puedes cambiar tu foto de perfil.' 
                    : 'Protected student record: you can only update your profile picture.'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Allowed Actions for Student (ONLY Change Photo permitted) */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 self-center md:self-auto w-full sm:w-auto">
            
            {/* 1. Botón "Cambiar foto de perfil" (ÚNICA MODIFICACIÓN PERMITIDA) */}
            <button
              type="button"
              id="student-dashboard-btn-change-avatar"
              onClick={() => setShowAvatarModal(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>{isEs ? 'Cambiar foto de perfil' : 'Change profile photo'}</span>
            </button>

            {/* 2. Botón "Restaurar avatar predeterminado" (si tiene foto personalizada) */}
            {hasCustomPhoto && (
              <button
                type="button"
                id="student-dashboard-btn-restore-avatar"
                onClick={handleRestoreDefault}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                title={isEs ? "Restaura el avatar ilustrado oficial" : "Restores default avatar"}
              >
                <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{isEs ? 'Restaurar avatar oficial' : 'Restore official avatar'}</span>
              </button>
            )}

            {/* 3. Botón "Consultar Ficha Institucional (Solo lectura)" */}
            <button
              type="button"
              id="student-dashboard-btn-view-profile-readonly"
              onClick={() => setShowEditModal(true)}
              className="min-h-[44px] px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              title={isEs ? "Consulta los datos institucionales registrados (solo lectura)" : "View official record (read-only)"}
            >
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{isEs ? 'Ficha oficial (Solo lectura)' : 'Official record (Read-only)'}</span>
            </button>

            {/* Reset / Test Enrollment Gate Button for Demonstration */}
            {onResetEnrollmentForTest && (
              <button
                type="button"
                onClick={onResetEnrollmentForTest}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title={isEs ? "Simula que la matrícula no ha sido completada para verificar la pantalla de 6 pasos obligatorios" : "Simulate incomplete enrollment"}
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{isEs ? 'Simular matrícula incompleta' : 'Simulate incomplete enrollment'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* KPI Cards: Student Academic Status, Assigned Grade, Shift & Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Estado Matrícula */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isEs ? 'Estado Matrícula' : 'Enrollment Status'}</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{isEs ? 'Activa 100%' : 'Active 100%'}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{isEs ? 'Vigente año escolar 2025' : 'Valid school year 2025'}</p>
          </div>
        </div>

        {/* Card 2: Su Grado */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isEs ? 'Su Grado Asignado' : 'Assigned Grade'}</span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
              🎓
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-teal-700 dark:text-teal-300 tabular-nums">{student.grade}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">{isEs ? 'Educación Media • Salón 204' : 'High School • Room 204'}</p>
          </div>
        </div>

        {/* Card 3: Jornada que le tocó */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isEs ? 'Jornada que le tocó' : 'Assigned Shift'}</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              ☀️
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400 truncate block">
              {shiftInfo.name}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{shiftInfo.hours}</p>
          </div>
        </div>

        {/* Card 4: Horario Oficial */}
        <div 
          onClick={() => setActiveTabSection('schedule')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-400 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isEs ? 'Su Horario' : 'Schedule'}</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
              🕒
            </span>
          </div>
          <div className="mt-2">
            <span className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-400 tabular-nums">{shiftInfo.hours.split(' - ')[0]}</span>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-0.5 font-bold flex items-center gap-1">
              <span>{isEs ? 'Ver Horario Completo' : 'View Full Schedule'}</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher for Student Content - Horizontal scroll on mobile with touch targets */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none py-1">
        <button
          type="button"
          onClick={() => setActiveTabSection('grades')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTabSection === 'grades'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>{isEs ? 'Mis Asignaturas y Calificaciones' : 'My Subjects & Grades'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('schedule')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTabSection === 'schedule'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>{isEs ? 'Horario de Clases' : 'Class Schedule'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('documents')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTabSection === 'documents'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>{isEs ? 'Documentos y Matrícula' : 'Documents & Enrollment'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('guardian')}
          className={`shrink-0 min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTabSection === 'guardian'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>{isEs ? 'Acudiente Vinculado' : 'Linked Guardian'}</span>
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
                Calificaciones oficiales validadas por la secretaría académica de la I.E. Félix Henao Botero
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {isEs ? 'Grado' : 'Grade'} {student.grade}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {shiftInfo.name}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  {shiftInfo.classroom}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                {isEs ? `Horario Escolar Semanal • Grado ${student.grade} • ${shiftInfo.name}` : `Weekly Class Schedule • Grade ${student.grade} • ${shiftInfo.name}`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isEs 
                  ? `Entrada oficial: ${shiftInfo.entry} • Salida: ${shiftInfo.exit} • Descanso: ${shiftInfo.breakTime} • Director(a): ${shiftInfo.homeroomTeacher}`
                  : `Entry: ${shiftInfo.entry} • Dismissal: ${shiftInfo.exit} • Break: ${shiftInfo.breakTime} • Homeroom: ${shiftInfo.homeroomTeacher}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isEs ? 'Imprimir Horario' : 'Print Schedule'}</span>
            </button>
          </div>

          {/* Weekly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {scheduleDays.map((sch) => (
              <div 
                key={sch.day} 
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 mb-2.5">
                    <h4 className="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{sch.day}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {shiftInfo.entry}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sch.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2.5 rounded-xl border transition-all ${
                          item.isBreak 
                            ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 shadow-2xs hover:border-teal-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider font-mono ${
                            item.isBreak ? 'text-amber-700 dark:text-amber-300' : 'text-teal-700 dark:text-teal-400'
                          }`}>
                            {item.time}
                          </span>
                          {!item.isBreak && (
                            <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {item.room}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs font-bold block leading-snug ${
                          item.isBreak ? 'text-amber-950 dark:text-amber-100 font-black' : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.subject}
                        </span>

                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {item.teacher}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{isEs ? 'Salida:' : 'Out:'} {shiftInfo.exit}</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{shiftInfo.classroom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: DOCUMENTS & OFFICIAL ENROLLMENT RECEIPT */}
      {activeTabSection === 'documents' && (
        <div className="space-y-6">

          {/* =========================================================================
              A. SECCIÓN DE DOCUMENTOS: SOLO LECTURA Y VISUALIZACIÓN DE ARCHIVOS
              - Sin botón para subir o adjuntar archivos (Prohibido por directriz)
              - Información protegida por secretaría académica
              - Botón para visualizar los archivos montados con visor interactivo
              ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Header del área de documentos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    {isEs ? 'Expediente Institucional Oficial' : 'Official School Record'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
                    {student.grade} • {shiftInfo.name}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{isEs ? 'Expediente Documental de Matrícula (Solo Consulta)' : 'Enrollment Documents Record (Read-Only)'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isEs 
                    ? 'Visualiza y verifica los soportes oficiales radicados ante la Secretaría Académica de la institución.'
                    : 'View and verify the official documents filed with the school academic office.'}
                </p>
              </div>

              {/* Distintivo de no-subida para estudiantes */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{isEs ? 'Subida gestionada por secretaría' : 'Uploads handled by staff'}</span>
              </div>
            </div>

            {/* Aviso explicativo institucional: Sin permisos para subir documentos */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                  {isEs ? 'Gestión y Radicación Centralizada de Documentos' : 'Centralized Document Filing'}
                </span>
                <p className="leading-relaxed">
                  {isEs 
                    ? 'Por seguridad y cumplimiento ante la Secretaría de Educación de Medellín y el SIMAT, los estudiantes no tienen habilitada la opción de subir o reemplazar documentos de matrícula. Todos los soportes son recepcionados, validados y archivados exclusivamente por el personal administrativo. Puedes pulsar en "Visualizar archivo" para inspeccionar cualquier soporte radicado.'
                    : 'By policy, students cannot upload or replace enrollment documents. All files are processed and archived by administrative staff. Click "Preview file" to view filed documents.'}
                </p>
              </div>
            </div>

            {/* Documentos ya radicados y confirmados en el sistema */}
            {(() => {
              const effectiveDocs = documents.filter(
                d => d.studentId === student.id || d.studentId === 'std-current' || (currentUser?.name && d.uploadedBy?.includes(currentUser.name))
              );
              return (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isEs ? 'Documentos Radicados en la Institución' : 'Official Documents Filed'}</span>
                    </h4>
                    <span className="text-xs font-semibold text-slate-500">
                      {effectiveDocs.length} {isEs ? 'archivos' : 'files'}
                    </span>
                  </div>

                  {effectiveDocs.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                      {isEs ? 'No hay documentos radicados aún. Adjunta tus archivos arriba.' : 'No filed documents yet. Attach your files above.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {effectiveDocs.map((doc) => (
                        <div 
                          key={doc.id}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 shadow-2xs hover:border-teal-400 transition-colors"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                                  {doc.fileName.split('.').pop()?.slice(0, 3) || 'DOC'}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block" title={doc.name}>
                                    {doc.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-slate-400 truncate block mt-0.5">
                                    {doc.fileName}
                                  </span>
                                </div>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                                doc.status === 'approved'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : doc.status === 'rejected'
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              }`}>
                                {doc.status === 'approved' ? 'Aprobado' : doc.status === 'rejected' ? 'Rechazado' : 'En Revisión'}
                              </span>
                            </div>

                            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                              <span>{doc.fileSize}</span>
                              <span>•</span>
                              <span>{doc.uploadDate}</span>
                            </div>

                            {doc.status === 'rejected' && doc.rejectionReason && (
                              <div className="mt-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-800 dark:text-rose-200 space-y-1">
                                <span className="font-bold block text-rose-900 dark:text-rose-100 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  {isEs ? 'Motivo de rechazo:' : 'Rejection reason:'}
                                </span>
                                <p className="leading-snug">"{doc.rejectionReason}"</p>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewModalDoc(doc)}
                              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-teal-200 dark:border-teal-800 shadow-2xs"
                              title={isEs ? 'Visualizar archivo montado' : 'Preview file'}
                            >
                              <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>{isEs ? 'Visualizar archivo' : 'Preview file'}</span>
                            </button>

                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              <Check className="w-3 h-3" />
                              {isEs ? 'Radicado' : 'Filed'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

          </div>

          {/* =========================================================================
              B. SECCIÓN DE CONFIRMACIÓN: ESTADO CLARO DE LA SOLICITUD DE MATRÍCULA
                 - Aprobado / Approved
                 - No aprobado / Not Approved (con motivo de rechazo e instrucciones)
                 - Pendiente de revisión / Pending Review (sin marcar automáticamente)
              ========================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Encabezado y selector de estado para pruebas del sistema */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{isEs ? 'Sección de Confirmación y Estado de Matrícula' : 'Enrollment Confirmation & Status Section'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isEs 
                    ? 'El estado depende de la información real del sistema y de la decisión de la secretaría académica; no cambia automáticamente al adjuntar archivos.'
                    : 'The status depends on actual system records and authorized staff decision; it does not automatically change when attaching files.'}
                </p>
              </div>

              {/* Botones de simulación / visualización del estado institucional */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setConfirmationStatus('approved')}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    confirmationStatus === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isEs ? 'Aprobado' : 'Approved'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmationStatus('pending')}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    confirmationStatus === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isEs ? 'Pendiente' : 'Pending'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmationStatus('rejected')}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    confirmationStatus === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {isEs ? 'No aprobado' : 'Not Approved'}
                </button>
              </div>
            </div>

            {/* 1. ESTADO: APROBADO / APPROVED */}
            {confirmationStatus === 'approved' && (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 border-2 border-emerald-500 dark:border-emerald-600 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 uppercase tracking-wider inline-block">
                        {isEs ? 'Aprobado / Approved' : 'Approved'}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100 mt-1">
                        {isEs ? 'Matrícula Oficial Aprobada y Formalizada' : 'Official Enrollment Approved & Finalized'}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                    #MAT-2025-4821
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed font-medium">
                  {isEs 
                    ? 'Tu solicitud de matrícula y los documentos adjuntos han sido revisados y aprobados oficialmente por el personal autorizado de la secretaría académica de la I.E. Félix Henao Botero. Tu cupo para el año lectivo 2025 se encuentra plenamente formalizado ante el SIMAT y la Secretaría de Educación de Medellín.'
                    : 'Your enrollment application and attached documents have been officially reviewed and approved by authorized academic office staff at I.E. Félix Henao Botero. Your student seat for academic year 2025 is fully finalized in SIMAT.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{isEs ? 'Grado y Grupo' : 'Grade & Group'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{student.grade} - Jornada {student.shift}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{isEs ? 'Póliza Escolar' : 'School Policy'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">Seguros del Estado No. 9028</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">{isEs ? 'Fecha de Aprobación' : 'Approval Date'}</span>
                    <span className="font-bold text-slate-900 dark:text-white">15 de Enero de 2025</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => alert(isEs ? `Comprobante oficial de matrícula de ${studentName} listo para impresión.` : `Official enrollment receipt for ${studentName} ready to print.`)}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isEs ? 'Imprimir Certificado de Matrícula' : 'Print Enrollment Certificate'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. ESTADO: NO APROBADO / NOT APPROVED */}
            {confirmationStatus === 'rejected' && (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-rose-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-950/20 border-2 border-rose-500 dark:border-rose-600 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-100 uppercase tracking-wider inline-block">
                        {isEs ? 'No aprobado / Not Approved' : 'Not Approved'}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-rose-950 dark:text-rose-100 mt-1">
                        {isEs ? 'Solicitud No Aprobada por Secretaría Académica' : 'Application Not Approved by Academic Office'}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950 px-3 py-1 rounded-xl border border-rose-300 dark:border-rose-800">
                    {isEs ? 'Requiere Subsanación' : 'Action Required'}
                  </span>
                </div>

                {/* Explicación del estado */}
                <p className="text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90 leading-relaxed font-medium">
                  {isEs 
                    ? 'La solicitud o los documentos presentados han sido revisados y rechazados por el personal autorizado. Para continuar con el proceso de asignación de cupo, debes atender las observaciones y corregir los soportes indicados.'
                    : 'The application or submitted documents have been reviewed and rejected by authorized staff. To continue with enrollment, please address the observations and correct the indicated files.'}
                </p>

                {/* Motivo del Rechazo */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-rose-200 dark:border-rose-800 shadow-2xs">
                  <span className="text-xs font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{isEs ? 'Motivo del Rechazo Emitido por Personal Autorizado:' : 'Rejection Reason Issued by Authorized Staff:'}</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                    "{rejectionReason}"
                  </p>
                </div>

                {/* Instrucciones para corregir los documentos o realizar nuevamente el proceso */}
                <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 space-y-3">
                  <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-rose-600" />
                    <span>{isEs ? 'Instrucciones para corregir los documentos o realizar nuevamente el proceso:' : 'Instructions to correct documents or re-apply:'}</span>
                  </h5>

                  <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li>
                      <strong className="text-slate-900 dark:text-white">{isEs ? 'Verificación de archivo: ' : 'File check: '}</strong>
                      {isEs 
                        ? 'Escanea nuevamente el documento solicitado en formato PDF o fotografía nítida con buena luz, asegurando que los sellos institucionales y firmas sean completamente legibles.'
                        : 'Re-scan the requested document in crisp PDF or clear photograph ensuring official seals and signatures are legible.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">{isEs ? 'Adjuntar soporte corregido: ' : 'Attach corrected file: '}</strong>
                      {isEs 
                        ? 'Utiliza el botón "Adjuntar archivos" ubicado en el área superior de esta sección para cargar el nuevo documento corregido.'
                        : 'Use the "Attach Files" button located in the upper area of this section to upload the new corrected document.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">{isEs ? 'Confirmar radicación: ' : 'Confirm filing: '}</strong>
                      {isEs 
                        ? 'Haz clic en "Confirmar y Radicar Archivos" para remitir la corrección formal a la secretaría del colegio.'
                        : 'Click "Confirm & Submit Files" to officially send the correction to the school office.'}
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">{isEs ? 'Atención presencial o telefónica: ' : 'Office contact: '}</strong>
                      {isEs 
                        ? 'Si el motivo del rechazo requiere aclaración presencial, comunícate a secretaria@edumed.edu.co o acércate a la sede de la I.E. Félix Henao Botero (Lunes a Viernes de 7:00 AM a 1:00 PM).'
                        : 'If you need clarification, contact secretaria@edumed.edu.co or visit the main office of I.E. Félix Henao Botero.'}
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* 3. ESTADO: PENDIENTE DE REVISIÓN / PENDING REVIEW */}
            {confirmationStatus === 'pending' && (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20 border-2 border-amber-400 dark:border-amber-600 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                      <Clock className="w-7 h-7 animate-pulse" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 uppercase tracking-wider inline-block">
                        {isEs ? 'Pendiente de revisión / Pending Review' : 'Pending Review'}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-amber-950 dark:text-amber-100 mt-1">
                        {isEs ? 'Solicitud en Fila de Validación por Secretaría' : 'Application in Queue for Secretariat Validation'}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-xl border border-amber-300 dark:border-amber-700">
                    {isEs ? 'En Auditoría Institucional' : 'Under Institutional Audit'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                  {isEs 
                    ? 'Tu solicitud de matrícula y los documentos adjuntos se encuentran radicados y en espera de revisión por el personal autorizado. La validación requiere verificación manual de autenticidad y antecedentes; el estado NO cambia automáticamente a aprobado por el hecho de adjuntar archivos.'
                    : 'Your enrollment application and attached documents are filed and pending review by authorized personnel. Validation requires manual verification; status does NOT automatically change to approved just by attaching files.'}
                </p>

                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">
                      {isEs ? '¿Qué ocurre durante esta etapa?' : 'What happens during this step?'}
                    </strong>
                    {isEs 
                      ? 'La coordinación académica coteja el historial académico del estudiante, valida el paz y salvo financiero y cruza la información en el sistema SIMAT de la Secretaría de Educación de Medellín. Tiempo estimado: 24 a 48 horas hábiles.'
                      : 'The academic coordination reviews academic history, verifies financial standing, and cross-checks data with SIMAT. Estimated time: 24 to 48 business hours.'}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                C. ARCHIVOS SELECCIONADOS / RADICADOS Y SU ESTADO EN LA MATRÍCULA
                ========================================================================= */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>{isEs ? 'Archivos Vinculados y su Estado en Matrícula' : 'Files Attached & Status in Enrollment'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isEs 
                      ? 'Visualización de cada archivo seleccionado y su dictamen de aprobación institucional' 
                      : 'Display of each selected file and its institutional approval status'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                    confirmationStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : confirmationStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  }`}>
                    {confirmationStatus === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {confirmationStatus === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {confirmationStatus === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    <span>
                      {confirmationStatus === 'approved'
                        ? (isEs ? 'Aprobado / Approved' : 'Approved')
                        : confirmationStatus === 'rejected'
                        ? (isEs ? 'No aprobado / Not Approved' : 'Not Approved')
                        : (isEs ? 'Pendiente de revisión / Pending Review' : 'Pending Review')}
                    </span>
                  </span>
                </div>
              </div>

              {/* Lista de archivos en confirmación */}
              {uploadedFilesList.length === 0 && selectedFiles.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  {isEs 
                    ? 'No se ha seleccionado ningún archivo todavía. Sube tus documentos con el botón "Adjuntar archivos" de arriba.' 
                    : 'No files selected yet. Upload your documents using the "Attach Files" button above.'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Archivos actualmente seleccionados en el dispositivo */}
                  {selectedFiles.map(file => (
                    <div 
                      key={`conf-sel-${file.id}`}
                      className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-black text-xs shrink-0 uppercase">
                          {file.extension.slice(0, 4)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                            {file.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {file.extension} • {file.sizeFormatted} • {isEs ? 'Seleccionado en este dispositivo (pendiente de radicar)' : 'Selected on device (pending submit)'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewModalDoc({
                              id: file.id,
                              studentId: student.id,
                              studentName: student.fullName,
                              name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
                              category: 'identity',
                              fileName: file.name,
                              fileSize: file.sizeFormatted,
                              fileType: file.fileType,
                              fileData: file.fileData,
                              uploadDate: file.uploadedAt,
                              uploadedBy: currentUser?.name || student.fullName,
                              status: 'pending'
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold flex items-center gap-1 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                          title="Visualizar archivo"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>{isEs ? 'Ver' : 'Preview'}</span>
                        </button>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isEs ? 'Pendiente' : 'Pending'}</span>
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Archivos radicados oficialmente con estado institucional */}
                  {uploadedFilesList.map(file => (
                    <div 
                      key={`conf-file-${file.id}`}
                      className={`p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                        confirmationStatus === 'approved'
                          ? 'border-emerald-200 dark:border-emerald-800'
                          : confirmationStatus === 'rejected'
                          ? 'border-rose-200 dark:border-rose-800'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 uppercase ${
                          confirmationStatus === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : confirmationStatus === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                        }`}>
                          {file.extension.slice(0, 4)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                            {file.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {file.extension} • {file.sizeFormatted} • {file.uploadedAt}
                          </span>
                        </div>
                      </div>

                      {/* Botón para visualizar y estado del archivo en matrícula */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            const found = documents.find(d => d.fileName === file.name || d.id === file.id);
                            if (found) {
                              setPreviewModalDoc(found);
                            } else {
                              setPreviewModalDoc({
                                id: file.id,
                                studentId: student.id,
                                studentName: student.fullName,
                                name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
                                category: 'identity',
                                fileName: file.name,
                                fileSize: file.sizeFormatted,
                                fileType: file.fileType,
                                fileData: file.fileData,
                                uploadDate: file.uploadedAt,
                                uploadedBy: currentUser?.name || student.fullName,
                                status: confirmationStatus === 'approved' ? 'approved' : confirmationStatus === 'rejected' ? 'rejected' : 'in_review',
                                rejectionReason: confirmationStatus === 'rejected' ? rejectionReason : undefined
                              });
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 hover:bg-teal-100 text-xs font-bold flex items-center gap-1 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                          title="Visualizar documento radicado"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                          <span>{isEs ? 'Ver' : 'Preview'}</span>
                        </button>

                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                          confirmationStatus === 'approved'
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : confirmationStatus === 'rejected'
                            ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {confirmationStatus === 'approved' && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isEs ? 'Aprobado' : 'Approved'}</span>
                            </>
                          )}
                          {confirmationStatus === 'rejected' && (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>{isEs ? 'No aprobado' : 'Not Approved'}</span>
                            </>
                          )}
                          {confirmationStatus === 'pending' && (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>{isEs ? 'Pendiente' : 'Pending'}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Radicado y póliza institucional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                  {isEs ? 'Código de Radicado Oficial' : 'Official Docket Code'}
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                  #MAT-2025-4821
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {isEs ? 'Registrado en SIMAT - Secretaría de Educación de Medellín' : 'Registered in SIMAT - Medellín Education Secretariat'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {isEs ? 'Póliza Estudiantil Institucional' : 'Student Insurance Policy'}
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                  {isEs ? 'Seguros del Estado • Póliza No. 9028-2025' : 'State Insurance • Policy No. 9028-2025'}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  {isEs ? 'Cobertura médica accidentes escolares 24/7' : '24/7 student accident medical coverage'}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 4: GUARDIAN */}
      {activeTabSection === 'guardian' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {isEs ? 'Acudiente Principal Vinculado' : 'Primary Linked Guardian'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEs ? 'Persona responsable ante la institución educativa para citaciones y seguimiento.' : 'Person responsible for school meetings, communications, and academic tracking.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-lg shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                {isEs ? 'Padre / Acudiente Principal' : 'Parent / Primary Guardian'}
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Carlos Eduardo Ramírez
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                CC 1.034.567.890 • {isEs ? 'Teléfono' : 'Phone'}: 300 123 4567 • carlos.ramirez@email.com
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Dirección: Calle 45 # 12-34, Boston (Convive con el estudiante)' : 'Address: Calle 45 # 12-34, Boston (Lives with student)'}
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

      {/* MODAL 2: Ficha Oficial del Estudiante (Solo lectura institucional) */}
      <StudentEditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onOpenAvatarModal={() => setShowAvatarModal(true)}
      />

      {/* MODAL 3: Visor Universal de Documentos para Estudiante */}
      <DocumentViewerModal
        isOpen={Boolean(previewModalDoc)}
        onClose={() => setPreviewModalDoc(null)}
        document={previewModalDoc}
        isAdmin={false}
      />

    </div>
  );
};
