'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/format';

export default function SuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<{
    _id: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      title: string;
    }>;
    totalAmount: number;
  } | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(err => console.error('Erreur lors de la récupération de la commande:', err));
    }
  }, [orderId]);

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

      {order && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-100 mb-4"
        >
          <Card className="glass-bg">
            <Card.Header>
              <h5 className="mb-0">Détails de la commande #{order._id}</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>Articles commandés :</h6>
                {order.items.map((item: any) => (
                  <div key={item.productId} className="d-flex justify-content-between mb-2">
                    <span>{item.quantity}x {item.title}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>{formatPrice(order.totalAmount)}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      )}

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
