'use client';
import { Container, Card } from 'react-bootstrap';
import { UserData } from '@/types/UserData';

export default function VendeurDashboard({ user }: { user: UserData }) {
  return (
    <Container className="mt-4">
      <Card className="p-4 glass-bg">
        <h2>👋 Bonjour, {user.displayName}</h2>
        <h3>Dashboard Vendeur</h3>
        <ul className="mt-3">
          <li>Statistiques des ventes</li>
          <li>Gestion des produits</li>
          <li>Commandes récentes</li>
        </ul>
      </Card>
    </Container>
  );
}
