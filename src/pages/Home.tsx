import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getMembers } from '../services/api';
import type { M } from '../types/Props';
import Grid from '../components/Grid';

const Home = () => {
    const [members, setMembers] = useState<M[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');

    useEffect(() => {
        getMembers()
            .then(setMembers)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    // Logique de filtrage instantanée
    const filteredMembers = members.filter(m => 
        genderFilter === 'ALL' ? true : m.gender === genderFilter
    );

    if (isLoading) return <Loader />;
    
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-4 text-center">
            <h2 className="font-serif text-2xl mb-4 italic text-[#1A1A1A]">Accès restreint</h2>
            <p className="text-gray-500 max-w-sm">{error}</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center pt-20 pb-32 px-4">
            <Header 
                className='mb-12 text-center max-w-2xl' 
                titleContent='The Vault' 
                textContent='Exclusividad • Tradición • Futuro' 
            />

            {/* BARRE DE FILTRES MINIMALISTE */}
            <div className="flex gap-8 mb-16 border-b border-stone-100 pb-4 transition-all duration-500">
                {(['ALL', 'M', 'F'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setGenderFilter(t)}
                        className={`text-[10px] tracking-[0.3em] uppercase transition-all ${
                            genderFilter === t ? 'text-black font-bold border-b border-black' : 'text-stone-300 hover:text-stone-500'
                        }`}
                    >
                        {t === 'ALL' ? 'Todos' : t === 'M' ? 'Gentlemen' : 'Ladies'}
                    </button>
                ))}
            </div>

            {/* On passe les membres FILTRÉS à la Grid */}
            <Grid 
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full max-w-7xl justify-items-center items-start' 
                members={filteredMembers} 
            />
            
            <Footer 
                className='mt-32 opacity-20 hover:opacity-100 transition-opacity duration-1000' 
                textContent='The Vault - 2026' 
            />
        </main>
    );
};

export default Home;