'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import NotificationDropdown from './NotificationDropdown';
import { useUserStore } from '@/store/useUserStore';
import { useCartStore } from '@/store/useCartStore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

type Notification = {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const userStore = useUserStore();
  const cartStore = useCartStore();

  const { isLoggedIn, role, uid } = userStore;
  const cartCount =
    cartStore.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // Notifications
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  // Recharge les notifications à l'ouverture seulement
  const toggleNotif = () => {
    setShowNotif((prev) => {
      if (!prev && uid) {
        fetch(`/api/notifications?userId=${uid}`)
          .then((res) => res.json())
          .then((data: Notification[]) =>
            setNotifCount(data.filter((n) => !n.read).length)
          )
          .catch(() => setNotifCount(0));
      }
      return !prev;
    });
  };

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        userStore.setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName ?? '',
          role: userStore.role || 'client',
        });
      } else {
        userStore.logout();
      }
    });
    return () => unsubscribe();
  }, [userStore]);

  // Gestion thème clair/sombre
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleLogout = async () => {
    await signOut(auth);
    userStore.logout();
    toast.success('Déconnexion réussie !');
    router.push('/');
  };

  return (
    <Navbar
      expanded={expanded}
      expand="lg"
      bg="transparent"
      fixed="top"
      className="glass-bg shadow-sm px-4 header-blur"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          className="header-brand d-flex align-items-center gap-2"
        >
          <span className={theme === 'dark' ? 'header-star' : 'header-star-light'}>
            ★
          </span>
          LUMINA SPACE
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onClick={() => setExpanded(false)}>
            <Nav.Link as={Link} href="/">
              Accueil
            </Nav.Link>
            <Nav.Link as={Link} href="/products">
              Produits
            </Nav.Link>
            <Nav.Link as={Link} href="/about">
              À propos
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center" onClick={() => setExpanded(false)}>
            <Nav.Link
              onClick={toggleTheme}
              aria-label="Changer de thème"
              className="d-flex align-items-center"
            >
              {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
            </Nav.Link>

            <div style={{ position: 'relative' }}>
              <NotificationBell count={notifCount} onClick={toggleNotif} />
              {showNotif && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 36,
                    zIndex: 1000,
                    minWidth: 320,
                  }}
                >
                  <NotificationDropdown
                    onRead={() => setNotifCount((c) => Math.max(0, c - 1))}
                  />
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <NavDropdown
                title={<FaUserCircle size={22} aria-label="User menu" />}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} href="/profile">
                  Mon profil
                </NavDropdown.Item>
                {role === 'client' && (
                  <NavDropdown.Item as={Link} href="/dashboard/client">
                    Mon dashboard client
                  </NavDropdown.Item>
                )}
                {role === 'vendeur' && (
                  <NavDropdown.Item as={Link} href="/dashboard/vendeur">
                    Dashboard vendeur
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} href="/login">
                  Connexion
                </Nav.Link>
                <Nav.Link as={Link} href="/register">
                  S&apos;inscrire
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={Link}
              href="/cart"
              className="position-relative"
              aria-label="Voir le panier"
            >
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge cart-badge-custom">
                  {cartCount}
                </span>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
