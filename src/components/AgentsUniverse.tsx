import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Compass, Sparkles, Phone } from 'lucide-react';
import { Agent, Property } from '../types/database';

interface AgentsUniverseProps {
  agents: Agent[];
  properties: Property[];
  onSelectAgent: (agent: Agent) => void;
  onSelectProperty: (property: Property) => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const AgentsUniverse: React.FC<AgentsUniverseProps> = ({
  agents,
  properties,
  onSelectAgent,
  onSelectProperty,
  onCursorChange,
}) => {
  return (
    <section id="agentes" className="py-28 px-6 lg:px-12 bg-[#F4EFE6] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Curatorial Section Header */}
        <div className="border-b border-[#2F3A2B]/15 pb-12 mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[#C2623F] mb-3">
              <Compass className="w-4 h-4" />
              <span>Protagonistas del Territorio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#14110F] tracking-tight">
              Cada agente es el guardián <br />
              <span className="italic font-normal text-[#2F3A2B]">de un mundo habitable.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-[#14110F]/70 font-light leading-relaxed">
            Prescinda de las listas impersonales. Aquí la arquitectura se descubre a través de
            la mirada de quien ha caminado el terreno, dialogado con los constructores y
            comprendido la orientación de la luz.
          </p>
        </div>

        {/* The 3 Protagonist Worlds Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
          {agents.map((agent, index) => {
            const agentProperties = properties.filter((p) => p.agent_id === agent.id);
            const primaryProperty = agentProperties[0];

            return (
              <motion.div
                key={agent.id}
                layoutId={`agent-container-${agent.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between bg-[#FAF7F2] rounded-3xl p-7 lg:p-8 border border-[#2F3A2B]/10 hover:border-[#2F3A2B]/30 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                onClick={() => onSelectAgent(agent)}
                onMouseEnter={() => onCursorChange('Ver', 'agent')}
                onMouseLeave={() => onCursorChange('', 'default')}
              >
                {/* Subtle top subtle territory bar */}
                <div className="relative z-10 flex items-center justify-between text-xs text-[#14110F]/60 pb-6 border-b border-[#2F3A2B]/10">
                  <span className="font-mono tabular-nums uppercase tracking-widest">
                    Mundo 0{index + 1}
                  </span>
                  <span className="truncate max-w-[190px] font-medium text-[#2F3A2B]">
                    {agent.territory}
                  </span>
                </div>

                {/* Agent Editorial Portrait & Atmosphere */}
                <div className="relative z-10 my-8 flex flex-col items-center text-center">
                  <div className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg border border-[#2F3A2B]/15 group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                    <img
                      src={agent.avatar_url}
                      alt={agent.name}
                      className="w-full h-full object-cover object-top filter contrast-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <span className="text-[11px] font-sans tracking-widest uppercase text-[#FAF7F2]">
                        Abrir Mundo
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl lg:text-3xl font-serif text-[#14110F] group-hover:text-[#2F3A2B] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider font-sans text-[#C2623F] mt-1 font-medium">
                    {agent.role}
                  </p>
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs text-[#2F3A2B] font-mono mt-2 font-medium bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#2F3A2B]/15 hover:bg-[#EAE3D6] transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#C2623F]" />
                      <span>{agent.phone}</span>
                    </a>
                  )}

                  <p className="mt-4 text-sm text-[#14110F]/75 italic font-serif px-3 line-clamp-2">
                    &ldquo;{agent.quote}&rdquo;
                  </p>
                </div>

                {/* Key Material Pillars (Zero-pill typography) */}
                <div className="relative z-10 pt-4 border-t border-[#2F3A2B]/10">
                  <div className="text-[11px] uppercase tracking-widest text-[#14110F]/50 mb-2">
                    Pilares Materiales
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#2F3A2B]">
                    {agent.architectural_focus.slice(0, 2).map((focus, i) => (
                      <React.Fragment key={focus}>
                        <span>{focus}</span>
                        {i < 1 && <span aria-hidden="true" className="opacity-40">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Curated Preview Card */}
                  {primaryProperty && (
                    <div
                      className="mt-6 p-3 rounded-2xl bg-[#F4EFE6]/70 border border-[#2F3A2B]/10 flex items-center gap-3.5 group/prop hover:bg-[#F4EFE6] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProperty(primaryProperty);
                      }}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        onCursorChange('Residencia', 'property');
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        onCursorChange('Ver', 'agent');
                      }}
                    >
                      <img
                        src={primaryProperty.cover_image}
                        alt={primaryProperty.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] tracking-widest uppercase text-[#14110F]/50 block">
                          Residencia Insigne
                        </span>
                        <div className="text-sm font-serif font-medium text-[#14110F] truncate group-hover/prop:text-[#C2623F] transition-colors">
                          {primaryProperty.title}
                        </div>
                        <div className="text-xs font-mono text-[#2F3A2B] tabular-nums">
                          {primaryProperty.price_formatted}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#14110F]/40 group-hover/prop:text-[#14110F] transition-colors shrink-0" />
                    </div>
                  )}

                  {/* Primary Trigger Button */}
                  <div className="mt-6 flex items-center justify-between pt-2">
                    <span className="text-xs font-medium tracking-wider uppercase text-[#14110F]/80 group-hover:text-[#2F3A2B]">
                      Entrar al Universo
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#2F3A2B]/5 group-hover:bg-[#2F3A2B] group-hover:text-[#FAF7F2] flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Background decorative tone */}
                <div
                  className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-10 pointer-events-none blur-2xl group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: agent.accent_color }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Curatorial Note */}
        <div className="mt-16 text-center text-xs tracking-widest uppercase text-[#14110F]/50">
          <span>Solo 3 agentes por año</span>
          <span className="mx-3">·</span>
          <span>Máximo 4 propiedades activas por curador</span>
          <span className="mx-3">·</span>
          <span>Discreción garantizada</span>
        </div>

      </div>
    </section>
  );
};
