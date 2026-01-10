import { Timestamp } from "@google-cloud/firestore";

export type UserRoles = 'user' | 'admin' | 'moderator';

export interface DBRegistrant {
  email: string;
  password: string;
}

export interface DBUser {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  email: string;
  roles: UserRoles[];
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