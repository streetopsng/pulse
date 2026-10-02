import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  getDoc as rawGetDoc,
  getDocs as rawGetDocs,
  setDoc as rawSetDoc,
  updateDoc as rawUpdateDoc,
  deleteDoc as rawDeleteDoc,
  runTransaction as rawRunTransaction,
  onSnapshot as rawOnSnapshot,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
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
    // Surveys carry optional fields (e.g. questions without options) as undefined; without this every save is rejected.
    try {
      db = initializeFirestore(app, { ignoreUndefinedProperties: true });
    } catch {
      db = getFirestore(app);
    }
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

// The anonymous uid only satisfies the Firestore rules (request.auth != null); it is not the participant identity.
// Never rejects, so the app keeps working under open rules if the Anonymous provider isn't enabled yet.
export const authReady = auth
  ? auth.authStateReady()
      .then(() => auth.currentUser || signInAnonymously(auth))
      .then(() => undefined)
      .catch((err) => console.warn('Firebase anonymous sign-in failed, continuing without auth:', err))
  : Promise.resolve();

export const getDoc = (...args) => authReady.then(() => rawGetDoc(...args));
export const getDocs = (...args) => authReady.then(() => rawGetDocs(...args));
export const setDoc = (...args) => authReady.then(() => rawSetDoc(...args));
export const updateDoc = (...args) => authReady.then(() => rawUpdateDoc(...args));
export const deleteDoc = (...args) => authReady.then(() => rawDeleteDoc(...args));
export const runTransaction = (...args) => authReady.then(() => rawRunTransaction(...args));

export function onSnapshot(...args) {
  let unsubscribe = null;
  let cancelled = false;
  authReady.then(() => {
    if (!cancelled) unsubscribe = rawOnSnapshot(...args);
  });
  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

export { app, db, auth, analytics };
export default firebaseConfig;
