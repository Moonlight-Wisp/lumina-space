"use client";
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import styles from './about.module.css';

const demoMedia = [
  { type: 'image', src: '/images/Bestsellers/Lampe-Aurora-RGB.jpg', alt: 'Lampe Aurora RGB' },
  { type: 'image', src: '/images/Bestsellers/Cube-Lumineux.jpg', alt: 'Cube Lumineux' },
  { type: 'video', src: '/images/Hero/vidéos/default.mp4', alt: 'Vidéo ambiance' },
];

export default function AboutPage() {
  const [media, setMedia] = useState(demoMedia);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newMedia = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video')) {
        return { type: 'video', src: url, alt: file.name };
      }
      return { type: 'image', src: url, alt: file.name };
    });
    setMedia(prev => [...prev, ...newMedia]);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <main className="py-5">
      <div className="container text-center">
        <h1 className="mb-3">À propos de Lumina Space</h1>
        <p className="mb-4 lead">
          <strong>Lumina Space</strong> est bien plus qu’une marque : c’est une invitation à réinventer votre intérieur grâce à la lumière connectée.<br/>
          Depuis notre création, nous avons à cœur de fusionner technologie de pointe, design raffiné et émotions lumineuses pour transformer chaque espace en une expérience unique.<br/>
          <br/>
          Notre équipe de passionnés imagine des objets lumineux qui s’adaptent à vos envies, pour que chaque moment de vie devienne inoubliable.
        </p>

        {/* Carrousel d'images/vidéos */}
        <div className={`${styles.mediaCarousel} mb-4`}>
          <Slider {...sliderSettings}>
            {media.map((item, idx) => (
              <div key={idx} className={styles.mediaSlide}>
                {item.type === 'image' ? (
                  <Image src={item.src} alt={item.alt} width={600} height={320} className={`w-100 ${styles.mediaImg}`} />
                ) : (
                  <video src={item.src} controls className={styles.mediaVideo} />
                )}
              </div>
            ))}
          </Slider>
        </div>

        {/* Ajout de média */}
        <div className="mb-5">
          <label htmlFor="media-upload" className="visually-hidden">Ajouter une image ou vidéo</label>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            className="d-none"
            ref={fileInputRef}
            onChange={handleAddMedia}
            aria-label="Ajouter une image ou vidéo"
          />
          <button className="btn btn-accent" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            Ajouter une image ou vidéo
          </button>
        </div>

        {/* Valeurs ou timeline */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-4 mb-3">
            <div className="p-4 bg-light rounded shadow-sm h-100">
              <h4>Innovation</h4>
              <p>
                Nous repoussons sans cesse les limites de la technologie pour imaginer des solutions lumineuses inédites.<br/>
                Nos produits connectés s’intègrent harmonieusement à votre quotidien, offrant contrôle, personnalisation et évolutivité.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-4 bg-light rounded shadow-sm h-100">
              <h4>Design</h4>
              <p>
                Chaque création Lumina Space est pensée comme une œuvre d’art : lignes épurées, matériaux nobles et finitions soignées.<br/>
                Notre ambition : sublimer votre intérieur tout en respectant votre style et vos envies.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-4 bg-light rounded shadow-sm h-100">
              <h4>Expérience</h4>
              <p>
                Plus qu’un simple objet, chaque produit Lumina Space est une expérience sensorielle : lumière d’ambiance, scénarios personnalisés, synchronisation avec la musique ou l’environnement.<br/>
                Notre priorité : l’émotion et le bien-être au quotidien.
              </p>
            </div>
          </div>
        </div>

        {/* Section équipe enrichie */}
        <div className="mb-5">
          <h2 className="mb-4">Notre équipe</h2>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <div className="text-center">
              <Image src="/images/Temoignages/souriant-jeune- (2).jpg" alt="Élodie" width={100} height={100} className="rounded-circle mb-2" />
              <div><strong>Élodie</strong><br/><span className="text-muted">Fondatrice & Directrice Artistique</span></div>
              <p className="small mt-2">Visionnaire et créative, Élodie insuffle à Lumina Space son amour du design et de l’innovation.</p>
            </div>
            <div className="text-center">
              <Image src="/images/Temoignages/souriant-jeune- (1).jpg" alt="Jérôme" width={100} height={100} className="rounded-circle mb-2" />
              <div><strong>Jérôme</strong><br/><span className="text-muted">CTO & Ingénieur Lumière</span></div>
              <p className="small mt-2">Expert en technologies connectées, Jérôme transforme chaque idée en expérience lumineuse inédite.</p>
            </div>
          </div>
        </div>

        {/* Conclusion inspirante */}
        <div className="mb-5">
          <h3 className="mb-3">Rejoignez l’aventure Lumina Space</h3>
          <p className="lead">
            Ensemble, faisons de la lumière un art de vivre !<br/>
            Découvrez nos collections, partagez vos inspirations et illuminez votre quotidien avec Lumina Space.
          </p>
        </div>
      </div>
    </main>
  );
}
