'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { AuthDialog } from './AuthDialog';

export function Header() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, username, logout } = useAuthStore();

  const getUserInitials = () => {
    if (username) return username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">Z.com</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {username || user.email}
                  </span>
                </div>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => setAuthDialogOpen(true)}>Login / Register</Button>
            )}
          </div>
        </div>
      </header>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}

