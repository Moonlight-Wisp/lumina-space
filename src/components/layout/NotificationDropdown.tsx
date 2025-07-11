import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { ListGroup, Badge, Button } from 'react-bootstrap';

export default function NotificationDropdown({ onRead }: { onRead?: () => void }) {
  const { uid } = useUserStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    axios.get(`/api/notifications?userId=${uid}`)
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, [uid]);

  const handleRead = async (id: string) => {
    await axios.put('/api/notifications', { id });
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    if (onRead) onRead();
  };

  if (loading) return <div className="p-3">Chargement...</div>;
  if (!notifications.length) return <div className="p-3">Aucune notification.</div>;

  return (
    <ListGroup style={{ minWidth: 320, maxHeight: 400, overflowY: 'auto' }}>
      {notifications.map(n => (
        <ListGroup.Item key={n._id} action variant={n.read ? 'light' : 'info'} className="d-flex justify-content-between align-items-center">
          <div>
            <div>{n.message}</div>
            {n.link && <a href={n.link} className="small text-primary">Voir</a>}
          </div>
          {!n.read && <Button size="sm" variant="outline-success" onClick={() => handleRead(n._id)}>Marquer comme lue</Button>}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
