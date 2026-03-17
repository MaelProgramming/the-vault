import React from 'react'
import { type HeaderProps } from '../types/Props'

const Header: React.FC<HeaderProps> = ({ className = "", textContent = "", titleContent = "" }) => {
    return (
        <header className={className}>
            <h1 className="font-serif text-4xl text-[#C5A059] tracking-[0.5em] uppercase pb-8 border-b border-[#C5A059]/30">
                {titleContent}
            </h1>
            <p className="mt-6 font-serif italic text-[#EFEBE4]/60 tracking-widest text-[10px] uppercase opacity-80 animate-pulse-slow">
                {textContent}
            </p>
        </header>
    )
}


export default Header