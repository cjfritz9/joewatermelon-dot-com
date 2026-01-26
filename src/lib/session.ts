import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  email?: string;
  roles?: string[];
  twitchUsername?: string;
  oauthState?: string;
  oauthAction?: "login" | "link";
  oauthReturnUrl?: string;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "joewatermelon_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const getSession = async () => {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
};

export const isAdmin = async (): Promise<boolean> => {
  const session = await getSession();
  return session.roles?.includes("admin") ?? false;
};

export const isQueueAdmin = async (): Promise<boolean> => {
  const session = await getSession();
  return session.roles?.includes("queue_admin") ?? false;
};

export const canEditQueue = async (): Promise<boolean> => {
  const session = await getSession();
  const roles = session.roles ?? [];
  return roles.includes("admin") || roles.includes("queue_admin");
};
