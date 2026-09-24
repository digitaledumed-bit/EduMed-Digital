// Configuration for the Mandatory Enrollment Process
// Allows easy modification, reordering, and customization of enrollment steps

export interface EnrollmentStepConfig {
  id: number;
  key: string;
  stepNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  percentage: number;
  asciiProgress: string; // e.g. "██░░░░░░░░"
  badge: string;
}

export const ENROLLMENT_STEPS_CONFIG: EnrollmentStepConfig[] = [
  {
    id: 1,
    key: 'personal',
    stepNumber: 1,
    title: 'Información personal',
    shortTitle: 'Personal',
    description: 'Documento de identidad, nombres, apellidos, sexo y fecha de nacimiento.',
    percentage: 16,
    asciiProgress: '██░░░░░░░░',
    badge: 'Paso 1 de 6'
  },
  {
    id: 2,
    key: 'contact',
    stepNumber: 2,
    title: 'Información de contacto',
    shortTitle: 'Contacto',
    description: 'Celular del estudiante, correo electrónico, dirección de residencia y barrio.',
    percentage: 33,
    asciiProgress: '████░░░░░░',
    badge: 'Paso 2 de 6'
  },
  {
    id: 3,
    key: 'academic',
    stepNumber: 3,
    title: 'Información académica',
    shortTitle: 'Académica',
    description: 'Institución de procedencia, grado a cursar, jornada y antecedentes de salud / EPS.',
    percentage: 50,
    asciiProgress: '█████░░░░░',
    badge: 'Paso 3 de 6'
  },
  {
    id: 4,
    key: 'guardian',
    stepNumber: 4,
    title: 'Información del acudiente',
    shortTitle: 'Acudiente',
    description: 'Nombres, documento, parentesco y datos de contacto del padre, madre o tutor legal.',
    percentage: 67,
    asciiProgress: '███████░░░',
    badge: 'Paso 4 de 6'
  },
  {
    id: 5,
    key: 'documents',
    stepNumber: 5,
    title: 'Documentos requeridos',
    shortTitle: 'Documentos',
    description: 'Carga obligatoria de documento del estudiante, documento de acudiente, EPS y calificaciones.',
    percentage: 84,
    asciiProgress: '█████████░',
    badge: 'Paso 5 de 6'
  },
  {
    id: 6,
    key: 'confirmation',
    stepNumber: 6,
    title: 'Confirmación de matrícula',
    shortTitle: 'Confirmación',
    description: 'Revisión general de datos, juramento de veracidad y radicación oficial del cupo.',
    percentage: 100,
    asciiProgress: '██████████',
    badge: 'Paso 6 de 6'
  }
];

export const TOTAL_ENROLLMENT_STEPS = ENROLLMENT_STEPS_CONFIG.length;
