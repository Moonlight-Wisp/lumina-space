"use client";
import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import ChatWidgetClientWrapper from '@/components/dashboard/ChatWidgetClientWrapper';

export default function ClientRoot({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="main-content flex-grow-1">{children}</main>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
      <ChatWidgetClientWrapper />
    </div>
  );
}
