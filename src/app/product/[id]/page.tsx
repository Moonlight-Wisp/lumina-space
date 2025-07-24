'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReviewForm from '@/components/Product/ReviewForm';
import Gallery from '@/components/Product/Gallery';
import Details from '@/components/Product/Details';
import AddToCart from '@/components/Product/AddToCart';
import Reviews from '@/components/Product/Reviews';
import Recommended from '@/components/Product/Recommended';
import { Product } from '@/types/product';

type Params = {
  id: string;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/products/${params.id}`);
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setProduct(data);
      } catch (error) {
        const message = error instanceof Error 
          ? error.message 
          : 'Erreur lors du chargement du produit';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-6xl mb-4">😕</span>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Oups, un problème est survenu</h1>
        <p className="text-gray-600 mb-4">
          Impossible de charger ce produit pour le moment.<br />
          Veuillez réessayer plus tard ou revenir à la boutique.
        </p>
        <a href="/products" className="btn btn-primary">Retour à la boutique</a>
      </div>
    );
  }

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
        {/* <Reviews productId={product._id} /> */}
        {/* Ajout du formulaire d'avis utilisateur */}
        <div className="mt-8">
       
          <ReviewForm productId={product._id} />
        </div>
      </div>

      <div className="mt-24">
        <Recommended productId={product._id} category={product.category} />
      </div>
    </section>
  );
}
