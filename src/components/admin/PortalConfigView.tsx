import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  LayoutDashboard, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Users, 
  GraduationCap, 
  UserCheck, 
  FileText, 
  FolderKanban, 
  Settings, 
  Search, 
  FilePlus, 
  Award, 
  Globe, 
  LifeBuoy, 
  HelpCircle,
  Lock,
  Layers,
  BarChart3,
  Calendar,
  Download,
  Camera,
  Edit3
} from 'lucide-react';
import { RolePortalConfig, PortalModuleItem, PortalWidgetItem, RolePermissions, UserRole } from '../../types';

// Map icon names to Lucide components for previewing
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  FileText,
  Users,
  UserCheck,
  UserCog: Users,
  FolderKanban,
  Sliders,
  Settings,
  GraduationCap,
  Search,
  FilePlus,
  Award,
  Globe,
  LifeBuoy,
  BarChart3,
  Calendar
};

export const PortalConfigView: React.FC = () => {
  const { 
    t, 
    language, 
    currentUser, 
    portalConfigs, 
    updateRolePortalConfig, 
    resetRolePortalConfig, 
    students,
    enrollments 
  } = useApp();

  const isEs = language === 'es';
  const [selectedRole, setSelectedRole] = useState<'admin' | 'guardian' | 'student'>('admin');
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'widgets' | 'permissions' | 'preview'>('modules');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Working local state for the currently selected role
  const [currentConfig, setCurrentConfig] = useState<RolePortalConfig>(() => {
    return JSON.parse(JSON.stringify(portalConfigs[selectedRole] || portalConfigs.admin));
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // When selected role changes, reload working config from global portalConfigs
  useEffect(() => {
    if (portalConfigs[selectedRole]) {
      setCurrentConfig(JSON.parse(JSON.stringify(portalConfigs[selectedRole])));
      setHasUnsavedChanges(false);
    }
  }, [selectedRole, portalConfigs]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Toggle Module
  const handleToggleModule = (moduleId: string) => {
    setCurrentConfig((prev) => {
      const updatedModules = prev.modules.map((m) => {
        if (m.id === moduleId) {
          if (m.isCore) {
            showToast(
              isEs 
                ? 'Este es un módulo central del portal y se recomienda mantenerlo activo para la navegación básica.' 
                : 'This is a core module and recommended to remain enabled.',
              'info'
            );
          }
          return { ...m, enabled: !m.enabled };
        }
        return m;
      });
      return { ...prev, modules: updatedModules };
    });
    setHasUnsavedChanges(true);
  };

  // Reorder Module (up or down)
  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentConfig.modules.length) return;

    setCurrentConfig((prev) => {
      const newModules = [...prev.modules];
      const temp = newModules[index];
      newModules[index] = newModules[targetIndex];
      newModules[targetIndex] = temp;

      // Reassign order indices
      newModules.forEach((m, idx) => {
        m.order = idx + 1;
      });

      return { ...prev, modules: newModules };
    });
    setHasUnsavedChanges(true);
  };

  // Toggle Widget
  const handleToggleWidget = (widgetId: string) => {
    setCurrentConfig((prev) => {
      const updatedWidgets = prev.widgets.map((w) => {
        if (w.id === widgetId) {
          return { ...w, enabled: !w.enabled };
        }
        return w;
      });
      return { ...prev, widgets: updatedWidgets };
    });
    setHasUnsavedChanges(true);
  };

  // Reorder Widget
  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentConfig.widgets.length) return;

    setCurrentConfig((prev) => {
      const newWidgets = [...prev.widgets];
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;

      newWidgets.forEach((w, idx) => {
        w.order = idx + 1;
      });

      return { ...prev, widgets: newWidgets };
    });
    setHasUnsavedChanges(true);
  };

  // Toggle Permission
  const handleTogglePermission = (key: keyof RolePermissions) => {
    if (selectedRole === 'admin' && key === 'canConfigurePortals') {
      showToast(
        isEs 
          ? 'El permiso de configuración de portales no puede desactivarse para el rol de administrador.' 
          : 'Portal configuration permission cannot be disabled for admin.',
        'info'
      );
      return;
    }

    setCurrentConfig((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await updateRolePortalConfig(selectedRole, currentConfig);
      setHasUnsavedChanges(false);
      showToast(
        res.message || (isEs ? `Configuración para ${currentConfig.name} guardada exitosamente.` : 'Configuration saved successfully.'),
        'success'
      );
    } catch {
      showToast(isEs ? 'Error al guardar la configuración.' : 'Error saving configuration.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to system default
  const handleResetToDefault = async () => {
    const confirmText = isEs 
      ? `¿Deseas restaurar la configuración predeterminada del rol ${currentConfig.name}? Se perderán los ajustes personalizados.` 
      : `Reset default configuration for role ${currentConfig.name}?`;
    
    if (window.confirm(confirmText)) {
      setIsSaving(true);
      try {
        const res = await resetRolePortalConfig(selectedRole);
        showToast(
          res.message || (isEs ? 'Configuración predeterminada restaurada.' : 'Default configuration restored.'),
          'info'
        );
      } catch {
        showToast(isEs ? 'Error al restaurar valores.' : 'Error resetting values.', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Discard local changes
  const handleDiscardChanges = () => {
    if (portalConfigs[selectedRole]) {
      setCurrentConfig(JSON.parse(JSON.stringify(portalConfigs[selectedRole])));
      setHasUnsavedChanges(false);
      showToast(isEs ? 'Cambios descartados.' : 'Changes discarded.', 'info');
    }
  };

  const rolesList: { id: 'admin' | 'guardian' | 'student'; label: string; icon: React.ElementType; badge: string; count: number }[] = [
    {
      id: 'admin',
      label: isEs ? 'Directivo / Administrativo' : 'Leadership & Staff',
      icon: Users,
      badge: isEs ? 'Rectoría / Secretaría' : 'Staff',
      count: 4
    },
    {
      id: 'guardian',
      label: isEs ? 'Acudiente / Familia' : 'Guardian & Family',
      icon: UserCheck,
      badge: isEs ? 'Familias' : 'Families',
      count: 24
    },
    {
      id: 'student',
      label: isEs ? 'Estudiante' : 'Student',
      icon: GraduationCap,
      badge: isEs ? 'Alumnos' : 'Students',
      count: 145
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 border animate-in slide-in-from-bottom duration-200 max-w-md ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-700 border-emerald-500' 
            : toastMessage.type === 'error'
            ? 'bg-rose-700 border-rose-500'
            : 'bg-teal-800 border-teal-600'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-200 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-auto text-white/80 hover:text-white font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{isEs ? 'Módulo Administrativo Exclusivo' : 'Exclusive Staff Module'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEs ? 'Configuración de Portales por Rol' : 'Role-Based Portal Configuration'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {isEs 
              ? 'Personaliza de forma granular qué módulos, tarjetas, indicadores KPI y permisos visualiza cada usuario según su rol autenticado en la I.E. Félix Henao Botero.'
              : 'Customize modules, widgets, KPI indicators, and permissions displayed for each user role upon login.'}
          </p>
        </div>

        {/* Global Save / Reset / Discard Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {hasUnsavedChanges && (
            <button
              onClick={handleDiscardChanges}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              {isEs ? 'Descartar' : 'Discard'}
            </button>
          )}

          <button
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isEs ? 'Restaurar configuración inicial del rol' : 'Reset default values'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEs ? 'Restaurar Predeterminado' : 'Reset Default'}</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              hasUnsavedChanges 
                ? 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/30 ring-2 ring-teal-400' 
                : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? (isEs ? 'Guardando...' : 'Saving...') : (isEs ? 'Guardar y Aplicar' : 'Save & Apply')}</span>
          </button>
        </div>
      </div>

      {/* Role Selector Tabs (Admin, Guardian, Student) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {rolesList.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          const conf = portalConfigs[r.id];
          const activeModulesCount = conf?.modules?.filter(m => m.enabled).length || 0;
          const activeWidgetsCount = conf?.widgets?.filter(w => w.enabled).length || 0;

          return (
            <div
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative select-none ${
                isSelected 
                  ? 'bg-white dark:bg-slate-900 border-teal-600 dark:border-teal-400 shadow-md ring-2 ring-teal-500/20' 
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isSelected 
                    ? 'bg-teal-700 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isSelected
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {r.badge}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {r.label}
              </h3>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{activeModulesCount} {isEs ? 'módulos' : 'modules'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{activeWidgetsCount} {isEs ? 'widgets' : 'widgets'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Configuration Card with Sub-tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Sub-tabs header */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
            <button
              onClick={() => setActiveSubTab('modules')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'modules'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isEs ? 'Módulos y Menús' : 'Modules & Navigation'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {currentConfig.modules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('widgets')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'widgets'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isEs ? 'Tarjetas e Indicadores KPI' : 'Cards & Indicators'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {currentConfig.widgets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('permissions')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'permissions'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isEs ? 'Permisos del Rol' : 'Role Permissions'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('preview')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'preview'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isEs ? 'Previsualización en Vivo' : 'Live Preview'}</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 pb-2 sm:pb-0">
            {isEs ? 'Editando rol:' : 'Editing role:'}{' '}
            <strong className="text-slate-800 dark:text-slate-200">{currentConfig.name}</strong>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBTAB 1: MÓDULOS Y MENÚS                                                 */}
        {/* ========================================================================= */}
        {activeSubTab === 'modules' && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isEs ? 'Estructura de Menú y Rutas Autorizadas' : 'Navigation Menu & Authorized Routes'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Los módulos desactivados se ocultan completamente de la barra lateral y no son accesibles para este rol.'
                    : 'Disabled modules are hidden from navigation and blocked from access.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                {currentConfig.modules.filter(m => m.enabled).length} de {currentConfig.modules.length} {isEs ? 'activos' : 'active'}
              </span>
            </div>

            <div className="space-y-3">
              {currentConfig.modules.map((mod, idx) => {
                const IconComponent = iconMap[mod.iconName] || Layers;
                return (
                  <div
                    key={mod.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      mod.enabled 
                        ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs' 
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Order Controls */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveModule(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title={isEs ? 'Subir posición' : 'Move up'}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveModule(idx, 'down')}
                          disabled={idx === currentConfig.modules.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                          title={isEs ? 'Bajar posición' : 'Move down'}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        mod.enabled 
                          ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {isEs ? mod.label : mod.labelEn}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            tab: {mod.id}
                          </span>
                          {mod.isCore && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              {isEs ? 'Principal' : 'Core'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isEs ? mod.description : mod.descriptionEn}
                        </p>
                      </div>
                    </div>

                    {/* Enable / Disable Switch */}
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {mod.enabled ? (isEs ? 'Visible' : 'Enabled') : (isEs ? 'Oculto' : 'Hidden')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleModule(mod.id)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          mod.enabled ? 'bg-teal-700 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: WIDGETS E INDICADORES KPI                                       */}
        {/* ========================================================================= */}
        {activeSubTab === 'widgets' && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {isEs ? 'Tarjetas y Componentes del Dashboard Principal' : 'Dashboard Cards & KPI Indicators'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? 'Activa o desactiva qué elementos se renderizan dentro de la vista principal de este portal.' 
                    : 'Enable or disable widgets rendered inside the dashboard view.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                {currentConfig.widgets.filter(w => w.enabled).length} de {currentConfig.widgets.length} {isEs ? 'activos' : 'active'}
              </span>
            </div>

            <div className="space-y-3">
              {currentConfig.widgets.map((widget, idx) => (
                <div
                  key={widget.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    widget.enabled 
                      ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs' 
                      : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Order Controls */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveWidget(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title={isEs ? 'Subir orden' : 'Move up'}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveWidget(idx, 'down')}
                        disabled={idx === currentConfig.widgets.length - 1}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                        title={isEs ? 'Bajar orden' : 'Move down'}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {isEs ? widget.title : widget.titleEn}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          widget.category === 'kpi'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : widget.category === 'chart'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : widget.category === 'action'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {widget.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          id: {widget.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEs ? widget.description : widget.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Switch */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {widget.enabled ? (isEs ? 'Activo' : 'Active') : (isEs ? 'Inactivo' : 'Disabled')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleWidget(widget.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        widget.enabled ? 'bg-teal-700 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: PERMISOS DEL ROL                                                */}
        {/* ========================================================================= */}
        {activeSubTab === 'permissions' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {isEs ? 'Matriz de Permisos y Acciones Autorizadas' : 'Role Permissions & Capabilities'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEs 
                  ? 'Define qué operaciones puede ejecutar este rol dentro de la plataforma (principio de mínimo privilegio).' 
                  : 'Define authorized actions for this role (least privilege principle).'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: 'canDownloadCertificates' as keyof RolePermissions,
                  title: isEs ? 'Descarga de Certificados y Comprobantes' : 'Download Certificates',
                  desc: isEs ? 'Permite descargar actas y certificados de matrícula oficiales en PDF.' : 'Download enrollment certificates.'
                },
                {
                  key: 'canEditProfile' as keyof RolePermissions,
                  title: isEs ? 'Edición de Datos Personales de Perfil' : 'Edit Personal Profile',
                  desc: isEs ? 'Permite actualizar teléfono, dirección y datos de contacto propios.' : 'Update phone, address and contact info.'
                },
                {
                  key: 'canUploadAvatar' as keyof RolePermissions,
                  title: isEs ? 'Personalización de Fotografía de Avatar' : 'Avatar Photo Customization',
                  desc: isEs ? 'Permite subir fotografías personalizadas o alternar avatares.' : 'Upload custom photos or switch avatars.'
                },
                {
                  key: 'canEnrollStudents' as keyof RolePermissions,
                  title: isEs ? 'Inscripción y Radicación de Matrículas' : 'Submit Enrollments',
                  desc: isEs ? 'Permite llenar el asistente de matrícula para nuevos cupos escolares.' : 'Complete enrollment wizard.'
                },
                {
                  key: 'canAuditDocuments' as keyof RolePermissions,
                  title: isEs ? 'Auditoría y Aprobación Documental' : 'Document Audit & Approval',
                  desc: isEs ? 'Permite aceptar o rechazar soportes de matrícula cargados.' : 'Approve or reject uploaded student docs.'
                },
                {
                  key: 'canManageUsers' as keyof RolePermissions,
                  title: isEs ? 'Gestión de Directorio y Vinculación Familiar' : 'Manage Users & Links',
                  desc: isEs ? 'Permite vincular acudientes y gestionar fichas estudiantiles.' : 'Link guardians and manage student files.'
                },
                {
                  key: 'canExportReports' as keyof RolePermissions,
                  title: isEs ? 'Exportación de Reportes y Estadísticas' : 'Export Reports',
                  desc: isEs ? 'Descarga de bases de datos consolidadas para entes territoriales.' : 'Download consolidated datasets.'
                },
                {
                  key: 'canViewAcademicRecords' as keyof RolePermissions,
                  title: isEs ? 'Consulta de Expedientes y Calificaciones' : 'View Academic Records',
                  desc: isEs ? 'Permite visualizar notas por materia, puesto y desempeño del periodo.' : 'View subject scores and academic rank.'
                },
                {
                  key: 'canConfigurePortals' as keyof RolePermissions,
                  title: isEs ? 'Administración Global de Portales' : 'Global Portal Administration',
                  desc: isEs ? 'Permite modificar módulos, tarjetas y permisos para todos los roles del sistema.' : 'Edit portal configurations for all roles.'
                }
              ].map((perm) => {
                const isEnabled = currentConfig.permissions[perm.key];
                return (
                  <div
                    key={perm.key}
                    onClick={() => handleTogglePermission(perm.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                      isEnabled 
                        ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800' 
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {perm.title}
                        </span>
                        {perm.key === 'canConfigurePortals' && (
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {perm.desc}
                      </p>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      isEnabled 
                        ? 'bg-teal-700 border-teal-700 text-white' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {isEnabled && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: PREVISUALIZACIÓN EN VIVO (LIVE PREVIEW)                          */}
        {/* ========================================================================= */}
        {activeSubTab === 'preview' && (
          <div className="p-6 sm:p-8 space-y-6 bg-slate-100/70 dark:bg-slate-950/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-600" />
                  <span>{isEs ? 'Simulador de Portal en Vivo' : 'Live Portal Simulator'}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEs 
                    ? `Vista preliminar de cómo el usuario con rol '${currentConfig.name}' visualizará la plataforma con los ajustes actuales.`
                    : `Preview of how users with role '${currentConfig.name}' will see the portal with current settings.`}
                </p>
              </div>

              {/* Viewport switch: Desktop vs Mobile */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Escritorio' : 'Desktop'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Celular (375px)' : 'Mobile (375px)'}</span>
                </button>
              </div>
            </div>

            {/* Simulated Frame */}
            <div className={`mx-auto transition-all ${
              previewDevice === 'mobile' 
                ? 'max-w-sm rounded-[2.5rem] border-8 border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden' 
                : 'w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden'
            }`}>
              <div className="bg-slate-50 dark:bg-slate-900 min-h-[460px] flex flex-col text-slate-800 dark:text-slate-200 text-xs">
                
                {/* Simulated Portal Top Bar */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">
                      FH
                    </div>
                    <span className="font-black text-slate-800 dark:text-white text-xs">
                      edumed <span className="text-teal-600">digital</span>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {currentConfig.badgeLabel}
                  </span>
                </div>

                <div className="flex-1 flex flex-col md:flex-row">
                  {/* Simulated Sidebar or Mobile Navigation */}
                  <div className={`${
                    previewDevice === 'mobile' 
                      ? 'bg-[#0a192f] text-slate-300 p-2 flex items-center gap-1 overflow-x-auto border-b border-slate-800' 
                      : 'w-48 bg-[#0a192f] text-slate-300 p-3 space-y-1 shrink-0'
                  }`}>
                    {currentConfig.modules
                      .filter(m => m.enabled)
                      .map((m, idx) => {
                        const IconComponent = iconMap[m.iconName] || Layers;
                        return (
                          <div
                            key={m.id}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                              idx === 0 
                                ? 'bg-teal-700 text-white' 
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{isEs ? m.label : m.labelEn}</span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Simulated Main Dashboard Content with enabled widgets */}
                  <div className="flex-1 p-4 space-y-3 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
                    
                    {/* Role Header Banner */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white text-sm">
                          {isEs ? `Bienvenido al ${currentConfig.name}` : `Welcome to ${currentConfig.nameEn}`}
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          {currentConfig.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ● {isEs ? 'En Línea' : 'Online'}
                      </span>
                    </div>

                    {/* Active Widgets preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentConfig.widgets
                        .filter(w => w.enabled)
                        .map((widget) => (
                          <div
                            key={widget.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[150px]">
                                {isEs ? widget.title : widget.titleEn}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase font-mono">
                                {widget.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">
                              {isEs ? widget.description : widget.descriptionEn}
                            </p>
                          </div>
                        ))}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
