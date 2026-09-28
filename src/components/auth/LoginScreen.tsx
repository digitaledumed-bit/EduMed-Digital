import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import { 
  Sun, 
  Moon, 
  Globe, 
  Sparkles,
  Search,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Laptop,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
  LogIn,
  UserPlus,
  Building2,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  X,
  Calendar,
  Compass
} from 'lucide-react';

interface LoginScreenProps {
  onReplaySplash?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onReplaySplash }) => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    customLogoUrl,
    enrollments,
    students
  } = useApp();

  const isEs = language === 'es';

  // Modal de autenticación interactivo (permite abrir login/registro desde cualquier botón)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Modal para ver detalles de las 4 tarjetas (Instituciones, Programas, Matrículas, Cursos)
  const [selectedOpportunityCard, setSelectedOpportunityCard] = useState<string | null>(null);

  // Carrusel automático del Banner Principal
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Quick lookup state
  const [lookupDoc, setLookupDoc] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const authSectionRef = useRef<HTMLDivElement>(null);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  // Slides del carrusel con escenas educativas naturales, modernas y profesionales
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'Formación con Sentido Humano' : 'Comprehensive Education',
      title: isEs ? 'Construye tu futuro' : 'Build Your Future',
      subtitle: isEs 
        ? 'Encuentra oportunidades de formación que se adapten a ti y transforma tus metas en logros reales con educación oficial de calidad.'
        : 'Find educational opportunities that adapt to you and transform your aspirations into real achievements.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Estudiantes aprendiendo' : 'Students learning',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'emerald'
    },
    {
      id: 2,
      badge: isEs ? 'Innovación Escolar & SENA' : 'Tech & Innovation',
      title: isEs ? 'Educación y Tecnología para el Mañana' : 'Education & Technology for Tomorrow',
      subtitle: isEs
        ? 'Aulas interactivas, articulación técnica SENA en sistemas y software, y herramientas digitales para liderar el cambio.'
        : 'Digital classrooms, software tech articulation with SENA, and modern computing tools for future leaders.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Jóvenes utilizando computadores' : 'Students with computers',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'teal'
    },
    {
      id: 3,
      badge: isEs ? 'Ambientes de Estudio Flexibles' : 'Modern Learning Spaces',
      title: isEs ? 'Aprende en Diferentes Espacios' : 'Learn in Inspiring Spaces',
      subtitle: isEs
        ? 'Espacios colaborativos y bibliotecas que estimulan la creatividad, el diálogo constructivo y el aprendizaje a tu propio ritmo.'
        : 'Collaborative spaces, reading corners, and creative environments built for self-paced student discovery.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Personas estudiando en diferentes espacios' : 'Students in varied spaces',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'blue'
    },
    {
      id: 4,
      badge: isEs ? 'I.E. Félix Henao Botero • Medellín' : 'Our School Campus',
      title: isEs ? 'Una Institución Comprometida Contigo' : 'A School Committed to You',
      subtitle: isEs
        ? 'Instalaciones seguras, docentes con vocación y un entorno escolar cálido en la Comuna 8 para acompañar tu crecimiento personal.'
        : 'Safe modern facilities, supportive educators, and a welcoming school environment in Medellín.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Estudiantes entrando a la institución' : 'Students entering school',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'amber'
    },
    {
      id: 5,
      badge: isEs ? 'Cupos 100% Gratuitos 2026' : 'Free 2026 Enrollments',
      title: isEs ? 'Descubre Nuevas Oportunidades de Formación' : 'Discover New Opportunities',
      subtitle: isEs
        ? 'Desde preescolar hasta grado 11° con doble titulación técnica. Programas inclusivos diseñados para abrir puertas a la educación superior.'
        : 'From preschool to 11th grade with technical dual degree. Inclusive public programs opening doors to higher education.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Nuevas oportunidades de formación' : 'Discovering training opportunities',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'purple'
    },
    {
      id: 6,
      badge: isEs ? 'Ciencia & Enfoque STEAM' : 'Science & STEAM',
      title: isEs ? 'Despierta tu Curiosidad y Talento' : 'Awaken Your Curiosity',
      subtitle: isEs
        ? 'Semilleros de robótica, laboratorio de ciencias experimentales y programas bilingües que potencian tus capacidades al máximo.'
        : 'Robotics clubs, modern science lab experiments, and communicative English hubs.',
      ctaText: isEs ? 'Explorar ahora' : 'Explore Now',
      themeCategory: isEs ? 'Educación y tecnología experimental' : 'Hands-on learning',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=85',
      badgeColor: 'cyan'
    }
  ];

  // Cambio automático del carrusel cada 5 segundos
  useEffect(() => {
    if (isCarouselPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isCarouselPaused, heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const scrollToOpportunities = () => {
    opportunitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const scrollToAuthSection = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    authSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDoc = lookupDoc.trim().replace(/\D/g, '');
    if (!cleanDoc) return;

    setLookupSearched(true);
    const foundEnrollment = enrollments.find(e => 
      e.studentDoc?.replace(/\D/g, '').includes(cleanDoc) || 
      e.guardianDoc?.replace(/\D/g, '').includes(cleanDoc) ||
      e.id.toLowerCase().includes(lookupDoc.trim().toLowerCase())
    );

    const foundStudent = students.find(s => 
      s.documentNumber?.replace(/\D/g, '').includes(cleanDoc)
    );

    if (foundEnrollment) {
      setLookupResult({
        type: 'enrollment',
        id: foundEnrollment.id,
        name: foundEnrollment.studentName,
        doc: foundEnrollment.studentDoc,
        grade: foundEnrollment.grade,
        status: foundEnrollment.status,
        step: foundEnrollment.step,
        date: foundEnrollment.submissionDate,
        notes: foundEnrollment.notes
      });
    } else if (foundStudent) {
      setLookupResult({
        type: 'student',
        id: foundStudent.id,
        name: foundStudent.fullName,
        doc: foundStudent.documentNumber,
        grade: foundStudent.grade,
        status: foundStudent.status,
        step: 5,
        date: foundStudent.admissionDate,
        notes: isEs ? 'Estudiante activo matriculado en la institución.' : 'Enrolled active student.'
      });
    } else {
      setLookupResult(null);
    }
  };

  // 4 Tarjetas visuales solicitadas específicamente por el usuario
  const opportunityCards = [
    {
      id: 'instituciones',
      emoji: '🎓',
      icon: Building2,
      title: isEs ? 'Instituciones' : 'Institutions',
      description: isEs 
        ? 'Encuentra instituciones educativas y conoce su oferta.'
        : 'Find educational institutions and explore their academic offering.',
      details: {
        headline: isEs ? 'I.E. Félix Henao Botero - Medellín' : 'I.E. Félix Henao Botero School',
        summary: isEs
          ? 'Institución Educativa Oficial de carácter público en la Comuna 8 de Medellín, comprometida con la excelencia y la inclusión social.'
          : 'Official public school in Medellín providing inclusive education from early childhood to high school technical tracks.',
        campuses: [
          { name: isEs ? 'Sede Principal (Enciso - Boston)' : 'Main Campus', address: 'Calle 52 # 18-40, Comuna 8', grades: isEs ? 'Secundaria y Media Técnica (6° a 11°)' : 'Grades 6-11' },
          { name: isEs ? 'Sede Infantil La Libertad' : 'La Libertad Elementary', address: 'Carrera 22 # 54-15, Medellín', grades: isEs ? 'Preescolar y Primaria (Transición a 5°)' : 'Preschool & Elementary' }
        ],
        codeDane: '105001002345',
        alliance: isEs ? 'Articulación oficial con el SENA' : 'Official partnership with SENA'
      },
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'group-hover:border-teal-500',
      tagColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800'
    },
    {
      id: 'programas',
      emoji: '📚',
      icon: BookOpen,
      title: isEs ? 'Programas' : 'Programs',
      description: isEs 
        ? 'Explora diferentes programas de formación.'
        : 'Explore varied training programs and high school tracks.',
      details: {
        headline: isEs ? 'Oferta de Formación Académica y Técnica' : 'Academic & Technical Programs',
        summary: isEs
          ? 'Formación integral desde primera infancia hasta bachilleres técnicos con doble titulación SENA sin costo.'
          : 'Complete academic tracks from preschool to high school with SENA dual certification.',
        items: [
          { name: isEs ? 'Técnico en Sistemas y Desarrollo' : 'IT & Systems Technician', duration: '2 Años (10° y 11°)', badge: 'SENA' },
          { name: isEs ? 'Técnico en Contabilización y Finanzas' : 'Accounting & Finance', duration: '2 Años (10° y 11°)', badge: 'SENA' },
          { name: isEs ? 'Básica Secundaria con Énfasis STEAM' : 'Middle School STEAM', duration: 'Grados 6° a 9°', badge: isEs ? 'Oficial' : 'Official' },
          { name: isEs ? 'Primaria Integral y Grado Transición' : 'Elementary & Transition', duration: 'Grados Preescolar a 5°', badge: isEs ? 'PAE Gratuito' : 'Meals PAE' }
        ]
      },
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      borderColor: 'group-hover:border-blue-500',
      tagColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'matriculas',
      emoji: '📝',
      icon: FileText,
      title: isEs ? 'Matrículas' : 'Enrollments',
      description: isEs 
        ? 'Consulta qué oportunidades de matrícula están disponibles.'
        : 'Check what enrollment vacancies and admissions are open.',
      details: {
        headline: isEs ? 'Convocatoria Oficial de Matrícula 2026' : 'Official 2026 Admissions',
        summary: isEs
          ? 'El proceso de matrícula en EduMed Digital es 100% virtual, seguro y validado en el sistema oficial SIMAT de la Secretaría de Educación.'
          : 'Online enrollment process connected directly to Medellín official SIMAT educational records.',
        status: isEs ? 'Inscripciones Abiertas • Sin costo ni intermediarios' : 'Admissions Open • 100% Free Tuition',
        steps: [
          isEs ? '1. Diligenciamiento de formulario digital' : '1. Fill online registration form',
          isEs ? '2. Validación de código para acudientes' : '2. Guardian validation code check',
          isEs ? '3. Carga de documentos de identidad y salud' : '3. ID & health records upload',
          isEs ? '4. Confirmación de cupo y carnet digital' : '4. Spot allocation & digital student ID'
        ]
      },
      gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'group-hover:border-amber-500',
      tagColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    },
    {
      id: 'cursos',
      emoji: '💻',
      icon: Laptop,
      title: isEs ? 'Cursos' : 'Courses',
      description: isEs 
        ? 'Descubre cursos para aprender y desarrollar nuevas habilidades.'
        : 'Discover courses to learn and build real-world skills.',
      details: {
        headline: isEs ? 'Semilleros y Habilidades del Siglo XXI' : 'Skill Workshops & Extracurriculars',
        summary: isEs
          ? 'Espacios extracurriculares de formación complementaria para que los estudiantes fortalezcan sus talentos.'
          : 'Complementary extracurricular workshops for digital, language, and scientific development.',
        coursesList: [
          { name: isEs ? 'Semillero de Robótica y Kits Arduino' : 'Robotics & Arduino Lab', schedule: isEs ? 'Jornada Contraclase' : 'After school', certified: isEs ? 'Certificado Escolar' : 'Certified' },
          { name: isEs ? 'Inmersión en Inglés Comunicativo' : 'Communicative English Hub', schedule: isEs ? 'Sábados Mañana' : 'Saturdays', certified: isEs ? '120 Horas' : '120 Hours' },
          { name: isEs ? 'Lógica de Programación Web y Python' : 'Web & Python Coding', schedule: isEs ? 'Aula Virtual' : 'LMS Virtual', certified: isEs ? 'Articulación SENA' : 'SENA Track' },
          { name: isEs ? 'Club de Lectura y Pensamiento Crítico' : 'Debate & Reading Club', schedule: isEs ? 'Tardes Culturales' : 'Cultural afternoons', certified: isEs ? 'Actividad Libre' : 'Free Track' }
        ]
      },
      gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
      borderColor: 'group-hover:border-purple-500',
      tagColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          1. HEADER INSTITUCIONAL OFICIAL (INTACTO SEGÚN INSTRUCCIÓN)
          ========================================================================= */}
      <header className="w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3 select-none">
            <div 
              onClick={onReplaySplash}
              title={onReplaySplash ? (isEs ? 'Ver animación institucional' : 'Replay school animation') : undefined}
              className={`relative shrink-0 ${onReplaySplash ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
            >
              <img 
                src={customLogoUrl} 
                alt="Escudo Institución Educativa Félix Henao Botero" 
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-sm bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <span 
                className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-[8px] uppercase tracking-wider border border-white shadow-xs"
                title="Articulación Técnica SENA"
              >
                SENA
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                  edumed <span className="text-teal-600 dark:text-teal-400 font-extrabold">digital</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                  {isEs ? 'Portal Oficial' : 'Official Portal'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                I.E. Félix Henao Botero
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Medellín • Comuna 8 • DANE 105001002345
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button 
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 font-bold transition-colors cursor-pointer"
            >
              {isEs ? 'Inicio' : 'Home'}
            </button>
            <a 
              href="#oportunidades"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isEs ? 'Oportunidades' : 'Opportunities'}
            </a>
            <a 
              href="#portales"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isEs ? 'Portales' : 'Portals'}
            </a>
            <a 
              href="#consulta-cupo"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isEs ? 'Consultar Cupo' : 'Check Status'}
            </a>
            <a 
              href="#contacto"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isEs ? 'Sedes y Contacto' : 'Campuses'}
            </a>
          </nav>

          {/* Action Buttons: Ingresar & Registrarme & Settings */}
          <div className="flex items-center gap-2">
            
            {/* Botón Ingresar */}
            <button
              type="button"
              onClick={() => handleOpenAuthModal('login')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#002f49] hover:bg-[#001e30] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEs ? 'Ingresar' : 'Sign In'}</span>
            </button>

            {/* Botón Registrarme */}
            <button
              type="button"
              onClick={() => handleOpenAuthModal('register')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-teal-600/70 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">{isEs ? 'Registrarme' : 'Register'}</span>
              <span className="sm:hidden">{isEs ? 'Registro' : 'Reg'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title={theme === 'light' ? (isEs ? 'Modo Oscuro' : 'Dark Mode') : (isEs ? 'Modo Claro' : 'Light Mode')}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(isEs ? 'en' : 'es')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              title={isEs ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isEs ? 'ES' : 'EN'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* =========================================================================
          2. BANNER PRINCIPAL CON CARRUSEL AUTOMÁTICO DE IMÁGENES EDUCATIVAS
          ========================================================================= */}
      <section 
        className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center select-none"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        {/* Diapositivas con transición suave de opacidad y sutil zoom */}
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Fotografía de fondo de alta resolución */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Degradados profesionales para garantizar legibilidad óptima WCAG */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
              
              {/* Textura sutil y reflejo luminoso ambiental */}
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

              {/* Contenido textual sobre la imagen */}
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-20 h-full flex flex-col justify-center">
                <div className="max-w-2xl text-left space-y-4 sm:space-y-6">
                  
                  {/* Badge de categoría / escena */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Título Principal Atractivo */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700">
                    {slide.title}
                  </h1>

                  {/* Subtítulo corto y moderno */}
                  <p className="text-sm sm:text-lg text-slate-200/95 font-normal leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.subtitle}
                  </p>

                  {/* Botón Principal "Explorar ahora" */}
                  <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <button
                      type="button"
                      onClick={scrollToOpportunities}
                      className="px-6 sm:px-8 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-teal-500/25 transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 group"
                    >
                      <Compass className="w-5 h-5 text-slate-950 group-hover:rotate-45 transition-transform" />
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAuthModal('login')}
                      className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all cursor-pointer"
                    >
                      {isEs ? 'Iniciar Sesión' : 'Sign In'}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Flechas de navegación del carrusel */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label={isEs ? 'Diapositiva anterior' : 'Previous slide'}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label={isEs ? 'Siguiente diapositiva' : 'Next slide'}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicadores inferiores y control de pausa */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-slate-950/60 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide 
                  ? 'w-8 sm:w-10 bg-teal-400' 
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Diapositiva ${idx + 1}: ${slide.title}`}
            />
          ))}

          <span className="w-px h-3.5 bg-white/20 ml-1 mr-0.5" />

          {/* Botón Pausa / Reproducir */}
          <button
            type="button"
            onClick={() => setIsCarouselPaused(!isCarouselPaused)}
            className="p-1 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isCarouselPaused ? (isEs ? 'Reanudar carrusel' : 'Play') : (isEs ? 'Pausar carrusel' : 'Pause')}
          >
            {isCarouselPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

      </section>

      {/* =========================================================================
          3. SECCIÓN: "Todo lo que necesitas para encontrar tu próxima oportunidad"
          ========================================================================= */}
      <section 
        id="oportunidades" 
        ref={opportunitiesRef} 
        className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado elegante con mucho espacio visual */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'EXPLORA Y TRANSFORMA TU FORMACIÓN' : 'EXPLORE YOUR EDUCATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? 'Todo lo que necesitas para encontrar tu próxima oportunidad' : 'Everything You Need for Your Next Opportunity'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce nuestras instituciones, descubre programas con articulación técnica SENA, gestiona tus matrículas oficiales y potencia tus talentos con cursos especializados.'
                : 'Discover our campuses, learn about certified programs, manage your school enrollments, and develop skills.'}
            </p>
          </div>

          {/* Grid de las 4 Tarjetas visuales solicitadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {opportunityCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedOpportunityCard(card.id)}
                  className={`group relative p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 text-left overflow-hidden ${card.borderColor}`}
                >
                  {/* Subtle top background gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10">
                    
                    {/* Header de la tarjeta con Icono Grande y Emoji */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        <span>{card.emoji}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Título de la tarjeta */}
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {card.title}
                    </h3>

                    {/* Pequeño texto descriptivo */}
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {card.description}
                    </p>

                  </div>

                  {/* Footer de la tarjeta con acción moderna */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                    <span>{isEs ? 'Ver detalles' : 'Learn more'}</span>
                    <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. SECCIÓN DIRECTA DE ACCESO Y MATRÍCULA (INGRESAR Y REGISTRARME)
          ========================================================================= */}
      <section 
        id="portales" 
        ref={authSectionRef} 
        className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Información institucional de los portales */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{isEs ? 'Acceso Seguro y Oficial' : 'Secure Official Access'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isEs ? 'Ingresa o Regístrate en tu Portal' : 'Sign In or Create Your Account'}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {isEs
                  ? 'Los estudiantes, acudientes y directivos cuentan con portales personalizados. Si eres acudiente, recuerda tener a la mano tu código institucional asignado para completar tu registro de forma protegida.'
                  : 'Students, guardians, and school staff access tailored dashboards. Guardians must enter their assigned institutional code during registration.'}
              </p>

              {/* Roles visuales rápidos */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal del Estudiante' : 'Student Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isEs ? 'Carnet escolar con QR, notas periódicas, horario y observador digital.' : 'Digital QR card, school schedule, and grade reports.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Familias y Acudientes' : 'Guardians Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isEs ? 'Registro protegido con código de validación, seguimiento académico y circulares.' : 'Validated registration, attendance, and administrative notices.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Directivo y Administrativo' : 'Administrative Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isEs ? 'Auditoría SIMAT, validación documental y estadísticas de cupos.' : 'SIMAT audits, document approval, and school records.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Tarjeta de Autenticación limpia con pestañas de Ingreso y Registro */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-2">
                <AuthCard defaultMode="login" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. CONSULTA RÁPIDA DE ESTADO DE CUPO CON DOCUMENTO
          ========================================================================= */}
      <section id="consulta-cupo" className="py-14 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-teal-500/20 text-left">
            <div className="flex items-center gap-2.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
              <Search className="w-4 h-4" />
              <span>{isEs ? 'Consulta en Línea' : 'Online Status'}</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white">
              {isEs ? 'Consulta el estado de tu cupo escolar' : 'Check Your School Spot Status'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isEs
                ? 'Ingresa el número de documento de identidad para comprobar la asignación de cupo y el avance de tu matrícula en SIMAT.'
                : 'Enter your ID number to check current verification status and SIMAT spot allocation.'}
            </p>

            {/* Search form */}
            <form onSubmit={handleLookup} className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder={isEs ? 'Ej: 1035982147 o 1002345678' : 'Enter ID number'}
                  value={lookupDoc}
                  onChange={(e) => setLookupDoc(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{isEs ? 'Consultar Estado' : 'Check Status'}</span>
              </button>
            </form>

            {/* Search result display */}
            {lookupSearched && (
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 animate-in fade-in duration-200">
                {lookupResult ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs font-mono text-amber-300 font-bold">{lookupResult.id}</span>
                        <h4 className="text-base font-bold text-white">{lookupResult.name}</h4>
                        <span className="text-xs text-slate-300">Doc: {lookupResult.doc} • Grado: {lookupResult.grade}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                        lookupResult.status === 'active' || lookupResult.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : lookupResult.status === 'in_review'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      }`}>
                        {lookupResult.status === 'active' ? (isEs ? '✓ Matriculado Oficial' : 'Active') :
                         lookupResult.status === 'in_review' ? (isEs ? '⏳ En Revisión' : 'In Review') :
                         (isEs ? '📋 Cupo en Trámite' : 'In Process')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      <strong>{isEs ? 'Observación Institucional: ' : 'Official Note: '}</strong>
                      {lookupResult.notes}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {isEs ? 'Fecha: ' : 'Date: '}{lookupResult.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => scrollToAuthSection('login')}
                        className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 underline cursor-pointer"
                      >
                        <span>{isEs ? 'Ingresar a mi portal para ver detalles' : 'Sign in for full access'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs sm:text-sm text-slate-200">
                      {isEs 
                        ? `No encontramos registros asociados al documento "${lookupDoc}". Puedes crear tu cuenta o iniciar el registro en línea ahora mismo.`
                        : `No records found matching ID "${lookupDoc}". You can register or create an account right now.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollToAuthSection('register')}
                      className="mt-3 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {isEs ? 'Iniciar Registro de Cuenta' : 'Start Registration'}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. MODAL DETALLE DE LAS 4 TARJETAS VISUALES
          ========================================================================= */}
      {selectedOpportunityCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOpportunityCard(null);
          }}
        >
          {(() => {
            const card = opportunityCards.find(c => c.id === selectedOpportunityCard);
            if (!card) return null;
            return (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-left">
                <button
                  type="button"
                  onClick={() => setSelectedOpportunityCard(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                  title={isEs ? 'Cerrar ventana' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                      {card.details.headline}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {card.details.summary}
                </p>

                {/* Contenido según tarjeta */}
                {card.id === 'instituciones' && card.details.campuses && (
                  <div className="space-y-2.5 my-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isEs ? 'Sedes Oficiales:' : 'Campuses:'}
                    </h4>
                    {card.details.campuses.map((camp, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                        <strong className="text-slate-900 dark:text-white block">{camp.name}</strong>
                        <span className="text-slate-500 dark:text-slate-400 block">{camp.address}</span>
                        <span className="text-teal-600 dark:text-teal-400 font-semibold block mt-0.5">{camp.grades}</span>
                      </div>
                    ))}
                  </div>
                )}

                {card.id === 'programas' && card.details.items && (
                  <div className="space-y-2.5 my-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isEs ? 'Programas Destacados:' : 'Featured Programs:'}
                    </h4>
                    {card.details.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{item.name}</strong>
                          <span className="text-slate-500 dark:text-slate-400">{item.duration}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 text-[10px]">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {card.id === 'matriculas' && card.details.steps && (
                  <div className="space-y-2.5 my-4">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 mb-2">
                      {card.details.status}
                    </span>
                    <div className="space-y-2">
                      {card.details.steps.map((st, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {card.id === 'cursos' && card.details.coursesList && (
                  <div className="space-y-2.5 my-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isEs ? 'Talleres y Semilleros Disponibles:' : 'Available Skill Workshops:'}
                    </h4>
                    {card.details.coursesList.map((crs, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{crs.name}</strong>
                          <span className="text-slate-500 dark:text-slate-400">{crs.schedule}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 text-[10px]">
                          {crs.certified}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOpportunityCard(null);
                      scrollToAuthSection('register');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEs ? 'Iniciar Trámite o Registro' : 'Start Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOpportunityCard(null)}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    {isEs ? 'Cerrar' : 'Close'}
                  </button>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          7. MODAL DE ACCESO DIRECTO RÁPIDO (CUANDO SE HACE CLIC EN EL HEADER)
          ========================================================================= */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md my-8 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer shadow-sm"
              title={isEs ? 'Cerrar ventana' : 'Close modal'}
            >
              <X className="w-5 h-5" />
            </button>

            <AuthCard 
              defaultMode={authModalMode}
              onSuccess={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          8. PIE DE PÁGINA INSTITUCIONAL LIMPIO Y OFICIAL (NO MODIFICAR)
          ========================================================================= */}
      <footer id="contacto" className="w-full bg-[#001e30] text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* Col 1: Institución */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img 
                  src={customLogoUrl} 
                  alt="Escudo Institucional" 
                  className="w-10 h-10 rounded-full object-cover border border-amber-400 bg-white"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                  }}
                />
                <div>
                  <span className="font-extrabold text-white text-sm block leading-none">
                    I.E. Félix Henao Botero
                  </span>
                  <span className="text-[10px] text-teal-400 font-medium">
                    EduMed Digital • Articulación SENA
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEs
                  ? 'Institución Educativa Oficial de carácter público en la Comuna 8 de Medellín. Educación con calidad, valores e inclusión social.'
                  : 'Official public educational institution in Medellín linked to the Secretariat of Education.'}
              </p>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div>DANE: 105001002345</div>
                <div>NIT: 890980123-1</div>
                <div>Código ICFES: 014522</div>
              </div>
            </div>

            {/* Col 2: Sedes */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {isEs ? 'Sedes Institucionales' : 'Campuses'}
              </h4>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Sede Principal:</strong> Calle 52 # 18-40, Barrio Enciso - Boston, Comuna 8, Medellín</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Sede Infantil:</strong> Carrera 22 # 54-15, Barrio La Libertad, Medellín</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Contacto y Horarios */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {isEs ? 'Atención al Ciudadano' : 'Contact & Schedule'}
              </h4>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Conmutador: (604) 284 56 78</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>contacto@edumed.edu.co</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>Lunes a Viernes: 7:30 am - 12:30 pm / 1:30 pm - 4:30 pm</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Enlaces Oficiales */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {isEs ? 'Enlaces Oficiales' : 'Official Links'}
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="https://www.medellin.gov.co/educacion" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1">
                    <span>Secretaría de Educación Medellín</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://betowa.sena.edu.co" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1">
                    <span>Portal Oficial SENA</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.mineducacion.gov.co" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                    <span>Ministerio de Educación (MEN)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal / Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Institución Educativa Félix Henao Botero • Sistema Oficial EduMed Digital. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-3">
              <span>Medellín, Colombia</span>
              <span>·</span>
              <span>SIMAT V4.2</span>
              {onReplaySplash && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onReplaySplash}
                    className="hover:text-teal-400 text-slate-400 transition-colors cursor-pointer"
                  >
                    Intro Institucional
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LoginScreen;
