import React, { useState } from 'react';
import { requestLogin } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      await requestLogin(email);
      setStatus({ 
        type: 'success', 
        msg: 'Se ha enviado un enlace de acceso exclusivo a su correo.' 
      });
    } catch (err: any) {
      setStatus({ 
        type: 'error', 
        msg: err.message || 'Su credencial no figura en el registro.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 font-serif">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <h1 className="text-5xl italic text-vault-black tracking-tighter">The Vault</h1>
          <p className="mt-4 text-[10px] tracking-[0.5em] uppercase text-stone-400">Identificación de Miembro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border-b border-stone-200 py-2">
            <input
              type="email"
              placeholder="CORREO UNIVERSITARIO"
              className="w-full bg-transparent border-none focus:ring-0 text-sm tracking-[0.2em] uppercase placeholder:text-stone-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vault-black py-4 text-white text-[11px] tracking-[0.3em] uppercase hover:bg-stone-800 transition-all disabled:opacity-30"
          >
            {loading ? 'Verificando...' : 'Solicitar Acceso'}
          </button>
        </form>

        {status && (
          <p className={`text-center text-[11px] italic animate-in fade-in duration-500 ${
            status.type === 'success' ? 'text-vault-gold' : 'text-red-800'
          }`}>
            {status.msg}
          </p>
        )}
      </div>
    </main>
  );
};

export default Login;