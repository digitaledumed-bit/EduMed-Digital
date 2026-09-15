import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  UserCheck, 
  GraduationCap 
} from 'lucide-react';

export const ParentsList: React.FC = () => {
  const { t, language, guardians, setActiveTab, setSelectedStudentId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = guardians.filter(g =>
    g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.documentNumber.includes(searchTerm) ||
    g.associatedStudents.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.admin.parents.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.parents.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('link-guardian')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.admin.parents.newParentBtn}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.admin.parents.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">{t.admin.parents.table.doc}</th>
                <th className="px-6 py-4">{t.admin.parents.table.name}</th>
                <th className="px-6 py-4">{t.admin.parents.table.relationship}</th>
                <th className="px-6 py-4">{t.admin.parents.table.phone}</th>
                <th className="px-6 py-4">{t.admin.parents.table.students}</th>
                <th className="px-6 py-4 text-right">{t.admin.parents.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((guardian) => (
                <tr key={guardian.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Doc */}
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    {guardian.documentType} {guardian.documentNumber}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {guardian.fullName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-teal-600" />
                      {guardian.email}
                    </div>
                  </td>

                  {/* Relationship */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {guardian.relationship}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{guardian.phone}</span>
                    </div>
                  </td>

                  {/* Associated students chips */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {guardian.associatedStudents.map((std, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedStudentId(std.id);
                            setActiveTab('student-profile');
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold hover:bg-teal-100 flex items-center gap-1 transition-colors"
                        >
                          <GraduationCap className="w-3 h-3" />
                          <span>{std.name}</span>
                          <span className="text-[10px] opacity-75">({std.grade})</span>
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (guardian.associatedStudents[0]) {
                          setSelectedStudentId(guardian.associatedStudents[0].id);
                        }
                        setActiveTab('link-guardian');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-slate-700 dark:text-slate-300 hover:text-teal-600 transition-colors"
                    >
                      {language === 'es' ? 'Vincular a otro' : 'Link another'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
