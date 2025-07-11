'use client';

import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/useCartStore';

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
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAdd = () => {
    if (product.stock === 0) {
      toast.error('Produit en rupture de stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      sellerId: product.sellerId,
      quantity,
    });

    toast.success(`${product.name} ajouté au panier`);
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
