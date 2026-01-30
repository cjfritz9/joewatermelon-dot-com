import { Timestamp } from "@google-cloud/firestore";

export type UserRoles = "user" | "admin" | "moderator" | "queue_admin";

export interface DBRegistrant {
  email: string;
  password: string;
  rsn?: string;
  twitchUsername?: string;
}

export interface DBUser {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  email: string;
  roles: UserRoles[];
  passwordHash: string;
  rsn?: string;
  twitchId?: string;
  twitchUsername?: string;
  twitchLinkedAt?: Timestamp;
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
  eye: boolean;
  notes: string;
  notificationsEnabled: boolean;
  notifiedAt?: Timestamp;
  order?: number;
  userId?: string;
  editToken?: string;
}

export interface DBTobQueueEntrant {
  createdAt: Timestamp;
  twitchUsername: string;
  rsn: string;
  kc: number;
  ready: boolean;
  scythe: boolean;
  needs4Man: boolean;
  needs5Man: boolean;
  notes: string;
  notificationsEnabled: boolean;
  notifiedAt?: Timestamp;
  order?: number;
  userId?: string;
  editToken?: string;
}
