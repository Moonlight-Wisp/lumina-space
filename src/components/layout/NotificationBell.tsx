import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import styles from './NotificationBell.module.css';

export default function NotificationBell({ count = 0, onClick }: { count?: number; onClick?: () => void }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [count]);

  return (
    <button className={styles.bellBtn} onClick={onClick} aria-label="Notifications">
      <FaBell className={animate ? styles.bellAnimate : ''} size={22} />
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </button>
  );
}
