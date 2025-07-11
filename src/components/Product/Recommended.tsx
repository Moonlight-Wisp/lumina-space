'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Card, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';

type Props = {
  productId: string;
  category: string;
};

const Recommended = ({ productId, category }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        // Filtrer les produits de la même catégorie, hors produit courant
        const filtered = data.filter((p: Product) => p.category === category && p.id !== productId);
        setProducts(filtered);
      } catch (error) {
        console.error('Erreur lors du chargement des produits recommandés', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [productId, category]);

  return (
    <motion.div
      className="mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="mb-4">Produits similaires</h4>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {products.map((product) => (
            <Card key={product.id} style={{ width: '16rem' }} className="glass-bg p-2 shadow-sm">
              <Link href={`/product/${product.id}`} className="text-decoration-none">
                <Card.Img
                  variant="top"
                  src={product.images[0]}
                  style={{ height: '160px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-dark">{product.title}</Card.Title>
                  <Card.Text className="fw-bold text-primary">
                    {product.price} €
                  </Card.Text>
                </Card.Body>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Recommended;
