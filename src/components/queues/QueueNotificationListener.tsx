"use client";

import { APIToaQueueEntrant } from "@/@types/api";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef } from "react";

interface QueueNotificationListenerProps {
  players: APIToaQueueEntrant[];
}

export default function QueueNotificationListener({
  players,
}: QueueNotificationListenerProps) {
  const lastNotifiedRef = useRef<string | null>(null);
  const notFoundCountRef = useRef(0);

  useEffect(() => {
    const entryId = localStorage.getItem("toaQueueEntryId");
    if (!entryId) return;

    const myEntry = players.find((p) => p.id === entryId);

    if (!myEntry) {
      // Only clear after entry not found 3 times (30 seconds with 10s polling)
      notFoundCountRef.current++;
      if (notFoundCountRef.current >= 3) {
        localStorage.removeItem("toaQueueEntryId");
        notFoundCountRef.current = 0;
      }
      return;
    }

    // Reset counter when entry is found
    notFoundCountRef.current = 0;

    if (myEntry.notifiedAt && myEntry.notifiedAt !== lastNotifiedRef.current) {
      lastNotifiedRef.current = myEntry.notifiedAt;

      // Show in-app toast notification (visible when on the tab)
      notifications.show({
        title: "It's your turn!",
        message: "An admin has marked you as ready. Head to ToA on world 495!",
        color: "yellow",
        autoClose: false,
        withCloseButton: true,
      });

      // Show browser notification (visible when away from the tab)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("It's your turn!", {
          body: "An admin has marked you as ready. Head to ToA on world 495!",
          icon: "/favicon.ico",
        });
      }

      // Clear the notification from the server
      fetch(`/api/queues/toa/8-man-speed/${entryId}/clear-notification`, {
        method: "POST",
      }).catch(() => {
        // Ignore errors - notification was already shown
      });
    }
  }, [players]);

  return null;
}
