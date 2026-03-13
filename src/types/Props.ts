export interface GridProps {
    members: Member[]; // Obligatoire, sinon on affiche quoi ? du vent ?
    className?: string;
}

interface MemberProps {
  id: string; // On a besoin de l'ID pour renommer le fichier proprement
  name: string;
  major: string;
  year: number;
  imageUrl: string;
  bio: string;
  gender: 'M' | 'F'
}

export interface FooterProps {
    className?: string;
    textContent?: string
}

interface Member {
    id: string; // On a besoin de l'ID pour renommer le fichier proprement
    name: string;
    major: string;
    gender: 'M' | 'F'
    year: number;
    imageUrl: string;
    bio: string;
    full_name: string;
    graduation_year: number;
    avatar_url: string;
}
export interface HeaderProps {
    className?: string;
    textContent: string
    titleContent: string
}

export type { Member as M }
export type { MemberProps as MProps }
