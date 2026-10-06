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
  MessageSquare
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
    customLogoUrl
  } = useApp();

  const isEs = language === 'es';

  // Modales legales y de contacto del pie de página
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

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
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Logo & School Identity Oficial EduMed */}
          <div className="flex items-center gap-3.5 select-none">
            <div className="relative shrink-0">
              <img 
                src={customLogoUrl} 
                alt="Escudo Institución Educativa Félix Henao Botero" 
                className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-sm bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              <span 
                className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-teal-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider border border-white shadow-xs"
                title="Plataforma Oficial EduMed Digital"
              >
                OFICIAL
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  edumed <span className="text-teal-600 dark:text-teal-400 font-extrabold">digital</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 uppercase tracking-wide">
                  {isEs ? 'Portal Oficial' : 'Official Portal'}
                </span>
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 leading-tight">
                I.E. Félix Henao Botero
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Medellín • Comuna 8 • DANE 105001002345
              </span>
            </div>
          </div>

          {/* Menú de Navegación con Tipografía Estándar y Cómoda */}
          <nav className="flex items-center gap-2 sm:gap-3 md:gap-4 text-base sm:text-lg font-bold text-slate-600 dark:text-slate-300">
            <button 
              type="button"
              onClick={scrollToHero}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-700 dark:text-teal-400 transition-colors cursor-pointer"
            >
              {isEs ? 'Inicio' : 'Home'}
            </button>
            <button
              type="button"
              onClick={scrollToAuthSection}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Iniciar Sesión' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={scrollToBenefitsSection}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? '¿Por qué EduMed?' : 'Why EduMed?'}
            </button>
            <button
              type="button"
              onClick={scrollToSedesSection}
              className="hidden md:inline-flex px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Sedes y Contacto' : 'Campuses & Contact'}
            </button>
          </nav>

          {/* Acciones: Selector de Tema e Idioma */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title={theme === 'light' ? (isEs ? 'Modo Oscuro' : 'Dark Mode') : (isEs ? 'Modo Claro' : 'Light Mode')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-300" />}
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(isEs ? 'en' : 'es')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
              title={isEs ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
              <span>{isEs ? 'ES' : 'EN'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* =========================================================================
          2. APARTADO: SLIDERS (CARRUSEL PRINCIPAL DE 2 IMÁGENES)
             Tipografía grande, moderna y atractiva
          ========================================================================= */}
      <section 
        id="inicio"
        ref={heroSectionRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 select-none py-8 sm:py-10 lg:py-12"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          
          <div className="relative min-h-[620px] sm:min-h-[580px] md:min-h-[540px] lg:min-h-[560px] xl:min-h-[580px] rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex items-center">
            
            {/* Diapositivas */}
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 p-6 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex items-center transition-all duration-700 ease-in-out ${
                    isActive ? 'opacity-100 scale-100 z-10 pointer-events-auto' : 'opacity-0 scale-98 z-0 pointer-events-none'
                  }`}
                >
                  {/* Resplandor ambiental */}
                  <div className={`absolute -right-10 -bottom-10 w-[500px] h-[500px] bg-gradient-to-br ${slide.palette.glow} rounded-full blur-3xl pointer-events-none`} />
                  <div className="absolute left-10 top-10 w-72 h-72 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Grid equilibrado */}
                  <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                    
                    {/* Columna de Texto: Tipografía amplia y legible */}
                    <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-6 text-left">
                      
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
                        <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span className={slide.palette.badge}>{slide.badge}</span>
                      </div>

                      <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                        {slide.title}
                      </h1>

                      <p className="text-base sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {slide.keyBenefits.map((benefit, i) => (
                          <div 
                            key={i} 
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border ${slide.palette.pill}`}
                          >
                            <Check className="w-4 h-4 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 sm:pt-4 flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleSlideAction(slide.action)}
                          className={`px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl font-bold text-base sm:text-lg shadow-lg transition-all flex items-center gap-3 cursor-pointer hover:scale-102 active:scale-95 group ${slide.palette.cta}`}
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
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
                          className="px-6 sm:px-8 py-4 sm:py-4.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base sm:text-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
                        >
                          <span>{slide.secondaryText}</span>
                        </button>
                      </div>

                    </div>

                    {/* Columna de Ilustración */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
                      <div className="relative w-full max-w-md lg:max-w-xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800 group animate-subtle-float">
                        <img 
                          src={slide.image} 
                          alt={slide.alt}
                          className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">EduMed Digital</span>
                          </div>
                          <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
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
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Diapositiva anterior' : 'Previous slide'}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-3.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label={isEs ? 'Siguiente diapositiva' : 'Next slide'}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicadores inferiores elegantes */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-white/90 dark:bg-slate-900/90 px-5 py-2.5 rounded-full border border-slate-200/90 dark:border-slate-700/90 shadow-md backdrop-blur-md">
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
                    className={`relative h-2.5 rounded-full overflow-hidden transition-all cursor-pointer flex items-center ${
                      isActive ? 'w-12 sm:w-14 bg-slate-200 dark:bg-slate-700' : 'w-3 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
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

              <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1.5" />

              <button
                type="button"
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={isCarouselPaused ? (isEs ? 'Reanudar carrusel' : 'Play') : (isEs ? 'Pausar carrusel' : 'Pause')}
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
        className="w-full bg-[#001e30] text-slate-200 border-t border-slate-800 pt-16 pb-12 text-base sm:text-lg text-left"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800/90">
            
            {/* Col 1: Identidad Institucional */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <img 
                  src={customLogoUrl} 
                  alt="Escudo Institución Educativa Félix Henao Botero" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 bg-white shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                  }}
                />
                <div>
                  <span className="font-black text-white text-lg sm:text-xl block leading-tight">
                    I.E. Félix Henao Botero
                  </span>
                  <span className="text-sm sm:text-base text-teal-400 font-bold block mt-1">
                    EduMed Digital • {isEs ? 'Sistema Educativo Oficial' : 'Official School System'}
                  </span>
                </div>
              </div>
              <p className="text-base text-slate-300 leading-relaxed">
                {isEs
                  ? 'Institución Educativa Oficial de carácter público en la Comuna 8 de Medellín. Comprometida con la formación integral, inclusión social y excelencia pedagógica.'
                  : 'Official public educational institution in Medellín providing quality inclusive education and academic excellence.'}
              </p>
              <div className="p-4.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm sm:text-base text-slate-300 space-y-1.5">
                <div><strong>DANE:</strong> 105001002345</div>
                <div><strong>NIT:</strong> 890980123-1</div>
                <div><strong>Código ICFES:</strong> 014522</div>
                <div><strong>{isEs ? 'Resolución:' : 'Approval:'}</strong> Alcaldía de Medellín N° 16212</div>
              </div>
            </div>

            {/* Col 2: Ubicaciones Oficiales de las Sedes */}
            <div className="space-y-4">
              <h4 className="font-black text-white uppercase tracking-wider text-base sm:text-lg mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>{isEs ? 'Sedes Institucionales' : 'Official Campuses'}</span>
              </h4>
              
              {/* Sede Principal */}
              <div className="p-4.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-base sm:text-lg font-bold">
                      {isEs ? 'Sede Principal (Secundaria y Media Técnica)' : 'Main Campus (Middle & High School)'}
                    </strong>
                    <p className="text-sm sm:text-base text-slate-300 mt-1">
                      Calle 52 # 18-40, Barrio Enciso - Los Ángeles / Boston
                    </p>
                    <span className="text-xs sm:text-sm text-teal-400 font-semibold block mt-0.5">
                      {isEs ? 'Comuna 8 • Medellín, Antioquia' : 'Comuna 8 • Medellín, Colombia'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sede Infantil */}
              <div className="p-4.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block text-base sm:text-lg font-bold">
                      {isEs ? 'Sede Infantil (Preescolar y Primaria)' : 'Elementary Campus (Preschool & Primary)'}
                    </strong>
                    <p className="text-sm sm:text-base text-slate-300 mt-1">
                      Carrera 22 # 54-15, Barrio La Libertad
                    </p>
                    <span className="text-xs sm:text-sm text-amber-400 font-semibold block mt-0.5">
                      {isEs ? 'Comuna 8 • Medellín, Antioquia' : 'Comuna 8 • Medellín, Colombia'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1 text-sm sm:text-base text-slate-300">
                <Clock className="w-4.5 h-4.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{isEs ? 'Lunes a Viernes: 7:30 a.m. - 12:30 p.m. / 1:30 p.m. - 4:30 p.m.' : 'Monday to Friday: 7:30 a.m. - 12:30 p.m. / 1:30 p.m. - 4:30 p.m.'}</span>
              </div>
            </div>

            {/* Col 3: Políticas y Legal */}
            <div className="space-y-4">
              <h4 className="font-black text-white uppercase tracking-wider text-base sm:text-lg mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-400" />
                <span>{isEs ? 'Información y Políticas' : 'Information & Policies'}</span>
              </h4>
              <ul className="space-y-3.5 text-base sm:text-lg">
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyModalOpen(true);
                    }}
                    className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <span>{isEs ? 'Política de Privacidad y Datos' : 'Privacy & Data Protection Policy'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <FileCheck2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <span>{isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions of Use'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLegalModalOpen(true);
                    }}
                    className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <Scale className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <span>{isEs ? 'Aviso Legal e Identificación' : 'Legal Notice & School ID'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={scrollToBenefitsSection}
                    className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <span>{isEs ? 'Beneficios de la Plataforma' : 'Platform Benefits'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={scrollToAuthSection}
                    className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                  >
                    <Users className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <span>{isEs ? 'Acceso a Portales' : 'Portals Access'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Atención y Soporte Técnico */}
            <div className="space-y-4">
              <h4 className="font-black text-white uppercase tracking-wider text-base sm:text-lg mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                <span>{isEs ? 'Atención y Soporte Técnico' : 'Support & Technical Help'}</span>
              </h4>
              
              <p className="text-base text-slate-300 leading-relaxed">
                {isEs 
                  ? '¿Tienes dudas sobre matrícula, código de acudiente o soporte técnico? Escríbenos o abre nuestra ventana emergente de contacto.'
                  : 'Questions about admission, guardian code, or technical issues? Write to us or open our contact popup window.'}
              </p>

              <div className="space-y-3 pt-1 text-slate-300 text-base">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                  <a href="mailto:digitaledumed@gmail.com" className="hover:text-teal-300 font-bold text-white text-base sm:text-lg">
                    digitaledumed@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-base">PBX: (604) 284 56 78</span>
                </div>
              </div>

              {/* Botón para abrir Ventana Emergente de Contacto con Soporte */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsContactModalOpen(true);
                }}
                className="w-full mt-4 px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <Send className="w-4.5 h-4.5" />
                <span>{isEs ? 'Contactar a Soporte (Ventana Emergente)' : 'Contact Support (Popup Window)'}</span>
              </button>
            </div>

          </div>

          {/* Legal / Copyright inferior */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
            <div>
              © {new Date().getFullYear()} Institución Educativa Félix Henao Botero • Sistema Oficial EduMed Digital. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}
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
          MODAL 1: FORMULARIO DE CONTACTO Y SOPORTE TÉCNICO (100% BILINGÜE)
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

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {isEs ? 'Soporte oficial:' : 'Official support:'} <strong className="text-teal-600 dark:text-teal-400">digitaledumed@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer"
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
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer"
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
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer"
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
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600"
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
