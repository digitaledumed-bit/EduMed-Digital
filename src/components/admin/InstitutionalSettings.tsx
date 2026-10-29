import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Calendar, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldAlert, 
  School,
  Lock,
  Mail,
  Phone,
  Clock,
  Upload
} from 'lucide-react';

export const InstitutionalSettings: React.FC = () => {
  const { t, language, customLogoUrl, setCustomLogoUrl } = useApp();
  const [saved, setSaved] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomLogoUrl(event.target.result as string);
          setLogoSuccess(true);
          setTimeout(() => setLogoSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [form, setForm] = useState({
    schoolName: 'I.E. Félix Henao Botero',
    daneCode: '105001002345',
    rector: 'Dra. Elena Valencia',
    email: 'secretaria@felixhenaobotero.edu.co',
    phone: '+57 (4) 284 5678',
    address: 'Calle 52 # 38-42, Medellín, Antioquia',
    academicPeriod: '2024 - 2025 (Periodo Regular)',
    startDate: '2024-05-01',
    endDate: '2024-06-30',
    maxCapacity: '1500',
    notifyOnApprove: true,
    notifyOnReject: true,
    autoValidateDocFormat: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.admin.settings.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.admin.settings.subtitle}
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'es' ? 'Configuración guardada' : 'Settings saved'}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Institutional Info */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <School className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t.admin.settings.institutionalInfo}
          </h2>

          {/* Official Institution Logo Manager (Restricted to Editor/Admin) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Logo Oficial I.E. Félix Henao Botero" 
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-400 shadow-md bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'es' ? 'Escudo / Logo Institucional Oficial' : 'Official Institutional Crest / Logo'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'es' 
                  ? 'Exclusivo para edición administrativa. Los visitantes, estudiantes y acudientes no tienen permiso de modificar este logo.' 
                  : 'Exclusive to authorized editors. Visitors and students cannot change this logo.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <label 
                  htmlFor="admin-logo-upload-input"
                  className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Cargar nuevo logo institucional' : 'Upload new institutional logo'}</span>
                  <input 
                    id="admin-logo-upload-input" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload}
                  />
                </label>
                {logoSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {language === 'es' ? 'Logo actualizado exitosamente' : 'Logo updated successfully'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.institutionName}
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.daneCode}
              </label>
              <input
                type="text"
                value={form.daneCode}
                onChange={(e) => setForm({ ...form, daneCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.rector}
              </label>
              <input
                type="text"
                value={form.rector}
                onChange={(e) => setForm({ ...form, rector: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.email}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.address}
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Period & Dates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t.admin.settings.academicPeriod}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'es' ? 'Periodo Vigente' : 'Active Period'}
              </label>
              <input
                type="text"
                value={form.academicPeriod}
                onChange={(e) => setForm({ ...form, academicPeriod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.periodStart}
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.admin.settings.periodEnd}
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Rules */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            {t.admin.settings.notifications}
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyOnApprove}
                onChange={(e) => setForm({ ...form, notifyOnApprove: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {t.admin.settings.autoEmailOnApprove}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyOnReject}
                onChange={(e) => setForm({ ...form, notifyOnReject: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {t.admin.settings.autoEmailOnReject}
              </span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.admin.settings.saveChanges}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
