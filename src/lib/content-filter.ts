import firestore from "@/lib/db/firestore";
import { Timestamp } from "@google-cloud/firestore";

const PROFANITY_LIST_URL =
  "https://raw.githubusercontent.com/dsojevic/profanity-list/master/en.json";

const HATE_SPEECH_TAGS = ["racial", "lgbtq"];
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30;

interface HateSpeechEntry {
  id: string;
  match: string;
  tags: string[];
  severity: number;
  exceptions?: string[];
}

let cachedTerms: HateSpeechEntry[] | null = null;
let cachedCustomTerms: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function refreshFromSource(): Promise<HateSpeechEntry[]> {
  try {
    const response = await fetch(PROFANITY_LIST_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch from source");
    }

    const allTerms = (await response.json()) as HateSpeechEntry[];

    const hateSpeechTerms = allTerms.filter(
      (entry) =>
        entry.tags && entry.tags.some((tag) => HATE_SPEECH_TAGS.includes(tag))
    );

    const docRef = firestore.collection("settings").doc("content-filter");

    await docRef.set({
      terms: hateSpeechTerms,
      updatedAt: Timestamp.now(),
      termCount: hateSpeechTerms.length,
    });

    console.log(`Content filter refreshed: ${hateSpeechTerms.length} terms`);

    return hateSpeechTerms;
  } catch (error) {
    console.error("Failed to refresh content filter from source:", error);
    throw error;
  }
}

async function getHateSpeechTerms(): Promise<HateSpeechEntry[]> {
  const now = Date.now();

  if (cachedTerms && now - cacheTimestamp < CACHE_TTL) {
    return cachedTerms;
  }

  try {
    const doc = await firestore
      .collection("settings")
      .doc("content-filter")
      .get();

    if (!doc.exists) {
      cachedTerms = await refreshFromSource();
      cacheTimestamp = Date.now();
      return cachedTerms;
    }

    const data = doc.data();
    const updatedAt = data?.updatedAt as Timestamp | undefined;
    const isStale =
      !updatedAt || Date.now() - updatedAt.toMillis() > ONE_MONTH_MS;

    if (isStale) {
      try {
        cachedTerms = await refreshFromSource();
        cacheTimestamp = Date.now();
        return cachedTerms;
      } catch {
        cachedTerms = (data?.terms as HateSpeechEntry[]) ?? [];
        cacheTimestamp = Date.now();
        return cachedTerms;
      }
    }

    cachedTerms = (data?.terms as HateSpeechEntry[]) ?? [];
    cacheTimestamp = now;

    return cachedTerms;
  } catch (error) {
    console.error("Failed to fetch hate speech terms:", error);
    return cachedTerms ?? [];
  }
}

async function getCustomTerms(): Promise<string[]> {
  const now = Date.now();

  if (cachedCustomTerms && now - cacheTimestamp < CACHE_TTL) {
    return cachedCustomTerms;
  }

  try {
    const doc = await firestore
      .collection("settings")
      .doc("content-filter-custom")
      .get();

    cachedCustomTerms = doc.exists
      ? (doc.data()?.terms as string[]) ?? []
      : [];

    return cachedCustomTerms;
  } catch (error) {
    console.error("Failed to fetch custom terms:", error);
    return cachedCustomTerms ?? [];
  }
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_\-.]/g, " ")
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    .replace(/\*/g, "")
    .trim();
}

function wildcardToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(escaped, "i");
}

function matchesException(text: string, exceptions: string[]): boolean {
  return exceptions.some((exception) => {
    const regex = wildcardToRegex(exception);
    return regex.test(text);
  });
}

export async function containsBlockedContent(text: string): Promise<boolean> {
  if (!text) return false;

  const normalized = normalizeText(text);
  const lowerText = text.toLowerCase();

  // Check custom terms first (simple string matching)
  const customTerms = await getCustomTerms();
  for (const term of customTerms) {
    if (normalized.includes(term) || lowerText.includes(term)) {
      return true;
    }
  }

  // Check external hate speech list
  const terms = await getHateSpeechTerms();

  for (const term of terms) {
    const patterns = term.match.split("|");

    for (const pattern of patterns) {
      const regex = wildcardToRegex(pattern.trim());

      if (regex.test(normalized) || regex.test(lowerText)) {
        if (term.exceptions && matchesException(normalized, term.exceptions)) {
          continue;
        }
        return true;
      }
    }
  }

  return false;
}

export async function validatePublicFields(fields: {
  twitchUsername?: string;
  rsn?: string;
}): Promise<string | null> {
  if (
    fields.twitchUsername &&
    (await containsBlockedContent(fields.twitchUsername))
  ) {
    return "Username contains inappropriate content";
  }

  if (fields.rsn && (await containsBlockedContent(fields.rsn))) {
    return "RSN contains inappropriate content";
  }

  return null;
}
