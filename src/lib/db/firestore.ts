import { Firestore } from '@google-cloud/firestore'

// Check if we're in a build environment without credentials
const isBuildTime = !process.env.GCP_PROJECT_ID && process.env.NODE_ENV === 'production';

const firestore = isBuildTime
  ? (null as unknown as Firestore)
  : new Firestore({
      projectId: process.env.GCP_PROJECT_ID,
      databaseId: 'joewatermelon-backend'
    });

export const isFirestoreAvailable = !isBuildTime;

export default firestore;
