import { FieldValue, Timestamp } from "@google-cloud/firestore";
import firestore from "../db/firestore";

interface CreatePartyInput {
  collectionName: string;
  settingsDoc: string;
  memberIds: string[];
  world: string;
  partyNumber: number;
}

export class PartyError extends Error {}

export const createParty = async ({
  collectionName,
  settingsDoc,
  memberIds,
  world,
  partyNumber,
}: CreatePartyInput): Promise<void> => {
  if (memberIds.length === 0) {
    throw new PartyError("No members selected");
  }

  const collection = firestore.collection(collectionName);

  const existingParty = await collection
    .where("inParty", "==", true)
    .limit(1)
    .get();

  if (!existingParty.empty) {
    throw new PartyError("A group is already in progress");
  }

  const memberDocs = await Promise.all(
    memberIds.map((id) => collection.doc(id).get()),
  );

  if (memberDocs.some((doc) => !doc.exists)) {
    throw new PartyError("One or more selected players are no longer in queue");
  }

  const partyName = `melon${partyNumber}`;
  const batch = firestore.batch();

  for (const doc of memberDocs) {
    batch.update(doc.ref, {
      inParty: true,
      partyName,
      partyWorld: world,
      partyNumber,
      partyJoinedAt: Timestamp.now(),
    });
  }

  await batch.commit();

  const settingsRef = firestore.collection("settings").doc(settingsDoc);
  const settings = await settingsRef.get();
  const runTime = settings.data()?.nextRunTime as Timestamp | undefined;

  await settingsRef.set(
    {
      partyCounter: partyNumber,
      partyCounterRun: runTime ? runTime.toMillis() : null,
      updatedAt: Timestamp.now(),
    },
    { merge: true },
  );
};

export const returnPartyMembers = async (
  collectionName: string,
  ids: string[],
): Promise<void> => {
  if (ids.length === 0) {
    throw new PartyError("No members provided");
  }

  const collection = firestore.collection(collectionName);
  const batch = firestore.batch();

  for (const id of ids) {
    batch.update(collection.doc(id), {
      inParty: false,
      partyName: FieldValue.delete(),
      partyWorld: FieldValue.delete(),
      partyNumber: FieldValue.delete(),
      partyJoinedAt: FieldValue.delete(),
    });
  }

  await batch.commit();
};

export const clearParty = async (collectionName: string): Promise<void> => {
  const collection = firestore.collection(collectionName);
  const snapshot = await collection.where("inParty", "==", true).get();

  if (snapshot.empty) return;

  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};
