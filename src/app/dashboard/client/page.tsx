'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import dynamic from 'next/dynamic';

const ClientOrders = dynamic(() => import('@/components/dashboard/ClientOrders'), { ssr: false });
const Wishlist = dynamic(() => import('@/components/dashboard/Wishlist'), { ssr: false });
const AddressBook = dynamic(() => import('@/components/dashboard/AddressBook'), { ssr: false });

export default function ClientDashboard() {
  const { isLoggedIn, role } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || role !== 'client') {
      router.push('/');
    }
  }, [isLoggedIn, role, router]);

  return (
    <div className="container mt-5 pt-5">
      <h2>Dashboard client</h2>
      <p>Bienvenue sur votre espace client. Retrouvez ici vos commandes, votre wishlist et vos informations personnelles.</p>
      <div className="mt-4">
        <h4>Mes commandes</h4>
        <ClientOrders />
      </div>
      <div className="mt-4">
        <h4>Ma liste de souhaits</h4>
        <Wishlist />
      </div>
      <div className="mt-4">
        <h4>Mes adresses de livraison</h4>
        <AddressBook />
      </div>
    </div>
  );
}
