// Page détail produit dynamique
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import Gallery from '@/components/Product/Gallery';
import Details from '@/components/Product/Details';
import AddToCart from '@/components/Product/AddToCart';
import Reviews from '@/components/Product/Reviews';
import Recommended from '@/components/Product/Recommended';
import axios from 'axios';
import React from 'react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = React.use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        const found = data.find((p: Product) => p.id === id);
        if (!found) return router.push('/products');
        setProduct(found);
      } catch {
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading) return <div className="text-center mt-12">Chargement...</div>;
  if (!product) return null;

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Gallery images={product.images} />
        <div className="space-y-6">
          <Details product={product} />
          <AddToCart product={{
            _id: product.id,
            name: product.title,
            image: product.images[0] || '',
            price: product.price,
            stock: product.stock,
            sellerId: product.sellerName || ''
          }} />
        </div>
      </div>
      <div className="mt-16">
        <Reviews productId={product.id} />
      </div>
      <div className="mt-24">
        <Recommended category={product.category} productId={product.id} />
      </div>
    </section>
  );
}
