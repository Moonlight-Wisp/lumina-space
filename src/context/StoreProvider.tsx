'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const state = useUserStore.getState();
    if (!state.isLoggedIn) {
      useUserStore.getState().logout();
    }
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
