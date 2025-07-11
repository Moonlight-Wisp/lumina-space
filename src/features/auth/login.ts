import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const loginUser = async (email: string, password: string) => {
  try {
    // Connexion Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Vérification de l'email
    if (!firebaseUser.emailVerified) {
      return { success: false, error: 'Veuillez vérifier votre adresse e-mail.' };
    }

    // Connexion à MongoDB pour vérifier les infos complémentaires
    await connectToDatabase();
    const dbUser = await User.findOne({ uid: firebaseUser.uid });

    if (!dbUser) {
      return { success: false, error: 'Utilisateur non trouvé dans la base de données.' };
    }

    // Vérification du mot de passe avec bcrypt (sécurité)
    const isMatch = await bcrypt.compare(password, dbUser.hashedPassword);
    if (!isMatch) {
      return { success: false, error: 'Mot de passe incorrect.' };
    }

    // ✅ Connexion réussie
    return {
      success: true,
      user: {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        role: dbUser.role,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        verified: firebaseUser.emailVerified,
      },
    };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return {
      success: false,
      error: (error as Error).message || 'Erreur inconnue',
    };
  }
};
