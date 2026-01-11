import { Firestore } from '@google-cloud/firestore'

// GCP_PROJECT_ID is set in dev, GOOGLE_CLOUD_PROJECT is auto-set by Cloud Run
const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;

// Check if we're in a build environment without credentials
const isBuildTime = !projectId && process.env.NODE_ENV === 'production';

const firestore = isBuildTime
  ? (null as unknown as Firestore)
  : new Firestore({
      projectId,
      databaseId: 'joewatermelon-backend'
    });

export const isFirestoreAvailable = !isBuildTime;

export default firestore;
