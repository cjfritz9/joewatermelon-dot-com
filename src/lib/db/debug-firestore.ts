import { Firestore } from "@google-cloud/firestore";

async function debugFirestore() {
  const projectId =
    process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;

  console.log("📄 Firestore Debug Start");
  console.log(`🔷 Detected Project ID: ${projectId || "NOT SET"}`);

  try {
    const firestore = new Firestore();

    console.log("✅ Firestore client initialized.");

    const dummyDocRef = firestore.collection("debug").doc("test-doc");

    await dummyDocRef.set({
      timestamp: new Date().toISOString(),
      message: "Cloud Run Firestore debug test",
    });
    console.log("✅ Successfully wrote dummy document.");

    const docSnap = await dummyDocRef.get();
    if (!docSnap.exists) {
      console.error("🚨 Dummy document not found after write.");
    } else {
      console.log("✅ Successfully read dummy document:", docSnap.data());
    }

    await dummyDocRef.delete();
    console.log("🧹 Cleaned up dummy document.");

    console.log("🎉 Firestore test completed successfully.");
  } catch (err) {
    console.error("🔥 Firestore error occurred:");

    if (err instanceof Error) {
      console.error(`Message: ${err.message}`);
      console.error(err.stack);

      const grpcErr = err as Partial<Error> & {
        code?: unknown;
        details?: unknown;
        metadata?: unknown;
      };

      if (grpcErr.code !== undefined) {
        console.error(`Error code: ${grpcErr.code}`);
      }

      if (grpcErr.details !== undefined) {
        console.error(`Details: ${grpcErr.details}`);
      }

      if (grpcErr.metadata !== undefined) {
        console.error(`Metadata: ${JSON.stringify(grpcErr.metadata)}`);
      }
    } else {
      console.error("Unknown error:", err);
    }
  }
}

debugFirestore();
