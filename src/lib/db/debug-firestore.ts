import { Firestore } from "@google-cloud/firestore";

async function debugFirestore() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;

  console.log("📄 Firestore Debug Start");
  console.log(`🔷 Detected Project ID: ${projectId || "NOT SET"}`);

  try {
    const firestore = new Firestore();

    console.log("✅ Firestore client initialized.");

    const dummyDocRef = firestore.collection("debug").doc("test-doc");

    // Test write
    await dummyDocRef.set({
      timestamp: new Date().toISOString(),
      message: "Cloud Run Firestore debug test",
    });
    console.log("✅ Successfully wrote dummy document.");

    // Test read
    const docSnap = await dummyDocRef.get();
    if (!docSnap.exists) {
      console.error("🚨 Dummy document not found after write.");
    } else {
      console.log("✅ Successfully read dummy document:", docSnap.data());
    }

    // Cleanup
    await dummyDocRef.delete();
    console.log("🧹 Cleaned up dummy document.");

    console.log("🎉 Firestore test completed successfully.");

  } catch (err: any) {
    console.error("🔥 Firestore error occurred:");
    console.error(err);

    if (err.code) {
      console.error(`Error code: ${err.code}`);
    }
    if (err.details) {
      console.error(`Details: ${err.details}`);
    }
    if (err.metadata) {
      console.error(`Metadata: ${JSON.stringify(err.metadata)}`);
    }
  }
}

debugFirestore();
