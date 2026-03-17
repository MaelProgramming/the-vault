import React from 'react'
import {type  FooterProps } from '../types/Props'


const Footer: React.FC<FooterProps> = ({ className = "", textContent= "" }) => {
    return (
        <footer className={className}>
            <p className="font-serif text-[10px] tracking-[0.8em] uppercase text-[#C5A059]/90">{textContent}</p>
        </footer>
    )
}


export default Footer
