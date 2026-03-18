import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createMemberProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      // 1. Création dans Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Récupération et stockage immédiat du token pour l'API
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('vault_token', token);

      // 3. Création du profil membre dans Supabase via notre backend
      await createMemberProfile({
        name,
        full_name: fullName,
        gender,
        major,
        year,
        graduation_year: graduationYear
      });
      
      setStatus({ 
        type: 'success', 
        msg: 'Perfil creado con éxito. Bienvenido a la élite.' 
      });

      // Redirection après un petit délai
      setTimeout(() => navigate('/'), 1500);

    } catch (err: any) {
      let errorMsg = 'Error en el registro.';
      if (err.code === 'auth/email-already-in-use') errorMsg = 'Este correo ya pertenece al Vault.';
      if (err.code === 'auth/weak-password') errorMsg = 'El código es demasiado débil.';
      if (err.message) errorMsg = err.message;

      setStatus({ 
        type: 'error', 
        msg: errorMsg 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#141210] flex items-center justify-center p-4 font-serif text-[#EFEBE4]">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h1 className="text-5xl italic text-[#C5A059] tracking-tighter">The Vault</h1>
          <p className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#C5A059]/60">Solicitud de Admisión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="email"
              placeholder="CORREO UNIVERSITARIO"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="password"
              placeholder="CÓDIGO SECRETO (CONTRASEÑA)"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="text"
              placeholder="NOMBRE"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="text"
              placeholder="NOMBRE COMPLETO"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4 border-b border-[#C5A059]/30 py-3 transition-colors">
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#C5A059]/40 flex-1">GÉNERO:</span>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#EFEBE4] cursor-pointer flex items-center gap-2">
              <input type="radio" value="M" checked={gender === 'M'} onChange={() => setGender('M')} className="text-[#C5A059] bg-transparent border-[#C5A059]/30 focus:ring-[#C5A059]" /> Caballero
            </label>
            <label className="text-[11px] uppercase tracking-[0.2em] text-[#EFEBE4] cursor-pointer flex items-center gap-2">
              <input type="radio" value="F" checked={gender === 'F'} onChange={() => setGender('F')} className="text-[#C5A059] bg-transparent border-[#C5A059]/30 focus:ring-[#C5A059]" /> Dama
            </label>
          </div>

          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="text"
              placeholder="ESPECIALIZACIÓN (MAJOR)"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
              <input
                type="number"
                placeholder="AÑO DE ESTUDIOS"
                className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                min={1}
                max={10}
              />
            </div>
            
            <div className="flex-1 border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
              <input
                type="number"
                placeholder="AÑO DE GRADUACIÓN"
                className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
                min={2020}
                max={2035}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1816] border border-[#C5A059]/30 py-5 text-[#C5A059] text-[10px] tracking-[0.4em] uppercase hover:bg-[#C5A059] hover:text-[#141210] transition-all duration-500 disabled:opacity-30 mt-8"
          >
            {loading ? 'Procesando Solicitud...' : 'Solicitar Acceso'}
          </button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#C5A059]/60 hover:text-[#C5A059] text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              Ya soy miembro (Entrar)
            </button>
          </div>
        </form>

        {status && (
          <p className={`text-center text-[11px] italic animate-in slide-in-from-bottom-2 duration-700 ${
            status.type === 'success' ? 'text-[#C5A059]' : 'text-red-900/80'
          }`}>
            {status.msg}
          </p>
        )}
      </div>
    </main>
  );
};

export default Register;
