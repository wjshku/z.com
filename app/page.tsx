'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MessageList } from '@/components/MessageList';
import { CreateMessageDialog } from '@/components/CreateMessageDialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Community Messages</h2>
            <p className="text-muted-foreground mt-1">
              Share your thoughts with the community
            </p>
          </div>
          {user && (
            <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
              Create Message
            </Button>
          )}
        </div>
        <MessageList />
      </main>
      <CreateMessageDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
