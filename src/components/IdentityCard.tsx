import React, { useState, useRef } from 'react';
import { uploadAvatar } from '../services/api'; // Importe la fonction qu'on a préparée
import type { MemberProps as MProps } from '../types/Members';


const IdentityCard: React.FC<MProps> = ({ id, name, major, year, imageUrl, bio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const newUrl = await uploadAvatar(file, id);
    
    if (newUrl) {
      setCurrentImage(newUrl);
      // Ici, il faudra idéalement faire un fetch PATCH vers ton backend 
      // pour mettre à jour l'URL en BDD définitivement.
    }
    setIsUploading(false);
  };

  return (
    <>
      {/* LA CARTE (Inchangée mais utilise currentImage) */}
      <div className="group max-w-sm border border-black bg-white p-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
        <div className="relative h-96 w-full overflow-hidden bg-gray-100 mb-6">
          <img 
            src={currentImage} 
            alt={name} 
            className="h-full w-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
          />
        </div>
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold uppercase tracking-[0.2em] text-black">{name}</h2>
          <p className="mt-2 text-sm italic font-light text-gray-700">{major} — {year}</p>
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-8 w-full border border-black py-3 text-xs tracking-[0.2em] text-black hover:bg-black hover:text-white transition-all duration-300 uppercase"
          >
            VER PERFIL PRIVADO
          </button>
        </div>
      </div>

      {/* LA MODALE */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>

          <div className="relative w-full max-w-2xl overflow-hidden bg-[#FDFDFD] shadow-2xl border border-vault-gold/30">
            <div className="flex flex-col md:flex-row">
              {/* Image avec option d'upload */}
              <div className="relative h-64 md:h-auto md:w-1/2 overflow-hidden group/img">
                <img src={currentImage} alt={name} className="h-full w-full object-cover object-top" />
                
                {/* Bouton d'upload en overlay */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                >
                  <span className="text-white text-[10px] tracking-widest uppercase border border-white/50 px-4 py-2">
                    {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
                  </span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              {/* Infos */}
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-black/30 hover:text-black">✕</button>
                <h3 className="font-serif text-3xl font-bold uppercase tracking-widest">{name}</h3>
                <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest border-b border-black/5 pb-4">{major}</p>
                <p className="mt-6 font-serif italic text-gray-700 leading-relaxed">"{bio}"</p>
                <div className="mt-8 pt-6 border-t border-black/5">
                  <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Status: Miembro Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdentityCard;