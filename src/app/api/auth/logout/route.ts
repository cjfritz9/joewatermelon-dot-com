import APIResponse from "@/lib/classes/APIResponse";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  session.destroy();

  return APIResponse.success("Logged out");
}
