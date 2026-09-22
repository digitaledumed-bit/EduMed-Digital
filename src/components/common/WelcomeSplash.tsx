import React, { useEffect, useRef, useState, useCallback } from 'react';
import edumedLogoAsset from '../../assets/images/edumed_digital_logo_1788463111894.jpg';

interface WelcomeSplashProps {
  onComplete?: () => void;
  customLogoUrl?: string;
  forceShow?: boolean;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ 
  onComplete, 
  customLogoUrl,
  forceShow = false 
}) => {
  const [mounted, setMounted] = useState<boolean>(true);
  const [stage, setStage] = useState<'initial' | 'intro' | 'slogan' | 'exiting' | 'finished'>('initial');
  const [logoSrc, setLogoSrc] = useState<string>(customLogoUrl || edumedLogoAsset || '/edumed_logo.jpg');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check if session already displayed the splash (unless forceShow is true)
  useEffect(() => {
    if (!forceShow) {
      const alreadySeen = sessionStorage.getItem('edumed_welcome_splash_seen');
      if (alreadySeen === 'true') {
        setMounted(false);
        if (onComplete) onComplete();
        return;
      }
    }
  }, [forceShow, onComplete]);

  // Handler to smoothly finish and dismiss splash
  const handleFinish = useCallback(() => {
    if (stage === 'finished') return;
    setStage('exiting');
    sessionStorage.setItem('edumed_welcome_splash_seen', 'true');

    // Wait for exit fade animation (600ms) before unmounting completely
    const exitTimer = setTimeout(() => {
      setStage('finished');
      setMounted(false);
      if (onComplete) onComplete();
    }, 600);

    return () => clearTimeout(exitTimer);
  }, [stage, onComplete]);

  // Animation timeline sequence
  useEffect(() => {
    if (!mounted) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 900);
      return () => clearTimeout(quickTimer);
    }

    // Stage 1: Reveal logo with de-blur and scale (100ms)
    const t1 = setTimeout(() => {
      setStage('intro');
    }, 100);

    // Stage 2: Slogan "Aprende. Conecta. Evoluciona." (750ms)
    const t2 = setTimeout(() => {
      setStage('slogan');
    }, 750);

    // Stage 3: Begin exit transition (2300ms)
    const t3 = setTimeout(() => {
      handleFinish();
    }, 2350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [mounted, handleFinish]);

  // Canvas particle constellation effect (subtle connected digital network)
  useEffect(() => {
    if (!mounted || stage === 'finished') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Responsive particle count (fewer on mobile for 60fps buttery smoothness)
    const particleCount = width < 768 ? 28 : 50;
    const maxDistance = width < 768 ? 90 : 130;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseOffset: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(20, 184, 166,', // Teal
      'rgba(16, 185, 129,', // Emerald
      'rgba(56, 189, 248,', // Cyan/Sky
      'rgba(245, 158, 11,'  // Amber gold
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        baseAlpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently at borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle pulsing opacity
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
        const currentAlpha = Math.max(0.1, p.baseAlpha + pulse * 0.15);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${currentAlpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [mounted, stage]);

  if (!mounted || stage === 'finished') {
    return null;
  }

  const isExiting = stage === 'exiting';
  const isIntro = stage === 'intro' || stage === 'slogan' || stage === 'exiting';
  const isSlogan = stage === 'slogan' || stage === 'exiting';

  return (
    <aside
      aria-label="Pantalla de bienvenida EduMed Digital"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out select-none ${
        isExiting 
          ? 'opacity-0 scale-[1.02] pointer-events-none' 
          : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#070b14', // Deep obsidian dark slate
      }}
    >
      {/* Background Subtle Gradient & Light Bloom */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 48%, rgba(13, 148, 136, 0.18) 0%, rgba(6, 95, 70, 0.08) 40%, rgba(7, 11, 20, 0) 75%),
            radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Interactive Constellation Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-75"
      />

      {/* Skip Button (Omitir) in top corner */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20">
        <button
          type="button"
          onClick={handleFinish}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
        >
          <span>Omitir</span>
          <span className="text-[10px] text-teal-400">→</span>
        </button>
      </div>

      {/* Central Brand Core Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-md w-full">
        
        {/* Soft Radial Ambient Glow behind Logo */}
        <div 
          className={`absolute w-44 h-44 sm:w-56 sm:h-56 -top-6 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none ${
            isIntro ? 'opacity-80 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.45) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 70%)',
          }}
        />

        {/* Logo Card with Smooth Entrance: Blur to Sharp, Scale 95% to 100%, Opacity 0 to 1 */}
        <div
          className={`relative transform-gpu transition-all duration-1000 ease-out mb-5 ${
            isIntro
              ? 'opacity-100 scale-100 blur-0 translate-y-0'
              : 'opacity-0 scale-95 blur-md translate-y-2'
          }`}
        >
          {/* Subtle Rotating Tech Border Ring */}
          <div className="absolute -inset-2 rounded-full border border-teal-500/20 dark:border-teal-400/20 animate-[spin_18s_linear_infinite] pointer-events-none" />
          <div className="absolute -inset-1 rounded-full border border-amber-400/25 pointer-events-none animate-pulse" />

          {/* Logo Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-br from-teal-500/40 via-emerald-500/20 to-amber-500/30 shadow-2xl shadow-teal-900/50 flex items-center justify-center ring-2 ring-white/10 backdrop-blur-xs">
            <img
              src={logoSrc}
              alt="EduMed Digital Logo"
              className="w-full h-full rounded-full object-cover bg-white ring-1 ring-black/10"
              onError={() => {
                setLogoSrc('/school_logo.jpg');
              }}
            />
          </div>
        </div>

        {/* Brand Name: "EduMed Digital" */}
        <div
          className={`transform-gpu transition-all duration-700 ease-out delay-150 ${
            isIntro
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-white tracking-tight drop-shadow-md">
              EduMed
            </span>
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent font-black tracking-tight drop-shadow-sm">
              Digital
            </span>
          </div>

          {/* Institutional Badge */}
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wide uppercase">
              I.E. Félix Henao Botero
            </span>
          </div>
        </div>

        {/* Slogan with Staggered Fade-in & Vertical Translation: "Aprende. Conecta. Evoluciona." */}
        <div
          className={`mt-4 transform-gpu transition-all duration-700 ease-out ${
            isSlogan
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2.5'
          }`}
        >
          <p className="text-xs sm:text-sm tracking-widest font-medium text-slate-300/90 flex items-center justify-center gap-2">
            <span className="text-teal-400 font-semibold transition-colors duration-500">
              Aprende.
            </span>
            <span className="text-slate-400 text-[10px]">•</span>
            <span className="text-slate-200 font-semibold transition-colors duration-500">
              Conecta.
            </span>
            <span className="text-slate-400 text-[10px]">•</span>
            <span className="text-emerald-400 font-semibold transition-colors duration-500">
              Evoluciona.
            </span>
          </p>

          {/* Micro Progress Bar representing smooth loading */}
          <div className="mt-4 mx-auto w-32 sm:w-40 h-0.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-1200 ease-out ${
                isSlogan ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>

      </div>

      {/* Subtle Footer Assurance */}
      <div 
        className={`absolute bottom-6 text-[10px] text-slate-500 tracking-wider uppercase font-medium transition-all duration-700 ${
          isIntro ? 'opacity-80' : 'opacity-0'
        }`}
      >
        <span>Plataforma Oficial de Gestión Educativa</span>
      </div>
    </aside>
  );
};
