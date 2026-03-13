interface Member {
    id: string; // On a besoin de l'ID pour renommer le fichier proprement
    name: string;
    major: string;
    year: number;
    imageUrl: string;
    bio: string;
    full_name: string;
    graduation_year: number;
    avatar_url: string;
}

interface MemberProps {
  id: string; // On a besoin de l'ID pour renommer le fichier proprement
  name: string;
  major: string;
  year: number;
  imageUrl: string;
  bio: string;
}


export type { Member, MemberProps }
