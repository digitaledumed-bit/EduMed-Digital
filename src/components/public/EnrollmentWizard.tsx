import React, { useState } from 'react';
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
  Search
} from 'lucide-react';

export const EnrollmentWizard: React.FC = () => {
  const { t, language, submitNewEnrollment, setActiveTab } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [saveDraftMessage, setSaveDraftMessage] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [generatedRadicado, setGeneratedRadicado] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Guardian
    guardianDocType: 'CC',
    guardianDocNumber: '1034567890',
    guardianFirstNames: 'Carlos Eduardo',
    guardianLastNames: 'Ramírez Soto',
    guardianPhone: '+57 300 123 4567',
    guardianEmail: 'carlos.ramirez@email.com',
    guardianAddress: 'Calle 45 # 12-34, Apto 501',
    guardianNeighborhood: 'El Poblado',
    guardianRelationship: 'Padre',
    guardianPassword: '••••••••••••',
    guardianConfirmPassword: '••••••••••••',

    // Step 2: Student
    studentDocType: 'TI',
    studentDocNumber: '100234988',
    studentFirstNames: 'Mariana',
    studentLastNames: 'Ríos Osorio',
    studentBirthDate: '2008-04-12',
    studentGender: 'Femenino',
    studentBloodType: 'O+',
    studentGrade: '10°',
    studentShift: 'Mañana',
    studentAddress: 'Calle 45 # 12-34, Apto 501',
    studentNeighborhood: 'El Poblado',
    studentPhone: '+57 300 123 4567',
    studentEmail: 'mariana.rios@edumed.edu.co',

    // Step 3: Academic
    previousSchool: 'Colegio San José Medellín',
    medicalNotes: 'Rinitis alérgica controlada. No presenta restricciones físicas para educación física.'
  });

  // Step 4: Uploaded Files
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; required: boolean; file: File | null; fileName: string }[]>([
    { name: 'Documento de Identidad del Estudiante', required: true, file: null, fileName: 'TI_Mariana_Rios.pdf' },
    { name: 'Documento de Identidad del Acudiente', required: true, file: null, fileName: 'CC_Carlos_Ramirez.pdf' },
    { name: 'Certificado Médico EPS (Últimos 3 meses)', required: true, file: null, fileName: 'Certificado_Medico_EPS_2024.pdf' },
    { name: 'Certificado de Calificaciones Año Anterior', required: true, file: null, fileName: 'Certificado_Notas_Grado9.pdf' },
    { name: 'Paz y Salvo Institución Anterior', required: false, file: null, fileName: 'Paz_Salvo_SanJose.pdf' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('edumed_enrollment_draft', JSON.stringify({ formData, currentStep }));
    setSaveDraftMessage(true);
    setTimeout(() => setSaveDraftMessage(false), 4000);
  };

  const handleNextStep = () => {
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

  const stepsList = [
    { num: 1, label: language === 'es' ? 'Acudiente' : 'Guardian', icon: User },
    { num: 2, label: language === 'es' ? 'Estudiante' : 'Student', icon: GraduationCap },
    { num: 3, label: language === 'es' ? 'Info Académica' : 'Academic', icon: HeartPulse },
    { num: 4, label: language === 'es' ? 'Documentos' : 'Documents', icon: FolderCheck },
    { num: 5, label: language === 'es' ? 'Revisión' : 'Review', icon: FileCheck2 },
    { num: 6, label: language === 'es' ? 'Radicado' : 'Submitted', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentStep === 1 && t.wizard.step1Title}
                    {currentStep === 2 && t.wizard.step2Title}
                    {currentStep === 3 && t.wizard.step3Title}
                    {currentStep === 4 && t.wizard.step4Title}
                    {currentStep === 5 && t.wizard.step5Title}
                    {currentStep === 6 && t.wizard.step6Title}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                    {language === 'es' ? `Paso ${currentStep} de 6` : `Step ${currentStep} of 6`}
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {currentStep === 1 && t.wizard.step1Subtitle}
                  {currentStep === 2 && t.wizard.step2Subtitle}
                  {currentStep === 3 && t.wizard.step3Subtitle}
                  {currentStep === 4 && t.wizard.step4Subtitle}
                  {currentStep === 5 && t.wizard.step5Subtitle}
                  {currentStep === 6 && t.wizard.step6Subtitle}
                </p>
              </div>

              {/* STEP 1: GUARDIAN REGISTRATION */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  {/* Section 1: Personal Info */}
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.personalInfo}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docType} *
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
                          {t.wizard.fields.docNumber} *
                        </label>
                        <input
                          type="text"
                          name="guardianDocNumber"
                          value={formData.guardianDocNumber}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.docNumber}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.firstNames} *
                        </label>
                        <input
                          type="text"
                          name="guardianFirstNames"
                          value={formData.guardianFirstNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.names}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.lastNames} *
                        </label>
                        <input
                          type="text"
                          name="guardianLastNames"
                          value={formData.guardianLastNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.lastNames}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Data */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.contactData}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.phone} *
                        </label>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.phone}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.email} *
                        </label>
                        <input
                          type="email"
                          name="guardianEmail"
                          value={formData.guardianEmail}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.email}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.address} *
                        </label>
                        <input
                          type="text"
                          name="guardianAddress"
                          value={formData.guardianAddress}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.address}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.neighborhood} *
                        </label>
                        <input
                          type="text"
                          name="guardianNeighborhood"
                          value={formData.guardianNeighborhood}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.neighborhood}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.relationship} *
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
                          <option value="Otro">Otro parentesco</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Account Security */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.accountSecurity}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.password} *
                        </label>
                        <input
                          type="password"
                          name="guardianPassword"
                          value={formData.guardianPassword}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.passwordMin}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.confirmPassword} *
                        </label>
                        <input
                          type="password"
                          name="guardianConfirmPassword"
                          value={formData.guardianConfirmPassword}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.passwordMin}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t.wizard.sections.termsAgreement}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: STUDENT INFORMATION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.studentPersonal}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.docType} *
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
                          {t.wizard.fields.docNumber} *
                        </label>
                        <input
                          type="text"
                          name="studentDocNumber"
                          value={formData.studentDocNumber}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.docNumber}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.firstNames} *
                        </label>
                        <input
                          type="text"
                          name="studentFirstNames"
                          value={formData.studentFirstNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.names}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.lastNames} *
                        </label>
                        <input
                          type="text"
                          name="studentLastNames"
                          value={formData.studentLastNames}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.lastNames}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.birthDate} *
                        </label>
                        <input
                          type="date"
                          name="studentBirthDate"
                          value={formData.studentBirthDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.gender} *
                        </label>
                        <select
                          name="studentGender"
                          value={formData.studentGender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        >
                          <option value="Femenino">Femenino</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Otro">Otro / Prefiero no decir</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.gradeApplying} *
                        </label>
                        <select
                          name="studentGrade"
                          value={formData.studentGrade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                          {t.wizard.fields.shift} *
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
                </div>
              )}

              {/* STEP 3: ACADEMIC BACKGROUND & MEDICAL */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.academicInfo}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.previousSchool}
                        </label>
                        <input
                          type="text"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.previousSchool}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          {t.wizard.fields.observations}
                        </label>
                        <textarea
                          rows={4}
                          name="medicalNotes"
                          value={formData.medicalNotes}
                          onChange={handleInputChange}
                          placeholder={t.wizard.placeholders.writeHere}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENT UPLOADS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {t.wizard.sections.documentsList}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {language === 'es' 
                        ? 'Adjunte los archivos requeridos en formato PDF o imagen nítida (JPG/PNG). Tamaño máximo: 10MB por archivo.' 
                        : 'Attach the required files in PDF or crisp image format (JPG/PNG). Max size: 10MB per file.'}
                    </p>

                    <div className="space-y-4">
                      {uploadedFiles.map((docItem, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                  {docItem.name}
                                </span>
                                {docItem.required && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold">
                                    {language === 'es' ? 'Requerido' : 'Required'}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1 mt-1 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {docItem.fileName}
                              </span>
                            </div>
                          </div>

                          <label className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs self-start sm:self-auto">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{language === 'es' ? 'Cambiar archivo' : 'Change file'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(idx, e)}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & SUMMARY */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      {language === 'es' ? 'Resumen de la Solicitud' : 'Application Summary'}
                    </h2>

                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <span className="text-slate-400 block text-xs">{language === 'es' ? 'Estudiante' : 'Student'}:</span>
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {formData.studentFirstNames} {formData.studentLastNames}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            {formData.studentDocType}: {formData.studentDocNumber}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-xs">{language === 'es' ? 'Grado y Jornada' : 'Grade & Shift'}:</span>
                          <span className="font-bold text-teal-700 dark:text-teal-400 text-base">
                            {formData.studentGrade} - {formData.studentShift}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            Año Académico: 2024 - 2025
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 block text-xs">{language === 'es' ? 'Acudiente Principal' : 'Primary Guardian'}:</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formData.guardianFirstNames} {formData.guardianLastNames} ({formData.guardianRelationship})
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 block text-xs">
                            {formData.guardianPhone} • {formData.guardianEmail}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-xs">{language === 'es' ? 'Documentos Adjuntos' : 'Attached Documents'}:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {uploadedFiles.length} {language === 'es' ? 'archivos listos para radicar' : 'files ready for submission'}
                          </span>
                        </div>
                      </div>
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
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {language === 'es' ? '¡Matrícula Radicada con Éxito!' : 'Enrollment Successfully Submitted!'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      {language === 'es' 
                        ? 'Su solicitud ha sido registrada en el sistema de admisiones de la I.E. Félix Henao Botero. Guarde su número de radicado.' 
                        : 'Your application has been registered in the admissions system. Please save your application code.'}
                    </p>
                  </div>

                  {/* Code Card */}
                  <div className="max-w-xs mx-auto p-4 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                    <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                      {t.statusLookup.radicado}
                    </span>
                    <span className="text-2xl font-black text-teal-700 dark:text-teal-400 tracking-wider">
                      {generatedRadicado || '#MAT-2024-8932'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => setActiveTab('status')}
                      className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      {t.nav.status}
                    </button>

                    <button
                      onClick={() => alert(language === 'es' ? 'Comprobante descargado en PDF.' : 'Receipt downloaded.')}
                      className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      {language === 'es' ? 'Descargar Comprobante' : 'Download Receipt'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDEBAR (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Steps Progress Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {language === 'es' ? 'Progreso del Trámite' : 'Application Progress'}
              </h3>

              <div className="space-y-3">
                {stepsList.map((st) => {
                  const Icon = st.icon;
                  const isCompleted = currentStep > st.num || currentStep === 6;
                  const isCurrent = currentStep === st.num;

                  return (
                    <div
                      key={st.num}
                      className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800'
                          : isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                      </div>
                      <span>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Card */}
            {currentStep < 6 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t.wizard.actionsTitle}
                </h3>

                <button
                  id="wizard-continue-btn"
                  onClick={handleNextStep}
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>{currentStep === 5 ? t.wizard.finish : t.wizard.saveAndContinue}</span>
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
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t.wizard.backToPrev}</span>
                  </button>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <p>{t.wizard.actionsNote}</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
