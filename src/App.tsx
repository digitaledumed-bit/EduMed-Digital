import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { LoginScreen } from './components/auth/LoginScreen';
import { LandingPage } from './components/public/LandingPage';
import { EnrollmentWizard } from './components/public/EnrollmentWizard';
import { StatusLookup } from './components/public/StatusLookup';
import { InstitutionView } from './components/public/InstitutionView';
import { BeneficiosView } from './components/public/BeneficiosView';
import { SoporteView } from './components/public/SoporteView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EnrollmentsTable } from './components/admin/EnrollmentsTable';
import { StudentsList } from './components/admin/StudentsList';
import { StudentProfileView } from './components/admin/StudentProfileView';
import { LinkGuardianView } from './components/admin/LinkGuardianView';
import { ParentsList } from './components/admin/ParentsList';
import { DocumentsManagement } from './components/admin/DocumentsManagement';
import { InstitutionalSettings } from './components/admin/InstitutionalSettings';
import { PortalConfigView } from './components/admin/PortalConfigView';
import { MandatoryEnrollmentGate } from './components/student/MandatoryEnrollmentGate';
import { StudentMainDashboard } from './components/student/StudentMainDashboard';
import { GuardianMainDashboard } from './components/guardian/GuardianMainDashboard';
import { TeacherMainDashboard } from './components/teacher/TeacherMainDashboard';
import { StudentEditProfileModal } from './components/student/StudentEditProfileModal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeRole, 
    activeTab, 
    setActiveTab, 
    language, 
    customLogoUrl, 
    currentUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isStudentEnrollmentCompleted,
    resetStudentEnrollment,
    isModuleEnabled
  } = useApp();

  // Protect platform: content can only be seen after logging in
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Check role authorization and mandatory gates
  const isStudent = currentUser.role === 'student';
  const isGuardian = currentUser.role === 'guardian';
  const isTeacher = currentUser.role === 'teacher';
  const isAdmin = currentUser.role === 'admin';
  const isEnrollmentDone = isStudent ? isStudentEnrollmentCompleted(currentUser.id) : true;

  // Configuration screens (portal-config, settings) must remain strictly hidden from navigation
  React.useEffect(() => {
    if (activeTab === 'portal-config' || activeTab === 'settings') {
      setActiveTab('dashboard');
    }
  }, [activeTab, setActiveTab]);

  // Define admin-only views to enforce strict role isolation
  const adminOnlyTabs = ['enrollments', 'link-guardian', 'parents', 'settings', 'portal-config'];
  const isUnauthorizedAdminTab = !isAdmin && (
    adminOnlyTabs.includes(activeTab) || 
    (!isTeacher && (activeTab === 'students' || activeTab === 'documents'))
  );
  const isModuleAllowed = activeTab === 'dashboard' || isAdmin || isTeacher || isModuleEnabled(currentUser.role, activeTab);
  const isUnauthorized = isUnauthorizedAdminTab || !isModuleAllowed;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar />

        {/* Main Content Area */}
        {activeRole === 'public' ? (
          <main className="flex-1 min-w-0">
            {(activeTab === 'landing' || activeTab === 'home') && <LandingPage />}
            {activeTab === 'wizard' && <EnrollmentWizard />}
            {activeTab === 'status' && <StatusLookup />}
            {activeTab === 'institucion' && <InstitutionView />}
            {activeTab === 'beneficios' && <BeneficiosView />}
            {activeTab === 'soporte' && <SoporteView />}
          </main>
        ) : (
          <div className="flex-1 min-w-0 flex flex-col md:flex-row w-full">
            
            {/* Admin / Role Sidebar */}
            <AdminSidebar />

            {/* Portal Main Body with strict role authorization */}
            <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
              {isUnauthorized ? (
                <div className="max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 p-8 sm:p-10 text-center shadow-lg">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 border border-rose-200 dark:border-rose-800 shadow-xs">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {language === 'es' ? 'Acceso Restringido o Módulo no Autorizado' : 'Portal Access Restricted'}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'es'
                      ? (isUnauthorizedAdminTab
                          ? `Esta sección pertenece exclusivamente al Portal Administrativo y Directivo de la I.E. Félix Henao Botero. Tu cuenta actual (${currentUser.name}) tiene asignado el rol de ${currentUser.role === 'student' ? 'Estudiante' : 'Acudiente'} y no tiene autorización para consultar estos registros.`
                          : `El módulo solicitado ('${activeTab}') no se encuentra activo o autorizado en la configuración del portal para tu rol (${currentUser.role === 'student' ? 'Estudiante' : currentUser.role === 'guardian' ? 'Acudiente' : 'Usuario'}). Por favor consulta con la secretaría académica.`
                        )
                      : `This module is restricted or not authorized for your current user role. Please contact school administration.`}
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                    >
                      {currentUser.role === 'student'
                        ? (language === 'es' ? 'Ir a Mi Portal y Notas' : 'Go to My Portal & Grades')
                        : (language === 'es' ? 'Ir a Mi Portal del Acudiente' : 'Go to Guardian Portal')}
                    </button>
                    <button
                      onClick={() => setActiveTab('institucion')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      {language === 'es' ? 'Ver I.E. Félix Henao' : 'View School Info'}
                    </button>
                  </div>
                </div>
              ) : isStudent && !isEnrollmentDone ? (
                /* MANDATORY ENROLLMENT PROCESS GATE FOR STUDENTS */
                <MandatoryEnrollmentGate 
                  onEnrollmentCompleted={() => setActiveTab('dashboard')} 
                />
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    isStudent ? (
                      <StudentMainDashboard onResetEnrollmentForTest={() => resetStudentEnrollment(currentUser.id)} />
                    ) : isGuardian ? (
                      <GuardianMainDashboard />
                    ) : isTeacher ? (
                      <TeacherMainDashboard initialTab="courses" />
                    ) : (
                      <AdminDashboard />
                    )
                  )}
                  {activeTab === 'students' && (
                    isTeacher ? (
                      <TeacherMainDashboard initialTab="students" />
                    ) : (
                      <StudentsList />
                    )
                  )}
                  {activeTab === 'documents' && (
                    isTeacher ? (
                      <TeacherMainDashboard initialTab="documents" />
                    ) : (
                      <DocumentsManagement />
                    )
                  )}
                  {activeTab === 'enrollments' && isAdmin && <EnrollmentsTable />}
                  {activeTab === 'student-profile' && (
                    isStudent ? (
                      <StudentMainDashboard onResetEnrollmentForTest={() => resetStudentEnrollment(currentUser.id)} />
                    ) : (
                      <StudentProfileView />
                    )
                  )}
                  {activeTab === 'link-guardian' && isAdmin && <LinkGuardianView />}
                  {activeTab === 'parents' && isAdmin && <ParentsList />}
                  
                  {/* Direct views accessible to authorized users */}
                  {(activeTab === 'wizard') && <EnrollmentWizard />}
                  {(activeTab === 'status') && <StatusLookup />}
                  {(activeTab === 'institucion') && <InstitutionView />}
                  {(activeTab === 'beneficios') && <BeneficiosView />}
                  {(activeTab === 'soporte') && <SoporteView />}
                  {(activeTab === 'landing' || activeTab === 'home') && <LandingPage />}
                </>
              )}
            </main>
          </div>
        )}

        {/* Institutional Global Footer (rendered for internal views, wizard, status lookup, etc.) */}
        {!(activeRole === 'public' && (activeTab === 'landing' || activeTab === 'home')) && (
          <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 py-4 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <img 
                  src={customLogoUrl} 
                  alt="Escudo Institución Educativa Félix Henao Botero" 
                  className="w-7 h-7 rounded-full object-cover border border-amber-400 bg-white shadow-2xs"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                  }}
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">I.E. Félix Henao Botero</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {language === 'es' ? 'EduMed Digital · Sistema Oficial de Matrícula y Gestión Escolar' : 'EduMed Digital · Official School Management System'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span>DANE: <strong className="font-mono text-slate-700 dark:text-slate-300">105001002345</strong></span>
                <span>·</span>
                <span>NIT: <strong className="font-mono text-slate-700 dark:text-slate-300">890980123-1</strong></span>
                <span>·</span>
                <span>Medellín, Colombia</span>
                <span>·</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
            </div>
          </footer>
        )}

        {/* User Profile Editing Modal */}
        <StudentEditProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />

      </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
