// Page liste produits
'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <main className="py-5">
      <Container>
        <h1 className="mb-4 text-center">Tous nos produits</h1>
        <Row>
          {products.length === 0 && <p>Aucun produit disponible.</p>}
          {products.map((p) => (
            <Col md={4} key={p.id} className="mb-4">
              <Card className="glass-bg h-100 border-0 text-center p-3">
                <Image src={p.images[0]} alt={p.title} width={400} height={240} className="card-img-cover mb-2"/>
                <Card.Body>
                  <Card.Title>{p.title}</Card.Title>
                  <Card.Text className="fw-bold">{p.price} €</Card.Text>
                  <Link href={`/product/${p.id}`}><Button className="btn-accent">Voir</Button></Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </main>
  );
}
