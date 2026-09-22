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
  Edit3
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface AuthCardProps {
  onSuccess?: () => void;
}

const FieldError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 animate-in fade-in duration-150 text-left">
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
      <span>{message}</span>
    </p>
  );
};

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
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
    requestPasswordResetCode,
    verifyPasswordResetCode,
    resetPasswordWithCode,
    setIsProfileModalOpen
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginRole, setLoginRole] = useState<'guardian' | 'student' | 'admin'>('guardian');
  
  // Register form type selector: standard (families/students) vs staff (teachers/administrators)
  const [regFormType, setRegFormType] = useState<'standard' | 'staff'>('standard');

  // Register form state (Standard: Acudiente / Estudiante)
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

  // Dedicated Staff Register form state (Docente / Personal Administrativo)
  const [staffName, setStaffName] = useState('');
  const [staffRoleType, setStaffRoleType] = useState<'docente' | 'administrativo'>('docente');
  const [staffDocType, setStaffDocType] = useState('CC');
  const [staffDocNumber, setStaffDocNumber] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffSubject, setStaffSubject] = useState('Matemáticas');
  const [staffPosition, setStaffPosition] = useState('Coordinador');
  const [staffDepartment, setStaffDepartment] = useState('Básica Secundaria y Media');
  const [staffInstitutionCode, setStaffInstitutionCode] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffConfirmPassword, setStaffConfirmPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffAcceptTerms, setStaffAcceptTerms] = useState(true);

  // Recovery form state
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify' | 'new-password'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPhoneMasked, setRecoveryPhoneMasked] = useState('');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [simulatedSmsBanner, setSimulatedSmsBanner] = useState<{ code: string; phone: string; name: string } | null>(null);

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
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const [staffFieldErrors, setStaffFieldErrors] = useState<{
    name?: string;
    docNumber?: string;
    email?: string;
    phone?: string;
    code?: string;
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

  const clearAllErrors = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoginFieldErrors({});
    setRegFieldErrors({});
    setStaffFieldErrors({});
    setRecoveryFieldErrors({});
  };

  // Check in real-time if the email being registered already exists in the platform
  const isRegEmailTaken = regEmail.trim().length > 3 && regEmail.includes('@') && isEmailRegistered(regEmail.trim().toLowerCase());
  const isStaffEmailTaken = staffEmail.trim().length > 3 && staffEmail.includes('@') && isEmailRegistered(staffEmail.trim().toLowerCase());

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
      const res = login(loginIdentifier, loginPassword, loginRole);
      setIsLoading(false);
      if (!res.success) {
        if (res.notFound) {
          setLoginFieldErrors({
            identifier: language === 'es' ? 'La cuenta no está registrada con este correo o documento.' : 'The account is not registered'
          });
        } else if (res.suggestedRole) {
          setLoginFieldErrors({
            role: res.message || (language === 'es' ? 'Esta cuenta no corresponde al portal seleccionado.' : 'This account belongs to another portal.')
          });
          setErrorMsg(res.message || null);
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
        ? 'Por favor ingrese su número de celular. Es requerido para recuperar la cuenta por SMS.' 
        : 'Please enter your mobile phone number.';
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
        documentNumber: `${regDocType} ${regDocNumber}`,
        phone: regPhone
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

  const handleStaffRegister = (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();
    const newErrors: {
      name?: string;
      docNumber?: string;
      email?: string;
      phone?: string;
      code?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!staffName.trim()) {
      newErrors.name = language === 'es' ? 'Ingrese sus nombres y apellidos completos.' : 'Please enter your full name.';
    }

    const docDigits = staffDocNumber.replace(/\D/g, '');
    if (!staffDocNumber.trim()) {
      newErrors.docNumber = language === 'es' ? 'Ingrese su número de documento de identidad.' : 'Please enter your document number.';
    } else if (docDigits.length < 4) {
      newErrors.docNumber = language === 'es' ? 'El documento debe contener al menos 4 números.' : 'Document must have at least 4 numbers.';
    }

    const cleanStaffEmail = staffEmail.trim().toLowerCase();
    if (!cleanStaffEmail || !cleanStaffEmail.includes('@')) {
      newErrors.email = language === 'es' ? 'Ingrese una dirección de correo institucional válida.' : 'Please enter a valid institutional email address.';
    } else if (isEmailRegistered(cleanStaffEmail)) {
      newErrors.email = language === 'es' 
        ? 'Este correo electrónico ya se encuentra registrado en el sistema. No está permitido registrarse con un correo que ya se haya utilizado.' 
        : 'This email is already registered in the system. Registration with a previously used email is not permitted.';
    }

    if (!staffPhone.trim()) {
      newErrors.phone = language === 'es' ? 'Ingrese su número de celular para notificaciones y seguridad.' : 'Please enter your mobile phone number.';
    }

    // Código de habilitación institucional: 4 dígitos numéricos que deben ser los 4 primeros números de su documento
    const expectedCode = docDigits.slice(0, 4);
    const cleanCode = staffInstitutionCode.trim().replace(/\D/g, '');

    if (!cleanCode) {
      newErrors.code = language === 'es' 
        ? 'Ingrese el código de habilitación de 4 dígitos (los 4 primeros números de su documento).' 
        : 'Please enter the 4-digit authorization code (first 4 numbers of your document).';
    } else if (cleanCode.length !== 4) {
      newErrors.code = language === 'es' 
        ? 'El código de habilitación debe tener exactamente 4 dígitos.' 
        : 'The authorization code must have exactly 4 digits.';
    } else if (docDigits.length < 4) {
      newErrors.code = language === 'es' 
        ? 'Ingrese primero un documento con al menos 4 números para validar el código.' 
        : 'Enter a valid document with at least 4 numbers first.';
    } else if (cleanCode !== expectedCode) {
      newErrors.code = language === 'es' 
        ? `El código no coincide con su documento. Deben ser los 4 primeros números de su documento (${expectedCode}).` 
        : `The code does not match your document. It must be the first 4 numbers of your document (${expectedCode}).`;
    }

    if (!staffPassword || staffPassword.length < 5) {
      newErrors.password = language === 'es' ? 'La contraseña debe tener al menos 5 caracteres.' : 'Password must have at least 5 characters.';
    }

    if (staffPassword !== staffConfirmPassword) {
      newErrors.confirmPassword = language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.';
    }

    if (!staffAcceptTerms) {
      newErrors.terms = language === 'es' ? 'Debe aceptar los términos de custodia de información y normatividad docente.' : 'You must accept the terms.';
    }

    if (Object.keys(newErrors).length > 0) {
      setStaffFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const fullPosition = staffRoleType === 'docente' 
        ? `Docente de ${staffSubject}` 
        : staffPosition;

      const res = register({
        name: staffName,
        email: cleanStaffEmail,
        password: staffPassword,
        role: 'admin',
        documentNumber: `${staffDocType} ${staffDocNumber}`,
        phone: staffPhone,
        position: fullPosition,
        department: staffDepartment,
        institutionCode: cleanCode
      });
      setIsLoading(false);

      if (!res.success) {
        if (res.message && res.message.toLowerCase().includes('correo')) {
          setStaffFieldErrors({ email: res.message });
        } else if (res.message && res.message.toLowerCase().includes('código')) {
          setStaffFieldErrors({ code: res.message });
        } else {
          setErrorMsg(res.message || (language === 'es' ? 'Error al registrar funcionario institucional.' : 'Registration failed.'));
        }
      } else {
        setSuccessMsg(language === 'es' ? '¡Cuenta docente/administrativa vinculada con éxito! Bienvenido al portal directivo.' : 'Institutional account created successfully!');
        if (onSuccess) onSuccess();
      }
    }, 450);
  };

  const handleRequestRecoveryCode = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    clearAllErrors();

    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      setRecoveryFieldErrors({ email: language === 'es' ? 'Ingrese un correo electrónico válido.' : 'Enter a valid email address.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = requestPasswordResetCode(recoveryEmail);
      if (!res.success) {
        setRecoveryFieldErrors({ email: res.message || (language === 'es' ? 'No fue posible enviar el código.' : 'Could not send code.') });
      } else {
        setRecoveryPhoneMasked(res.maskedPhone || '+57 300 *** **89');
        setSimulatedSmsBanner({
          code: res.code || '123456',
          phone: res.maskedPhone || '+57 300 *** **89',
          name: res.name || 'Usuario'
        });
        setRecoveryStep('verify');
        setSuccessMsg(res.message || (language === 'es' 
          ? `¡Código enviado al celular ${res.maskedPhone}!`
          : `Code sent to phone ${res.maskedPhone}!`));
      }
    }, 450);
  };

  const handleVerifyRecoveryCode = (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    if (!recoveryCodeInput.trim()) {
      setRecoveryFieldErrors({ code: language === 'es' ? 'Por favor ingrese el código recibido.' : 'Please enter the code received.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = verifyPasswordResetCode(recoveryEmail, recoveryCodeInput);
      if (!res.success) {
        setRecoveryFieldErrors({ code: res.message || (language === 'es' ? 'Código de seguridad incorrecto.' : 'Invalid code.') });
      } else {
        setRecoveryStep('new-password');
        setSuccessMsg(language === 'es' 
          ? 'Código verificado con éxito. Ingresa tu nueva contraseña.' 
          : 'Code verified successfully. Enter your new password.');
      }
    }, 400);
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsLoading(false);
      const res = resetPasswordWithCode(recoveryEmail, recoveryCodeInput, recoveryNewPassword);
      if (!res.success) {
        setErrorMsg(res.message || (language === 'es' ? 'Error al actualizar contraseña.' : 'Error resetting password.'));
      } else {
        setSuccessMsg(language === 'es' 
          ? '¡Tu contraseña ha sido restablecida exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.' 
          : 'Password reset successfully! You can now log in with your new password.');
        setMode('login');
        setLoginIdentifier(recoveryEmail);
        setLoginPassword(recoveryNewPassword);
        setRecoveryStep('request');
        setRecoveryCodeInput('');
        setRecoveryNewPassword('');
        setRecoveryConfirmPassword('');
        setSimulatedSmsBanner(null);
      }
    }, 450);
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
            <UserAvatar name={currentUser.name} size="md" />
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
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title={language === 'es' ? 'Editar mi información de perfil' : 'Edit profile info'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'es' ? 'Editar Perfil' : 'Edit Profile'}</span>
          </button>
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

        {/* EduMed Digital directly below the logo with smaller font */}
        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase mt-1">
          EduMed Digital
        </span>
        <span className="text-[11px] sm:text-xs font-medium text-teal-700 dark:text-teal-400 mt-0.5">
          I.E. Félix Henao Botero
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
          Medellín • Secretaría de Educación • DANE 105001002345
        </span>
      </div>

      {/* Tab Switcher: Iniciar Sesión vs Crear Cuenta */}
      <div className="mt-5 grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
        <button
          id="tab-btn-login"
          type="button"
          onClick={() => { setMode('login'); clearAllErrors(); }}
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
          onClick={() => { setMode('register'); clearAllErrors(); }}
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
        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: INICIAR SESIÓN */}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          
          {/* Caja desplegable: Tipo de Portal / Rol de acceso */}
          <div className="text-left space-y-1">
            <label htmlFor="login-role-dropdown" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'es' ? 'Portal al que desea ingresar:' : 'Portal to enter:'}
            </label>
            <select
              id="login-role-dropdown"
              value={loginRole}
              onChange={(e) => {
                const role = e.target.value as 'guardian' | 'student' | 'admin';
                setLoginRole(role);
                if (loginFieldErrors.role) setLoginFieldErrors(prev => ({ ...prev, role: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                loginFieldErrors.role
                  ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 focus:ring-teal-500'
              }`}
            >
              <option value="guardian">{language === 'es' ? 'Portal Acudiente (Padres y Tutores)' : 'Guardian Portal (Parents & Tutors)'}</option>
              <option value="admin">{language === 'es' ? 'Portal Profesor / Docente (Cuerpo Académico)' : 'Teacher / Professor Portal'}</option>
              <option value="student">{language === 'es' ? 'Portal Estudiante (Alumnos y Aspirantes)' : 'Student Portal'}</option>
            </select>
            <FieldError message={loginFieldErrors.role} />
          </div>

          {/* Campo Correo Electrónico (Personal o Institucional) */}
          <div className="text-left space-y-1">
            <label 
              htmlFor="login-identifier-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {language === 'es' ? 'Correo Electrónico (Personal o Institucional):' : 'Email Address (Personal or Institutional):'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
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
                className={`w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  loginFieldErrors.identifier
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-0.5">
              {language === 'es' 
                ? 'Ingrese el correo personal o institucional con el que creó su cuenta.'
                : 'Enter the personal or institutional email used when creating your account.'}
            </p>
            <FieldError message={loginFieldErrors.identifier} />
          </div>

          {/* Campo para rellenar la contraseña */}
          <div className="text-left space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label 
                htmlFor="login-password-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
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
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer"
              >
                {language === 'es' ? '¿Olvidó su contraseña?' : 'Forgot password?'}
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
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (loginFieldErrors.password) setLoginFieldErrors(prev => ({ ...prev, password: undefined }));
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  loginFieldErrors.password
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-teal-500 dark:focus:ring-teal-400 focus:bg-white dark:focus:bg-slate-800'
                }`}
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
            <FieldError message={loginFieldErrors.password} />
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
      ) : mode === 'forgot-password' ? (
        /* TAB 3: RECUPERACIÓN DE CONTRASEÑA POR CÓDIGO SMS AL CELULAR */
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

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Smartphone className="w-3 h-3" />
              <span>{language === 'es' ? 'Recuperación por Celular' : 'SMS Recovery'}</span>
            </span>
          </div>

          {/* STEP 1: SOLICITAR CÓDIGO */}
          {recoveryStep === 'request' && (
            <form onSubmit={handleRequestRecoveryCode} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60">
                <h4 className="text-xs sm:text-sm font-bold text-teal-950 dark:text-teal-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'es' ? 'Recuperar acceso a tu cuenta' : 'Recover account access'}</span>
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {language === 'es'
                    ? 'Ingresa el correo personal o institucional con el que creaste tu cuenta. Enviaremos un código de seguridad de 6 dígitos al número de celular que registraste al crear la cuenta.'
                    : 'Enter the email you registered with. We will send a 6-digit verification code to the phone number configured during account registration.'}
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
                    <Smartphone className="w-4 h-4" />
                    <span>{language === 'es' ? 'Enviar Código al Celular por SMS' : 'Send Code to Mobile Phone'}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFICAR CÓDIGO */}
          {recoveryStep === 'verify' && (
            <form onSubmit={handleVerifyRecoveryCode} className="space-y-4">
              
              {/* Simulated Phone SMS Received Notification Card */}
              {simulatedSmsBanner && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Mensaje SMS Recibido en tu Celular' : 'SMS Message Received on Phone'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                      {simulatedSmsBanner.phone}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      «<strong>EduMed Digital</strong>: Hola <em>{simulatedSmsBanner.name}</em>, tu código de verificación para recuperar tu cuenta es:{' '}
                      <span className="inline-block px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-mono font-black text-base rounded-md border border-emerald-300 dark:border-emerald-700 tracking-wider">
                        {simulatedSmsBanner.code}
                      </span>
                      . Válido por 15 minutos.»
                    </p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {language === 'es' ? 'Simulador de SMS móvil activo' : 'Live mobile SMS simulation'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRecoveryCodeInput(simulatedSmsBanner.code)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Auto-completar código' : 'Auto-fill code'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="recovery-code-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'es' ? 'Código de Seguridad recibido por SMS:' : 'Security Code received via SMS:'}
                </label>
                <input
                  id="recovery-code-input"
                  type="text"
                  maxLength={6}
                  required
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
                disabled={isLoading || recoveryCodeInput.length < 5}
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
                  onClick={() => handleRequestRecoveryCode()}
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Reenviar código por SMS' : 'Resend code via SMS'}</span>
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
          
          {/* Form Type Selector: Standard (Familias/Estudiantes) vs Staff (Docentes/Administrativos) */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200 dark:border-slate-750">
            <button
              type="button"
              id="reg-form-type-standard"
              onClick={() => {
                setRegFormType('standard');
                clearAllErrors();
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                regFormType === 'standard'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-sm border border-slate-200 dark:border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="truncate">{language === 'es' ? 'Familias y Estudiantes' : 'Families & Students'}</span>
            </button>

            <button
              type="button"
              id="reg-form-type-staff"
              onClick={() => {
                setRegFormType('staff');
                clearAllErrors();
              }}
              className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                regFormType === 'staff'
                  ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-200 shadow-sm border border-amber-300 dark:border-amber-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="truncate">{language === 'es' ? 'Docente / Directivo' : 'Teacher / Staff'}</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 uppercase font-black shrink-0">
                {language === 'es' ? 'Oficial' : 'Official'}
              </span>
            </button>
          </div>

          {regFormType === 'standard' ? (
            /* FORMULARIO 1: FAMILIAS Y ESTUDIANTES */
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
                    setRegRole(e.target.value as 'guardian' | 'student');
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
                </select>
                <FieldError message={regFieldErrors.role} />
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
          ) : (
            /* FORMULARIO 2: FORMULARIO DIFERENCIADO PARA DOCENTES Y PERSONAL ADMINISTRATIVO */
            <form onSubmit={handleStaffRegister} className="space-y-3.5 text-left animate-in fade-in duration-200">
              
              {/* Institutional Notice Card */}
              <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">
                    {language === 'es' ? 'Registro Oficial de Funcionarios' : 'Official Staff Registration'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                  {language === 'es'
                    ? 'Formulario exclusivo para docentes de cátedra, coordinadores y personal administrativo de la I.E. Félix Henao Botero.'
                    : 'Exclusive portal for educators, coordinators, and administrative officers.'}
                </p>
              </div>

              {/* Staff Role Type Choice (Docente vs Administrativo) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="staff-type-docente-btn"
                  onClick={() => setStaffRoleType('docente')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    staffRoleType === 'docente'
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-800 dark:text-teal-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'es' ? '👨‍🏫 Docente de Aula' : 'Classroom Teacher'}</span>
                </button>

                <button
                  type="button"
                  id="staff-type-admin-btn"
                  onClick={() => setStaffRoleType('administrativo')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    staffRoleType === 'administrativo'
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-800 dark:text-amber-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'es' ? '🏛️ Administrativo / Directivo' : 'Administrative / Leader'}</span>
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label 
                  htmlFor="staff-name-input"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  {language === 'es' ? 'Nombres y Apellidos Completos del Funcionario' : 'Full Name'} *
                </label>
                <input
                  id="staff-name-input"
                  type="text"
                  required
                  placeholder={language === 'es' ? 'Nombres y apellidos completos' : 'Full name'}
                  value={staffName}
                  onChange={(e) => {
                    setStaffName(e.target.value);
                    if (staffFieldErrors.name) setStaffFieldErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    staffFieldErrors.name
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                  }`}
                />
                <FieldError message={staffFieldErrors.name} />
              </div>

              {/* Document Type & Number */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label 
                    htmlFor="staff-doctype-select"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Tipo
                  </label>
                  <select
                    id="staff-doctype-select"
                    value={staffDocType}
                    onChange={(e) => setStaffDocType(e.target.value)}
                    className="w-full px-2 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="CC">C.C.</option>
                    <option value="CE">C.E.</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label 
                    htmlFor="staff-docnum-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Cédula / Documento Oficial *
                  </label>
                  <input
                    id="staff-docnum-input"
                    type="text"
                    required
                    placeholder={language === 'es' ? 'Número de documento de identidad' : 'Document number'}
                    value={staffDocNumber}
                    onChange={(e) => {
                      setStaffDocNumber(e.target.value);
                      if (staffFieldErrors.docNumber) setStaffFieldErrors(prev => ({ ...prev, docNumber: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      staffFieldErrors.docNumber
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={staffFieldErrors.docNumber} />
                </div>
              </div>

              {/* Conditional Role-Specific Fields */}
              {staffRoleType === 'docente' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label 
                      htmlFor="staff-subject-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      {language === 'es' ? 'Área / Asignatura Principal' : 'Primary Subject'} *
                    </label>
                    <select
                      id="staff-subject-select"
                      value={staffSubject}
                      onChange={(e) => setStaffSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Matemáticas">Matemáticas y Geometría</option>
                      <option value="Ciencias Naturales y Química">Ciencias Naturales / Biología / Química</option>
                      <option value="Lengua Castellana">Lengua Castellana y Humanidades</option>
                      <option value="Ciencias Sociales e Historia">Ciencias Sociales e Historia</option>
                      <option value="Inglés">Inglés / Idioma Extranjero</option>
                      <option value="Tecnología e Informática">Tecnología e Informática</option>
                      <option value="Educación Física">Educación Física y Deportes</option>
                      <option value="Educación Artística">Educación Artística</option>
                      <option value="Filosofía y Ética">Filosofía, Ética y Valores</option>
                      <option value="Básica Primaria Integral">Básica Primaria Integral</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      htmlFor="staff-department-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      {language === 'es' ? 'Nivel Académico' : 'Academic Level'} *
                    </label>
                    <select
                      id="staff-department-select"
                      value={staffDepartment}
                      onChange={(e) => setStaffDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      <option value="Básica Secundaria y Media">Básica Secundaria y Media (Grados 6° a 11°)</option>
                      <option value="Básica Primaria">Básica Primaria (Grados 1° a 5°)</option>
                      <option value="Transición y Preescolar">Transición y Preescolar</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label 
                      htmlFor="staff-position-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      {language === 'es' ? 'Cargo Institucional' : 'Institutional Position'} *
                    </label>
                    <select
                      id="staff-position-select"
                      value={staffPosition}
                      onChange={(e) => setStaffPosition(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Coordinador">{language === 'es' ? 'Coordinador' : 'Coordinator'}</option>
                      <option value="Rector">{language === 'es' ? 'Rector' : 'Rector'}</option>
                      <option value="Secretaria">{language === 'es' ? 'Secretaria' : 'Secretary'}</option>
                    </select>
                  </div>

                  <div>
                    <label 
                      htmlFor="staff-admin-dept-select"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      {language === 'es' ? 'Dependencia / Área' : 'Department'} *
                    </label>
                    <select
                      id="staff-admin-dept-select"
                      value={staffDepartment}
                      onChange={(e) => setStaffDepartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Gestión Directiva">Gestión Directiva</option>
                      <option value="Secretaría y Admisiones">Secretaría y Registro</option>
                      <option value="Convivencia y Bienestar">Convivencia y Bienestar</option>
                      <option value="Sistemas y Tecnología">Sistemas y Tecnología</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Institutional Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label 
                    htmlFor="staff-email-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'es' ? 'Correo Institucional / Laboral *' : 'Institutional / Work Email *'}
                  </label>
                  <input
                    id="staff-email-input"
                    type="email"
                    required
                    placeholder={language === 'es' ? 'Correo institucional o laboral' : 'Institutional email'}
                    value={staffEmail}
                    onChange={(e) => {
                      setStaffEmail(e.target.value);
                      if (staffFieldErrors.email) setStaffFieldErrors(prev => ({ ...prev, email: undefined }));
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      isStaffEmailTaken || staffFieldErrors.email
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={staffFieldErrors.email} />
                  {isStaffEmailTaken && (
                    <div className="mt-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-left animate-in fade-in duration-150 shadow-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-700 dark:text-rose-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span>{language === 'es' ? 'Este correo ya se encuentra registrado' : 'Email already registered'}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
                        {language === 'es' 
                          ? 'No está permitido registrarse con un correo que ya se haya utilizado.' 
                          : 'Registration with an existing email is not permitted.'}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginIdentifier(staffEmail.trim().toLowerCase());
                            setMode('login');
                            clearAllErrors();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                        >
                          {language === 'es' ? 'Iniciar Sesión' : 'Log In'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label 
                    htmlFor="staff-phone-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'es' ? 'Celular de Contacto *' : 'Cell Phone *'}
                  </label>
                  <input
                    id="staff-phone-input"
                    type="tel"
                    required
                    placeholder={language === 'es' ? 'Número de celular de contacto' : 'Cell phone number'}
                    value={staffPhone}
                    onChange={(e) => {
                      setStaffPhone(e.target.value);
                      if (staffFieldErrors.phone) setStaffFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      staffFieldErrors.phone
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={staffFieldErrors.phone} />
                </div>
              </div>

              {/* Institutional Authorization Secret Code */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="staff-code-input"
                    className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{language === 'es' ? 'Código de Habilitación Institucional (4 dígitos) *' : 'Institutional Auth Code (4 digits) *'}</span>
                  </label>
                </div>
                <input
                  id="staff-code-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  placeholder={language === 'es' ? '4 primeros números de su documento' : 'First 4 digits of ID document'}
                  value={staffInstitutionCode}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setStaffInstitutionCode(numeric);
                    if (staffFieldErrors.code) setStaffFieldErrors(prev => ({ ...prev, code: undefined }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-mono tracking-widest text-center bg-white dark:bg-slate-900 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    staffFieldErrors.code
                      ? 'border border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border border-slate-300 dark:border-slate-600 focus:ring-amber-500'
                  }`}
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'es' 
                    ? 'Código de habilitación: 4 dígitos correspondientes a los 4 primeros números de su documento de identidad.' 
                    : '4-digit authorization code matching the first 4 numbers of your identity document.'}
                </p>
                <FieldError message={staffFieldErrors.code} />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label 
                    htmlFor="staff-password-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'es' ? 'Crear Contraseña Institucional *' : 'Create Password *'}
                  </label>
                  <input
                    id="staff-password-input"
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    placeholder={language === 'es' ? 'Contraseña institucional' : 'Password'}
                    value={staffPassword}
                    onChange={(e) => {
                      setStaffPassword(e.target.value);
                      if (staffFieldErrors.password) setStaffFieldErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      staffFieldErrors.password
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={staffFieldErrors.password} />
                </div>

                <div>
                  <label 
                    htmlFor="staff-confirm-password-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    {language === 'es' ? 'Confirmar Contraseña *' : 'Confirm Password *'}
                  </label>
                  <input
                    id="staff-confirm-password-input"
                    type={showStaffPassword ? 'text' : 'password'}
                    required
                    placeholder={language === 'es' ? 'Confirmar contraseña institucional' : 'Confirm password'}
                    value={staffConfirmPassword}
                    onChange={(e) => {
                      setStaffConfirmPassword(e.target.value);
                      if (staffFieldErrors.confirmPassword) setStaffFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      staffFieldErrors.confirmPassword
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-amber-500'
                    }`}
                  />
                  <FieldError message={staffFieldErrors.confirmPassword} />
                </div>
              </div>

              {/* Toggle show password */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowStaffPassword(!showStaffPassword)}
                  className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {showStaffPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showStaffPassword ? 'Ocultar contraseñas' : 'Ver contraseñas'}</span>
                </button>
              </div>

              {/* Official Custody Terms Checkbox */}
              <div className="space-y-1 pt-1">
                <div className="flex items-start">
                  <input
                    id="staff-accept-terms-checkbox"
                    type="checkbox"
                    checked={staffAcceptTerms}
                    onChange={(e) => {
                      setStaffAcceptTerms(e.target.checked);
                      if (staffFieldErrors.terms) setStaffFieldErrors(prev => ({ ...prev, terms: undefined }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="staff-accept-terms-checkbox" className="ml-2 text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    {language === 'es'
                      ? 'Declaro mi vinculación institucional con la I.E. Félix Henao Botero y acepto el deber de confidencialidad y custodia de calificaciones e información académica (Decreto 1290 / Ley 1581).'
                      : 'I declare official affiliation with the institution and accept confidentiality requirements.'}
                  </label>
                </div>
                <FieldError message={staffFieldErrors.terms} />
              </div>

              {/* Submit Staff register button */}
              <button
                id="btn-submit-staff-register"
                type="submit"
                disabled={isLoading || isStaffEmailTaken}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 hover:shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isStaffEmailTaken ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-200" />
                    <span>{language === 'es' ? 'Correo ya Utilizado - Registro no Permitido' : 'Email Already Used - Registration Not Allowed'}</span>
                  </>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    <span>{language === 'es' ? 'Vincular y Crear Cuenta Institucional' : 'Link & Create Staff Account'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}

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
