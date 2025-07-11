import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'vendeur';
};

export const registerUser = async (form: RegisterForm) => {
  try {
    const displayName = `${form.firstName} ${form.lastName}`;

    // Création du compte avec Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );
    const user = userCredential.user;

    // Envoi de l’email de vérification
    await sendEmailVerification(user);

    // Mise à jour du displayName Firebase
    await updateProfile(user, { displayName });

    // Hachage du mot de passe pour MongoDB
    const hashedPassword = await bcrypt.hash(form.password, 12);

    // Connexion à MongoDB
    await connectToDatabase();

    // Enregistrement dans MongoDB
    await User.create({
      uid: user.uid,
      email: user.email,
      firstName: form.firstName,
      lastName: form.lastName,
      displayName,
      role: form.role,
      hashedPassword,
      verified: false,
    });

    // Facultatif : Enregistrement aussi dans Firestore (lecture rapide)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: form.firstName,
      lastName: form.lastName,
      displayName,
      role: form.role,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
    });

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'Erreur inconnue lors de l’inscription',
    };
  }
};
