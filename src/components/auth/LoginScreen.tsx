import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from '../public/AuthCard';
import slideMatriculasImg from '../../assets/images/slide_matriculas_v2_1790639962382.jpg';
import slideInstitucionesImg from '../../assets/images/slide_instituciones_v2_1790639972681.jpg';
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
  Menu,
  ArrowUp
} from 'lucide-react';

interface LoginScreenProps {
  onReplaySplash?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    customLogoUrl,
    setActiveTab
  } = useApp();

  const isEs = language === 'es';

  // Modales legales y de contacto del pie de página
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estado del formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'guardian',
    subject: 'support',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactTicketId, setContactTicketId] = useState('');

  // Carrusel automático del Banner Principal (2 diapositivas)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const authSectionRef = useRef<HTMLDivElement>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null);
  const sedesSectionRef = useRef<HTMLDivElement>(null);

  // Bloqueo de scroll de fondo cuando hay un modal abierto
  useEffect(() => {
    const isAnyModalOpen = isContactModalOpen || isPrivacyModalOpen || isTermsModalOpen || isLegalModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isContactModalOpen, isPrivacyModalOpen, isTermsModalOpen, isLegalModalOpen]);

  // 2 Diapositivas exactas del Slider: 100% Bilingües (Español / Inglés)
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'ADMISIONES 2026' : '2026 ADMISSIONS',
      title: isEs ? '¡Matrículas disponibles!' : 'Enrollment Available!',
      subtitle: isEs 
        ? 'Infórmate sobre los cupos y fechas de matrícula disponibles para continuar tus estudios oficiales.'
        : 'Learn about all open enrollment dates and spots available to continue your official education.',
      ctaText: isEs ? 'Ver matrículas' : 'View admissions',
      secondaryText: isEs ? 'Iniciar sesión' : 'Sign In',
      action: 'matriculas',
      keyBenefits: [
        isEs ? '100% Gratuito y Oficial' : '100% Tuition-Free & Official',
        isEs ? 'Conexión Directa SIMAT' : 'Direct SIMAT Records',
        isEs ? 'Gestión Virtual 24/7' : '24/7 Online Management'
      ],
      image: slideMatriculasImg,
      alt: isEs 
        ? 'Ilustración digital moderna de estudiantes en proceso de matrícula escolar' 
        : 'Modern digital illustration of students in school enrollment process',
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
      title: isEs ? '¡Conoce nuevas instituciones!' : 'Explore Educational Campuses!',
      subtitle: isEs 
        ? 'Explora instituciones y sus opciones de formación en modernas sedes pensadas para tu futuro.'
        : 'Explore our institutions and study options across modern campuses designed for your growth.',
      ctaText: isEs ? 'Ver instituciones' : 'View campuses',
      secondaryText: isEs ? 'Nuestras sedes' : 'Our campuses',
      action: 'instituciones',
      keyBenefits: [
        isEs ? 'Sede Principal (Enciso - Boston)' : 'Main Campus (Enciso - Boston)',
        isEs ? 'Sede Infantil (La Libertad)' : 'Elementary Campus (La Libertad)',
        isEs ? 'Ambientes de Estudio Modernos' : 'Modern Learning Environments'
      ],
      image: slideInstitucionesImg,
      alt: isEs 
        ? 'Ilustración digital moderna de campus arquitectónico educativo' 
        : 'Modern digital illustration of educational school campus',
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
      scrollToAuthSection();
    } else if (action === 'instituciones') {
      scrollToSedesSection();
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
      role: 'guardian',
      subject: 'support',
      message: ''
    });
    setContactSubmitted(false);
    setIsContactModalOpen(false);
  };

  // 5 Beneficios de Usar la Plataforma (SIN el cuadro de carnet digital) - 100% Bilingüe
  const platformBenefits = [
    {
      icon: Laptop,
      title: isEs ? 'Matrículas y Trámites 100% en Línea' : '100% Online Enrollment & Requests',
      desc: isEs 
        ? 'Realiza solicitudes de cupo, diligenciamiento de formularios y radicado escolar desde cualquier lugar, sin filas ni desplazamientos a secretaría.'
        : 'Apply for school admission, fill out official forms, and track applications from anywhere without waiting in lines.',
      tag: isEs ? 'Sin filas' : 'Paperless'
    },
    {
      icon: BellRing,
      title: isEs ? 'Seguimiento y Notificaciones en Tiempo Real' : 'Real-Time Tracking & Notifications',
      desc: isEs 
        ? 'Familias y acudientes siempre informados sobre circulares oficiales, alertas de novedades y seguimiento académico de sus hijos.'
        : 'Families stay updated with official school circulars, immediate notifications, and academic progress tracking.',
      tag: isEs ? 'Para familias' : 'For families'
    },
    {
      icon: Lock,
      title: isEs ? 'Seguridad y Privacidad Institucional' : 'Institutional Data Security & Privacy',
      desc: isEs 
        ? 'Información escolar protegida bajo la Ley 1581 de 2012, con validación de acudientes por código institucional y perfiles de acceso protegido.'
        : 'Student records protected under data privacy laws with secure guardian verification and role-based permissions.',
      tag: isEs ? 'Datos protegidos' : 'Protected data'
    },
    {
      icon: Smartphone,
      title: isEs ? 'Acceso 24/7 Multiplataforma' : '24/7 Multi-Device Access',
      desc: isEs 
        ? 'Disponible permanentemente desde computadores, tabletas y teléfonos inteligentes con interfaz moderna, rápida y adaptable.'
        : 'Accessible anytime on desktop computers, tablets, and smartphones with a fast, modern responsive design.',
      tag: isEs ? 'Disponible 24/7' : '24/7 Available'
    },
    {
      icon: MessageSquare,
      title: isEs ? 'Canal de Soporte Directo y Oficial' : 'Official Direct Support Channel',
      desc: isEs 
        ? 'Atención ágil a la comunidad mediante mesa de ayuda y correo oficial digitaledumed@gmail.com para resolver dudas técnicas o académicas.'
        : 'Direct community assistance through our helpdesk and official email digitaledumed@gmail.com for technical or academic questions.',
      tag: isEs ? 'Acompañamiento' : 'Dedicated support'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 text-base sm:text-lg leading-relaxed">
      
      {/* =========================================================================
          1. HEADER INSTITUCIONAL OFICIAL
             - CONSERVA LOGO Y NOMBRE
             - MENÚ: Inicio, Iniciar Sesión, ¿Por qué EduMed?, Sedes y Contacto
             - SIN BOTONES DE "INICIAR SESIÓN" Y "CREAR CUENTA" EN LA BARRA SUPERIOR
          ========================================================================= */}
      <header className="w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & School Identity Oficial EduMed */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 select-none min-w-0">
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Escudo Institución Educativa Félix Henao Botero" 
                className="w-11 h-11 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-sm bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <span 
                className="absolute -bottom-1 -right-1 px-1 sm:px-1.5 py-0.5 rounded bg-teal-600 text-white font-black text-[9px] sm:text-xs uppercase tracking-wider border border-white shadow-xs"
                title="Plataforma Oficial EduMed Digital"
              >
                OFICIAL
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  edumed <span className="text-teal-600 dark:text-teal-400 font-extrabold">digital</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 uppercase tracking-wide shrink-0">
                  {isEs ? 'Portal Oficial' : 'Official Portal'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                I.E. Félix Henao Botero
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Medellín • Comuna 8 • DANE 105001002345
              </span>
            </div>
          </div>

          {/* Menú de Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              type="button"
              onClick={scrollToHero}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 font-semibold transition-colors cursor-pointer flex items-center"
            >
              {isEs ? 'Inicio' : 'Home'}
            </button>
            <button
              type="button"
              onClick={scrollToAuthSection}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center"
            >
              {isEs ? 'Iniciar Sesión' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={scrollToBenefitsSection}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center"
            >
              {isEs ? '¿Por qué EduMed?' : 'Why EduMed?'}
            </button>
            <button
              type="button"
              onClick={scrollToSedesSection}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center"
            >
              {isEs ? 'Sedes y Contacto' : 'Campuses & Contact'}
            </button>
          </nav>

          {/* Acciones: Selector de Tema, Idioma y Menú Móvil */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title={theme === 'light' ? (isEs ? 'Modo Oscuro' : 'Dark Mode') : (isEs ? 'Modo Claro' : 'Light Mode')}
              aria-label={theme === 'light' ? (isEs ? 'Cambiar a modo oscuro' : 'Switch to dark mode') : (isEs ? 'Cambiar a modo claro' : 'Switch to light mode')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-300" />}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(isEs ? 'en' : 'es')}
              className="h-10 sm:h-11 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
              title={isEs ? 'Switch to English' : 'Cambiar a Español'}
              aria-label={isEs ? 'Cambiar idioma' : 'Switch language'}
            >
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{isEs ? 'ES' : 'EN'}</span>
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label={isEs ? 'Abrir menú de navegación' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
            <button 
              type="button"
              onClick={() => {
                scrollToHero();
                setIsMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 text-left font-bold text-sm sm:text-base flex items-center justify-between"
            >
              <span>{isEs ? 'Inicio' : 'Home'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToAuthSection();
                setIsMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left font-bold text-sm sm:text-base flex items-center justify-between"
            >
              <span>{isEs ? 'Iniciar Sesión / Acceso Portales' : 'Sign In / Portal Access'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToBenefitsSection();
                setIsMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left font-bold text-sm sm:text-base flex items-center justify-between"
            >
              <span>{isEs ? '¿Por qué EduMed? (Beneficios)' : 'Why EduMed? (Benefits)'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                scrollToSedesSection();
                setIsMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-left font-bold text-sm sm:text-base flex items-center justify-between"
            >
              <span>{isEs ? 'Sedes Oficiales y Contacto' : 'Campuses & Contact'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. APARTADO: SLIDERS (CARRUSEL PRINCIPAL DE 2 IMÁGENES)
             Tipografía grande, moderna y atractiva
          ========================================================================= */}
      <section 
        id="inicio"
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 select-none py-6 sm:py-10 lg:py-12"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="relative min-h-[620px] xs:min-h-[580px] sm:min-h-[540px] md:min-h-[520px] lg:min-h-[560px] xl:min-h-[580px] rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex items-center pb-16 lg:pb-0">
            
            {/* Diapositivas */}
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-4 xs:p-5 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex items-center transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-98 z-0 pointer-events-none'
                  }`}
                >
                  {/* Resplandor ambiental */}
                  <div className={`absolute -right-10 -bottom-10 w-[260px] sm:w-[450px] h-[260px] sm:h-[450px] bg-gradient-to-br ${slide.palette.glow} rounded-full blur-3xl pointer-events-none`} />
                  <div className="absolute left-10 top-10 w-40 sm:w-64 h-40 sm:h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Grid equilibrado */}
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
                    
                    {/* Columna de Texto: Tipografía amplia y legible */}
                    <div className="lg:col-span-7 xl:col-span-7 space-y-2.5 sm:space-y-4 text-left">
                      
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 dark:text-teal-400" />
                        <span className={slide.palette.badge}>{slide.badge}</span>
                      </div>

                      <h1 className="heading-hero text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                        {slide.title}
                      </h1>

                      <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                        {slide.keyBenefits.map((benefit, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold border ${slide.palette.pill}`}
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                        <button
                          type="button"
                          onClick={() => handleSlideAction(slide.action)}
                          className={`w-full sm:w-auto min-h-[44px] px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl font-bold text-xs xs:text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-102 active:scale-95 group ${slide.palette.cta}`}
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
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
                          className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs xs:text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 text-center flex items-center justify-center"
                        >
                          <span>{slide.secondaryText}</span>
                        </button>
                      </div>

                    </div>

                    {/* Columna de Ilustración con escalado responsive */}
                    <div className="hidden sm:flex lg:col-span-5 xl:col-span-5 justify-center items-center">
                      <div className="relative w-full max-w-[260px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800 group animate-subtle-float">
                        <img 
                          src={slide.image} 
                          alt={slide.alt}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">EduMed Digital</span>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-teal-700 dark:text-teal-400">
                            {slide.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}

            {/* Flechas de navegación con touch-target de 44px (ocultas en < sm para evitar superposición en pantallas pequeñas) */}
            <button
              type="button"
              onClick={handlePrevSlide}
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer items-center justify-center hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Diapositiva anterior' : 'Previous slide'}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer items-center justify-center hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Siguiente diapositiva' : 'Next slide'}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Indicadores inferiores elegantes y accesibles */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2.5 bg-white/95 dark:bg-slate-900/95 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-slate-200/90 dark:border-slate-700/90 shadow-md backdrop-blur-md">
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
                    className="p-1.5 flex items-center justify-center cursor-pointer min-h-[36px] touch-manipulation"
                    title={`Diapositiva ${idx + 1}: ${slide.title}`}
                    aria-label={`Ir a diapositiva ${idx + 1}: ${slide.title}`}
                  >
                    <span className={`relative h-2.5 rounded-full overflow-hidden transition-all flex items-center block ${
                      isActive ? 'w-8 xs:w-12 sm:w-14 bg-slate-200 dark:bg-slate-700' : 'w-2.5 sm:w-3 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                    }`}>
                      {isActive && (
                        <span 
                          className="absolute inset-y-0 left-0 bg-teal-600 dark:bg-teal-400 rounded-full transition-all duration-75"
                          style={{ width: `${slideProgress}%` }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}

              <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5 sm:mx-1.5" />

              <button
                type="button"
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="w-8 h-8 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={isCarouselPaused ? (isEs ? 'Reanudar carrusel' : 'Play') : (isEs ? 'Pausar carrusel' : 'Pause')}
                aria-label={isCarouselPaused ? (isEs ? 'Reanudar carrusel automático' : 'Resume slideshow') : (isEs ? 'Pausar carrusel automático' : 'Pause slideshow')}
              >
                {isCarouselPaused ? <Play className="w-4 h-4 text-teal-600 dark:text-teal-400" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. APARTADO: PARA INICIAR SESIÓN O REGISTRARSE (PORTALES + AUTHCARD)
             Tipografía amplia, cómoda y accesible
          ========================================================================= */}
      <section 
        id="portales" 
        ref={authSectionRef} 
        className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Información institucional de los portales */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-sm sm:text-base font-bold shadow-2xs">
                <Sparkles className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
                <span>{isEs ? 'Acceso Seguro y Oficial' : 'Secure Official Access'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {isEs ? 'Ingresa o Regístrate en tu Portal' : 'Sign In or Create Your Account'}
              </h2>

              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {isEs
                  ? 'Accede a tu cuenta institucional en EduMed Digital. Si eres acudiente, recuerda que puedes usar el código oficial asignado ACUD-2026 o tu número de documento de identidad registrado para completar tu vinculación.'
                  : 'Access your official EduMed Digital account. Guardians can use the official code ACUD-2026 or their registered document number to complete registration.'}
              </p>

              {/* Roles visuales interactivos */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                      {isEs ? 'Portal del Estudiante' : 'Student Portal'}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                      {isEs 
                        ? 'Carnet escolar oficial con código QR, notas periódicas, horario de clases y observador formativo.' 
                        : 'Official digital ID with QR code, report cards, class schedule, and academic tracking.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                      {isEs ? 'Portal Familias y Acudientes' : 'Guardians & Families Portal'}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                      {isEs 
                        ? 'Registro protegido con código oficial ACUD-2026, seguimiento académico directo y circulares escolares.' 
                        : 'Protected sign-up with official code ACUD-2026, student academic monitoring, and school notices.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                      {isEs ? 'Portal Directivo y Administrativo' : 'Administrative & Staff Portal'}
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                      {isEs 
                        ? 'Auditoría SIMAT, validación documental, control de cupos y expedición de certificados oficiales.' 
                        : 'SIMAT audits, document approval, spot quota allocation, and official certificate issuance.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Tarjeta de Autenticación */}
            <div className="lg:col-span-6 w-full max-w-lg mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4">
                <AuthCard defaultMode="login" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. APARTADO: ¿POR QUÉ ELEGIR EDUMED DIGITAL?
             - 5 BENEFICIOS CONCRETOS (SIN CARNET DIGITAL)
             - TIPOGRAFÍA ESTÁNDAR, MODERNA Y TOTALMENTE BILINGÜE
          ========================================================================= */}
      <section 
        id="beneficios" 
        ref={benefitsSectionRef}
        className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'VENTAJAS Y BENEFICIOS' : 'ADVANTAGES & BENEFITS'}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? '¿Por qué elegir EduMed Digital?' : 'Why Choose EduMed Digital?'}
            </h2>
            <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              {isEs
                ? 'Conoce los beneficios que ofrece nuestra plataforma para agilizar trámites, conectar a las familias y transformar la gestión escolar de la I.E. Félix Henao Botero.'
                : 'Discover the key benefits our platform brings to simplify procedures, connect families, and modernize school management.'}
            </p>
          </div>

          {/* Grid de 5 beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto text-left">
            {platformBenefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 sm:p-9 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {benefit.tag}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2.5">
                      {benefit.title}
                    </h3>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {benefit.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-base font-bold text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isEs ? 'Funcionalidad oficial incluida' : 'Official feature included'}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PIE DE PÁGINA INSTITUCIONAL: SEDES Y CONTACTO
             - SEDES ESCRITAS CORRECTAMENTE
             - INFORMACIÓN ESTÁNDAR DE PÁGINAS WEB
             - TIPOGRAFÍA MODERNA Y VISIBLE
             - VENTANAS EMERGENTES DIRECTAS EN EL VIEWPORT ACTUAL
          ========================================================================= */}
      <footer 
        id="sedes" 
        ref={sedesSectionRef}
        className="relative w-full bg-slate-950 text-slate-300 border-t border-slate-800/90 pt-10 sm:pt-14 pb-10 overflow-hidden select-none"
      >
        {/* Línea superior decorativa con sutil gradiente institucional */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />

        {/* Resplandores ambientales decorativos sutiles */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[250px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* =====================================================================
              A. BANDA SUPERIOR DE ACCIONES RÁPIDAS Y ESTADO ACADÉMICO
              ===================================================================== */}
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    {isEs ? 'Portal Oficial' : 'Official Portal'} • EduMed Digital
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isEs ? 'Año Escolar 2026 · Matrículas Abiertas' : 'School Year 2026 · Admissions Open'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {isEs ? 'Institución Educativa Félix Henao Botero' : 'Félix Henao Botero Educational Institution'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 max-w-lg leading-relaxed">
                  {isEs 
                    ? 'Comuna 8 de Medellín • Educación pública incluyente, gratuita y con excelencia académica' 
                    : 'Comuna 8, Medellín • Quality, free and inclusive public education'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={scrollToAuthSection}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isEs ? 'Ingreso a Portales' : 'Portals Access'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('status');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEs ? 'Consultar SIMAT' : 'SIMAT Status'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(true);
                }}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/70 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>{isEs ? 'Mesa de Ayuda' : 'Help Desk'}</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              B. GRID PRINCIPAL DE 4 COLUMNAS ESTÉTICAS, ESTRUCTURADAS Y BALANCEADAS
              ===================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-8 pb-10 border-b border-slate-800/80">
            
            {/* Columna 1 (4 cols): Identidad Institucional y Acreditación */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img 
                    src={customLogoUrl} 
                    alt="Escudo Institución Educativa Félix Henao Botero" 
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 bg-white shadow-sm ring-1 ring-amber-400/20"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-teal-600 text-white font-bold text-[8.5px] uppercase tracking-wider border border-white/80 shadow-xs">
                    OFICIAL
                  </span>
                </div>
                <div>
                  <span className="font-bold text-white text-sm sm:text-base block leading-tight tracking-tight">
                    I.E. Félix Henao Botero
                  </span>
                  <span className="text-[11px] font-medium text-teal-400 block mt-0.5">
                    {isEs ? 'Alcaldía de Medellín · Secretaría de Educación' : 'Medellín City Hall · Education Ministry'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300/80 leading-relaxed font-normal">
                {isEs
                  ? 'Institución educativa oficial pública de Medellín comprometida con la formación humanística, técnica y ciudadana. Transformando el futuro de nuestros estudiantes y familias en la Comuna 8.'
                  : 'Official public educational institution in Medellín committed to holistic, technical, and civic development for students and families in Comuna 8.'}
              </p>

              {/* Ficha técnica oficial con números y etiquetas claras */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/70 pb-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {isEs ? 'Ficha de Registro Oficial' : 'Official Registry Data'}
                  </span>
                  <span className="text-[9.5px] font-semibold text-teal-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Vigilado MEN
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wider block">DANE</span>
                    <span className="font-mono text-[11px] font-bold text-slate-200">105001002345</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wider block">NIT Oficial</span>
                    <span className="font-mono text-[11px] font-bold text-slate-200">890980123-1</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wider block">Código ICFES</span>
                    <span className="font-mono text-[11px] font-bold text-slate-200">014522</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                    <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wider block">Aprobación</span>
                    <span className="font-bold text-[11px] text-teal-400 truncate block">Res. N° 16212</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna 2 (3 cols): Sedes Oficiales y Horarios */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <Building2 className="w-4 h-4 text-teal-400" />
                <h4 className="font-bold uppercase tracking-wider text-xs">
                  {isEs ? 'Sedes Institucionales' : 'Campuses & Locations'}
                </h4>
              </div>

              {/* Sede Principal */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-teal-500/40 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    {isEs ? 'Sede Principal' : 'Main Campus'}
                  </span>
                  <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    {isEs ? 'Bachillerato' : 'High School'}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-300 leading-snug pl-5">
                  Calle 52 # 18-40, Barrio Enciso - Boston
                </p>
                <span className="text-[10px] text-slate-400 block pl-5">
                  Comuna 8 • Medellín, Antioquia
                </span>
              </div>

              {/* Sede Infantil */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-amber-500/40 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {isEs ? 'Sede Infantil' : 'Elementary Campus'}
                  </span>
                  <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {isEs ? 'Primaria' : 'Elementary'}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-300 leading-snug pl-5">
                  Carrera 22 # 54-15, Barrio La Libertad
                </p>
                <span className="text-[10px] text-slate-400 block pl-5">
                  Comuna 8 • Medellín, Antioquia
                </span>
              </div>

              {/* Horario de Atención */}
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50 flex items-start gap-2.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block text-[10.5px]">
                    {isEs ? 'Atención en Secretaría:' : 'Office Hours:'}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                    {isEs 
                      ? 'Lunes a Viernes: 7:30 a.m. - 12:30 p.m. / 1:30 p.m. - 4:30 p.m.' 
                      : 'Mon to Fri: 7:30 a.m. - 12:30 p.m. / 1:30 p.m. - 4:30 p.m.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Columna 3 (2 cols): Navegación & Portales */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <h4 className="font-bold uppercase tracking-wider text-xs">
                  {isEs ? 'Portales & Enlaces' : 'Portals & Links'}
                </h4>
              </div>

              <nav className="flex flex-col space-y-0.5 text-xs">
                <button
                  type="button"
                  onClick={scrollToHero}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Inicio del Portal' : 'Portal Home'}</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToAuthSection}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Ingreso / Registro' : 'Login / Register'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('status');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Consulta SIMAT' : 'SIMAT Status'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('beneficios');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Beneficios (PAE)' : 'School Benefits'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('institucion');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Conoce la Institución' : 'About the School'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('soporte');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:text-teal-300 hover:bg-slate-900/60 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-teal-400 transition-all shrink-0" />
                  <span className="text-xs font-normal">{isEs ? 'Soporte y Ayuda' : 'Support & Help'}</span>
                </button>
              </nav>
            </div>

            {/* Columna 4 (3 cols): Mesa de Ayuda y Contacto Oficial */}
            <div className="lg:col-span-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-teal-500/30 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <HelpCircle className="w-4 h-4 text-teal-400" />
                    <h4 className="font-bold uppercase tracking-wider text-xs">
                      {isEs ? 'Mesa de Ayuda' : 'Help & Support'}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1.5 text-[9.5px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Activa
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-300/80 leading-relaxed">
                  {isEs 
                    ? '¿Dudas con matrículas, código de acudiente o radicado? Contáctanos a través de los canales oficiales:' 
                    : 'Questions about enrollments, guardian codes, or documents? Contact us directly:'}
                </p>

                <div className="space-y-1.5 text-xs">
                  <a 
                    href="mailto:digitaledumed@gmail.com" 
                    className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-slate-200 hover:text-teal-300 hover:border-teal-500/50 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-medium text-[11px] truncate">digitaledumed@gmail.com</span>
                  </a>

                  <a 
                    href="tel:+576042845678"
                    className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 text-slate-200 hover:text-teal-300 hover:border-teal-500/50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-medium text-[11px]">PBX: (604) 284 56 78</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsContactModalOpen(true);
                  }}
                  className="w-full py-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Radicar Consulta / Soporte' : 'Open Support Ticket'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* =====================================================================
              C. CINTA DE CUMPLIMIENTO LEGAL Y TRANSPARENCIA
              ===================================================================== */}
          <div className="py-4 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{isEs ? 'Garantía de Privacidad y Cumplimiento Normativo Escolar:' : 'Privacy Assurance & School Compliance:'}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsPrivacyModalOpen(true);
                }} 
                className="hover:text-teal-300 transition-colors cursor-pointer py-1"
              >
                {isEs ? 'Protección de Datos (Ley 1581)' : 'Privacy Policy'}
              </button>
              <span className="text-slate-700 hidden sm:inline">·</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsTermsModalOpen(true);
                }} 
                className="hover:text-teal-300 transition-colors cursor-pointer py-1"
              >
                {isEs ? 'Términos de Servicio' : 'Terms of Service'}
              </button>
              <span className="text-slate-700 hidden sm:inline">·</span>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsLegalModalOpen(true);
                }} 
                className="hover:text-teal-300 transition-colors cursor-pointer py-1"
              >
                {isEs ? 'Aviso Legal Institucional' : 'Legal Notice'}
              </button>
            </div>
          </div>

          {/* =====================================================================
              D. SUB-FOOTER CON COPYRIGHT Y BOTÓN ACCESIBLE VOLVER ARRIBA
              ===================================================================== */}
          <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
              <span>
                © {new Date().getFullYear()} Institución Educativa Félix Henao Botero · EduMed Digital.
              </span>
              <span className="hidden sm:inline text-slate-700">•</span>
              <span className="text-slate-400">
                {isEs ? 'Medellín, Antioquia, Colombia' : 'Medellín, Colombia'}
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToHero}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 hover:text-teal-300 border border-slate-800 hover:border-teal-500/40 text-[11px] font-medium transition-all cursor-pointer shadow-xs active:scale-95"
              title={isEs ? 'Volver al inicio de la página' : 'Back to top'}
              aria-label={isEs ? 'Volver arriba' : 'Back to top'}
            >
              <ArrowUp className="w-3 h-3" />
              <span>{isEs ? 'Volver arriba' : 'Back to top'}</span>
            </button>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODAL 1: FORMULARIO DE CONTACTO Y SOPORTE TÉCNICO (100% BILINGÜE)
          ========================================================================= */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetContactForm();
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left m-auto max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={resetContactForm}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer shadow-xs"
              title={isEs ? 'Cerrar ventana' : 'Close window'}
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {isEs ? '¡Solicitud de Contacto Enviada!' : 'Support Request Submitted!'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  {isEs 
                    ? `Hemos recibido tu mensaje con número de radicado `
                    : `We have received your message with ticket number `}
                  <strong className="text-teal-600 dark:text-teal-400 font-mono text-base">{contactTicketId}</strong>.
                  {isEs 
                    ? ` Nuestro equipo responderá a tu correo a la mayor brevedad. También puedes escribirnos directamente a `
                    : ` Our team will reply to your email shortly. You can also write directly to `}
                  <strong className="text-slate-900 dark:text-white">digitaledumed@gmail.com</strong>.
                </p>
                <button
                  type="button"
                  onClick={resetContactForm}
                  className="mt-4 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer"
                >
                  {isEs ? 'Aceptar y Cerrar' : 'Done & Close'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {isEs ? 'Contacto con Soporte Técnico' : 'Technical Support Contact'}
                    </h3>
                    <span className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-bold">
                      EduMed Digital • digitaledumed@gmail.com
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                  {isEs 
                    ? 'Diligencia el formulario para comunicarte directamente con el equipo de soporte de la I.E. Félix Henao Botero.'
                    : 'Fill out this form to get in touch with our EduMed Digital support team directly.'}
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEs ? 'Nombre completo *' : 'Full name *'}
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder={isEs ? 'Ej: Juan Pérez' : 'Ex: John Doe'}
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEs ? 'Correo electrónico *' : 'Email address *'}
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="correo@ejemplo.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEs ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
                      </label>
                      <input 
                        type="tel"
                        placeholder="300 123 4567"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEs ? 'Rol en la institución' : 'Role'}
                      </label>
                      <select 
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="guardian">{isEs ? 'Acudiente / Familia' : 'Guardian / Family'}</option>
                        <option value="student">{isEs ? 'Estudiante' : 'Student'}</option>
                        <option value="staff">{isEs ? 'Docente / Administrativo' : 'Teacher / Administrative'}</option>
                        <option value="applicant">{isEs ? 'Aspirante / Matrícula' : 'Applicant / Admission'}</option>
                        <option value="other">{isEs ? 'Otro' : 'Other'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isEs ? 'Asunto *' : 'Subject *'}
                    </label>
                    <select 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="support">{isEs ? 'Soporte Técnico de Plataforma' : 'Platform Technical Support'}</option>
                      <option value="code">{isEs ? 'Duda con Código de Validación de Acudiente' : 'Guardian Validation Code Query'}</option>
                      <option value="enrollment">{isEs ? 'Información de Matrículas 2026' : '2026 Admissions Information'}</option>
                      <option value="idcard">{isEs ? 'Carnet Escolar Digital' : 'Digital Student ID'}</option>
                      <option value="update">{isEs ? 'Actualización de Datos o Teléfono' : 'Data or Phone Update'}</option>
                      <option value="other">{isEs ? 'Otra Consulta Institucional' : 'Other Inquiry'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isEs ? 'Mensaje o Detalle de la Solicitud *' : 'Message or Request Details *'}
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder={isEs ? 'Describe detalladamente tu solicitud o consulta...' : 'Describe your inquiry or technical issue in detail...'}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {isEs ? 'Soporte oficial:' : 'Official support:'} <strong className="text-teal-600 dark:text-teal-400 break-all">digitaledumed@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      className="min-h-[44px] px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isEs ? 'Enviar Mensaje' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: POLÍTICA DE PRIVACIDAD (100% BILINGÜE)
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

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Política de Privacidad y Tratamiento de Datos' : 'Privacy & Personal Data Protection Policy'}
                </h3>
                <span className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-bold">
                  I.E. Félix Henao Botero • {isEs ? 'Ley Estatutaria 1581 de 2012' : 'Statutory Law 1581 of 2012 (Colombia)'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? '1. Marco Legal y Compromiso Institucional' : '1. Legal Framework & Institutional Commitment'}
                </h4>
                <p>
                  {isEs 
                    ? 'La Institución Educativa Félix Henao Botero de Medellín garantiza la debida protección, privacidad y seguridad de los datos personales suministrados a través de EduMed Digital, en estricto cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.'
                    : 'The Institución Educativa Félix Henao Botero in Medellín guarantees the due protection, privacy, and security of all personal data provided through EduMed Digital, in strict compliance with Colombian Law 1581 of 2012 and Decree 1377 of 2013.'}
                </p>
              </section>

              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? '2. Datos de Niños, Niñas y Adolescentes' : '2. Children and Minor Data Protection'}
                </h4>
                <p>
                  {isEs 
                    ? 'El tratamiento de datos personales de menores responde al interés superior del estudiante, con fines formativos, registro SIMAT y comunicación con acudientes autorizados.'
                    : 'Personal data handling of minors strictly adheres to the best interests of the student, serving exclusively educational, SIMAT registration, and verified guardian communication purposes.'}
                </p>
              </section>

              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? '3. Canales de Ejercicio de Derechos' : '3. Habeas Data Rights & Contact'}
                </h4>
                <p>
                  {isEs 
                    ? 'Para ejercer sus derechos de Habeas Data (conocer, actualizar y rectificar información), puede escribir al correo oficial: '
                    : 'To exercise your rights to access, update, or rectify information, you may email our official address: '}
                  <strong className="text-teal-600 dark:text-teal-400">digitaledumed@gmail.com</strong>.
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                {isEs ? 'Entendido y Cerrar' : 'Done & Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: TÉRMINOS Y CONDICIONES (100% BILINGÜE)
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

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions of Use'}
                </h3>
                <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold">
                  EduMed Digital • I.E. Félix Henao Botero
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? '1. Uso Institucional y Pedagógico' : '1. Institutional & Pedagogical Use'}
                </h4>
                <p>
                  {isEs 
                    ? 'EduMed Digital es el entorno virtual oficial de gestión pedagógica de la I.E. Félix Henao Botero. Su uso está reservado a la comunidad escolar vinculada.'
                    : 'EduMed Digital is the official educational management portal of I.E. Félix Henao Botero. Its usage is strictly restricted to enrolled students, authorized guardians, and faculty.'}
                </p>
              </section>

              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? '2. Responsabilidad de Credenciales' : '2. Credential Security & Codes'}
                </h4>
                <p>
                  {isEs 
                    ? 'Las claves y códigos de validación asignados a acudientes y estudiantes son personales e intransferibles. Cualquier duda técnica puede canalizarse a digitaledumed@gmail.com.'
                    : 'Access credentials and validation codes issued to families are strictly personal and non-transferable. For technical assistance, email digitaledumed@gmail.com.'}
                </p>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center"
              >
                {isEs ? 'Aceptar y Cerrar' : 'Accept & Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: AVISO LEGAL INSTITUCIONAL (100% BILINGÜE)
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

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {isEs ? 'Aviso Legal e Identificación Institucional' : 'Legal Notice & Official School ID'}
                </h3>
                <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-bold">
                  {isEs ? 'Información Institucional Oficial • Medellín, Colombia' : 'Official Institutional Registry • Medellín, Colombia'}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs sm:text-sm">
                <div><strong>{isEs ? 'Razón Social:' : 'Legal Name:'}</strong> Institución Educativa Félix Henao Botero</div>
                <div><strong>{isEs ? 'Naturaleza:' : 'Entity Type:'}</strong> {isEs ? 'Oficial, Pública, Mixta, Calendario A' : 'Official, Public, Co-educational, Calendar A'}</div>
                <div><strong>{isEs ? 'Entidad Territorial:' : 'Local Authority:'}</strong> Alcaldía de Medellín - Secretaría de Educación</div>
                <div><strong>{isEs ? 'Código DANE:' : 'DANE Code:'}</strong> 105001002345</div>
                <div><strong>NIT:</strong> 890980123-1</div>
                <div><strong>{isEs ? 'Código ICFES:' : 'ICFES Code:'}</strong> 014522</div>
              </div>

              <section>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
                  {isEs ? 'Ubicación de Sedes Oficiales' : 'Official Campuses Location'}
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>{isEs ? 'Sede Principal:' : 'Main Campus:'}</strong> Calle 52 # 18-40, Barrio Enciso - Boston, Comuna 8, Medellín.</li>
                  <li><strong>{isEs ? 'Sede Infantil:' : 'Elementary Campus:'}</strong> Carrera 22 # 54-15, Barrio La Libertad, Comuna 8, Medellín.</li>
                </ul>
              </section>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLegalModalOpen(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center"
              >
                {isEs ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginScreen;
