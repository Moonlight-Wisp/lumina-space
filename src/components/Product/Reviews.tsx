'use client';

import { useEffect, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUserStore } from '@/store/useUserStore';
import { ProductReview } from '@/types/product';
import axios from 'axios';

type Props = {
  productId: string;
};
const Reviews = ({ productId }: Props) => {
  const { uid, isLoggedIn } = useUserStore();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/reviews/${productId}`);
      setReviews(data);
    } catch (error) {
      console.error('Erreur lors du chargement des avis', error);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/reviews`, {
        productId,
        uid,
        rating,
        comment,
      });
      toast.success('Avis ajouté');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (error) {
      toast.error('Erreur lors de l’envoi de l’avis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mt-5 p-4 rounded-4 glass-bg shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h4 className="mb-4">Avis des clients</h4>

      {reviews.length === 0 && <p>Aucun avis pour ce produit.</p>}

      {reviews.map((review) => (
        <div key={review._id} className="mb-3 border-bottom pb-2">
          <div className="d-flex align-items-center gap-2 mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < review.rating ? '#f5a623' : '#ccc'} />
            ))}
          </div>
          <p className="mb-0">{review.comment}</p>
          <small className="text-muted">Posté par {review.userName}</small>
        </div>
      ))}

      {isLoggedIn && (
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>Votre note</Form.Label>
            <div className="d-flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < rating ? '#f5a623' : '#ccc'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setRating(i + 1)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Commentaire</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || rating === 0 || !comment}
          >
            {loading ? 'Envoi...' : 'Envoyer mon avis'}
          </Button>
        </Form>
      )}
    </motion.div>
  );
};

export default Reviews;
