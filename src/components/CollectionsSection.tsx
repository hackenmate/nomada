import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowUpRight, Compass, SlidersHorizontal } from 'lucide-react';
import { Agent, Property } from '../types/database';

interface CollectionsSectionProps {
  properties: Property[];
  agents: Agent[];
  onSelectProperty: (property: Property) => void;
  onSelectAgent: (agent: Agent) => void;
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  properties,
  agents,
  onSelectProperty,
  onSelectAgent,
  onCursorChange
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');

  const filteredProperties = selectedAgentId === 'all'
    ? properties
    : properties.filter(p => p.agent_id === selectedAgentId);

  return (
    <section id="colecciones" className="py-28 px-6 lg:px-12 bg-[#FAF7F2] relative border-t border-[#2F3A2B]/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Curatorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-[#2F3A2B]/15 pb-10">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[#2F3A2B] mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C2623F]" />
              <span>Obras & Residencias Seleccionadas</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#14110F]">
              La Colección Viva
            </h2>
          </div>

          {/* Interactive World Switcher Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F4EFE6] rounded-2xl border border-[#2F3A2B]/10">
            <button
              onClick={() => setSelectedAgentId('all')}
              className={`px-4 py-2 text-xs font-medium tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedAgentId === 'all'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-sm'
                  : 'text-[#14110F]/70 hover:text-[#14110F]'
              }`}
            >
              Todos los Mundos ({properties.length})
            </button>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`px-4 py-2 text-xs font-medium tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedAgentId === agent.id
                    ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-sm'
                    : 'text-[#14110F]/70 hover:text-[#14110F]'
                }`}
              >
                Mundo {agent.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {filteredProperties.map((prop, index) => {
            const agent = agents.find(a => a.id === prop.agent_id);

            return (
              <motion.article
                key={prop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between bg-[#F4EFE6] rounded-3xl border border-[#2F3A2B]/10 overflow-hidden hover:shadow-2xl hover:border-[#2F3A2B]/25 transition-all duration-500 cursor-pointer"
                onClick={() => onSelectProperty(prop)}
                onMouseEnter={() => onCursorChange('Explorar', 'property')}
                onMouseLeave={() => onCursorChange('', 'default')}
              >
                {/* Photo Carrier */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={prop.cover_image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Top floating pill info */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                    <span className="bg-[#14110F]/80 backdrop-blur-md text-[#FAF7F2] text-[11px] font-sans tracking-widest uppercase px-3 py-1 rounded-full">
                      {prop.architectural_style}
                    </span>
                    <span className="bg-[#FAF7F2]/90 backdrop-blur-md text-[#2F3A2B] text-xs font-mono font-medium px-3.5 py-1 rounded-full tabular-nums shadow-sm">
                      {prop.price_formatted}
                    </span>
                  </div>

                  {/* Scrim overlay on bottom of image */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#14110F]/80 via-[#14110F]/30 to-transparent flex items-end justify-between text-[#FAF7F2]">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#C2623F]" />
                      <span>{prop.location}</span>
                    </div>
                    <span className="text-[11px] font-mono tracking-wider opacity-80">
                      Construido {prop.year_built}
                    </span>
                  </div>
                </div>

                {/* Content description */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#14110F] group-hover:text-[#2F3A2B] transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-sm font-serif italic text-[#14110F]/70 mt-1">
                      {prop.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#14110F]/75 font-light leading-relaxed mt-4 line-clamp-3">
                      {prop.description}
                    </p>
                  </div>

                  {/* Materials & Agent Custodian Footer */}
                  <div className="mt-8 pt-5 border-t border-[#2F3A2B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Material indicators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#2F3A2B]/80 font-mono">
                      <span>{prop.area_sqm} m²</span>
                      <span>·</span>
                      <span>{prop.bedrooms} hab</span>
                      <span>·</span>
                      <span>{prop.materials[0]}</span>
                    </div>

                    {/* Agent preview avatar */}
                    {agent && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAgent(agent);
                        }}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={agent.avatar_url}
                          alt={agent.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#2F3A2B]/20"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-serif text-[#14110F] underline decoration-[#2F3A2B]/30 underline-offset-4">
                          Custodia: {agent.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
