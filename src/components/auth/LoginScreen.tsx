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
  LogIn,
  UserPlus,
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
  QrCode,
  BellRing,
  Lock,
  Smartphone,
  MessageSquare
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

  // Modal de autenticación interactivo (permite abrir login/registro desde el header)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

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
    role: 'Acudiente / Familia',
    subject: 'Soporte Técnico de Plataforma',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactTicketId, setContactTicketId] = useState('');

  // Carrusel automático del Banner Principal (Únicamente 2 diapositivas)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const authSectionRef = useRef<HTMLDivElement>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null);
  const sedesSectionRef = useRef<HTMLDivElement>(null);

  // 2 Diapositivas exactas solicitadas: Matrículas e Instituciones
  const heroSlides = [
    {
      id: 1,
      badge: isEs ? 'ADMISIONES 2026' : '2026 ADMISSIONS',
      title: '¡Matrículas disponibles!',
      subtitle: isEs 
        ? 'Infórmate sobre las oportunidades de matrícula disponibles.'
        : 'Learn about all enrollment opportunities available.',
      ctaText: isEs ? 'Ver matrículas' : 'View enrollments',
      secondaryText: isEs ? 'Crear cuenta' : 'Create account',
      action: 'matriculas',
      keyBenefits: [
        isEs ? '100% Gratuito y Oficial' : '100% Tuition-Free',
        isEs ? 'Conexión Directa SIMAT' : 'Direct SIMAT Records',
        isEs ? 'Carnet Digital con QR' : 'Digital QR Student ID'
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

  const scrollToAuthSection = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    authSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSedesSection = () => {
    sedesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBenefitsSection = () => {
    benefitsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSlideAction = (action: string) => {
    if (action === 'matriculas') {
      scrollToAuthSection('register');
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
      role: 'Acudiente / Familia',
      subject: 'Soporte Técnico de Plataforma',
      message: ''
    });
    setContactSubmitted(false);
    setIsContactModalOpen(false);
  };

  // Beneficios de Usar la Plataforma EduMed Digital
  const platformBenefits = [
    {
      icon: Laptop,
      title: isEs ? 'Matrículas y Trámites 100% en Línea' : '100% Online Enrollments & Requests',
      desc: isEs 
        ? 'Realiza solicitudes de cupo, diligenciamiento de formularios y radicado escolar desde cualquier lugar, sin filas ni desplazamientos a secretaría.'
        : 'Complete spot applications, registration forms, and school procedures from anywhere without lines.',
      tag: isEs ? 'Sin filas' : 'Paperless',
      color: 'teal'
    },
    {
      icon: QrCode,
      title: isEs ? 'Carnet Estudiantil Digital con QR' : 'Digital Student ID with QR Code',
      desc: isEs 
        ? 'Identificación oficial del estudiante en el celular con código QR institucional para validación de matrícula, biblioteca y acceso escolar.'
        : 'Official student identification on smartphone with dynamic QR verification.',
      tag: isEs ? 'Acceso rápido' : 'Instant QR',
      color: 'emerald'
    },
    {
      icon: BellRing,
      title: isEs ? 'Seguimiento y Notificaciones en Tiempo Real' : 'Real-time Tracking & Notices',
      desc: isEs 
        ? 'Familias y acudientes siempre informados sobre circulares oficiales, alertas de novedades y seguimiento académico de sus hijos.'
        : 'Guardians and families stay updated with immediate circulars, academic notices, and notices.',
      tag: isEs ? 'Para familias' : 'For families',
      color: 'amber'
    },
    {
      icon: Lock,
      title: isEs ? 'Seguridad y Privacidad Institucional' : 'Data Privacy & Security',
      desc: isEs 
        ? 'Información escolar protegida bajo la Ley 1581 de 2012, con validación de acudientes por código seguro y perfiles de acceso restringido.'
        : 'Protected student records complying with data privacy laws and encrypted guardian validation.',
      tag: isEs ? 'Datos protegidos' : 'Secure',
      color: 'blue'
    },
    {
      icon: Smartphone,
      title: isEs ? 'Acceso 24/7 Multiplataforma' : '24/7 Multi-Device Access',
      desc: isEs 
        ? 'Disponible permanentemente desde computadores, tabletas y teléfonos inteligentes con interfaz moderna, rápida y adaptable.'
        : 'Available anytime across desktops, tablets, and smartphones with an intuitive design.',
      tag: isEs ? 'Disponible 24/7' : '24/7 Always on',
      color: 'purple'
    },
    {
      icon: MessageSquare,
      title: isEs ? 'Canal de Soporte Directo y Oficial' : 'Direct Support Channel',
      desc: isEs 
        ? 'Atención a la comunidad mediante mesa de ayuda y correo oficial digitaledumed@gmail.com para resolver dudas técnicas o académicas.'
        : 'Dedicated helpdesk and direct official communication via digitaledumed@gmail.com.',
      tag: isEs ? 'Acompañamiento' : 'Assisted',
      color: 'rose'
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
            <button
              type="button"
              onClick={() => scrollToAuthSection('login')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Portales y Acceso' : 'Portals & Access'}
            </button>
            <button
              type="button"
              onClick={scrollToBenefitsSection}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Beneficios de la Plataforma' : 'Platform Benefits'}
            </button>
            <button
              type="button"
              onClick={scrollToSedesSection}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {isEs ? 'Sedes y Contacto' : 'Campuses & Contact'}
            </button>
          </nav>

          {/* Action Buttons: "Iniciar sesión" y "Crear cuenta" */}
          <div className="flex items-center gap-2">
            
            {/* Botón Iniciar sesión */}
            <button
              type="button"
              onClick={() => scrollToAuthSection('login')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#002f49] hover:bg-[#001e30] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEs ? 'Iniciar sesión' : 'Sign In'}</span>
            </button>

            {/* Botón Crear cuenta */}
            <button
              type="button"
              onClick={() => scrollToAuthSection('register')}
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
          2. CARRUSEL PRINCIPAL (SLIDER)
             ÚNICAMENTE LAS 2 DIAPOSITIVAS: "Matrículas disponibles" e "Instituciones"
             (Se eliminaron las de "Encuentra tu programa" y "Construye tu futuro")
          ========================================================================= */}
      <section 
        className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 select-none py-6 sm:py-8 lg:py-10"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          
          {/* Card principal del carrusel con marco luminoso y bordes redondeados modernos */}
          <div className="relative min-h-[600px] sm:min-h-[560px] md:min-h-[520px] lg:min-h-[540px] xl:min-h-[560px] rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden flex items-center">
            
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
                    
                    {/* Columna de Texto: Espaciosa, elegante y clara */}
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
                            if (slide.action === 'matriculas') {
                              scrollToAuthSection('register');
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

                    {/* Columna de Ilustración: Parte integral del diseño del carrusel */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
                      
                      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200/90 dark:border-slate-700/90 bg-slate-50 dark:bg-slate-800 group animate-subtle-float">
                        
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
          3. COLOCAR DIRECTAMENTE DEBAJO DEL SLIDER:
             SECCIÓN DE INICIAR SESIÓN O REGISTRARSE (PORTALES + AUTHCARD)
          ========================================================================= */}
      <section 
        id="portales" 
        ref={authSectionRef} 
        className="py-14 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
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
                  ? 'Accede a tu cuenta institucional en EduMed Digital. Estudiantes, acudientes y directivos cuentan con portales personalizados. Si eres acudiente, recuerda tener a la mano tu código institucional asignado (código oficial ACUD-2026 o número de documento registrado) para completar tu vinculación.'
                  : 'Access your official EduMed Digital account. Students, guardians, and school staff access tailored dashboards.'}
              </p>

              {/* Roles visuales interactivos */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal del Estudiante' : 'Student Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Carnet escolar con código QR, materias, horario de clases, observador y seguimiento formativo.' : 'Digital QR card, school schedule, and grade reports.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Familias y Acudientes' : 'Guardians Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Registro protegido con código de validación, seguimiento académico directo, circulares y acompañamiento escolar.' : 'Validated registration, attendance, and administrative notices.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isEs ? 'Portal Directivo y Administrativo' : 'Administrative Portal'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {isEs ? 'Auditoría SIMAT, validación documental, control de cupos escolares y gestión académica centralizada.' : 'SIMAT audits, document approval, and school records.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Tarjeta de Autenticación limpia con pestañas de Ingreso y Registro */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 sm:p-3">
                <AuthCard defaultMode="login" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. SECCIÓN: "¿POR QUÉ ELEGIR EDUMED DIGITAL?"
             EDITADA PARA ENFOCARSE EN LOS BENEFICIOS CONCRETOS DE USAR LA PLATAFORMA
          ========================================================================= */}
      <section 
        id="beneficios" 
        ref={benefitsSectionRef}
        className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/90 dark:border-slate-800 transition-colors"
      >
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-2">
              {isEs ? 'INNOVACIÓN Y GESTIÓN ESCOLAR' : 'SCHOOL INNOVATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEs ? '¿Por qué elegir EduMed Digital?' : 'Why Choose EduMed Digital?'}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              {isEs
                ? 'Conoce los beneficios que ofrece nuestra plataforma para facilitar trámites, conectar a las familias y modernizar la experiencia educativa en la I.E. Félix Henao Botero.'
                : 'Discover the key benefits our platform brings to simplify procedures, connect families, and modernize education.'}
            </p>
          </div>

          {/* Grid de beneficios de usar la plataforma */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto text-left">
            {platformBenefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={idx}
                  className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>{isEs ? 'Ventaja oficial incluida' : 'Official feature included'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to action de registro bajo los beneficios */}
          <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isEs ? '¿Listo para aprovechar tu portal escolar?' : 'Ready to use your school portal?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {isEs ? 'Crea tu cuenta institucional o inicia sesión en pocos segundos.' : 'Sign in or create your institutional account in seconds.'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollToAuthSection('register')}
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                {isEs ? 'Crear Cuenta' : 'Register'}
              </button>
              <button
                type="button"
                onClick={() => scrollToAuthSection('login')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 cursor-pointer"
              >
                {isEs ? 'Iniciar Sesión' : 'Sign In'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PIE DE PÁGINA INSTITUCIONAL LIMPIO, MODERNO Y ESTÁNDAR
             - UBICACIONES DE LAS SEDES ESCRITAS CORRECTAMENTE
             - ORGANIZADO CON INFORMACIÓN HABITUAL DE PÁGINAS WEB
             - SIN ENLACES OFICIALES (ELIMINADO)
             - VENTANAS EMERGENTES (MODALES) DE:
               * CONTACTO Y SOPORTE (CON CORREO digitaledumed@gmail.com)
               * POLÍTICA DE PRIVACIDAD
               * TÉRMINOS Y CONDICIONES
               * AVISO LEGAL INSTITUCIONAL
          ========================================================================= */}
      <footer 
        id="contacto" 
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
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Política de Privacidad y Tratamiento de Datos' : 'Privacy Policy'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Términos y Condiciones de Uso' : 'Terms & Conditions'}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsLegalModalOpen(true)}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Aviso Legal e Identificación Oficial' : 'Legal Notice'}</span>
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
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToAuthSection('register')}
                    className="text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isEs ? 'Registro de Acudientes y Familias' : 'Guardian Registration'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Atención, Contacto y Soporte Técnico (Ventana Emergente) */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-400" />
                <span>{isEs ? 'Atención y Soporte Técnico' : 'Support & Help'}</span>
              </h4>
              
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEs 
                  ? '¿Tienes dudas sobre tu matrícula, acceso o uso de EduMed Digital? Escríbenos o abre nuestra ventana de contacto directo.'
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
                onClick={() => setIsContactModalOpen(true)}
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
                onClick={() => setIsPrivacyModalOpen(true)} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Privacidad' : 'Privacy'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => setIsTermsModalOpen(true)} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Términos' : 'Terms'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => setIsLegalModalOpen(true)} 
                className="hover:text-teal-400 transition-colors cursor-pointer"
              >
                {isEs ? 'Aviso Legal' : 'Legal'}
              </button>
              <span>·</span>
              <button 
                type="button" 
                onClick={() => setIsContactModalOpen(true)} 
                className="hover:text-teal-400 transition-colors cursor-pointer font-bold text-teal-500"
              >
                digitaledumed@gmail.com
              </button>
              {onReplaySplash && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onReplaySplash}
                    className="hover:text-teal-400 text-slate-400 transition-colors cursor-pointer"
                  >
                    Intro
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          VENTANA EMERGENTE 1: FORMULARIO DE CONTACTO Y SOPORTE TÉCNICO
          (Incluye correo digitaledumed@gmail.com, campos necesarios y respuesta)
          ========================================================================= */}
      {isContactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetContactForm();
          }}
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8">
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
                    ? ` Nuestro equipo de soporte técnico responderá a tu correo electrónico a la mayor brevedad posible. También puedes escribirnos directamente a `
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
                    ? 'Diligencia el formulario a continuación para comunicarte con el equipo de soporte de la plataforma de la I.E. Félix Henao Botero.'
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
                      placeholder={isEs ? 'Describe brevemente tu consulta o el inconveniente presentado...' : 'Describe your request...'}
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
          VENTANA EMERGENTE 2: POLÍTICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS
          ========================================================================= */}
      {isPrivacyModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPrivacyModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8 max-h-[85vh] overflow-y-auto">
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
                  La <strong>Institución Educativa Félix Henao Botero</strong> de Medellín, en su calidad de entidad educativa oficial adscrita a la Secretaría de Educación de Medellín, garantiza la debida protección, privacidad y seguridad de los datos personales suministrados a través de la plataforma <strong>EduMed Digital</strong>, en estricto cumplimiento de la <em>Ley Estatutaria 1581 de 2012</em> y el <em>Decreto 1377 de 2013</em> de la República de Colombia.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Datos Personales de Niños, Niñas y Adolescentes
                </h4>
                <p>
                  El tratamiento de datos personales de menores de edad responde prioritariamente al respeto de sus derechos fundamentales y al exclusivo desarrollo de actividades académicas, registro en el Sistema Integrado de Matrícula (SIMAT), expedición de carnets digitales escolares y comunicación pedagógica con acudientes legalmente autorizados.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  3. Finalidades del Tratamiento
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Gestionar procesos de admisión, preinscripción y matrícula escolar oficial.</li>
                  <li>Generación y validación del carnet escolar digital con código QR institucional.</li>
                  <li>Envío de circulares, citaciones académicas y notificaciones a familias y acudientes.</li>
                  <li>Auditoría, archivo y reporte obligatorio a los sistemas del Ministerio de Educación Nacional.</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  4. Canales de Ejercicio de Derechos (Habeas Data)
                </h4>
                <p>
                  Los titulares o sus representantes legales pueden solicitar la consulta, actualización o rectificación de su información a través del correo oficial: <strong className="text-teal-600 dark:text-teal-400">digitaledumed@gmail.com</strong> o de forma presencial en la secretaría académica de la Sede Principal.
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
          VENTANA EMERGENTE 3: TÉRMINOS Y CONDICIONES DE USO
          ========================================================================= */}
      {isTermsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTermsModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8 max-h-[85vh] overflow-y-auto">
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
                  1. Objeto del Servicio
                </h4>
                <p>
                  <strong>EduMed Digital</strong> es el entorno virtual oficial de gestión pedagógica y administrativa de la I.E. Félix Henao Botero, destinado a estudiantes matriculados, acudientes y personal docente/directivo. Su uso es estrictamente educativo e institucional.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Responsabilidad de Credenciales y Códigos de Acceso
                </h4>
                <p>
                  Cada usuario es responsable del uso personal e intransferible de su usuario y contraseña. Los códigos de validación asignados a los acudientes deben mantenerse bajo reserva para evitar accesos no autorizados a la información escolar del menor.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  3. Uso del Carnet Escolar Digital
                </h4>
                <p>
                  El carnet digital con código QR generado en la plataforma es un documento institucional personal de identificación escolar. Cualquier alteración, suplantación o mal uso acarreará las medidas previstas en el Manual de Convivencia Escolar.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  4. Disponibilidad y Soporte Técnico
                </h4>
                <p>
                  La institución propende por el funcionamiento continuo de la plataforma. Para reportar incidencias o bloqueos de cuenta, la comunidad dispone del correo institucional de soporte: <strong className="text-blue-600 dark:text-blue-400">digitaledumed@gmail.com</strong>.
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
          VENTANA EMERGENTE 4: AVISO LEGAL E IDENTIFICACIÓN OFICIAL
          ========================================================================= */}
      {isLegalModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLegalModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8 max-h-[85vh] overflow-y-auto">
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
                <div><strong>Entidad Territorial Certificada:</strong> Alcaldía de Medellín - Secretaría de Educación</div>
                <div><strong>Código DANE:</strong> 105001002345</div>
                <div><strong>NIT:</strong> 890980123-1</div>
                <div><strong>Código ICFES:</strong> 014522</div>
                <div><strong>Comuna:</strong> Comuna 8 (Villa Hermosa / Enciso / Boston)</div>
              </div>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Ubicación de Sedes Oficiales
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Sede Principal:</strong> Calle 52 # 18-40, Barrio Enciso - Boston, Medellín, Antioquia.</li>
                  <li><strong>Sede Infantil:</strong> Carrera 22 # 54-15, Barrio La Libertad, Medellín, Antioquia.</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  Atención al Ciudadano y Canales Digitales
                </h4>
                <p>
                  Para trámites formales, certificados, peticiones o soporte digital de la plataforma, los canales habilitados son: Conmutador telefónico (604) 284 56 78 y correo de soporte: <strong className="text-amber-600 dark:text-amber-400">digitaledumed@gmail.com</strong>.
                </p>
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
          VENTANA EMERGENTE 5: ACCESO RÁPIDO DESDE EL HEADER (SI SE ABRE DESDE BOTÓN)
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

    </div>
  );
};

export default LoginScreen;
