'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart(); // Vide le panier à l'arrivée sur la page de succès
  }, [clearCart]);

  return (
    <Container className="py-5 d-flex flex-column align-items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <CheckCircle size={80} color="#4caf50" />
      </motion.div>

      <motion.h2
        className="mb-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Merci pour votre commande !
      </motion.h2>

      <motion.p
        className="text-muted mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Une confirmation vous a été envoyée par e-mail. Votre commande est en cours de traitement.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="outline-primary" onClick={() => router.push('/')}>
          Retour à l’accueil
        </Button>
      </motion.div>
    </Container>
  );
}
