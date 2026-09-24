import { Student, Guardian, EnrollmentRecord, StudentDocument, ActivityItem } from '../types';
import { getDefaultAvatarByGender } from '../utils/avatarUtils';

export const initialStudents: Student[] = [
  {
    id: 'std-1',
    documentType: 'TI',
    documentNumber: '1002345678',
    firstName: 'Mariana',
    lastName: 'Gómez Ríos',
    fullName: 'Mariana Gómez Ríos',
    birthDate: '15/05/2008',
    gender: 'Femenino',
    bloodType: 'O+',
    grade: '10mo Grado - A',
    shift: 'Mañana',
    status: 'active',
    address: 'Cra. 45 #32-15',
    neighborhood: 'Laureles',
    phone: '+57 300 123 4567',
    email: 'mariana.g@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Femenino'),
    admissionDate: '01/02/2022',
    previousSchool: 'Colegio San Jose',
    medicalNotes: 'Ninguna condición médica reportada',
    guardians: [
      {
        id: 'grd-1',
        name: 'Carlos Gómez',
        relationship: 'Padre',
        phone: '+57 310 987 6543',
        email: 'carlos.gomez@email.com',
        isPrimary: true,
        livesWithStudent: true
      },
      {
        id: 'grd-2',
        name: 'Elena Ríos',
        relationship: 'Madre',
        phone: '+57 312 345 6789',
        email: 'elena.rios@email.com',
        isPrimary: false,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-2',
    documentType: 'TI',
    documentNumber: '1029384756',
    firstName: 'Alejandro',
    lastName: 'Martínez Rojas',
    fullName: 'Martínez Rojas, Alejandro',
    birthDate: '15/04/2009',
    gender: 'Masculino',
    bloodType: 'A+',
    grade: 'Noveno (9-A)',
    shift: 'Mañana',
    status: 'active',
    address: 'Calle 50 #40-12',
    neighborhood: 'Boston',
    phone: '+57 300 123 4567',
    email: 'alejandro.m@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Masculino'),
    admissionDate: '15/01/2023',
    previousSchool: 'Escuela Urbana Boston',
    medicalNotes: 'Rinitis alérgica estacional',
    guardians: [
      {
        id: 'grd-3',
        name: 'Carmen Rojas',
        relationship: 'Madre',
        phone: '+57 300 123 4567',
        email: 'carmen.rojas@email.com',
        isPrimary: true,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-3',
    documentType: 'TI',
    documentNumber: '1098273645',
    firstName: 'Sofía Valentina',
    lastName: 'Gómez Pérez',
    fullName: 'Gómez Pérez, Sofía Valentina',
    birthDate: '22/11/2012',
    gender: 'Femenino',
    bloodType: 'B+',
    grade: 'Sexto (6-B)',
    shift: 'Tarde',
    status: 'in_process',
    address: 'Cra. 70 #10-45',
    neighborhood: 'Belén',
    phone: '+57 311 987 6543',
    email: 'sofia.g@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Femenino'),
    admissionDate: '10/01/2024',
    previousSchool: 'Colegio María Montessori',
    medicalNotes: 'Uso de lentes formulados',
    guardians: [
      {
        id: 'grd-4',
        name: 'Luis Gómez',
        relationship: 'Padre',
        phone: '+57 311 987 6543',
        email: 'luis.gomez@email.com',
        isPrimary: true,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-4',
    documentType: 'CC',
    documentNumber: '1001234567',
    firstName: 'Mateo',
    lastName: 'Vargas Ramírez',
    fullName: 'Vargas Ramírez, Mateo',
    birthDate: '05/02/2007',
    gender: 'Masculino',
    bloodType: 'O+',
    grade: 'Undécimo (11-A)',
    shift: 'Mañana',
    status: 'active',
    address: 'Calle 10 #43-20',
    neighborhood: 'El Poblado',
    phone: '+57 320 456 7890',
    email: 'mateo.vargas@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Masculino'),
    admissionDate: '15/01/2020',
    previousSchool: 'Instituto Técnico Industrial',
    medicalNotes: 'Ninguna reportada',
    guardians: [
      {
        id: 'grd-5',
        name: 'Ana Ramírez',
        relationship: 'Madre',
        phone: '+57 320 456 7890',
        email: 'ana.ramirez@email.com',
        isPrimary: true,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-5',
    documentType: 'TI',
    documentNumber: '1122334455',
    firstName: 'Daniela',
    lastName: 'López Osorio',
    fullName: 'López Osorio, Daniela',
    birthDate: '10/09/2010',
    gender: 'Femenino',
    bloodType: 'A-',
    grade: 'Octavo (8-C)',
    shift: 'Mañana',
    status: 'inactive',
    address: 'Circular 4 #72-10',
    neighborhood: 'Laureles',
    phone: '+57 315 789 0123',
    email: 'daniela.l@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Femenino'),
    admissionDate: '18/01/2022',
    previousSchool: 'Colegio Palermo',
    medicalNotes: 'Alergia a la penicilina',
    guardians: [
      {
        id: 'grd-6',
        name: 'Pedro López',
        relationship: 'Padre',
        phone: '+57 315 789 0123',
        email: 'pedro.lopez@email.com',
        isPrimary: true,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-6',
    documentType: 'TI',
    documentNumber: '10023498',
    firstName: 'Mariana',
    lastName: 'Ríos Osorio',
    fullName: 'Mariana Ríos Osorio',
    birthDate: '12/04/2008',
    gender: 'Femenino',
    bloodType: 'O+',
    grade: '10°A',
    shift: 'Mañana',
    status: 'in_process',
    address: 'Calle 45 # 12-34, Apto 501',
    neighborhood: 'El Poblado',
    phone: '+57 300 123 4567',
    email: 'mariana.rios@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Femenino'),
    admissionDate: '12/04/2024',
    previousSchool: 'Colegio San José Medellín',
    medicalNotes: 'Asma leve controlada',
    guardians: [
      {
        id: 'grd-7',
        name: 'Carlos Eduardo Ramírez',
        relationship: 'Padre / Acudiente Principal',
        phone: '+57 300 123 4567',
        email: 'carlos.ramirez@email.com',
        isPrimary: true,
        livesWithStudent: true
      }
    ]
  },
  {
    id: 'std-7',
    documentType: 'TI',
    documentNumber: '1045987612',
    firstName: 'Alex',
    lastName: 'Zapata Montoya',
    fullName: 'Alex Zapata Montoya',
    birthDate: '08/07/2009',
    gender: 'Neutro',
    bloodType: 'AB+',
    grade: '9°B',
    shift: 'Mañana',
    status: 'active',
    address: 'Cra. 52 #58-30',
    neighborhood: 'Prado Centro',
    phone: '+57 314 555 1234',
    email: 'alex.zapata@edumed.edu.co',
    avatarUrl: getDefaultAvatarByGender('Neutro'),
    admissionDate: '10/02/2023',
    previousSchool: 'Liceo Antioqueño',
    medicalNotes: 'Sin observaciones',
    guardians: []
  }
];


export const initialGuardians: Guardian[] = [
  {
    id: 'grd-7',
    documentType: 'CC',
    documentNumber: '1.034.567.890',
    fullName: 'Carlos Eduardo Ramírez',
    relationship: 'Padre',
    phone: '+57 300 123 4567',
    email: 'carlos.ramirez@email.com',
    address: 'Calle 45 # 12-34, Apto 501, Barrio El Poblado, Medellín.',
    associatedStudents: [
      {
        id: 'std-6',
        name: 'Mariana Ríos Osorio',
        grade: 'Grado 10°A'
      }
    ]
  },
  {
    id: 'grd-8',
    documentType: 'CC',
    documentNumber: '43.567.891',
    fullName: 'Ana María González López',
    relationship: 'Madre',
    phone: '+57 310 987 6543',
    email: 'maria.g@ejemplo.com',
    address: 'Cra 80 # 32-14, Medellín',
    associatedStudents: [
      {
        id: 'std-3',
        name: 'Laura Gómez González',
        grade: 'Grado 6°'
      }
    ]
  },
  {
    id: 'grd-9',
    documentType: 'CE',
    documentNumber: '987654',
    fullName: 'Roberto Carlos Domínguez',
    relationship: 'Tutor Legal',
    phone: '+57 320 456 7890',
    email: 'roberto.d@ejemplo.com',
    address: 'Calle 33 # 65-20, Medellín',
    associatedStudents: [
      {
        id: 'std-2',
        name: 'Andrés Domínguez',
        grade: 'Grado 9°'
      }
    ]
  },
  {
    id: 'grd-10',
    documentType: 'CC',
    documentNumber: '1.020.304.050',
    fullName: 'Juan Carlos Gómez',
    relationship: 'Padre',
    phone: '+57 300 123 4567',
    email: 'jc.gomez@email.com',
    address: 'Calle 50 # 40-20, Medellín',
    associatedStudents: [
      {
        id: 'std-1',
        name: 'Mariana Gómez Ríos',
        grade: 'Grado 10°'
      }
    ]
  }
];

export const initialEnrollments: EnrollmentRecord[] = [
  {
    id: '#MAT-24-001',
    studentId: 'std-4',
    studentName: 'Mateo Restrepo',
    studentDoc: '1001234567',
    academicYear: '2024 - 2025',
    grade: 'Undécimo (11°)',
    submissionDate: '15 May 2024',
    status: 'pending',
    step: 3,
    lastUpdated: '15 May 2024, 09:30 AM',
    notes: 'Esperando validación de paz y salvo financiero.',
    guardianName: 'Ana Ramírez',
    guardianDoc: 'CC 43.892.104',
    guardianPhone: '+57 320 456 7890',
    guardianEmail: 'ana.ramirez@email.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-24-002',
    studentId: 'std-3',
    studentName: 'Valentina Gómez',
    studentDoc: '1098273645',
    academicYear: '2024 - 2025',
    grade: 'Sexto (6°)',
    submissionDate: '14 May 2024',
    status: 'in_review',
    step: 4,
    lastUpdated: '14 May 2024, 11:20 AM',
    notes: 'Documentos en revisión por coordinación académica.',
    guardianName: 'Ana María González López',
    guardianDoc: 'CC 43.567.891',
    guardianPhone: '+57 310 987 6543',
    guardianEmail: 'maria.g@ejemplo.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-24-003',
    studentId: 'std-2',
    studentName: 'Santiago Jaramillo',
    studentDoc: '1029384756',
    academicYear: '2024 - 2025',
    grade: 'Noveno (9°)',
    submissionDate: '12 May 2024',
    status: 'approved',
    step: 6,
    lastUpdated: '13 May 2024, 04:15 PM',
    notes: 'Matrícula aprobada oficialmente. Asignado a grupo 9-A.',
    guardianName: 'Roberto Carlos Domínguez',
    guardianDoc: 'CE 987654',
    guardianPhone: '+57 320 456 7890',
    guardianEmail: 'roberto.d@ejemplo.com',
    guardianRelationship: 'Tutor Legal'
  },
  {
    id: '#MAT-24-004',
    studentId: 'std-5',
    studentName: 'Luciana Pérez',
    studentDoc: '1122334455',
    academicYear: '2024 - 2025',
    grade: 'Octavo (8°)',
    submissionDate: '10 May 2024',
    status: 'rejected',
    step: 4,
    lastUpdated: '11 May 2024, 02:40 PM',
    notes: 'Certificado de notas anterior no cumple requisitos de legalización.',
    guardianName: 'Martha Lucía Pérez',
    guardianDoc: 'CC 32.456.789',
    guardianPhone: '+57 312 654 9870',
    guardianEmail: 'martha.perez@email.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-2024-8932',
    studentId: 'std-6',
    studentName: 'María Valentina López',
    studentDoc: '1020304050',
    academicYear: '2024 - 2025',
    grade: 'Décimo (10°)',
    submissionDate: '22 Oct 2024',
    status: 'in_review',
    step: 4,
    lastUpdated: '24 Oct 2024, 10:30 AM',
    notes: 'Sus documentos están siendo validados por el equipo de admisiones.',
    guardianName: 'Juan Carlos Gómez',
    guardianDoc: 'CC 1.020.304.050',
    guardianPhone: '+57 300 123 4567',
    guardianEmail: 'jc.gomez@email.com',
    guardianRelationship: 'Padre'
  }
];

export const initialDocuments: StudentDocument[] = [
  {
    id: 'doc-1',
    studentId: 'std-6',
    name: 'Documento de Identidad',
    category: 'identity',
    fileName: 'TI_Mariana_Rios.pdf',
    fileSize: '2.4 MB',
    uploadDate: '12/04/2024',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-2',
    studentId: 'std-6',
    name: 'Certificado Médico',
    category: 'health',
    fileName: 'foto_eps.jpg',
    fileSize: '1.1 MB',
    uploadDate: '12/04/2024',
    status: 'rejected',
    rejectionReason: 'El documento subido es ilegible. Por favor, subir un PDF escaneado con buena iluminación, no una foto.',
    fileUrl: '#'
  },
  {
    id: 'doc-3',
    studentId: 'std-6',
    name: 'Certificado Notas Anteriores',
    category: 'academic',
    fileName: 'Notas_Grado9_ColegioAnterior.pdf',
    fileSize: '4.5 MB',
    uploadDate: 'Hace 2 horas',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-4',
    studentId: 'std-1',
    name: 'Carné de Vacunación',
    category: 'health',
    fileName: 'Vacunacion_Completa.pdf',
    fileSize: '1.8 MB',
    uploadDate: '10/04/2024',
    status: 'approved',
    fileUrl: '#'
  }
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act-1',
    timeAgo: 'Hace 10 min',
    timeAgoEn: '10 min ago',
    description: 'María González completó el proceso de matrícula para Juan Pérez (8°)',
    descriptionEn: 'María González completed the enrollment process for Juan Pérez (8th)',
    type: 'completed',
    userName: 'María González',
    studentName: 'Juan Pérez (8°)'
  },
  {
    id: 'act-2',
    timeAgo: 'Hace 15 minutos',
    timeAgoEn: '15 min ago',
    description: 'María Pérez subió Certificado Médico para revisión',
    descriptionEn: 'María Pérez uploaded Medical Certificate for review',
    type: 'review',
    userName: 'María Pérez'
  },
  {
    id: 'act-3',
    timeAgo: 'Hace 45 min',
    timeAgoEn: '45 min ago',
    description: 'Sistema detectó inconsistencias en los documentos de Ana Martínez (10°)',
    descriptionEn: 'System detected discrepancies in documents for Ana Martínez (10th)',
    type: 'warning',
    studentName: 'Ana Martínez (10°)'
  },
  {
    id: 'act-4',
    timeAgo: 'Hace 2 horas',
    timeAgoEn: '2 hours ago',
    description: 'Carlos Restrepo aprobó el pago de pensión de Luis Gómez (6°)',
    descriptionEn: 'Carlos Restrepo verified tuition payment for Luis Gómez (6th)',
    type: 'payment',
    userName: 'Carlos Restrepo',
    studentName: 'Luis Gómez (6°)'
  },
  {
    id: 'act-5',
    timeAgo: 'Ayer, 16:30',
    timeAgoEn: 'Yesterday, 16:30',
    description: 'Documentación incompleta reportada: Familia Ruiz',
    descriptionEn: 'Incomplete documentation reported: Ruiz Family',
    type: 'warning'
  },
  {
    id: 'act-6',
    timeAgo: 'Ayer, 10:15',
    timeAgoEn: 'Yesterday, 10:15',
    description: 'Nuevo usuario administrador creado: J. López',
    descriptionEn: 'New administrative user account created: J. López',
    type: 'admin'
  }
];

export const monthlyEnrollmentData = [
  { month: 'Ene', regular: 45, newAdmissions: 20 },
  { month: 'Feb', regular: 90, newAdmissions: 35 },
  { month: 'Mar', regular: 150, newAdmissions: 50 },
  { month: 'Abr', regular: 80, newAdmissions: 30 },
  { month: 'May', regular: 40, newAdmissions: 25 },
  { month: 'Jun', regular: 120, newAdmissions: 65 },
];

export const gradeDistributionData = [
  { grade: '6°', count: 185 },
  { grade: '7°', count: 210 },
  { grade: '8°', count: 245 },
  { grade: '9°', count: 215 },
  { grade: '10°', count: 260 },
  { grade: '11°', count: 130 },
];
