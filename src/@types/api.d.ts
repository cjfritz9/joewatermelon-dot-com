import { DBToaQueueEntrant, DBTobQueueEntrant, DBUser } from "./firestore";

export interface APIUser extends DBUser {
  id: string;
  createdAt: string;
}

export interface APIToaQueueEntrant
  extends Omit<DBToaQueueEntrant, "createdAt" | "notifiedAt" | "partyJoinedAt"> {
  id: string;
  createdAt: string;
  notifiedAt?: string;
  partyJoinedAt?: string;
}

export interface APITobQueueEntrant
  extends Omit<DBTobQueueEntrant, "createdAt" | "notifiedAt" | "partyJoinedAt"> {
  id: string;
  createdAt: string;
  notifiedAt?: string;
  partyJoinedAt?: string;
}
