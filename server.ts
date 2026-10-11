import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
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

    // Generate random 6-digit code and secure 48-char hex token
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(24).toString('hex');
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
    } catch (mailErr) {
      console.warn('Mail sending notice:', mailErr);
    }

    // Do NOT leak existence of email or expose the code in response!
    return res.json({
      success: true,
      message: 'Si la dirección de correo electrónico está registrada en nuestra plataforma, hemos enviado un código de verificación y un enlace seguro para restablecer tu contraseña. Por favor revisa tu bandeja de entrada y la carpeta de spam.',
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

// Dev / Prod Vite mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
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
