import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

// Generate a random username
function generateUsername(): string {
  const adjectives = ['Swift', 'Bright', 'Cool', 'Happy', 'Lucky', 'Smart', 'Bold', 'Calm', 'Epic', 'Wild'];
  const nouns = ['Panda', 'Tiger', 'Eagle', 'Wolf', 'Fox', 'Bear', 'Lion', 'Hawk', 'Owl', 'Deer'];
  const randomNum = Math.floor(Math.random() * 1000);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${randomNum}`;
}

interface AuthState {
  user: User | null;
  username: string | null;
  loading: boolean;
  initialized: boolean;
  register: (email: string, password: string, username?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
  getUsername: (userId: string) => Promise<string>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  username: null,
  loading: false,
  initialized: false,

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const username = await get().getUsername(user.uid);
        set({ user, username, initialized: true });
      } else {
        set({ user: null, username: null, initialized: true });
      }
    });
  },

  getUsername: async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().username || generateUsername();
      }
      return generateUsername();
    } catch (error) {
      console.error('Error fetching username:', error);
      return generateUsername();
    }
  },

  register: async (email: string, password: string, username?: string) => {
    set({ loading: true });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const finalUsername = username || generateUsername();
      
      // Save username to Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        username: finalUsername,
        email: result.user.email,
        createdAt: new Date(),
      });

      // Update display name
      await updateProfile(result.user, { displayName: finalUsername });
      
      set({ username: finalUsername });
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const username = await get().getUsername(result.user.uid);
      set({ username });
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      let finalUsername: string;
      
      if (!userDoc.exists()) {
        // New user - create username
        finalUsername = result.user.displayName || generateUsername();
        await setDoc(doc(db, 'users', result.user.uid), {
          username: finalUsername,
          email: result.user.email,
          createdAt: new Date(),
        });
      } else {
        finalUsername = userDoc.data().username;
      }
      
      set({ username: finalUsername });
      toast.success('Logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in with Google');
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ username: null });
      toast.success('Logged out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log out');
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

