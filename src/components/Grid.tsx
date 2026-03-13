import React from "react";
import IdentityCard from './IdentityCard';
import { type GridProps } from "../types/Props";


const Grid: React.FC<GridProps> = ({ members, className = "" }) => {
    // Si la liste est vide, on n'affiche pas une grille fantôme
    if (!members.length) return null;

    return (
        <div className={`${className}`}>
            {members.map((member) => (
                <IdentityCard
                    key={member.id}
                    id={member.id}
                    name={member.full_name}
                    major={member.major}
                    year={member.graduation_year}
                    imageUrl={member.avatar_url}
                    bio={member.bio}
                    gender= {member.gender}
                />
            ))}
        </div>
    );
};

export default Grid;