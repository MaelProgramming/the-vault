import React from 'react'
import { type HeaderProps } from '../types/Props'

const Header: React.FC<HeaderProps> = ({ className = "", textContent = "", titleContent = "" }) => {
    return (
        <header className={className}>
            <h1 className="font-serif text-4xl text-black tracking-[0.5em] uppercase pb-8 border-b border-black/10">
                {titleContent}
            </h1>
            <p className="mt-6 font-serif italic text-stone-500 tracking-widest text-xs uppercase opacity-80 animate-pulse-slow">
                {textContent}
            </p>
        </header>
    )
}


export default Header