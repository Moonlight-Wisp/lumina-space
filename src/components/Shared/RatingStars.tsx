'use client';

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface Props {
  rating: number;
  size?: number;
}

export default function RatingStars({ rating, size = 18 }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} color="#ffc107" size={size} />
      ))}
      {hasHalfStar && <FaStarHalfAlt color="#ffc107" size={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} color="#ccc" size={size} />
      ))}
    </div>
  );
}
