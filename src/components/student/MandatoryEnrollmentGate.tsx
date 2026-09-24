import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ENROLLMENT_STEPS_CONFIG, TOTAL_ENROLLMENT_STEPS } from '../../config/enrollmentStepsConfig';
import confetti from 'canvas-confetti';
import { 
  User, 
  Phone, 
  GraduationCap, 
  Users, 
  FolderCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Upload, 
  Check, 
  ShieldCheck, 
  Save, 
  Lock, 
  Sparkles,
  Info,
  Calendar,
  MapPin,
  HeartPulse
} from 'lucide-react';

interface MandatoryEnrollmentGateProps {
  onEnrollmentCompleted: () => void;
}

export const MandatoryEnrollmentGate: React.FC<MandatoryEnrollmentGateProps> = ({
  onEnrollmentCompleted
}) => {
  const { currentUser, language, completeStudentEnrollment, submitNewEnrollment } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topBannerError, setTopBannerError] = useState<string | null>(null);

  // Form State initialized with real currentUser data
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    docType: 'TI',
    docNumber: currentUser?.documentNumber || '',
    firstNames: currentUser?.name ? currentUser.name.split(' ')[0] : '',
    lastNames: currentUser?.name ? currentUser.name.split(' ').slice(1).join(' ') : '',
    gender: currentUser?.gender || 'Masculino',
    birthDate: '2008-04-12',

    // Step 2: Contact Info
    phone: currentUser?.phone || '315 987 6543',
    email: currentUser?.email || 'estudiante@edumed.edu.co',
    address: 'Calle 45 # 12-34',
    neighborhood: 'Boston',
    stratum: '3',

    // Step 3: Academic Info
    previousSchool: 'I.E. Marco Fidel Suárez',
    grade: '10°A',
    shift: 'Mañana',
    bloodType: 'O+',
    eps: 'SURA EPS',
    medicalConditions: 'Ninguna condición médica o alergia de riesgo reportada.',

    // Step 4: Guardian Info
    guardianDocType: 'CC',
    guardianDocNumber: '1034567890',
    guardianFullName: 'Carlos Eduardo Ramírez',
    guardianRelationship: 'Padre',
    guardianPhone: '300 123 4567',
    guardianEmail: 'carlos.ramirez@email.com',
    guardianAddress: 'Calle 45 # 12-34, Boston',

    // Step 6: Oath
    swornOathAccepted: false,
    dataTreatmentAccepted: true
  });

  // Step 5: Required Documents
  const [docs, setDocs] = useState([
    { id: 'doc-ti', name: 'Documento de Identidad del Estudiante (TI/CC/RC)', required: true, uploaded: true, fileName: 'Documento_Identidad_Estudiante.pdf' },
    { id: 'doc-guard', name: 'Documento de Identidad del Acudiente (CC/CE)', required: true, uploaded: true, fileName: 'Cedula_Acudiente_Padre.pdf' },
    { id: 'doc-eps', name: 'Certificado de Afiliación a EPS (Vigente)', required: true, uploaded: true, fileName: 'Certificado_EPS_Sura.pdf' },
    { id: 'doc-grades', name: 'Certificado de Notas o Calificaciones Año Anterior', required: true, uploaded: false, fileName: '' }
  ]);

  const stepConfig = ENROLLMENT_STEPS_CONFIG.find(s => s.stepNumber === currentStep) || ENROLLMENT_STEPS_CONFIG[0];
  const progressPercent = Math.round((currentStep / TOTAL_ENROLLMENT_STEPS) * 100);

  // Generate ASCII progress bar like "████░░░░░░ 40%"
  const getAsciiBar = (percent: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.max(1, Math.round((percent / 100) * totalBlocks));
    const emptyBlocks = totalBlocks - filledBlocks;
    return `${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)} ${percent}%`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (topBannerError) setTopBannerError(null);
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocs(prev => prev.map((d, i) => i === index ? { ...d, uploaded: true, fileName: file.name } : d));
      if (errors[`doc_${index}`] || errors.documents) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[`doc_${index}`];
          delete next.documents;
          return next;
        });
        setTopBannerError(null);
      }
    }
  };

  // Validation function per step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.docNumber.trim() || formData.docNumber.trim().length < 5) {
        newErrors.docNumber = 'El número de documento debe tener al menos 5 dígitos.';
      }
      if (!formData.firstNames.trim() || formData.firstNames.trim().length < 2) {
        newErrors.firstNames = 'Ingrese los nombres del estudiante.';
      }
      if (!formData.lastNames.trim() || formData.lastNames.trim().length < 2) {
        newErrors.lastNames = 'Ingrese los apellidos del estudiante.';
      }
      if (!formData.birthDate) {
        newErrors.birthDate = 'Seleccione la fecha de nacimiento.';
      }
    } else if (step === 2) {
      if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 7) {
        newErrors.phone = 'Ingrese un número de teléfono válido (mínimo 7 dígitos).';
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        newErrors.email = 'Ingrese un correo electrónico válido.';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Ingrese la dirección de residencia.';
      }
      if (!formData.neighborhood.trim()) {
        newErrors.neighborhood = 'Ingrese el barrio de residencia.';
      }
    } else if (step === 3) {
      if (!formData.previousSchool.trim()) {
        newErrors.previousSchool = 'Ingrese el colegio o institución de procedencia.';
      }
      if (!formData.eps.trim()) {
        newErrors.eps = 'Ingrese el nombre de su EPS.';
      }
    } else if (step === 4) {
      if (!formData.guardianFullName.trim() || formData.guardianFullName.trim().length < 3) {
        newErrors.guardianFullName = 'Ingrese el nombre completo del acudiente.';
      }
      if (!formData.guardianDocNumber.trim() || formData.guardianDocNumber.trim().length < 5) {
        newErrors.guardianDocNumber = 'Ingrese el documento de identidad del acudiente.';
      }
      if (!formData.guardianPhone.trim() || formData.guardianPhone.replace(/\D/g, '').length < 7) {
        newErrors.guardianPhone = 'Ingrese el teléfono de contacto del acudiente.';
      }
    } else if (step === 5) {
      const missing = docs.filter(d => d.required && !d.uploaded);
      if (missing.length > 0) {
        newErrors.documents = `Falta adjuntar: ${missing.map(m => m.name).join(', ')}`;
      }
    } else if (step === 6) {
      if (!formData.swornOathAccepted) {
        newErrors.swornOathAccepted = 'Debe aceptar la declaración juramentada de veracidad de datos.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTopBannerError('⚠️ Por favor completa todos los campos requeridos con información válida para avanzar.');
      return false;
    }

    setErrors({});
    setTopBannerError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < TOTAL_ENROLLMENT_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 6 completed: Finalize and submit official enrollment
      if (completeStudentEnrollment && currentUser) {
        completeStudentEnrollment(currentUser.id, {
          studentName: `${formData.firstNames} ${formData.lastNames}`,
          grade: formData.grade,
          phone: formData.phone,
          guardian: formData.guardianFullName
        });
      }

      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      onEnrollmentCompleted();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 max-w-5xl mx-auto px-4">
      {/* Notice Card: Enrollment Gate */}
      <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-teal-950/30 dark:to-blue-950/30 border-2 border-teal-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-[11px] font-black uppercase tracking-wider mb-1">
                Requisito Obligatorio de Acceso
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Completa tu proceso de matrícula
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Hola, <strong className="text-slate-900 dark:text-white">{currentUser?.name}</strong>. Para habilitar el acceso regular a tu panel principal de estudiante, calificaciones y horario institucional, debes completar los 6 pasos obligatorios de matrícula.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shrink-0 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Año Lectivo</span>
            <span className="text-base font-black text-teal-700 dark:text-teal-400">2025</span>
          </div>
        </div>
      </div>

      {/* Progress Box (Exact User Specification) */}
      <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Paso {currentStep} de {TOTAL_ENROLLMENT_STEPS}
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {stepConfig.title}
            </h2>
          </div>

          {/* ASCII & Percent Indicator requested by user */}
          <div className="text-right">
            <div className="font-mono text-sm sm:text-base font-black text-teal-700 dark:text-teal-400 tracking-wider">
              {getAsciiBar(progressPercent)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Progreso de matrícula
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="grid grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          {ENROLLMENT_STEPS_CONFIG.map((step) => {
            const isCompleted = step.stepNumber < currentStep;
            const isCurrent = step.stepNumber === currentStep;
            return (
              <div 
                key={step.id} 
                className={`text-center py-1 px-1 rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-teal-50 dark:bg-teal-950/60 font-black text-teal-800 dark:text-teal-300' 
                    : isCompleted 
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold' 
                    : 'text-slate-400 dark:text-slate-600 font-medium'
                }`}
              >
                <div className="text-[10px] hidden sm:block truncate">{step.shortTitle}</div>
                <div className="text-xs sm:text-xs">
                  {isCompleted ? '✓' : step.stepNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Banner Error */}
      {topBannerError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{topBannerError}</span>
        </div>
      )}

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        
        {/* PASO 1: INFORMACIÓN PERSONAL */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                <span>Paso 1: Información Personal del Estudiante</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Datos de identificación oficial registrados en el sistema de matrícula.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Documento: <span className="text-rose-500">*</span>
                </label>
                <select
                  name="docType"
                  value={formData.docType}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                  <option value="RC">Registro Civil (RC)</option>
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="NES">Número Establecido por Secretaría (NES)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Documento: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="docNumber"
                  value={formData.docNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.docNumber 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                  placeholder="Ej: 1035982147"
                />
                {errors.docNumber && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.docNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombres: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstNames"
                  value={formData.firstNames}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.firstNames 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                  placeholder="Ej: Mateo"
                />
                {errors.firstNames && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.firstNames}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Apellidos: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastNames"
                  value={formData.lastNames}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.lastNames 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                  placeholder="Ej: Restrepo"
                />
                {errors.lastNames && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.lastNames}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sexo del Estudiante (Para tu avatar oficial): <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="Masculino">♂ Masculino (Avatar ilustrado de Chico)</option>
                  <option value="Femenino">♀ Femenino (Avatar ilustrado de Chica)</option>
                  <option value="Neutro">🎓 Neutro / No especificado (Avatar ilustrado Académico)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Nacimiento: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.birthDate 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.birthDate && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.birthDate}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 2: INFORMACIÓN DE CONTACTO */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal-600" />
                <span>Paso 2: Información de Contacto y Residencia</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Datos de ubicación para comunicación institucional de la I.E. Félix Henao Botero.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Celular o Teléfono de Contacto: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="315 987 6543"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.phone 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.phone && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="mateo.restrepo@edumed.edu.co"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.email && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección de Residencia: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle 45 # 12-34"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.address 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.address && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Barrio o Comuna: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Boston, Laureles, Belén..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.neighborhood 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.neighborhood && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.neighborhood}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 3: INFORMACIÓN ACADÉMICA */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <span>Paso 3: Información Académica y Salud</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Colegio de origen, grado lectivo solicitado y reporte para póliza escolar EPS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institución Educativa de Procedencia: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleInputChange}
                  placeholder="Ej: Colegio San José o Misma Institución"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.previousSchool && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.previousSchool}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grado a Matricular: <span className="text-rose-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="6°">Sexto (6°)</option>
                  <option value="7°">Séptimo (7°)</option>
                  <option value="8°">Octavo (8°)</option>
                  <option value="9°">Noveno (9°)</option>
                  <option value="10°A">Décimo (10°A)</option>
                  <option value="10°B">Décimo (10°B)</option>
                  <option value="11°A">Undécimo (11°A)</option>
                  <option value="11°B">Undécimo (11°B)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jornada Escolar: <span className="text-rose-500">*</span>
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Mañana">Jornada Mañana (6:30 AM - 12:30 PM)</option>
                  <option value="Tarde">Jornada Tarde (12:45 PM - 6:45 PM)</option>
                  <option value="Única">Jornada Única Institucional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Entidad de Salud / EPS: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="eps"
                  value={formData.eps}
                  onChange={handleInputChange}
                  placeholder="Ej: SURA, Savia Salud, Sanitas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.eps && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.eps}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Observaciones Médicas / Alergias:
                </label>
                <textarea
                  name="medicalConditions"
                  rows={2}
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Describa si el estudiante tiene alguna condición médica especial..."
                />
              </div>
            </div>
          </div>
        )}

        {/* PASO 4: INFORMACIÓN DEL ACUDIENTE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>Paso 4: Información del Acudiente Responsable</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Padre, madre o tutor legal que responderá administrativamente por el estudiante.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo del Acudiente: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianFullName"
                  value={formData.guardianFullName}
                  onChange={handleInputChange}
                  placeholder="Ej: Carlos Eduardo Ramírez"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.guardianFullName 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.guardianFullName && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.guardianFullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cédula / Documento del Acudiente: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardianDocNumber"
                  value={formData.guardianDocNumber}
                  onChange={handleInputChange}
                  placeholder="Ej: 1034567890"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.guardianDocNumber 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.guardianDocNumber && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.guardianDocNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parentesco con el Estudiante: <span className="text-rose-500">*</span>
                </label>
                <select
                  name="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo/a">Abuelo / Abuela</option>
                  <option value="Tío/a">Tío / Tía</option>
                  <option value="Hermano/a Mayor">Hermano(a) Mayor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Celular del Acudiente: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  placeholder="300 123 4567"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 ${
                    errors.guardianPhone 
                      ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20' 
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                {errors.guardianPhone && <p className="text-[11px] font-bold text-rose-600 mt-1">{errors.guardianPhone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PASO 5: DOCUMENTOS REQUERIDOS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-teal-600" />
                <span>Paso 5: Documentos Requeridos</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Adjunta los soportes obligatorios en formato PDF o fotografía nítida.
              </p>
            </div>

            {errors.documents && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.documents}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {docs.map((doc, idx) => (
                <div 
                  key={doc.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    doc.uploaded
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      doc.uploaded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}>
                      {doc.uploaded ? <Check className="w-5 h-5" /> : <Upload className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {doc.name}
                        </span>
                        {doc.required && (
                          <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                            Obligatorio
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.uploaded ? `✓ Archivo adjunto: ${doc.fileName}` : 'Pendiente de adjuntar (PDF, JPG, PNG)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <label className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{doc.uploaded ? 'Reemplazar' : 'Adjuntar Archivo'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => handleFileUpload(idx, e)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASO 6: CONFIRMACIÓN DE MATRÍCULA */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>Paso 6: Confirmación y Radicación Oficial</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Revisa la información y acepta la declaración juramentada para habilitar tu cuenta oficial.
              </p>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Estudiante:</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {formData.firstNames} {formData.lastNames}
                </span>
                <p className="text-slate-500">{formData.docType} {formData.docNumber} • {formData.gender}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Grado y Jornada:</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  Grado {formData.grade} • Jornada {formData.shift}
                </span>
                <p className="text-slate-500">I.E. Félix Henao Botero (Medellín)</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Acudiente Responsable:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formData.guardianFullName}</span>
                <p className="text-slate-500">Parentesco: {formData.guardianRelationship} • Tel: {formData.guardianPhone}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Documentación Adjunta:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4 de 4 Documentos Validados</span>
                <p className="text-slate-500">Listo para aprobación en SIMAT</p>
              </div>
            </div>

            {/* Sworn Oath */}
            <div className={`p-4 rounded-2xl border transition-all ${
              errors.swornOathAccepted 
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400' 
                : 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.swornOathAccepted}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, swornOathAccepted: e.target.checked }));
                    if (errors.swornOathAccepted) {
                      setErrors(prev => {
                        const next = { ...prev };
                        delete next.swornOathAccepted;
                        return next;
                      });
                      setTopBannerError(null);
                    }
                  }}
                  className="mt-1 w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  Declaro bajo la gravedad de juramento que la información suministrada es verídica y que los documentos adjuntos corresponden fielmente a los originales, aceptando el manual de convivencia y los reglamentos institucionales de la I.E. Félix Henao Botero.
                </span>
              </label>
              {errors.swornOathAccepted && (
                <p className="text-[11px] font-bold text-rose-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.swornOathAccepted}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 1 
                ? 'opacity-40 cursor-not-allowed text-slate-400' 
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-teal-700/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <span>
              {currentStep === TOTAL_ENROLLMENT_STEPS 
                ? 'Finalizar y Radicar Matrícula Oficial' 
                : 'Siguiente Paso'}
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
