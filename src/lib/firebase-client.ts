import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === 'undefined') return undefined;

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase client config not set. Realtime updates disabled.');
    return undefined;
  }

  if (!app && getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else if (!app) {
    app = getApps()[0];
  }

  return app;
}

export function getClientFirestore(): Firestore | undefined {
  if (typeof window === 'undefined') return undefined;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;

  if (!db) {
    db = getFirestore(firebaseApp, 'joewatermelon-backend');
  }

  return db;
}

export function timestampToISO(value: unknown): string | null {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  return null;
}
