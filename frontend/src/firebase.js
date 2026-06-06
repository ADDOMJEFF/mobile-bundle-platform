import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZxmiFKU6fx9BUrO8TtA9KaJ-X5IHT2r0",
  authDomain: "mobile-bundle-platform.firebaseapp.com",
  projectId: "mobile-bundle-platform",
  storageBucket: "mobile-bundle-platform.firebasestorage.app",
  messagingSenderId: "735533147479",
  appId: "1:735533147479:web:d9a082d8c9ab7a53720a12"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);