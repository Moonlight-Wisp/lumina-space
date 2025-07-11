'use client';

import dynamic from 'next/dynamic';
import { useUserStore } from '@/store/useUserStore';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

export default function ChatWidgetClientWrapper() {
  const { uid, isLoggedIn } = useUserStore();
  if (!isLoggedIn || !uid) return null;

  return <ChatWidget userId={uid} />;
}
