import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { CustomCursor, CursorState } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AgentsUniverse } from './components/AgentsUniverse';
import { CollectionsSection } from './components/CollectionsSection';
import { ManifestoSection } from './components/ManifestoSection';
import { TerritoryShowcase } from './components/TerritoryShowcase';
import { AgentWorldModal } from './components/AgentWorldModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SchemaDrawer } from './components/SchemaDrawer';
import { PrivateConsultationModal } from './components/PrivateConsultationModal';
import { Footer } from './components/Footer';
import { dataService } from './lib/supabase-client';
import { ambientSound } from './lib/audio';
import { Agent, Property } from './types/database';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationAgent, setConsultationAgent] = useState<Agent | null>(null);
  const [isImmersive, setIsImmersive] = useState(false);
  const [showImmersiveToast, setShowImmersiveToast] = useState(false);

  // Web Audio API: Fade-in organic ambient textures on Immersive Mode, fade-out smoothly on exit
  useEffect(() => {
    if (isImmersive) {
      ambientSound.start(2.2);
    } else {
      ambientSound.stop(1.6);
    }
  }, [isImmersive]);

  // Custom Cursor state
  const [cursorState, setCursorState] = useState<CursorState>({
    text: '',
    variant: 'default',
  });

  const handleCursorChange = (text: string, variant: CursorState['variant']) => {
    setCursorState({ text, variant });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [allAgents, allProps] = await Promise.all([
        dataService.getAgents(),
        dataService.getProperties(),
      ]);
      setAgents(allAgents);
      setProperties(allProps);
    };
    fetchData();
  }, []);

  // Keyboard shortcut: ESC to exit immersive mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isImmersive) {
          setIsImmersive(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImmersive]);

  const handleToggleImmersive = () => {
    const nextState = !isImmersive;
    setIsImmersive(nextState);
    if (nextState) {
      setShowImmersiveToast(true);
      setTimeout(() => setShowImmersiveToast(false), 3800);
    }
  };

  const handleOpenConsultationWithAgent = (agent: Agent) => {
    setConsultationAgent(agent);
    setIsConsultationOpen(true);
  };

  const handleOpenGeneralConsultation = () => {
    setConsultationAgent(null);
    setIsConsultationOpen(true);
  };

  const handleExploreAgents = () => {
    const agentsEl = document.querySelector('#agentes');
    agentsEl?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find agent for currently selected property modal
  const propertyAgent = selectedProperty
    ? agents.find((a) => a.id === selectedProperty.agent_id) || null
    : null;

  return (
    <SmoothScrollProvider>
      <div className={`relative min-h-screen bg-[#F4EFE6] text-[#14110F] film-grain selection:bg-[#C2623F] selection:text-[#FAF7F2] transition-colors duration-700 ${isImmersive ? 'cursor-none select-none' : ''}`}>
        
        {/* Custom Spring Cursor (cinematically expanded in immersive mode) */}
        <CustomCursor cursorState={cursorState} isImmersive={isImmersive} />

        {/* Global Navigation Top Bar / Minimal Immersive Capsule */}
        <Header
          isImmersive={isImmersive}
          onToggleImmersive={handleToggleImmersive}
          onOpenConsultation={handleOpenGeneralConsultation}
          onOpenSchema={() => setIsSchemaOpen(true)}
          onCursorChange={handleCursorChange}
        />

        {/* Subtle temporary toast upon activating immersive mode */}
        <AnimatePresence>
          {showImmersiveToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-8 inset-x-0 mx-auto w-fit z-50 pointer-events-none px-5 py-2.5 rounded-full bg-[#14110F]/90 text-[#FAF7F2] text-xs font-serif tracking-wide border border-[#FAF7F2]/15 shadow-2xl backdrop-blur-md flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2623F] animate-pulse" />
              <span>Modo Inmersivo activado · Presione ESC en cualquier momento para salir</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. HERO with word-by-word reveal & morphing blobs */}
        <Hero
          isImmersive={isImmersive}
          onCursorChange={handleCursorChange}
          onExploreAgents={handleExploreAgents}
        />

        {/* 2. AGENTS & THEIR WORLDS (Protagonist experience) */}
        <AgentsUniverse
          agents={agents}
          properties={properties}
          onSelectAgent={(agent) => setSelectedAgent(agent)}
          onSelectProperty={(property) => setSelectedProperty(property)}
          onCursorChange={handleCursorChange}
        />

        {/* 3. TERRITORIO: LA CONVENCIÓN, CUSCO, PERÚ (Fotografías & Geografía) */}
        <TerritoryShowcase
          onCursorChange={handleCursorChange}
        />

        {/* 4. CURATED ARCHITECTURAL COLLECTIONS */}
        <CollectionsSection
          properties={properties}
          agents={agents}
          onSelectProperty={(property) => setSelectedProperty(property)}
          onSelectAgent={(agent) => setSelectedAgent(agent)}
          onCursorChange={handleCursorChange}
        />

        {/* 4. PHILOSOPHICAL MANIFESTO */}
        <ManifestoSection />

        {/* 5. FOOTER (Hidden during Immersive Mode for pure uninterrupted scroll) */}
        <AnimatePresence>
          {!isImmersive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Footer
                onOpenSchema={() => setIsSchemaOpen(true)}
                onOpenConsultation={handleOpenGeneralConsultation}
                onCursorChange={handleCursorChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Modals & Drawers */}
        <AgentWorldModal
          agent={selectedAgent}
          properties={properties}
          onClose={() => setSelectedAgent(null)}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onOpenConsultationWithAgent={handleOpenConsultationWithAgent}
          onCursorChange={handleCursorChange}
        />

        <PropertyDetailModal
          property={selectedProperty}
          agent={propertyAgent}
          onClose={() => setSelectedProperty(null)}
          onCursorChange={handleCursorChange}
        />

        <SchemaDrawer
          isOpen={isSchemaOpen}
          onClose={() => setIsSchemaOpen(false)}
        />

        <PrivateConsultationModal
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
          agents={agents}
          initialAgent={consultationAgent}
        />

      </div>
    </SmoothScrollProvider>
  );
}
