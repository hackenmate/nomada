import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export interface CursorState {
  text: string;
  variant: 'default' | 'agent' | 'property' | 'action' | 'hidden';
}

interface CustomCursorProps {
  cursorState: CursorState;
  isImmersive?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorState, isImmersive = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth inertial spring physics
  const springConfig = isImmersive
    ? { damping: 32, stiffness: 240, mass: 0.6 } // even silkier and cinematic
    : { damping: 28, stiffness: 320, mass: 0.5 };

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible || cursorState.variant === 'hidden') {
    return null;
  }

  const isExpanded = cursorState.variant === 'agent' || cursorState.variant === 'property';
  
  // Cinematic sizing: in immersive mode, default cursor is significantly expanded and atmospheric
  const defaultSize = isImmersive ? 46 : 20;
  const size = isExpanded ? (isImmersive ? 104 : 88) : cursorState.variant === 'action' ? 52 : defaultSize;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center font-sans select-none"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Cinematic subtle aura in immersive mode */}
      {isImmersive && (
        <motion.div
          animate={{
            width: size + 24,
            height: size + 24,
            opacity: 0.25,
            scale: [1, 1.08, 1],
          }}
          transition={{
            scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
            width: { type: 'spring', damping: 25, stiffness: 200 },
            height: { type: 'spring', damping: 25, stiffness: 200 },
          }}
          className="absolute rounded-full border border-[#2F3A2B]/40 blur-xs"
        />
      )}

      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: isExpanded
            ? 'rgba(47, 58, 43, 0.94)'
            : cursorState.variant === 'action'
            ? 'rgba(194, 98, 63, 0.92)'
            : isImmersive
            ? 'rgba(47, 58, 43, 0.18)'
            : 'rgba(47, 58, 43, 0.35)',
          scale: 1,
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 240 }}
        className={`rounded-full backdrop-blur-xs flex items-center justify-center border shadow-lg text-center ${
          isImmersive && !isExpanded && cursorState.variant === 'default'
            ? 'border-[#2F3A2B]/35 shadow-xl'
            : 'border-[#FAF7F2]/40'
        }`}
      >
        {isExpanded && cursorState.text ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className={`font-medium tracking-widest uppercase text-[#FAF7F2] px-2 leading-tight ${
              isImmersive ? 'text-[12px]' : 'text-[11px]'
            }`}
          >
            {cursorState.text}
          </motion.span>
        ) : isImmersive && cursorState.variant === 'default' ? (
          <div className="w-1.5 h-1.5 rounded-full bg-[#2F3A2B]/60" />
        ) : null}
      </motion.div>
    </motion.div>
  );
};
