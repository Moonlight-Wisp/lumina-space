'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import React from 'react';

type RatingStarsProps = {
  value: number; // ex: 4.5
  max?: number; // nombre d’étoiles total (défaut: 5)
  size?: number; // taille des étoiles
  color?: string;
};

const RatingStars = ({
  value,
  max = 5,
  size = 18,
  color = '#f5c518',
}: RatingStarsProps) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} size={size} color={color} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color={color} />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color={color} />);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="d-flex gap-1"
      aria-label={`Note : ${value} sur ${max}`}
    >
      {stars}
    </motion.div>
  );
};

export default RatingStars;
