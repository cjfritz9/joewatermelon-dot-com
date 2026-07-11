import { APITobQueueEntrant } from "@/@types/api";
import { DBTobQueueEntrant } from "@/@types/firestore";
import firestore, { isFirestoreAvailable } from "../db/firestore";
import { getEventSettings } from "./event-settings";

export type { EventSettings, EventStatus } from "./event-settings";

const SETTINGS_DOC = "tob-speed-settings";

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

export const getTobSpeedSettings = () => getEventSettings(SETTINGS_DOC);
