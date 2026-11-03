import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ArrowUpRight, Phone } from 'lucide-react';
import { IMAGES } from '../lib/images';

interface FloatingWhatsAppProps {
  onCursorChange?: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onCursorChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const agentName = 'Mariano Otazu Marín';
  const agentRole = 'Curador Director · La Convención, Cusco';
  const phoneNumber = '+51 950 155 945';
  const rawPhone = '51950155945';
  const defaultMessage = encodeURIComponent(
    'Hola Mariano Otazu Marín, me pongo en contacto desde NOMADA GROUP para solicitar información y asesoría personalizada sobre propiedades y fincas en La Convención, Cusco.'
  );
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans">
      
      {/* Expandable chat preview card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-80 sm:w-88 bg-[#FAF7F2] rounded-3xl p-5 shadow-2xl border border-[#2F3A2B]/15 text-[#14110F] overflow-hidden"
          >
            {/* Header with agent portrait and status */}
            <div className="flex items-start justify-between pb-4 border-b border-[#2F3A2B]/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={IMAGES.agentMarianoOtazu}
                    alt={agentName}
                    className="w-12 h-12 rounded-full object-cover border border-[#2F3A2B]/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#2E7D32] ring-2 ring-[#FAF7F2]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-[#14110F] leading-tight">
                    {agentName}
                  </h4>
                  <p className="text-[11px] text-[#C2623F] uppercase tracking-wider font-medium">
                    {agentRole}
                  </p>
                  <p className="text-[11px] font-mono text-[#14110F]/60">
                    {phoneNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-[#14110F]/50 hover:text-[#14110F] hover:bg-[#2F3A2B]/5 transition-colors cursor-pointer"
                aria-label="Cerrar ventana de WhatsApp"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation invitation body */}
            <div className="my-4 bg-[#F4EFE6] rounded-2xl p-3.5 text-xs text-[#14110F]/80 leading-relaxed border border-[#2F3A2B]/10">
              <p className="font-light">
                Bienvenido a <strong className="font-semibold text-[#2F3A2B]">NOMADA GROUP</strong>.
                ¿Desea conocer detalles sobre fincas en Quillabamba, Santa Teresa o el valle de Vilcabamba?
                Escríbame de forma directa y confidencial.
              </p>
              <span className="block mt-2 text-[10px] font-mono text-[#14110F]/40 text-right">
                Respuesta directa por WhatsApp
              </span>
            </div>

            {/* Direct action links */}
            <div className="space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => onCursorChange?.('WhatsApp', 'action')}
                onMouseLeave={() => onCursorChange?.('', 'default')}
                className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-[#FAF7F2] rounded-full text-xs font-medium tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir Chat con Mensaje Listo</span>
              </a>

              <a
                href={`tel:${rawPhone}`}
                onMouseEnter={() => onCursorChange?.('Llamar', 'action')}
                onMouseLeave={() => onCursorChange?.('', 'default')}
                className="w-full py-2 px-4 bg-transparent hover:bg-[#2F3A2B]/5 text-[#2F3A2B] rounded-full text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#2F3A2B]/15"
              >
                <Phone className="w-3.5 h-3.5 text-[#C2623F]" />
                <span>Llamar al {phoneNumber}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => onCursorChange?.(isOpen ? 'Cerrar' : 'WhatsApp', 'action')}
        onMouseLeave={() => onCursorChange?.('', 'default')}
        className="group flex items-center gap-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-[#FAF7F2] pl-3.5 pr-4 py-3 rounded-full shadow-2xl border border-white/20 transition-all cursor-pointer"
        aria-label="Contactar al agente por WhatsApp"
      >
        <div className="relative">
          <img
            src={IMAGES.agentMarianoOtazu}
            alt="Mariano Otazu"
            className="w-8 h-8 rounded-full object-cover border border-white/40"
            referrerPolicy="no-referrer"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4ADE80] ring-2 ring-[#2E7D32] animate-pulse" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-mono leading-none tracking-tight opacity-90">
            Mariano Otazu Marín
          </div>
          <div className="text-[10px] font-sans uppercase tracking-widest font-semibold mt-0.5 text-white/90">
            WhatsApp Agente
          </div>
        </div>

        <MessageCircle className="w-5 h-5 ml-0.5" />
      </motion.button>

    </div>
  );
};
