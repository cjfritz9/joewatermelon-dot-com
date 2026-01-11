import firestore, { isFirestoreAvailable } from "./db/firestore";
import { DBUser } from "@/@types/firestore";

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || "";
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || "";
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI || "";

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
  if (!isFirestoreAvailable) return null;

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
  if (!isFirestoreAvailable) return null;

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

// App access token cache
let appAccessToken: string | null = null;
let appTokenExpiry: number = 0;

async function getAppAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (appAccessToken && Date.now() < appTokenExpiry - 300000) {
    return appAccessToken;
  }

  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    client_secret: TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Failed to get app access token");
  }

  const data = await response.json();
  const token: string = data.access_token;
  appAccessToken = token;
  appTokenExpiry = Date.now() + data.expires_in * 1000;

  return token;
}

export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
}

export interface LiveStatus {
  isLive: boolean;
  stream: TwitchStream | null;
}

export async function checkIfLive(username: string): Promise<LiveStatus> {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    return { isLive: false, stream: null };
  }

  try {
    const token = await getAppAccessToken();

    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": TWITCH_CLIENT_ID,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error("Failed to check live status:", await response.text());
      return { isLive: false, stream: null };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return { isLive: true, stream: data.data[0] };
    }

    return { isLive: false, stream: null };
  } catch (error) {
    console.error("Error checking live status:", error);
    return { isLive: false, stream: null };
  }
}

// Cache user ID
let cachedUserId: string | null = null;

async function getUserId(username: string): Promise<string | null> {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) return null;
  if (cachedUserId) return cachedUserId;

  try {
    const token = await getAppAccessToken();

    const response = await fetch(
      `https://api.twitch.tv/helix/users?login=${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": TWITCH_CLIENT_ID,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      cachedUserId = data.data[0].id;
      return cachedUserId;
    }

    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}

export interface TwitchVideo {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  duration: string;
  view_count: number;
  type: string;
}

export async function getLatestVod(username: string): Promise<TwitchVideo | null> {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    return null;
  }

  try {
    const userId = await getUserId(username);
    if (!userId) return null;

    const token = await getAppAccessToken();

    const response = await fetch(
      `https://api.twitch.tv/helix/videos?user_id=${userId}&first=1&type=archive`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": TWITCH_CLIENT_ID,
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("Failed to get latest VOD:", await response.text());
      return null;
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting latest VOD:", error);
    return null;
  }
}
