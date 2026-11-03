import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, MessageCircle, Phone, Play, Pause, RotateCcw, Compass } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { IMAGES, VIDEOS, handleImageError } from '../lib/images';

interface HeroProps {
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
  onExploreAgents: () => void;
  isImmersive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onCursorChange, onExploreAgents, isImmersive = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollTo } = useSmoothScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

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

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3.5">
            <button
              onClick={onExploreAgents}
              onMouseEnter={() => onCursorChange('Mundos', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="px-6 py-3.5 text-xs font-medium tracking-widest uppercase bg-[#2F3A2B] text-[#FAF7F2] rounded-full hover:bg-[#1E261B] hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-3"
            >
              <span>Explorar Mundos</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2623F]" />
            </button>

            <a
              href="https://wa.me/51950155945?text=Hola%20Mariano%20Otazu%20Mar%C3%ADn,%20me%20pongo%20en%20contacto%20desde%20NOMADA%20GROUP%20para%20solicitar%20informaci%C3%B3n%20y%20asesor%C3%ADa%20personalizada%20sobre%20propiedades%20y%20fincas%20en%20La%20Convenci%C3%B3n,%20Cusco."
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => onCursorChange('WhatsApp', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="px-5 py-3.5 text-xs font-medium tracking-wider uppercase text-[#FAF7F2] bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full transition-all cursor-pointer inline-flex items-center gap-2 shadow-md"
              title="Contactar directamente a Mariano Otazu Marín (+51 950 155 945) vía WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Agente</span>
            </a>

            <button
              onClick={() => scrollTo('#mapas-lotes')}
              onMouseEnter={() => onCursorChange('Mapas', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="px-4 py-3.5 text-xs font-medium tracking-widest uppercase text-[#C2623F] hover:text-[#A85437] transition-colors cursor-pointer border border-[#C2623F]/30 rounded-full hover:bg-[#C2623F]/5"
            >
              Mapas de Lotes
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Cinematic HD Satellite Presentation Banner (Zoom Tierra a Valle) */}
      <motion.div
        style={{ y: backdropParallax }}
        className="relative z-10 max-w-7xl mx-auto w-full mt-12 rounded-3xl overflow-hidden shadow-2xl border border-[#2F3A2B]/15 min-h-[300px] md:min-h-[420px] aspect-[16/8.5] group cursor-pointer bg-[#0D120B]"
        onMouseEnter={() => onCursorChange('Explorar Lotes', 'property')}
        onMouseLeave={() => onCursorChange('', 'default')}
        onClick={() => scrollTo('#mapas-lotes')}
      >
        {/* HD Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={IMAGES.heroLaConvencion}
          className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.08] saturate-[1.12] brightness-[0.96] transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
        >
          <source src={VIDEOS.heroGlobeZoom} type="video/mp4" />
          <source src={VIDEOS.heroGlobeZoomPublic} type="video/mp4" />
          <source src="/assets/aistudio/gemini_generated_video_09359924_eb099e1c.mp4" type="video/mp4" />
          <img
            src={IMAGES.heroLaConvencion}
            alt="Cañón del Urubamba y ceja de selva en La Convención, Cusco, Perú"
            onError={(e) => handleImageError(e)}
            className="w-full h-full object-cover object-center"
          />
        </video>

        {/* Ambient Overlay Gradients for Readability and Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-[#14110F]/25 to-[#14110F]/45 pointer-events-none" />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-5 left-5 right-5 z-20 flex items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2.5 bg-[#14110F]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[#FAF7F2] text-xs font-mono shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C2623F] animate-ping" />
            <span className="font-semibold tracking-wider uppercase text-[11px] text-[#FAF7F2]">
              Presentación Satelital HD
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-[10px] text-white/70 hidden sm:inline">
              Vuelo Orbital ➜ Descenso al Valle de Lotes (3.340 msnm)
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#FAF7F2] tracking-wider uppercase">
              4K · HD
            </div>
            <button
              onClick={handleRestart}
              className="p-2 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Reiniciar vuelo desde el espacio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-[#2F3A2B]/80 hover:bg-[#2F3A2B] backdrop-blur-md border border-white/20 text-[#FAF7F2] transition-all cursor-pointer"
              title={isPlaying ? 'Pausar video' : 'Reproducir video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute inset-0 flex items-end p-6 md:p-10 pointer-events-none">
          <div className="text-[#FAF7F2] flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[#C2623F] font-bold mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C2623F]" />
                <span>Georreferenciación & Zonificación · Cusco, Perú</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#FAF7F2] leading-tight">
                Vuelo Orbital a los Valles de Anta & La Convención
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light mt-1.5 max-w-xl">
                Aterrizaje visual desde órbita terrestre hacia las parcelas campestres de Izcuchaca y las fincas de café en Huayopata.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo('#mapas-lotes');
                }}
                className="px-5 py-3 rounded-full bg-[#C2623F] hover:bg-[#A84E2E] text-[#FAF7F2] text-xs font-mono uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer flex items-center gap-2 group/btn"
              >
                <span>Explorar Mapas de Lotes</span>
                <span className="transition-transform group-hover/btn:translate-x-1">➜</span>
              </button>
            </div>
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
