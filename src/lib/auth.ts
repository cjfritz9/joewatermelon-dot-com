import { notifications } from "@mantine/notifications";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logout(
  refetchUser: () => Promise<void>,
  router: AppRouterInstance,
  onComplete?: () => void
) {
  await fetch("/api/auth/logout", { credentials: "include" });
  await refetchUser();

  if (onComplete) {
    onComplete();
  }

  notifications.show({
    title: "Goodbye!",
    message: "You have successfully logged out.",
    position: "top-right",
    color: "green",
  });

  router.refresh();
}
