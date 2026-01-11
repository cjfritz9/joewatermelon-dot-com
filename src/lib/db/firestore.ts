import { Firestore } from '@google-cloud/firestore'

let _firestore: Firestore | null = null;

function getFirestore(): Firestore {
  if (_firestore) return _firestore;

  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;

  if (!projectId) {
    throw new Error(`Firestore not configured. GCP_PROJECT_ID: ${process.env.GCP_PROJECT_ID}, GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  }

  _firestore = new Firestore({
    projectId,
    databaseId: 'joewatermelon-backend'
  });

  return _firestore;
}

// Proxy that lazily initializes Firestore on first access
const firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    const instance = getFirestore();
    const value = (instance as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

export const isFirestoreAvailable = true;

export default firestore;
