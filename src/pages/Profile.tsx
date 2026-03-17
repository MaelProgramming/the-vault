import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { RankBadge } from '../components/RankBadge';
import type { RankType } from '../components/RankBadge';


const Profile = () => {
  const { user } = useAuth(); // On récupère le boss
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  const fetchMyProfile = async () => {
    if (!user?.email) return;
    try {
      const token = localStorage.getItem('vault_token');
      const response = await fetch('https://api-vault-two.vercel.app/api/members/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Erreur de registre.");
      
      const me = await response.json();
      setProfile(me);
      setBio(me.bio);
    } catch (err) {
      console.error("Erreur de chargement du profil.");
    } finally {
      setLoading(false);
    }
  };
  fetchMyProfile();
}, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsUploading(true);
    const newUrl = await uploadAvatar(file, profile.id);
    if (newUrl) {
      setProfile({ ...profile, avatar_url: newUrl });
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
  if (!profile?.id) return;

  try {
    // On appelle ton backend Vercel
    const response = await fetch(`https://api-vault-two.vercel.app/api/members/${profile.id}/bio`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('vault_token')}` // Indispensable pour checkAuth
      },
      body: JSON.stringify({ bio })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
    }

    // Si le serveur est OK, on met à jour l'UI
    setProfile({ ...profile, bio });
    setIsEditing(false);
    console.log("Semblanza synchronisée avec le coffre.");
    
  } catch (err: any) {
    console.error("Échec de la persistance :", err.message);
    alert("Impossible de mettre à jour ton profil. Vérifie ta connexion.");
  }
};

  if (loading) return <Loader />;

  // Détermination du rang (Fondateurs 'hardcodés', le reste basé sur is_verified)
  const isFounder = profile?.full_name?.includes('Mael Gruand') || profile?.full_name?.includes('Eliot'); 
  let rank: RankType = 'POSTULANT';
  if (isFounder) { rank = 'FOUNDER'; }
  else if (profile?.is_verified) { rank = 'HEIR'; }

  return (
    <main className="min-h-screen bg-[#141210] text-[#EFEBE4] flex flex-col items-center py-12 md:py-20 px-4 font-serif">
      <Header className="mb-16 text-center" titleContent="Tu Perfil" textContent="Identidad de Miembro" />

      <div className="w-full max-w-4xl bg-[#1A1816] border border-[#C5A059]/20 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* IMAGE & UPLOAD */}
        <div className="md:w-1/2 relative bg-[#141210] h-[400px] md:h-auto group">
          <img 
            src={profile?.avatar_url} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
            alt={profile?.full_name} 
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
          >
            <span className="text-white text-[10px] tracking-[0.3em] uppercase border border-white/50 px-6 py-3">
              {isUploading ? 'Procesando...' : 'Actualizar Retrato'}
            </span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
        </div>

        {/* DETAILS */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-[#1A1816]">
          <div className="flex gap-4 items-center mb-8">
            <h2 className="text-3xl md:text-5xl tracking-tighter text-[#C5A059] leading-none">{profile?.full_name}</h2>
            <RankBadge rank={rank} />
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <label className="text-[9px] tracking-[0.3em] text-[#C5A059]/80 uppercase block mb-4 italic">Semblanza</label>
              {isEditing ? (
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#141210] text-[#EFEBE4] border border-[#C5A059]/30 p-5 text-sm italic font-serif focus:ring-0 focus:border-[#C5A059] transition-all h-36 resize-none leading-relaxed"
                />
              ) : (
                <p className="text-xl italic text-[#EFEBE4]/90 leading-relaxed font-light">
                  "{bio || "El silencio es la mayor de las elegancias."}"
                </p>
              )}
            </div>

            <div className="pt-8 border-t border-[#C5A059]/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] tracking-widest text-[#C5A059]/60 uppercase">Grado</p>
                <p className="text-[11px] text-[#EFEBE4] uppercase mt-1 tracking-wider">{profile?.major}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-widest text-[#C5A059]/60 uppercase">Clase</p>
                <p className="text-[11px] text-[#EFEBE4] uppercase mt-1 tracking-wider">{profile?.graduation_year}</p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-[#C5A059] text-[#141210] font-bold py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-[#D4AF37] transition-all shadow-lg">
                  Confirmar Cambios
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="border border-[#C5A059] text-[#C5A059] py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-[#C5A059] hover:text-[#141210] transition-all">
                  Editar Semblanza
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer className="mt-20 opacity-50 hover:opacity-100 transition-opacity duration-1000" textContent='The Vault - 2026'/>
    </main>
  );
};

export default Profile;