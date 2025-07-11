import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './WishlistButton.module.css';
import toast from 'react-hot-toast';

type Props = {
  productId: string;
};

export default function WishlistButton({ productId }: Props) {
  const { uid } = useUserStore();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!uid) return;
    axios.get(`/api/wishlist?userId=${uid}`)
      .then(res => setInWishlist(res.data.productIds?.includes(productId)))
      .catch(() => setInWishlist(false));
  }, [uid, productId]);

  const handleToggle = async () => {
    if (!uid) {
      toast.error('Connectez-vous pour utiliser la wishlist');
      return;
    }
    setLoading(true);
    try {
      if (inWishlist) {
        await axios.delete('/api/wishlist', { data: { userId: uid, productId } });
        setInWishlist(false);
        toast('Retiré de votre wishlist', { icon: '💔' });
      } else {
        await axios.post('/api/wishlist', { userId: uid, productId });
        setInWishlist(true);
        setAnimate(true);
        toast.success('Ajouté à votre wishlist !');
      }
    } catch {
      toast.error('Erreur lors de la mise à jour de la wishlist');
    }
    setLoading(false);
  };

  // Reset animation state after animation ends
  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [animate]);

  return (
    <button
      className={styles.wishlistBtn}
      onClick={handleToggle}
      disabled={loading || !uid}
      aria-label={inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
      title={inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
    >
      {inWishlist ? (
        <FaHeart color="#e63946" className={animate ? styles['heart-animate'] : ''} />
      ) : (
        <FaRegHeart color="#e63946" />
      )}
    </button>
  );
}
