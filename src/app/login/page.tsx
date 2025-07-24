'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/store/useUserStore';
import { Form, Button, Container, Card, Row, Col, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import styles from './page.module.css';
import type { UserData } from '@/types/UserData';


export default function LoginPage() {
  const router = useRouter();
  const userStore = useUserStore();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (userStore.isLoggedIn) {
      router.push('/');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        userStore.setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName ?? '',
          role: 'client',
        });
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [userStore, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!form.email || !form.password) {
    setErrorMsg('Veuillez remplir tous les champs');
    toast.error('Veuillez remplir tous les champs');
    return;
  }

  setLoading(true);
  console.log("Tentative de connexion...");

  try {
    // Tentative de connexion avec gestion d'erreur
    const userCred = await signInWithEmailAndPassword(
      auth,
      form.email.trim(),
      form.password
    ).catch((error) => {
      if (error instanceof FirebaseError) {
        throw new Error(getFirebaseErrorMessage(error));
      }
      throw error;
    });

    if (!userCred?.user) {
      throw new Error('Erreur de connexion');
    }

    // Vérification de l'email
    if (!userCred.user.emailVerified) {
      await auth.signOut();
      userStore.logout();
      throw new Error('Veuillez vérifier votre e-mail avant de vous connecter');
    }

    // Construction des données utilisateur
    const userData: UserData = {
      uid: userCred.user.uid,
      email: userCred.user.email || '',
      displayName: userCred.user.displayName || '',
      role: 'client',
    };

    // Mise à jour du store
    userStore.setUser(userData);

    // Navigation après succès
    toast.success('Connexion réussie !');
    router.push('/');
  } catch (error: unknown) {
    let message = "Une erreur est survenue.";
    if (error instanceof Error) {
      message = error.message;
    }
    setErrorMsg(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className={styles.loginPage}>
      <div className={styles.loginContent}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/Nouveautes/Matter-Smart-sans-fond.png"
            alt="Connexion Lumina Smart"
            width={500}
            height={500}
            style={{ objectFit: 'contain' }}
            className="animate__animated animate__fadeInLeft"
            priority
          />
        </div>

        <div>
          {errorMsg && (
            <div className="flex flex-col items-center justify-center min-h-[120px] mb-4 animate__animated animate__fadeInDown">
              <span className="text-5xl mb-2">😕</span>
              <h2 className="text-xl font-bold text-red-600 mb-1">Oups, un problème est survenu</h2>
              <p className="text-gray-600 mb-2">{errorMsg}</p>
              <Button variant="primary" onClick={() => setErrorMsg("")}>Réessayer</Button>
            </div>
          )}
          <div className="glass-bg p-4 animate__animated animate__fadeInUp">
            <h3 className="mb-4 text-center">Connexion</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="exemple@mail.com"
                  value={form.email}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                    value={form.password}
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label="Afficher/Masquer le mot de passe"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 btn-accent"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
