import React, { useState, useRef } from 'react';
import { uploadAvatar } from '../services/api';
import type { MProps } from '../types/Props';

const IdentityCard: React.FC<MProps> = ({ id, name, major, year, imageUrl, bio, gender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      {/* CARD UI */}
      <div className="group w-full max-w-[350px] bg-white border border-black/5 p-4 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="relative h-[450px] w-full overflow-hidden bg-[#F5F5F5] mb-6">
          <img 
            src={currentImage} 
            alt={name} 
            className="h-full w-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-in-out scale-100 group-hover:scale-105"
          />
          {/* Label de genre discret */}
          <div className="absolute bottom-4 left-4 overflow-hidden">
            <span className="block text-[9px] tracking-[0.3em] text-white bg-black/80 px-3 py-1 uppercase transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
              {gender === 'F' ? 'Lady' : 'Gentleman'}
            </span>
          </div>
        </div>

        <div className="text-center px-2">
          <h2 className="font-serif text-xl tracking-[0.15em] uppercase text-black">{name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
             <p className="text-[10px] font-light tracking-widest text-stone-400 uppercase">{major}</p>
             <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
             <p className="text-[10px] font-light tracking-widest text-stone-400 uppercase">{year}</p>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-8 w-full border border-black py-3 text-[9px] tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors duration-500 uppercase"
          >
            Acceder al perfil
          </button>
        </div>
      </div>

      {/* MODAL SYSTEM */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm transition-opacity duration-500" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative w-full max-w-3xl overflow-hidden bg-[#FDFDFD] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            {/* Image Section */}
            <div className="relative h-80 md:h-auto md:w-1/2 overflow-hidden group/img">
              <img src={currentImage} alt={name} className="h-full w-full object-cover object-top" />
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer backdrop-separate"
              >
                <span className="text-white text-[9px] tracking-[0.3em] uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-all">
                  {isUploading ? 'Procesando...' : 'Cambiar Imagen'}
                </span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Content Section */}
            <div className="p-10 md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <div>
                    <h3 className="font-serif text-3xl tracking-tighter text-black">{name}</h3>
                    <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase mt-1">
                        {gender === 'F' ? 'Lady' : 'Gentleman'} — {year}
                    </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-black transition-colors text-xl">×</button>
              </div>

              <div className="flex-grow">
                <p className="text-[11px] tracking-widest text-stone-400 uppercase mb-2 italic">Semblanza</p>
                <p className="font-serif text-lg italic text-stone-800 leading-relaxed border-l border-stone-200 pl-6">
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