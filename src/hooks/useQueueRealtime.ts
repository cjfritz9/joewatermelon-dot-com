"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getClientFirestore, timestampToISO } from "@/lib/firebase-client";

interface UseQueueRealtimeOptions {
  collectionName: string;
  initialData: Record<string, unknown>[];
}

function processDocument(doc: {
  id: string;
  data: () => Record<string, unknown>;
}): Record<string, unknown> {
  const data = doc.data();
  const processed: Record<string, unknown> = { id: doc.id };

  for (const [key, value] of Object.entries(data)) {
    processed[key] = timestampToISO(value) ?? value;
  }

  return processed;
}

function sortPlayers(
  players: Record<string, unknown>[],
): Record<string, unknown>[] {
  return [...players].sort((a, b) => {
    const orderA = (a.order as number) ?? Number.MAX_SAFE_INTEGER;
    const orderB = (b.order as number) ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;

    const createdA = a.createdAt as string;
    const createdB = b.createdAt as string;
    return new Date(createdA).getTime() - new Date(createdB).getTime();
  });
}

export function useQueueRealtime({
  collectionName,
  initialData,
}: UseQueueRealtimeOptions) {
  const [players, setPlayers] =
    useState<Record<string, unknown>[]>(initialData);
  const [isRealtime, setIsRealtime] = useState(false);

  useEffect(() => {
    const db = getClientFirestore();

    if (!db) {
      // Firebase not configured, stay with initial data (no realtime)
      return;
    }

    const q = query(collection(db, collectionName));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(processDocument);
        setPlayers(sortPlayers(docs));
        setIsRealtime(true);
      },
      (error) => {
        console.error("Firestore realtime error:", error);
        // On error, keep current data
      },
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { players, isRealtime };
}
