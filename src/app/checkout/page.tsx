'use client';

import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      router.push('/cart');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulation de paiement (à remplacer par Stripe/PayPal plus tard)
    toast.success('Commande confirmée avec succès !');
    clearCart();
    router.push('/success');
  };

  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-bg rounded-4 p-4 shadow-sm"
      >
        <h2 className="mb-4">🛍️ Finalisation de la commande</h2>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="paymentMethod">Méthode de paiement</Form.Label>
                <Form.Select
                  id="paymentMethod"
                  name="paymentMethod"
                  onChange={handleChange}
                  value={form.paymentMethod}
                  aria-labelledby="paymentMethodLabel"
                >
                  <option value="card">Carte bancaire</option>
                  <option value="paypal">PayPal</option>
                  <option value="mobile">Paiement mobile</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ville</Form.Label>
                <Form.Control
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pays</Form.Label>
                <Form.Control
                  name="country"
                  required
                  value={form.country}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Code postal</Form.Label>
                <Form.Control
                  name="zip"
                  required
                  value={form.zip}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <h5>Total à payer :</h5>
            <h4 className="text-success fw-bold">{totalPrice.toFixed(2)} XOF</h4>
          </div>

          <div className="text-end mt-3">
            <Button variant="success" type="submit">
              Confirmer la commande
            </Button>
          </div>
        </Form>
      </motion.div>
    </Container>
  );
}
