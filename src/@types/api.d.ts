import { DBToaQueueEntrant, DBUser } from "./firestore";

export interface APIUser extends DBUser {
  id: string;
  createdAt: string;
}

export interface APIToaQueueEntrant extends Omit<DBToaQueueEntrant, 'createdAt' | 'notifiedAt'> {
  id: string;
  createdAt: string;
  notifiedAt?: string;
}