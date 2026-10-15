export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type UserRole = 'public' | 'admin' | 'guardian' | 'student' | 'teacher';

export interface TeacherCourseAssignment {
  id: string;
  teacherId: string;
  courseName: string;
  grade: string;
  subject: string;
  shift: string;
  academicYear: string;
  studentCount?: number;
}

export interface DocumentAuditEvent {
  id: string;
  documentId: string;
  documentName: string;
  studentId: string;
  studentName: string;
  action: 'create' | 'upload' | 'view' | 'download' | 'approve' | 'reject' | 'delete';
  actionLabel: string;
  actionLabelEn: string;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  timestamp: string;
  details?: string;
}

export type EnrollmentStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
export type DocumentStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface Student {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  grade: string;
  shift: string; // Mañana / Tarde
  status: 'active' | 'inactive' | 'in_process';
  address: string;
  neighborhood: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  admissionDate: string;
  previousSchool?: string;
  medicalNotes?: string;
  guardians: GuardianRef[];
}

export interface GuardianRef {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  livesWithStudent: boolean;
}

export interface Guardian {
  id: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  associatedStudents: {
    id: string;
    name: string;
    grade: string;
  }[];
}

export interface EnrollmentRecord {
  id: string; // #MAT-24-001
  studentId: string;
  studentName: string;
  studentDoc: string;
  academicYear: string;
  grade: string;
  submissionDate: string;
  status: EnrollmentStatus;
  step: number;
  lastUpdated: string;
  notes?: string;
  guardianName?: string;
  guardianDoc?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelationship?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  category: 'identity' | 'health' | 'academic' | 'other';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: DocumentStatus;
  rejectionReason?: string;
  fileUrl?: string;
}

export interface ActivityItem {
  id: string;
  timeAgo: string;
  timeAgoEn: string;
  description: string;
  descriptionEn: string;
  type: 'completed' | 'review' | 'payment' | 'admin' | 'warning';
  userName?: string;
  studentName?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  gender?: string;
  documentNumber?: string;
  phone?: string;
  position?: string;
  department?: string;
  institutionCode?: string;
  guardianValidationCode?: string;
  username?: string;
  employeeCode?: string;
  positionSummary?: string;
  permissions?: RolePermissions;
}

export interface AppNotification {
  id: string;
  title: string;
  titleEn?: string;
  message: string;
  messageEn?: string;
  date: string;
  dateEn?: string;
  read: boolean;
  targetRoles: ('admin' | 'guardian' | 'student' | 'public')[];
  targetDocNumber?: string;
  targetEmail?: string;
  category?: 'academic' | 'administrative' | 'enrollment' | 'document' | 'general';
}

export interface PortalModuleItem {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  enabled: boolean;
  order: number;
  iconName: string;
  requiredRole?: UserRole;
  isCore?: boolean;
}

export interface PortalWidgetItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'kpi' | 'chart' | 'card' | 'action';
  enabled: boolean;
  order: number;
}

export interface RolePermissions {
  canDownloadCertificates: boolean;
  canEditProfile: boolean;
  canUploadAvatar: boolean;
  canEnrollStudents: boolean;
  canAuditDocuments: boolean;
  canManageUsers: boolean;
  canExportReports: boolean;
  canViewAcademicRecords: boolean;
  canConfigurePortals: boolean;
}

export interface RolePortalConfig {
  role: UserRole;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  badgeLabel: string;
  badgeLabelEn: string;
  defaultTab: string;
  modules: PortalModuleItem[];
  widgets: PortalWidgetItem[];
  permissions: RolePermissions;
  lastUpdated?: string;
}

