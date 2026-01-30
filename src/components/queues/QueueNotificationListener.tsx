"use client";

import { notifications } from "@mantine/notifications";
import { useEffect, useRef } from "react";

interface QueueNotificationListenerProps {
  players: Record<string, unknown>[];
  storageKey: string;
  apiBasePath?: string;
}

export default function QueueNotificationListener({
  players,
  storageKey,
  apiBasePath,
}: QueueNotificationListenerProps) {
  const lastNotifiedRef = useRef<string | null>(null);
  const notFoundCountRef = useRef(0);

  useEffect(() => {
    const entryId = localStorage.getItem(storageKey);
    if (!entryId) return;

    const myEntry = players.find((p) => p.id === entryId);

    if (!myEntry) {
      notFoundCountRef.current++;
      if (notFoundCountRef.current >= 3) {
        localStorage.removeItem(storageKey);
        notFoundCountRef.current = 0;
      }
      return;
    }

    notFoundCountRef.current = 0;

    const notifiedAt = myEntry.notifiedAt as string | undefined;

    if (notifiedAt && notifiedAt !== lastNotifiedRef.current) {
      lastNotifiedRef.current = notifiedAt;

      notifications.show({
        title: "It's your turn!",
        message:
          "An admin has marked you as ready. Check Discord for world info!",
        color: "yellow",
        autoClose: false,
        withCloseButton: true,
      });

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("It's your turn!", {
          body: "An admin has marked you as ready. Check Discord for world info!",
          icon: "/favicon.ico",
        });
      }

      if (apiBasePath) {
        fetch(`${apiBasePath}/${entryId}/clear-notification`, {
          method: "POST",
        }).catch(() => {
          // Ignore errors - notification was already shown
        });
      }
    }
  }, [players, storageKey, apiBasePath]);

  return null;
}
