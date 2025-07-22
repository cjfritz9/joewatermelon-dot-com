import { DBToaQueueEntrant, DBUser } from "./firestore";

export interface APIUser extends DBUser {
  id: string;
  createdAt: string;
}

export interface APIToaQueueEntrant extends DBToaQueueEntrant {
  id: string;
  createdAt: string;
}