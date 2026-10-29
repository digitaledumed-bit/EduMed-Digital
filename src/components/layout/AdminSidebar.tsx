import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCheck, 
  FolderKanban, 
  CheckSquare, 
  BarChart3, 
  UserCog, 
  Settings, 
  LogOut, 
  GraduationCap,
  Sparkles,
  Search,
  Award,
  LifeBuoy,
  Globe,
  FilePlus,
  Camera,
  Sliders
} from 'lucide-react';
import { AvatarChangeModal } from '../common/AvatarChangeModal';
import { getDefaultAvatarByGender, isMaleGender } from '../../utils/avatarUtils';

export const AdminSidebar: React.FC = () => {
  const { 
    t, 
    activeTab, 
    setActiveTab, 
    setActiveRole, 
    language, 
    documents,
    currentUser,
    logout,
    portalConfigs
  } = useApp();

  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);

  const pendingDocsCount = documents.filter(d => d.status === 'in_review' || d.status === 'pending').length;

  const role = (currentUser?.role as 'admin' | 'guardian' | 'student' | 'teacher' | 'directivo') || 'admin';

  // Icon lookup for dynamic role modules
  const iconLookup: Record<string, React.ElementType> = {
    dashboard: role === 'student' ? GraduationCap : LayoutDashboard,
    enrollments: FileText,
    students: Users,
    parents: UserCheck,
    'link-guardian': UserCog,
    documents: FolderKanban,
    'student-profile': GraduationCap,
    status: Search,
    wizard: FilePlus,
    beneficios: Award,
    institucion: Globe,
    soporte: LifeBuoy
  };

  // Build role-specific menu items dynamically respecting the administrator's configuration and order
  const getMenuItems = () => {
    // Dedicated Teacher Navigation: strictly limited to authorized scope
    if (role === 'teacher') {
      return [
        {
          id: 'dashboard',
          label: language === 'es' ? 'Portal Docente' : 'Teacher Portal',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'students',
          label: language === 'es' ? 'Mis Estudiantes' : 'My Students',
          icon: Users,
          badge: null
        },
        {
          id: 'documents',
          label: language === 'es' ? 'Documentos de Área' : 'Course Documents',
          icon: FolderKanban,
          badge: null
        }
      ];
    }

    const roleConfig = portalConfigs[role as 'admin' | 'guardian' | 'student' | 'directivo'];
    if (roleConfig && roleConfig.modules) {
      return roleConfig.modules
        .filter(m => m.enabled && m.id !== 'portal-config' && m.id !== 'settings')
        .map(m => {
          let badge: string | null = null;
          if (m.id === 'documents' && pendingDocsCount > 0) {
            badge = `${pendingDocsCount}`;
          }
          return {
            id: m.id,
            label: language === 'es' ? m.label : m.labelEn,
            icon: iconLookup[m.id] || LayoutDashboard,
            badge
          };
        });
    }

    // Safe fallback if not yet loaded
    return [
      {
        id: 'dashboard',
        label: language === 'es' ? 'Panel de Control' : 'Dashboard',
        icon: LayoutDashboard,
        badge: null
      }
    ];
  };

  const menuItems = getMenuItems();

  const getPortalHeader = () => {
    if (role === 'guardian') {
      return {
        title: 'EduMed',
        accent: language === 'es' ? 'Familias' : 'Families',
        subtitle: language === 'es' ? 'Portal del Acudiente' : 'Guardian Portal'
      };
    }
    if (role === 'student') {
      return {
        title: 'EduMed',
        accent: language === 'es' ? 'Alumnos' : 'Students',
        subtitle: language === 'es' ? 'Portal del Estudiante' : 'Student Portal'
      };
    }
    if (role === 'teacher') {
      return {
        title: 'EduMed',
        accent: 'Docentes',
        subtitle: language === 'es' ? 'Portal Docente' : 'Faculty Portal'
      };
    }
    if (role === 'directivo') {
      return {
        title: 'EduMed',
        accent: language === 'es' ? 'Directivos' : 'Leadership',
        subtitle: language === 'es' ? 'Portal de Directivos' : 'Leadership Portal'
      };
    }
    return {
      title: 'EduMed',
      accent: 'Admin',
      subtitle: language === 'es' ? 'Portal Administrativo' : 'Administrative Portal'
    };
  };

  const headerInfo = getPortalHeader();

  return (
    <>
      {/* Mobile Horizontal Navigation Bar (< md) */}
      <div className="md:hidden bg-[#0a192f] border-b border-slate-800 text-slate-300 px-3 py-2 sticky top-16 sm:top-20 z-30 shadow-md">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-xs">{headerInfo.title} <span className="text-teal-400">{headerInfo.accent}</span></span>
            <span className="text-[10px] text-teal-300 font-semibold">• {headerInfo.subtitle}</span>
          </div>
          <button
            onClick={logout}
            className="min-h-[44px] min-w-[44px] px-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-rose-500/10 active:bg-rose-500/20"
            aria-label={language === 'es' ? 'Cerrar sesión' : 'Log out'}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{language === 'es' ? 'Salir' : 'Exit'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'students' && (activeTab === 'student-profile' || activeTab === 'link-guardian'));
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'bg-slate-800/70 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-400 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar (>= md) */}
      <aside className="hidden md:flex w-64 bg-[#0a192f] text-slate-300 flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-5rem)]">
        {/* Institution header badge */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide">
                {headerInfo.title} <span className="text-teal-400">{headerInfo.accent}</span>
              </div>
              <div className="text-[11px] text-teal-300 font-medium truncate max-w-[150px]">
                {headerInfo.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'es' ? 'Menú Principal' : 'Main Menu'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'students' && (activeTab === 'student-profile' || activeTab === 'link-guardian'));
            
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-semibold shadow-md shadow-teal-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      {/* Return to Public Portal button */}
      <div className="px-3 pb-3">
        <button
          id="sidebar-portal-publico-btn"
          onClick={() => {
            setActiveRole('public');
            setActiveTab('home');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-teal-400 text-xs font-semibold border border-teal-500/30 transition-all cursor-pointer shadow-xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Ver Portal Público' : 'Go to Public Portal'}</span>
        </button>
      </div>

      {/* Bottom User Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveTab(currentUser?.role === 'student' ? 'student-profile' : 'dashboard')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {currentUser?.role === 'student' ? (
              <div 
                className="relative group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAvatarModal(true);
                }}
                title={language === 'es' ? 'Cambiar foto de avatar' : 'Change avatar photo'}
              >
                <img
                  src={currentUser.avatarUrl || getDefaultAvatarByGender(currentUser.gender)}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500 bg-slate-800"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getDefaultAvatarByGender(currentUser.gender);
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-3 h-3" />
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold border border-teal-500/60">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
            )}
            
            <div className="text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                {currentUser?.name || 'Administración'}
              </div>
              <div className="text-[10px] text-teal-400 font-medium truncate capitalize">
                {currentUser?.role === 'directivo'
                  ? (language === 'es' ? 'Directivo Institucional' : 'Executive Leadership')
                  : currentUser?.role === 'admin' 
                  ? (language === 'es' ? 'Personal Administrativo' : 'Administrative Staff')
                  : currentUser?.role === 'student'
                  ? (language === 'es' ? 'Estudiante' : 'Student')
                  : (language === 'es' ? 'Acudiente' : 'Guardian')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {currentUser?.role === 'student' && (
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="p-1.5 text-teal-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title={language === 'es' ? 'Cambiar foto' : 'Change photo'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              id="sidebar-logout-btn"
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={t.nav.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Change Modal for Student */}
      {currentUser && currentUser.role === 'student' && (
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          studentName={currentUser.name}
          studentGender={currentUser.gender}
          currentAvatarUrl={currentUser.avatarUrl}
        />
      )}
    </aside>
    </>
  );
};
