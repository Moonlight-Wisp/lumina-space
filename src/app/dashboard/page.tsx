'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

import { auth, db } from '@/lib/firebase';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import VendeurDashboard from '@/components/dashboard/VendeurDashboard';
import { UserData } from '@/types/UserData';

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error('Vous devez être connecté.');
        router.push('/login');
        return;
      }

      if (!user.emailVerified) {
        toast.error('Veuillez vérifier votre adresse email.');
        router.push('/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          toast.error('Profil utilisateur introuvable.');
          await auth.signOut();
          router.push('/login');
        }
      } catch (error) {
        console.error('Erreur de chargement du dashboard :', error);
        toast.error('Une erreur est survenue.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!userData) return null;

  if (userData.role === 'vendeur') {
    return <VendeurDashboard user={userData} />;
  } else if (userData.role === 'client') {
    return <ClientDashboard user={userData} />;
  } else {
    return (
      <Container className="mt-4">
        <p>Rôle utilisateur inconnu.</p>
      </Container>
    );
  }
}
