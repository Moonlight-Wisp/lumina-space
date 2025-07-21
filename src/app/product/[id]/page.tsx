'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Gallery from '@/components/Product/Gallery';
import Details from '@/components/Product/Details';
import AddToCart from '@/components/Product/AddToCart';
import Reviews from '@/components/Product/Reviews';
import Recommended from '@/components/Product/Recommended';
import { Product } from '@/types/product';

type Params = {
  id: string;  // changement ici
};

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
        // on utilise params.id au lieu de params.slug
        const { data } = await axios.get(`/api/products/${params.id}`);
        setProduct(data);
      } catch (error) {
        console.error('Erreur produit :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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
