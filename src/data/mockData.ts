import { Student, Guardian, EnrollmentRecord, StudentDocument, ActivityItem } from '../types';

// Los registros inician limpios para que únicamente aparezcan los usuarios y estudiantes que el usuario matricule o ingrese
export const initialStudents: Student[] = [];

export const initialGuardians: Guardian[] = [];

export const initialEnrollments: EnrollmentRecord[] = [];

export const initialDocuments: StudentDocument[] = [];

export const initialActivities: ActivityItem[] = [];
