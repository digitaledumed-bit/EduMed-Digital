import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthCard } from './AuthCard';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Globe, 
  Clock, 
  LogIn, 
  UserPlus, 
  X, 
  HelpCircle, 
  Layers, 
  ChevronDown,
  Lock,
  MessageSquare
} from 'lucide-react';

interface BetowaPortalHomeProps {
  initialOpenAuthModal?: boolean;
  defaultAuthMode?: 'login' | 'register';
  onReplaySplash?: () => void;
}

export const BetowaPortalHome: React.FC<BetowaPortalHomeProps> = ({
  initialOpenAuthModal = false,
  defaultAuthMode = 'login',
  onReplaySplash
}) => {
  const { 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    currentUser, 
    logout, 
    customLogoUrl, 
    setActiveTab, 
    setActiveRole 
  } = useApp();

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(initialOpenAuthModal);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>(defaultAuthMode);
  const [preselectedRole, setPreselectedRole] = useState<'guardian' | 'student' | 'admin' | undefined>(undefined);

  // Search and Filter state (Betowa style)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  // Hero carousel slides
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0); // -1, 0, 1
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<any | null>(null);

  const heroSlides = [
    {
      id: 1,
      badge: language === 'es' ? 'CONVOCATORIA DE MATRÍCULAS 2026' : 'ENROLLMENT 2026 NOW OPEN',
      title: language === 'es' 
        ? 'Educación Pública Gratuita con Articulación Técnica SENA'
        : 'Free Public Education with SENA Technical Articulation',
      subtitle: language === 'es'
        ? 'Asegura tu cupo en la I.E. Félix Henao Botero de Medellín. Formación integral desde Transición hasta 11° con doble titulación técnica para transformar tu futuro.'
        : 'Secure your place at I.E. Félix Henao Botero in Medellín. Comprehensive education from Preschool to 11th grade with technical dual certification.',
      ctaPrimary: language === 'es' ? 'Matricularme en Línea' : 'Enroll Online',
      ctaSecondary: language === 'es' ? 'Explorar Oferta Educativa' : 'Explore Programs',
      bgGradient: 'from-teal-900 via-slate-900 to-emerald-950',
      tag: '100% Gratuita • Medellín'
    },
    {
      id: 2,
      badge: language === 'es' ? 'DOBLE TITULACIÓN SENA (GRADOS 10° Y 11°)' : 'DUAL CERTIFICATION SENA (GRADES 10-11)',
      title: language === 'es'
        ? 'Técnico Laboral en Sistemas y Desarrollo de Software'
        : 'Labor Technician in Systems & Software Development',
      subtitle: language === 'es'
        ? 'Gradúate como Bachiller Académico y Técnico Laboral SENA. Conexión directa con la industria tecnológica y laboral en Colombia sin costos adicionales.'
        : 'Graduate with high school diploma and official SENA labor technician certification with real job opportunities.',
      ctaPrimary: language === 'es' ? 'Inscribirme a Media Técnica' : 'Register for Technical Track',
      ctaSecondary: language === 'es' ? 'Ver Pensum y Requisitos' : 'View Syllabus & Requirements',
      bgGradient: 'from-emerald-950 via-slate-900 to-teal-900',
      tag: 'Convenio Oficial SENA • 35 Cupos'
    },
    {
      id: 3,
      badge: language === 'es' ? 'INNOVACIÓN EDUCATIVA Y BILINGÜISMO' : 'EDUCATIONAL INNOVATION & STEAM',
      title: language === 'es'
        ? 'Aulas STEAM, Robótica Escolar y Semillero de Inglés'
        : 'STEAM Classrooms, Robotics & English Immersion',
      subtitle: language === 'es'
        ? 'Infraestructura tecnológica moderna, acompañamiento psicosocial, laboratorio de ciencias y plan de alimentación escolar PAE en la Comuna 8 de Medellín.'
        : 'Modern tech labs, robotics clubs, bilingual English training, and full student welfare support.',
      ctaPrimary: language === 'es' ? 'Conocer Nuestra Institución' : 'Learn About School',
      ctaSecondary: language === 'es' ? 'Consultar Estado SIMAT' : 'Check SIMAT Status',
      bgGradient: 'from-slate-950 via-teal-950 to-blue-950',
      tag: 'Comuna 8 Medellín • DANE 105001002345'
    }
  ];

  // Programs catalog
  const programs = [
    {
      id: 'tec-sistemas',
      code: 'SENA-732101',
      title: language === 'es' ? 'Técnico en Sistemas y Programación de Software' : 'Technician in Systems & Software Development',
      category: 'media-tecnica',
      level: language === 'es' ? 'Educación Media Técnica (Convenio SENA)' : 'Technical High School (SENA)',
      modality: language === 'es' ? 'Presencial' : 'On-campus',
      shift: language === 'es' ? 'Jornada Tarde (12:30 pm - 6:30 pm)' : 'Afternoon Shift',
      duration: language === 'es' ? '2 Años (Grados 10° y 11°)' : '2 Years (Grades 10 & 11)',
      campus: 'principal',
      campusName: language === 'es' ? 'Sede Principal (Boston - Enciso)' : 'Main Campus',
      spots: 35,
      spotsTotal: 40,
      badge: 'Articulación SENA',
      badgeColor: 'emerald',
      description: language === 'es'
        ? 'Formación en mantenimiento de equipos de cómputo, redes de datos cableadas e inalámbricas, diseño web moderno y lógica de programación en Python y JavaScript.'
        : 'Hands-on training in computer hardware, structured network cabling, modern web front-end development, and programming fundamentals.',
      skills: ['Mantenimiento de Hardware', 'Redes y Telecomunicaciones', 'HTML5 / CSS3 / JavaScript', 'Bases de Datos SQL', 'Soporte TI'],
      requirements: language === 'es' 
        ? 'Haber aprobado grado 9°, contar con documento de identidad vigente (TI o CC) y registro en plataforma Betowa / SofiaPlus.'
        : 'Approved 9th grade, valid ID document, and registration on Betowa/SofiaPlus.'
    },
    {
      id: 'tec-contabilidad',
      code: 'SENA-123112',
      title: language === 'es' ? 'Técnico en Contabilización de Operaciones Comerciales y Financieras' : 'Technician in Commercial & Financial Operations',
      category: 'media-tecnica',
      level: language === 'es' ? 'Educación Media Técnica (Convenio SENA)' : 'Technical High School (SENA)',
      modality: language === 'es' ? 'Presencial' : 'On-campus',
      shift: language === 'es' ? 'Jornada Mañana (6:30 am - 12:30 pm)' : 'Morning Shift',
      duration: language === 'es' ? '2 Años (Grados 10° y 11°)' : '2 Years (Grades 10 & 11)',
      campus: 'principal',
      campusName: language === 'es' ? 'Sede Principal' : 'Main Campus',
      spots: 28,
      spotsTotal: 35,
      badge: 'Articulación SENA',
      badgeColor: 'emerald',
      description: language === 'es'
        ? 'Desarrollo de competencias en registro de libros contables, liquidación de nómina electrónica, facturación e inventarios comerciales con software Siigo y herramientas ofimáticas avanzadas.'
        : 'Skills in accounting records, commercial invoicing, electronic payroll, tax basics, and computerized accounting software.',
      skills: ['Nómina y Prestaciones', 'Software Siigo / Excel Financiero', 'Facturación Electrónica', 'Auditoría Básica'],
      requirements: language === 'es'
        ? 'Grado 9° aprobado, documento de identidad y compromiso de práctica empresarial.'
        : 'Approved 9th grade, valid ID and internship commitment.'
    },
    {
      id: 'bachillerato-steam',
      code: 'IEFB-SEC-01',
      title: language === 'es' ? 'Básica Secundaria y Bachillerato con Énfasis STEAM' : 'Middle & High School with STEAM Focus',
      category: 'secundaria',
      level: language === 'es' ? 'Básica Secundaria (Grados 6° a 9°)' : 'Middle School (Grades 6-9)',
      modality: language === 'es' ? 'Presencial' : 'On-campus',
      shift: language === 'es' ? 'Jornadas Mañana y Tarde' : 'Morning and Afternoon Shifts',
      duration: language === 'es' ? '4 Años Lectivos' : '4 Academic Years',
      campus: 'principal',
      campusName: language === 'es' ? 'Sede Principal' : 'Main Campus',
      spots: 90,
      spotsTotal: 120,
      badge: 'Oficial Gratuito',
      badgeColor: 'teal',
      description: language === 'es'
        ? 'Currículo riguroso enfocado en ciencias naturales, matemáticas aplicadas, lengua castellana, pensamiento crítico, artes y club escolar de robótica con kits Arduino.'
        : 'Comprehensive secondary curriculum with mathematics, science, language arts, and robotics maker club.',
      skills: ['Pensamiento Científico', 'Resolución de Problemas', 'Robótica Educativa', 'Bilingüismo', 'Educación Ciudadana'],
      requirements: language === 'es'
        ? 'Certificados de notas de grados previos y documento de identidad del estudiante y acudiente.'
        : 'Prior academic transcripts and student/guardian ID.'
    },
    {
      id: 'primaria-integral',
      code: 'IEFB-PRI-02',
      title: language === 'es' ? 'Básica Primaria con Formación Integral y Lectoescritura' : 'Elementary School with Integral Development',
      category: 'primaria',
      level: language === 'es' ? 'Básica Primaria (Grados 1° a 5°)' : 'Elementary School (Grades 1-5)',
      modality: language === 'es' ? 'Presencial' : 'On-campus',
      shift: language === 'es' ? 'Jornada Mañana (7:00 am - 12:00 pm)' : 'Morning Shift',
      duration: language === 'es' ? '5 Años Lectivos' : '5 Academic Years',
      campus: 'infantil',
      campusName: language === 'es' ? 'Sede Infantil La Libertad' : 'La Libertad Campus',
      spots: 45,
      spotsTotal: 60,
      badge: 'Alimentación PAE',
      badgeColor: 'blue',
      description: language === 'es'
        ? 'Pedagogía activa, desarrollo socioemocional, fortalecimiento en lectoescritura, iniciación en matemáticas lúdicas, educación física y artes plásticas.'
        : 'Foundational literacy, numeracy, creative arts, physical education, and healthy social-emotional habits.',
      skills: ['Comprensión Lectora', 'Razonamiento Matemático', 'Habilidades Socioemocionales', 'Artes y Creatividad'],
      requirements: language === 'es'
        ? 'Registro civil de nacimiento, carnet de vacunación al día y certificado de afiliación a EPS/SISBEN.'
        : 'Birth certificate, complete immunization card, and health insurance certificate.'
    },
    {
      id: 'preescolar-transicion',
      code: 'IEFB-PRE-03',
      title: language === 'es' ? 'Nivel Inicial: Preescolar y Grado Transición' : 'Early Childhood: Preschool & Transition',
      category: 'preescolar',
      level: language === 'es' ? 'Educación Inicial (Edad: 5 años cumplidos)' : 'Early Childhood (Age 5)',
      modality: language === 'es' ? 'Presencial' : 'On-campus',
      shift: language === 'es' ? 'Jornada Mañana (8:00 am - 12:00 pm)' : 'Morning Shift',
      duration: language === 'es' ? '1 Año Lectivo' : '1 Academic Year',
      campus: 'infantil',
      campusName: language === 'es' ? 'Sede Infantil La Libertad' : 'La Libertad Campus',
      spots: 32,
      spotsTotal: 50,
      badge: 'Cupos Prioritarios',
      badgeColor: 'amber',
      description: language === 'es'
        ? 'Ambientes de aprendizaje lúdicos diseñados para la transición armónica a la vida escolar: juego, arte, literatura y exploración del medio natural.'
        : 'Play-based early childhood environment fostering curiosity, motor skills, social bonding, and pre-literacy.',
      skills: ['Desarrollo Psicomotriz', 'Socialización y Empatía', 'Pre-lectura y Expresión Oral', 'Creatividad'],
      requirements: language === 'es'
        ? 'Tener 5 años cumplidos al inicio del año escolar, registro civil y carnet de crecimiento y desarrollo.'
        : '5 years of age by school start, birth certificate, and growth-development medical record.'
    },
    {
      id: 'semillero-ingles',
      code: 'IEFB-EXT-04',
      title: language === 'es' ? 'Semillero de Bilingüismo e Inglés Comunicativo (SENA - EduMed)' : 'Bilingualism & Communicative English Hub',
      category: 'complementaria',
      level: language === 'es' ? 'Formación Complementaria Extracurricular' : 'Extracurricular Complementary',
      modality: language === 'es' ? 'Mixta (Presencial + Aula Virtual)' : 'Blended (On-campus + LMS)',
      shift: language === 'es' ? 'Sábados (8:00 am - 1:00 pm)' : 'Saturdays Shift',
      duration: language === 'es' ? '120 Horas Certificadas' : '120 Certified Hours',
      campus: 'principal',
      campusName: language === 'es' ? 'Sede Principal' : 'Main Campus',
      spots: 50,
      spotsTotal: 60,
      badge: 'Certificado Oficial',
      badgeColor: 'purple',
      description: language === 'es'
        ? 'Inmersión lingüística en niveles A1 a B1 con metodologías comunicativas prácticas, club de conversación, preparación para pruebas Saber 11 y uso de plataformas digitales.'
        : 'Practical conversational English program with Cambridge benchmarks and Saber 11 test preparation.',
      skills: ['Fluidez Conversacional', 'Comprensión Auditiva', 'Vocabulario Técnico', 'Pruebas Saber 11'],
      requirements: language === 'es'
        ? 'Estar matriculado en la institución en grados 8° a 11° o ser egresado reciente.'
        : 'Enrolled in 8th-11th grade or recent school alumnus.'
    }
  ];

  // Filter logic
  const filteredPrograms = programs.filter(item => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchText = (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.level.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.skills.some(s => s.toLowerCase().includes(q))
      );
      if (!matchText) return false;
    }

    // Category tab filter
    if (selectedCategoryTab !== 'all' && item.category !== selectedCategoryTab) {
      return false;
    }

    // Level filter dropdown
    if (selectedLevel !== 'all' && item.category !== selectedLevel) {
      return false;
    }

    // Campus filter dropdown
    if (selectedCampus !== 'all' && item.campus !== selectedCampus) {
      return false;
    }

    return true;
  });

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Read aloud accessibility feature
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'es' ? 'Tu navegador no soporta lectura de texto en voz alta.' : 'Speech synthesis not supported.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const currentSlideData = heroSlides[currentSlide];
    const textToRead = `${currentSlideData.title}. ${currentSlideData.subtitle}. Institución Educativa Félix Henao Botero, Medellín.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'es' ? 'es-CO' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register', role?: 'guardian' | 'student' | 'admin') => {
    setAuthModalMode(mode);
    setPreselectedRole(role);
    setIsAuthModalOpen(true);
  };

  const handleEnrollDirectly = (programId: string) => {
    // If not logged in, prompt user to register or log in first
    if (!currentUser) {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
      return;
    }
    // Navigate to wizard
    setActiveTab('wizard');
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 ${
        fontSizeOffset === 1 ? 'text-base' : fontSizeOffset === -1 ? 'text-xs' : 'text-sm'
      }`}
    >
      
      {/* =========================================================================
          1. BARRA SUPERIOR INSTITUCIONAL GOV.CO / ALCALDÍA DE MEDELLÍN
          ========================================================================= */}
      <section 
        aria-label="Barra Institucional de Gobierno y Accesibilidad"
        className="w-full bg-[#002f49] text-white border-b border-[#001f31] py-1.5 px-4 sm:px-6 lg:px-8 text-xs select-none"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Government / Institutional Identification */}
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-[11px] bg-white text-[#002f49] px-2 py-0.5 rounded font-mono shadow-xs">
              GOV.CO
            </span>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-200">
              <span>República de Colombia</span>
              <span className="text-slate-400">/</span>
              <span>Alcaldía de Medellín</span>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-amber-300">Secretaría de Educación</span>
            </div>
          </div>

          {/* Accessibility & Tools (Betowa Standard) */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto text-[11px]">
            
            {/* Font Size Adjusters: A- / Normal / A+ */}
            <div className="flex items-center bg-[#001f31] rounded-md px-1 py-0.5 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setFontSizeOffset(-1)}
                className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSizeOffset === -1 ? 'font-bold text-amber-300' : 'text-slate-300'}`}
                title={language === 'es' ? 'Disminuir tamaño de fuente (A-)' : 'Decrease font size'}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSizeOffset(0)}
                className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSizeOffset === 0 ? 'font-bold text-amber-300' : 'text-slate-300'}`}
                title={language === 'es' ? 'Tamaño de fuente estándar (A)' : 'Standard font size'}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeOffset(1)}
                className={`px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors ${fontSizeOffset === 1 ? 'font-bold text-amber-300' : 'text-slate-300'}`}
                title={language === 'es' ? 'Aumentar tamaño de fuente (A+)' : 'Increase font size'}
              >
                A+
              </button>
            </div>

            {/* Read Page Audio Guide (Escuchar portal) */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1 px-2 py-1 rounded-md bg-[#001f31] hover:bg-[#001827] border border-slate-700/60 transition-colors cursor-pointer ${
                isSpeaking ? 'text-amber-300 ring-1 ring-amber-400' : 'text-slate-200'
              }`}
              title={isSpeaking ? (language === 'es' ? 'Detener lectura' : 'Stop speech') : (language === 'es' ? 'Escuchar portal' : 'Read portal aloud')}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
              <span className="hidden md:inline">{isSpeaking ? (language === 'es' ? 'Detener Voz' : 'Stop') : (language === 'es' ? 'Escuchar Página' : 'Read Aloud')}</span>
            </button>

            {/* Theme Toggle (Modo Claro / Oscuro) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1 rounded-md bg-[#001f31] hover:bg-[#001827] border border-slate-700/60 text-slate-200 transition-colors cursor-pointer"
              title={theme === 'light' ? (language === 'es' ? 'Activar Modo Oscuro' : 'Dark Mode') : (language === 'es' ? 'Activar Modo Claro' : 'Light Mode')}
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>

            {/* Language Switch */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#001f31] hover:bg-[#001827] border border-slate-700/60 text-slate-200 font-bold transition-colors cursor-pointer"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <Globe className="w-3 h-3 text-teal-300" />
              <span>{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CABECERA INSTITUCIONAL OFICIAL (HEADER BETOWA)
          ========================================================================= */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Official Logos & Branding */}
          <div className="flex items-center gap-3 sm:gap-4 select-none">
            {/* School Emblem */}
            <div 
              onClick={onReplaySplash}
              title={onReplaySplash ? (language === 'es' ? 'Ver animación de bienvenida' : 'Replay welcome splash') : undefined}
              className={`relative shrink-0 ${onReplaySplash ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
            >
              <img 
                src={customLogoUrl} 
                alt="Escudo Institución Educativa Félix Henao Botero" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-400 dark:border-amber-300 ring-2 ring-amber-400/20 shadow-sm bg-white"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/school_logo.jpg';
                }}
              />
              {/* SENA / Technical alliance badge */}
              <span 
                className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-emerald-600 text-white font-extrabold text-[8px] uppercase tracking-wider border border-white shadow-xs"
                title="Articulación Técnica con el SENA"
              >
                SENA
              </span>
            </div>

            {/* Brand Titles */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                  edumed <span className="text-teal-600 dark:text-teal-400 font-extrabold">digital</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {language === 'es' ? 'Portal Betowa Escolar' : 'Betowa School Portal'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">
                I.E. Félix Henao Botero
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                Medellín • Comuna 8 • DANE 105001002345
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-lg text-teal-700 dark:text-teal-400 bg-teal-50/70 dark:bg-teal-950/40 font-bold transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Inicio' : 'Home'}
            </button>

            <a 
              href="#oferta-educativa"
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {language === 'es' ? 'Oferta Educativa' : 'Programs'}
            </a>

            <button 
              onClick={() => {
                if (currentUser) setActiveTab('wizard');
                else handleOpenAuth('login');
              }}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Matrícula en Línea' : 'Enrollment'}
            </button>

            <button 
              onClick={() => setActiveTab('status')}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Consultar Estado' : 'Status Lookup'}
            </button>

            <button 
              onClick={() => setActiveTab('institucion')}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Institución' : 'Institution'}
            </button>

            <button 
              onClick={() => setActiveTab('soporte')}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Ayuda y Soporte' : 'Help & Support'}
            </button>
          </nav>

          {/* User Account / Login & Register Actions */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              /* ACTIVE LOGGED-IN STATE */
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'admin') setActiveTab('dashboard');
                    else setActiveTab('student-profile');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm shadow-teal-700/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'es' ? 'Ir a Mi Panel' : 'My Dashboard'}</span>
                  <span className="sm:hidden">{language === 'es' ? 'Panel' : 'Panel'}</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title={language === 'es' ? 'Cerrar Sesión' : 'Log Out'}
                >
                  {language === 'es' ? 'Salir' : 'Log Out'}
                </button>
              </div>
            ) : (
              /* GUEST STATE: Betowa Login & Register Buttons */
              <div className="flex items-center gap-2">
                <button
                  id="betowa-btn-ingresar"
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#002f49] hover:bg-[#001e30] text-white text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 transition-all cursor-pointer active:scale-98"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'es' ? 'Ingresar' : 'Sign In'}</span>
                </button>

                <button
                  id="betowa-btn-registro"
                  type="button"
                  onClick={() => handleOpenAuth('register')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-teal-600/60 dark:border-teal-500/60 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{language === 'es' ? 'Registrarme' : 'Register'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================================
          3. HERO SECTION CON BANNER DINÁMICO (BETOWA SENA HERO)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-slate-900 text-white">
        
        {/* Animated Slide Carousel */}
        <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[460px] flex items-center">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center bg-gradient-to-r ${slide.bgGradient} ${
                index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background ambient lighting and pattern */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              <div className="absolute right-0 top-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute left-10 bottom-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
                <div className="max-w-3xl">
                  
                  {/* Category Kicker */}
                  <div className="flex items-center gap-2.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{slide.badge}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300 font-medium lowercase tracking-normal">{slide.tag}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-4 text-xs sm:text-base text-slate-200/90 leading-relaxed max-w-2xl font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (slide.id === 2) {
                          setSelectedCategoryTab('media-tecnica');
                          document.getElementById('oferta-educativa')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          if (currentUser) setActiveTab('wizard');
                          else handleOpenAuth('register');
                        }
                      }}
                      className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{slide.ctaPrimary}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById('oferta-educativa')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-colors cursor-pointer"
                    >
                      {slide.ctaSecondary}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* Slide Navigation Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`Ir a la diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            4. EL BUSCADOR CENTRAL BETOWA ("¿QUÉ TE GUSTARÍA APRENDER?")
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-16 sm:-mb-20 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-5 sm:p-7 text-slate-900 dark:text-white">
            
            {/* Search Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {language === 'es' ? '¿Qué te gustaría aprender? Buscar programa o grado escolar' : 'What would you like to learn? Search training program'}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    {language === 'es' 
                      ? 'Explora las opciones de matrícula oficial gratuita de la Institución Educativa Félix Henao Botero y articulación SENA'
                      : 'Explore tuition-free enrollment at I.E. Félix Henao Botero & SENA technical tracks'}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                {language === 'es' ? 'Año Lectivo 2026' : 'Academic Year 2026'}
              </span>
            </div>

            {/* Main Form Fields (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              
              {/* Field 1: Keyword text input */}
              <div className="md:col-span-5 relative">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'es' ? 'Programa, Grado o Palabra Clave' : 'Program, Grade or Keyword'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <input
                    id="betowa-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'es' ? 'Ej: Grado 10°, Sistemas SENA, Robótica, Primaria...' : 'E.g., Grade 10, Systems SENA, Robotics...'}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 2: Nivel de Formación */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'es' ? 'Nivel de Formación' : 'Education Level'}
                </label>
                <select
                  id="betowa-level-select"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="all">{language === 'es' ? 'Todos los niveles' : 'All Levels'}</option>
                  <option value="media-tecnica">{language === 'es' ? 'Educación Media Técnica SENA' : 'Technical High School (SENA)'}</option>
                  <option value="secundaria">{language === 'es' ? 'Básica Secundaria (6° a 9°)' : 'Middle School (6th - 9th)'}</option>
                  <option value="primaria">{language === 'es' ? 'Básica Primaria (1° a 5°)' : 'Elementary (1st - 5th)'}</option>
                  <option value="preescolar">{language === 'es' ? 'Nivel Inicial: Preescolar' : 'Preschool / Transition'}</option>
                  <option value="complementaria">{language === 'es' ? 'Semillero / Complementaria' : 'Complementary Courses'}</option>
                </select>
              </div>

              {/* Field 3: Sede o Jornada */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'es' ? 'Sede Institucional' : 'Campus'}
                </label>
                <select
                  id="betowa-campus-select"
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="all">{language === 'es' ? 'Todas las sedes' : 'All Campuses'}</option>
                  <option value="principal">{language === 'es' ? 'Sede Principal (Boston)' : 'Main Campus'}</option>
                  <option value="infantil">{language === 'es' ? 'Sede Infantil (La Libertad)' : 'La Libertad Campus'}</option>
                </select>
              </div>

              {/* Field 4: Search Button */}
              <div className="md:col-span-2 flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('oferta-educativa')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>{language === 'es' ? 'Buscar Oferta' : 'Search'}</span>
                </button>
              </div>

            </div>

            {/* Quick search tags underneath (clickable) */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                {language === 'es' ? 'Búsquedas Frecuentes:' : 'Popular Searches:'}
              </span>
              {[
                { label: 'Técnico en Sistemas SENA', q: 'Sistemas', tab: 'media-tecnica' },
                { label: 'Grado 10° Media Técnica', q: '10°', tab: 'media-tecnica' },
                { label: 'Transición / Preescolar', q: 'Preescolar', tab: 'preescolar' },
                { label: 'Robótica STEAM', q: 'Robótica', tab: 'secundaria' },
                { label: 'Básica Primaria', q: 'Primaria', tab: 'primaria' }
              ].map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag.q);
                    setSelectedCategoryTab(tag.tab);
                    document.getElementById('oferta-educativa')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  #{tag.label}
                </button>
              ))}
            </div>

          </div>
        </div>

      </section>

      {/* Spacing for floating search card */}
      <div className="h-20 sm:h-24" />

      {/* =========================================================================
          5. ACCESOS RÁPIDOS A TRÁMITES Y PORTALES (SERVICIOS BETOWA)
          ========================================================================= */}
      <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {language === 'es' ? 'SERVICIOS DIGITALES INSTITUCIONALES' : 'DIGITAL SCHOOL SERVICES'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'es' ? 'Trámites y Consultas en Línea' : 'Online Services & Portals'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {language === 'es'
                ? 'Accede a los diferentes canales de atención, consulta de matrículas y portales oficiales para estudiantes, familias y equipo administrativo.'
                : 'Access institutional enrollment services, official certificates, and dedicated role portals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 1: Matrícula en Línea */}
            <div 
              onClick={() => {
                if (currentUser) setActiveTab('wizard');
                else handleOpenAuth('login', 'guardian');
              }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-teal-200 dark:border-teal-800">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Matrícula en Línea 2026' : 'Online Enrollment 2026'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Diligencia el formulario oficial de inscripción para estudiantes nuevos o antiguos con validación en el sistema SIMAT.'
                    : 'Complete official school registration for new or continuing students.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
                <span>{language === 'es' ? 'Iniciar Solicitud' : 'Start Application'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Consultar Estado de Matrícula */}
            <div 
              onClick={() => setActiveTab('status')}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-blue-200 dark:border-blue-800">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Consultar Estado de Cupo' : 'Check Enrollment Status'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Ingresa tu número de documento de identidad para verificar la asignación de cupo escolar y la revisión de tus documentos.'
                    : 'Check your application review status and SIMAT verification using your ID number.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
                <span>{language === 'es' ? 'Consultar con Documento' : 'Lookup by ID'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Portal del Estudiante */}
            <div 
              onClick={() => {
                if (currentUser?.role === 'student') {
                  setActiveTab('student-profile');
                } else {
                  handleOpenAuth('login', 'student');
                }
              }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-200 dark:border-emerald-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Portal del Estudiante' : 'Student Portal'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Consulta tus notas periódicas, asignaturas matriculadas, horario de clases, observador y carnet estudiantil digital.'
                    : 'Access academic reports, enrolled subjects, school schedule, and student profile.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>{language === 'es' ? 'Ingreso Estudiantes' : 'Student Login'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Portal Familias / Acudientes */}
            <div 
              onClick={() => {
                if (currentUser?.role === 'guardian') {
                  setActiveTab('status');
                } else {
                  handleOpenAuth('login', 'guardian');
                }
              }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-amber-200 dark:border-amber-800">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Portal Familias y Acudientes' : 'Guardians & Families Portal'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Seguimiento integral al rendimiento de sus hijos, actualización de datos de contacto y circulares de rectoría.'
                    : 'Follow your children’s educational progress and school administrative notices.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                <span>{language === 'es' ? 'Ingreso Acudientes' : 'Guardian Login'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Portal Administrativo y Directivo (SIN DOCENTE) */}
            <div 
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  setActiveTab('dashboard');
                } else {
                  handleOpenAuth('login', 'admin');
                }
              }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Portal Administrativo y Directivo' : 'Leadership & Staff Portal'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Acceso exclusivo para rectoría, secretaría académica y coordinación: auditoría SIMAT, validación documental y reportes.'
                    : 'Exclusive portal for school leadership, academic registry, document validation, and SIMAT audits.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{language === 'es' ? 'Gestión Institucional' : 'Administrative Access'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 6: Certificados y Constancias Oficiales */}
            <div 
              onClick={() => setActiveTab('status')}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-purple-200 dark:border-purple-800">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {language === 'es' ? 'Certificados y Constancias' : 'Official Certificates'}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'es'
                    ? 'Genera y descarga constancias de estudio vigentes y certificados de matrícula validados con código de verificación institucional.'
                    : 'Download official enrollment records and certified study constancies with verification QR.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
                <span>{language === 'es' ? 'Descargar Documentos' : 'Download Records'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. NUESTRA OFERTA EDUCATIVA (PROGRAMAS ESTILO BETOWA SENA)
          ========================================================================= */}
      <section id="oferta-educativa" className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {language === 'es' ? 'OFERTA INSTITUCIONAL OFICIAL' : 'OFFICIAL EDUCATIONAL OFFERING'}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {language === 'es' ? 'Nuestra Oferta Educativa y Programas Técnicos' : 'Educational Programs & Technical Tracks'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                {language === 'es'
                  ? 'Formación pública 100% gratuita desde Preescolar hasta Media Técnica con doble titulación en alianza con el SENA.'
                  : 'Tuition-free public education from preschool to technical high school in partnership with SENA.'}
              </p>
            </div>

            {/* Active Filters Summary */}
            <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              <span>{filteredPrograms.length} {language === 'es' ? 'programas disponibles' : 'programs available'}</span>
            </div>
          </div>

          {/* Category Filter Tabs (Segmented Control) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {[
              { id: 'all', label: language === 'es' ? 'Todos' : 'All', count: programs.length },
              { id: 'media-tecnica', label: language === 'es' ? 'Media Técnica SENA' : 'Technical SENA', count: 2 },
              { id: 'secundaria', label: language === 'es' ? 'Secundaria (6° a 9°)' : 'Middle School', count: 1 },
              { id: 'primaria', label: language === 'es' ? 'Primaria (1° a 5°)' : 'Elementary', count: 1 },
              { id: 'preescolar', label: language === 'es' ? 'Preescolar / Transición' : 'Preschool', count: 1 },
              { id: 'complementaria', label: language === 'es' ? 'Complementaria' : 'Complementary', count: 1 },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label} <span className="opacity-70 ml-1">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Program Cards Grid */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12 p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {language === 'es' ? 'No se encontraron programas con estos filtros' : 'No programs match your search'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'es' ? 'Prueba cambiando los términos de búsqueda o seleccionando otra categoría.' : 'Try adjusting search terms or filters.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevel('all');
                  setSelectedCampus('all');
                  setSelectedCategoryTab('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'es' ? 'Restablecer Filtros' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-750 p-5 flex flex-col justify-between hover:border-teal-500/60 hover:shadow-lg transition-all group"
                >
                  <div>
                    {/* Top Metadata row */}
                    <div className="flex items-center justify-between gap-2 text-xs mb-3">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {item.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    </div>

                    {/* Program Title */}
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-teal-700 dark:text-teal-400">
                      {item.level}
                    </p>

                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Key Attributes List */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{language === 'es' ? 'Modalidad:' : 'Modality:'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.modality}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{language === 'es' ? 'Jornada:' : 'Shift:'}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.shift}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{language === 'es' ? 'Sede:' : 'Campus:'}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.campusName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{language === 'es' ? 'Cupos Disponibles:' : 'Available Spots:'}</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">
                          {item.spots} {language === 'es' ? 'de' : 'of'} {item.spotsTotal}
                        </span>
                      </div>
                    </div>

                    {/* Skills pills */}
                    <div className="mt-3.5 flex flex-wrap gap-1">
                      {item.skills.slice(0, 3).map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[10px] bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEnrollDirectly(item.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Inscribirme' : 'Enroll Now'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProgramDetail(item)}
                      className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer"
                      title={language === 'es' ? 'Ver Ficha Completa' : 'View Details'}
                    >
                      {language === 'es' ? 'Ver Detalle' : 'Details'}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          7. FECHAS IMPORTANTES / CRONOGRAMA ACADÉMICO (ESTILO BETOWA)
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {language === 'es' ? 'CALENDARIO OFICIAL' : 'ACADEMIC SCHEDULE'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'es' ? 'Fechas Importantes del Proceso de Matrícula 2026' : 'Key Enrollment Dates 2026'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {language === 'es'
                ? 'Conoce las fechas clave establecidas por la Secretaría de Educación de Medellín para la inscripción, asignación y legalización de cupos escolares.'
                : 'Follow the official admission phases for Medellín public school year 2026.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Phase 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-500/60 dark:border-teal-500/40 relative shadow-sm">
              <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center mb-3">
                1
              </span>
              <span className="text-[11px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wide block">
                {language === 'es' ? 'Fase de Inscripciones' : 'Registration Phase'}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                {language === 'es' ? 'Inscripción Virtual de Aspirantes' : 'Online Applications'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                1 de Octubre al 30 de Noviembre
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {language === 'es'
                  ? 'Diligenciamiento de formularios digitales para estudiantes nuevos y solicitudes de cupo en plataforma.'
                  : 'Complete initial online registration for all grade levels.'}
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs flex items-center justify-center mb-3">
                2
              </span>
              <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                {language === 'es' ? 'Asignación de Cupos' : 'Spot Allocation'}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                {language === 'es' ? 'Publicación en SIMAT' : 'SIMAT Announcement'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                5 al 15 de Diciembre
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {language === 'es'
                  ? 'Publicación de listas de admitidos y confirmación de asignación de cupos por secretaría académica.'
                  : 'Official announcement of admitted students and spot confirmations.'}
              </p>
            </div>

            {/* Phase 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs flex items-center justify-center mb-3">
                3
              </span>
              <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wide block">
                {language === 'es' ? 'Legalización' : 'Legalization'}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                {language === 'es' ? 'Validación y Entrega de Papeles' : 'Document Submission'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                10 al 23 de Enero de 2026
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {language === 'es'
                  ? 'Firma de matrícula, entrega de documentos en físico o virtual y asentamiento del libro de matrículas.'
                  : 'Final contract signature and physical or digital document check.'}
              </p>
            </div>

            {/* Phase 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs flex items-center justify-center mb-3">
                4
              </span>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">
                {language === 'es' ? 'Año Escolar' : 'School Start'}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                {language === 'es' ? 'Inducción e Inicio de Clases' : 'Induction & Classes Start'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                27 de Enero de 2026
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {language === 'es'
                  ? 'Jornada de bienvenida institucional, entrega de horarios escolares y bienvenida de directivos.'
                  : 'Welcome assembly, orientation, and regular academic calendar kickoff.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          8. LA INSTITUCIÓN EN NÚMEROS (EL SENA / EDUMED EN CIFRAS)
          ========================================================================= */}
      <section className="py-12 sm:py-14 bg-[#002f49] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              {language === 'es' ? 'IMPACTO EDUCATIVO EN MEDELLÍN' : 'EDUCATIONAL IMPACT IN MEDELLIN'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
              {language === 'es' ? 'La Institución en Cifras' : 'Our School in Numbers'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-amber-300 block">
                +1,450
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block">
                {language === 'es' ? 'Estudiantes Matriculados' : 'Enrolled Students'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {language === 'es' ? 'Desde Transición hasta 11°' : 'Preschool to 11th Grade'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-emerald-300 block">
                100%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block">
                {language === 'es' ? 'Gratuidad Oficial' : 'Free Public Tuition'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {language === 'es' ? 'Sin cobros ni intermediarios' : 'No fees or intermediaries'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-teal-300 block">
                4
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block">
                {language === 'es' ? 'Programas Técnicos SENA' : 'SENA Technical Programs'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {language === 'es' ? 'Sistemas, Software y Negocios' : 'IT, Software & Business'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-black text-blue-300 block">
                98.4%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block">
                {language === 'es' ? 'Permanencia y Retención' : 'School Retention Rate'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {language === 'es' ? 'Alimentación PAE y Bienestar' : 'Meals & Student Welfare'}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          9. RUTA DE MATRÍCULA EN 4 PASOS
          ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {language === 'es' ? 'GUÍA PASO A PASO' : 'STEP BY STEP GUIDE'}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'es' ? '¿Cómo Matricularse en EduMed Digital?' : 'How to Enroll at EduMed Digital?'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {language === 'es'
                ? 'El trámite es completamente virtual, seguro y respaldado por el sistema de matrículas de la Alcaldía de Medellín.'
                : 'Simple, secure online process without intermediaries.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'es' ? 'Explora la Oferta' : 'Explore Programs'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {language === 'es'
                  ? 'Revisa los cupos disponibles por grado escolar y programas de articulación técnica SENA para grados 10° y 11°.'
                  : 'Check available vacancies per grade and technical tracks.'}
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'es' ? 'Crea tu Cuenta o Ingresa' : 'Create Account or Log In'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {language === 'es'
                  ? 'Regístrate como acudiente o estudiante con tu correo y celular para hacer seguimiento continuo a tu solicitud.'
                  : 'Sign up as guardian or student to track application milestones.'}
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'es' ? 'Diligencia y Sube Documentos' : 'Fill Form & Upload Docs'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {language === 'es'
                  ? 'Ingresa los datos personales, residencia y adjunta documento de identidad, carnet de vacunas y certificación EPS.'
                  : 'Enter student and guardian data, upload ID copies, and health records.'}
              </p>
            </div>

            <div className="flex flex-col items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center mb-3 shadow-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'es' ? 'Confirmación y Código SIMAT' : 'Confirmation & SIMAT'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {language === 'es'
                  ? 'Recibe tu confirmación por correo y SMS con el número oficial de matrícula asignado por secretaría académica.'
                  : 'Get your official enrollment confirmation number via SMS & email.'}
              </p>
            </div>

          </div>

          {/* Quick CTA to start enrollment */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-800 to-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                {language === 'es' ? '¿Listo para matricularte?' : 'Ready to Enroll?'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                {language === 'es' ? 'Inicia tu proceso de matrícula para el año 2026' : 'Start your official 2026 application today'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                {language === 'es'
                  ? 'El formulario te toma menos de 10 minutos y puedes guardar tu progreso en cualquier momento.'
                  : 'The online form takes less than 10 minutes with auto-save support.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (currentUser) setActiveTab('wizard');
                  else handleOpenAuth('register');
                }}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                {language === 'es' ? 'Comenzar Formulario Ahora' : 'Start Application Now'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. MODAL DE ACCESO Y REGISTRO (AUTH MODAL CON CARGA DIRECTA)
          ========================================================================= */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-md my-8 animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={language === 'es' ? 'Cerrar ventana' : 'Close modal'}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Auth Card embedded inside modal */}
            <AuthCard 
              defaultMode={authModalMode}
              onSuccess={() => {
                setIsAuthModalOpen(false);
              }}
            />

            {/* Quick-test access hints */}
            <div className="mt-3 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center shadow-lg text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                {language === 'es' ? 'Cuentas de prueba rápida (Clave: 12345):' : 'Demo Test Accounts (Pass: 12345):'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('login-identifier-input') as HTMLInputElement;
                    const passInput = document.getElementById('login-password-input') as HTMLInputElement;
                    const roleSelect = document.getElementById('login-role-dropdown') as HTMLSelectElement;
                    if (input) input.value = 'mateo.restrepo@edumed.edu.co';
                    if (passInput) passInput.value = '12345';
                    if (roleSelect) roleSelect.value = 'student';
                    // Trigger input change events
                    if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
                    if (passInput) passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    if (roleSelect) roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  }}
                  className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:underline cursor-pointer border border-blue-200 dark:border-blue-800"
                >
                  🎓 {language === 'es' ? 'Estudiante' : 'Student'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('login-identifier-input') as HTMLInputElement;
                    const passInput = document.getElementById('login-password-input') as HTMLInputElement;
                    const roleSelect = document.getElementById('login-role-dropdown') as HTMLSelectElement;
                    if (input) input.value = 'maria.gonzalez@gmail.com';
                    if (passInput) passInput.value = '12345';
                    if (roleSelect) roleSelect.value = 'guardian';
                    if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
                    if (passInput) passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    if (roleSelect) roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  }}
                  className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold hover:underline cursor-pointer border border-amber-200 dark:border-amber-800"
                >
                  👨‍👩‍👧 {language === 'es' ? 'Acudiente' : 'Guardian'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('login-identifier-input') as HTMLInputElement;
                    const passInput = document.getElementById('login-password-input') as HTMLInputElement;
                    const roleSelect = document.getElementById('login-role-dropdown') as HTMLSelectElement;
                    if (input) input.value = 'admin@edumed.edu.co';
                    if (passInput) passInput.value = '12345';
                    if (roleSelect) roleSelect.value = 'admin';
                    if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
                    if (passInput) passInput.dispatchEvent(new Event('input', { bubbles: true }));
                    if (roleSelect) roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  }}
                  className="px-2 py-1 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold hover:underline cursor-pointer border border-teal-200 dark:border-teal-800"
                >
                  🏛️ {language === 'es' ? 'Administrativo' : 'Admin'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          11. MODAL DETALLE DE PROGRAMA
          ========================================================================= */}
      {selectedProgramDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProgramDetail(null);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedProgramDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
              {selectedProgramDetail.code}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {selectedProgramDetail.title}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedProgramDetail.level}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Jornada:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProgramDetail.shift}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duración:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProgramDetail.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cupos 2026:</span>
                <span className="font-bold text-emerald-600">{selectedProgramDetail.spots} cupos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sede:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProgramDetail.campusName}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {language === 'es' ? 'Descripción del Programa' : 'Program Overview'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedProgramDetail.description}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {language === 'es' ? 'Requisitos de Ingreso' : 'Entry Requirements'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {selectedProgramDetail.requirements}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const progId = selectedProgramDetail.id;
                  setSelectedProgramDetail(null);
                  handleEnrollDirectly(progId);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'es' ? 'Iniciar Inscripción' : 'Apply Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProgramDetail(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          12. PIE DE PÁGINA INSTITUCIONAL (BETOWA / SENA / MINEDUCACIÓN)
          ========================================================================= */}
      <footer className="w-full bg-[#001e30] text-slate-300 border-t border-slate-800 pt-12 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* Col 1: Institutional info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <img 
                  src={customLogoUrl} 
                  alt="Escudo Institucional" 
                  className="w-9 h-9 rounded-full object-cover border border-amber-400 bg-white"
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
                {language === 'es'
                  ? 'Institución Educativa Oficial de carácter público adscrita a la Secretaría de Educación de Medellín. Educación incluyente, técnica y de calidad.'
                  : 'Official public school linked to the Medellín Secretariat of Education.'}
              </p>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>DANE: 105001002345</div>
                <div>NIT: 890980123-1</div>
                <div>Código ICFES: 014522</div>
              </div>
            </div>

            {/* Col 2: Sedes y Contacto */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {language === 'es' ? 'Sedes y Ubicación' : 'Campuses & Location'}
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
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Conmutador: (604) 284 56 78</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>contacto@edumed.edu.co</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Canales Oficiales y Horarios */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {language === 'es' ? 'Atención al Ciudadano' : 'Citizen Assistance'}
              </h4>
              <ul className="space-y-2 text-slate-400 text-[11px]">
                <li><strong>Horario Secretaría:</strong> Lunes a Viernes de 7:30 am a 12:30 pm y 1:30 pm a 4:30 pm</li>
                <li><strong>Línea Nacional Gratuita:</strong> 01 8000 910 123</li>
                <li><strong>WhatsApp Institucional:</strong> +57 312 456 7890</li>
                <li><strong>Radicación PQRSF:</strong> pqrsf@edumed.edu.co</li>
              </ul>
            </div>

            {/* Col 4: Enlaces Institucionales */}
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                {language === 'es' ? 'Enlaces de Interés' : 'Quick Links'}
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a href="https://betowa.sena.edu.co" target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1">
                    <span>Portal Betowa SENA Oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.medellin.gov.co/educacion" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                    <span>Secretaría de Educación de Medellín</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.mineducacion.gov.co" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                    <span>Ministerio de Educación Nacional (MEN)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('beneficios')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'es' ? 'Beneficios y Bienestar Escolar' : 'Student Benefits'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('soporte')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'es' ? 'Preguntas Frecuentes y Soporte' : 'FAQs & Support'}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal / Copyright row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Institución Educativa Félix Henao Botero • Sistema Oficial EduMed Digital. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-3">
              <span>Medellín, Colombia</span>
              <span>·</span>
              <span>SIMAT V4.2</span>
              <span>·</span>
              <span>Políticas de Privacidad y Hábeas Data</span>
              {onReplaySplash && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onReplaySplash}
                    className="hover:text-teal-400 text-slate-400 transition-colors cursor-pointer"
                    title="Ver animación de bienvenida"
                  >
                    Animación EduMed
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

export default BetowaPortalHome;
