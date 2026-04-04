export interface GridProps {
    members: Member[]; // Obligatoire, sinon on affiche quoi ? du vent ?
    className?: string;
}

interface MemberProps {
  id: string; // On a besoin de l'ID pour renommer le fichier proprement
  name: string;
  major: string;
  year: number;
  avatar_url: string;
  bio: string;
  gender: 'M' | 'F';
  isTopCard?: boolean;
  is_verified?: boolean;
  elite_score?: number;
}
export interface ExtendedProps extends MemberProps {
    isTopCard?: boolean;
    onSwiped?: (direction: 'left' | 'right') => void;
    
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
    avatar_url: string;
    bio: string;
    full_name: string;
    graduation_year: number;
    is_verified: boolean;
    elite_score?: number;
}

export interface HeaderProps {
    className?: string;
    textContent: string
    titleContent: string
}

export interface Props {
  user: any;
  onSwipe: (direction: 'left' | 'right') => void;
}
export type { Member as M }
export type { MemberProps as MProps }
