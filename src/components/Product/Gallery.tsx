'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import styles from './Gallery.module.css'; 

type Props = {
  images: string[];
};

const Gallery = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

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
            <div className="swiper-zoom-container">
              <img src={src} alt={`Image ${index + 1}`} />
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
            <img src={src} alt={`Thumbnail ${index + 1}`} className={styles.thumbnail} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;
