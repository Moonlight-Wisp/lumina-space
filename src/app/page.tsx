'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '@/types/product';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import { FaLightbulb, FaCubes, FaRobot, FaStar, FaMobileAlt, FaHome, FaCheckCircle } from 'react-icons/fa';
import styles from './home.module.css';

const heroSlides = [
  { id: 1, type: 'video', src: '/images/Hero/vidéos/default.mp4', title: 'Hub Lumineux pour Bureau', subtitle: 'Transformez votre bureau avec notre hub 3-en-1 !' },
  { id: 2, type: 'image', src: '/images/Hero/images/nanoelaf-blocks-launch-desktop@2x.webp', title: 'Créez l’ambiance', subtitle: 'Lampes connectées et objets design' },
  { id: 3, type: 'image', src: '/images/Hero/images/0314-outdoor-string-lights-pre-order-na-desktop@2x.webp', title: 'Technologie & élégance', subtitle: 'Décoration en exterieur ' },
];

const categories = [
  { id: 1, title: 'Lampes Connectées', description: 'Contrôle intelligent et lumière personnalisée.', img: '/images/Categorie/Lampes.jpg' },
  { id: 2, title: 'Objets Décoratifs Lumineux', description: 'Design moderne et ambiance unique.', img: '/images/Categorie/freepik__the-style-is-candid-image-photography-with-natural__71335.jpeg' },
  { id: 3, title: 'Accessoires Futuristes', description: 'Technologie et style dans chaque détail.', img: '/images/Categorie/Accessoires.jpg' },
];

// Les produits seront chargés depuis la base de données

const Galerie = [
  { id: 1, img:"/images/Galeries/7070c753ef1f2db1ac425d3785d40535.jpg"},
  { id: 2, img: '/images/Galeries/93ed2fa34eb8caca43e18ad8c8eb42f0.jpg' },
  { id: 3, img: '/images/Galeries/92884e4fc7c3ca3a1a03a590dddf4eda.jpg' },
  { id: 4, img:'/images/Galeries/df4728b4d7a17863354119aa85766c6a.jpg'},
];

export default function Home() {
  const [nouveautes, setNouveautes] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        console.log('Données des produits:', data);
        // On trie par date de création pour les nouveautés
        const sortedByDate = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNouveautes(sortedByDate.slice(0, 4)); // 4 derniers produits

        // Pour les bestsellers, on prend les 3 premiers (à terme, on pourrait les trier par nombre de ventes)
        setBestSellers(data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <main>
      {/* Hero Slider */}
      <section className="hero-slider-section">
        <Slider {...settings}>
          {heroSlides.map(slide => (
            <div
              key={slide.id}
              className="hero-slide d-flex align-items-center justify-content-start"
            >
              {slide.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="position-absolute w-100 h-100 object-fit-cover"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  style={{ objectFit: 'cover', zIndex: -1 }}
                />
              )}
              <Container className="hero-content">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="hero-title"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="hero-subtitle"
                  style={{ color: 'rgb(240, 248, 255)' }}
                >
                  {slide.subtitle}
                </motion.p>
                <Link href="/products">
                  <Button className="btn-accent">Découvrir</Button>
                </Link>
              </Container>
            </div>
          ))}
        </Slider>
      </section>

      {/* Nouveautés */}
      <section className="py-5" style={{ background: '#f0fbfc' }}>
        <Container>
          <h2 className="text-center mb-4">Nos Dernières Nouveautés</h2>
          <p className="text-center mb-4">Découvrez les ici en exclusivité et offrez-vous nos dernières innovations.</p>
          <Row>
            {loading ? (
              <Col xs={12} className="text-center">
                <p>Chargement des nouveautés...</p>
              </Col>
            ) : nouveautes.length === 0 ? (
              <Col xs={12} className="text-center">
                <p>Aucune nouveauté disponible pour le moment.</p>
              </Col>
            ) : (
              nouveautes.map(p => (
                <Col md={3} key={p._id} className="mb-3">
                  <Card className="glass-bg h-100 border-0">
                    <Link href={`/product/${p._id}`} className="text-decoration-none">
                      <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                        <Image 
                          src={p.images[0]} 
                          alt={p.title} 
                          fill 
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <Card.Body>
                        <Card.Title className="text-dark">{p.title}</Card.Title>
                        <Card.Text className="fw-bold text-primary">{p.price}€</Card.Text>
                        <Button className="btn-accent">Acheter</Button>
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* Catégories */}
      <section className={`home-section ${styles.homeSection}`}> 
        <Container>
          <h2 className={`text-center mb-4 ${styles.homeTitle}`}>Nos univers lumineux</h2>
          <p className={`text-center mb-4 ${styles.homeSubtitle}`}>Explorez nos catégories phares et trouvez l’inspiration pour chaque pièce de votre maison.</p>
          <Row>
            {categories.map((c, index) => (
              <Col md={4} key={c.id} className="mb-4">
                <Card className="glass-bg h-100 border-0 text-center p-3">
                  <div className={styles.categoryIcon}>
                    {index === 0 && <FaLightbulb className="category-icon" />} 
                    {index === 1 && <FaCubes className="category-icon" />} 
                    {index === 2 && <FaRobot className="category-icon" />}
                  </div>
                  <Image src={c.img} alt={c.title} width={400} height={240} className="card-img-cover mb-2"/>
                  <Card.Body>
                    <Card.Title>{c.title}</Card.Title>
                    <Card.Text>{c.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Produits vedettes */}
      <section className={`home-section-alt ${styles.homeSectionAlt}`}> 
        <Container>
          <h2 className={`text-center mb-4 ${styles.homeTitle}`}>Nos Bestsellers</h2>
          <p className={`text-center mb-4 ${styles.homeSubtitle}`}>Les produits préférés de nos clients, plébiscités pour leur design et leur innovation.</p>
          <Row>
            {loading ? (
              <Col xs={12} className="text-center">
                <p>Chargement des bestsellers...</p>
              </Col>
            ) : bestSellers.length === 0 ? (
              <Col xs={12} className="text-center">
                <p>Aucun bestseller disponible pour le moment.</p>
              </Col>
            ) : (
              bestSellers.map((p) => (
                <Col md={4} key={p._id} className="mb-4">
                  <Card className="glass-bg h-100 border-0 text-center p-3">
                    <span className={styles.bestsellerBadge}><FaStar className="me-1" /> Bestseller</span>
                    <Link href={`/product/${p._id}`} className="text-decoration-none">
                      <Image src={p.images[0]} alt={p.title} width={400} height={240} className="card-img-cover mb-2"/>
                      <Card.Body>
                        <Card.Title className="text-dark">{p.title}</Card.Title>
                        <Card.Text className="fw-bold text-primary">{p.price}€</Card.Text>
                        <Button className="btn-accent">Acheter</Button>
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* Modularité */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-3">Modularité intelligente</h2>
          <p className="mb-4">Composez librement vos ambiances lumineuses avec des modules connectés et personnalisables, pour une maison qui vous ressemble.</p>
          <div className="d-flex justify-content-center mt-4">
            <Image
              src="/images/scene-creation@1x.webp"
              alt="Modularité"
              width={900}
              height={450}
              className="rounded shadow-lg w-100"
              style={{ maxWidth: 900, objectFit: 'cover' }}
              priority
            />
          </div>
        </Container>
      </section>

      {/* Applis & Compatibilité */}
      <section className={`home-section-alt ${styles.homeSectionAlt}`}> 
        <Container>
          <Row>
            <Col md={6} className="mb-4 d-flex align-items-center justify-content-center">
              <div className={styles.integrationAppImageWrapper}>
                <Image
                  src="/images/integrations-mobile-app-hero@1x.webp"
                  alt="Application mobile"
                  width={500}
                  height={350}
                  className={`w-100 ${styles.integrationAppImage}`}
                  priority
                />
              </div>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center">
              <h3><FaMobileAlt className="me-2 text-accent" /> Contrôle via application</h3>
              <p>Personnalisez la couleur, la luminosité et les scènes lumineuses depuis votre smartphone, où que vous soyez.</p>
              <h4 className="mt-4"><FaHome className="me-2 text-accent" /> Compatibilité étendue</h4>
              <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: 350 }}>
                <li><FaCheckCircle className="me-2 text-success" /> Google Home</li>
                <li><FaCheckCircle className="me-2 text-success" /> Alexa</li>
                <li><FaCheckCircle className="me-2 text-success" /> Apple HomeKit</li>
                <li><FaCheckCircle className="me-2 text-success" /> Et bien plus encore…</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Galerie - Carrousel automatique */}
      <section className="py-5" style={{ background: '#e3f5f7' }}>
        <Container>
          <h2 className="text-center mb-4">Galerie d’inspirations</h2>
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            autoplay={true}
            autoplaySpeed={2500}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={false}
            responsive={[
              { breakpoint: 992, settings: { slidesToShow: 2 } },
              { breakpoint: 600, settings: { slidesToShow: 1 } }
            ]}
          >
            {Galerie.map((item) => (
              <div key={item.id} className="px-2">
                <Image
                  src={item.img}
                  alt={`Inspiration ${item.id}`}
                  width={300}
                  height={200}
                  className="rounded w-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </Slider>
        </Container>
      </section>

      {/* Témoignages avec photo */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4">Ils nous adorent</h2>
          <Row className="justify-content-center">
            <Col md={5} className="mb-4">
              <Card className="glass-bg p-3 border-0">
                <Row>
                  <Col xs={4}>
                    <Image src="/images/Temoignages/souriant-jeune- (2).jpg" alt="Élodie M." width={80} height={80} className="rounded-circle" />
                  </Col>
                  <Col>
                    <Card.Text>“Design élégant et ambiance magique à la maison. Je recommande à 100% !”</Card.Text>
                    <Card.Subtitle className="text-muted">– Élodie M.</Card.Subtitle>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={5} className="mb-4">
              <Card className="glass-bg p-3 border-0">
                <Row>
                  <Col xs={4}>
                    <Image src="/images/Temoignages/souriant-jeune- (1).jpg" alt="Jérôme T." width={80} height={80} className="rounded-circle" />
                  </Col>
                  <Col>
                    <Card.Text>“Le contrôle via smartphone est fluide et intuitif. Superbe expérience !”</Card.Text>
                    <Card.Subtitle className="text-muted">– Jérôme T.</Card.Subtitle>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA finale */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-3">Envie d’éclairer votre intérieur ?</h2>
          <Link href="/products"><Button className="btn-accent">Explorer la boutique</Button></Link>
        </Container>
      </section>
    </main>
  );
}
