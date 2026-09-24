export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type UserRole = 'public' | 'admin' | 'guardian' | 'student';

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
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetRoles: ('admin' | 'guardian' | 'student' | 'public')[];
  targetDocNumber?: string;
  targetEmail?: string;
  category?: 'academic' | 'administrative' | 'enrollment' | 'document' | 'general';
}
