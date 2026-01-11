import { getSession } from "@/lib/session";
import {
  exchangeCodeForToken,
  fetchTwitchUser,
  findUserByEmail,
  findUserByTwitchId,
} from "@/lib/twitch";
import firestore from "@/lib/db/firestore";
import { Timestamp } from "@google-cloud/firestore";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle user denial or error
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=missing_params", req.url)
      );
    }

    const session = await getSession();

    // Validate state for CSRF protection
    if (state !== session.oauthState) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_state", req.url)
      );
    }

    const action = session.oauthAction || "login";

    // Clear OAuth state from session
    delete session.oauthState;
    delete session.oauthAction;

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    const twitchUser = await fetchTwitchUser(tokenResponse.access_token);

    // Check if Twitch account is already linked to a user
    const existingTwitchUser = await findUserByTwitchId(twitchUser.id);

    if (action === "link") {
      // Linking flow - user must be logged in
      if (!session.userId) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Check if Twitch is already linked to another account
      if (existingTwitchUser && existingTwitchUser.id !== session.userId) {
        return NextResponse.redirect(
          new URL("/account?error=twitch_already_linked", req.url)
        );
      }

      // Link Twitch to current user
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
        new URL("/account?success=twitch_linked", req.url)
      );
    }

    // Login flow
    if (existingTwitchUser) {
      // Returning Twitch user - update username if changed and login
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

      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if email already exists as an email/password user
    const existingEmailUser = await findUserByEmail(twitchUser.email);
    if (existingEmailUser && !existingEmailUser.twitchId) {
      // Email conflict - redirect to conflict page
      return NextResponse.redirect(
        new URL(
          `/auth/twitch-conflict?email=${encodeURIComponent(twitchUser.email)}`,
          req.url
        )
      );
    }

    // New user - create account
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

    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    console.error("Twitch OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_failed", req.url)
    );
  }
};
