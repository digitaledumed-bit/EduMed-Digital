import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Download, 
  User, 
  GraduationCap, 
  HeartPulse, 
  FolderCheck, 
  CheckCircle2, 
  HelpCircle,
  FileCheck2,
  Trash2,
  Search,
  Check,
  Shield,
  FileCheck
} from 'lucide-react';

export const EnrollmentWizard: React.FC = () => {
  const { t, language, submitNewEnrollment, setActiveTab, currentUser } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [saveDraftMessage, setSaveDraftMessage] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [finalOathAccepted, setFinalOathAccepted] = useState(false);
  const [generatedRadicado, setGeneratedRadicado] = useState<string | null>(null);

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topBannerError, setTopBannerError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Guardian
    guardianDocType: 'CC',
    guardianDocNumber: '',
    guardianFirstNames: '',
    guardianLastNames: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    guardianNeighborhood: '',
    guardianRelationship: 'Padre',

    // Step 2: Student
    studentDocType: 'TI',
    studentDocNumber: '',
    studentFirstNames: '',
    studentLastNames: '',
    studentBirthDate: '',
    studentGender: 'Femenino',
    studentBloodType: 'O+',
    studentGrade: '10°',
    studentShift: 'Mañana',
    studentAddress: '',
    studentNeighborhood: '',
    studentPhone: '',
    studentEmail: '',

    // Step 3: Academic & Medical
    previousSchool: '',
    medicalNotes: ''
  });

  // Pre-fill user data depending on role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'student') {
        const parts = currentUser.name.trim().split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        setFormData(prev => ({
          ...prev,
          studentDocNumber: prev.studentDocNumber || currentUser.documentNumber || '',
          studentFirstNames: prev.studentFirstNames || first,
          studentLastNames: prev.studentLastNames || last,
          studentEmail: prev.studentEmail || currentUser.email || '',
          studentPhone: prev.studentPhone || currentUser.phone || '',
          studentGender: prev.studentGender || currentUser.gender || 'Masculino'
        }));
      } else if (currentUser.role === 'guardian') {
        const parts = currentUser.name.trim().split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        setFormData(prev => ({
          ...prev,
          guardianDocNumber: prev.guardianDocNumber || currentUser.documentNumber || '',
          guardianFirstNames: prev.guardianFirstNames || first,
          guardianLastNames: prev.guardianLastNames || last,
          guardianEmail: prev.guardianEmail || currentUser.email || '',
          guardianPhone: prev.guardianPhone || currentUser.phone || ''
        }));
      }
    }
  }, [currentUser]);

  // Step 4: Uploaded Files
  const [uploadedFiles, setUploadedFiles] = useState<{ 
    id: string;
    name: string; 
    required: boolean; 
    file: File | null; 
    fileName: string;
  }>([
    { id: 'doc-ti', name: 'Documento de Identidad del Estudiante', required: true, file: null, fileName: '' },
    { id: 'doc-cc-guard', name: 'Documento de Identidad del Acudiente', required: true, file: null, fileName: '' },
    { id: 'doc-eps', name: 'Certificado Médico EPS (Últimos 3 meses)', required: true, file: null, fileName: '' },
    { id: 'doc-grades', name: 'Certificado de Calificaciones Año Anterior', required: true, file: null, fileName: '' },
    { id: 'doc-pazysalvo', name: 'Paz y Salvo Institución Anterior', required: false, file: null, fileName: '' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (topBannerError) {
      setTopBannerError(null);
    }
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, file, fileName: file.name }
            : item
        )
      );

      // Clear document error
      if (errors[`file_${index}`] || errors['documents']) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[`file_${index}`];
          delete next['documents'];
          return next;
        });
        setTopBannerError(null);
      }
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('edumed_enrollment_draft', JSON.stringify({ formData, currentStep, uploadedFileNames: uploadedFiles.map(f => f.fileName) }));
    setSaveDraftMessage(true);
    setTimeout(() => setSaveDraftMessage(false), 4000);
  };

  // Rigorous validation per step: if anything is incomplete or invalid, DO NOT ALLOW TO ADVANCE
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      // Validate Step 1: Guardian
      if (!formData.guardianDocNumber.trim()) {
        newErrors.guardianDocNumber = language === 'es' ? 'Ingrese el número de documento del acudiente.' : 'Document number is required.';
      } else if (formData.guardianDocNumber.trim().length < 5) {
        newErrors.guardianDocNumber = language === 'es' ? 'El documento debe contener al menos 5 dígitos.' : 'Min 5 characters required.';
      }

      if (!formData.guardianFirstNames.trim()) {
        newErrors.guardianFirstNames = language === 'es' ? 'Ingrese los nombres del acudiente.' : 'First name is required.';
      } else if (formData.guardianFirstNames.trim().length < 2) {
        newErrors.guardianFirstNames = language === 'es' ? 'Mínimo 2 caracteres requeridos.' : 'Min 2 characters.';
      }

      if (!formData.guardianLastNames.trim()) {
        newErrors.guardianLastNames = language === 'es' ? 'Ingrese los apellidos del acudiente.' : 'Last name is required.';
      } else if (formData.guardianLastNames.trim().length < 2) {
        newErrors.guardianLastNames = language === 'es' ? 'Mínimo 2 caracteres requeridos.' : 'Min 2 characters.';
      }

      const guardianDigits = formData.guardianPhone.replace(/\D/g, '');
      if (!formData.guardianPhone.trim()) {
        newErrors.guardianPhone = language === 'es' ? 'Ingrese el teléfono de contacto del acudiente.' : 'Phone number is required.';
      } else if (guardianDigits.length < 7) {
        newErrors.guardianPhone = language === 'es' ? 'Ingrese un número de teléfono o celular válido (mínimo 7 dígitos).' : 'Phone must be at least 7 digits.';
      }

      const cleanGuardianEmail = formData.guardianEmail.trim().toLowerCase();
      if (!cleanGuardianEmail) {
        newErrors.guardianEmail = language === 'es' ? 'Ingrese el correo electrónico del acudiente.' : 'Email is required.';
      } else if (!emailRegex.test(cleanGuardianEmail)) {
        newErrors.guardianEmail = language === 'es' ? 'Ingrese un correo electrónico válido (ej: nombre@correo.com).' : 'Valid email is required.';
      }

      if (!formData.guardianAddress.trim()) {
        newErrors.guardianAddress = language === 'es' ? 'Ingrese la dirección de residencia del acudiente.' : 'Address is required.';
      } else if (formData.guardianAddress.trim().length < 4) {
        newErrors.guardianAddress = language === 'es' ? 'Ingrese una dirección completa.' : 'Address too short.';
      }

      if (!formData.guardianNeighborhood.trim()) {
        newErrors.guardianNeighborhood = language === 'es' ? 'Ingrese el barrio o comuna.' : 'Neighborhood is required.';
      }

      if (!formData.guardianRelationship.trim()) {
        newErrors.guardianRelationship = language === 'es' ? 'Seleccione el parentesco con el estudiante.' : 'Relationship is required.';
      }

      if (!termsAccepted) {
        newErrors.terms = language === 'es' ? 'Debe marcar la casilla de autorización de tratamiento de datos personales.' : 'You must accept personal data terms.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTopBannerError(
          language === 'es'
            ? '⚠️ No es posible ingresar al siguiente paso: Por favor complete todos los datos requeridos del acudiente con información válida y autorice el tratamiento de datos.'
            : '⚠️ Cannot proceed: Please fill in all required guardian fields with valid data.'
        );
        return false;
      }
    }

    if (step === 2) {
      // Validate Step 2: Student
      if (!formData.studentDocNumber.trim()) {
        newErrors.studentDocNumber = language === 'es' ? 'Ingrese el número de documento de identidad del estudiante.' : 'Student document number is required.';
      } else if (formData.studentDocNumber.trim().length < 5) {
        newErrors.studentDocNumber = language === 'es' ? 'El documento debe tener al menos 5 caracteres.' : 'Min 5 characters.';
      }

      if (!formData.studentFirstNames.trim()) {
        newErrors.studentFirstNames = language === 'es' ? 'Ingrese los nombres del estudiante.' : 'Student first name is required.';
      } else if (formData.studentFirstNames.trim().length < 2) {
        newErrors.studentFirstNames = language === 'es' ? 'Mínimo 2 caracteres requeridos.' : 'Min 2 characters.';
      }

      if (!formData.studentLastNames.trim()) {
        newErrors.studentLastNames = language === 'es' ? 'Ingrese los apellidos del estudiante.' : 'Student last name is required.';
      } else if (formData.studentLastNames.trim().length < 2) {
        newErrors.studentLastNames = language === 'es' ? 'Mínimo 2 caracteres requeridos.' : 'Min 2 characters.';
      }

      if (!formData.studentBirthDate.trim()) {
        newErrors.studentBirthDate = language === 'es' ? 'Seleccione la fecha de nacimiento del estudiante.' : 'Birth date is required.';
      } else {
        const birthYear = new Date(formData.studentBirthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if (birthYear > currentYear || birthYear < 1990) {
          newErrors.studentBirthDate = language === 'es' ? 'Ingrese una fecha de nacimiento válida.' : 'Invalid birth date.';
        }
      }

      if (!formData.studentGender) {
        newErrors.studentGender = language === 'es' ? 'Seleccione el sexo del estudiante.' : 'Gender is required.';
      }

      if (!formData.studentBloodType) {
        newErrors.studentBloodType = language === 'es' ? 'Seleccione el grupo sanguíneo y factor RH.' : 'Blood type is required.';
      }

      if (!formData.studentGrade) {
        newErrors.studentGrade = language === 'es' ? 'Seleccione el grado al que aspira ingresar.' : 'Grade is required.';
      }

      if (!formData.studentShift) {
        newErrors.studentShift = language === 'es' ? 'Seleccione la jornada escolar.' : 'Shift is required.';
      }

      if (!formData.studentAddress.trim()) {
        newErrors.studentAddress = language === 'es' ? 'Ingrese la dirección de residencia del estudiante.' : 'Student address is required.';
      }

      if (!formData.studentNeighborhood.trim()) {
        newErrors.studentNeighborhood = language === 'es' ? 'Ingrese el barrio de residencia del estudiante.' : 'Student neighborhood is required.';
      }

      const studentDigits = formData.studentPhone.replace(/\D/g, '');
      if (!formData.studentPhone.trim()) {
        newErrors.studentPhone = language === 'es' ? 'Ingrese el celular o teléfono del estudiante o de contacto.' : 'Phone number is required.';
      } else if (studentDigits.length < 7) {
        newErrors.studentPhone = language === 'es' ? 'Ingrese un número telefónico válido (mínimo 7 dígitos).' : 'Min 7 digits required.';
      }

      const cleanStudentEmail = formData.studentEmail.trim().toLowerCase();
      if (!cleanStudentEmail) {
        newErrors.studentEmail = language === 'es' ? 'Ingrese el correo electrónico del estudiante.' : 'Student email is required.';
      } else if (!emailRegex.test(cleanStudentEmail)) {
        newErrors.studentEmail = language === 'es' ? 'Ingrese un correo electrónico válido.' : 'Valid email is required.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTopBannerError(
          language === 'es'
            ? '⚠️ No es posible ingresar al siguiente paso: Por favor complete todos los campos obligatorios del estudiante con información válida.'
            : '⚠️ Cannot proceed: Please fill in all required student fields with valid data.'
        );
        return false;
      }
    }

    if (step === 3) {
      // Validate Step 3: Academic & Medical
      if (!formData.previousSchool.trim()) {
        newErrors.previousSchool = language === 'es' ? 'Ingrese el nombre de la institución educativa de procedencia o "Primera vez".' : 'Previous school is required.';
      } else if (formData.previousSchool.trim().length < 3) {
        newErrors.previousSchool = language === 'es' ? 'Ingrese un nombre de institución válido.' : 'Too short.';
      }

      if (!formData.medicalNotes.trim()) {
        newErrors.medicalNotes = language === 'es' ? 'Ingrese la EPS, alergias o indique "Ninguna condición reportada".' : 'Medical notes / EPS is required.';
      } else if (formData.medicalNotes.trim().length < 3) {
        newErrors.medicalNotes = language === 'es' ? 'Especifique la EPS o condiciones médicas.' : 'Too short.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTopBannerError(
          language === 'es'
            ? '⚠️ No es posible ingresar al siguiente paso: Debe diligenciar la información académica y los datos médicos / EPS del estudiante.'
            : '⚠️ Cannot proceed: Please enter academic background and medical notes.'
        );
        return false;
      }
    }

    if (step === 4) {
      // Validate Step 4: Required Documents
      const missingRequiredDocs: string[] = [];
      uploadedFiles.forEach((doc, idx) => {
        if (doc.required && (!doc.fileName || doc.fileName.trim() === '')) {
          newErrors[`file_${idx}`] = language === 'es' ? `El documento "${doc.name}" es obligatorio.` : 'This document is required.';
          missingRequiredDocs.push(doc.name);
        }
      });

      if (missingRequiredDocs.length > 0) {
        newErrors.documents = language === 'es' ? 'Faltan documentos obligatorios por adjuntar.' : 'Missing required documents.';
        setErrors(newErrors);
        setTopBannerError(
          language === 'es'
            ? `⚠️ No es posible ingresar al siguiente paso: Faltan ${missingRequiredDocs.length} documento(s) obligatorio(s) por adjuntar (${missingRequiredDocs.join(', ')}). Debe cargar todos los archivos requeridos para continuar.`
            : `⚠️ Cannot proceed: Missing required files (${missingRequiredDocs.join(', ')}).`
        );
        return false;
      }
    }

    if (step === 5) {
      // Validate Step 5: Final Oath
      if (!finalOathAccepted) {
        newErrors.finalOath = language === 'es' ? 'Debe aceptar la declaración juramentada de veracidad de datos.' : 'You must accept the sworn declaration.';
        setErrors(newErrors);
        setTopBannerError(
          language === 'es'
            ? '⚠️ No es posible radicar la matrícula: Debe marcar la casilla de certificación y declaración juramentada de veracidad de datos.'
            : '⚠️ Please accept the declaration to submit.'
        );
        return false;
      }
    }

    setErrors({});
    setTopBannerError(null);
    return true;
  };

  const handleNextStep = () => {
    // Validate current step before advancing
    const isValid = validateStep(currentStep);
    if (!isValid) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 5) {
      // Submit Official Enrollment
      const rad = submitNewEnrollment({
        student: {
          documentType: formData.studentDocType,
          documentNumber: formData.studentDocNumber,
          firstName: formData.studentFirstNames,
          lastName: formData.studentLastNames,
          fullName: `${formData.studentFirstNames} ${formData.studentLastNames}`,
          birthDate: formData.studentBirthDate,
          gender: formData.studentGender,
          bloodType: formData.studentBloodType,
          grade: formData.studentGrade,
          shift: formData.studentShift,
          address: formData.studentAddress,
          neighborhood: formData.studentNeighborhood,
          email: formData.studentEmail,
          phone: formData.studentPhone,
          previousSchool: formData.previousSchool,
          medicalNotes: formData.medicalNotes
        },
        guardian: {
          documentType: formData.guardianDocType,
          documentNumber: formData.guardianDocNumber,
          fullName: `${formData.guardianFirstNames} ${formData.guardianLastNames}`,
          relationship: formData.guardianRelationship,
          phone: formData.guardianPhone,
          email: formData.guardianEmail,
          address: `${formData.guardianAddress}, ${formData.guardianNeighborhood}`
        },
        documents: uploadedFiles.map(f => ({ name: f.name, file: f.file }))
      });

      setGeneratedRadicado(rad);
      setCurrentStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Block jumping ahead if current step has not been validated
    if (!validateStep(currentStep)) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    if (targetStep === currentStep + 1) {
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepsList = [
    { num: 1, label: language === 'es' ? '1. Acudiente' : '1. Guardian', icon: User },
    { num: 2, label: language === 'es' ? '2. Estudiante' : '2. Student', icon: GraduationCap },
    { num: 3, label: language === 'es' ? '3. Info Académica' : '3. Academic', icon: HeartPulse },
    { num: 4, label: language === 'es' ? '4. Documentos' : '4. Documents', icon: FolderCheck },
    { num: 5, label: language === 'es' ? '5. Revisión' : '5. Review', icon: FileCheck2 },
    { num: 6, label: language === 'es' ? '6. Radicado' : '6. Submitted', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Role Account Status Banner */}
        {currentUser && (
          <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                currentUser.role === 'student' ? 'bg-blue-600' : 'bg-teal-600'
              }`}>
                {currentUser.role === 'student' ? <GraduationCap className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {currentUser.role === 'student' 
                      ? (language === 'es' ? 'Portal del Estudiante • Diligenciamiento de Matrícula' : 'Student Portal • Enrollment') 
                      : (language === 'es' ? 'Portal del Acudiente • Diligenciamiento de Matrícula' : 'Guardian Portal • Enrollment')}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    Sesión Activa
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Usuario autenticado: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> • Doc: {currentUser.documentNumber || 'Sin registrar'}
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <span className="font-semibold text-teal-600 dark:text-teal-400">I.E. Félix Henao Botero</span> • Año 2025
            </div>
          </div>
        )}

        {/* Global Validation Warning Banner */}
        {topBannerError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-md animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm font-bold leading-relaxed">
              {topBannerError}
            </div>
          </div>
        )}

        {/* Draft notification */}
        {saveDraftMessage && (
          <div className="mb-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              {t.wizard.draftSaved}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT MAIN FORM COLUMN (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {currentStep === 1 && (language === 'es' ? 'Paso 1: Información Oficial del Acudiente' : t.wizard.step1Title)}
                    {currentStep === 2 && (language === 'es' ? 'Paso 2: Información Oficial del Estudiante' : t.wizard.step2Title)}
                    {currentStep === 3 && (language === 'es' ? 'Paso 3: Antecedentes Académicos y Salud' : t.wizard.step3Title)}
                    {currentStep === 4 && (language === 'es' ? 'Paso 4: Adjuntar Documentos Obligatorios' : t.wizard.step4Title)}
                    {currentStep === 5 && (language === 'es' ? 'Paso 5: Revisión General y Declaración Juramentada' : t.wizard.step5Title)}
                    {currentStep === 6 && (language === 'es' ? 'Paso 6: Matrícula Radicada' : t.wizard.step6Title)}
                  </h1>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                    {language === 'es' ? `Paso ${currentStep} de 6` : `Step ${currentStep} of 6`}
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {currentStep === 1 && (language === 'es' ? 'Diligencie todos los campos requeridos del padre, madre o tutor legal. Todos los datos son verificados ante la secretaría.' : t.wizard.step1Subtitle)}
                  {currentStep === 2 && (language === 'es' ? 'Ingrese con exactitud los datos del estudiante como figuran en su documento de identidad oficial.' : t.wizard.step2Subtitle)}
                  {currentStep === 3 && (language === 'es' ? 'Registre el colegio de procedencia y antecedentes médicos o EPS para la póliza estudiantil institucional.' : t.wizard.step3Subtitle)}
                  {currentStep === 4 && (language === 'es' ? 'Adjunte todos los documentos obligatorios en PDF o imagen nítida. No se permite continuar sin ellos.' : t.wizard.step4Subtitle)}
                  {currentStep === 5 && (language === 'es' ? 'Verifique que toda la información corresponda a la realidad y firme la declaración juramentada para formalizar el cupo.' : t.wizard.step5Subtitle)}
                  {currentStep === 6 && (language === 'es' ? 'Comprobante institucional con código de radicado oficial de matrícula.' : t.wizard.step6Subtitle)}
                </p>
              </div>

              {/* STEP 1: GUARDIAN REGISTRATION */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Section 1: Personal Info */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? '1. Datos de Identificación del Acudiente' : t.wizard.sections.personalInfo}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docType} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="guardianDocType"
                          value={formData.guardianDocType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="CC">Cédula de Ciudadanía (CC)</option>
                          <option value="CE">Cédula de Extranjería (CE)</option>
                          <option value="PAS">Pasaporte (PAS)</option>
                          <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docNumber} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianDocNumber"
                          value={formData.guardianDocNumber}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.docNumber}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianDocNumber
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianDocNumber && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianDocNumber}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.firstNames} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianFirstNames"
                          value={formData.guardianFirstNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.names}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianFirstNames
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianFirstNames && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianFirstNames}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.lastNames} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianLastNames"
                          value={formData.guardianLastNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.lastNames}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianLastNames
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianLastNames && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianLastNames}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Data */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? '2. Datos de Contacto y Residencia' : t.wizard.sections.contactData}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.phone} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleInputChange}
                          placeholder="Ej: 310 123 4567"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianPhone
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianPhone && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianPhone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.email} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          name="guardianEmail"
                          value={formData.guardianEmail}
                          onChange={handleInputChange}
                          placeholder="acudiente@correo.com"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianEmail
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianEmail && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianEmail}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.address} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianAddress"
                          value={formData.guardianAddress}
                          onChange={handleInputChange}
                          placeholder="Ej: Calle 50 # 40-20 Apto 302"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianAddress
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianAddress && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianAddress}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.neighborhood} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="guardianNeighborhood"
                          value={formData.guardianNeighborhood}
                          onChange={handleInputChange}
                          placeholder="Ej: Boston, Laureles, Belén..."
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.guardianNeighborhood
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.guardianNeighborhood && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.guardianNeighborhood}</span>
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.relationship} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="guardianRelationship"
                          value={formData.guardianRelationship}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Padre">Padre</option>
                          <option value="Madre">Madre</option>
                          <option value="Tutor Legal">Tutor Legal</option>
                          <option value="Abuelo/a">Abuelo / Abuela</option>
                          <option value="Tío/a">Tío / Tía</option>
                          <option value="Hermano/a Mayor">Hermano(a) Mayor</option>
                          <option value="Otro">Otro parentesco familiar</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions / Data Treatment Authorization */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    errors.terms
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (errors.terms) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.terms;
                              return next;
                            });
                          }
                        }}
                        className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {language === 'es'
                          ? 'Autorizo a la Institución Educativa Félix Henao Botero y a la Secretaría de Educación de Medellín para el tratamiento de mis datos personales y los de mi acudido(a), conforme a la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013.'
                          : t.wizard.sections.termsAgreement}
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.terms}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: STUDENT INFORMATION */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Student Personal Info */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? '1. Datos de Identidad del Estudiante' : t.wizard.sections.studentPersonal}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docType} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="studentDocType"
                          value={formData.studentDocType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="TI">Tarjeta de Identidad (TI)</option>
                          <option value="RC">Registro Civil (RC)</option>
                          <option value="CC">Cédula de Ciudadanía (CC)</option>
                          <option value="CE">Cédula de Extranjería (CE)</option>
                          <option value="NES">Número Establecido por Secretaría (NES)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docNumber} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentDocNumber"
                          value={formData.studentDocNumber}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.docNumber}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentDocNumber
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentDocNumber && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentDocNumber}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.firstNames} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentFirstNames"
                          value={formData.studentFirstNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.names}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentFirstNames
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentFirstNames && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentFirstNames}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.lastNames} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentLastNames"
                          value={formData.studentLastNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.lastNames}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentLastNames
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentLastNames && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentLastNames}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.birthDate} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="date"
                          name="studentBirthDate"
                          value={formData.studentBirthDate}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentBirthDate
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentBirthDate && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentBirthDate}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.gender} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="studentGender"
                          value={formData.studentGender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Masculino">Masculino (Hombre)</option>
                          <option value="Femenino">Femenino (Mujer)</option>
                          <option value="Otro">Otro / Prefiero no decir</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Grupo Sanguíneo y RH <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="studentBloodType"
                          value={formData.studentBloodType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="O+">O Positivo (O+)</option>
                          <option value="O-">O Negativo (O-)</option>
                          <option value="A+">A Positivo (A+)</option>
                          <option value="A-">A Negativo (A-)</option>
                          <option value="B+">B Positivo (B+)</option>
                          <option value="B-">B Negativo (B-)</option>
                          <option value="AB+">AB Positivo (AB+)</option>
                          <option value="AB-">AB Negativo (AB-)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Academic Assignment */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? '2. Grado y Jornada Solicitada' : 'Academic Assignment'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.gradeApplying} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="studentGrade"
                          value={formData.studentGrade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
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
                          <option value="10°">Décimo (10°)</option>
                          <option value="11°">Undécimo (11°)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.shift} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="studentShift"
                          value={formData.studentShift}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Mañana">Jornada Mañana (6:30 AM - 12:30 PM)</option>
                          <option value="Tarde">Jornada Tarde (12:30 PM - 6:30 PM)</option>
                          <option value="Única">Jornada Única</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Student Residence & Contact */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? '3. Residencia y Contacto del Estudiante' : 'Student Residence & Contact'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Dirección de Residencia del Estudiante <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentAddress"
                          value={formData.studentAddress}
                          onChange={handleInputChange}
                          placeholder="Ej: Calle 45 # 12-34"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentAddress
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentAddress && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentAddress}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Barrio o Sector <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentNeighborhood"
                          value={formData.studentNeighborhood}
                          onChange={handleInputChange}
                          placeholder="Ej: Boston, Prado Centro, Laureles..."
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentNeighborhood
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentNeighborhood && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentNeighborhood}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Celular o Teléfono de Contacto <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="tel"
                          name="studentPhone"
                          value={formData.studentPhone}
                          onChange={handleInputChange}
                          placeholder="Ej: 315 987 6543"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentPhone
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentPhone && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentPhone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Correo Electrónico del Estudiante <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          name="studentEmail"
                          value={formData.studentEmail}
                          onChange={handleInputChange}
                          placeholder="estudiante@edumed.edu.co"
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.studentEmail
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.studentEmail && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.studentEmail}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ACADEMIC BACKGROUND & MEDICAL */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? 'Antecedentes Escolares y Registro Médico' : t.wizard.sections.academicInfo}
                    </h2>
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.previousSchool} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleInputChange}
                          placeholder={language === 'es' ? 'Ej: I.E. San José o "Primera vez escolar / Preescolar"' : t.wizard.placeholders.previousSchool}
                          className={`w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.previousSchool
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.previousSchool && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.previousSchool}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {language === 'es' ? 'EPS Afiliada, Alergias y Observaciones Médicas' : t.wizard.fields.observations} <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <textarea
                          rows={4}
                          name="medicalNotes"
                          value={formData.medicalNotes}
                          onChange={handleInputChange}
                          placeholder={language === 'es' ? 'Ej: EPS Sura. Ninguna alergia reportada. No requiere medicación especial.' : t.wizard.placeholders.writeHere}
                          className={`w-full px-3.5 py-3 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.medicalNotes
                              ? 'border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 focus:ring-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-teal-500'
                          }`}
                        />
                        {errors.medicalNotes && (
                          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.medicalNotes}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">
                          {language === 'es' ? 'Información necesaria para la activación de la póliza de accidentes escolares estudiantil.' : 'Required for student medical policy.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENT UPLOADS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? 'Documentación Obligatoria Requerida' : t.wizard.sections.documentsList}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {language === 'es' 
                        ? 'Adjunte los archivos requeridos en formato PDF o imagen nítida (JPG/PNG). Si no adjunta los documentos requeridos marcados con asterisco (*), no se le permitirá ingresar al paso de radicación final.' 
                        : 'Attach the required files in PDF or crisp image format (JPG/PNG).'}
                    </p>

                    <div className="space-y-4">
                      {uploadedFiles.map((docItem, idx) => {
                        const hasError = Boolean(errors[`file_${idx}`]);
                        const isAttached = Boolean(docItem.fileName);

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              hasError
                                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-500'
                                : isAttached
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                isAttached
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : hasError
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                  : 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                              }`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {docItem.name}
                                  </span>
                                  {docItem.required ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold border border-rose-200 dark:border-rose-800">
                                      {language === 'es' ? 'Obligatorio *' : 'Required *'}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold">
                                      {language === 'es' ? 'Opcional' : 'Optional'}
                                    </span>
                                  )}
                                </div>

                                {isAttached ? (
                                  <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{docItem.fileName}</span>
                                  </span>
                                ) : hasError ? (
                                  <span className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1 font-bold">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{errors[`file_${idx}`]}</span>
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                                    {language === 'es' ? 'Ningún archivo cargado aún' : 'No file uploaded yet'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <label className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs self-start sm:self-auto ${
                              isAttached
                                ? 'bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50'
                                : hasError
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                            }`}>
                              <Upload className="w-3.5 h-3.5" />
                              <span>
                                {isAttached 
                                  ? (language === 'es' ? 'Cambiar archivo' : 'Change file')
                                  : (language === 'es' ? 'Seleccionar archivo' : 'Select file')}
                              </span>
                              <input
                                type="file"
                                accept=".pdf,image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={(e) => handleFileChange(idx, e)}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUMMARY */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      {language === 'es' ? 'Resumen Oficial de la Matrícula para Radicación' : 'Application Summary'}
                    </h2>

                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <span className="text-slate-400 block text-xs font-semibold">{language === 'es' ? 'Estudiante Aspirante' : 'Student'}:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-base">
                            {formData.studentFirstNames} {formData.studentLastNames}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                            {formData.studentDocType}: {formData.studentDocNumber} • {formData.studentGender} • RH {formData.studentBloodType}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            {formData.studentAddress}, {formData.studentNeighborhood}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-xs font-semibold">{language === 'es' ? 'Grado y Jornada Escolar' : 'Grade & Shift'}:</span>
                          <span className="font-extrabold text-teal-700 dark:text-teal-400 text-base">
                            Grado {formData.studentGrade} - Jornada {formData.studentShift}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                            Periodo Académico: 2025 • I.E. Félix Henao Botero
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            Institución previa: {formData.previousSchool}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 block text-xs font-semibold">{language === 'es' ? 'Acudiente Responsable' : 'Primary Guardian'}:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formData.guardianFirstNames} {formData.guardianLastNames} ({formData.guardianRelationship})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs mt-0.5">
                            {formData.guardianDocType}: {formData.guardianDocNumber}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            Tel: {formData.guardianPhone} • {formData.guardianEmail}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-xs font-semibold">{language === 'es' ? 'Documentos Adjuntos Validados' : 'Attached Documents'}:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {uploadedFiles.filter(f => f.fileName).length} de {uploadedFiles.length} {language === 'es' ? 'archivos cargados con éxito' : 'files attached'}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs mt-1">
                            Salud: {formData.medicalNotes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Final Sworn Oath Checkbox */}
                    <div className={`mt-5 p-4 rounded-2xl border transition-all ${
                      errors.finalOath
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800'
                        : 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                    }`}>
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={finalOathAccepted}
                          onChange={(e) => {
                            setFinalOathAccepted(e.target.checked);
                            if (errors.finalOath) {
                              setErrors(prev => {
                                const next = { ...prev };
                                delete next.finalOath;
                                return next;
                              });
                              setTopBannerError(null);
                            }
                          }}
                          className="mt-1 w-5 h-5 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                          {language === 'es'
                            ? 'Certifico bajo la gravedad de juramento que todos los datos y documentos suministrados en este formulario de matrícula son verídicos, corresponden a la realidad y han sido diligenciados a cabalidad conforme a las normas del Ministerio de Educación Nacional.'
                            : 'I certify under oath that all data and documents provided are true and accurate.'}
                        </span>
                      </label>
                      {errors.finalOath && (
                        <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.finalOath}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: CONFIRMATION / SUCCESS */}
              {currentStep === 6 && (
                <div className="py-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {language === 'es' ? '¡Matrícula Radicada con Éxito!' : 'Enrollment Successfully Submitted!'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      {language === 'es' 
                        ? 'La solicitud de matrícula ha sido radicada formalmente ante la secretaría académica de la I.E. Félix Henao Botero. Guarde su número de radicado oficial.' 
                        : 'Your application has been registered in the admissions system. Please save your application code.'}
                    </p>
                  </div>

                  {/* Code Card */}
                  <div className="max-w-xs mx-auto p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 shadow-sm">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                      {language === 'es' ? 'Número de Radicado Oficial' : t.statusLookup.radicado}
                    </span>
                    <span className="text-2xl font-black text-teal-700 dark:text-teal-400 tracking-wider">
                      {generatedRadicado || '#MAT-2025-4581'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => setActiveTab('status')}
                      className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>{language === 'es' ? 'Consultar Estado de Matrícula' : t.nav.status}</span>
                    </button>

                    <button
                      onClick={() => {
                        const receiptContent = `I.E. FÉLIX HENAO BOTERO\nCOMPROBANTE OFICIAL DE RADICACIÓN DE MATRÍCULA\nRadicado: ${generatedRadicado || '#MAT-2025-4581'}\nEstudiante: ${formData.studentFirstNames} ${formData.studentLastNames} (${formData.studentDocType} ${formData.studentDocNumber})\nGrado: ${formData.studentGrade} - Jornada ${formData.studentShift}\nAcudiente: ${formData.guardianFirstNames} ${formData.guardianLastNames}\nFecha: ${new Date().toLocaleDateString('es-CO')}\nEstado: EN REVISIÓN DOCUMENTAL\nMedellín, Antioquia`;
                        const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `Comprobante_Matricula_${generatedRadicado || 'MAT'}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'es' ? 'Descargar Comprobante' : 'Download Receipt'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDEBAR (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Steps Progress Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                {language === 'es' ? 'Pasos para Matricularse' : 'Application Progress'}
              </h3>

              <div className="space-y-2.5">
                {stepsList.map((st) => {
                  const Icon = st.icon;
                  const isCompleted = currentStep > st.num || currentStep === 6;
                  const isCurrent = currentStep === st.num;

                  return (
                    <button
                      key={st.num}
                      type="button"
                      onClick={() => handleStepJump(st.num)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border-2 border-teal-500 dark:border-teal-700 shadow-xs'
                          : isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                      </div>
                      <span className="flex-1">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Card */}
            {currentStep < 6 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  {t.wizard.actionsTitle}
                </h3>

                {topBannerError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Debe completar todos los datos para continuar.</span>
                  </div>
                )}

                <button
                  id="wizard-continue-btn"
                  onClick={handleNextStep}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currentStep === 5 ? (language === 'es' ? 'Radicar Matrícula Definitiva' : t.wizard.finish) : (language === 'es' ? 'Guardar y Continuar al Siguiente Paso' : t.wizard.saveAndContinue)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="wizard-draft-btn"
                  onClick={handleSaveDraft}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.wizard.saveDraft}</span>
                </button>

                {currentStep > 1 && (
                  <button
                    onClick={() => {
                      setCurrentStep((prev) => prev - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.wizard.backToPrev}</span>
                  </button>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p>
                    {language === 'es' 
                      ? 'Validación estricta institucional: No se permite avanzar si faltan datos o documentos obligatorios.' 
                      : t.wizard.actionsNote}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
