import React, { useState, useEffect } from "react";
import IdentityCard from './IdentityCard';
import { AnimatePresence, motion } from 'framer-motion';
import { type GridProps, type M } from "../types/Props";
import { swipeMember } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Stack: React.FC<GridProps> = ({ members, className = "" }) => {
    // On gère la pile localement pour pouvoir "popper" les cartes
    const [stack, setStack] = useState(members);
    const [matchMember, setMatchMember] = useState<M | null>(null);
    const navigate = useNavigate();

    // On synchronise si les props changent (ex: refresh)
    useEffect(() => {
        setStack(members);
    }, [members]);

    const handleSwipeSuccess = (id: string, direction: 'left' | 'right') => {
        // Enregistrement asynchrone du Swipe vers Supabase !
        const isLike = direction === 'right';
        const swipedMember = stack.find(m => m.id === id);

        swipeMember(id, isLike)
            .then(res => {
                if (res.match && swipedMember) {
                    setMatchMember(swipedMember as M);
                }
            })
            .catch(err => console.error("Erreur serveur lors du swipe:", err));

        // On retire la carte de la pile locale immédiatement
        setStack(prev => prev.filter(m => m.id !== id));
    };

    if (!stack.length) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="font-serif text-[#D4AF37] italic">Le cercle est complet. Revenez plus tard.</p>
            </div>
        );
    }

    return (
        <div className={`relative flex justify-center items-center h-[500px] w-full ${className}`}>
            
            {/* MATCH OVERLAY */}
            <AnimatePresence>
                {matchMember && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#141210]/95 backdrop-blur-md px-4"
                    >
                        <motion.h2 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-serif text-5xl md:text-7xl italic text-[#C5A059] mb-4 text-center tracking-tighter"
                        >
                            Alianza Forjada
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-12 text-center"
                        >
                            Tus intereses se alinean con los de {matchMember.full_name || matchMember.name}
                        </motion.p>
                        
                        <motion.img 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            src={matchMember.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(matchMember.full_name || matchMember.name)}&background=F5F5DC&color=C5A059`} 
                            alt="Match" 
                            className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border border-[#C5A059]/50 shadow-[0_0_50px_rgba(197,160,89,0.2)] mb-12"
                        />
                        
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col gap-4 w-full max-w-sm"
                        >
                            <button 
                                onClick={() => navigate('/conversations')} 
                                className="w-full bg-[#1A1816] border border-[#C5A059]/30 py-5 text-[#C5A059] text-[10px] tracking-[0.4em] uppercase hover:bg-[#C5A059] hover:text-[#141210] transition-colors"
                            >
                                Iniciar Correspondencia
                            </button>
                            <button 
                                onClick={() => setMatchMember(null)} 
                                className="w-full bg-transparent border-none py-5 text-[#C5A059]/60 text-[9px] tracking-[0.3em] uppercase hover:text-[#C5A059] transition-colors"
                            >
                                Continuar Explorando
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {stack.map((member, index) => (
                    <IdentityCard
                        key={member.id}
                        id={member.id}
                        name={member.full_name}
                        major={member.major}
                        year={member.graduation_year}
                        avatar_url={member.avatar_url}
                        bio={member.bio}
                        gender={member.gender}
                        is_verified={member.is_verified}
                        // Seule la carte du dessus (la dernière du map) est draggable
                        isTopCard={index === stack.length - 1}
                        onSwiped={(direction) => handleSwipeSuccess(member.id, direction)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Stack;