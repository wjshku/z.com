'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMessageStore } from '@/store/messageStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const subscribeToMessages = useMessageStore((state) => state.subscribe);

  useEffect(() => {
    // Initialize auth state listener
    initializeAuth();

    // Subscribe to messages
    const unsubscribe = subscribeToMessages();

    return () => {
      unsubscribe();
    };
  }, [initializeAuth, subscribeToMessages]);

  return <>{children}</>;
}

