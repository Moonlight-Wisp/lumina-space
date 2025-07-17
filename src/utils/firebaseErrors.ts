import { FirebaseError } from 'firebase/app';

export const getFirebaseErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée';
    case 'auth/network-request-failed':
      return 'Erreur de connexion réseau';
    default:
      return error.message;
  }
};
