'use client';

import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaBalanceScale } from 'react-icons/fa';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`${styles.footer} text-white mt-5 pt-5 pb-4`}>
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <div className={styles['footer-brand']}>
              <span className={styles['footer-star']}>★</span>
              LUMINA SPACE
            </div>
            <p className={`mt-2 ${styles['footer-desc']}`}>
              Découvrez une nouvelle dimension de lumière et de design avec nos objets décoratifs connectés. Élégance, technologie et bien-être réunis.
            </p>
            <div className="d-flex align-items-center mt-3">
              <FaMapMarkerAlt className={styles['footer-contact-icon']} />
              <span>Abidjan, Côte d&#39;Ivoire</span>
            </div>
            <div className="d-flex align-items-center mt-2">
              <FaClock className={styles['footer-contact-icon']} />
              <span>Lun - Sam : 9h - 19h</span>
            </div>
          </Col>

          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-3">Navigation</h5>
            <ul className="list-unstyled">
              <li><Link href="/" className={styles['footer-link']}>Accueil</Link></li>
              <li><Link href="/products" className={styles['footer-link']}>Produits</Link></li>
              <li><Link href="/about" className={styles['footer-link']}>À propos</Link></li>
              <li><Link href="/contact" className={styles['footer-link']}>Contact</Link></li>
              <li><Link href="/legal" className={styles['footer-link']}><FaBalanceScale className="me-2" />Mentions légales</Link></li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-3">Contact & Réseaux</h5>
            <p className="mb-2 d-flex align-items-center">
              <FaEnvelope className={styles['footer-contact-icon']} /> contact@luminaspace.com
            </p>
            <p className="mb-2 d-flex align-items-center">
              <FaPhoneAlt className={styles['footer-contact-icon']} /> +225 07 49 29 66 65
            </p>
            <div className="d-flex gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" className={styles['footer-icon']} aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer noopener" className={styles['footer-icon']} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className={styles['footer-icon']} aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr />

        <p className={`text-center mb-0 small ${styles['footer-legal']}`}>&copy; 2025 LUMINA SPACE. Tous droits réservés.</p>
        <p className={`text-center mb-0 small ${styles['footer-legal']}`}>Conçu avec passion par Michaël Kodji.</p>
      </Container>
    </footer>
  );
}
