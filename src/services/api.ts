import { auth } from './firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const BASE_API: string = `https://api-vault-two.vercel.app`;

// 1. Login version Firebase + Stockage Token
export const loginMember = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const token = await userCredential.user.getIdToken();
    
    // On garde le pass VIP en mémoire pour l'avatar
    localStorage.setItem('vault_token', token);
    
    return userCredential.user;
  } catch (err: any) {
    throw new Error(err.message || 'Credenciales inválidas');
  }
};

// 2. Fetch des membres (toujours public, on reste ouvert aux curieux autorisés)
export const getMembers = async () => {
  const token = localStorage.getItem('vault_token');

  const response = await fetch(`${BASE_API}/api/members`, {
    headers: {
      'Authorization': `Bearer ${token}` // Voilà ce qui manquait pour ouvrir la porte
    }
  });

  if (response.status === 401) {
    throw new Error('Tu n’as plus le droit d’être ici. Reconnecte-toi.');
  }

  if (!response.ok) throw new Error('Le serveur a un problème de riche.');
  
  return response.json();
};

// 3. Upload Avatar (Le Bearer Token est envoyé proprement)
export const uploadAvatar = async (file: File, userId: string) => {
  const token = localStorage.getItem('vault_token'); 

  if (!token) {
    console.error("Accès refusé : Aucun token trouvé.");
    return null;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${BASE_API}/api/members/${userId}/avatar`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur API :", errorData.error);
    return null;
  }

  const data = await response.json();
  return data.url;
};