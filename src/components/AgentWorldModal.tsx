import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ShieldCheck, MapPin, Compass, Calendar, ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import { Agent, Property } from '../types/database';
import { handleImageError } from '../lib/images';

interface AgentWorldModalProps {
  agent: Agent | null;
  properties: Property[];
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenConsultationWithAgent: (agent: Agent) => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const AgentWorldModal: React.FC<AgentWorldModalProps> = ({
  agent,
  properties,
  onClose,
  onSelectProperty,
  onOpenConsultationWithAgent,
  onCursorChange
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!agent) return null;

  const agentProperties = properties.filter((p) => p.agent_id === agent.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#14110F]/60 backdrop-blur-md flex justify-center items-start py-8 px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          layoutId={`agent-container-${agent.id}`}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#2F3A2B]/15 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#2F3A2B]/10 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#2F3A2B] font-mono">
                Territorio Custodiado
              </span>
              <span className="text-xs text-[#14110F]/40">/</span>
              <span className="text-xs font-serif font-medium text-[#14110F]">
                {agent.territory}
              </span>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => onCursorChange('Cerrar', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="p-2 rounded-full hover:bg-[#2F3A2B]/10 text-[#14110F] transition-colors cursor-pointer"
              aria-label="Cerrar mundo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 space-y-14">
            
            {/* Hero Profile of the Agent */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#2F3A2B]/10 pb-12">
              <div className="lg:col-span-5 flex justify-center lg:justify-start">
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-[#2F3A2B]/20">
                  <img
                    src={agent.avatar_url}
                    alt={agent.name}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#14110F]/80 to-transparent text-[#FAF7F2]">
                    <div className="text-[11px] uppercase tracking-widest opacity-80">Acreditación Nómada</div>
                    <div className="text-sm font-medium">{agent.experience_years} años curando territorio</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#C2623F] font-semibold mb-2">
                    {agent.role}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#14110F]">
                    {agent.name}
                  </h2>
                </div>

                <blockquote className="text-lg sm:text-xl font-serif italic text-[#2F3A2B] leading-relaxed border-l-2 border-[#C2623F] pl-4 py-1">
                  &ldquo;{agent.philosophy}&rdquo;
                </blockquote>

                <p className="text-sm sm:text-base text-[#14110F]/80 font-light leading-relaxed">
                  {agent.manifesto_snippet}
                </p>

                {/* Specialties list */}
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#14110F]/50 mb-2">
                    Enfoque Constructivo
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agent.architectural_focus.map((focus) => (
                      <span
                        key={focus}
                        className="text-xs py-1 px-3 rounded-full bg-[#F4EFE6] text-[#2F3A2B] border border-[#2F3A2B]/10"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action consultation button & direct phone/whatsapp */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenConsultationWithAgent(agent)}
                    onMouseEnter={() => onCursorChange('Contactar', 'action')}
                    onMouseLeave={() => onCursorChange('', 'default')}
                    className="px-6 py-3 text-xs tracking-wider uppercase font-medium bg-[#2F3A2B] text-[#FAF7F2] rounded-full hover:bg-[#1E261B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Conversar en privado con {agent.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                      onMouseEnter={() => onCursorChange('Llamar', 'action')}
                      onMouseLeave={() => onCursorChange('', 'default')}
                      className="px-4 py-3 text-xs tracking-wider uppercase font-medium text-[#2F3A2B] bg-[#F4EFE6] hover:bg-[#EAE3D6] border border-[#2F3A2B]/20 rounded-full transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C2623F]" />
                      <span className="font-mono">{agent.phone}</span>
                    </a>
                  )}

                  {agent.whatsapp && (
                    <a
                      href={agent.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => onCursorChange('WhatsApp', 'action')}
                      onMouseLeave={() => onCursorChange('', 'default')}
                      className="px-4 py-3 text-xs tracking-wider uppercase font-medium text-[#FAF7F2] bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Directo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Properties Collection curated by this agent */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#C2623F] font-medium mb-1">
                    Colección Exclusiva
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#14110F]">
                    Residencias Custodiadas ({agentProperties.length})
                  </h3>
                </div>
                <p className="text-xs text-[#14110F]/60 max-w-xs">
                  Cada residencia incluye visita técnica privada y dosier histórico de construcción.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {agentProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => onSelectProperty(prop)}
                    onMouseEnter={() => onCursorChange('Ver Obra', 'property')}
                    onMouseLeave={() => onCursorChange('', 'default')}
                    className="group bg-[#F4EFE6] rounded-2xl border border-[#2F3A2B]/10 overflow-hidden hover:border-[#2F3A2B]/30 hover:shadow-xl transition-all duration-400 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={prop.cover_image}
                        alt={prop.title}
                        onError={(e) => handleImageError(e)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-[#14110F]/80 backdrop-blur-xs text-[#FAF7F2] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md">
                        {prop.architectural_style}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-[#FAF7F2]/90 text-[#14110F] text-xs font-mono font-medium px-3 py-1 rounded-md tabular-nums">
                        {prop.price_formatted}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#2F3A2B]/80 mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C2623F]" />
                          <span>{prop.location}</span>
                        </div>
                        <h4 className="text-xl font-serif text-[#14110F] group-hover:text-[#2F3A2B] transition-colors">
                          {prop.title}
                        </h4>
                        <p className="text-xs text-[#14110F]/70 mt-1 line-clamp-2">
                          {prop.tagline}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#2F3A2B]/10 flex items-center justify-between text-xs text-[#14110F]/60">
                        <div className="flex items-center gap-3 font-mono tabular-nums">
                          <span>{prop.area_sqm} m²</span>
                          <span>·</span>
                          <span>{prop.bedrooms} hab</span>
                          <span>·</span>
                          <span>{prop.bathrooms} baños</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#2F3A2B] font-medium group-hover:translate-x-1 transition-transform">
                          <span>Dosier</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
