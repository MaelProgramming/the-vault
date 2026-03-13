import React from 'react'

interface HeaderProps {
    className?: string;
}

const Footer: React.FC<HeaderProps> = ({ className = "" }) => {
    return (
        <footer className={className}>
            <p className="font-serif text-[10px] tracking-[0.8em] uppercase text-black">
                The Vault — Propiedad Privada
            </p>
        </footer>
    )
}


export default Footer