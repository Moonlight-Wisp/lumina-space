import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { motion } from 'framer-motion';
import { FaStar, FaTrash, FaEdit } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import styles from './ReviewForm.module.css';
import toast from 'react-hot-toast';

interface Review {
  _id?: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  productId: string;
}

const ReviewForm = ({ productId }: Props) => {
  const { uid, isLoggedIn } = useUserStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, uid]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/getreviews/${productId}`);
      const data = await res.json();
      setReviews(data);
      if (uid) {
        const found = data.find((r: Review) => r.userId === uid);
        setMyReview(found || null);
        if (found) {
          setRating(found.rating);
          setComment(found.comment);
        }
      }
    } catch {
      toast.error('Impossible de charger les avis');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Connectez-vous pour laisser un avis');
      return;
    }
    if (rating < 1 || rating > 5 || !comment.trim()) {
      toast.error('Note et commentaire requis');
      return;
    }
    setLoading(true);
    try {
      const method = myReview ? 'PUT' : 'POST';
      const body = myReview
        ? { reviewId: myReview._id, userId: uid, rating, comment }
        : { userId: uid, productId, rating, comment };
      const res = await fetch('/api/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
      toast.success('Avis enregistré');
      setEditMode(false);
      fetchReviews();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: myReview._id, userId: uid }),
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      toast.success('Avis supprimé');
      setRating(0);
      setComment('');
      setMyReview(null);
      fetchReviews();
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.reviewWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4 className="mb-3">Avis des clients</h4>
      <div className="mb-4">
        {reviews.length === 0 && <p className="text-muted">Aucun avis pour ce produit.</p>}
        {reviews.map((r) => (
          <div key={r._id} className={styles.reviewItem}>
            <div className="d-flex align-items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < r.rating ? '#ffc107' : '#e4e5e9'} />
              ))}
              <span className="fw-bold ms-2">{r.rating}/5</span>
            </div>
            <p className="mb-1">{r.comment}</p>
            <span className="text-muted small">{new Date(r.createdAt!).toLocaleDateString()}</span>
            {r.userId === uid && (
              <div className="mt-1 d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => setEditMode(true)}><FaEdit /></Button>
                <Button size="sm" variant="outline-danger" onClick={handleDelete}><FaTrash /></Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isLoggedIn && (
        <Form onSubmit={handleSubmit} className={styles.reviewForm}>
          <Form.Group className="mb-2">
            <Form.Label>Votre note</Form.Label>
            <div className="d-flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <FaStar
                  key={n}
                  color={n <= rating ? '#ffc107' : '#e4e5e9'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setRating(n); setEditMode(true); }}
                />
              ))}
              <span className="ms-2">{rating}/5</span>
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Commentaire</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={comment}
              onChange={e => { setComment(e.target.value); setEditMode(true); }}
              required
              placeholder="Votre avis sur ce produit..."
            />
          </Form.Group>
          <Button type="submit" variant="success" disabled={loading || !editMode} className="mt-2">
            {myReview ? 'Modifier mon avis' : 'Laisser un avis'}
          </Button>
        </Form>
      )}
      {!isLoggedIn && <p className="text-muted">Connectez-vous pour laisser un avis.</p>}
    </motion.div>
  );
};

export default ReviewForm;
