"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";

interface FirebaseError {
  code: string;
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await updateProfile(userCred.user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });
      await sendEmailVerification(userCred.user);
      setShowPopup(true);
      toast.success("Compte créé. Vérifiez votre e-mail.");

      const interval = setInterval(async () => {
        await auth.currentUser?.reload();
        if (auth.currentUser?.emailVerified) {
          setIsVerified(true);
          clearInterval(interval);
        }
      }, 3000);
    } catch (error) {
      const err = error as FirebaseError;
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "url(/images/register-bg.jpg) no-repeat center/cover",
      }}
    >
      <Row className="w-100" style={{ maxWidth: 1100 }}>
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
        >
          <Image
            src="/images/register-side.png"
            alt="LUMINA register"
            width={600}
            height={800}
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
            <h3 className="mb-4 text-center">Créer un compte</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control name="firstName" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control name="lastName" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    onChange={handleChange}
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Confirmer le mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    onChange={handleChange}
                  />
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 btn-accent"
              >
                {loading ? "Création..." : "S’inscrire"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal vérification email */}
      <Modal show={showPopup} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>Vérifiez votre e-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Un lien de vérification a été envoyé à votre adresse e-mail.</p>
          <p>Veuillez le confirmer pour activer votre compte.</p>
          {isVerified ? (
            <p className="text-success">✅ Adresse vérifiée !</p>
          ) : (
            <p className="text-warning">⏳ En attente de confirmation...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={!isVerified}
            onClick={() => router.push("/login")}
          >
            Se connecter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
