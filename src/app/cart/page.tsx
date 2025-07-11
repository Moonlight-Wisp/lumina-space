'use client';

import { useCartStore } from '@/store/useCartStore';
import { Container, Table, Button, Form } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTrash, FaArrowRight } from 'react-icons/fa';

export default function CartPage() {
  const {
    items,
    totalQuantity,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-bg rounded-4 p-5 shadow-sm"
        >
          <h2 className="mb-3">🛒 Votre panier est vide</h2>
          <Link href="/products" className="btn btn-info btn-glow mt-2">
            Voir les produits
          </Link>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        className="glass-bg rounded-4 p-4 shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="mb-4">🛍️ Mon panier</h2>

        <Table responsive hover bordered className="rounded-4 overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.productId}>
                <td className="d-flex align-items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded shadow-sm cart-img"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="fw-semibold">{item.name}</span>
                </td>

                <td className="cart-qty-cell">
                  <Form.Control
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                  />
                </td>

                <td>{item.price.toFixed(2)} XOF</td>
                <td>{(item.price * item.quantity).toFixed(2)} XOF</td>

                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button variant="outline-secondary" onClick={clearCart}>
            Vider le panier
          </Button>

          <div className="text-end">
            <h5>Total ({totalQuantity} article{totalQuantity > 1 ? 's' : ''})</h5>
            <h4 className="fw-bold text-info">{totalPrice.toFixed(2)} XOF</h4>

            <Link href="/checkout" className="btn btn-success mt-2 d-flex align-items-center gap-2">
              Finaliser la commande <FaArrowRight />
            </Link>
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
