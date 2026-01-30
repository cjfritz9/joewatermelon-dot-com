import APIResponse from "@/lib/classes/APIResponse";

export async function GET() {
  try {
    return APIResponse.success(
      "End point reached, no functionality currently supported",
    );
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
