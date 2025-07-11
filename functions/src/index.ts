import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Fonction déclenchée à la création d'un utilisateur dans Firestore
export const setUserRole = onDocumentCreated('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const userData = event.data?.data(); // Récupère les données du document Firestore

  if (!userData || !userData.role) {
    console.log('Aucun rôle trouvé pour l’utilisateur.');
    return;
  }

  const role = userData.role;

  try {
    await admin.auth().setCustomUserClaims(userId, { role });
    console.log(`Rôle '${role}' défini pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error('Erreur lors de la définition du rôle :', error);
  }
});
