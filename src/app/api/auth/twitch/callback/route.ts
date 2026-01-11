import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";
import {
  exchangeCodeForToken,
  fetchTwitchUser,
  findUserByEmail,
  findUserByTwitchId,
} from "@/lib/twitch";
import { Timestamp } from "@google-cloud/firestore";
import { NextRequest, NextResponse } from "next/server";

function getBaseUrl(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export const GET = async (req: NextRequest) => {
  try {
    const baseUrl = getBaseUrl(req);
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, baseUrl)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=missing_params", baseUrl)
      );
    }

    const session = await getSession();

    if (state !== session.oauthState) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_state", baseUrl)
      );
    }

    const action = session.oauthAction || "login";
    const returnUrl = session.oauthReturnUrl || "/";

    delete session.oauthState;
    delete session.oauthAction;
    delete session.oauthReturnUrl;

    const tokenResponse = await exchangeCodeForToken(code);
    const twitchUser = await fetchTwitchUser(tokenResponse.access_token);

    const existingTwitchUser = await findUserByTwitchId(twitchUser.id);

    if (action === "link") {
      if (!session.userId) {
        return NextResponse.redirect(new URL("/login", baseUrl));
      }

      if (existingTwitchUser && existingTwitchUser.id !== session.userId) {
        return NextResponse.redirect(
          new URL("/account?error=twitch_already_linked", baseUrl)
        );
      }

      await firestore
        .collection("users")
        .doc(session.userId)
        .update({
          twitchId: twitchUser.id,
          twitchUsername: twitchUser.display_name,
          twitchLinkedAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

      session.twitchUsername = twitchUser.display_name;
      await session.save();

      return NextResponse.redirect(
        new URL("/account?success=twitch_linked", baseUrl)
      );
    }

    if (existingTwitchUser) {
      if (existingTwitchUser.twitchUsername !== twitchUser.display_name) {
        await firestore
          .collection("users")
          .doc(existingTwitchUser.id)
          .update({
            twitchUsername: twitchUser.display_name,
            updatedAt: Timestamp.now(),
          });
      }

      session.userId = existingTwitchUser.id;
      session.email = existingTwitchUser.email;
      session.roles = existingTwitchUser.roles;
      session.twitchUsername = twitchUser.display_name;
      await session.save();

      return NextResponse.redirect(new URL(returnUrl, baseUrl));
    }

    const existingEmailUser = await findUserByEmail(twitchUser.email);
    if (existingEmailUser && !existingEmailUser.twitchId) {
      return NextResponse.redirect(
        new URL(
          `/auth/twitch-conflict?email=${encodeURIComponent(twitchUser.email)}`,
          req.url
        )
      );
    }

    const userId = `twitch_${twitchUser.id}`;
    const userRef = firestore.collection("users").doc(userId);

    await userRef.set({
      email: twitchUser.email,
      passwordHash: "",
      roles: ["user"],
      twitchId: twitchUser.id,
      twitchUsername: twitchUser.display_name,
      twitchLinkedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    session.userId = userId;
    session.email = twitchUser.email;
    session.roles = ["user"];
    session.twitchUsername = twitchUser.display_name;
    await session.save();

    return NextResponse.redirect(new URL(returnUrl, baseUrl));
  } catch (err) {
    console.error("Twitch OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_failed", getBaseUrl(req))
    );
  }
};
