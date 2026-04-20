
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log("Aucun token trouvé");
    return null;
  }

  try {
    // 1. Séparer le token en 3 parties (header.payload.signature)
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error("Format de token invalide");
      return null;
    }

    // 2. Récupérer la partie payload (index 1)
    const payload = parts[1];

    // 3. Décoder le Base64
    const decodedPayload = atob(payload);

    // 4. Parser le JSON
    const userData = JSON.parse(decodedPayload);

    console.log("Token décodé!");

    // 5. Extraire les claims avec les bons noms
    return {
      id: userData.nameid,           
      email: userData.email,        
      nom: userData.unique_name,     
      role: userData.role || null    
    };
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};


export const getUserIdFromToken = () => {
  const user = getUserFromToken();
  return user ? parseInt(user.id) : null;
};


export const getUserEmailFromToken = () => {
  const user = getUserFromToken();
  return user ? user.email : null;
};


export const getUserNameFromToken = () => {
  const user = getUserFromToken();
  return user ? user.nom : null;
};