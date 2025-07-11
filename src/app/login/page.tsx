'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/store/useUserStore';
import { Form, Button, Container, Card, Row, Col, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const userStore = useUserStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        userStore.setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName ?? '',
          role: 'client',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, form.email, form.password);

      if (!userCred.user.emailVerified) {
        toast.error('Veuillez vérifier votre e-mail avant de vous connecter.');
        await auth.signOut();
        return;
      }

      userStore.setUser({
        uid: userCred.user.uid,
        email: userCred.user.email!,
        displayName: userCred.user.displayName ?? '',
        role: 'client',
      });

      toast.success('Connexion réussie !');
      router.push('/dashboard/client');
    } catch (error: any) {
      toast.error('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'url(/images/login-bg.jpg) no-repeat center/cover',
      }}
    >
      <Row className="w-100" style={{ maxWidth: 1100 }}>
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
        >
          <img
            src="/images/login-side.png"
            alt="Connexion Lumina"
            className="img-fluid mb-6 animate__animated animate__fadeInLeft"
          />
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <Card
            className="p-4 glass-bg w-100 animate__animated animate__fadeInUp"
            style={{ maxWidth: 480 }}
          >
            <h3 className="mb-4 text-center">Connexion</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="exemple@mail.com"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
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
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
