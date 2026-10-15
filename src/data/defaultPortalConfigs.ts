import { RolePortalConfig } from '../types';

export const defaultPortalConfigs: Record<'admin' | 'guardian' | 'student', RolePortalConfig> = {
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
      {
        id: 'dashboard',
        label: 'Panel de Control',
        labelEn: 'Dashboard',
        description: 'Métricas institucionales, indicadores KPI y resumen en vivo.',
        descriptionEn: 'Institutional metrics, KPI indicators, and live overview.',
        enabled: true,
        order: 1,
        iconName: 'LayoutDashboard',
        isCore: true
      },
      {
        id: 'enrollments',
        label: 'Solicitudes de Matrícula',
        labelEn: 'Enrollment Requests',
        description: 'Gestión y aprobación de radicados de matrícula.',
        descriptionEn: 'Review and approval of enrollment submissions.',
        enabled: true,
        order: 2,
        iconName: 'FileText'
      },
      {
        id: 'students',
        label: 'Directorio de Estudiantes',
        labelEn: 'Students Directory',
        description: 'Fichas académicas, expedientes y listados por grado.',
        descriptionEn: 'Student files, academic records, and grade lists.',
        enabled: true,
        order: 3,
        iconName: 'Users'
      },
      {
        id: 'parents',
        label: 'Familias y Acudientes',
        labelEn: 'Guardians & Families',
        description: 'Base de datos de acudientes y parentesco institucional.',
        descriptionEn: 'Guardian database and family relationships.',
        enabled: true,
        order: 4,
        iconName: 'UserCheck'
      },
      {
        id: 'link-guardian',
        label: 'Vincular Acudiente',
        labelEn: 'Link Guardian',
        description: 'Asignación formal de acudiente legal a estudiante.',
        descriptionEn: 'Official legal guardian linkage to student.',
        enabled: true,
        order: 5,
        iconName: 'UserCog'
      },
      {
        id: 'documents',
        label: 'Auditoría Documental',
        labelEn: 'Document Audit',
        description: 'Revisión y verificación de archivos cargados.',
        descriptionEn: 'Inspection and verification of uploaded files.',
        enabled: true,
        order: 6,
        iconName: 'FolderKanban'
      }
    ],
    widgets: [
      {
        id: 'kpi-total-students',
        title: 'Total Estudiantes Matriculados',
        titleEn: 'Total Enrolled Students',
        description: 'Contador de alumnos con cupo activo en el periodo.',
        descriptionEn: 'Counter of students with active slots.',
        category: 'kpi',
        enabled: true,
        order: 1
      },
      {
        id: 'kpi-in-process',
        title: 'Matrículas en Trámite',
        titleEn: 'Enrollments In Process',
        description: 'Solicitudes en etapa de verificación o revisión.',
        descriptionEn: 'Applications in verification or review stage.',
        category: 'kpi',
        enabled: true,
        order: 2
      },
      {
        id: 'kpi-completed',
        title: 'Cupos Asignados',
        titleEn: 'Completed Enrollments',
        description: 'Porcentaje y número de matrículas legalizadas.',
        descriptionEn: 'Percentage and number of finalized enrollments.',
        category: 'kpi',
        enabled: true,
        order: 3
      },
      {
        id: 'kpi-pending-docs',
        title: 'Auditoría Documental',
        titleEn: 'Pending Documents',
        description: 'Archivos en espera de verificación o aprobación.',
        descriptionEn: 'Files awaiting inspection or approval.',
        category: 'kpi',
        enabled: true,
        order: 4
      },
      {
        id: 'kpi-retention',
        title: 'Retención Escolar',
        titleEn: 'Student Retention',
        description: 'Meta institucional de permanencia estudiantil.',
        descriptionEn: 'Institutional retention goal.',
        category: 'kpi',
        enabled: true,
        order: 5
      },
      {
        id: 'progress-bar',
        title: 'Barra de Avance Institucional',
        titleEn: 'Institutional Goal Progress',
        description: 'Meta de 1.500 cupos escolares para la vigencia.',
        descriptionEn: '1,500 student slots goal for current term.',
        category: 'card',
        enabled: true,
        order: 6
      },
      {
        id: 'chart-evolution',
        title: 'Evolución de Matrículas',
        titleEn: 'Enrollment Trend Chart',
        description: 'Gráfico comparativo mensual y semanal.',
        descriptionEn: 'Monthly and weekly comparative trend chart.',
        category: 'chart',
        enabled: true,
        order: 7
      },
      {
        id: 'chart-donut',
        title: 'Distribución por Estados',
        titleEn: 'Status Breakdown Donut',
        description: 'Proporción de estados SIMAT en tiempo real.',
        descriptionEn: 'Real-time SIMAT status proportions.',
        category: 'chart',
        enabled: true,
        order: 8
      }
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
      {
        id: 'dashboard',
        label: 'Portal del Acudiente',
        labelEn: 'Guardian Portal',
        description: 'Resumen familiar, acudidos vinculados y accesos rápidos.',
        descriptionEn: 'Family summary, linked children, and quick actions.',
        enabled: true,
        order: 1,
        iconName: 'LayoutDashboard',
        isCore: true
      },
      {
        id: 'student-profile',
        label: 'Expediente del Acudido',
        labelEn: 'Child Profile',
        description: 'Ficha del estudiante, datos personales y certificado.',
        descriptionEn: 'Student file, personal details, and certificate.',
        enabled: true,
        order: 2,
        iconName: 'GraduationCap'
      },
      {
        id: 'status',
        label: 'Estado SIMAT',
        labelEn: 'SIMAT Status',
        description: 'Consulta oficial del estado del radicado de matrícula.',
        descriptionEn: 'Official enrollment docket lookup.',
        enabled: true,
        order: 3,
        iconName: 'Search'
      },
      {
        id: 'wizard',
        label: 'Inscribir Nuevo Estudiante',
        labelEn: 'Enroll New Student',
        description: 'Formulario paso a paso de registro de matrícula.',
        descriptionEn: 'Step-by-step enrollment registration.',
        enabled: true,
        order: 4,
        iconName: 'FilePlus'
      },
      {
        id: 'beneficios',
        label: 'Beneficios Escolares (PAE)',
        labelEn: 'School Meals & Benefits',
        description: 'Información del programa PAE y subsidios.',
        descriptionEn: 'School meals program and student benefits.',
        enabled: true,
        order: 5,
        iconName: 'Award'
      },
      {
        id: 'institucion',
        label: 'I.E. Félix Henao Botero',
        labelEn: 'School Info',
        description: 'Historia, sede, directivas y proyecto educativo.',
        descriptionEn: 'Campus history, administration, and school mission.',
        enabled: true,
        order: 6,
        iconName: 'Globe'
      },
      {
        id: 'soporte',
        label: 'Atención y Secretaría',
        labelEn: 'Support & Admissions',
        description: 'Canales de atención a padres y radicación de solicitudes.',
        descriptionEn: 'Parent help desk and ticket requests.',
        enabled: true,
        order: 7,
        iconName: 'LifeBuoy'
      }
    ],
    widgets: [
      {
        id: 'welcome-hero',
        title: 'Bienvenida y Resumen Familiar',
        titleEn: 'Family Welcome Banner',
        description: 'Saludo oficial y estado del año escolar 2026.',
        descriptionEn: 'Official greeting and active 2026 school year.',
        category: 'card',
        enabled: true,
        order: 1
      },
      {
        id: 'my-students-cards',
        title: 'Estudiantes / Hijos Vinculados',
        titleEn: 'Linked Children Cards',
        description: 'Tarjetas individuales por cada hijo con grado y jornada.',
        descriptionEn: 'Individual cards for each child with grade and shift.',
        category: 'card',
        enabled: true,
        order: 2
      },
      {
        id: 'download-certificate',
        title: 'Descarga de Comprobante Oficial',
        titleEn: 'Official Certificate Download',
        description: 'Generación directa de certificado de matrícula en PDF.',
        descriptionEn: 'Direct PDF enrollment certificate generation.',
        category: 'action',
        enabled: true,
        order: 3
      },
      {
        id: 'simat-status-widget',
        title: 'Consulta Rápida de Radicado SIMAT',
        titleEn: 'SIMAT Docket Quick Lookup',
        description: 'Verificación del radicado ante Secretaría de Educación.',
        descriptionEn: 'Verification of docket before Education Secretariat.',
        category: 'action',
        enabled: true,
        order: 4
      },
      {
        id: 'benefits-pae-widget',
        title: 'Beneficios Escolares PAE',
        titleEn: 'School Meal Benefits (PAE)',
        description: 'Seguimiento del programa de alimentación escolar.',
        descriptionEn: 'Tracking of school meal programs.',
        category: 'card',
        enabled: true,
        order: 5
      },
      {
        id: 'institutional-contact',
        title: 'Canales Directos con Secretaría',
        titleEn: 'Direct School Office Contact',
        description: 'Horarios de atención presencial y telefónica.',
        descriptionEn: 'On-site and telephone support schedules.',
        category: 'card',
        enabled: true,
        order: 6
      }
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
      {
        id: 'dashboard',
        label: 'Mi Portal y Notas',
        labelEn: 'My Portal & Grades',
        description: 'Calificaciones del periodo, horario semanal y avatar.',
        descriptionEn: 'Term grades, weekly schedule, and profile avatar.',
        enabled: true,
        order: 1,
        iconName: 'GraduationCap',
        isCore: true
      },
      {
        id: 'status',
        label: 'Estado de mi Matrícula',
        labelEn: 'My Enrollment Status',
        description: 'Verificación del código de radicado oficial.',
        descriptionEn: 'Verification of official docket code.',
        enabled: true,
        order: 2,
        iconName: 'Search'
      },
      {
        id: 'beneficios',
        label: 'Mis Beneficios Estudiantiles',
        labelEn: 'My Student Benefits',
        description: 'Acceso a programas PAE y eventos del colegio.',
        descriptionEn: 'Access to PAE programs and school events.',
        enabled: true,
        order: 3,
        iconName: 'Award'
      },
      {
        id: 'institucion',
        label: 'Mi Colegio I.E. Félix Henao',
        labelEn: 'My School',
        description: 'Himno, valores, misión y proyectos estudiantiles.',
        descriptionEn: 'Anthem, values, mission, and student projects.',
        enabled: true,
        order: 4,
        iconName: 'Globe'
      },
      {
        id: 'soporte',
        label: 'Orientación y Soporte',
        labelEn: 'Counseling & Support',
        description: 'Contacto con psicoorientación y bienestar escolar.',
        descriptionEn: 'School counseling and wellness contact.',
        enabled: true,
        order: 5,
        iconName: 'LifeBuoy'
      }
    ],
    widgets: [
      {
        id: 'student-identity-banner',
        title: 'Cabecera de Identidad y Avatar',
        titleEn: 'Identity & Avatar Banner',
        description: 'Foto de perfil, nombre real, grado y botones de edición.',
        descriptionEn: 'Profile picture, full name, grade, and edit buttons.',
        category: 'card',
        enabled: true,
        order: 1
      },
      {
        id: 'kpi-academic-summary',
        title: 'Resumen de Desempeño Escolar',
        titleEn: 'Academic Performance Summary',
        description: 'Promedio acumulado, materias aprobadas y puesto en el grupo.',
        descriptionEn: 'GPA, passed subjects, and group ranking.',
        category: 'kpi',
        enabled: true,
        order: 2
      },
      {
        id: 'grades-table',
        title: 'Registro de Calificaciones (Periodo 1)',
        titleEn: 'Subject Grades Table',
        description: 'Notas por asignatura, docentes y escala de valoración.',
        descriptionEn: 'Subject scores, teachers, and performance scale.',
        category: 'card',
        enabled: true,
        order: 3
      },
      {
        id: 'schedule-widget',
        title: 'Horario Semanal de Clases',
        titleEn: 'Weekly Class Schedule',
        description: 'Jornada diaria de lunes a viernes con descansos.',
        descriptionEn: 'Daily Monday to Friday timetable with breaks.',
        category: 'card',
        enabled: true,
        order: 4
      },
      {
        id: 'insurance-card',
        title: 'Póliza de Accidentes y Radicado',
        titleEn: 'Student Insurance Policy & Docket',
        description: 'Número de póliza 24/7 y radicado oficial SIMAT.',
        descriptionEn: '24/7 accident policy and official SIMAT docket.',
        category: 'card',
        enabled: true,
        order: 5
      },
      {
        id: 'guardian-summary',
        title: 'Acudiente Principal Responsable',
        titleEn: 'Primary Guardian Summary',
        description: 'Datos de contacto del acudiente ante la institución.',
        descriptionEn: 'Contact info of the responsible parent/guardian.',
        category: 'card',
        enabled: true,
        order: 6
      }
    ],
    permissions: {
      canDownloadCertificates: true,
      canEditProfile: true,
      canUploadAvatar: true,
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
