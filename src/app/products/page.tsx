'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

type ProductListItem = {
  id: string;
  title: string;
  price: number;
  images: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axios.get('/api/products').then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch((err) => {
      setErrorMsg('Impossible de charger les produits. Veuillez réessayer plus tard.');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] animate__animated animate__fadeInDown">
        <span className="text-5xl mb-2">😕</span>
        <h2 className="text-xl font-bold text-red-600 mb-1">Oups, un problème est survenu</h2>
        <p className="text-gray-600 mb-2">{errorMsg}</p>
        <a href="/" className="btn btn-primary">Retour à l'accueil</a>
      </div>
    );
  }

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
