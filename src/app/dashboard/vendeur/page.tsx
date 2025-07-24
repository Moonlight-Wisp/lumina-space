'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { useUserStore } from '@/store/useUserStore';
import ProductForm from '@/components/Product/ProductForm';
import { Product } from '@/types/product';
import dynamic from 'next/dynamic';

const VendeurOrders = dynamic(() => import('@/components/dashboard/VendeurOrders'), { ssr: false });

export default function VendeurDashboard() {
  const { isLoggedIn, role } = useUserStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | undefined>(undefined);

  useEffect(() => {
    if (!isLoggedIn || role !== 'vendeur') {
      router.push('/');
    }
  }, [isLoggedIn, role, router]);

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const handleSaveProduct = async (product: Partial<Product>) => {
    if (editProduct && editProduct?._id) {
      await axios.put('/api/products', { ...editProduct, ...product });
    } else {
      await axios.post('/api/products', product);
    }
    const { data } = await axios.get('/api/products');
    setProducts(data);
    setShowForm(false);
    setEditProduct(undefined);
  };

  const handleEdit = (p: Product) => {
    setEditProduct(p);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await axios.delete('/api/products', { data: { id } });
    setProducts(products.filter(p => p?._id !== id));
  };

  return (
    <div className="container mt-5 pt-5">
      <h2>Dashboard vendeur</h2>
      <button className="btn btn-accent my-3" onClick={() => { setShowForm(true); setEditProduct(undefined); }}>
        Ajouter un produit
      </button>
      {showForm && (
        <ProductForm onSaveAction={handleSaveProduct} initial={editProduct} />
      )}
      <div className="mt-4">
        <h4>Mes produits</h4>
        <div className="row">
          {products.map((p) => (
            <div className="col-md-4 mb-3" key={p?._id}>
              <div className="card glass-bg h-100 border-0 text-center p-3">
                <Image src={p.images?.[0]} alt={p.title} width={400} height={180} className="card-img-cover mb-2 w-100" style={{ objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text fw-bold">{p.price} €</p>
                  <button className="btn btn-outline-primary me-2" onClick={() => handleEdit(p)}>Modifier</button>
                  <button className="btn btn-outline-danger" onClick={() => handleDelete(p?._id)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <VendeurOrders />
      </div>
    </div>
  );
}
