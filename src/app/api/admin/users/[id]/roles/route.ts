import { DBUser, UserRoles } from "@/@types/firestore";
import APIResponse from "@/lib/classes/APIResponse";
import firestore from "@/lib/db/firestore";
import { isAdmin } from "@/lib/session";

const MANAGEABLE_ROLES: UserRoles[] = ["queue_admin"];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return APIResponse.error("Unauthorized", 401);
    }

    const { id } = await params;

    if (!id) {
      return APIResponse.error("Missing user ID");
    }

    const body = await req.json();
    const { role, action } = body;

    if (!role || !action) {
      return APIResponse.error("Missing role or action");
    }

    if (!MANAGEABLE_ROLES.includes(role)) {
      return APIResponse.error("Cannot manage this role");
    }

    if (action !== "add" && action !== "remove") {
      return APIResponse.error("Invalid action. Use 'add' or 'remove'");
    }

    const userRef = firestore.collection("users").doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return APIResponse.error("User not found", 404);
    }

    const userData = userDoc.data() as DBUser;
    const currentRoles = userData.roles ?? [];

    let newRoles: UserRoles[];

    if (action === "add") {
      if (currentRoles.includes(role)) {
        return APIResponse.error("User already has this role");
      }
      newRoles = [...currentRoles, role];
    } else {
      if (!currentRoles.includes(role)) {
        return APIResponse.error("User does not have this role");
      }
      newRoles = currentRoles.filter((r) => r !== role);
    }

    await userRef.update({ roles: newRoles });

    return APIResponse.success(`Role ${action === "add" ? "added" : "removed"}`, {
      userId: id,
      roles: newRoles,
    });
  } catch (err) {
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
