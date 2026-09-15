import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { monthlyEnrollmentData, gradeDistributionData } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { t, language, setActiveTab, activities, enrollments, students, documents } = useApp();
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');

  // Calculate live numbers
  const totalStudents = students.length * 200 + 45; // realistic scale
  const inProcessCount = enrollments.filter(e => e.status === 'in_review' || e.status === 'pending').length * 25 + 28;
  const completedCount = enrollments.filter(e => e.status === 'approved' || e.status === 'completed').length * 200 + 85;
  const pendingDocsCount = documents.filter(d => d.status === 'in_review' || d.status === 'pending').length * 10 + 2;

  const statusDonutData = [
    { name: language === 'es' ? 'Completadas' : 'Completed', value: 1085, color: '#0d9488' }, // Teal
    { name: language === 'es' ? 'En Proceso' : 'In Review', value: 128, color: '#3b82f6' },   // Blue
    { name: language === 'es' ? 'Pendientes' : 'Pending', value: 42, color: '#f59e0b' },    // Amber
    { name: language === 'es' ? 'Rechazadas' : 'Rejected', value: 18, color: '#f43f5e' },    // Rose
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.admin.dashboard.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {language === 'es' ? 'En Vivo' : 'Live'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.dashboard.period}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('enrollments')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.admin.enrollments.title}</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* KPI 1: Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiTotalStudents}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudents.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {t.admin.dashboard.activeStudents}
          </p>
        </div>

        {/* KPI 2: In Process */}
        <div 
          onClick={() => setActiveTab('enrollments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiInProcess}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {inProcessCount}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {language === 'es' ? 'En validación' : 'In review'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {t.admin.dashboard.requiresAttention}
          </p>
        </div>

        {/* KPI 3: Completed */}
        <div 
          onClick={() => setActiveTab('enrollments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiCompleted}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {completedCount.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              87%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {language === 'es' ? 'Cupos asignados' : 'Slots assigned'}
          </p>
        </div>

        {/* KPI 4: Pending Review */}
        <div 
          onClick={() => setActiveTab('enrollments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiPendingReview}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              32
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {t.admin.dashboard.criticalExpired}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {t.admin.dashboard.requiresAttention}
          </p>
        </div>

        {/* KPI 5: Pending Documents */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiPendingDocs}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {pendingDocsCount}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {language === 'es' ? 'Archivos subidos' : 'Files uploaded'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {language === 'es' ? 'Pendientes de aprobación' : 'Awaiting approval'}
          </p>
        </div>

        {/* KPI 6: Retention Target */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.kpiRetention}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              92.4%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {t.admin.dashboard.annualTarget}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {language === 'es' ? 'Retención sostenida' : 'Sustained retention'}
          </p>
        </div>

      </div>

      {/* Institutional General Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.generalProgress}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.admin.dashboard.goalTarget}
            </span>
          </div>
          <span className="text-base font-extrabold text-teal-700 dark:text-teal-400">
            83% (1,245 / 1,500)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: '83%' }} />
        </div>
        <p className="mt-2 text-xs text-slate-400 text-right">
          {t.admin.dashboard.progressRemaining}
        </p>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Evolution Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {t.admin.dashboard.evolutionTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'es' ? 'Comparativo de matrículas regulares vs nuevos ingresos' : 'Comparison of regular enrollments vs new admissions'}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timeframe === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.admin.dashboard.monthly}
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timeframe === 'weekly'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.admin.dashboard.weekly}
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEnrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="regular" name={t.admin.dashboard.regularEnrollments} fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newAdmissions" name={t.admin.dashboard.newEnrollments} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
              {t.admin.dashboard.statusBreakdown}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === 'es' ? 'Distribución por estado actual' : 'Distribution by current state'}
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY & GRADE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Grade distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.byGrade}
            </h2>
            <span className="text-xs text-slate-400">Total: 1,245</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="grade" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.recentActivity}
            </h2>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold cursor-pointer hover:underline">
              {t.admin.dashboard.viewAllActivity}
            </span>
          </div>

          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  act.type === 'completed'
                    ? 'bg-emerald-500'
                    : act.type === 'warning'
                    ? 'bg-amber-500'
                    : act.type === 'review'
                    ? 'bg-blue-500'
                    : 'bg-teal-500'
                }`} />
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 leading-snug">
                    {language === 'es' ? act.description : act.descriptionEn}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {language === 'es' ? act.timeAgo : act.timeAgoEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
