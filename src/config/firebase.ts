import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  sendPasswordResetEmail,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  type Firestore
} from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
}

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: Partial<FirebaseWebConfig>;
  }
}

function cleanValue(val: unknown): string {
  if (typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (
    !trimmed ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.startsWith('YOUR_') ||
    trimmed.startsWith('TODO')
  ) {
    return '';
  }
  return trimmed;
}

function resolveFirebaseConfig(): FirebaseWebConfig {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  const runtime = typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ ? window.__FIREBASE_CONFIG__ : {};
  const bundled = (appletConfig || {}) as Partial<FirebaseWebConfig>;

  const apiKey =
    cleanValue(env.VITE_FIREBASE_API_KEY) ||
    cleanValue(runtime.apiKey) ||
    cleanValue(bundled.apiKey);

  const authDomain =
    cleanValue(env.VITE_FIREBASE_AUTH_DOMAIN) ||
    cleanValue(runtime.authDomain) ||
    cleanValue(bundled.authDomain);

  const projectId =
    cleanValue(env.VITE_FIREBASE_PROJECT_ID) ||
    cleanValue(runtime.projectId) ||
    cleanValue(bundled.projectId);

  const storageBucket =
    cleanValue(env.VITE_FIREBASE_STORAGE_BUCKET) ||
    cleanValue(runtime.storageBucket) ||
    cleanValue(bundled.storageBucket);

  const messagingSenderId =
    cleanValue(env.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    cleanValue(runtime.messagingSenderId) ||
    cleanValue(bundled.messagingSenderId);

  const appId =
    cleanValue(env.VITE_FIREBASE_APP_ID) ||
    cleanValue(runtime.appId) ||
    cleanValue(bundled.appId);

  const measurementId =
    cleanValue(env.VITE_FIREBASE_MEASUREMENT_ID) ||
    cleanValue(runtime.measurementId) ||
    cleanValue(bundled.measurementId);

  const firestoreDatabaseId =
    cleanValue(env.VITE_FIREBASE_FIRESTORE_DATABASE_ID) ||
    cleanValue(runtime.firestoreDatabaseId) ||
    cleanValue(bundled.firestoreDatabaseId);

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    firestoreDatabaseId
  };
}

export const firebaseConfig: FirebaseWebConfig = resolveFirebaseConfig();

export function isFirebaseConfigured(): boolean {
  const cfg = resolveFirebaseConfig();
  return Boolean(
    cfg.apiKey &&
    cfg.apiKey.startsWith('AIza') &&
    cfg.authDomain &&
    cfg.projectId
  );
}

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!firebaseAppInstance) {
    const cfg = resolveFirebaseConfig();
    firebaseAppInstance = getApps().length > 0 ? getApp() : initializeApp(cfg);
  }
  return firebaseAppInstance;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!firebaseAuthInstance) {
    firebaseAuthInstance = getAuth(app);
    firebaseAuthInstance.languageCode = 'es';
  }
  return firebaseAuthInstance;
}

export function getFirebaseFirestore(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!firestoreInstance) {
    const cfg = resolveFirebaseConfig();
    firestoreInstance = cfg.firestoreDatabaseId
      ? getFirestore(app, cfg.firestoreDatabaseId)
      : getFirestore(app);
  }
  return firestoreInstance;
}

export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
export const db = getFirebaseFirestore();

// ============================================================================
// DATOS OFICIALES DE LAS TABLAS INSTITUCIONALES (PDFs: ACUDIENTE2, Administrativo, Estudiantes2)
// ============================================================================

export const INSTITUTIONAL_ACUDIENTES = [
  {
    id: '1017287888',
    nombre: 'Nicole Valentina Pereira',
    fullName: 'Nicole Valentina Pereira',
    tipoDocumento: 'C.C',
    documentType: 'CC',
    numeroDocumento: '1017287888',
    documentNumber: '1017287888',
    correo: 'nicole.roa7729@gmail.com',
    email: 'nicole.roa7729@gmail.com',
    numeroFicha: 1,
    fichaNumber: '1',
    codigoVerificacion: '101',
    verificationCode: '101',
    role: 'guardian' as const
  },
  {
    id: '1064191482',
    nombre: 'Luz Adriana Toscano',
    fullName: 'Luz Adriana Toscano',
    tipoDocumento: 'C.C',
    documentType: 'CC',
    numeroDocumento: '1064191482',
    documentNumber: '1064191482',
    correo: 'luztoscano051@gmail.com',
    email: 'luztoscano051@gmail.com',
    numeroFicha: 2,
    fichaNumber: '2',
    codigoVerificacion: '102',
    verificationCode: '102',
    role: 'guardian' as const
  }
];

export const INSTITUTIONAL_ADMINISTRATIVOS = [
  {
    id: '1033184935',
    nombre: 'Alexander Miranda',
    fullName: 'Alexander Miranda',
    tipoDocumento: 'C.C',
    documentType: 'CC',
    numeroDocumento: '1033184935',
    documentNumber: '1033184935',
    correo: 'alexandermiranda270608@gmail.com',
    email: 'alexandermiranda270608@gmail.com',
    codigoVerificacion: '12',
    verificationCode: '12',
    role: 'admin' as const
  },
  {
    id: '1013346890',
    nombre: 'Juan Jose Torres',
    fullName: 'Juan Jose Torres',
    tipoDocumento: 'C.C',
    documentType: 'CC',
    numeroDocumento: '1013346890',
    documentNumber: '1013346890',
    correo: 'digitaledumed@gmail.com',
    email: 'digitaledumed@gmail.com',
    codigoVerificacion: '13',
    verificationCode: '13',
    role: 'admin' as const
  }
];

export const INSTITUTIONAL_ESTUDIANTES = [
  {
    id: '1038809029',
    nombre: 'Sara Molina Jimenez',
    fullName: 'Sara Molina Jimenez',
    firstName: 'Sara',
    lastName: 'Molina Jimenez',
    tipoDocumento: 'T.I',
    documentType: 'TI',
    numeroDocumento: '1038809029',
    documentNumber: '1038809029',
    correo: 'molina12sara@gmail.com',
    email: 'molina12sara@gmail.com',
    numeroFicha: 1,
    fichaNumber: '1',
    role: 'student' as const
  },
  {
    id: '1025662108',
    nombre: 'Yeleidy Davila Moreno',
    fullName: 'Yeleidy Davila Moreno',
    firstName: 'Yeleidy',
    lastName: 'Davila Moreno',
    tipoDocumento: 'T.I',
    documentType: 'TI',
    numeroDocumento: '1025662108',
    documentNumber: '1025662108',
    correo: 'yeleidy.davila22@gmail.com',
    email: 'yeleidy.davila22@gmail.com',
    numeroFicha: 2,
    fichaNumber: '2',
    role: 'student' as const
  }
];

let hasSeededSession = false;

/**
 * Sincroniza las tablas institucionales (acudientes, administrativos, estudiantes)
 * con la base de datos Firestore de Firebase.
 */
export async function syncInstitutionalTablesToFirestore(): Promise<void> {
  if (hasSeededSession) return;
  const firestore = getFirebaseFirestore();
  if (!firestore) return;
  hasSeededSession = true;

  const now = new Date().toISOString();
  try {
    for (const item of INSTITUTIONAL_ACUDIENTES) {
      const payload = { ...item, updatedAt: now };
      await setDoc(doc(firestore, 'acudientes', item.id), payload, { merge: true });
      await setDoc(doc(firestore, 'guardians', item.id), payload, { merge: true });
    }
    for (const item of INSTITUTIONAL_ADMINISTRATIVOS) {
      const payload = { ...item, updatedAt: now };
      await setDoc(doc(firestore, 'administrativos', item.id), payload, { merge: true });
      await setDoc(doc(firestore, 'admins', item.id), payload, { merge: true });
    }
    for (const item of INSTITUTIONAL_ESTUDIANTES) {
      const payload = { ...item, updatedAt: now };
      await setDoc(doc(firestore, 'estudiantes', item.id), payload, { merge: true });
      await setDoc(doc(firestore, 'students', item.id), payload, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore institutional sync notice:', err);
  }
}

export async function fetchInstitutionalTablesFromFirestore() {
  const firestore = getFirebaseFirestore();
  if (!firestore) {
    return {
      acudientes: INSTITUTIONAL_ACUDIENTES,
      administrativos: INSTITUTIONAL_ADMINISTRATIVOS,
      estudiantes: INSTITUTIONAL_ESTUDIANTES
    };
  }
  try {
    const [acudSnap, adminSnap, estSnap] = await Promise.all([
      getDocs(collection(firestore, 'acudientes')),
      getDocs(collection(firestore, 'administrativos')),
      getDocs(collection(firestore, 'estudiantes'))
    ]);

    const acudientes = acudSnap.empty
      ? INSTITUTIONAL_ACUDIENTES
      : acudSnap.docs.map(d => d.data() as (typeof INSTITUTIONAL_ACUDIENTES)[number]);
    const administrativos = adminSnap.empty
      ? INSTITUTIONAL_ADMINISTRATIVOS
      : adminSnap.docs.map(d => d.data() as (typeof INSTITUTIONAL_ADMINISTRATIVOS)[number]);
    const estudiantes = estSnap.empty
      ? INSTITUTIONAL_ESTUDIANTES
      : estSnap.docs.map(d => d.data() as (typeof INSTITUTIONAL_ESTUDIANTES)[number]);

    return { acudientes, administrativos, estudiantes };
  } catch {
    return {
      acudientes: INSTITUTIONAL_ACUDIENTES,
      administrativos: INSTITUTIONAL_ADMINISTRATIVOS,
      estudiantes: INSTITUTIONAL_ESTUDIANTES
    };
  }
}

export async function saveRegisteredUserToFirestore(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  documentNumber?: string;
  phone?: string;
  fichaNumber?: string;
  verificationCode?: string;
}): Promise<void> {
  const firestore = getFirebaseFirestore();
  if (!firestore) return;
  try {
    const docId = user.documentNumber ? user.documentNumber.replace(/\D/g, '') || user.id : user.id;
    await setDoc(
      doc(firestore, 'users', docId),
      {
        ...user,
        createdAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore user save notice:', err);
  }
}

export async function sendFirebasePasswordReset(
  email: string,
  language: 'es' | 'en' = 'es'
): Promise<{ success: boolean; message: string; errorCode?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      message:
        language === 'es'
          ? 'Por favor ingrese una dirección de correo electrónico válida.'
          : 'Please enter a valid email address.'
    };
  }

  const authInstance = getFirebaseAuth();
  if (!authInstance || !isFirebaseConfigured()) {
    return {
      success: false,
      errorCode: 'auth/not-configured',
      message:
        language === 'es'
          ? 'Firebase Authentication no está configurado todavía. Por favor configure las variables de entorno VITE_FIREBASE_* en el archivo .env con las credenciales de Firebase Console para enviar correos reales.'
          : 'Firebase Authentication is not configured yet. Please configure the VITE_FIREBASE_* environment variables with your Firebase Console credentials to send real emails.'
    };
  }

  authInstance.languageCode = language === 'es' ? 'es' : 'en';

  try {
    await sendPasswordResetEmail(authInstance, cleanEmail, {
      url: typeof window !== 'undefined' ? window.location.origin : undefined,
      handleCodeInApp: false
    });

    return {
      success: true,
      message:
        language === 'es'
          ? `Hemos enviado el enlace oficial de restablecimiento de contraseña a ${cleanEmail} mediante Firebase Authentication. Revisa tu bandeja de entrada y la carpeta de spam o correo no deseado.`
          : `We have sent the official password reset link to ${cleanEmail} via Firebase Authentication. Please check your inbox and spam folder.`
    };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string; message?: string };
    const code = firebaseError?.code || 'auth/unknown';

    if (code === 'auth/invalid-email') {
      return {
        success: false,
        errorCode: code,
        message:
          language === 'es'
            ? 'El formato del correo electrónico no es válido.'
            : 'The email address format is invalid.'
      };
    }

    if (code === 'auth/user-not-found') {
      return {
        success: false,
        errorCode: code,
        message:
          language === 'es'
            ? 'No existe ninguna cuenta registrada en Firebase Authentication con este correo electrónico.'
            : 'No account found in Firebase Authentication with this email address.'
      };
    }

    if (code === 'auth/too-many-requests') {
      return {
        success: false,
        errorCode: code,
        message:
          language === 'es'
            ? 'Se han realizado demasiadas solicitudes recientes para este correo. Por seguridad, espera unos minutos antes de volver a intentarlo.'
            : 'Too many recent requests for this email. Please wait a few minutes before trying again.'
      };
    }

    if (code === 'auth/network-request-failed') {
      return {
        success: false,
        errorCode: code,
        message:
          language === 'es'
            ? 'Error de conexión de red al comunicarse con Firebase Authentication. Verifica tu conexión a internet.'
            : 'Network error while communicating with Firebase Authentication. Check your internet connection.'
      };
    }

    return {
      success: false,
      errorCode: code,
      message:
        language === 'es'
          ? `No fue posible enviar el correo de recuperación (${code}). Verifica que el correo esté registrado en Firebase Authentication.`
          : `Could not send recovery email (${code}). Verify that the email is registered in Firebase Authentication.`
    };
  }
}

export async function verifyFirebaseOobCode(
  oobCode: string,
  language: 'es' | 'en' = 'es'
): Promise<{ success: boolean; email?: string; message: string }> {
  const authInstance = getFirebaseAuth();
  if (!authInstance || !isFirebaseConfigured()) {
    return {
      success: false,
      message:
        language === 'es'
          ? 'Firebase Authentication no está configurado.'
          : 'Firebase Authentication is not configured.'
    };
  }

  try {
    const email = await firebaseVerifyPasswordResetCode(authInstance, oobCode.trim());
    return {
      success: true,
      email,
      message:
        language === 'es'
          ? 'Enlace de recuperación de Firebase verificado correctamente.'
          : 'Firebase recovery link verified successfully.'
    };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string };
    const code = firebaseError?.code || 'auth/invalid-action-code';
    return {
      success: false,
      message:
        language === 'es'
          ? `El enlace de recuperación es inválido o ya ha expirado (${code}). Solicita un nuevo enlace.`
          : `The recovery link is invalid or has expired (${code}). Please request a new link.`
    };
  }
}

export async function confirmFirebaseNewPassword(
  oobCode: string,
  newPassword: string,
  language: 'es' | 'en' = 'es'
): Promise<{ success: boolean; message: string }> {
  const authInstance = getFirebaseAuth();
  if (!authInstance || !isFirebaseConfigured()) {
    return {
      success: false,
      message:
        language === 'es'
          ? 'Firebase Authentication no está configurado.'
          : 'Firebase Authentication is not configured.'
    };
  }

  try {
    await firebaseConfirmPasswordReset(authInstance, oobCode.trim(), newPassword);
    return {
      success: true,
      message:
        language === 'es'
          ? '¡Tu contraseña ha sido actualizada exitosamente en Firebase Authentication! Ya puedes iniciar sesión.'
          : 'Your password has been successfully updated in Firebase Authentication! You can now sign in.'
    };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string };
    const code = firebaseError?.code || 'auth/unknown';
    if (code === 'auth/weak-password') {
      return {
        success: false,
        message:
          language === 'es'
            ? 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.'
            : 'The password is too weak. It must be at least 6 characters.'
      };
    }
    return {
      success: false,
      message:
        language === 'es'
          ? `No se pudo restablecer la contraseña (${code}). El enlace puede haber expirado.`
          : `Could not reset password (${code}). The link may have expired.`
    };
  }
}

export async function registerUserInFirebaseAuth(email: string, password: string): Promise<void> {
  const authInstance = getFirebaseAuth();
  if (!authInstance || !isFirebaseConfigured()) return;
  const cleanEmail = email.trim().toLowerCase();
  const firebasePassword = password.length >= 6 ? password : `${password}#Edu26`;
  try {
    await createUserWithEmailAndPassword(authInstance, cleanEmail, firebasePassword);
  } catch {
    // Si el usuario ya existe en Firebase Auth, no interrumpir el flujo
  }
}

export async function signInWithFirebaseAuth(
  email: string,
  password: string
): Promise<{ success: boolean; uid?: string; errorCode?: string }> {
  const authInstance = getFirebaseAuth();
  if (!authInstance || !isFirebaseConfigured()) {
    return { success: false, errorCode: 'auth/not-configured' };
  }
  try {
    const cred = await signInWithEmailAndPassword(authInstance, email.trim().toLowerCase(), password);
    return { success: true, uid: cred.user.uid };
  } catch (err: unknown) {
    const firebaseError = err as { code?: string };
    return { success: false, errorCode: firebaseError?.code || 'auth/unknown' };
  }
}
