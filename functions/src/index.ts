import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Fonction déclenchée à la création d'un utilisateur dans Firestore
export const setUserRole = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const userData = snap.data();

    if (!userData || !userData.role) {
      console.log('Aucun rôle trouvé.');
      return;
    }

    const role = userData.role;

    try {
      await admin.auth().setCustomUserClaims(userId, { role });
      console.log(`Rôle '${role}' défini pour l'utilisateur ${userId}`);
    } catch (error) {
      console.error('Erreur en définissant les claims:', error);
    }
  });
