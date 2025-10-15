'use client';

import { useMessageStore } from '@/store/messageStore';
import { MessageCard } from './MessageCard';

export function MessageList() {
  const { messages, loading } = useMessageStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No messages yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Be the first to post a message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

