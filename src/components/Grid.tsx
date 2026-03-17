import React, { useState, useEffect } from "react";
import IdentityCard from './IdentityCard';
import { AnimatePresence } from 'framer-motion';
import { type GridProps } from "../types/Props";

const Stack: React.FC<GridProps> = ({ members, className = "" }) => {
    // On gère la pile localement pour pouvoir "popper" les cartes
    const [stack, setStack] = useState(members);

    // On synchronise si les props changent (ex: refresh)
    useEffect(() => {
        setStack(members);
    }, [members]);

    const handleSwipeSuccess = (id: string) => {
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
                        onSwiped={() => handleSwipeSuccess(member.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Stack;