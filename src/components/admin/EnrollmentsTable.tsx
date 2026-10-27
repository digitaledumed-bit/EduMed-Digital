import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Download, 
  Plus, 
  Eye, 
  CheckCircle, 
  CheckCircle2,
  XCircle, 
  Clock, 
  FileText,
  FolderKanban,
  UserCheck
} from 'lucide-react';
import { EnrollmentStatus } from '../../types';

export const EnrollmentsTable: React.FC = () => {
  const { t, language, enrollments, documents, updateEnrollmentStatus, setActiveTab, setSelectedStudentId } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2026');

  const totalCount = enrollments.length;
  const approvedCount = enrollments.filter(e => e.status === 'approved' || e.status === 'completed').length;
  const inReviewCount = enrollments.filter(e => e.status === 'in_review').length;
  const pendingCount = enrollments.filter(e => e.status === 'pending').length;

  const filteredEnrollments = enrollments.filter((item) => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentDoc.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesYear = yearFilter === 'all' || item.academicYear.includes(yearFilter);

    return matchesSearch && matchesStatus && matchesYear;
  });

  const handleStatusChange = (id: string, newStatus: EnrollmentStatus) => {
    updateEnrollmentStatus(id, newStatus);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Estudiante,Documento,Grado,Año,Fecha,Estado"]
      .concat(filteredEnrollments.map(e => `${e.id},"${e.studentName}",${e.studentDoc},"${e.grade}","${e.academicYear}",${e.submissionDate},${e.status}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Matriculas_FelixHenao_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.admin.enrollments.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
              SIMAT 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.enrollments.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportData}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.admin.enrollments.exportBtn}</span>
          </button>

          <button
            onClick={() => setActiveTab('wizard')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.admin.enrollments.newEnrollmentBtn}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Matrículas Aprobadas */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'approved' ? 'all' : 'approved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'approved'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {language === 'es' ? 'Matrículas Aprobadas' : 'Approved Enrollments'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {approvedCount}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              {language === 'es' ? 'validadas' : 'approved'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {language === 'es' ? 'Expediente digital auditado y formalizado' : 'Audited and formalized record'}
          </p>
        </div>

        {/* Card 2: En Revisión */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'in_review' ? 'all' : 'in_review')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'in_review'
              ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 dark:border-amber-600 ring-2 ring-amber-500 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {language === 'es' ? 'En Revisión Documental' : 'In Document Review'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {inReviewCount}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
              {language === 'es' ? 'en trámite' : 'in progress'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {language === 'es' ? 'Por auditar en Archivos del Expediente' : 'Pending audit in records'}
          </p>
        </div>

        {/* Card 3: Pendientes */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 ring-2 ring-slate-500 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {language === 'es' ? 'Pendientes de Validación' : 'Pending Validation'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {language === 'es' ? 'espera' : 'waiting'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {language === 'es' ? 'Radicadas por acudientes en línea' : 'Submitted online by guardians'}
          </p>
        </div>

        {/* Card 4: Total Solicitudes */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-400 dark:border-teal-600 ring-2 ring-teal-500 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {language === 'es' ? 'Total Solicitudes' : 'Total Applications'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </span>
            <span className="text-xs text-teal-700 dark:text-teal-400 font-bold">
              {language === 'es' ? 'radicadas' : 'filed'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {language === 'es' ? 'Año lectivo 2026 oficial' : 'Official 2026 school year'}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
          {/* Search by ID, Name or Document */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.admin.enrollments.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow"
            />
          </div>

          {/* Academic Year filter */}
          <div className="w-full md:w-48">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              aria-label={language === 'es' ? 'Filtrar por año lectivo' : 'Filter by academic year'}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow cursor-pointer"
            >
              <option value="2026">{language === 'es' ? 'Año Lectivo 2026' : 'School Year 2026'}</option>
              <option value="2025">{language === 'es' ? 'Año Lectivo 2025' : 'School Year 2025'}</option>
              <option value="all">{language === 'es' ? 'Todos los Años' : 'All Years'}</option>
            </select>
          </div>

          {/* Status filter dropdown */}
          <div className="w-full md:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label={language === 'es' ? 'Filtrar por estado' : 'Filter by status'}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-shadow cursor-pointer font-medium"
            >
              <option value="all">{language === 'es' ? 'Todos los Estados' : 'All Statuses'}</option>
              <option value="approved">{language === 'es' ? 'Matrículas Aprobadas' : 'Approved'}</option>
              <option value="in_review">{language === 'es' ? 'En Revisión Documental' : 'In Review'}</option>
              <option value="pending">{language === 'es' ? 'Pendientes de Validación' : 'Pending'}</option>
              <option value="rejected">{language === 'es' ? 'Rechazadas' : 'Rejected'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table & Mobile Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
            <p className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200">
              {language === 'es' ? 'No se encontraron matrículas con los filtros seleccionados' : 'No enrollments match the selected filters'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'es' ? 'Intenta modificar el término de búsqueda, año o estado.' : 'Try adjusting your search query, academic year or status.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (< sm) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEnrollments.map((rec) => {
                const recDocs = documents.filter(
                  (d) => d.studentId === rec.studentId || (d.studentName && d.studentName === rec.studentName)
                );
                const recApprovedDocs = recDocs.filter((d) => d.status === 'approved').length;
                const allApproved = recDocs.length > 0 && recApprovedDocs === recDocs.length;

                return (
                  <div key={rec.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-teal-700 dark:text-teal-400 font-mono">
                        {rec.id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        rec.status === 'approved' || rec.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : rec.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {rec.status === 'approved' || rec.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                        ) : rec.status === 'rejected' ? (
                          <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1 text-amber-600" />
                        )}
                        {rec.status === 'approved' || rec.status === 'completed'
                          ? (language === 'es' ? 'Matrícula Aprobada' : 'Enrollment Approved')
                          : t.statuses[rec.status]}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {rec.studentName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Doc: {rec.studentDoc} • {rec.grade} • {rec.academicYear}
                      </p>
                      {rec.guardianName && (
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5 font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Acudiente: {rec.guardianName} ({rec.guardianRelationship || 'Responsable'})</span>
                        </p>
                      )}
                    </div>

                    {/* Document Status Pill */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        allApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {recApprovedDocs}/{recDocs.length} {language === 'es' ? 'Docs Aprobados' : 'Docs Approved'}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(rec.studentId);
                          setActiveTab('documents');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <FolderKanban className="w-3 h-3 text-teal-600" />
                        <span>{language === 'es' ? 'Ver Documentos' : 'View Docs'}</span>
                      </button>
                    </div>

                    <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-2 border-t border-slate-100 dark:border-slate-800/60">
                      <button
                        onClick={() => {
                          setSelectedStudentId(rec.studentId);
                          setActiveTab('student-profile');
                        }}
                        className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{language === 'es' ? 'Ver Perfil' : 'Profile'}</span>
                      </button>

                      {rec.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(rec.id, 'approved')}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{language === 'es' ? 'Aprobar Matrícula' : 'Approve'}</span>
                        </button>
                      )}

                      {rec.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(rec.id, 'rejected')}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{language === 'es' ? 'Rechazar' : 'Reject'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">{t.admin.enrollments.table.id}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.student}</th>
                    <th className="px-6 py-4">{language === 'es' ? 'Acudiente' : 'Guardian'}</th>
                    <th className="px-6 py-4">{language === 'es' ? 'Expediente Documental' : 'Document Record'}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.status}</th>
                    <th className="px-6 py-4 text-right">{t.admin.enrollments.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEnrollments.map((rec) => {
                    const recDocs = documents.filter(
                      (d) => d.studentId === rec.studentId || (d.studentName && d.studentName === rec.studentName)
                    );
                    const recApprovedDocs = recDocs.filter((d) => d.status === 'approved').length;
                    const allApproved = recDocs.length > 0 && recApprovedDocs === recDocs.length;

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-teal-700 dark:text-teal-400 font-mono">
                          {rec.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {rec.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Doc: {rec.studentDoc} • {rec.grade} • {rec.academicYear}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            {rec.guardianName || 'Acudiente Registrado'}
                          </div>
                          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                            {rec.guardianRelationship || 'Acudiente Principal'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              allApproved
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            }`}>
                              {recApprovedDocs}/{recDocs.length} {language === 'es' ? 'Aprobados' : 'Approved'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentId(rec.studentId);
                                setActiveTab('documents');
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title={language === 'es' ? 'Auditar Documentos del Acudiente' : 'Audit Guardian Documents'}
                            >
                              <FolderKanban className="w-3.5 h-3.5 text-teal-600" />
                              <span>{language === 'es' ? 'Ver Docs' : 'Docs'}</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${
                            rec.status === 'approved' || rec.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : rec.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {rec.status === 'approved' || rec.status === 'completed' ? (
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                            ) : rec.status === 'rejected' ? (
                              <XCircle className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                            )}
                            {rec.status === 'approved' || rec.status === 'completed'
                              ? (language === 'es' ? 'Matrícula Aprobada' : 'Enrollment Approved')
                              : t.statuses[rec.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedStudentId(rec.studentId);
                                setActiveTab('student-profile');
                              }}
                              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                              title={language === 'es' ? 'Ver Perfil' : 'View Profile'}
                              aria-label={language === 'es' ? 'Ver Perfil' : 'View Profile'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {rec.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusChange(rec.id, 'approved')}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors cursor-pointer"
                                title={language === 'es' ? 'Aprobar Matrícula' : 'Approve Enrollment'}
                                aria-label={language === 'es' ? 'Aprobar Matrícula' : 'Approve Enrollment'}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {rec.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(rec.id, 'rejected')}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer"
                                title={language === 'es' ? 'Rechazar' : 'Reject'}
                                aria-label={language === 'es' ? 'Rechazar' : 'Reject'}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

