import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  LogOut,
  GraduationCap,
  Users,
  Shield,
  FileCheck,
  Search,
  FileText,
  Award,
  LifeBuoy,
  Globe
} from 'lucide-react';

interface AuthCardProps {
  onSuccess?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const { 
    language, 
    login, 
    register, 
    logout, 
    currentUser, 
    activeRole,
    setActiveRole,
    setActiveTab,
    customLogoUrl
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginRole, setLoginRole] = useState<'guardian' | 'student' | 'admin'>('guardian');
  const [loginDocType, setLoginDocType] = useState('email');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDocType, setRegDocType] = useState('CC');
  const [regDocNumber, setRegDocNumber] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<'guardian' | 'student'>('guardian');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Status & validation messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFoundState, setNotFoundState] = useState<{ identifier: string; suggestedRole?: 'guardian' | 'student' | 'admin' } | null>(null);

  // Switch to register tab and prefill identifier
  const handleInviteToRegister = (identifier: string, suggestedRole?: 'guardian' | 'student' | 'admin') => {
    setNotFoundState(null);
    setErrorMsg(null);
    setMode('register');

    const clean = identifier.trim();
    if (clean.includes('@')) {
      setRegEmail(clean);
    } else if (/^\d+$/.test(clean.replace(/\D/g, '')) && clean.replace(/\D/g, '').length >= 5) {
      setRegDocNumber(clean.replace(/\D/g, ''));
    } else {
      setRegName(clean);
    }

    if (suggestedRole === 'student') {
      setRegRole('student');
    } else {
      setRegRole('guardian');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setNotFoundState(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(loginIdentifier, loginPassword, loginRole);
      setIsLoading(false);
      if (!res.success) {
        if (res.notFound) {
          setNotFoundState({
            identifier: loginIdentifier,
            suggestedRole: res.suggestedRole || loginRole
          });
          setErrorMsg(null);
        } else {
          setNotFoundState(null);
          setErrorMsg(res.message || (language === 'es' ? 'Error al iniciar sesión.' : 'Login failed.'));
        }
      } else {
        setNotFoundState(null);
        setSuccessMsg(res.message || (language === 'es' ? '¡Bienvenido al sistema!' : 'Welcome back!'));
        if (onSuccess) onSuccess();
      }
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg(language === 'es' ? 'Debe aceptar la política de tratamiento de datos.' : 'You must accept data policies.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        documentNumber: `${regDocType} ${regDocNumber}`,
        phone: regPhone
      });
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message || (language === 'es' ? 'Error al registrar usuario.' : 'Registration failed.'));
      } else {
        setSuccessMsg(language === 'es' ? '¡Cuenta creada con éxito! Bienvenido.' : 'Account created successfully!');
        if (onSuccess) onSuccess();
      }
    }, 450);
  };

  const quickDemoLogin = (role: 'admin' | 'student' | 'guardian') => {
    setErrorMsg(null);
    if (role === 'admin') {
      setLoginIdentifier('admin@edumed.edu.co');
      setLoginPassword('admin2025');
      setLoginRole('admin');
      login('admin@edumed.edu.co', 'admin2025', 'admin');
    } else if (role === 'student') {
      setLoginIdentifier('mateo.restrepo@edumed.edu.co');
      setLoginPassword('mateo2025');
      setLoginRole('student');
      login('mateo.restrepo@edumed.edu.co', 'mateo2025', 'student');
    } else {
      setLoginIdentifier('maria.gonzalez@gmail.com');
      setLoginPassword('maria2025');
      setLoginRole('guardian');
      login('maria.gonzalez@gmail.com', 'maria2025', 'guardian');
    }
  };

  // If user is currently logged in, show active session banner with logout option
  if (currentUser) {
    return (
      <div 
        id="auth-active-session-card"
        className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-teal-500/40 dark:border-teal-500/30 p-6 sm:p-7 shadow-xl backdrop-blur-sm"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={customLogoUrl} 
                alt="EduMed Digital Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-md bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                {language === 'es' ? 'Sesión Activa' : 'Active Session'}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {language === 'es' ? 'Rol en plataforma:' : 'Platform Role:'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 capitalize">
              {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'student' ? 'Estudiante' : 'Acudiente'}
            </span>
          </div>

          {/* Quick Actions (Requested: Nueva Matrícula, Consultar Estado, Beneficios, Soporte, Portal Público) */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-left">
              {language === 'es' ? 'Servicios Disponibles:' : 'Available Services:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="auth-card-btn-enrollment"
                onClick={() => setActiveTab('wizard')}
                className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 text-xs font-bold flex items-center gap-2 border border-teal-200/80 dark:border-teal-800 transition-colors cursor-pointer text-left"
              >
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">{language === 'es' ? 'Nueva Matrícula' : 'New Enrollment'}</span>
              </button>

              <button
                id="auth-card-btn-status"
                onClick={() => setActiveTab('status')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left"
              >
                <Search className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">{language === 'es' ? 'Consultar Estado' : 'Check Status'}</span>
              </button>

              <button
                id="auth-card-btn-benefits"
                onClick={() => setActiveTab('beneficios')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left"
              >
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{language === 'es' ? 'Beneficios' : 'Benefits'}</span>
              </button>

              <button
                id="auth-card-btn-support"
                onClick={() => setActiveTab('soporte')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left"
              >
                <LifeBuoy className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{language === 'es' ? 'Soporte' : 'Support'}</span>
              </button>
            </div>

            {/* Portal Público button */}
            <button
              id="auth-card-btn-portal-publico"
              onClick={() => {
                setActiveRole('public');
                setActiveTab('home');
              }}
              className="w-full mt-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>{language === 'es' ? 'Ver Portal Público' : 'View Public Portal'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (currentUser.role === 'admin') setActiveTab('dashboard');
                else if (currentUser.role === 'student') setActiveTab('student-profile');
                else setActiveTab('status');
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {language === 'es' ? 'Ir a mi Panel' : 'Go to Dashboard'}
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {language === 'es' ? 'Cerrar Sesión' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="auth-login-register-card"
      className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 transition-all relative overflow-hidden text-center"
    >
      {/* Centered Logo and Institution Name Header */}
      <div className="flex flex-col items-center justify-center pb-5 pt-2 border-b border-slate-100 dark:border-slate-800">
        {/* Official Institutional Logo (Fixed, only editable by administrator in settings) */}
        <div className="relative mb-3.5">
          <img 
            src={customLogoUrl} 
            alt="EduMed Digital - Institución Educativa Félix Henao Botero" 
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-4 ring-amber-400/20 shadow-xl bg-white mx-auto transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
            }}
          />
        </div>

        {/* Institution and Platform Name */}
        <span className="text-[11px] sm:text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
          I.E. Félix Henao Botero
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mt-1 flex items-center justify-center gap-2">
          <span>EduMed Digital</span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="Plataforma en línea" />
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
          Medellín • Secretaría de Educación • DANE 105001002345
        </span>
      </div>

      {/* Tab Switcher: Iniciar Sesión vs Crear Cuenta */}
      <div className="mt-5 grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        <button
          id="tab-btn-login"
          type="button"
          onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); setNotFoundState(null); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'login'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LogIn className="w-4 h-4" />
          {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
        </button>

        <button
          id="tab-btn-register"
          type="button"
          onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); setNotFoundState(null); }}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === 'register'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {language === 'es' ? 'Crear Cuenta' : 'Register'}
        </button>
      </div>

      {/* Notification / Feedback alerts */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SPECIAL PROMPT: User does NOT have an account yet -> Warm invitation to create one */}
      {notFoundState && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-600/70 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/70 text-amber-800 dark:text-amber-300 shrink-0 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  {language === 'es' ? '¿Aún no tienes una cuenta?' : "Don't have an account yet?"}
                </h4>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 tracking-wide uppercase">
                  {language === 'es' ? 'Invitación' : 'Invite'}
                </span>
              </div>
              <p className="text-xs text-amber-900/90 dark:text-amber-200/90 mt-1 leading-relaxed">
                {language === 'es' ? (
                  <>
                    No existe una cuenta activa con <span className="font-bold underline">{notFoundState.identifier}</span>. ¡Te invitamos cordialmente a registrarte ahora! Podrás gestionar matrículas, consultar notas y documentos escolares.
                  </>
                ) : (
                  <>
                    No account found for <span className="font-bold">{notFoundState.identifier}</span>. You are warmly invited to create your account now!
                  </>
                )}
              </p>
              
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleInviteToRegister(notFoundState.identifier, notFoundState.suggestedRole)}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'es' ? '¡Sí, crear mi cuenta ahora!' : 'Create my account now!'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setNotFoundState(null)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  {language === 'es' ? 'Intentar otro usuario' : 'Try another'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: INICIAR SESIÓN */}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          
          {/* Friendly New User Invitation Banner */}
          <div className="p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-teal-950 dark:text-teal-200">
                {language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight mt-0.5">
                {language === 'es' 
                  ? 'Ingresa tus datos para acceder. Si no la tienes, ' 
                  : 'Enter your credentials. If you do not have one, '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); setNotFoundState(null); }}
                  className="font-bold text-teal-700 dark:text-teal-300 underline hover:text-teal-900 dark:hover:text-white cursor-pointer"
                >
                  {language === 'es' ? 'créate una cuenta aquí' : 'create one here'}
                </button>
                {language === 'es' ? ' en 1 minuto.' : ' in 1 minute.'}
              </p>
            </div>
          </div>
          
          {/* Caja desplegable 1: Tipo de Portal / Rol de acceso */}
          <div className="text-left space-y-1">
            <label htmlFor="login-role-dropdown" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Portal al que desea ingresar (Caja desplegable)' : 'Portal to enter (Dropdown)'}
            </label>
            <select
              id="login-role-dropdown"
              value={loginRole}
              onChange={(e) => {
                const role = e.target.value as 'guardian' | 'student' | 'admin';
                setLoginRole(role);
                if (role === 'admin' && !loginIdentifier) setLoginIdentifier('profesor@edumed.edu.co');
                if (role === 'student' && !loginIdentifier) setLoginIdentifier('mateo.restrepo@edumed.edu.co');
                if (role === 'guardian' && !loginIdentifier) setLoginIdentifier('maria.gonzalez@gmail.com');
              }}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              <option value="guardian">{language === 'es' ? 'Portal Acudiente (Padres y Tutores)' : 'Guardian Portal (Parents & Tutors)'}</option>
              <option value="admin">{language === 'es' ? 'Portal Profesor / Docente (Cuerpo Académico)' : 'Teacher / Professor Portal'}</option>
              <option value="student">{language === 'es' ? 'Portal Estudiante (Alumnos y Aspirantes)' : 'Student Portal'}</option>
            </select>
          </div>

          {/* Caja desplegable 2: Tipo de dato de identificación / acceso */}
          <div className="text-left space-y-1">
            <label htmlFor="login-doctype-dropdown" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Tipo de documento o acceso (Caja desplegable)' : 'Document type or access (Dropdown)'}
            </label>
            <select
              id="login-doctype-dropdown"
              value={loginDocType}
              onChange={(e) => setLoginDocType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              <option value="email">{language === 'es' ? 'Correo Electrónico (Institucional o Personal)' : 'Email address'}</option>
              <option value="CC">{language === 'es' ? 'Cédula de Ciudadanía (C.C.)' : 'Citizenship Card (C.C.)'}</option>
              <option value="TI">{language === 'es' ? 'Tarjeta de Identidad (T.I.)' : 'Identity Card (T.I.)'}</option>
              <option value="CE">{language === 'es' ? 'Cédula de Extranjería (C.E.)' : 'Foreigner ID (C.E.)'}</option>
              <option value="radicado">{language === 'es' ? 'Número de Radicado Oficial (#MAT...)' : 'Enrollment Application ID'}</option>
            </select>
          </div>

          {/* Campo para rellenar los datos */}
          <div className="text-left space-y-1">
            <label 
              htmlFor="login-identifier-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {loginDocType === 'email' 
                ? (language === 'es' ? 'Rellenar correo electrónico:' : 'Fill in email address:')
                : loginDocType === 'radicado'
                ? (language === 'es' ? 'Rellenar código de radicado:' : 'Fill in application number:')
                : (language === 'es' ? `Rellenar número de documento (${loginDocType}):` : `Fill in ID number (${loginDocType}):`)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-identifier-input"
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder={
                  loginDocType === 'email'
                    ? (loginRole === 'student' ? 'mateo.restrepo@edumed.edu.co' : loginRole === 'admin' ? 'profesor@edumed.edu.co' : 'maria.gonzalez@gmail.com')
                    : loginDocType === 'radicado'
                    ? '#MAT-2024-001'
                    : 'Ej: 43981245'
                }
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Campo para rellenar la contraseña */}
          <div className="text-left space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label 
                htmlFor="login-password-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {language === 'es' ? 'Rellenar contraseña:' : 'Fill in password:'}
              </label>
              <button 
                type="button"
                onClick={() => { 
                  setErrorMsg(language === 'es' 
                    ? 'Para restablecer su clave institucional, comuníquese con secretaría académica: matriculas@iefelixhenaobotero.edu.co o acérquese a la sede principal.' 
                    : 'To reset your institutional password, contact academic records at matriculas@iefelixhenaobotero.edu.co'); 
                }}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer"
              >
                {language === 'es' ? '¿Olvidó su clave?' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type={showLoginPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                tabIndex={-1}
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me-checkbox"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <label htmlFor="remember-me-checkbox" className="ml-2 text-xs text-slate-600 dark:text-slate-400 select-none">
              {language === 'es' ? 'Recordar mis datos en este equipo' : 'Remember me on this device'}
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{language === 'es' ? 'Ingresar a la Plataforma' : 'Sign In to Platform'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Fast Demo Access Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center uppercase tracking-wider">
              {language === 'es' ? 'Acceso rápido de prueba (1 Clic)' : 'Quick demo accounts'}
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => quickDemoLogin('guardian')}
                className="py-1.5 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold border border-emerald-200 dark:border-emerald-800/60 transition-colors"
                title="Ingresar como Acudiente (María González)"
              >
                👨‍👩‍👦 Acudiente
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('student')}
                className="py-1.5 px-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold border border-indigo-200 dark:border-indigo-800/60 transition-colors"
                title="Ingresar como Estudiante (Mateo Restrepo)"
              >
                🎓 Estudiante
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="py-1.5 px-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-semibold border border-teal-200 dark:border-teal-800/60 transition-colors"
                title="Ingresar como Profesor / Docente"
              >
                👨‍🏫 Profesor
              </button>
            </div>
          </div>

          {/* Switch to Register link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'es' ? '¿Aún no tiene usuario registrado?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                {language === 'es' ? 'Crear una cuenta aquí' : 'Create an account'}
              </button>
            </p>
          </div>

        </form>
      ) : (
        /* TAB 2: CREAR UNA CUENTA */
        <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
          
          {/* User Type Choice (Caja desplegable) */}
          <div className="text-left space-y-1">
            <label htmlFor="reg-role-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Registrarme como (Caja desplegable)' : 'Register as (Dropdown)'}
            </label>
            <select
              id="reg-role-select"
              value={regRole}
              onChange={(e) => setRegRole(e.target.value as 'guardian' | 'student')}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="guardian">{language === 'es' ? '👨‍👩‍👦 Acudiente / Padre o Tutor de Familia' : 'Parent / Guardian'}</option>
              <option value="student">{language === 'es' ? '🎓 Estudiante / Aspirante' : 'Student / Applicant'}</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label 
              htmlFor="reg-name-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              {language === 'es' ? 'Nombres y Apellidos Completos' : 'Full Name'}
            </label>
            <input
              id="reg-name-input"
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="Ej. Sara Molina Rodríguez"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />
          </div>

          {/* Document Type & Number */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label 
                htmlFor="reg-doctype-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Tipo
              </label>
              <select
                id="reg-doctype-select"
                value={regDocType}
                onChange={(e) => setRegDocType(e.target.value)}
                className="w-full px-2 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
                <option value="RC">Reg. Civil</option>
              </select>
            </div>

            <div className="col-span-2">
              <label 
                htmlFor="reg-docnum-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Número de Documento
              </label>
              <input
                id="reg-docnum-input"
                type="text"
                required
                value={regDocNumber}
                onChange={(e) => setRegDocNumber(e.target.value)}
                placeholder="Ej. 1020304050"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label 
                htmlFor="reg-email-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="reg-email-input"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label 
                htmlFor="reg-phone-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Celular / WhatsApp
              </label>
              <input
                id="reg-phone-input"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="300 123 4567"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label 
                htmlFor="reg-password-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Crear Contraseña
              </label>
              <input
                id="reg-password-input"
                type={showRegPassword ? 'text' : 'password'}
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mín. 5 caracteres"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label 
                htmlFor="reg-confirm-password-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Confirmar Contraseña
              </label>
              <input
                id="reg-confirm-password-input"
                type={showRegPassword ? 'text' : 'password'}
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Repetir clave"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Toggle show password */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRegPassword(!showRegPassword)}
              className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 font-medium"
            >
              {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showRegPassword ? 'Ocultar contraseñas' : 'Ver contraseñas'}</span>
            </button>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="accept-terms-checkbox"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="accept-terms-checkbox" className="ml-2 text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              Acepto los términos de servicio y autorizo el tratamiento de datos personales conforme a la Ley 1581 para fines educativos.
            </label>
          </div>

          {/* Submit register */}
          <button
            id="btn-submit-register"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'es' ? 'Crear mi Cuenta' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Switch to Login link */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'es' ? '¿Ya tiene una cuenta creada?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                {language === 'es' ? 'Iniciar sesión aquí' : 'Log in here'}
              </button>
            </p>
          </div>

        </form>
      )}

    </div>
  );
};
