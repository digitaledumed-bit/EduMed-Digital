import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Eye, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  UserCheck,
  UserPlus
} from 'lucide-react';

export const StudentsList: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    setSelectedStudentId, 
    setActiveTab 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.documentNumber.includes(searchTerm) ||
      std.guardians.some(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade = gradeFilter === 'all' || std.grade.includes(gradeFilter);
    const matchesStatus = statusFilter === 'all' || std.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.admin.students.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.students.subtitle}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('wizard')}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.students.newStudentBtn}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.admin.students.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">{t.admin.students.allGrades}</option>
            <option value="6">6° Grado</option>
            <option value="7">7° Grado</option>
            <option value="8">8° Grado</option>
            <option value="9">9° Grado</option>
            <option value="10">10° Grado</option>
            <option value="11">11° Grado</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">{t.admin.students.allStatuses}</option>
            <option value="active">{t.statuses.active}</option>
            <option value="in_process">{t.statuses.in_process}</option>
            <option value="inactive">{t.statuses.inactive}</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">{t.admin.students.table.name}</th>
                <th className="px-6 py-4">{t.admin.students.table.doc}</th>
                <th className="px-6 py-4">{t.admin.students.table.grade}</th>
                <th className="px-6 py-4">{t.admin.students.table.birthDate}</th>
                <th className="px-6 py-4">{t.admin.students.table.guardian}</th>
                <th className="px-6 py-4">{t.admin.students.table.status}</th>
                <th className="px-6 py-4 text-right">{t.admin.students.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((std) => {
                const primaryGuardian = std.guardians.find(g => g.isPrimary) || std.guardians[0];

                return (
                  <tr key={std.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Name + Avatar */}
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => {
                          setSelectedStudentId(std.id);
                          setActiveTab('student-profile');
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={std.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                          alt={std.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-colors"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {std.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400">{std.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Document */}
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {std.documentType} {std.documentNumber}
                    </td>

                    {/* Grade */}
                    <td className="px-6 py-4 font-semibold text-teal-700 dark:text-teal-400">
                      {std.grade}
                    </td>

                    {/* Birth Date */}
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {std.birthDate}
                    </td>

                    {/* Guardian */}
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {primaryGuardian ? (
                        <div>
                          <span className="font-medium">{primaryGuardian.name}</span>
                          <span className="block text-[11px] text-slate-400">{primaryGuardian.relationship}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">{language === 'es' ? 'Sin vincular' : 'Unlinked'}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        std.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : std.status === 'in_process'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {t.statuses[std.status]}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudentId(std.id);
                            setActiveTab('student-profile');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'es' ? 'Perfil' : 'Profile'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedStudentId(std.id);
                            setActiveTab('link-guardian');
                          }}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title={language === 'es' ? 'Vincular Acudiente' : 'Link Guardian'}
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {t.admin.students.showing} 1-{filteredStudents.length} {t.admin.students.of} 1,245 {t.admin.students.studentsCount}
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 rounded-lg">1</span>
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
