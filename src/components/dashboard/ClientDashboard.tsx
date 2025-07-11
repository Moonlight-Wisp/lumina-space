'use client';
import { Container, Card } from 'react-bootstrap';
import { UserData } from '@/types/UserData';

export default function ClientDashboard({ user }: { user: UserData }) {
  return (
    <Container className="mt-4">
      <Card className="p-4 glass-bg">
        <h2>👋 Bonjour, {user.displayName}</h2>
        <h3>Dashboard Client</h3>
        <ul className="mt-3">
          <li>Commandes récentes</li>
          <li>Liste de souhaits</li>
          <li>Support / Chat</li>
        </ul>
      </Card>
    </Container>
  );
}
