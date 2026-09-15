import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  Shield, 
  GraduationCap, 
  Users, 
  ChevronDown, 
  Search, 
  FileText, 
  Home, 
  CheckCircle2, 
  X,
  Sparkles,
  LogOut,
  LogIn,
  Type
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    fontSize,
    setFontSize,
    toggleFontSize,
    t, 
    activeRole, 
    setActiveRole, 
    activeTab, 
    setActiveTab, 
    notifications, 
    markNotificationsAsRead, 
    unreadCount,
    currentUser,
    logout,
    customLogoUrl
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);

  const handleRoleChange = (role: 'public' | 'admin' | 'guardian' | 'student') => {
    setActiveRole(role);
    setShowRoleDropdown(false);
    if (role === 'admin') {
      setActiveTab('dashboard');
    } else if (role === 'student') {
      setActiveTab('student-portal');
    } else if (role === 'guardian') {
      setActiveTab('guardian-portal');
    } else {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo"
            onClick={() => { setActiveRole('public'); setActiveTab('home'); }} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Logo Institucional EduMed Digital - I.E. Félix Henao Botero" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-md group-hover:scale-105 transition-transform bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EduMed <span className="text-teal-600 dark:text-teal-400">Digital</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {language === 'es' ? 'Portal Oficial de Admisiones' : 'Admissions Portal'}
              </p>
            </div>
          </div>

          {/* Navigation Links: Home and I.E. Félix Henao always visible; Status, Enrollment, Benefits, and Support only after login */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-link-home"
              onClick={() => { setActiveTab('home'); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home' || activeTab === 'landing'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.nav.home}
            </button>

            {/* DEDICATED SEPARATE BUTTON FOR FÉLIX HENAO BOTERO (NOT IN INICIO) */}
            <button
              id="nav-link-felix-henao"
              onClick={() => setActiveTab('institucion')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'institucion'
                  ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Información y sedes de la I.E. Félix Henao Botero"
            >
              {language === 'es' ? 'I.E. Félix Henao' : 'Félix Henao School'}
            </button>

            {/* Buttons shown ONLY after login: Consultar Estado, Nueva Matrícula, Beneficios, Soporte */}
            {currentUser && (
              <>
                <button
                  id="nav-link-status"
                  onClick={() => setActiveTab('status')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'status'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.status}
                </button>

                <button
                  id="nav-link-enrollment"
                  onClick={() => setActiveTab('wizard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'wizard'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.newEnrollment}
                </button>

                <button
                  id="nav-link-benefits"
                  onClick={() => setActiveTab('beneficios')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'beneficios'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.benefits}
                </button>

                <button
                  id="nav-link-support"
                  onClick={() => setActiveTab('soporte')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'soporte'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.support}
                </button>
              </>
            )}
          </nav>

          {/* Controls: Portal Switcher (after login), Language Toggle, Dark Mode, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View / Role Switcher Pill displaying active portal ONLY AFTER LOGIN */}
            {currentUser && (
              <div className="relative">
                <button
                  id="role-switcher-btn"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:border-teal-500 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="font-bold">
                    {activeRole === 'public' && (language === 'es' ? 'Portal Público' : 'Public Portal')}
                    {activeRole === 'admin' && (language === 'es' ? 'Portal Profesor' : 'Teacher Portal')}
                    {activeRole === 'student' && (language === 'es' ? 'Portal Estudiante' : 'Student Portal')}
                    {activeRole === 'guardian' && (language === 'es' ? 'Portal Acudiente' : 'Guardian Portal')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {language === 'es' ? 'Seleccionar Portal' : 'Select Portal'}
                    </div>
                    <button
                      onClick={() => handleRoleChange('public')}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 ${activeRole === 'public' ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <div>
                        <div className="font-semibold">{language === 'es' ? 'Portal Público' : 'Public Portal'}</div>
                        <div className="text-[11px] text-slate-400">{language === 'es' ? 'Página Principal y Admisiones' : 'Info & Registration'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 ${activeRole === 'admin' ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <div>
                        <div className="font-semibold">{language === 'es' ? 'Portal Profesor' : 'Teacher Portal'}</div>
                        <div className="text-[11px] text-slate-400">{language === 'es' ? 'Docentes y Administración' : 'Teachers & Administration'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange('guardian')}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 ${activeRole === 'guardian' ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <div>
                        <div className="font-semibold">{language === 'es' ? 'Portal Acudiente' : 'Guardian Portal'}</div>
                        <div className="text-[11px] text-slate-400">{language === 'es' ? 'Padres de Familia y Tutores' : 'Parents & Guardians'}</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRoleChange('student')}
                      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 ${activeRole === 'student' ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <div>
                        <div className="font-semibold">{language === 'es' ? 'Portal Estudiante' : 'Student Portal'}</div>
                        <div className="text-[11px] text-slate-400">{language === 'es' ? 'Alumnos y Aspirantes' : 'Student Dashboard'}</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher Button (ES / EN) */}
            <div className="relative">
              <button
                id="lang-toggle-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={language === 'es' ? 'Cambiar Idioma' : 'Switch Language'}
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <button
                    id="lang-es-btn"
                    onClick={() => { setLanguage('es'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${language === 'es' ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">🇨🇴 Español</span>
                    {language === 'es' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    id="lang-en-btn"
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${language === 'en' ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">🇺🇸 English</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs cursor-pointer"
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              aria-label="Alternar tema oscuro / claro"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline text-xs font-semibold">Oscuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-xs font-semibold">Claro</span>
                </>
              )}
            </button>

            {/* Accessibility Font Size Toggle Button */}
            <div className="relative">
              <button
                id="font-size-toggle-btn"
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                title={language === 'es' ? 'Ajustar tamaño de letra en la plataforma' : 'Adjust platform font size'}
                aria-label="Tamaño de letra"
              >
                <Type className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline font-bold">
                  {fontSize === 'xlarge' ? 'Extra' : fontSize === 'large' ? 'Amplia' : 'Normal'}
                </span>
                <span className="sm:hidden font-bold">
                  {fontSize === 'xlarge' ? 'A++' : fontSize === 'large' ? 'A+' : 'A'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showFontSizeMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span>{language === 'es' ? 'Tamaño de Letra' : 'Font Size'}</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold lowercase">accesibilidad</span>
                  </div>
                  
                  <button
                    id="font-size-large-btn"
                    onClick={() => { setFontSize('large'); setShowFontSizeMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${fontSize === 'large' ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-teal-600 dark:text-teal-400">A+</span>
                      <div>
                        <div className="font-medium">{language === 'es' ? 'Letra Amplia' : 'Large Font'}</div>
                        <div className="text-[10px] text-slate-400">{language === 'es' ? 'Recomendada (Activa)' : 'Recommended (Active)'}</div>
                      </div>
                    </span>
                    {fontSize === 'large' && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  </button>

                  <button
                    id="font-size-xlarge-btn"
                    onClick={() => { setFontSize('xlarge'); setShowFontSizeMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${fontSize === 'xlarge' ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-black text-base text-amber-600 dark:text-amber-400">A++</span>
                      <div>
                        <div className="font-medium">{language === 'es' ? 'Extra Amplia' : 'Extra Large'}</div>
                        <div className="text-[10px] text-slate-400">{language === 'es' ? 'Máxima legibilidad' : 'Maximum visibility'}</div>
                      </div>
                    </span>
                    {fontSize === 'xlarge' && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  </button>

                  <button
                    id="font-size-normal-btn"
                    onClick={() => { setFontSize('normal'); setShowFontSizeMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/60 ${fontSize === 'normal' ? 'font-bold text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-500">A</span>
                      <div>
                        <div className="font-medium">{language === 'es' ? 'Estándar' : 'Standard'}</div>
                        <div className="text-[10px] text-slate-400">{language === 'es' ? 'Tamaño compacto' : 'Compact scale'}</div>
                      </div>
                    </span>
                    {fontSize === 'normal' && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markNotificationsAsRead();
                }}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title="Notificaciones"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'es' ? 'Notificaciones Institucionales' : 'Institutional Notifications'}
                    </span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {notif.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* If User Logged In: Quick Iniciar Matrícula button + User badge with logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2">
                <button
                  id="btn-quick-matricula"
                  onClick={() => setActiveTab('wizard')}
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-teal-600/20 active:scale-98 cursor-pointer"
                >
                  <span>{t.landing.startEnrollment}</span>
                </button>

                <div 
                  onClick={() => {
                    if (currentUser.role === 'admin') setActiveTab('dashboard');
                    else if (currentUser.role === 'student') setActiveTab('student-profile');
                    else setActiveTab('status');
                  }}
                  className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[9px] font-semibold text-teal-600 dark:text-teal-400 capitalize">
                      {currentUser.role === 'admin' ? 'Profesor / Docente' : currentUser.role === 'guardian' ? 'Acudiente' : 'Estudiante'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              /* Public Not Logged In Quick Action: Iniciar Sesión only */
              activeRole === 'public' && (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-nav-login"
                    onClick={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Iniciar Sesión</span>
                  </button>
                </div>
              )
            )}

            {/* Admin Profile Chip if not using currentUser object */}
            {activeRole === 'admin' && !currentUser && (
              <div 
                id="admin-profile-chip"
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 pl-2 pr-1 cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-teal-500"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Secretaría Académica</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Admin Félix Henao</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
