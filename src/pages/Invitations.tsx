import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getMyInvitations, generateInvitation } from '../services/api';

interface Invite {
  id: string;
  code: string;
  status: 'active' | 'used';
  created_at?: string;
}

const Invitations = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const data = await getMyInvitations();
        setInvites(data);
      } catch (err) {
        console.error("Error cargando invitaciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const newInvite = await generateInvitation();
      setInvites(prev => [newInvite, ...prev]);
    } catch (err: any) {
      alert(err.message || "Error forjando el sello");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    const text = `Has sido seleccionado. Presenta este sello en La Bóveda para solicitar tu admisión: ${code}\n\nAcceso: https://thevault.elite/invite`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <main className="min-h-screen bg-[#141210] text-[#EFEBE4] flex flex-col font-serif pt-12 pb-32 px-4 md:px-10 overflow-hidden relative">
      <Header className="mb-12 text-center relative z-10" titleContent="Tus Sellos" textContent="El Privilegio de Invitar" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-[#C5A059] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-[#C5A059] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center relative z-10">

        {/* Main Vault Generation Area */}
        <div className="w-full relative mb-16 p-10 border border-[#C5A059]/20 bg-[#1A1816]/80 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <h2 className="text-2xl md:text-3xl italic text-[#C5A059] mb-4 text-center">Forjar Nueva Llave</h2>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#EFEBE4]/60 mb-10 text-center max-w-lg leading-relaxed">
            Solo los miembros consagrados poseen el derecho de forjar sellos de entrada. Usa este privilegio con sabiduría.
          </p>

          <button
            onClick={handleGenerateCode}
            disabled={isGenerating || invites.length >= 3 || loading}
            className="relative overflow-hidden border border-[#C5A059]/50 bg-transparent px-10 py-5 group hover:border-[#C5A059] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-[#C5A059] translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-[10px] tracking-[0.4em] uppercase text-[#C5A059] group-hover:text-[#141210] font-bold transition-colors duration-500">
              {isGenerating ? 'Forjando Sello...' : invites.length >= 3 ? 'Límite Alcanzado (3/3)' : 'Extraer del Cofre'}
            </span>

            {/* Small glowing dot when forging */}
            {isGenerating && (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
              />
            )}
          </button>
        </div>

        {/* Existing Invitations List */}
        <div className="w-full">
          <h3 className="text-xl italic text-[#C5A059]/80 mb-8 border-b border-[#C5A059]/20 pb-4">Sellos Activos</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {loading && (
                <div className="col-span-full py-10 text-center text-[#EFEBE4]/40 text-[11px] tracking-widest uppercase italic">
                  Abriendo el cofre...
                </div>
              )}
              
              {!loading && invites.length === 0 && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-10 text-center text-[#EFEBE4]/40 text-[11px] tracking-widest uppercase italic"
                >
                  El cofre está vacío.
                </motion.div>
              )}

              {invites.map((invite, index) => (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="relative group perspective-1000"
                >
                  {/* The Physical Card Look */}
                  <div className="bg-[#141210] border border-[#C5A059]/30 p-8 shadow-[inset_0_0_20px_rgba(197,160,89,0.05),_0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-700 hover:border-[#C5A059]/60 hover:shadow-[0_10px_40px_rgba(197,160,89,0.1)]">

                    {/* Wax Seal Design */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-[#8B0000] rounded-full opacity-80 shadow-[0_4px_10px_rgba(0,0,0,0.5),_inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center mix-blend-multiply">
                      <span className="text-[#141210] font-serif text-sm italic font-bold">V</span>
                    </div>
                    {/* Golden reflection highlight */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-t border-l border-white/20 pointer-events-none" />

                    <div className="mb-8">
                      <p className="text-[8px] tracking-[0.4em] text-[#C5A059]/50 uppercase mb-2">Código de Ingreso</p>
                      <p className="text-xl tracking-[0.3em] font-light text-[#EFEBE4] drop-shadow-md">{invite.code}</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-[#C5A059]/10 pt-4">
                      <div>
                        <p className="text-[8px] tracking-[0.3em] text-[#EFEBE4]/40 uppercase mb-1">Forjado</p>
                        <p className="text-[10px] tracking-widest text-[#EFEBE4]/70">
                          {invite.created_at ? new Date(invite.created_at).toLocaleDateString() : 'HOY'}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(invite.code, invite.id)}
                        className="text-[#C5A059] text-[9px] tracking-[0.2em] uppercase hover:text-white transition-colors duration-300"
                      >
                        {copiedId === invite.id ? 'COPIADO ✓' : 'COPIAR SELLO'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer className="mt-auto opacity-50 relative z-10" textContent='The Vault - 2026' />
    </main>
  );
};

export default Invitations;
