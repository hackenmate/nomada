import React from 'react';
import { Database, ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { useSmoothScroll } from './SmoothScrollProvider';

interface FooterProps {
  onOpenSchema: () => void;
  onOpenConsultation: () => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSchema,
  onOpenConsultation,
  onCursorChange
}) => {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="bg-[#14110F] text-[#FAF7F2] py-20 px-6 lg:px-12 border-t border-[#FAF7F2]/10 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Top block: Brand & Invitation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#FAF7F2]/10">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#FAF7F2]">
              NOMADA GROUP
            </h2>
            <div className="text-xs font-mono uppercase tracking-widest text-[#C2623F]">
              Agentes Independientes Internacional
            </div>
            <p className="text-sm text-[#FAF7F2]/60 font-light max-w-md leading-relaxed">
              Curaduría inmobiliaria internacional especializada en fincas bioclimáticas, santuarios de montaña
              y cafetales de altura en La Convención, Cusco, Perú.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-lg-end gap-6 lg:text-right">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#C2623F] font-semibold">
                Sede Territorial · La Convención
              </span>
              <p className="text-xs font-mono text-[#FAF7F2]/80">
                Mariano Otazu Marín · <a href="tel:+51950155945" className="hover:text-white underline">+51 950 155 945</a>
              </p>
              <p className="text-xs font-mono text-[#FAF7F2]/60">
                Valle de Quillabamba · Cusco · Lima · Madrid · París
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/51950155945?text=Hola%20Mariano%20Otazu%20Mar%C3%ADn,%20me%20pongo%20en%20contacto%20desde%20NOMADA%20GROUP%20para%20solicitar%20informaci%C3%B3n%20y%20asesor%C3%ADa%20personalizada%20sobre%20propiedades%20y%20fincas%20en%20La%20Convenci%C3%B3n,%20Cusco."
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => onCursorChange('WhatsApp', 'action')}
                onMouseLeave={() => onCursorChange('', 'default')}
                className="px-5 py-3 text-xs tracking-wider uppercase font-medium bg-[#2E7D32] hover:bg-[#1B5E20] text-[#FAF7F2] rounded-full transition-all cursor-pointer shadow-lg inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Agente</span>
              </a>

              <button
                onClick={onOpenConsultation}
                onMouseEnter={() => onCursorChange('Cita', 'action')}
                onMouseLeave={() => onCursorChange('', 'default')}
                className="px-6 py-3 text-xs tracking-widest uppercase font-medium bg-[#FAF7F2] text-[#14110F] rounded-full hover:bg-[#F4EFE6] transition-all cursor-pointer shadow-lg whitespace-nowrap"
              >
                Iniciar Conversación
              </button>
            </div>
          </div>
        </div>

        {/* Bottom link strip */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#FAF7F2]/50 font-light">
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('#agentes')}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Agentes Internacionales
            </button>
            <button
              onClick={() => scrollTo('#territorio')}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              La Convención
            </button>
            <button
              onClick={() => scrollTo('#mapas-lotes')}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer text-[#C2623F] font-medium"
            >
              Mapas Izcuchaca & Huayopata
            </button>
            <button
              onClick={() => scrollTo('#colecciones')}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Colecciones
            </button>
            <button
              onClick={() => scrollTo('#manifiesto')}
              className="hover:text-[#FAF7F2] transition-colors cursor-pointer"
            >
              Manifiesto
            </button>
            <button
              onClick={onOpenSchema}
              className="hover:text-[#FAF7F2] transition-colors inline-flex items-center gap-1.5 cursor-pointer text-[#C2623F]"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono tabular-nums">
              © {new Date().getFullYear()} NOMADA GROUP International S.A.
            </span>
            <span aria-hidden="true">·</span>
            <span>Todos los derechos reservados</span>

            <button
              onClick={() => scrollTo('#hero')}
              title="Volver al inicio"
              className="p-2 rounded-full border border-[#FAF7F2]/20 hover:border-[#FAF7F2] text-[#FAF7F2] transition-colors cursor-pointer ml-4"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
