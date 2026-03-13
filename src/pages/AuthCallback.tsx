import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase balance les infos après le '#' dans l'URL
    const hash = window.location.hash;
    
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (token) {
        localStorage.setItem('vault_token', token);
        if (refreshToken) localStorage.setItem('vault_refresh_token', refreshToken);
        
        // Redirection vers la liste des membres après un court délai pour le style
        setTimeout(() => navigate('/'), 1500);
      } else {
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
      <Loader />
      <p className="mt-4 font-serif italic text-stone-500 animate-pulse text-[12px] tracking-widest uppercase">
        Verificando credenciales...
      </p>
    </div>
  );
};

export default AuthCallback;