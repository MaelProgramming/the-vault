import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import { type Props } from '../types/Props';

export const SwipeCard = ({ user, onSwipe }: Props) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
      }}
      className="absolute w-80 h-[450px] bg-[#F5F5DC] border-2 border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <img src={user.avatar_url} alt={user.name} className="w-full h-2/3 object-cover border-b border-[#D4AF37]" />
      <div className="p-4 text-black">
        <h2 className="text-2xl font-serif font-bold uppercase tracking-widest">{user.name}</h2>
        <p className="font-serif italic text-sm mt-2 opacity-80">{user.bio || "Membre d'élite du Vault."}</p>
      </div>
    </motion.div>
  );
};