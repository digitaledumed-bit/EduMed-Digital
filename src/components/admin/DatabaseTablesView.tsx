import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  Search, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download, 
  Filter, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  Phone,
  Mail,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const DatabaseTablesView: React.FC = () => {
  const { 
    language, 
    guardians, 
    students, 
    staffUsers, 
    enrollments, 
    setActiveTab, 
    setSelectedStudentId 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'guardians' | 'students' | 'staff' | 'enrollments'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isEs = language === 'es';

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Filtered collections
  const filteredGuardians = guardians.filter(g => 
    !cleanQuery ||
    g.fullName.toLowerCase().includes(cleanQuery) ||
    g.documentNumber.includes(cleanQuery) ||
    (g.email && g.email.toLowerCase().includes(cleanQuery)) ||
    (g.verificationCode && g.verificationCode.toLowerCase().includes(cleanQuery)) ||
    (g.fileNumber && String(g.fileNumber) === cleanQuery) ||
    g.associatedStudents.some(s => s.name.toLowerCase().includes(cleanQuery))
  );

  const filteredStudents = students.filter(s =>
    !cleanQuery ||
    s.fullName.toLowerCase().includes(cleanQuery) ||
    s.documentNumber.includes(cleanQuery) ||
    (s.email && s.email.toLowerCase().includes(cleanQuery)) ||
    (s.fileNumber && String(s.fileNumber) === cleanQuery) ||
    s.guardians.some(g => 
      g.name.toLowerCase().includes(cleanQuery) || 
      (g.verificationCode && g.verificationCode.toLowerCase().includes(cleanQuery))
    )
  );

  const filteredStaff = (staffUsers || []).filter(u =>
    !cleanQuery ||
    u.name.toLowerCase().includes(cleanQuery) ||
    u.documentNumber.includes(cleanQuery) ||
    u.email.toLowerCase().includes(cleanQuery) ||
    u.position.toLowerCase().includes(cleanQuery) ||
    (u.verificationCode && u.verificationCode.toLowerCase().includes(cleanQuery))
  );

  const filteredEnrollments = enrollments.filter(e =>
    !cleanQuery ||
    e.id.toLowerCase().includes(cleanQuery) ||
    e.studentName.toLowerCase().includes(cleanQuery) ||
    e.studentDoc.includes(cleanQuery) ||
    (e.guardianName && e.guardianName.toLowerCase().includes(cleanQuery))
  );

  // Total official verification codes count
  const officialCodes = [
    { code: '101', role: 'Acudiente (Ficha 1)', titular: 'Nicole Valentina Pereira', doc: 'CC 1017287888', estudiante: 'Sara Molina Jimenez' },
    { code: '102', role: 'Acudiente (Ficha 2)', titular: 'Luz Adriana Toscano', doc: 'CC 1064191482', estudiante: 'Yeleidy Davila Moreno' },
    { code: '12', role: 'Administrativo', titular: 'Alexander Miranda', doc: 'CC 1033184935', cargo: 'Coordinador — Gestión académica' },
    { code: '13', role: 'Directivo', titular: 'Juan Jose Torres', doc: 'CC 1013346890', cargo: 'Rector — Dirección institucional' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-700/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isEs ? 'Bases de Datos y Tablas Institucionales' : 'Institutional Database & Tables'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                {isEs ? 'Registros Oficiales 2026' : 'Official Records 2026'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEs 
                ? 'Consolidación oficial de tablas: Acudientes, Estudiantes y Personal Administrativo / Directivo con códigos de verificación habilitados.' 
                : 'Official database tables consolidation: Guardians, Students, and Administrative / Leadership staff with active verification codes.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {isEs ? 'Regresar al Panel' : 'Back to Dashboard'}
          </button>
        </div>
      </div>

      {/* KPI Cards: Verification Codes & Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveSubTab('guardians')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'guardians'
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 shadow-sm ring-2 ring-amber-400/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              {isEs ? 'Tabla Acudientes' : 'Guardians Table'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{guardians.length}</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {isEs ? 'Códigos 101, 102' : 'Codes 101, 102'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isEs ? 'Nicole Pereira y Luz Toscano' : 'Nicole Pereira & Luz Toscano'}
          </p>
        </div>

        <div 
          onClick={() => setActiveSubTab('students')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-500 shadow-sm ring-2 ring-teal-400/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              {isEs ? 'Tabla Estudiantes' : 'Students Table'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{students.length}</span>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
              {isEs ? 'Fichas N° 1 y 2' : 'Files # 1 & 2'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isEs ? 'Sara Molina y Yeleidy Davila' : 'Sara Molina & Yeleidy Davila'}
          </p>
        </div>

        <div 
          onClick={() => setActiveSubTab('staff')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-2 ring-blue-400/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
              {isEs ? 'Admin & Directivos' : 'Admin & Leadership'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{(staffUsers || []).length}</span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
              {isEs ? 'Códigos 12 y 13' : 'Codes 12 & 13'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isEs ? 'Alexander Miranda y Juan Jose Torres' : 'Alexander Miranda & Juan Jose Torres'}
          </p>
        </div>

        <div 
          onClick={() => setActiveSubTab('enrollments')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeSubTab === 'enrollments'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-400/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              {isEs ? 'Matrículas SIMAT' : 'Enrollment Records'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{enrollments.length}</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {isEs ? 'Radicados Activos' : 'Active Filings'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isEs ? '#MAT-26-0101 y #MAT-26-0102' : '#MAT-26-0101 & #MAT-26-0102'}
          </p>
        </div>

      </div>

      {/* Official Validation Codes Quick Use Guide */}
      <div className="bg-gradient-to-r from-amber-50 to-teal-50 dark:from-amber-950/30 dark:to-teal-950/30 border border-amber-200/90 dark:border-amber-900/60 p-5 rounded-3xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEs ? 'Códigos de Verificación Habilitados para Uso en el Sistema' : 'Verification Codes Enabled for System Use'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isEs 
                ? 'Estos códigos pueden utilizarse para iniciar sesión directamente, validar registro de acudientes y verificar autenticidad institucional.'
                : 'These codes can be used to log in directly, validate guardian registration, and verify institutional authenticity.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4">
          {officialCodes.map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 font-mono font-black text-xs">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                    {item.role}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                  {item.titular}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.estudiante ? `Estudiante: ${item.estudiante}` : item.cargo}
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(item.code, `kpi-${item.code}`)}
                title={isEs ? 'Copiar código de verificación' : 'Copy verification code'}
                className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-900/40 text-slate-600 hover:text-amber-800 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                {copiedCode === `kpi-${item.code}` ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Tabs Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* SubTab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEs ? 'Todas las Tablas' : 'All Tables'}
            </button>

            <button
              onClick={() => setActiveSubTab('guardians')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'guardians'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEs ? 'Acudientes (101, 102)' : 'Guardians (101, 102)'}
            </button>

            <button
              onClick={() => setActiveSubTab('students')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'students'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEs ? 'Estudiantes (Fichas 1, 2)' : 'Students (Files 1, 2)'}
            </button>

            <button
              onClick={() => setActiveSubTab('staff')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'staff'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEs ? 'Personal (12, 13)' : 'Staff (12, 13)'}
            </button>

            <button
              onClick={() => setActiveSubTab('enrollments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'enrollments'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEs ? 'Matrículas' : 'Enrollments'}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEs ? 'Buscar por nombre, documento o código...' : 'Search by name, doc or code...'}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

        </div>
      </div>

      {/* TABLE 1: ACUDIENTES (ACUDIENTE2) */}
      {(activeSubTab === 'all' || activeSubTab === 'guardians') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Tabla de Acudientes (Base de Datos Oficial)' : 'Guardians Database Table'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEs ? 'Fuente: Registro oficial ACUDIENTE2 • Incluye códigos de validación 101 y 102' : 'Official source: ACUDIENTE2'}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
              {filteredGuardians.length} {isEs ? 'acudientes' : 'guardians'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{isEs ? 'N° Ficha' : 'File #'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Nombre del Acudiente' : 'Guardian Name'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Documento de Identidad' : 'ID Document'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Correo Electrónico' : 'Email Address'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Código de Verificación' : 'Verification Code'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Estudiante Asignado' : 'Assigned Student'}</th>
                  <th className="px-5 py-3.5 text-right">{isEs ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredGuardians.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Ficha */}
                    <td className="px-5 py-3.5 font-bold">
                      {g.fileNumber ? (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-mono font-bold text-xs">
                          #{g.fileNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Nombre */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {g.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {g.relationship || (isEs ? 'Acudiente' : 'Guardian')}
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {g.documentType} {g.documentNumber}
                    </td>

                    {/* Correo */}
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 truncate max-w-xs">
                        <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{g.email}</span>
                      </div>
                    </td>

                    {/* Código de Verificación */}
                    <td className="px-5 py-3.5">
                      {g.verificationCode ? (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                          <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span className="font-mono font-black text-amber-950 dark:text-amber-100 text-xs">
                            {g.verificationCode}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 ml-1">
                            {isEs ? 'Habilitado' : 'Active'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">ACUD-2026</span>
                      )}
                    </td>

                    {/* Estudiantes */}
                    <td className="px-5 py-3.5">
                      {g.associatedStudents.map((s, idx) => (
                        <div key={idx} className="font-semibold text-teal-700 dark:text-teal-400">
                          {s.name} <span className="text-[10px] text-slate-400">({s.grade})</span>
                        </div>
                      ))}
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3.5 text-right">
                      {g.verificationCode && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(g.verificationCode!, g.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedCode === g.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 dark:text-emerald-400">{isEs ? 'Copiado' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isEs ? 'Copiar Cód.' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 2: ESTUDIANTES (Estudiantes2) */}
      {(activeSubTab === 'all' || activeSubTab === 'students') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs">
                E
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Tabla de Estudiantes (Base de Datos Oficial)' : 'Students Database Table'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEs ? 'Fuente: Registro oficial Estudiantes2 • Sara Molina (Ficha 1), Yeleidy Davila (Ficha 2)' : 'Official source: Estudiantes2'}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-bold border border-teal-200 dark:border-teal-800">
              {filteredStudents.length} {isEs ? 'estudiantes' : 'students'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{isEs ? 'N° Ficha' : 'File #'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Nombre del Estudiante' : 'Student Name'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Documento de Identidad' : 'ID Document'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Correo Electrónico' : 'Email Address'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Grado Escolar' : 'Grade'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Acudiente y Código Asignado' : 'Guardian & Assigned Code'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Estado SIMAT' : 'SIMAT Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredStudents.map((s) => {
                  const primaryG = s.guardians[0];
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Ficha */}
                      <td className="px-5 py-3.5 font-bold">
                        {s.fileNumber ? (
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-mono font-bold text-xs">
                            #{s.fileNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Nombre */}
                      <td className="px-5 py-3.5">
                        <div 
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setActiveTab('student-profile');
                          }}
                          className="font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
                        >
                          {s.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.shift || 'Mañana'}
                        </div>
                      </td>

                      {/* Documento */}
                      <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                        {s.documentType} {s.documentNumber}
                      </td>

                      {/* Correo */}
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 truncate max-w-xs">
                          <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{s.email}</span>
                        </div>
                      </td>

                      {/* Grado */}
                      <td className="px-5 py-3.5 font-semibold text-teal-700 dark:text-teal-400">
                        {s.grade}
                      </td>

                      {/* Acudiente */}
                      <td className="px-5 py-3.5">
                        {primaryG ? (
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {primaryG.name}
                            </div>
                            {primaryG.verificationCode && (
                              <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-mono text-[10px] font-bold">
                                <span>Cód:</span>
                                <strong>{primaryG.verificationCode}</strong>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">{isEs ? 'Sin asignar' : 'Unassigned'}</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {isEs ? 'Activo en SIMAT' : 'Active SIMAT'}
                        </span>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 3: PERSONAL ADMINISTRATIVO Y DIRECTIVO (Administrativo) */}
      {(activeSubTab === 'all' || activeSubTab === 'staff') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-xs">
                P
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Tabla de Personal Administrativo y Directivo' : 'Administrative & Leadership Staff Table'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEs ? 'Fuente: Registro oficial Administrativo • Alexander Miranda (Cód 12), Juan Jose Torres (Cód 13)' : 'Official source: Administrativo'}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 text-xs font-bold border border-blue-200 dark:border-blue-800">
              {(staffUsers || []).length} {isEs ? 'usuarios' : 'users'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{isEs ? 'Tipo de Usuario' : 'User Type'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Nombre Completo' : 'Full Name'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Cargo Institucional' : 'Institutional Position'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Documento de Identidad' : 'ID Document'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Correo Electrónico' : 'Email Address'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Código de Verificación' : 'Verification Code'}</th>
                  <th className="px-5 py-3.5 text-right">{isEs ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {(staffUsers || []).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Tipo de Usuario */}
                    <td className="px-5 py-3.5 font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                        u.role === 'directivo'
                          ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                          : 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300'
                      }`}>
                        {u.role === 'directivo' ? (isEs ? 'Directivo' : 'Leadership') : (isEs ? 'Administrativo' : 'Administrative')}
                      </span>
                    </td>

                    {/* Nombre */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {u.department}
                      </div>
                    </td>

                    {/* Cargo */}
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {u.position}
                    </td>

                    {/* Documento */}
                    <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      {u.documentType} {u.documentNumber}
                    </td>

                    {/* Correo */}
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 truncate max-w-xs">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </td>

                    {/* Código de Verificación */}
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="font-mono font-black text-blue-950 dark:text-blue-100 text-xs">
                          {u.verificationCode}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 ml-1">
                          {isEs ? 'Autorizado' : 'Authorized'}
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(u.verificationCode, u.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedCode === u.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-400">{isEs ? 'Copiado' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isEs ? 'Copiar Cód.' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 4: MATRÍCULAS FORMALIZADAS (Enrollments) */}
      {(activeSubTab === 'all' || activeSubTab === 'enrollments') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isEs ? 'Tabla de Solicitudes y Matrículas' : 'Enrollment Applications Table'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {isEs ? 'Radicaciones oficiales en SIMAT y seguimiento documental' : 'SIMAT official records'}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              {filteredEnrollments.length} {isEs ? 'matrículas' : 'enrollments'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">{isEs ? 'N° Radicado' : 'Filing #'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Estudiante' : 'Student'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Documento' : 'Document'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Grado' : 'Grade'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Acudiente' : 'Guardian'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Estado' : 'Status'}</th>
                  <th className="px-5 py-3.5">{isEs ? 'Fecha de Radicación' : 'Submission Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Radicado */}
                    <td className="px-5 py-3.5 font-bold font-mono text-teal-700 dark:text-teal-400">
                      {e.id}
                    </td>

                    {/* Estudiante */}
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {e.studentName}
                    </td>

                    {/* Documento */}
                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {e.studentDoc}
                    </td>

                    {/* Grado */}
                    <td className="px-5 py-3.5 font-semibold text-teal-700 dark:text-teal-400">
                      {e.grade}
                    </td>

                    {/* Acudiente */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {e.guardianName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {e.guardianRelationship}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        e.status === 'approved' || e.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                          : e.status === 'rejected'
                          ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                          : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                      }`}>
                        {e.status === 'approved' || e.status === 'completed'
                          ? (isEs ? 'Aprobada' : 'Approved')
                          : e.status === 'rejected'
                          ? (isEs ? 'Rechazada' : 'Rejected')
                          : (isEs ? 'En Revisión' : 'In Review')}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {e.submissionDate}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
