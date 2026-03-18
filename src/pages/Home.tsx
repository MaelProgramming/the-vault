import { useEffect, useState, useMemo } from 'react';
import Header from '@layout/Header'; // À terme : @layout/Header
import Footer from '@layout/Footer';
import Loader from '@layout/Loader';
import { getMembers } from '../services/api';
import type { M } from '../types/Props';
import { GoldCard } from '../shared/ui/GoldCard'; // Voilà l'héritage
import Stack from '../components/Grid';

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

    const filteredMembers = useMemo(() =>
        members.filter(m => genderFilter === 'ALL' ? true : m.gender === genderFilter),
        [members, genderFilter]
    );

    if (isLoading) return <Loader />;

    if (error) return (
        <GoldCard title="Accès restreint">
            <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
                <p className="text-[#C5A059] uppercase tracking-tighter text-xs mb-4 italic">Erreur de Protocole</p>
                <p className="text-gray-600 max-w-sm font-serif">{error}</p>
            </div>
        </GoldCard>
    );

    return (
        <main className="min-h-screen bg-[#141210] text-[#EFEBE4] flex flex-col items-center pt-20 pb-32 px-4 overflow-hidden">
            <Header
                className='mb-12 text-center max-w-2xl'
                titleContent='The Vault'
                textContent='Exclusividad • Tradición • Futuro'
            />

            {/* BARRE DE FILTRES — Subtile et minimaliste */}
            <nav className="flex gap-8 mb-16 border-b border-[#C5A059]/20 pb-4 z-10">
                {(['ALL', 'M', 'F'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setGenderFilter(t)}
                        className={`text-[10px] tracking-[0.3em] uppercase transition-all duration-500 ${genderFilter === t
                            ? 'text-[#C5A059] font-bold border-b border-[#C5A059]'
                            : 'text-[#C5A059]/40 hover:text-[#C5A059]/80'
                            }`}
                    >
                        {t === 'ALL' ? 'Todos' : t === 'M' ? 'Gentlemen' : 'Ladies'}
                    </button>
                ))}
            </nav>

            {/* LA PILE DE CARTES — Chaque membre est désormais dans un écrin */}
            <div className="relative w-full max-w-md flex justify-center items-center h-[550px]">
                {filteredMembers.length > 0 ? (
                    <Stack key={genderFilter} members={filteredMembers} className="w-full flex justify-center" />
                ) : (
                    <div className="flex flex-col items-center justify-center text-[#C5A059]/50 italic font-serif">
                        <p>Aucun membre ne correspond à ce critère.</p>
                    </div>
                )}
            </div>

            <Footer className="mt-20 opacity-50 hover:opacity-100 transition-opacity duration-1000" textContent='The Vault - 2026' />
        </main>
    );
};

export default Home;