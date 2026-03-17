import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { uploadAvatar } from '../services/api';
import type { ExtendedProps } from '../types/Props';
import { GoldCard } from '../shared/ui/GoldCard';
import { RankBadge } from './RankBadge';
import type { RankType } from './RankBadge';

const IdentityCard: React.FC<ExtendedProps> = ({
  id, name, major, year, avatar_url, bio, gender, isTopCard, is_verified, onSwiped
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // On initialise, mais on va surveiller les changements
  const [currentImage, setCurrentImage] = useState(avatar_url);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Détermination du rang (Fondateurs 'hardcodés', le reste basé sur is_verified)
  const isFounder = name.includes('Mael Gruand') || name.includes('Eliot'); 
  let rank: RankType = 'POSTULANT';
  if (isFounder) { rank = 'FOUNDER'; }
  else if (is_verified) { rank = 'HEIR'; }


  // --- FIX : Synchronisation de l'image quand les props changent ---
  useEffect(() => {
    setCurrentImage(avatar_url);
  }, [avatar_url]);

  // --- LOGIQUE DE SWIPE ---
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const newUrl = await uploadAvatar(file, id);
      if (newUrl) setCurrentImage(newUrl);
    } catch (err) {
      console.error("Échec de l'upload, très peu distingué.", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      if (onSwiped) onSwiped(direction);
    }
  };

  // Fallback élégant pour l'avatar
  const avatarSrc = currentImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F5F5DC&color=C5A059`;

  const cardInnerContent = (
    <div className="group w-full max-w-[350px] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <GoldCard>
        <div className="relative h-[450px] w-full overflow-hidden bg-[#F5F5F5] mb-4">
        <img
          src={avatarSrc}
          alt={name}
          className="h-full w-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-in-out scale-100 group-hover:scale-105"
          onError={(e) => {
            // Si l'image de ton serveur pète, on met l'UI Avatar
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F5F5DC&color=C5A059`;
          }}
        />
        <div className="absolute bottom-4 left-4 overflow-hidden">
          <span className="block text-[9px] tracking-[0.3em] text-white bg-black/80 px-3 py-1 uppercase transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
            {gender === 'F' ? 'Lady' : 'Gentleman'}
          </span>
        </div>
      </div>

      <div className="text-center px-2">
        <RankBadge rank={rank} className="mb-4" />
        <h2 className="font-serif text-xl tracking-[0.15em] uppercase text-black">{name}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-[10px] font-light tracking-widest text-stone-400 uppercase">{major}</p>
          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
          <p className="text-[10px] font-light tracking-widest text-stone-400 uppercase">{year}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="mt-8 w-full border border-black py-3 text-[9px] tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors duration-500 uppercase"
        >
          Acceder al perfil
        </button>
      </div>
      </GoldCard>
    </div>
  );

  return (
    <>
      {isTopCard ? (
        <motion.div
          style={{ x, rotate, opacity, position: 'absolute' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05 }}
          className="cursor-grab active:cursor-grabbing z-50"
        >
          {cardInnerContent}
        </motion.div>
      ) : (
        <div className="absolute opacity-40 scale-95 translate-y-4 pointer-events-none z-0">
          {cardInnerContent}
        </div>
      )}

      {/* MODAL SYSTEM */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative w-full max-w-3xl overflow-hidden bg-[#FDFDFD] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 border border-[#C5A059]/20">
            <div className="relative h-80 md:h-auto md:w-1/2 overflow-hidden group/img bg-stone-100">
              <img src={avatarSrc} alt={name} className="h-full w-full object-cover object-top" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
              >
                <span className="text-white text-[9px] tracking-[0.3em] uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all">
                  {isUploading ? 'Procesando...' : 'Cambiar Imagen'}
                </span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="p-10 md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-3xl tracking-tighter text-black">{name}</h3>
                    <RankBadge rank={rank} />
                  </div>
                  <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mt-1">
                    {gender === 'F' ? 'Lady' : 'Gentleman'} — {year}
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-black transition-colors text-xl">×</button>
              </div>

              <div className="flex-grow">
                <p className="text-[11px] tracking-widest text-stone-400 uppercase mb-2 italic">Semblanza</p>
                <p className="font-serif text-lg italic text-stone-800 leading-relaxed border-l border-[#C5A059] pl-6">
                  "{bio || "Sin biografía disponible por el momento."}"
                </p>
              </div>

              <div className="mt-12 pt-6 border-t border-stone-100">
                <p className="text-[9px] tracking-[0.4em] text-stone-400 uppercase">
                  Grado: <span className="text-black">{major}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdentityCard;