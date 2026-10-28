import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, type Auth } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: FirebaseConfig | null;
  }
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let initializationPromise: Promise<Auth | null> | null = null;

/**
 * Checks whether a given FirebaseConfig is non-empty and has required values.
 */
export function isValidFirebaseConfig(config: Partial<FirebaseConfig> | null | undefined): config is FirebaseConfig {
  if (!config) return false;
  const apiKey = (config.apiKey || '').trim();
  const projectId = (config.projectId || '').trim();
  
  if (!apiKey || !projectId) return false;
  if (apiKey.startsWith('your-') || apiKey.startsWith('TU_') || apiKey.includes('placeholder')) return false;
  if (projectId.startsWith('your-') || projectId.startsWith('tu-') || projectId.includes('placeholder')) return false;
  
  return true;
}

/**
 * Extracts configuration available synchronously at load time:
 * 1. window.__FIREBASE_CONFIG__ (injected by server.ts into index.html at runtime in production)
 * 2. import.meta.env.VITE_FIREBASE_* (statically embedded at vite build time)
 */
function resolveSynchronousConfig(): FirebaseConfig | null {
  // 1. Check window.__FIREBASE_CONFIG__
  if (typeof window !== 'undefined' && isValidFirebaseConfig(window.__FIREBASE_CONFIG__)) {
    return window.__FIREBASE_CONFIG__;
  }

  // 2. Check import.meta.env build-time variables
  const viteConfig: Partial<FirebaseConfig> = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  if (isValidFirebaseConfig(viteConfig)) {
    return viteConfig as FirebaseConfig;
  }

  return null;
}

/**
 * Initialize Firebase synchronously if configuration is already available.
 */
function initSync(): void {
  const config = resolveSynchronousConfig();
  if (config) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
    } catch (err) {
      console.warn('Firebase synchronous initialization warning:', err);
    }
  }
}

// Attempt initial synchronous initialization
initSync();

/**
 * Indicates if Firebase Authentication is configured and active.
 */
export function isFirebaseConfigured(): boolean {
  if (auth) return true;
  const config = resolveSynchronousConfig();
  return isValidFirebaseConfig(config);
}

/**
 * Returns the currently active Firebase Auth instance, or null if not yet configured.
 */
export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    initSync();
  }
  return auth;
}

export { auth, app };

/**
 * Asynchronously ensures Firebase is initialized.
 * If not already initialized, queries /api/config/firebase to load runtime environment configuration
 * from the server (which reads process.env.VITE_FIREBASE_* in production/Cloud Run).
 */
export async function ensureFirebaseInitialized(): Promise<Auth | null> {
  if (auth) return auth;

  initSync();
  if (auth) return auth;

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      const res = await fetch('/api/config/firebase');
      if (res.ok) {
        const data = await res.json();
        if (data.configured && isValidFirebaseConfig(data.config)) {
          if (typeof window !== 'undefined') {
            window.__FIREBASE_CONFIG__ = data.config;
          }
          if (getApps().length === 0) {
            app = initializeApp(data.config);
          } else {
            app = getApps()[0];
          }
          auth = getAuth(app);
          return auth;
        }
      }
    } catch (err) {
      console.warn('Unable to fetch runtime Firebase configuration from /api/config/firebase:', err);
    } finally {
      initializationPromise = null;
    }
    return auth;
  })();

  return initializationPromise;
}

/**
 * Sends a real password reset email using Firebase Authentication sendPasswordResetEmail().
 * Handles detailed Firebase errors without mock codes or simulated accounts.
 */
export async function sendFirebasePasswordResetEmail(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message: 'Por favor ingresa un correo electrónico válido.',
    };
  }

  // Ensure Firebase is initialized, including fetching server-side runtime env vars if necessary
  const activeAuth = await ensureFirebaseInitialized();

  if (!activeAuth || !isFirebaseConfigured()) {
    return {
      success: false,
      message:
        'Firebase Authentication no está configurado todavía. Por favor configure las variables de entorno VITE_FIREBASE_* en el archivo .env con las credenciales de Firebase Console para enviar correos reales.',
    };
  }

  try {
    await sendPasswordResetEmail(activeAuth, cleanEmail);
    return {
      success: true,
      message: `Hemos enviado el correo oficial de recuperación a ${cleanEmail}. Revisa tu bandeja de entrada o carpeta de spam y sigue el enlace seguro para restablecer tu contraseña.`,
    };
  } catch (error: any) {
    console.error('Firebase sendPasswordResetEmail error:', error);
    const code = error?.code || '';
    let message = 'No fue posible enviar el correo de recuperación mediante Firebase.';

    if (code === 'auth/user-not-found') {
      message = `No existe ninguna cuenta registrada con el correo ${cleanEmail} en Firebase Authentication.`;
    } else if (code === 'auth/invalid-email') {
      message = 'La dirección de correo electrónico ingresada no es válida.';
    } else if (code === 'auth/too-many-requests') {
      message = 'Se han realizado demasiadas solicitudes recientes. Por favor espera unos momentos antes de intentar de nuevo.';
    } else if (code === 'auth/network-request-failed') {
      message = 'Error de conexión de red al comunicarse con los servidores de Firebase. Verifica tu conexión a internet.';
    } else if (code === 'auth/unauthorized-domain') {
      message = 'Este dominio no está autorizado en Firebase Console (Authentication > Ajustes > Dominios autorizados). Agrega el dominio de tu aplicación en Firebase Console para permitir el envío de correos.';
    } else if (error?.message) {
      message = `Error de Firebase: ${error.message}`;
    }

    return {
      success: false,
      message,
    };
  }
}
