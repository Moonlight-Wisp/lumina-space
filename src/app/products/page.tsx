'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import Gallery from '@/components/Product/Gallery';
import Details from '@/components/Product/Details';
import AddToCart from '@/components/Product/AddToCart';
import Reviews from '@/components/Product/Reviews';
import Recommended from '@/components/Product/Recommended';
import { Product } from '@/types/product';

type Params = {
  slug: string;
};

// Adjust Product type to match AddToCart and other usages
type ProductWithId = Product & {
  _id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  sellerId: string;
  category: string;
  images: string[];
};

export default function ProductPage({ params }: { params: Params }) {
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${params.slug}`);
        setProduct(data);
      } catch (error) {
        console.error('Erreur produit :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) return <div className="text-center mt-12">Chargement...</div>;
  if (!product) return notFound();

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Gallery images={product.images} />
        <div className="space-y-6">
          <Details product={product} />
          <AddToCart product={product} />
        </div>
      </div>

      <div className="mt-16">
        <Reviews productId={product._id} />
      </div>

      <div className="mt-24">
        <Recommended productId={product._id} category={product.category} />
      </div>
    </section>
  );
}

export function ProductsPage() {
  type ProductListItem = {
    id: string;
    title: string;
    price: number;
    images: string[];
  };

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <main className="py-5">
      <div className="container">
        <h1 className="mb-4 text-center">Tous nos produits</h1>
        <div className="row">
          {products.map((p) => (
            <div className="col-md-4 mb-4" key={p.id}>
              <div className="card glass-bg h-100 border-0 text-center p-3">
                <Image
                  src={p.images?.[0]}
                  alt={p.title}
                  width={400}
                  height={240}
                  className="card-img-cover mb-2"
                />
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text fw-bold">{p.price} €</p>
                  <Link href={`/product/${p.id}`} className="btn btn-accent">
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
