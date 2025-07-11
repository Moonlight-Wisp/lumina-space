import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { Order } from '@/types/order';
import { Spinner, Table, Badge } from 'react-bootstrap';

export default function VendeurOrders() {
  const { uid } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    axios.get(`/api/orders?sellerId=${uid}`)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!orders.length) return <div className="mt-4">Aucune commande reçue sur vos produits.</div>;

  return (
    <div className="mt-4">
      <h5>Commandes reçues sur vos produits</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Produits</th>
            <th>Total</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.userId}</td>
              <td>
                {order.items.map(item => (
                  <div key={item.productId}>
                    {item.quantity} × {item.productId}
                  </div>
                ))}
              </td>
              <td>{order.totalAmount.toFixed(2)} XOF</td>
              <td><Badge bg="info">{order.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
