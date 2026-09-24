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
  Camera
} from 'lucide-react';
import { AvatarChangeModal } from '../common/AvatarChangeModal';
import { getDefaultAvatarByGender, isMaleGender, isFemaleGender } from '../../utils/avatarUtils';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
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
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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
            className="flex flex-col items-center justify-center text-center cursor-pointer select-none group py-1"
          >
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Escudo Institución Educativa Félix Henao Botero" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-xs group-hover:scale-105 transition-transform bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight text-slate-600 dark:text-slate-300 mt-1 leading-none">
              edumed <span className="text-teal-600 dark:text-teal-400 font-bold">digital</span>
            </span>
          </div>

          <div className="hidden lg:block text-left ml-4 mr-auto">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Institución Educativa Félix Henao Botero
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Medellín, Colombia • DANE 105001002345
            </span>
          </div>

          {/* Navigation Links: Clean top bar without redundant buttons */}
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

            {/* Admin Management Links */}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  id="nav-link-dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.dashboard}
                </button>

                <button
                  id="nav-link-enrollments"
                  onClick={() => setActiveTab('enrollments')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'enrollments'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.enrollment}
                </button>

                <button
                  id="nav-link-students"
                  onClick={() => setActiveTab('students')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'students' || activeTab === 'student-profile'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.students}
                </button>

                <button
                  id="nav-link-parents"
                  onClick={() => setActiveTab('parents')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'parents'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.parents}
                </button>

                <button
                  id="nav-link-documents"
                  onClick={() => setActiveTab('documents')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'documents'
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50/80 dark:bg-teal-950/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.nav.documents}
                </button>
              </>
            )}
          </nav>

          {/* Controls: Portal Badge (after login), Language Toggle, Dark Mode, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Authenticated Portal Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center">
                <span 
                  id="navbar-portal-badge"
                  className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-xs ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : currentUser.role === 'student'
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                  }`}
                >
                  {currentUser.role === 'admin' && (language === 'es' ? 'Portal Docente / Directivo' : 'Teacher / Admin Portal')}
                  {currentUser.role === 'student' && (language === 'es' ? 'Portal Estudiante' : 'Student Portal')}
                  {currentUser.role === 'guardian' && (language === 'es' ? 'Portal Acudiente' : 'Guardian Portal')}
                </span>
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
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'es' ? 'Mis Notificaciones' : 'My Notifications'}
                        </span>
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {currentUser && (
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="truncate">
                          {language === 'es' ? 'Perfil: ' : 'Profile: '}
                          <strong className="text-slate-700 dark:text-slate-200">
                            {currentUser.role === 'admin'
                              ? (currentUser.position || 'Docente / Directivo')
                              : currentUser.role === 'student'
                              ? 'Estudiante'
                              : 'Acudiente'}
                          </strong>
                        </span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold shrink-0">
                          {unreadCount > 0 ? `${unreadCount} ${language === 'es' ? 'nuevas' : 'new'}` : (language === 'es' ? 'Al día' : 'Up to date')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-6 h-6 text-teal-500 mx-auto mb-1.5 opacity-80" />
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          {language === 'es' ? 'No tienes notificaciones pendientes' : 'No pending notifications'}
                        </p>
                        <p className="mt-0.5 text-[11px]">
                          {language === 'es' ? 'Solo recibes alertas asociadas a tu rol y perfil.' : 'You only receive alerts related to your role and profile.'}
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                          <div className="flex items-start gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {notif.title}
                                </p>
                                {notif.category && (
                                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold shrink-0">
                                    {notif.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {notif.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* If User Logged In: User profile chip with role and logout button */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2">
                {currentUser.role === 'student' ? (
                  /* Student Profile Badge with Gender-Based Avatar & Photo Customizer */
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-2xl bg-teal-50 dark:bg-slate-800 border border-teal-300 dark:border-slate-700 shadow-xs">
                    {/* Interactive Avatar with Gender and Photo-Changer */}
                    <div 
                      onClick={() => setShowAvatarModal(true)}
                      className="relative group cursor-pointer"
                      title={language === 'es' ? 'Cambiar tu foto de avatar' : 'Change avatar photo'}
                    >
                      <img
                        src={currentUser.avatarUrl || getDefaultAvatarByGender(currentUser.gender)}
                        alt={currentUser.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-teal-500 shadow-xs bg-slate-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = getDefaultAvatarByGender(currentUser.gender);
                        }}
                      />
                      <div className="absolute inset-0 rounded-full bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Student Name & Gender Label */}
                    <div 
                      onClick={() => { setActiveRole('student'); setActiveTab('student-profile'); }}
                      className="text-left cursor-pointer"
                      title="Ver expediente del estudiante"
                    >
                      <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                        {currentUser.name}
                      </p>
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 block leading-tight">
                        {isMaleGender(currentUser.gender) ? '♂ Estudiante (Hombre)' : isFemaleGender(currentUser.gender) ? '♀ Estudiante (Mujer)' : '🎓 Estudiante (Neutro)'}
                      </span>
                    </div>

                    {/* Quick Button to Change Avatar Photo */}
                    <button
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-slate-600 text-teal-700 dark:text-teal-200 border border-teal-200 dark:border-slate-600 transition-colors cursor-pointer shadow-2xs"
                      title={language === 'es' ? 'Cambiar foto de avatar' : 'Change avatar photo'}
                    >
                      <Camera className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="hidden sm:inline">{language === 'es' ? 'Cambiar foto' : 'Change'}</span>
                    </button>
                  </div>
                ) : (
                  /* Admin / Guardian Chip */
                  <div 
                    onClick={() => {
                      setActiveRole(currentUser.role);
                      if (currentUser.role === 'admin') setActiveTab('dashboard');
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
                        {currentUser.role === 'admin' ? 'Profesor / Docente' : 'Acudiente'}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  id="nav-logout-btn"
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title={language === 'es' ? 'Cerrar Sesión' : 'Log Out'}
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">{language === 'es' ? 'Cerrar Sesión' : 'Log Out'}</span>
                  <span className="sm:hidden">{language === 'es' ? 'Salir' : 'Exit'}</span>
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

      {/* Avatar Customization Modal for Student */}
      {currentUser && currentUser.role === 'student' && (
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          studentName={currentUser.name}
          studentGender={currentUser.gender}
          currentAvatarUrl={currentUser.avatarUrl}
        />
      )}
    </header>
  );
};
