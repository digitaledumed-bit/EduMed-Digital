import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import slideMatriculasImg from '../../assets/images/slide_matriculas_v2_1790639962382.jpg';
import slideInstitucionesImg from '../../assets/images/slide_instituciones_v2_1790639972681.jpg';
import cardEdificioImg from '../../assets/images/card_edificio_v2_1790640004084.jpg';
import cardBirreteImg from '../../assets/images/card_birrete_v2_1790640013891.jpg';
import cardCarpetaImg from '../../assets/images/card_carpeta_v2_1790640025415.jpg';
import { 
  Sun, 
  Moon, 
  Globe, 
  Sparkles,
  GraduationCap,
  Users,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Building2,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  X,
  ShieldCheck,
  Check,
  Laptop,
  CheckCircle2,
  Send,
  HelpCircle,
  FileCheck2,
  Scale,
  BellRing,
  Lock,
  Smartphone,
  MessageSquare,
  BookOpen,
  FileText
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
    customLogoUrl
  } = useApp();

  const isEs = language === 'es';

  // Modales legales y de contacto del pie de página
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Modal para ver detalles de Oportunidades (Instituciones, Programas, Matrículas)
  const [selectedOpportunityCard, setSelectedOpportunityCard] = useState<string | null>(null);

  // Estado del formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Acudiente / Familia',
    subject: 'Soporte Técnico de Plataforma',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactTicketId, setContactTicketId] = useState('');

  // Carrusel automático del Banner Principal (2 diapositivas)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const opportunitiesRef = useRef<HTMLDivElement>(null);
  const authSectionRef = useRef<HTMLDivElement>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null);
  const sedesSectionRef = useRef<HTMLDivElement>(null);

  // Bloqueo de scroll en fondo cuando hay un modal abierto para que aparezca centrado en el viewport actual
  useEffect(() => {
    const isAnyModalOpen = isContactModalOpen || isPrivacyModalOpen || isTermsModalOpen || isLegalModalOpen || !!selectedOpportunityCard;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isContactModalOpen, isPrivacyModalOpen, isTermsModalOpen, isLegalModalOpen, selectedOpportunityCard]);

  // 2 Diapositivas exactas del Slider: Matrículas e Instituciones
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'ADMISIONES 2026' : '2026 ADMISSIONS',
      title: '¡Matrículas disponibles!',
      subtitle: isEs 
        ? 'Infórmate sobre las oportunidades de matrícula disponibles.'
        : 'Learn about all enrollment opportunities available.',
      ctaText: isEs ? 'Ver matrículas' : 'View enrollments',
      secondaryText: isEs ? 'Ir a Portales' : 'Go to Portals',
      action: 'matriculas',
      keyBenefits: [
        isEs ? '100% Gratuito y Oficial' : '100% Tuition-Free',
        isEs ? 'Conexión Directa SIMAT' : 'Direct SIMAT Records',
        isEs ? 'Gestión Virtual 24/7' : '24/7 Online Management'
      ],
      image: slideMatriculasImg,
      alt: 'Ilustración digital moderna de estudiantes en proceso de matrícula escolar',
      palette: {
        glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        cta: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25',
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
      ctaText: isEs ? 'Ver instituciones' : 'View campuses',
      secondaryText: isEs ? 'Nuestras sedes' : 'Our campuses',
      action: 'instituciones',
      keyBenefits: [
        isEs ? 'Sede Principal (Enciso - Boston)' : 'Main Campus',
        isEs ? 'Sede Infantil (La Libertad)' : 'Elementary Campus',
        isEs ? 'Ambientes de Estudio Modernos' : 'Modern Learning Spaces'
      ],
      image: slideInstitucionesImg,
      alt: 'Ilustración digital moderna de campus arquitectónico educativo',
      palette: {
        glow: 'from-blue-500/20 via-sky-500/10 to-transparent',
        badge: 'bg-blue-50 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        cta: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25',
        pill: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
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

  const scrollToHero = () => {
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToOpportunities = () => {
    opportunitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAuthSection = () => {
    authSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBenefitsSection = () => {
    benefitsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSedesSection = () => {
    sedesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSlideAction = (action: string) => {
    if (action === 'matriculas') {
      scrollToOpportunities();
    } else if (action === 'instituciones') {
      scrollToOpportunities();
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setContactTicketId(ticket);
    setContactSubmitted(true);
  };

  const resetContactForm = () => {
    setContactForm({
      name: '',
      email: '',
      phone: '',
      role: 'Acudiente / Familia',
      subject: 'Soporte Técnico de Plataforma',
      message: ''
    });
    setContactSubmitted(false);
    setIsContactModalOpen(false);
  };

  // 3 Tarjetas en el apartado de Oportunidades
  const opportunityCards = [
    {
      id: 'instituciones',
      emoji: '🎓',
      icon: Building2,
      illustration: cardEdificioImg,
      illustrationAlt: 'Ilustración digital moderna de edificio educativo institucional',
      title: isEs ? 'Instituciones' : 'Campuses',
      description: isEs 
        ? 'Encuentra instituciones educativas y conoce su oferta.'
        : 'Explore our educational institutions and academic tracks.',
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
        : 'Explore different training programs.',
      details: {
        headline: isEs ? 'Oferta de Formación Académica y Técnica' : 'Academic & Technical Programs',
        summary: isEs
          ? 'Formación integral desde primera infancia hasta bachilleres técnicos con doble titulación oficial sin costo.'
          : 'Complete academic tracks from preschool to high school with official dual technical certification.',
        items: [
          { name: isEs ? 'Técnico en Sistemas y Software' : 'IT & Systems Technician', duration: '2 Años (10° y 11°)', badge: isEs ? 'Oficial' : 'Official' },
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
          isEs ? '1. Diligenciamiento de formulario digital en Portales' : '1. Fill online registration form in Portals',
          isEs ? '2. Validación de código para acudientes (ACUD-2026)' : '2. Guardian validation code check',
          isEs ? '3. Carga de documentos de identidad y salud' : '3. ID & health records upload',
          isEs ? '4. Confirmación de cupo y carnet oficial' : '4. Spot allocation & student registration'
        ]
      },
      gradient: 'from-amber-500/15 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    }
  ];

  // Beneficios de Usar la Plataforma EduMed Digital (SIN el cuadro sobre carnet digital)
  const platformBenefits = [
    {
      icon: Laptop,
      title: isEs ? 'Matrículas y Trámites 100% en Línea' : '100% Online Enrollments & Requests',
      desc: isEs 
        ? 'Realiza solicitudes de cupo, diligenciamiento de formularios y radicado escolar desde cualquier lugar, sin filas ni desplazamientos a secretaría.'
        : 'Complete spot applications, registration forms, and school procedures from anywhere without lines.',
      tag: isEs ? 'Sin filas' : 'Paperless'
    },
    {
      icon: BellRing,
      title: isEs ? 'Seguimiento y Notificaciones en Tiempo Real' : 'Real-time Tracking & Notices',
      desc: isEs 
        ? 'Familias y acudientes siempre informados sobre circulares oficiales, alertas de novedades y seguimiento académico de sus hijos.'
        : 'Guardians and families stay updated with immediate circulars, academic notices, and notices.',
      tag: isEs ? 'Para familias' : 'For families'
    },
    {
      icon: Lock,
      title: isEs ? 'Seguridad y Privacidad Institucional' : 'Data Privacy & Security',
      desc: isEs 
        ? 'Información escolar protegida bajo la Ley 1581 de 2012, con validación de acudientes por código institucional y perfiles de acceso protegido.'
        : 'Protected student records complying with data privacy laws and encrypted guardian validation.',
      tag: isEs ? 'Datos protegidos' : 'Secure'
    },
    {
      icon: Smartphone,
      title: isEs ? 'Acceso 24/7 Multiplataforma' : '24/7 Multi-Device Access',
      desc: isEs 
        ? 'Disponible permanentemente desde computadores, tabletas y teléfonos inteligentes con interfaz moderna, rápida y adaptable.'
        : 'Available anytime across desktops, tablets, and smartphones with an intuitive design.',
      tag: isEs ? 'Disponible 24/7' : '24/7 Always on'
    },
    {
      icon: MessageSquare,
      title: isEs ? 'Canal de Soporte Directo y Oficial' : 'Direct Support Channel',
      desc: isEs 
        ? 'Atención a la comunidad mediante mesa de ayuda y correo oficial digitaledumed@gmail.com para resolver dudas técnicas o académicas.'
        : 'Dedicated helpdesk and direct official communication via digitaledumed@gmail.com.',
      tag: isEs ? 'Acompañamiento' : 'Assisted'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          1. HEADER INSTITUCIONAL OFICIAL
             - CONSERVA LOGO Y NOMBRE
             - MENÚ DE SECCIONES: Inicio, Oportunidades, Portales, Beneficios, Sedes y Contacto
             - SIN LOS BOTONES DE "INICIAR SESIÓN" Y "CREAR CUENTA" (QUITADOS)
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

          {/* Center Navigation Links: Oportunidades, Portales, Beneficios, Sedes */}
          <nav className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button 
              type="button"
              onClick={scrollToHero}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 font-bold transition-colors cursor-pointer"
            >
              {isEs ? 'Inicio' : 'Home'}
            </button>
            <button
              type="button"
              onClick={scrollToOpportunities}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Oportunidades' : 'Opportunities'}
            </button>
            <button
              type="button"
              onClick={scrollToAuthSection}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Portales' : 'Portals'}
            </button>
            <button
              type="button"
              onClick={scrollToBenefitsSection}
              className="hidden md:inline-flex px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Beneficios' : 'Benefits'}
            </button>
            <button
              type="button"
              onClick={scrollToSedesSection}
              className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Sedes y Contacto' : 'Campuses'}
            </button>
          </nav>

          {/* Selector de Tema e Idioma (Sin botones de Iniciar sesión ni Crear cuenta) */}
          <div className="flex items-center gap-2">
            
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
          2. APARTADO: INICIO (CARRUSEL PRINCIPAL / SLIDER DE 2 IMÁGENES)
          ========================================================================= */}
      <section 
        id="inicio"
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 select-none py-6 sm:py-8 lg:py-10"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="relative min-h-[580px] sm:min-h-[540px] md:min-h-[500px] lg:min-h-[520px] xl:min-h-[540px] rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex items-center">
            
            {/* Diapositivas con transición suave */}
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-5 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex items-center transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-98 z-0 pointer-events-none'
                  }`}
                >
                  {/* Resplandor ambiental */}
                  <div className={`absolute -right-10 -bottom-10 w-[500px] h-[500px] bg-gradient-to-br ${slide.palette.glow} rounded-full blur-3xl pointer-events-none`} />
                  <div className="absolute left-10 top-10 w-72 h-72 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Grid equilibrado: Texto + Ilustración */}
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-14 items-center">
                    
                    {/* Columna de Texto */}
                    <div className="lg:col-span-7 xl:col-span-7 space-y-3 sm:space-y-5 text-left">
                      
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className={slide.palette.badge}>{slide.badge}</span>
                      </div>

                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                        {slide.title}
                      </h1>

                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                        {slide.subtitle}
                      </p>

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

                      <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => handleSlideAction(slide.action)}
                          className={`px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer hover:scale-102 active:scale-95 group ${slide.palette.cta}`}
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1.5 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (slide.action === 'matriculas') {
                              scrollToAuthSection();
                            } else {
                              scrollToSedesSection();
                            }
                          }}
                          className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                        >
                          <span>{slide.secondaryText}</span>
                        </button>
                      </div>

                    </div>

                    {/* Columna de Ilustración */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
                      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800 group animate-subtle-float">
                        <img 
                          src={slide.image} 
                          alt={slide.alt}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        />
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

            {/* Flechas de navegación */}
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

            {/* Barra de progreso interactiva */}
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
          3. APARTADO: OPORTUNIDADES
             (SECCIÓN EN SU INTERFAZ DEDICADA, NO RETIRADA: Instituciones, Programas, Matrículas)
          ========================================================================= */}
      <section 
        id="oportunidades" 
        ref={opportunitiesRef} 
        className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'FORMACIÓN Y OFERTA ACADÉMICA' : 'ACADEMIC PATHWAYS'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? 'Oportunidades Educativas EduMed' : 'Educational Opportunities'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce nuestras instituciones oficiales, explora programas de formación técnica y consulta las opciones de matrícula disponibles en la I.E. Félix Henao Botero.'
                : 'Discover our official campuses, explore technical programs, and check open admissions.'}
            </p>
          </div>

          {/* Grid de las 3 Tarjetas en el apartado de Oportunidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {opportunityCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedOpportunityCard(card.id)}
                  className={`group relative p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border ${card.borderColor} shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-2 text-left overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs bg-slate-100 dark:bg-slate-800 group-hover:shadow-md transition-shadow">
                      <img 
                        src={card.illustration} 
                        alt={card.illustrationAlt}
                        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700/60 shadow-xs flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <span>{card.emoji}</span>
                      </div>
                      <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                        <IconComponent className="w-4 h-4 text-teal-300" />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                    <span className="group-hover:underline">{isEs ? 'Ver detalles de la oferta' : 'View details'}</span>
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
          4. APARTADO: PORTALES (INICIAR SESIÓN Y REGISTRARSE)
          ========================================================================= */}
      <section 
        id="portales" 
        ref={authSectionRef} 
        className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Información institucional de los portales */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{isEs ? 'Acceso Seguro y Oficial' : 'Secure Official Access'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {isEs ? 'Ingresa o Regístrate en tu Portal' : 'Sign In or Create Your Account'}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {isEs
                  ? 'Accede a tu cuenta institucional en EduMed Digital. Si eres acudiente, recuerda que puedes usar el código oficial asignado ACUD-2026 o tu número de documento de identidad para completar tu registro protegido.'
                  : 'Access your official EduMed Digital account. Guardians can use code ACUD-2026 or their document number to register.'}
              </p>

              {/* Roles visuales de portales */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal del Estudiante' : 'Student Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Carnet escolar oficial, notas periódicas, horario de clases y observador digital.' : 'Digital QR card, school schedule, and grade reports.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Familias y Acudientes' : 'Guardians Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Registro protegido con código ACUD-2026, seguimiento académico directo y circulares escolares.' : 'Validated registration, attendance, and administrative notices.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Directivo y Administrativo' : 'Administrative Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Auditoría SIMAT, validación documental, control de cupos y expedición de certificados.' : 'SIMAT audits, document approval, and school records.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* AuthCard interactiva para Iniciar sesión o Registrarse */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3">
                <AuthCard defaultMode="login" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. APARTADO: BENEFICIOS ("¿POR QUÉ ELEGIR EDUMED DIGITAL?")
             (SIN EL CUADRO SOBRE CARNET DIGITAL)
          ========================================================================= */}
      <section 
        id="beneficios" 
        ref={benefitsSectionRef}
        className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'VENTAJAS DE LA PLATAFORMA' : 'PLATFORM ADVANTAGES'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? '¿Por qué elegir EduMed Digital?' : 'Why Choose EduMed Digital?'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce los beneficios que ofrece nuestra plataforma para agilizar trámites, conectar a las familias y transformar la gestión escolar de la I.E. Félix Henao Botero.'
                : 'Discover the key benefits our platform brings to simplify procedures, connect families, and modernize education.'}
            </p>
          </div>

          {/* Grid de 5 beneficios (Sin carnet digital) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto text-left">
            {platformBenefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={idx}
                  className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {benefit.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2">
                      {benefit.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {benefit.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isEs ? 'Funcionalidad oficial incluida' : 'Official feature included'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. APARTADO: SEDES Y CONTACTO (PIE DE PÁGINA INSTITUCIONAL)
             - SEDES ESCRITAS CORRECTAMENTE
             - INFORMACIÓN ESTÁNDAR DE PIE DE PÁGINA
             - VENTANAS EMERGENTES APARECEN DIRECTAMENTE EN EL VIEWPORT ACTUAL
          ========================================================================= */}
      <footer 
        id="sedes" 
        ref={sedesSectionRef}
        className="w-full bg-[#001e30] text-slate-300 border-t border-slate-800 pt-14 pb-8 text-xs text-left"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800/90">
            
            {/* Col 1: Identidad Institucional */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={customLogoUrl} 
                  alt="Escudo Institución Educativa Félix Henao Botero" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 bg-white shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                  }}
                />
                <div>
                  <span className="font-black text-white text-base block leading-none">
                    I.E. Félix Henao Botero
                  </span>
                  <span className="text-[11px] text-teal-400 font-semibold block mt-1">
                    EduMed Digital • Sistema Educativo Oficial
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEs
                  ? 'Institución Educativa Oficial de carácter público en la Comuna 8 de Medellín. Comprometida con la formación integral, inclusión social y excelencia pedagógica.'
                  : 'Official public educational institution in Medellín providing quality inclusive education.'}
              </p>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div><strong>DANE:</strong> 105001002345</div>
                <div><strong>NIT:</strong> 890980123-1</div>
                <div><strong>Código ICFES:</strong> 014522</div>
                <div><strong>Resolución:</strong> Alcaldía de Medellín N° 16212</div>
              </div>
            </div>

            {/* Col 2: Ubicaciones Oficiales de las Sedes (Escritas Correctamente) */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>{isEs ? 'Sedes Institucionales' : 'Official Campuses'}</span>
              </h4>
              
              {/* Sede Principal */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs">
                      Sede Principal (Secundaria y Media Técnica)
                    </strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Calle 52 # 18-40, Barrio Enciso - Los Ángeles / Boston
                    </p>
                    <span className="text-[10px] text-teal-400 font-medium block mt-0.5">
                      Comuna 8 • Medellín, Antioquia
                    </span>
                  </div>
                </div>
              </div>

              {/* Sede Infantil */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-xs">
                      Sede Infantil (Preescolar y Primaria)
                    </strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Carrera 22 # 54-15, Barrio La Libertad
                    </p>
                    <span className="text-[10px] text-amber-400 font-medium block mt-0.5">
                      Comuna 8 • Medellín, Antioquia
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Lunes a Viernes: 7:30 a.m. - 12:30 p.m. / 1:30 p.m. - 4:30 p.m.</span>
              </div>
            </div>

            {/* Col 3: Navegación y Legal Estándar (Modales) */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-400" />
                <span>{isEs ? 'Información y Políticas' : 'Information & Legal'}</span>
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Política de Privacidad y Tratamiento de Datos' : 'Privacy Policy'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLegalModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Aviso Legal e Identificación Oficial' : 'Legal Notice'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={scrollToOpportunities}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Oferta y Oportunidades Educativas' : 'Educational Pathways'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={scrollToBenefitsSection}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Beneficios de la Plataforma' : 'Platform Benefits'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Atención, Contacto y Soporte Técnico (Ventana Emergente Directa) */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-400" />
                <span>{isEs ? 'Atención y Soporte Técnico' : 'Support & Help'}</span>
              </h4>
              
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEs 
                  ? '¿Tienes dudas sobre matrícula, código de acudiente o uso de EduMed Digital? Escríbenos o abre nuestra ventana de contacto.'
                  : 'Questions about registration, access, or technical issues? Contact our support team.'}
              </p>

              <div className="space-y-2 pt-1 text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <a href="mailto:digitaledumed@gmail.com" className="hover:text-teal-300 font-semibold text-white">
                    digitaledumed@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>PBX: (604) 284 56 78</span>
                </div>
              </div>

              {/* Botón para abrir Ventana Emergente de Contacto con Soporte */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(true);
                }}
                className="w-full mt-3 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isEs ? 'Contactar a Soporte (Ventana Emergente)' : 'Contact Support'}</span>
              </button>
            </div>

          </div>

          {/* Legal / Copyright inferior */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Institución Educativa Félix Henao Botero • Sistema Oficial EduMed Digital. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsPrivacyModalOpen(true);
                }} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Privacidad' : 'Privacy'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsTermsModalOpen(true);
                }} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Términos' : 'Terms'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsLegalModalOpen(true);
                }} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Aviso Legal' : 'Legal'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(true);
                }} 
                className="hover:text-teal-400 transition-colors cursor-pointer font-bold text-teal-400"
              >
                digitaledumed@gmail.com
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODAL 1: FORMULARIO DE CONTACTO Y SOPORTE TÉCNICO
          (Centrado directamente en el viewport actual m-auto)
          ========================================================================= */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetContactForm();
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left m-auto">
            <button
              type="button"
              onClick={resetContactForm}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer shadow-xs"
              title={isEs ? 'Cerrar ventana' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isEs ? '¡Solicitud de Contacto Enviada!' : 'Support Request Sent!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {isEs 
                    ? `Hemos recibido tu mensaje con radicado `
                    : `We have received your message with ticket `}
                  <strong className="text-teal-600 dark:text-teal-400 font-mono">{contactTicketId}</strong>.
                  {isEs 
                    ? ` Nuestro equipo responderá a tu correo a la mayor brevedad. También puedes escribirnos a `
                    : ` Our team will respond shortly. You can also write to `}
                  <strong className="text-slate-900 dark:text-white">digitaledumed@gmail.com</strong>.
                </p>
                <button
                  type="button"
                  onClick={resetContactForm}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  {isEs ? 'Aceptar y Cerrar' : 'Done'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {isEs ? 'Contacto con Soporte Técnico' : 'Contact Support'}
                    </h3>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                      EduMed Digital • digitaledumed@gmail.com
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  {isEs 
                    ? 'Diligencia el formulario para comunicarte directamente con el equipo de soporte de la I.E. Félix Henao Botero.'
                    : 'Fill out this form to get in touch with our EduMed Digital support team.'}
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEs ? 'Nombre completo *' : 'Full name *'}
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder={isEs ? 'Ej: Juan Pérez' : 'Your name'}
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEs ? 'Correo electrónico *' : 'Email address *'}
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder={isEs ? 'correo@ejemplo.com' : 'email@example.com'}
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
                      </label>
                      <input 
                        type="tel"
                        placeholder="Ej: 300 123 4567"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEs ? 'Rol en la institución' : 'Role'}
                      </label>
                      <select 
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Acudiente / Familia">Acudiente / Familia</option>
                        <option value="Estudiante">Estudiante</option>
                        <option value="Docente / Administrativo">Docente / Administrativo</option>
                        <option value="Aspirante / Matrícula">Aspirante / Matrícula</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isEs ? 'Asunto *' : 'Subject *'}
                    </label>
                    <select 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Soporte Técnico de Plataforma">Soporte Técnico de Plataforma</option>
                      <option value="Duda con Código de Validación de Acudiente">Duda con Código de Validación de Acudiente</option>
                      <option value="Información de Matrículas 2026">Información de Matrículas 2026</option>
                      <option value="Carnet Escolar Digital">Carnet Escolar Digital</option>
                      <option value="Actualización de Datos o Teléfono">Actualización de Datos o Teléfono</option>
                      <option value="Otra Consulta Institucional">Otra Consulta Institucional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {isEs ? 'Mensaje o Detalle de la Solicitud *' : 'Message *'}
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder={isEs ? 'Describe brevemente tu consulta...' : 'Describe your request...'}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-400">
                      Soporte: <strong>digitaledumed@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isEs ? 'Enviar Mensaje' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: POLÍTICA DE PRIVACIDAD
          ========================================================================= */}
      {isPrivacyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrivacyModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left m-auto max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(false)}
              className="sticky top-0 float-right p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer shadow-xs z-10"
              title={isEs ? 'Cerrar' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Política de Privacidad y Tratamiento de Datos' : 'Privacy Policy'}
                </h3>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  I.E. Félix Henao Botero • Ley 1581 de 2012 (Colombia)
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  1. Marco Legal y Compromiso Institucional
                </h4>
                <p>
                  La <strong>Institución Educativa Félix Henao Botero</strong> de Medellín garantiza la debida protección, privacidad y seguridad de los datos personales suministrados a través de <strong>EduMed Digital</strong>, en estricto cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Datos de Menores de Edad
                </h4>
                <p>
                  El tratamiento de datos personales de menores responde al interés superior del estudiante, con fines formativos, registro SIMAT y comunicación con acudientes autorizados.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  3. Contacto y Consultas
                </h4>
                <p>
                  Para ejercer sus derechos de Habeas Data, puede escribir al correo oficial: <strong className="text-teal-600 dark:text-teal-400">digitaledumed@gmail.com</strong>.
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {isEs ? 'Entendido y Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: TÉRMINOS Y CONDICIONES
          ========================================================================= */}
      {isTermsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTermsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left m-auto max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsTermsModalOpen(false)}
              className="sticky top-0 float-right p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer shadow-xs z-10"
              title={isEs ? 'Cerrar' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions'}
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Plataforma Escolar EduMed Digital • I.E. Félix Henao Botero
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  1. Uso Institucional y Pedagógico
                </h4>
                <p>
                  <strong>EduMed Digital</strong> es el entorno virtual oficial de gestión de la I.E. Félix Henao Botero. Su uso está reservado a la comunidad escolar vinculada.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Responsabilidad de Credenciales
                </h4>
                <p>
                  Las claves y códigos de validación asignados a acudientes y estudiantes son personales e intransferibles. Cualquier duda técnica puede canalizarse a <strong className="text-blue-600 dark:text-blue-400">digitaledumed@gmail.com</strong>.
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {isEs ? 'Aceptar y Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: AVISO LEGAL INSTITUCIONAL
          ========================================================================= */}
      {isLegalModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLegalModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left m-auto max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsLegalModalOpen(false)}
              className="sticky top-0 float-right p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer shadow-xs z-10"
              title={isEs ? 'Cerrar' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Aviso Legal e Identificación Institucional' : 'Legal Notice'}
                </h3>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  Información Institucional Oficial • Medellín, Colombia
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div><strong>Razón Social:</strong> Institución Educativa Félix Henao Botero</div>
                <div><strong>Naturaleza:</strong> Oficial, Pública, Mixta, Calendario A</div>
                <div><strong>Municipio:</strong> Medellín, Antioquia (Secretaría de Educación)</div>
                <div><strong>Código DANE:</strong> 105001002345</div>
                <div><strong>NIT:</strong> 890980123-1</div>
                <div><strong>Código ICFES:</strong> 014522</div>
              </div>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Sedes Oficiales
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sede Principal:</strong> Calle 52 # 18-40, Barrio Enciso - Boston, Comuna 8, Medellín.</li>
                  <li><strong>Sede Infantil:</strong> Carrera 22 # 54-15, Barrio La Libertad, Comuna 8, Medellín.</li>
                </ul>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                {isEs ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: DETALLE DE OPORTUNIDADES (Instituciones, Programas, Matrículas)
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
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl text-left m-auto">
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
                      scrollToAuthSection();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEs ? 'Ir a Portales' : 'Go to Portals'}</span>
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

    </div>
  );
};

export default LoginScreen;
