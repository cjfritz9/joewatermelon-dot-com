import { APITobQueueEntrant } from "@/@types/api";
import { DBTobQueueEntrant } from "@/@types/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";

export type EventStatus = "active" | "inactive";

export interface EventSettings {
  status: EventStatus;
  nextRunTime: Date | null;
}

export const getTobSpeedQueue = async (): Promise<APITobQueueEntrant[]> => {
  if (!isFirestoreAvailable) return [];

  try {
    const queueSnapshot = await firestore.collection("tob-queue").get();

    if (queueSnapshot.empty) {
      return [];
    }

    const docs = queueSnapshot.docs.map((doc) => {
      const data = doc.data() as DBTobQueueEntrant;

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        notifiedAt: data.notifiedAt?.toDate().toISOString() || null,
      };
    }) as APITobQueueEntrant[];

    docs.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return docs;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getTobSpeedSettings = async (): Promise<EventSettings> => {
  if (!isFirestoreAvailable) return { status: "inactive", nextRunTime: null };

  try {
    const doc = await firestore
      .collection("settings")
      .doc("tob-speed-settings")
      .get();

    if (!doc.exists) {
      return { status: "inactive", nextRunTime: null };
    }

    const data = doc.data();
    return {
      status: data?.status || "inactive",
      nextRunTime: data?.nextRunTime?.toDate() || null,
    };
  } catch (err) {
    console.error(err);
    return { status: "inactive", nextRunTime: null };
  }
};
