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
  Globe,
  Smartphone,
  KeyRound,
  ArrowLeft,
  Copy,
  RotateCcw,
  MessageSquare,
  Briefcase,
  Building2,
  BadgeCheck,
  Camera
} from 'lucide-react';
import { getDefaultAvatarByGender } from '../../utils/avatarUtils';

interface AuthCardProps {
  defaultMode?: 'login' | 'register' | 'forgot-password';
  initialRole?: 'guardian' | 'student' | 'admin';
  onSuccess?: () => void;
}

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-150 text-left">
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
      <span>{message}</span>
    </p>
  );
};

export const AuthCard: React.FC<AuthCardProps> = ({ 
  defaultMode = 'login', 
  initialRole,
  onSuccess 
}) => {
  const { 
    language, 
    login, 
    register, 
    isEmailRegistered,
    logout, 
    currentUser, 
    activeRole,
    setActiveRole,
    setActiveTab,
    customLogoUrl,
    validateGuardianCode,
    requestPasswordResetCode,
    verifyPasswordResetCode,
    resetPasswordWithCode
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(defaultMode);

  React.useEffect(() => {
    if (defaultMode) {
      setMode(defaultMode);
    }
  }, [defaultMode]);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Register form state (Standard: Acudiente / Estudiante / Administrativo)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDocType, setRegDocType] = useState('CC');
  const [regDocNumber, setRegDocNumber] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<'guardian' | 'student' | 'admin'>(
    initialRole === 'admin' || initialRole === 'student' ? initialRole : 'guardian'
  );
  const [regAdminPosition, setRegAdminPosition] = useState('Administrador General');
  const [regGender, setRegGender] = useState<'Masculino' | 'Femenino' | 'LGBTIQ+' | 'Prefiero no decirlo'>('Masculino');
  const [guardianValidationCode, setGuardianValidationCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Restringir tipo de documento para rol Acudiente y Administrativo
  React.useEffect(() => {
    if (regRole === 'guardian' && regDocType !== 'CC' && regDocType !== 'CE') {
      setRegDocType('CC');
    } else if (regRole === 'admin' && regDocType !== 'CC' && regDocType !== 'CE' && regDocType !== 'PAS') {
      setRegDocType('CC');
    }
  }, [regRole, regDocType]);

  // Recovery form state
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify' | 'new-password'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status & validation messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Field-specific error messages displayed below each input bar
  const [loginFieldErrors, setLoginFieldErrors] = useState<{
    identifier?: string;
    password?: string;
    role?: string;
  }>({});

  const [regFieldErrors, setRegFieldErrors] = useState<{
    name?: string;
    docNumber?: string;
    email?: string;
    phone?: string;
    guardianCode?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const [recoveryFieldErrors, setRecoveryFieldErrors] = useState<{
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Countdown timer for resend email
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Direct reset link via URL query parameters
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('reset_token');
    const emailParam = params.get('email');

    if (tokenParam && emailParam) {
      setMode('forgot-password');
      setRecoveryEmail(emailParam);
      setRecoveryCodeInput(tokenParam);
      setIsLoading(true);

      verifyPasswordResetCode(emailParam, tokenParam).then((res) => {
        setIsLoading(false);
        if (res.success) {
          setRecoveryStep('new-password');
          setSuccessMsg(language === 'es' 
            ? 'Enlace de verificación validado con éxito. Ingresa tu nueva contraseña.' 
            : 'Verification link validated successfully. Enter your new password.');
        } else {
          setRecoveryStep('request');
          setErrorMsg(res.message || (language === 'es' 
            ? 'El enlace de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.' 
            : 'The recovery link is invalid or expired. Please request a new one.'));
        }
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const clearAllErrors = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoginFieldErrors({});
    setRegFieldErrors({});
    setRecoveryFieldErrors({});
  };

  // Check in real-time if the email being registered already exists in the platform
  const isRegEmailTaken = regEmail.trim().length > 3 && regEmail.includes('@') && isEmailRegistered(regEmail.trim().toLowerCase());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();
    const newErrors: { identifier?: string; password?: string; role?: string } = {};

    if (!loginIdentifier.trim()) {
      newErrors.identifier = language === 'es' ? 'Por favor ingrese su correo electrónico o documento.' : 'Please enter your email or document.';
    }
    if (!loginPassword.trim()) {
      newErrors.password = language === 'es' ? 'Por favor ingrese su contraseña.' : 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setLoginFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(loginIdentifier, loginPassword);
      setIsLoading(false);
      if (!res.success) {
        if (res.notFound) {
          setLoginFieldErrors({
            identifier: language === 'es' ? 'La cuenta no está registrada con este correo o documento.' : 'The account is not registered'
          });
        } else {
          setLoginFieldErrors({
            password: language === 'es' ? 'Contraseña incorrecta. Verifique sus datos o recupere su clave.' : 'Incorrect password. Check your credentials or reset your password.'
          });
        }
      } else {
        setSuccessMsg(res.message || (language === 'es' ? '¡Bienvenido al sistema!' : 'Welcome back!'));
        if (onSuccess) onSuccess();
      }
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();
    const newErrors: {
      name?: string;
      docNumber?: string;
      email?: string;
      phone?: string;
      guardianCode?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!regName.trim()) {
      newErrors.name = language === 'es' ? 'Ingrese sus nombres y apellidos completos.' : 'Please enter your full name.';
    }

    if (!regDocNumber.trim()) {
      newErrors.docNumber = language === 'es' ? 'Ingrese su número de documento de identidad.' : 'Please enter your document number.';
    }

    const cleanRegEmail = regEmail.trim().toLowerCase();
    if (!cleanRegEmail || !cleanRegEmail.includes('@')) {
      newErrors.email = language === 'es' ? 'Ingrese una dirección de correo electrónico válida.' : 'Please enter a valid email address.';
    } else if (isEmailRegistered(cleanRegEmail)) {
      newErrors.email = language === 'es' 
        ? 'Este correo electrónico ya se encuentra registrado en el sistema. No está permitido registrarse con un correo que ya se haya utilizado.' 
        : 'This email is already registered in the system. Registration with a previously used email is not permitted.';
    }

    if (!regPhone.trim()) {
      newErrors.phone = language === 'es' 
        ? 'Por favor ingrese su número de teléfono o celular de contacto.' 
        : 'Please enter your contact phone number.';
    }

    if (regRole === 'guardian') {
      if (!regDocType || (regDocType !== 'CC' && regDocType !== 'CE')) {
        newErrors.docNumber = language === 'es'
          ? 'Para acudientes, el tipo de documento debe ser C.C. (Cédula de Ciudadanía) o C.E. (Cédula de Extranjería).'
          : 'For guardians, document type must be C.C. or C.E.';
      }
      const cleanGCode = guardianValidationCode.trim();
      if (!cleanGCode) {
        newErrors.guardianCode = language === 'es' 
          ? 'Por favor ingrese el código de validación del acudiente.' 
          : 'Please enter the guardian validation code.';
      } else if (!validateGuardianCode(cleanGCode)) {
        newErrors.guardianCode = language === 'es'
          ? 'El código de validación no coincide con los registros de la base de datos institucional. Verifique el código asignado.'
          : 'The validation code does not match institutional database records.';
      }
    } else if (regRole === 'admin') {
      if (!regDocType || (regDocType !== 'CC' && regDocType !== 'CE' && regDocType !== 'PAS')) {
        newErrors.docNumber = language === 'es'
          ? 'Para personal administrativo, el tipo de documento debe ser C.C., C.E. o Pasaporte.'
          : 'For administrative staff, document type must be C.C., C.E., or Passport.';
      }
    }

    if (!regPassword || regPassword.length < 5) {
      newErrors.password = language === 'es' ? 'La contraseña debe tener al menos 5 caracteres.' : 'Password must have at least 5 characters.';
    }

    if (regPassword !== regConfirmPassword) {
      newErrors.confirmPassword = language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.';
    }

    if (!acceptTerms) {
      newErrors.terms = language === 'es' ? 'Debe aceptar la política de tratamiento de datos.' : 'You must accept data policies.';
    }

    if (Object.keys(newErrors).length > 0) {
      setRegFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register({
        name: regName,
        email: cleanRegEmail,
        password: regPassword,
        role: regRole,
        gender: regRole === 'student' ? regGender : undefined,
        documentNumber: `${regDocType} ${regDocNumber}`,
        phone: regPhone,
        position: regRole === 'admin' ? regAdminPosition : undefined,
        department: regRole === 'admin' ? 'Administración y Secretaría Escolar' : undefined,
        institutionCode: regRole === 'admin' ? 'DANE 105001002345' : undefined,
        guardianValidationCode: regRole === 'guardian' ? guardianValidationCode.trim() : undefined
      });
      setIsLoading(false);

      if (!res.success) {
        if (res.message && res.message.toLowerCase().includes('correo')) {
          setRegFieldErrors({ email: res.message });
        } else {
          setErrorMsg(res.message || (language === 'es' ? 'Error al registrar usuario.' : 'Registration failed.'));
        }
      } else {
        setSuccessMsg(language === 'es' ? '¡Cuenta creada con éxito! Bienvenido.' : 'Account created successfully!');
        if (onSuccess) onSuccess();
      }
    }, 450);
  };

  const handleRequestRecoveryCode = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    clearAllErrors();

    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      setRecoveryFieldErrors({ email: language === 'es' ? 'Ingrese un correo electrónico válido.' : 'Enter a valid email address.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetCode(recoveryEmail);
      setIsLoading(false);
      if (!res.success) {
        setRecoveryFieldErrors({ email: res.message || (language === 'es' ? 'No fue posible procesar la solicitud.' : 'Could not process request.') });
      } else {
        setRecoveryStep('verify');
        setResendCooldown(45);
        setSuccessMsg(res.message || (language === 'es' 
          ? 'Hemos enviado un código de verificación y un enlace a tu correo electrónico.' 
          : 'We have sent a verification code and link to your email.'));
      }
    } catch {
      setIsLoading(false);
      setErrorMsg(language === 'es' ? 'Error al enviar el correo de recuperación.' : 'Error sending recovery email.');
    }
  };

  const handleVerifyRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    if (!recoveryCodeInput.trim()) {
      setRecoveryFieldErrors({ code: language === 'es' ? 'Por favor ingrese el código recibido en su correo electrónico.' : 'Please enter the code received in your email.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPasswordResetCode(recoveryEmail, recoveryCodeInput);
      setIsLoading(false);
      if (!res.success) {
        setRecoveryFieldErrors({ code: res.message || (language === 'es' ? 'Código de verificación incorrecto.' : 'Invalid code.') });
      } else {
        setRecoveryStep('new-password');
        setSuccessMsg(language === 'es' 
          ? 'Código verificado con éxito. Ingresa tu nueva contraseña.' 
          : 'Code verified successfully. Enter your new password.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg(language === 'es' ? 'Error al verificar el código.' : 'Error verifying code.');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    if (recoveryNewPassword.length < 5) {
      newErrors.newPassword = language === 'es' ? 'La nueva contraseña debe tener mínimo 5 caracteres.' : 'Password must be at least 5 characters.';
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      newErrors.confirmPassword = language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setRecoveryFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithCode(recoveryEmail, recoveryCodeInput, recoveryNewPassword);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || (language === 'es' ? 'Error al actualizar contraseña.' : 'Error resetting password.'));
      } else {
        setSuccessMsg(res.message || (language === 'es' 
          ? '¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.' 
          : 'Password reset successfully! You can now log in with your new password.'));
        setMode('login');
        setLoginIdentifier(recoveryEmail);
        setLoginPassword(recoveryNewPassword);
        setRecoveryStep('request');
        setRecoveryCodeInput('');
        setRecoveryNewPassword('');
        setRecoveryConfirmPassword('');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg(language === 'es' ? 'Error al actualizar contraseña.' : 'Error resetting password.');
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
                src={currentUser.role === 'student' ? (currentUser.avatarUrl || getDefaultAvatarByGender(currentUser.gender)) : customLogoUrl} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 ring-2 ring-teal-400/30 shadow-md bg-slate-100 dark:bg-slate-800"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = currentUser.role === 'student' ? getDefaultAvatarByGender(currentUser.gender) : '/school_logo.jpg';
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

          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              id="auth-card-btn-go-to-panel"
              onClick={() => {
                const targetRole = currentUser.role || 'guardian';
                setActiveRole(targetRole);
                if (targetRole === 'admin') {
                  setActiveTab('dashboard');
                } else if (targetRole === 'student') {
                  setActiveTab('student-profile');
                } else {
                  setActiveTab('student-profile');
                }
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
        {/* Official Institutional Logo */}
        <div className="relative mb-2">
          <img 
            src={customLogoUrl} 
            alt="EduMed Digital - Institución Educativa Félix Henao Botero" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-4 ring-amber-400/20 shadow-xl bg-white mx-auto transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
            }}
          />
        </div>

        {/* EduMed Digital directly below the logo */}
        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide uppercase mt-1">
          EduMed Digital
        </span>
        <span className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 mt-0.5">
          I.E. Félix Henao Botero
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Medellín • Secretaría de Educación • DANE 105001002345
        </span>
      </div>

      {/* Tab Switcher: Iniciar Sesión vs Crear Cuenta */}
      <div className="mt-5 grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
        <button
          id="tab-btn-login"
          type="button"
          onClick={() => { setMode('login'); clearAllErrors(); }}
          className={`py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'login'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LogIn className="w-4.5 h-4.5" />
          {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
        </button>

        <button
          id="tab-btn-register"
          type="button"
          onClick={() => { setMode('register'); clearAllErrors(); }}
          className={`py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'register'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserPlus className="w-4.5 h-4.5" />
          {language === 'es' ? 'Crear Cuenta' : 'Register'}
        </button>
      </div>

      {/* Notification / Feedback alerts */}
      {errorMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center justify-center gap-2 font-semibold">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center justify-center gap-2 font-semibold">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: INICIAR SESIÓN */}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Campo Correo Electrónico (Personal o Institucional) */}
          <div className="text-left space-y-1.5">
            <label 
              htmlFor="login-identifier-input"
              className="block text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300"
            >
              {language === 'es' ? 'Correo Electrónico (Personal o Institucional):' : 'Email Address (Personal or Institutional):'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="login-identifier-input"
                type="email"
                required
                value={loginIdentifier}
                onChange={(e) => {
                  setLoginIdentifier(e.target.value);
                  if (loginFieldErrors.identifier) setLoginFieldErrors(prev => ({ ...prev, identifier: undefined }));
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  loginFieldErrors.identifier
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800'
                }`}
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pl-0.5">
              {language === 'es' 
                ? 'Ingrese el correo personal o institucional con el que creó su cuenta.'
                : 'Enter the personal or institutional email used when creating your account.'}
            </p>
            <FieldError message={loginFieldErrors.identifier} />
          </div>

          {/* Campo para rellenar la contraseña */}
          <div className="text-left space-y-1.5">
            <div className="flex items-center justify-between mb-1">
              <label 
                htmlFor="login-password-input"
                className="block text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300"
              >
                {language === 'es' ? 'Contraseña:' : 'Password:'}
              </label>
              <button 
                type="button"
                onClick={() => { 
                  setMode('forgot-password');
                  setRecoveryStep('request');
                  clearAllErrors();
                  if (loginIdentifier && loginIdentifier.includes('@')) {
                    setRecoveryEmail(loginIdentifier);
                  }
                }}
                className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
              >
                {language === 'es' ? '¿Olvidó su contraseña?' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="login-password-input"
                type={showLoginPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (loginFieldErrors.password) setLoginFieldErrors(prev => ({ ...prev, password: undefined }));
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`w-full pl-11 pr-11 py-3 text-sm sm:text-base rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  loginFieldErrors.password
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                tabIndex={-1}
              >
                {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <FieldError message={loginFieldErrors.password} />
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me-checkbox"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4.5 h-4.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
            <label htmlFor="remember-me-checkbox" className="ml-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 select-none font-medium">
              {language === 'es' ? 'Recordar mis datos en este equipo' : 'Remember me on this device'}
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-extrabold text-base shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{language === 'es' ? 'Ingresar a la Plataforma' : 'Sign In to Platform'}</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>

          {/* Switch to Register link */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
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
      ) : mode === 'forgot-password' ? (
        /* TAB 3: RECUPERACIÓN DE CONTRASEÑA POR CORREO ELECTRÓNICO */
        <div className="mt-5 space-y-4 text-left">
          
          {/* Header & Back Button */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'es' ? 'Volver a Iniciar Sesión' : 'Back to Log In'}</span>
            </button>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Mail className="w-3 h-3" />
              <span>{language === 'es' ? 'Recuperación por Correo' : 'Email Recovery'}</span>
            </span>
          </div>

          {/* STEP 1: SOLICITAR CÓDIGO POR CORREO */}
          {recoveryStep === 'request' && (
            <form onSubmit={handleRequestRecoveryCode} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
                <h4 className="text-xs sm:text-sm font-bold text-teal-950 dark:text-teal-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'es' ? 'Recuperar acceso a tu cuenta' : 'Recover account access'}</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {language === 'es'
                    ? 'Ingresa el correo electrónico con el que registraste tu cuenta. Te enviaremos un código de seguridad de 6 dígitos y un enlace seguro para restablecer tu contraseña.'
                    : 'Enter the email address you registered with. We will send you a 6-digit verification code and a secure link to reset your password.'}
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="recovery-email-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Correo Electrónico (Personal o Institucional):' : 'Account Email Address:'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="recovery-email-input"
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => {
                      setRecoveryEmail(e.target.value);
                      if (recoveryFieldErrors.email) setRecoveryFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      recoveryFieldErrors.email
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                </div>
                <FieldError message={recoveryFieldErrors.email} />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{language === 'es' ? 'Enviar Código y Enlace de Recuperación' : 'Send Verification Code & Link'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFICAR CÓDIGO RECIBIDO POR CORREO */}
          {recoveryStep === 'verify' && (
            <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
              
              <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/80 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="font-semibold text-teal-950 dark:text-teal-200 mb-0.5">
                      {language === 'es' ? 'Instrucciones enviadas por correo electrónico' : 'Instructions sent via email'}
                    </p>
                    <p>
                      {language === 'es' ? 'Hemos enviado un correo a ' : 'We sent an email to '}
                      <strong className="text-slate-900 dark:text-white font-mono">{recoveryEmail}</strong>.
                      {language === 'es'
                        ? ' Revisa tu bandeja de entrada o spam e ingresa el código de 6 dígitos recibido a continuación (válido por 15 minutos).'
                        : ' Please check your inbox or spam folder and enter the 6-digit code below (valid for 15 minutes).'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="recovery-code-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Código de Verificación (6 dígitos recibido por correo):' : 'Verification Code (6 digits received via email):'}
                </label>
                <input
                  id="recovery-code-input"
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="------"
                  value={recoveryCodeInput}
                  onChange={(e) => {
                    setRecoveryCodeInput(e.target.value.replace(/\D/g, ''));
                    if (recoveryFieldErrors.code) setRecoveryFieldErrors(prev => ({ ...prev, code: undefined }));
                  }}
                  className={`w-full px-4 py-3 text-center text-xl font-mono font-black tracking-widest rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    recoveryFieldErrors.code
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                />
                <FieldError message={recoveryFieldErrors.code} />
              </div>

              <button
                type="submit"
                disabled={isLoading || recoveryCodeInput.length < 6}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'es' ? 'Validar Código y Continuar' : 'Verify Code and Continue'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={() => handleRequestRecoveryCode()}
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium cursor-pointer disabled:opacity-50 disabled:no-underline"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 
                      ? (language === 'es' ? `Reenviar en ${resendCooldown}s` : `Resend in ${resendCooldown}s`)
                      : (language === 'es' ? 'Reenviar código por correo' : 'Resend code via email')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRecoveryStep('request'); setErrorMsg(null); }}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  {language === 'es' ? 'Cambiar correo' : 'Change email'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CREAR NUEVA CONTRASEÑA */}
          {recoveryStep === 'new-password' && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'es' 
                    ? `Código validado para ${recoveryEmail}. Escribe tu nueva contraseña.` 
                    : `Code validated for ${recoveryEmail}. Enter your new password.`}
                </span>
              </div>

              <div className="space-y-1">
                <label htmlFor="new-password-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Nueva Contraseña (mínimo 5 caracteres):' : 'New Password (min 5 characters):'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="new-password-input"
                    type={showRecoveryPassword ? 'text' : 'password'}
                    required
                    value={recoveryNewPassword}
                    onChange={(e) => {
                      setRecoveryNewPassword(e.target.value);
                      if (recoveryFieldErrors.newPassword) setRecoveryFieldErrors(prev => ({ ...prev, newPassword: undefined }));
                    }}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      recoveryFieldErrors.newPassword
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showRecoveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError message={recoveryFieldErrors.newPassword} />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-new-password-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Confirmar Nueva Contraseña:' : 'Confirm New Password:'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-new-password-input"
                    type={showRecoveryPassword ? 'text' : 'password'}
                    required
                    value={recoveryConfirmPassword}
                    onChange={(e) => {
                      setRecoveryConfirmPassword(e.target.value);
                      if (recoveryFieldErrors.confirmPassword) setRecoveryFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      recoveryFieldErrors.confirmPassword
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                </div>
                <FieldError message={recoveryFieldErrors.confirmPassword} />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'es' ? 'Guardar Nueva Contraseña e Iniciar Sesión' : 'Save New Password & Log In'}</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      ) : (
        /* TAB 2: CREAR UNA CUENTA */
        <div className="mt-5 space-y-4">
          
          {/* Institutional Guidance Notice for Teachers, Staff, and Families */}
          <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                {language === "es" ? "Registro de Acudientes, Estudiantes y Administrativos" : "Guardians, Students & Administrative Registration"}
              </span>
              <span className="text-[10px] font-black uppercase text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {language === "es" ? "EduMed Oficial" : "Official"}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === "es"
                ? "Selecciona tu rol en la caja desplegable para crear tu cuenta (Acudiente, Estudiante o Administrativo). Para docentes, el acceso se asigna y habilita formalmente mediante credenciales institucionales otorgadas por Secretaría."
                : "Select your role in the dropdown to create your account (Guardian, Student, or Administrative). Teacher accounts are managed and assigned with institutional credentials."}
            </p>
          </div>
            <form onSubmit={handleRegister} className="space-y-3.5 text-left">
              
              {/* User Type Choice (Caja desplegable) */}
              <div className="space-y-1">
                <label htmlFor="reg-role-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Registrarme como (Caja desplegable)' : 'Register as (Dropdown)'}
                </label>
                <select
                  id="reg-role-select"
                  value={regRole}
                  onChange={(e) => {
                    const selectedRole = e.target.value as 'guardian' | 'student' | 'admin';
                    setRegRole(selectedRole);
                    if ((selectedRole === 'guardian' || selectedRole === 'admin') && regDocType !== 'CC' && regDocType !== 'CE' && regDocType !== 'PAS') {
                      setRegDocType('CC');
                    }
                    if (regFieldErrors.role) setRegFieldErrors(prev => ({ ...prev, role: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 cursor-pointer transition-all ${
                    regFieldErrors.role
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                  }`}
                >
                  <option value="guardian">{language === 'es' ? '👨‍👩‍👦 Acudiente / Padre o Tutor de Familia' : 'Parent / Guardian'}</option>
                  <option value="student">{language === 'es' ? '🎓 Estudiante / Aspirante' : 'Student / Applicant'}</option>
                  <option value="admin">{language === 'es' ? '💼 Personal Administrativo' : 'Administrative Staff'}</option>
                </select>
                <FieldError message={regFieldErrors.role} />
              </div>

              {/* Rol Administrativo: Selección de Cargo o Función */}
              {regRole === 'admin' && (
                <div className="space-y-2 p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 animate-in fade-in duration-200 text-left">
                  <div className="flex items-center justify-between">
                    <label htmlFor="reg-admin-position-select" className="block text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      {language === 'es' ? 'Personal Administrativo:' : 'Administrative Staff:'}
                    </label>
                    <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full border border-teal-300 dark:border-teal-700">
                      {language === 'es' ? 'Administrador General' : 'General Administrator'}
                    </span>
                  </div>
                  <select
                    id="reg-admin-position-select"
                    value={regAdminPosition}
                    onChange={(e) => setRegAdminPosition(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
                  >
                    <option value="Administrador General">{language === 'es' ? 'Administrador General' : 'General Administrator'}</option>
                  </select>
                  <p className="text-[10px] text-teal-800 dark:text-teal-300 leading-tight">
                    {language === 'es'
                      ? 'Tu cuenta de Administrador General tendrá acceso completo al panel de gestión institucional, auditoría documental, matrículas y reportes SIMAT.'
                      : 'Your General Administrator account will have full access to management, document auditing, enrollments, and SIMAT reports.'}
                  </p>
                </div>
              )}

              {/* Sexo para Estudiantes */}
              {regRole === 'student' && (
                <div className="space-y-1 p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 animate-in fade-in duration-200">
                  <label htmlFor="reg-gender-select" className="block text-xs font-bold text-teal-900 dark:text-teal-200">
                    {language === 'es' ? 'Sexo:' : 'Sex:'}
                  </label>
                  <select
                    id="reg-gender-select"
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as 'Masculino' | 'Femenino' | 'LGBTIQ+' | 'Prefiero no decirlo')}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
                  >
                    <option value="Masculino">{language === 'es' ? 'Masculino' : 'Male'}</option>
                    <option value="Femenino">{language === 'es' ? 'Femenino' : 'Female'}</option>
                    <option value="LGBTIQ+">LGBTIQ+</option>
                    <option value="Prefiero no decirlo">{language === 'es' ? 'Prefiero no decirlo' : 'Prefer not to say'}</option>
                  </select>
                  <p className="text-[10px] text-teal-700 dark:text-teal-300">
                    {language === 'es' 
                      ? 'Podrás personalizar o cambiar tu foto en cualquier momento desde tu perfil.' 
                      : 'You can customize or change your photo at any time from your profile.'}
                  </p>
                </div>
              )}

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
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (regFieldErrors.name) setRegFieldErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    regFieldErrors.name
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500 dark:focus:ring-teal-400'
                  }`}
                />
                <FieldError message={regFieldErrors.name} />
              </div>

              {/* Document Type & Number */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label 
                    htmlFor="reg-doctype-select"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Tipo *
                  </label>
                  <select
                    id="reg-doctype-select"
                    required
                    value={regDocType}
                    onChange={(e) => setRegDocType(e.target.value)}
                    className="w-full px-2 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {regRole === 'guardian' ? (
                      <>
                        <option value="CC">{language === 'es' ? 'C.C. – Cédula de Ciudadanía' : 'C.C. – Citizenship Card'}</option>
                        <option value="CE">{language === 'es' ? 'C.E. – Cédula de Extranjería' : 'C.E. – Foreigner ID'}</option>
                      </>
                    ) : regRole === 'admin' ? (
                      <>
                        <option value="CC">{language === 'es' ? 'C.C. – Cédula de Ciudadanía' : 'C.C. – Citizenship Card'}</option>
                        <option value="CE">{language === 'es' ? 'C.E. – Cédula de Extranjería' : 'C.E. – Foreigner ID'}</option>
                        <option value="PAS">{language === 'es' ? 'PAS – Pasaporte' : 'PAS – Passport'}</option>
                      </>
                    ) : (
                      <>
                        <option value="CC">C.C.</option>
                        <option value="TI">T.I.</option>
                        <option value="CE">C.E.</option>
                        <option value="RC">Reg. Civil</option>
                      </>
                    )}
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
                    onChange={(e) => {
                      setRegDocNumber(e.target.value);
                      if (regFieldErrors.docNumber) setRegFieldErrors(prev => ({ ...prev, docNumber: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      regFieldErrors.docNumber
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.docNumber} />
                </div>
              </div>

              {/* Código de Validación para Acudientes */}
              {regRole === 'guardian' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="reg-guardian-code-input"
                      className="block text-xs font-bold text-amber-900 dark:text-amber-200"
                    >
                      {language === 'es' ? 'Código de Validación del Acudiente *' : 'Guardian Validation Code *'}
                    </label>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                      {language === 'es' ? 'Requerido' : 'Required'}
                    </span>
                  </div>
                  <input
                    id="reg-guardian-code-input"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    placeholder={language === 'es' ? 'Código de validación institucional' : 'Institutional validation code'}
                    value={guardianValidationCode}
                    onChange={(e) => {
                      setGuardianValidationCode(e.target.value);
                      if (regFieldErrors.guardianCode) setRegFieldErrors(prev => ({ ...prev, guardianCode: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all bg-white dark:bg-slate-900 ${
                      regFieldErrors.guardianCode
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
                        : 'border border-amber-300 dark:border-amber-800 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.guardianCode} />
                  
                  <div className="text-[11px] text-amber-900 dark:text-amber-300 pt-1">
                    <p className="leading-tight">
                      {language === 'es'
                        ? 'Ingresa el código asignado por la institución o tu número de documento registrado en el expediente escolar.'
                        : 'Enter the code assigned by the institution or your registered ID document number.'}
                    </p>
                  </div>
                </div>
              )}

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
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (regFieldErrors.email) setRegFieldErrors(prev => ({ ...prev, email: undefined }));
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      isRegEmailTaken || regFieldErrors.email
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.email} />
                  {isRegEmailTaken && (
                    <div className="mt-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-left animate-in fade-in duration-150 shadow-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span>{language === 'es' ? 'Este correo ya está registrado en la plataforma' : 'This email is already registered'}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                        {language === 'es' 
                          ? 'No es posible registrar de nuevo una cuenta con este correo.' 
                          : 'You cannot register another account with this email address.'}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(regEmail.trim().toLowerCase());
                            setMode('login');
                            clearAllErrors();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                        >
                          {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRecoveryEmail(regEmail.trim().toLowerCase());
                            setMode('forgot-password');
                            setRecoveryStep('request');
                            clearAllErrors();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 font-bold text-[10px] cursor-pointer transition-colors"
                        >
                          {language === 'es' ? 'Recuperar Clave' : 'Reset Password'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="reg-phone-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Número de Celular *
                  </label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(e.target.value);
                      if (regFieldErrors.phone) setRegFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      regFieldErrors.phone
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.phone} />
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
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (regFieldErrors.password) setRegFieldErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      regFieldErrors.password
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.password} />
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
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (regFieldErrors.confirmPassword) setRegFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      regFieldErrors.confirmPassword
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <FieldError message={regFieldErrors.confirmPassword} />
                </div>
              </div>

              {/* Toggle show password */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showRegPassword ? 'Ocultar contraseñas' : 'Ver contraseñas'}</span>
                </button>
              </div>

              {/* Terms checkbox */}
              <div className="space-y-1 pt-1">
                <div className="flex items-start">
                  <input
                    id="accept-terms-checkbox"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (regFieldErrors.terms) setRegFieldErrors(prev => ({ ...prev, terms: undefined }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="accept-terms-checkbox" className="ml-2 text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    Acepto los términos de servicio y autorizo el tratamiento de datos personales conforme a la Ley 1581 para fines educativos.
                  </label>
                </div>
                <FieldError message={regFieldErrors.terms} />
              </div>

              {/* Submit register */}
              <button
                id="btn-submit-register"
                type="submit"
                disabled={isLoading || isRegEmailTaken}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 hover:shadow-teal-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isRegEmailTaken ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-300" />
                    <span>{language === 'es' ? 'Correo ya Utilizado - Registro no Permitido' : 'Email Already Used - Registration Not Allowed'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{language === 'es' ? 'Crear mi Cuenta' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'es' ? '¿Ya tiene una cuenta creada?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); clearAllErrors(); }}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                {language === 'es' ? 'Iniciar sesión aquí' : 'Log in here'}
              </button>
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
