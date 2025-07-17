"use client";
import Link from "next/link";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
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
  const [errorMsg, setErrorMsg] = useState("");
  const [imgError, setImgError] = useState(false);
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
    setErrorMsg("");
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
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
      await signOut(auth); // Déconnexion immédiate après inscription
      setShowPopup(true);
      toast.success("Compte créé. Vérifiez votre e-mail.");
    } catch (error) {
      const err = error as FirebaseError;
      let msg = "Une erreur est survenue.";
      if (err.code === "auth/email-already-in-use") {
        msg = "Cet e-mail est déjà utilisé.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Adresse e-mail invalide.";
      } else if (err.code === "auth/weak-password") {
        msg = "Le mot de passe est trop faible (6 caractères minimum).";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Problème de connexion réseau.";
      }
      setErrorMsg(msg);
      toast.error(msg);
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
        background: "url(/images/Hero/images/0314-outdoor-string-lights-pre-order-na-desktop@2x.webp) no-repeat center/cover, #181818",
      }}
    >
      <Row className="w-100" style={{ maxWidth: 1100 }}>
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
        >

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
            {errorMsg && (
              <div className="alert alert-danger py-2 text-center mb-3 animate__animated animate__fadeInDown">
                {errorMsg}
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control name="firstName" required onChange={handleChange} autoComplete="given-name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control name="lastName" required onChange={handleChange} autoComplete="family-name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  autoComplete="email"
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
                    autoComplete="new-password"
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    variant="outline-secondary"
                    tabIndex={-1}
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
                    autoComplete="new-password"
                  />
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    variant="outline-secondary"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 btn-accent d-flex align-items-center justify-content-center"
                style={{ minHeight: 44 }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Création...
                  </>
                ) : (
                  "S’inscrire"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal vérification email simplifiée */}
      <Modal show={showPopup} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>Vérifiez votre e-mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Un lien de vérification a été envoyé à votre adresse e-mail.</p>
          <p>Veuillez cliquer sur le lien reçu pour activer votre compte.</p>
          <p className="text-info">Après avoir vérifié votre e-mail, cliquez sur le bouton ci-dessous pour vous connecter.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => router.push("/login")}>Aller à la connexion</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
