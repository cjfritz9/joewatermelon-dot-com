import { Timestamp } from "@google-cloud/firestore";

export interface DBUser {
  createdAt: Timestamp;
  email: string;
  passwordHash: string;
}

export interface DBToaQueueEntrant {
  createdAt: Timestamp;
  twitchUsername: string;
  rsn: string;
  expertKC: number;
  ready: boolean;
  redKeris: boolean;
  bgs: boolean;
  zcb: boolean;
  notes: string;
}