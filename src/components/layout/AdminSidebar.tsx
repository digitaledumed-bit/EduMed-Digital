import React from 'react';
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
  FilePlus
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { 
    t, 
    activeTab, 
    setActiveTab, 
    setActiveRole, 
    language, 
    documents,
    currentUser,
    logout
  } = useApp();

  const pendingDocsCount = documents.filter(d => d.status === 'in_review' || d.status === 'pending').length;

  const role = currentUser?.role || 'admin';

  // Build role-specific menu items so each portal only accesses its corresponding views
  const getMenuItems = () => {
    if (role === 'guardian') {
      return [
        {
          id: 'status',
          label: language === 'es' ? 'Estado de Matrícula' : 'Enrollment Status',
          icon: Search,
          badge: null
        },
        {
          id: 'wizard',
          label: language === 'es' ? 'Nueva Matrícula' : 'New Enrollment',
          icon: FilePlus,
          badge: null
        },
        {
          id: 'student-profile',
          label: language === 'es' ? 'Expediente de mi Acudido' : 'My Child Profile',
          icon: GraduationCap,
          badge: null
        },
        {
          id: 'institucion',
          label: language === 'es' ? 'I.E. Félix Henao' : 'School Info',
          icon: Globe,
          badge: null
        },
        {
          id: 'beneficios',
          label: language === 'es' ? 'Beneficios Escolares' : 'Student Benefits',
          icon: Award,
          badge: null
        },
        {
          id: 'soporte',
          label: language === 'es' ? 'Soporte y Ayuda' : 'Support & Help',
          icon: LifeBuoy,
          badge: null
        }
      ];
    }

    if (role === 'student') {
      return [
        {
          id: 'student-profile',
          label: language === 'es' ? 'Mi Expediente y Notas' : 'My Grades & Profile',
          icon: GraduationCap,
          badge: null
        },
        {
          id: 'status',
          label: language === 'es' ? 'Estado de mi Matrícula' : 'My Enrollment Status',
          icon: Search,
          badge: null
        },
        {
          id: 'institucion',
          label: language === 'es' ? 'Mi Colegio I.E. Félix Henao' : 'My School Info',
          icon: Globe,
          badge: null
        },
        {
          id: 'beneficios',
          label: language === 'es' ? 'Beneficios Estudiantiles' : 'Student Benefits',
          icon: Award,
          badge: null
        },
        {
          id: 'soporte',
          label: language === 'es' ? 'Orientación y Soporte' : 'Guidance & Support',
          icon: LifeBuoy,
          badge: null
        }
      ];
    }

    // Default: Admin / Teacher portal
    return [
      {
        id: 'dashboard',
        label: t.nav.dashboard,
        icon: LayoutDashboard,
        badge: null
      },
      {
        id: 'enrollments',
        label: t.nav.enrollment,
        icon: FileText,
        badge: null
      },
      {
        id: 'students',
        label: t.nav.students,
        icon: Users,
        badge: null
      },
      {
        id: 'parents',
        label: t.nav.parents,
        icon: UserCheck,
        badge: null
      },
      {
        id: 'documents',
        label: t.nav.documents,
        icon: FolderKanban,
        badge: pendingDocsCount > 0 ? `${pendingDocsCount}` : null
      },
      {
        id: 'wizard',
        label: language === 'es' ? 'Nueva Matrícula' : 'New Enrollment',
        icon: FilePlus,
        badge: null
      },
      {
        id: 'status',
        label: t.nav.status,
        icon: Search,
        badge: null
      },
      {
        id: 'institucion',
        label: language === 'es' ? 'I.E. Félix Henao' : 'School Info',
        icon: Globe,
        badge: null
      },
      {
        id: 'beneficios',
        label: language === 'es' ? 'Beneficios' : 'Benefits',
        icon: Award,
        badge: null
      },
      {
        id: 'soporte',
        label: language === 'es' ? 'Soporte' : 'Support',
        icon: LifeBuoy,
        badge: null
      },
      {
        id: 'settings',
        label: t.nav.settings,
        icon: Settings,
        badge: null
      }
    ];
  };

  const menuItems = getMenuItems();

  const getPortalHeader = () => {
    if (role === 'guardian') {
      return {
        title: 'EduMed',
        accent: 'Familias',
        subtitle: language === 'es' ? 'Portal del Acudiente' : 'Guardian Portal'
      };
    }
    if (role === 'student') {
      return {
        title: 'EduMed',
        accent: 'Alumnos',
        subtitle: language === 'es' ? 'Portal del Estudiante' : 'Student Portal'
      };
    }
    return {
      title: 'EduMed',
      accent: 'Admin',
      subtitle: language === 'es' ? 'Docentes y Rectoría' : 'Teachers & Admin'
    };
  };

  const headerInfo = getPortalHeader();

  return (
    <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-[calc(100vh-4rem)]">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold border border-teal-500/60">
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                {currentUser?.name || 'Administración'}
              </div>
              <div className="text-[10px] text-teal-400 font-medium truncate capitalize">
                {currentUser?.role === 'admin' 
                  ? (language === 'es' ? 'Docente / Admin' : 'Teacher / Admin')
                  : currentUser?.role === 'student'
                  ? (language === 'es' ? 'Estudiante' : 'Student')
                  : (language === 'es' ? 'Acudiente' : 'Guardian')}
              </div>
            </div>
          </div>
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
    </aside>
  );
};
