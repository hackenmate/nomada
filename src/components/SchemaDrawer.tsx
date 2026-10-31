import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, Table, Code2, Copy, Check, RefreshCw } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, dataService } from '../lib/supabase-client';
import { Agent, Property, PropertyImage, ViewingInquiry } from '../types/database';

interface SchemaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaDrawer: React.FC<SchemaDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'inquiries'>('tables');
  const [copied, setCopied] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [inquiries, setInquiries] = useState<ViewingInquiry[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const [a, p, img, inq] = await Promise.all([
      dataService.getAgents(),
      dataService.getProperties(),
      dataService.getPropertyImages(),
      dataService.getInquiries()
    ]);
    setAgents(a);
    setProperties(p);
    setImages(img);
    setInquiries(inq);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-[#14110F]/60 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-[#FAF7F2] h-full shadow-2xl border-l border-[#2F3A2B]/20 flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2F3A2B]/10 flex items-center justify-between bg-[#F4EFE6]">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#2F3A2B]" />
              <div>
                <h3 className="font-serif text-lg font-medium text-[#14110F]">
                  Supabase Database Explorer
                </h3>
                <p className="text-xs text-[#14110F]/60">
                  Esquema relacional: agents, properties, property_images
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2F3A2B]/10 text-[#14110F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-[#2F3A2B]/10 bg-[#FAF7F2]">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'tables'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2]'
                  : 'text-[#14110F]/70 hover:bg-[#2F3A2B]/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" />
                <span>Registros ({agents.length} agentes, {properties.length} residencias)</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2]'
                  : 'text-[#14110F]/70 hover:bg-[#2F3A2B]/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>DDL SQL (Supabase)</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#2F3A2B] text-[#FAF7F2]'
                  : 'text-[#14110F]/70 hover:bg-[#2F3A2B]/5'
              }`}
            >
              <span>Visitas ({inquiries.length})</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'tables' && (
              <div className="space-y-6">
                
                {/* Table: agents */}
                <div className="border border-[#2F3A2B]/15 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="px-4 py-3 bg-[#F4EFE6] border-b border-[#2F3A2B]/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#2F3A2B]">
                      public.agents ({agents.length} filas)
                    </span>
                    <span className="text-[11px] text-[#14110F]/50">PRIMARY KEY (id)</span>
                  </div>
                  <div className="divide-y divide-[#2F3A2B]/10 text-xs">
                    {agents.map((agent) => (
                      <div key={agent.id} className="p-3.5 space-y-1 hover:bg-[#FAF7F2]">
                        <div className="flex items-center justify-between font-mono">
                          <strong className="text-[#14110F]">{agent.name}</strong>
                          <span className="text-[11px] text-[#C2623F]">{agent.slug}</span>
                        </div>
                        <p className="text-[#14110F]/70 text-[11px]">{agent.role} · {agent.territory}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table: properties */}
                <div className="border border-[#2F3A2B]/15 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="px-4 py-3 bg-[#F4EFE6] border-b border-[#2F3A2B]/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#2F3A2B]">
                      public.properties ({properties.length} filas)
                    </span>
                    <span className="text-[11px] text-[#14110F]/50">FK: agent_id → agents.id</span>
                  </div>
                  <div className="divide-y divide-[#2F3A2B]/10 text-xs">
                    {properties.map((prop) => (
                      <div key={prop.id} className="p-3.5 space-y-1 hover:bg-[#FAF7F2]">
                        <div className="flex items-center justify-between font-mono">
                          <strong className="text-[#14110F]">{prop.title}</strong>
                          <span className="text-[#2F3A2B] font-semibold tabular-nums">{prop.price_formatted}</span>
                        </div>
                        <p className="text-[#14110F]/70 text-[11px]">
                          {prop.location} · {prop.area_sqm} m² · {prop.architectural_style}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table: property_images */}
                <div className="border border-[#2F3A2B]/15 rounded-xl overflow-hidden bg-white shadow-xs">
                  <div className="px-4 py-3 bg-[#F4EFE6] border-b border-[#2F3A2B]/10 flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#2F3A2B]">
                      public.property_images ({images.length} fotos registradas)
                    </span>
                    <span className="text-[11px] text-[#14110F]/50">FK: property_id → properties.id</span>
                  </div>
                  <div className="p-3 text-xs text-[#14110F]/70">
                    Todas las imágenes están vinculadas con claves foráneas e integridad referencial en cascada.
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'sql' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#14110F]/60">
                    Esquema SQL listo para ejecutar en el Editor SQL de Supabase:
                  </span>
                  <button
                    onClick={handleCopySQL}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2F3A2B] text-[#FAF7F2] rounded-lg hover:bg-[#1E261B] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#14110F] text-[#FAF7F2] text-xs font-mono overflow-x-auto leading-relaxed max-h-[460px]">
                  {SUPABASE_SQL_SCHEMA.trim()}
                </pre>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-[#14110F]/50 text-xs">
                    No hay solicitudes de visita registradas aún. Pruebe enviar una solicitud en cualquier ficha de residencia.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div key={inq.id} className="p-4 rounded-xl bg-white border border-[#2F3A2B]/15 shadow-xs space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#14110F]">{inq.client_name}</strong>
                        <span className="font-mono text-[11px] text-[#2F3A2B]">{inq.preferred_date}</span>
                      </div>
                      <p className="text-[#14110F]/70">{inq.client_email} · {inq.client_phone}</p>
                      {inq.notes && <p className="text-[#C2623F] italic font-serif text-[11px]">{inq.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-[#2F3A2B]/10 bg-[#F4EFE6] text-center text-xs text-[#14110F]/60">
            Base de datos relacional para Nómada Propiedades · Supabase PostgreSQL
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
