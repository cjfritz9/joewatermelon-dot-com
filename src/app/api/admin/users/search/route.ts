import { DBUser } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase().trim();

    if (!query || query.length < 2) {
      return APIResponse.error("Search query must be at least 2 characters");
    }

    const usersRef = firestore.collection("users");
    const allUsers = await usersRef.get();

    const matchingUsers = allUsers.docs
      .map((doc) => {
        const data = doc.data() as DBUser;
        return {
          id: doc.id,
          email: data.email,
          twitchUsername: data.twitchUsername ?? null,
          rsn: data.rsn ?? null,
          roles: data.roles ?? [],
        };
      })
      .filter((user) => {
        const emailMatch = user.email?.toLowerCase().includes(query);
        const twitchMatch = user.twitchUsername?.toLowerCase().includes(query);
        const rsnMatch = user.rsn?.toLowerCase().includes(query);
        return emailMatch || twitchMatch || rsnMatch;
      })
      .slice(0, 20);

    return APIResponse.success("Users found", { users: matchingUsers });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
