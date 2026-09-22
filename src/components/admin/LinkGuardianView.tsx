import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  AlertCircle
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const LinkGuardianView: React.FC = () => {
  const { 
    t, 
    language, 
    students, 
    selectedStudentId, 
    guardians, 
    linkGuardianToStudent, 
    setActiveTab 
  } = useApp();

  const student = selectedStudentId ? (students.find((s) => s.id === selectedStudentId) || students[0]) : (students.length > 0 ? students[0] : null);

  const [searchDoc, setSearchDoc] = useState('');
  const [searchedGuardian, setSearchedGuardian] = useState<typeof guardians[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);
  const [livesWith, setLivesWith] = useState(true);
  const [relationship, setRelationship] = useState('Padre');
  const [successMessage, setSuccessMessage] = useState(false);

  // New guardian form fields
  const [newGuardian, setNewGuardian] = useState({
    docType: 'CC',
    docNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = guardians.find(g => g.documentNumber.replace(/\D/g, '').includes(searchDoc.replace(/\D/g, '')));
    setSearchedGuardian(found || null);
  };

  const handleConfirmExisting = () => {
    if (!searchedGuardian || !student) return;

    linkGuardianToStudent(student.id, {
      name: searchedGuardian.fullName,
      relationship,
      phone: searchedGuardian.phone,
      email: searchedGuardian.email,
      isPrimary,
      livesWithStudent: livesWith
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setActiveTab('student-profile');
    }, 1800);
  };

  const handleConfirmNew = () => {
    if (!newGuardian.firstName || !student) return;

    linkGuardianToStudent(student.id, {
      name: `${newGuardian.firstName} ${newGuardian.lastName}`,
      relationship,
      phone: newGuardian.phone,
      email: newGuardian.email,
      isPrimary,
      livesWithStudent: livesWith
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setActiveTab('student-profile');
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('student-profile')}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'es' ? 'Volver al Perfil' : 'Back to Profile'}</span>
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          {t.admin.linkGuardian.title}
        </span>
      </div>

      {/* Selected Student Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar 
            name={student?.fullName || 'Estudiante'} 
            size="md" 
            className="rounded-xl border border-teal-500" 
          />
          <div>
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
              {t.admin.linkGuardian.selectedStudent}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {student?.fullName}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
              (ID: {student?.documentNumber}, {student?.grade})
            </span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'es' ? '¡Acudiente vinculado exitosamente al expediente del estudiante!' : 'Guardian successfully linked to student file!'}</span>
        </div>
      )}

      {/* 2 Search / Register Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Search Existing */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" />
              {t.admin.linkGuardian.searchExisting}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.admin.linkGuardian.searchExistingSub}
            </p>

            <form onSubmit={handleSearch} className="mt-4 flex gap-2">
              <input
                type="text"
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
                placeholder={language === 'es' ? 'Ingrese número de documento' : 'Enter document number'}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t.admin.linkGuardian.searchBtn}
              </button>
            </form>

            {searchedGuardian ? (
              <div className="mt-5 p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {searchedGuardian.fullName}
                  </span>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                    {searchedGuardian.documentType} {searchedGuardian.documentNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{searchedGuardian.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{searchedGuardian.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="truncate">{searchedGuardian.address}</span>
                  </div>
                </div>
              </div>
            ) : hasSearched ? (
              <div className="mt-4 p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                {language === 'es' ? 'No se encontraron resultados con ese documento.' : 'No results found with that document.'}
              </div>
            ) : (
              <div className="mt-4 p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                {language === 'es' ? 'Ingrese un número de documento para buscar el acudiente.' : 'Enter a document number to search for a guardian.'}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleConfirmExisting}
              disabled={!searchedGuardian}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.admin.linkGuardian.confirmLink}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Register New Guardian */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                {t.admin.linkGuardian.orRegisterNew}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-600" />
              {t.admin.linkGuardian.newGuardianData}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.admin.linkGuardian.newGuardianDataSub}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Doc. Tipo</label>
                <select
                  value={newGuardian.docType}
                  onChange={(e) => setNewGuardian({ ...newGuardian, docType: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="PAS">PAS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">No. Documento</label>
                <input
                  type="text"
                  placeholder="Ej. 1020304050"
                  value={newGuardian.docNumber}
                  onChange={(e) => setNewGuardian({ ...newGuardian, docNumber: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombres</label>
                <input
                  type="text"
                  placeholder="Ej. Carmen"
                  value={newGuardian.firstName}
                  onChange={(e) => setNewGuardian({ ...newGuardian, firstName: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellidos</label>
                <input
                  type="text"
                  placeholder="Ej. Rojas"
                  value={newGuardian.lastName}
                  onChange={(e) => setNewGuardian({ ...newGuardian, lastName: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+57 300 000 0000"
                  value={newGuardian.phone}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={newGuardian.email}
                  onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleConfirmNew}
              disabled={!newGuardian.firstName || !newGuardian.docNumber}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'es' ? 'Crear y Vincular' : 'Create & Link'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Relationship and Legal Settings */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {t.admin.linkGuardian.familyLink}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.wizard.fields.relationship}
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="Padre">Padre</option>
              <option value="Madre">Madre</option>
              <option value="Tutor Legal">Tutor Legal</option>
              <option value="Abuelo/a">Abuelo / Abuela</option>
              <option value="Tío/a">Tío / Tía</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {t.admin.linkGuardian.isPrimaryGuardian}
                </span>
                <span className="text-[11px] text-slate-400">
                  {t.admin.linkGuardian.isPrimaryDesc}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={livesWith}
                onChange={(e) => setLivesWith(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {t.admin.linkGuardian.livesWith}
                </span>
                <span className="text-[11px] text-slate-400">
                  {t.admin.linkGuardian.livesWithDesc}
                </span>
              </div>
            </label>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          {t.admin.linkGuardian.disclaimer}
        </p>
      </div>

    </div>
  );
};
