import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBQe_vlGYWQnStrkZMnDBv0iG9WimulkJI",
    authDomain: "zcom-43859.firebaseapp.com",
    projectId: "zcom-43859",
    storageBucket: "zcom-43859.firebasestorage.app",
    messagingSenderId: "969894419537",
    appId: "1:969894419537:web:751bb0c972aba447b3ec70",
    measurementId: "G-KL99HGX4B0"
  };

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

