/**
 * Configuración oficial de Firebase Authentication de EduMed Digital.
 *
 * Este archivo se encuentra dentro del código fuente (/src) y es compilado
 * directamente por Vite en el paquete de producción (dist/).
 *
 * Al no depender del archivo .env (el cual es ignorado por git y no viaja al
 * entorno de publicación), garantiza que la versión publicada en Google AI Studio
 * y Cloud Run siempre cuente con la configuración de Firebase activa.
 *
 * INSTRUCCIONES:
 * Pega aquí los valores obtenidos en Firebase Console > Configuración del Proyecto >
 * General > Tus apps (o compártelos en el chat para asignarlos).
 */

export interface FirebaseClientCredentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const FIREBASE_CREDENTIALS: FirebaseClientCredentials = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};
