import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";

const PROFANITY_LIST_URL =
  "https://raw.githubusercontent.com/dsojevic/profanity-list/master/en.json";

const HATE_SPEECH_TAGS = ["racial", "lgbtq"];

interface ProfanityEntry {
  id: string;
  match: string;
  tags: string[];
  severity: number;
  exceptions?: string[];
}

export async function POST() {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const response = await fetch(PROFANITY_LIST_URL);

    if (!response.ok) {
      return APIResponse.error("Failed to fetch profanity list from source");
    }

    const allTerms = (await response.json()) as ProfanityEntry[];

    const hateSpeechTerms = allTerms.filter(
      (entry) =>
        entry.tags && entry.tags.some((tag) => HATE_SPEECH_TAGS.includes(tag))
    );

    const docRef = firestore.collection("settings").doc("content-filter");

    await docRef.set({
      terms: hateSpeechTerms,
      updatedAt: new Date(),
      termCount: hateSpeechTerms.length,
    });

    return APIResponse.success("Content filter updated", {
      termCount: hateSpeechTerms.length,
    });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
