import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message, MessageInput } from '@/types/message';
import { toast } from 'sonner';

interface MessageState {
  messages: Message[];
  loading: boolean;
  subscribed: boolean;
  subscribe: () => () => void;
  createMessage: (input: MessageInput, authorId: string, authorName: string) => Promise<void>;
  updateMessage: (id: string, input: MessageInput) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  loading: false,
  subscribed: false,

  subscribe: () => {
    if (get().subscribed) {
      return () => {};
    }

    set({ subscribed: true, loading: true });

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messages.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            authorId: data.authorId,
            authorName: data.authorName,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });
        set({ messages, loading: false });
      },
      (error) => {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        set({ loading: false });
      }
    );

    return () => {
      unsubscribe();
      set({ subscribed: false });
    };
  },

  createMessage: async (input: MessageInput, authorId: string, authorName: string) => {
    try {
      const now = Timestamp.now();
      await addDoc(collection(db, 'messages'), {
        title: input.title,
        content: input.content,
        authorId,
        authorName,
        createdAt: now,
        updatedAt: now,
      });
      toast.success('Message posted successfully!');
    } catch (error: any) {
      console.error('Error creating message:', error);
      toast.error(error.message || 'Failed to post message');
      throw error;
    }
  },

  updateMessage: async (id: string, input: MessageInput) => {
    try {
      const messageRef = doc(db, 'messages', id);
      await updateDoc(messageRef, {
        title: input.title,
        content: input.content,
        updatedAt: Timestamp.now(),
      });
      toast.success('Message updated successfully!');
    } catch (error: any) {
      console.error('Error updating message:', error);
      toast.error(error.message || 'Failed to update message');
      throw error;
    }
  },

  deleteMessage: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Message deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error.message || 'Failed to delete message');
      throw error;
    }
  },
}));

