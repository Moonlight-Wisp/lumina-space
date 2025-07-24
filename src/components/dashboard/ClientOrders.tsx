'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Spinner, Table, Badge, Card, Button, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return-requested';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
  'return-requested': 'warning'
};

const statusLabels = {
  pending: 'En attente',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  'return-requested': 'Retour demandé'
};

export default function ClientOrders() {
  const { uid, isLoggedIn } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn || !uid) {
        setLoading(false);
        setError('Veuillez vous connecter pour voir vos commandes');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Récupération des commandes pour uid:', uid);
        const response = await fetch(`/api/orders?userId=${uid}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la récupération des commandes');
        }

        const data = await response.json();
        console.log('Commandes reçues:', data);
        
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Format de données invalide:', data);
          throw new Error('Format de données invalide');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        setError('Impossible de charger vos commandes');
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [uid, isLoggedIn]);

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (!isLoggedIn || !uid) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      <Card className="text-center p-4">
        <Card.Body>
          <h5 className="text-danger">Accès non autorisé</h5>
          <p>Veuillez vous connecter pour voir vos commandes.</p>
          <Button variant="primary" href="/login">Se connecter</Button>
        </Card.Body>
      </Card>
    </motion.div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      <Card className="text-center p-4">
        <Card.Body>
          <h5 className="text-danger">Erreur</h5>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Card.Body>
      </Card>
    </motion.div>
  );

  if (loading) return (
    <div className="d-flex justify-content-center mt-4">
      <Spinner animation="border" />
    </div>
  );

  if (!orders.length) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      <Card className="text-center p-4">
        <Card.Body>
          <h5>Aucune commande trouvée</h5>
          <p className="text-muted">Vos futures commandes apparaîtront ici</p>
        </Card.Body>
      </Card>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <Card>
          <Card.Body>
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(order.totalAmount)}</td>
                    <td>
                      <Badge bg={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleShowDetails(order)}
                      >
                        Voir les détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </motion.div>

      <Modal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        size="lg"
      >
        {selectedOrder && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                Détails de la commande #{selectedOrder._id.slice(-8).toUpperCase()}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-4">
                <h6 className="mb-3">Articles commandés</h6>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    className="d-flex align-items-center mb-2 p-2 border rounded"
                  >
                    {item.image ? (
                      <div className="me-3">
                        <Image
                          src={item.image.startsWith('http') ? item.image : `/uploads/${item.image}`}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      </div>
                    ) : (
                      <div className="me-3">
                        <Image
                          src="/placeholder.png"
                          alt="Image manquante"
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <div>{item.title}</div>
                      <small className="text-muted">
                        Quantité: {item.quantity} × {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price)}
                      </small>
                    </div>
                    <div className="text-end">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h6 className="mb-3">Adresse de livraison</h6>
                <div className="p-3 border rounded">
                  <p className="mb-1">{selectedOrder.shippingAddress.street}</p>
                  <p className="mb-1">
                    {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                  </p>
                  <p className="mb-0">{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div className="d-flex justify-content-between border-top pt-3">
                <h5>Total</h5>
                <h5>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(selectedOrder.totalAmount)}</h5>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {selectedOrder.status === 'pending' || selectedOrder.status === 'processing' ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (!window.confirm('Confirmer l\'annulation de cette commande ?')) return;
                    try {
                      const res = await fetch('/api/orders', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...selectedOrder, status: 'cancelled' }),
                      });
                      if (!res.ok) throw new Error('Erreur lors de l\'annulation');
                      toast.success('Commande annulée');
                      setShowDetails(false);
                      setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: 'cancelled' } : o));
                    } catch {
                      toast.error('Erreur lors de l\'annulation');
                    }
                  }}
                  className="me-2"
                >
                  Annuler la commande
                </Button>
              ) : null}
              {selectedOrder.status === 'delivered' ? (
                <Button
                  variant="warning"
                  onClick={async () => {
                    if (!window.confirm('Demander un retour pour cette commande ?')) return;
                    try {
                      // Ici, on peut soit changer le statut, soit envoyer une notification SAV
                      const res = await fetch('/api/orders', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...selectedOrder, status: 'return-requested' }),
                      });
                      if (!res.ok) throw new Error('Erreur lors de la demande de retour');
                      toast.success('Demande de retour envoyée');
                      setShowDetails(false);
                      setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: 'return-requested' } : o));
                    } catch {
                      toast.error('Erreur lors de la demande de retour');
                    }
                  }}
                  className="me-2"
                >
                  Demander un retour
                </Button>
              ) : null}
              <Button variant="outline-secondary" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
