'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import axios from 'axios';

type Props = {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
    sellerId: string;
  };
};

const AddToCart = ({ product }: Props) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = async () => {
    try {
      setLoading(true);

      if (product.stock === 0) {
        toast.error('Produit en rupture de stock');
        return;
      }

      // Vérification et mise à jour du stock via l'API
      const response = await axios.post('/api/purchase', {
        productId: product._id,
        quantity
      });

      if (response.data.status === 'success') {
        addItem({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: response.data.data.remainingStock,
          sellerId: product.sellerId,
          quantity,
        });

        toast.success(`${product.name} ajouté au panier`);
        router.push('/cart');
      } else {
        toast.error(response.data.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-bg rounded-4 p-4 mt-4 shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Form.Group className="d-flex align-items-center gap-3 mb-3">
        <Form.Label className="mb-0 fw-semibold">Quantité</Form.Label>
        <Form.Control
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            setQuantity(val > product.stock ? product.stock : val < 1 ? 1 : val);
          }}
          style={{ width: 100 }}
        />
      </Form.Group>

      <Button
        variant="info"
        className="w-100 btn-glow d-flex align-items-center justify-content-center gap-2"
        onClick={handleAdd}
        disabled={product.stock === 0}
      >
        <FaShoppingCart />
        Ajouter au panier
      </Button>
    </motion.div>
  );
};

export default AddToCart;
