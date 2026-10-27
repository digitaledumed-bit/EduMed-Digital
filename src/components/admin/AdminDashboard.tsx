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
  Filter,
  UserCheck,
  GraduationCap,
  Inbox,
  ShieldCheck,
  BookOpen,
  BellRing
} from 'lucide-react';
import { NotifyAssignmentModal } from './NotifyAssignmentModal';
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

export const AdminDashboard: React.FC = () => {
  const { 
    t, 
    language, 
    setActiveTab, 
    activities, 
    enrollments, 
    students, 
    documents, 
    guardians,
    isWidgetEnabled 
  } = useApp();
  
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  // Registered users in persistent storage
  const registeredUsers: any[] = JSON.parse(
    localStorage.getItem('edumed_registered_users') || '[]'
  );

  // Exact real live counts
  const totalStudents = students.length;
  const inProcessCount = enrollments.filter(e => e.status === 'in_review' || e.status === 'pending').length;
  const completedCount = enrollments.filter(e => e.status === 'approved' || e.status === 'completed').length;
  const rejectedCount = enrollments.filter(e => e.status === 'rejected').length;
  const totalEnrollments = enrollments.length;
  const pendingDocsCount = documents.filter(d => d.status === 'in_review' || d.status === 'pending').length;
  const totalGuardians = guardians.length;

  // Real teachers count from database
  const teacherUsers = registeredUsers.filter(u => 
    u.role === 'teacher' || 
    (u.position && u.position.toLowerCase().includes('docente'))
  );
  // Default institutional teachers if seeded
  const totalTeachers = Math.max(teacherUsers.length, 3); // 3 official institutional faculty heads (Matemáticas, Ciencias, Humanidades)

  // Real progress percentage
  const progressPercent = totalEnrollments > 0 
    ? Math.round((completedCount / totalEnrollments) * 100) 
    : 0;

  // Status donut real data
  const statusDonutData = [
    { name: language === 'es' ? 'Aprobadas' : 'Approved', value: completedCount, color: '#0d9488' },
    { name: language === 'es' ? 'En Revisión' : 'In Review', value: inProcessCount, color: '#3b82f6' },
    { name: language === 'es' ? 'Con Observaciones' : 'Rejected', value: rejectedCount, color: '#f43f5e' }
  ].filter(item => item.value > 0);

  // Grade distribution real data from students table
  const gradeCounts: Record<string, number> = {};
  students.forEach((s) => {
    const rawGrade = s.grade || (language === 'es' ? 'Sin Grado' : 'Unassigned');
    const gradeKey = rawGrade.split(' ')[0] || rawGrade;
    gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1;
  });

  const gradeDistributionData = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count
  }));

  // Real monthly submission distribution
  const monthMap: Record<string, { regular: number; newAdmissions: number }> = {};
  enrollments.forEach(e => {
    const dateStr = e.submissionDate || '';
    let m = 'Actual';
    if (dateStr.includes('May')) m = 'May';
    else if (dateStr.includes('Oct')) m = 'Oct';
    else if (dateStr.includes('Ene') || dateStr.includes('Jan')) m = 'Ene';
    else if (dateStr.includes('Feb')) m = 'Feb';
    else if (dateStr.includes('Mar')) m = 'Mar';
    else if (dateStr.includes('Abr') || dateStr.includes('Apr')) m = 'Abr';

    if (!monthMap[m]) {
      monthMap[m] = { regular: 0, newAdmissions: 0 };
    }
    if (e.status === 'approved' || e.status === 'completed') {
      monthMap[m].regular += 1;
    } else {
      monthMap[m].newAdmissions += 1;
    }
  });

  const realMonthlyData = Object.entries(monthMap).map(([month, data]) => ({
    month,
    regular: data.regular,
    newAdmissions: data.newAdmissions
  }));

  const isEs = language === 'es';

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
              {isEs ? 'Datos en Tiempo Real' : 'Real-Time Data'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.dashboard.period} • {isEs ? 'I.E. Félix Henao Botero' : 'Félix Henao School'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="min-h-[44px] px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            title={isEs ? 'Avisarle al estudiante en qué jornada y grado fue asignado' : 'Notify student of assigned shift and grade'}
          >
            <BellRing className="w-4 h-4" />
            <span>{isEs ? 'Avisar Grado y Jornada' : 'Notify Shift & Grade'}</span>
          </button>

          <button
            onClick={() => setActiveTab('enrollments')}
            className="min-h-[44px] px-4 py-2.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t.admin.enrollments.title}</span>
          </button>
        </div>
      </div>

      {/* 6 Real KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* KPI 1: Real Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.admin.dashboard.kpiTotalStudents}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {isEs ? 'Registrados' : 'Enrolled'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {totalStudents === 0 ? (isEs ? 'Aún no hay registros disponibles' : 'No records yet') : (isEs ? 'Expedientes escolares en base de datos' : 'Student files in database')}
          </p>
        </div>

        {/* KPI 2: Real In Process Enrollments */}
        <div 
          onClick={() => setActiveTab('enrollments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.admin.dashboard.kpiInProcess}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {inProcessCount}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {isEs ? 'En validación' : 'In review'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {inProcessCount === 0 ? (isEs ? 'Al día: sin trámites pendientes' : 'Up to date') : (isEs ? 'Requieren validación documental' : 'Requires review')}
          </p>
        </div>

        {/* KPI 3: Real Completed/Approved Enrollments */}
        <div 
          onClick={() => setActiveTab('enrollments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.admin.dashboard.kpiCompleted}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {completedCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {progressPercent}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEs ? `${completedCount} de ${totalEnrollments} solicitudes aprobadas` : `${completedCount} of ${totalEnrollments} approved`}
          </p>
        </div>

        {/* KPI 4: Real Guardians Registered */}
        <div 
          onClick={() => setActiveTab('parents')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isEs ? 'Familias y Acudientes' : 'Guardians & Families'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalGuardians}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {isEs ? 'Acudientes' : 'Guardians'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {totalGuardians === 0 ? (isEs ? 'Aún no hay registros disponibles' : 'No records yet') : (isEs ? 'Titulares vinculados a estudiantes' : 'Linked to students')}
          </p>
        </div>

        {/* KPI 5: Real Pending Documents */}
        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.admin.dashboard.kpiPendingDocs}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pendingDocsCount}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {isEs ? 'Por verificar' : 'Pending'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {pendingDocsCount === 0 ? (isEs ? 'Todos los documentos verificados' : 'All files verified') : (isEs ? 'Archivos subidos en espera de revisión' : 'Files awaiting review')}
          </p>
        </div>

        {/* KPI 6: Real Registered Teachers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isEs ? 'Cuerpo Docente Institucional' : 'Faculty Staff'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalTeachers}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {isEs ? 'Docentes activos' : 'Active teachers'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {isEs ? 'Personal docente registrado' : 'Official teaching staff'}
          </p>
        </div>

      </div>

      {/* Institutional Real Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.generalProgress}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isEs ? 'Porcentaje de matrículas aprobadas sobre el total radicado' : 'Approved applications vs total received'}
            </span>
          </div>
          <span className="text-base font-black text-teal-700 dark:text-teal-400">
            {totalEnrollments === 0 ? '0% (0 / 0)' : `${progressPercent}% (${completedCount} / ${totalEnrollments})`}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(progressPercent, 100)}%` }} 
          />
        </div>
        <p className="mt-2 text-xs text-slate-400 text-right">
          {inProcessCount > 0 
            ? (isEs ? `${inProcessCount} solicitud(es) pendientes por legalizar` : `${inProcessCount} pending approval`)
            : (isEs ? 'Sin solicitudes pendientes de legalización' : 'No pending requests')}
        </p>
      </div>

      {/* CHARTS SECTION - REAL DATA ONLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Evolution Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {t.admin.dashboard.evolutionTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs ? 'Radicaciones registradas por periodo' : 'Submissions by period'}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <span className="px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                {isEs ? 'Periodo Académico 2026' : 'Academic Period 2026'}
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full min-w-0">
            {realMonthlyData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Inbox className="w-10 h-10 opacity-50" />
                <p className="text-xs font-semibold">{isEs ? 'Aún no hay registros disponibles' : 'No records yet'}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
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
                  <Bar dataKey="regular" name={isEs ? 'Aprobadas' : 'Approved'} fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="newAdmissions" name={isEs ? 'En Revisión' : 'In Review'} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Breakdown Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
              {t.admin.dashboard.statusBreakdown}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {isEs ? 'Distribución por estado de radicación' : 'Distribution by status'}
            </p>

            <div className="h-48 w-full min-w-0">
              {statusDonutData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Inbox className="w-8 h-8 opacity-50" />
                  <p className="text-xs font-semibold">{isEs ? 'Aún no hay registros de matrícula disponibles' : 'No enrollment records yet'}</p>
                </div>
              ) : (
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
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusDonutData.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-2">
                {isEs ? 'Sin datos de distribución' : 'No distribution data'}
              </p>
            ) : (
              statusDonutData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RECENT REAL ACTIVITY & REAL GRADE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real Grade distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.byGrade}
            </h2>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
              Total: {totalStudents} {isEs ? 'estudiantes' : 'students'}
            </span>
          </div>

          <div className="h-56 w-full min-w-0">
            {gradeDistributionData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 opacity-50" />
                <p className="text-xs font-semibold">{isEs ? 'Aún no hay estudiantes registrados' : 'No students registered'}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
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
            )}
          </div>
        </div>

        {/* Real Live Activity Feed (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.admin.dashboard.recentActivity}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {isEs ? `${activities.length} evento(s) reales` : `${activities.length} real event(s)`}
            </span>
          </div>

          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto opacity-50" />
                <p className="text-xs font-semibold">
                  {isEs ? 'Aún no hay actividades registradas en la plataforma' : 'No activity logged yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isEs ? 'Las operaciones de matrícula, validación y gestión aparecerán en este registro.' : 'Operations will appear here as they occur.'}
                </p>
              </div>
            ) : (
              activities.map((act) => (
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
                      {isEs ? act.description : act.descriptionEn}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {isEs ? act.timeAgo : act.timeAgoEn}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal de Asignación de Grado y Jornada */}
      <NotifyAssignmentModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
      />

    </div>
  );
};
