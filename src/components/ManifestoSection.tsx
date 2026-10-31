import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Compass, Sparkles } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section id="manifiesto" className="py-28 px-6 lg:px-12 bg-[#F4EFE6] relative overflow-hidden">
      
      {/* Decorative subtle background geometry */}
      <div className="max-w-5xl mx-auto">
        
        {/* Editorial Subtitle */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C2623F] font-semibold mb-6">
          <Compass className="w-4 h-4" />
          <span>Declaración de Principios</span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#14110F] font-light leading-[1.15] mb-12 max-w-4xl">
          Creemos que habitar es un acto <span className="italic font-normal text-[#2F3A2B]">sagrado de arraigo,</span> no una transacción de metros cuadrados.
        </h2>

        {/* Wide Centerpiece Pull Quote with hairlines */}
        <div className="py-10 border-y border-[#2F3A2B]/15 my-14">
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#2F3A2B] leading-relaxed text-balance">
            &ldquo;Una finca en La Convención no es un activo especulativo; es el receptáculo donde la selva alta, los nevados del Cusco y la memoria ancestral recuperan su peso original.&rdquo;
          </blockquote>
          <div className="mt-4 text-xs font-mono tracking-widest uppercase text-[#14110F]/50">
            — Cuaderno de Curaduría NOMADA GROUP · Quillabamba, Cusco 2026
          </div>
        </div>

        {/* Three Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pt-4">
          
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C2623F] tabular-nums">
              Principio 01
            </span>
            <h3 className="text-xl font-serif text-[#14110F]">
              La Orografía Andina Antes que el Plano
            </h3>
            <p className="text-sm text-[#14110F]/75 font-light leading-relaxed">
              La arquitectura debe someterse a la pendiente, los vientos del cañón y el ciclo
              de lluvias. En La Convención, cada obra nace de los andenes y las corrientes térmicas
              que descienden de los glaciares hacia el río Urubamba.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C2623F] tabular-nums">
              Principio 02
            </span>
            <h3 className="text-xl font-serif text-[#14110F]">
              Honestidad Material Andino-Amazónica
            </h3>
            <p className="text-sm text-[#14110F]/75 font-light leading-relaxed">
              Veneramos la piedra andina tallada, el cedro tropical recuperado, el bambú estructural y
              la teja cocida artesanal. Materiales nobles que patinan con dignidad bajo la niebla
              y el sol constante de la ceja de selva.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C2623F] tabular-nums">
              Principio 03
            </span>
            <h3 className="text-xl font-serif text-[#14110F]">
              Agentes Independientes Internacionales
            </h3>
            <p className="text-sm text-[#14110F]/75 font-light leading-relaxed">
              Nuestros custodios operan con estándares globales y conocimiento íntimo del valle.
              Conocen a los agricultores de café de especialidad, la historia de cada quebrada y
              aseguran transacciones de estricta confidencialidad para compradores internacionales.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
