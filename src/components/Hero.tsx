import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';

interface HeroProps {
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
  onExploreAgents: () => void;
  isImmersive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onCursorChange, onExploreAgents, isImmersive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax with mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 40;
      const y = (e.clientY / innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll sequence: hero shrinks and fades slightly as you scroll down
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.93]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const backdropParallax = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Words for word-by-word reveal
  const headlineWords = [
    'Residencias',
    'que',
    'pertenecen',
    'a',
    'la',
    'tierra,',
    'no',
    'al',
    'mercado.'
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[105vh] flex flex-col justify-between pt-28 pb-16 px-6 lg:px-12 overflow-hidden bg-[#F4EFE6]"
    >
      {/* Background Organic Floating Blobs with Mouse Parallax & CSS Morph */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob 1 - Warm Terracotta */}
        <motion.div
          animate={{
            x: mousePos.x * 0.7,
            y: mousePos.y * 0.7,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 80 }}
          className="absolute -top-24 -right-24 w-[540px] h-[540px] bg-[#C2623F]/12 rounded-full blur-3xl animate-morph"
        />

        {/* Blob 2 - Deep Olive */}
        <motion.div
          animate={{
            x: -mousePos.x * 0.9,
            y: -mousePos.y * 0.9,
          }}
          transition={{ type: 'spring', damping: 35, stiffness: 70 }}
          className="absolute top-1/3 -left-36 w-[620px] h-[620px] bg-[#2F3A2B]/10 rounded-full blur-3xl animate-morph-slow"
        />

        {/* Blob 3 - Warm Sand Ochre */}
        <motion.div
          animate={{
            x: mousePos.x * 0.4,
            y: mousePos.y * 0.4,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 90 }}
          className="absolute -bottom-20 right-1/4 w-[480px] h-[480px] bg-[#D8CCB5]/40 rounded-full blur-2xl animate-morph"
        />

        {/* Subtle geometric SVG curve */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,176C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="#2F3A2B"
            fillOpacity="0.04"
          />
        </svg>
      </div>

      {/* Hero Animated Main Container with scale & fade transform */}
      <motion.div
        style={{
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY
        }}
        className="relative z-10 max-w-7xl mx-auto w-full my-auto flex flex-col justify-center pt-8 lg:pt-14"
      >
        {/* Curatorial Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2.5 text-xs tracking-widest uppercase font-medium text-[#2F3A2B] mb-6"
        >
          <span className="font-semibold text-[#C2623F]">NOMADA GROUP</span>
          <span aria-hidden="true">·</span>
          <span>AGENTES INDEPENDIENTES INTERNACIONAL</span>
          <span aria-hidden="true">·</span>
          <span className="bg-[#2F3A2B]/10 px-2.5 py-0.5 rounded-full text-[#2F3A2B] font-mono text-[11px]">
            LA CONVENCIÓN, CUSCO, PERÚ
          </span>
        </motion.div>

        {/* Huge Word-by-Word Reveal Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] font-serif font-light leading-[1.04] tracking-tight text-[#14110F] max-w-6xl text-balance">
          {headlineWords.map((word, index) => (
            <span
              key={index}
              className="inline-block overflow-hidden mr-[0.28em] align-top pb-1"
            >
              <motion.span
                initial={{ y: '115%', rotate: 2 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.25 + index * 0.075,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block ${word === 'tierra,' ? 'italic text-[#2F3A2B]' : word === 'mercado.' ? 'italic text-[#C2623F]' : ''}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Editorial Sub-Narrative & CTA in Balanced 2-Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <div className="lg:col-span-7">
            <p className="text-lg sm:text-xl text-[#14110F]/80 font-light leading-relaxed max-w-2xl">
              NOMADA GROUP es una red de agentes independientes internacionales dedicada
              a la curaduría de fincas cafetaleras de especialidad, residencias bioclimáticas y santuarios de montaña en
              <strong> La Convención, Cusco, Perú</strong> — donde los glaciares andinos se encuentran con la ceja de selva.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
            <button
              onClick={onExploreAgents}
              onMouseEnter={() => onCursorChange('Mundos', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="px-7 py-4 text-xs font-medium tracking-widest uppercase bg-[#2F3A2B] text-[#FAF7F2] rounded-full hover:bg-[#1E261B] hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <span>Explorar los 3 Mundos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2623F]" />
            </button>

            <button
              onClick={() => scrollTo('#territorio')}
              onMouseEnter={() => onCursorChange('Cusco', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="px-6 py-4 text-xs font-medium tracking-widest uppercase text-[#14110F]/70 hover:text-[#14110F] transition-colors cursor-pointer"
            >
              Ver La Convención
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Cinematic Preview Slice of Architecture */}
      <motion.div
        style={{ y: backdropParallax }}
        className="relative z-10 max-w-7xl mx-auto w-full mt-12 rounded-3xl overflow-hidden shadow-2xl border border-[#2F3A2B]/10 max-h-[260px] md:max-h-[340px] group"
        onMouseEnter={() => onCursorChange('Ver Cañón', 'property')}
        onMouseLeave={() => onCursorChange('', 'default')}
        onClick={() => scrollTo('#territorio')}
      >
        <img
          src="/src/assets/images/hero_la_convencion_cusco_1793477326244.jpg"
          alt="Cañón del Urubamba y ceja de selva en La Convención, Cusco, Perú"
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/85 via-[#14110F]/20 to-transparent flex items-end p-6 md:p-8">
          <div className="text-[#FAF7F2] flex flex-col sm:flex-row sm:items-end justify-between w-full gap-2">
            <div>
              <p className="text-xs uppercase tracking-widest font-sans text-[#C2623F] font-semibold">Territorio Insigne · Cusco, Perú</p>
              <h2 className="text-xl md:text-2xl font-serif">Cañón del Río Urubamba & Cordillera de Vilcabamba</h2>
            </div>
            <span className="text-xs tracking-wider uppercase font-mono text-[#FAF7F2]/80 pb-0.5">
              Provincia de La Convención · 1.050 - 2.800 m.s.n.m.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Animated Scroll Down Indicator (hidden in Immersive Mode for pure photography) */}
      {!isImmersive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-10 text-xs text-[#14110F]/60"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums">01 / 04</span>
            <span className="w-8 h-[1px] bg-[#2F3A2B]/20" />
            <span className="uppercase tracking-widest text-[11px]">Inmersión Inicial</span>
          </div>

          <button
            onClick={() => scrollTo('#agentes')}
            onMouseEnter={() => onCursorChange('Bajar', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="group inline-flex items-center gap-2 uppercase tracking-widest text-[11px] hover:text-[#14110F] transition-colors cursor-pointer"
          >
            <span>Descender a los Mundos</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="p-1.5 rounded-full border border-[#2F3A2B]/20 group-hover:border-[#2F3A2B]"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#2F3A2B]" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </section>
  );
};
