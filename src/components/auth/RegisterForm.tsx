'use client';

import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { registerUser } from '@/features/auth/register';
import { User } from '@/types/user';
import { Product } from '@/types/product';
// etc.

const RegisterForm = () => {
  const [form, setForm] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'client' | 'vendeur';
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await registerUser(form);
    setLoading(false);

    if (res.success) {
      toast.success('Compte créé ! Vérifiez votre email.');
    } else {
      toast.error(res.error || 'Erreur lors de l’inscription');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 glass-bg rounded-4 shadow">
      <h2 className="text-center mb-4">Créer un compte</h2>

      <Form.Group className="mb-3">
        <Form.Label>Prénom</Form.Label>
        <Form.Control name="firstName" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Nom</Form.Label>
        <Form.Control name="lastName" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Type de compte</Form.Label>
        <Form.Select name="role" onChange={handleChange}>
          <option value="client">Client</option>
          <option value="vendeur">Vendeur</option>
        </Form.Select>  
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 btn-glow" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Créer mon compte'}
      </Button>
    </Form>
  );
};

export default RegisterForm;
