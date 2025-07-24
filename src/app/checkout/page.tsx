'use client';

import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { uid, isLoggedIn } = useUserStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
    if (!isLoggedIn) {
      toast.error('Veuillez vous connecter pour passer une commande');
      router.push('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Votre panier est vide.');
      router.push('/cart');
    }
  }, [items, router, isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation des champs requis
      
      const requiredFields = ['fullName', 'email', 'address', 'city', 'country', 'zip'] as const;
      const missingFields = requiredFields.filter(field => !form[field as keyof typeof form]);

      if (missingFields.length > 0) {
        setErrorMsg('Veuillez remplir tous les champs obligatoires');
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      if (items.length === 0) {
        setErrorMsg('Votre panier est vide');
        toast.error('Votre panier est vide');
        router.push('/cart');
        return;
      }

      // Création de la commande
      if (!isLoggedIn || !uid) {
        setErrorMsg('Veuillez vous connecter pour passer une commande');
        toast.error('Veuillez vous connecter pour passer une commande');
        router.push('/login');
        return;
      }

      const orderData = {
        userId: uid,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          title: item.name
        })),
        shippingAddress: {
          street: form.address,
          city: form.city,
          postalCode: form.zip,
          country: form.country
        },
        totalAmount: totalPrice,
        customerInfo: {
          fullName: form.fullName,
          email: form.email
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Erreur lors de la création de la commande');
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

      // Si la commande est créée avec succès
      toast.success('Commande confirmée avec succès !');
      clearCart();
      router.push(`/success?orderId=${data._id}`);
    } catch (error) {
      console.error('Erreur:', error);
      if (!errorMsg) setErrorMsg('Une erreur est survenue lors de la création de la commande');
      toast.error('Une erreur est survenue lors de la création de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {errorMsg && (
        <div className="flex flex-col items-center justify-center min-h-[120px] mb-4 animate__animated animate__fadeInDown">
          <span className="text-5xl mb-2">😕</span>
          <h2 className="text-xl font-bold text-red-600 mb-1">Oups, un problème est survenu</h2>
          <p className="text-gray-600 mb-2">{errorMsg}</p>
          <Button variant="primary" onClick={() => setErrorMsg("")}>Réessayer</Button>
        </div>
      )}
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
                <Form.Label id="paymentMethodLabel" htmlFor="paymentMethod">Méthode de paiement</Form.Label>
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
            <h4 className="text-success fw-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(totalPrice)}</h4>
          </div>

          <div className="text-end mt-3">
            <Button 
              variant="success" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Traitement en cours...' : 'Confirmer la commande'}
            </Button>
          </div>
        </Form>
      </motion.div>
    </Container>
  );
}
