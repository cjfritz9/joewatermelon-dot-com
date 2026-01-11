import { getSession } from "@/lib/session";
import { generateOAuthUrl, generateState } from "@/lib/twitch";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get("action") as "login" | "link" | null;
    const returnUrl = searchParams.get("returnUrl") || "/";

    const session = await getSession();

    if (action === "link" && !session.userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const state = generateState();
    session.oauthState = state;
    session.oauthAction = action || "login";
    session.oauthReturnUrl = returnUrl;
    await session.save();

    const authUrl = generateOAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("Twitch OAuth initiation error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
};
