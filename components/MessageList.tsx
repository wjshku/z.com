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
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

