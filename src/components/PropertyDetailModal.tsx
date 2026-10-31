import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Compass, CheckCircle2, Calendar, Phone, Mail, User, Layers, ArrowRight } from 'lucide-react';
import { Property, Agent } from '../types/database';
import { dataService } from '../lib/supabase-client';

interface PropertyDetailModalProps {
  property: Property | null;
  agent: Agent | null;
  onClose: () => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  agent,
  onClose,
  onCursorChange
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!property) return null;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    setIsSubmitting(true);
    try {
      await dataService.submitInquiry({
        property_id: property.id,
        agent_id: agent ? agent.id : property.agent_id,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        preferred_date: preferredDate || new Date().toISOString().split('T')[0],
        notes: `Interés en la residencia: ${property.title} (${property.location})`
      });
      setInquirySubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = property.gallery && property.gallery.length > 0 ? property.gallery : [property.cover_image];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#14110F]/70 backdrop-blur-md flex justify-center items-start py-6 px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#2F3A2B]/15 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header navigation bar */}
          <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#2F3A2B]/10 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#C2623F] font-mono">
                Ficha Monográfica
              </span>
              <span className="text-xs text-[#14110F]/40">·</span>
              <span className="text-sm font-serif font-medium text-[#14110F]">
                {property.title}
              </span>
            </div>

            <button
              onClick={onClose}
              onMouseEnter={() => onCursorChange('Cerrar', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className="p-2 rounded-full hover:bg-[#2F3A2B]/10 text-[#14110F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 space-y-12">
            
            {/* Cinematic Main Photography */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xl border border-[#2F3A2B]/10">
                <img
                  src={images[activeImageIndex] || property.cover_image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 bg-[#14110F]/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[#FAF7F2]">
                  <p className="text-xs uppercase tracking-wider font-sans opacity-70">Ubicación</p>
                  <p className="text-sm font-serif font-medium">{property.location}</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#FAF7F2] px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-xs uppercase tracking-wider text-[#14110F]/60">Valoración</p>
                  <p className="text-base font-mono font-medium text-[#2F3A2B] tabular-nums">{property.price_formatted}</p>
                </div>
              </div>

              {/* Gallery thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#C2623F] scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Architectural Metrics Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#2F3A2B]/10 pb-10">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#2F3A2B] mb-2 font-medium">
                  <span>{property.architectural_style}</span>
                  <span>·</span>
                  <span>Construcción {property.year_built}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif text-[#14110F]">
                  {property.title}
                </h1>
                <p className="text-base sm:text-lg text-[#14110F]/70 font-light mt-2 italic font-serif">
                  {property.tagline}
                </p>
              </div>

              <div className="lg:col-span-4 bg-[#F4EFE6] rounded-2xl p-6 border border-[#2F3A2B]/10">
                <div className="text-xs uppercase tracking-widest text-[#14110F]/60 mb-3 font-medium">
                  Parámetros Técnicos
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono tabular-nums">
                  <div>
                    <span className="text-[#14110F]/50 block">Superficie</span>
                    <span className="text-sm font-semibold text-[#14110F]">{property.area_sqm} m²</span>
                  </div>
                  <div>
                    <span className="text-[#14110F]/50 block">Dormitorios</span>
                    <span className="text-sm font-semibold text-[#14110F]">{property.bedrooms} suites</span>
                  </div>
                  <div>
                    <span className="text-[#14110F]/50 block">Baños</span>
                    <span className="text-sm font-semibold text-[#14110F]">{property.bathrooms} completos</span>
                  </div>
                  <div>
                    <span className="text-[#14110F]/50 block">Orientación</span>
                    <span className="text-sm font-semibold text-[#14110F]">{property.orientation || 'Sur'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Description & Materials */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-[#2F3A2B] font-semibold mb-3">
                    Memoria de Proyecto
                  </h3>
                  <p className="text-base text-[#14110F]/85 font-light leading-relaxed first-letter:text-4xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-2.5">
                    {property.description}
                  </p>
                </div>

                {property.architect_name && (
                  <div className="p-4 rounded-xl bg-[#F4EFE6]/80 border border-[#2F3A2B]/10 text-xs text-[#14110F]/80 flex items-center gap-3">
                    <Compass className="w-4 h-4 text-[#C2623F]" />
                    <span>Firma y Autoría: <strong className="font-serif font-medium">{property.architect_name}</strong></span>
                  </div>
                )}

                {/* Materials palette */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#14110F]/50 mb-3 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Honestidad de Materiales</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {property.materials.map((mat) => (
                      <span
                        key={mat}
                        className="text-xs py-1.5 px-3 rounded-xl bg-[#F4EFE6] text-[#2F3A2B] border border-[#2F3A2B]/15"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#14110F]/50 mb-3">
                    Elementos Singulares
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#14110F]/75">
                    {property.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C2623F]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Custodian Agent Lockup & Inquiry Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Agent Card */}
                {agent && (
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#2F3A2B]/15 shadow-sm">
                    <div className="text-[11px] uppercase tracking-widest text-[#14110F]/50 mb-3">
                      Agente Custodio
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={agent.avatar_url}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover border border-[#2F3A2B]/20"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-lg font-serif text-[#14110F]">{agent.name}</h4>
                        <p className="text-xs text-[#C2623F] font-medium">{agent.role}</p>
                        <p className="text-xs text-[#14110F]/60 mt-1 font-mono">{agent.territory}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking Form */}
                <div className="bg-[#FAF7F2] p-6 sm:p-7 rounded-2xl border border-[#2F3A2B]/20 shadow-md">
                  <h4 className="text-xl font-serif text-[#14110F] mb-1">
                    Concertar Visita Confidencial
                  </h4>
                  <p className="text-xs text-[#14110F]/70 mb-5">
                    Acceso exclusivo con el curador. Asistencia personalizada.
                  </p>

                  {inquirySubmitted ? (
                    <div className="p-5 bg-[#2F3A2B]/10 border border-[#2F3A2B]/20 rounded-xl text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-[#2F3A2B] mx-auto" />
                      <h5 className="font-serif text-[#14110F] text-base">Solicitud Registrada</h5>
                      <p className="text-xs text-[#14110F]/70">
                        {agent ? agent.name.split(' ')[0] : 'El curador'} se comunicará en un plazo máximo de 4 horas hábiles.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#14110F]/60 mb-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ej. Laura M. Ortiz"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#14110F]/60 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="contacto@ejemplo.com"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#14110F]/60 mb-1">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            required
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+34 600 000 000"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#14110F]/60 mb-1">
                          Fecha Preferida
                        </label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 text-xs uppercase tracking-widest font-medium bg-[#2F3A2B] text-[#FAF7F2] rounded-xl hover:bg-[#1E261B] transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Procesando...</span>
                        ) : (
                          <>
                            <span>Solicitar Visita Técnica</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
