import { getSession } from "@/lib/session";
import { generateOAuthUrl, generateState } from "@/lib/twitch";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get("action") as "login" | "link" | null;

    const session = await getSession();

    // For linking, user must be logged in
    if (action === "link" && !session.userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Generate state for CSRF protection
    const state = generateState();
    session.oauthState = state;
    session.oauthAction = action || "login";
    await session.save();

    // Redirect to Twitch OAuth
    const authUrl = generateOAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("Twitch OAuth initiation error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
};
