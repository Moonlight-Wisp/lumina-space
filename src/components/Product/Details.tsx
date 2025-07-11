'use client';

import { motion } from 'framer-motion';
import styles from './Details.module.css';
import { Product } from '@/types/product';
import RatingStars from '@/components/Shared/RatingStars';
import { formatCurrency } from '@/utils/formatCurrency';
import WishlistButton from './WishlistButton';

type Props = {
  product: Product;
};

const Details = ({ product }: Props) => {
  return (
    <motion.div
      className={styles.detailsWrapper}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 className={styles.title}>{product.title}</h1>
        <WishlistButton productId={product.id} />
      </div>

      <div className={styles.priceSection}>
        <span className={styles.price}>{formatCurrency(product.price)}</span>
        {product.stock > 0 ? (
          <span className={styles.inStock}>En stock</span>
        ) : (
          <span className={styles.outOfStock}>Rupture</span>
        )}
      </div>

      <RatingStars rating={product.rating} />

      <p className={styles.description}>{product.description}</p>

      <div className={styles.meta}>
        <p>
          <strong>Vendu par :</strong>{' '}
          <span className={styles.sellerName}>{product.sellerName}</span>
        </p>
        <p>
          <strong>Livraison :</strong>{' '}
          {product.deliveryDelay} jours | {product.deliveryInfo}
        </p>
        <p>
          <strong>Retour :</strong> {product.returnPolicy}
        </p>
      </div>
    </motion.div>
  );
};

export default Details;
