import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MoreVertical, 
  Calendar,
  FileText
} from 'lucide-react';
import { EnrollmentStatus } from '../../types';

export const EnrollmentsTable: React.FC = () => {
  const { t, language, enrollments, updateEnrollmentStatus, setActiveTab, setSelectedStudentId } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('2024 - 2025');

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.admin.enrollments.title}
          </h1>
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

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.admin.enrollments.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Academic Year filter */}
        <div className="w-full md:w-48">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="2024 - 2025">2024 - 2025</option>
            <option value="2023 - 2024">2023 - 2024</option>
            <option value="all">{language === 'es' ? 'Todos los Años' : 'All Years'}</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="w-full md:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">{language === 'es' ? 'Todos los Estados' : 'All Statuses'}</option>
            <option value="pending">{t.statuses.pending}</option>
            <option value="in_review">{t.statuses.in_review}</option>
            <option value="approved">{t.statuses.approved}</option>
            <option value="rejected">{t.statuses.rejected}</option>
          </select>
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
              {filteredEnrollments.map((rec) => (
                <div key={rec.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-teal-700 dark:text-teal-400 font-mono">
                      {rec.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      rec.status === 'approved' || rec.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : rec.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {t.statuses[rec.status]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rec.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Doc: {rec.studentDoc} • {rec.grade} • {rec.academicYear}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'es' ? 'Radicado:' : 'Submitted:'} {rec.submissionDate}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      onClick={() => {
                        setSelectedStudentId(rec.studentId);
                        setActiveTab('student-profile');
                      }}
                      className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'es' ? 'Ver Perfil' : 'Profile'}</span>
                    </button>

                    {rec.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(rec.id, 'approved')}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Aprobar' : 'Approve'}</span>
                      </button>
                    )}

                    {rec.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(rec.id, 'rejected')}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Rechazar' : 'Reject'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">{t.admin.enrollments.table.id}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.student}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.year}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.date}</th>
                    <th className="px-6 py-4">{t.admin.enrollments.table.status}</th>
                    <th className="px-6 py-4 text-right">{t.admin.enrollments.table.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEnrollments.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-teal-700 dark:text-teal-400 font-mono">
                        {rec.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {rec.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Doc: {rec.studentDoc} • {rec.grade}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {rec.academicYear}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {rec.submissionDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                          {t.statuses[rec.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudentId(rec.studentId);
                              setActiveTab('student-profile');
                            }}
                            className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title={language === 'es' ? 'Ver Perfil' : 'View Profile'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {rec.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(rec.id, 'approved')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
                              title={language === 'es' ? 'Aprobar Matrícula' : 'Approve Enrollment'}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {rec.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(rec.id, 'rejected')}
                              className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                              title={language === 'es' ? 'Rechazar' : 'Reject'}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
