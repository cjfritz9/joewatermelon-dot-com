import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";
import { Timestamp } from "@google-cloud/firestore";

export async function GET() {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const doc = await firestore
      .collection("settings")
      .doc("content-filter-custom")
      .get();

    const terms = doc.exists ? (doc.data()?.terms as string[]) ?? [] : [];

    return APIResponse.success("Custom terms retrieved", { terms });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function POST(req: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { term } = body;

    if (!term || typeof term !== "string" || term.trim().length === 0) {
      return APIResponse.error("Invalid term");
    }

    const normalizedTerm = term.trim().toLowerCase();

    const docRef = firestore.collection("settings").doc("content-filter-custom");
    const doc = await docRef.get();

    const currentTerms = doc.exists
      ? (doc.data()?.terms as string[]) ?? []
      : [];

    if (currentTerms.includes(normalizedTerm)) {
      return APIResponse.error("Term already exists");
    }

    const newTerms = [...currentTerms, normalizedTerm];

    await docRef.set({
      terms: newTerms,
      updatedAt: Timestamp.now(),
    });

    return APIResponse.success("Term added", { terms: newTerms });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { term } = body;

    if (!term || typeof term !== "string") {
      return APIResponse.error("Invalid term");
    }

    const normalizedTerm = term.trim().toLowerCase();

    const docRef = firestore.collection("settings").doc("content-filter-custom");
    const doc = await docRef.get();

    if (!doc.exists) {
      return APIResponse.error("Term not found");
    }

    const currentTerms = (doc.data()?.terms as string[]) ?? [];
    const newTerms = currentTerms.filter((t) => t !== normalizedTerm);

    if (newTerms.length === currentTerms.length) {
      return APIResponse.error("Term not found");
    }

    await docRef.set({
      terms: newTerms,
      updatedAt: Timestamp.now(),
    });

    return APIResponse.success("Term removed", { terms: newTerms });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
