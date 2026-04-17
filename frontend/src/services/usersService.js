import API from '../api/axios';

export const usersUpdate_profileService = async (userData) => {
  try {
    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    
    formData.append('id', userData.id);
    formData.append('Nom', userData.nom);
    formData.append('Bio', userData.bio);
    formData.append('Photo', userData.photo); // ⭐ Ajouter le nom de la photo
    
    // Si un fichier photo est fourni, l'ajouter
    if (userData.photoFile) {
      formData.append('PhotoFile', userData.photoFile);
    }
    
    const response = await API.put('/users/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("✅ Profil mis à jour:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error.response?.data || error.message);
    throw error;
  }
};
export const getUserByIdService = async (id) => {
  try {
    const response = await API.get(`/users/${id}`);
    console.log("User récupéré:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du user:", error.response?.data || error.message);
    throw error;
  }
};
export const recupererLesUsersService = async () => {
  try {
    const response = await API.get('/users');
    console.log("les users récupérés:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des users  :", error.response?.data || error.message);
    throw error;
  }
};
export const deleteUsersByIdService = async (id) => {
  try {
    const response = await API.delete(`/users/${id}`);
    console.log("L'user est supprimé:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de user :", error.response?.data || error.message);
    throw error;
  }
};