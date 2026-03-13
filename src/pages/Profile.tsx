import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMembers, uploadAvatar } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

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
        const members = await getMembers();
        // On filtre par email, c'est l'identifiant unique du Vault
        const me = members.find((m: any) => m.email === user.email); 
        if (me) {
          setProfile(me);
          setBio(me.bio);
        }
      } catch (err) {
        console.error("Erreur de registre.");
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

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-12 md:py-20 px-4 font-serif">
      <Header className="mb-16 text-center" titleContent="Tu Perfil" textContent="Identidad de Miembro" />

      <div className="w-full max-w-4xl bg-white border border-stone-100 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* IMAGE & UPLOAD */}
        <div className="md:w-1/2 relative bg-stone-100 h-[400px] md:h-auto group">
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
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <span className="text-[9px] tracking-[0.5em] text-stone-300 uppercase mb-4">Estatus: Verificado</span>
          <h2 className="text-3xl md:text-5xl tracking-tighter text-black mb-8 leading-none">{profile?.full_name}</h2>
          
          <div className="space-y-8">
            <div className="relative">
              <label className="text-[9px] tracking-[0.3em] text-stone-400 uppercase block mb-4 italic">Semblanza</label>
              {isEditing ? (
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-100 p-5 text-sm italic font-serif focus:ring-0 focus:border-black transition-all h-36 resize-none leading-relaxed"
                />
              ) : (
                <p className="text-xl italic text-stone-800 leading-relaxed font-light">
                  "{bio || "El silencio es la mayor de las elegancias."}"
                </p>
              )}
            </div>

            <div className="pt-8 border-t border-stone-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] tracking-widest text-stone-400 uppercase">Grado</p>
                <p className="text-[11px] text-black uppercase mt-1 tracking-wider">{profile?.major}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-widest text-stone-400 uppercase">Clase</p>
                <p className="text-[11px] text-black uppercase mt-1 tracking-wider">{profile?.graduation_year}</p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-black text-white py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-stone-900 transition-all shadow-lg">
                  Confirmar Cambios
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="border border-black text-black py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-black hover:text-white transition-all">
                  Editar Semblanza
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer className="mt-20 opacity-20" textContent='The Vault - 2026'/>
    </main>
  );
};

export default Profile;