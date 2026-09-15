import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { StudentDocument } from '../../types';

export const DocumentsManagement: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    documents, 
    updateDocumentStatus 
  } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-6');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rejection modal state
  const [rejectingDoc, setRejectingDoc] = useState<StudentDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentDocs = documents.filter((d) => d.studentId === selectedStudent?.id);

  const totalDocs = studentDocs.length;
  const approvedDocs = studentDocs.filter((d) => d.status === 'approved').length;
  const progressPercent = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.documentNumber.includes(searchTerm)
  );

  const handleApprove = (docId: string) => {
    updateDocumentStatus(docId, 'approved');
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
            <span>42 {t.admin.documents.pendingCount}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>128 {t.admin.documents.completedCount}</span>
          </div>
        </div>
      </div>

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
          </div>

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
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Reject Modal */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.admin.documents.rejectModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setRejectingDoc(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>

              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>{t.admin.documents.confirmReject}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {previewDoc.name}
                </h3>
                <span className="text-xs text-teal-600 dark:text-teal-400">{previewDoc.fileName}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document simulated view */}
            <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <FileText className="w-16 h-16 text-teal-600/60" />
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {previewDoc.fileName}
                </div>
                <div className="text-xs text-slate-400">
                  {language === 'es' ? 'Documento institucional oficial verificado para matrícula.' : 'Official institutional enrollment document.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
