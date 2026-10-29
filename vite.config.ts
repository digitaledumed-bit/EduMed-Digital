import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Check if candidate Firebase config files exist to provide fallback build defines
  let fallbackFb: Record<string, string> = {};

  const tsCredFile = path.resolve(__dirname, 'src', 'config', 'firebaseCredentials.ts');
  if (fs.existsSync(tsCredFile)) {
    try {
      const text = fs.readFileSync(tsCredFile, 'utf-8');
      const getVal = (key: string) => {
        const match = text.match(new RegExp(`${key}:\\s*['"\`]([^'"\`]*)['"\`]`));
        return match ? match[1].trim() : '';
      };
      const apiKey = getVal('apiKey');
      if (apiKey) {
        fallbackFb = {
          VITE_FIREBASE_API_KEY: apiKey,
          VITE_FIREBASE_AUTH_DOMAIN: getVal('authDomain'),
          VITE_FIREBASE_PROJECT_ID: getVal('projectId'),
          VITE_FIREBASE_STORAGE_BUCKET: getVal('storageBucket'),
          VITE_FIREBASE_MESSAGING_SENDER_ID: getVal('messagingSenderId'),
          VITE_FIREBASE_APP_ID: getVal('appId'),
          VITE_FIREBASE_MEASUREMENT_ID: getVal('measurementId'),
        };
      }
    } catch {
      // ignore
    }
  }

  if (!fallbackFb.VITE_FIREBASE_API_KEY) {
    const candidateFiles = [
      path.resolve(__dirname, 'firebase-applet-config.json'),
      path.resolve(__dirname, 'firebase-config.json'),
      path.resolve(__dirname, 'src', 'config', 'firebase-credentials.json'),
      path.resolve(__dirname, 'src', 'config', 'firebaseConfig.json'),
    ];
    for (const f of candidateFiles) {
      if (fs.existsSync(f)) {
        try {
          const raw = JSON.parse(fs.readFileSync(f, 'utf-8'));
          fallbackFb = {
            VITE_FIREBASE_API_KEY: raw.apiKey || raw.VITE_FIREBASE_API_KEY || '',
            VITE_FIREBASE_AUTH_DOMAIN: raw.authDomain || raw.VITE_FIREBASE_AUTH_DOMAIN || '',
            VITE_FIREBASE_PROJECT_ID: raw.projectId || raw.VITE_FIREBASE_PROJECT_ID || '',
            VITE_FIREBASE_STORAGE_BUCKET: raw.storageBucket || raw.VITE_FIREBASE_STORAGE_BUCKET || '',
            VITE_FIREBASE_MESSAGING_SENDER_ID: raw.messagingSenderId || raw.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
            VITE_FIREBASE_APP_ID: raw.appId || raw.VITE_FIREBASE_APP_ID || '',
            VITE_FIREBASE_MEASUREMENT_ID: raw.measurementId || raw.VITE_FIREBASE_MEASUREMENT_ID || '',
          };
          if (fallbackFb.VITE_FIREBASE_API_KEY) break;
        } catch {
          // ignore
        }
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(
        env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || fallbackFb.VITE_FIREBASE_API_KEY || ''
      ),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
        env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackFb.VITE_FIREBASE_AUTH_DOMAIN || ''
      ),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(
        env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || fallbackFb.VITE_FIREBASE_PROJECT_ID || ''
      ),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackFb.VITE_FIREBASE_STORAGE_BUCKET || ''
      ),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(
        env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackFb.VITE_FIREBASE_MESSAGING_SENDER_ID || ''
      ),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(
        env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || fallbackFb.VITE_FIREBASE_APP_ID || ''
      ),
      'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(
        env.VITE_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackFb.VITE_FIREBASE_MEASUREMENT_ID || ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
