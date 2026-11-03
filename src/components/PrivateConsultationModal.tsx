import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { Agent } from '../types/database';
import { dataService } from '../lib/supabase-client';

interface PrivateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  initialAgent?: Agent | null;
}

export const PrivateConsultationModal: React.FC<PrivateConsultationModalProps> = ({
  isOpen,
  onClose,
  agents,
  initialAgent
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgent?.id || agents[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    try {
      await dataService.submitInquiry({
        agent_id: selectedAgentId,
        client_name: name,
        client_email: email,
        client_phone: phone,
        preferred_date: date || new Date().toISOString().split('T')[0],
        notes: notes || 'Solicitud de encuentro privado para análisis de territorio y arquitectura'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#14110F]/70 backdrop-blur-md flex justify-center items-center py-6 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative z-10 w-full max-w-xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#2F3A2B]/15 overflow-hidden p-6 sm:p-9"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#2F3A2B]/10">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#C2623F] font-semibold">
                Cita Confidencial
              </span>
              <h3 className="text-2xl font-serif text-[#14110F]">
                Solicitar Encuentro Privado
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2F3A2B]/10 text-[#14110F] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#2F3A2B] mx-auto" />
              <h4 className="text-2xl font-serif text-[#14110F]">Su Solicitud Ha Sido Recibida</h4>
              <p className="text-sm text-[#14110F]/75 max-w-md mx-auto font-light leading-relaxed">
                El custodio seleccionado revisará la disponibilidad de la propiedad y se pondrá en contacto
                por vía telefónica o correo electrónico en estricta confidencialidad.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-[#2F3A2B] text-[#FAF7F2] rounded-full cursor-pointer hover:bg-[#1E261B]"
              >
                Volver a la Experiencia
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                  Custodio de Preferencia
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                >
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} — {agent.territory}
                    </option>
                  ))}
                </select>

                {(() => {
                  const currentAgent = agents.find(a => a.id === selectedAgentId);
                  if (!currentAgent?.phone) return null;
                  return (
                    <div className="mt-2.5 flex items-center justify-between text-xs bg-[#F4EFE6] px-3.5 py-2 rounded-xl border border-[#2F3A2B]/10">
                      <span className="text-[#14110F]/70 font-mono">Tel: <strong className="text-[#2F3A2B]">{currentAgent.phone}</strong></span>
                      {currentAgent.whatsapp && (
                        <a
                          href={currentAgent.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2E7D32] text-[#FAF7F2] font-medium text-[11px] hover:bg-[#1B5E20] transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Directo</span>
                        </a>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Santiago Gómez"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="santiago@ejemplo.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                  Fecha Aproximada
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#14110F]/70 mb-1.5 font-medium">
                  Notas sobre el Proyecto o Residencia
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles sobre sus requerimientos arquitectónicos o privacidad..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#2F3A2B]/20 bg-white focus:outline-none focus:border-[#2F3A2B] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs uppercase tracking-widest font-medium bg-[#2F3A2B] text-[#FAF7F2] rounded-xl hover:bg-[#1E261B] transition-all cursor-pointer shadow-md mt-4 flex items-center justify-center gap-2"
              >
                {loading ? 'Transmitiendo...' : 'Confirmar Solicitud de Cita'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
