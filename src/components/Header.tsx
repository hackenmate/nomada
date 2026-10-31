import React, { useState } from 'react';
import { Volume2, VolumeX, Database, Maximize2, Minimize2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSmoothScroll } from './SmoothScrollProvider';
import { ambientSound } from '../lib/audio';

interface HeaderProps {
  isImmersive: boolean;
  onToggleImmersive: () => void;
  onOpenConsultation: () => void;
  onOpenSchema: () => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isImmersive,
  onToggleImmersive,
  onOpenConsultation,
  onOpenSchema,
  onCursorChange,
}) => {
  const { scrollTo } = useSmoothScroll();
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isHoveringTop, setIsHoveringTop] = useState(false);

  const handleToggleAudio = () => {
    const active = ambientSound.toggle();
    setIsAudioActive(active);
  };

  // If in immersive mode, render a refined floating escape capsule that doesn't obstruct the viewport
  if (isImmersive) {
    return (
      <div
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-6 pointer-events-none"
        onMouseEnter={() => setIsHoveringTop(true)}
        onMouseLeave={() => setIsHoveringTop(false)}
      >
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="pointer-events-auto bg-[#14110F]/90 backdrop-blur-md text-[#FAF7F2] py-2 px-5 rounded-full border border-[#FAF7F2]/20 shadow-2xl flex items-center gap-3.5 transition-all hover:bg-[#14110F]"
        >
          <div className="flex items-center gap-2 text-xs font-serif tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#C2623F] animate-pulse" />
            <span className="text-[#FAF7F2] font-medium">Modo Inmersivo</span>
          </div>

          <span className="text-xs text-[#FAF7F2]/30" aria-hidden="true">|</span>

          {/* Audio ambience toggle within immersive capsule */}
          <button
            onClick={() => {
              const active = ambientSound.toggleMute();
              setIsAudioActive(active);
            }}
            title={isAudioActive ? 'Pausar textura sonora de viento' : 'Activar textura sonora de viento'}
            onMouseEnter={() => onCursorChange(isAudioActive ? 'Silenciar' : 'Sonido', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="p-1 rounded-full text-[#FAF7F2]/80 hover:text-[#FAF7F2] transition-colors cursor-pointer"
          >
            {isAudioActive ? (
              <Volume2 className="w-3.5 h-3.5 text-[#C2623F] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#FAF7F2]/60" />
            )}
          </button>

          <span className="text-xs text-[#FAF7F2]/30" aria-hidden="true">|</span>

          <button
            onClick={onToggleImmersive}
            onMouseEnter={() => onCursorChange('Salir', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="inline-flex items-center gap-1.5 text-xs text-[#FAF7F2]/80 hover:text-[#FAF7F2] font-mono tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-[#C2623F]" />
            <span>Salir (ESC)</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Standard Header (compliant with 3-Zone Top Bar Contract)
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#F4EFE6]/85 backdrop-blur-md border-b border-[#2F3A2B]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => scrollTo('#hero')}
          onMouseEnter={() => onCursorChange('Inicio', 'action')}
          onMouseLeave={() => onCursorChange('', 'default')}
          className="text-xl sm:text-2xl lg:text-3xl font-serif tracking-tight text-[#14110F] whitespace-nowrap shrink-0 hover:text-[#2F3A2B] transition-colors cursor-pointer"
        >
          NOMADA GROUP
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide font-normal text-[#14110F]/75">
          <button
            onClick={() => scrollTo('#agentes')}
            onMouseEnter={() => onCursorChange('Mundos', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="hover:text-[#14110F] transition-colors whitespace-nowrap shrink-0 relative py-1 hover:border-b hover:border-[#2F3A2B] cursor-pointer"
          >
            Agentes
          </button>
          <button
            onClick={() => scrollTo('#territorio')}
            onMouseEnter={() => onCursorChange('Cusco', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="hover:text-[#14110F] transition-colors whitespace-nowrap shrink-0 relative py-1 hover:border-b hover:border-[#2F3A2B] cursor-pointer"
          >
            La Convención (Cusco)
          </button>
          <button
            onClick={() => scrollTo('#colecciones')}
            onMouseEnter={() => onCursorChange('Colección', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="hover:text-[#14110F] transition-colors whitespace-nowrap shrink-0 relative py-1 hover:border-b hover:border-[#2F3A2B] cursor-pointer"
          >
            Colecciones
          </button>
          <button
            onClick={() => scrollTo('#manifiesto')}
            onMouseEnter={() => onCursorChange('Manifiesto', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="hover:text-[#14110F] transition-colors whitespace-nowrap shrink-0 relative py-1 hover:border-b hover:border-[#2F3A2B] cursor-pointer"
          >
            Filosofía
          </button>
          <button
            onClick={onOpenSchema}
            onMouseEnter={() => onCursorChange('Supabase', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="inline-flex items-center gap-1.5 hover:text-[#14110F] transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 opacity-60" />
            <span>Datos Supabase</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Audio Atmosphere + Modo Inmersivo */}
        <div className="flex items-center gap-3.5 shrink-0">
          
          {/* Subtle Ambient Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            title={isAudioActive ? 'Pausar atmósfera sonora' : 'Activar atmósfera sonora'}
            aria-label="Atmósfera sonora"
            onMouseEnter={() => onCursorChange(isAudioActive ? 'Silenciar' : 'Sonido', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="p-2 text-[#14110F]/60 hover:text-[#14110F] transition-colors rounded-full hover:bg-[#2F3A2B]/5 cursor-pointer"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-[#C2623F] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Dedicated Modo Inmersivo Button */}
          <button
            onClick={onToggleImmersive}
            onMouseEnter={() => onCursorChange('Inmersivo', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="px-3.5 py-2 text-xs font-medium tracking-wide text-[#2F3A2B] border border-[#2F3A2B]/20 rounded-full hover:bg-[#2F3A2B]/5 transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Activar Modo Inmersivo para scroll cinematográfico puro"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#C2623F]" />
            <span className="hidden sm:inline">Modo Inmersivo</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenConsultation}
            onMouseEnter={() => onCursorChange('Cita', 'action')}
            onMouseLeave={() => onCursorChange('', 'default')}
            className="px-5 py-2.5 text-xs tracking-wider uppercase font-medium text-[#FAF7F2] bg-[#2F3A2B] rounded-full hover:bg-[#1E261B] transition-all hover:shadow-md whitespace-nowrap shrink-0 cursor-pointer"
          >
            Solicitar Visita Privada
          </button>
        </div>

      </div>
    </header>
  );
};
