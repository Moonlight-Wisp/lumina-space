'use client';

import { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { loginUser } from '@/features/auth/login';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailNotVerified(false);

    const res = await loginUser(form.email, form.password);
    setLoading(false);

    if (res.success) {
      toast.success('Connexion réussie 🚀');
    } else {
      // PROTECTION pour éviter l'erreur si res.error est undefined
      if (typeof res.error === 'string' && res.error.includes('vérifier votre adresse')) {
        setEmailNotVerified(true);
        toast.error('Email non vérifié.');
      } else {
        toast.error(res.error || 'Erreur lors de la connexion');
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      toast.success("Email de vérification renvoyé !");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-4 glass-bg rounded-4 shadow">
      <h2 className="text-center mb-4">Connexion</h2>

      {emailNotVerified && (
        <Alert variant="warning">
          Votre email n’est pas vérifié. <br />
          <Button variant="link" onClick={resendVerificationEmail}>
            Renvoyer l’email de vérification
          </Button>
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Mot de passe</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 btn-glow" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Connexion'}
      </Button>
    </Form>
  );
};

export default LoginForm;
