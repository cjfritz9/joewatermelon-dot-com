import { Firestore } from '@google-cloud/firestore'

const firestore = new Firestore({
  projectId: process.env.GCP_PROJECT_ID,
  databaseId: 'joewatermelon-backend'
});

export default firestore;
