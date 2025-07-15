import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Sécurité : vérifie que les variables critiques sont bien présentes
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    '❌ Les variables FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY sont manquantes.'
  );
}

// Initialisation unique de Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Corrige les \n
    }),
  });
}

// Export pour utilisation dans les API Routes
export const auth = getAuth();
