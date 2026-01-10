import { APIToaQueueEntrant } from "@/@types/api";
import { DBToaQueueEntrant } from "@/@types/firestore";
import { Timestamp } from "@google-cloud/firestore";
import firestore from "../db/firestore";
import { getToaQueueEntryIsValid } from "../db/validation";

export const getToa8SpeedQueue = async (): Promise<APIToaQueueEntrant[]> => {
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
        createdAt: data.createdAt?.toDate().toString() || null,
      };
    }) as APIToaQueueEntrant[];

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
