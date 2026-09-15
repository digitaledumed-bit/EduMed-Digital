import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Award, 
  Utensils, 
  Bus, 
  Laptop, 
  HeartHandshake, 
  BookOpen, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Home
} from 'lucide-react';

export const BeneficiosView: React.FC = () => {
  const { language, setActiveTab } = useApp();

  const benefitsList = [
    {
      icon: Award,
      title: language === 'es' ? 'Educación 100% Gratuita y Oficial' : '100% Free Official Education',
      desc: language === 'es' 
        ? 'Sin costos de matrícula ni mensualidades para todos los grados escolares desde preescolar hasta grado 11°.' 
        : 'Zero tuition or monthly fees across all school grades from preschool through 11th grade.',
      color: 'teal'
    },
    {
      icon: Utensils,
      title: language === 'es' ? 'Programa de Alimentación Escolar (PAE)' : 'School Meal Program (PAE)',
      desc: language === 'es' 
        ? 'Complemento alimentario nutricional diario para estudiantes en ambas jornadas (mañana y tarde).' 
        : 'Daily nutritional dietary complement for students in both morning and afternoon schedules.',
      color: 'amber'
    },
    {
      icon: Bus,
      title: language === 'es' ? 'Beneficio de Transporte Escolar' : 'School Transportation Subsidy',
      desc: language === 'es' 
        ? 'Convenio con la tarjeta Cívica Estudiantil del Metro de Medellín para desplazamientos seguros y subsidiados.' 
        : 'Partnership with the Medellin Metro Civic Student card for safe and subsidized travel.',
      color: 'blue'
    },
    {
      icon: Laptop,
      title: language === 'es' ? 'Aulas Digitales y Conectividad' : 'Digital Classrooms & Tech',
      desc: language === 'es' 
        ? 'Salas de cómputo actualizadas, acceso a internet institucional y recursos interactivos de aprendizaje.' 
        : 'Modern computer labs, campus-wide internet connectivity, and interactive digital learning resources.',
      color: 'indigo'
    },
    {
      icon: BookOpen,
      title: language === 'es' ? 'Articulación Técnica con el SENA' : 'SENA Technical Certification',
      desc: language === 'es' 
        ? 'Doble titulación para estudiantes de 10° y 11° en áreas tecnológicas y comerciales con alta demanda laboral.' 
        : 'Dual-degree graduation for 10th and 11th graders in technological and commercial vocational fields.',
      color: 'emerald'
    },
    {
      icon: HeartHandshake,
      title: language === 'es' ? 'Seguro Estudiantil y Bienestar' : 'Student Insurance & Wellness',
      desc: language === 'es' 
        ? 'Póliza de accidentes escolares vigente 24/7 y acompañamiento integral por psicología y orientación escolar.' 
        : '24/7 school accident insurance coverage and psychological counseling and student guidance services.',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 inline-block">
              {language === 'es' ? 'Bienestar y Calidad Educativa' : 'Student Welfare & Quality'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {language === 'es' ? 'Beneficios de la I.E. Félix Henao Botero' : 'Félix Henao Institutional Benefits'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {language === 'es' 
                ? 'Garantizamos el acceso a una educación pública de excelencia mediante programas de apoyo social, técnico y pedagógico que respaldan a las familias y estudiantes en su proyecto de vida.'
                : 'We guarantee access to high quality public education through social, technical, and pedagogical support programs that empower families and students.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('wizard')}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'es' ? 'Iniciar Matrícula' : 'Start Enrollment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>{language === 'es' ? 'Volver a Inicio' : 'Return to Home'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:border-teal-500/50 transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-100 dark:border-teal-900 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'es' ? 'Beneficio Oficial Activo' : 'Active Official Benefit'}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
