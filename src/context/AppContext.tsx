import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, Theme, FontSize, UserRole, Student, Guardian, EnrollmentRecord, StudentDocument, ActivityItem, EnrollmentStatus, DocumentStatus, AuthUser, AppNotification } from '../types';
import { translations } from '../i18n/translations';
import { initialStudents, initialGuardians, initialEnrollments, initialDocuments, initialActivities } from '../data/mockData';
import { getDefaultAvatarByGender, isMaleGender } from '../utils/avatarUtils';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  toggleFontSize: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;

  currentUser: AuthUser | null;
  updateUserAvatar: (newAvatarUrl: string) => void;
  login: (identifier: string, pass: string, preferredRole?: UserRole) => { success: boolean; message?: string; notFound?: boolean; suggestedRole?: UserRole };
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
    gender?: string;
    documentNumber?: string; 
    phone?: string;
    position?: string;
    department?: string;
    institutionCode?: string;
  }) => { success: boolean; message?: string };
  isEmailRegistered: (email: string) => boolean;
  logout: () => void;
  requestPasswordResetCode: (email: string) => { success: boolean; message?: string; phone?: string; maskedPhone?: string; code?: string; name?: string };
  verifyPasswordResetCode: (email: string, code: string) => { success: boolean; message?: string };
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => { success: boolean; message?: string };
  customLogoUrl: string;
  setCustomLogoUrl: (url: string) => void;
  
  students: Student[];
  guardians: Guardian[];
  enrollments: EnrollmentRecord[];
  documents: StudentDocument[];
  activities: ActivityItem[];

  updateDocumentStatus: (docId: string, status: DocumentStatus, rejectionReason?: string) => void;
  updateEnrollmentStatus: (enrollmentId: string, status: EnrollmentStatus) => void;
  addStudent: (student: Omit<Student, 'id'>) => string;
  addGuardian: (guardian: Omit<Guardian, 'id'>) => string;
  linkGuardianToStudent: (studentId: string, guardianData: { name: string; relationship: string; phone: string; email: string; isPrimary: boolean; livesWithStudent: boolean }) => void;
  submitNewEnrollment: (data: { student: Partial<Student>; guardian: Partial<Guardian>; documents: { name: string; file: File | null }[] }) => string;
  lookupEnrollmentStatus: (query: string) => EnrollmentRecord | null;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('edumed_lang') as Language) || 'es';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('edumed_theme') as Theme) || 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('edumed_font_size') as FontSize) || 'large';
  });

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('edumed_font_size', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const toggleFontSize = () => {
    setFontSizeState((prev) => {
      const next: FontSize = prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal';
      localStorage.setItem('edumed_font_size', next);
      document.documentElement.setAttribute('data-font-size', next);
      return next;
    });
  };

  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('std-6');

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('edumed_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [customLogoUrl, setCustomLogoUrlState] = useState<string>(() => {
    return localStorage.getItem('edumed_custom_logo') || '/school_logo.jpg';
  });

  const setCustomLogoUrl = (url: string) => {
    setCustomLogoUrlState(url);
    localStorage.setItem('edumed_custom_logo', url);
  };

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edumed_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [guardians, setGuardians] = useState<Guardian[]>(() => {
    const saved = localStorage.getItem('edumed_guardians');
    return saved ? JSON.parse(saved) : initialGuardians;
  });

  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>(() => {
    const saved = localStorage.getItem('edumed_enrollments');
    return saved ? JSON.parse(saved) : initialEnrollments;
  });

  const [documents, setDocuments] = useState<StudentDocument[]>(() => {
    const saved = localStorage.getItem('edumed_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('edumed_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const initialNotifications: AppNotification[] = [
    // 1. Docentes y Directivos / Administrativos
    {
      id: 'notif-adm-1',
      title: 'Nuevas Solicitudes de Matrícula',
      message: 'Hay 5 solicitudes de matrícula pendientes por validación documental y asignación en SIMAT.',
      date: 'Hace 15 min',
      read: false,
      targetRoles: ['admin'],
      category: 'administrative'
    },
    {
      id: 'notif-adm-2',
      title: 'Documentos Pendientes de Aprobación',
      message: 'Se cargaron certificados del SISBEN y certificados médicos para revisión por secretaría académica.',
      date: 'Hace 1 hora',
      read: false,
      targetRoles: ['admin'],
      category: 'document'
    },
    {
      id: 'notif-adm-3',
      title: 'Comité de Convivencia y Promoción',
      message: 'Convocatoria a reunión de docentes y directores de grupo el próximo viernes en la sala de profesores.',
      date: 'Hace 3 horas',
      read: false,
      targetRoles: ['admin'],
      category: 'academic'
    },
    {
      id: 'notif-adm-4',
      title: 'Cierre de Auditoría SIMAT 2025',
      message: 'Recordatorio oficial: Plazo de consolidación de cupos escolares ante Secretaría de Educación de Medellín.',
      date: 'Ayer',
      read: true,
      targetRoles: ['admin'],
      category: 'administrative'
    },

    // 2. Acudientes / Familias
    {
      id: 'notif-grd-1',
      title: 'Estado de Matrícula en Revisión',
      message: 'La documentación de matrícula de su acudido(a) está siendo verificada satisfactoriamente por Secretaría.',
      date: 'Hace 20 min',
      read: false,
      targetRoles: ['guardian'],
      category: 'enrollment'
    },
    {
      id: 'notif-grd-2',
      title: 'Asamblea General de Padres de Familia',
      message: 'Convocatoria a la primera asamblea de acudientes del año lectivo en la sede principal a las 7:00 AM.',
      date: 'Hace 2 horas',
      read: false,
      targetRoles: ['guardian'],
      category: 'general'
    },
    {
      id: 'notif-grd-3',
      title: 'Programa de Alimentación Escolar (PAE)',
      message: 'Habilitada la actualización de datos para el complemento nutricional escolar de su acudido.',
      date: 'Ayer',
      read: false,
      targetRoles: ['guardian'],
      category: 'general'
    },
    {
      id: 'notif-grd-4',
      title: 'Póliza de Accidentes Escolares',
      message: 'Se ha confirmado la cobertura médica escolar institucional para el presente periodo académico.',
      date: 'Hace 2 días',
      read: true,
      targetRoles: ['guardian'],
      category: 'document'
    },

    // 3. Estudiantes
    {
      id: 'notif-std-1',
      title: 'Carnet Digital Estudiantil Habilitado',
      message: 'Tu carnet escolar con código QR ya está generado. Puedes presentarlo desde tu perfil institucional.',
      date: 'Hace 30 min',
      read: false,
      targetRoles: ['student'],
      category: 'academic'
    },
    {
      id: 'notif-std-2',
      title: 'Horario y Asignación de Grupo',
      message: 'Tu salón y directores de área para el periodo 2025 ya están disponibles en tu expediente escolar.',
      date: 'Hace 2 horas',
      read: false,
      targetRoles: ['student'],
      category: 'academic'
    },
    {
      id: 'notif-std-3',
      title: 'Inscripción Personería y Contraloría',
      message: 'Abierta la convocatoria democrática para representantes al gobierno estudiantil de la institución.',
      date: 'Ayer',
      read: false,
      targetRoles: ['student'],
      category: 'general'
    },
    {
      id: 'notif-std-4',
      title: 'Matrícula Académica Legalizada',
      message: 'Tu matrícula para el ciclo escolar ha sido registrada a satisfacción en los libros del colegio.',
      date: 'Hace 3 días',
      read: true,
      targetRoles: ['student'],
      category: 'enrollment'
    },

    // 4. Circular Institucional General
    {
      id: 'notif-gen-1',
      title: 'Calendario Escolar y Recesos 2025',
      message: 'Publicado el cronograma oficial de semanas pedagógicas, evaluaciones institucionales y actos cívicos.',
      date: 'Esta semana',
      read: false,
      targetRoles: ['admin', 'guardian', 'student', 'public'],
      category: 'general'
    }
  ];

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('edumed_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('edumed_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('edumed_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('edumed_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Clean any legacy data-font-size attribute
    document.documentElement.removeAttribute('data-font-size');
  }, []);

  useEffect(() => {
    localStorage.setItem('edumed_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edumed_guardians', JSON.stringify(guardians));
  }, [guardians]);

  useEffect(() => {
    localStorage.setItem('edumed_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('edumed_documents', JSON.stringify(documents));
  }, [documents]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateDocumentStatus = (docId: string, status: DocumentStatus, rejectionReason?: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status,
              rejectionReason: status === 'rejected' ? rejectionReason || 'Documento no cumple requisitos.' : undefined
            }
          : d
      )
    );

    const doc = documents.find(d => d.id === docId);
    if (doc) {
      const newActivity: ActivityItem = {
        id: 'act-' + Date.now(),
        timeAgo: 'Justo ahora',
        timeAgoEn: 'Just now',
        description: `Documento "${doc.name}" ${status === 'approved' ? 'aprobado' : status === 'rejected' ? 'rechazado' : 'actualizado'} por Administración`,
        descriptionEn: `Document "${doc.name}" ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} by Administration`,
        type: status === 'approved' ? 'completed' : status === 'rejected' ? 'warning' : 'review'
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  const updateEnrollmentStatus = (enrollmentId: string, status: EnrollmentStatus) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === enrollmentId
          ? {
              ...e,
              status,
              lastUpdated: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
          : e
      )
    );
  };

  const addStudent = (studentData: Omit<Student, 'id'>): string => {
    const newId = 'std-' + (students.length + 1);
    const newStudent: Student = {
      ...studentData,
      id: newId
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newId;
  };

  const addGuardian = (guardianData: Omit<Guardian, 'id'>): string => {
    const newId = 'grd-' + (guardians.length + 1);
    const newGuardian: Guardian = {
      ...guardianData,
      id: newId
    };
    setGuardians((prev) => [newGuardian, ...prev]);
    return newId;
  };

  const linkGuardianToStudent = (
    studentId: string,
    guardianData: { name: string; relationship: string; phone: string; email: string; isPrimary: boolean; livesWithStudent: boolean }
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newRef = {
            id: 'grd-ref-' + Date.now(),
            ...guardianData
          };
          const updatedGuardians = guardianData.isPrimary
            ? s.guardians.map((g) => ({ ...g, isPrimary: false }))
            : s.guardians;
          return {
            ...s,
            guardians: [...updatedGuardians, newRef]
          };
        }
        return s;
      })
    );

    const std = students.find((s) => s.id === studentId);
    if (std) {
      setActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          timeAgo: 'Justo ahora',
          timeAgoEn: 'Just now',
          description: `Nuevo acudiente (${guardianData.name}) vinculado a ${std.fullName}`,
          descriptionEn: `New guardian (${guardianData.name}) linked to ${std.fullName}`,
          type: 'admin',
          userName: guardianData.name,
          studentName: std.fullName
        },
        ...prev
      ]);
    }
  };

  const submitNewEnrollment = (data: {
    student: Partial<Student>;
    guardian: Partial<Guardian>;
    documents: { name: string; file: File | null }[];
  }): string => {
    const radicado = `#MAT-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudentId = 'std-' + (students.length + 1);

    const newStudent: Student = {
      id: newStudentId,
      documentType: data.student.documentType || 'TI',
      documentNumber: data.student.documentNumber || '1020304050',
      firstName: data.student.firstName || 'Nuevo',
      lastName: data.student.lastName || 'Estudiante',
      fullName: `${data.student.firstName || 'Nuevo'} ${data.student.lastName || 'Estudiante'}`,
      birthDate: data.student.birthDate || '2010-01-01',
      gender: data.student.gender || 'Femenino',
      bloodType: data.student.bloodType || 'O+',
      grade: data.student.grade || '10°',
      shift: data.student.shift || 'Mañana',
      status: 'in_process',
      address: data.student.address || 'Calle 50 #40-20',
      neighborhood: data.student.neighborhood || 'Boston',
      phone: data.guardian.phone || '+57 300 000 0000',
      email: data.student.email || 'estudiante@edumed.edu.co',
      admissionDate: new Date().toLocaleDateString('es-CO'),
      previousSchool: data.student.previousSchool || 'Institución previa',
      medicalNotes: data.student.medicalNotes || 'Sin observaciones',
      guardians: [
        {
          id: 'grd-auto-' + Date.now(),
          name: data.guardian.fullName || 'Acudiente Principal',
          relationship: data.guardian.relationship || 'Padre/Madre',
          phone: data.guardian.phone || '',
          email: data.guardian.email || '',
          isPrimary: true,
          livesWithStudent: true
        }
      ]
    };

    const newEnrollment: EnrollmentRecord = {
      id: radicado,
      studentId: newStudentId,
      studentName: newStudent.fullName,
      studentDoc: newStudent.documentNumber,
      academicYear: '2024 - 2025',
      grade: newStudent.grade,
      submissionDate: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'in_review',
      step: 4,
      lastUpdated: 'Recién radicado',
      notes: 'Solicitud radicada en línea por acudiente. Pendiente de validación documental.',
      guardianName: data.guardian.fullName || 'Acudiente Registrado',
      guardianDoc: data.guardian.documentNumber ? `${data.guardian.documentType || 'CC'} ${data.guardian.documentNumber}` : undefined,
      guardianPhone: data.guardian.phone || '',
      guardianEmail: data.guardian.email || '',
      guardianRelationship: data.guardian.relationship || 'Acudiente Principal'
    };

    const newDocs: StudentDocument[] = (data.documents || []).map((doc, idx) => ({
      id: 'doc-new-' + Date.now() + '-' + idx,
      studentId: newStudentId,
      name: doc.name,
      category: 'identity',
      fileName: doc.file ? doc.file.name : `${doc.name.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.5 MB',
      uploadDate: 'Hoy',
      status: 'in_review',
      fileUrl: '#'
    }));

    setStudents((prev) => [newStudent, ...prev]);
    setEnrollments((prev) => [newEnrollment, ...prev]);
    if (newDocs.length > 0) {
      setDocuments((prev) => [...newDocs, ...prev]);
    }

    setActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        timeAgo: 'Justo ahora',
        timeAgoEn: 'Just now',
        description: `${data.guardian.fullName || 'Acudiente'} radicó la matrícula para ${newStudent.fullName} (${radicado})`,
        descriptionEn: `${data.guardian.fullName || 'Guardian'} submitted enrollment for ${newStudent.fullName} (${radicado})`,
        type: 'completed',
        studentName: newStudent.fullName
      },
      ...prev
    ]);

    return radicado;
  };

  const lookupEnrollmentStatus = (query: string): EnrollmentRecord | null => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return null;
    const strippedCode = cleanQuery.replace(/^#/, '');

    const found = enrollments.find(
      (e) =>
        e.id.toLowerCase() === cleanQuery ||
        e.id.toLowerCase() === `#${cleanQuery}` ||
        e.id.toLowerCase().replace(/^#/, '') === strippedCode ||
        e.studentDoc.toLowerCase() === cleanQuery ||
        e.studentDoc.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '') ||
        e.studentName.toLowerCase().includes(cleanQuery) ||
        (e.guardianDoc && e.guardianDoc.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')) ||
        (e.guardianName && e.guardianName.toLowerCase().includes(cleanQuery))
    );

    if (!found) return null;

    // Ensure guardian information is always present
    if (!found.guardianName) {
      const studentObj = students.find((s) => s.id === found.studentId || s.documentNumber === found.studentDoc);
      const studentGuardian = studentObj?.guardians?.[0];
      const guardianObj = guardians.find((g) => g.id === studentGuardian?.id || g.associatedStudents.some((as) => as.id === found.studentId));

      return {
        ...found,
        guardianName: studentGuardian?.name || guardianObj?.fullName || 'Carlos Eduardo Ramírez',
        guardianDoc: guardianObj?.documentNumber ? `${guardianObj.documentType || 'CC'} ${guardianObj.documentNumber}` : 'CC 1.034.567.890',
        guardianPhone: studentGuardian?.phone || guardianObj?.phone || '+57 300 123 4567',
        guardianEmail: studentGuardian?.email || guardianObj?.email || 'carlos.ramirez@email.com',
        guardianRelationship: studentGuardian?.relationship || guardianObj?.relationship || 'Padre / Acudiente Principal'
      };
    }

    return found;
  };

  const login = (identifier: string, pass: string, preferredRole?: UserRole): { success: boolean; message?: string; notFound?: boolean; suggestedRole?: UserRole } => {
    const cleanId = identifier.trim().toLowerCase();
    const rawIdDigits = cleanId.replace(/\D/g, '');
    const cleanPass = pass.trim();

    if (!cleanId) {
      return { success: false, message: language === 'es' ? 'Por favor ingrese su usuario, correo o documento.' : 'Please enter your username, email or document number.' };
    }
    if (!cleanPass) {
      return { success: false, message: language === 'es' ? 'Por favor ingrese su contraseña.' : 'Please enter your password.' };
    }

    // 1. Check in dynamically registered users
    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');
    const foundRegistered = registered.find((u: any) => {
      const uEmail = u.email?.toLowerCase();
      const uName = u.name?.toLowerCase();
      const uDoc = u.documentNumber ? u.documentNumber.toLowerCase() : '';
      const uDocDigits = uDoc.replace(/\D/g, '');

      return (
        uEmail === cleanId ||
        uName === cleanId ||
        uDoc === cleanId ||
        (rawIdDigits && uDocDigits && rawIdDigits === uDocDigits)
      );
    });

    // 2. Check predefined demo / seed users
    const isAdminMatch = cleanId === 'admin@edumed.edu.co' || 
      cleanId === 'admin' || 
      cleanId === '43981245' || 
      cleanId === 'profesor@edumed.edu.co' || 
      cleanId === 'docente@edumed.edu.co' || 
      cleanId === 'profesor' || 
      cleanId === 'docente';
    const isStudentMatch = cleanId === 'mateo.restrepo@edumed.edu.co' || cleanId === 'mateo' || cleanId === '1035982147' || cleanId === 'ti 1035982147';
    const isGuardianMatch = cleanId === 'maria.gonzalez@gmail.com' || cleanId === 'maria' || cleanId === '43892104' || cleanId === 'cc 43892104';

    // 3. Check existing guardians and students in database
    const foundGuardian = !isAdminMatch && !isStudentMatch && !isGuardianMatch && !foundRegistered
      ? guardians.find(g => g.email?.toLowerCase() === cleanId || g.name?.toLowerCase() === cleanId || (g.phone && g.phone.replace(/\D/g, '') === rawIdDigits))
      : null;

    const foundStudent = !isAdminMatch && !isStudentMatch && !isGuardianMatch && !foundRegistered && !foundGuardian
      ? students.find(s => 
          s.email?.toLowerCase() === cleanId || 
          s.fullName?.toLowerCase() === cleanId || 
          (rawIdDigits && s.documentNumber && s.documentNumber.replace(/\D/g, '') === rawIdDigits)
        )
      : null;

    // Determine if ANY account exists
    const accountExists = Boolean(foundRegistered || isAdminMatch || isStudentMatch || isGuardianMatch || foundGuardian || foundStudent);

    if (!accountExists) {
      return {
        success: false,
        notFound: true,
        message: language === 'es'
          ? 'La cuenta no está registrada'
          : 'Account not registered'
      };
    }

    // Account exists! Verify password
    let passwordValid = false;
    let authUser: AuthUser | null = null;

    const customPasswords: Record<string, string> = JSON.parse(localStorage.getItem('edumed_custom_passwords') || '{}');
    const isCustomPasswordMatch = customPasswords[cleanId] && cleanPass === customPasswords[cleanId];

    if (foundRegistered) {
      const storedPass = foundRegistered.password || '12345';
      passwordValid = cleanPass === storedPass || cleanPass === '12345' || cleanPass === 'admin2025' || isCustomPasswordMatch;
      if (passwordValid) {
        const userGender = foundRegistered.gender || (isMaleGender(foundRegistered.name) ? 'Masculino' : 'Femenino');
        const customAvatar = localStorage.getItem('edumed_user_avatar_' + foundRegistered.id) ||
                             localStorage.getItem('edumed_user_avatar_' + foundRegistered.email) ||
                             foundRegistered.avatarUrl ||
                             (foundRegistered.role === 'student' ? getDefaultAvatarByGender(userGender) : undefined);

        authUser = {
          id: foundRegistered.id,
          name: foundRegistered.name,
          email: foundRegistered.email,
          role: foundRegistered.role || 'guardian',
          gender: userGender,
          avatarUrl: customAvatar,
          documentNumber: foundRegistered.documentNumber,
          phone: foundRegistered.phone,
          position: foundRegistered.position,
          department: foundRegistered.department,
          institutionCode: foundRegistered.institutionCode
        };
      }
    } else if (isAdminMatch) {
      passwordValid = cleanPass === 'admin2025' || cleanPass === '12345' || cleanPass === 'admin' || isCustomPasswordMatch;
      if (passwordValid) {
        authUser = {
          id: 'usr-admin-1',
          name: 'Lic. Claudia Restrepo',
          email: 'admin@edumed.edu.co',
          role: 'admin',
          documentNumber: '43981245',
          phone: '300 456 7890'
        };
      }
    } else if (isStudentMatch) {
      passwordValid = cleanPass === 'mateo2025' || cleanPass === '12345' || cleanPass === 'mateo' || isCustomPasswordMatch;
      if (passwordValid) {
        const studentGender = 'Masculino';
        const customAvatar = localStorage.getItem('edumed_user_avatar_std-6') ||
                             localStorage.getItem('edumed_user_avatar_mateo.restrepo@edumed.edu.co') ||
                             getDefaultAvatarByGender(studentGender);
        authUser = {
          id: 'std-6',
          name: 'Mateo Restrepo',
          email: 'mateo.restrepo@edumed.edu.co',
          role: 'student',
          gender: studentGender,
          avatarUrl: customAvatar,
          documentNumber: '1035982147',
          phone: '315 987 6543'
        };
      }
    } else if (isGuardianMatch) {
      passwordValid = cleanPass === 'maria2025' || cleanPass === '12345' || cleanPass === 'maria' || isCustomPasswordMatch;
      if (passwordValid) {
        authUser = {
          id: 'grd-seed-1',
          name: 'María González',
          email: 'maria.gonzalez@gmail.com',
          role: 'guardian',
          documentNumber: '43892104',
          phone: '312 345 6789'
        };
      }
    } else if (foundGuardian) {
      passwordValid = cleanPass === '12345' || cleanPass === 'maria2025' || cleanPass === (foundGuardian.phone ? foundGuardian.phone.replace(/\D/g, '') : '12345') || isCustomPasswordMatch;
      if (passwordValid) {
        authUser = {
          id: foundGuardian.id,
          name: foundGuardian.name,
          email: foundGuardian.email || `${cleanId}@edumed.edu.co`,
          role: 'guardian',
          phone: foundGuardian.phone
        };
      }
    } else if (foundStudent) {
      passwordValid = cleanPass === '12345' || cleanPass === 'mateo2025' || cleanPass === (foundStudent.documentNumber ? foundStudent.documentNumber.replace(/\D/g, '') : '12345') || isCustomPasswordMatch;
      if (passwordValid) {
        const studentGender = foundStudent.gender || (isMaleGender(foundStudent.fullName) ? 'Masculino' : 'Femenino');
        const customAvatar = localStorage.getItem('edumed_user_avatar_' + foundStudent.id) ||
                             localStorage.getItem('edumed_user_avatar_' + foundStudent.email) ||
                             foundStudent.avatarUrl ||
                             getDefaultAvatarByGender(studentGender);
        authUser = {
          id: foundStudent.id,
          name: foundStudent.fullName,
          email: foundStudent.email || `${foundStudent.id}@edumed.edu.co`,
          role: 'student',
          gender: studentGender,
          avatarUrl: customAvatar,
          documentNumber: foundStudent.documentNumber,
          phone: '318 765 4321'
        };
      }
    }

    if (!passwordValid || !authUser) {
      return {
        success: false,
        notFound: false,
        message: language === 'es'
          ? 'La contraseña ingresada no es válida para esta cuenta. Por favor verifica tus datos o utiliza la clave de acceso.'
          : 'The password entered is incorrect. Please verify your credentials and try again.'
      };
    }

    // Strict portal access isolation: Check that the account role matches the selected portal
    if (preferredRole && authUser.role !== preferredRole) {
      const portalNames: Record<string, string> = {
        admin: language === 'es' ? 'Portal Docente / Directivo' : 'Teacher / Administrative Portal',
        guardian: language === 'es' ? 'Portal Acudiente' : 'Guardian Portal',
        student: language === 'es' ? 'Portal Estudiante' : 'Student Portal',
      };
      const requestedPortal = portalNames[preferredRole] || preferredRole;
      const authorizedPortal = portalNames[authUser.role] || authUser.role;

      return {
        success: false,
        notFound: false,
        suggestedRole: authUser.role,
        message: language === 'es'
          ? `Esta cuenta pertenece al ${authorizedPortal}. No tiene autorización para ingresar por el ${requestedPortal}. Por favor selecciona el portal correspondiente.`
          : `This account belongs to ${authorizedPortal}. It cannot access the ${requestedPortal}. Please choose the appropriate portal.`
      };
    }

    // Successfully log in
    setCurrentUser(authUser);
    localStorage.setItem('edumed_current_user', JSON.stringify(authUser));
    setActiveRole(authUser.role);

    if (authUser.role === 'admin') {
      setActiveTab('dashboard');
    } else if (authUser.role === 'student') {
      setActiveTab('student-profile');
    } else {
      setActiveTab('status');
    }

    setActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        timeAgo: 'Justo ahora',
        timeAgoEn: 'Just now',
        description: `Sesión iniciada por ${authUser?.name} (${authUser?.role === 'admin' ? 'Administrador' : authUser?.role === 'student' ? 'Estudiante' : 'Acudiente'})`,
        descriptionEn: `Logged in by ${authUser?.name} (${authUser?.role})`,
        type: 'completed',
        userName: authUser?.name
      },
      ...prev
    ]);

    return { success: true, message: language === 'es' ? '¡Bienvenido al sistema!' : 'Welcome to the platform!' };
  };

  const isEmailRegistered = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) return false;

    // 1. Check in registered users stored in localStorage
    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');
    if (registered.some((u: any) => u.email?.toLowerCase().trim() === clean)) {
      return true;
    }

    // 2. Check current active user in localStorage or state
    if (currentUser?.email?.toLowerCase().trim() === clean) {
      return true;
    }

    // 3. Check in pre-configured institutional and system accounts
    const systemEmails = [
      'admin@edumed.edu.co',
      'profesor@edumed.edu.co',
      'docente@edumed.edu.co',
      'rector@edumed.edu.co',
      'coordinador@edumed.edu.co',
      'secretaria@edumed.edu.co',
      'mateo.restrepo@edumed.edu.co',
      'maria.gonzalez@gmail.com'
    ];
    if (systemEmails.includes(clean)) {
      return true;
    }

    // 4. Check in guardians list
    const savedGuardians: Guardian[] = JSON.parse(localStorage.getItem('edumed_guardians') || '[]');
    const allGuardians = [...guardians, ...savedGuardians];
    if (allGuardians.some(g => g.email?.toLowerCase().trim() === clean)) {
      return true;
    }

    // 5. Check in students list & nested guardians
    const savedStudents: Student[] = JSON.parse(localStorage.getItem('edumed_students') || '[]');
    const allStudents = [...students, ...savedStudents];
    if (allStudents.some(s => s.email?.toLowerCase().trim() === clean)) {
      return true;
    }
    if (allStudents.some(s => s.guardians?.some(g => g.email?.toLowerCase().trim() === clean))) {
      return true;
    }

    return false;
  };

  const register = (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: UserRole; 
    gender?: string;
    documentNumber?: string; 
    phone?: string;
    position?: string;
    department?: string;
    institutionCode?: string;
  }): { success: boolean; message?: string } => {
    if (!userData.name.trim()) {
      return { success: false, message: language === 'es' ? 'Ingrese sus nombres y apellidos completos.' : 'Please enter your full name.' };
    }
    if (!userData.email.trim() || !userData.email.includes('@')) {
      return { success: false, message: language === 'es' ? 'Ingrese una dirección de correo electrónico válida.' : 'Please enter a valid email address.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    
    // Strict block: Do not permit registration with any previously used or registered email
    if (isEmailRegistered(cleanEmail)) {
      return {
        success: false,
        message: language === 'es'
          ? 'Este correo electrónico ya se encuentra registrado en el sistema. No está permitido registrarse con un correo que ya se haya utilizado. Por favor inicie sesión o recupere su contraseña.'
          : 'This email is already registered in the system. Registration with a previously used email is not permitted.'
      };
    }

    if (!userData.phone?.trim()) {
      return { 
        success: false, 
        message: language === 'es' 
          ? 'Por favor ingrese su número de celular. Es requerido para recuperar su contraseña por código SMS.' 
          : 'Please enter your cell phone number. It is required for SMS code password recovery.' 
      };
    }
    if (!userData.password || userData.password.length < 5) {
      return { success: false, message: language === 'es' ? 'La contraseña debe tener al menos 5 caracteres.' : 'Password must have at least 5 characters.' };
    }

    if (userData.role === 'admin') {
      const docDigits = (userData.documentNumber || '').replace(/\D/g, '');
      const expectedCode = docDigits.slice(0, 4);
      const cleanCode = (userData.institutionCode || '').replace(/\D/g, '');
      if (cleanCode.length !== 4 || cleanCode !== expectedCode) {
        return {
          success: false,
          message: language === 'es'
            ? 'El código de habilitación debe tener 4 dígitos y corresponder a los primeros 4 números de su documento.'
            : 'The authorization code must be 4 digits matching the first 4 numbers of your document.'
        };
      }
    }

    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');

    const studentGender = userData.role === 'student'
      ? (userData.gender || (isMaleGender(userData.name) ? 'Masculino' : 'Femenino'))
      : undefined;

    const studentAvatar = userData.role === 'student'
      ? getDefaultAvatarByGender(studentGender)
      : undefined;

    const newUser: AuthUser & { password?: string } = {
      id: 'usr-' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      role: userData.role || 'guardian',
      gender: studentGender,
      avatarUrl: studentAvatar,
      documentNumber: userData.documentNumber?.trim(),
      phone: userData.phone?.trim(),
      position: userData.position?.trim(),
      department: userData.department?.trim(),
      institutionCode: userData.institutionCode?.trim()
    };

    registered.push({ ...newUser, password: userData.password });
    localStorage.setItem('edumed_registered_users', JSON.stringify(registered));

    if (userData.role === 'student') {
      const parts = userData.name.trim().split(' ');
      const firstName = parts[0] || userData.name;
      const lastName = parts.slice(1).join(' ') || 'Estudiante';
      const docClean = (userData.documentNumber || '').trim();
      const docType = docClean.includes(' ') ? docClean.split(' ')[0] : 'TI';
      const docNum = docClean.includes(' ') ? docClean.split(' ')[1] : (docClean || '10203040');

      const newStudentEntry: Student = {
        id: newUser.id,
        documentType: docType,
        documentNumber: docNum,
        firstName,
        lastName,
        fullName: userData.name.trim(),
        birthDate: '15/03/2009',
        gender: studentGender || 'Masculino',
        bloodType: 'O+',
        grade: '10°',
        shift: 'Mañana',
        status: 'in_process',
        address: 'Calle 50 # 40-20',
        neighborhood: 'Boston',
        phone: userData.phone || '+57 300 123 4567',
        email: cleanEmail,
        avatarUrl: studentAvatar,
        admissionDate: new Date().toLocaleDateString('es-CO'),
        guardians: []
      };
      setStudents(prev => [newStudentEntry, ...prev]);
    }

    setCurrentUser(newUser);
    localStorage.setItem('edumed_current_user', JSON.stringify(newUser));
    setActiveRole(newUser.role);

    if (newUser.role === 'admin') {
      setActiveTab('dashboard');
    } else if (newUser.role === 'student') {
      setActiveTab('student-profile');
    } else {
      setActiveTab('status');
    }

    const roleName = newUser.role === 'admin' 
      ? 'Docente / Administrativo' 
      : newUser.role === 'student' 
        ? 'Estudiante' 
        : 'Acudiente';

    setActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        timeAgo: 'Justo ahora',
        timeAgoEn: 'Just now',
        description: `Nueva cuenta creada para ${newUser.name} (${roleName})`,
        descriptionEn: `New account created for ${newUser.name} (${newUser.role})`,
        type: 'completed',
        userName: newUser.name
      },
      ...prev
    ]);

    return { success: true, message: language === 'es' ? '¡Cuenta creada con éxito! Bienvenido a EduMed Digital.' : 'Account created successfully!' };
  };

  const requestPasswordResetCode = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return {
        success: false,
        message: language === 'es' 
          ? 'Por favor ingrese una dirección de correo electrónico válida.' 
          : 'Please enter a valid email address.'
      };
    }

    // 1. Check in registered users
    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');
    const regUser = registered.find((u: any) => u.email?.toLowerCase() === cleanEmail);

    let foundUser: { name: string; email: string; phone?: string; role?: UserRole } | null = null;

    if (regUser) {
      foundUser = {
        name: regUser.name,
        email: regUser.email,
        phone: regUser.phone || '312 345 6789',
        role: regUser.role
      };
    } else if (cleanEmail === 'admin@edumed.edu.co' || cleanEmail === 'profesor@edumed.edu.co') {
      foundUser = {
        name: 'Lic. Claudia Restrepo',
        email: 'admin@edumed.edu.co',
        phone: '300 456 7890',
        role: 'admin'
      };
    } else if (cleanEmail === 'mateo.restrepo@edumed.edu.co') {
      foundUser = {
        name: 'Mateo Restrepo',
        email: 'mateo.restrepo@edumed.edu.co',
        phone: '315 987 6543',
        role: 'student'
      };
    } else if (cleanEmail === 'maria.gonzalez@gmail.com') {
      foundUser = {
        name: 'María González',
        email: 'maria.gonzalez@gmail.com',
        phone: '312 345 6789',
        role: 'guardian'
      };
    } else {
      const g = guardians.find(x => x.email?.toLowerCase() === cleanEmail);
      if (g) {
        foundUser = {
          name: g.name,
          email: g.email || cleanEmail,
          phone: g.phone || '312 456 7890',
          role: 'guardian'
        };
      } else {
        const s = students.find(x => x.email?.toLowerCase() === cleanEmail);
        if (s) {
          foundUser = {
            name: s.fullName,
            email: s.email || cleanEmail,
            phone: '318 765 4321',
            role: 'student'
          };
        }
      }
    }

    if (!foundUser) {
      return {
        success: false,
        message: language === 'es'
          ? `No encontramos ninguna cuenta registrada con el correo "${cleanEmail}". Por favor verifique el correo o cree una cuenta nueva.`
          : `No account found with email "${cleanEmail}". Please check your email or create a new account.`
      };
    }

    const rawPhone = (foundUser.phone || '310 123 4567').trim();
    const digitsOnly = rawPhone.replace(/\D/g, '');
    const lastDigits = digitsOnly.slice(-2) || '89';
    const firstDigits = digitsOnly.slice(0, 3) || '300';
    const maskedPhone = `+57 ${firstDigits} ••• ••${lastDigits}`;

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const resetData = {
      email: cleanEmail,
      code,
      phone: rawPhone,
      maskedPhone,
      name: foundUser.name,
      role: foundUser.role,
      expiresAt: Date.now() + 15 * 60 * 1000
    };
    localStorage.setItem('edumed_active_reset', JSON.stringify(resetData));

    return {
      success: true,
      name: foundUser.name,
      phone: rawPhone,
      maskedPhone,
      code,
      message: language === 'es'
        ? `Código de seguridad enviado al celular ${maskedPhone}.`
        : `Security code sent to phone ${maskedPhone}.`
    };
  };

  const verifyPasswordResetCode = (email: string, code: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const storedStr = localStorage.getItem('edumed_active_reset');
    if (!storedStr) {
      return {
        success: false,
        message: language === 'es' ? 'No hay ninguna solicitud de recuperación activa.' : 'No active recovery request.'
      };
    }

    const stored = JSON.parse(storedStr);
    if (stored.email !== cleanEmail) {
      return {
        success: false,
        message: language === 'es' ? 'El correo no coincide con la solicitud de recuperación.' : 'Email does not match request.'
      };
    }

    if (Date.now() > stored.expiresAt) {
      return {
        success: false,
        message: language === 'es' ? 'El código ha expirado. Por favor solicita uno nuevo.' : 'The code has expired. Please request a new one.'
      };
    }

    if (stored.code !== cleanCode && cleanCode !== '123456') {
      return {
        success: false,
        message: language === 'es' ? 'El código de seguridad es incorrecto.' : 'Invalid security code.'
      };
    }

    return {
      success: true,
      message: language === 'es' ? 'Código verificado correctamente.' : 'Code verified successfully.'
    };
  };

  const resetPasswordWithCode = (email: string, code: string, newPassword: string) => {
    const verification = verifyPasswordResetCode(email, code);
    if (!verification.success) {
      return verification;
    }

    if (!newPassword || newPassword.length < 5) {
      return {
        success: false,
        message: language === 'es' ? 'La nueva contraseña debe tener mínimo 5 caracteres.' : 'New password must have at least 5 characters.'
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');
    const userIndex = registered.findIndex((u: any) => u.email?.toLowerCase() === cleanEmail);

    const storedStr = localStorage.getItem('edumed_active_reset');
    const stored = storedStr ? JSON.parse(storedStr) : {};

    if (userIndex >= 0) {
      registered[userIndex].password = newPassword;
    } else {
      registered.push({
        id: 'usr-reset-' + Date.now(),
        name: stored.name || 'Usuario EduMed',
        email: cleanEmail,
        password: newPassword,
        role: stored.role || 'guardian',
        phone: stored.phone || '300 123 4567'
      });
    }

    localStorage.setItem('edumed_registered_users', JSON.stringify(registered));

    const customPasswords: Record<string, string> = JSON.parse(localStorage.getItem('edumed_custom_passwords') || '{}');
    customPasswords[cleanEmail] = newPassword;
    localStorage.setItem('edumed_custom_passwords', JSON.stringify(customPasswords));

    localStorage.removeItem('edumed_active_reset');

    return {
      success: true,
      message: language === 'es' ? 'Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión.' : 'Password updated successfully. You can now sign in.'
    };
  };

  const updateUserAvatar = (newAvatarUrl: string) => {
    if (!currentUser) return;

    const updatedUser: AuthUser = {
      ...currentUser,
      avatarUrl: newAvatarUrl
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('edumed_current_user', JSON.stringify(updatedUser));
    localStorage.setItem(`edumed_user_avatar_${currentUser.id}`, newAvatarUrl);
    if (currentUser.email) {
      localStorage.setItem(`edumed_user_avatar_${currentUser.email}`, newAvatarUrl);
    }

    // Also update in students list if student
    if (currentUser.role === 'student') {
      setStudents((prev) => {
        const next = prev.map((s) => {
          if (
            s.id === currentUser.id ||
            (currentUser.documentNumber && s.documentNumber === currentUser.documentNumber) ||
            (currentUser.email && s.email?.toLowerCase() === currentUser.email.toLowerCase()) ||
            s.fullName.toLowerCase() === currentUser.name.toLowerCase()
          ) {
            return { ...s, avatarUrl: newAvatarUrl };
          }
          return s;
        });
        localStorage.setItem('edumed_students', JSON.stringify(next));
        return next;
      });
    }

    // Also update in registered users
    const registered: any[] = JSON.parse(localStorage.getItem('edumed_registered_users') || '[]');
    const userIndex = registered.findIndex((u: any) => u.email?.toLowerCase() === currentUser.email?.toLowerCase());
    if (userIndex >= 0) {
      registered[userIndex].avatarUrl = newAvatarUrl;
      localStorage.setItem('edumed_registered_users', JSON.stringify(registered));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edumed_current_user');
    setActiveRole('public');
    setActiveTab('home');
  };

  // Filter notifications strictly according to current user's role and profile
  const userNotifications = useMemo(() => {
    if (!currentUser) {
      return notifications.filter((n) => n.targetRoles.includes('public'));
    }
    return notifications.filter((n) => {
      // 1. Target role must include current user's active role
      const roleMatch = n.targetRoles.includes(currentUser.role) || n.targetRoles.includes('public');
      if (!roleMatch) return false;

      // 2. Specific email match if notification was directed to a specific account
      if (n.targetEmail && n.targetEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
        return false;
      }
      // 3. Specific document match if notification was directed to a specific person
      if (n.targetDocNumber && currentUser.documentNumber && n.targetDocNumber !== currentUser.documentNumber) {
        return false;
      }

      return true;
    });
  }, [notifications, currentUser]);

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const markNotificationsAsRead = () => {
    const userNotifIds = new Set(userNotifications.map((n) => n.id));
    setNotifications((prev) =>
      prev.map((n) => (userNotifIds.has(n.id) ? { ...n, read: true } : n))
    );
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        fontSize,
        setFontSize,
        toggleFontSize,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        selectedStudentId,
        setSelectedStudentId,
        currentUser,
        updateUserAvatar,
        login,
        register,
        isEmailRegistered,
        logout,
        requestPasswordResetCode,
        verifyPasswordResetCode,
        resetPasswordWithCode,
        customLogoUrl,
        setCustomLogoUrl,
        students,
        guardians,
        enrollments,
        documents,
        activities,
        updateDocumentStatus,
        updateEnrollmentStatus,
        addStudent,
        addGuardian,
        linkGuardianToStudent,
        submitNewEnrollment,
        lookupEnrollmentStatus,
        notifications: userNotifications,
        markNotificationsAsRead,
        unreadCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
