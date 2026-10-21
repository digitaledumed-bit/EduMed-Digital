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
    admissionDate: '10/01/2026',
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
    admissionDate: '12/04/2026',
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
    id: '#MAT-2026-001',
    studentId: 'std-4',
    studentName: 'Mateo Vargas Ramírez',
    studentDoc: '1001234567',
    academicYear: '2026',
    grade: 'Undécimo (11°)',
    submissionDate: '15 Oct 2026',
    status: 'in_review',
    step: 4,
    lastUpdated: '15 Oct 2026, 09:30 AM',
    notes: 'Documentos radicados por acudiente. Pendiente de validación documental.',
    guardianName: 'Ana Ramírez',
    guardianDoc: 'CC 43.892.104',
    guardianPhone: '+57 320 456 7890',
    guardianEmail: 'ana.ramirez@email.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-2026-002',
    studentId: 'std-3',
    studentName: 'Sofía Valentina Gómez Pérez',
    studentDoc: '1098273645',
    academicYear: '2026',
    grade: 'Sexto (6°)',
    submissionDate: '14 Oct 2026',
    status: 'in_review',
    step: 4,
    lastUpdated: '14 Oct 2026, 11:20 AM',
    notes: 'Documentos radicados por acudiente en revisión por Administración General.',
    guardianName: 'Ana María González López',
    guardianDoc: 'CC 43.567.891',
    guardianPhone: '+57 310 987 6543',
    guardianEmail: 'maria.g@ejemplo.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-2026-003',
    studentId: 'std-2',
    studentName: 'Alejandro Martínez Rojas',
    studentDoc: '1029384756',
    academicYear: '2026',
    grade: 'Noveno (9°)',
    submissionDate: '12 Oct 2026',
    status: 'approved',
    step: 6,
    lastUpdated: '13 Oct 2026, 04:15 PM',
    notes: 'Matrícula aprobada oficialmente. Asignado a grupo 9-A.',
    guardianName: 'Carmen Rojas',
    guardianDoc: 'CE 987654',
    guardianPhone: '+57 320 456 7890',
    guardianEmail: 'carmen.rojas@email.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-2026-004',
    studentId: 'std-5',
    studentName: 'Daniela López Osorio',
    studentDoc: '1122334455',
    academicYear: '2026',
    grade: 'Octavo (8°)',
    submissionDate: '10 Oct 2026',
    status: 'rejected',
    step: 4,
    lastUpdated: '11 Oct 2026, 02:40 PM',
    notes: 'Certificado de notas anterior no cumple requisitos de legalización.',
    guardianName: 'Martha Lucía Pérez',
    guardianDoc: 'CC 32.456.789',
    guardianPhone: '+57 312 654 9870',
    guardianEmail: 'martha.perez@email.com',
    guardianRelationship: 'Madre'
  },
  {
    id: '#MAT-2026-8932',
    studentId: 'std-6',
    studentName: 'Mariana Ríos Osorio',
    studentDoc: '10023498',
    academicYear: '2026',
    grade: 'Décimo (10°)',
    submissionDate: '21 Oct 2026',
    status: 'in_review',
    step: 4,
    lastUpdated: '21 Oct 2026, 10:30 AM',
    notes: 'Documentos radicados por acudiente. Pendiente de validación documental.',
    guardianName: 'Carlos Eduardo Ramírez',
    guardianDoc: 'CC 1.020.304.050',
    guardianPhone: '+57 300 123 4567',
    guardianEmail: 'carlos.ramirez@email.com',
    guardianRelationship: 'Padre / Acudiente Principal'
  }
];

export const initialDocuments: StudentDocument[] = [
  // Documentos Mariana Ríos Osorio (std-6) - Radicados por acudiente
  {
    id: 'doc-1',
    studentId: 'std-6',
    studentName: 'Mariana Ríos Osorio',
    name: 'Documento de Identidad (TI)',
    category: 'identity',
    fileName: 'TI_Mariana_Rios.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadDate: '12/10/2026',
    uploadedBy: 'Carlos Eduardo Ramírez (Acudiente)',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-2',
    studentId: 'std-6',
    studentName: 'Mariana Ríos Osorio',
    name: 'Certificado de Afiliación EPS',
    category: 'health',
    fileName: 'Certificado_EPS_Sura.pdf',
    fileSize: '1.1 MB',
    fileType: 'application/pdf',
    uploadDate: '12/10/2026',
    uploadedBy: 'Carlos Eduardo Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-3',
    studentId: 'std-6',
    studentName: 'Mariana Ríos Osorio',
    name: 'Certificado de Notas Grado 9°',
    category: 'academic',
    fileName: 'Notas_Grado9_ColegioAnterior.pdf',
    fileSize: '4.5 MB',
    fileType: 'application/pdf',
    uploadDate: 'Hace 2 horas',
    uploadedBy: 'Carlos Eduardo Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-6-4',
    studentId: 'std-6',
    studentName: 'Mariana Ríos Osorio',
    name: 'Carné de Vacunación y Salud',
    category: 'health',
    fileName: 'Vacunacion_Mariana_Rios.pdf',
    fileSize: '1.6 MB',
    fileType: 'application/pdf',
    uploadDate: 'Hace 2 horas',
    uploadedBy: 'Carlos Eduardo Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },

  // Documentos Sofía Valentina Gómez Pérez (std-3) - Radicados por acudiente
  {
    id: 'doc-std3-1',
    studentId: 'std-3',
    studentName: 'Sofía Valentina Gómez Pérez',
    name: 'Tarjeta de Identidad (TI)',
    category: 'identity',
    fileName: 'TI_Sofia_Gomez.pdf',
    fileSize: '1.9 MB',
    fileType: 'application/pdf',
    uploadDate: '14/10/2026',
    uploadedBy: 'Ana María González López (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std3-2',
    studentId: 'std-3',
    studentName: 'Sofía Valentina Gómez Pérez',
    name: 'Certificado de Afiliación EPS Savia Salud',
    category: 'health',
    fileName: 'Certificado_EPS_SaviaSalud.pdf',
    fileSize: '1.2 MB',
    fileType: 'application/pdf',
    uploadDate: '14/10/2026',
    uploadedBy: 'Ana María González López (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std3-3',
    studentId: 'std-3',
    studentName: 'Sofía Valentina Gómez Pérez',
    name: 'Certificado de Calificaciones Grado 5°',
    category: 'academic',
    fileName: 'Certificado_Notas_Grado5.pdf',
    fileSize: '2.5 MB',
    fileType: 'application/pdf',
    uploadDate: '14/10/2026',
    uploadedBy: 'Ana María González López (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std3-4',
    studentId: 'std-3',
    studentName: 'Sofía Valentina Gómez Pérez',
    name: 'Certificado Médico Escolar',
    category: 'health',
    fileName: 'Certificado_Medico_Escolar.pdf',
    fileSize: '1.1 MB',
    fileType: 'application/pdf',
    uploadDate: '14/10/2026',
    uploadedBy: 'Ana María González López (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },

  // Documentos Mateo Vargas Ramírez (std-4) - Radicados por acudiente
  {
    id: 'doc-std4-1',
    studentId: 'std-4',
    studentName: 'Mateo Vargas Ramírez',
    name: 'Cédula de Ciudadanía / TI',
    category: 'identity',
    fileName: 'CC_Mateo_Vargas.pdf',
    fileSize: '2.1 MB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Ana Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std4-2',
    studentId: 'std-4',
    studentName: 'Mateo Vargas Ramírez',
    name: 'Certificado EPS Sura Vigente',
    category: 'health',
    fileName: 'Certificado_EPS_Sura_2026.pdf',
    fileSize: '1.3 MB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Ana Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std4-3',
    studentId: 'std-4',
    studentName: 'Mateo Vargas Ramírez',
    name: 'Certificado de Calificaciones Grado 10°',
    category: 'academic',
    fileName: 'Notas_Grado_Decimo_Oficial.pdf',
    fileSize: '3.2 MB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Ana Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },
  {
    id: 'doc-std4-4',
    studentId: 'std-4',
    studentName: 'Mateo Vargas Ramírez',
    name: 'Paz y Salvo Institucional',
    category: 'academic',
    fileName: 'Paz_y_Salvo_Colegio_Anterior.pdf',
    fileSize: '850 KB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Ana Ramírez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },

  // Documentos Alejandro Martínez Rojas (std-2) - Aprobados
  {
    id: 'doc-std2-1',
    studentId: 'std-2',
    studentName: 'Alejandro Martínez Rojas',
    name: 'Tarjeta de Identidad (TI)',
    category: 'identity',
    fileName: 'TI_Alejandro_Martinez.pdf',
    fileSize: '1.7 MB',
    fileType: 'application/pdf',
    uploadDate: '12/10/2026',
    uploadedBy: 'Carmen Rojas (Acudiente)',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-std2-2',
    studentId: 'std-2',
    studentName: 'Alejandro Martínez Rojas',
    name: 'Certificado EPS Sura',
    category: 'health',
    fileName: 'Certificado_EPS_Alejandro.pdf',
    fileSize: '1.0 MB',
    fileType: 'application/pdf',
    uploadDate: '12/10/2026',
    uploadedBy: 'Carmen Rojas (Acudiente)',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-std2-3',
    studentId: 'std-2',
    studentName: 'Alejandro Martínez Rojas',
    name: 'Certificado de Notas Grado 8°',
    category: 'academic',
    fileName: 'Notas_Grado8_Alejandro.pdf',
    fileSize: '2.2 MB',
    fileType: 'application/pdf',
    uploadDate: '12/10/2026',
    uploadedBy: 'Carmen Rojas (Acudiente)',
    status: 'approved',
    fileUrl: '#'
  },

  // Documentos Daniela López Osorio (std-5) - Rechazado en notas
  {
    id: 'doc-std5-1',
    studentId: 'std-5',
    studentName: 'Daniela López Osorio',
    name: 'Tarjeta de Identidad (TI)',
    category: 'identity',
    fileName: 'TI_Daniela_Lopez.pdf',
    fileSize: '1.5 MB',
    fileType: 'application/pdf',
    uploadDate: '10/10/2026',
    uploadedBy: 'Martha Lucía Pérez (Acudiente)',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-std5-2',
    studentId: 'std-5',
    studentName: 'Daniela López Osorio',
    name: 'Certificado de Notas Anterior',
    category: 'academic',
    fileName: 'Notas_Colegio_Anterior.pdf',
    fileSize: '3.1 MB',
    fileType: 'application/pdf',
    uploadDate: '10/10/2026',
    uploadedBy: 'Martha Lucía Pérez (Acudiente)',
    status: 'rejected',
    rejectionReason: 'Certificado de notas anterior no cumple requisitos de legalización y membrete.',
    fileUrl: '#'
  },
  {
    id: 'doc-std5-3',
    studentId: 'std-5',
    studentName: 'Daniela López Osorio',
    name: 'Certificado EPS',
    category: 'health',
    fileName: 'Certificado_EPS_Daniela.pdf',
    fileSize: '980 KB',
    fileType: 'application/pdf',
    uploadDate: '10/10/2026',
    uploadedBy: 'Martha Lucía Pérez (Acudiente)',
    status: 'in_review',
    fileUrl: '#'
  },

  // Documentos Mariana Gómez Ríos (std-1)
  {
    id: 'doc-4',
    studentId: 'std-1',
    studentName: 'Mariana Gómez Ríos',
    name: 'Carné de Vacunación y Salud',
    category: 'health',
    fileName: 'Vacunacion_Completa.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    uploadDate: '10/10/2026',
    uploadedBy: 'Carlos Gómez (Acudiente / Padre)',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-std1-1',
    studentId: 'std-1',
    studentName: 'Mariana Gómez Ríos',
    name: 'Tarjeta de Identidad (TI)',
    category: 'identity',
    fileName: 'TI_Mariana_Gomez.pdf',
    fileSize: '2.0 MB',
    fileType: 'application/pdf',
    uploadDate: '10/10/2026',
    uploadedBy: 'Carlos Gómez (Acudiente / Padre)',
    status: 'approved',
    fileUrl: '#'
  },

  // Documentos Estudiante EduMed (std-current)
  {
    id: 'doc-5',
    studentId: 'std-current',
    studentName: 'Estudiante EduMed',
    name: 'Documento de Identidad del Estudiante (TI)',
    category: 'identity',
    fileName: 'TI_Estudiante_1035982147.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Estudiante EduMed',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-6',
    studentId: 'std-current',
    studentName: 'Estudiante EduMed',
    name: 'Certificado de Afiliación EPS Vigente',
    category: 'health',
    fileName: 'Certificado_EPS_Vigente_2026.pdf',
    fileSize: '820 KB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Acudiente Autorizado',
    status: 'approved',
    fileUrl: '#'
  },
  {
    id: 'doc-7',
    studentId: 'std-current',
    studentName: 'Estudiante EduMed',
    name: 'Paz y Salvo Colegio de Procedencia',
    category: 'academic',
    fileName: 'Paz_y_Salvo_Colegio_Anterior_2026.pdf',
    fileSize: '540 KB',
    fileType: 'application/pdf',
    uploadDate: '15/10/2026',
    uploadedBy: 'Acudiente Autorizado',
    status: 'rejected',
    rejectionReason: 'El certificado de paz y salvo del año escolar 2026 presenta baja resolución y los sellos de la secretaría de procedencia no son legibles.',
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
