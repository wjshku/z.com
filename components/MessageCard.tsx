'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Message } from '@/types/message';
import { useAuthStore } from '@/store/authStore';
import { useMessageStore } from '@/store/messageStore';
import { EditMessageDialog } from './EditMessageDialog';
import { formatDistanceToNow } from 'date-fns';

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const { user } = useAuthStore();
  const { deleteMessage } = useMessageStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.uid === message.authorId;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setDeleting(true);
    try {
      await deleteMessage(message.id);
    } catch (error) {
      // Error is handled in the store
    } finally {
      setDeleting(false);
    }
  };

  const getAuthorInitial = () => {
    return message.authorName[0]?.toUpperCase() || 'A';
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const getTruncatedContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card 
        className="hover:shadow-xl transition-all duration-300 overflow-hidden break-inside-avoid mb-6 cursor-pointer h-[280px] flex flex-col"
        onClick={() => setViewDialogOpen(true)}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-xl mb-3 line-clamp-2">{message.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">
                {getAuthorInitial()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{message.authorName}</p>
              <p className="text-xs">{formatDate(message.createdAt)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden">
          <p className="text-foreground text-sm leading-relaxed line-clamp-5">
            {getTruncatedContent(message.content)}
          </p>
        </CardContent>
      </Card>

      {/* View Full Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{message.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 pt-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getAuthorInitial()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{message.authorName}</p>
                <p className="text-xs">{formatDate(message.createdAt)}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2 pt-4 border-t mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDialogOpen(false);
                  setEditDialogOpen(true);
                }}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                  setViewDialogOpen(false);
                }}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EditMessageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        message={message}
      />
    </>
  );
}

