import React from 'react'

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
    return(
        <header className={className}>
                <h1 className="font-serif text-4xl text-black tracking-[0.5em] uppercase pb-8 border-b border-black/10">
                    El Registro del Club
                </h1>
                <p className="mt-6 font-serif italic text-gray-500 tracking-widest text-sm uppercase">
                    Exclusividad • Tradición • Futuro
                </p>
        </header>
    )
}


export default Header