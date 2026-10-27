import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Checks whether real Firebase credentials are provided in the environment.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    !firebaseConfig.apiKey.includes('TU_API_KEY')
  );
};

// Initialize Firebase app only when valid configuration is present
export const app: FirebaseApp | null = isFirebaseConfigured()
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;

/**
 * Translates Firebase Authentication error codes to clear, friendly user messages.
 */
export const formatFirebaseAuthError = (errorCode: string, lang: 'es' | 'en' = 'es'): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return lang === 'es' ? 'La dirección de correo electrónico no tiene un formato válido.' : 'Invalid email address format.';
    case 'auth/user-disabled':
      return lang === 'es' ? 'Esta cuenta de usuario ha sido inhabilitada por la administración.' : 'This account has been disabled.';
    case 'auth/user-not-found':
      return lang === 'es' ? 'No existe ningún usuario registrado con este correo en Firebase.' : 'No user found with this email in Firebase.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return lang === 'es' ? 'Correo o contraseña incorrectos. Verifica tus credenciales.' : 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return lang === 'es' ? 'Este correo ya se encuentra registrado en Firebase. Por favor inicia sesión o solicita restablecer tu contraseña.' : 'Email is already registered in Firebase.';
    case 'auth/weak-password':
      return lang === 'es' ? 'La contraseña es muy débil. Debe tener al menos 6 caracteres (requisito de Firebase).' : 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return lang === 'es' ? 'Demasiados intentos fallidos. Por favor espera unos minutos antes de intentar de nuevo.' : 'Too many failed requests. Please wait a few minutes.';
    case 'auth/network-request-failed':
      return lang === 'es' ? 'Error de conexión con los servidores de Firebase. Verifica tu acceso a internet.' : 'Network connection error with Firebase.';
    case 'auth/unauthorized-domain':
      return lang === 'es' ? 'El dominio actual no está autorizado en Firebase Console (Authentication > Settings > Authorized domains).' : 'This domain is not authorized in Firebase Console.';
    case 'auth/operation-not-allowed':
      return lang === 'es' ? 'El proveedor de Correo/Contraseña no está habilitado en Firebase Console (Authentication > Sign-in method).' : 'Email/Password provider is not enabled in Firebase Console.';
    default:
      return lang === 'es'
        ? `Error en Firebase Authentication (${errorCode || 'desconocido'}).`
        : `Firebase Authentication error (${errorCode || 'unknown'}).`;
  }
};

