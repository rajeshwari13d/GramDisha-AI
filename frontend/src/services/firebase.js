// GramDisha AI — Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBw5bF6LGgsa5xBoh62XN_763mfMOSnbyw",
  authDomain: "gramdishaai.firebaseapp.com",
  projectId: "gramdishaai",
  storageBucket: "gramdishaai.firebasestorage.app",
  messagingSenderId: "104692718543",
  appId: "1:104692718543:web:312f23ec6fb7c32bd250ba",
  measurementId: "G-1LTL9B6MEK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (safely handles SSR or unsupported environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
