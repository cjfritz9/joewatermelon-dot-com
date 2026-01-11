import APIResponse from "@/lib/classes/APIResponse";
import { isAdmin } from "@/lib/session";
import { getFeaturedVideoSettings, setFeaturedVideoId } from "@/lib/youtube";

export async function GET() {
  try {
    const settings = await getFeaturedVideoSettings();
    return APIResponse.success("Featured video settings", settings);
  } catch (error) {
    console.error(error);
    return APIResponse.error("Internal Server Error", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { videoId } = body;

    if (videoId !== null && typeof videoId !== "string") {
      return APIResponse.error("Invalid video ID");
    }

    const success = await setFeaturedVideoId(videoId || null);

    if (success) {
      return APIResponse.success("Featured video updated", { videoId });
    }

    return APIResponse.error("Failed to update featured video", 500);
  } catch (error) {
    console.error(error);
    return APIResponse.error("Internal Server Error", 500);
  }
}
