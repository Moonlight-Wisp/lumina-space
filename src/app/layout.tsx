import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthProvider';
import ChatWidgetClientWrapper from '@/components/dashboard/ChatWidgetClientWrapper'; // ✅

export const metadata = {
  title: 'Lumina Space',
  description: 'Objets de décoration connectés futuristes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>

      <body style={{ backgroundColor: '#f9f9f9', color: '#1a1a1a', fontFamily: "'Outfit', sans-serif" }}>
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="main-content flex-grow-1">{children}</main>
            <Footer />
            <Toaster position="top-right" reverseOrder={false} />
            {/* ✅ Le widget est chargé côté client uniquement */}
            <ChatWidgetClientWrapper />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
