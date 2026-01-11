import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return APIResponse.error("Email and password are required");
    }

    const usersRef = firestore.collection("users");
    const querySnap = await usersRef.where("email", "==", email).limit(1).get();

    if (querySnap.empty) {
      return APIResponse.error("Invalid email or password", 401);
    }

    const userDoc = querySnap.docs[0];
    const userData = userDoc.data() as DBUser;

    // Check if this is a Twitch-only account (no password)
    if (!userData.passwordHash) {
      return APIResponse.error(
        "This account was created with Twitch. Please log in with Twitch.",
        401
      );
    }

    const isValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isValid) {
      return APIResponse.error("Invalid email or password", 401);
    }

    const session = await getSession();
    session.userId = userDoc.id;
    session.email = userData.email;
    session.roles = userData.roles;
    await session.save();

    return APIResponse.success("Login successful", {
      user: {
        id: userDoc.id,
        email: userData.email,
        isAdmin: userData.roles.includes("admin"),
      },
    });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
};
