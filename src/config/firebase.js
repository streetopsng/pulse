import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyAzZtcUwUkLPbFs2hNpgD0dettFhsUEc_U',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'pulse-3a945.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://pulse-3a945-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'pulse-3a945',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'pulse-3a945.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '1088478819981',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:1088478819981:web:cea824bfe56880880494c4',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    'G-D23K6VR22V',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your_api_key_here'
);

let app = null;
let db = null;
let auth = null;
let analytics = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }).catch((err) => {
        console.warn('Analytics initialization skipped:', err);
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export { app, db, auth, analytics };
export default firebaseConfig;
