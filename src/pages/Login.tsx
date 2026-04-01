import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Directement depuis le SDK
import { auth } from '../services/firebase'; // Ton instance Firebase
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      // On utilise la méthode Firebase standard
      await signInWithEmailAndPassword(auth, email, password);
      
      setStatus({ 
        type: 'success', 
        msg: 'Identidad confirmada. Bienvenido al Vault.' 
      });

      // Redirection après un petit délai pour laisser l'animation respirer
      setTimeout(() => navigate('/'), 1500);

    } catch (err: any) {
      let errorMsg = 'Su credencial no figura en el registro.';
      if (err.code === 'auth/wrong-password') errorMsg = 'Código de acceso incorrecto.';
      if (err.code === 'auth/user-not-found') errorMsg = 'Miembro no reconocido.';

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
          <p className="mt-4 text-[10px] tracking-[0.5em] uppercase text-[#C5A059]/60">Acceso Restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Email */}
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

          {/* Champ Password */}
          <div className="border-b border-[#C5A059]/30 py-3 transition-colors focus-within:border-[#C5A059]">
            <input
              type="password"
              placeholder="CÓDIGO DE ACCESO"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-[#C5A059]/40 text-[#EFEBE4]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1816] border border-[#C5A059]/30 py-5 text-[#C5A059] text-[10px] tracking-[0.4em] uppercase hover:bg-[#C5A059] hover:text-[#141210] transition-all duration-500 disabled:opacity-30 mt-8"
          >
            {loading ? 'Verificando...' : 'Entrar en el Círculo'}
          </button>

          <div className="text-center mt-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/invite')}
              className="text-[#C5A059]/60 hover:text-[#C5A059] text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              No soy miembro (Solicitar Admisión)
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

export default Login;