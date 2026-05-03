
// ← decode JWT, get current user info

export const getUserFromToken = () => {
  // Next.js peut exécuter ce code côté serveur (SSR/RSC).
  // Dans ce cas `window/localStorage/atob` n'existent pas.
  if (typeof window === "undefined") return null;
  if (!window.localStorage || typeof window.localStorage.getItem !== "function") return null;

  const token = window.localStorage.getItem("token");
  
  if (!token) {
    console.log("Aucun token trouvé");
    return null; // not logged in
  }

  try {
    // A JWT looks like: xxxxx.yyyyy.zzzzz
    // Part 0 = header (algorithm info)
    // Part 1 = payload (YOUR DATA — email, role, name)
    // Part 2 = signature (for verification, we don't need this client-side)
    
    // 1. Séparer le token en 3 parties (header.payload.signature)
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error("Format de token invalide");
      return null; // not a valid JWT format
    }

    // 2. Récupérer la partie payload (index 1)
    const payload = parts[1];

    // 3. Décoder le Base64
    // atob() = base64 decode
    // The payload is base64-encoded JSON, we decode it to a string
    const decodedPayload = window.atob(payload);

    // 4. Parser le JSON
    // Then parse that string as JSON to get a JS object
    const userData = JSON.parse(decodedPayload);

    console.log("Token décodé!");

    // 5. Extraire les claims avec les bons noms
    // return {
    //   id: userData.nameid,           
    //   email: userData.email,        
    //   nom: userData.unique_name,     
    //   role: userData.role || null    
    // };
    return {
      email: userData.sub, // "sub" = email (setSubject in JwtService)     
      fullName: userData.fullName, // custom claim added in AuthenticateService       
      authorities: userData.authorities,  // array of role strings    
    };
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
};

export const getUserEmailFromToken = () => {
  const user = getUserFromToken();
  return user ? user.email : null; // returns "ali@email.com" or null
};


export const getUserNameFromToken = () => {
  const user = getUserFromToken();
  return user ? user.fullName : null; // returns "Ali Hassan" or null
};


export const getUserRoleFromToken  = () => {
  const user = getUserFromToken();
  return user ? user.authorities?.[0] : null;
  // returns "CLIENT" or "ADMIN" or null
};