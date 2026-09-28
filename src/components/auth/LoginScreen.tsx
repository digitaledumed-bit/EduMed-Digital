import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import matriculasImg from '../../assets/images/matriculas_cartoon_1790637705135.jpg';
import institucionesImg from '../../assets/images/instituciones_cartoon_1790637716747.jpg';
import programasImg from '../../assets/images/programas_cartoon_1790637726636.jpg';
import futuroImg from '../../assets/images/futuro_cartoon_1790637735129.jpg';
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
  Star,
  Rocket
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

  // Modal para ver detalles de las 3 tarjetas (Instituciones, Programas, Matrículas - sin Cursos)
  const [selectedOpportunityCard, setSelectedOpportunityCard] = useState<string | null>(null);

  // Carrusel automático del Banner Principal
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Quick lookup state
  const [lookupDoc, setLookupDoc] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const authSectionRef = useRef<HTMLDivElement>(null);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  // 4 Diapositivas exactas con ilustraciones tipo personajes/muñequitos educativos 3D
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'Admisiones 2026 Abiertas' : '2026 Admissions Open',
      emojiTitle: '🎓',
      title: isEs ? '¡Matrículas disponibles!' : 'Open Enrollments!',
      subtitle: isEs 
        ? 'Infórmate sobre las oportunidades de matrícula disponibles.'
        : 'Learn about all available school enrollment opportunities.',
      ctaText: isEs ? 'Ver matrículas' : 'View enrollments',
      action: 'matriculas',
      tag: isEs ? 'Cupos 100% Gratuitos • SIMAT' : '100% Free Tuition',
      image: matriculasImg,
      alt: 'Personajes animados estudiantes celebrando matrícula escolar',
      themeGradient: 'from-emerald-950 via-teal-900 to-slate-950',
      lightGlow: 'bg-emerald-400/25',
      accentColor: 'text-emerald-400',
      buttonBg: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/30',
      badgeBorder: 'border-emerald-400/40 text-emerald-300 bg-emerald-950/60'
    },
    {
      id: 2,
      badge: isEs ? 'Sedes Oficiales • Comuna 8' : 'Official Campuses',
      emojiTitle: '🏫',
      title: isEs ? '¡Conoce nuevas instituciones!' : 'Discover New Campuses!',
      subtitle: isEs 
        ? 'Explora instituciones y descubre sus opciones de formación.'
        : 'Explore institutions and discover their educational options.',
      ctaText: isEs ? 'Ver instituciones' : 'View institutions',
      action: 'instituciones',
      tag: isEs ? 'Sede Principal y Sede Infantil' : 'Main & Elementary Campus',
      image: institucionesImg,
      alt: 'Personajes animados conociendo moderno campus escolar',
      themeGradient: 'from-blue-950 via-sky-900 to-slate-950',
      lightGlow: 'bg-sky-400/25',
      accentColor: 'text-sky-400',
      buttonBg: 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/30',
      badgeBorder: 'border-sky-400/40 text-sky-300 bg-sky-950/60'
    },
    {
      id: 3,
      badge: isEs ? 'Articulación Técnica SENA' : 'SENA Technical Track',
      emojiTitle: '📚',
      title: isEs ? '¡Encuentra tu programa!' : 'Find Your Program!',
      subtitle: isEs 
        ? 'Descubre programas de formación según tus intereses.'
        : 'Discover training programs according to your interests.',
      ctaText: isEs ? 'Explorar programas' : 'Explore programs',
      action: 'programas',
      tag: isEs ? 'Sistemas, Software y Contabilidad' : 'Software & Business Tracks',
      image: programasImg,
      alt: 'Personajes animados aprendiendo con laptops y libros',
      themeGradient: 'from-purple-950 via-indigo-900 to-slate-950',
      lightGlow: 'bg-purple-400/25',
      accentColor: 'text-purple-300',
      buttonBg: 'bg-purple-400 hover:bg-purple-300 text-slate-950 shadow-purple-500/30',
      badgeBorder: 'border-purple-400/40 text-purple-300 bg-purple-950/60'
    },
    {
      id: 4,
      badge: isEs ? 'Tu Futuro Comienza Hoy' : 'Your Future Starts Today',
      emojiTitle: '🚀',
      title: isEs ? '¡Construye tu futuro!' : 'Build Your Future!',
      subtitle: isEs 
        ? 'Descubre nuevas oportunidades para continuar tus estudios.'
        : 'Discover new opportunities to continue your studies.',
      ctaText: isEs ? 'Comenzar ahora' : 'Get started',
      action: 'register',
      tag: isEs ? 'Registro Rápido y Seguro' : 'Quick & Secure Sign Up',
      image: futuroImg,
      alt: 'Personaje animado lanzando cohete hacia sus metas educativas',
      themeGradient: 'from-amber-950 via-orange-950 to-slate-950',
      lightGlow: 'bg-amber-400/25',
      accentColor: 'text-amber-300',
      buttonBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/30',
      badgeBorder: 'border-amber-400/40 text-amber-300 bg-amber-950/60'
    }
  ];

  // Cambio automático fluido del carrusel cada 5.5 segundos
  const SLIDE_DURATION = 5500;

  useEffect(() => {
    if (isCarouselPaused) return;

    setSlideProgress(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setSlideProgress(pct);
    }, 50);

    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setSlideProgress(0);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [currentSlide, isCarouselPaused, heroSlides.length]);

  const handlePrevSlide = () => {
    setSlideProgress(0);
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideProgress(0);
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

  // Manejador del botón principal de cada diapositiva
  const handleSlideAction = (action: string) => {
    if (action === 'matriculas') {
      setSelectedOpportunityCard('matriculas');
    } else if (action === 'instituciones') {
      setSelectedOpportunityCard('instituciones');
    } else if (action === 'programas') {
      setSelectedOpportunityCard('programas');
    } else if (action === 'register') {
      handleOpenAuthModal('register');
    }
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

  // 3 Tarjetas visuales solicitadas específicamente por el usuario (sin Cursos)
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
          ? 'Institución Educativa Oficial de carácter público en la Comuna 8 de Medellín, comprometida con la excelencia, la inclusión social y la formación integral.'
          : 'Official public school in Medellín providing inclusive education from early childhood to high school technical tracks.',
        campuses: [
          { name: isEs ? 'Sede Principal (Enciso - Boston)' : 'Main Campus', address: 'Calle 52 # 18-40, Comuna 8', grades: isEs ? 'Secundaria y Media Técnica (6° a 11°)' : 'Grades 6-11' },
          { name: isEs ? 'Sede Infantil La Libertad' : 'La Libertad Elementary', address: 'Carrera 22 # 54-15, Medellín', grades: isEs ? 'Preescolar y Primaria (Transición a 5°)' : 'Preschool & Elementary' }
        ],
        codeDane: '105001002345',
        alliance: isEs ? 'Articulación oficial con el SENA' : 'Official partnership with SENA'
      },
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'hover:border-teal-500',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
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
      gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
      borderColor: 'hover:border-blue-500',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
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
      borderColor: 'hover:border-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          1. HEADER INSTITUCIONAL OFICIAL (INTACTO SEGÚN INSTRUCCIÓN ESTRICTA)
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
          2. BANNER PRINCIPAL CON CARRUSEL ANIMADO CON ILUSTRACIONES DE PERSONAJES:
             GRANDE, LLAMATIVO, LUMINOSO, CON PERSONAJES/MUÑEQUITOS EDUCATIVOS Y MOVIMIENTO SUAVE
          ========================================================================= */}
      <section 
        className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] flex items-center select-none"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        {/* Diapositivas con transiciones suaves y personajes animados con movimiento */}
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Fondo degradado ambiental luminoso por diapositiva */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.themeGradient}`} />
              
              {/* Resplandor luminoso ambiental dinámico */}
              <div className={`absolute top-1/4 right-1/4 w-[520px] h-[520px] ${slide.lightGlow} rounded-full blur-3xl pointer-events-none animate-glow-pulse`} />
              <div className="absolute -bottom-10 -left-10 w-[380px] h-[380px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Contenido dentro del banner: texto, botón e ilustración de personajes visible y clara */}
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-20 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Columna Izquierda: Badge + Título Grande con Emoji + Texto Corto + Botón */}
                  <div className="lg:col-span-7 text-left space-y-4 sm:space-y-6">
                    
                    {/* Badge temático */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-wider shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 ${slide.badgeBorder}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{slide.badge}</span>
                      </div>
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-slate-300 border border-white/15 hidden sm:inline-block">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Título Grande con Emoji */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700">
                      <span className="mr-2 sm:mr-3 inline-block animate-subtle-bob">{slide.emojiTitle}</span>
                      <span>{slide.title}</span>
                    </h1>

                    {/* Texto Corto y Atractivo visible dentro del banner */}
                    <p className="text-base sm:text-xl text-slate-100 font-medium leading-relaxed max-w-xl drop-shadow animate-in fade-in slide-in-from-bottom-4 duration-700">
                      “{slide.subtitle}”
                    </p>

                    {/* Botones de acción principales visibles dentro del banner */}
                    <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                      
                      {/* Botón Principal Requerido */}
                      <button
                        type="button"
                        onClick={() => handleSlideAction(slide.action)}
                        className={`px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 group ${slide.buttonBg}`}
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                      </button>

                      {/* Botón Secundario de Acceso */}
                      <button
                        type="button"
                        onClick={() => {
                          if (slide.action === 'register') {
                            handleOpenAuthModal('login');
                          } else {
                            scrollToOpportunities();
                          }
                        }}
                        className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all cursor-pointer active:scale-95"
                      >
                        {isEs ? 'Explorar opciones' : 'Explore options'}
                      </button>

                    </div>

                    {/* Pequeñas insignias de confianza institucional */}
                    <div className="pt-2 flex items-center gap-4 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Educación 100% Oficial</span>
                      </span>
                      <span className="hidden sm:flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>Articulación SENA</span>
                      </span>
                    </div>

                  </div>

                  {/* Columna Derecha: Ilustración llamativa de muñequitos / personajes educativos con movimiento suave */}
                  <div className="lg:col-span-5 flex justify-center items-center relative">
                    
                    {/* Elementos flotantes decorativos animados alrededor de los personajes */}
                    <div className="absolute -top-4 -right-2 z-20 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg animate-subtle-bob hidden sm:flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      <span className="text-xs font-bold text-white">Edumed Digital</span>
                    </div>

                    <div className="absolute -bottom-3 -left-2 z-20 p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-lg animate-gentle-float hidden sm:flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      <span className="text-xs font-bold text-teal-300">Medellín • Comuna 8</span>
                    </div>

                    {/* Tarjeta de personajes con animación flotante suave y borde luminoso */}
                    <div className="relative w-full max-w-md sm:max-w-lg aspect-[16/10] sm:aspect-[16/11] rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl bg-slate-900/50 backdrop-blur-sm group animate-gentle-float">
                      
                      {/* Imagen de muñequitos/personajes educativos 3D */}
                      <img 
                        src={slide.image} 
                        alt={slide.alt} 
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Brillo reflectante suave sobre el contenedor */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-white/10 pointer-events-none" />

                      {/* Etiqueta flotante inferior con el emoji */}
                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{slide.emojiTitle}</span>
                          <span className="text-xs font-bold text-white">{slide.title}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                          Oficial
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Flechas de navegación lateral del carrusel */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
          aria-label={isEs ? 'Diapositiva anterior' : 'Previous slide'}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
          aria-label={isEs ? 'Siguiente diapositiva' : 'Next slide'}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Indicadores inferiores con barra de progreso interactiva */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-slate-950/80 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/15 backdrop-blur-md shadow-xl">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setSlideProgress(0);
                  setCurrentSlide(idx);
                }}
                className={`relative h-2.5 sm:h-3 rounded-full overflow-hidden transition-all cursor-pointer flex items-center ${
                  isActive ? 'w-12 sm:w-16 bg-white/20' : 'w-3 sm:w-4 bg-white/30 hover:bg-white/60'
                }`}
                title={`Diapositiva ${idx + 1}: ${slide.title}`}
              >
                {isActive && (
                  <span 
                    className="absolute inset-y-0 left-0 bg-teal-400 rounded-full transition-all duration-75"
                    style={{ width: `${slideProgress}%` }}
                  />
                )}
              </button>
            );
          })}

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
             (3 TARJETAS VISUALES MODERNAS: Instituciones, Programas, Matrículas - sin Cursos)
          ========================================================================= */}
      <section 
        id="oportunidades" 
        ref={opportunitiesRef} 
        className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado limpio y moderno */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'EXPLORA Y TRANSFORMA TU FORMACIÓN' : 'EXPLORE YOUR EDUCATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? 'Todo lo que necesitas para encontrar tu próxima oportunidad' : 'Everything You Need for Your Next Opportunity'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce nuestras instituciones oficiales, explora programas con articulación técnica SENA y gestiona tus matrículas de manera rápida y segura.'
                : 'Discover our official campuses, explore technical programs with SENA dual certification, and manage your school admissions.'}
            </p>
          </div>

          {/* Grid de las 3 Tarjetas visuales solicitadas (Instituciones, Programas, Matrículas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {opportunityCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedOpportunityCard(card.id)}
                  className={`group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5 text-left overflow-hidden ${card.borderColor}`}
                >
                  {/* Subtle top background gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10">
                    
                    {/* Header de la tarjeta con Icono Grande y Emoji */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        <span>{card.emoji}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Título de la tarjeta */}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {card.title}
                    </h3>

                    {/* Pequeño texto descriptivo */}
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {card.description}
                    </p>

                  </div>

                  {/* Footer de la tarjeta con acción moderna */}
                  <div className="relative z-10 mt-8 pt-4 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                    <span>{isEs ? 'Conocer más detalles' : 'Learn more'}</span>
                    <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                      <ArrowRight className="w-4 h-4" />
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
          6. MODAL DETALLE DE LAS 3 TARJETAS VISUALES (Instituciones, Programas, Matrículas)
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
