import { useEffect, useState } from 'react';
import IdentityCard from '../components/IdentityCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getMembers } from '../services/api';
import type { Member as M } from '../types/Members'

const Home = () => {
    const [members, setMembers] = useState<M[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')

    useEffect(() => {
        getMembers()
            .then(setMembers)
            .catch((err) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    // On bloque ici tant que ça charge
    if (isLoading) return <Loader />;
    
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-4 text-center">
            <h2 className="font-serif text-2xl mb-4 italic text-[#1A1A1A]">Accès restreint</h2>
            <p className="text-gray-500 max-w-sm">{error}</p>
        </div>
    );

    return (
        /* Ton style intouché */
        <main className="min-h-screen bg-[#FDFDFD] flex flex-col items-center py-20 px-4">

            {/* Header avec une bordure subtile pour marquer le prestige */}
            <Header className='mb-24 text-center max-w-2xl'></Header>

            {/* La Grid : justify-items-center pour que la carte soit centrée si elle est seule */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full max-w-7xl justify-items-center items-start">
                {members.map((member) => (
                    <IdentityCard
                        key={member.id}
                        id={member.id} 
                        name={member.full_name}
                        major={member.major}
                        year={member.graduation_year}
                        imageUrl={member.avatar_url}
                        bio={member.bio}
                    />
                ))}
            </div>

            {/* Footer discret pour finir le look */}
            <Footer className='mt-32 opacity-20 hover:opacity-100 transition-opacity duration-1000'></Footer>
            
        </main>
    );
};

export default Home;