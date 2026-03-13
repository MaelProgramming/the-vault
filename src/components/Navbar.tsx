import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null; // Un intrus ne voit pas la navigation

  const handleLogout = () => auth.signOut();

  const links = [
    { name: 'El Registro', path: '/' },
    { name: 'Mi Perfil', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-t md:border-t-0 md:border-b border-stone-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo discret - Visible seulement sur Desktop */}
        <Link to="/" className="hidden md:block font-serif italic text-xl tracking-tighter text-black">
          The Vault
        </Link>

        {/* Liens de navigation */}
        <div className="flex gap-10 w-full md:w-auto justify-around md:justify-end items-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-500 ${
                location.pathname === link.path 
                ? 'text-black font-bold' 
                : 'text-stone-400 hover:text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={handleLogout}
            className="text-[10px] tracking-[0.3em] uppercase text-red-900/40 hover:text-red-900 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;