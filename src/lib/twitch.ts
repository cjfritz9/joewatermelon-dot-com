import firestore from "./db/firestore";
import { DBUser } from "@/@types/firestore";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID!;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI!;

export interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  email: string;
}

export function generateOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: TWITCH_REDIRECT_URI,
    response_type: "code",
    scope: "user:read:email",
    state,
  });

  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string
): Promise<TwitchTokenResponse> {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    client_secret: TWITCH_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: TWITCH_REDIRECT_URI,
  });

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

export async function fetchTwitchUser(
  accessToken: string
): Promise<TwitchUser> {
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": TWITCH_CLIENT_ID,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch Twitch user: ${error}`);
  }

  const data = await response.json();
  return data.data[0];
}

export async function findUserByTwitchId(
  twitchId: string
): Promise<(DBUser & { id: string }) | null> {
  const snapshot = await firestore
    .collection("users")
    .where("twitchId", "==", twitchId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as DBUser) };
}

export async function findUserByEmail(
  email: string
): Promise<(DBUser & { id: string }) | null> {
  const normalizedId = email.replace(/\./g, "_").replace(/@/g, "_");
  const doc = await firestore.collection("users").doc(normalizedId).get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...(doc.data() as DBUser) };
}

export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
