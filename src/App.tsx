import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AdminSidebar } from './components/layout/AdminSidebar';
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
import { Shield, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeRole, activeTab, language, customLogoUrl } = useApp();

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

          {/* Admin Main Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'enrollments' && <EnrollmentsTable />}
            {activeTab === 'students' && <StudentsList />}
            {activeTab === 'student-profile' && <StudentProfileView />}
            {activeTab === 'link-guardian' && <LinkGuardianView />}
            {activeTab === 'parents' && <ParentsList />}
            {activeTab === 'documents' && <DocumentsManagement />}
            {activeTab === 'settings' && <InstitutionalSettings />}
            
            {/* Direct fallback to public wizard / status / info if clicked within admin */}
            {(activeTab === 'wizard') && <EnrollmentWizard />}
            {(activeTab === 'status') && <StatusLookup />}
            {(activeTab === 'institucion') && <InstitutionView />}
            {(activeTab === 'beneficios') && <BeneficiosView />}
            {(activeTab === 'soporte') && <SoporteView />}
            {(activeTab === 'landing' || activeTab === 'home') && <LandingPage />}
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
