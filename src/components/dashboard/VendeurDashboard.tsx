'use client';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { UserData } from '@/types/UserData';
import Image from 'next/image';
import styles from './VendeurDashboard.module.css';

export default function VendeurDashboard({ user }: { user: UserData }) {
  return (
    <Container className="mt-4">
      <Card className="p-4 glass-bg">
        <div className={styles.dashboardHeader}>
          <Image
            src="/images/Temoignages/35dd54ce9da554d665eb0979b0d7febd.jpg"
            alt={user.displayName}
            width={64}
            height={64}
            className={styles.dashboardIcon}
          />
          <div>
            <h2>👋 Bonjour, {user.displayName}</h2>
            <p>Tableau de bord vendeur</p>
          </div>
        </div>

        <Row>
          <Col md={4}>
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Image
                  src="/images/Bestsellers/Cube-Lumineux.jpg"
                  alt="Ventes"
                  width={32}
                  height={32}
                  className={styles.cardIcon}
                />
                <h4>Ventes</h4>
              </div>
              <p>Statistiques des ventes</p>
            </div>
          </Col>
          
          <Col md={4}>
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Image
                  src="/images/Bestsellers/Lampe-Aurora-RGB.jpg"
                  alt="Produits"
                  width={32}
                  height={32}
                  className={styles.cardIcon}
                />
                <h4>Gestion des produits</h4>
              </div>
              <p>Gérer votre catalogue</p>
            </div>
          </Col>
          
          <Col md={4}>
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Image
                  src="/images/Nouveautes/01-solar-garden-lights-shop-desktop@2x.webp"
                  alt="Commandes"
                  width={32}
                  height={32}
                  className={styles.cardIcon}
                />
                <h4>Commandes récentes</h4>
              </div>
              <p>Suivi des commandes</p>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
