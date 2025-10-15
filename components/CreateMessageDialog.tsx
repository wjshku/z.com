'use client';

import { useState } from 'react';
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
import { useAuthStore } from '@/store/authStore';
import { useMessageStore } from '@/store/messageStore';

interface CreateMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMessageDialog({ open, onOpenChange }: CreateMessageDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user, username } = useAuthStore();
  const { createMessage } = useMessageStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createMessage(
        { title, content },
        user.uid,
        username || user.email || 'Anonymous'
      );
      setTitle('');
      setContent('');
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
          <DialogTitle>Create New Message</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter message title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
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
              {loading ? 'Posting...' : 'Post Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

