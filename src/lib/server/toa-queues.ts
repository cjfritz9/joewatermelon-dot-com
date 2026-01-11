import { APIToaQueueEntrant } from "@/@types/api";
import { DBToaQueueEntrant } from "@/@types/firestore";
import { Timestamp } from "@google-cloud/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";
import { getToaQueueEntryIsValid } from "../db/validation";

export const getToa8SpeedQueue = async (): Promise<APIToaQueueEntrant[]> => {
  if (!isFirestoreAvailable) return [];

  try {
    const queueSnapshot = await firestore.collection("toa-queue").get();

    if (queueSnapshot.empty) {
      return [];
    }

    const docs = queueSnapshot.docs.map((doc) => {
      const data = doc.data() as DBToaQueueEntrant;

      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        notifiedAt: data.notifiedAt?.toDate().toISOString() || null,
      };
    }) as APIToaQueueEntrant[];

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

export type EventStatus = "active" | "inactive";

export interface EventSettings {
  status: EventStatus;
  nextRunTime: Date | null;
}

export const getToa8SpeedSettings = async (): Promise<EventSettings> => {
  if (!isFirestoreAvailable) return { status: "inactive", nextRunTime: null };

  try {
    const doc = await firestore
      .collection("settings")
      .doc("toa-8man-speed-settings")
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

export const addToToa8SpeedQueue = async (entrantData: DBToaQueueEntrant) => {
  try {
    const isValid = getToaQueueEntryIsValid(entrantData);

    if (!isValid) {
      return null;
    }

    const docRef = await firestore.collection("toa-queue").add({
      ...entrantData,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (err) {
    console.error(err);
    return null;
  }
};
