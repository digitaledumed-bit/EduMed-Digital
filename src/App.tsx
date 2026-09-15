import React from 'react';
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
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeRole, activeTab, setActiveTab, language, customLogoUrl, currentUser } = useApp();

  // Protect platform: content can only be seen after logging in
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Define admin-only views to enforce strict role isolation
  const adminOnlyTabs = ['dashboard', 'enrollments', 'students', 'link-guardian', 'parents', 'documents', 'settings'];
  const isUnauthorizedAdminTab = currentUser.role !== 'admin' && adminOnlyTabs.includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      {activeRole === 'public' ? (
        <main className="flex-1">
          {(activeTab === 'landing' || activeTab === 'home') && <LandingPage />}
          {activeTab === 'wizard' && <EnrollmentWizard />}
          {activeTab === 'status' && <StatusLookup />}
          {activeTab === 'institucion' && <InstitutionView />}
          {activeTab === 'beneficios' && <BeneficiosView />}
          {activeTab === 'soporte' && <SoporteView />}
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Admin Sidebar */}
          <AdminSidebar />

          {/* Portal Main Body with strict role authorization */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {isUnauthorizedAdminTab ? (
              <div className="max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900/60 p-8 sm:p-10 text-center shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 border border-rose-200 dark:border-rose-800 shadow-xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {language === 'es' ? 'Acceso Restringido a este Portal' : 'Portal Access Restricted'}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? `Esta sección pertenece exclusivamente al Portal Docente y Administrativo de la I.E. Félix Henao Botero. Tu cuenta actual (${currentUser.name}) tiene asignado el rol de ${currentUser.role === 'student' ? 'Estudiante' : 'Acudiente'} y no tiene autorización para consultar estos registros.`
                    : `This section belongs to the Teacher/Admin Portal. Your account does not have permission to view these records.`}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab(currentUser.role === 'student' ? 'student-profile' : 'status')}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    {currentUser.role === 'student'
                      ? (language === 'es' ? 'Ir a Mi Expediente y Notas' : 'Go to My Profile & Grades')
                      : (language === 'es' ? 'Ir a Estado de Matrícula' : 'Go to Enrollment Status')}
                  </button>
                  <button
                    onClick={() => setActiveTab('institucion')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    {language === 'es' ? 'Ver I.E. Félix Henao' : 'View School Info'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <AdminDashboard />}
                {activeTab === 'enrollments' && <EnrollmentsTable />}
                {activeTab === 'students' && <StudentsList />}
                {activeTab === 'student-profile' && <StudentProfileView />}
                {activeTab === 'link-guardian' && <LinkGuardianView />}
                {activeTab === 'parents' && <ParentsList />}
                {activeTab === 'documents' && <DocumentsManagement />}
                {activeTab === 'settings' && <InstitutionalSettings />}
                
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

      {/* Institutional Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <img 
              src={customLogoUrl} 
              alt="Escudo Institución Educativa" 
              className="w-7 h-7 rounded-full object-cover border border-teal-600/50 bg-white shadow-xs"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
              }}
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">I.E. Félix Henao Botero</span>
            <span>•</span>
            <span>{language === 'es' ? 'Sistema Oficial de Matrícula y Gestión Escolar' : 'Official Enrollment & School Management System'}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>DANE: 105001002345</span>
            <span>•</span>
            <span>Medellín, Antioquia</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

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
