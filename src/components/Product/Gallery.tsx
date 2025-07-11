'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import type SwiperType from 'swiper'; // Import type Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import styles from './Gallery.module.css';

type Props = {
  images: string[];
};

const Gallery = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className={styles.galleryWrapper}>
      {/* Swiper principal */}
      <Swiper
        zoom={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Zoom, Navigation, Thumbs]}
        className={styles.mainSwiper}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="swiper-zoom-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Miniatures */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        modules={[Thumbs]}
        className={styles.thumbSwiper}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div style={{ position: 'relative', width: '100%', height: '80px' }}>
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;
