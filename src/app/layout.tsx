import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '@/context/AuthProvider';
import ClientRoot from '@/components/layout/ClientRoot';
import { Inter } from 'next/font/google'
import { StoreProvider } from '@/context/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lumina Space',
  description: 'Objets de décoration connectés futuristes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <StoreProvider>
          <AuthProvider>
            <ClientRoot>
              {children}
            </ClientRoot>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
