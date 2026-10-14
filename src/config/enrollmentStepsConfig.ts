// Configuration for the Mandatory Enrollment Process
// Allows easy modification, reordering, and customization of enrollment steps

export interface EnrollmentStepConfig {
  id: number;
  key: string;
  stepNumber: number;
  title: string;
  titleEn: string;
  shortTitle: string;
  shortTitleEn: string;
  description: string;
  descriptionEn: string;
  percentage: number;
  asciiProgress: string; // e.g. "██░░░░░░░░"
  badge: string;
  badgeEn: string;
}

export const ENROLLMENT_STEPS_CONFIG: EnrollmentStepConfig[] = [
  {
    id: 1,
    key: 'personal',
    stepNumber: 1,
    title: 'Información personal',
    titleEn: 'Personal Information',
    shortTitle: 'Personal',
    shortTitleEn: 'Personal',
    description: 'Documento de identidad, nombres, apellidos y fecha de nacimiento.',
    descriptionEn: 'Identity document, first and last names, and date of birth.',
    percentage: 16,
    asciiProgress: '██░░░░░░░░',
    badge: 'Paso 1 de 6',
    badgeEn: 'Step 1 of 6'
  },
  {
    id: 2,
    key: 'contact',
    stepNumber: 2,
    title: 'Información de contacto',
    titleEn: 'Contact Information',
    shortTitle: 'Contacto',
    shortTitleEn: 'Contact',
    description: 'Celular del estudiante, correo electrónico, dirección de residencia y barrio.',
    descriptionEn: 'Student phone number, email address, residence address, and neighborhood.',
    percentage: 33,
    asciiProgress: '████░░░░░░',
    badge: 'Paso 2 de 6',
    badgeEn: 'Step 2 of 6'
  },
  {
    id: 3,
    key: 'academic',
    stepNumber: 3,
    title: 'Información académica',
    titleEn: 'Academic & Health Information',
    shortTitle: 'Académica',
    shortTitleEn: 'Academic',
    description: 'Institución de procedencia, grado a cursar, jornada y antecedentes de salud / EPS.',
    descriptionEn: 'Previous school, target grade, shift, and health insurance information.',
    percentage: 50,
    asciiProgress: '█████░░░░░',
    badge: 'Paso 3 de 6',
    badgeEn: 'Step 3 of 6'
  },
  {
    id: 4,
    key: 'guardian',
    stepNumber: 4,
    title: 'Información del acudiente',
    titleEn: 'Guardian Information',
    shortTitle: 'Acudiente',
    shortTitleEn: 'Guardian',
    description: 'Nombres, documento, parentesco y datos de contacto del padre, madre o tutor legal.',
    descriptionEn: 'Full name, document number, relationship, and contact information of legal guardian.',
    percentage: 67,
    asciiProgress: '███████░░░',
    badge: 'Paso 4 de 6',
    badgeEn: 'Step 4 of 6'
  },
  {
    id: 5,
    key: 'documents',
    stepNumber: 5,
    title: 'Documentos requeridos',
    titleEn: 'Required Documents',
    shortTitle: 'Documentos',
    shortTitleEn: 'Documents',
    description: 'Carga obligatoria de documento del estudiante, documento de acudiente, EPS y calificaciones.',
    descriptionEn: 'Mandatory upload of student ID, guardian ID, health insurance certificate, and grades.',
    percentage: 84,
    asciiProgress: '█████████░',
    badge: 'Paso 5 de 6',
    badgeEn: 'Step 5 of 6'
  },
  {
    id: 6,
    key: 'confirmation',
    stepNumber: 6,
    title: 'Confirmación de matrícula',
    titleEn: 'Enrollment Confirmation',
    shortTitle: 'Confirmación',
    shortTitleEn: 'Confirmation',
    description: 'Revisión general de datos, juramento de veracidad y radicación oficial del cupo.',
    descriptionEn: 'General data review, sworn declaration of truth, and official submission of enrollment.',
    percentage: 100,
    asciiProgress: '██████████',
    badge: 'Paso 6 de 6',
    badgeEn: 'Step 6 of 6'
  }
];

export const TOTAL_ENROLLMENT_STEPS = ENROLLMENT_STEPS_CONFIG.length;
