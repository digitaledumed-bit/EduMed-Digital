import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderKanban, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  FileText, 
  Mail, 
  Phone, 
  AlertCircle, 
  X, 
  Check, 
  RefreshCw,
  ExternalLink,
  Upload,
  Plus,
  UserCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { StudentDocument } from '../../types';
import { DocumentPreviewModal } from '../common/DocumentPreviewModal';

export const DocumentsManagement: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    documents, 
    updateDocumentStatus,
    approveAllStudentDocumentsAndEnrollment,
    addStudentDocument,
    currentUser,
    guardians,
    enrollments,
    setActiveTab,
    selectedStudentId: appSelectedStudentId,
    setSelectedStudentId: setAppSelectedStudentId
  } = useApp();

  const isGuardian = currentUser?.role === 'guardian';
  const isAdmin = currentUser?.role === 'admin';
  const isAdminOrStaff = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  // If guardian, find linked students
  const guardianEmail = currentUser?.email?.toLowerCase().trim() || '';
  const guardianName = currentUser?.name?.toLowerCase().trim() || '';
  const guardianDocDigits = (currentUser?.documentNumber || '').replace(/\D/g, '');

  const myGuardian = isGuardian
    ? guardians.find(
        (g) =>
          (currentUser.documentNumber && g.documentNumber === currentUser.documentNumber) ||
          (currentUser.email && g.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
          g.fullName.toLowerCase().includes(currentUser.name.toLowerCase())
      )
    : null;

  const availableStudents = isGuardian
    ? students.filter((student) => {
        const hasInGuardians = student.guardians && student.guardians.some((g) => {
          const gEmail = (g.email || '').toLowerCase().trim();
          const gName = (g.name || '').toLowerCase().trim();
          const gPhone = (g.phone || '').replace(/\D/g, '');
          const uPhone = (currentUser?.phone || '').replace(/\D/g, '');
          return (guardianEmail && gEmail === guardianEmail) ||
                 (guardianName && gName && (gName.includes(guardianName) || guardianName.includes(gName))) ||
                 (uPhone && gPhone && uPhone === gPhone);
        });
        if (hasInGuardians) return true;

        if (myGuardian && myGuardian.associatedStudents?.some((as) => as.id === student.id)) return true;

        const hasEnrollment = enrollments.some((e) => {
          const eEmail = (e.guardianEmail || '').toLowerCase().trim();
          const eName = (e.guardianName || '').toLowerCase().trim();
          const eDoc = (e.guardianDoc || '').replace(/\D/g, '');
          const isMatch = (guardianEmail && eEmail === guardianEmail) ||
                          (guardianDocDigits && eDoc && guardianDocDigits === eDoc) ||
                          (guardianName && eName && (eName.includes(guardianName) || guardianName.includes(eName)));
          return isMatch && (e.studentId === student.id || e.studentDoc === student.documentNumber);
        });
        return hasEnrollment;
      })
    : students;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    () => appSelectedStudentId || availableStudents[0]?.id || ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (appSelectedStudentId && availableStudents.some((s) => s.id === appSelectedStudentId)) {
      setSelectedStudentId(appSelectedStudentId);
    }
  }, [appSelectedStudentId, availableStudents]);

  // Rejection modal state
  const [rejectingDoc, setRejectingDoc] = useState<StudentDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Preview Modal state (for existing documents)
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  // New Document Upload State with Live Preview (Guardians only)
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadDocName, setUploadDocName] = useState<string>('Documento Adicional');
  const [uploadDocCategory, setUploadDocCategory] = useState<'identity' | 'health' | 'academic' | 'other'>('identity');
  const [isUploadPreviewOpen, setIsUploadPreviewOpen] = useState<boolean>(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const selectedStudent = availableStudents.find((s) => s.id === selectedStudentId) || availableStudents[0] || students[0];
  const studentDocs = documents.filter(
    (d) =>
      d.studentId === selectedStudent?.id ||
      (selectedStudent?.fullName && d.studentName === selectedStudent?.fullName)
  );

  const studentEnrollment = enrollments.find(
    (e) =>
      e.studentId === selectedStudent?.id ||
      (selectedStudent?.documentNumber && e.studentDoc === selectedStudent?.documentNumber) ||
      (selectedStudent?.fullName && e.studentName?.toLowerCase().includes(selectedStudent?.fullName?.toLowerCase()))
  );

  const totalDocs = studentDocs.length;
  const approvedDocs = studentDocs.filter((d) => d.status === 'approved').length;
  const progressPercent = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

  const filteredStudents = availableStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.documentNumber.includes(searchTerm)
  );

  const handleApprove = (docId: string) => {
    updateDocumentStatus(docId, 'approved');
    const remainingUnapproved = studentDocs.filter(d => d.id !== docId && d.status !== 'approved');
    if (remainingUnapproved.length === 0) {
      setStatusFeedback(
        language === 'es'
          ? '¡Todos los documentos han sido aprobados! La solicitud de matrícula ahora figura como "Matrícula Aprobada" en el sistema.'
          : 'All documents approved! The enrollment is now officially marked as "Approved".'
      );
    } else {
      setStatusFeedback(
        language === 'es'
          ? `Documento aprobado exitosamente. Restan ${remainingUnapproved.length} documento(s) por auditar para formalizar la matrícula.`
          : 'Document approved successfully.'
      );
    }
    setTimeout(() => setStatusFeedback(null), 6000);
  };

  const handleApproveAllAndValidateEnrollment = () => {
    if (selectedStudent) {
      approveAllStudentDocumentsAndEnrollment(selectedStudent.id);
      setStatusFeedback(
        language === 'es'
          ? '¡Expediente auditado y validado! Todos los documentos fueron aprobados y la solicitud figura como "Matrícula Aprobada" en Solicitudes de Matrícula.'
          : 'Digital record validated! All documents approved and enrollment officially marked as Approved.'
      );
      setTimeout(() => setStatusFeedback(null), 6000);
    }
  };

  const handleOpenRejectModal = (doc: StudentDocument) => {
    setRejectingDoc(doc);
    setRejectionReason(doc.rejectionReason || '');
  };

  const handleConfirmReject = () => {
    if (rejectingDoc) {
      updateDocumentStatus(rejectingDoc.id, 'rejected', rejectionReason || 'El archivo subido no cumple con los criterios de legibilidad.');
      setRejectingDoc(null);
      setRejectionReason('');
    }
  };

  const handleSelectFileToUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingFile(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setUploadDocName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
      setIsUploadPreviewOpen(true);
      e.target.value = '';
    }
  };

  const handleConfirmFileUpload = () => {
    if (uploadingFile && selectedStudent) {
      const fileSize = `${(uploadingFile.size / (1024 * 1024)).toFixed(2)} MB`;
      const docName = uploadDocName.trim() || 'Documento de Soporte';
      addStudentDocument({
        studentId: selectedStudent.id,
        name: docName,
        category: uploadDocCategory,
        fileName: uploadingFile.name,
        fileSize,
        file: uploadingFile
      });
      setIsUploadPreviewOpen(false);
      setUploadingFile(null);
      setUploadSuccessToast(docName);
      setTimeout(() => setUploadSuccessToast(null), 4000);
    }
  };

  const allPendingDocsCount = documents.filter((d) => d.status === 'in_review' || d.status === 'pending').length;
  const allApprovedDocsCount = documents.filter((d) => d.status === 'approved').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.admin.documents.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.documents.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{allPendingDocsCount} {t.admin.documents.pendingCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{allApprovedDocsCount} {t.admin.documents.completedCount}</span>
          </div>
        </div>
      </div>

      {availableStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
            <FolderKanban className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'es' ? 'No hay estudiantes a cargo inscritos' : 'No Enrolled Students Under Your Care'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === 'es'
                ? 'No tienes estudiantes inscritos a tu cargo para gestionar su expediente y documentos. Por favor formaliza la inscripción de un estudiante primero.'
                : 'You do not have any enrolled students under your care to manage documents. Please enroll a student first.'}
            </p>
          </div>
          {isGuardian && (
            <button
              onClick={() => setActiveTab('wizard')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'es' ? 'Inscribir Estudiante' : 'Enroll Student'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Student Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.admin.documents.searchStudent}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Students list */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">
                {t.admin.documents.studentsList}
              </span>

              {filteredStudents.map((std) => {
                const isSelected = std.id === selectedStudentId;
                const stdDocs = documents.filter(d => d.studentId === std.id);
                const hasPending = stdDocs.some(d => d.status === 'in_review' || d.status === 'rejected');

                return (
                  <button
                    key={std.id}
                    onClick={() => setSelectedStudentId(std.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white font-semibold shadow-md shadow-teal-900/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={std.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={std.fullName}
                        className={`w-8 h-8 rounded-full object-cover shrink-0 border ${isSelected ? 'border-white' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {std.fullName}
                        </div>
                        <div className={`text-[11px] truncate ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                          {std.grade} • ID: {std.documentNumber}
                        </div>
                      </div>
                    </div>

                    {hasPending && (
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column: Selected Student's Document Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Student Info Card & Progress */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={selectedStudent?.fullName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-teal-500"
                />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {selectedStudent?.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {selectedStudent?.documentNumber} • {selectedStudent?.grade} - Jornada {selectedStudent?.shift}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedStudent?.phone}`}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.admin.documents.contactStudent}</span>
                </a>
              </div>
            </div>

            {/* Overall Document Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {t.admin.documents.overallProgress}
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-400">
                  {progressPercent}% ({approvedDocs} de {totalDocs} {t.admin.documents.approved.toLowerCase()}s)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Student Enrollment Status Linkage */}
            {studentEnrollment && (
              <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                studentEnrollment.status === 'approved'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : studentEnrollment.status === 'rejected'
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {studentEnrollment.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : studentEnrollment.status === 'rejected' ? (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm">
                        {studentEnrollment.status === 'approved' 
                          ? (language === 'es' ? 'Matrícula Aprobada' : 'Enrollment Approved')
                          : (language === 'es' ? 'Solicitud de Matrícula en Validación Documental' : 'Enrollment Under Document Review')}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 border border-current">
                        {studentEnrollment.id}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                      {studentEnrollment.status === 'approved'
                        ? (language === 'es' 
                            ? 'Documentos verificados y validados. La solicitud figura como Matrícula Aprobada oficialmente en el sistema.' 
                            : 'Documents verified and validated. Enrollment is officially marked Approved.')
                        : (language === 'es'
                            ? 'Al auditar y aprobar los documentos del expediente digital, la matrícula se actualizará automáticamente a "Matrícula Aprobada".'
                            : 'Upon approving digital record documents, enrollment will automatically update to Approved.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {studentEnrollment.status !== 'approved' && isAdminOrStaff && (
                    <button
                      type="button"
                      onClick={handleApproveAllAndValidateEnrollment}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-98"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Aprobar Todo y Formalizar Matrícula' : 'Approve All & Formalize'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('enrollments')}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'es' ? 'Ver en Solicitudes de Matrícula' : 'View in Enrollments'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Toast Notification for Approval or Auto-Approval */}
          {statusFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{statusFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusFeedback(null)}
                className="text-emerald-700 dark:text-emerald-300 hover:underline font-bold text-xs ml-3"
              >
                ✕
              </button>
            </div>
          )}

          {/* Toast Notification for Upload */}
          {uploadSuccessToast && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Documento "{uploadSuccessToast}" subido exitosamente al expediente y enviado a auditoría.</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadSuccessToast(null)}
                className="text-emerald-700 dark:text-emerald-300 hover:underline font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header of Document list: For Admin -> Audit Mode ONLY (NO UPLOAD). For Guardian -> Upload */}
          {isAdmin ? (
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center shrink-0 text-teal-700 dark:text-teal-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-teal-600" />
                      <span>{language === 'es' ? 'Archivos del Expediente Digital' : 'Digital Record Files'}</span>
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-200/80 dark:bg-teal-900/80 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700">
                      {language === 'es' ? 'Auditoría Administrativa General' : 'General Admin Audit'}
                    </span>
                  </div>
                  <p className="text-xs text-teal-800 dark:text-teal-300 mt-1 max-w-2xl leading-relaxed">
                    {language === 'es' 
                      ? 'Los documentos son radicados y adjuntados exclusivamente por los acudientes. Como Administrador General tu función oficial es auditar, verificar legibilidad y aprobar o rechazar cada documento para formalizar la matrícula escolar.' 
                      : 'Documents are uploaded exclusively by guardians. Your role as General Administrator is to audit and approve or reject them to formalize enrollment.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 text-xs font-bold border border-teal-300 dark:border-teal-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'es' ? 'Cargado por Acudientes' : 'Uploaded by Guardians'}</span>
                </span>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  setUploadingFile(file);
                  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                  setUploadDocName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
                  setIsUploadPreviewOpen(true);
                }
              }}
              className={`p-5 rounded-2xl border transition-all ${
                isDragging 
                  ? 'border-2 border-dashed border-teal-500 bg-teal-50/80 dark:bg-teal-950/60 shadow-lg' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-teal-600" />
                    <span>{language === 'es' ? 'Archivos del Expediente Digital' : 'Digital Record Files'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'es' 
                      ? 'Arrastra o selecciona archivos PDF o imágenes para ver la vista previa interactiva antes de radicar.' 
                      : 'Drag or select PDF/image files to view interactive preview before submitting.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]">
                    <Upload className="w-4 h-4" />
                    <span>{language === 'es' ? 'Subir Nuevo Documento' : 'Upload New Document'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleSelectFileToUpload}
                    />
                  </label>
                </div>
              </div>

              {isDragging && (
                <div className="mt-3 p-3 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-bold text-center animate-pulse">
                  {language === 'es' ? 'Suelta el archivo aquí para abrir la vista previa instantánea' : 'Drop file here to open instant preview'}
                </div>
              )}
            </div>
          )}

          {/* Document Cards List */}
          <div className="space-y-4">
            {studentDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                {/* Top Row: File Name & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {doc.name}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          ({doc.fileSize})
                        </span>
                      </div>
                      <span className="text-xs text-teal-700 dark:text-teal-400 font-medium block mt-0.5">
                        {doc.fileName}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-[11px] font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>
                            {language === 'es' ? 'Subido por Acudiente:' : 'Uploaded by Guardian:'}{' '}
                            <strong className="text-teal-950 dark:text-teal-100">{doc.uploadedBy || 'Acudiente Autorizado'}</strong>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {language === 'es' ? 'Radicado:' : 'Filed:'} {doc.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    doc.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : doc.status === 'rejected'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {doc.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                    {doc.status === 'rejected' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                    {doc.status === 'in_review' && <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />}
                    {t.statuses[doc.status]}
                  </span>
                </div>

                {/* If Rejected: Display Rejection Reason Box */}
                {doc.status === 'rejected' && doc.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">
                      {t.admin.documents.reasonForRejection}
                    </span>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                      "{doc.rejectionReason}"
                    </p>
                  </div>
                )}

                {/* Bottom Row: Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t.admin.documents.openDoc}</span>
                    </button>
                    <span className="text-slate-400 text-[11px]">
                      Subido: {doc.uploadDate}
                    </span>
                  </div>

                  {isAdminOrStaff && (
                    <div className="flex items-center gap-2">
                      {/* Approve Button */}
                      <button
                        onClick={() => handleApprove(doc.id)}
                        disabled={doc.status === 'approved'}
                        className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          doc.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 opacity-60'
                            : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.admin.documents.approveBtn}</span>
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => handleOpenRejectModal(doc)}
                        className="px-3.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.admin.documents.rejectBtn}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
      )}

      {/* Reject Modal */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.admin.documents.rejectModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setRejectingDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t.admin.documents.rejectModalDesc}
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t.admin.documents.rejectPlaceholder}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>{t.admin.documents.confirmReject}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal for Document being uploaded */}
      {uploadingFile && (
        <DocumentPreviewModal
          isOpen={isUploadPreviewOpen}
          onClose={() => {
            setIsUploadPreviewOpen(false);
            setUploadingFile(null);
          }}
          isUploadingPreview={true}
          documentName={uploadDocName}
          fileName={uploadingFile.name}
          file={uploadingFile}
          studentName={selectedStudent?.fullName}
          studentGrade={selectedStudent?.grade}
          studentDoc={selectedStudent?.documentNumber}
          onConfirmUpload={handleConfirmFileUpload}
          onCancelUpload={() => {
            setIsUploadPreviewOpen(false);
            setUploadingFile(null);
          }}
          confirmBtnText={language === 'es' ? 'Confirmar y Subir al Expediente' : 'Confirm & Upload to Record'}
        />
      )}

      {/* Preview Modal for Existing Audited Documents */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          documentName={previewDoc.name}
          fileName={previewDoc.fileName}
          fileSize={previewDoc.fileSize}
          fileUrl={previewDoc.fileUrl}
          status={previewDoc.status}
          uploadDate={previewDoc.uploadDate}
          studentName={selectedStudent?.fullName}
          studentGrade={selectedStudent?.grade}
          studentDoc={selectedStudent?.documentNumber}
        />
      )}

    </div>
  );
};
