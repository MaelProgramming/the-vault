import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { verifyInvitationCode } from '../services/api';

const VaultGate = () => {
  const [code, setCode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDial = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setCode(val);
    setError(null);
  };

  const triggerUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      navigate('/register');
    }, 2500); // Wait for the heavy doors to open
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setIsChecking(true);
    setError(null);
    try {
      // Backend Verification
      await verifyInvitationCode(code);
      // Valid! Store it so they can register with it later if needed?
      // For now, we just pass them to the register page.
      // E.g., localStorage.setItem('vault_invite', code);
      triggerUnlock();
    } catch (err: any) {
      setError(err.message || 'Llave Invalida');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="fixed inset-0 z-50 bg-[#0A0908] flex items-center justify-center font-serif overflow-hidden">

      {/* Background ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/10 via-[#0A0908]/90 to-[#0A0908] pointer-events-none" />

      {/* The Vault Interface */}
      <AnimatePresence>
        {!isUnlocking && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-md flex flex-col items-center p-8"
          >
            {/* Vault decorative header */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(197,160,89,0.1)]">
                  <div className="w-8 h-8 rounded-full border border-[#C5A059]/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C5A059]/80 shadow-[0_0_10px_rgba(197,160,89,1)]" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl italic text-[#C5A059] tracking-tighter shadow-black drop-shadow-2xl">
                  Acceso Restringido
                </h1>
                <p className="mt-6 text-[9px] tracking-[0.5em] uppercase text-[#C5A059]/50">
                  Introduce tu llave de invitación
                </p>
              </motion.div>
            </div>

            {/* The Input "Dial" */}
            <form onSubmit={handleSubmit} className="w-full max-w-xs relative group perspective-1000">
              <motion.div
                className={`relative bg-[#141210] p-1 rounded-sm border transition-colors duration-700 ${error ? 'border-red-900/50 shadow-[0_0_30px_rgba(127,29,29,0.2)]' : 'border-[#C5A059]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]'}`}
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent pointer-events-none" />
                <input
                  type="text"
                  value={code}
                  onChange={handleDial}
                  autoFocus
                  disabled={isChecking || isUnlocking}
                  placeholder="CÓDIGO"
                  className="w-full bg-[#0A0908] border border-[#C5A059]/10 text-center py-6 text-2xl tracking-[0.4em] text-[#EFEBE4] focus:ring-0 focus:border-[#C5A059]/50 focus:bg-[#141210] transition-all duration-700 placeholder:text-[#C5A059]/20 font-light"
                />

                {/* Decorative screws/rivets */}
                <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#C5A059]/20" />
                <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#C5A059]/20" />
                <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[#C5A059]/20" />
                <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-[#C5A059]/20" />
              </motion.div>

              <button
                type="submit"
                disabled={isChecking || isUnlocking || !code}
                className="w-full mt-10 py-4 text-[9px] tracking-[0.5em] uppercase text-[#C5A059]/60 hover:text-[#C5A059] border border-transparent hover:border-[#C5A059]/30 transition-all duration-700 hover:bg-[#C5A059]/5 hover:shadow-[0_0_20px_rgba(197,160,89,0.1)] disabled:opacity-50"
              >
                {isChecking ? 'Verificando...' : 'Desbloquear'}
              </button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: error ? 1 : 0 }}
              className="absolute bottom-0 text-[10px] tracking-widest text-red-800/80 uppercase mt-8"
            >
              {error || 'Llave Invalida'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Opening Doors Animation */}
      <AnimatePresence>
        {isUnlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Left Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ delay: 0.5, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#0A0908] border-r border-[#C5A059]/20 shadow-[20px_0_50px_rgba(0,0,0,0.9)] z-20 flex items-center justify-end overflow-hidden"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 md:w-8 h-32 md:h-64 bg-gradient-to-r from-transparent to-[#141210] border-r border-[#C5A059]/30 rounded-l-full" />
            </motion.div>

            {/* Right Door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ delay: 0.5, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#0A0908] border-l border-[#C5A059]/20 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] z-20 flex items-center justify-start overflow-hidden"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 md:w-8 h-32 md:h-64 bg-gradient-to-l from-transparent to-[#141210] border-l border-[#C5A059]/30 rounded-r-full" />
            </motion.div>

            {/* Glowing inner core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute z-10 w-64 h-64 bg-[#C5A059] rounded-full blur-[100px] opacity-20"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default VaultGate;
