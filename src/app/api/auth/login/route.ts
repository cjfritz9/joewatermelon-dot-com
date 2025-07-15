import firestore from "@/lib/db/firestore";
import { getSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const usersRef = firestore.collection("users");
    const querySnap = await usersRef.where("email", "==", email).limit(1).get();

    if (querySnap.empty) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const userDoc = querySnap.docs[0];
    const userData = userDoc.data();

    const isValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const session = await getSession();
    session.userId = userDoc.id;
    session.email = userData.email;
    await session.save();

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.name ?? null,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
