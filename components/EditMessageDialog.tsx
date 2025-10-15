'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMessageStore } from '@/store/messageStore';
import { Message } from '@/types/message';

interface EditMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message | null;
}

export function EditMessageDialog({ open, onOpenChange, message }: EditMessageDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { updateMessage } = useMessageStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setTitle(message.title);
      setContent(message.content);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setLoading(true);
    try {
      await updateMessage(message.id, { title, content });
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the store
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>
            Update your message content
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              placeholder="Enter message title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              placeholder="Write your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

