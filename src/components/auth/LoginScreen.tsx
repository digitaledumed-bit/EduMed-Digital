import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import slideMatriculasImg from '../../assets/images/slide_matriculas_v2_1790639962382.jpg';
import slideInstitucionesImg from '../../assets/images/slide_instituciones_v2_1790639972681.jpg';
import slideProgramasImg from '../../assets/images/slide_programas_v2_1790639983509.jpg';
import slideFuturoImg from '../../assets/images/slide_futuro_v2_1790639993315.jpg';
import cardEdificioImg from '../../assets/images/card_edificio_v2_1790640004084.jpg';
import cardBirreteImg from '../../assets/images/card_birrete_v2_1790640013891.jpg';
import cardCarpetaImg from '../../assets/images/card_carpeta_v2_1790640025415.jpg';
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
  ShieldCheck,
  Award,
  Layers,
  Check,
  Compass,
  Laptop,
  HeartHandshake
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

  // Modal para ver detalles de las 3 tarjetas (Instituciones, Programas, Matrículas)
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

  // 4 Diapositivas exactas con composición completa: Ilustración digital moderna + Título grande + Texto corto + Botón
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'ADMISIONES 2026' : '2026 ADMISSIONS',
      title: '¡Matrículas disponibles!',
      subtitle: isEs 
        ? 'Infórmate sobre las oportunidades de matrícula disponibles.'
        : 'Learn about all enrollment opportunities available.',
      ctaText: isEs ? 'Ver matrículas' : 'View enrollments',
      secondaryText: isEs ? 'Consultar cupo' : 'Check status',
      action: 'matriculas',
      keyBenefits: [
        isEs ? '100% Gratuito y Oficial' : '100% Tuition-Free',
        isEs ? 'Conexión Directa SIMAT' : 'Direct SIMAT Records',
        isEs ? 'Carnet Digital con QR' : 'Digital QR Student ID'
      ],
      image: slideMatriculasImg,
      alt: 'Ilustración digital moderna de estudiantes celebrando matrícula escolar',
      palette: {
        glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        cta: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
        cardBorder: 'border-emerald-200 dark:border-emerald-800/80',
        pill: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
      }
    },
    {
      id: 2,
      badge: isEs ? 'SEDES EDUCATIVAS' : 'OFFICIAL CAMPUSES',
      title: '¡Conoce nuevas instituciones!',
      subtitle: isEs 
        ? 'Explora instituciones y sus opciones de formación.'
        : 'Explore institutions and discover their academic tracks.',
      ctaText: isEs ? 'Ver instituciones' : 'View institutions',
      secondaryText: isEs ? 'Nuestras sedes' : 'Our campuses',
      action: 'instituciones',
      keyBenefits: [
        isEs ? 'Sede Principal (Enciso - Boston)' : 'Main Campus',
        isEs ? 'Sede Infantil (La Libertad)' : 'Elementary Campus',
        isEs ? 'Ambientes de Estudio Flexibles' : 'Modern Learning Spaces'
      ],
      image: slideInstitucionesImg,
      alt: 'Ilustración digital moderna de campus arquitectónico educativo',
      palette: {
        glow: 'from-blue-500/20 via-sky-500/10 to-transparent',
        badge: 'bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        cta: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        cardBorder: 'border-blue-200 dark:border-blue-800/80',
        pill: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
      }
    },
    {
      id: 3,
      badge: isEs ? 'FORMACIÓN TÉCNICA OFICIAL' : 'TECHNICAL TRACKS',
      title: '¡Encuentra tu programa!',
      subtitle: isEs 
        ? 'Descubre programas según tus intereses.'
        : 'Discover educational programs tailored to your interests.',
      ctaText: isEs ? 'Explorar programas' : 'Explore programs',
      secondaryText: isEs ? 'Ver grados' : 'View grades',
      action: 'programas',
      keyBenefits: [
        isEs ? 'Técnico en Sistemas y Software' : 'IT & Systems Track',
        isEs ? 'Técnico en Contabilización' : 'Accounting & Finance Track',
        isEs ? 'Doble Titulación en Grado 11°' : 'Dual Technical Degree'
      ],
      image: slideProgramasImg,
      alt: 'Ilustración digital moderna de estudiantes explorando programas y tecnología',
      palette: {
        glow: 'from-purple-500/20 via-indigo-500/10 to-transparent',
        badge: 'bg-purple-50 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700',
        cta: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25',
        cardBorder: 'border-purple-200 dark:border-purple-800/80',
        pill: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800'
      }
    },
    {
      id: 4,
      badge: isEs ? 'TU FUTURO HOY' : 'YOUR FUTURE',
      title: '¡Construye tu futuro!',
      subtitle: isEs 
        ? 'Descubre nuevas oportunidades para estudiar.'
        : 'Discover new opportunities to study and advance.',
      ctaText: isEs ? 'Comenzar ahora' : 'Get started',
      secondaryText: isEs ? 'Crear cuenta' : 'Sign up',
      action: 'register',
      keyBenefits: [
        isEs ? 'Inscripción Virtual Inmediata' : 'Instant Online Sign-Up',
        isEs ? 'Sin Costos ni Intermediarios' : 'No Intermediaries',
        isEs ? 'Acompañamiento Escolar Total' : 'Comprehensive Guidance'
      ],
      image: slideFuturoImg,
      alt: 'Ilustración digital moderna de estudiante proyectando su futuro hacia el éxito',
      palette: {
        glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
        badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        cta: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/25',
        cardBorder: 'border-amber-200 dark:border-amber-800/80',
        pill: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
      }
    }
  ];

  // Cambio automático suave cada 5.5 segundos
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

  // 3 Tarjetas visuales solicitadas: Edificio educativo, Birrete decorado, Carpeta de inscripción
  const opportunityCards = [
    {
      id: 'instituciones',
      emoji: '🎓',
      icon: Building2,
      illustration: cardEdificioImg,
      illustrationAlt: 'Ilustración digital moderna de edificio educativo institucional',
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
        alliance: isEs ? 'Formación Técnica Oficial con Doble Titulación' : 'Official Dual Technical Certification'
      },
      gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      borderColor: 'border-teal-200 dark:border-teal-900/60 hover:border-teal-500',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    },
    {
      id: 'programas',
      emoji: '📚',
      icon: BookOpen,
      illustration: cardBirreteImg,
      illustrationAlt: 'Ilustración digital moderna de birrete decorado con libros',
      title: isEs ? 'Programas' : 'Programs',
      description: isEs 
        ? 'Explora diferentes programas de formación.'
        : 'Explore varied training programs and high school tracks.',
      details: {
        headline: isEs ? 'Oferta de Formación Académica y Técnica' : 'Academic & Technical Programs',
        summary: isEs
          ? 'Formación integral desde primera infancia hasta bachilleres técnicos con doble titulación oficial sin costo.'
          : 'Complete academic tracks from preschool to high school with official dual technical certification.',
        items: [
          { name: isEs ? 'Técnico en Sistemas y Desarrollo' : 'IT & Systems Technician', duration: '2 Años (10° y 11°)', badge: isEs ? 'Oficial' : 'Official' },
          { name: isEs ? 'Técnico en Contabilización y Finanzas' : 'Accounting & Finance', duration: '2 Años (10° y 11°)', badge: isEs ? 'Oficial' : 'Official' },
          { name: isEs ? 'Básica Secundaria con Énfasis STEAM' : 'Middle School STEAM', duration: 'Grados 6° a 9°', badge: isEs ? 'Oficial' : 'Official' },
          { name: isEs ? 'Primaria Integral y Grado Transición' : 'Elementary & Transition', duration: 'Grados Preescolar a 5°', badge: isEs ? 'PAE Gratuito' : 'Meals PAE' }
        ]
      },
      gradient: 'from-blue-500/15 via-cyan-500/5 to-transparent',
      borderColor: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-500',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    },
    {
      id: 'matriculas',
      emoji: '📝',
      icon: FileText,
      illustration: cardCarpetaImg,
      illustrationAlt: 'Ilustración digital moderna de carpeta de inscripción con sello de verificación',
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
      gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          1. HEADER INSTITUCIONAL OFICIAL (MANTENIENDO LOGO, NOMBRE Y ENCABEZADO)
             CON BOTONES EXACTOS: "Iniciar sesión" Y "Crear cuenta"
          ========================================================================= */}
      <header className="w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & School Identity Oficial EduMed */}
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
                className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-teal-600 text-white font-extrabold text-[8px] uppercase tracking-wider border border-white shadow-xs"
                title="Plataforma Oficial EduMed Digital"
              >
                OFICIAL
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
              href="#beneficios-clave"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isEs ? 'Beneficios' : 'Benefits'}
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

          {/* Action Buttons: "Iniciar sesión" y "Crear cuenta" */}
          <div className="flex items-center gap-2">
            
            {/* Botón Iniciar sesión */}
            <button
              type="button"
              onClick={() => handleOpenAuthModal('login')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#002f49] hover:bg-[#001e30] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEs ? 'Iniciar sesión' : 'Sign In'}</span>
            </button>

            {/* Botón Crear cuenta */}
            <button
              type="button"
              onClick={() => handleOpenAuthModal('register')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-teal-600/70 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/60 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">{isEs ? 'Crear cuenta' : 'Create account'}</span>
              <span className="sm:hidden">{isEs ? 'Crear' : 'Join'}</span>
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
          2. CARRUSEL PRINCIPAL: COMPOSICIÓN COMPLETA Y EQUILIBRADA
             - ILUSTRACIÓN DIGITAL MODERNA (PUNTO MEDIO: NO FOTO, NO CARICATURA INFANTIL)
             - TÍTULO GRANDE CON TIPOGRAFÍA ELEGANTE
             - TEXTO CORTO CON ESPACIO SUFICIENTE
             - BOTÓN VISIBLE Y DESTACADO
             - DISEÑO AMPLIO, LIMPIO, ELEGANTE Y LUMINOSO
          ========================================================================= */}
      <section 
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 select-none py-6 sm:py-8 lg:py-12"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          
          {/* Card principal del carrusel con marco luminoso y bordes redondeados modernos */}
          <div className="relative min-h-[640px] sm:min-h-[600px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[600px] rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex items-center">
            
            {/* Diapositivas con transición suave de opacidad */}
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-5 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex items-center transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-98 z-0 pointer-events-none'
                  }`}
                >
                  {/* Resplandor ambiental de color temático */}
                  <div className={`absolute -right-10 -bottom-10 w-[500px] h-[500px] bg-gradient-to-br ${slide.palette.glow} rounded-full blur-3xl pointer-events-none`} />
                  <div className="absolute left-10 top-10 w-72 h-72 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Composición en Grid equilibrado: Texto amplio + Ilustración integrada */}
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 items-center">
                    
                    {/* Columna de Texto (60% del ancho en pantallas grandes): Espaciosa, elegante y clara */}
                    <div className="lg:col-span-7 xl:col-span-7 space-y-3 sm:space-y-5 text-left">
                      
                      {/* Badge superior de categoría */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className={slide.palette.badge}>{slide.badge}</span>
                      </div>

                      {/* Título Grande y Elegante */}
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                        {slide.title}
                      </h1>

                      {/* Texto corto descriptivo con espacio generoso y alta legibilidad */}
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                        {slide.subtitle}
                      </p>

                      {/* Píldoras con puntos clave de valor educativo */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 sm:pt-1">
                        {slide.keyBenefits.map((benefit, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${slide.palette.pill}`}
                          >
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* Fila de Botones: Botón principal visible y botón secundario */}
                      <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                        
                        {/* Botón Principal Requerido */}
                        <button
                          type="button"
                          onClick={() => handleSlideAction(slide.action)}
                          className={`px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer hover:scale-102 active:scale-95 group ${slide.palette.cta}`}
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                        </button>

                        {/* Botón Secundario complementario */}
                        <button
                          type="button"
                          onClick={() => {
                            if (slide.action === 'register') {
                              handleOpenAuthModal('login');
                            } else {
                              scrollToOpportunities();
                            }
                          }}
                          className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                        >
                          <span>{slide.secondaryText}</span>
                        </button>

                      </div>

                    </div>

                    {/* Columna de Ilustración (40% del ancho): Parte integral del diseño del carrusel */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
                      
                      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800 group animate-subtle-float">
                        
                        {/* Ilustración digital moderna: estética equilibrada, bonita y profesional */}
                        <img 
                          src={slide.image} 
                          alt={slide.alt}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Degradado inferior con etiqueta institucional sutil */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">EduMed Digital</span>
                          </div>
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                            {slide.badge}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            {/* Flechas de navegación integradas dentro del banner */}
            <button
              type="button"
              onClick={handlePrevSlide}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Diapositiva anterior' : 'Previous slide'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Siguiente diapositiva' : 'Next slide'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicadores inferiores elegantes con barra de progreso interactiva */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full border border-slate-200/90 dark:border-slate-700/90 shadow-md backdrop-blur-md">
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
                    className={`relative h-2 rounded-full overflow-hidden transition-all cursor-pointer flex items-center ${
                      isActive ? 'w-10 sm:w-12 bg-slate-200 dark:bg-slate-700' : 'w-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                    }`}
                    title={`Diapositiva ${idx + 1}: ${slide.title}`}
                  >
                    {isActive && (
                      <span 
                        className="absolute inset-y-0 left-0 bg-teal-600 dark:bg-teal-400 rounded-full transition-all duration-75"
                        style={{ width: `${slideProgress}%` }}
                      />
                    )}
                  </button>
                );
              })}

              <span className="w-px h-3.5 bg-slate-200 dark:bg-slate-700 mx-1" />

              {/* Botón Pausa / Reproducir */}
              <button
                type="button"
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={isCarouselPaused ? (isEs ? 'Reanudar carrusel' : 'Play') : (isEs ? 'Pausar carrusel' : 'Pause')}
              >
                {isCarouselPaused ? <Play className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SECCIÓN: "Todo lo que necesitas para encontrar tu próxima oportunidad"
             3 TARJETAS COMPLETAS CON ILUSTRACIONES ELEGANTES:
             - EDIFICIO EDUCATIVO (Instituciones)
             - BIRRETE DECORADO (Programas)
             - CARPETA DE MATRÍCULA (Matrículas)
             CON EFECTOS DE MOVIMIENTO Y BRILLO SUTIL AL INTERACTUAR
          ========================================================================= */}
      <section 
        id="oportunidades" 
        ref={opportunitiesRef} 
        className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Encabezado limpio y moderno */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'EXPLORA Y TRANSFORMA TU FORMACIÓN' : 'EXPLORE YOUR EDUCATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? 'Todo lo que necesitas para encontrar tu próxima oportunidad' : 'Everything You Need for Your Next Opportunity'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce nuestras instituciones oficiales, explora programas técnicos con doble titulación y gestiona tus matrículas de manera rápida y segura.'
                : 'Discover our official campuses, explore technical programs with dual certification, and manage your school admissions.'}
            </p>
          </div>

          {/* Grid de las 3 Tarjetas visuales con edificio educativo, birrete decorado y carpeta de matrícula */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {opportunityCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedOpportunityCard(card.id)}
                  className={`group relative p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border ${card.borderColor} shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-2 text-left overflow-hidden`}
                >
                  {/* Destello de brillo diagonal al pasar el cursor o tocar */}
                  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 card-shine-effect z-20" />

                  {/* Resplandor superior sutil */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10">
                    
                    {/* Contenedor de la ilustración elegante (Edificio / Birrete / Carpeta) */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs bg-slate-100 dark:bg-slate-800 group-hover:shadow-md transition-shadow">
                      <img 
                        src={card.illustration} 
                        alt={card.illustrationAlt}
                        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Badge con emoji en la esquina de la ilustración */}
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700/60 shadow-xs flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <span>{card.emoji}</span>
                      </div>

                      {/* Icono de apoyo en la esquina opuesta */}
                      <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                        <IconComponent className="w-4 h-4 text-teal-300" />
                      </div>
                    </div>

                    {/* Título de la tarjeta */}
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {card.title}
                    </h3>

                    {/* Pequeño texto descriptivo */}
                    <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {card.description}
                    </p>

                  </div>

                  {/* Footer de la tarjeta con acción interactiva */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                    <span className="group-hover:underline">{isEs ? 'Conocer más detalles' : 'Learn more'}</span>
                    <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:translate-x-1.5 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
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
          4. SECCIÓN DE BENEFICIOS EDUCATIVOS Y CIFRAS DE COBERTURA
             (NO DEJA LA PÁGINA VACÍA, ENRIQUECE EL RECORRIDO DEL USUARIO)
          ========================================================================= */}
      <section id="beneficios-clave" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 transition-colors">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Cifras de Impacto Institucional EduMed */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center hover:-translate-y-1 transition-transform">
              <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">2</span>
              <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Sedes Oficiales</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sede Principal e Infantil</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center hover:-translate-y-1 transition-transform">
              <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">1.450+</span>
              <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Estudiantes</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Matriculados en SIMAT</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center hover:-translate-y-1 transition-transform">
              <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">100%</span>
              <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Gratuidad Oficial</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sin costos de matrícula</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-center hover:-translate-y-1 transition-transform">
              <span className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">24/7</span>
              <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Gestión Virtual</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Trámites y certificados</p>
            </div>
          </div>

          {/* 4 Pilares Institucionales de EduMed Digital */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
                {isEs ? 'NUESTRO COMPROMISO FORMATIVO' : 'OUR COMMITMENT'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {isEs ? '¿Por qué elegir EduMed Digital?' : 'Why Choose EduMed Digital?'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Educación Oficial</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Institución pública avalada por la Secretaría de Educación de Medellín y registrada en SIMAT.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Tecnología y STEAM</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Aulas interactivas, conectividad de alta velocidad y formación orientada a habilidades del siglo XXI.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Doble Titulación</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Gradúate con título de bachiller académico y certificación técnica oficial para el mundo laboral.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Bienestar Estudiantil</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Programa de Alimentación Escolar (PAE), seguro estudiantil 24/7 y orientación psicosocial integral.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SECCIÓN DIRECTA DE ACCESO Y MATRÍCULA (PORTALES + AUTHCARD)
          ========================================================================= */}
      <section 
        id="portales" 
        ref={authSectionRef} 
        className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
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
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs">
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

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs">
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

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs">
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
          6. CONSULTA RÁPIDA DE ESTADO DE CUPO CON DOCUMENTO
          ========================================================================= */}
      <section id="consulta-cupo" className="py-14 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800">
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
          7. MODAL DETALLE DE LAS 3 TARJETAS VISUALES (Instituciones, Programas, Matrículas)
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
          8. MODAL DE ACCESO DIRECTO RÁPIDO (CUANDO SE HACE CLIC EN EL HEADER)
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
          9. PIE DE PÁGINA INSTITUCIONAL LIMPIO Y OFICIAL (EDUMED DIGITAL PROPIO)
          ========================================================================= */}
      <footer id="contacto" className="w-full bg-[#001e30] text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs text-left">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
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
                    EduMed Digital • Plataforma Educativa Oficial
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
                  <a href="https://www.mineducacion.gov.co" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                    <span>Ministerio de Educación Nacional (MEN)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.simat.gov.co" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                    <span>Portal Oficial SIMAT</span>
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
