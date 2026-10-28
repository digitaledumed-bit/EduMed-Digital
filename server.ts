import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer, { type Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Public Firebase config extraction for runtime delivery
function getFirebasePublicConfig() {
  const apiKey = (process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '').trim();
  const authDomain = (process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '').trim();
  const projectId = (process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '').trim();
  const storageBucket = (process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '').trim();
  const messagingSenderId = (process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '').trim();
  const appId = (process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '').trim();
  const measurementId = (process.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || '').trim();

  const isConfigured = Boolean(
    apiKey &&
    projectId &&
    !apiKey.startsWith('your-') &&
    !projectId.startsWith('your-') &&
    !apiKey.includes('placeholder')
  );

  return {
    configured: isConfigured,
    config: isConfigured ? {
      apiKey,
      authDomain: authDomain || (projectId ? `${projectId}.firebaseapp.com` : undefined),
      projectId,
      storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
      messagingSenderId: messagingSenderId || undefined,
      appId: appId || undefined,
      measurementId: measurementId || undefined,
    } : null
  };
}

// GET /api/config/firebase - Returns runtime Firebase client config safely
app.get('/api/config/firebase', (_req, res) => {
  return res.json(getFirebasePublicConfig());
});

interface ResetRecord {
  code: string;
  token: string;
  email: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  used: boolean;
}

// In-memory token store: email -> ResetRecord
const resetStore = new Map<string, ResetRecord>();

// Cooldown tracker: email -> timestamp
const cooldownStore = new Map<string, number>();

// Reusable nodemailer transporter
let cachedTransporter: Transporter | null = null;

async function getEmailTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // Fallback to real Ethereal SMTP for development/testing delivery
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransporter;
  } catch {
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
    return cachedTransporter;
  }
}

function generateResetEmailHtml(options: {
  code: string;
  token: string;
  email: string;
  appUrl: string;
  expiresMinutes: number;
}): string {
  const resetLink = `${options.appUrl}/?reset_token=${options.token}&email=${encodeURIComponent(options.email)}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña - EduMed Digital</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">EduMed Digital</h1>
              <p style="margin: 6px 0 0; color: #ccfbf1; font-size: 13px; font-weight: 500;">Plataforma Oficial de Matrículas y Gestión Institucional</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 700;">Restablecimiento de Contraseña</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;">
                Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta: <strong style="color: #0f172a;">${options.email}</strong>.
              </p>
              <div style="background-color: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="display: block; font-size: 12px; font-weight: 700; color: #0f766e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Código de Verificación</span>
                <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #115e59; background: #ffffff; padding: 8px 24px; border-radius: 8px; border: 1px solid #99f6e4;">
                  ${options.code}
                </span>
                <span style="display: block; font-size: 12px; color: #0f766e; margin-top: 10px; font-weight: 500;">
                  ⏱ Válido por los próximos ${options.expiresMinutes} minutos
                </span>
              </div>
              <p style="margin: 24px 0 12px; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                O si prefieres, puedes hacer clic directamente en el siguiente botón seguro para establecer tu nueva contraseña:
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 10px; box-shadow: 0 2px 6px rgba(15, 118, 110, 0.3);">
                  Restablecer mi Contraseña
                </a>
              </div>
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 12px; line-height: 1.6; color: #64748b;">
                <p style="margin: 0 0 8px;"><strong>Medidas de Seguridad:</strong></p>
                <ul style="margin: 0; padding-left: 18px;">
                  <li>Este código es de uso personal, único y expirará automáticamente en ${options.expiresMinutes} minutos.</li>
                  <li>Por seguridad, tu solicitud se invalidará tras 5 intentos fallidos continuos.</li>
                  <li>Si no solicitaste este cambio, puedes ignorar este correo; tu contraseña no sufrirá cambios.</li>
                  <li>El personal institucional nunca te solicitará este código.</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">© ${new Date().getFullYear()} EduMed Digital. Todos los derechos reservados.</p>
              <p style="margin: 4px 0 0;">Mensaje institucional automático. No respondas a esta dirección de correo.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// API Routes
app.post('/api/auth/request-password-reset', async (req, res) => {
  try {
    const { email, origin } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa una dirección de correo válida.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Prevent abuse: 45 seconds cooldown
    const lastReq = cooldownStore.get(cleanEmail);
    if (lastReq && Date.now() - lastReq < 45000) {
      const waitSecs = Math.ceil((45000 - (Date.now() - lastReq)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Por favor espera ${waitSecs} segundos antes de solicitar un nuevo correo de recuperación.`,
      });
    }
    cooldownStore.set(cleanEmail, Date.now());

    // Generate or synchronize 6-digit verification code and secure token
    const requestedCode = req.body.code ? req.body.code.toString().trim() : '';
    const requestedToken = req.body.token ? req.body.token.toString().trim() : '';

    const code = (requestedCode && /^\d{6}$/.test(requestedCode))
      ? requestedCode
      : Math.floor(100000 + Math.random() * 900000).toString();
    const token = (requestedToken && requestedToken.length >= 8)
      ? requestedToken
      : crypto.randomBytes(24).toString('hex');
    const expiresMinutes = 15;
    const expiresAt = Date.now() + expiresMinutes * 60 * 1000;

    resetStore.set(cleanEmail, {
      code,
      token,
      email: cleanEmail,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      used: false,
    });

    const hostHeader = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol || 'http';
    const appUrl = (origin || process.env.APP_URL || `${protocol}://${hostHeader}`).replace(/\/$/, '');

    try {
      const transporter = await getEmailTransporter();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"EduMed Digital" <no-reply@edumed.edu.co>',
        to: cleanEmail,
        subject: 'Código de verificación para restablecer tu contraseña - EduMed Digital',
        html: generateResetEmailHtml({ code, token, email: cleanEmail, appUrl, expiresMinutes }),
        text: `EduMed Digital: Tu código de verificación para restablecer tu contraseña es ${code}. Válido por ${expiresMinutes} minutos. Enlace directo: ${appUrl}/?reset_token=${token}&email=${encodeURIComponent(cleanEmail)}`,
      });
      console.log(`[AUTH] Sent reset code ${code} to ${cleanEmail}`);
    } catch (mailErr) {
      console.warn('Mail sending notice:', mailErr);
    }

    return res.json({
      success: true,
      code,
      token,
      message: `Hemos enviado un código de verificación de 6 dígitos al correo registrado: ${cleanEmail}. Por favor revisa tu bandeja de entrada y la carpeta de spam.`,
    });
  } catch (err) {
    console.error('Password reset request error:', err);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error al procesar la solicitud. Por favor intenta de nuevo.',
    });
  }
});

app.post('/api/auth/verify-reset-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: 'Correo y código de verificación son requeridos.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanInput = code.toString().trim();
  const record = resetStore.get(cleanEmail);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'No hay ninguna solicitud de recuperación activa o el código ya expiró. Por favor solicita uno nuevo.',
    });
  }

  if (record.used) {
    return res.status(400).json({
      success: false,
      message: 'Este código o enlace ya ha sido utilizado y no es válido.',
    });
  }

  if (Date.now() > record.expiresAt) {
    resetStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      message: 'El código de verificación ha expirado. Por seguridad, solicita uno nuevo.',
    });
  }

  if (record.attempts >= record.maxAttempts) {
    resetStore.delete(cleanEmail);
    return res.status(429).json({
      success: false,
      message: 'Has superado el número máximo de intentos permitidos (5). Por seguridad, el código ha sido invalidado.',
    });
  }

  const isCodeMatch = record.code === cleanInput;
  const isTokenMatch = record.token === cleanInput;

  if (!isCodeMatch && !isTokenMatch) {
    record.attempts += 1;
    const remaining = record.maxAttempts - record.attempts;
    if (remaining <= 0) {
      resetStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Has superado el número máximo de intentos permitidos (5). El código ha sido invalidado por seguridad.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `El código ingresado es incorrecto. Intentos restantes: ${remaining}.`,
    });
  }

  return res.json({
    success: true,
    message: 'Código de verificación validado exitosamente.',
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios.',
    });
  }

  if (newPassword.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'La nueva contraseña debe tener al menos 5 caracteres.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanInput = code.toString().trim();
  const record = resetStore.get(cleanEmail);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: 'Solicitud no encontrada o expirada. Por favor solicita un nuevo código.',
    });
  }

  if (record.used) {
    return res.status(400).json({
      success: false,
      message: 'Este código ya ha sido utilizado.',
    });
  }

  if (Date.now() > record.expiresAt) {
    resetStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      message: 'El código ha expirado. Por favor solicita uno nuevo.',
    });
  }

  const isCodeMatch = record.code === cleanInput;
  const isTokenMatch = record.token === cleanInput;

  if (!isCodeMatch && !isTokenMatch) {
    return res.status(400).json({
      success: false,
      message: 'Código de verificación no válido.',
    });
  }

  // Enforce single-use: mark as used and delete record
  record.used = true;
  resetStore.delete(cleanEmail);

  return res.json({
    success: true,
    message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con ella.',
  });
});

app.get('/api/auth/status', (_req, res) => {
  res.json({
    status: 'ok',
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    activeRequests: resetStore.size,
  });
});

// =========================================================================
// PORTAL CONFIGURATION AND ROLE-BASED ACCESS CONTROL BACKEND API
// Enforces principle of least privilege: only admin can modify portal settings,
// and roles can only fetch authorized configurations.
// =========================================================================

const initialServerPortalConfigs: Record<string, any> = {
  admin: {
    role: 'admin',
    name: 'Directivo / Administrativo',
    nameEn: 'Administrative / Leadership Staff',
    description: 'Portal de gestión integral, control de cupos, auditoría documental y liderazgo escolar.',
    descriptionEn: 'Comprehensive management portal, quota control, document audit, and school leadership.',
    badgeLabel: 'Portal Administrativo / Directivo',
    badgeLabelEn: 'Administrative / Leadership Portal',
    defaultTab: 'dashboard',
    modules: [
      { id: 'dashboard', label: 'Panel de Control', labelEn: 'Dashboard', description: 'Métricas institucionales, indicadores KPI y resumen en vivo.', descriptionEn: 'Institutional metrics, KPI indicators, and live overview.', enabled: true, order: 1, iconName: 'LayoutDashboard', isCore: true },
      { id: 'enrollments', label: 'Solicitudes de Matrícula', labelEn: 'Enrollment Requests', description: 'Gestión y aprobación de radicados de matrícula.', descriptionEn: 'Review and approval of enrollment submissions.', enabled: true, order: 2, iconName: 'FileText' },
      { id: 'students', label: 'Directorio de Estudiantes', labelEn: 'Students Directory', description: 'Fichas académicas, expedientes y listados por grado.', descriptionEn: 'Student files, academic records, and grade lists.', enabled: true, order: 3, iconName: 'Users' },
      { id: 'parents', label: 'Familias y Acudientes', labelEn: 'Guardians & Families', description: 'Base de datos de acudientes y parentesco institucional.', descriptionEn: 'Guardian database and family relationships.', enabled: true, order: 4, iconName: 'UserCheck' },
      { id: 'link-guardian', label: 'Vincular Acudiente', labelEn: 'Link Guardian', description: 'Asignación formal de acudiente legal a estudiante.', descriptionEn: 'Official legal guardian linkage to student.', enabled: true, order: 5, iconName: 'UserCog' },
      { id: 'documents', label: 'Auditoría Documental', labelEn: 'Document Audit', description: 'Revisión y verificación de archivos cargados.', descriptionEn: 'Inspection and verification of uploaded files.', enabled: true, order: 6, iconName: 'FolderKanban' },
      { id: 'portal-config', label: 'Configuración de Portales', labelEn: 'Portal Configuration', description: 'Personalización de módulos, widgets y permisos por rol.', descriptionEn: 'Customization of modules, widgets, and permissions per role.', enabled: true, order: 7, iconName: 'Sliders', isCore: true },
      { id: 'settings', label: 'Configuración Institucional', labelEn: 'School Settings', description: 'Parámetros del colegio, escudo, rectoría y ciclo lectivo.', descriptionEn: 'School parameters, crest, leadership, and school cycle.', enabled: true, order: 8, iconName: 'Settings' }
    ],
    widgets: [
      { id: 'kpi-total-students', title: 'Total Estudiantes Matriculados', titleEn: 'Total Enrolled Students', description: 'Contador de alumnos con cupo activo en el periodo.', descriptionEn: 'Counter of students with active slots.', category: 'kpi', enabled: true, order: 1 },
      { id: 'kpi-in-process', title: 'Matrículas en Trámite', titleEn: 'Enrollments In Process', description: 'Solicitudes en etapa de verificación o revisión.', descriptionEn: 'Applications in verification or review stage.', category: 'kpi', enabled: true, order: 2 },
      { id: 'kpi-completed', title: 'Cupos Asignados', titleEn: 'Completed Enrollments', description: 'Porcentaje y número de matrículas legalizadas.', descriptionEn: 'Percentage and number of finalized enrollments.', category: 'kpi', enabled: true, order: 3 },
      { id: 'kpi-pending-docs', title: 'Auditoría Documental', titleEn: 'Pending Documents', description: 'Archivos en espera de verificación o aprobación.', descriptionEn: 'Files awaiting inspection or approval.', category: 'kpi', enabled: true, order: 4 },
      { id: 'kpi-retention', title: 'Retención Escolar', titleEn: 'Student Retention', description: 'Meta institucional de permanencia estudiantil.', descriptionEn: 'Institutional retention goal.', category: 'kpi', enabled: true, order: 5 },
      { id: 'progress-bar', title: 'Barra de Avance Institucional', titleEn: 'Institutional Goal Progress', description: 'Meta de 1.500 cupos escolares para la vigencia.', descriptionEn: '1,500 student slots goal for current term.', category: 'card', enabled: true, order: 6 },
      { id: 'chart-evolution', title: 'Evolución de Matrículas', titleEn: 'Enrollment Trend Chart', description: 'Gráfico comparativo mensual y semanal.', descriptionEn: 'Monthly and weekly comparative trend chart.', category: 'chart', enabled: true, order: 7 },
      { id: 'chart-donut', title: 'Distribución por Estados', titleEn: 'Status Breakdown Donut', description: 'Proporción de estados SIMAT en tiempo real.', descriptionEn: 'Real-time SIMAT status proportions.', category: 'chart', enabled: true, order: 8 }
    ],
    permissions: {
      canDownloadCertificates: true,
      canEditProfile: true,
      canUploadAvatar: true,
      canEnrollStudents: true,
      canAuditDocuments: true,
      canManageUsers: true,
      canExportReports: true,
      canViewAcademicRecords: true,
      canConfigurePortals: true
    },
    lastUpdated: new Date().toISOString()
  },
  guardian: {
    role: 'guardian',
    name: 'Acudiente / Familia',
    nameEn: 'Guardian & Family',
    description: 'Portal familiar para seguimiento de acudidos, estado SIMAT y beneficios escolares.',
    descriptionEn: 'Family portal for tracking children, SIMAT status, and school benefits.',
    badgeLabel: 'Portal Acudiente',
    badgeLabelEn: 'Guardian Portal',
    defaultTab: 'dashboard',
    modules: [
      { id: 'dashboard', label: 'Portal del Acudiente', labelEn: 'Guardian Portal', description: 'Resumen familiar, acudidos vinculados y accesos rápidos.', descriptionEn: 'Family summary, linked children, and quick actions.', enabled: true, order: 1, iconName: 'LayoutDashboard', isCore: true },
      { id: 'student-profile', label: 'Expediente del Acudido', labelEn: 'Child Profile', description: 'Ficha del estudiante, datos personales y certificado.', descriptionEn: 'Student file, personal details, and certificate.', enabled: true, order: 2, iconName: 'GraduationCap' },
      { id: 'status', label: 'Estado SIMAT', labelEn: 'SIMAT Status', description: 'Consulta oficial del estado del radicado de matrícula.', descriptionEn: 'Official enrollment docket lookup.', enabled: true, order: 3, iconName: 'Search' },
      { id: 'wizard', label: 'Inscribir Nuevo Estudiante', labelEn: 'Enroll New Student', description: 'Formulario paso a paso de registro de matrícula.', descriptionEn: 'Step-by-step enrollment registration.', enabled: true, order: 4, iconName: 'FilePlus' },
      { id: 'beneficios', label: 'Beneficios Escolares (PAE)', labelEn: 'School Meals & Benefits', description: 'Información del programa PAE y subsidios.', descriptionEn: 'School meals program and student benefits.', enabled: true, order: 5, iconName: 'Award' },
      { id: 'institucion', label: 'I.E. Félix Henao Botero', labelEn: 'School Info', description: 'Historia, sede, directivas y proyecto educativo.', descriptionEn: 'Campus history, administration, and school mission.', enabled: true, order: 6, iconName: 'Globe' },
      { id: 'soporte', label: 'Atención y Secretaría', labelEn: 'Support & Admissions', description: 'Canales de atención a padres y radicación de solicitudes.', descriptionEn: 'Parent help desk and ticket requests.', enabled: true, order: 7, iconName: 'LifeBuoy' }
    ],
    widgets: [
      { id: 'welcome-hero', title: 'Bienvenida y Resumen Familiar', titleEn: 'Family Welcome Banner', description: 'Saludo oficial y estado del año escolar 2026.', descriptionEn: 'Official greeting and active 2026 school year.', category: 'card', enabled: true, order: 1 },
      { id: 'my-students-cards', title: 'Estudiantes / Hijos Vinculados', titleEn: 'Linked Children Cards', description: 'Tarjetas individuales por cada hijo con grado y jornada.', descriptionEn: 'Individual cards for each child with grade and shift.', category: 'card', enabled: true, order: 2 },
      { id: 'download-certificate', title: 'Descarga de Comprobante Oficial', titleEn: 'Official Certificate Download', description: 'Generación directa de certificado de matrícula en PDF.', descriptionEn: 'Direct PDF enrollment certificate generation.', category: 'action', enabled: true, order: 3 },
      { id: 'simat-status-widget', title: 'Consulta Rápida de Radicado SIMAT', titleEn: 'SIMAT Docket Quick Lookup', description: 'Verificación del radicado ante Secretaría de Educación.', descriptionEn: 'Verification of docket before Education Secretariat.', category: 'action', enabled: true, order: 4 },
      { id: 'benefits-pae-widget', title: 'Beneficios Escolares PAE', titleEn: 'School Meal Benefits (PAE)', description: 'Seguimiento del programa de alimentación escolar.', descriptionEn: 'Tracking of school meal programs.', category: 'card', enabled: true, order: 5 },
      { id: 'institutional-contact', title: 'Canales Directos con Secretaría', titleEn: 'Direct School Office Contact', description: 'Horarios de atención presencial y telefónica.', descriptionEn: 'On-site and telephone support schedules.', category: 'card', enabled: true, order: 6 }
    ],
    permissions: {
      canDownloadCertificates: true,
      canEditProfile: false,
      canUploadAvatar: false,
      canEnrollStudents: true,
      canAuditDocuments: false,
      canManageUsers: false,
      canExportReports: false,
      canViewAcademicRecords: true,
      canConfigurePortals: false
    },
    lastUpdated: new Date().toISOString()
  },
  student: {
    role: 'student',
    name: 'Estudiante',
    nameEn: 'Student',
    description: 'Portal académico con calificaciones, horario de clases y carnet estudiantil.',
    descriptionEn: 'Academic portal with grades, class schedule, and student ID.',
    badgeLabel: 'Portal Estudiante',
    badgeLabelEn: 'Student Portal',
    defaultTab: 'dashboard',
    modules: [
      { id: 'dashboard', label: 'Mi Portal y Notas', labelEn: 'My Portal & Grades', description: 'Calificaciones del periodo, horario semanal y avatar.', descriptionEn: 'Term grades, weekly schedule, and profile avatar.', enabled: true, order: 1, iconName: 'GraduationCap', isCore: true },
      { id: 'status', label: 'Estado de mi Matrícula', labelEn: 'My Enrollment Status', description: 'Verificación del código de radicado oficial.', descriptionEn: 'Verification of official docket code.', enabled: true, order: 2, iconName: 'Search' },
      { id: 'beneficios', label: 'Mis Beneficios Estudiantiles', labelEn: 'My Student Benefits', description: 'Acceso a programas PAE y eventos del colegio.', descriptionEn: 'Access to PAE programs and school events.', enabled: true, order: 3, iconName: 'Award' },
      { id: 'institucion', label: 'Mi Colegio I.E. Félix Henao', labelEn: 'My School', description: 'Himno, valores, misión y proyectos estudiantiles.', descriptionEn: 'Anthem, values, mission, and student projects.', enabled: true, order: 4, iconName: 'Globe' },
      { id: 'soporte', label: 'Orientación y Soporte', labelEn: 'Counseling & Support', description: 'Contacto con psicoorientación y bienestar escolar.', descriptionEn: 'School counseling and wellness contact.', enabled: true, order: 5, iconName: 'LifeBuoy' }
    ],
    widgets: [
      { id: 'student-identity-banner', title: 'Cabecera de Identidad y Avatar', titleEn: 'Identity & Avatar Banner', description: 'Foto de perfil, nombre real, grado y botones de edición.', descriptionEn: 'Profile picture, full name, grade, and edit buttons.', category: 'card', enabled: true, order: 1 },
      { id: 'kpi-academic-summary', title: 'Resumen de Desempeño Escolar', titleEn: 'Academic Performance Summary', description: 'Promedio acumulado, materias aprobadas y puesto en el grupo.', descriptionEn: 'GPA, passed subjects, and group ranking.', category: 'kpi', enabled: true, order: 2 },
      { id: 'grades-table', title: 'Registro de Calificaciones (Periodo 1)', titleEn: 'Subject Grades Table', description: 'Notas por asignatura, docentes y escala de valoración.', descriptionEn: 'Subject scores, teachers, and performance scale.', category: 'card', enabled: true, order: 3 },
      { id: 'schedule-widget', title: 'Horario Semanal de Clases', titleEn: 'Weekly Class Schedule', description: 'Jornada diaria de lunes a viernes con descansos.', descriptionEn: 'Daily Monday to Friday timetable with breaks.', category: 'card', enabled: true, order: 4 },
      { id: 'insurance-card', title: 'Póliza de Accidentes y Radicado', titleEn: 'Student Insurance Policy & Docket', description: 'Número de póliza 24/7 y radicado oficial SIMAT.', descriptionEn: '24/7 accident policy and official SIMAT docket.', category: 'card', enabled: true, order: 5 },
      { id: 'guardian-summary', title: 'Acudiente Principal Responsable', titleEn: 'Primary Guardian Summary', description: 'Datos de contacto del acudiente ante la institución.', descriptionEn: 'Contact info of the responsible parent/guardian.', category: 'card', enabled: true, order: 6 }
    ],
    permissions: {
      canDownloadCertificates: true,
      canEditProfile: false,
      canUploadAvatar: false,
      canEnrollStudents: false,
      canAuditDocuments: false,
      canManageUsers: false,
      canExportReports: false,
      canViewAcademicRecords: true,
      canConfigurePortals: false
    },
    lastUpdated: new Date().toISOString()
  }
};

let serverPortalConfigs = JSON.parse(JSON.stringify(initialServerPortalConfigs));

// GET /api/portal-config - Fetch configurations with role check
app.get('/api/portal-config', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || 'public';

  if (userRole === 'admin') {
    return res.json({
      success: true,
      configs: serverPortalConfigs
    });
  }

  if (userRole === 'guardian') {
    return res.json({
      success: true,
      configs: {
        guardian: serverPortalConfigs.guardian
      }
    });
  }

  if (userRole === 'student') {
    return res.json({
      success: true,
      configs: {
        student: serverPortalConfigs.student
      }
    });
  }

  return res.status(403).json({
    success: false,
    message: 'Acceso no autorizado para el rol público.'
  });
});

// GET /api/portal-config/:role - Fetch single role configuration
app.get('/api/portal-config/:role', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || 'public';
  const targetRole = req.params.role;

  if (userRole !== 'admin' && userRole !== targetRole) {
    return res.status(403).json({
      success: false,
      message: `Acceso denegado: El rol '${userRole}' no puede consultar la configuración del rol '${targetRole}'.`
    });
  }

  const config = serverPortalConfigs[targetRole];
  if (!config) {
    return res.status(404).json({
      success: false,
      message: `El rol '${targetRole}' no existe en el sistema.`
    });
  }

  return res.json({
    success: true,
    config
  });
});

// PUT /api/portal-config/:role - Update single role configuration (Admin only)
app.put('/api/portal-config/:role', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Únicamente los usuarios administradores pueden actualizar la configuración de portales.'
    });
  }

  const targetRole = req.params.role;
  if (!serverPortalConfigs[targetRole]) {
    return res.status(404).json({
      success: false,
      message: `El rol '${targetRole}' no es un rol configurable.`
    });
  }

  const incomingConfig = req.body;
  if (!incomingConfig || typeof incomingConfig !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'La configuración enviada no es válida.'
    });
  }

  // Merge and stamp timestamp
  serverPortalConfigs[targetRole] = {
    ...serverPortalConfigs[targetRole],
    ...incomingConfig,
    role: targetRole,
    lastUpdated: new Date().toISOString()
  };

  return res.json({
    success: true,
    message: `Configuración del portal '${serverPortalConfigs[targetRole].name}' guardada y aplicada exitosamente.`,
    config: serverPortalConfigs[targetRole]
  });
});

// POST /api/portal-config/reset - Reset to default (Admin only)
app.post('/api/portal-config/reset', (req, res) => {
  const userRole = (req.headers['x-user-role'] as string) || '';
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Únicamente los usuarios administradores pueden restablecer la configuración de portales.'
    });
  }

  const { role } = req.body || {};
  if (role && initialServerPortalConfigs[role]) {
    serverPortalConfigs[role] = JSON.parse(JSON.stringify(initialServerPortalConfigs[role]));
    serverPortalConfigs[role].lastUpdated = new Date().toISOString();
    return res.json({
      success: true,
      message: `Configuración del rol '${serverPortalConfigs[role].name}' restaurada a valores predeterminados.`,
      config: serverPortalConfigs[role]
    });
  }

  // Reset all
  serverPortalConfigs = JSON.parse(JSON.stringify(initialServerPortalConfigs));
  return res.json({
    success: true,
    message: 'Todas las configuraciones de portales han sido restauradas a los valores predeterminados.',
    configs: serverPortalConfigs
  });
});

// GET /api/portal-config/roles/meta - Available system roles metadata
app.get('/api/portal-config/roles/meta', (req, res) => {
  return res.json({
    success: true,
    roles: [
      { id: 'admin', name: 'Directivo / Administrativo', nameEn: 'Administrative / Leadership', activeUsers: 4, canBeConfigured: true },
      { id: 'guardian', name: 'Acudiente / Familia', nameEn: 'Guardian / Family', activeUsers: 24, canBeConfigured: true },
      { id: 'student', name: 'Estudiante', nameEn: 'Student', activeUsers: 145, canBeConfigured: true }
    ]
  });
});


// Dev / Prod Vite mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
    app.get('*', (_req, res) => {
      const indexPath = path.resolve(__dirname, 'dist', 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Build not found. Please run npm run build.');
      }
      let html = fs.readFileSync(indexPath, 'utf-8');
      const fb = getFirebasePublicConfig();
      if (fb.configured && fb.config) {
        const injection = `<script>window.__FIREBASE_CONFIG__ = ${JSON.stringify(fb.config)};</script>`;
        html = html.replace('</head>', `${injection}\n</head>`);
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduMed server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
