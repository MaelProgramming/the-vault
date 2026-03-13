const BASE_API: string = `https://api-vault-two.vercel.app`;

// Récupérer les membres (Public, pas besoin de token normalement)
export const getMembers = async () => {
  const response = await fetch(`${BASE_API}/api/members`);
  if (!response.ok) throw new Error('Error al conectar con el servidor');
  return response.json();
};

// Uploader l'avatar (Besoin du Bearer Token)
export const uploadAvatar = async (file: File, userId: string) => {
  // On récupère le token stocké lors du login
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
      // Le pass VIP pour ton backend corrigé
      'Authorization': `Bearer ${token}`
    },
    body: formData,
    // Note: Content-Type est géré automatiquement par fetch pour FormData
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur API :", errorData.error);
    return null;
  }

  const data = await response.json();
  return data.url;
};

export const requestLogin = async (email: string) => {
  const response = await fetch(`${BASE_API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Accès refusé');
  }

  return response.json();
};