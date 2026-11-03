import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass, Mountain, Coffee, Droplets } from 'lucide-react';
import { IMAGES } from '../lib/images';

interface TerritoryShowcaseProps {
  onCursorChange: (text: string, variant: 'default' | 'agent' | 'property' | 'action') => void;
}

export const TerritoryShowcase: React.FC<TerritoryShowcaseProps> = ({ onCursorChange }) => {
  const [activeZone, setActiveZone] = useState<number>(0);

  const zones = [
    {
      title: 'Quillabamba · Valle Central',
      altTitle: 'La Ciudad del Eterno Verano (1.050 m.s.n.m.)',
      image: IMAGES.villaQuillabamba,
      tagline: 'Fincas de café de especialidad, frutales exóticos y arquitectura bioclimática de cedro y piedra.',
      description: 'Capital de la provincia de La Convención. Su microclima subtropical cálido permite una vida al aire libre continua, con brisas que descienden de los nevados y alimentan los cafetales orgánicos más premiados del Perú.',
      stats: ['1.050 m.s.n.m.', 'Café Geisha & Cacao Chuncho', '26°C Promedio Anual']
    },
    {
      title: 'Cañón del Urubamba & Santa Teresa',
      altTitle: 'Ceja de Selva Alta & Aguas Termales',
      image: IMAGES.heroLaConvencion,
      tagline: 'Gargantas fluviales monumentales, andenes agrícolas incas y manantiales termomedicinales.',
      description: 'Donde el río Urubamba esculpe cañones vertiginosos antes de abrirse hacia la llanura amazónica. Fincas suspendidas sobre las colinas con vistas de 360 grados a la cordillera y acceso a los baños termales de Cocalmayo.',
      stats: ['1.550 m.s.n.m.', 'Baños Termales Cocalmayo', 'Ruta Salkantay']
    },
    {
      title: 'Vilcabamba · Cordillera Oriental',
      altTitle: 'El Último Bastión Incaico',
      image: IMAGES.santuarioVilcabamba,
      tagline: 'Bosques nubosos impenetrables, orquídeas silvestres y aislamiento aristocrático absoluto.',
      description: 'Cuna de la resistencia incaica. Un territorio donde la niebla matinal envuelve mesetas elevadas y quebradas secretas. Retiros arquitectónicos para quienes buscan privacidad total en comunión con la naturaleza virgen.',
      stats: ['2.200 m.s.n.m.', 'Ciudadelas Ocultas', 'Bosque de Niebla & Orquídeas']
    },
    {
      title: 'Terrazas & Quebradas de Altura',
      altTitle: 'Geografía Sagrada de La Convención',
      image: IMAGES.landscapeMist,
      tagline: 'Mosaico de andenes prehispánicos y vegetación tropical de montaña.',
      description: 'La provincia más extensa del departamento del Cusco es también su secreto arquitectónico mejor guardado. Un ecosistema que combina la majestuosidad andina con la exuberancia de la selva virgen.',
      stats: ['30.000 km² de Territorio', 'Biodiversidad Endémica', 'Agua de Glaciar']
    }
  ];

  return (
    <section id="territorio" className="py-28 px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#2F3A2B]/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-[#2F3A2B]/15 pb-10">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[#C2623F] mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Geografía & Entorno · Cusco, Perú</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#14110F] tracking-tight">
              La Convención, Cusco
              <span className="block text-2xl sm:text-3xl font-light italic text-[#2F3A2B] mt-2">
                Donde los Andes se rinden a la Amazonía
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#14110F]/70 font-light leading-relaxed">
            Fotografías exclusivas de nuestro territorio en el corazón del Perú.
            Un enclave donde NOMADA GROUP custodia fincas y retiros inaccesibles para el turismo convencional.
          </p>
        </div>

        {/* Territory Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {zones.map((zone, idx) => (
            <button
              key={zone.title}
              onClick={() => setActiveZone(idx)}
              onMouseEnter={() => onCursorChange('Ver Zona', 'action')}
              onMouseLeave={() => onCursorChange('', 'default')}
              className={`px-4 py-2.5 rounded-full text-xs font-medium tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeZone === idx
                  ? 'bg-[#2F3A2B] text-[#FAF7F2] shadow-md'
                  : 'bg-[#F4EFE6] text-[#14110F]/70 hover:text-[#14110F] hover:bg-[#EAE3D6]'
              }`}
            >
              {zone.title.split('·')[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Zone Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-[#F4EFE6] rounded-3xl p-6 sm:p-10 border border-[#2F3A2B]/15 overflow-hidden shadow-xl">
          
          {/* Main Visual Photo */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-lg border border-[#2F3A2B]/10 group">
              <img
                src={zones[activeZone].image}
                alt={zones[activeZone].title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#14110F]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[#FAF7F2] text-xs font-mono">
                {zones[activeZone].altTitle}
              </div>
            </div>

            {/* Thumbnail Row of all 4 places */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {zones.map((z, i) => (
                <button
                  key={z.title}
                  onClick={() => setActiveZone(i)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeZone === i ? 'border-[#C2623F] scale-102 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={z.image} alt={z.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-4 lg:pt-0">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#C2623F] font-semibold mb-2">
                Provincia de La Convención · Cusco
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#14110F]">
                {zones[activeZone].title}
              </h3>
              <p className="text-xs font-serif italic text-[#2F3A2B] mt-1 text-base">
                {zones[activeZone].tagline}
              </p>
              <p className="text-sm text-[#14110F]/80 font-light leading-relaxed mt-4">
                {zones[activeZone].description}
              </p>
            </div>

            {/* Micro Highlights */}
            <div className="space-y-4 pt-4 border-t border-[#2F3A2B]/10">
              <div className="text-[11px] uppercase tracking-widest text-[#14110F]/50">
                Parámetros Geográficos
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {zones[activeZone].stats.map((stat, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-white/70 border border-[#2F3A2B]/10">
                    <span className="font-mono text-[#2F3A2B] font-medium block">{stat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Territory Quote */}
            <div className="p-4 rounded-xl bg-[#2F3A2B]/5 border border-[#2F3A2B]/10 text-xs text-[#2F3A2B] font-serif italic">
              &ldquo;En La Convención, el lujo no se mide en mármoles importados, sino en el aroma del azahar de café y el sonido del río bajando del nevado.&rdquo;
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
