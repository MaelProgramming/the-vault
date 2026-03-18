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

  const data = await response.json();
  // On mappe 'sex' de Supabase vers 'gender' pour le frontend
  return data.map((member: any) => ({
    ...member,
    gender: member.sex
  }));
};

// 3. Upload Avatar (Le Bearer Token est envoyé proprement)
export const createMemberProfile = async (memberData: any) => {
  const token = localStorage.getItem('vault_token');
  const response = await fetch(`${BASE_API}/api/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(memberData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur de création');
  }

  return response.json();
};
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

// 4. Enregistrer un Swipe
export const swipeMember = async (swipedId: string, isLike: boolean) => {
  const token = localStorage.getItem('vault_token');
  if (!token) throw new Error("Accès refusé");

  const response = await fetch(`${BASE_API}/api/swipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ swipedId, isLike })
  });

  if (!response.ok) {
    throw new Error('Erreur lors du swipe.');
  }

  return response.json();
};

export const getConversations = async () => {
  const token = localStorage.getItem('vault_token');
  const res = await fetch(`${BASE_API}/api/conversations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erreur chargement conversations');
  return res.json();
};

export const getMessages = async (convId: string, lastTimestamp?: string) => {
  const token = localStorage.getItem('vault_token');
  let url = `${BASE_API}/api/conversations/${convId}/messages`;
  if (lastTimestamp) {
    url += `?since=${encodeURIComponent(lastTimestamp)}`;
  }
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erreur chargement messages');
  return res.json();
};

export const sendMessage = async (convId: string, content: string) => {
  const token = localStorage.getItem('vault_token');
  const res = await fetch(`${BASE_API}/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Erreur envoi message');
  return res.json();
};
// 8. Marquer la correspondance comme lue (Le luxe du feedback)
export const markAsRead = async (convId: string) => {
  const token = localStorage.getItem('vault_token');
  if (!token) return;

  try {
    const res = await fetch(`${BASE_API}/api/conversations/${convId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error('Erreur lors du marquage de lecture');
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Échec de la notification de lecture:', err);
    return null;
  }
};