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
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 font-serif">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h1 className="text-5xl italic text-[#1A1A1A] tracking-tighter">The Vault</h1>
          <p className="mt-4 text-[10px] tracking-[0.5em] uppercase text-stone-400">Acceso Restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Email */}
          <div className="border-b border-stone-200 py-3 transition-colors focus-within:border-black">
            <input
              type="email"
              placeholder="CORREO UNIVERSITARIO"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-stone-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Champ Password */}
          <div className="border-b border-stone-200 py-3 transition-colors focus-within:border-black">
            <input
              type="password"
              placeholder="CÓDIGO DE ACCESO"
              className="w-full bg-transparent border-none focus:ring-0 text-[11px] tracking-[0.2em] uppercase placeholder:text-stone-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A1A1A] py-5 text-white text-[10px] tracking-[0.4em] uppercase hover:bg-stone-800 transition-all duration-500 disabled:opacity-30 mt-8"
          >
            {loading ? 'Verificando...' : 'Entrar en el Círculo'}
          </button>
        </form>

        {status && (
          <p className={`text-center text-[11px] italic animate-in slide-in-from-bottom-2 duration-700 ${
            status.type === 'success' ? 'text-stone-800' : 'text-red-900'
          }`}>
            {status.msg}
          </p>
        )}
      </div>
    </main>
  );
};

export default Login;